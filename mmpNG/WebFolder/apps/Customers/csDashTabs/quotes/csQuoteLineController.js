myApp.controller('csQuoteLinesController', function ($scope, $wakanda, $filter, csAppData) {


    $scope.csQuoteLines = csAppData.getData();
	var rScope = $scope.csQuoteLines;
	var csQuoteLines = rScope.csQuoteLines = {};
	var csQuotes = rScope.csQuotes;
	csQuotes.currentQuote = {};

	///////////////////////////////
	// GET CUSTOMER QUOTES LINES //
	///////////////////////////////
    csQuoteLines.getQuoteLines = function(){
		var curQuote = csQuotes.currentQuote;

        if (curQuote.ID !== undefined){
            var wY = window.scrollY;
            rScope.collections.csQuoteLines = $wakanda.$ds.CsQuoteLineItems.$find({
                filter:'quoteNo = :1',
                params:[curQuote.ID],
                pageSize:999999999,
                select: 'csQuoteLineItemQtysCollection'
            });	
            rScope.collections.csQuoteLines.$promise.then(function(){
                setTimeout(function(){
                    window.scrollTo(0,wY);
                },10);

            });	
        }
        	
		
	};

    


	///////////////////////////////
	// ADD CUSTOMER QUOTES LINE  //
	///////////////////////////////
    csQuoteLines.addQLine = function(){
        var totalLines = rScope.collections.csQuoteLines.$totalCount;
        var curQuote = csQuotes.currentQuote;
        var newEntity = $wakanda.$ds.CsQuoteLineItems.$create({
            lineID: totalLines + 1,
            quoteRef: curQuote
        });

        newEntity.$save().then(function(){
            csQuoteLines.getQuoteLines();
        });
    };


    ////////////////////////////////////
	// ADD CUSTOMER QUOTES LINE QTYS  //
	////////////////////////////////////
    csQuoteLines.addQLIQ = function(qLine){
        var newEntity = $wakanda.$ds.CsQuoteLineItemQtys.$create({
            quoteLine: qLine
        });
        newEntity.$save().then(function(){
            csQuoteLines.getQuoteLines();
        });
    };


    ///////////////////////////////////////
	// REMOVE CUSTOMER QUOTES LINE QTYS  //
	///////////////////////////////////////
    csQuoteLines.removeQLIQ = function(qliq){
        qliq.$remove().then(function(){
            csQuoteLines.getQuoteLines();
        });
    };




    //////////////////////////////////
	// REMOVE CUSTOMER QUOTES LINE  //
	//////////////////////////////////
    csQuoteLines.remove = function(qLine){
        qLine.$remove().then(function(){csQuoteLines.getQuoteLines();});
    };



    //////////////////////////////////
	// SAVE CUSTOMER QUOTES LINE    //
	//////////////////////////////////
    csQuoteLines.saveQuoteLine = function(qLine){
        qLine.$save().then(function(){
            csQuotes.currentQuote.tempModAttr = new Date();
            
            csQuotes.saveCurrentQuote();
        });
    }



    ///////////////////////////////////
	// SAVE CUSTOMER QUOTES LINE QTY //
	///////////////////////////////////
    csQuoteLines.saveQLIQ = function(qliq){
        qliq.$save().then(function(){
            csQuotes.currentQuote.tempModAttr = new Date();
            
            csQuotes.saveCurrentQuote();
        });
    }




    //////////////////////////////////////////
    // WATCH FOR QUOTE SELECTION CHANGES    //
    //////////////////////////////////////////
	$scope.$watch('csQuoteLines.csQuotes.currentQuote', function(newValue, oldValue) {
		csQuoteLines.getQuoteLines();
	});
    






});