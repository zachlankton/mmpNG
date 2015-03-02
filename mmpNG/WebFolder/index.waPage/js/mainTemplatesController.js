myApp.controller('templates', function($scope, $wakanda, $filter, csAppData) {

    $scope.templates = csAppData.getData();
    var t = $scope.templates;

    t.loadMainTemp = function(template){
        
        if(t.currentUser != null){
            var srchObj = {
                arr: t.MainNavBar, 
                key:"title", 
                value: template
            };

            t.currentMainTemplate = searchObject(srchObj)[0];    
        }else{
            t.templateToLoad = template;
            t.showLoginModal();
        }
        
    }   
});
