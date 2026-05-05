using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IoTFire.Backend.Api.Models.Entities
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } 

        [Required]
        [MaxLength(1000)]
        public string UserMessage { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string BotResponse { get; set; } = string.Empty;

        /// Intent détecté par le moteur de mots-clés (ex: "temperature", "alert", "security").
        [MaxLength(100)]
        public string? DetectedIntent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
