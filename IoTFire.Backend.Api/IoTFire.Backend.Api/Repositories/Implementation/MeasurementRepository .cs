using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using IoTFire.Backend.Api.Data;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class MeasurementRepository : IMeasurementRepository
    {
        private readonly AppDbContext _context;

        public MeasurementRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Measurement> CreateAsync(Measurement measurement)
        {
            _context.Measurements.Add(measurement);
            await _context.SaveChangesAsync();
            return measurement;
        }

        public async Task<Measurement?> GetBySensorIdAsync(int sensorId)
        {
            return await _context.Measurements
                .FirstOrDefaultAsync(m => m.SensorId == sensorId);
        }

        public async Task<Measurement> UpdateAsync(Measurement measurement)
        {
            _context.Measurements.Update(measurement);
            await _context.SaveChangesAsync();
            return measurement;
        }

        public async Task<IEnumerable<Measurement>> GetHistoryAsync(int sensorId, DateTime start, DateTime end) =>
            await _context.Measurements
                          .Where(m => m.SensorId == sensorId && m.CreatedAt >= start && m.CreatedAt <= end)
                          .OrderBy(m => m.CreatedAt)
                          .ToListAsync();
    }

}
