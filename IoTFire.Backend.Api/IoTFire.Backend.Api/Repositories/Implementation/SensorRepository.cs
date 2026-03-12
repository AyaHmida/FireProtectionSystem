using Microsoft.EntityFrameworkCore;
using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class SensorRepository : ISensorRepository
    {
        private readonly AppDbContext _context;

        public SensorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Sensor>> GetAllAsync(
            SensorStatus? status = null)
        {
            var query = _context.Sensors
                .Include(s => s.Zone)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(s => s.Status == status.Value);

            return await query
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Sensor?> GetByIdAsync(int id)
        {
            return await _context.Sensors
                .Include(s => s.Zone)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Sensor>> GetByZoneIdAsync(int zoneId)
        {
            return await _context.Sensors
                .Include(s => s.Zone)
                .Where(s => s.ZoneId == zoneId)
                .ToListAsync();
        }

        public async Task<bool> MacExistsAsync(string macAddress)
        {
            return await _context.Sensors
                .AnyAsync(s => s.MacAddress == macAddress);
        }

       

        

        public async Task<int> UpdateThresholdsByZoneAsync(int zoneId, float threshold)
        {
            var sensors = await _context.Sensors.Where(s => s.ZoneId == zoneId).ToListAsync();
            foreach (var s in sensors)
            {
                s.ThresholdValue = threshold;
                s.UpdatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
            return sensors.Count;
        }

        public async Task<int> UpdateThresholdsByTypeAsync(SensorType type, float threshold)
        {
            var sensors = await _context.Sensors.Where(s => s.Type == type).ToListAsync();
            foreach (var s in sensors)
            {
                s.ThresholdValue = threshold;
                s.UpdatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
            return sensors.Count;
        }
    }
}
