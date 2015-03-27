csAppServices.run(function($wakanda, csAppData){
    var values = csAppData.getData();
    

    //////////////////////////
    // PARSE ERROR MESSAGES //
    //////////////////////////
    var parseErrMessages = function(xhr){
        var msgs = JSON.parse(xhr.responseText);
        msgs.__ENTITIES = msgs.__ENTITIES || ["empty"];
        var errors = msgs.__ERROR || msgs.__ENTITIES[0].__ERROR || [{errCode:0, message: "Unhandled Error"}] ;
        
        values.errMessage = "";
        errors.forEach(function(elem, index){appendErrMsg(elem);});
        if ( xhr.responseURL.indexOf("/rest/$directory/login") == -1 ){ErrCheckUser();}
    };


    ///////////////////////////
    // APPEND ERROR MESSAGES //
    ///////////////////////////
    var appendErrMsg = function(elem){
        values.errMessage += "Err Code: " + elem.errCode + " - " + elem.message + "\n";
    };

    /////////////////////////////////////////
    // ON ERROR CHECK IF USER IS LOGGED IN //
    /////////////////////////////////////////
    var ErrCheckUser = function(){
        $wakanda.$currentUser().then(function(cUser){
            if (cUser.result != null){  //  SHOW ERROR MESSAGE
                values.reusable.modal.templateUrl = "/index.waPage/ErrorModal.html";
                $('#reusable-modal').modal('show');
            }else {  // SHOW LOGIN DIALOG
                values.showLoginModal();
            }

        });   
    };

    //////////////////////////////////////////
    // AJAX ERROR HANDLING AND REPORTING    //
    //////////////////////////////////////////
    AddAJAXInspector(function(xhr){
        // This function hijacks all ajax calls and injects error handling code
        // This allows us to handle errors generically, giving us the flexibility
        // to leave out specific error handling in other areas of the application 
        // that might otherwise be repeated and should be handled generically
        var oldORSC = xhr.onreadystatechange;
        var oldOE = xhr.onerror;
        var oldOT = xhr.ontimeout;
        
        xhr.onreadystatechange = function(){
            if (oldORSC != null){oldORSC.apply(this, arguments);}
            if (xhr.readyState==4 && xhr.status == 401){
                parseErrMessages(xhr);
            }
        };

        xhr.onerror = function(error){
            if (oldOE != null){oldOE.apply(this, arguments);}
            console.log(error);
            alert("Your Internet Connection appears to be down");
        };

        xhr.ontimeout = function(error){
            if (oldOT != null){oldOT.apply(this, arguments);}
            console.log(error);
            alert("Request to the Server Timed out");
        };

    });
});