using IoTFire.Backend.Api.Models.DTOs.Auth;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _authService.RegisterAsync(request);
                return StatusCode(201, response);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during registration.");
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(dto);

            return result.Success
                ? Ok(result)
                : Unauthorized(result);
        }

        [HttpPut("change-password")]
        [Authorize]  
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token invalide." });

            var (success, error) = await _authService.ChangePasswordAsync(userId, dto);

            if (!success)
                return BadRequest(new { message = error });

            return Ok(new { message = "Mot de passe modifié avec succès." });
        }
       
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var (success, message) = await _authService.ForgotPasswordAsync(dto.Email);
                // Toujours 200 pour ne pas révéler si l'email existe
                return Ok(new { message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ForgotPassword] Erreur inattendue.");
                return StatusCode(500, new { message = "Une erreur est survenue. Veuillez réessayer." });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var (success, message) = await _authService.ResetPasswordAsync(dto);

                return success
                    ? Ok(new { message })
                    : BadRequest(new { message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ResetPassword] Erreur inattendue.");
                return StatusCode(500, new { message = "Une erreur est survenue. Veuillez réessayer." });
            }
        }
    }
}
