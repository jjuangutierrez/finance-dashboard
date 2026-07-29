using System.Security.Claims;
using FinanceDashboard.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace FinanceDashboard.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId
    {
        get
        {
            var id =
                _httpContextAccessor.HttpContext?.User
                    .FindFirst(ClaimTypes.NameIdentifier)?.Value
                ??
                _httpContextAccessor.HttpContext?.User
                    .FindFirst("sub")?.Value;

            return Guid.TryParse(id, out var guid)
                ? guid
                : null;
        }
    }
}