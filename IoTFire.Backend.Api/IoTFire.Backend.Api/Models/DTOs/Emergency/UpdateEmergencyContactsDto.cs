namespace IoTFire.Backend.Api.Models.DTOs.Emergency
{
    public class UpdateEmergencyContacstDto
    {
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Relationship { get; set; }
    }
}
