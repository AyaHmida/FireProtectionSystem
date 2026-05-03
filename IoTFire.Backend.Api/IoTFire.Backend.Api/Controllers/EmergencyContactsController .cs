using IoTFire.Backend.Api.Models.DTOs.Emergency;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmergencyContactsController : ControllerBase
    {
        private readonly IEmergencyContactsService _service;

        public EmergencyContactsController(IEmergencyContactsService service)
        {
            _service = service;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetContacts(int userId)
        {
            var contacts = await _service.GetContactsAsync(userId);
            return Ok(contacts);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddContact(int userId, [FromBody] CreateEmergencyContactsDto dto)
        {
            try
            {
                var created = await _service.AddContactAsync(userId, dto);
                return CreatedAtAction(nameof(GetContacts), new { userId }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var deleted = await _service.DeleteContactAsync(id);
            if (!deleted) return NotFound(new { message = $"Contact {id} not found" });
            return NoContent();
        }

        [HttpPost("{userId}/simulate-call")]
        public async Task<IActionResult> SimulateCall(int userId)
        {
            var result = await _service.SimulateCallAsync(userId);
            var response = result.Select(r => new
            {
                phoneNumber = r.PhoneNumber,
                timestamp = r.Timestamp
            });
            return Ok(response);
        }
    }
}
