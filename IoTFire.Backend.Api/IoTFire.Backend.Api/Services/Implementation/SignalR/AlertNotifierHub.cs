using IoTFire.Backend.Api.Models.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace IoTFire.Backend.Api.Services.Implementation.SignalR
{
    public class AlertNotifierHub : Hub
    {
        public const string HubUrl = "/hubs/alerts";

        public async Task SendAlert(AlertDto alert)
        {
            await Clients.All.SendAsync("AlertReceived", alert);
        }
    }
}
