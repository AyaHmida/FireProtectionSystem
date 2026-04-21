namespace IoTFire.Backend.Api.Models.DTOs
{
    public class ZoneRealtimeDto
    {
        public double? Temperature { get; set; }
        public double? Humidity { get; set; }
        public double? Gas { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
