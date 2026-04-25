using IoTFire.Backend.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace IoTFire.Backend.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<Sensor> Sensors { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Measurement> Measurements { get; set; }
        public DbSet<MeasurementHistory> MeasurementHistory { get; set; }
        public DbSet<SensorConfiguration> SensorConfigurations { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<DeviceAudit> DeviceAudits { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email)
                      .IsUnique()
                      .HasDatabaseName("IX_users_email");

                entity.Property(u => u.Role)
                      .HasConversion<string>()
                      .HasMaxLength(20);

                entity.HasOne(u => u.ParentUser)
                      .WithMany()
                      .HasForeignKey(u => u.ParentUserId)
                      .OnDelete(DeleteBehavior.SetNull)
                      .IsRequired(false);

                entity.Property(u => u.IsActive)
                      .HasDefaultValue(true);

                entity.Property(u => u.CreatedAt)
                      .HasDefaultValueSql("NOW()");

                entity.Property(u => u.UpdatedAt)
                      .HasDefaultValueSql("NOW()");
                entity.HasOne(u => u.ParentUser).WithMany(u => u.FamilyMembers).HasForeignKey(u => u.ParentUserId)
                       .OnDelete(DeleteBehavior.Restrict).IsRequired(false);
            });

            modelBuilder.Entity<Zone>(entity =>
            {
                entity.Property(z => z.Name).HasMaxLength(100).IsRequired();
                entity.Property(z => z.Description).HasMaxLength(255);

                entity.HasOne(z => z.User)
                      .WithMany()
                      .HasForeignKey(z => z.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(z => z.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(z => z.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<Device>(entity =>
            {
                // DeviceId physique unique (ex: ESP32-001)
                entity.HasIndex(d => d.DeviceId)
                      .IsUnique()
                      .HasDatabaseName("IX_devices_device_id");

                entity.Property(d => d.DeviceId).HasMaxLength(50).IsRequired();
                entity.Property(d => d.Name).HasMaxLength(100).IsRequired();
                entity.Property(d => d.Description).HasMaxLength(255);
                entity.Property(d => d.IsOnline).HasDefaultValue(false);

                // Device → Zone (nullable)
                entity.HasOne(d => d.Zone)
                      .WithMany()
                      .HasForeignKey(d => d.ZoneId)
                      .OnDelete(DeleteBehavior.SetNull)
                      .IsRequired(false);

                entity.Property(d => d.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(d => d.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<Sensor>(entity =>
            {
                entity.Property(s => s.MacAddress).HasMaxLength(17).IsRequired();
                entity.Property(s => s.Label).HasMaxLength(100).IsRequired();

                entity.Property(s => s.Type).HasConversion<string>().HasMaxLength(50);
                entity.Property(s => s.Status).HasConversion<string>().HasMaxLength(50);

                // Sensor → Zone
                entity.HasOne(s => s.Zone)
                      .WithMany(z => z.Sensors)
                      .HasForeignKey(s => s.ZoneId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Device)
                      .WithMany(d => d.Sensors)
                      .HasForeignKey(s => s.DeviceId)
                      .OnDelete(DeleteBehavior.SetNull)
                      .IsRequired(false);

                entity.Property(s => s.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(s => s.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<Alert>(entity =>
            {
                entity.Property(a => a.DeviceId).HasMaxLength(100).IsRequired(false);
                entity.Property(a => a.Type).HasMaxLength(50).IsRequired();
                entity.Property(a => a.Message).HasMaxLength(500).IsRequired(false);
                entity.Property(a => a.CreatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<MeasurementHistory>(entity =>
            {
                entity.ToTable("measurement_history");
                entity.Property(m => m.Value).IsRequired();
                entity.Property(m => m.TypeMeasure).HasMaxLength(50).IsRequired(false);
                entity.Property(m => m.CreatedAt).HasDefaultValueSql("NOW()");
                entity.HasIndex(m => new { m.SensorId, m.CreatedAt }).HasDatabaseName("IX_measurement_history_sensor_createdat");
            });
        }
    }
}
