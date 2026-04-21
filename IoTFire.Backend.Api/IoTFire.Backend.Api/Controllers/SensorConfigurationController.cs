using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/sensor-configurations")]
    public class SensorConfigurationController : ControllerBase
    {
        private readonly ISensorConfigurationService _service;

        public SensorConfigurationController(ISensorConfigurationService service)
        {
            _service = service;
        }

        [HttpGet("{sensorId}")]
        public async Task<IActionResult> GetBySensorId(int sensorId)
        {
            var config = await _service.GetBySensorIdAsync(sensorId);
            if (config == null) return NotFound();
            return Ok(config);
        }

        [HttpPost]
        public async Task<IActionResult> SetConfiguration([FromBody] SensorConfigurationDto dto)
        {
            var saved = await _service.SetConfigurationAsync(dto);
            return Ok(saved);
        }
    }

}
