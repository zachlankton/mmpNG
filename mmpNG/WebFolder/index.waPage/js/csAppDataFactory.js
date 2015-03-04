//csAppServices and csAppData provide us with a service to pass
//relevant data back and forth between different controllers in the application.
//This also sets up some shared info that the application can use for navigation.
var csAppServices = angular.module('csAppServices', ['wakanda']);
csAppServices.factory('csAppData', function ($wakanda) {
    var values = {}; 
    values.Customers = {};
    
    //load all the wakanda data that we want for this application
    values.collections = {};
    values.loadAllWAKData = function(){
         $wakanda.init().then(function oninit(ds) {  
            values.collections.Customers = ds.Customer.$find({pageSize:99999999});
            values.collections.Contacts = ds.Contact.$find({pageSize:99999999});
            values.collections.ContactInfo = ds.ContactInfo.$find({pageSize:99999999});
            values.collections.Addresses = {};
            values.collections.Orders = ds.Orders.$find({pageSize:99999999});
            values.collections.PartNumber = ds.PartNumber.$find({pageSize:99999999});
            values.collections.Molds = ds.Molds.$find({pageSize:99999999});
         });
     };
     

    globalWAK = $wakanda; 

    values.MainNavBar = [];
    var mnTemp = values.MainNavBar;
    mnTemp.push ( {title: "Customers",        templateUrl: "/apps/Customers/customers.html"   } );
    mnTemp.push ( {title: "Suppliers",        templateUrl: "/apps/Suppliers/suppliers.html"   } );
    mnTemp.push ( {title: "Accounting",       templateUrl: "/apps/Accounting/accounting.html"   } );
    mnTemp.push ( {title: "Shop Floor",       templateUrl: "/apps/ShopFloor/shopfloor.html"   } );
    mnTemp.push ( {title: "Quality",          templateUrl: "/apps/Quality/quality.html"       } );
    values.currentMainTemplate = {};
    values.templateToLoad = null;

    return{
        getData: function(){
            return values;
        }
    };
});
