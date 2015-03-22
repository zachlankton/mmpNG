

//csAppServices and csAppData provide us with a service to pass
//relevant data back and forth between different controllers in the application.
//This also sets up some shared info that the application can use for navigation.
var csAppServices = angular.module('csAppServices', ['wakanda', 'filters-module']);


csAppServices.factory('csAppData', function ($wakanda) {
    var values = {}; 
    values.Customers = {};
    values.Suppliers = {};
    values.sideBarVisible = true;
    values.reusable = {modal: {templateUrl: ""} };
    values.collections = {};


    //////////////////////////
    // PARSE ERROR MESSAGES //
    //////////////////////////
    var parseErrMessages = function(xhr){
        var msgs = JSON.parse(xhr.responseText);
        msgs.__ENTITIES = msgs.__ENTITIES || ["empty"];
        var errors = msgs.__ERROR || msgs.__ENTITIES[0].__ERROR || [{errCode:0, message: "Unhandled Error"}] ;
        
        values.errMessage = "";
        errors.forEach(function(elem, index){appendErrMsg(elem);});
        if ( xhr.responseURL.indexOf("/rest/$directory/login") == -1 ){ErrCheckUser();}
    };


    ///////////////////////////
    // APPEND ERROR MESSAGES //
    ///////////////////////////
    var appendErrMsg = function(elem){
        values.errMessage += "Err Code: " + elem.errCode + " - " + elem.message + "\n";
    };

    /////////////////////////////////////////
    // ON ERROR CHECK IF USER IS LOGGED IN //
    /////////////////////////////////////////
    var ErrCheckUser = function(){
        $wakanda.$currentUser().then(function(cUser){
            if (cUser.result != null){  //  SHOW ERROR MESSAGE
                values.reusable.modal.templateUrl = "/index.waPage/ErrorModal.html";
                $('#reusable-modal').modal('show');
            }else {  // SHOW LOGIN DIALOG
                values.showLoginModal();
            }

        });   
    };

    //////////////////////////////////////////
    // AJAX ERROR HANDLING AND REPORTING    //
    //////////////////////////////////////////
    AddAJAXInspector(function(xhr){
        // This function hijacks all ajax calls and injects error handling code
        // This allows us to handle errors generically, giving us the flexibility
        // to leave out specific error handling in other areas of the application 
        // that might otherwise be repeated and should be handled generically
        var oldORSC = xhr.onreadystatechange;
        var oldOE = xhr.onerror;
        var oldOT = xhr.ontimeout;
        
        xhr.onreadystatechange = function(){
            if (oldORSC != null){oldORSC.apply(this, arguments);}
            if (xhr.readyState==4 && xhr.status == 401){
                parseErrMessages(xhr);
            }
        };

        xhr.onerror = function(error){
            if (oldOE != null){oldOE.apply(this, arguments);}
            console.log(error);
            alert("Your Internet Connection appears to be down");
        };

        xhr.ontimeout = function(error){
            if (oldOT != null){oldOT.apply(this, arguments);}
            console.log(error);
            alert("Request to the Server Timed out");
        };

    });

    ///////////////////////
    // LOAD ALL WAK DATA //
    ///////////////////////            
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
