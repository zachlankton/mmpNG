

model.Supplier.modified.onGet = function() {
	return this.getTimeStamp();
};
