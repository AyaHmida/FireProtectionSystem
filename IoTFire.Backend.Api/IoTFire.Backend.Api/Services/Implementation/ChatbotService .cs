using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Models.Entities;
using IoTFire.Backend.Api.Repositories.Interfaces;
using IoTFire.Backend.Api.Services.Interfaces;

namespace IoTFire.Backend.Api.Services.Implementation
{
    public class ChatbotService : IChatbotService
    {
        private readonly IChatbotRepository _repo;
        private readonly ILogger<ChatbotService> _logger;

        // ── Dictionnaire d'intentions ───────────────
        // Chaque intent → liste de mots-clés déclencheurs (FR + EN)
        private static readonly Dictionary<string, string[]> _intents = new()
        {
            ["temperature"] = ["température", "temp", "chaud", "froid", "degré", "thermique",
                                  "temperature", "heat", "warm", "cold"],
            ["gas"] = ["gaz", "co", "monoxyde", "fumée", "smoke", "gas", "fuite"],
            ["alert"] = ["alerte", "alarme", "danger", "urgence", "incendie", "feu",
                                  "alert", "fire", "emergency"],
            ["history"] = ["historique", "passé", "dernières alertes", "journal", "log",
                                  "history", "past"],
            ["status"] = ["état", "statut", "zones", "capteurs", "système", "status",
                                  "system", "sensors", "overview"],
            ["security_tips"] = ["que faire", "procédure", "conseils", "sécurité", "evacuation",
                                  "tips", "safety", "procedure", "help"],
            ["greeting"] = ["bonjour", "salut", "hello", "hi", "bonsoir", "hey"],
            ["help"] = ["aide", "help", "commandes", "quoi demander", "fonctionnalités"],
        };

        public ChatbotService(IChatbotRepository repo, ILogger<ChatbotService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        //  Point d'entrée principal
        public async Task<ChatResponseDto> ProcessMessageAsync(int userId, ChatRequestDto request)
        {
            var input = request.Message.ToLowerInvariant().Trim();
            var intent = DetectIntent(input);

            _logger.LogInformation("User={User} | Intent={Intent} | Msg={Msg}", userId, intent, input);

            // Construire la réponse selon l'intent
            var response = intent switch
            {
                "temperature" => await HandleTemperatureAsync(request.ZoneId),
                "gas" => await HandleGasAsync(request.ZoneId),
                "alert" => await HandleAlertAsync(),
                "history" => await HandleHistoryAsync(),
                "status" => await HandleStatusAsync(),
                "security_tips" => HandleSecurityTips(),
                "greeting" => HandleGreeting(),
                "help" => HandleHelp(),
                _ => HandleUnknown()
            };

            // Persister en base
            await _repo.SaveMessageAsync(new ChatMessage
            {
                UserId = userId,
                UserMessage = request.Message,
                BotResponse = response.Response,
                DetectedIntent = intent,
                CreatedAt = DateTime.UtcNow
            });

            return response;
        }

        public async Task<List<ChatHistoryDto>> GetChatHistoryAsync(
            int userId, int page, int pageSize)
        {
            return await _repo.GetHistoryAsync(userId, page, pageSize);
        }

        // ──────────────────────────────────────────
        //  Détection d'intent (mots-clés)
        // ──────────────────────────────────────────
        private static string DetectIntent(string input)
        {
            foreach (var (intent, keywords) in _intents)
                if (keywords.Any(k => input.Contains(k)))
                    return intent;
            return "unknown";
        }

        // ──────────────────────────────────────────
        //  Handlers
        // ──────────────────────────────────────────
        private async Task<ChatResponseDto> HandleTemperatureAsync(int? zoneId)
        {
            List<SensorDataDto> sensors;
            if (zoneId.HasValue)
            {
                var s = await _repo.GetSensorByZoneAsync(zoneId.Value);
                sensors = s is null ? [] : [s];
            }
            else
            {
                sensors = await _repo.GetAllSensorsStatusAsync();
            }

            if (!sensors.Any())
                return new ChatResponseDto
                {
                    Response = "🔍 Aucun capteur trouvé pour cette zone.",
                    Intent = "temperature",
                    QuickReplies = ["État général", "Voir les alertes"]
                };

            var lines = sensors.Select(s =>
                $"• {s.ZoneName} : {s.Temperature:F1}°C — {StatusEmoji(s.Status)} {s.Status}");

            var maxTemp = sensors.Max(s => s.Temperature);
            var warning = maxTemp > 60
                ? $"\n⚠️ Température critique détectée ({maxTemp:F1}°C) !"
                : "";

            return new ChatResponseDto
            {
                Response = $"🌡️ Températures actuelles :\n{string.Join("\n", lines)}{warning}",
                Intent = "temperature",
                Data = sensors,
                QuickReplies = ["État des gaz", "Voir les alertes", "Que faire en cas d'incendie ?"]
            };
        }

        private async Task<ChatResponseDto> HandleGasAsync(int? zoneId)
        {
            var sensors = zoneId.HasValue
                ? new List<SensorDataDto?> { await _repo.GetSensorByZoneAsync(zoneId.Value) }
                    .Where(s => s is not null).Cast<SensorDataDto>().ToList()
                : await _repo.GetAllSensorsStatusAsync();

            if (!sensors.Any())
                return new ChatResponseDto
                {
                    Response = "🔍 Aucun capteur de gaz trouvé.",
                    Intent = "gas"
                };

            var lines = sensors.Select(s =>
            {
                var smoke = s.SmokeDetected ? "🔥 Fumée détectée !" : "✅ Pas de fumée";
                return $"• {s.ZoneName} : Gaz {s.GasLevel:F0} ppm — {smoke}";
            });

            var hasDanger = sensors.Any(s => s.SmokeDetected || s.GasLevel > 400);
            var advice = hasDanger
                ? "\n🚨 DANGER : Évacuez immédiatement et appelez le 197 !"
                : "\n✅ Niveaux de gaz normaux.";

            return new ChatResponseDto
            {
                Response = $"💨 État des capteurs de gaz :\n{string.Join("\n", lines)}{advice}",
                Intent = "gas",
                Data = sensors,
                QuickReplies = ["Températures", "Alertes actives", "Que faire ?"]
            };
        }

        private async Task<ChatResponseDto> HandleAlertAsync()
        {
            var active = await _repo.GetActiveAlertsAsync();
            var recent = await _repo.GetRecentAlertsAsync(5);
            var count = active.Count;

            string body;
            if (count == 0)
            {
                body = "✅ Aucune alerte active. Votre habitation est sécurisée.\n\n" +
                       "📋 Dernières alertes résolues :\n" +
                       string.Join("\n", recent.Select(a =>
                           $"• [{a.CreatedAt:dd/MM HH:mm}] {a.ZoneName} — {a.Type} ({a.Severity})"));
            }
            else
            {
                var alertLines = active.Select(a =>
                    $"🔴 {a.ZoneName} — {AlertEmoji(a.Type)} {a.Type.ToUpper()} [{a.Severity}]");
                body = $"🚨 {count} alerte(s) ACTIVE(S) !\n{string.Join("\n", alertLines)}\n" +
                       "\n⚠️ Contactez immédiatement les secours si nécessaire.";
            }

            return new ChatResponseDto
            {
                Response = body,
                Intent = "alert",
                Data = new { ActiveAlerts = active, RecentAlerts = recent },
                QuickReplies = ["Que faire en cas d'incendie ?", "Températures", "État général"]
            };
        }

        private async Task<ChatResponseDto> HandleHistoryAsync()
        {
            var alerts = await _repo.GetRecentAlertsAsync(10);

            if (!alerts.Any())
                return new ChatResponseDto
                {
                    Response = "📋 Aucune alerte dans l'historique.",
                    Intent = "history",
                    QuickReplies = ["État général", "Aide"]
                };

            var lines = alerts.Select(a =>
                $"{(a.IsResolved ? "✅" : "🔴")} [{a.CreatedAt:dd/MM HH:mm}] {a.ZoneName} — {a.Type} ({a.Severity})");

            return new ChatResponseDto
            {
                Response = $"📋 Historique des 10 dernières alertes :\n{string.Join("\n", lines)}",
                Intent = "history",
                Data = alerts,
                QuickReplies = ["Alertes actives", "État général"]
            };
        }

        private async Task<ChatResponseDto> HandleStatusAsync()
        {
            var sensors = await _repo.GetAllSensorsStatusAsync();
            var alertCount = await _repo.GetActiveAlertCountAsync();
            var dangerCount = sensors.Count(s => s.Status == "danger");
            var warningCount = sensors.Count(s => s.Status == "warning");
            var normalCount = sensors.Count(s => s.Status == "normal");

            var globalStatus = dangerCount > 0 ? "🔴 DANGER"
                : warningCount > 0 ? "🟡 ATTENTION"
                : "🟢 NORMAL";

            return new ChatResponseDto
            {
                Response = $"📊 État global du système : {globalStatus}\n\n" +
                           $"🔌 Capteurs actifs : {sensors.Count}\n" +
                           $"  • 🟢 Normal    : {normalCount}\n" +
                           $"  • 🟡 Attention : {warningCount}\n" +
                           $"  • 🔴 Danger    : {dangerCount}\n\n" +
                           $"🚨 Alertes actives : {alertCount}",
                Intent = "status",
                Data = new { SensorCount = sensors.Count, alertCount, dangerCount },
                QuickReplies = ["Voir les températures", "Voir les alertes", "Aide"]
            };
        }

        private static ChatResponseDto HandleSecurityTips()
        {
            return new ChatResponseDto
            {
                Response = "🛡️ Procédures de sécurité incendie :\n\n" +
                           "En cas d'alarme :\n" +
                           "1. ✅ Gardez votre calme\n" +
                           "2. 🚪 Fermez les portes derrière vous\n" +
                           "3. 🚶 Évacuez par les issues de secours\n" +
                           "4. 🚫 N'utilisez pas l'ascenseur\n" +
                           "5. 📞 Appelez le 197 (pompiers)\n\n" +
                           "⚠️ Si fumée dans le couloir :\n" +
                           "• Restez bas (l'air est plus pur)\n" +
                           "• Signalez-vous à une fenêtre\n\n" +
                           "🏠 Prévention :\n" +
                           "• Testez vos détecteurs chaque mois\n" +
                           "• Ne laissez pas de sources de chaleur sans surveillance",
                Intent = "security_tips",
                QuickReplies = ["État des capteurs", "Alertes actives", "Températures"]
            };
        }

        private static ChatResponseDto HandleGreeting()
        {
            return new ChatResponseDto
            {
                Response = "👋 Bonjour ! Je suis votre assistant sécurité incendie.\n\n" +
                           "Je peux vous aider à :\n" +
                           "🌡️ Consulter les températures\n" +
                           "💨 Vérifier les niveaux de gaz\n" +
                           "🚨 Suivre les alertes\n" +
                           "📋 Voir l'historique\n" +
                           "🛡️ Obtenir des conseils de sécurité\n\n" +
                           "Que puis-je faire pour vous ?",
                Intent = "greeting",
                QuickReplies = ["État général", "Alertes actives", "Températures", "Aide"]
            };
        }

        private static ChatResponseDto HandleHelp()
        {
            return new ChatResponseDto
            {
                Response = "ℹ️ Voici ce que vous pouvez me demander :\n\n" +
                           "🌡️ \"Quelle est la température ?\"\n" +
                           "💨 \"État des capteurs de gaz\"\n" +
                           "🚨 \"Y a-t-il des alertes actives ?\"\n" +
                           "📋 \"Montre l'historique des alertes\"\n" +
                           "📊 \"État général du système\"\n" +
                           "🛡️ \"Que faire en cas d'incendie ?\"\n",
                Intent = "help",
                QuickReplies = ["État général", "Températures", "Alertes"]
            };
        }

        private static ChatResponseDto HandleUnknown()
        {
            return new ChatResponseDto
            {
                Response = " Je n'ai pas compris votre demande.\n" +
                           "Essayez : \"état général\", \"températures\", \"alertes\" ou \"aide\".",
                Intent = "unknown",
                QuickReplies = ["État général", "Aide", "Alertes"]
            };
        }

        // ── Helpers ─────────────────────────────────
        private static string StatusEmoji(string status) => status switch
        {
            "danger" => "🔴",
            "warning" => "🟡",
            _ => "🟢"
        };

        private static string AlertEmoji(string type) => type switch
        {
            "fire" => "🔥",
            "gas" => "💨",
            "smoke" => "💨",
            _ => "⚠️"
        };
    }
}
