using IoTFire.Backend.Api.Helpers;
using IoTFire.Backend.Api.Models.DTOs.Auth;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Models.Entities.Enums;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;
using System.Security.Cryptography;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AuthService> _logger;
        private readonly JwtHelper _jwtHelper;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;



        public AuthService(
            IUserRepository userRepository, JwtHelper jwtHelper,
            ILogger<AuthService> logger , IEmailService emailService)
        {
            _userRepository = userRepository;
            _logger = logger;
            _jwtHelper = jwtHelper;
            _emailService = emailService;

        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
        {            
            bool emailExists = await _userRepository.EmailExistsAsync(request.Email);
            if (emailExists)
            {
                _logger.LogWarning(
                    "[Register] Email already in use: {Email}", request.Email);
                throw new InvalidOperationException(
                    $"Email '{request.Email}' is already registered.");
            }
            if (request.ParentUserId.HasValue)
            {
                var parentExists = await _userRepository
                    .GetByIdAsync(request.ParentUserId.Value);

                if (parentExists == null)
                {
                    throw new InvalidOperationException(
                        $"Parent user with ID {request.ParentUserId} not found.");
                }
            }
            string hashedPassword = PasswordHelper.HashPassword(request.Password);

            
            var newUser = new User
            {
                LastName = request.LastName.Trim(),
                FirstName = request.FirstName.Trim(),
                Email = request.Email.Trim().ToLower(),
                PasswordHash = hashedPassword,
                PhoneNumber = request.PhoneNumber?.Trim(),
                Role = request.Role,
                ParentUserId = request.ParentUserId,
                // Admin accounts (and family members) are active immediately.
                // Occupant accounts require admin validation.
                IsActive = request.Role != EnumRole.Occupant,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

           
            User createdUser = await _userRepository.CreateAsync(newUser);

            _logger.LogInformation(
                "[Register] New user registered → ID: {Id} | Email: {Email} | Role: {Role}",
                createdUser.Id, createdUser.Email, createdUser.Role);

           
            return new RegisterResponseDto
            {
                Id = createdUser.Id,
                LastName = createdUser.LastName,
                FirstName = createdUser.FirstName,
                Email = createdUser.Email,
                PhoneNumber = createdUser.PhoneNumber,
                Role = createdUser.Role,
                IsActive = createdUser.IsActive,
                CreatedAt = createdUser.CreatedAt
            };
        }
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null ||
                !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Incorrect email or password."
                };

            if (!user.IsActive)
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Your account is awaiting validation by an administrator."
                };
            if (user.IsSuspended)
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Your account has been suspended. Reason: {user.SuspensionReason}"
                };


            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Connection successful.",
                Token = token,
                User = MapToDto(user)
            };
        }

        public async Task<(bool Success, string? Error)> ChangePasswordAsync(
            int userId, ChangePasswordDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return (false, "Utilisateur introuvable.");

            bool isCurrentValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
            if (!isCurrentValid)
                return (false, "Mot de passe actuel incorrect.");

            bool isSamePassword = BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.PasswordHash);
            if (isSamePassword)
                return (false, "Le nouveau mot de passe doit être différent de l'ancien.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return (true, null);
        }

        public async Task<(bool Success, string Message)> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email.Trim().ToLower());

            if (user == null || !user.IsActive || user.IsDeleted)
            {
                _logger.LogWarning("[ForgotPassword] Email non trouvé ou compte inactif : {Email}", email);
                return (true, "Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.");
            }

            // Générer un token sécurisé
            var rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

            user.ResetToken = rawToken;
            user.TokenExpiration = DateTime.UtcNow.AddHours(1);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            // EmailService construit le lien et envoie l'email ✅
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.FirstName, rawToken);

            _logger.LogInformation("[ForgotPassword] Token envoyé à {Email}", user.Email);

            return (true, "Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.");
        }

        public async Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userRepository.GetByResetTokenAsync(dto.Token);

            if (user == null)
            {
                _logger.LogWarning("[ResetPassword] Token invalide : {Token}", dto.Token);
                return (false, "Lien de réinitialisation invalide.");
            }

            if (user.TokenExpiration == null || user.TokenExpiration < DateTime.UtcNow)
            {
                _logger.LogWarning("[ResetPassword] Token expiré pour {Email}", user.Email);
                // Nettoyer le token expiré
                user.ResetToken = null;
                user.TokenExpiration = null;
                await _userRepository.UpdateAsync(user);
                return (false, "Ce lien a expiré. Veuillez refaire une demande.");
            }

            // Vérifier que le nouveau mot de passe est différent de l'ancien
            bool isSamePassword = BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.PasswordHash);
            if (isSamePassword)
                return (false, "Le nouveau mot de passe doit être différent de l'ancien.");

            // Mettre à jour le mot de passe et effacer le token
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.TokenExpiration = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("[ResetPassword] Mot de passe réinitialisé pour {Email}", user.Email);

            return (true, "Mot de passe réinitialisé avec succès.");
        }
        private static UserDto MapToDto(User user) => new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString()
         };
    }

}


