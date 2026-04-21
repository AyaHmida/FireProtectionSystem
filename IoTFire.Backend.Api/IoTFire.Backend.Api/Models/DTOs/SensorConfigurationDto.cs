namespace IoTFire.Backend.Api.Models.DTOs
{
    public class SensorConfigurationDto
    {
        public int SensorId { get; set; }
        public float PreAlertThreshold { get; set; }
        public float AlertThreshold { get; set; }
        public float CriticalThreshold { get; set; }
    }

}
