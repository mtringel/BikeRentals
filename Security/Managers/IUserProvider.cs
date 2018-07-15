using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.Security.Helpers
{
    public interface IUserProvider
    {
        /// <summary>
        /// We need this to find users very fast in the database by using UserNameIndex (which ASP Net Identity does not do, performs full table scan)
        /// </summary>
        AppUser FindByUserName(string userName);
    }
}
