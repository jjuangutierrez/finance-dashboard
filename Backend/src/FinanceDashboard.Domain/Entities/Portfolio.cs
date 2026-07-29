using FinanceDashboard.Domain.Common;
using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Domain.Entities;

public class Portfolio : AuditableEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public PortfolioStatus Status { get; private set; } = PortfolioStatus.Active;
    public User User { get; private set; } = null!;
    public ICollection<Widget> Widgets { get; private set; } = new List<Widget>();

    private Portfolio() { }

    public Portfolio(Guid userId, string title, string? description, string? createdBy = null)
    {
        Guard.AgainstNullOrWhiteSpace(title, nameof(title));
        Guard.AgainstMaxLength(title, 50, nameof(title));
        Guard.AgainstMaxLength(description, 150, nameof(description));

        UserId = userId;
        Title = title;
        Description = description;

        CreatedAt = DateTime.UtcNow;
        CreatedBy = createdBy; 
    }

    public void UpdateDetails(string title, string? description)
    {
        Guard.AgainstNullOrWhiteSpace(title, nameof(title));
        Guard.AgainstMaxLength(title, 50, nameof(title));
        Guard.AgainstMaxLength(description, 150, nameof(description));

        Title = title;
        Description = description;
    }

    public void Archive() => Status = PortfolioStatus.Archived;
    public void Activate() => Status = PortfolioStatus.Active;
}