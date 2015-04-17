

model.OrderLineItems.modified.onGet = function() {
	return this.getTimeStamp();
};


model.OrderLineItems.modified.onSet = function(value) {
	return "";
};




model.OrderLineItems.events.remove = function(event) {
	this.orderLineItemQtysCollection.remove();
};


model.OrderLineItems.quotedPrice.onGet = function() {
	if (this.partRev == undefined) {return "";}
	if (this.partRev.quoteLineRef == undefined) {return "No Quote";}
	var priceBreaks = this.partRev.quoteLineRef.csQuoteLineItemQtysCollection.orderBy('qty');
	var totalQty = this.orderLineItemQtysCollection.sum("qty");
	if (totalQty == 0){return "";}
	var priceBreak = priceBreaks.query("qty <= " + totalQty).orderBy("qty desc");
	if (priceBreak[0] == undefined){
		return "Min Qty " + priceBreaks[0].qty;
	}else{
		return priceBreak[0].price;
	}
};

model.OrderLineItems.quotedPrice.onSet = function() {
	return "";
};


model.OrderLineItems.totalQty.onGet = function() {
	return this.orderLineItemQtysCollection.sum("qty");
};

model.OrderLineItems.totalQty.onSet = function() {
	return "";
};
