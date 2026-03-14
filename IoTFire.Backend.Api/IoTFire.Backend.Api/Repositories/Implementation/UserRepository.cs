using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string email)
            => await _context.Users
                .AnyAsync(u => u.Email.ToLower() == email.ToLower().Trim());

        public async Task<User?> GetByEmailAsync(string email)
            => await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower().Trim());

        public async Task<User?> GetByIdAsync(int id)
            => await _context.Users.FindAsync(id);

        public async Task<User> CreateAsync(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // ── Admin : liste principale ───────────────────────────────
        // FamilyMember exclus — ils sont gérés via leur occupant parent
        public async Task<IEnumerable<User>> GetAllForAdminAsync()
            => await _context.Users
                .Where(u => !u.IsDeleted
                         && u.Role != EnumRole.FamilyMember)  // ← EXCLU
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

        // ── Admin : comptes en attente ─────────────────────────────
        // Uniquement les Occupants en attente (pas Admin, pas FamilyMember)
        public async Task<IEnumerable<User>> GetPendingUsersAsync()
            => await _context.Users
                .Where(u => !u.IsActive
                         && !u.IsDeleted
                         && u.Role == EnumRole.Occupant)  // ← uniquement Occupant
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();

        // ── Admin : comptes suspendus ──────────────────────────────
        // Uniquement les Occupants suspendus
        public async Task<IEnumerable<User>> GetSuspendedUsersAsync()
            => await _context.Users
                .Where(u => u.IsSuspended
                         && !u.IsDeleted
                         && u.Role == EnumRole.Occupant)  // ← uniquement Occupant
                .OrderBy(u => u.FirstName)
                .ToListAsync();

        // ── Filtre par rôle (pour le dropdown occupant) ────────────
        public async Task<IEnumerable<User>> GetByRoleAsync(EnumRole role)
            => await _context.Users
                .Where(u => u.Role == role
                         && u.IsActive
                         && !u.IsSuspended
                         && !u.IsDeleted)
                .OrderBy(u => u.FirstName)
                .ToListAsync();

        // ── Family Members d'un occupant ──────────────────────────
        // Utilisé par l'admin (id en param) et l'occupant (id du token)
        public async Task<IEnumerable<User>> GetFamilyMembersByOccupantAsync(int occupantId)
            => await _context.Users
                .Where(u => u.ParentUserId == occupantId
                         && !u.IsDeleted)
                .OrderBy(u => u.FirstName)
                .ToListAsync();

        // ── Général ────────────────────────────────────────────────
        public async Task<IEnumerable<User>> GetAllAsync()
            => await _context.Users
                .Where(u => u.IsActive && !u.IsDeleted)
                .ToListAsync();

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
            => await _context.Users
                .Where(u => u.IsActive && !u.IsSuspended && !u.IsDeleted)
                .ToListAsync();
    }
}

