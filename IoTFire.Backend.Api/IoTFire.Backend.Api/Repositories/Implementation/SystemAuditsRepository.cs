using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class SystemAuditsRepository : ISystemAuditsRepository
    {
        private readonly AppDbContext _context;

        public SystemAuditsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAuditAsync(SystemAudits audit)
        {
            _context.SystemAudits.Add(audit);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SystemAudits>> GetAllAsync()
        {
            return await Task.FromResult(_context.SystemAudits.OrderByDescending(a => a.Timestamp).AsEnumerable());
        }
    }

}
