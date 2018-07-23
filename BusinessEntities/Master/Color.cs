using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Master
{
    public sealed class Color : Entity
    {
        /// <summary>
        /// This is the actual hex representation (#HHHHHH)
        /// </summary>
        [Required]
        [Key]
        [StringLength(6)]
        public string ColorId { get; set; }

        [Required]
        [StringLength(50)]
        public string ColorName { get; set; }

        [Required]
        public bool IsActive { get; set; }

        public Color()
        {
            IsActive = true;
        }

        public override object[] Keys()
        {
            return new object[] { ColorId };
        }
    }
}