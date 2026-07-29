namespace FinanceDashboard.Application.DTOs.Auth;

public class AuthResult
{
    public bool Success { get; set; }
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = [];
}
