

model.PartRev.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PartRev.modified.onSet = function(value) {
	return "";
};
