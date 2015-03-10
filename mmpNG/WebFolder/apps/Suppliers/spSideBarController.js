myApp.controller('supplierList', function($scope, $wakanda, $filter, csAppData) {

	$scope.sp = csAppData.getData();
	var sc = $scope.sp;
    
		//This is used for searching and keeping track of things
        if (sc.Suppliers.searchText == undefined){  // we first check if it is undefined so we do not overwrite a previously set value
        	sc.Suppliers.searchText = "";	
        }
        if (sc.Suppliers.currentSupplier == undefined){
        	sc.Suppliers.currentSupplier = {};	
        }
		
		sc.Suppliers.selectSP = function(supplier){
			sc.Suppliers.currentSupplier = supplier;
			sc.Suppliers.currentSupplier.show = true;
		};

        sc.Suppliers.add = function() {
            var supplierName = sc.Suppliers.searchText;
            var newEntity;
            newEntity = $wakanda.$ds.Supplier.$create({
                name: supplierName
            });
            
            newEntity.$save().then(function(e) {

                sc.collections.Suppliers = $wakanda.$ds.Supplier.$find({pageSize:9999});
                sc.collections.Suppliers.$promise //Wait for the $find function to finish and then select the newly created Customer
                .then(function(e) {
                	
                	//select the newly created Customer
                    sc.Suppliers.currentSupplier = ($filter('filter')(sc.collections.Suppliers, function(val, index) {
						if (val.name == null) {
							return false;
						}
						if (val.name.toLowerCase() == supplierName.toLowerCase()) {
							return true;
						}
					}))[0];

                });
            });
        };


        sc.Suppliers.showAdd = function() {
            if (sc.Suppliers.searchText == "") {
                return false;
            }

            var results = ($filter('filter')(sc.collections.Suppliers, function(val, index) {
                if (val.name == null) {
                    return false;
                }
                if (val.name.toLowerCase() == sc.Suppliers.searchText.toLowerCase()) {
                    return true;
                }
            }));

            if (results.length > 0) {
                return false;
            }
            return true;
        };

   
});
