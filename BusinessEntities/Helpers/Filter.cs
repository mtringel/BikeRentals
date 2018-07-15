namespace Toptal.BikeRentals.BusinessEntities.Helpers
{
    /// <summary>
    /// Base class for filters
    /// </summary>
    public abstract class Filter : IDataObject
    {
        public abstract bool IsEmpty { get; }
    }
}