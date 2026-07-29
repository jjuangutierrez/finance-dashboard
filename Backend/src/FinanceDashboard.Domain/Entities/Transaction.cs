using FinanceDashboard.Domain.Common;
using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Domain.Entities;

public class Transaction : AuditableEntity
{
    public Guid WidgetId { get; private set; }

    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }

    public decimal Amount { get; private set; }

    public TransactionType Type { get; private set; }

    public Widget Widget { get; private set; } = null!;

    public RecurringTransactionMetadata? RecurringMetadata { get; private set; }

    private Transaction() { }

    public Transaction(
        Guid widgetId,
        string title,
        string? description,
        decimal amount,
        TransactionType type)
    {
        Guard.AgainstNullOrWhiteSpace(title, nameof(title));
        Guard.AgainstMaxLength(title, 50, nameof(title));
        Guard.AgainstMaxLength(description, 150, nameof(description));
        Guard.AgainstNegativeOrZero(amount, nameof(amount));

        WidgetId = widgetId;
        Title = title;
        Description = description;
        Amount = amount;
        Type = type;
    }

    public void UpdateDetails(
        string title,
        string? description,
        decimal amount,
        TransactionType type)
    {
        Guard.AgainstNullOrWhiteSpace(title, nameof(title));
        Guard.AgainstMaxLength(title, 50, nameof(title));
        Guard.AgainstMaxLength(description, 150, nameof(description));
        Guard.AgainstNegativeOrZero(amount, nameof(amount));

        Title = title;
        Description = description;
        Amount = amount;
        Type = type;
    }

    public void ConfigureRecurring(int paymentDay)
    {
        if (RecurringMetadata is null)
        {
            RecurringMetadata = new RecurringTransactionMetadata(Id, paymentDay);
            return;
        }

        RecurringMetadata.UpdatePaymentDay(paymentDay);
    }
}