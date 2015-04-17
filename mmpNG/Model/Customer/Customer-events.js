

model.Customer.modified.onGet = function() {
	return this.getTimeStamp();
};


model.Customer.modified.onSet = function(value) {
	return "";
};


model.Customer.events.remove = function(event) {
	this.contactCollection.remove();
	this.ordersCollection.remove();
	this.partNumberCollection.remove();
	this.customerQuotesCollection.remove();
	this.csAddressCollection.remove();
	this.supplierQuotesCollection.remove();
};
