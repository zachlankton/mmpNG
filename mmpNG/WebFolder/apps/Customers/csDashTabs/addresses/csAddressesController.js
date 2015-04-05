myApp.controller('csAddressesController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csAddr = csAppData.getData();
	var rScope = $scope.csAddr;
	var csAddr = rScope.csAddr = {};
	csAddr.addressSearch = "";
	
   
	////////////////////////////
	// GET CUSTOMER ADDRESSES //
	////////////////////////////
    csAddr.getAddresses = function(){
		var curCustomer = rScope.current.Customer;
		
		rScope.collections.csAddresses = $wakanda.$ds.CsAddress.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};

	//////////////////////////
    // ADD CUSTOMER ADDRESS //
    //////////////////////////
	csAddr.createObj = function(title){
		return {
            title: title,
            customer: rScope.current.Customer
        };
	};

	////////////////////////////////////////
    // SET THE CURRENTLY SELECTED ADDRESS //
    ////////////////////////////////////////
	csAddr.setCurrentAddress = function(address){
		csAddr.currentAddress = address;
		csAddr.currentAddress.show = true;
		csAddr.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + csAddr.currentAddress.address;
	};


	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csAddr.current.Customer', function(newValue, oldValue) {
		csAddr.getAddresses();
		csAddr.currentAddress = {};
	});

	///////////////////////////////////
    // UPDATE MAP AS ADDRESS CHANGES //
    ///////////////////////////////////
    csAddr.updateMap = function(){
        csAddr.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + csAddr.currentAddress.address;
    };

    ////////////////////////
    // GET GOOGLE MAP URL //
    ////////////////////////
    csAddr.getMapUrl = function(address){
        return "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + address;
    };


    //////////////////////////
    // SAVE CONTACT ADDRESS //
    //////////////////////////
    csAddr.saveContactAddress = function(address){
        rScope.current.Contact.$_entity.address.setValue(address.$_entity);

        rScope.current.Contact.$save()
        .then(function(e){
            rScope.current.Contact.addressAlias = address.address;
            rScope.csContact.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
                              "&q=" + address.address;
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
    };
  
});
