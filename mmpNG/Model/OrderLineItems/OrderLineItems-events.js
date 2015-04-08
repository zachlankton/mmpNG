

model.OrderLineItems.modified.onGet = function() {
	return this.getTimeStamp();
};


model.OrderLineItems.modified.onSet = function(value) {
	return "";
};
