using IoTFire.Backend.Api.Models.DTOs.Auth;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IAuthService
    {
       
        Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<(bool Success, string? Error)> ChangePasswordAsync(
            int userId, ChangePasswordDto dto);
    }
}
