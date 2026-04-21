using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{
    public class Measurement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }   // bigint car beaucoup de mesures

        [Required]
        [Column("sensor_id")]
        public int SensorId { get; set; }

        [ForeignKey("SensorId")]
        public Sensor? Sensor { get; set; }

        [Required]
        [Column("value")]
        public float Value { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("type_measure")]
        public string TypeMeasure { get; set; } = string.Empty;
        // ex: "TEMPERATURE", "HUMIDITY", "GAS"

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
