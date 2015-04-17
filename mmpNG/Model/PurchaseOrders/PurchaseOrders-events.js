

model.PurchaseOrders.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PurchaseOrders.modified.onSet = function(value) {
	return "";
};


model.PurchaseOrders.events.remove = function(event) {
	this.pOLineItemsCollection.remove();
};
