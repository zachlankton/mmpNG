

model.Supplier.modified.onGet = function() {
	return this.getTimeStamp();
};


model.Supplier.modified.onSet = function(value) {
	return "";
};
