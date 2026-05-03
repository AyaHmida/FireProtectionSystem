namespace IoTFire.Backend.Api.Models.DTOs.System
{
    public class LogAuditDto
    {
        public bool NewState { get; set; }
        public string? ActionBy { get; set; }
        public string? Reason { get; set; }
    }
}
