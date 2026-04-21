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

        public async Task<IEnumerable<Sensor>> GetAllAsync(SensorStatus? status)
        {
            var query = _context.Sensors.AsQueryable();

            if (status.HasValue)
                query = query.Where(s => s.Status == status.Value);

            return await query
                .Include(s => s.Zone)
                .Include(s => s.Device)
                .ToListAsync();
        }
        public async Task<Sensor?> GetByIdAsync(int id) =>
            await _context.Sensors
                          .Include(s => s.Zone)
                          .Include(s => s.Device)
                          .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<IEnumerable<Sensor>> GetByDeviceIdAsync(int deviceId) =>
            await _context.Sensors
                          .Where(s => s.DeviceId == deviceId)
                          .ToListAsync();

        public async Task<Sensor> CreateAsync(Sensor sensor)
        {
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
            return sensor;
        }

        public async Task<Sensor?> UpdateAsync(Sensor sensor)
        {
            _context.Sensors.Update(sensor);
            await _context.SaveChangesAsync();
            return sensor;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor == null) return false;

            _context.Sensors.Remove(sensor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
