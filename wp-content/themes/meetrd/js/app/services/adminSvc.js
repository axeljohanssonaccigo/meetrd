adminApp.service('adminSvc', function ($http) {
	//Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
	if (window.location.pathname.substr(0,7) === "/Meetrd") {
		var urlPathNameAddOn = "/Meetrd";
	} else if(window.location.pathname.substr(0,7) === "/meetrd" ){
			var urlPathNameAddOn = "/meetrd";
	} else {
		var urlPathNameAddOn = "";
	}


	this.getAllBookings = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&posts_per_page=-1'
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


	this.getAllRooms = function(){
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/api/get_posts/?post_type=room&posts_per_page=-1'
		});
	};

	this.updateBooking = function(data, booking){
		booking.bookingDate = Date.parse(booking.bookingDate)/1000; //The date as timestamp
		booking.hostId = parseInt(booking.hostId);
		booking.roomId = parseInt(booking.roomId);
		booking.status = parseInt(booking.status);
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts/update_post&post_type=booking&nonce=' + data.data.nonce + '&post_id=' + booking.id + '&title=' + booking.title + '&content=' + booking.content + '&custom[wpcf-host-id]=' + booking.hostId + '&custom[wpcf-room-id]='  + booking.roomId + '&custom[wpcf-room-name]='  + booking.roomName + '&custom[wpcf-booking-status]=' + booking.status + '&custom[wpcf-e-mail]=' + booking.email + '&custom[wpcf-booking-date]=' + booking.bookingDate + '&custom[wpcf-phone]=' + booking.phone + '&custom[wpcf-booking-starttime]=' + booking.startTime + '&custom[wpcf-booking-endtime]=' + booking.endTime + '&custom[wpcf-total-price]=' + booking.price + '&custom[wpcf-duration]=' + booking.duration
		});
	};

	this.updateRoom = function(data, room){
		if ('id' in room) {
			var roomId = room.id;
		} else var roomId = "";
		if ('title' in room) {
			var title = room.title;
		} else var itle = "";
		if ('content' in room) {
			var content = room.content;
		} else var content = "";
		if ('contactPerson' in room) {
			var contactPerson = room.contactPerson;
		} else var contactPerson = "";
		if ('contactEmail' in room) {
			var contactEmail = room.contactEmail;
		} else var contactEmail = "";
		if ('contactPhone' in room) {
			var contactPhone = room.contactPhone;
		} else var contactPhone = "";
		if ('webPage' in room) {
			var webPage = room.webPage;
		} else var webPage = "";
		if ('hostId' in room) {
			var hostId = room.hostId;
		} else var hostId = "";
		if ('nrOfPeople' in room) {
			var nrOfPeople = room.nrOfPeople;
		} else var nrOfPeople = 0;

		if ('price' in room) {
			var price = room.price; //Price per hour
		} else var price = 0;
		if ('startTime' in room) {
			var startTime = room.startTime; //Room is available from this hour of the day
		} else var startTime = 0;
		if ('endTime' in room) {
			var endTime = room.endTime; //The last hour of the day that is possible to book
		} else var endTime = 0;
		if ('cancelDeadline' in room) {
			var cancelDeadline = parseInt(room.cancelDeadline); //The last hour of the day that is possible to book
		} else var cancelDeadline = 0;
	return $http({
		method: "GET",
		url: urlPathNameAddOn + '/?json=posts/update_post&post_type=room&nonce=' + data.data.nonce + '&post_id=' + roomId + '&title=' + title + '&content=' + content + '&custom[wpcf-contact-person]=' + contactPerson + '&custom[wpcf-contact-email]=' + contactEmail + '&custom[wpcf-contact-phone]=' + contactPhone + '&custom[wpcf-webpage]='  + webPage + '&custom[wpcf-host-id]=' + hostId + '&custom[wpcf-nr-of-people]=' + nrOfPeople + '&custom[wpcf-starttime]=' + startTime + '&custom[wpcf-endtime]=' + endTime + '&custom[wpcf-price]=' + price + '&custom[wpcf-cancel-deadline]=' + cancelDeadline
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
	var cancelDeadline = parseInt(room.cancelDeadline);

		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts.create_post&nonce=' + data.data.nonce + '&title=' + title + '&content=' + content + '&status=publish&type=room&custom_fields={"wpcf-contact-person": "' + contactPerson + '","wpcf-webpage":"'  + webPage + '","wpcf-host-id":"' + hostId + '", "wpcf-startdate":"' + startDate + '", "wpcf-enddate":"' + endDate + '","wpcf-nr-of-people":' + nrOfPeople + ',"wpcf-starttime":' + startTime + ',"wpcf-endtime":' + endTime + ',"wpcf-cancel-deadline":' + cancelDeadline + ',"wpcf-price":' + price + ' }'
		});
	};
	this.createRoomForHost = function(nonce, host){
		var cancelDeadline = parseInt(host['wpcf-cancel-deadline'][0]);
		return $http({
			method: "GET",
			url: urlPathNameAddOn + '/?json=posts.create_post&nonce=' + nonce + '&type=room&title=nytt_rum&status=draft&type=room&custom_fields={"wpcf-contact-person": "' + host.first_name[0] + " " + host.last_name[0] + '","wpcf-webpage":"'  + host.data.user_url + '","wpcf-contact-phone":"'  + host['wpcf-phone'][0] + '","wpcf-contact-email":"'  + host.data.user_email + ',"wpcf-cancel-deadline":' + cancelDeadline + '","wpcf-host-id":"' + host.ID + '"}'
		});
	};


});
