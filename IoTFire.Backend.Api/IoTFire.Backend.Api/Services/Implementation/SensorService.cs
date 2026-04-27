using IoTFire.Backend.Api.Helpers;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Implementation;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;
using System.Linq;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class SensorService : ISensorService
    {
        private readonly ISensorRepository _sensorRepository;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IZoneRepository _zoneRepository;

        public SensorService(ISensorRepository sensorRepository,IDeviceRepository deviceRepository,IZoneRepository zoneRepository)
        {
            _sensorRepository = sensorRepository;
            _deviceRepository = deviceRepository;
            _zoneRepository = zoneRepository;
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

        public async Task<IEnumerable<SensorResponseDto>> GetByZoneIdAsync(int zoneId)
        {
            var sensors = await _sensorRepository.GetByZoneIdAsync(zoneId);
            return sensors.Select(MapToDto);
        }

        public async Task<(SensorResponseDto? Dto, string? Error)> RegisterSensorAsync(SensorRegisterDto dto)
        {
            var device = await _deviceRepository.GetByIdAsync(dto.DeviceId);
            if (device == null)
                return (null, $"Device introuvable avec l'id {dto.DeviceId}.");

            var zone = await _zoneRepository.GetByIdAsync(dto.ZoneId);
            if (zone == null)
                return (null, $"Zone introuvable avec l'id {dto.ZoneId}.");

            var sensor = new Sensor
            {
                Label = dto.Label,
                Type = Enum.Parse<SensorType>(dto.Type, true),
                Status = SensorStatus.ONLINE,
                DeviceId = dto.DeviceId,
                ZoneId = dto.ZoneId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _sensorRepository.CreateAsync(sensor);
            return (MapToDto(created), null);
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
