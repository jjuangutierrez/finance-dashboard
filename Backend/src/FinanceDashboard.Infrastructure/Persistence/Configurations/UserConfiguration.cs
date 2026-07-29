using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(u => u.FirstName).HasColumnName("first_name").HasMaxLength(50).IsRequired();
        builder.Property(u => u.LastName).HasColumnName("last_name").HasMaxLength(150);
        builder.Property(u => u.UserName).HasColumnName("user_name").HasMaxLength(150).IsRequired();
        builder.Property(u => u.Email).HasColumnName("email").HasMaxLength(150).IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(150)
            .IsRequired(false);

        builder.Property(u => u.GoogleId)
            .HasColumnName("google_id")
            .HasMaxLength(150)
            .IsRequired(false);

        builder.Property(u => u.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(u => u.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(u => u.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(u => u.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);

        builder.HasIndex(u => u.UserName).IsUnique();
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.GoogleId).IsUnique();

        builder.Navigation(u => u.Portfolios)
            .AutoInclude(false);
    }
}