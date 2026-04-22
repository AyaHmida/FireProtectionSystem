namespace IoTFire.Backend.Api.Models.DTOs
{
    public class AlertDto
    {
        public int Id { get; set; }
        public int? ZoneId { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public int SensorId { get; set; }
        public string Type { get; set; } = string.Empty; // TEMPERATURE / GAS / SMOKE
        public float Value { get; set; }
        public string Level { get; set; } = string.Empty; // NORMAL/PRE_ALERT/ALERT/CRITICAL
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
