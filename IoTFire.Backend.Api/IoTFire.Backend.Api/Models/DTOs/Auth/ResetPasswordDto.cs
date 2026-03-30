using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.Auth
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
