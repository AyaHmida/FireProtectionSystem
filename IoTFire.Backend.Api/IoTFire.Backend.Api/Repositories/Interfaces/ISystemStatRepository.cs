using IoTFire.Backend.Api.Models.Entities;

namespace IoTFire.Backend.Api.Repositories.Interfaces
{
    public interface ISystemStatRepository
    {
        Task<SystemStat?> GetStateAsync();
        Task<SystemStat> UpdateStateAsync(SystemStat state);
    }
}
