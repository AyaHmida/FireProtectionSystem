using IoTFire.Backend.Api.Models.DTOs.System;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface ISystemStatService
    {
        Task<SystemStatDto> GetStatusAsync();
        Task<SystemStatDto> ToggleStateAsync(ToggleSystemStatDtos dto);
    }
}
