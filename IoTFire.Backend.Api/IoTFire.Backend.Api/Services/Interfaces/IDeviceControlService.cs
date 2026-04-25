using IoTFire.Backend.Api.Models.DTOs.ControllerCommand;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IDeviceControlService
    {
        Task HandleCommandAsync(string deviceId, ControlCommandDto command, string? userId);
    }
}
