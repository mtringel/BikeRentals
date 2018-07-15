using System;
using System.Collections.Generic;
using System.Text;

namespace Toptal.BikeRentals.Configuration.Helpers
{
    public enum HostingEnvironment
    {
        Unknown,
        Development,
        Staging,
        Production
    }

    public static class HostingEnvironmentHelper
    {
        public static bool IsDevelopment(this HostingEnvironment env)
        {
            return env == HostingEnvironment.Development;
        }
    }
}
