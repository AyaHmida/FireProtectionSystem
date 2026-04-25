using IoTFire.Backend.Api.Models.DTOs.ControllerCommand;
using IoTFire.Backend.Api.Services.Implementation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IoTFire.Backend.Api.Services.Interfaces;


namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/device-control")]
    public class DeviceControlController : ControllerBase
    {
        private readonly IMqttService _mqttService;

        public DeviceControlController(IMqttService mqttService)
        {
            _mqttService = mqttService;
        }

        [HttpPost("{deviceId}")]
        public async Task<IActionResult> SendCommand(string deviceId, [FromBody] ControlCommandDto dto)
        {
            var topic = $"device/control/{deviceId}";

            await _mqttService.PublishAsync(topic, dto);

            return Ok(new { message = "Command sent via MQTT" });
        }
    }
}
