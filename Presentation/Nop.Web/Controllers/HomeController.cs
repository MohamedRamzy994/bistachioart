using Microsoft.AspNetCore.Mvc;
using Nop.Web.Factories;
using Nop.Web.Models.Catalog;
using System.Collections.Generic;

namespace Nop.Web.Controllers
{
    public partial class HomeController : BasePublicController
    {

        private readonly ICatalogModelFactory _catalogModelFactory;

        private readonly IVendorModelFactory _vendorModelFactory;
        public HomeController(

                       ICatalogModelFactory catalogModelFactory    ,
                        IVendorModelFactory vendorModelFactory
            )
        {
            _catalogModelFactory = catalogModelFactory;
            _vendorModelFactory = vendorModelFactory;

        }

        public virtual IActionResult Index()
        {
            HomeModelFactory homeModelFactory = new HomeModelFactory();
            homeModelFactory.Manufacturers = _catalogModelFactory.PrepareManufacturerAllModels();
            homeModelFactory.Vendors = _catalogModelFactory.PrepareVendorAllModels();
            return View(homeModelFactory);
        }

    }

    public class HomeModelFactory
    {
        public  IList<VendorModel> Vendors { get; set; }
        public IList<ManufacturerModel> Manufacturers { get; set; }

    }
}