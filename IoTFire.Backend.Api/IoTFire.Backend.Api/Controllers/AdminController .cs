using IoTFire.Backend.Api.Models.DTOs.ManagementUsers;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserManagementService _service;

        public AdminController(IUserManagementService service)
            => _service = service;

        
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _service.GetAllUsersAsync();
            return Ok(users);
        }

    
        [HttpGet("users/by-role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersByRole([FromQuery] string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return BadRequest(new { message = "Le paramètre role est obligatoire." });

            var users = await _service.GetUsersByRoleAsync(role);
            return Ok(users);
        }

        [HttpGet("users/pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var users = await _service.GetPendingUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/suspended")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSuspendedUsers()
        {
            var users = await _service.GetSuspendedUsersAsync();
            return Ok(users);
        }

        
        [HttpGet("users/{id:int}/family-members")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetFamilyMembers(int id)
        {
            var members = await _service.GetFamilyMembersAsync(id);
            return Ok(members);
        }

 
        [HttpGet("users/my-family")]
        [Authorize(Roles = "Occupant")]
        public async Task<IActionResult> GetMyFamilyMembers()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token invalide." });

            var members = await _service.GetFamilyMembersAsync(userId);
            return Ok(members);
        }

      
        [HttpPatch("users/{id:int}/validate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ValidateUser(int id)
        {
            var result = await _service.ValidateUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        [HttpPatch("users/{id:int}/suspend")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SuspendUser(int id, [FromBody] SuspendUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.SuspendUserAsync(id, dto.Reason);
            return result.Success ? Ok(result) : BadRequest(result);
        }

 
        [HttpPatch("users/{id:int}/reactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivateUser(int id)
        {
            var result = await _service.ReactivateUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _service.DeleteUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
    }
