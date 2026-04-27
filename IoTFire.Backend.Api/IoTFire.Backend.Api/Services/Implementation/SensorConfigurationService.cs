using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class SensorConfigurationService : ISensorConfigurationService
    {
        private readonly ISensorConfigurationRepository _repository;

        public SensorConfigurationService(ISensorConfigurationRepository repository)
        {
            _repository = repository;
        }

        public async Task<SensorConfigurationDto?> GetBySensorIdAsync(int sensorId)
        {
            var config = await _repository.GetBySensorIdAsync(sensorId);
            if (config == null) return null;

            return new SensorConfigurationDto
            {
                SensorId = config.SensorId,
                PreAlertThreshold = config.PreAlertThreshold,
                AlertThreshold = config.AlertThreshold,
                CriticalThreshold = config.CriticalThreshold
            };
        }

        public async Task<SensorConfigurationDto> SetConfigurationAsync(SensorConfigurationDto dto)
        {
            if (dto.PreAlertThreshold >= dto.AlertThreshold ||
        dto.AlertThreshold >= dto.CriticalThreshold)
            {
                throw new Exception("Order must be: PreAlert < Alert < Critical");
            }
            var config = new SensorConfiguration
            {
                SensorId = dto.SensorId,
                PreAlertThreshold = dto.PreAlertThreshold,
                AlertThreshold = dto.AlertThreshold,
                CriticalThreshold = dto.CriticalThreshold
            };

            var saved = await _repository.CreateOrUpdateAsync(config);

            return new SensorConfigurationDto
            {
                SensorId = saved.SensorId,
                PreAlertThreshold = saved.PreAlertThreshold,
                AlertThreshold = saved.AlertThreshold,
                CriticalThreshold = saved.CriticalThreshold
            };
        }
    }

}
