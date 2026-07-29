using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FinanceDashboard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPortfolioService, PortfolioService>();

        services.AddScoped<WidgetService>();
        services.AddScoped<TransactionService>();

        return services;
    }
}