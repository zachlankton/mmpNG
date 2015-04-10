myApp.controller('csContactsController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csContact = csAppData.getData();
	var rScope = $scope.csContact;
	var csContact = rScope.csContact = {};

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
		rScope.reusable.modal.templateUrl = "/apps/Customers/csDashTabs/contacts/addressSelectModal.html";
		$('#reusable-modal').modal('show');
    };
    
  
});