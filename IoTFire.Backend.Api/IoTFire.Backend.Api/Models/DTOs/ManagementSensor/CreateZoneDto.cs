using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class CreateZoneDto
    {
        [Required(ErrorMessage = "Le nom de la zone est obligatoire")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }
    }
}
