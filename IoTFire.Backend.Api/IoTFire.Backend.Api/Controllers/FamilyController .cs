using IoTFire.Backend.Api.Models.DTOs.FamillyMember;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IoTFire.Backend.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class FamilyController : ControllerBase
    {
        private readonly IFamilyService _familyService;

        public FamilyController(IFamilyService familyService)
        {
            _familyService = familyService;
        }

        [Authorize(Roles = "Occupant")]

        [HttpGet("members")]
        public async Task<IActionResult> GetFamilyMembers()
        {
            var occupantId = GetCurrentUserId();
            if (occupantId == null)
                return Forbid(); 

            var result = await _familyService.GetFamilyMembersAsync(occupantId.Value);
            return Ok(result);
        }

        [Authorize(Roles = "Occupant")]

        [HttpPost("invite")]
        public async Task<IActionResult> InviteMember(
            [FromBody] InviteFamilyMemberDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var occupantId = GetCurrentUserId();
            if (occupantId == null)
                return Forbid();

            var (success, message) =
                await _familyService.InviteMemberAsync(occupantId.Value, dto);

            return success
                ? Ok(new { message })
                : BadRequest(new { message });
        }

        [Authorize(Roles = "Occupant")]

        [HttpDelete("members/{memberId:int}")]
        public async Task<IActionResult> RevokeMember(int memberId)
        {
            var occupantId = GetCurrentUserId();
            if (occupantId == null)
                return Forbid();

            var (success, message) =
                await _familyService.RevokeMemberAsync(occupantId.Value, memberId);

            return success
                ? Ok(new { message })
                : NotFound(new { message });
        }

       
        [HttpGet("validate-token")]
        public async Task<IActionResult> ValidateToken([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { message = "Missing token." });

            var (valid, email) =
                await _familyService.ValidateInvitationTokenAsync(token);

            if (!valid)
                return BadRequest(new { message = "Invalid or expired link." });

            return Ok(new { valid = true, email });
        }

        [HttpPost("accept-invitation")]
        public async Task<IActionResult> AcceptInvitation(
            [FromBody] AcceptInvitationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message) =
                await _familyService.AcceptInvitationAsync(dto);

            return success
                ? Ok(new { message })
                : BadRequest(new { message });
        }

        
        private int? GetCurrentUserId()
        {
            // Try common claim names used for user id: NameIdentifier, "id", and "sub" (JWT subject)
            var value = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("id")?.Value
                     ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                     ?? User.FindFirst("sub")?.Value;

            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
