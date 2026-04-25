using MQTTnet.Client;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IMqttService
    {
        Task StartAsync();
        Task StopAsync();
        Task PublishAsync<T>(string topic, T payload);
    }
}
