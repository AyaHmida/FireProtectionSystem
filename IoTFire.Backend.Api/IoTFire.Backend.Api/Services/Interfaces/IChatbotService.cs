using IoTFire.Backend.Api.Models.DTOs;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IChatbotService
    {
        Task<ChatResponseDto> ProcessMessageAsync(int userId, ChatRequestDto request);
        Task<List<ChatHistoryDto>> GetChatHistoryAsync(int userId, int page, int pageSize);
    }
}
