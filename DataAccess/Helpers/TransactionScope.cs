namespace Toptal.BikeRentals.DataAccess.Helpers
{
    /// <summary>
    /// EF Core does not support ambient transactions (System.Transactions.TransactionScope), but each SaveChanges() call runs in a transaction.
    /// </summary>
    public class TransactionScope : ITransactionScope
    {
        private AppDbContext AppDbContext;      

        internal TransactionScope(AppDbContext appDbContext)
        {
            this.AppDbContext = appDbContext;
        }

        public void Complete()
        {
            if (AppDbContext != null)
            {
                AppDbContext.EndTransaction(true); // can throw exception in SaveChanges()
                AppDbContext = null;
            }
        }

        public void Dispose()
        {
            if (AppDbContext != null)
            {
                AppDbContext.EndTransaction(false);
                AppDbContext = null;
            }
        }
    }
}
