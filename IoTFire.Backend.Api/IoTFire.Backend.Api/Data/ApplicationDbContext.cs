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

            modelBuilder.Entity<Sensor>(entity =>
            {
                entity.Property(s => s.MacAddress).HasMaxLength(17).IsRequired();
                entity.Property(s => s.Label).HasMaxLength(100).IsRequired();

                entity.Property(s => s.Type).HasConversion<string>().HasMaxLength(50);
                entity.Property(s => s.Status).HasConversion<string>().HasMaxLength(50);

                entity.HasOne(s => s.Zone)
                      .WithMany(z => z.Sensors)
                      .HasForeignKey(s => s.ZoneId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(s => s.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(s => s.UpdatedAt).HasDefaultValueSql("NOW()");
            });
        }
    }
}
