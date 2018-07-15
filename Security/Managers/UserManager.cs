using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Toptal.BikeRentals.Security.Managers
{
    public sealed class UserManager : Microsoft.AspNetCore.Identity.UserManager<Principals.AspNetIdentityUser>
    {
        public UserManager(
            IUserStore<Principals.AspNetIdentityUser> store, 
            IOptions<IdentityOptions> optionsAccessor, 
            IPasswordHasher<Principals.AspNetIdentityUser> passwordHasher, 
            IEnumerable<IUserValidator<Principals.AspNetIdentityUser>> userValidators, 
            IEnumerable<IPasswordValidator<Principals.AspNetIdentityUser>> passwordValidators, 
            ILookupNormalizer keyNormalizer, 
            IdentityErrorDescriber errors, 
            IServiceProvider services, 
            ILogger<UserManager<Principals.AspNetIdentityUser>> logger
            ) 
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }
    }
}
