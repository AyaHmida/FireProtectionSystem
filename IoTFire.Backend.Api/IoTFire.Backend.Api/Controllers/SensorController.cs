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

        

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sensor = await _sensorService.GetByIdAsync(id);

            if (sensor == null)
                return NotFound(new { message = "Capteur introuvable." });

            return Ok(sensor);
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterSensor([FromBody] SensorRegisterDto dto)
        {
            var result = await _sensorService.RegisterSensorAsync(dto);
            if (result.Dto == null) return BadRequest(result.Error);
            return Ok(result.Dto);
        }



    }
}
