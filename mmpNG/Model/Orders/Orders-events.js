

model.Orders.modified.onGet = function() {
	return this.getTimeStamp();
};

model.Orders.modified.onSet = function() {
	return "";
};


model.Orders.firstDueDate.onGet = function() {
	//TODO: GET FIRST DUE DATE FROM "THIS" ORDER'S RELEASES
	var releases = ds.OrderLineItemQtys.query("order by due");
	return "";
};

model.Orders.firstDueDate.onSet = function() {
	return "";
};


model.Orders.events.remove = function(event) {
	this.orderLineItemsCollection.remove();
	this.purchaseOrdersCollection.remove();
	this.packingListCollection.remove();
};
