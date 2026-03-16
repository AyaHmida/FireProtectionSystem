using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly AppDbContext _context;

        public DeviceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Device>> GetAllAsync(int? userId = null)
        {
            var query = _context.Devices
                .Include(d => d.Zone)
                .Include(d => d.Occupant) 

                .Include(d => d.Sensors)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(d => d.OccupantId == userId.Value); 


            return await query.OrderByDescending(d => d.CreatedAt).ToListAsync();
        }
        public async Task<Device?> GetByIdAsync(int id)
        {
            return await _context.Devices
                .Include(d => d.Zone)
                    .ThenInclude(z => z!.User)
                .Include(d => d.Sensors)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Device?> GetByDeviceIdStringAsync(string deviceId)
        {
            return await _context.Devices
                .FirstOrDefaultAsync(d => d.DeviceId == deviceId);
        }

        public async Task<Device> CreateAsync(Device device)
        {
            await _context.Devices.AddAsync(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task<Device?> UpdateAsync(Device device)
        {
            device.UpdatedAt = DateTime.UtcNow;
            _context.Devices.Update(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null) return false;

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
