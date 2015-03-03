myApp.controller('csIssuesController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csIssues = csAppData.getData();
	var rScope = $scope.csIssues;
	var csIssues = rScope.csIssues;
	
   
			
  
});
