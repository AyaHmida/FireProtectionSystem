using IoTFire.Backend.Api.Models.DTOs.ManagementUsers;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class UserManagementService : IUserManagementService
    {
        private readonly IUserRepository _repo;

        public UserManagementService(IUserRepository repo) => _repo = repo;

        public async Task<IEnumerable<UserAdminDto>> GetAllUsersAsync()
        {
            var users = await _repo.GetAllForAdminAsync();
            return users.Select(MapToAdminDto);
        }

        public async Task<IEnumerable<UserAdminDto>> GetUsersByRoleAsync(string role)
        {
            if (!Enum.TryParse<EnumRole>(role, ignoreCase: true, out var parsedRole))
                return Enumerable.Empty<UserAdminDto>();

            var users = await _repo.GetByRoleAsync(parsedRole);
            return users.Select(MapToAdminDto);
        }

        public async Task<IEnumerable<UserAdminDto>> GetPendingUsersAsync()
        {
            var users = await _repo.GetPendingUsersAsync();
            return users.Select(MapToAdminDto);
        }

        public async Task<IEnumerable<UserAdminDto>> GetSuspendedUsersAsync()
        {
            var users = await _repo.GetSuspendedUsersAsync();
            return users.Select(MapToAdminDto);
        }

        public async Task<IEnumerable<UserAdminDto>> GetFamilyMembersAsync(int occupantId)
        {
            // Vérifier que l'occupant existe
            var occupant = await _repo.GetByIdAsync(occupantId);
            if (occupant == null)
                return Enumerable.Empty<UserAdminDto>();

            var members = await _repo.GetFamilyMembersByOccupantAsync(occupantId);
            return members.Select(MapToAdminDto);
        }

        public async Task<AdminActionResponseDto> ValidateUserAsync(int userId)
        {
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Fail("User not found.");

            if (user.IsActive)
                return Fail("This account is already validated.");

            user.IsActive = true;
            user.IsSuspended = false;
            await _repo.UpdateAsync(user);

            return Ok("Account successfully validated.", user);
        }

        public async Task<AdminActionResponseDto> SuspendUserAsync(int userId, string reason)
        {
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Fail("User not found.");

            if (!user.IsActive)
                return Fail("Cannot suspend an unvalidated account.");

            if (user.IsSuspended)
                return Fail("This account is already suspended.");

            user.IsSuspended = true;
            user.SuspensionReason = reason;
            await _repo.UpdateAsync(user);

            return Ok("Account successfully suspended.", user);
        }

        public async Task<AdminActionResponseDto> ReactivateUserAsync(int userId)
        {
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Fail("User not found.");

            if (!user.IsSuspended)
                return Fail("This account is not suspended.");

            user.IsSuspended = false;
            user.SuspensionReason = null;
            await _repo.UpdateAsync(user);

            return Ok("Account successfully reactivated.", user);
        }

        public async Task<AdminActionResponseDto> DeleteUserAsync(int userId)
        {
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Fail("User not found.");

            user.IsDeleted = true;
            user.IsActive = false;
            user.IsSuspended = false;
            await _repo.UpdateAsync(user);

            return Ok("Account successfully deleted (soft delete).", user);
        }
        private static AdminActionResponseDto Ok(string msg, User? user = null) => new()
        {
            Success = true,
            Message = msg,
            User = user != null ? MapToAdminDto(user) : null
        };

        private static AdminActionResponseDto Fail(string msg) => new()
        {
            Success = false,
            Message = msg
        };

        private static UserAdminDto MapToAdminDto(User u) => new()
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            IsSuspended = u.IsSuspended,
            SuspensionReason = u.SuspensionReason,
            CreatedAt = u.CreatedAt,
            Statut = u.IsSuspended ? "Suspended"
                             : u.IsActive ? "Active"
                                             : "On hold"
        };
    }
}
