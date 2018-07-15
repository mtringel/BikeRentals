using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.Security.Managers
{
    public sealed class RoleManager : Microsoft.AspNetCore.Identity.RoleManager<Principals.AspNetIdentityRole>
    {
        public RoleManager(
            IRoleStore<AspNetIdentityRole> store, 
            IEnumerable<IRoleValidator<AspNetIdentityRole>> roleValidators, 
            ILookupNormalizer keyNormalizer, 
            IdentityErrorDescriber errors, 
            ILogger<RoleManager<AspNetIdentityRole>> logger
            ) 
            : base(store, roleValidators, keyNormalizer, errors, logger)
        {
        }
    }
}
