using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace IoTFire.Backend.Api.Services.Implementation.SignalR
{
    public class SignalRAlertNotifier : IAlertNotifier
    {
        private readonly IHubContext<AlertNotifierHub> _hub;

        public SignalRAlertNotifier(IHubContext<AlertNotifierHub> hub)
        {
            _hub = hub;
        }

        public async Task NotifyAsync(AlertDto alert)
        {
            await _hub.Clients.All.SendAsync("AlertReceived", alert);

            if (alert.ZoneId.HasValue)
            {
                await _hub.Clients.All.SendAsync("ZoneUpdated", new
                {
                    id = alert.ZoneId.Value,
                    status = alert.Level,   // "CRITICAL", "ALERT", "PRE_ALERT", "NORMAL"
                    name = alert.Message  
                });
            }
        }
    }
}
