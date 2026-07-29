using FinanceDashboard.Domain.Common;
using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Domain.Entities;

public class RecurringExpense : AuditableEntity
{
    public Guid WidgetId { get; private set; }
    public Widget Widget { get; private set; } = null!;

    private RecurringExpense() { }

    internal RecurringExpense(Guid widgetId)
    {
        WidgetId = widgetId;
    }
}