using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IMeasurementService
    {
        Task<MeasurementDto> SaveMeasurementAsync(MeasurementDto dto);
        Task<ZoneRealtimeDto> GetZoneRealtimeAsync(int zoneId);
        Task<IEnumerable<MeasurementDto>> GetSensorHistoryAsync(int sensorId, DateTime start, DateTime end);
        Task<List<Models.Entities.MeasurementHistory>> GetSensorHistoryRecordsAsync(int sensorId, DateTime start, DateTime end);
    }

}
