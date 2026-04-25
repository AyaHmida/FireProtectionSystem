using IoTFire.Backend.Api.Models.DTOs.ControllerCommand;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class DeviceControlService : IDeviceControlService
    {
        private readonly ILogger<DeviceControlService> _logger;
        private readonly IMqttService _mqttService;
        private readonly IDeviceAuditRepository _auditRepo;

        public DeviceControlService(
            ILogger<DeviceControlService> logger,
            IMqttService mqttService,
            IDeviceAuditRepository auditRepo)
        {
            _logger = logger;
            _mqttService = mqttService;
            _auditRepo = auditRepo;
        }

        public async Task HandleCommandAsync(string deviceId, ControlCommandDto command, string? userId)
        {
            try
            {
                // 🔐 Validation action
                if (!Enum.TryParse<DeviceAction>(command.Action, true, out var action))
                {
                    _logger.LogWarning("Action invalide: {Action}", command.Action);
                    return;
                }

                // 📡 Envoyer vers ESP32
                var topic = $"device/command/{deviceId}";

                var payload = new
                {
                    action = action.ToString()
                };

                await _mqttService.PublishAsync(topic, payload);

                // 🧾 Audit
                await _auditRepo.AddAsync(new DeviceAudit
                {
                    DeviceId = deviceId,
                    Action = action.ToString(),
                    Timestamp = DateTime.UtcNow,
                    UserId = userId
                });

                // 📢 Notification globale (optionnel)
                await _mqttService.PublishAsync("device/alert", new
                {
                    level = "INFO",
                    message = $"User action: {action}",
                    deviceId
                });

                _logger.LogInformation("Commande envoyée: {Action} → {DeviceId}", action, deviceId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur HandleCommandAsync");
            }
        }
    }
}
