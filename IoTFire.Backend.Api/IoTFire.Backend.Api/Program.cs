using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Helpers;
using IoTFire.Backend.Api.Repositories.Implementation;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Implementation;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
//PostgrSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorCodesToAdd: null);
        }
    )
);
// Add services and repositories (Injection de dependances)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IFamilyService, FamilyService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Sensors
builder.Services.AddScoped<ISensorRepository, SensorRepository>();
builder.Services.AddScoped<ISensorService, SensorService>();

// Zones
builder.Services.AddScoped<IZoneRepository, ZoneRepository>();
builder.Services.AddScoped<IZoneService, ZoneService>();

// Devices
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<IDeviceService, DeviceService>();

// Measurements
builder.Services.AddScoped<IMeasurementRepository, MeasurementRepository>();
builder.Services.AddScoped<IMeasurementService, MeasurementService>();

// SensorConfiguration
builder.Services.AddScoped<ISensorConfigurationRepository, SensorConfigurationRepository>();
builder.Services.AddScoped<ISensorConfigurationService, SensorConfigurationService>();

// Mqtt service
builder.Services.AddSingleton<IMqttService,MqttService>();
// Alert service
builder.Services.AddScoped<IAlertService, AlertService>();
// Alert repository
builder.Services.AddScoped<IDeviceControlService, DeviceControlService>();
builder.Services.AddScoped<IDeviceAuditRepository, DeviceAuditRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();
//Contact d'urgence
builder.Services.AddScoped<IEmergencyContactsRepository, EmergencyContactsRepository>();
builder.Services.AddScoped<IEmergencyContactsService, EmergencyContactsService>();
//system audit
builder.Services.AddScoped<ISystemAuditsRepository, SystemAuditsRepository>();
builder.Services.AddScoped<ISystemAuditsService, SystemAuditsService>();
// System state & audits
// builder.Services.AddScoped<ISystemStateRepository, SystemStateRepository>();
// builder.Services.AddScoped<ISystemAuditRepository, SystemAuditRepository>();
// builder.Services.AddScoped<ISystemStateService, SystemStateService>();
// builder.Services.AddScoped<ISystemAuditService, SystemAuditService>();

// Emergency contacts
// builder.Services.AddScoped<IEmergencyContactRepository, EmergencyContactRepository>();
// builder.Services.AddScoped<IEmergencyContactService, EmergencyContactService>();

//system stat
builder.Services.AddScoped<ISystemStatService, SystemStatService>();
builder.Services.AddScoped<ISystemStatRepository, SystemStatRepository>();
// SignalR notifier
builder.Services.AddSignalR();
builder.Services.AddSingleton<IAlertNotifier, IoTFire.Backend.Api.Services.Implementation.SignalR.SignalRAlertNotifier>();
// SignalR
builder.Services.AddSignalR();

//configuration de jwt 
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero 
    };
});
builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
//cros pour react frontEnd
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins(
                            "http://localhost:5173",
                            "http://localhost:8081",
                            "http://192.168.1.107:8081")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// Start MQTT when app starts
var mqtt = app.Services.GetRequiredService<IMqttService>();
_ = mqtt.StartAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();       
app.UseAuthorization();

app.MapControllers();
app.MapHub<IoTFire.Backend.Api.Services.Implementation.SignalR.AlertNotifierHub>(IoTFire.Backend.Api.Services.Implementation.SignalR.AlertNotifierHub.HubUrl);
app.MapHub<IoTFire.Backend.Api.Services.Implementation.SignalR.RealtimeHub>(IoTFire.Backend.Api.Services.Implementation.SignalR.RealtimeHub.HubUrl);

app.Lifetime.ApplicationStopping.Register(() => mqtt.StopAsync().Wait());

app.Run();
