using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSummaryWidgetKind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        IF EXISTS (SELECT * FROM sys.check_constraints WHERE name LIKE '%widget_kind%')
        BEGIN
            DECLARE @chkName NVARCHAR(256);
            SELECT TOP 1 @chkName = name FROM sys.check_constraints WHERE name LIKE '%widget_kind%';
            EXEC('ALTER TABLE [widgets] DROP CONSTRAINT [' + @chkName + ']');
        END

        ALTER TABLE [widgets] ADD CONSTRAINT [CK_widgets_widget_kind] 
        CHECK ([widget_kind] IN ('tracker', 'saving_goal', 'recurring_expense', 'summary'));
    ");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_widgets_widget_kind')
            ALTER TABLE [widgets] DROP CONSTRAINT [CK_widgets_widget_kind];

        ALTER TABLE [widgets] ADD CONSTRAINT [CK_widgets_widget_kind] 
        CHECK ([widget_kind] IN ('tracker', 'saving_goal', 'recurring_expense'));
    ");
}
    }
}
