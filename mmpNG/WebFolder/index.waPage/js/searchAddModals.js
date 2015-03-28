csAppServices.run(function($wakanda, $filter, csAppData, $interpolate){
    var values = csAppData.getData();
    values.SAM = {};

    ////////////////////////////////////////////
    // SHOW ADD LOGIC FOR SEARCH OR ADD LISTS //
    ////////////////////////////////////////////
    values.showAdd = function(searchBox, collection, attrToCompare){	

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

    };

    /////////////////////////////
    // REUSABLE MODAL FUNCTION //
    /////////////////////////////
    values.searchAddModal = function(options){
        
        var rMod = values.reusable.modal;
        rMod.templateUrl = "/index.waPage/searchAddModal.html";

        rMod.title = options.title || "Select From The List";
        rMod.searchPlaceHolder = options.searchPlaceHolder || "Search";
        rMod.search = options.search || "";
        rMod.sortAttr = options.sortAttr || "ID";
        rMod.sortDesc = options.sortDesc || false;
        
        rMod.addAttr = options.addAttr || false;
        rMod.searchAddText = options.searchAddText || "ADD";
        
        rMod.listItemText = options.listItemText;
        

        var defaultCallback = function(cValue){
            if (options.callBack == undefined){
                var entity = options.cEntity;
                var attribute = options.cAttribute;
                entity[attribute] = cValue;
                entity.$_entity[attribute].setValue(cValue.$_entity);
                entity.$save().then(function(){
                    $('#reusable-modal').modal('hide'); 
                });  
            }
        };

        var defaultAddItem = function(value, callBack){
            if (options.addAttr != undefined){
                var createObj = {};
                createObj[options.addAttr] = value;
                var newEntity = $wakanda.$ds[options.dataClass].$create(createObj).$save().then(function(){
                    callBack();
                });

            }
        };

        
        options.addItem = options.addItem || defaultAddItem;
        rMod.callBack = options.callBack || defaultCallback;

        rMod.addItem = function(){
            options.addItem(rMod.search, rMod.getList);
        };

        rMod.showAdd = function(){
            if (rMod.addAttr === false){return false;}
            rMod.searchPlaceHolder = options.searchPlaceHolder || "Search or Add";
            return values.showAdd(rMod.search, rMod.collection, rMod.addAttr);
        };
        
        rMod.getList = function(){
            rMod.collection = $wakanda.$ds[options.dataClass].$find({
                filter: options.filter,
                params: options.params,
                pageSize: 999999999,
            });
        };
        
        rMod.getList();
        $('#reusable-modal').modal('show');
    };


    //////////////////////////////
    // SELECT CUSTOMER CONTACT  //
    //////////////////////////////
    values.SAM.csContacts = function(entity, attribute, customer){
        
        var addItem = function(contactName, callBack){
            var newEntity = $wakanda.$ds.Contact.$create({
                customer: customer,
                name: contactName
            }).$save().then(function(){
                callBack();
            });
        };

        var listItemText = function(contact){
            if (contact.title == null || contact.title == ""){return contact.name};
            return contact.name + " ("+ contact.title+")";
        };

        values.searchAddModal({
            dataClass: "Contact",
            filter:'cName = :1',
			params:[customer.name],
			title: "Select Contact",
			sortAttr: "name",
			addAttr: "name",
            addItem: addItem,
			cEntity: entity,
			cAttribute: attribute,
			listItemText: listItemText
        });
    };



    //////////////////////////////
    // SELECT SUPPLIER CONTACT  //
    //////////////////////////////
    values.SAM.spContacts = function(entity, attribute, supplier){

        var addItem = function(contactName, callBack){
            var newEntity = $wakanda.$ds.SpContact.$create({
                supplier: supplier,
                name: contactName
            }).$save().then(function(){
                callBack();
            });
        };

        var listItemText = function(contact){
            if (contact.title == null || contact.title == ""){return contact.name};
            return contact.name + " ("+ contact.title+")";
        };

        values.searchAddModal({
            dataClass: "SpContact",
            filter:'sName = :1',
			params:[supplier.name],
			title: "Select Contact",
			sortAttr: "name",
			addAttr: "name",
            addItem: addItem,
			cEntity: entity,
			cAttribute: attribute,
			listItemText: listItemText
        });
    };


    ////////////////////////////////
    // SELECT CUSTOMER QUOTELINE  //
    ////////////////////////////////
    values.SAM.csQuoteLines = function(entity, attribute, search){
        search = search || "";
        var curCustomer = values.Customers.currentSelection;
        
        var listItemText = function(qLine){
            var exp = $interpolate("Quote No: {{quoteLine.quoteNo | number}} --- Part No: {{quoteLine.partNo}} {{quoteLine.partDesc}}");
            return exp({quoteLine: qLine});
        };

        values.searchAddModal({
            dataClass: "CsQuoteLineItems",
            filter: 'customerName = :1',
            params: [curCustomer.name],
            title: "Select Quote Line",
            sortAttr: "quoteNo",
            sortDesc: true,
            cEntity: entity,
            cAttribute: attribute,
            listItemText: listItemText,
            search: search
        });
    };





    //////////////////////////////////////////////
    // SELECT PARTS ROUTING SUPPLIER QUOTELINE  //
    //////////////////////////////////////////////
    values.SAM.partsRoutingQuoteLines = function(attribute, search){
        search = search || "";
        var curPartRevQuoteNo = values.csParts.currentPartRev.quoteNo;
        
        var setRouteQLine = function(qLine){
            attribute.sqLine = qLine;
            $('#reusable-modal').modal('hide');
        };

        var listItemText = function(qLine){
            var exp = $interpolate("Quote No: {{quoteLine.quoteNo}} --- Supplier: {{quoteLine.sName}} --- Part No: {{quoteLine.partNo}} {{quoteLine.partDesc}}");
            return exp({quoteLine: qLine});
        };

        values.searchAddModal({
            dataClass: "SupplierQuoteLine",
            filter: 'spQuoteRef.customerSupplierQuotesCollection.csQuoteNo = :1',
            params: [curPartRevQuoteNo],
            title: "Select Quote Line",
            sortAttr: "quoteNo",
            sortDesc: true,
            callBack: setRouteQLine,
            listItemText: listItemText,
            search: search
        });
    };



    ///////////////////////////////////////////////////////
    // ATTACH EXISTING SUPPLIER QUOTE TO CUSTOMER QUOTE  //
    ///////////////////////////////////////////////////////
    values.SAM.selectExistingSpQuote = function(callBack, customer){
        
        var listItemText = function(spQuote){
            var exp = $interpolate("{{sQuote.quoteNo}} - {{sQuote.sName}}");
            return exp({sQuote: spQuote});
        };

        var myCallBack = function(spQuote){
            callBack(spQuote);
            $('#reusable-modal').modal('hide');
        };

        values.searchAddModal({
            dataClass: "SupplierQuotes",
            filter: "cName = :1",
            params: [customer],
            title: "Select Existing Supplier Quote",
            sortAttr: "quoteNo",
            callBack: myCallBack,
            listItemText: listItemText
        });
    };

    //////////////////////
    // SELECT SUPPLIER  //
    //////////////////////
    values.SAM.selectSupplier = function(entity, attribute){

        var listItemText = function(supplier){
            var exp = $interpolate("{{supplier.name}}");
            return exp({supplier: supplier});
        };

        values.searchAddModal({
            dataClass: "Supplier",
            title: "Select a Supplier",
            sortAttr: "name",
            addAttr: "name",
            listItemText: listItemText,
            cEntity: entity,
            cAttribute: attribute
        });
    };


});