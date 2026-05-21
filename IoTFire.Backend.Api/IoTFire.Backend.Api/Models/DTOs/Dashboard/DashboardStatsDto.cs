namespace IoTFire.Backend.Api.Models.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalCriticalAlerts { get; set; }
        public int TotalActiveSensors { get; set; }
        public int TotalDevices { get; set; }
        public int TotalZones { get; set; }
        public int TodayMeasurements { get; set; }
    }
}
