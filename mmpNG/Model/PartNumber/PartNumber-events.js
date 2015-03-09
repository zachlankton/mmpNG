

model.PartNumber.modified.onGet = function() {
	return this.getTimeStamp();
};


model.PartNumber.modified.onSet = function(value) {
	return "";
};


model.PartNumber.events.remove = function(event) {
	this.partRevCollection.remove();
};
