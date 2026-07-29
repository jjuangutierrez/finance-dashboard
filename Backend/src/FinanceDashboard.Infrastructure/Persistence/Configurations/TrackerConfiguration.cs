using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class TrackerConfiguration : IEntityTypeConfiguration<Tracker>
{
    public void Configure(EntityTypeBuilder<Tracker> builder)
    {
        builder.ToTable("trackers");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(t => t.WidgetId).HasColumnName("widget_id").IsRequired();
        builder.Property(t => t.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(t => t.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(t => t.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(t => t.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);

        builder.HasOne(t => t.Widget)
    .WithOne(w => w.Tracker)
    .HasForeignKey<Tracker>(t => t.WidgetId)
    .OnDelete(DeleteBehavior.Cascade);

builder.HasIndex(t => t.WidgetId)
    .IsUnique();
    }
}
