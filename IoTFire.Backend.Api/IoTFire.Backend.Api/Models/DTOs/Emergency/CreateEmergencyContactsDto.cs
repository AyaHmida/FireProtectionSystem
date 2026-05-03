namespace IoTFire.Backend.Api.Models.DTOs.Emergency
{
    public class CreateEmergencyContactsDto
    {
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Relationship { get; set; }
    }
}
