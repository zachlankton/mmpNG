
model.CustomerSupplierQuotes.events.validate = function(event) {
	var newCsQuoteNo = this.csQuote.ID;
	var newSpQuoteNo = this.spQuote.quoteNo;
	var newCsQuoteCustomer = this.csQuote.cName;
	var newSpQuoteSupplier = this.spQuote.sName;
	
	var results = ds.CustomerSupplierQuotes.query("csQuoteNo == :1 && spQuoteNo == :2 && customer == :3 && supplier == :4", newCsQuoteNo, newSpQuoteNo, newCsQuoteCustomer, newSpQuoteSupplier);
	
	if (results.length > 0) {return {error: 1, errorMessage: "Duplicate Entry!"}}

	return true;
};
