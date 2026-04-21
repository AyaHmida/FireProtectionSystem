using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/measurements")]
    public class MeasurementController : ControllerBase
    {
        private readonly IMeasurementService _service;

        public MeasurementController(IMeasurementService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> SaveMeasurement([FromBody] MeasurementDto dto)
        {
            var result = await _service.SaveMeasurementAsync(dto);
            return Ok(result);
        }

        [HttpGet("{sensorId}/history")]
        public async Task<IActionResult> GetHistory(int sensorId, DateTime start, DateTime end)
        {
            var history = await _service.GetSensorHistoryAsync(sensorId, start, end);
            return Ok(history);
        }
    }
}
