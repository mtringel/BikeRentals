using System;
using System.Collections.Generic;
using System.Linq;

namespace Toptal.BikeRentals.Service.Api.Helpers
{
    internal class ServiceScope : IDisposable
    {
        private Action<ServiceScope, IEnumerable<Func<string>>> OnComplete;

        private Action<ServiceScope> OnDispose;

        public string ProcessName { get; private set; }

        public bool IsCompleted { get; private set; }

        public bool IsDisposed { get; private set; }

        internal ServiceScope(string processName, Action<ServiceScope, IEnumerable<Func<string>>> onComplete, Action<ServiceScope> onDispose)
        {
            this.ProcessName = processName;
            this.OnComplete = onComplete;
            this.OnDispose = onDispose;
        }

        /// <summary>
        /// Completes transactions (commit)
        /// We have to deal with it, that IDENTITY column is set after Complete()
        /// </summary>
        public void Complete(IEnumerable<Func<string>> completedMessages)
        {
            if (IsCompleted)
                throw new InvalidOperationException("ServiceScope is already completed.");

            if (this.OnComplete != null)
                OnComplete(this, completedMessages);

            IsCompleted = true;
        }

        /// <summary>
        /// Completes transactions (commit)
        /// We have to deal with it, that IDENTITY column is set after Complete()
        /// </summary>
        public T Complete<T>(Func<T> result, IEnumerable<Func<T, string>> completedMessages)
        {
            if (!completedMessages.Any())
                return Complete(result, t => "Process has been completed.");
            
            // don't call result() here, changes have not been saved
            T resultObj = default(T);

            Complete(completedMessages.Select((t, tind) =>
            {
                // call result() here, but only once
                if (tind == 0)
                    resultObj = result();

                return new Func<string>(() => t(resultObj));
            }));

            return resultObj;
        }

        /// <summary>
        /// Completes transactions (commit)
        /// We have to deal with it, that IDENTITY column is set after Complete()
        /// </summary>
        public void Complete(Func<string> completedMessage)
        {
            Complete(new[] { completedMessage });
        }

        /// <summary>
        /// Completes transactions (commit)
        /// We have to deal with it, that IDENTITY column is set after Complete()
        /// </summary>
        public T Complete<T>(Func<T> result, Func<T, string> completedMessage)
        {
            return Complete(result, new[] { completedMessage });
        }

        /// <summary>
        /// Disposes transactions (rollbacks if Commit() was not called)
        /// </summary>
        public void Dispose()
        {
            if (IsDisposed)
                throw new InvalidOperationException("ServiceScope is already disposed.");

            if (this.OnDispose != null)
                OnDispose(this);

            IsDisposed = true;
        }
    }
}