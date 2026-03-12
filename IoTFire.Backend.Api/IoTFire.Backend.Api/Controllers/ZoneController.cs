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
        //pour l'occupant voit uniquement SES propres zones
        [HttpGet("my-zones")]
        [Authorize(Roles = "Occupant")]
        public async Task<IActionResult> GetMyZones()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return BadRequest(new { message = "Utilisateur introuvable dans le token." });

            var result = await _zoneService.GetAllAsync(userId);
            return Ok(result);
        }


        [HttpGet("{id:int}")]
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

            var (created, error) = await _zoneService.CreateAsync(dto);

            if (error != null)
                return BadRequest(new { message = error });

            return CreatedAtAction(nameof(GetById), new { id = created!.Id }, created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateZoneDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (updated, error) = await _zoneService.UpdateAsync(id, dto);

            if (error != null)
                return error == "Zone introuvable."
                    ? NotFound(new { message = error })
                    : BadRequest(new { message = error });

            return Ok(updated);
        }

      
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, error) = await _zoneService.DeleteAsync(id);

            if (!success)
                return error == "Zone introuvable."
                    ? NotFound(new { message = error })
                    : StatusCode(500, new { message = error });

            return NoContent();
        }

       
        [HttpGet("{id:int}/sensor-count")]
        public async Task<IActionResult> GetSensorCount(int id)
        {
            var zone = await _zoneService.GetByIdAsync(id);
            if (zone == null)
                return NotFound(new { message = "Zone introuvable." });

            var count = await _zoneService.GetSensorCountByZoneAsync(id);
            return Ok(new { ZoneId = id, SensorCount = count });
        }
    }
}
