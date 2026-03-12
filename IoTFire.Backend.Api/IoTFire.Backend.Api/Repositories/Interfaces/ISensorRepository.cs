using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface ISensorRepository
    {
        Task<IEnumerable<Sensor>> GetAllAsync(SensorStatus? status = null);
        Task<Sensor?> GetByIdAsync(int id);
        Task<IEnumerable<Sensor>> GetByZoneIdAsync(int zoneId);
        Task<bool> MacExistsAsync(string macAddress);

        Task<int> UpdateThresholdsByZoneAsync(int zoneId, float threshold);
        Task<int> UpdateThresholdsByTypeAsync(SensorType type, float threshold);
    }


}
