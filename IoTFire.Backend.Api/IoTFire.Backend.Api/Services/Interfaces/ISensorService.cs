using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface ISensorService
    {
        Task<IEnumerable<SensorResponseDto>> GetAllAsync(SensorStatus? status = null);
        Task<SensorResponseDto?> GetByIdAsync(int id);
        Task<SensorResponseDto> CreateAsync(CreateSensorDto dto);
        Task<SensorResponseDto?> UpdateAsync(int id, UpdateSensorDto dto);
        Task<bool> DeleteAsync(int id);
        Task<SimulatedValueDto?> SimulateValueAsync(int id);
        Task<int> SetThresholdsByZoneAsync(int zoneId, float threshold);
        Task<int> SetThresholdsByTypeAsync(SensorType type, float threshold);
    }
}
