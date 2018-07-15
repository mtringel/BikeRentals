using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DataAccess.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Toptal.BikeRentals.DatabaseInitializers.Helpers
{
    public abstract class DatabaseInitializerBase : DataProviderBase, IDatabaseInitializer
    {
        #region Services

        protected AppConfig AppConfig { get; private set; }

        #endregion

        internal DatabaseInitializerBase(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig)
            : base(callContext, appDbContext)
        {
            this.AppConfig = appConfig;
        }

        #region IDatabaseInitializer

        /// <summary>
        /// This is called first
        /// </summary>
        public virtual void InitializeDatabase()
        {
        }

        /// <summary>
        /// This is called by the AppDbContext when creating the database
        /// </summary>        
        public virtual void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        /// <summary>
        /// This is called last, when the schema is ready (load data here)
        /// </summary>
        public virtual void AfterDatabaseInitialized()
        {
        }

        #endregion        
    }
}
