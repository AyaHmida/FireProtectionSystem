using IoTFire.Backend.Api.Models.DTOs;

namespace IoTFire.Backend.Api.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
        Task SendPasswordResetEmailAsync(string toEmail, string firstName, string token);
    }
}
