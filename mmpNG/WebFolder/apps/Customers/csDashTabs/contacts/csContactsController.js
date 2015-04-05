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
	
    //////////////////////////////////
	// SHOW THE ADDRESS SLECT MODAL //
	//////////////////////////////////
    csContact.selectAddress = function(){
        //display the address selection modal
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/contacts/addressSelectModal.html";
		$('#reusable-modal').modal('show');
    };
    
    //////////////////////////////
    // ADD RELATED CONTACT INFO //
    //////////////////////////////
	csContact.addContactInfo = function(){
		
		var newEntity = $wakanda.$ds.ContactInfo.$create({
                type: csContact.infoTypeAdd,
                data: csContact.infoDataAdd,
                contact: rScope.current.Contact
            });

		newEntity.$save().then(function(e) {
			rScope.collections.ContactInfo.push(newEntity);
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
  
});