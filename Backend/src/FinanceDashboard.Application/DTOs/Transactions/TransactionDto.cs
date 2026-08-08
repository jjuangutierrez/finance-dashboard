namespace FinanceDashboard.Application.DTOs.Transactions;

public record TransactionDto(
    Guid Id,
    Guid WidgetId,
    string Title,
    string? Description,
    decimal Amount,
    string Type,
    int? PaymentDay,
    DateTime CreatedAt,
    string? WidgetName = null
);