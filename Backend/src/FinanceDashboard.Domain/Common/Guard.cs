using FinanceDashboard.Domain.Exceptions;

namespace FinanceDashboard.Domain.Common;

public static class Guard
{
    public static void AgainstNullOrWhiteSpace(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainValidationException($"{fieldName} cannot be null or empty.");
    }

    public static void AgainstMaxLength(string? value, int maxLength, string fieldName)
    {
        if (value?.Length > maxLength)
            throw new DomainValidationException($"{fieldName} cannot exceed {maxLength} characters.");
    }

    public static void AgainstNegativeOrZero(decimal value, string fieldName)
    {
        if (value <= 0)
            throw new DomainValidationException($"{fieldName} must be greater than zero.");
    }

    public static void AgainstNegativeOrZero(int value, string fieldName)
    {
        if (value <= 0)
            throw new DomainValidationException($"{fieldName} must be greater than zero.");
    }

    public static void AgainstOutOfRange(int value, int min, int max, string fieldName)
    {
        if (value < min || value > max)
            throw new DomainValidationException($"{fieldName} must be between {min} and {max}.");
    }
}