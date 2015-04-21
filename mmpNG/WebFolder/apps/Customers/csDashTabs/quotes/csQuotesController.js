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
			rScope.current.CustomerSupplierQuotes = newEntity;
		})
	};


    ///////////////////////////
    // DELETE SUPPLIER QUOTE //
    ///////////////////////////
    csQuotes.deleteThisSpQuote = function(){
        rScope.confirmDelete(rScope.current.CustomerSupplierQuotes.spQuote, function(){
            rScope.removeFromCollection(rScope.current.CustomerSupplierQuotes, 'CustomerSupplierQuotes');
            rScope.current.CustomerSupplierQuotes = {};
        });
    }

    //////////////////////////////
    //  UNRELATE SUPPLIER QUOTE //
    //////////////////////////////
    csQuotes.unRelateSpQuote = function(){
        rScope.current.CustomerSupplierQuotes.$remove().then(function(){
            rScope.removeFromCollection(rScope.current.CustomerSupplierQuotes, 'CustomerSupplierQuotes');
            rScope.current.CustomerSupplierQuotes = {};
        });        
    };
  
});