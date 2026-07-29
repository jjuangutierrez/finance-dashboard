namespace FinanceDashboard.Domain.Common;

public class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.CreateVersion7();
}
