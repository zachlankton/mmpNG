

model.PartNumber.modified.onGet = function() {
	return this.getTimeStamp();
};
