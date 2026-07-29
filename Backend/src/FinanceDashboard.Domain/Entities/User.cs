using FinanceDashboard.Domain.Common;

namespace FinanceDashboard.Domain.Entities;

public class User : AuditableEntity
{
    public string FirstName { get; private set; } = null!;
    public string? LastName { get; private set; }
    public string UserName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string? PasswordHash { get; private set; }
    public string? GoogleId { get; private set; }

    public string? PictureUrl { get; private set; }

    public ICollection<Portfolio> Portfolios { get; private set; } = new List<Portfolio>();

    private User() { }

    public User(string firstName, string? lastName, string userName, string email, string passwordHash)
    {
        ValidateProfile(firstName, lastName, userName);
        Guard.AgainstNullOrWhiteSpace(email, nameof(email));
        Guard.AgainstNullOrWhiteSpace(passwordHash, nameof(passwordHash));
        Guard.AgainstMaxLength(email, 150, nameof(email));
        Guard.AgainstMaxLength(passwordHash, 150, nameof(passwordHash));

        FirstName = firstName;
        LastName = lastName;
        UserName = userName;
        Email = email;
        PasswordHash = passwordHash;
    }

    public static User CreateFromGoogle(
        string firstName,
        string? lastName,
        string userName,
        string email,
        string googleId,
        string? pictureUrl)
    {
        ValidateProfile(firstName, lastName, userName);
        Guard.AgainstNullOrWhiteSpace(email, nameof(email));
        Guard.AgainstNullOrWhiteSpace(googleId, nameof(googleId));
        Guard.AgainstMaxLength(email, 150, nameof(email));

        return new User
        {
            FirstName = firstName,
            LastName = lastName,
            UserName = userName,
            Email = email,
            GoogleId = googleId,
            PictureUrl = pictureUrl,
            PasswordHash = null
        };
    }

    public void UpdateProfile(string firstName, string? lastName, string userName)
    {
        ValidateProfile(firstName, lastName, userName);

        FirstName = firstName;
        LastName = lastName;
        UserName = userName;
    }

    public void UpdatePassword(string passwordHash)
    {
        Guard.AgainstNullOrWhiteSpace(passwordHash, nameof(passwordHash));
        Guard.AgainstMaxLength(passwordHash, 150, nameof(passwordHash));

        PasswordHash = passwordHash;
    }

    private static void ValidateProfile(string firstName, string? lastName, string userName)
    {
        Guard.AgainstNullOrWhiteSpace(firstName, nameof(firstName));
        Guard.AgainstNullOrWhiteSpace(userName, nameof(userName));
        Guard.AgainstMaxLength(firstName, 50, nameof(firstName));
        Guard.AgainstMaxLength(lastName, 150, nameof(lastName));
        Guard.AgainstMaxLength(userName, 150, nameof(userName));
    }
}