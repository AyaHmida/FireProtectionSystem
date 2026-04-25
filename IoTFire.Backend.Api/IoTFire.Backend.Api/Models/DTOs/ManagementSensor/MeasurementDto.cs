using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class MeasurementDto
    {
        [Required]
        public int SensorId { get; set; }

        [Required]
        public float Value { get; set; }

        [Required]
        public string TypeMeasure { get; set; } = string.Empty; 
        [Required]
        public string AlertLevel { get; set; } = string.Empty;

    }

}
