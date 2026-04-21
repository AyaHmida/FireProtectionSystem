using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface ISensorConfigurationRepository
    {
        Task<SensorConfiguration?> GetBySensorIdAsync(int sensorId);
        Task<SensorConfiguration> CreateOrUpdateAsync(SensorConfiguration config);
    }

}
