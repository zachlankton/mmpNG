myApp.controller('spAddressesController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.spAddr = csAppData.getData();
	var rScope = $scope.spAddr;
	var spAddr = rScope.spAddr = {};
	spAddr.addressSearch = "";
	
   
	////////////////////////////
	// GET SUPPLIER ADDRESSES //
	////////////////////////////
    spAddr.getAddresses = function(){
		var curSupplier = rScope.Suppliers.currentSupplier;
		
		rScope.collections.spAddresses = $wakanda.$ds.SpAddress.$find({
			filter:'sName = :1',
			params:[curSupplier.name],
			pageSize:999999999
		});	
	};
	spAddr.getAddresses();

	//////////////////////////
    // ADD SUPPLIER ADDRESS //
    //////////////////////////
	spAddr.addAddress = function(){
		var title = spAddr.addressSearch;
		var newEntity = $wakanda.$ds.SpAddress.$create({
                title: title,
                supplier: rScope.Suppliers.currentSupplier
            });

		newEntity.$save().then(function(e) {
			spAddr.currentAddress = {};
			spAddr.getAddresses();
		})
	};

	////////////////////////////////////////
    // SET THE CURRENTLY SELECTED ADDRESS //
    ////////////////////////////////////////
	spAddr.setCurrentAddress = function(address){
		spAddr.currentAddress = address;
		spAddr.currentAddress.show = true;
		spAddr.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + spAddr.currentAddress.address;
	};

	////////////////////////////
	// DELETE CURRENT ADDRESS //
	////////////////////////////
	spAddr.deleteCurrentAddress = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Suppliers/spDashTabs/addresses/deleteAddressModal.html";
		$('#reusable-modal').modal('show');
	
	};

	//////////////////////////////////////////
    // WATCH FOR SUPPLIER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('spAddr.Suppliers.currentSupplier', function(newValue, oldValue) {
		spAddr.getAddresses();
		spAddr.currentAddress = {};
	});

	///////////////////////////////////
    // UPDATE MAP AS ADDRESS CHANGES //
    ///////////////////////////////////
    spAddr.updateMap = function(){
        spAddr.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + spAddr.currentAddress.address;
    };

    ////////////////////////
    // GET GOOGLE MAP URL //
    ////////////////////////
    spAddr.getMapUrl = function(address){
        return "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + address;
    };

	/////////////////////////////////////
    // SHOW THE ADD CONTACT LINK LOGIC //
    /////////////////////////////////////
	spAddr.showAdd = function() {
			var searchBox = spAddr.addressSearch;
			var collection = rScope.collections.spAddresses;
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
        spAddr.saveContactAddress = function(address){
            rScope.spContact.currentContact.$_entity.address.setValue(address.$_entity);
            $('#reusable-modal').modal('hide');
            rScope.spContact.currentContact.$save()
            .then(function(e){
                rScope.spContact.currentContact.addressAlias = address.address
                rScope.spContact.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + address.address
            });
        };
  
});


//////////////////////////////////////////////////
// DELETE ADDRESS MODAL CONFIRMATION CONTROLLER //
//////////////////////////////////////////////////
myApp.controller('spDeleteAddressModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteAddress = csAppData.getData();
	var spAddr = $scope.deleteAddress.spAddr;
	var deleteAddress = $scope.deleteAddress.deleteAddress = {};

	deleteAddress.Yes = function(){
		spAddr.currentAddress.$remove()
		.then(function(e){
			spAddr.currentAddress = {};
			spAddr.getAddresses();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteAddress.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );