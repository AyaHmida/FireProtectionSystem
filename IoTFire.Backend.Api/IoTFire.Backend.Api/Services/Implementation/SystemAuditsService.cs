using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class SystemAuditsService : ISystemAuditsService
    {
        private readonly ISystemAuditsRepository _repo;

        public SystemAuditsService(ISystemAuditsRepository repo)
        {
            _repo = repo;
        }

        public async Task LogChangeAsync(bool newState, string? actionBy, string? reason)
        {
            var audit = new SystemAudits
            {
                NewState = newState,
                ActionBy = actionBy ?? "SYSTEM",
                Reason = reason ?? string.Empty,
                Timestamp = DateTime.UtcNow
            };

            await _repo.AddAuditAsync(audit);
        }
    }

}
