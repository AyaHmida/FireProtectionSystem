using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IoTFire.Backend.Api.Models.DTOs.ManagementSensor;
using IoTFire.Backend.Api.Services.Interfaces;
using System.Security.Claims;


namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/zones")]
    [Authorize]
    public class ZoneController : ControllerBase
    {
        private readonly IZoneService _zoneService;

        public ZoneController(IZoneService zoneService)
        {
            _zoneService = zoneService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? userId)
        {
            var result = await _zoneService.GetAllAsync(userId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var zone = await _zoneService.GetByIdAsync(id);

            if (zone == null)
                return NotFound(new { message = "Zone introuvable." });

            return Ok(zone);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateZoneDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return BadRequest(new { message = "Utilisateur introuvable dans le token." });

            var created = await _zoneService.CreateAsync(dto, userId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateZoneDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _zoneService.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound(new { message = "Zone introuvable." });

            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _zoneService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Zone introuvable." });

            return NoContent();
        }
        [HttpGet("{id}/sensor-count")]
        public async Task<IActionResult> GetSensorCount(int id)
        {
            var zone = await _zoneService.GetByIdAsync(id);

            if (zone == null)
                return NotFound(new { message = "Zone introuvable." });

            var count = await _zoneService.GetSensorCountByZoneAsync(id);

            return Ok(new
            {
                ZoneId = id,
                SensorCount = count
            });
        }
    }
}
