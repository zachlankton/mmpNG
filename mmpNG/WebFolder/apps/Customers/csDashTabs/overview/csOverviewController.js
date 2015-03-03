myApp.controller('csOverviewController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOverview = csAppData.getData();
	var rScope = $scope.csOverview;
	var csOverview = rScope.csOverview = {};

	
   	var csFields = csOverview.csFields = [];
   	csFields.push({title:"Customer Name", model: ""});
			
  
});
