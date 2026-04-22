using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class AlertRepository : IAlertRepository
    {
        private readonly AppDbContext _context;

        public AlertRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Alert> CreateAsync(Alert alert)
        {
            await _context.Alerts.AddAsync(alert);
            await _context.SaveChangesAsync();
            return alert;
        }

        public async Task<Alert?> GetByIdAsync(int id)
        {
            return await _context.Alerts.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Alert> UpdateAsync(Alert alert)
        {
            _context.Alerts.Update(alert);
            await _context.SaveChangesAsync();
            return alert;
        }

        public async Task<IEnumerable<Alert>> GetAllAsync(int? sensorId = null)
        {
            var query = _context.Alerts.AsQueryable();
            if (sensorId.HasValue) query = query.Where(a => a.SensorId == sensorId.Value);
            return await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
        }

        public async Task<IEnumerable<Alert>> GetRecentBySensorAsync(int sensorId, DateTime since)
        {
            return await _context.Alerts
                .Where(a => a.SensorId == sensorId && a.CreatedAt >= since)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // helper for controller integration
        public void SetModified(Alert alert)
        {
            _context.Alerts.Update(alert);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
