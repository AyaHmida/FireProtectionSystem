using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IDeviceService
    {
        Task<IEnumerable<DeviceResponseDto>> GetAllAsync(int? userId = null);
        Task<DeviceResponseDto?> GetByIdAsync(int id);
        Task<(DeviceResponseDto? Dto, string? Error)> CreateAsync(CreateDeviceDto dto);
        Task<(DeviceResponseDto? Dto, string? Error)> UpdateAsync(int id, CreateDeviceDto dto);
        Task<(bool Success, string? Error)> DeleteAsync(int id);
        Task<(DeviceResponseDto? Dto, string? Error)> AssignToZoneAsync(int id, AssignDeviceToZoneDto dto);
        Task<(DeviceResponseDto? Dto, string? Error)> UnassignFromZoneAsync(int id);
    }
}
