

model.CsQuoteLineItems.modified.onGet = function() {
	return this.getTimeStamp();
};


model.CsQuoteLineItems.modified.onSet = function(value) {
	return "";
};


model.CsQuoteLineItems.events.remove = function(event) {
	this.csQuoteLineItemQtysCollection.remove();
};


model.CsQuoteLineItems.unit.onGet = function() {
	if (this.csQuoteLineItemQtysCollection[0] != undefined){
		return this.csQuoteLineItemQtysCollection[0].unit;
	}
};

model.CsQuoteLineItems.unit.onSet = function() {
	return "";
};
