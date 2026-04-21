using IoTFire.Backend.Api.Models.DTOs;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface ISensorConfigurationService
    {
        Task<SensorConfigurationDto?> GetBySensorIdAsync(int sensorId);
        Task<SensorConfigurationDto> SetConfigurationAsync(SensorConfigurationDto dto);
    }

}
