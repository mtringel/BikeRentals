using System.Linq;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.Service.Api.Helpers
{
    /// <summary>
    /// Do not add public instance methods here.
    /// </summary>
    public abstract class ServiceBase
    {
        public ServiceBase(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager
            )
        {
            this.TransactionManager = transactionManager;
            this.AuthProvider = authProvider;
            this.Logger = logger;
            this.Helper = new ServiceHelper(callContext, appConfig);
        }

        #region Services

        protected ServiceHelper Helper { get; private set; }

        protected AppConfig AppConfig { get { return Helper.AppConfig; } }

        protected ICallContext CallContext { get { return Helper.CallContext; } }

        private ITransactionManager TransactionManager;

        protected IAuthProvider AuthProvider { get; private set; }

        protected ITelemetryLogger Logger { get; private set; }

        #endregion

        #region Service Scope 

        /// <summary>
        /// Manages transaction scope (System.Transctions.TransactionScope)
        /// Don't forget to call scope.Complete() at the end of the using(scope) block!
        /// </summary>
        internal ServiceScope Scope(string processName) //, bool transactional)
        {
            var trans = this.TransactionManager.BeginTransaction();

            return new ServiceScope(
                processName,
                (tservicescope, tcompletedmessages) =>
                {
                    trans.Complete();

                        // call after Complete, we have IDENTITY columns filled here
                        if (tcompletedmessages == null)
                        CallContext.LastProcessCompletedMessage = processName;
                    else
                        CallContext.LastProcessCompletedMessage = $"{processName} | {string.Join("|", tcompletedmessages.Select(t => t()))}";
                },
                tservicescope =>
                {
                    trans.Dispose();

                    if (!tservicescope.IsCompleted)
                        CallContext.LastProcessFailedMessage = processName;
                });
        }

        #endregion                
    }
}