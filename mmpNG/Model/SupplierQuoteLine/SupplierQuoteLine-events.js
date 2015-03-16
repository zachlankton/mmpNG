

model.SupplierQuoteLine.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SupplierQuoteLine.events.remove = function(event) {
	this.SupplierQuoteLineQtysCollection.remove();
};
