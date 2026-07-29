using FinanceDashboard.Domain.Common;

namespace FinanceDashboard.Domain.Entities;

public class Tracker : AuditableEntity
{
    public Guid WidgetId { get; private set; }
    public Widget Widget { get; private set; } = null!;

    private Tracker() { }

    internal Tracker(Guid widgetId)
    {
        WidgetId = widgetId;
    }
}