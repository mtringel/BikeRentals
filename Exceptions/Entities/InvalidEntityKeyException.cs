using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace Toptal.BikeRentals.Exceptions.Entities
{
    public class InvalidEntityKeyException : EntityException
    {
        public Type EntityType { get; private set; }

        public object[] Keys { get; private set; }

        public InvalidEntityKeyException(string resourceName, Type entityType, object[] keys, LogLevel logLevel)
            : base(
                  System.Net.HttpStatusCode.BadRequest,
                  string.Format(
                      Resources.Resources.Entity_InvalidKey,
                      resourceName,
                      entityType.FullName,
                      keys == null ? string.Empty : string.Join(",", keys)
                      ),
                    logLevel
                  )
        {
            this.EntityType = entityType;
            this.Keys = (keys?.ToArray());
        }


    }
}