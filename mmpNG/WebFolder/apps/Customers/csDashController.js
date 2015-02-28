
myApp.controller('customerDash', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.cd = csAppData.getData();
	var sc = $scope.cd;
   
		if (sc.Customers.currentTab == undefined){
			sc.Customers.currentTab = "Overview";	
		}
        sc.Customers.activeTab = function(tabName){
        	return sc.Customers.currentTab == tabName;
        };

		
  
});
