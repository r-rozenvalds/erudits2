using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace erudits.api.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Username = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    DeactivatedDate = table.Column<long>(type: "bigint", nullable: false, defaultValue: -1L),
                    Created = table.Column<long>(type: "bigint", nullable: false, defaultValueSql: "DATEDIFF_BIG(SECOND, '1970-01-01', SYSUTCDATETIME())"),
                    Modified = table.Column<long>(type: "bigint", nullable: false, defaultValueSql: "-1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
