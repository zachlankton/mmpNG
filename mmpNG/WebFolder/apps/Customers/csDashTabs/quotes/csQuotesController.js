myApp.controller('csQuotesController', function ($scope, $wakanda, $filter, csAppData) {
	

	$scope.csQuotes = csAppData.getData();
	var rScope = $scope.csQuotes;
	var csQuotes = rScope.csQuotes = {};


    /////////////////////////////////////
    // RELATE EXISTING SUPPLIER QUOTE  //
    /////////////////////////////////////
	csQuotes.relateExistingSupplierQuote = function(spQuote){
	    var curQuote = rScope.current.CustomerQuotes

        var newEntity = $wakanda.$ds.CustomerSupplierQuotes.$create({
                csQuote: curQuote,
                spQuote: spQuote
            });

		newEntity.$save().then(function(e) {
			rScope.collections.CustomerSupplierQuotes.push(newEntity);
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

  
});