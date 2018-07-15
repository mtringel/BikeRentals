using Microsoft.Extensions.Logging;
using System;


namespace Toptal.BikeRentals.Exceptions.Entities
{
    public class TooMuchDataFilterRequiredException : EntityException
    {
        public Type EntityType { get; private set; }

        public TooMuchDataFilterRequiredException(string resourceName, Type entityType, string requiredFilter, LogLevel logLevel)
            : base(
                  System.Net.HttpStatusCode.BadRequest,
                  string.Format(
                      Resources.Resources.Entity_TooMuchDataFilterRequited ,
                      resourceName,
                      entityType.Name,
                      requiredFilter
                      ),
                  logLevel
                  )
        {
            this.EntityType = entityType;
        }


    }
}
