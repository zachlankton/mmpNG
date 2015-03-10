myApp.controller('spContactsController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.spContact = csAppData.getData();
	var rScope = $scope.spContact;
	var spContact = rScope.spContact = {};
	spContact.contactSearch = "";
	
	spContact.fields = [];
	spContact.fields.push({title:"Name", type:"text", name:"name"});
	spContact.fields.push({title:"Title", type:"text", name:"title"});
	spContact.fields.push({title:"Department", type:"text", name:"dept"});
	
	spContact.infoTypes = [];
	spContact.infoTypes.push('Cell Phone');
	spContact.infoTypes.push('Email');
	spContact.infoTypes.push('Fax');
	spContact.infoTypes.push('Home Phone');
	spContact.infoTypes.push('Other');
	spContact.infoTypes.push('Skype');
	spContact.infoTypes.push('Work Phone');
	
	///////////////////////////
	// GET SUPPLIER CONTACTS //
	///////////////////////////
    spContact.getSupplierContacts = function(){
		var curSupplier = rScope.Suppliers.currentSupplier;
		
		rScope.collections.SpContacts = $wakanda.$ds.SpContact.$find({
			filter:'sName = :1',
			params:[curSupplier.name],
			pageSize:999999999
		});	
	};
	spContact.getSupplierContacts();

    //////////////////////////
    // ADD SUPPLIER CONTACT //
    //////////////////////////
	spContact.addContact = function(){
		var name = spContact.contactSearch;
		var newEntity = $wakanda.$ds.SpContact.$create({
                name: name,
                supplier: rScope.Suppliers.currentSupplier
            });

		newEntity.$save().then(function(e) {
			spContact.currentContact = {};
			spContact.getSupplierContacts();
		})
	};

    ////////////////////////////////////////
    // SET THE CURRENTLY SELECTED CONTACT //
    ////////////////////////////////////////
	spContact.setCurrentContact = function(contact){
		spContact.currentContact = contact;
		spContact.currentContact.show = true;
		spContact.getContactInfo();
		spContact.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + spContact.currentContact.addressAlias;
	};

    /////////////////////////////////////////////
	// SET THE ADDRESS FOR THE CURRENT CONTACT //
	/////////////////////////////////////////////
    spContact.selectAddress = function(){
        //display the address selection modal
		rScope.reusable.modal.templateUrl = "/apps/Suppliers/spDashTabs/contacts/addressSelectModal.html";
		$('#reusable-modal').modal('show');
    };
    
    //////////////////////////////
    // GET RELATED CONTACT INFO //
    //////////////////////////////
	spContact.getContactInfo = function(){
		var curContact = spContact.currentContact;

		rScope.collections.SpContactInfo = $wakanda.$ds.SpContactInfo.$find({
			filter: 'sName = :1',
			params: [curContact.name],
			pageSize: 999999999
		});
	};

    //////////////////////////////
    // ADD RELATED CONTACT INFO //
    //////////////////////////////
	spContact.addContactInfo = function(){
		
		var newEntity = $wakanda.$ds.SpContactInfo.$create({
                type: spContact.infoTypeAdd,
                data: spContact.infoDataAdd,
                spContact: spContact.currentContact
            });

		newEntity.$save().then(function(e) {
			spContact.getContactInfo();
			spContact.infoTypeAdd = "";
			spContact.infoDataAdd = "";
		})
	};

    ////////////////////////////////////////////////
    // REMOVE AN ENTITY FROM RELATED CONTACT INFO //
    ////////////////////////////////////////////////
	spContact.removeCInfo = function(cInfo){
		cInfo.$remove();
		spContact.getContactInfo();
	};

	////////////////////////////
	// DELETE CURRENT CONTACT //
	////////////////////////////
	spContact.deleteCurrentContact = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Suppliers/spDashTabs/contacts/deleteContactsModal.html";
		$('#reusable-modal').modal('show');
	
	};

    //////////////////////////////////////////
    // WATCH FOR SUPPLIER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('spContact.Suppliers.currentSupplier', function(newValue, oldValue) {
		spContact.getSupplierContacts();
		spContact.currentContact = {};
	});


	
    /////////////////////////////////////
    // SHOW THE ADD CONTACT LINK LOGIC //
    /////////////////////////////////////
	spContact.showAdd = function() {
			var searchBox = spContact.contactSearch;
			var collection = rScope.collections.SpContacts;
			var colAttrToCompare = "name"; 	

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
// DELETE CONTACT MODAL CONFIRMATION CONTROLLER //
//////////////////////////////////////////////////
myApp.controller('spDeleteContactsModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteContact = csAppData.getData();
	var spContact = $scope.deleteContact.spContact;
	var deleteContact = $scope.deleteContact.deleteContact = {};

	deleteContact.Yes = function(){
		spContact.currentContact.$remove()
		.then(function(e){
			spContact.currentContact = {};
			spContact.getSupplierContacts();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteContact.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );