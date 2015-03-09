myApp.controller('csAddressesController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csAddr = csAppData.getData();
	var rScope = $scope.csAddr;
	var csAddr = rScope.csAddr = {};
	csAddr.addressSearch = "";
	
   
	////////////////////////////
	// GET CUSTOMER ADDRESSES //
	////////////////////////////
    csAddr.getAddresses = function(){
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csAddresses = $wakanda.$ds.CsAddress.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};
	csAddr.getAddresses();

	//////////////////////////
    // ADD CUSTOMER ADDRESS //
    //////////////////////////
	csAddr.addAddress = function(){
		var title = csAddr.addressSearch;
		var newEntity = $wakanda.$ds.CsAddress.$create({
                title: title,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			csAddr.currentAddress = {};
			csAddr.getAddresses();
		})
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

	////////////////////////////
	// DELETE CURRENT ADDRESS //
	////////////////////////////
	csAddr.deleteCurrentAddress = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/addresses/deleteAddressModal.html";
		$('#reusable-modal').modal('show');
	
	};

	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csAddr.Customers.currentSelection', function(newValue, oldValue) {
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

	/////////////////////////////////////
    // SHOW THE ADD CONTACT LINK LOGIC //
    /////////////////////////////////////
	csAddr.showAdd = function() {
			var searchBox = csAddr.addressSearch;
			var collection = rScope.collections.csAddresses;
			var colAttrToCompare = "title"; 	

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

        //////////////////////////
        // SAVE CONTACT ADDRESS //
        //////////////////////////
        csAddr.saveContactAddress = function(address){
            rScope.csContact.currentContact.$_entity.address.setValue(address.$_entity);
            $('#reusable-modal').modal('hide');
            rScope.csContact.currentContact.$save()
            .then(function(e){
                rScope.csContact.currentContact.addressAlias = address.address
                rScope.csContact.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + address.address
            });
        };
  
});


//////////////////////////////////////////////////
// DELETE ADDRESS MODAL CONFIRMATION CONTROLLER //
//////////////////////////////////////////////////
myApp.controller('deleteAddressModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteAddress = csAppData.getData();
	var csAddr = $scope.deleteAddress.csAddr;
	var deleteAddress = $scope.deleteAddress.deleteAddress = {};

	deleteAddress.Yes = function(){
		csAddr.currentAddress.$remove()
		.then(function(e){
			csAddr.currentAddress = {};
			csAddr.getAddresses();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteAddress.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );