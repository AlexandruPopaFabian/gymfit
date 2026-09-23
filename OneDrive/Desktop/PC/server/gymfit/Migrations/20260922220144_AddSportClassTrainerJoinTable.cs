using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gymfit.Migrations
{
    /// <inheritdoc />
    public partial class AddSportClassTrainerJoinTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportClasses_Users_TrainerId",
                table: "SportClasses");

            migrationBuilder.DropIndex(
                name: "IX_SportClasses_TrainerId",
                table: "SportClasses");

            migrationBuilder.CreateTable(
                name: "SportClassTrainer",
                columns: table => new
                {
                    ClassesId = table.Column<int>(type: "integer", nullable: false),
                    TrainersId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportClassTrainer", x => new { x.ClassesId, x.TrainersId });
                    table.ForeignKey(
                        name: "FK_SportClassTrainer_SportClasses_ClassesId",
                        column: x => x.ClassesId,
                        principalTable: "SportClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SportClassTrainer_Users_TrainersId",
                        column: x => x.TrainersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SportClassTrainer_TrainersId",
                table: "SportClassTrainer",
                column: "TrainersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SportClassTrainer");

            migrationBuilder.CreateIndex(
                name: "IX_SportClasses_TrainerId",
                table: "SportClasses",
                column: "TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportClasses_Users_TrainerId",
                table: "SportClasses",
                column: "TrainerId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
