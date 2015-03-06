

model.SupplierQuoteLine.modified.onGet = function() {
	return this.getTimeStamp();
};
