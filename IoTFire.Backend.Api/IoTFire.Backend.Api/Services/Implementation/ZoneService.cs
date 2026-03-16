using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class ZoneService : IZoneService
    {
        private readonly IZoneRepository _zoneRepository;
        private readonly IUserRepository _userRepository;

        public ZoneService(
            IZoneRepository zoneRepository,
            IUserRepository userRepository)
        {
            _zoneRepository = zoneRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<ZoneResponseDto>> GetAllAsync(int? userId = null)
        {
            var zones = await _zoneRepository.GetAllAsync(userId);
            return zones.Select(MapToDto);
        }

        public async Task<(IEnumerable<ZoneResponseDto> Zones, string? Error)> GetMyZonesAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return (Enumerable.Empty<ZoneResponseDto>(), "Utilisateur introuvable.");

            int targetUserId;

            if (user.Role == EnumRole.Occupant)
            {
                targetUserId = userId;
            }
            else if (user.Role == EnumRole.FamilyMember)
            {
                if (user.ParentUserId == null)
                    return (Enumerable.Empty<ZoneResponseDto>(), "Aucun occupant parent associé.");

                targetUserId = user.ParentUserId.Value;
            }
            else
            {
                return (Enumerable.Empty<ZoneResponseDto>(), "Rôle non autorisé.");
            }

            var zones = await _zoneRepository.GetAllAsync(targetUserId);
            return (zones.Select(MapToDto), null);
        }

        public async Task<ZoneResponseDto?> GetByIdAsync(int id)
        {
            var zone = await _zoneRepository.GetByIdAsync(id);
            return zone == null ? null : MapToDto(zone);
        }

        public async Task<(ZoneResponseDto? Dto, string? Error)> CreateAsync(CreateZoneDto dto)
        {
            var occupant = await _userRepository.GetByIdAsync(dto.OccupantUserId);
            if (occupant == null)
                return (null, $"Aucun utilisateur trouvé avec l'id {dto.OccupantUserId}.");

            if (occupant.Role != EnumRole.Occupant)
                return (null, $"L'utilisateur {dto.OccupantUserId} n'est pas un occupant.");

            var zone = new Zone
            {
                Name = dto.Name,
                Description = dto.Description,
                UserId = dto.OccupantUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _zoneRepository.CreateAsync(zone);
            return (MapToDto(created), null);
        }

        public async Task<(ZoneResponseDto? Dto, string? Error)> UpdateAsync(int id, CreateZoneDto dto)
        {
            var zone = await _zoneRepository.GetByIdAsync(id);
            if (zone == null)
                return (null, "Zone introuvable.");

            if (zone.UserId != dto.OccupantUserId)
            {
                var occupant = await _userRepository.GetByIdAsync(dto.OccupantUserId);
                if (occupant == null)
                    return (null, $"Aucun utilisateur trouvé avec l'id {dto.OccupantUserId}.");

                if (occupant.Role != EnumRole.Occupant)
                    return (null, $"L'utilisateur {dto.OccupantUserId} n'est pas un occupant.");
            }

            zone.Name = dto.Name;
            zone.Description = dto.Description;
            zone.UserId = dto.OccupantUserId;
            zone.UpdatedAt = DateTime.UtcNow;

            var updated = await _zoneRepository.UpdateAsync(zone);
            return updated == null
                ? (null, "Échec de la mise à jour.")
                : (MapToDto(updated), null);
        }

        public async Task<(bool Success, string? Error)> DeleteAsync(int id)
        {
            var zone = await _zoneRepository.GetByIdAsync(id);
            if (zone == null)
                return (false, "Zone introuvable.");

            await _zoneRepository.DisassociateFromZoneAsync(id);
            var deleted = await _zoneRepository.DeleteAsync(id);
            return deleted ? (true, null) : (false, "Échec de la suppression.");
        }

        public async Task<int> GetSensorCountByZoneAsync(int zoneId)
            => await _zoneRepository.GetSensorCountByZoneIdAsync(zoneId);

        private static ZoneResponseDto MapToDto(Zone z) => new()
        {
            Id = z.Id,
            Name = z.Name,
            Description = z.Description,
            UserId = z.UserId,
            OccupantName = z.User != null             

                            ? $"{z.User.FirstName} {z.User.LastName}"
                            : null,
            SensorCount = z.Sensors?.Count ?? 0,
            CreatedAt = z.CreatedAt,
            UpdatedAt = z.UpdatedAt
        };
    }
}
