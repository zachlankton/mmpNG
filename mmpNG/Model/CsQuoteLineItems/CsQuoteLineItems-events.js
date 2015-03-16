

model.CsQuoteLineItems.modified.onGet = function() {
	return this.getTimeStamp();
};


model.CsQuoteLineItems.modified.onSet = function(value) {
	return "";
};


model.CsQuoteLineItems.events.remove = function(event) {
	this.csQuoteLineItemQtysCollection.remove();
};
