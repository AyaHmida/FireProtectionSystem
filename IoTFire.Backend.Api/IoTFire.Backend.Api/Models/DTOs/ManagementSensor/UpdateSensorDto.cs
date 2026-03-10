using System.ComponentModel.DataAnnotations;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class UpdateSensorDto
    {
        [MaxLength(100)]
        public string? Label { get; set; }

        public SensorStatus? Status { get; set; }

        [Range(0, 1000)]
        public float? ThresholdValue { get; set; }

        public int? ZoneId { get; set; }
    }
}
