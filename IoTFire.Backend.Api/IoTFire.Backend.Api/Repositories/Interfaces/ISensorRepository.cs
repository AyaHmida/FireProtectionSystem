using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface ISensorRepository
    {
    
            Task<Sensor?> GetByIdAsync(int id);
        Task<IEnumerable<Sensor>> GetAllAsync(SensorStatus? status);
        Task<IEnumerable<Sensor>> GetByDeviceIdAsync(int deviceId);
            Task<Sensor> CreateAsync(Sensor sensor);
            Task<Sensor?> UpdateAsync(Sensor sensor);
        Task<Sensor?> GetByLabelAsync(string label); 


        Task<bool> DeleteAsync(int id);
        


    }


}
