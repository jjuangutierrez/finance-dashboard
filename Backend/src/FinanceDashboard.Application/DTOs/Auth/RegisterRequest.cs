using System.ComponentModel.DataAnnotations;

namespace FinanceDashboard.Application.DTOs.Auth;

public record RegisterRequest(
    string FirstName,
    string? LastName,
    string UserName,
    [EmailAddress] string Email,
    [Required, MinLength(8), MaxLength(72)] string Password);