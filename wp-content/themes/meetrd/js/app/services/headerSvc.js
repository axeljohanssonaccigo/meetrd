headerApp.service('headerSvc', function ($http) {
	//Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0,7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    }  else if(window.location.pathname.substr(0,7) === "/meetrd" ){
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }



	this.getNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=create_post&callback='
		});
	};

	this.generateUserCookie = function(username, password){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/user/generate_auth_cookie/?username=' + username + '&password=' + password + '&insecure=cool'
		});

	};


	this.updateUserInfo = function(cookie, userInfo){
		return $http({
			method: "POST",
			url: urlPathNameAddOn + '/api/user/update_user_meta_vars/?cookie=' + cookie + '&wpcf-phone=' + userInfo.phone + '&wpcf-billing-address=' + userInfo.billingAddress + '&insecure=cool'
		});
	};


	this.getRegisterNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_nonce/?controller=user&method=register'
		});
	};

	this.getUpdatingNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=update_post&callback='
		});
	};

	this.registerUser = function(nonce, user){
		user.billingAddress = user.billingAddress.replace(/,/g , ";");
		user.biography = user.biography.replace(/,/g , ";");

		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/user/register/?username=' + user.username + '&nickname=' + user.nickname + '&email=' + user.email + '&nonce=' + nonce + '&first_name=' + user.firstName + '&last_name=' + user.lastName + '&display_name=' + user.username + '&user_pass=' + user.password + '&description=' + user.biography + '&user_url=' + user.website + '&custom[wpcf-phone]=' + user.phone + '&custom[wpcf-billing-address]="' + user.billingAddress + '"&show_admin_bar_front=no' + '&insecure=cool'
		});
	};


	/*
	*
	* Send mail Example Angular JS
	* By Jenssiii
	*/
	this.sendMail = function(recipient, subject, body){
		return $http({
			method: "POST",
			url: urlPathNameAddOn + '/wp-admin/admin-ajax.php',
			params: {
                action: 'send_message',
                email: recipient,
                subject: subject,
                message: body
            }
		}).success(function(data, status, headers, config) {
			var json = jQuery.parseJSON(data);
            console.log('Success :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        }).error(function(data, status, headers, config) {
        	console.log('Error :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        });
	};

	this.getAllMailTemplates = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=mailtemplate&posts_per_page=-1'
		});
	};

	this.getMailTemplateBySlug = function(slug){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=mailtemplate&slug=' + slug + '&posts_per_page=1'
		});
	};


});
