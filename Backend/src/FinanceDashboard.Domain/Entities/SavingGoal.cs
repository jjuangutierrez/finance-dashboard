using FinanceDashboard.Domain.Common;

namespace FinanceDashboard.Domain.Entities;

public class SavingGoal : AuditableEntity
{
    public Guid WidgetId { get; private set; }
    public decimal TargetAmount { get; private set; }
    public DateOnly? TargetDate { get; private set; }
    public Widget Widget { get; private set; } = null!;

    private SavingGoal() { }

    internal SavingGoal(Guid widgetId, decimal targetAmount, DateOnly? targetDate)
    {
        WidgetId = widgetId;
        TargetAmount = targetAmount;
        TargetDate = targetDate;
    }

    public void UpdateDetails(decimal targetAmount, DateOnly? targetDate)
    {
        TargetAmount = targetAmount;
        TargetDate = targetDate;
    }
}