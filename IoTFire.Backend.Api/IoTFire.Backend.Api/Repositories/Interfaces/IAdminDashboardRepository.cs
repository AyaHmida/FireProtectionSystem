using IoTFire.Backend.Api.Models.DTOs.Dashboard;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IAdminDashboardRepository
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();

        Task<List<AlertChartDto>> GetAlertChartAsync();

        Task<List<MeasurementChartDto>> GetMeasurementChartAsync();

        Task<List<ZoneAlertSummaryDto>> GetZoneAlertsSummaryAsync();
    }
}
