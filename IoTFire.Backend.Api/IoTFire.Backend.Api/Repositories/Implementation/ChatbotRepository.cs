using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Repositories.Implementation
{
    public class ChatbotRepository : IChatbotRepository
    {
        private readonly AppDbContext _db;

        public ChatbotRepository(AppDbContext db)
        {
            _db = db;
        }

        // ── Persistance historique ──────────────────
        public async Task SaveMessageAsync(ChatMessage message)
        {
            await _db.ChatMessages.AddAsync(message);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ChatHistoryDto>> GetHistoryAsync(
            int userId, int page = 1, int pageSize = 20)
        {
            return await _db.ChatMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new ChatHistoryDto
                {
                    Id = m.Id,
                    UserMessage = m.UserMessage,
                    BotResponse = m.BotResponse,
                    DetectedIntent = m.DetectedIntent,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }

        // ── Données capteurs ────────────────────────
        public async Task<List<SensorDataDto>> GetAllSensorsStatusAsync()
        {
            var data = await _db.Sensors
                .Include(s => s.Zone)
                .Select(s => new
                {
                    Sensor = s,

                    Temperature = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "TEMPERATURE")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    Gas = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "GAS")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    Smoke = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "SMOKE")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    LastUpdate = _db.Measurements
                        .Where(m => m.SensorId == s.Id)
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (DateTime?)m.CreatedAt)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return data.Select(x => new SensorDataDto
            {
                SensorId = x.Sensor.Id,
                SensorName = x.Sensor.Label,
                ZoneName = x.Sensor.Zone != null ? x.Sensor.Zone.Name : "Inconnue",

                Temperature = x.Temperature ?? 0,
                GasLevel = x.Gas ?? 0,

                SmokeDetected = x.Smoke != null && x.Smoke > 0,

                Status = CalculateStatus(x.Temperature, x.Gas), // ✅ OK ici

                LastUpdate = x.LastUpdate ?? x.Sensor.UpdatedAt
            }).ToList();
        }
        public async Task<SensorDataDto?> GetSensorByZoneAsync(int zoneId)
        {
            return await _db.Sensors
                .Include(s => s.Zone)
                .Where(s => s.ZoneId == zoneId)
                .Select(s => new
                {
                    Sensor = s,

                    Temperature = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "TEMPERATURE")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    Gas = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "GAS")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    Smoke = _db.Measurements
                        .Where(m => m.SensorId == s.Id && m.TypeMeasure == "SMOKE")
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (float?)m.Value)
                        .FirstOrDefault(),

                    LastUpdate = _db.Measurements
                        .Where(m => m.SensorId == s.Id)
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => (DateTime?)m.CreatedAt)
                        .FirstOrDefault()
                })
                .Select(x => new SensorDataDto
                {
                    SensorId = x.Sensor.Id,
                    SensorName = x.Sensor.Label,
                    ZoneName = x.Sensor.Zone != null ? x.Sensor.Zone.Name : "Inconnue",

                    Temperature = x.Temperature ?? 0,
                    GasLevel = x.Gas ?? 0,
                    SmokeDetected = x.Smoke != null && x.Smoke > 0,

                    Status = CalculateStatus(x.Temperature, x.Gas),

                    LastUpdate = x.LastUpdate ?? x.Sensor.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        // ── Alertes ─────────────────────────────────
        public async Task<List<AlertSummaryDto>> GetRecentAlertsAsync(int count = 5)
        {
            return await _db.Alerts
                .Include(a => a.Zone)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .Select(a => new AlertSummaryDto
                {
                    AlertId = a.Id,
                    ZoneName = a.Zone != null ? a.Zone.Name : "Inconnue",
                    Type = a.Type,
                    Severity = a.Level,
                    IsResolved = a.IsRead,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<AlertSummaryDto>> GetActiveAlertsAsync()
        {
            return await _db.Alerts
                .Include(a => a.Zone)
                .Where(a => !a.IsRead)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AlertSummaryDto
                {
                    AlertId = a.Id,
                    ZoneName = a.Zone != null ? a.Zone.Name : "Inconnue",
                    Type = a.Type,
                    Severity = a.Level,
                    IsResolved = a.IsRead,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<int> GetActiveAlertCountAsync()
        {
            return await _db.Alerts.CountAsync(a => !a.IsRead);
        }
        private static string CalculateStatus(float? temp, float? gas)
        {
            if ((temp ?? 0) > 60 || (gas ?? 0) > 400)
                return "danger";

            if ((temp ?? 0) > 40 || (gas ?? 0) > 200)
                return "warning";

            return "normal";
        }
    }
}
