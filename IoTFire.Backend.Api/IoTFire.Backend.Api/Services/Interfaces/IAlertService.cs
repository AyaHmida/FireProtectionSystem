using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IAlertService
    {
        Task CheckAndTriggerAlertAsync(MeasurementDto measurement);
    }
}
