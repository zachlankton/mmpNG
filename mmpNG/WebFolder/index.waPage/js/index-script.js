
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