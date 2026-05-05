using IoTFire.Backend.Api.Models.DTOs;
using IoTFire.Backend.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IoTFire.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]                          // JWT requis — cohérent avec Sprint 1 Auth
    [Produces("application/json")]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _service;
        private readonly ILogger<ChatbotController> _logger;

        public ChatbotController(IChatbotService service, ILogger<ChatbotController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //  POST /api/chatbot/message
        //  Envoyer un message et obtenir une réponse
        [HttpPost("message")]
        [ProducesResponseType(typeof(ChatResponseDto), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            var response = await _service.ProcessMessageAsync(int.Parse(userId), request);

            _logger.LogInformation("Chatbot responded | User={User} | Intent={Intent}",
                userId, response.Intent);

            return Ok(response);
        }

        //  GET /api/chatbot/history?page=1&pageSize=20
        //  Historique paginé du chat
        [HttpGet("history")]
        [ProducesResponseType(typeof(IEnumerable<ChatHistoryDto>), 200)]
        public async Task<IActionResult> GetHistory(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page < 1 || pageSize < 1 || pageSize > 100)
                return BadRequest("Paramètres de pagination invalides.");

            var userId = GetCurrentUserId();
            var history = await _service.GetChatHistoryAsync(int.Parse(userId), page, pageSize);
            return Ok(history);
        }

        //  GET /api/chatbot/suggestions
        //  Questions de démarrage rapide
        [HttpGet("suggestions")]
        [ProducesResponseType(200)]
        public IActionResult GetSuggestions()
        {
            return Ok(new
            {
                Suggestions = new[]
                {
                    "Quel est l'état général du système ?",
                    "Quelle est la température actuelle ?",
                    "Y a-t-il des alertes actives ?",
                    "Montre l'historique des alertes",
                    "Que faire en cas d'incendie ?"
                }
            });
        }

        // ── Helper ──────────────────────────────────
        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? "anonymous";
        }
    }
}
