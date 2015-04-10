myApp.controller('csAddressesController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csAddr = csAppData.getData();
	var rScope = $scope.csAddr;
	var csAddr = rScope.csAddr = {};

    //////////////////////////
    // SAVE CONTACT ADDRESS //
    //////////////////////////
    csAddr.saveContactAddress = function(address){
        rScope.current.Contact.$_entity.address.setValue(address.$_entity);
        rScope.current.Contact.$save()
        .then(function(e){
            rScope.current.Contact.addressAlias = address.address;
            rScope.reusable.modal.templateUrl = "";
            $('#reusable-modal').modal('hide');
        });
    };
  
});
