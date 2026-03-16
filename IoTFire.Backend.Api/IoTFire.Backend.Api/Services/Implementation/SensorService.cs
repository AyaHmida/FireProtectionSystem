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
