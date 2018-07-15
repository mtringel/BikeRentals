using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Toptal.BikeRentals.Security.Principals
{
    /// <summary>
    /// This entity is NOT sent to the client.
    /// ASP.Net Identity user 
    /// We do not send down to the client the AspNetIdentityUser, that's too detailed, we send AppUser instead.
    /// You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    /// </summary>
    public class AspNetIdentityUser : Microsoft.AspNetCore.Identity.IdentityUser
    {
        public AspNetIdentityUser()
        {
        }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

    }
}
