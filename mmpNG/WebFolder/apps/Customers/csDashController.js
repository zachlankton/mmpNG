
myApp.controller('customerDash', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.cd = csAppData.getData();
	var sc = $scope.cd;

	var rootDir = "/apps/Customers/csDashTabs/";
	sc.csTabs = [];
	sc.csTabs.push({title:"Overview", 	templateUrl: rootDir+"overview/overview.html"});
	sc.csTabs.push({title:"Contacts", 	templateUrl: rootDir+"contacts/contacts.html"});
	sc.csTabs.push({title:"Addresses", 	templateUrl: rootDir+"addresses/addresses.html"});
	sc.csTabs.push({title:"Parts", 		templateUrl: rootDir+"parts/parts.html"});
	sc.csTabs.push({title:"Quotes", 	templateUrl: rootDir+"quotes/quotes.html"});
	sc.csTabs.push({title:"Orders", 	templateUrl: rootDir+"orders/orders.html"});
	sc.csTabs.push({title:"Files", 		templateUrl: rootDir+"files/files.html"});
	sc.csTabs.push({title:"Issues", 	templateUrl: rootDir+"issues/issues.html"});
   
	if (sc.Customers.currentTab == undefined){
		sc.Customers.currentTab = {};
		sc.Customers.currentTab = sc.csTabs[0];
	}
	
	sc.Customers.activeTab = function(tab){
		return sc.Customers.currentTab.title == tab.title;
	};

	

		
  
});
