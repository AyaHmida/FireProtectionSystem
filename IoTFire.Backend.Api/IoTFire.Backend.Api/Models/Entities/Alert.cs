using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{
    [Table("alerts")]
    public class Alert
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("device_id")]
        public string? DeviceId { get; set; }

        [Column("sensor_id")]
        public int SensorId { get; set; }

        [Column("type")]
        public string Type { get; set; } = string.Empty;

        [Column("value")]
        public float Value { get; set; }

        [Column("level")]
        public string Level { get; set; } = string.Empty;

        [Column("message")]
        public string Message { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
