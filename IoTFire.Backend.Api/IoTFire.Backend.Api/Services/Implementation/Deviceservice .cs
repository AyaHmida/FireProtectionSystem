using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class DeviceService : IDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IZoneRepository _zoneRepository;

        public DeviceService(
            IDeviceRepository deviceRepository,
            IZoneRepository zoneRepository)
        {
            _deviceRepository = deviceRepository;
            _zoneRepository = zoneRepository;
        }

        // ─────────────────────────────────────────────────────────────
        //  GET ALL
        // ─────────────────────────────────────────────────────────────
        public async Task<IEnumerable<DeviceResponseDto>> GetAllAsync(int? userId = null)
        {
            var devices = await _deviceRepository.GetAllAsync(userId);
            return devices.Select(MapToDto);
        }

        public async Task<DeviceResponseDto?> GetByIdAsync(int id)
        {
            var device = await _deviceRepository.GetByIdAsync(id);
            return device == null ? null : MapToDto(device);
        }

        // ─────────────────────────────────────────────────────────────
        //  CREATE (US-A2)
        //  DeviceId physique doit être unique
        // ─────────────────────────────────────────────────────────────
        public async Task<(DeviceResponseDto? Dto, string? Error)> CreateAsync(CreateDeviceDto dto)
        {
            var existing = await _deviceRepository.GetByDeviceIdStringAsync(dto.DeviceId);
            if (existing != null)
                return (null, $"Un device avec l'identifiant '{dto.DeviceId}' existe déjà.");

            var device = new Device
            {
                DeviceId = dto.DeviceId,
                Name = dto.Name,
                Description = dto.Description,
                OccupantId = dto.OccupantUserId,  // ← AJOUTER
                IsOnline = false,
                ZoneId = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _deviceRepository.CreateAsync(device);
            return (MapToDto(created), null);
        }

        // ─────────────────────────────────────────────────────────────
        //  UPDATE (US-A2) — modifie DeviceId, nom, description
        // ─────────────────────────────────────────────────────────────
        public async Task<(DeviceResponseDto? Dto, string? Error)> UpdateAsync(int id, CreateDeviceDto dto)
        {
            var device = await _deviceRepository.GetByIdAsync(id);
            if (device == null)
                return (null, "Device introuvable.");

            // Vérifier unicité du DeviceId si changé
            if (device.DeviceId != dto.DeviceId)
            {
                var existing = await _deviceRepository.GetByDeviceIdStringAsync(dto.DeviceId);
                if (existing != null)
                    return (null, $"Un device avec l'identifiant '{dto.DeviceId}' existe déjà.");
            }

            device.DeviceId = dto.DeviceId;
            device.Name = dto.Name;
            device.Description = dto.Description;
            device.UpdatedAt = DateTime.UtcNow;

            var updated = await _deviceRepository.UpdateAsync(device);
            return updated == null
                ? (null, "Échec de la mise à jour.")
                : (MapToDto(updated), null);
        }

        // ─────────────────────────────────────────────────────────────
        //  DELETE (US-A2)
        //  La désassociation zone est automatique via la suppression
        //  Les sensors liés auront device_id → null (cascade réglée en BDD)
        // ─────────────────────────────────────────────────────────────
        public async Task<(bool Success, string? Error)> DeleteAsync(int id)
        {
            var device = await _deviceRepository.GetByIdAsync(id);
            if (device == null)
                return (false, "Device introuvable.");

            var deleted = await _deviceRepository.DeleteAsync(id);
            return deleted
                ? (true, null)
                : (false, "Échec de la suppression.");
        }

        // ─────────────────────────────────────────────────────────────
        //  ASSIGN TO ZONE (US-A3)
        //  Un device → une seule zone à la fois (réassignation libre)
        // ─────────────────────────────────────────────────────────────
        public async Task<(DeviceResponseDto? Dto, string? Error)> AssignToZoneAsync(
            int id, AssignDeviceToZoneDto dto)
        {
            var device = await _deviceRepository.GetByIdAsync(id);
            if (device == null)
                return (null, "Device introuvable.");

            var zone = await _zoneRepository.GetByIdAsync(dto.ZoneId);
            if (zone == null)
                return (null, $"Zone introuvable avec l'id {dto.ZoneId}.");

            device.ZoneId = dto.ZoneId;
            device.UpdatedAt = DateTime.UtcNow;

            var updated = await _deviceRepository.UpdateAsync(device);
            return updated == null
                ? (null, "Échec de l'assignation.")
                : (MapToDto(updated), null);
        }

        // ─────────────────────────────────────────────────────────────
        //  UNASSIGN FROM ZONE
        // ─────────────────────────────────────────────────────────────
        public async Task<(DeviceResponseDto? Dto, string? Error)> UnassignFromZoneAsync(int id)
        {
            var device = await _deviceRepository.GetByIdAsync(id);
            if (device == null)
                return (null, "Device introuvable.");

            if (device.ZoneId == null)
                return (null, "Ce device n'est associé à aucune zone.");

            device.ZoneId = null;
            device.UpdatedAt = DateTime.UtcNow;

            var updated = await _deviceRepository.UpdateAsync(device);
            return updated == null
                ? (null, "Échec de la désassociation.")
                : (MapToDto(updated), null);
        }

        // ─────────────────────────────────────────────────────────────
        //  MAPPING
        // ─────────────────────────────────────────────────────────────
        private static DeviceResponseDto MapToDto(Device d) => new()
        {
            Id = d.Id,
            DeviceId = d.DeviceId,
            Name = d.Name,
            Description = d.Description,
            IsOnline = d.IsOnline,
            ZoneId = d.ZoneId,
            ZoneName = d.Zone?.Name,
            OccupantId = d.OccupantId,
            OccupantName = d.Occupant != null
                            ? $"{d.Occupant.FirstName} {d.Occupant.LastName}"
                            : null,
            SensorCount = d.Sensors?.Count ?? 0,
            CreatedAt = d.CreatedAt,
            UpdatedAt = d.UpdatedAt
        };
    }
}
