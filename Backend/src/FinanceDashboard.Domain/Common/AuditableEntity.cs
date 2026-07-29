namespace FinanceDashboard.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public string? CreatedBy { get; protected set; }
    public DateTime? LastModifiedAt { get; protected set; }
    public string? LastModifiedBy { get; protected set; }

    public void SetCreated(DateTime utcNow, string? createdBy = null)
    {
        CreatedAt = utcNow;
        CreatedBy ??= createdBy;
    }

    public void SetModified(DateTime utcNow, string? modifiedBy = null)
    {
        LastModifiedAt = utcNow;
        LastModifiedBy = modifiedBy;
    }
}