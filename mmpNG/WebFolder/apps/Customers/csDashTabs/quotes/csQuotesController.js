myApp.controller('csQuotesController', function ($scope, $wakanda, $filter, csAppData) {
	

	$scope.csQuotes = csAppData.getData();
	var rScope = $scope.csQuotes;
	var csQuotes = rScope.csQuotes = {};
	csQuotes.quoteSearch = "";
	csQuotes.spQuoteSearch = "";
   

    ///////////////////////////
	// GET CUSTOMER QUOTES   //
	///////////////////////////
    csQuotes.getQuotes = function(){
        csQuotes.currentQuote = {};
		var curCustomer = rScope.current.Customer;
		
		rScope.collections.csQuotes = $wakanda.$ds.CustomerQuotes.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};



	////////////////////////////////////////
    // SET THE CURRENTLY SELECTED QUOTE   //
    ////////////////////////////////////////
	csQuotes.setCurrentQuote = function(quote){
		csQuotes.currentQuote = quote;
		csQuotes.currentQuote.show = true;
		csQuotes.getSupplierQuotes();
		csQuotes.currentSupplierQuote = {};

	};

	////////////////////////////////////////
    // SAVE THE CURRENTLY SELECTED QUOTE   //
    ////////////////////////////////////////
	csQuotes.saveCurrentQuote = function(){
		var quote = csQuotes.currentQuote;
		
		quote.$save()
		.then(function(a){
		    csQuotes.currentQuoteForm.$setPristine();
		})
		.catch(function(error){
            console.log(error);
		});

	};


	///////////////////////////////////////////////
    // SET THE CURRENTLY SELECTED SUPPLIER QUOTE //
    ///////////////////////////////////////////////
	csQuotes.setCurrentSpQuote = function(spQuote){
		csQuotes.currentSupplierQuote = spQuote.spQuote;
		csQuotes.currentSupplierQuote.show = true;
	};

	////////////////////////////////////
    // GET RELATED SUPPLIER QUOTES    //
    ////////////////////////////////////
	csQuotes.getSupplierQuotes = function(){
	    csQuotes.currentSupplierQuote = {};
		var curQuote = csQuotes.currentQuote;

		rScope.collections.spQuotes = $wakanda.$ds.CustomerSupplierQuotes.$find({
			filter: 'csQuoteNo = :1',
			params: [curQuote.ID],
			pageSize: 999999999,
			select: "spQuote.supplier"
		});
	};

	/////////////////////////////////
    // ADD RELATED SUPPLIER QUOTE  //
    /////////////////////////////////
	csQuotes.addSpQuote = function(spQuoteNo){
	    var curCustomer = rScope.current.Customer;
		var newEntity = $wakanda.$ds.SupplierQuotes.$create({
		        customer: curCustomer,
                quoteNo: spQuoteNo,
                enteredBy: rScope.currentUser.fullName,
            });

		newEntity.$save().then(function(e) {
			csQuotes.currentSupplierQuote = {};
			csQuotes.relateExistingSupplierQuote(e.rawResult.__ENTITIES[0]);
			
		})
	};

    /////////////////////////////////////
    // RELATE EXISTING SUPPLIER QUOTE  //
    /////////////////////////////////////
	csQuotes.relateExistingSupplierQuote = function(spQuote){
	    var curQuote = csQuotes.currentQuote;

        var newEntity = $wakanda.$ds.CustomerSupplierQuotes.$create({
                csQuote: curQuote,
                spQuote: spQuote
            });

		newEntity.$save().then(function(e) {
			csQuotes.currentSupplierQuote = {};
			csQuotes.getSupplierQuotes();
			
		})
	};

	/////////////////////////////////////
    // SELECT EXISTING SUPPLIER QUOTE  //
    /////////////////////////////////////
	csQuotes.selectExistingSupplierQuote = function(spQuote){
        var curCustomer = rScope.current.Customer.name;
        rScope.SAM.selectExistingSpQuote(csQuotes.relateExistingSupplierQuote, curCustomer);
	};


    /////////////////////////////////////
    // REMOVE SP QUOTE RELATIONSHIP    //
    /////////////////////////////////////
	csQuotes.remSpRel = function(spQuote){
	    spQuote.$remove().then(function(){
	        csQuotes.getSupplierQuotes();
	    });
	}


    //////////////////////////////////////////
    // SELECT CUSTOMER CONTACT (QUOTE FOR)  //
    //////////////////////////////////////////
	csQuotes.selectCustomerContact = function(){
	    var entity = csQuotes.currentQuote;
	    var customer = rScope.current.Customer;
        rScope.SAM.csContacts(entity, "contact", customer);
	};

	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csQuotes.current.Customer', function(newValue, oldValue) {
		csQuotes.getQuotes();
		csQuotes.currentQuote = {};
		csQuotes.currentSupplierQuote = {};
	});


    //////////////////////////////////////////
    // CREATE NEW CUSTOMER QUOTE OBJECT //
    //////////////////////////////////////////
	csQuotes.csQuoteCreateObj = function(quoteTitle){
	    var curCustomer = rScope.current.Customer;
	    return {
	        customer: curCustomer,
	        quoteTitle: quoteTitle
	    };
	};
			
  
});