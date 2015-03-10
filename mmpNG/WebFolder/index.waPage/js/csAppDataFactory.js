//csAppServices and csAppData provide us with a service to pass
//relevant data back and forth between different controllers in the application.
//This also sets up some shared info that the application can use for navigation.
var csAppServices = angular.module('csAppServices', ['wakanda', 'filters-module']);
csAppServices.factory('csAppData', function ($wakanda) {
    var values = {}; 
    values.Customers = {};
    values.Suppliers = {};
    
    //load all the wakanda data that we want for this application
    values.collections = {};
    values.loadAllWAKData = function(){
         $wakanda.init().then(function oninit(ds) {  
            values.collections.Customers = ds.Customer.$find({pageSize:999999999});
            values.collections.Suppliers = ds.Supplier.$find({pageSize:999999999});
         });
     };

    values.googleAPIkey = "AIzaSyBNr4BWiCJe7q9HyBoNw6c8v7nUzWxeSps";

    values.reusable = {modal: {templateUrl: ""}};

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




angular.module('filters-module', [])
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
.filter('gDriveFolder', function(){
    return function(input){
        input = input || "";
        input = input.replace('/open?', '/embeddedfolderview?');
        input = input.replace('&authuser=0', '');
        return input;
    };
}).filter('gDriveImg', function(){
    return function(input){
        input = input || "";
        input = input.replace('/open?', '/uc?');
        input = input.replace('&authuser=0', '');
        return input;
    };
});
