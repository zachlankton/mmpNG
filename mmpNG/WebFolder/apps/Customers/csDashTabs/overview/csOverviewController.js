myApp.controller('csOverviewController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOverview = csAppData.getData();
	var rScope = $scope.csOverview;
	var csOverview = rScope.csOverview = {};

	
	var c = rScope.Customers.currentSelection;
   	var csFields = csOverview.csFields = [];
   	csFields.push({title:"Customer Name", type:"text", name: "name" });
   	csFields.push({title:"Product Type", type:"text", name: "productTypeRef"});
   	csFields.push({title:"EIN No", type:"text", name: "einNo"});
   	csFields.push({title:"Terms", type:"text", name: "terms"});
   	csFields.push({title:"Representative", type:"text", name: "representative"});
   	csFields.push({title:"Notes", type:"textarea", name: "notes"});

			
  
});
