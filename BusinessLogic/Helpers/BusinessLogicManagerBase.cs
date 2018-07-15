using System;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Microsoft.Extensions.Logging;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.Exceptions.Entities;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.BusinessLogic.Helpers
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// BusinessLogicManagers should not call each others DataProvider, but can call each other.
    /// Do not add public instance methods here.
    /// </summary>
    public abstract class BusinessLogicManagerBase
    {
        public BusinessLogicManagerBase(ICallContext callContext, AppConfig appConfig)
        {
            this.CallContext = callContext;
            this.AppConfig = appConfig;
        }

        #region Services

        protected ICallContext CallContext { get; private set; }

        protected AppConfig AppConfig { get; private set; }

        #endregion

        #region GetSingle

        protected T GetSingle<T>(Func<T> dataProviderGet, string id, bool mustExist) where T : Entity
        {
            if (string.IsNullOrEmpty(id))
            {
                if (mustExist)
                    throw new InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);
                else
                    return null;
            }

            var entity = dataProviderGet();

            if (mustExist && entity == null)
                throw new EntityNotFoundException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);

            return entity;
        }

        protected T GetSingle<T>(Func<T> dataProviderGet, int id, bool mustExist) where T : Entity
        {
            if (id <= 0)
            {
                if (mustExist)
                    throw new InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);
                else
                    return null;
            }

            var entity = dataProviderGet();

            if (mustExist && entity == null)
                throw new EntityNotFoundException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);

            return entity;
        }

        protected T GetSingle<T>(Func<T> dataProviderGet, Guid id, bool mustExist) where T : Entity
        {
            if (id == Guid.Empty)
            {
                if (mustExist)
                    throw new InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);
                else
                    return null;
            }

            var entity = dataProviderGet();

            if (mustExist && entity == null)
                throw new EntityNotFoundException(CallContext.ResourceUri, typeof(T), new object[] { id }, LogLevel.Warning);

            return entity;
        }

        #endregion
    }

}