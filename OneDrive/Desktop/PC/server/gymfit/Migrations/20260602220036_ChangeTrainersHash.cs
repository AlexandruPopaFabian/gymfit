using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gymfit.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTrainersHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Duration",
                table: "SportClasses",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 2,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Ex athlete, passionate about functional training.", "WNSSXaLpb4cW3Li27kXDLURVomMPCskCmqDJFn1DA9Y=" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Coach certificated, specialised in yoga and mobility.", "WNSSXaLpb4cW3Li27kXDLURVomMPCskCmqDJFn1DA9Y=" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Expert in bodybuilding and sports nutrition.", "WNSSXaLpb4cW3Li27kXDLURVomMPCskCmqDJFn1DA9Y=" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "SportClasses",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 2,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "SportClasses",
                keyColumn: "Id",
                keyValue: 4,
                column: "Duration",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Fost atlet de performanță, pasionat de antrenamente funcționale.", "hash124" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Antrenoare certificată, specializată în yoga și mobilitate.", "hash456" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Bio", "PasswordHash" },
                values: new object[] { "Expert în bodybuilding și nutriție sportivă.", "hash789" });
        }
    }
}
