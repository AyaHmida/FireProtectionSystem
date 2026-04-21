using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class MeasurementService : IMeasurementService
    {
        private readonly IMeasurementRepository _repository;
        private readonly ISensorConfigurationRepository _sensorConfigRepository;
        private readonly IAlertService _alertService;
        private readonly ILogger<MeasurementService> _logger;
        private readonly AppDbContext _context;


        public MeasurementService(IMeasurementRepository repository, ISensorConfigurationRepository sensorConfigRepository, IAlertService alertService, ILogger<MeasurementService> logger, AppDbContext context)
        {
            _repository = repository;
            _sensorConfigRepository = sensorConfigRepository;
            _alertService = alertService;
            _logger = logger;
            _context = context;
        }

        public async Task<MeasurementDto> SaveMeasurementAsync(MeasurementDto dto)
        {
            // 🔹 1) Vérifier si une mesure existe déjà pour ce capteur
            var existing = await _repository.GetBySensorIdAsync(dto.SensorId);

            Measurement measurement;

            if (existing != null)
            {
                existing.Value = dto.Value;
                existing.TypeMeasure = dto.TypeMeasure;
                existing.CreatedAt = DateTime.UtcNow;

                measurement = await _repository.UpdateAsync(existing);

                _logger.LogInformation("Measurement UPDATED for sensor {SensorId} value {Value}", dto.SensorId, dto.Value);
            }
            else
            {
                measurement = new Measurement
                {
                    SensorId = dto.SensorId,
                    Value = dto.Value,
                    TypeMeasure = dto.TypeMeasure,
                    CreatedAt = DateTime.UtcNow
                };

                measurement = await _repository.CreateAsync(measurement);

                _logger.LogInformation("Measurement CREATED for sensor {SensorId} value {Value}", dto.SensorId, dto.Value);
            }

            // 🔹 Vérifier les seuils
            var config = await _sensorConfigRepository.GetBySensorIdAsync(dto.SensorId);
            if (config != null)
            {
                if (dto.Value >= config.CriticalThreshold)
                {
                    _logger.LogWarning("[CRITICAL] Sensor {SensorId} value {Value}", dto.SensorId, dto.Value);
                }
                else if (dto.Value >= config.AlertThreshold)
                {
                    _logger.LogWarning("[ALERT] Sensor {SensorId} value {Value}", dto.SensorId, dto.Value);
                }
                else if (dto.Value >= config.PreAlertThreshold)
                {
                    _logger.LogInformation("[PRE-ALERT] Sensor {SensorId} value {Value}", dto.SensorId, dto.Value);
                }
            }

            // 🔹 Alert logic
            try
            {
                await _alertService.CheckAndTriggerAlertAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing alert check for sensor {SensorId}", dto.SensorId);
            }

            return new MeasurementDto
            {
                SensorId = measurement.SensorId,
                Value = measurement.Value,
                TypeMeasure = measurement.TypeMeasure
            };
        }
        public async Task<IEnumerable<MeasurementDto>> GetSensorHistoryAsync(int sensorId, DateTime start, DateTime end)
        {
            var history = await _repository.GetHistoryAsync(sensorId, start, end);
            return history.Select(m => new MeasurementDto
            {
                SensorId = m.SensorId,
                Value = m.Value,
                TypeMeasure = m.TypeMeasure
            });
        }
        public async Task<ZoneRealtimeDto> GetZoneRealtimeAsync(int zoneId)
        {
            // 1) Load sensors for the given zone
            var sensors = await _context.Sensors
                .AsNoTracking()
                .Where(s => s.ZoneId == zoneId)
                .ToListAsync();

            if (sensors == null || sensors.Count == 0)
            {
                return new ZoneRealtimeDto();
            }

            var sensorIds = sensors.Select(s => s.Id).ToList();

            // 2) Get recent measurements for these sensors ordered by CreatedAt desc.
            // Avoid GroupBy in the database; we will fetch recent measurements and pick the first per sensor in-memory.
            var recentMeasurements = await _context.Measurements
                .AsNoTracking()
                .Where(m => sensorIds.Contains(m.SensorId))
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            var result = new ZoneRealtimeDto();

            // 3) For each sensor pick the first (latest) measurement
            foreach (var sensor in sensors)
            {
                var last = recentMeasurements.FirstOrDefault(m => m.SensorId == sensor.Id);
                if (last == null)
                    continue;

                switch (sensor.Type)
                {
                    case SensorType.TEMPERATURE:
                        result.Temperature = last.Value;
                        break;
                    case SensorType.HUMIDITY:
                        result.Humidity = last.Value;
                        break;
                    case SensorType.GAS:
                        result.Gas = last.Value;
                        break;
                }
            }

            // 6) Last updated timestamp is the most recent measurement time for the sensors in the zone
            var lastUpdated = recentMeasurements.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
            result.UpdatedAt = lastUpdated?.CreatedAt;

            return result;
        }
    }

}
