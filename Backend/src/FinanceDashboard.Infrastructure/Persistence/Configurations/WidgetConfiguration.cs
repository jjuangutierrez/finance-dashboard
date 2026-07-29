using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class WidgetConfiguration : IEntityTypeConfiguration<Widget>
{
    public void Configure(EntityTypeBuilder<Widget> builder)
    {
        builder.ToTable("widgets");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(w => w.PortfolioId).HasColumnName("portfolio_id").IsRequired();
        builder.Property(w => w.PosX).HasColumnName("pos_x").IsRequired().HasDefaultValue(0);
        builder.Property(w => w.PosY).HasColumnName("pos_y").IsRequired().HasDefaultValue(0);
        builder.Property(w => w.Width).HasColumnName("width").IsRequired().HasDefaultValue(400);
        builder.Property(w => w.Height).HasColumnName("height").IsRequired().HasDefaultValue(300);
        builder.Property(w => w.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(w => w.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(w => w.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(w => w.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);
        builder.Property(w => w.Name)
    .HasColumnName("name")
    .HasMaxLength(50)
    .IsRequired();

builder.Property(w => w.Description)
    .HasColumnName("description")
    .HasMaxLength(150);

        builder.Property(w => w.Kind)
    .HasColumnName("widget_kind")
    .HasConversion<string>()
    .HasMaxLength(30)
    .IsRequired();
    }
}
