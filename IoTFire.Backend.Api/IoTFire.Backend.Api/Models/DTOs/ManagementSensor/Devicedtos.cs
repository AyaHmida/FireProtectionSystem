namespace IoTFire.Backend.Api.Models.DTOs.ManagementSensor
{
    using System.ComponentModel.DataAnnotations;

   
    public class CreateDeviceDto
    {
        [Required(ErrorMessage = "Le DeviceId est obligatoire.")]
        [MaxLength(50, ErrorMessage = "Le DeviceId ne peut pas dépasser 50 caractères.")]
        public string DeviceId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le nom est obligatoire.")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;


        [MaxLength(255)]
        public string? Description { get; set; }
        [Required]
        public int OccupantUserId { get; set; }
    }

    // ──────────────────────────────────────────────
    //  Association device → zone  (US-A3)
    // ──────────────────────────────────────────────
    public class AssignDeviceToZoneDto
    {
        [Required(ErrorMessage = "L'identifiant de la zone est obligatoire.")]
        [Range(1, int.MaxValue)]
        public int ZoneId { get; set; }
    }

    // ──────────────────────────────────────────────
    //  Réponse client
    // ──────────────────────────────────────────────
    public class DeviceResponseDto
    {
        public int Id { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsOnline { get; set; }
        public string Status => IsOnline ? "En ligne" : "Hors ligne";

        // Zone associée
        public int? ZoneId { get; set; }
        public string? ZoneName { get; set; }

        // Occupant propriétaire de la zone
        public int? OccupantId { get; set; }
        public string? OccupantName { get; set; }

        // Nombre de capteurs branchés sur ce device
        public int SensorCount { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
