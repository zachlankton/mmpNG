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
                filter:'spQuoteID = :1',
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
        var spQuote = csQuotes.currentSupplierQuote;
        rScope.SAM.selectSupplier(spQuote, "supplier");
        console.log(spQuote);
    };


    ///////////////////////////////
	// SELECT SUPPLIER CONTACT   //
	///////////////////////////////
    spQuotes.selectSupplierContact = function(){
        var spQuote = csQuotes.currentSupplierQuote;
        var supplier = csQuotes.currentSupplierQuote.supplier;
        rScope.SAM.spContacts(spQuote, "contact", supplier);
    };


});

