using IoTFire.Backend.Api.Models.DTOs.ControllerCommand;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class MqttService : IMqttService
    {
        private readonly IMqttClient _client;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MqttService> _logger;
        private readonly IHubContext<SignalR.RealtimeHub> _hubContext;

        public MqttService(
            IServiceScopeFactory scopeFactory,
            ILogger<MqttService> logger,
            IHubContext<SignalR.RealtimeHub> hubContext)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _hubContext = hubContext;

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

            // ✅ Subscribe multi-topics
            await _client.SubscribeAsync("home/sensors");
            await _client.SubscribeAsync("device/control/+");

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

        // ===========================
        // 🔥 ROUTER MQTT
        // ===========================
        private async Task HandleReceivedMessage(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload ?? []);

            using var scope = _scopeFactory.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                if (topic.StartsWith("home/sensors"))
                {
                    await HandleSensorMessage(payload, services);
                }
                else if (topic.StartsWith("device/control/"))
                {
                    await HandleControlMessage(topic, payload, services);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing MQTT");
            }
        }

        // ===========================
        // 📡 SENSOR HANDLER
        // ===========================
        private async Task HandleSensorMessage(string payload, IServiceProvider services)
        {
            try
            {
                var systemStatService = services.GetRequiredService<ISystemStatService>();
                var systemState = await systemStatService.GetStatusAsync();

                if (!systemState.IsActive)
                {
                    _logger.LogWarning("⛔ System is inactive — sensor data ignored");
                    return; // ← bloque tout le reste
                }
                _logger.LogInformation("📩 MQTT SENSOR: {Payload}", payload);

                using var doc = JsonDocument.Parse(payload);
                var root = doc.RootElement;

                // DEVICE
                var deviceObj = root.GetProperty("device");
                var deviceId = deviceObj.GetProperty("id").GetString();

                var mac = NormalizeMac(deviceId);

                var deviceRepo = services.GetRequiredService<IDeviceRepository>();
                var device = await deviceRepo.GetByDeviceIdStringAsync(mac!);

                if (device == null || !device.ZoneId.HasValue)
                {
                    _logger.LogWarning("Device not found or no zone");
                    return;
                }

                // SENSOR
                var sensorObj = root.GetProperty("sensor");
                var sensorId = sensorObj.GetProperty("id").GetString();
                var type = sensorObj.GetProperty("type").GetString();

                // DATA
                var dataObj = root.GetProperty("data");
                float value = (float)dataObj.GetProperty("value").GetDouble();

                var sensorRepo = services.GetRequiredService<ISensorRepository>();
                var measurementService = services.GetRequiredService<IMeasurementService>();

                var sensor = await sensorRepo.GetByLabelAsync(sensorId!);

                if (sensor == null)
                {
                    sensor = await sensorRepo.CreateAsync(new Sensor
                    {
                        Label = sensorId!,
                        Type = Enum.TryParse<SensorType>(type, true, out var t) ? t : SensorType.TEMPERATURE,
                        Status = SensorStatus.ONLINE,
                        DeviceId = device.Id,
                        ZoneId = device.ZoneId.Value,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                // 💾 Save measurement
                var measurementDto = await measurementService.SaveMeasurementAsync(new MeasurementDto
                {
                    SensorId = sensor.Id,
                    Value = value,
                    TypeMeasure = type!
                });

                // 🚨 Alert
                var alertService = services.GetRequiredService<IAlertService>();
                await alertService.CheckAndTriggerAlertAsync(measurementDto);

                // 🔥 SIGNALR REALTIME UPDATE
                try
                {
                    var measurementServiceScoped = services.GetRequiredService<IMeasurementService>();

                    var zoneRealtime = await measurementServiceScoped
                        .GetZoneRealtimeAsync(device.ZoneId.Value);

                    await _hubContext.Clients
                        .Group($"zone-{device.ZoneId.Value}")
                        .SendCoreAsync(
                            "ZoneRealtimeUpdated",
                            new object[] { zoneRealtime },
                            System.Threading.CancellationToken.None
                        );
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed realtime update for zone {ZoneId}", device.ZoneId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in HandleSensorMessage");
            }
        }

        //  CONTROL HANDLER
        private async Task HandleControlMessage(string topic, string payload, IServiceProvider services)
        {
            try
            {
                _logger.LogInformation("📩 CONTROL CMD: {Payload}", payload);

                var deviceId = topic.Split('/').Last();

                var command = JsonSerializer.Deserialize<ControlCommandDto>(payload);

                if (command == null)
                {
                    _logger.LogWarning("Invalid control payload");
                    return;
                }

                var controlService = services.GetRequiredService<IDeviceControlService>();

                await controlService.HandleCommandAsync(deviceId, command, command.UserId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling control message");
            }
        }
    }
}