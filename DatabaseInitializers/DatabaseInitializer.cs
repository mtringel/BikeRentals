using System;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.Security.DataAccess;
using Toptal.BikeRentals.DatabaseInitializers.Helpers;
using Toptal.BikeRentals.DatabaseInitializers.AspNetIdentity;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Toptal.BikeRentals.DataAccess.Master;
using Toptal.BikeRentals.DataAccess.Bikes;
using Toptal.BikeRentals.DataAccess.Users;

namespace Toptal.BikeRentals.DatabaseInitializers
{
    /// <summary>
    /// Scoped
    /// </summary>
    public sealed class DatabaseInitializer : DatabaseInitializerBase
    {
        private IDatabaseInitializer[] ObjectInitializers;

        private bool JustCreated;

        public DatabaseInitializer(
            ICallContext callContext, 
            AppDbContext appDbContext, 
            AppConfig appConfig, 
            IAuthProvider authProvider,
            ColorDataProvider colorDataProvider,
            BikeModelDataProvider bikeModelDataProvider,
            UserDataProvider userDataProvider,
            BikeDataProvider bikeDataProvider
            )
            : base(callContext, appDbContext, appConfig)
        {
            AppDbContext.OnModelCreatingCallback = this.OnModelCreating;

            ObjectInitializers = new IDatabaseInitializer[]{                
                // Schema
                // Tables
                // Views
                new Schema.Views.V_User(callContext, appDbContext, appConfig),
                // Functions
                new Schema.Functions.ufn_GeoDistanceMiles(callContext, appDbContext, appConfig),
                // Data
                new InitialData.AspNetRoles(callContext, appDbContext, appConfig, authProvider),
                new InitialData.AspNetUsers(callContext, appDbContext, appConfig, authProvider),
                new InitialData.Colors(callContext, appDbContext, appConfig, colorDataProvider),
                new InitialData.BikeModels(callContext, appDbContext, appConfig, bikeModelDataProvider),
                new InitialData.Bikes(callContext, appDbContext, appConfig, colorDataProvider, bikeModelDataProvider,userDataProvider, bikeDataProvider)
            };
        }

        /// <summary>
        /// This is called first
        /// </summary>
        public override void InitializeDatabase()
        {
#if DEBUG
            try
#endif
            {
                base.InitializeDatabase();

                if (AppDbContext.Database.EnsureCreated())
                {
                    JustCreated = true;

                    foreach (var initializer in ObjectInitializers)
                        initializer.InitializeDatabase();

                    AppDbContext.SaveChanges();
                }
            }
#if DEBUG
            catch (Exception ex)
            {
                if (AppConfig.WebApplication.HostingEnvironment.IsDevelopment())
                    throw new Exception($"Connection error. Connection string: {AppConfig.ConnectionStrings.AppDb}", ex);
                else
                    throw ex;
            }
#endif        
        }

        /// <summary>
        /// This is called by the AppDbContext when creating the database
        /// </summary>        
        public override void OnModelCreating(ModelBuilder modelBuilder)
        {
#if DEBUG
            try
#endif
            {
                base.OnModelCreating(modelBuilder);

                #region Set precision for all decimal fields

                //var decimalType = string.Format("DECIMAL({0},{1})", AppConfig.AppDb.DecimalPrecision, AppConfig.AppDb.DecimalScale);

                //foreach (var property in modelBuilder.Model.GetEntityTypes().SelectMany(t => t.GetProperties()).Where(p => p.ClrType == typeof(decimal)))
                //    property.Relational().ColumnType = decimalType;

                #endregion

                #region Foreign keys

                // Disabled cascade delete on all foreign keys
                foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
                    relationship.DeleteBehavior = DeleteBehavior.Restrict;

                #endregion

                foreach (var initializer in ObjectInitializers)
                    initializer.OnModelCreating(modelBuilder);
            }
#if DEBUG
            catch (Exception ex)
            {
                if (AppConfig.WebApplication.HostingEnvironment.IsDevelopment())
                    throw new Exception($"Connection error. Connection string: {AppConfig.ConnectionStrings.AppDb}", ex);
                else
                    throw ex;
            }
#endif
        }

        /// <summary>
        /// This is called last, when the schema is ready (load data here)
        /// </summary>
        public override void AfterDatabaseInitialized()
        {
#if DEBUG
            try
#endif
            {
                using (var tx = AppDbContext.BeginTransaction())
                {
                    base.AfterDatabaseInitialized();

                    if (JustCreated)
                    {
                        foreach (var initializer in ObjectInitializers)
                            initializer.AfterDatabaseInitialized();

                        AppDbContext.SaveChanges();
                    }

                    tx.Complete();
                }
            }
#if DEBUG
            catch (Exception ex)
            {
                throw ex;
            }
#endif
        }
    }
}