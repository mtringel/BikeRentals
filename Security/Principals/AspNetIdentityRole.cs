using Microsoft.AspNetCore.Identity;

namespace Toptal.BikeRentals.Security.Principals
{
    /// <summary>
    /// Order is important!
    /// </summary>
    public class AspNetIdentityRole : IdentityRole<string>
    {
        private RoleType _RoleType;

        public RoleType RoleType
        {
            get
            {
                return _RoleType;
            }
            private set
            {
                _RoleType = value;
                Name = value.Name();
            }
        }

        public string RoleTitle { get { return this.RoleType.Title(); } }

        public AspNetIdentityRole()
        {
        }

        public AspNetIdentityRole(RoleType role)
        {
            RoleType = role;
        }
    }

}
