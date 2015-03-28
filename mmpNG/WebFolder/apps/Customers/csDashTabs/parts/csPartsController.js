myApp.controller('csPartsController', function ($scope, $wakanda, $filter, csAppData) {
    
	$scope.csParts = csAppData.getData();
	var rScope = $scope.csParts;
	var csParts = rScope.csParts = {};
	csParts.partSearch = "";
	csParts.partRevSearch = "";

	var ot = csParts.opTypes = [];
	ot.push("Internal");
	ot.push("External");
   
   
    ///////////////////////////
	// GET CUSTOMER PARTS    //
	///////////////////////////
    csParts.getParts = function(){
        csParts.currentPart = {};
        csParts.currentPartRev = {};
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csParts = $wakanda.$ds.PartNumber.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};

	//////////////////////////
    // ADD CUSTOMER PART    //
    //////////////////////////
	csParts.addPart = function(){
		var partNo = csParts.partSearch;
		var newEntity = $wakanda.$ds.PartNumber.$create({
                partNo: partNo,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			csParts.currentPart = {};
			csParts.getParts();
		})
	};

	////////////////////////////////////////
    // SET THE CURRENTLY SELECTED PART    //
    ////////////////////////////////////////
	csParts.setCurrentPart = function(part){
		csParts.currentPart = part;
		csParts.currentPart.show = true;
		csParts.getPartRevs();
		csParts.currentPartRev = {};
	};

	/////////////////////////////////////////
    // SET THE CURRENTLY SELECTED PART REV //
    /////////////////////////////////////////
	csParts.setCurrentPartRev = function(partRev){
		csParts.currentPartRev = partRev;
		csParts.currentPartRev.show = true;
		csParts.getPartsRouting();
	};


	//////////////////////////////
    // GET RELATED PART REVS    //
    //////////////////////////////
	csParts.getPartRevs = function(){
	    csParts.currentPartRev = {};
		var curPart = csParts.currentPart;

		rScope.collections.csPartRevs = $wakanda.$ds.PartRev.$find({
			filter: 'partNo = :1',
			params: [curPart.partNo],
			pageSize: 999999999
		});
	};

    ///////////////////////////////////
    // GET RELATED PART REVS ROUTING //
    ///////////////////////////////////
	csParts.getPartsRouting = function(){
	    var curPartRev = csParts.currentPartRev;

	    rScope.collections.PartsRouting = $wakanda.$ds.Routing.$find({
	        filter: 'partRev.ID = :1',
	        params: [curPartRev.ID],
	        pageSize: 999999999
	    });
	};

    ///////////////////////////////////
    // ADD PART ROUTING STEP         //
    ///////////////////////////////////
	csParts.addPartRoutingStep = function(){
        var rToAdd = csParts.routeToAdd;
        if (rToAdd == undefined){return 0;}
        if (rToAdd.sqLine == undefined){return 0;}
        var sqLine = rToAdd.sqLine;
        var partRev = csParts.currentPartRev;
        var stepNo = rToAdd.stepNo;
        var opType = rToAdd.opType;

		var newEntity = $wakanda.$ds.Routing.$create({
                supplierQuoteLine: sqLine,
                partRev: partRev,
                stepNo: stepNo,
                opType: opType
            });

		newEntity.$save().then(function(e) {
			
			csParts.getPartsRouting();
			csParts.routeToAdd = {};
			
		});
	};


    ///////////////////////////////////
    // SELECT SUPPLIER QUOTE LINE    //
    ///////////////////////////////////
	csParts.selectSupplierQuoteLine = function(){

	    if (csParts.currentPartRev.quoteNo == undefined){
            alert ("You Need to Associate a Customer Quote with this part first!");
            return 0;
	    }
	    var search = csParts.currentPart.partNo;
	    if (csParts.routeToAdd == undefined){csParts.routeToAdd = {};}
	    rScope.SAM.partsRoutingQuoteLines(csParts.routeToAdd, search)
	};



	

	//////////////////////////////
    // SELECT CUSTOMER QUOTE    //
    //////////////////////////////
    csParts.selectQuoteLine = function(){
        var search = csParts.currentPart.partNo;
        var curPartRev = csParts.currentPartRev;
        var attr = "quoteLineRef"
        rScope.SAM.csQuoteLines(curPartRev, attr, search);
    };

    

	//////////////////////////////
    // ADD RELATED PART REV     //
    //////////////////////////////
	csParts.addPartRev = function(){
		var partRev = csParts.partRevSearch;
		var newEntity = $wakanda.$ds.PartRev.$create({
                revision: partRev,
                part: csParts.currentPart
            });

		newEntity.$save().then(function(e) {
			csParts.currentRev = {};
			csParts.getPartRevs();
			
		});
	};


	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csParts.Customers.currentSelection', function(newValue, oldValue) {
		csParts.getParts();
		csParts.currentPart = {};
		csParts.currentPartRev = {};
	});


	///////////////////////////////////////////////
    // SHOW THE ADD PART LINK LOGIC FOR PARTS //
    ///////////////////////////////////////////////
	csParts.showPartAdd = function() {
			var searchBox = csParts.partSearch;
			var collection = rScope.collections.csParts;
			var colAttrToCompare = "partNo"; 	

            return rScope.showAdd(searchBox, collection, colAttrToCompare);
        };


    ///////////////////////////////////////////////////
    // SHOW THE ADD PART REV LINK LOGIC FOR PART REVS //
    ///////////////////////////////////////////////////
	csParts.showPartRevAdd = function() {
			var searchBox = csParts.partRevSearch;
			var collection = rScope.collections.csPartRevs;
			var colAttrToCompare = "revision"; 	

            return rScope.showAdd(searchBox, collection, colAttrToCompare);
        };
			
  
});



