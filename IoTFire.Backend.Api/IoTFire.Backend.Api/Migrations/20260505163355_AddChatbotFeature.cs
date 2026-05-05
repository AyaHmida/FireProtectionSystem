using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IoTFire.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddChatbotFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    UserMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    BotResponse = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    DetectedIntent = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_alerts_zone_id",
                table: "alerts",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_UserId",
                table: "ChatMessages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_alerts_zones_zone_id",
                table: "alerts",
                column: "zone_id",
                principalTable: "zones",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_alerts_zones_zone_id",
                table: "alerts");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_alerts_zone_id",
                table: "alerts");
        }
    }
}
