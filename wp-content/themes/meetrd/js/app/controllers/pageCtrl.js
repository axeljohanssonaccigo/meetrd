'use strict';
var pageApp = angular.module('pageApp', []);


pageApp.controller('pageCtrl', function($scope, pageSvc) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0,7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    }  else if(window.location.pathname.substr(0,7) === "/meetrd" ){
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

    $scope.userTriedToRegister = false;
    $scope.userWasRegistered = false;
    $scope.messageToUser = "";

    $scope.newHost = {
        "name": "",
        "email": "",
        "website": "http://",
        "comments": ""
    };

    $scope.isPage = function(pageSlug){
    	return window.location.pathname.search(pageSlug) > -1;
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

$scope.registerUser = function(){
        //Set the username to the entered email
        $scope.newUser.username = $scope.newUser.email;
        //reset the user website if none is entered
        if ($scope.newUser.website === "http://") {
            $scope.newUser.website = "";
        };
        $scope.userTriedToRegister = true;
        $scope.registerMessageToUser = "Ditt konto skapas..."
        pageSvc.getRegisterNonce().then(function(response){
            pageSvc.registerUser(response.data.nonce, $scope.newUser).then(function(){
            //Update user info to get the custom user fields in
            pageSvc.generateUserCookie($scope.newUser.username, $scope.newUser.password).then(function(response){
                pageSvc.updateUserInfo(response.data.cookie, $scope.newUser).then(function(response){
                    $scope.userWasRegistered = true;
                    $scope.registerMessageToUser = "Ditt gästkonto har skapats!"
                    //Auto click the login button to come to the login form
                    jQuery("#loginButton")[0].click();
                });
            });

        }).catch(function(response){
            console.log("Error in registerUser");
            $scope.userTriedToRegister = false;
            var error = response.data.error;
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

    //In wp-login.php L: 801-802. the else body is changed to redirect back to the previous page
    $scope.setBookingUrl = function(){
        var suffix = urlPathNameAddOn + "/wp-login.php";
        window.location.href = window.location.origin + suffix;
    };

    $scope.phoneNumberIsValid = function(phoneNr){
        return /^\d+$/.test(phoneNr);
    };

    //SEND MAIL

    $scope.createMailFromForm = function(){
        //Get mail template
        var mailTemplateSlug = "bli-vard";
        var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);

        //Append the mail body with the host creds and footer
        var formInfo = "";
        formInfo = formInfo.
        concat('<h2>Ny värd</h2>').
        concat('<p><b>För- och efternamn</b><br>' + $scope.newHost.name + '<br>').
        concat('<b>E-mail</b><br>' + $scope.newHost.email + '<br>').
        concat('<b>Hemsida</b><br>' + $scope.newHost.website + '<br>').
        concat('<b>Kommentar</b><br>' + $scope.newHost.comments + '</p>');


        mailTpl.body = mailTpl.body + formInfo;
        var adminMail = 'support@meetrd.se';
        $scope.sendMail(adminMail, mailTpl.subject, mailTpl.body);

    };

    $scope.mailTemplates = [];

    $scope.getAllMailTemplates = function(){
        pageSvc.getAllMailTemplates().then(function(response){
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
        pageSvc.sendMail(recipient, subject, body).then(function(response){
            console.log('Mail returned true');
            var mailSucceded = true;
            $scope.messageToUser = "Du har registrerats som värd! Meetrd kommer att kontakta dig inom kort.";

        }).catch(function(){
            console.log('Error send mail');
            var mailSucceded = false;
            $scope.messageToUser = "Det uppstod ett fel vid sändning av mail. Kontakta Meetrd på support@meetrd.se";
        });
    };
    $scope.reloadPage = function(){
        location.reload();
    }

});
