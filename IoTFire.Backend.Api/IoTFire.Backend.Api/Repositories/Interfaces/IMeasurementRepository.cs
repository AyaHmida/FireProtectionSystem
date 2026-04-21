using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IMeasurementRepository
    {
        Task<Measurement> CreateAsync(Measurement measurement);
        Task<Measurement?> GetBySensorIdAsync(int sensorId);
        Task<Measurement> UpdateAsync(Measurement measurement);
        Task<IEnumerable<Measurement>> GetHistoryAsync(int sensorId, DateTime start, DateTime end);
    }

}
