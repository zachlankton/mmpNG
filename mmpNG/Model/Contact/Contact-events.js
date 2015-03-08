

model.Contact.modified.onGet = function() {
	return this.getTimeStamp();
};


model.Contact.modified.onSet = function(value) {
	return "";
};


model.Contact.events.remove = function(event) {
	this.contactInfoCollection.remove();
};
