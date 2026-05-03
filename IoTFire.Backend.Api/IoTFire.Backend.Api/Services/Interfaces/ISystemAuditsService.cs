namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface ISystemAuditsService
    {
        Task LogChangeAsync(bool newState, string? actionBy, string? reason);

    }
}
