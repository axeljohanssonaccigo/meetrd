guestApp.service('guestSvc', function ($http) {
	//Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0,7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    }  else if(window.location.pathname.substr(0,7) === "/meetrd" ){
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

	this.getBookingsForUser = function(userId){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_author_posts/?post_type=booking&author_id=' + userId + '&posts_per_page=-1'
		})
	};

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
		//Replace all , by ; The url does not take commas.
		userInfo.billingAddress = userInfo.billingAddress.replace(/,/g , ";");
		userInfo.biography = userInfo.biography.replace(/,/g , ";");
		return $http({
			method: "POST",
			url: urlPathNameAddOn + '/api/user/update_user_meta_vars/?cookie=' + cookie + '&description="' + userInfo.biography + '"&first_name=' + userInfo.firstname + '&last_name=' + userInfo.lastname + '&nickname=' + userInfo.nickname + '&wpcf-phone=' + userInfo.phone + '&wpcf-billing-address=' + userInfo.billingAddress + '&insecure=cool'
		});
	};

	this.getUserInfo = function(userId){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/user/get_userinfo/?user_id=' + userId + '&insecure=cool'
		});
	};

	this.getUpdatingNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=update_post&callback='
		});
	};

	this.updateBooking = function(data, booking){
		booking.bookingDate = Date.parse(booking.bookingDate)/1000; //The date as timestamp
		booking.hostId = parseInt(booking.hostId);
		booking.roomId = parseInt(booking.roomId);
		booking.bookingStatus = parseInt(booking.bookingStatus);
		booking.content = booking.comments;
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts/update_post&post_type=booking&nonce=' + data.data.nonce + '&post_id=' + booking.id + '&title=' + booking.title + '&content=' + booking.content + '&custom[wpcf-host-id]=' + booking.hostId + '&custom[wpcf-room-name]='  + booking.roomName + '&custom[wpcf-room-id]='  + booking.roomId + '&custom[wpcf-booking-status]=' + booking.bookingStatus + '&custom[wpcf-e-mail]=' + booking.email + '&custom[wpcf-booking-date]=' + booking.bookingDate + '&custom[wpcf-phone]=' + booking.phone + '&custom[wpcf-booking-starttime]=' + booking.startTime + '&custom[wpcf-booking-endtime]=' + booking.endTime + '&custom[wpcf-total-price]=' + booking.price + '&custom[wpcf-duration]=' + booking.duration
		});
	};

	this.getRoom = function(roomId){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_post/?post_type=room&post_id=' + roomId// + '&posts_per_page=1'
		})
	};

	this.getAllMailTemplates = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=mailtemplate&posts_per_page=-1'
		});
	};

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
			//var json = jQuery.parseJSON(data);
            console.log('Success :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        }).error(function(data, status, headers, config) {
        	console.log('Error :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        });
	};
});
