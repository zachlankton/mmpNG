

model.SupplierQuotes.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SupplierQuotes.modified.onSet = function(value) {
	return "";
};


model.SupplierQuotes.events.remove = function(event) {
	this.supplierQuoteLineCollection.remove();
	this.customerSupplierQuotesCollection.remove();
};



model.SupplierQuotes.events.save = function(event) {
	this.enteredBy = currentUser().fullName;
};
