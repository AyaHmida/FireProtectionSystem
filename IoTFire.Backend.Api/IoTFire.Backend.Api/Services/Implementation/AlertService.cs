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
        private readonly MqttService _mqtt;
        private readonly ILogger<AlertService> _logger;

        private readonly IAlertRepository _alertRepository;
        private readonly IoTFire.Backend.Api.Repositories.Interfaces.ISensorRepository _sensorRepository;
        private readonly IoTFire.Backend.Api.Repositories.Interfaces.IDeviceRepository _deviceRepository;

        public AlertService(ISensorConfigurationService configService, MqttService mqtt, ILogger<AlertService> logger, IAlertRepository alertRepository,
            IoTFire.Backend.Api.Repositories.Interfaces.ISensorRepository sensorRepository,
            IoTFire.Backend.Api.Repositories.Interfaces.IDeviceRepository deviceRepository)
        {
            _configService = configService;
            _mqtt = mqtt;
            _logger = logger;
            _alertRepository = alertRepository;
            _sensorRepository = sensorRepository;
            _deviceRepository = deviceRepository;
        }

        public async Task CheckAndTriggerAlertAsync(MeasurementDto measurement)
        {
            _logger.LogInformation("Checking measurement for sensor {SensorId} value {Value}", measurement.SensorId, measurement.Value);

            var config = await _configService.GetBySensorIdAsync(measurement.SensorId);
            if (config == null)
            {
                _logger.LogDebug("No configuration found for sensor {SensorId}", measurement.SensorId);
                return;
            }

            float pre = config.PreAlertThreshold;
            float alert = config.AlertThreshold;
            float critical = config.CriticalThreshold;

            string level = "NORMAL";
            if (measurement.Value >= pre) level = "PRE_ALERT";
            if (measurement.Value >= alert) level = "ALERT";
            if (measurement.Value >= critical) level = "CRITICAL";

            string type = measurement.TypeMeasure.ToUpper();
            string message = "";

            if (type == SensorType.GAS.ToString())
            {
                // gas sensor -> immediate alert semantics
                if (measurement.Value >= alert)
                {
                    level = measurement.Value >= critical ? "CRITICAL" : "ALERT";
                    message = measurement.Value >= critical ? "Fuite de gaz détectée" : "Fuite de gaz détectée";
                }
                else
                {
                    level = "NORMAL";
                }
            }
            else if (type == SensorType.TEMPERATURE.ToString())
            {
                if (level == "PRE_ALERT") message = "Température en hausse";
                if (level == "ALERT") message = "Température élevée";
                if (level == "CRITICAL") message = "Température critique";
            }
            else
            {
                // default messages
                if (level == "PRE_ALERT") message = "Valeur au-dessus du seuil pré-alerte";
                if (level == "ALERT") message = "Valeur au-dessus du seuil d'alerte";
                if (level == "CRITICAL") message = "Valeur critique";
            }

            // Fill DeviceId by looking up sensor -> device relationship
            string deviceIdString = string.Empty;
            try
            {
                var sensor = await _sensorRepository.GetByIdAsync(measurement.SensorId);
                if (sensor != null && sensor.DeviceId.HasValue)
                {
                    var device = await _deviceRepository.GetByIdAsync(sensor.DeviceId.Value);
                    if (device != null)
                        deviceIdString = device.DeviceId;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to lookup device for sensor {SensorId}", measurement.SensorId);
            }

            var alertDto = new AlertDto
            {
                DeviceId = deviceIdString,
                SensorId = measurement.SensorId,
                Type = type == "GAS" ? "GAS" : (type == "TEMPERATURE" ? "TEMPERATURE" : type),
                Value = measurement.Value,
                Level = level,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            // log
            _logger.LogInformation("Alert level {Level} for sensor {SensorId}: {Message}", level, measurement.SensorId, message);

            // persist alert in DB
            var alertEntity = new Models.Entities.Alert
            {
                DeviceId = alertDto.DeviceId,
                SensorId = alertDto.SensorId,
                Type = alertDto.Type,
                Value = alertDto.Value,
                Level = alertDto.Level,
                Message = alertDto.Message,
                CreatedAt = alertDto.Timestamp
            };

            try
            {
                await _alertRepository.CreateAsync(alertEntity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to persist alert for sensor {SensorId}", measurement.SensorId);
            }

            // publish to MQTT
            await _mqtt.PublishAsync("device/alert", alertDto);
            _logger.LogInformation("Published alert for sensor {SensorId}", measurement.SensorId);
        }
    }
}
