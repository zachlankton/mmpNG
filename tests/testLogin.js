var webPage = require('webpage');
var page = webPage.create();

var globalObj = {};
globalObj.test = [];
globalObj.passed = [];
globalObj.failed = [];

lModStr = '<formng-submit="login.login()"class="form-signinng-pristineng-scopeng-invalidng-invalid-required"ng-controller="loginController"><h2class="form-signin-headingng-binding">Pleasesignin...</h2><inputng-model="login.username"type="text"id="inputUsername"class="form-controlng-pristineng-untouchedng-invalidng-invalid-required"placeholder="Username"required=""autofocus=""><inputng-model="login.password"type="password"id="inputPassword"class="form-controlng-pristineng-untouchedng-invalidng-invalid-required"placeholder="Password"required=""><buttonclass="btnbtn-lgbtn-primarybtn-block"type="submit">Signin</button></form>';

function clickLoginBtn(){
	globalObj.test.push("Clicking Login");
	console.log("Clicking Login Button");
	var e = page.evaluate(function(){
		var loginBtn = $("[ng-click='login.showLoginModal()']").click();
	});
	globalObj.passed.push("Clicked Login");
	
	setTimeout(findLoginModal(),1000);
}

function findLoginModal() {
	globalObj.test.push("Checking Login Modal");
	console.log("Checking Login Modal...");
	var e = page.evaluate(function(){
		var lMod = $('.modal-content');
		return lMod.html().replace(/\s/g, "");
	});

	if (e == lModStr){
		console.log("Login Modal OK");
		globalObj.passed.push("Login Modal OK");
	}else{
		console.log("Login Modal BAD");
		globalObj.failed.push("Login Modal BAD");
	}


	phantom.exit();
}


page.open('http://127.0.0.1:8081', function(status){
	
	setTimeout(function(){
		clickLoginBtn();		
	}, 1000);
	
});