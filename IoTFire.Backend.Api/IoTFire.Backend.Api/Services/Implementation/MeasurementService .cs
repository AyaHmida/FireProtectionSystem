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
            var sensor = await _context.Sensors
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == dto.SensorId);

            if (sensor == null)
                throw new InvalidOperationException($"Sensor {dto.SensorId} not found");

            var strategy = _context.Database.CreateExecutionStrategy();

            Measurement measurement = null!;

            await strategy.ExecuteAsync(async () =>
            {
                using var tx = await _context.Database.BeginTransactionAsync();

                var existing = await _repository.GetBySensorIdAsync(dto.SensorId);

                if (existing != null)
                {
                    existing.Value = dto.Value;
                    existing.TypeMeasure = dto.TypeMeasure;
                    existing.CreatedAt = DateTime.UtcNow;

                    measurement = await _repository.UpdateAsync(existing);

                    _logger.LogInformation("Measurement UPDATED for sensor {SensorId}", dto.SensorId);
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

                    _logger.LogInformation("Measurement CREATED for sensor {SensorId}", dto.SensorId);
                }

                var history = new MeasurementHistory
                {
                    SensorId = dto.SensorId,
                    Value = dto.Value,
                    TypeMeasure = dto.TypeMeasure,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.MeasurementHistory.AddAsync(history);
                await _context.SaveChangesAsync();

                await tx.CommitAsync();
            });

            // 🔹 alert logic reste comme avant
            try
            {
                await _alertService.CheckAndTriggerAlertAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing alert check");
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

        public async Task<List<Models.Entities.MeasurementHistory>> GetSensorHistoryRecordsAsync(int sensorId, DateTime start, DateTime end)
        {
            return await _context.MeasurementHistory
                .AsNoTracking()
                .Where(h => h.SensorId == sensorId && h.CreatedAt >= start && h.CreatedAt <= end)
                .OrderBy(h => h.CreatedAt)
                .ToListAsync();
        }
        public async Task<ZoneRealtimeDto> GetZoneRealtimeAsync(int zoneId)
        {
            var sensorIds = await _context.Sensors
                .AsNoTracking()
                .Where(s => s.ZoneId == zoneId)
                .Select(s => s.Id)
                .ToListAsync();

            if (!sensorIds.Any())
                return new ZoneRealtimeDto();

            var recentMeasurements = await _context.Measurements
                .AsNoTracking()
                .Where(m => sensorIds.Contains(m.SensorId))
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            var latestPerSensor = recentMeasurements
                .GroupBy(m => m.SensorId)
                .Select(g => g.First())
                .ToList();

            var result = new ZoneRealtimeDto();

            foreach (var m in latestPerSensor)
            {
                switch (m.TypeMeasure?.ToUpper())
                {
                    case "TEMPERATURE": result.Temperature = m.Value; break;
                    case "HUMIDITY": result.Humidity = m.Value; break;
                    case "GAS": result.Gas = m.Value; break;
                    case "SMOKE": result.Gas = m.Value; break; 
                }
            }

            result.UpdatedAt = recentMeasurements.FirstOrDefault()?.CreatedAt;
            return result;
        }
    }

}
