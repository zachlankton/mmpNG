
var myApp = angular.module('mainPage', ['wakanda']);

myApp.controller('customerList', function ($scope, $wakanda, $filter) {
	
	
    $wakanda.init().then(function oninit(ds) {
 
        
        $scope.CustomersCollection = ds.Customer.$find();
		
        $scope.Customers = {};
        $scope.Customers.searchText = "";
        


        $scope.Customers.currentTab = "Overview";
        $scope.Customers.activeTab = function(tabName){
        	return $scope.Customers.currentTab == tabName;
        };

        



        $scope.Customers.add = function(){
        	var customerName = $scope.Customers.searchText;
			var newEntity;
			newEntity = ds.Customer.$create({name: customerName});
			newEntity.$save().then(function(e){
				$scope.CustomersCollection = ds.Customer.$find();
				$scope.CustomersCollection.$promise //Wait for the $find function to finish and then select the newly created Customer
				.then(function() {
					$scope.Customers.currentSelection = ($filter('filter')($scope.CustomersCollection, {name: customerName}) )[0] ;
				});
			});
		};


		$scope.Customers.showAdd = function(){
			if ($scope.Customers.searchText == ""){return false;}

			var results = ($filter('filter')($scope.CustomersCollection, function(val, index){
				if (val.name == null){return false;}
				if (val.name.toLowerCase() == $scope.Customers.searchText.toLowerCase() ){
					return true;
				}
			}) );
			
			if (results.length > 0) { return false; }
			return true;
		};
		
    });
});