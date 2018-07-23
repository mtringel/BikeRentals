using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Shared
{
    public sealed class AutoCompleteItem : Model
    {
        public string Key { get; set; }

        public string Value { get; set; }

        public AutoCompleteItem()
        {
        }

        public AutoCompleteItem(string key, string value)
        {
            this.Key = key;
            this.Value = value;
        }
    }
}
