using Microsoft.EntityFrameworkCore;
using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class ZoneRepository : IZoneRepository
    {
        private readonly AppDbContext _context;

        public ZoneRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Zone>> GetAllAsync(int? userId = null)
        {
            var query = _context.Zones
                  .Include(z => z.User)      
            .Include(z => z.Sensors)    
                .AsQueryable();
            if (userId.HasValue)
                query = query.Where(z => z.UserId == userId.Value);

            return await query.OrderByDescending(z => z.CreatedAt).ToListAsync();
        }

        public async Task<Zone?> GetByIdAsync(int id)
        {
            return await _context.Zones
                 .Include(z => z.User)      
            .Include(z => z.Sensors)    
            .FirstOrDefaultAsync(z => z.Id == id);
        }

        public async Task<Zone> CreateAsync(Zone zone)
        {
            await _context.Zones.AddAsync(zone);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(zone.Id) ?? zone;
        }

        public async Task<Zone?> UpdateAsync(Zone zone)
        {
            zone.UpdatedAt = DateTime.UtcNow;
            _context.Zones.Update(zone);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(zone.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var zone = await _context.Zones.FindAsync(id);
            if (zone == null) return false;

            _context.Zones.Remove(zone);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<int> GetSensorCountByZoneIdAsync(int zoneId)
        {
            return await _context.Sensors
                .CountAsync(s => s.ZoneId == zoneId);
        }
        public async Task DisassociateFromZoneAsync(int zoneId)
        {
            var sensors = await _context.Sensors
                .Where(s => s.ZoneId == zoneId)
                .ToListAsync();

            foreach (var sensor in sensors)
                sensor.ZoneId = 0;

            await _context.SaveChangesAsync();
        }
    }
}
