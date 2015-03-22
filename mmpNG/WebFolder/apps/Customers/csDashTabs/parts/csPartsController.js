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
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csParts = $wakanda.$ds.PartNumber.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};
	csParts.getParts();

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
	    if (csParts.quoteNo == undefined){
            alert ("You Need to Associate a Customer Quote with this part first!");
            return 0;
	    }
	    //display the confirmation modal
	    rScope.reusable.modal.templateUrl = "asasd";
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/parts/partsRoutingSelect.html";
		$('#reusable-modal').modal('show');
	};



	

	//////////////////////////////
    // SELECT CUSTOMER QUOTE    //
    //////////////////////////////
    csParts.selectQuoteLine = function(){
        //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/parts/csSelectQuoteLine.html";
		$('#reusable-modal').modal('show');
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


	////////////////////////////
	// DELETE CURRENT PART    //  //TODO: Make sure Server Side Removes Related Revs
	////////////////////////////  
	csParts.deleteCurrentPart = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/parts/deletePartModal.html";
		$('#reusable-modal').modal('show');
	
	};


	/////////////////////////////
	// DELETE CURRENT PART REV //  //TODO: Make sure Server Side Removes Related Revs
	/////////////////////////////  
	csParts.deleteCurrentPartRev = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/parts/deletePartRevModal.html";
		$('#reusable-modal').modal('show');
	
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

            if (searchBox == "") {
                return false;  
            }

            var results = ($filter('filter')(collection, function(val, index) { 
                if (val[colAttrToCompare] == null) {
                    return false;   
                }
                if (val[colAttrToCompare].toLowerCase() == searchBox.toLowerCase()) {
                    return true;  
                }
            }));

            if (results.length > 0) {
                return false;  	
            }
            return true;  
        };


    ///////////////////////////////////////////////////
    // SHOW THE ADD PART REV LINK LOGIC FOR PART REVS //
    ///////////////////////////////////////////////////
	csParts.showPartRevAdd = function() {
			var searchBox = csParts.partRevSearch;
			var collection = rScope.collections.csPartRevs;
			var colAttrToCompare = "revision"; 	

            if (searchBox == "") {
                return false;  
            }

            var results = ($filter('filter')(collection, function(val, index) { 
                if (val[colAttrToCompare] == null) {
                    return false;   
                }
                if (val[colAttrToCompare].toLowerCase() == searchBox.toLowerCase()) {
                    return true;  
                }
            }));

           
            if (results.length > 0) {
                return false;  	
            }
            return true;  
        };
			
  
});



//////////////////////////////////////////////////
// DELETE PART MODAL CONFIRMATION CONTROLLER    //
//////////////////////////////////////////////////
myApp.controller('deletePartModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deletePart = csAppData.getData();
	var csParts = $scope.deletePart.csParts;
	var deletePart = $scope.deletePart.deletePart = {};

	deletePart.Yes = function(){
		csParts.currentPart.$remove()
		.then(function(e){
			csParts.currentPart = {};
			csParts.getParts();
			$('#reusable-modal').modal('hide');
		});
	};

	deletePart.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );


///////////////////////////////////////////////////
// DELETE PART REV MODAL CONFIRMATION CONTROLLER //
///////////////////////////////////////////////////
myApp.controller('deletePartRevModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deletePartRev = csAppData.getData();
	var csParts = $scope.deletePartRev.csParts;
	var deletePartRev = $scope.deletePartRev.deletePartRev = {};

	deletePartRev.Yes = function(){
		csParts.currentPartRev.$remove()
		.then(function(e){
			csParts.currentPartRev = {};
			csParts.getPartRevs();
			$('#reusable-modal').modal('hide');
		});
	};

	deletePartRev.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );


///////////////////////////////////////////////////
// SELECT QUOTE LINE MODAL CONTROLER             //
///////////////////////////////////////////////////
myApp.controller('csPartQuoteLineSelectController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.csPartQuoteLines = csAppData.getData();
	var rScope = $scope.csPartQuoteLines;
	var csPartQuoteLines = rScope.csPartQuoteLines = {};
	var csParts = rScope.csParts;

    /////////////////////////////////
	// GET CUSTOMER QUOTE LINES    //
	/////////////////////////////////
    csPartQuoteLines.getQuoteLines = function(){
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csPartQuoteLines = $wakanda.$ds.CsQuoteLineItems.$find({
			filter:'customerName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};
	csPartQuoteLines.getQuoteLines();

	//////////////////////////////
    // SET PART QUOTE LINE     //
    //////////////////////////////
    csPartQuoteLines.setPartQuoteLine = function(quoteLine){
        csParts.currentPartRev.$_entity.quoteLineRef.setValue(quoteLine.$_entity);
        csParts.currentPartRev.$save()
        .then(function(){
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
        
        
    };
} );





/////////////////////////////////////////////////////
// SELECT PARTS ROUTING QUOTE LINE MODAL CONTROLER //
/////////////////////////////////////////////////////
myApp.controller('partsRoutingController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.partsRouting = csAppData.getData();
	var rScope = $scope.partsRouting;
	var partsRouting = rScope.partsRouting = {};
	var csParts = rScope.csParts;


    //////////////////////////////////////////////////////////////////
	// GET SUPPLIER QUOTE LINES RELATED TO CURRENT PART REV QUOTE   //
	//////////////////////////////////////////////////////////////////
    partsRouting.getQuoteLines = function(){
		var curPartRevQuoteNo = rScope.csParts.currentPartRev.quoteNo;
		
		rScope.collections.prSpQLineSelect = $wakanda.$ds.SupplierQuoteLine.$find({
			filter:'spQuoteRef.customerSupplierQuotesCollection.csQuoteNo = :1',
			params:[curPartRevQuoteNo],
			pageSize:999999999,
		});	
	};
	partsRouting.getQuoteLines();

	///////////////////////////////////
    // SET PARTS ROUTING QUOTE LINE  //
    ///////////////////////////////////
    partsRouting.setPartsRoutingQuoteLine = function(quoteLine){
        
        if (csParts.routeToAdd == undefined){csParts.routeToAdd = {};}
        csParts.routeToAdd.sqLine = quoteLine;
        rScope.reusable.modal.templateUrl = "";
        $('#reusable-modal').modal('hide');
   
        
        
    };
} );







