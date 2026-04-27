using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class SensorConfigurationRepository : ISensorConfigurationRepository
    {
        private readonly AppDbContext _context;

        public SensorConfigurationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SensorConfiguration?> GetBySensorIdAsync(int sensorId) =>
            await _context.SensorConfigurations.FirstOrDefaultAsync(c => c.SensorId == sensorId);

        public async Task<SensorConfiguration> CreateOrUpdateAsync(SensorConfiguration config)
        {
            var existing = await GetBySensorIdAsync(config.SensorId);
            if (existing == null)
            {
                _context.SensorConfigurations.Add(config);
            }
            else
            {
                existing.PreAlertThreshold = config.PreAlertThreshold;
                existing.AlertThreshold = config.AlertThreshold;
                existing.CriticalThreshold = config.CriticalThreshold;
                existing.UpdatedAt = DateTime.UtcNow;
                _context.SensorConfigurations.Update(existing);
            }
            await _context.SaveChangesAsync();
            return existing;
        }
    }

}
