using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IChatbotRepository
    {
        Task SaveMessageAsync(ChatMessage message);
        Task<List<ChatHistoryDto>> GetHistoryAsync(int userId, int page = 1, int pageSize = 20);
        Task<List<SensorDataDto>> GetAllSensorsStatusAsync();
        Task<SensorDataDto?> GetSensorByZoneAsync(int zoneId);
        Task<List<AlertSummaryDto>> GetRecentAlertsAsync(int count = 5);
        Task<List<AlertSummaryDto>> GetActiveAlertsAsync();
        Task<int> GetActiveAlertCountAsync();
    }
}
