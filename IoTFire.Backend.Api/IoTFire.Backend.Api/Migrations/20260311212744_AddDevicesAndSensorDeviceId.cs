using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IoTFire.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDevicesAndSensorDeviceId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "device_id",
                table: "sensors",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "devices",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    device_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    is_online = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    zone_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_devices", x => x.id);
                    table.ForeignKey(
                        name: "FK_devices_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_sensors_device_id",
                table: "sensors",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "IX_devices_device_id",
                table: "devices",
                column: "device_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_devices_zone_id",
                table: "devices",
                column: "zone_id");

            migrationBuilder.AddForeignKey(
                name: "FK_sensors_devices_device_id",
                table: "sensors",
                column: "device_id",
                principalTable: "devices",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_sensors_devices_device_id",
                table: "sensors");

            migrationBuilder.DropTable(
                name: "devices");

            migrationBuilder.DropIndex(
                name: "IX_sensors_device_id",
                table: "sensors");

            migrationBuilder.DropColumn(
                name: "device_id",
                table: "sensors");
        }
    }
}
