myApp.controller('csOrdersController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOrders = csAppData.getData();
	var rScope = $scope.csOrders;
	var csOrders = rScope.csOrders = {};


    csOrders.saveQty = function(params){
        if (params.length == 1){
            params[0].$save(); //update quotedPrice
            return 0;
        }
        var oLine = params[0];
        var oliq = params[1];
        var saveFn = params[2];

        saveFn(oliq);
        oLine.$save();
    }

});
