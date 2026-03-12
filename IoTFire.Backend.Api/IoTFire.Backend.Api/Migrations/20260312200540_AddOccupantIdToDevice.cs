using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IoTFire.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOccupantIdToDevice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "occupant_id",
                table: "devices",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_devices_occupant_id",
                table: "devices",
                column: "occupant_id");

            migrationBuilder.AddForeignKey(
                name: "FK_devices_users_occupant_id",
                table: "devices",
                column: "occupant_id",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_devices_users_occupant_id",
                table: "devices");

            migrationBuilder.DropIndex(
                name: "IX_devices_occupant_id",
                table: "devices");

            migrationBuilder.DropColumn(
                name: "occupant_id",
                table: "devices");
        }
    }
}
