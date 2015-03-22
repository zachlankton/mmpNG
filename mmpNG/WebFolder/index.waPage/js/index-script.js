
//this line initializes our Application with the wakanda and csAppServices Dependencies
var myApp = angular.module('mainPage', ['csAppServices']);


///////////////////////////////
///// HELPER FUNCTIONS  ///////
///////////////////////////////

function getCSS(cssPath){
    // load CSS file and append it to the HEAD if it hasn't been loaded already
    if ($("[href='"+cssPath+"']").length == 0){
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: cssPath
        }).appendTo('head');
    }
    
}

function searchObject(searchObj){
    var result = searchObj.arr.filter(function( obj ) {
        return obj[searchObj.key] == searchObj.value;
    });
    return result;
}



function AddAJAXInspector(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}