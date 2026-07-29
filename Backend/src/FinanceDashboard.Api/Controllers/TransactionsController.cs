using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinanceDashboard.Application.Services;
using FinanceDashboard.Application.DTOs.Transactions;

namespace FinanceDashboard.Api.Controllers;

[ApiController]
[Route("api/portfolios/{portfolioId:guid}/widgets/{widgetId:guid}/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly TransactionService _transactionService;

    public TransactionsController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions(Guid portfolioId, Guid widgetId)
    {
        try
        {
            var transactions = await _transactionService.GetTransactionsByWidgetAsync(portfolioId, widgetId);

            var dtos = transactions.Select(t => new TransactionDto(
                t.Id,
                t.WidgetId,
                t.Title,
                t.Description,
                t.Amount,
                t.Type.ToString().ToLower(),
                t.RecurringMetadata?.PaymentDay,
                t.CreatedAt
            ));

            return Ok(dtos);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction(
        Guid portfolioId, 
        Guid widgetId, 
        CreateTransactionRequest request)
    {
        try
        {
            var transaction = await _transactionService.CreateTransactionAsync(portfolioId, widgetId, request);

            var dto = new TransactionDto(
                transaction.Id,
                transaction.WidgetId,
                transaction.Title,
                transaction.Description,
                transaction.Amount,
                transaction.Type.ToString().ToLower(),
                transaction.RecurringMetadata?.PaymentDay,
                transaction.CreatedAt
            );

            return Ok(dto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{transactionId:guid}")]
    public async Task<IActionResult> DeleteTransaction(Guid portfolioId, Guid widgetId, Guid transactionId)
    {
        try
        {
            await _transactionService.DeleteTransactionAsync(portfolioId, widgetId, transactionId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}