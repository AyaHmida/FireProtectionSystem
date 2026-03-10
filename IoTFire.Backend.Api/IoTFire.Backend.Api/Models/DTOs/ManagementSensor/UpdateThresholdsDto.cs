using IoTFire.Backend.Api.Models.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class UpdateThresholdsDto
    {
        [Required]
        public float Threshold { get; set; }

        public int? ZoneId { get; set; }
        public SensorType? Type { get; set; }
    }
}
