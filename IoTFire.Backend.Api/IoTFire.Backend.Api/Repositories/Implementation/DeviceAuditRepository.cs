using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class DeviceAuditRepository : IDeviceAuditRepository
    {
        private readonly AppDbContext _context;

        public DeviceAuditRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(DeviceAudit audit)
        {
            _context.DeviceAudits.Add(audit);
            await _context.SaveChangesAsync();
        }
    }
}
