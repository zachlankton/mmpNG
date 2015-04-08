myApp.controller('csOrdersController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOrders = csAppData.getData();
	var rScope = $scope.csOrders;
	var csOrders = rScope.csOrders = {};
	csOrders.orderSearch = "";
	csOrders.spOrderSearch = "";


	/////////////////////////////////
    // ADD RELATED SUPPLIER PO     //
    /////////////////////////////////
	csOrders.addSpOrder = function(){
	    var curOrder = rScope.current.Orders;
		
		var newEntity = $wakanda.$ds.PurchaseOrders.$create({
		        csOrder: curOrder
            });

		newEntity.$save().then(function(e) {
		    rScope.collections.PurchaseOrders.push(newEntity);
			rScope.current.PurchaseOrders = newEntity;
		})
	};



});
