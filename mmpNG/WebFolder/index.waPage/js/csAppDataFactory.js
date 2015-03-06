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
            values.collections.Customers = ds.Customer.$find({pageSize:999999999});
            values.collections.Contacts = ds.Contact.$find({pageSize:999999999});
            values.collections.ContactInfo = ds.ContactInfo.$find({pageSize:999999999});
            values.collections.Addresses = {};
            values.collections.Orders = ds.Orders.$find({pageSize:999999999});
            values.collections.PartNumber = ds.PartNumber.$find({pageSize:999999999});
            values.collections.Molds = ds.Molds.$find({pageSize:999999999});
         });
     };

     values.generateCustomers = function(qty){
        
         var prodType = ['Automotive', 'Aftermarket', 'Electronics', 'Jewelry', 'Industrial', 'Consumer'];
         var terms = ['Net 10', 'Net 15', 'Net 30', 'Net 60', '2nd Day 2nd Month'];
         

         for (i = 0; i < qty; i++) { 
            var cs = $wakanda.$ds.Customer.$create({
                name: chance.name(),
                representative: chance.name(),
                einNo: chance.ssn({ dashes: false }),
                notes: chance.paragraph(),
                productTypeRef: chance.pick(prodType),
                terms: chance.pick(terms)
            });
            cs.$save().then(function(data){
                console.log(i);
                console.log(data);
            });
        }
     };
     

    values.generateContacts = function(qty){
        var titles = ['Accountant', 'Manager', 'VP', 'President', 'CEO', 'Secretary', 'Sales', 'Supervisor', 'Foreman'];
        var depts = ['Operations', 'Quality', 'Shipping', 'Office', 'Inspection', 'Receiving'];
        angular.forEach(values.collections.Customers, function(customer, key) {
            //name, customer, title, dept, notes
            for (i = 0; i < qty; i++) { 
                var cs = $wakanda.$ds.Contact.$create({
                    customer: customer,
                    name: chance.name(),
                    title: chance.pick(titles),
                    dept: chance.pick(depts),
                    notes: chance.paragraph()
                });
                cs.$save().then(function(data){
                    console.log(i);
                    console.log(data);
                });
            }
        });
    }; 

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
