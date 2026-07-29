using FinanceDashboard.Application.DTOs;
using FinanceDashboard.Domain.Entities;

namespace FinanceDashboard.Application.Interfaces;

public interface IUserService
{
    Task<User?> GetCurrentUserAsync();
    Task UpdateAsync(UpdateUserRequest request);
    Task DeleteAsync();
}
