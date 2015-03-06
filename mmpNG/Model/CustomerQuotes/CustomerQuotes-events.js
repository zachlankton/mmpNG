

model.CustomerQuotes.modified.onGet = function() {
	return this.getTimeStamp();
};
