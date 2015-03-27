csAppServices.run(function($wakanda, $filter, csAppData){
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
        rMod.addItem = options.addItem || null;

        rMod.callBack = options.callBack;
        rMod.listItemText = options.listItemText;
        

        rMod.addItem = function(){
            options.addItem(rMod.search, rMod.getList);
        };

        rMod.showAdd = function(){
            if (rMod.addAttr === false){return false;}
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
    values.SAM.csContacts = function(entity, attribute){
        var curCustomer = values.Customers.currentSelection;

        var setContact = function(contact){
            entity.$_entity[attribute].setValue(contact.$_entity);
            entity.$save().then(function(){
                $('#reusable-modal').modal('hide'); 
            });   
        };

        var addItem = function(contactName, callBack){
            var newEntity = $wakanda.$ds.Contact.$create({
                customer: curCustomer,
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
			params:[curCustomer.name],
			title: "Select Contact",
			sortAttr: "name",
			addAttr: "name",
            addItem: addItem,
			callBack: setContact,
			listItemText: listItemText
        });
    };
});