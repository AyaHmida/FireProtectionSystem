namespace IoTFire.Backend.Api.Models.Entities
{
    public class SystemAudits
    {
        public int Id { get; set; }
        public bool NewState { get; set; }
        public string ActionBy { get; set; } = "SYSTEM";
        public string Reason { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
