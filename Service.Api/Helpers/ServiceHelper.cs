using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Exceptions;
using Toptal.BikeRentals.Service.Models.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Exceptions.Entities;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Service.Api.Helpers
{
    /// <summary>
    /// Base class for service calls to return error information.
    /// This class has to be inherited in the Service.Models layer (in T class for Web API) or in the Web.UI layer (in T class for MVC)
    /// </summary>
    public sealed class ServiceHelper
    {
        internal ServiceHelper(ICallContext callContext, AppConfig appConfig)
        {
            this.CallContext = callContext;
            this.AppConfig = appConfig;
        }

        #region Services

        public ICallContext CallContext { get; private set; }

        public AppConfig AppConfig { get; private set; }

        #endregion        

        #region Validation

        /// <summary>
        /// Controller.TryValidateModel does not work in Unit tests
        /// https://github.com/aspnet/Mvc/issues/3586
        /// </summary>
        public void ValidateModel(object model, ModelStateDictionary modelState)
        {
            var validationContext = new ValidationContext(model, null, null);
            var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();

            Validator.TryValidateObject(model, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                modelState.AddModelError(validationResult.MemberNames.FirstOrDefault() ?? string.Empty, validationResult.ErrorMessage);
            }
        }

        /// <summary>
        /// Controller.TryValidateModel does not work in Unit tests
        /// https://github.com/aspnet/Mvc/issues/3586
        /// </summary>
        public ModelStateDictionary ValidateModel(object model, bool throwValidationError)
        {
            var state = new ModelStateDictionary();
            ValidateModel(model, state);

            if (throwValidationError && !state.IsValid)
                throw new Toptal.BikeRentals.Exceptions.Validation.ValidationException(state, true, true);

            return state;
        }

        #endregion

        #region Input Validation

        public bool TryParseId(string id, out int intId, out bool isNew)
        {
            if (string.IsNullOrEmpty(id) || id == "new")
            {
                intId = 0;
                isNew = true;
                return true;
            }

            if (int.TryParse(id, out intId))
            {
                isNew = (intId <= 0);
                return true;
            }

            isNew = false;
            return false;
        }

        public void Expect(Type entityType, object id)
        {
            if (id == null || (id is string && string.IsNullOrEmpty((string)id)))
                throw new Exceptions.Entities.InvalidEntityKeyException(CallContext.ResourceUri, entityType, new[] { id }, Microsoft.Extensions.Logging.LogLevel.Warning);
        }

        public void Expect<T>(T entity) where T: IDataObject
        {
            if (entity == null)
                throw new Exceptions.Validation.InputDataMissingException(CallContext.ResourceUri, typeof(T));
        }

        public void Expect<T>(T entity, object id) where T : IDataObject
        {
            if (entity == null)
                throw new Exceptions.Validation.InputDataMissingException(CallContext.ResourceUri, typeof(T));

            if (id == null || (id is string && string.IsNullOrEmpty((string)id)))
                throw new Exceptions.Entities.InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new[] { id }, Microsoft.Extensions.Logging.LogLevel.Warning);
        }

        public void ValidateResult<T>(IEnumerable<T> list) 
        {
            if (list.Count() > AppConfig.ServiceApi.MaximumReturnedRows)
                throw new TooMuchDataFilterRequiredException(CallContext.ResourceUri, typeof(T), "RowCount", LogLevel.Error);
        }

        #endregion        
    }
}