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

        // ──────────────────────────────────────────────────────────
        //  GET /api/devices
        //  Liste tous les devices avec statut En ligne / Hors ligne
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

        // ──────────────────────────────────────────────────────────
        //  POST /api/devices
        //  Body : { "deviceId": "ESP32-001", "name": "...", "description": "..." }
        // ──────────────────────────────────────────────────────────
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

        // ──────────────────────────────────────────────────────────
        //  PUT /api/devices/{id}
        //  Body : { "deviceId": "ESP32-001", "name": "...", "description": "..." }
        // ──────────────────────────────────────────────────────────
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

        // ──────────────────────────────────────────────────────────
        //  DELETE /api/devices/{id}
        //  Supprime le device — les sensors liés auront device_id = null
        // ──────────────────────────────────────────────────────────
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

        // ──────────────────────────────────────────────────────────
        //  PUT /api/devices/{id}/assign-zone  (US-A3)
        //  Associe ou réassigne un device à une zone d'un occupant
        //  Body : { "zoneId": 3 }
        // ──────────────────────────────────────────────────────────
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
