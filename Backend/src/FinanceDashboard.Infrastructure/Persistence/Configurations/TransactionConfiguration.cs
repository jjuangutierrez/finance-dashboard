using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceDashboard.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(t => t.WidgetId).HasColumnName("widget_id").IsRequired();
        builder.Property(t => t.Title).HasColumnName("title").HasMaxLength(50).IsRequired();
        builder.Property(t => t.Description).HasColumnName("description").HasMaxLength(150);
        builder.Property(t => t.Amount).HasColumnName("amount").HasColumnType("numeric(12,2)").IsRequired();
        builder.Property(t => t.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(t => t.CreatedBy).HasColumnName("created_by").HasMaxLength(150);
        builder.Property(t => t.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(t => t.LastModifiedBy).HasColumnName("last_modified_by").HasMaxLength(150);
        builder.Property(t => t.Type)
    .HasColumnName("transaction_type")
    .HasConversion<string>()
    .HasMaxLength(20)
    .IsRequired();

        builder.HasOne(t => t.Widget)
               .WithMany(w => w.Transactions)
               .HasForeignKey(t => t.WidgetId)
               .OnDelete(DeleteBehavior.Cascade);

               builder.HasOne(t => t.RecurringMetadata)
    .WithOne(r => r.Transaction)
    .HasForeignKey<RecurringTransactionMetadata>(r => r.TransactionId);
    }
}
