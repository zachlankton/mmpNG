

model.SpContact.modified.onGet = function() {
	return this.getTimeStamp();
};


model.SpContact.modified.onSet = function(value) {
	return "";
};


model.SpContact.events.remove = function(event) {
	this.spContactInfoCollection.remove();
};
