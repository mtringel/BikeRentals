
namespace Toptal.BikeRentals.Exceptions.Validation
{
    public class AntiforgeryTokenValidationException : ValidationException 
    {
        public AntiforgeryTokenValidationException()
            : base(Resources.Resources.Validation_InvalidAntiForgeryToken, false)
        {
        }
    }
}

