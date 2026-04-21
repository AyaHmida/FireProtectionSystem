using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface ISensorService
    {
        Task<IEnumerable<SensorResponseDto>> GetAllAsync(SensorStatus? status = null);
        Task<SensorResponseDto?> GetByIdAsync(int id);

        Task<(SensorResponseDto? Dto, string? Error)> RegisterSensorAsync(SensorRegisterDto dto);

    }
}
