'use strict';
var headerApp = angular.module('headerApp', []);

jQuery(document).ready(function () {
	angular.bootstrap(document.getElementById("meetrd-header"), ['headerApp']);
});



headerApp.controller('headerCtrl', function($scope, headerSvc) {
	//Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
	if (window.location.pathname.substr(0,7) === "/Meetrd") {
		var urlPathNameAddOn = "/Meetrd";
	} else if(window.location.pathname.substr(0,7) === "/meetrd" ){
			var urlPathNameAddOn = "/meetrd";
	}  else {
		var urlPathNameAddOn = "";
	}
	if (userIsLoggedIn) {
		$scope.userInfo = userData;
		$scope.userRole = userRole;
		if ($scope.userRole === 'administrator') {
			jQuery('#meetrd-header').addClass('sticky-header-admin');
		};
	};
	$scope.showMobileMenu = false;
	$scope.showOrHideMobileMenu = function(){
		$scope.showMobileMenu = !$scope.showMobileMenu;
	};
	$scope.newUser = {
		"username": "",
		"nickname": "",
		"email": "",
		"password": "",
		"password2": "",
		"firstName": "",
		"lastName": "",
		"website": "http://",
		"biography": "",
		"phone": "",
		"billingAddress": ""
	};
	//In login modal
	$scope.showLoader = false;
	//In wp-login.php L: 801-802. the else body is changed to redirect back to the previous page
	$scope.setBookingUrl = function(){
		var roomQuery = "";
		//If the user entered the login page from a room, then add á room query to the url to redirect back wehn logging in.
		if (window.location.href.search('room') > -1){
			var roomName = window.location.href.slice(window.location.href.search('room/') + 5).replace("/","");
			roomQuery = "room/" + roomName;
		}
		if ($scope.currentBooking.duration > 0) {
			var startQuery = $scope.currentBooking.startTime;
			var endQuery = $scope.currentBooking.endTime;
			var dateQuery = $scope.currentBooking.date;
			var query = urlPathNameAddOn + "/" + roomQuery + "&date=" + dateQuery + "&startTime=" + startQuery + "&endTime=" + endQuery;
			window.history.pushState("", "", query);
			//window.location.href = window.location.origin + query;
		}
		var suffix = urlPathNameAddOn + "/wp-login.php";

	};


	$scope.mailTemplates = [];

	$scope.getAllMailTemplates = function(){
		headerSvc.getAllMailTemplates().then(function(response){
			$scope.mailTemplates = response.data.posts;
			angular.forEach($scope.mailTemplates, function(mail){
				mail["subject"] = mail["custom_fields"]["wpcf-subject"][0];
				mail["body"] = mail.content;
			});
		});
	};
	$scope.getAllMailTemplates();

	$scope.getMailTemplateBySlug = function(mailTemplateSlug){
		var returnTpl = null;
		angular.forEach($scope.mailTemplates, function(mail){
			if (mail.slug === mailTemplateSlug) {
				returnTpl = mail;
			};
		});
		return returnTpl;
	};

	$scope.sendMail = function(recipient, subject, body){
		var mailSucceded = null;
		headerSvc.sendMail(recipient, subject, body).then(function(response){
			console.log('Mail returned true');
			var mailSucceded = true;
			return mailSucceded;

		}).catch(function(){
			console.log('Error send mail');
			var mailSucceded = false;
			return mailSucceded;
		});

	};

	$scope.registerUser = function(){
	//Set the username to the entered email
	$scope.newUser.username = $scope.newUser.email;
	//reset the user website if none is entered
	if ($scope.newUser.website === "http://") {
		$scope.newUser.website = "";
	};
	$scope.userTriedToRegister = true;
	$scope.registerMessageToUser = "Ditt konto skapas..."
	headerSvc.getRegisterNonce().then(function(response){
		headerSvc.registerUser(response.data.nonce, $scope.newUser).then(function(response){
			//Update user info to get the custom user fields in
			headerSvc.generateUserCookie($scope.newUser.username, $scope.newUser.password).then(function(response){
				headerSvc.updateUserInfo(response.data.cookie, $scope.newUser).then(function(response){
					$scope.userWasRegistered = true;
					$scope.registerMessageToUser = "Ditt gästkonto har skapats!"
					//Auto click the login button to come to the login form
					jQuery("#loginButton")[0].click();
					//<?php echo $_SERVER['REQUEST_URI']; ?>";
					//jQuery("#createGuestAccountButton").addClass('simplemodal-login');
				});
			});

		}).catch(function(response){
			console.log("Error in registerUser");
			$scope.userTriedToRegister = false;
			var error = response.data.error;
			console.log(error);
			switch(error){
				case "E-mail address is already in use.":
				$scope.registerMessageToUser = "Det finns redan en användare med denna e-mailadress.";
				jQuery("#registerEmail").addClass('higlight-error');
				jQuery("#registerUsername").removeClass('higlight-error');
				break;
				case "Username already exists.":
				$scope.registerMessageToUser = "Det finns redan en användare med detta användarnamn.";
				jQuery("#registerUsername").addClass('higlight-error');
				jQuery("#registerEmail").removeClass('higlight-error');
				break;
			}
		});
	});

};


$scope.phoneNumberIsValid = function(phoneNr){
	return /^\d+$/.test(phoneNr);
};

$scope.passwordsMatch = function(){
	return $scope.newUser.password === $scope.newUser.password2;
};

	$scope.isUrlValid = function(form, url){
        if (form.$dirty) {
        //In some cases website is undefined for some reason.
            if (url === undefined) {
                return true;
            } else {
                var returnBall = false;
                //Allow all urls that start with http://
                if (form !== undefined) {
                    //Allow urls that are empty strings or begins by http://
                    if (url.substr(0,7) === "http://" || url.length === 0) {
                    	form.website.$setValidity("url",true);
                        returnBall = true;
                    }
                };

                return returnBall;
            }
        };
    };
	               //COOKIE HANDLING
               $scope.styleCookieNotice = function(){
                              if (jQuery("#cn-accept-cookie").length > 0) {
                                             jQuery("#cn-accept-cookie").removeClass("button bootstrap").addClass("btn-sm btn-meetrd btn");
                              }
               };
               $scope.styleCookieNotice();


});
