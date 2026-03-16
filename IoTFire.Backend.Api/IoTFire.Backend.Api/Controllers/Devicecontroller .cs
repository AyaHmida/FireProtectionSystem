using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/devices")]
    [Authorize(Roles = "Admin")]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;

        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? userId)
        {
            var result = await _deviceService.GetAllAsync(userId);
            return Ok(result);
        }

        //  GET /api/devices/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var device = await _deviceService.GetByIdAsync(id);
            if (device == null)
                return NotFound(new { message = "Device introuvable." });

            return Ok(device);
        }

   
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDeviceDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (created, error) = await _deviceService.CreateAsync(dto);
            if (error != null)
                return BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetById), new { id = created!.Id }, created);
        }

       
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDeviceDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (updated, error) = await _deviceService.UpdateAsync(id, dto);
            if (error != null)
                return error == "Device introuvable."
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, error) = await _deviceService.DeleteAsync(id);
            if (!success)
                return error == "Device introuvable."
                    ? NotFound(new { message = error })
                    : StatusCode(500, new { message = error });

            return NoContent();
        }

       
        [HttpPut("{id:int}/assign-zone")]
        public async Task<IActionResult> AssignToZone(int id, [FromBody] AssignDeviceToZoneDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (updated, error) = await _deviceService.AssignToZoneAsync(id, dto);
            if (error != null)
                return error == "Device introuvable."
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(updated);
        }

      
        [HttpPut("{id:int}/unassign-zone")]
        public async Task<IActionResult> UnassignFromZone(int id)
        {
            var (updated, error) = await _deviceService.UnassignFromZoneAsync(id);
            if (error != null)
                return error == "Device introuvable."
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(updated);
        }
    }
}
