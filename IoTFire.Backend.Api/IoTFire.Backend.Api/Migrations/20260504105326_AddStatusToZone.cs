using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IoTFire.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToZone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "zones",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "zones");
        }
    }
}
