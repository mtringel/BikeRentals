using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.BusinessEntities.Users
{
    /// <summary>
    /// Internal entity, not sent to the client
    /// Contains all information for user management forms.
    /// Reads from dbo.V_User view selecting users from ASPNET_Identity.dbo.AspNetUsers table.
    /// Writes into ASPNET_Identity database through identity API.
    /// Only data mapping attributes are used here. Validation is done in the Service.Api by MVC using the model from Service.Model.
    /// </summary>
    [Table("V_User")]
    public sealed class User : Entity
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [NotMapped]
        public string FullName { get { return $"{FirstName}{LastName}"; } }

        [Required]
        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(50)]
        [Required]
        public string UserName { get; set; }

        [StringLength(50)]
        public string RoleName
        {
            get { return Role.Name(); }
            set
            {
                if (string.IsNullOrEmpty(value))
                    Role = RoleType.User;
                else
                    Role = RoleTypeHelper.Parse(value);
            }
        }

        [StringLength(50)]
        [NotMapped]
        public string RoleTitle
        {
            get { return Role.Title(); }
        }

        [NotMapped]
        public RoleType Role { get; set; }

        /// <summary>
        /// Don't make it required, we don't get it from the UI (Email only, put into UserName)
        /// </summary>
        [Key]
        [StringLength(450)]
        public string UserId { get; set; }

        public override object[] Keys()
        {
            return new[] { UserId };
        }

        /// <summary>
        /// Not read from Db.
        /// Not returned to client.
        /// Only used when new user is created.
        /// </summary>
        [NotMapped]
        [StringLength(50, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string Password { get; set; }

        public bool IsActive { get { return Role != RoleType.Disabled; } }

        [NotMapped]
        /// <summary>
        /// Entity is created from UI data, not loaded from db. Usually, only the key fields are set, the rest are set to default.
        /// Used when constructing referred entities, like CreatedBy.
        /// </summary>
        public bool IsPartial { get; set; }

        public User()
        {
        }

        public User(string userId, string firstName, string lastName, string userName, string email, string password, RoleType role, bool isPartial)
        {
            this.UserId = userId;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.UserName = userName;
            this.Email = email;
            this.Password = password;
            this.Role = role;
            this.IsPartial = isPartial;
        }
       
    }
}
