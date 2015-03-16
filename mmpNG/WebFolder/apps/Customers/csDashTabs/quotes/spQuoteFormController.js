myApp.controller('spQuoteFormController', function ($scope, $wakanda, $filter, csAppData) {

    $scope.spQuotes = csAppData.getData();
	var rScope = $scope.spQuotes;
	var spQuotes = rScope.spQuotes = {};
	var csQuotes = rScope.csQuotes;
	csQuotes.currentSupplierQuote = {};



	///////////////////////////////
	// GET SUPPLIER QUOTES LINES //
	///////////////////////////////
    spQuotes.getQuoteLines = function(){
		var curQuote = csQuotes.currentSupplierQuote;

        if (curQuote.ID !== undefined){
            var wY = window.scrollY;
            rScope.collections.spQuoteLines = $wakanda.$ds.SupplierQuoteLine.$find({
                filter:'quoteNo = :1',
                params:[curQuote.ID],
                pageSize:999999999,
                select: 'supplierQuoteLineQtysCollection'
            });	
            rScope.collections.spQuoteLines.$promise.then(function(){
                setTimeout(function(){
                    window.scrollTo(0,wY);
                },10);

            });	
        }
        	
		
	};



	///////////////////////////////
	// ADD SUPPLIER QUOTES LINE  //
	///////////////////////////////
    spQuotes.addQLine = function(){
        var totalLines = rScope.collections.spQuoteLines.$totalCount;
        var curQuote = csQuotes.currentSupplierQuote;
        var newEntity = $wakanda.$ds.SupplierQuoteLine.$create({
            lineID: totalLines + 1,
            spQuoteRef: curQuote
        });

        newEntity.$save().then(function(){
            spQuotes.getQuoteLines();
        });
    };


    ////////////////////////////////////
	// ADD SUPPLIER QUOTES LINE QTYS  //
	////////////////////////////////////
    spQuotes.addQLIQ = function(qLine){
        var newEntity = $wakanda.$ds.SupplierQuotePriceBreak.$create({
            quoteLineRef: qLine
        });
        newEntity.$save().then(function(){
            spQuotes.getQuoteLines();
        });
    };



    ///////////////////////////////////////
	// REMOVE SUPPLIER QUOTES LINE QTYS  //
	///////////////////////////////////////
    spQuotes.removeQLIQ = function(qliq){
        qliq.$remove().then(function(){
            spQuotes.getQuoteLines();
        });
    };



    //////////////////////////////////
	// REMOVE SUPPLIER QUOTES LINE  //
	//////////////////////////////////
    spQuotes.remove = function(qLine){
        qLine.$remove().then(function(){spQuotes.getQuoteLines();});
    };




    //////////////////////////////////
	// SAVE SUPPLIER QUOTES LINE    //
	//////////////////////////////////
    spQuotes.saveQuoteLine = function(qLine){
        qLine.$save().then(function(){
            csQuotes.currentSupplierQuote.tempModAttr = new Date();
            
            spQuotes.saveCurrentSupplierQuote();
        });
    };



    ///////////////////////////////////
	// SAVE SUPPLIER QUOTES LINE QTY //
	///////////////////////////////////
    spQuotes.saveQLIQ = function(qliq){
        qliq.$save().then(function(){
            csQuotes.currentSupplierQuote.tempModAttr = new Date();
            
            spQuotes.saveCurrentSupplierQuote();
        });
    };



    //////////////////////////////////////////
    // WATCH FOR QUOTE SELECTION CHANGES    //
    //////////////////////////////////////////
	$scope.$watch('spQuotes.csQuotes.currentSupplierQuote', function(newValue, oldValue) {
		spQuotes.getQuoteLines();
	});



    ///////////////////////////////
	// SAVE SUPPLIER QUOTE       //
	///////////////////////////////
    spQuotes.saveCurrentSupplierQuote = function(){

        csQuotes.currentSupplierQuote.$save().then(function(){
            csQuotes.currentSpQuoteForm.$setPristine();
        });
    };




    ///////////////////////////////
	// SELECT SUPPLIER FOR QUOTE //
	///////////////////////////////
    spQuotes.selectSupplier = function(){
        //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/supplierSelectModal.html";
		$('#reusable-modal').modal('show');
    };


    ///////////////////////////////
	// SELECT SUPPLIER CONTACT   //
	///////////////////////////////
    spQuotes.selectSupplierContact = function(){
        //display the confirmation modal
        var supplier = $wakanda.$ds.Supplier.$find({
			filter:'name = :1',
			params:[csQuotes.currentSupplierQuote.sName],
		});	
        
		supplier.$promise.then(function(){
		    rScope.Suppliers.currentSupplier = supplier[0];
		});

        
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/selectSupplierContact.html";
		$('#reusable-modal').modal('show');
    };


});




    ///////////////////////////////
	// SUPPLIER MODAL CONTROLLER //
	///////////////////////////////
myApp.controller('spQuoteSupplierSelectController', function ($scope, $wakanda, $filter, csAppData) {

    $scope.spQSupplierSelect = csAppData.getData();
	var rScope = $scope.spQSupplierSelect;
	var spQSupplierSelect = rScope.spQSupplierSelect = {};
	var csQuotes = rScope.csQuotes;

    spQSupplierSelect.selectCurrentQuoteSupplier = function(supplier){
	    csQuotes.currentSupplierQuote.$_entity.supplier.setValue(supplier.$_entity);
	    csQuotes.currentSupplierQuote.$_entity.contact.setValue({});
        csQuotes.currentSupplierQuote.$save()
        .then(function(){
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
	};




});




    ///////////////////////////////
	// SUPPLIER CONTACTS MODAL   //
	///////////////////////////////
myApp.controller('spQuoteSupplierSelectContactController', function ($scope, $wakanda, $filter, csAppData) {

    $scope.spQContactSelect = csAppData.getData();
	var rScope = $scope.spQContactSelect;
	var spQContactSelect = rScope.spQContactSelect = {};
	var csQuotes = rScope.csQuotes;

    spQContactSelect.selectCurrentQuoteSupplierContact = function(contact){
	    csQuotes.currentSupplierQuote.$_entity.contact.setValue(contact.$_entity);
        csQuotes.currentSupplierQuote.$save()
        .then(function(){
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
	};




});







