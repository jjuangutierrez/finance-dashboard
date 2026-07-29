using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.ToTable("portfolios");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(p => p.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(p => p.Title).HasColumnName("title").HasMaxLength(50).IsRequired();
        builder.Property(p => p.Description).HasColumnName("description").HasMaxLength(150);
        builder.Property(p => p.Status)
    .HasColumnName("status")
    .HasConversion<string>()
    .HasMaxLength(20)
    .IsRequired()
    .HasDefaultValue(PortfolioStatus.Active);
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(p => p.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(p => p.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);

        builder.HasOne(p => p.User)
               .WithMany(u => u.Portfolios)
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
