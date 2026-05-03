using IoTFire.Backend.Api.Models.DTOs.System;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemAuditsController : ControllerBase
    {
        private readonly ISystemAuditsService _service;

        public SystemAuditsController(ISystemAuditsService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> LogChange([FromBody] LogAuditDto dto)
        {
            await _service.LogChangeAsync(dto.NewState, dto.ActionBy, dto.Reason);
            return Ok(new { message = "Audit logged successfully" });
        }
    }
}
