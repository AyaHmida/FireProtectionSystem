using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.DTOs.Dashboard;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly AppDbContext _context;

        public AdminDashboardRepository(AppDbContext context)
        {
            _context = context;
        }
        // Dashboard Cards Statistics
        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var today = DateTime.UtcNow.Date;

            return new DashboardStatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),

                TotalCriticalAlerts = await _context.Alerts
                    .CountAsync(a => a.Type == "CRITICAL"),

                TotalActiveSensors = await _context.Sensors
                    .CountAsync(s => s.Status == SensorStatus.ONLINE),

                TotalDevices = await _context.Devices.CountAsync(),

                TotalZones = await _context.Zones.CountAsync(),

                TodayMeasurements = await _context.Measurements
                    .CountAsync(m => m.CreatedAt.Date == today)
            };
        }

        // Alert Chart
        public async Task<List<AlertChartDto>> GetAlertChartAsync()
        {
            var alertChart = await _context.Alerts
                .GroupBy(a => a.Type)
                .Select(g => new AlertChartDto
                {
                    Type = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return alertChart;
        }

        // Measurements Chart (Last 7 Days)
        public async Task<List<MeasurementChartDto>> GetMeasurementChartAsync()
        {
            var last7Days = DateTime.UtcNow.Date.AddDays(-6);

            var measurements = await _context.Measurements
                .Where(m => m.CreatedAt.Date >= last7Days)
                .GroupBy(m => m.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var result = measurements
                .Select(m => new MeasurementChartDto
                {
                    Day = m.Date.ToString("ddd"),
                    Count = m.Count
                })
                .OrderBy(x => x.Day)
                .ToList();

            return result;
        }
        // Recent Alerts Table
        public async Task<List<ZoneAlertSummaryDto>> GetZoneAlertsSummaryAsync()
        {
            var result = await _context.Alerts
                .Include(a => a.Zone)
                .GroupBy(a => new
                {
                    a.ZoneId,
                    ZoneName = a.Zone.Name
                })
                .Select(g => new ZoneAlertSummaryDto
                {
                    ZoneName = g.Key.ZoneName,

                    TotalAlerts = g.Count(),

                    LastAlertMessage = g
                        .OrderByDescending(a => a.CreatedAt)
                        .Select(a => a.Message)
                        .FirstOrDefault(),

                    LastAlertDate = g
                        .Max(a => a.CreatedAt),

                    DominantType = g
                        .GroupBy(a => a.Type)
                        .OrderByDescending(x => x.Count())
                        .Select(x => x.Key)
                        .FirstOrDefault(),

                    DominantSeverity = g
                        .GroupBy(a => a.Level)
                        .OrderByDescending(x => x.Count())
                        .Select(x => x.Key)
                        .FirstOrDefault()
                })
                .OrderByDescending(x => x.TotalAlerts)
                .ToListAsync();

            return result;
        }
    }

}
