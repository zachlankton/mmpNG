

model.Customer.modified.onGet = function() {
	return this.getTimeStamp();
};
