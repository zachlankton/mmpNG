myApp.controller('csOrdersController', function ($scope, $wakanda, $filter, csAppData) {
	
	$scope.csOrders = csAppData.getData();
	var rScope = $scope.csOrders;
	var csOrders = rScope.csOrders = {};
	csOrders.orderSearch = "";
	csOrders.spOrderSearch = "";
   
    ///////////////////////////
	// GET CUSTOMER ORDERS   //
	///////////////////////////
    csOrders.getOrders = function(){
        csOrders.currentOrder = {};
		var curCustomer = rScope.Customers.currentSelection;
		
		rScope.collections.csOrders = $wakanda.$ds.Orders.$find({
			filter:'cName = :1',
			params:[curCustomer.name],
			pageSize:999999999
		});	
	};

	///////////////////////////
	// GET SUPPLIER ORDERS   //
	///////////////////////////
    csOrders.getSupplierOrders = function(){
		
		var curOrderID = csOrders.currentOrder.ID;
		
		rScope.collections.spOrders = $wakanda.$ds.PurchaseOrders.$find({
			filter:'csOrderNo = :1',
			params:[curOrderID],
			pageSize:999999999
		});	
	};
		
	//////////////////////////////////////////
    // WATCH FOR CUSTOMER SELECTION CHANGES //
    //////////////////////////////////////////
	$scope.$watch('csOrders.Customers.currentSelection', function(newValue, oldValue) {
		csOrders.getOrders();
		csOrders.currentOrder = {};
		csOrders.currentSupplierOrder = {};
	});	


    ///////////////////////////////////////////////
    // SHOW THE ADD LINK LOGIC FOR QUOTES        //
    ///////////////////////////////////////////////
	csOrders.showOrderAdd = function() {
			var searchBox = csOrders.orderSearch;
			var collection = rScope.collections.csOrders;
			var colAttrToCompare = "orderNo"; 	

            return rScope.showAdd(searchBox, collection, colAttrToCompare);
    };

    //////////////////////////
    // ADD CUSTOMER ORDER   //
    //////////////////////////
	csOrders.addOrder = function(){
		var orderNo = csOrders.orderSearch;
		var newEntity = $wakanda.$ds.Orders.$create({
                orderNo: orderNo,
                customer: rScope.Customers.currentSelection
            });

		newEntity.$save().then(function(e) {
			csOrders.currentOrder = {};
			csOrders.getOrders();
		})
	};


	/////////////////////////////////
    // ADD RELATED SUPPLIER PO     //
    /////////////////////////////////
	csOrders.addSpOrder = function(){
	    var curOrder = csOrders.currentOrder;
		
		var newEntity = $wakanda.$ds.PurchaseOrders.$create({
		        csOrder: curOrder
            });

		newEntity.$save().then(function(e) {
		    csOrders.getSupplierOrders();
			csOrders.currentSupplierOrder = {};
		})
	};


	////////////////////////////////////////
    // SAVE THE CURRENTLY SELECTED ORDER  //
    ////////////////////////////////////////
	csOrders.saveCurrentOrder = function(){
		var order = csOrders.currentOrder;
		
		order.$save()
		.then(function(a){
		    csOrders.currentOrderForm.$setPristine();
		})
		.catch(function(error){
            console.log(error);
		});

	};

	////////////////////////////////////////
    // SET THE CURRENTLY SELECTED ORDER   //
    ////////////////////////////////////////
	csOrders.setCurrentOrder = function(order){
		csOrders.currentOrder = order;
		csOrders.currentOrder.show = true;
		csOrders.getSupplierOrders();
		csOrders.currentSupplierOrder = {};

	};


    ////////////////////////////////////////
    // SET THE CURRENTLY SELECTED PO      //
    ////////////////////////////////////////
	csOrders.setCurrentSpOrder = function(spOrder){
        csOrders.currentSupplierOrder = spOrder;
        csOrders.currentSupplierOrder.show = true;

	};


    //////////////////////////////
    // SELECT CUSTOMER CONTACT  //
    //////////////////////////////
    csOrders.selectContact = function(){
        var customer = rScope.Customers.currentSelection;
        var entity = csOrders.currentOrder;
        rScope.SAM.csContacts(entity, "contact", customer);
    };





  
});
