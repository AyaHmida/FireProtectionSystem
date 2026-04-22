using IoTFire.Backend.Api.Models.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace IoTFire.Backend.Api.Services.Implementation.SignalR
{
    public class RealtimeHub : Hub
    {
        public const string HubUrl = "/hubs/realtime";

        public override async Task OnConnectedAsync()
        {
            var http = Context.GetHttpContext();
            if (http != null)
            {
                var qs = http.Request.Query;
                if (qs.TryGetValue("zoneId", out var zoneValues))
                {
                    if (int.TryParse(zoneValues.FirstOrDefault(), out var zoneId))
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, $"zone-{zoneId}");
                    }
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Optionally: client should leave groups explicitly; here we rely on connection removal
            await base.OnDisconnectedAsync(exception);
        }

        // Server method example to join a zone group
        public Task JoinZone(int zoneId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, $"zone-{zoneId}");
        }
    }
}
