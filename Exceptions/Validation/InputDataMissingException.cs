using System;

namespace Toptal.BikeRentals.Exceptions.Validation
{
    public class InputDataMissingException : ValidationException 
    {
        public InputDataMissingException(string resourceName, Type expectedDataType)
            : base(string.Format (Resources.Resources.Validation_MissingInputData , resourceName, expectedDataType.FullName ), false)
        {
        }

    }
}

