using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Application.DTOs.Transactions;

public record UpdateTransactionRequest(
    string Title,
    string? Description,
    decimal Amount,
    TransactionType Type,
    int? PaymentDay = null);