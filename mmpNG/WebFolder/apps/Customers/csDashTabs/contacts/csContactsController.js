myApp.controller('csContactsController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csContact = csAppData.getData();
	var rScope = $scope.csContact;
	var csContact = rScope.csContact = {};
	csContact.contactSearch = "";
	
	csContact.fields = [];
	csContact.fields.push({title:"Name", type:"text", name:"name"});
	csContact.fields.push({title:"Title", type:"text", name:"title"});
	csContact.fields.push({title:"Department", type:"text", name:"dept"});
	
	csContact.infoTypes = [];
	csContact.infoTypes.push('Cell Phone');
	csContact.infoTypes.push('Email');
	csContact.infoTypes.push('Fax');
	csContact.infoTypes.push('Home Phone');
	csContact.infoTypes.push('Other');
	csContact.infoTypes.push('Skype');
	csContact.infoTypes.push('Work Phone');
	
	///////////////////////////
	// GET CUSTOMER CONTACTS //
	///////////////////////////
    csContact.getCustomerContacts = function(){
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.Contacts = $wakanda.$ds.Contact.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};
	csContact.getCustomerContacts();

    //////////////////////////
    // ADD CUSTOMER CONTACT //
    //////////////////////////
	csContact.addContact = function(){
		var name = csContact.contactSearch;
		var newEntity = $wakanda.$ds.Contact.$create({
                name: name,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			csContact.currentContact = {};
			csContact.getCustomerContacts();
		})
	};

    ////////////////////////////////////////
    // SET THE CURRENTLY SELECTED CONTACT //
    ////////////////////////////////////////
	csContact.setCurrentContact = function(contact){
		csContact.currentContact = contact;
		csContact.getContactInfo();
		csContact.addressMapURL = "https://www.google.com/maps/embed/v1/place?key=" + rScope.googleAPIkey + 
		                          "&q=" + csContact.currentContact.addressAlias;
	};

    /////////////////////////////////////////////
	// SET THE ADDRESS FOR THE CURRENT CONTACT //
	/////////////////////////////////////////////
    csContact.selectAddress = function(){
        //display the address selection modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/contacts/addressSelectModal.html";
		$('#reusable-modal').modal('show');
    };
    
    //////////////////////////////
    // GET RELATED CONTACT INFO //
    //////////////////////////////
	csContact.getContactInfo = function(){
		var curContact = csContact.currentContact;

		rScope.collections.ContactInfo = $wakanda.$ds.ContactInfo.$find({
			filter: 'cName = :1',
			params: [curContact.name],
			pageSize: 999999999
		});
	};

    //////////////////////////////
    // ADD RELATED CONTACT INFO //
    //////////////////////////////
	csContact.addContactInfo = function(){
		
		var newEntity = $wakanda.$ds.ContactInfo.$create({
                type: csContact.infoTypeAdd,
                data: csContact.infoDataAdd,
                contact: csContact.currentContact
            });

		newEntity.$save().then(function(e) {
			csContact.getContactInfo();
			csContact.infoTypeAdd = "";
			csContact.infoDataAdd = "";
		})
	};

    ////////////////////////////////////////////////
    // REMOVE AN ENTITY FROM RELATED CONTACT INFO //
    ////////////////////////////////////////////////
	csContact.removeCInfo = function(cInfo){
		cInfo.$remove();
		csContact.getContactInfo();
	};

	////////////////////////////
	// DELETE CURRENT CONTACT //
	////////////////////////////
	csContact.deleteCurrentContact = function(){
	    //display the confirmation modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/contacts/deleteContactsModal.html";
		$('#reusable-modal').modal('show');
	
	};

    //////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csContact.Customers.currentSelection', function(newValue, oldValue) {
		csContact.getCustomerContacts();
		csContact.currentContact = {};
	});


	
    /////////////////////////////////////
    // SHOW THE ADD CONTACT LINK LOGIC //
    /////////////////////////////////////
	csContact.showAdd = function() {
			var searchBox = csContact.contactSearch;
			var collection = rScope.collections.Contacts;
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
myApp.controller('deleteContactsModalController', function ($scope, $wakanda, $filter, csAppData) {

	$scope.deleteContact = csAppData.getData();
	var csContact = $scope.deleteContact.csContact;
	var deleteContact = $scope.deleteContact.deleteContact = {};

	deleteContact.Yes = function(){
		csContact.currentContact.$remove()
		.then(function(e){
			csContact.currentContact = {};
			csContact.getCustomerContacts();
			$('#reusable-modal').modal('hide');
		});
	};

	deleteContact.No = function(){
		$('#reusable-modal').modal('hide');
	};
} );