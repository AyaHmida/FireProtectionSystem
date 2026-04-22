using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IAlertRepository
    {
        Task<Alert> CreateAsync(Alert alert);
        Task<Alert?> GetByIdAsync(int id);
        Task<Alert> UpdateAsync(Alert alert);
        Task<IEnumerable<Alert>> GetAllAsync(int? sensorId = null);
        Task<IEnumerable<Alert>> GetRecentBySensorAsync(int sensorId, DateTime since);
    }
}
