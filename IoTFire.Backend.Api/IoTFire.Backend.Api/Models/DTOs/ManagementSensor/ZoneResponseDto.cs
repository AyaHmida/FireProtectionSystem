namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{

    public class ZoneResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int UserId { get; set; }
        public string? OccupantName { get; set; }   // ← AJOUTÉ

        public int SensorCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
