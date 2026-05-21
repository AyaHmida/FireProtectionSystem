namespace IoTFire.Backend.Api.Models.DTOs.Emergency
{
    public class CallSimulationResultDto
    {
        public string PhoneNumber { get; set; }
        public DateTime Timestamp { get; set; }
        public string Status { get; set; } // SUCCESS / FAILED
    }
}
