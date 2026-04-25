using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Implementation;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertsController : ControllerBase
    {
        private readonly IAlertRepository _repo;
        private readonly IAlertService _alertService;

        public AlertsController(IAlertRepository repo, IAlertService alertService)
        {
            _repo = repo;
            _alertService = alertService;
        }

        [HttpGet("zone/{zoneId}")]
        public async Task<IActionResult> GetByZone(int zoneId, int page = 1, int pageSize = 50)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 200) pageSize = 50;

            var (items, total) = await _repo.GetByZoneAsync(zoneId, page, pageSize);

            var dtos = items.Select(a => new AlertDto
            {
                Id = a.Id,
                ZoneId = a.ZoneId,
                DeviceId = a.DeviceId ?? string.Empty,
                SensorId = a.SensorId,
                Type = a.Type,
                Value = a.Value,
                Level = a.Level,
                Message = a.Message,
                CreatedAt = a.CreatedAt,
                IsRead = a.IsRead
            });

            return Ok(new { items = dtos, page, pageSize, total });
        }

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Occupant,FamilyMember")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var alert = await _repo.GetByIdAsync(id);
            if (alert == null) return NotFound();

            if (!alert.IsRead)
            {
                alert.IsRead = true;
                await _repo.UpdateAsync(alert);
            }

            var dto = new AlertDto
            {
                Id = alert.Id,
                ZoneId = alert.ZoneId,
                DeviceId = alert.DeviceId ?? string.Empty,
                SensorId = alert.SensorId,
                Type = alert.Type,
                Value = alert.Value,
                Level = alert.Level,
                Message = alert.Message,
                CreatedAt = alert.CreatedAt,
                IsRead = alert.IsRead
            };

            return Ok(dto);
        }

       
    }
}
