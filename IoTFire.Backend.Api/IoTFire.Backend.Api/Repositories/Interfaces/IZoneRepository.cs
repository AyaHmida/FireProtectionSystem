using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IZoneRepository
    {
        Task<IEnumerable<Zone>> GetAllAsync(int? userId = null);
        Task<Zone?> GetByIdAsync(int id);
        Task<Zone> CreateAsync(Zone zone);
        Task<Zone?> UpdateAsync(Zone zone);
        Task<bool> DeleteAsync(int id);
        Task<int> GetSensorCountByZoneIdAsync(int zoneId);
        Task DisassociateFromZoneAsync(int zoneId);

    }
}
