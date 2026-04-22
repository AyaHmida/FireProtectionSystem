using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{
    [Table("measurement_history")]
    public class MeasurementHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("sensor_id")]
        public int SensorId { get; set; }

        [ForeignKey("SensorId")]
        public Sensor? Sensor { get; set; }

        [Required]
        [Column("value")]
        public float Value { get; set; }

        [MaxLength(50)]
        [Column("type_measure")]
        public string? TypeMeasure { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
