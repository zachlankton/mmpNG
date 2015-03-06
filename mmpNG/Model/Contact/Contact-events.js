

model.Contact.modified.onGet = function() {
	return this.getTimeStamp();
};
