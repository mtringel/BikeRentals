using System;

namespace Toptal.BikeRentals.BusinessEntities.Helpers
{
    public struct Interval<T>
    {
        public T From { get; set; }

        public T To { get; set; }

        public Interval(T from, T to)
        {
            this.From = from;
            this.To = to;
        }

        public override string ToString()
        {
            return $"[Interval From={From} To={To}]";
        }

        public bool IsEmpty => Object.Equals(From, default(T)) && Object.Equals(To, default(T));
    }
}
