using IoTFire.Backend.Api.Models.DTOs;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IAlertNotifier
    {
        Task NotifyAsync(AlertDto alert);
    }
}
