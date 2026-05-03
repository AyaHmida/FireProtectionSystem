using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class SystemStatRepository : ISystemStatRepository
    {
        private readonly AppDbContext _context;

        public SystemStatRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SystemStat?> GetStateAsync()
        {
            // Singleton behaviour: return first or create default
            var state = await _context.SystemStates.FirstOrDefaultAsync();
            if (state == null)
            {
                state = new SystemStat { IsActive = true, UpdatedAt = DateTime.UtcNow };
                _context.SystemStates.Add(state);
                await _context.SaveChangesAsync();
            }
            return state;
        }

        public async Task<SystemStat> UpdateStateAsync(SystemStat state)
        {
            state.UpdatedAt = DateTime.UtcNow;
            _context.SystemStates.Update(state);
            await _context.SaveChangesAsync();
            return state;
        }
    }

}
