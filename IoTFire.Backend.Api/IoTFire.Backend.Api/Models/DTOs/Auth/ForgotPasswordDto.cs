using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.Auth
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
