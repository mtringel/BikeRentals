using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Toptal.BikeRentals.Service.Models.Users
{
    public sealed class UserListData : Model
    {
        /// <summary>
        /// Top 100 items only
        /// </summary>
        public Service.Models.Users.User[] List { get; set; }

        /// <summary>
        /// If there are more than 100 returned items
        /// </summary>
        public bool TooMuchData { get; set; }
    }
}