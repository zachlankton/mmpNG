

model.CustomerQuotes.modified.onGet = function() {
	return this.getTimeStamp();
};


model.CustomerQuotes.modified.onSet = function(value) {
	return "";
};



model.CustomerQuotes.events.remove = function(event) {
	this.csQuoteLineItemsCollection.remove();
	this.customerSupplierQuotesCollection.remove();
};


model.CustomerQuotes.events.save = function(event) {
	this.quoteBy = currentUser().fullName;
};
