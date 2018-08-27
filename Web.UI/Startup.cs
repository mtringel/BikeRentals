using Microsoft.ApplicationInsights.AspNetCore;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.SnapshotCollector;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using System;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Configuration.Helpers;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DatabaseInitializers.Helpers;

namespace Toptal.BikeRentals.Web.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            this.Configuration = configuration;
            this.LoggerFactory = loggerFactory;
        }

        #region SnapshotCollector

        /// <summary>
        /// We just want to disable it
        /// </summary>
        private class SnapshotCollectorTelemetryProcessorFactory : ITelemetryProcessorFactory
        {
            private readonly IServiceProvider _serviceProvider;

            public SnapshotCollectorTelemetryProcessorFactory(IServiceProvider serviceProvider) =>
                _serviceProvider = serviceProvider;

            public ITelemetryProcessor Create(ITelemetryProcessor next)
            {
                var snapshotConfigurationOptions = _serviceProvider.GetService<IOptions<SnapshotCollectorConfiguration>>();
                return new SnapshotCollectorTelemetryProcessor(next, configuration: snapshotConfigurationOptions.Value);
            }
        }

        #endregion

        #region Services

        private IConfiguration Configuration;

        private ILoggerFactory LoggerFactory;

        #endregion

        #region Dependency Injection

        private static void ConfigureDependencyInjection(
            IServiceCollection services,
            Action configureLogging,
            ref AppConfig appConfig,
            ref Toptal.BikeRentals.Logging.ILogger logger,
            ref ServiceProvider serviceProvider
            )
        { 
            // CallContext
            Toptal.BikeRentals.CallContext.Startup.ConfigureServices(services);

            // Configuration
            Toptal.BikeRentals.Configuration.Startup.ConfigureServices(services);

            // --> we have configuration here
            serviceProvider = services.BuildServiceProvider();
            appConfig = serviceProvider.GetService<AppConfig>();

            // Azure 
            Toptal.BikeRentals.AzureHelper.Startup.ConfigureServices(services);

            // Logging
            configureLogging();

            Toptal.BikeRentals.Logging.Startup.ConfigureServices(services);

            // --> we have logging here
            serviceProvider = services.BuildServiceProvider();
            logger = serviceProvider.GetService<Toptal.BikeRentals.Logging.ILogger>();

            // Exceptions
            Toptal.BikeRentals.Exceptions.Startup.ConfigureServices(services);

            // Security 
            Toptal.BikeRentals.Security.Startup.ConfigureServices(services, appConfig);

            // DataAccess
            Toptal.BikeRentals.DataAccess.Startup.ConfigureServices(services);

            // DatabaseInitializers
            Toptal.BikeRentals.DatabaseInitializers.Startup.ConfigureServices(services);

            // BusinessLogic
            Toptal.BikeRentals.BusinessLogic.Startup.ConfigureServices(services);

            // Services
            Toptal.BikeRentals.Service.Api.Startup.ConfigureServices(services);

            // Web Api
            Toptal.BikeRentals.Web.Api.Startup.ConfigureServices(services);

            // -> we have all services here
            serviceProvider = services.BuildServiceProvider();
        }

        #endregion

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("AppDb"));
                options.ConfigureWarnings(x => x.Ignore(RelationalEventId.AmbientTransactionWarning));
            });

            services
                .AddMvc(setupAction =>
                {
#if DEBUG
                    // Global exception handler
                    setupAction.Filters.Add(typeof(Toptal.BikeRentals.Logging.ExceptionFilter));
#endif
                    // All endpoints need authentication 
                    setupAction.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()));
                })
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                });

            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 200000;
            });

            //services.AddResponseCaching();

            #region Snapshot Collector

            // Configure SnapshotCollector from application settings
            services.Configure<SnapshotCollectorConfiguration>(Configuration.GetSection(nameof(SnapshotCollectorConfiguration)));

            // Add SnapshotCollector telemetry processor.
            services.AddSingleton<ITelemetryProcessorFactory>(sp => new SnapshotCollectorTelemetryProcessorFactory(sp));

            #endregion

            AppConfig appConfig = null;
            Toptal.BikeRentals.Logging.ILogger logger = null;
            ServiceProvider serviceProvider = null;

#if DEBUG
            try
