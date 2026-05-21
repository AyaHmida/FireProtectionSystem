using IoTFire.Backend.Api.Models.DTOs.Emergency;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IEmergencyContactsService
    {
        Task<IEnumerable<EmergencyContactsDto>> GetContactsAsync(int userId);
        Task<EmergencyContactsDto> AddContactAsync(int userId, CreateEmergencyContactsDto dto);
        Task<bool> DeleteContactAsync(int id);
        Task<IEnumerable<CallSimulationResultDto>> SimulateCallAsync(int userId);
    }
}
