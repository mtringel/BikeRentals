using System;
using System.Collections.Generic;
using System.Linq;
using Toptal.BikeRentals.BusinessEntities.Users;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;

namespace Toptal.BikeRentals.DataAccess.Users
{
    /// <summary>
    /// Lifetime: Transient
    /// </summary>
    public sealed  class UserDataProvider : DataProviderBase
    {
        public UserDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<User> GetList(string filterText, int? maxRows)
        {
            if (string.IsNullOrEmpty(filterText))
                return AppDbContext.Users.Take(maxRows.GetValueOrDefault(int.MaxValue));
            else
                return AppDbContext.Users
                    .Where(t =>
                        t.FirstName.ToLower().Contains(filterText.ToLower()) ||
                        t.LastName.ToLower().Contains(filterText.ToLower()) ||
                        t.Email.ToLower().Contains(filterText.ToLower()) ||
                        t.UserName.ToLower().Contains(filterText.ToLower()) ||
                        t.RoleTitle.ToLower().Contains(filterText.ToLower())
                    )
                    .Take(maxRows.GetValueOrDefault(int.MaxValue));
        }


        public User Get(string userId)
        {
            return AppDbContext.Users.Find(userId);
        }

        public User GetByUserName(string userName)
        {
            return AppDbContext.Users.Where(t => t.UserName == userName).FirstOrDefault();
        }

    }
}
