using Microsoft.AspNetCore.Antiforgery;
using System;
using System.Collections.Generic;
using System.Text;

namespace Toptal.BikeRentals.Security.Web
{
    public sealed class AntiforgeryTokenHelper
    {
        private IAntiforgery Antiforgery;

        public AntiforgeryTokenHelper(IAntiforgery antiforgery)
        {
            this.Antiforgery = antiforgery;
        }

   
    }
}