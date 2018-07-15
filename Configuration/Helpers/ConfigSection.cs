using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;

namespace Toptal.BikeRentals.Configuration.Helpers
{
    public abstract class ConfigSection
    {
        /// <summary>
        /// Local configuration settings (appsettings.json) must be overriden in Application Settings when deployed to Azure in the format: SectionnName.Key (otherwise error is thrown)
        /// Connection strings must be added to Connection Strings in Azure in the format: Key
        /// Azure Application Settings are accessible through environment variables. We add those to configuration for easier processing in ConfigSection.ctor()
        /// All config parameters must be properties.
        /// </summary>
        protected internal ConfigSection(IConfiguration configuration, IConfigurationSection section)
        {
            if (section != null)
            {
                // bind appsettings.json
                section.Bind(this);

                // Overwrite with environment variables (loaded into configuration in Program.cs by calling config.AddEnvironmentVariables())
                // Azure Application Settings / Connection strings goes to GetSection("ConnectionStrings")["..."], overwriting values coming from appsettings.json
                // Azure Application Settings / Application settings goes to root config (configuration["..."]) and therefore expected to be specified as sectionName.propertyName
                var properties = this.GetType().GetProperties(BindingFlags.FlattenHierarchy | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

                foreach (var property in properties)
                {
                    var key = $"{section.Key}.{property.Name}";

                    try
                    {
                        if (configuration.GetValue(typeof(object), key) != null)
                            property.SetValue(this, configuration.GetValue(property.PropertyType, key, null));
                    }
                    catch
                    {
                        throw new InvalidCastException($"Value of environment variable '{key}' cannot be set into {property.PropertyType}.");
                    }
                }
            }
        }

        #region Parse

        public static bool Parse(string s, bool defVal)
        {
            if (bool.TryParse(s, out bool res))
                return res;
            else
                return defVal;
        }

        public static int Parse(string s, int defVal)
        {
            if (int.TryParse(s, out int res))
                return res;
            else
                return defVal;
        }

        public static string NotNullOrEmpty(string s, string defVal)
        {
            return string.IsNullOrEmpty(s) ? defVal : s;
        }

        #endregion
    }
}