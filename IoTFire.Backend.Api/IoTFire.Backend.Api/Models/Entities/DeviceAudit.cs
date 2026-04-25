namespace IoTFire.Backend.Api.Models.Entities
{
    public class DeviceAudit
    {
        public int Id { get; set; }

        public string DeviceId { get; set; } = string.Empty;

        public string Action { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; }

        public string Source { get; set; } = "MOBILE";

        // ✅ AJOUT IMPORTANT
        public string? UserId { get; set; }
    }
}
