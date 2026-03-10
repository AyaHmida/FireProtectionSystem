using IoTFire.Backend.Api.Data;
using IoTFire.Backend.Api.Models.DTOs.FamillyMember;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace IoTFire.Backend.Api.Services.Implementation
{
    public class FamilyService : IFamilyService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public FamilyService(
            AppDbContext context,
            IEmailService emailService,
            IConfiguration config)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
        }

     
        public async Task<(bool Success, string Message)> InviteMemberAsync(
            int occupantId, InviteFamilyMemberDto dto)
        {
            // 1. Récupérer l'occupant pour personnaliser l'email
            var occupant = await _context.Users.FindAsync(occupantId);
            if (occupant == null)
                return (false, "Occupant not found.");

            // Normaliser l'email et générer un token URL-safe unique (pré-calculé pour réutilisation)
            var email = dto.Email?.Trim().ToLower() ?? string.Empty;
            var rawToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
                         + Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var token = rawToken.Replace("+", "-").Replace("/", "_").Replace("=", "");

            var frontendUrl = _config["App:FrontendUrl"] ?? "http://localhost:5173/";
            var invitationLink = $"{frontendUrl}/accept-invitation?token={token}";
            var emailSubject = $"Invitation to join the system {occupant.FirstName} {occupant.LastName}";
            var emailBody = BuildInvitationEmail(occupant, invitationLink);

            // 2. Vérifier si un compte (actif ou non) existe déjà avec cet email
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                if (existingUser.IsActive)
                {
                    return (false, "An active account already exists with this email address.");
                }

                // s'il s'agit déjà d'une invitation envoyée par le même occupant et non expirée
                if (existingUser.ParentUserId == occupantId && existingUser.TokenExpiration > DateTime.UtcNow)
                {
                    return (false, "An invitation is already pending for this email. Please wait until it expires or revoke it.");
                }

                // s'il s'agit d'une invitation expirée et appartenant au même occupant, réutiliser l'enregistrement
                if (existingUser.ParentUserId == occupantId && (existingUser.TokenExpiration == null || existingUser.TokenExpiration <= DateTime.UtcNow))
                {
                    existingUser.ResetToken = token;
                    existingUser.TokenExpiration = DateTime.UtcNow.AddHours(48);
                    existingUser.UpdatedAt = DateTime.UtcNow;
                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateException dbEx)
                    {
                        return (false, "Error updating the invitation in the database." + dbEx.Message);
                    }

                    // envoyer l'email d'invitation en réutilisant le lien
                    await _emailService.SendEmailAsync(email, emailSubject, emailBody);

                    return (true, "Invitation successfully resent. The link expires in 48 hours.");
                }

                // sinon l'email est déjà enregistré pour un autre occupant (ou situation ambiguë)
                return (false, "An account or invitation already exists for this email address.");
            }

            // 5. Créer l'utilisateur "fantôme" (invitation en attente)
            var pendingMember = new User
            {
                FirstName = "",               // sera rempli lors de l'acceptation
                LastName = "",               // sera rempli lors de l'acceptation
                Email = email,
                PasswordHash = "",           // sera rempli lors de l'acceptation
                PhoneNumber = "",               // sera rempli lors de l'acceptation
                Role = EnumRole.FamilyMember,
                ParentUserId = occupantId,
                ResetToken = token,        // réutilisation du champ pour le token d'invitation
                TokenExpiration = DateTime.UtcNow.AddHours(48),
                IsActive = false,            // compte inactif jusqu'à acceptation
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                _context.Users.Add(pendingMember);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                // Retourner une erreur lisible sans exposer les détails internes
                return (false, "Error creating the invitation in the database. Details:" + dbEx.Message);
            }

            // 6. Envoyer l'email d'invitation (déjà préparé)tt
            await _emailService.SendEmailAsync(email, emailSubject, emailBody);
            return (true, "Invitation sent successfully. The link expires in 48 hours.");
        }

       
        public async Task<FamilyListResponseDto> GetFamilyMembersAsync(int occupantId)
        {
            // Membres dont le compte est actif
            var activeMembers = await _context.Users
                .Where(u => u.ParentUserId == occupantId && u.IsActive)
                .Select(u => new FamilyMemberDto
                {
                    Id = u.Id,
                    LastName = u.LastName,
                    FirstName = u.FirstName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            // Invitations en attente (compte inactif, token pas encore expiré)
            var pendingInvitations = await _context.Users
                .Where(u =>
                    u.ParentUserId == occupantId &&
                    !u.IsActive &&
                    u.TokenExpiration > DateTime.UtcNow)
                .Select(u => new PendingInvitationDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    ExpiresAt = u.TokenExpiration!.Value,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return new FamilyListResponseDto
            {
                ActiveMembers = activeMembers,
                PendingInvitations = pendingInvitations
            };
        }

        
        public async Task<(bool Success, string Message)> RevokeMemberAsync(
            int occupantId, int memberId)
        {
            var member = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == memberId && u.ParentUserId == occupantId);

            if (member == null)
                return (false, "Membre introuvable ou non autorisé.");

            if (member.IsActive)
            {
                // Membre actif : désactiver son compte
                member.IsActive = false;
                member.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return (true, $"L'accès de {member.FirstName} {member.LastName} a été révoqué.");
            }
            else
            {
                // Invitation en attente : supprimer le User "fantôme"
                _context.Users.Remove(member);
                await _context.SaveChangesAsync();
                return (true, $"L'invitation pour {member.Email} a été annulée.");
            }
        }

        
        public async Task<(bool Valid, string Email)> ValidateInvitationTokenAsync(string token)
        {
            var pendingUser = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.ResetToken == token &&
                    !u.IsActive &&
                    u.TokenExpiration > DateTime.UtcNow);

            if (pendingUser == null)
                return (false, null);

            return (true, pendingUser.Email);
        }

       
        
        public async Task<(bool Success, string Message)> AcceptInvitationAsync(
            AcceptInvitationDto dto)
        {
            // 1. Retrouver le User fantôme
            var pendingUser = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.ResetToken == dto.Token &&
                    !u.IsActive &&
                    u.TokenExpiration > DateTime.UtcNow);

            if (pendingUser == null)
                return (false, "Invalid or expired link. Request a new invitation.");

            // 2. Compléter le profil
            pendingUser.LastName = dto.LastName;
            pendingUser.FirstName = dto.FirstName;
            pendingUser.PhoneNumber = dto.PhoneNumber ?? "";
            pendingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);

            // 3. Activer le compte et effacer le token
            pendingUser.IsActive = true;
            pendingUser.ResetToken = null;
            pendingUser.TokenExpiration = null;
            pendingUser.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Account successfully created. You can now log in.");
        }


        private string BuildInvitationEmail(User occupant, string link)
        {
            return $@"
    <html>
    <body style='font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;'>
      <div style='max-width:600px;margin:auto;background:white;border-radius:10px;
                  padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.1);'>

        <div style='text-align:center;margin-bottom:20px;'>
          <h2 style='color:#e74c3c;margin:0;'>Smart Fire Safety System</h2>
        </div>

        <p style='font-size:16px;'>Hello,</p>
        <p style='font-size:15px;'>
          <strong>{occupant.FirstName} {occupant.LastName}</strong> invites you to join 
          their smart fire monitoring system to help protect their home.
        </p>

        <div style='background:#fff5f5;border-left:4px solid #e74c3c;
                    padding:15px;margin:20px 0;border-radius:4px;'>
          <p style='margin:0;font-size:14px;line-height:1.6;'>
            • Real-time home monitoring<br/>
            • Instant alerts in case of danger<br/>
            • Access to incident history
          </p>
        </div>

        <div style='text-align:center;margin:30px 0;'>
          <a href='{link}'
             style='background-color:#e74c3c;color:white;padding:14px 32px;
                    text-decoration:none;border-radius:6px;font-size:16px;
                    font-weight:bold;display:inline-block;'>
            Create My Account
          </a>
        </div>

        <p style='color:#999;font-size:12px;text-align:center;margin-top:30px;'>
          This link is valid for <strong>48 hours</strong>.<br/>
          If you were not expecting this invitation, please ignore this email.
        </p>
      </div>
    </body>
    </html>";
        }

    }
}
