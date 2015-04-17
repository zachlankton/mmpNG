

model.PartRev.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PartRev.modified.onSet = function(value) {
	return "";
};


model.PartRev.quotePriceBreaks.onGet = function() {
	var priceBreakSummary = "";
	
	if (this.quoteLineRef == undefined){return "";}
	var qtys = this.quoteLineRef.csQuoteLineItemQtysCollection.query('qty != null order by qty');
	
	qtys.forEach(function(qty){
		priceBreakSummary += "Qty: " + qty.qty;
		priceBreakSummary += " - Price: $" + qty.price;
		priceBreakSummary += " - Unit: " + qty.unit;
		priceBreakSummary += "\n";
	} );
	
	return priceBreakSummary;
};


model.PartRev.quotePriceBreaks.onSet = function() { 
	return "";
};



model.PartRev.events.remove = function(event) {
	this.routingCollection.remove();
	this.controlPlanCollection.remove();
};
