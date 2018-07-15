using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Toptal.BikeRentals.CallContext 
{
    /// <summary>
    /// This is either an MVC Controller or a Web API Controller
    /// </summary>
    public interface IController
    {
        ModelStateDictionary ModelState { get; }

        /// <summary>
        /// Returns true, if there are no errors.
        /// </summary>
        bool ValidateModel(object model);

        string Name { get; }
    }
}
