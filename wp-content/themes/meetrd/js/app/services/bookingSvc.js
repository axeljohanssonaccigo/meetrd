bookingApp.service('bookingSvc', function ($http) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

    this.getAllPosts = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/wp-json/wp/v1/posts'
        });
    };

    this.getBookingsForRoom = function (roomId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&meta_key=wpcf-room-id&meta_value=' + roomId + '&posts_per_page=-1'
        });
    };

    this.getHostIdForRoom = function (roomId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/?json=get_post&post_type=room&post_id=' + roomId
        });
    };

    this.createBooking = function (data, currentBooking) {
        var date = Date.parse(currentBooking.date) / 1000; //The date as timestamp
        var roomId = currentBooking.roomId; //Room Id
        var roomName = currentBooking.roomName;
        var hostId = parseInt(currentBooking.hostId); //the room host's id
        var bookingStatus = parseInt(currentBooking.bookingStatus);
        var email = currentBooking.email;
        var startTime = currentBooking.startTime;
        var endTime = currentBooking.endTime;
        var title = currentBooking.title;
        var phone = currentBooking.phone;
        var duration = currentBooking.duration;
        var price = currentBooking.price;
        var contact = currentBooking.contact;
        var readByHost = currentBooking.readByHost;
        //Replace all , by ; The url does not take commas.
        var guestBiography = currentBooking.guestBiography.replace(/,/g, ";");
        var billingAddress = currentBooking.billingAddress.replace(/,/g, ";");
        if (currentBooking.content !== "" && angular.isDefined(currentBooking.content)) {
            var content = currentBooking.content.replace(/,/g, ";"); //Comments
        }
//        else {
    //            var content = "Ingen kommentar";
    //        }

        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=posts.create_post&nonce=' + data.data.nonce + '&title=' + title + '&content=' + content + '&status=publish&type=booking&custom_fields={"wpcf-host-id": "' + hostId + '","wpcf-room-id": "' + roomId + '","wpcf-room-name": "' + roomName + '","wpcf-booking-status":"' + bookingStatus + '","wpcf-read-by-host":"' + readByHost + '", "wpcf-e-mail":"' + email + '","wpcf-booking-date":"' + date + '","wpcf-booking-starttime":' + startTime + ',"wpcf-booking-endtime":' + endTime + ',"wpcf-phone":' + phone + ',"wpcf-duration":' + duration + ',"wpcf-total-price":' + price + ',"wpcf-guest-biography":"' + guestBiography + '","wpcf-billing-address":"' + billingAddress + '","wpcf-contact-person":"' + contact + '" }'
        });
    };

    this.updateBooking = function (data, booking) {
        booking.date = Date.parse(booking.date) / 1000; //The date as timestamp
        booking.hostId = parseInt(booking.hostId);
        booking.roomId = parseInt(booking.roomId);
        booking.bookingStatus = parseInt(booking.bookingStatus);
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=posts/update_post&post_type=booking&nonce=' + data.data.nonce + '&post_id=' + booking.id + '&title=' + booking.title + '&content=' + booking.content + '&custom[wpcf-host-id]=' + booking.hostId + '&custom[wpcf-room-name]=' + booking.roomName + '&custom[wpcf-room-id]=' + booking.roomId + '&custom[wpcf-booking-status]=' + booking.bookingStatus + '&custom[wpcf-e-mail]=' + booking.email + '&custom[wpcf-booking-date]=' + booking.date + '&custom[wpcf-phone]=' + booking.phone + '&custom[wpcf-booking-starttime]=' + booking.startTime + '&custom[wpcf-booking-endtime]=' + booking.endTime + '&custom[wpcf-total-price]=' + booking.price + '&custom[wpcf-duration]=' + booking.duration + '&custom[wpcf-billing-address]=' + booking.billingAddress + '&custom[wpcf-guest-biography]=' + booking.guestBiography + '&custom[wpcf-contact-person]=' + booking.contact + '&custom[wpcf-read-by-host]=' + booking.readByHost
        });
    };

    this.getNonce = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=create_post&callback='
        });
    };

    this.generateUserCookie = function (username, password) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/generate_auth_cookie/?username=' + username + '&password=' + password + '&insecure=cool'
        });

    };

    this.updateUserInfo = function (cookie, userInfo) {
        return $http({
            method: "POST",
            url: urlPathNameAddOn + '/api/user/update_user_meta_vars/?cookie=' + cookie + '&wpcf-phone=' + userInfo.phone + '&wpcf-billing-address=' + userInfo.billingAddress + '&insecure=cool'
        });
    };

    this.getRegisterNonce = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_nonce/?controller=user&method=register'
        });
    };

    this.getUpdatingNonce = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=update_post&callback='
        });
    };

    this.registerUser = function (nonce, user) {
        user.billingAddress = user.billingAddress.replace(/,/g, ";");
        user.biography = user.biography.replace(/,/g, ";");

        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/register/?username=' + user.username + '&nickname=' + user.nickname + '&email=' + user.email + '&nonce=' + nonce + '&first_name=' + user.firstName + '&last_name=' + user.lastName + '&display_name=' + user.username + '&user_pass=' + user.password + '&description=' + user.biography + '&user_url=' + user.website + '&custom[wpcf-phone]=' + user.phone + '&custom[wpcf-billing-address]="' + user.billingAddress + '"&show_admin_bar_front=no' + '&insecure=cool'
        });
    };

    this.getUserInfo = function (userId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/get_userinfo/?user_id=' + userId + '&insecure=cool'
        });
    };
    /*
     *
     * Send mail Example Angular JS
     * By Jenssiii
     */
    this.sendMail = function (recipient, subject, body) {
        return $http({
            method: "POST",
            url: urlPathNameAddOn + '/wp-admin/admin-ajax.php',
            params: {
                action: 'send_message',
                email: recipient,
                subject: subject,
                message: body
            }
        }).success(function (data, status, headers, config) {
            var json = jQuery.parseJSON(data);
            console.log('Success :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        }).error(function (data, status, headers, config) {
            console.log('Error :\n' + data + '\n' + status + '\n' + JSON.stringify(config));
        });
    };

    this.getAllMailTemplates = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=mailtemplate&posts_per_page=-1'
        });
    };

    this.getMailTemplateBySlug = function (slug) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=mailtemplate&slug=' + slug + '&posts_per_page=1'
        });
    };


});