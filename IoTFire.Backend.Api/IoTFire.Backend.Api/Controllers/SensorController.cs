using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Services.Interfaces;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/sensors")]
    [Authorize]
    public class SensorController : ControllerBase
    {
        private readonly ISensorService _sensorService;

        public SensorController(ISensorService sensorService)
        {
            _sensorService = sensorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SensorStatus? status)
        {
            var result = await _sensorService.GetAllAsync(status);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sensor = await _sensorService.GetByIdAsync(id);

            if (sensor == null)
                return NotFound(new { message = "Capteur introuvable." });

            return Ok(sensor);
        }

 

      
        [Authorize(Roles = "Occupant,Admin")]
        [HttpPost("thresholds")]
        public async Task<IActionResult> SetThresholds([FromBody] UpdateThresholdsDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!dto.ZoneId.HasValue && !dto.Type.HasValue)
                return BadRequest(new { message = "ZoneId ou Type requis." });

            if (dto.ZoneId.HasValue && dto.Type.HasValue)
                return BadRequest(new { message = "Choisir soit ZoneId soit Type, pas les deux." });

            int count;

            if (dto.ZoneId.HasValue)
            {
                count = await _sensorService.SetThresholdsByZoneAsync(
                    dto.ZoneId.Value,
                    dto.Threshold);
            }
            else
            {
                count = await _sensorService.SetThresholdsByTypeAsync(
                    dto.Type!.Value,
                    dto.Threshold);
            }

            return Ok(new { updated = count });
        }
    }
}
