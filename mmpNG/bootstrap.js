
addHttpRequestHandler(
      '/pdf',               // (string) regex used to filter the requests to be intercepted
      'pdfGenerator.js',  // (string) name of the file where the request handler function is specified
      'genPdf'         // (string) name of the request handler function
);