

model.PackingList.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PackingList.modified.onSet = function(value) {
	return "";
};


model.PackingList.events.save = function(event) {
	this.user = currentUser().fullName;
	
	var isNew = this.isNew();
	if (isNew && this.order != undefined){
		var pList = this;
		this.contact = this.order.contact;
		this.shipVia = this.order.shipVia;
		this.shipService = this.order.shipService;
		this.shipTerms = this.order.shipTerms;
		this.shipAcct = this.order.shipAcct;
		this.shipTo = this.order.shipToAddress;
		// ASSIGN AN INCREMENTAL PACKING SLIP ID STARTING WITH 1
		var lastID = ds.PackingList.query('orderID = ' + this.order.ID).max('incID');
		if (lastID == undefined){this.incID = 1;}
		else{ this.incID = lastID + 1; }
		
		// AUTOMATICALLY PULL LINE ITEMS FROM THE ORDER INTO THE PACKING SLIP
		var orderLineItems = ds.OrderLineItems.query('order.ID = ' + this.order.ID);
		if (orderLineItems == undefined){return 0;}
		orderLineItems.forEach(function(line){
			var plItem = ds.PackingListLines.createEntity();
			plItem.plRef = pList;
			plItem.orderLineRef = line;
			plItem.save();
		});
	}
};



model.PackingList.events.remove = function(event) {
	this.packingListLinesCollection.remove();
};


model.PackingList.pListNo.onGet = function() {
	return this.orderID + "-" + this.incID;
};


model.PackingList.pListNo.onSet = function(value) {
	return "";
};