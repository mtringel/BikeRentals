using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.Security.Principals;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Users
{
    /// <summary>
    /// This model is SENT to the client
    /// Contains all information for user management forms.
    /// MVC validation attributes are used here with JsonIgnore for not serialized members.
    /// </summary>
    public class UserRef : Model
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        /// <summary>
        /// Don't make it required, we don't get it from the UI (Email only, put into UserName)
        /// </summary>
        [Key]
        [StringLength(128)]
        public string UserId { get; set; }

        public UserRef()
        {
        }

        public UserRef(BusinessEntities.Users.User user)
        {
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.UserId = user.UserId;
        }
    }
}
