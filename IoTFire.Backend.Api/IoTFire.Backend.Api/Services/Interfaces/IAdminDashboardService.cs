using IoTFire.Backend.Api.Models.DTOs.Dashboard;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardDto> GetDashboardDataAsync();
    }
}
