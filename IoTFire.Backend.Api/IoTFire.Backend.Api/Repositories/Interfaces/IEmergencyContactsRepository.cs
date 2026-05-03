using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IEmergencyContactsRepository
    {
        Task<IEnumerable<EmergencyContacts>> GetAllByUserIdAsync(int userId);
        Task<EmergencyContacts> AddAsync(EmergencyContacts contact);
        Task<bool> DeleteAsync(int id);
        Task<EmergencyContacts?> GetByIdAsync(int id);
    }
}
