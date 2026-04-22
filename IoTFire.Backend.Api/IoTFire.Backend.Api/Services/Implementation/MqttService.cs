using System.Text;
using System.Text.Json;
using MQTTnet;
using MQTTnet.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Services.Interfaces;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using System.Linq;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class MqttService
    {
        private readonly IMqttClient _client;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MqttService> _logger;

        public MqttService(IServiceScopeFactory scopeFactory, ILogger<MqttService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;

            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();
            _client.ApplicationMessageReceivedAsync += HandleReceivedMessage;
        }

        public async Task StartAsync()
        {
            var options = new MqttClientOptionsBuilder()
                .WithClientId("backend-api")
                .WithTcpServer("localhost", 1883)
                .Build();

            await _client.ConnectAsync(options);
            await _client.SubscribeAsync("home/sensors");

            _logger.LogInformation("✅ MQTT Connected & Subscribed");
        }

        public async Task StopAsync()
        {
            try
            {
                if (_client.IsConnected)
                {
                    await _client.DisconnectAsync();
                    _logger.LogInformation("MQTT disconnected");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while stopping MQTT");
            }
        }

        public async Task PublishAsync<T>(string topic, T payload)
        {
            var message = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(JsonSerializer.Serialize(payload))
                .Build();

            await _client.PublishAsync(message);
        }

        private static string? NormalizeMac(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return null;
            var hex = Regex.Replace(raw, "[^0-9A-Fa-f]", "");
            if (hex.Length != 12) return null;
            hex = hex.ToUpper();
            return string.Join(":", Enumerable.Range(0, 6).Select(i => hex.Substring(i * 2, 2)));
        }

        private async Task HandleReceivedMessage(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload ?? []);

            if (topic != "home/sensors") return;

            _logger.LogInformation("📩 MQTT RECV: {Payload}", payload);

            using var scope = _scopeFactory.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                using var doc = JsonDocument.Parse(payload);
                var root = doc.RootElement;

                // ✅ DEVICE
                if (!root.TryGetProperty("device", out var deviceObj) ||
                    !deviceObj.TryGetProperty("id", out var deviceIdProp))
                {
                    _logger.LogWarning("device.id missing");
                    return;
                }

                string deviceId = deviceIdProp.GetString()!;
                var mac = NormalizeMac(deviceId);

                if (mac == null)
                {
                    _logger.LogWarning("Invalid MAC");
                    return;
                }

                var deviceRepo = services.GetRequiredService<IDeviceRepository>();
                var device = await deviceRepo.GetByDeviceIdStringAsync(mac);

                if (device == null || !device.ZoneId.HasValue)
                {
                    _logger.LogWarning("Device not found or no zone");
                    return;
                }

                // ✅ SENSOR
                if (!root.TryGetProperty("sensor", out var sensorObj))
                {
                    _logger.LogWarning("sensor missing");
                    return;
                }

                string sensorId = sensorObj.GetProperty("id").GetString()!;
                string type = sensorObj.GetProperty("type").GetString()!;

                // ✅ DATA
                if (!root.TryGetProperty("data", out var dataObj))
                {
                    _logger.LogWarning("data missing");
                    return;
                }

                float value = (float)dataObj.GetProperty("value").GetDouble();

                _logger.LogInformation(" Sensor {Type} = {Value}", type, value);

                var sensorRepo = services.GetRequiredService<ISensorRepository>();
                var measurementService = services.GetRequiredService<IMeasurementService>();

                // 🔍 find sensor
                var sensor = await sensorRepo.GetByLabelAsync(sensorId);

                // 🆕 create sensor if not exists
                if (sensor == null)
                {
                    _logger.LogWarning("Creating sensor: {SensorId}", sensorId);

                    sensor = await sensorRepo.CreateAsync(new Sensor
                    {
                        Label = sensorId,
                        Type = Enum.TryParse<SensorType>(type, true, out var t) ? t : SensorType.TEMPERATURE,
                        Status = SensorStatus.ONLINE,
                        DeviceId = device.Id,
                        ZoneId = device.ZoneId.Value,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });

                    // Also create default sensor configuration so alerting works
                    try
                    {
                        var configRepo = services.GetRequiredService<ISensorConfigurationRepository>();
                        var defaultConfig = new SensorConfiguration
                        {
                            SensorId = sensor.Id,
                            PreAlertThreshold = type.ToUpper() == "TEMPERATURE" ? 40 : 0,
                            AlertThreshold = type.ToUpper() == "TEMPERATURE" ? 50 : (type.ToUpper() == "GAS" ? 1500 : 0),
                            CriticalThreshold = type.ToUpper() == "TEMPERATURE" ? 60 : (type.ToUpper() == "GAS" ? 2500 : 1),
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        await configRepo.CreateOrUpdateAsync(defaultConfig);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to create default sensor configuration for {SensorId}", sensorId);
                    }
                }

                // 💾 Save measurement then let AlertService handle alerting
                var measurementDto = await measurementService.SaveMeasurementAsync(new MeasurementDto
                {
                    SensorId = sensor.Id,
                    Value = value,
                    TypeMeasure = type
                });

                var alertService = services.GetRequiredService<IAlertService>();
                await alertService.CheckAndTriggerAlertAsync(measurementDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing MQTT");
            }
        }
    }
}