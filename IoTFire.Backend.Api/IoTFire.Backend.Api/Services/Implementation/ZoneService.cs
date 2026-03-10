using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class ZoneService : IZoneService
    {
        private readonly IZoneRepository _zoneRepository;

        public ZoneService(IZoneRepository zoneRepository)
        {
            _zoneRepository = zoneRepository;
        }

        public async Task<IEnumerable<ZoneResponseDto>> GetAllAsync(int? userId = null)
        {
            var zones = await _zoneRepository.GetAllAsync(userId);
            return zones.Select(z => new ZoneResponseDto
            {
                Id = z.Id,
                Name = z.Name,
                Description = z.Description,
                UserId = z.UserId,
                SensorCount = z.Sensors?.Count ?? 0,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            });
        }

        public async Task<ZoneResponseDto?> GetByIdAsync(int id)
        {
            var z = await _zoneRepository.GetByIdAsync(id);
            if (z == null) return null;
            return new ZoneResponseDto
            {
                Id = z.Id,
                Name = z.Name,
                Description = z.Description,
                UserId = z.UserId,
                SensorCount = z.Sensors?.Count ?? 0,
                CreatedAt = z.CreatedAt,
                UpdatedAt = z.UpdatedAt
            };
        }

        public async Task<ZoneResponseDto> CreateAsync(CreateZoneDto dto, int userId)
        {
            var zone = new Zone
            {
                Name = dto.Name,
                Description = dto.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _zoneRepository.CreateAsync(zone);
            return new ZoneResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                UserId = created.UserId,
                SensorCount = created.Sensors?.Count ?? 0,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
        }

        public async Task<ZoneResponseDto?> UpdateAsync(int id, CreateZoneDto dto)
        {
            var z = await _zoneRepository.GetByIdAsync(id);
            if (z == null) return null;

            z.Name = dto.Name;
            z.Description = dto.Description;
            z.UpdatedAt = DateTime.UtcNow;

            var updated = await _zoneRepository.UpdateAsync(z);
            return updated == null ? null : new ZoneResponseDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                UserId = updated.UserId,
                SensorCount = updated.Sensors?.Count ?? 0,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _zoneRepository.DeleteAsync(id);
        }
        public async Task<int> GetSensorCountByZoneAsync(int zoneId)
        {
            return await _zoneRepository.GetSensorCountByZoneIdAsync(zoneId);
        }
    }
}
