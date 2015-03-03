myApp.controller('templates', function($scope, $wakanda, $filter, csAppData) {

    $scope.templates = csAppData.getData();
    var t = $scope.templates;

    t.loadMainTemp = function(template){
        
        if(t.currentUser != null){

			t.currentMainTemplate = template;
		
        }else{
            t.templateToLoad = template;
            t.showLoginModal();
        }
        
    }   
});
