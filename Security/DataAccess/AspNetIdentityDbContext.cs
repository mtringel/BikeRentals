using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Security.Principals;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Toptal.BikeRentals.Security.DataAccess
{
    /// <summary>
    /// Lifetime: Scoped (for current request)
    /// </summary>        
    public class AspNetIdentityDbContext : IdentityDbContext<AspNetIdentityUser, AspNetIdentityRole, string>
    {
        public AspNetIdentityDbContext(DbContextOptions<AspNetIdentityDbContext> options, AppConfig config)
            : base(options)
        {
            this.AppConfig = config;
        }

        #region Services

        protected AppConfig AppConfig { get; private set; }

        #endregion

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(AppConfig.ConnectionStrings.AppDb);

            base.OnConfiguring(optionsBuilder);
        }
    }
}


