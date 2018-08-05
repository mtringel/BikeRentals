using System.Linq;

namespace Toptal.BikeRentals.Service.Models.Helpers
{
    public class GridPagingInfo : Model
    {
        public int? FirstRow { get; set; }

        public int? RowCount { get; set; }

        /// <summary>
        /// '|' separated list of fieldnames
        /// </summary>
        public string[] OrderBy { get; set; }

        public bool OrderByDescending { get; set; }

        /// <summary>
        /// Sets total row count into TotalRowCount, if specified
        /// </summary>
        public bool ReturnTotalRowCount { get; set; }

        public GridPagingInfo(BusinessEntities.Helpers.PagingInfo  paging)
        {
            if (paging != null)
            {
                this.FirstRow = paging.FirstRow;
                this.RowCount = paging.RowCount;
                this.OrderBy = paging.OrderBy;
                this.OrderByDescending = paging.OrderByDescending;
                this.ReturnTotalRowCount = paging.ReturnTotalRowCount;
            }
        }

        public BusinessEntities.Helpers.PagingInfo ToEntity() 
        {
            return new BusinessEntities.Helpers.PagingInfo()
            {
                FirstRow = this.FirstRow,
                RowCount = this.RowCount,
                OrderBy = this.OrderBy.ToArray(), // .Split('|'),
                OrderByDescending = this.OrderByDescending,
                ReturnTotalRowCount = this.ReturnTotalRowCount
            };
        }
    }
}
