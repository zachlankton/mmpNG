myApp.controller('customerList', function($scope, $wakanda, $filter, csAppData) {

	$scope.cl = csAppData.getData();
	var sc = $scope.cl;
    

		//Get Customer Collection Pass it's reference to $scope
        //$scope.CustomersCollection = ds.Customer.$find();

		//Init Customers Helper Scope
		//This is used for searching and keeping track of things
        if (sc.Customers.searchText == undefined){  // we first check if it is undefined so we do not overwrite a previously set value
        	sc.Customers.searchText = "";	
        }
        if (sc.Customers.currentSelection == undefined){
        	sc.Customers.currentSelection = {};	
        }
		
		sc.Customers.selectCS = function(customer){
			sc.Customers.currentSelection = customer;
		};

        sc.Customers.add = function() {
            var customerName = sc.Customers.searchText;
            var newEntity;
            newEntity = $wakanda.$ds.Customer.$create({
                name: customerName
            });
            
            newEntity.$save().then(function(e) {

                sc.CustomersCollection = $wakanda.$ds.Customer.$find({pageSize:9999});
                sc.CustomersCollection.$promise //Wait for the $find function to finish and then select the newly created Customer
                .then(function(e) {
                	
                	//select the newly created Customer
                    sc.Customers.currentSelection = ($filter('filter')(sc.CustomersCollection, function(val, index) {
						if (val.name == null) {
							return false;
						}
						if (val.name.toLowerCase() == customerName.toLowerCase()) {
							return true;
						}
					}))[0];

                });
            });
        };


        sc.Customers.showAdd = function() {
            if (sc.Customers.searchText == "") {
                return false;
            }

            var results = ($filter('filter')(sc.CustomersCollection, function(val, index) {
                if (val.name == null) {
                    return false;
                }
                if (val.name.toLowerCase() == sc.Customers.searchText.toLowerCase()) {
                    return true;
                }
            }));

            if (results.length > 0) {
                return false;
            }
            return true;
        };

   
});
