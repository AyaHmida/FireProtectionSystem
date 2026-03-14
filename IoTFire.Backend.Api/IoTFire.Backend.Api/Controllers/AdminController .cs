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

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users
        //  Tous les users sauf FamilyMember et supprimés
        // ──────────────────────────────────────────────────────────
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _service.GetAllUsersAsync();
            return Ok(users);
        }

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users/by-role?role=Occupant
        //  Pour le dropdown zones/devices
        // ──────────────────────────────────────────────────────────
        [HttpGet("users/by-role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersByRole([FromQuery] string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return BadRequest(new { message = "Le paramètre role est obligatoire." });

            var users = await _service.GetUsersByRoleAsync(role);
            return Ok(users);
        }

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users/pending
        //  Occupants en attente de validation uniquement
        // ──────────────────────────────────────────────────────────
        [HttpGet("users/pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var users = await _service.GetPendingUsersAsync();
            return Ok(users);
        }

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users/suspended
        //  Occupants suspendus uniquement
        // ──────────────────────────────────────────────────────────
        [HttpGet("users/suspended")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSuspendedUsers()
        {
            var users = await _service.GetSuspendedUsersAsync();
            return Ok(users);
        }

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users/{id}/family-members
        //  Admin voit les membres de famille d'un occupant spécifique
        // ──────────────────────────────────────────────────────────
        [HttpGet("users/{id:int}/family-members")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetFamilyMembers(int id)
        {
            var members = await _service.GetFamilyMembersAsync(id);
            return Ok(members);
        }

        // ──────────────────────────────────────────────────────────
        //  GET /api/admin/users/my-family
        //  Occupant voit UNIQUEMENT ses propres membres de famille
        //  userId extrait du token JWT — impossible de voir ceux d'un autre
        // ──────────────────────────────────────────────────────────
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

        // ──────────────────────────────────────────────────────────
        //  PATCH /api/admin/users/{id}/validate
        // ──────────────────────────────────────────────────────────
        [HttpPatch("users/{id:int}/validate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ValidateUser(int id)
        {
            var result = await _service.ValidateUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ──────────────────────────────────────────────────────────
        //  PATCH /api/admin/users/{id}/suspend
        //  Body : { "reason": "..." }
        // ──────────────────────────────────────────────────────────
        [HttpPatch("users/{id:int}/suspend")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SuspendUser(int id, [FromBody] SuspendUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.SuspendUserAsync(id, dto.Reason);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ──────────────────────────────────────────────────────────
        //  PATCH /api/admin/users/{id}/reactivate
        // ──────────────────────────────────────────────────────────
        [HttpPatch("users/{id:int}/reactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivateUser(int id)
        {
            var result = await _service.ReactivateUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ──────────────────────────────────────────────────────────
        //  DELETE /api/admin/users/{id}
        //  Soft delete
        // ──────────────────────────────────────────────────────────
        [HttpDelete("users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _service.DeleteUserAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
    }
