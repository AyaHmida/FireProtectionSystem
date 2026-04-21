using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class DeviceRegisterDto
    {

        [Required]
        public string DeviceId { get; set; } = string.Empty;

        public string? MacAddress { get; set; }

        public bool IsOnline { get; set; } = true;

        public DateTime LastCommunication { get; set; } = DateTime.UtcNow;
    }

}
