using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Toptal.BikeRentals.Security.Managers
{
    public sealed class SignInManager : Microsoft.AspNetCore.Identity.SignInManager<Principals.AspNetIdentityUser>
    {
        public SignInManager(
            UserManager<Principals.AspNetIdentityUser> userManager, 
            IHttpContextAccessor contextAccessor, 
            IUserClaimsPrincipalFactory<Principals.AspNetIdentityUser> claimsFactory, 
            IOptions<IdentityOptions> optionsAccessor, 
            ILogger<SignInManager<Principals.AspNetIdentityUser>> logger, 
            IAuthenticationSchemeProvider schemes
            )
            : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes)
        {
        }
    }
}
