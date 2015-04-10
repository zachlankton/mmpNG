myApp.controller('csPartsController', function ($scope, $wakanda, $filter, csAppData) {
    
	$scope.csParts = csAppData.getData();
	var rScope = $scope.csParts;
	var csParts = rScope.csParts = {};
	csParts.partSearch = "";
	csParts.partRevSearch = "";

	var ot = csParts.opTypes = [];
	ot.push("Internal");
	ot.push("External");
  
    ///////////////////////////////////
    // SELECT SUPPLIER QUOTE LINE    //
    ///////////////////////////////////
	csParts.selectSupplierQuoteLine = function(routeToAddObj){

	    if (rScope.current.PartRev.quoteNo == undefined){
            alert ("You Need to Associate a Customer Quote with this part first!");
            return 0;
	    }
	    var search = rScope.current.PartNumber.partNo;
	    rScope.SAM.partsRoutingQuoteLines(routeToAddObj, search)
	};

	//////////////////////////////
    // SELECT CUSTOMER QUOTE    //
    //////////////////////////////
    csParts.selectQuoteLine = function(){
        var search = rScope.current.PartNumber.partNo;
        var curPartRev = rScope.current.PartRev;
        var attr = "quoteLineRef"
        rScope.SAM.csQuoteLines(curPartRev, attr, search);
    };

});



