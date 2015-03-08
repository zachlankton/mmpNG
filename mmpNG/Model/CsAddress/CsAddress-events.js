

model.CsAddress.modified.onGet = function() {
	return this.getTimeStamp();
};


model.CsAddress.modified.onSet = function(value) {
	return "";
};
