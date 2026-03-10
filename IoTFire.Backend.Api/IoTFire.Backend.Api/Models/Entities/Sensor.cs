using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using IoTFire.Backend.Api.Models.Entities.Enums;

namespace IoTFire.Backend.Api.Models.Entities
{
    [Table("sensors")]
    public class Sensor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(17)]
        [Column("mac_address")]
        public string MacAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("label")]
        public string Label { get; set; } = string.Empty;

        [Column("type")]
        public SensorType Type { get; set; }

        [Column("status")]
        public SensorStatus Status { get; set; } = SensorStatus.OFFLINE;

        [Column("threshold_value")]
        public float ThresholdValue { get; set; }

        [Column("last_value")]
        public float LastValue { get; set; }

        // Clé étrangère vers Zone
        [Column("zone_id")]
        public int ZoneId { get; set; }

        [ForeignKey("ZoneId")]
        public Zone? Zone { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
