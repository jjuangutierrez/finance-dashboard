using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RecurringTransactionMetadataConfiguration
    : IEntityTypeConfiguration<RecurringTransactionMetadata>
{
    public void Configure(EntityTypeBuilder<RecurringTransactionMetadata> builder)
    {
        builder.ToTable("recurring_transaction_metadata");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(r => r.TransactionId)
            .HasColumnName("transaction_id");

        builder.Property(r => r.PaymentDay)
            .HasColumnName("payment_day")
            .IsRequired();

        builder.Property(r => r.CreatedAt).HasColumnName("created_at");
        builder.Property(r => r.CreatedBy).HasColumnName("created_by");
        builder.Property(r => r.LastModifiedAt).HasColumnName("last_modified_at");
        builder.Property(r => r.LastModifiedBy).HasColumnName("last_modified_by");

        builder.HasOne(r => r.Transaction)
            .WithOne(t => t.RecurringMetadata)
            .HasForeignKey<RecurringTransactionMetadata>(r => r.TransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(r => r.TransactionId)
            .IsUnique();
    }
}