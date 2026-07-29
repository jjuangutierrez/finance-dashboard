using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class SavingGoalConfiguration : IEntityTypeConfiguration<SavingGoal>
{
    public void Configure(EntityTypeBuilder<SavingGoal> builder)
    {
        builder.ToTable("saving_goals");

        builder.HasKey(sg => sg.Id);

        builder.Property(sg => sg.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(sg => sg.WidgetId).HasColumnName("widget_id").IsRequired();
        builder.Property(sg => sg.TargetAmount).HasColumnName("target_amount").HasColumnType("numeric(12,2)").IsRequired();
        builder.Property(sg => sg.TargetDate).HasColumnName("target_date");
        builder.Property(sg => sg.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(sg => sg.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(sg => sg.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(sg => sg.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);

        builder.HasOne(sg => sg.Widget)
    .WithOne(w => w.SavingGoal)
    .HasForeignKey<SavingGoal>(sg => sg.WidgetId)
    .OnDelete(DeleteBehavior.Cascade);

builder.HasIndex(sg => sg.WidgetId)
    .IsUnique();
    }
}
