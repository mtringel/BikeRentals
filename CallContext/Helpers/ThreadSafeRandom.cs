using System;
using System.Collections.Generic;
using System.Linq;

namespace Toptal.BikeRentals.CallContext.Helpers
{
    public static class ThreadSafeRandom
    {
        private static Random Rand;

        private static object RandLock;

        static ThreadSafeRandom()
        {
            Rand = new Random();
            RandLock = new Object();
        }

        public static bool NextBool()
        {
            return Next(2) != 0;
        }

        public static int Next(int minValue, int maxValue)
        {
            lock (RandLock)
            {
                return Rand.Next(minValue, maxValue);
            }
        }

        public static double NextDouble(double minValue, double maxValue)
        {
            lock (RandLock)
            {
                return Rand.NextDouble() * (maxValue - minValue) + minValue;
            }
        }

        public static int Next(int maxValue)
        {
            lock (RandLock)
            {
                return Rand.Next(maxValue);
            }
        }

        public static double NextDouble(double maxValue)
        {
            lock (RandLock)
            {
                return Rand.NextDouble() * maxValue;
            }
        }

        public static T NextItem<T>(IList<T> list)
        {
            return list[Next(list.Count)];
        }

        /// <summary>
        /// Batched generation to avoid calling lock() multiple times
        /// </summary>
        public static int[] Next(IEnumerable<Tuple<int,int>> minMaxValues)
        {
            lock (RandLock)
            {
                var res = new int[minMaxValues.Count()];
                int i = 0;

                foreach (var entry in minMaxValues)
                    res[i++] = Rand.Next(entry.Item1, entry.Item2);

                return res;
            }
        }
    }
}
