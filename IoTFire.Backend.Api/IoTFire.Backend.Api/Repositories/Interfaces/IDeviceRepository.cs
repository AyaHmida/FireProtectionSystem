using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IDeviceRepository
    {
        Task<IEnumerable<Device>> GetAllAsync(int? userId = null); 
          Task<Device?> GetByIdAsync(int id);
        Task<Device?> GetByDeviceIdStringAsync(string deviceId); 
        Task<Device> CreateAsync(Device device);
        Task<Device?> UpdateAsync(Device device);
        Task<bool> DeleteAsync(int id);
    }
}
