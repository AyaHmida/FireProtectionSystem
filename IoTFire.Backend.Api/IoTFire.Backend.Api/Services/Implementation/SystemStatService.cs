using IoTFire.Backend.Api.Models.DTOs.System;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class SystemStatService : ISystemStatService
    {
        private readonly ISystemStatRepository _stateRepo;
        private readonly ISystemAuditsService _auditService;

        public SystemStatService(ISystemStatRepository stateRepo, ISystemAuditsService auditService)
        {
            _stateRepo = stateRepo;
            _auditService = auditService;
        }

        public async Task<SystemStatDto> GetStatusAsync()
        {
            var state = await _stateRepo.GetStateAsync();
            if (state == null) throw new Exception("System state not initialized");
            return new SystemStatDto { Id = state.Id, IsActive = state.IsActive, UpdatedAt = state.UpdatedAt };
        }

        public async Task<SystemStatDto> ToggleStateAsync(ToggleSystemStatDtos dto)
        {
            var state = await _stateRepo.GetStateAsync();
            if (state == null)
            {
                state = new SystemStat { IsActive = dto.IsActive, UpdatedAt = DateTime.UtcNow };
                await _stateRepo.UpdateStateAsync(state);
            }
            else
            {
                state.IsActive = dto.IsActive;
                state.UpdatedAt = DateTime.UtcNow;
                await _stateRepo.UpdateStateAsync(state);
            }

            // create audit
            await _auditService.LogChangeAsync(state.IsActive, dto.ActionBy, dto.Reason);

            return new SystemStatDto { Id = state.Id, IsActive = state.IsActive, UpdatedAt = state.UpdatedAt };
        }
    }

}
