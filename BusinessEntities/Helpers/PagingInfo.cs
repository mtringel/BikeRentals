using System.Linq;

namespace Toptal.BikeRentals.BusinessEntities.Helpers
{
    public sealed class PagingInfo : Filter
    {
        public int? FirstRow { get; set; }

        public int? RowCount { get; set; }

        public string[] OrderBy { get; set; }

        public bool OrderByDescending { get; set; }

        /// <summary>
        /// Sets total row count into TotalRowCount, if specified
        /// </summary>
        public bool ReturnTotalRowCount { get; set; }

        public override bool IsEmpty =>
            FirstRow.GetValueOrDefault() == 0 &&
            RowCount.GetValueOrDefault(int.MaxValue) == int.MaxValue;

        public static bool CompareOrdering(PagingInfo pi1, PagingInfo pi2)
        {
            return
                pi1.OrderByDescending == pi2.OrderByDescending &&
                pi1.OrderBy.SequenceEqual(pi2.OrderBy);
        }

        public static bool ComparePaging(PagingInfo pi1, PagingInfo pi2)
        {
            return 
                pi1.FirstRow.GetValueOrDefault(0) == pi2.FirstRow.GetValueOrDefault(0) && 
                pi1.RowCount.GetValueOrDefault(int.MaxValue) == pi2.RowCount.GetValueOrDefault(int.MaxValue);
        }

        public static bool ComparePagingOrdering(PagingInfo pi1, PagingInfo pi2)
        {
            return ComparePaging(pi1, pi2) && CompareOrdering(pi1, pi2);
        }
    }
}
