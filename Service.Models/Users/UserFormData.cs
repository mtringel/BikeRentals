using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Toptal.BikeRentals.Service.Models.Users
{
    public sealed class UserFormData : Model
    {
        public Service.Models.Users.User User { get; set; }
    }
}