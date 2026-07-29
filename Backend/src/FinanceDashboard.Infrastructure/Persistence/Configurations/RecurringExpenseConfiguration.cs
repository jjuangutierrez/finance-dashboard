using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class RecurringExpenseConfiguration : IEntityTypeConfiguration<RecurringExpense>
{
    public void Configure(EntityTypeBuilder<RecurringExpense> builder)
    {
        builder.ToTable("recurring_expenses");

        builder.HasKey(re => re.Id);

        builder.Property(re => re.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(re => re.WidgetId).HasColumnName("widget_id").IsRequired();
        builder.Property(re => re.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(re => re.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(re => re.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(re => re.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);

        builder.HasOne(re => re.Widget)
    .WithOne(w => w.RecurringExpense)
    .HasForeignKey<RecurringExpense>(re => re.WidgetId)
    .OnDelete(DeleteBehavior.Cascade);

builder.HasIndex(re => re.WidgetId)
    .IsUnique();
    }
}
