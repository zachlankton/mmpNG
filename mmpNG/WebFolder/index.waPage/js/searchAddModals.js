csAppServices.run(function($wakanda, $filter, csAppData, $interpolate){
    var values = csAppData.getData();
    values.SAM = {};

    /////////////////////////////
    // REUSABLE MODAL FUNCTION //
    /////////////////////////////
    values.searchAddModal = function(options){
        var rMod = values.reusable.modal;
        rMod.templateUrl = "/index.waPage/searchAddModal.html";
        
        rMod.collection = options.collection;
        rMod.selectedItem = options.selectedItem; 
        rMod.listItemExp = options.listItemExp;
        rMod.itemClick = options.itemClick;
        rMod.addItem = options.addItem;
        rMod.createObj = options.createObj;
        rMod.title = options.title || "Select From The List";
        rMod.searchPlaceHolder = options.searchPlaceHolder || "Search";
        rMod.search = options.search;
        rMod.sortAttr = options.sortAttr;
        rMod.sortDesc = options.sortDesc;
        rMod.addAttr = options.addAttr;
        rMod.searchAddText = options.searchAddText || "ADD";
        rMod.listItemExp = options.listItemExp;

        var defaultItemClick = function(item){
            var entity = options.entity;
            var attribute = options.attribute;

            if (entity == undefined){return 0;}
            entity[attribute] = item;
            entity.$_entity[attribute].setValue(item.$_entity);
            entity.$save();
        }

        options.itemClick = options.itemClick || defaultItemClick;

        rMod.itemClick = function(item){
            options.itemClick(item);
            $('#reusable-modal').modal('hide');
        };

        if (options.addAttr != undefined){
            rMod.searchPlaceHolder = options.searchPlaceHolder = "Search or Add";
        }
        
        $('#reusable-modal').modal('show');
    };


    //////////////////////////////
    // SELECT CUSTOMER CONTACT  //
    //////////////////////////////
    values.SAM.csContacts = function(entity, attribute, customer){
        
        var collection = $wakanda.$ds.Contact.$find({
            filter: "cName = :1",
            params: [customer.name],
            pageSize: 999999999,
        });

        var createObj = function(contactName){
            return {
                customer: customer,
                name: contactName
            };
        }

        values.searchAddModal({
            title: "Select Contact",
            collection: collection,
            listItemExp: "{{name}} - ({{title}})",
			sortAttr: "name",
			addAttr: "name",
            createObj: createObj,
            entity: entity,
            attribute: attribute
        });
    };



    //////////////////////////////
    // SELECT SUPPLIER CONTACT  //
    //////////////////////////////
    values.SAM.spContacts = function(entity, attribute, supplier){

        var collection = $wakanda.$ds.SpContact.$find({
            filter: "sName = :1",
            params: [supplier.name],
            pageSize: 999999999
        });

        var createObj = function(contactName){
            return {
                supplier: supplier,
                name: contactName
            };
        }

        values.searchAddModal({
            title: "Select Contact",
            collection: collection,
            listItemExp: "{{name}} - ({{title}})",
			sortAttr: "name",
			addAttr: "name",
            createObj: createObj,
            entity: entity,
            attribute: attribute
        });
    };


    ////////////////////////////////
    // SELECT CUSTOMER QUOTELINE  //
    ////////////////////////////////
    values.SAM.csQuoteLines = function(entity, attribute, search){
        search = search || "";
        var curCustomer = values.Customers.currentSelection;

        var collection = $wakanda.$ds.CsQuoteLineItems.$find({
            filter: 'customerName = :1',
            params: [curCustomer.name],
            pageSize:999999999
        });
        

        values.searchAddModal({
            collection: collection,
            listItemExp: "Quote No: {{quoteNo | number}} --- Part No: {{partNo}} {{partDesc}}",
            search: search,
            entity: entity,
            attribute: attribute,
            title: "Select Quote Line",
            sortAttr: "quoteNo",
            sortDesc: true,
        });
    };





    //////////////////////////////////////////////
    // SELECT PARTS ROUTING SUPPLIER QUOTELINE  //
    //////////////////////////////////////////////
    values.SAM.partsRoutingQuoteLines = function(attribute, search){
        search = search || "";
        var curPartRevQuoteNo = values.csParts.currentPartRev.quoteNo;
        
        var collection = $wakanda.$ds.SupplierQuoteLine.$find({
            filter: 'spQuoteRef.customerSupplierQuotesCollection.csQuoteNo = :1',
            params: [curPartRevQuoteNo],
            pageSize: 999999999
        });

        var setRouteQLine = function(qLine){
            attribute.sqLine = qLine;
        };

        values.searchAddModal({
            collection: collection,
            listItemExp: "Quote No: {{quoteNo}} --- Supplier: {{sName}} --- Part No: {{partNo}} {{partDesc}}",
            itemClick: setRouteQLine,
            title: "Select Quote Line",
            sortAttr: "quoteNo",
            sortDesc: true,
            search: search
        });
    };



    ///////////////////////////////////////////////////////
    // ATTACH EXISTING SUPPLIER QUOTE TO CUSTOMER QUOTE  //
    ///////////////////////////////////////////////////////
    values.SAM.selectExistingSpQuote = function(callBack, customer){
        
        var collection = $wakanda.$ds.SupplierQuotes.$find({
            filter: "cName = :1",
            params: [customer],
        });
        
        values.searchAddModal({
            collection: collection,
            listItemExp: "{{quoteNo}} - {{sName}}",
            title: "Select Existing Supplier Quote",
            sortAttr: "quoteNo",
            itemClick: callBack,
        });
    };

    //////////////////////
    // SELECT SUPPLIER  //
    //////////////////////
    values.SAM.selectSupplier = function(entity, attribute){

        var collection = $wakanda.$ds.Supplier.$find({pageSize:999999999});

        values.searchAddModal({
            collection:collection,
            listItemExp: "{{name}}",
            title: "Select a Supplier",
            sortAttr: "name",
            addAttr: "name",
            entity: entity,
            attribute: attribute
        });

    };
});

