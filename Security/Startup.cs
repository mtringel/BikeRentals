using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using Toptal.BikeRentals.Configuration;

namespace Toptal.BikeRentals.Security 
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services, AppConfig config)
        {
            services.AddScoped(typeof(Managers.IAuthProvider), typeof(Managers.AuthProvider));
            services.AddScoped(typeof(Managers.AuthProvider));

            services.AddTransient(typeof(Managers.SignInManager));
            services.AddTransient(typeof(Managers.UserManager));
            services.AddTransient(typeof(Managers.RoleManager));

            // IUserProvider implementation is registered in BusinessLogic.Startup
            services.AddDbContext<DataAccess.AspNetIdentityDbContext>(ServiceLifetime.Scoped);
        }
    }
}
