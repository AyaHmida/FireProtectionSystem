using IoTFire.Backend.Api.Models.DTOs.System;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemStatController : ControllerBase
    {
        private readonly ISystemStatService _service;

        public SystemStatController(ISystemStatService service)
        {
            _service = service;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            try
            {
                var status = await _service.GetStatusAsync();
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("toggle")]
        public async Task<IActionResult> ToggleState([FromBody] ToggleSystemStatDtos dto)
        {
            var updated = await _service.ToggleStateAsync(dto);
            return Ok(updated);
        }
    }
}
