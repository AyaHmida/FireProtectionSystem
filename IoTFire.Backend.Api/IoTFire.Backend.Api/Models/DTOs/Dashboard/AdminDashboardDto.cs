namespace IoTFire.Backend.Api.Models.DTOs.Dashboard
{
    public class AdminDashboardDto
    {
        public DashboardStatsDto Stats { get; set; } = new();

        public List<AlertChartDto> AlertChart { get; set; } = new();

        public List<MeasurementChartDto> MeasurementChart { get; set; } = new();

        public List<ZoneAlertSummaryDto> ZoneAlertsSummary { get; set; } = new();
    }
}
