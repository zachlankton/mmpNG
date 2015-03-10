

model.SpAddress.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SpAddress.modified.onSet = function(value) {
	return "";
};
