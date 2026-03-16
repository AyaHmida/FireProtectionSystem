using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IZoneService
    {
        Task<IEnumerable<ZoneResponseDto>> GetAllAsync(int? userId = null);
        Task<(IEnumerable<ZoneResponseDto> Zones, string? Error)> GetMyZonesAsync(int userId);
        Task<ZoneResponseDto?> GetByIdAsync(int id);
        Task<(ZoneResponseDto? Dto, string? Error)> CreateAsync(CreateZoneDto dto);
        Task<(ZoneResponseDto? Dto, string? Error)> UpdateAsync(int id, CreateZoneDto dto);
        Task<(bool Success, string? Error)> DeleteAsync(int id);
        Task<int> GetSensorCountByZoneAsync(int zoneId);
    }
}
