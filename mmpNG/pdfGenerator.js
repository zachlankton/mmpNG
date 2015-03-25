function genPdf(request, response) {
	var cSess = currentSession();
	var folder = getFolder();
	var path = folder.path;
	var princePath = "/usr/local/bin/prince";
	
	if (cSess.user.name == "default guest"){return "Not Logged In!";}
	
	//Prince PDF Generation Code to out.pdf
	var princeExec = SystemWorker.exec( princePath + " https://www.google.com -o " + path + "out.pdf");
	
	var pdfOutput = File(path + "out.pdf");
	if (!pdfOutput.exists){return "out.pdf read error!";}
	var buffer = pdfOutput.toBuffer();
	response.contentType = "application/pdf";
	response.body = buffer.toBlob();
	//return response;
}

