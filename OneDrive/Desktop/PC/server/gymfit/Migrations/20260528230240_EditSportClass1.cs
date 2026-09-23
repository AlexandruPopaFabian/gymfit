using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gymfit.Migrations
{
    /// <inheritdoc />
    public partial class EditSportClass1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "SportClasses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Equipment",
                table: "SportClasses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "SportClasses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrainingType",
                table: "SportClasses",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Duration", "Equipment", "Level", "TrainingType" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Duration", "Equipment", "Level", "TrainingType" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Duration", "Equipment", "Level", "TrainingType" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Duration", "Equipment", "Level", "TrainingType" },
                values: new object[] { null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "Equipment",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "TrainingType",
                table: "SportClasses");
        }
    }
}