#endif
            {
                #region Dependency Injection

                ConfigureDependencyInjection(
                    services,
                    () =>
                    {
                        services.AddApplicationInsightsTelemetry(appConfig.ApplicationInsights.InstrumentationKey);
                        LoggerFactory.AddApplicationInsights(serviceProvider, appConfig.Logging.LogLevel);
                    },
                    ref appConfig,
                    ref logger,
                    ref serviceProvider
                    );

                #endregion

                #region Anti-forgery token validation

                services.AddAntiforgery(options =>
                {
                    // options.FormFieldName = appConfig.ServiceApi.AntiforgeryTokenFormFieldName; -- we use REST API
                    options.HeaderName = appConfig.ServiceApi.AntiforgeryTokenHeaderName;

                    // Cookie
                    // we do not mess with the cookie name, we don't need it on client side (for Ajax requests for example)
                    //options.Cookie.Name = appConfig.ServiceApi.AntiforgeryCookieName;
                    options.Cookie.HttpOnly = true;
                    options.Cookie.Expiration = TimeSpan.FromMinutes(appConfig.ServiceApi.AntiforgeryCookieExpirationMinutes);
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                });

                #endregion

                #region Authentication

                services
                    .AddIdentity<Toptal.BikeRentals.Security.Principals.AspNetIdentityUser, Toptal.BikeRentals.Security.Principals.AspNetIdentityRole>()
                    .AddEntityFrameworkStores<Toptal.BikeRentals.Security.DataAccess.AspNetIdentityDbContext>()
                    .AddDefaultTokenProviders();

                services.Configure<IdentityOptions>(options =>
                {
                    // Password settings
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = false;
                    options.Password.RequiredUniqueChars = 6;

                    // Lockout settings
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                    options.Lockout.MaxFailedAccessAttempts = 10;
                    options.Lockout.AllowedForNewUsers = true;

                    // User settings
                    options.User.RequireUniqueEmail = true;
                });

                services.ConfigureApplicationCookie(options =>
                {
                    // Cookie settings
                    options.Cookie.HttpOnly = true;
                    options.Cookie.Expiration = TimeSpan.FromMinutes(appConfig.Security.AspNetIdentityCookieExpirationMinutes);
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                    //if (!string.IsNullOrEmpty (config.Security.AspNetIdentityCookieName))
                    //    options.Cookie.Name = config.Security.AspNetIdentityCookieName;

                    options.LoginPath = "/Account/Login"; // If the LoginPath is not set here, ASP.NET Core will default to /Account/Login
                    options.LogoutPath = "/Account/Logout"; // If the LogoutPath is not set here, ASP.NET Core will default to /Account/Logout
                    options.AccessDeniedPath = "/Account/AccessDenied"; // If the AccessDeniedPath is not set here, ASP.NET Core will default to /Account/AccessDenied
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(appConfig.Security.AspNetIdentityCookieExpirationMinutes);
                });

                // Add application services.
                //services.AddTransient<IEmailSender, EmailSender>();

                #endregion
            }
#if DEBUG
            catch (Exception ex)
            {
                // non AppExceptions are Critical
                // call it manually, if Exception is swallowed
                // logger?.LogError(this, ex is AppException appException ? appException.LogLevel : LogLevel.Critical, ex);

                throw ex;
            }
#endif
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, AppConfig appConfig, IDatabaseInitializer databaseInitializer)
        {
            #region HostingEnvironment

            if (System.Enum.TryParse(env.EnvironmentName, out HostingEnvironment hostingEnvironment))
                appConfig.WebApplication.HostingEnvironment = hostingEnvironment;
            else
                appConfig.WebApplication.HostingEnvironment = HostingEnvironment.Unknown;

            if (appConfig.WebApplication.HostingEnvironment.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            #endregion

            app.UseStaticFiles();

            // Identity services
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                // Web Api
                routes.MapRoute(
                     name: "DefaultWebApi",
                     template: "Api/{controller}/{action=Get}/{id?}"
                 );

                // MVC
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                // We are using React browserHistory 
                // https://github.com/jintoppy/react-training/blob/master/basic/node_modules/react-router/docs/guides/Histories.md#browserhistory
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            EnsureDatabaseCreated(databaseInitializer);
        }

        private void EnsureDatabaseCreated(IDatabaseInitializer databaseInitializer)
        {
            databaseInitializer.InitializeDatabase();
            databaseInitializer.AfterDatabaseInitialized();
        }
    }
}
