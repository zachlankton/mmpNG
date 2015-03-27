

//csAppServices and csAppData provide us with a service to pass
//relevant data back and forth between different controllers in the application.
//This also sets up some shared info that the application can use for navigation.
var csAppServices = angular.module('csAppServices', ['wakanda', 'filters-module']);


csAppServices.factory('csAppData', function ($wakanda, $filter) {
    var values = {}; 
    values.Customers = {};
    values.Suppliers = {};
    values.sideBarVisible = true;
    values.reusable = {modal: {templateUrl: ""} };
    values.collections = {};


    ///////////////////////
    // LOAD ALL WAK DATA //
    ///////////////////////            
    values.loadAllWAKData = function(){
         
         $wakanda.init().then(function oninit(ds) {
            values.collections.Customers = ds.Customer.$find({pageSize:999999999});
            values.collections.Suppliers = ds.Supplier.$find({pageSize:999999999});
         });
     };

    values.confirmDelete = function(entity, refresh){
        values.reusable.modal.templateUrl = "/index.waPage/confirmDeleteModal.html";
        values.reusable.modal.confirmDelete = {};
        values.reusable.modal.confirmDelete.Yes = function(){
            entity.$remove().then(function(){refresh();});
            $('#reusable-modal').modal("hide");
        };
        values.reusable.modal.confirmDelete.No = function(){$('#reusable-modal').modal("hide");};
        $('#reusable-modal').modal('show');
    };

    

    values.googleAPIkey = "AIzaSyBNr4BWiCJe7q9HyBoNw6c8v7nUzWxeSps";

    

    values.MainNavBar = [];
    var mnTemp = values.MainNavBar;
    mnTemp.push ( {title: "HR",               templateUrl: "/apps/HR/HR.html"   } );
    mnTemp.push ( {title: "Customers",        templateUrl: "/apps/Customers/customers.html"   } );
    mnTemp.push ( {title: "Suppliers",        templateUrl: "/apps/Suppliers/suppliers.html"   } );
    mnTemp.push ( {title: "Accounting",       templateUrl: "/apps/Accounting/accounting.html"   } );
    mnTemp.push ( {title: "Shop Floor",       templateUrl: "/apps/ShopFloor/shopfloor.html"   } );
    mnTemp.push ( {title: "Quality",          templateUrl: "/apps/Quality/quality.html"       } );
    values.currentMainTemplate = {};
    values.templateToLoad = null;


    $('#reusable-modal').on('hide.bs.modal', function (e) {
        values.reusable.modal.templateUrl = "";
    });

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
}).filter('modDate', function(){
    return function(input){
        var retVal = "";
        input = input || "";
        if (input != ""){
            retVal = input.toDateString() + " " + input.toLocaleTimeString();
        }
        return retVal;
    };
});
