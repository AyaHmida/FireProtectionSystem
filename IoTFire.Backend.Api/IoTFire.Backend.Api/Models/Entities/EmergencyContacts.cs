using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{

    [Table("emergency_contacts")]
    public class EmergencyContacts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Relationship { get; set; }

        public int UserId { get; set; }
    }
}
