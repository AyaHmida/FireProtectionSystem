using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{
    [Table("devices")]
    public class Device
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>Identifiant physique unique (ex: ESP32-001)</summary>
        [Required]
        [MaxLength(50)]
        [Column("device_id")]
        public string DeviceId { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("description")]
        public string? Description { get; set; }

        [Column("is_online")]
        public bool IsOnline { get; set; } = false;

        [Column("zone_id")]
        public int? ZoneId { get; set; }

        [ForeignKey("ZoneId")]
        public Zone? Zone { get; set; }

        [Column("occupant_id")]
        public int? OccupantId { get; set; }

        [ForeignKey("OccupantId")]
        public User? Occupant { get; set; }

        public ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
