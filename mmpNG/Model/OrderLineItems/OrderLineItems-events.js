

model.OrderLineItems.modified.onGet = function() {
	return this.getTimeStamp();
};
