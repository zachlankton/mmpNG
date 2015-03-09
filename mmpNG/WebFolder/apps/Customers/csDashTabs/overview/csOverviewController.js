myApp.controller('csOverviewController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOverview = csAppData.getData();
	var rScope = $scope.csOverview;
	var csOverview = rScope.csOverview = {};

    var pt = csOverview.productTypes = [];
    pt.push('Aerospace');
    pt.push('Automotive');
    pt.push('Auto Aftermarket');
    pt.push('Consumer Product');
    pt.push('Diagnostics');
    pt.push('Electronics');
    pt.push('Military');
    pt.push('Other');
    pt.push('Prototype');
    pt.push('University');
    
	
	var c = rScope.Customers.currentSelection;
		
  
});
