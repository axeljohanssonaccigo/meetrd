hostApp.service('hostSvc', function ($http) {
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
			url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&meta_key=wpcf-host-id&meta_value=' + userId + '&posts_per_page=-1'
		});
	};

	this.getCreationNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=create_post&callback='
		});
	};

	this.getUpdatingNonce = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=update_post&callback='
		});
	};


	this.getRoomsForUser = function(userId){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=room&meta_key=wpcf-host-id&meta_value=' + userId + '&posts_per_page=-1'
		});
	};

	this.updateBooking = function(data, booking){
		booking.bookingDate = Date.parse(booking.bookingDate)/1000; //The date as timestamp
		booking.hostId = parseInt(booking.hostId);
		booking.roomId = parseInt(booking.roomId);
		booking.bookingStatus = parseInt(booking.bookingStatus);
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts/update_post&post_type=booking&nonce=' + data.data.nonce + '&post_id=' + booking.id + '&title=' + booking.title + '&content=' + booking.content + '&custom[wpcf-host-id]=' + booking.hostId + '&custom[wpcf-room-name]='  + booking.roomName + '&custom[wpcf-room-id]='  + booking.roomId + '&custom[wpcf-booking-status]=' + booking.bookingStatus + '&custom[wpcf-e-mail]=' + booking.email + '&custom[wpcf-booking-date]=' + booking.bookingDate + '&custom[wpcf-phone]=' + booking.phone + '&custom[wpcf-booking-starttime]=' + booking.startTime + '&custom[wpcf-booking-endtime]=' + booking.endTime + '&custom[wpcf-total-price]=' + booking.price + '&custom[wpcf-duration]=' + booking.duration + '&custom[wpcf-host-comment]=' + booking.hostComment
		});
	};

	this.updateRoom = function(data, room){
		var roomId = room.id;
		var title = room.title;
		var content = room.content;
		var contactPerson = room.contactPerson;
		var webPage = room.webPage;
		var hostId = room.hostId;
		var nrOfPeople = room.nrOfPeople;
		var price = room.price; //Price per hour
		var area = room.area; // area for room
		var startTime = room.startTime; //Room is available from this hour of the day
		var endTime = room.endTime; //The last hour of the day that is possible to book
		var cancelDeadline = room.cancelDeadline;

		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts/update_post&post_type=room&nonce=' + data.data.nonce + '&post_id=' + roomId + '&title=' + title + '&content=' + content + '&custom[wpcf-contact-person]=' + contactPerson + '&custom[wpcf-webpage]='  + webPage + '&custom[wpcf-host-id]=' + hostId + '&custom[wpcf-nr-of-people]=' + nrOfPeople + '&custom[wpcf-start-time]=' + startTime + '&custom[wpcf-end-time]=' + endTime + '&custom[wpcf-area]=' + area + '&custom[wpcf-price]=' + price + '&custom[wpcf-cancel-deadline]=' + cancelDeadline
		});
	};

	this.createRoom = function(data, room){
		var title = room.title;
		var content = room.content;
		var contactPerson = room.contactPerson;
		var webPage = room.webPage;
		var hostId = room.hostId;
		var startDate = room.startDate; //Room is avaailable from this date
		var endDate = room.endDate; //Last day the room is available
		var nrOfPeople = room.nrOfPeople;
		var price = room.price; //Price per hour
		var startTime = room.startTime; //Room is available from this hour of the day
		var endTime = room.endTime; //The last hour of the day that is possible to book


		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts.create_post&nonce=' + data.data.nonce + '&title=' + title + '&content=' + content + '&status=publish&type=room&custom_fields={"wpcf-contact-person": "' + contactPerson + '","wpcf-webpage":"'  + webPage + '","wpcf-host-id":"' + hostId + '", "wpcf-startdate":"' + startDate + '", "wpcf-enddate":"' + endDate + '","wpcf-nr-of-people":' + nrOfPeople + ', "wpcf-starttime":' + startTime + ',"wpcf-endtime":' + endTime + ', "wpcf-area":' + area + ', "wpcf-price":' + price + ' }'
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
		userInfo.biography = userInfo.biography.replace(/,/g , ";");
		return $http({
			method: "POST",
			url: urlPathNameAddOn + '/api/user/update_user_meta_vars/?cookie=' + cookie + '&description="' + userInfo.biography + '"&first_name=' + userInfo.firstname + '&last_name=' + userInfo.lastname + '&nickname=' + userInfo.nickname + '&wpcf-slogan=' + userInfo.slogan + '&wpcf-phone=' + userInfo.phone + '&wpcf-cancel-deadline=' + userInfo.cancelDeadline + '&insecure=cool'
		});
	};

	this.getUserInfo = function(userId){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/user/get_userinfo/?user_id=' + userId + '&insecure=cool'
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
