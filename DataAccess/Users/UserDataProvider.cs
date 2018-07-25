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
    public sealed class UserDataProvider : DataProviderBase
    {
        public UserDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<User> GetList(string userLisFilter, string autoCompleteFilter, int? maxRows)
        {
            // non-active entities are only loaded through reference or by Id
            // Detach entities, if you don't want them to be tracked (for saving with the DataProvider, like Users, which are saved calling ASP.Net Identity)
            var query = Detach(AppDbContext.Users.Where(t => t.IsActive));

            if (!string.IsNullOrEmpty(userLisFilter))
            {
                var filter = userLisFilter.ToLower();

                query = query.Where(t =>
                    (t.LastName + " " + t.FirstName).ToLower().Contains(filter) ||
                    t.Email.ToLower().Contains(filter) ||
                    t.UserName.ToLower().Contains(filter) ||
                    t.RoleTitle.ToLower().Contains(filter)
                    );
            }

            if (!string.IsNullOrEmpty(autoCompleteFilter))
            {
                var filter = autoCompleteFilter.ToLower();
                query = query.Where(t => (t.LastName + " " + t.FirstName).ToLower().Contains(filter));
            }

            return query.Take(maxRows.GetValueOrDefault(int.MaxValue));
        }

        public User Get(string userId, bool? isActive)
        {
            var result = AppDbContext.Users.Find(userId);
            return result != null && (!isActive.HasValue || isActive.Value == result.IsActive) ? Detach(result) : null;
        }

        public User GetByUserName(string userName, bool? isActive)
        {
            var result = AppDbContext.Users.SingleOrDefault(t => t.UserName == userName);
            return result != null && (!isActive.HasValue || isActive.Value == result.IsActive) ? Detach(result) : null;
        }

    }
}
