using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IoTFire.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddZoneAndIsReadToAlerts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_read",
                table: "alerts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "zone_id",
                table: "alerts",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_read",
                table: "alerts");

            migrationBuilder.DropColumn(
                name: "zone_id",
                table: "alerts");
        }
    }
}
