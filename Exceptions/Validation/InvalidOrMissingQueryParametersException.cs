using System;

namespace Toptal.BikeRentals.Exceptions.Validation
{
    public class InvalidOrMissingQueryParametersException : ValidationException 
    {
        public InvalidOrMissingQueryParametersException(string resourceName, string parameterName, object parameterValue)
            : base(string.Format (Resources.Resources.Validation_MissingInputData , resourceName, parameterName, parameterValue), false)
        {
        }

    }
}

