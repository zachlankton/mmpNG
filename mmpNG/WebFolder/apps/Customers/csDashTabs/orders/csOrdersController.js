myApp.controller('csOrdersController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOrders = csAppData.getData();
	var rScope = $scope.csOrders;
	var csOrders = rScope.csOrders;
	
   
			
  
});
