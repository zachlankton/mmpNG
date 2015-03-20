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
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csQuotes = $wakanda.$ds.CustomerQuotes.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};

	
	csQuotes.getQuotes();

	

	//////////////////////////
    // ADD CUSTOMER QUOTE   //
    //////////////////////////
	csQuotes.addQuote = function(){
		var quoteTitle = csQuotes.quoteSearch;
		var newEntity = $wakanda.$ds.CustomerQuotes.$create({
                quoteTitle: quoteTitle,
                quoteBy: rScope.currentUser.fullName,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			csQuotes.currentQuote = {};
			csQuotes.getQuotes();
		})
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
		csQuotes.currentSupplierQuote = spQuote;
		csQuotes.currentSupplierQuote.show = true;
	};

	////////////////////////////////////
    // GET RELATED SUPPLIER QUOTES    //
    ////////////////////////////////////
	csQuotes.getSupplierQuotes = function(){
		var curQuote = csQuotes.currentQuote;

		rScope.collections.spQuotes = $wakanda.$ds.CustomerSupplierQuotes.$find({
			filter: 'csQuoteNo = :1',
			params: [curQuote.ID],
			pageSize: 999999999,
			select: "spQuote"
		});
	};

	/////////////////////////////////
    // ADD RELATED SUPPLIER QUOTE  //
    /////////////////////////////////
	csQuotes.addSpQuote = function(){
		var spQuoteNo = csQuotes.spQuoteSearch;
		var newEntity = $wakanda.$ds.SupplierQuotes.$create({
                quoteNo: spQuoteNo,
                enteredBy: rScope.currentUser.fullName,
            });

		newEntity.$save().then(function(e) {
			console.log(e);
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
         //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/selectExistingSupplierQuote.html";
		$('#reusable-modal').modal('show');
	};

	////////////////////////////
    // DELETE CURRENT QUOTE    //  //TODO: Make sure Server Side Removes Related Quote Info
	////////////////////////////  
	csQuotes.deleteCurrentQuote = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/deleteQuoteModal.html";
		$('#reusable-modal').modal('show');	
	};

	///////////////////////////////////
	// DELETE CURRENT SUPPLIER QUOTE //  //TODO: Make sure Server Side Removes Related Supplier Quote Info
	/////////////////////////////////// 
	csQuotes.deleteCurrentSupplierQuote = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/deleteSupplierQuoteModal.html";
		$('#reusable-modal').modal('show');
	};

    //////////////////////////////////////////
    // SELECT CUSTOMER CONTACT (QUOTE FOR)  //
    //////////////////////////////////////////
	csQuotes.selectCustomerContact = function(){
        //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/quotes/selectContact.html";
		$('#reusable-modal').modal('show');
	};

	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csQuotes.Customers.currentSelection', function(newValue, oldValue) {
		csQuotes.getQuotes();
		csQuotes.currentQuote = {};
		csQuotes.currentSupplierQuote = {};
	});

	///////////////////////////////////////////////
    // SHOW THE ADD LINK LOGIC FOR QUOTES        //
    ///////////////////////////////////////////////
	csQuotes.showQuoteAdd = function() {
			var searchBox = csQuotes.quoteSearch;
			var collection = rScope.collections.csQuotes;
			var colAttrToCompare = "quoteTitle"; 	

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
    // SHOW THE ADD LINK LOGIC FOR SUPPLIER QUOTES   //
    ///////////////////////////////////////////////////
	csQuotes.showSpQuoteAdd = function() {
			var searchBox = csQuotes.spQuoteSearch;
			var collection = rScope.collections.spQuotes;
			var colAttrToCompare = "quoteNo"; 	

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
// DELETE QUOTE MODAL CONFIRMATION CONTROLLER    //
//////////////////////////////////////////////////
myApp.controller('deleteQuoteModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteQuote = csAppData.getData();
	var csQuotes = $scope.deleteQuote.csQuotes;
	var deleteQuote = $scope.deleteQuote.deleteQuote = {};

	deleteQuote.Yes = function(){
		csQuotes.currentQuote.$remove()
		.then(function(e){
			csQuotes.currentQuote = {};
			csQuotes.getQuotes();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteQuote.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );


/////////////////////////////////////////////////////////////
// DELETE SUPPLIER QUOTE MODAL CONFIRMATION CONTROLLER //
/////////////////////////////////////////////////////////////
myApp.controller('deleteSupplierQuoteModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteSupplierQuote = csAppData.getData();
	var csQuotes = $scope.deleteSupplierQuote.csQuotes;
	var deleteSupplierQuote = $scope.deleteSupplierQuote.deleteSupplierQuote = {};

	deleteSupplierQuote.Yes = function(){
		csQuotes.currentSupplierQuote.$remove()
		.then(function(e){
			csQuotes.currentSupplierQuote = {};
			csQuotes.getSupplierQuotes();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteSupplierQuote.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );

			
///////////////////////////////////////////
// SELECT QUOTE CONTACT MODAL CONTROLLER //
///////////////////////////////////////////
myApp.controller('csQuotesContactController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.csQC = csAppData.getData();
	var rScope = $scope.csQC;
	var csQuotes = $scope.csQC.csQuotes;
	var csQC = rScope.csQC = {};

	csQC.selectCurrentQuoteContact = function(contact){
	    csQuotes.currentQuote.$_entity.contact.setValue(contact.$_entity);
        csQuotes.currentQuote.$save()
        .then(function(){
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
	};
} );


///////////////////////////////////////////
// SELECT EXISTING SUPPLIER QUOTE MODAL  //
///////////////////////////////////////////
myApp.controller('spQuoteSupplierQuoteSelectController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.spQSQ = csAppData.getData();
	var rScope = $scope.spQSQ;
	var csQuotes = $scope.spQSQ.csQuotes;
	var spQSQ = rScope.spQSQ = {};

	rScope.collections.existingSupplierQuotes = $wakanda.$ds.SupplierQuotes.$find({
        pageSize: 999999999  
	});

	spQSQ.addExistingSupplierQuote = function(spQuote){
	    csQuotes.relateExistingSupplierQuote(spQuote);
        rScope.reusable.modal.templateUrl = "";
        $('#reusable-modal').modal('hide');

	};




} );






