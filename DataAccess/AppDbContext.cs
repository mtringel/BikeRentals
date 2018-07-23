using Toptal.BikeRentals.Configuration;
using Microsoft.EntityFrameworkCore;
using System;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Exceptions.DataAccess;
using Toptal.BikeRentals.Security.DataAccess;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Users;
using Toptal.BikeRentals.BusinessEntities.Rents;

namespace Toptal.BikeRentals.DataAccess
{
    /// <summary>
    /// Lifetime: Scoped (current request)
    /// </summary>        
    public sealed class AppDbContext : AspNetIdentityDbContext, ITransactionManager
    {
        #region Entities

        // Add a DbSet for each entity type that you want to include in your model. For more information 
        // on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.

        public new DbSet<User> Users { get; set; }

        public DbSet<Bike> Bikes { get; set; }

        public DbSet<Color> Colors { get; set; }

        public DbSet<BikeModel> BikeModels { get; set; }

        public DbSet<BikeRate> BikeRates { get; set; }

        public DbSet<BikeRent> BikeRents { get; set; }

        #endregion

        #region Services

        public Action<ModelBuilder> OnModelCreatingCallback { get; set; }

        #endregion

        #region Initialization

        /// <summary>
        /// If you wish to target a different database and/or database provider, modify the 'AppDb' 
        /// connection string in the Web.config configuration file (Web project root).
        /// </summary>
        public AppDbContext(AppConfig appConfig)
            : base(GetContextOptions(appConfig), appConfig)
        {
        }

        private static DbContextOptions<AspNetIdentityDbContext> GetContextOptions(AppConfig appConfig)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AspNetIdentityDbContext>();
            optionsBuilder.UseSqlServer(appConfig.ConnectionStrings.AppDb);

            return optionsBuilder.Options;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(AppConfig.ConnectionStrings.AppDb);

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDbFunction(() => ServerFunctions.GeoDistanceMiles(0, 0, 0, 0));

            OnModelCreatingCallback?.Invoke(modelBuilder);
        }

        #endregion        

        #region ITransactionManager

        private int TransactionCount;

        public ITransactionScope BeginTransaction()
        {
            TransactionCount++;
            return new TransactionScope(this);
        }

        internal void EndTransaction(bool complete)
        {
            if (TransactionCount == 0)
                throw new TransactionRequiredException(this.GetType(), "EndTransaction");

            if (TransactionCount == 1)
            {
                if (complete)
                    SaveChanges(); // can throw exception
            }

            TransactionCount--;
        }

        public bool IsInTransaction
        {
            get { return TransactionCount > 0; }
        }

        #endregion

        #region Functions

        public static class ServerFunctions
        {
            /// <summary>
            /// This is just a stub.
            /// SQL FLOAT corresponds to double (8 bytes), REAL corresponts to float (4 bytes)
            /// </summary>
            [DbFunction("ufn_GeoDistanceMiles", "dbo")]
            public static double GeoDistanceMiles(double lat1Deg, double lng1Deg, double lat2Deg, double lng2Deg)
            {
                return 0d;
            }
        }

        #endregion
    }
}