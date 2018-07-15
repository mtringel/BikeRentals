using System.Collections.Generic;
using Toptal.BikeRentals.Security.Principals;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Toptal.BikeRentals.Service.Models.Security
{
    public sealed class RoleListData : Model
    {
        public KeyValuePair<RoleType, string>[] List { get; set; }
    }
}