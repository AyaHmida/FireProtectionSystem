using IoTFire.Backend.Api.Models.DTOs.Dashboard;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IAdminDashboardRepository _repository;

        public AdminDashboardService(IAdminDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<AdminDashboardDto> GetDashboardDataAsync()
        {
            return new AdminDashboardDto
            {
                Stats = await _repository.GetDashboardStatsAsync(),

                AlertChart = await _repository.GetAlertChartAsync(),

                MeasurementChart = await _repository.GetMeasurementChartAsync(),

                ZoneAlertsSummary = await _repository.GetZoneAlertsSummaryAsync()
            };
        }
    }
}
