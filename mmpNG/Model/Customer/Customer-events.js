

model.Customer.modified.onGet = function() {
	return this.getTimeStamp();
};


model.Customer.modified.onSet = function(value) {
	return "";
};
