using IoTFire.Backend.Api.Models.DTOs.Emergency;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class EmergencyContactsService : IEmergencyContactsService
    {
        private readonly IEmergencyContactsRepository _repo;

        public EmergencyContactsService(IEmergencyContactsRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<EmergencyContactsDto>> GetContactsAsync(int userId)
        {
            var list = await _repo.GetAllByUserIdAsync(userId);
            return list.Select(c => new EmergencyContactsDto
            {
                Id = c.Id,
                Name = c.Name,
                PhoneNumber = c.PhoneNumber,
                Relationship = c.Relationship,
                UserId = c.UserId
            });
        }

        public async Task<EmergencyContactsDto> AddContactAsync(int userId, CreateEmergencyContactsDto dto)
        {
            // basic phone validation
            if (string.IsNullOrWhiteSpace(dto.PhoneNumber)) throw new ArgumentException("Phone number required");
            var cleaned = new string(dto.PhoneNumber.Where(char.IsDigit).ToArray());
            if (cleaned.Length < 8) throw new ArgumentException("Invalid phone number");

            var entity = new EmergencyContacts
            {
                Name = dto.Name,
                PhoneNumber = cleaned,
                Relationship = dto.Relationship,
                UserId = userId
            };

            var created = await _repo.AddAsync(entity);
            return new EmergencyContactsDto
            {
                Id = created.Id,
                Name = created.Name,
                PhoneNumber = created.PhoneNumber,
                Relationship = created.Relationship,
                UserId = created.UserId
            };
        }

        public async Task<bool> DeleteContactAsync(int id)
        {
            return await _repo.DeleteAsync(id);
        }

        public async Task<IEnumerable<(string PhoneNumber, DateTime Timestamp)>> SimulateCallAsync(int userId)
        {
            var contacts = await _repo.GetAllByUserIdAsync(userId);
            var result = new List<(string, DateTime)>();
            foreach (var c in contacts)
            {
                // simulate a call
                result.Add((c.PhoneNumber, DateTime.UtcNow));
            }
            return result;
        }
    }

}
