using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class SensorRegisterDto
    {
        [Required]
        public string Label { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // TEMPERATURE, HUMIDITY, GAS

        [Required]
        public int DeviceId { get; set; }

        [Required]
        public int ZoneId { get; set; }
        public string? MacAddress { get; set; }   // ✅ ajouté

    }

}
