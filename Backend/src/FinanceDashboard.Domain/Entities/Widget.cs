using FinanceDashboard.Domain.Common;
using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Domain.Entities;

public class Widget : AuditableEntity
{
    public Guid PortfolioId { get; private set; }

    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }

    public WidgetKind Kind { get; private set; }

    public int PosX { get; private set; }
    public int PosY { get; private set; }
    public int Width { get; private set; }
    public int Height { get; private set; }

    public Portfolio Portfolio { get; private set; } = null!;

    public SavingGoal? SavingGoal { get; private set; }
    public Tracker? Tracker { get; private set; }
    public RecurringExpense? RecurringExpense { get; private set; }

    public ICollection<Transaction> Transactions { get; private set; } = new List<Transaction>();

    private Widget() { }

    private Widget(
        Guid portfolioId,
        string name,
        string? description,
        WidgetKind kind,
        int posX,
        int posY,
        int width,
        int height)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Guard.AgainstMaxLength(name, 50, nameof(name));
        Guard.AgainstMaxLength(description, 150, nameof(description));

        Guard.AgainstNegativeOrZero(width, nameof(width));
        Guard.AgainstNegativeOrZero(height, nameof(height));

        PortfolioId = portfolioId;
        Name = name;
        Description = description;
        Kind = kind;

        PosX = posX;
        PosY = posY;
        Width = width;
        Height = height;
    }

    public static Widget CreateTracker(
        Guid portfolioId,
        string name,
        string? description,
        int posX,
        int posY,
        int width,
        int height)
    {
        var widget = new Widget(
            portfolioId,
            name,
            description,
            WidgetKind.Tracker,
            posX,
            posY,
            width,
            height);

        widget.Tracker = new Tracker(widget.Id);

        return widget;
    }

    public static Widget CreateSavingGoal(
        Guid portfolioId,
        string name,
        string? description,
        decimal targetAmount,
        DateOnly? targetDate,
        int posX,
        int posY,
        int width,
        int height)
    {
        var widget = new Widget(
            portfolioId,
            name,
            description,
            WidgetKind.SavingGoal,
            posX,
            posY,
            width,
            height);

        widget.SavingGoal = new SavingGoal(
            widget.Id,
            targetAmount,
            targetDate);

        return widget;
    }

    public static Widget CreateRecurringExpense(
        Guid portfolioId,
        string name,
        string? description,
        int posX,
        int posY,
        int width,
        int height)
    {
        var widget = new Widget(
            portfolioId,
            name,
            description,
            WidgetKind.RecurringExpense,
            posX,
            posY,
            width,
            height);

        widget.RecurringExpense = new RecurringExpense(widget.Id);

        return widget;
    }

    public void UpdateDetails(string name, string? description)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Guard.AgainstMaxLength(name, 50, nameof(name));
        Guard.AgainstMaxLength(description, 150, nameof(description));

        Name = name;
        Description = description;
    }

    public void Move(int posX, int posY)
    {
        PosX = posX;
        PosY = posY;
    }

    public void Resize(int width, int height)
    {
        Guard.AgainstNegativeOrZero(width, nameof(width));
        Guard.AgainstNegativeOrZero(height, nameof(height));

        Width = width;
        Height = height;
    }
}