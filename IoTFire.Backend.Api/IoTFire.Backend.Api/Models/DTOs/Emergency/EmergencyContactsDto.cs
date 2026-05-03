namespace IoTFire.Backend.Api.Models.DTOs.Emergency
{
    public class EmergencyContactsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Relationship { get; set; }
        public int UserId { get; set; }
    }
}
