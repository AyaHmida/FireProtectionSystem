using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Repositories.Interfaces;
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

        public AlertsController(IAlertRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("zone/{zoneId}")]
        public async Task<IActionResult> GetByZone(int zoneId, int page = 1, int pageSize = 50)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 200) pageSize = 50;

            var all = await _repo.GetAllAsync(null);
            var filtered = all.Where(a => a.ZoneId == zoneId).OrderByDescending(a => a.CreatedAt);
            var pageItems = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var dtos = pageItems.Select(a => new AlertDto
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
                IsRead = a.GetType().GetProperty("IsRead") != null && (bool)a.GetType().GetProperty("IsRead").GetValue(a)
            });

            return Ok(new { items = dtos, page, pageSize, total = filtered.Count() });
        }

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Occupant,FamilyMember")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var all = await _repo.GetAllAsync(null);
            var alert = all.FirstOrDefault(a => a.Id == id);
            if (alert == null) return NotFound();

            // set is read
            var prop = alert.GetType().GetProperty("IsRead");
            if (prop != null)
            {
                prop.SetValue(alert, true);
            }

            // persist update via repository (crud not present, so use direct context via repo implementation)
            if (_repo is IoTFire.Backend.Api.Repositories.Implementation.AlertRepository impl)
            {
                impl.SetModified(alert);
                await impl.SaveChangesAsync();
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
                IsRead = prop != null && (bool)prop.GetValue(alert)
            };

            return Ok(dto);
        }
    }
}