///////////////////////////////
// SEARCH ADD LIST DIRECTIVE //
///////////////////////////////
csAppServices.directive('searchAddList', function() {
  return {
    restrict: 'E',
    scope: {
        selectedItem: '=',
        listItemExp: '=',
        searchPlaceHolder: '@',
        searchAddText: '@',
        search: '@',
        collection: '=',
        sortAttr: '@',
        sortDesc: '@',
        itemClick: '=',
        addAttr: '@',
        addItem: '=',
        createObj: '='
    },
    templateUrl: 'search-add-list.html',
    
    controller: function($scope, $interpolate, $filter){
        $scope.search = $scope.search || "";
        $scope.searchAddText = $scope.searchAddText || "ADD"

        $scope.searchPlaceHolder = $scope.searchPlaceHolder || "Search";
        if ($scope.addAttr != undefined){
            $scope.searchPlaceHolder = $scope.searchPlaceHolder = "Search or Add";
        }

        $scope.listItem = function(item){
            var exp = $interpolate($scope.listItemExp);
            return exp(item);
        };

        $scope._addItem = function(value){
            if ($scope.addAttr == undefined){return 0;}
            if ($scope.addItem != undefined){
                $scope.addItem(value);
                return 0;
            }
            
            var dataClass = $scope.collection.$_collection._private.dataClass;
            var createObj = {};
            if ($scope.createObj != undefined){
                createObj = $scope.createObj(value);
            }else{
                createObj[$scope.addAttr] = value;
            }
            
            var newEntity = dataClass.$create(createObj);
            newEntity.$save().then(function(){
                $scope.collection.push(newEntity);
            });
        };


        $scope._itemClick = function(item){
            $scope._selectedItem = item;
            if ($scope.selectedItem != undefined){
                $scope.selectedItem = item;    
            }
            if ($scope.itemClick != undefined){
                $scope.itemClick(item);    
            }
        };

        $scope.showAdd = function(){
            if ($scope.addAttr == undefined || $scope.addAttr == ""){return false};

            var searchBox = $scope.search; 
            var collection = $scope.collection;
            var attrToCompare = $scope.addAttr;

            if (searchBox == "") {
                return false;  
            }

            var results = ($filter('filter')(collection, function(val, index) { 
                if (val[attrToCompare] == null) {
                    return false;   
                }
                if (val[attrToCompare].toLowerCase() == searchBox.toLowerCase()) {
                    return true;  
                }
            }));


            if (results.length > 0) {
                return false;  	
            }
            return true;  

        }
    }
  };
});