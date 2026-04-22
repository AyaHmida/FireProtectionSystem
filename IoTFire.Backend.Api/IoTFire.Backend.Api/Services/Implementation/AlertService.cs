using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Services.Interfaces;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class AlertService : IAlertService
    {
        private readonly ISensorConfigurationService _configService;
        private readonly IAlertRepository _alertRepository;
        private readonly ISensorRepository _sensorRepository;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IAlertNotifier _notifier;
        private readonly MqttService _mqttService;          // ✅ AJOUT
        private readonly ILogger<AlertService> _logger;

        public AlertService(
            ISensorConfigurationService configService,
            IAlertRepository alertRepository,
            ISensorRepository sensorRepository,
            IDeviceRepository deviceRepository,
            IAlertNotifier notifier,
            MqttService mqttService,                        // ✅ AJOUT
            ILogger<AlertService> logger)
        {
            _configService = configService;
            _alertRepository = alertRepository;
            _sensorRepository = sensorRepository;
            _deviceRepository = deviceRepository;
            _notifier = notifier;
            _mqttService = mqttService;                  // ✅ AJOUT
            _logger = logger;
        }

        public async Task CheckAndTriggerAlertAsync(MeasurementDto measurement)
        {
            _logger.LogInformation("Checking measurement for sensor {SensorId} value {Value}",
                measurement.SensorId, measurement.Value);

            var config = await _configService.GetBySensorIdAsync(measurement.SensorId);
            var type = (measurement.TypeMeasure ?? string.Empty).ToUpper();

            float pre, alert, critical;

            if (config == null)
            {
                _logger.LogWarning("No config for {SensorId}, using fallback thresholds", measurement.SensorId);
                (pre, alert, critical) = type switch
                {
                    "TEMPERATURE" => (40f, 50f, 60f),
                    "GAS" => (0f, 1500f, 2500f),
                    "SMOKE" => (0f, 0f, 1f),   // toute valeur > 0 = CRITICAL
                    _ => (0f, 0f, 0f)
                };
            }
            else
            {
                pre = config.PreAlertThreshold;
                alert = config.AlertThreshold;
                critical = config.CriticalThreshold;
            }

            string level = "NORMAL";
            string message = string.Empty;

            switch (type)
            {
                case "SMOKE":
                    // ✅ Détection binaire : toute valeur > 0 = CRITICAL immédiat
                    if (measurement.Value > 0)
                    {
                        level = "CRITICAL";
                        message = "Fumée détectée";
                    }
                    break;

                case "GAS":
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Fuite de gaz critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Fuite de gaz détectée"; }
                    break;

                case "TEMPERATURE":
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Température critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Température élevée"; }
                    else if (measurement.Value >= pre) { level = "PRE_ALERT"; message = "Température en hausse"; }
                    break;

                default:
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Valeur critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Valeur au-dessus du seuil d'alerte"; }
                    else if (measurement.Value >= pre) { level = "PRE_ALERT"; message = "Valeur au-dessus du seuil pré-alerte"; }
                    break;
            }

            if (level == "NORMAL")
            {
                _logger.LogDebug("Sensor {SensorId} value {Value} is NORMAL", measurement.SensorId, measurement.Value);
                return;
            }

            // Récupérer DeviceId + ZoneId
            string deviceIdString = string.Empty;
            int? zoneId = null;
            try
            {
                var sensor = await _sensorRepository.GetByIdAsync(measurement.SensorId);
                if (sensor != null)
                {
                    zoneId = sensor.ZoneId;
                    if (sensor.DeviceId.HasValue)
                    {
                        var device = await _deviceRepository.GetByIdAsync(sensor.DeviceId.Value);
                        if (device != null) deviceIdString = device.DeviceId;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to lookup device for sensor {SensorId}", measurement.SensorId);
            }

            await CreateAlertAsync(new AlertDto
            {
                DeviceId = deviceIdString,
                SensorId = measurement.SensorId,
                ZoneId = zoneId,
                Type = type,
                Value = measurement.Value,
                Level = level,
                Message = message,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task CreateAlertAsync(AlertDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            try
            {
                // ✅ Anti-spam sauf pour SMOKE (chaque détection compte)
                bool duplicate = false;
                if (dto.Type?.ToUpper() != "SMOKE")
                {
                    var cutoff = DateTime.UtcNow.AddSeconds(-60);
                    var recentAlerts = await _alertRepository.GetRecentBySensorAsync(dto.SensorId, cutoff);
                    duplicate = recentAlerts.Any(a => a.Level == dto.Level);
                }

                if (duplicate)
                {
                    _logger.LogInformation("Duplicate suppressed for sensor {SensorId} level {Level}",
                        dto.SensorId, dto.Level);
                    return;
                }

                // 💾 Persister en BDD
                var created = await _alertRepository.CreateAsync(new Models.Entities.Alert
                {
                    DeviceId = dto.DeviceId,
                    SensorId = dto.SensorId,
                    Type = dto.Type,
                    Value = dto.Value,
                    Level = dto.Level,
                    Message = dto.Message,
                    CreatedAt = dto.CreatedAt
                });

                dto.Id = created.Id;
                dto.CreatedAt = created.CreatedAt;
                dto.IsRead = false;

                // Enrichir ZoneId si manquant
                if (!dto.ZoneId.HasValue)
                {
                    var sensor = await _sensorRepository.GetByIdAsync(dto.SensorId);
                    if (sensor != null) dto.ZoneId = sensor.ZoneId;
                }

                // ✅ Publier sur device/alert — format attendu par l'ESP32
                try
                {
                    await _mqttService.PublishAsync("device/alert", new
                    {
                        level = dto.Level,    // "CRITICAL" / "ALERT" / "PRE_ALERT"
                        message = dto.Message   // "Fumée détectée"
                    });
                    _logger.LogInformation("📡 MQTT published to device/alert: {Level}", dto.Level);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to publish MQTT alert for sensor {SensorId}", dto.SensorId);
                }

                // ✅ Notifier lef frontend (SignalR / WebSocket)
                await _notifier.NotifyAsync(dto);

                _logger.LogInformation("✅ Alert {Level} created for sensor {SensorId}", dto.Level, dto.SensorId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create alert for sensor {SensorId}", dto.SensorId);
            }
        }
    }
}