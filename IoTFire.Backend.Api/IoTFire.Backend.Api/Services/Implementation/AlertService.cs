using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Implementation;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class AlertService : IAlertService
    {
        private readonly ISensorConfigurationService _configService;
        private readonly IAlertRepository _alertRepository;
        private readonly ISensorRepository _sensorRepository;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IZoneRepository _zoneRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAlertNotifier _notifier;
        private readonly IMqttService _mqttService; 
        
        private readonly ILogger<AlertService> _logger;
        private readonly IEmailService _emailService;

        public AlertService(
            ISensorConfigurationService configService,
            IAlertRepository alertRepository,
            ISensorRepository sensorRepository,
            IDeviceRepository deviceRepository,
            IAlertNotifier notifier, IUserRepository userRepository,
            IMqttService mqttService, IZoneRepository zoneRepository,                       // ✅ AJOUT
            ILogger<AlertService> logger, IEmailService emailService)
        {
            _configService = configService;
            _alertRepository = alertRepository;
            _sensorRepository = sensorRepository;
            _deviceRepository = deviceRepository;
            _notifier = notifier;
            _mqttService = mqttService;                 
            _logger = logger;
            _emailService = emailService;
            _zoneRepository = zoneRepository;
            _userRepository = userRepository;
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
                        message = "Fumee detectee";
                    }
                    else
                    {
                        level = "NORMAL";
                        message = "Retour à la normale";
                    }
                    break;

                case "GAS":
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Fuite de gaz critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Fuite de gaz detectee"; }
                    else if (measurement.Value >= pre) { level = "PRE_ALERT"; message = "Gaz en hausse"; }
                    else
                    {
                        level = "NORMAL";
                        message = "Retour a la normale";
                    }
                    break;


                case "TEMPERATURE":
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Temperature critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Temperature elevee"; }
                    else if (measurement.Value >= pre) { level = "PRE_ALERT"; message = "Temperature en hausse"; }
                    else
                    {
                        level = "NORMAL";
                        message = "Retour à la normale";
                    }
                    break;

                default:
                    if (measurement.Value >= critical) { level = "CRITICAL"; message = "Valeur critique"; }
                    else if (measurement.Value >= alert) { level = "ALERT"; message = "Valeur au-dessus du seuil d alerte"; }
                    else if (measurement.Value >= pre) { level = "PRE_ALERT"; message = "Valeur au-dessus du seuil pre-alerte"; }
                    else
                    {
                        level = "NORMAL";
                        message = "Retour à la normale";
                    }
                    break;
            }



            if (level == "NORMAL")
            {
                _logger.LogDebug("Sensor {SensorId} value {Value} is NORMAL", measurement.SensorId, measurement.Value);

                // ✅ Publier NORMAL vers l’ESP32
                await _mqttService.PublishAsync("device/alert", new
                {
                    level = "NORMAL",
                    message = "Retour à la normale"
                });

                return; // on ne crée pas d’alerte en DB pour NORMAL
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
                // ✅ Anti-spam sauf SMOKE
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

                // ✅ IMPORTANT : résoudre ZoneId AVANT sauvegarde
                if (!dto.ZoneId.HasValue)
                {
                    try
                    {
                        var sensor = await _sensorRepository.GetByIdAsync(dto.SensorId);
                        if (sensor != null)
                        {
                            dto.ZoneId = sensor.ZoneId;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to resolve ZoneId for sensor {SensorId}", dto.SensorId);
                    }
                }

                // 💾 Sauvegarde UNIQUE (corrigé)
                var created = await _alertRepository.CreateAsync(new Models.Entities.Alert
                {
                    DeviceId = dto.DeviceId,
                    SensorId = dto.SensorId,
                    ZoneId = dto.ZoneId, // ✅ FIX PRINCIPAL
                    Type = dto.Type,
                    Value = dto.Value,
                    Level = dto.Level,
                    Message = dto.Message,
                    CreatedAt = dto.CreatedAt
                });

                // ✅ Mapper résultat
                dto.Id = created.Id;
                dto.CreatedAt = created.CreatedAt;
                dto.IsRead = false;

                // ✅ MQTT
                try
                {
                    await _mqttService.PublishAsync("device/alert", new
                    {
                        level = dto.Level,
                        message = dto.Message
                    });

                    _logger.LogInformation("📡 MQTT published to device/alert: {Level}", dto.Level);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to publish MQTT alert for sensor {SensorId}", dto.SensorId);
                }

                // ✅ SignalR
                await _notifier.NotifyAsync(dto);
                await SendAlertEmailAsync(dto);
                _logger.LogInformation("✅ Alert {Level} created for sensor {SensorId}", dto.Level, dto.SensorId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create alert for sensor {SensorId}", dto.SensorId);
            }
        }

        private async Task SendAlertEmailAsync(AlertDto alert)
        {
            try
            {
                string zoneName = "Zone inconnue";
                int sensorCount = 0;
                string? recipientEmail = null;
                string? recipientName = null;

                if (alert.ZoneId.HasValue)
                {
                    var zone = await _zoneRepository.GetByIdAsync(alert.ZoneId.Value);
                    if (zone != null)
                    {
                        zoneName = zone.Name;
                        sensorCount = await _zoneRepository.GetSensorCountByZoneIdAsync(zone.Id);

                        if (zone.UserId > 0)
                        {
                            var user = await _userRepository.GetByIdAsync(zone.UserId);
                            if (user != null)
                            {
                                recipientEmail = user.Email;
                                recipientName = user.FirstName;
                            }
                        }
                    }
                }

                if (!string.IsNullOrEmpty(recipientEmail))
                {
                    var subject = $"🚨 Alerte {alert.Level} détectée — {zoneName}";
                    var htmlBody = $@"
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;'>
            <h2 style='color:#E74C3C;'>🔥 Système Anti-Incendie — Alerte</h2>
            <p>Bonjour <strong>{recipientName}</strong>,</p>
            <p>Une alerte de niveau <strong>{alert.Level}</strong> a été détectée.</p>
            <p><strong>Zone :</strong> {zoneName}</p>
            <p><strong>Capteurs actifs :</strong> {sensorCount}</p>
            <p><strong>Type :</strong> {alert.Type} | Valeur : {alert.Value}</p>
            <p><strong>Date :</strong> {alert.CreatedAt}</p>
            <p style='color:#888;font-size:12px;'>Veuillez intervenir immédiatement.</p>
        </div>";

                    await _emailService.SendEmailAsync(recipientEmail, subject, htmlBody);
                    _logger.LogInformation("📧 Email envoyé à {Email} pour alerte {Level}", recipientEmail, alert.Level);
                }
                else
                {
                    _logger.LogWarning("⚠️ Aucun destinataire trouvé pour l'alerte {Id}", alert.Id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Échec de l'envoi d'email pour l'alerte {Id}", alert.Id);
            }
        }

    }
}