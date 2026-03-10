using System.Linq;
using IoTFire.Backend.Api.Helpers;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class SensorService : ISensorService
    {
        private readonly ISensorRepository _sensorRepository;

        public SensorService(ISensorRepository sensorRepository)
        {
            _sensorRepository = sensorRepository;
        }

        public async Task<int> SetThresholdsByZoneAsync(int zoneId, float threshold)
        {
            return await _sensorRepository.UpdateThresholdsByZoneAsync(zoneId, threshold);
        }

        public async Task<int> SetThresholdsByTypeAsync(SensorType type, float threshold)
        {
            return await _sensorRepository.UpdateThresholdsByTypeAsync(type, threshold);
        }

        public async Task<IEnumerable<SensorResponseDto>> GetAllAsync(
            SensorStatus? status = null)
        {
            var sensors = await _sensorRepository.GetAllAsync(status);
            return sensors.Select(MapToDto);
        }

        public async Task<SensorResponseDto?> GetByIdAsync(int id)
        {
            var sensor = await _sensorRepository.GetByIdAsync(id);
            return sensor == null ? null : MapToDto(sensor);
        }

        public async Task<SensorResponseDto> CreateAsync(CreateSensorDto dto)
        {
            if (await _sensorRepository.MacExistsAsync(dto.MacAddress))
                throw new InvalidOperationException(
                    "Un capteur avec cette adresse MAC existe déjà.");

            var sensor = new Sensor
            {
                MacAddress     = dto.MacAddress.ToUpper(),
                Label          = dto.Label,
                Type           = dto.Type,
                ThresholdValue = dto.ThresholdValue,
                ZoneId         = dto.ZoneId,
                Status         = SensorStatus.OFFLINE,
                LastValue      = 0,
                CreatedAt      = DateTime.UtcNow,
                UpdatedAt      = DateTime.UtcNow
            };

            var created = await _sensorRepository.CreateAsync(sensor);
            return MapToDto(created);
        }

        public async Task<SensorResponseDto?> UpdateAsync(
            int id, UpdateSensorDto dto)
        {
            var sensor = await _sensorRepository.GetByIdAsync(id);
            if (sensor == null) return null;

            if (dto.Label != null)
                sensor.Label = dto.Label;
            if (dto.Status.HasValue)
                sensor.Status = dto.Status.Value;
            if (dto.ThresholdValue.HasValue)
                sensor.ThresholdValue = dto.ThresholdValue.Value;
            if (dto.ZoneId.HasValue)
                sensor.ZoneId = dto.ZoneId.Value;

            var updated = await _sensorRepository.UpdateAsync(sensor);
            return updated == null ? null : MapToDto(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _sensorRepository.DeleteAsync(id);
        }

        public async Task<SimulatedValueDto?> SimulateValueAsync(int id)
        {
            var sensor = await _sensorRepository.GetByIdAsync(id);
            if (sensor == null) return null;

            float value = SensorSimulator.GenerateValue(sensor.Type);

            sensor.LastValue = value;
            sensor.Status    = SensorStatus.ONLINE;
            await _sensorRepository.UpdateAsync(sensor);

            return new SimulatedValueDto
            {
                SensorId    = sensor.Id,
                SensorLabel = sensor.Label,
                Type        = sensor.Type.ToString(),
                Value       = value,
                Unit        = SensorSimulator.GetUnit(sensor.Type),
                Threshold   = sensor.ThresholdValue,
                IsAlert     = value >= sensor.ThresholdValue,
                Severity    = SensorSimulator.GetSeverity(
                                  value, sensor.ThresholdValue, sensor.Type),
                Timestamp   = DateTime.UtcNow
            };
        }

        // ── Mapper ────────────────────────────────────────────────
        private static SensorResponseDto MapToDto(Sensor s) => new()
        {
            Id             = s.Id,
            MacAddress     = s.MacAddress,
            Label          = s.Label,
            Type           = s.Type.ToString(),
            Status         = s.Status.ToString(),
            ThresholdValue = s.ThresholdValue,
            LastValue      = s.LastValue,
            ZoneId         = s.ZoneId,
            ZoneName       = s.Zone?.Name ?? string.Empty,
            CreatedAt      = s.CreatedAt,
            UpdatedAt      = s.UpdatedAt
        };
    }
}
