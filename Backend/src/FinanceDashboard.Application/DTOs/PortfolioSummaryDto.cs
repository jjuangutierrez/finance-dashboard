namespace FinanceDashboard.Application.DTOs;

public record PortfolioSummaryDto(
    decimal TotalIncome,
    decimal TotalExpenses,
    decimal NetBalance,
    int TotalTransactions);