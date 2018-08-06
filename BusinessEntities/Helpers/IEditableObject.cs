using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Helpers
{
    /// <summary>
    /// Base class for service model classes
    /// </summary>
    public interface IEditableObject : IDataObject
    {
        void Validate(Action<IDataObject> validate);
    }
}
