

model.SupplierQuotes.modified.onGet = function() {
	return this.getTimeStamp();
};
