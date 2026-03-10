using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IZoneService
    {
        Task<IEnumerable<ZoneResponseDto>> GetAllAsync(int? userId = null);
        Task<ZoneResponseDto?> GetByIdAsync(int id);
        Task<ZoneResponseDto> CreateAsync(CreateZoneDto dto, int userId);
        Task<ZoneResponseDto?> UpdateAsync(int id, CreateZoneDto dto);
        Task<bool> DeleteAsync(int id);
        Task<int> GetSensorCountByZoneAsync(int zoneId);
    }
}
