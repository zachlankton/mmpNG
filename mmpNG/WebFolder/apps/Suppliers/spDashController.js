
myApp.controller('supplierDash', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.sp = csAppData.getData();
	var sc = $scope.sp;

	var rootDir = "/apps/Suppliers/spDashTabs/";
	sc.spTabs = [];
	sc.spTabs.push({title:"Overview", 	templateUrl: rootDir+"overview/overview.html"});
	sc.spTabs.push({title:"Contacts", 	templateUrl: rootDir+"contacts/contacts.html"});
	sc.spTabs.push({title:"Addresses", 	templateUrl: rootDir+"addresses/addresses.html"});
	sc.spTabs.push({title:"Quotes", 	templateUrl: rootDir+"quotes/quotes.html"});
	sc.spTabs.push({title:"Purchase Orders", 	templateUrl: rootDir+"purchaseOrders/purchaseOrders.html"});
	sc.spTabs.push({title:"Files", 		templateUrl: rootDir+"files/files.html"});
	sc.spTabs.push({title:"Issues", 	templateUrl: rootDir+"issues/issues.html"});
   
	if (sc.Suppliers.currentTab == undefined){
		sc.Suppliers.currentTab = {};
		sc.Suppliers.currentTab = sc.spTabs[0];
	}
	
	sc.Suppliers.activeTab = function(tab){
		return sc.Suppliers.currentTab.title == tab.title;
	};

	

		
  
});
