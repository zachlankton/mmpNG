

model.OrderLineItemQtys.modified.onGet = function() {
	return this.getTimeStamp();
};
