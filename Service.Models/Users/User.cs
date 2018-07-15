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
    public sealed class User : Model
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [NotMapped]
        public string FullName { get { return $"{FirstName} {LastName}"; } }

        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(50)]
        [Required]
        public string UserName { get; set; }

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
        [StringLength(128)]
        public string UserId { get; set; }

        /// <summary>
        /// Not read from Db.
        /// Not returned to client.
        /// Only used when new user is created.
        /// </summary>
        [NotMapped]
        [StringLength(50, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Not read from Db.
        /// Not returned to client.
        /// Only used when new user is created.
        /// </summary>
        [NotMapped]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [StringLength(50)]
        public string ConfirmPassword { get; set; }

        public User()
        {
        }

        #region Entity conversion

        public User(BusinessEntities.Users.User entity)
        {
            this.UserId = entity.UserId;
            this.FirstName = entity.FirstName;
            this.LastName = entity.LastName;
            this.UserName = entity.UserName;
            // this.Password = entity.Password; - not loaded, only saved
            this.Email = entity.Email;
            this.Role = entity.Role;
        }

        public BusinessEntities.Users.User ToEntity()
        {
            return new BusinessEntities.Users.User()
            {
                UserId = this.UserId,
                FirstName = this.FirstName,
                LastName = this.LastName,
                UserName = this.UserName,
                Email = this.Email,
                Role = this.Role,
                Password = this.Password
            };
        }

        #endregion
    }
}
