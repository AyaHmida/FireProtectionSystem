using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface ISystemAuditsRepository
    {
        Task AddAuditAsync(SystemAudits audit);
        Task<IEnumerable<SystemAudits>> GetAllAsync();
    }
}
