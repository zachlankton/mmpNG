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

    //////////////////
    // SELECT PARTS //
    //////////////////
    values.SAM.selectParts = function(entity, attribute){

        var collection = $wakanda.$ds.PartRev.$find({
            filter: "part.cName = :1",
            params: [values.current.Customer.name],
            pageSize: 999999999
        });

        values.searchAddModal({
            listItemExp: "{{partNo}} {{partDesc}} Rev: {{revision}}",
            collection: collection,
            entity: entity,
            attribute: attribute,
            title: "Select a Part Revision",
            sortAttr: "partNo"
        });
    };

    //////////////////////////////////////
    // SELECT CUSTOMER ORDER LINE ITEMS //
    //////////////////////////////////////
    values.SAM.selectCSOrderLineItem = function(entity, attribute, currentOrder){
        var collection = $wakanda.$ds.OrderLineItems.$find({
            filter: "order.ID = :1",
            params: [currentOrder.ID],
            pageSize: 999999999
        });

        values.searchAddModal({
            title: "Select Order Line Item",
            collection: collection,
            listItemExp: "{{partNo}} {{partDesc}} Rev: {{revision}}",
            sortAttr: 'lineID',
            entity: entity,
            attribute: attribute
        });
    }
    
    //////////////////////////////
    // SELECT CUSTOMER CONTACT  //
    //////////////////////////////
    values.SAM.csContacts = function(entity, attribute, customer){
        customer = customer || values.current.Customer;

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
        supplier = supplier || values.current.Supplier;

        var collection = $wakanda.$ds.SpContact.$find({
            filter: "sName = :1",
            params: [supplier],
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
        var curCustomer = values.current.Customer;

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
        var curPartRevQuoteNo = values.current.PartRev.quoteNo;
        
        var collection = $wakanda.$ds.SupplierQuoteLine.$find({
            filter: 'spQuoteRef.customerSupplierQuotesCollection.csQuoteNo = :1',
            params: [curPartRevQuoteNo],
            pageSize: 999999999
        });

        var setRouteQLine = function(qLine){
            attribute.supplierQuoteLine = qLine;
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
        customer = customer || values.current.Customer.name;

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
        collection: '=?',
        sortAttr: '@',
        sortDesc: '@',
        itemClick: '=',
        addAttr: '@',
        addItem: '=',
        createObj: '='
    },
    templateUrl: 'search-add-list.html',
    
    /////////////
    // COMPILE //
    /////////////
    compile: function(tElement, tAttrs){
        if (tAttrs.collection == undefined){
            tAttrs.collection = "collection";
        }
        if (tAttrs.listItemExp == undefined){
            tAttrs.listItemExp = "'{{ID}}'";
        }
    },

    ////////////////
    // CONTROLLER //
    ////////////////
    controller: function($scope, $interpolate, $timeout, $filter, csAppData){
        
        $scope.rScope = csAppData.getData();
        var rScope = $scope.rScope;

        $scope.search = $scope.search || "";
        $scope.searchAddText = $scope.searchAddText || "ADD"

        $scope.searchPlaceHolder = $scope.searchPlaceHolder || "Search";
        if ($scope.addAttr != undefined){
            $scope.searchPlaceHolder = $scope.searchPlaceHolder = "Search or Add";
        }

        ///////////////
        // LIST ITEM //
        ///////////////
        $scope.listItem = function(item){
            var exp = $interpolate($scope.listItemExp);
            return exp(item);
        };

        //////////////
        // ADD ITEM //
        //////////////
        $scope._addItem = function(value){
            if ($scope.addAttr == undefined){return 0;}
            if ($scope.addItem != undefined){
                $scope.addItem(value);
                return 0;
            }

            var nameSpaces = $scope.addAttr.split(".");
            if (nameSpaces.length > 2){console.log("Cannot Nest more than 2 add attributes!"); return 0;}
            if (nameSpaces.length == 1){simpleAdd(value);}
            if (nameSpaces.length == 2){advancedAdd(value, nameSpaces);}
            
        };

        ////////////////
        // SIMPLE ADD //
        ////////////////
        var simpleAdd = function(value){
            var dataClass = $scope.collection.$_collection._private.dataClass;
            var createObj = {};
            if ($scope.createObj != undefined){
                createObj = $scope.createObj(value);
            }
                createObj[$scope.addAttr] = value;
            
            
            var newEntity = dataClass.$create(createObj);
            newEntity.$save().then(function(){
                $scope.collection.push(newEntity);
                $scope._itemClick(newEntity);
            });    
        };

        //////////////////
        // ADVANCED ADD //
        //////////////////
        var advancedAdd = function(value, nameSpace){
            var parentClass = $scope.collection.$_collection._private.dataClass;
            var childClass = $scope.collection.$_collection._private.dataClass[nameSpace[0]].getRelatedClass();
            var createObj = {};
            if ($scope.createObj != undefined){
                createObj = $scope.createObj(value);
            }
                  

            var childCreateObj = {};
            childCreateObj[nameSpace[1]] = value;
            var newChild = childClass.$create(childCreateObj);
            newChild.$save().then(function(){
                createObj[nameSpace[0]] = newChild;
                var newEntity = parentClass.$create(createObj);
                newEntity.$save().then(function(){
                    newEntity[nameSpace[0]].$_entity.serverRefresh(function(data){
                        newEntity[nameSpace[0]] = childClass.$create(data.rawResult.__ENTITIES[0]);
                    });
                    $scope.collection.push(newEntity);
                    $scope._itemClick(newEntity);
                });
            });
        };

        ////////////////
        // ITEM CLICK //
        ////////////////
        $scope._itemClick = function(item){
            $scope._selectedItem = item;
            if ($scope.selectedItem != undefined){
                $scope.selectedItem = item;
                return 0;    
            }
            if ($scope.itemClick != undefined){
                $scope.itemClick(item);    
                return 0;
            }
            var dataClass = $scope.collection.$_collection._private.dataClass.$name;
            rScope.current[dataClass] = {};
            $timeout(function(){rScope.current[dataClass] = item;},0);
        };

        ///////////////////
        // SHOW ADD LINK //
        ///////////////////
        $scope.showAdd = function(){
            if ($scope.addAttr == undefined || $scope.addAttr == ""){return false};

            var searchBox = $scope.search; 
            var collection = $scope.collection;
            var attrToCompare = $scope.addAttr;

            if (searchBox == "") {
                return false;  
            }

            var results = ($filter('filter')(collection, function(val, index) { 
                var nameSpaces = attrToCompare.split(".");
                var attrVal = val[nameSpaces[0]];
                nameSpaces.forEach(function(name, indx){
                    if (indx != 0){attrVal = attrVal[name];}
                });

                if (attrVal == null) {
                    return false;   
                }
                if (attrVal.toLowerCase() == searchBox.toLowerCase()) {
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