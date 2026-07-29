using FinanceDashboard.Domain.Common;

namespace FinanceDashboard.Domain.Entities;

public class RecurringTransactionMetadata : AuditableEntity
{
    public Guid TransactionId { get; private set; }
    public int PaymentDay { get; private set; }

    public Transaction Transaction { get; private set; } = null!;

    private RecurringTransactionMetadata() { }

    internal RecurringTransactionMetadata(Guid transactionId, int paymentDay)
    {
        Guard.AgainstOutOfRange(paymentDay, 1, 28, nameof(paymentDay));

        TransactionId = transactionId;
        PaymentDay = paymentDay;
    }

    public void UpdatePaymentDay(int paymentDay)
    {
        Guard.AgainstOutOfRange(paymentDay, 1, 28, nameof(paymentDay));

        PaymentDay = paymentDay;
    }
}