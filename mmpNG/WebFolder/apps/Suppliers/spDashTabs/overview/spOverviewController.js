myApp.controller('spOverviewController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.spOverview = csAppData.getData();
	var rScope = $scope.spOverview;
	var spOverview = rScope.spOverview = {};

    var pt = spOverview.supplierTypes = [];
    pt.push('Machining');
    pt.push('Coating');
    pt.push('Plating');
    pt.push('Freight');
    pt.push('Other');
    pt.push('Tooling');
    pt.push('Bank');
    pt.push('Representative');
    pt.push('Consultant');
    pt.push('Accountant');
    pt.push('Lawyer');
    pt.push('Office Supplier');
    pt.push('Shop Supplier');
    pt.push('Magnesium Supplier');
    pt.push('Professional Service');
    pt.push('Finished');
    pt.push('Cast Trimmed');
    pt.push('Contract Labor');
    pt.push('Utilities');
    pt.push('Gage Maker');
   
	var ss = spOverview.supplierStatus = [];	
	ss.push('Approved');
	ss.push('Denied');
	ss.push('Pending');
	ss.push('Suspended');
	
  
});
