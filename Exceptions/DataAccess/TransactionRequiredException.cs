using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Exceptions.DataAccess
{
    public sealed class TransactionRequiredException : DataAccessException
    {
        public TransactionRequiredException(Type serviceType, string operation)
            : base(HttpStatusCode.InternalServerError,  string.Format(Resources.Resources.DataAccess_TransactionRequiredForOperation, serviceType, operation), LogLevel.Critical)
        {
        }
    }
}

