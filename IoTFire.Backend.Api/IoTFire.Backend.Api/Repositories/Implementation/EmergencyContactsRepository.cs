using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class EmergencyContactsRepository : IEmergencyContactsRepository
    {
        private readonly AppDbContext _context;

        public EmergencyContactsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmergencyContacts>> GetAllByUserIdAsync(int userId)
        {
            return await _context.EmergencyContacts.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<EmergencyContacts> AddAsync(EmergencyContacts contact)
        {
            _context.EmergencyContacts.Add(contact);
            await _context.SaveChangesAsync();
            return contact;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var c = await _context.EmergencyContacts.FindAsync(id);
            if (c == null) return false;
            _context.EmergencyContacts.Remove(c);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<EmergencyContacts?> GetByIdAsync(int id)
        {
            return await _context.EmergencyContacts.FindAsync(id);
        }
    }

}
