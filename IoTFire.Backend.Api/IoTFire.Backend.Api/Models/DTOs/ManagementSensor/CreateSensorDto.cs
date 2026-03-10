using System.ComponentModel.DataAnnotations;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class CreateSensorDto
    {
        [Required(ErrorMessage = "L'adresse MAC est obligatoire")]
        [RegularExpression(
            @"^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
            ErrorMessage = "Format MAC invalide. Exemple : AA:BB:CC:DD:EE:FF")]
        public string MacAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le label est obligatoire")]
        [MaxLength(100)]
        public string Label { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le type est obligatoire")]
        public SensorType Type { get; set; }

        [Range(0, 1000, ErrorMessage = "Le seuil doit être entre 0 et 1000")]
        public float ThresholdValue { get; set; }

        [Required(ErrorMessage = "La zone est obligatoire")]
        public int ZoneId { get; set; }
    }
}
