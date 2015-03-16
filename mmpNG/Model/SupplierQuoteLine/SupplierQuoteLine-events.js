

model.SupplierQuoteLine.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SupplierQuoteLine.events.remove = function(event) {
	this.supplierQuoteLineQtysCollection.remove();
};


model.SupplierQuoteLine.modified.onSet = function(value) {
	return "";
};
