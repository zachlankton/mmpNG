myApp.controller('csContactsController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csContact = csAppData.getData();
	var rScope = $scope.csContact;
	var csContact = rScope.csContact = {};

	csContact.addContact = function(){
		var name = csContact.addContactName;
		var newEntity = $wakanda.$ds.Contact.$create({
                name: name,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			rScope.Customers.currentSelection.contactCollection.$fetch();
		})
	};

  
});
