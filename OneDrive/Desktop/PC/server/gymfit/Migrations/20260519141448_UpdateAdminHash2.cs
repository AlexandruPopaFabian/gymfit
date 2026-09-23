using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gymfit.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminHash2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 99,
                column: "PasswordHash",
                value: "WNSSXaLpb4cW3Li27kXDLURVomMPCskCmqDJFn1DA9Y=");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 99,
                column: "PasswordHash",
                value: "BEReZIdzZZDR71AYa0FOc34BZGg8u+xk4A5zwAD9O+8=");
        }
    }
}
