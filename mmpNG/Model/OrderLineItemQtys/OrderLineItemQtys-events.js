

model.OrderLineItemQtys.modified.onGet = function() {
	return this.getTimeStamp();
};


model.OrderLineItemQtys.modified.onSet = function(value) {
	return "";
};
