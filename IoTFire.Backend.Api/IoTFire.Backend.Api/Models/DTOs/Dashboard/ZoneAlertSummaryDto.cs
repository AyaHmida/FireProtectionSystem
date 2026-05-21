namespace IoTFire.Backend.Api.Models.DTOs.Dashboard
{
    public class ZoneAlertSummaryDto
    {
        public string ZoneName { get; set; } = string.Empty;

        public int TotalAlerts { get; set; }

        public string LastAlertMessage { get; set; } = string.Empty;

        public DateTime LastAlertDate { get; set; }

        public string DominantType { get; set; } = string.Empty;

        public string DominantSeverity { get; set; } = string.Empty;
    }
}
