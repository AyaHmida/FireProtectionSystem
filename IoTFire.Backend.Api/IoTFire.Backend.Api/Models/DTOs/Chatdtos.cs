using System.ComponentModel.DataAnnotations;

namespace IoTFire.Backend.Api.Models.DTOs
{
    public class ChatRequestDto
    {
        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;

        /// Optionnel : identifiant de la zone IoT ciblée.
        public int? ZoneId { get; set; }
    }

    //  Réponse : réponse du bot + données enrichies
    public class ChatResponseDto
    {
        public string Response { get; set; } = string.Empty;

        /// <summary>Intent détecté (affichage debug / UX).</summary>
        public string Intent { get; set; } = string.Empty;

        /// <summary>Données IoT annexées à la réponse (température, gaz…).</summary>
        public object? Data { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        /// <summary>Suggestions de questions de suivi affichées sous la réponse.</summary>
        public List<string> QuickReplies { get; set; } = new();
    }

    //  Historique du chat
    public class ChatHistoryDto
    {
        public int Id { get; set; }
        public string UserMessage { get; set; } = string.Empty;
        public string BotResponse { get; set; } = string.Empty;
        public string? DetectedIntent { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    //  Données capteur enrichies dans la réponse
    public class SensorDataDto
    {
        public int SensorId { get; set; }
        public string SensorName { get; set; } = string.Empty;
        public string ZoneName { get; set; } = string.Empty;
        public double Temperature { get; set; }
        public double GasLevel { get; set; }
        public bool SmokeDetected { get; set; }
        public string Status { get; set; } = string.Empty;   // "normal" | "warning" | "danger"
        public DateTime LastUpdate { get; set; }
    }

    //  Alerte résumée
    public class AlertSummaryDto
    {
        public int AlertId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;     // "fire" | "gas" | "smoke"
        public string Severity { get; set; } = string.Empty; // "low" | "medium" | "high"
        public bool IsResolved { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
