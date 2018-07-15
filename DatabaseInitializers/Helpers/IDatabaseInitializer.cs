
using Microsoft.EntityFrameworkCore;

namespace Toptal.BikeRentals.DatabaseInitializers.Helpers
{
    public interface IDatabaseInitializer
    {
        /// <summary>
        /// This is called first
        /// </summary>
        void InitializeDatabase();

        /// <summary>
        /// This is called by the AppDbContext when creating the database
        /// </summary>        
        void OnModelCreating(ModelBuilder modelBuilder);

        /// <summary>
        /// This is called last, when the schema is ready (load data here)
        /// </summary>
        void AfterDatabaseInitialized();
    }
}