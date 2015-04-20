

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


model.Customer.parts.onGet = function() {
	var parts = this.partNumberCollection;
	if (parts === undefined){return "";}
	
	var partsStr = "";
	parts.forEach(function(part){
		partsStr = partsStr + part.partNo + ",";
	});
	return partsStr;
};


model.Customer.parts.onSet = function() {
	return "";
};