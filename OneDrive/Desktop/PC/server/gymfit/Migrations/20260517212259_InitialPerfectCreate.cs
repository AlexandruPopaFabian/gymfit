using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace gymfit.Migrations
{
    /// <inheritdoc />
    public partial class InitialPerfectCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    Specialization = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SportClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    TrainerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportClasses_Users_TrainerId",
                        column: x => x.TrainerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SportClassId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassSchedules_SportClasses_SportClassId",
                        column: x => x.SportClassId,
                        principalTable: "SportClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassBooking",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ClassScheduleId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassBooking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassBooking_ClassSchedules_ClassScheduleId",
                        column: x => x.ClassScheduleId,
                        principalTable: "ClassSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassBooking_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Bio", "Discriminator", "Email", "Name", "PasswordHash", "Specialization" },
                values: new object[,]
                {
                    { 1, "Fost atlet de performanță, pasionat de antrenamente funcționale.", "Trainer", "andrei.trainer@gymfit.com", "Andrei Popescu", "hash124", "Functional Training" },
                    { 2, "Antrenoare certificată, specializată în yoga și mobilitate.", "Trainer", "maria.trainer@gymfit.com", "Maria Ionescu", "hash456", "Yoga & Mobility" },
                    { 3, "Expert în bodybuilding și nutriție sportivă.", "Trainer", "alex.trainer@gymfit.com", "Alex Dumitru", "hash789", "Bodybuilding" }
                });

            migrationBuilder.InsertData(
                table: "SportClasses",
                columns: new[] { "Id", "Description", "Name", "TrainerId" },
                values: new object[,]
                {
                    { 1, "Relax", "Yoga", 1 },
                    { 2, "Antrenament intens pentru forță și mobilitate", "Functional Training", 1 },
                    { 3, "Creștere musculară și antrenament cu greutăți", "Bodybuilding", 3 },
                    { 4, "Mobilitate, stretching și recuperare", "Mobility & Stretch", 2 }
                });

            migrationBuilder.InsertData(
                table: "ClassSchedules",
                columns: new[] { "Id", "EndTime", "SportClassId", "StartTime" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 5, 7, 11, 0, 0, 0, DateTimeKind.Utc), 1, new DateTime(2026, 5, 7, 10, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 5, 8, 19, 0, 0, 0, DateTimeKind.Utc), 2, new DateTime(2026, 5, 8, 18, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 5, 9, 15, 0, 0, 0, DateTimeKind.Utc), 3, new DateTime(2026, 5, 9, 14, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassBooking_ClassScheduleId",
                table: "ClassBooking",
                column: "ClassScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassBooking_UserId",
                table: "ClassBooking",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_SportClassId",
                table: "ClassSchedules",
                column: "SportClassId");

            migrationBuilder.CreateIndex(
                name: "IX_SportClasses_TrainerId",
                table: "SportClasses",
                column: "TrainerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassBooking");

            migrationBuilder.DropTable(
                name: "ClassSchedules");

            migrationBuilder.DropTable(
                name: "SportClasses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
