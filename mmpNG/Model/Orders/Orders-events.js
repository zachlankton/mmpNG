

model.Orders.modified.onGet = function() {
	return this.getTimeStamp();
};
