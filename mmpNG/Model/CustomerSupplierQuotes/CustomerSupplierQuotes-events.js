
model.CustomerSupplierQuotes.events.validate = function(event) {
	var newCsQuoteNo = this.csQuote.ID;
	var newSpQuoteNo = this.spQuote.quoteNo;
	var newCsQuoteCustomer = this.csQuote.cName;
	var newSpQuoteSupplier = this.spQuote.sName;
	
	if (newCsQuoteNo == undefined) {return true;}
	if (newSpQuoteNo == undefined) {return true;}
	if (newCsQuoteCustomer == undefined) {return true;}
	
	var results = ds.CustomerSupplierQuotes.query("csQuoteNo == :1 && spQuoteNo == :2 && customer == :3", newCsQuoteNo, newSpQuoteNo, newCsQuoteCustomer);
	
	if (results.length > 0) {return {error: 1, errorMessage: "Duplicate Entry!"}}

	return true;
};


model.CustomerSupplierQuotes.events.save = function(event) {
	if (this.spQuote.customer == undefined){
		var customer = this.csQuote.customer;
		this.spQuote.customer = customer;
		this.spQuote.save();
	}
};
