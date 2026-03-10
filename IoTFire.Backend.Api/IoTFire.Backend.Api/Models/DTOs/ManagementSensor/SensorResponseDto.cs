namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    public class SensorResponseDto
    {
        public int Id { get; set; }
        public string MacAddress { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public float ThresholdValue { get; set; }
        public float LastValue { get; set; }
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class SimulatedValueDto
    {
        public int SensorId { get; set; }
        public string SensorLabel { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public float Value { get; set; }
        public string Unit { get; set; } = string.Empty;
        public float Threshold { get; set; }
        public bool IsAlert { get; set; }
        public string Severity { get; set; } = string.Empty; // NORMAL/WARNING/CRITICAL
        public DateTime Timestamp { get; set; }
    }
}
