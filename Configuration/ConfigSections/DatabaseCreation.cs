using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class DatabaseCreation : Helpers.ConfigSection
    {
        private const string SectionName = "DatabaseCreation";

        public DatabaseCreation(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public bool CreateDatabaseIfNotExists { get; set; }

        public int TestUsersCount { get; set; }

        public int TestManagersCount { get; set; }

        public int TestBikesCount { get; set; }

        public int TestRentalsCount { get; set; }

        public string TestUsersPassword { get; set; }

        #region Auto create admin user (when ASP Net Identity DB is created)

        public string AdminUserEmail { get; set; }

        /// <summary>
        /// Must be changed after PROD deployment!
        /// </summary>
        public string AdminUserPassword { get; set; }

        public string AdminUserFirstName { get; set; }

        public string AdminUserLastName { get; set; }

        public string AdminUserEmail2 { get; set; }

        /// <summary>
        /// Must be changed after PROD deployment!
        /// </summary>
        public string AdminUserPassword2 { get; set; }

        public string AdminUserFirstName2 { get; set; }

        public string AdminUserLastName2 { get; set; }

        #endregion
    }
}