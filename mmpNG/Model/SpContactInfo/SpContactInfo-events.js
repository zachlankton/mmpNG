

model.SpContactInfo.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SpContactInfo.modified.onSet = function(value) {
	return "";
};
