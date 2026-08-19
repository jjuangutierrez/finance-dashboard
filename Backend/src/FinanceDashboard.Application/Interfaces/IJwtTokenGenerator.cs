using FinanceDashboard.Domain.Entities;

namespace FinanceDashboard.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
