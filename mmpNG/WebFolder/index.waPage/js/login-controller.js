
myApp.controller('loginController', function ($scope, $wakanda, $filter, csAppData) {
	//Get the application data into our local scope
	$scope.login = csAppData.getData();
	var l = $scope.login;

	//check to see if we are currently logged in
	//and populate the scope with the result
	$wakanda.$currentUser().then(function(cUser){
		l.currentUser = cUser.result;
		l.loadAllWAKData(); //this method is defined in csAppDataFactory.js
	});

	//set the default login title
	l.modalTitle = "Please sign in";

	//function to display our login modal
	l.showLoginModal = function(){
		$('#login-modal').modal('show');
		setTimeout(function(){$('#inputUsername').focus();},500);
	};

	//this function handles authentication
	l.login = function(){
		$wakanda.$loginByPassword(l.username,l.password).then(function(loginResult){
			if(loginResult.result === true){
				//authentication was successful
				l.loginSuccess();
				
			} else {
				
				//authentication failed
				l.loginFailed();
				
			}
		});		
	};

	l.loginSuccess = function(){
		
		l.loadAllWAKData();  //this method is defined in csAppDataFactory.js
		l.username = "";
		l.password = "";
		$('#login-modal').modal('hide');

		//get the current user info and populate 
		// the scope with the result
		$wakanda.$currentUser().then(function(cUser){
			l.currentUser = cUser.result;
			if(l.templateToLoad != null){
				l.loadMainTemp(l.templateToLoad);
			}
		});
	};

	l.loginFailed = function(){
		l.username = "";
		l.password = "";
		l.modalTitle = "Invalid Login!";
		$('#inputUsername').focus();
	};

	//this functions logs the user out
	//and resets the current user variable
	l.logout = function(){
		$wakanda.$logout().then(function(a){
			l.currentUser = null;
			l.currentMainTemplate = {};
			l.collections = {}; // empty all WAK Data;
		});
	};
	
  
});
