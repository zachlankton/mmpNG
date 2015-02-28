
//csAppServices and csAppData provide us with a service to pass
//relevant data back and forth between different controllers in the application.
//This also sets up some shared info that the application can use for navigation.
var csAppServices = angular.module('csAppServices', ['wakanda']);
csAppServices.factory('csAppData', function ($wakanda) {
    var values = {}; 
    values.Customers = {};
    //load all the wakanda data that we want for this application
     $wakanda.init().then(function oninit(ds) {  
        values.CustomersCollection = ds.Customer.$find({pageSize:9999});
     });

     

    values.MainNavBar = [];
    var mnTemp = values.MainNavBar;
    mnTemp.push ( {title: "Customers",        templateUrl: "/apps/Customers/customers.html"   } );
    mnTemp.push ( {title: "Suppliers",        templateUrl: "/apps/Suppliers/suppliers.html"   } );
    mnTemp.push ( {title: "Shop Floor",       templateUrl: "/apps/ShopFloor/shopfloor.html"   } );
    mnTemp.push ( {title: "Quality",          templateUrl: "/apps/Quality/quality.html"       } );
    values.currentMainTemplate = {};

    return{
        getData: function(){
            return values;
        }
    };
});

//this line initializes our Application with the wakanda and csAppServices Dependencies
var myApp = angular.module('mainPage', ['csAppServices']);

myApp.controller('templates', function($scope, $wakanda, $filter, csAppData) {

    $scope.templates = csAppData.getData();

    $scope.loadMainTemp = function(template){
        $scope.templates.currentMainTemplate = searchObject({arr: $scope.templates.MainNavBar, key:"title", value: template})[0];
    }   
});


function getCSS(cssPath){
    // load CSS file and append it to the HEAD if it hasn't been loaded already
    if ($("[href='"+cssPath+"']").length == 0){
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: cssPath
        }).appendTo('head');
    }
    
}

function searchObject(searchObj){
    var result = searchObj.arr.filter(function( obj ) {
        return obj[searchObj.key] == searchObj.value;
    });
    return result;
}