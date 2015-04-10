

model.PurchaseOrders.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PurchaseOrders.modified.onSet = function(value) {
	return "";
};
