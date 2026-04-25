using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface IDeviceAuditRepository
    {
        Task AddAsync(DeviceAudit audit);
    }
}
