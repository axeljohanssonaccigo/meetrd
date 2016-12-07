hostApp.service('hostSvc', function ($http) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

    function getCheckboxValue(day) {
        if (day.isChecked === false || day.isChecked === 'false') {
            return 0;
        } else {
            return day.value;
        }
    }


    this.getBookingsForUser = function (userId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&meta_key=wpcf-host-id&meta_value=' + userId + '&posts_per_page=-1'
        });
    };

    this.getCreationNonce = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=create_post&callback='
        });
    };

    this.getUpdatingNonce = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=core.get_nonce&controller=posts&method=update_post&callback='
        });
    };


    this.getRoomsForUser = function (userId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=room&meta_key=wpcf-host-id&meta_value=' + userId + '&posts_per_page=-1'
        });
    };

    this.updateBooking = function (data, booking) {
        booking.bookingDate = Date.parse(booking.bookingDate) / 1000; //The date as timestamp
        booking.hostId = parseInt(booking.hostId);
        booking.roomId = parseInt(booking.roomId);
        booking.bookingStatus = parseInt(booking.bookingStatus);
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/?json=posts/update_post&post_type=booking&nonce=' + data.data.nonce + '&post_id=' + booking.id + '&title=' + booking.title + '&content=' + booking.content + '&custom[wpcf-host-id]=' + booking.hostId + '&custom[wpcf-room-name]=' + booking.roomName + '&custom[wpcf-room-id]=' + booking.roomId + '&custom[wpcf-booking-status]=' + booking.bookingStatus + '&custom[wpcf-e-mail]=' + booking.email + '&custom[wpcf-booking-date]=' + booking.bookingDate + '&custom[wpcf-phone]=' + booking.phone + '&custom[wpcf-booking-starttime]=' + booking.startTime + '&custom[wpcf-booking-endtime]=' + booking.endTime + '&custom[wpcf-total-price]=' + booking.price + '&custom[wpcf-duration]=' + booking.duration + '&custom[wpcf-host-comment]=' + booking.hostComment
        });
    };

    this.updateRoom = function (data, room) {
        return $http({
            method: "GET",
            params: {
                post_type: 'room',
                nonce: data.data.nonce,
                post_id: room.id,
                title: room.title,
                content: room.content,
                'custom[wpcf-contact-person]': room.contactPerson,
                'custom[wpcf-contact-email]': room.contactEmail,
                'custom[wpcf-contact-phone]': room.contactPhone,
                'custom[wpcf-nr-of-people]': room.nrOfPeople,
                'custom[wpcf-start-time]': room.startTime,
                'custom[wpcf-end-time]': room.endTime,
                'custom[wpcf-street-address]': room.street,
                'custom[wpcf-city]': room.city,
                'custom[wpcf-area]': room.area,
                'custom[wpcf-price]': room.price,
                'custom[wpcf-cancel-deadline]': room.cancelDeadline,
                // days
                'custom[wpcf-days][wpcf-fields-checkboxes-option-7a641ce9576c8e26d7faa64c75e9148f-1]': getCheckboxValue(room.weekdays.days[0]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-55199bbd95148fe5905ba5d3bcccb9ed-1]': getCheckboxValue(room.weekdays.days[1]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-5edb138b8c58f9b55ad25fd6cd890a23-1]': getCheckboxValue(room.weekdays.days[2]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-68f7c374a56aefa5cb16b22b9f055dd1-1]': getCheckboxValue(room.weekdays.days[3]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-307d9b3003cb28a30b486100d3a850bd-1]': getCheckboxValue(room.weekdays.days[4]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-2e1cd86eb650ca8c8a124bdcbf5ffee8-1]': getCheckboxValue(room.weekdays.days[5]),
                'custom[wpcf-days][wpcf-fields-checkboxes-option-a383b71a669dd5f90d2c5029960e43d5-1]': getCheckboxValue(room.weekdays.days[6]),
                // equipment
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-b70423798c40a034939060589efbb4db-1]': getCheckboxValue(room.equipment.equipment[0]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-c53be4fe9da94eec640462260ba3f570-1]': getCheckboxValue(room.equipment.equipment[1]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-4fe27d50aef918e5b71128e3f74f6584-1]': getCheckboxValue(room.equipment.equipment[2]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-6bdd3a942f9be97948629b92251d1452-1]': getCheckboxValue(room.equipment.equipment[3]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-b179039f8ec4dee20fe239143df9054b-1]': getCheckboxValue(room.equipment.equipment[4]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-7fbe6b7e07489f1281950423c5b11d2d-1]': getCheckboxValue(room.equipment.equipment[5]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-c618ed9e96380488a84f48d457a47864-1]': getCheckboxValue(room.equipment.equipment[6]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-fe052b24e7116a5f804d2420f5df4481-1]': getCheckboxValue(room.equipment.equipment[7]),
                'custom[wpcf-equipment][wpcf-fields-checkboxes-option-6733f0f8507a96ff1ca4633d0b403b23-1]': getCheckboxValue(room.equipment.equipment[8]),
                // food
                'custom[wpcf-food][wpcf-fields-checkboxes-option-cfc803b5c56b37f521632964b45395fa-1]': getCheckboxValue(room.food.food[0]),
                'custom[wpcf-food][wpcf-fields-checkboxes-option-9e29045117744a824b1e8173c1b2c5bf-1]': getCheckboxValue(room.food.food[1]),
                'custom[wpcf-food][wpcf-fields-checkboxes-option-bf67734926bfe2f467dbc51e56666587-1]': getCheckboxValue(room.food.food[2]),
                'custom[wpcf-food][wpcf-fields-checkboxes-option-9dabd7e86df6ff87ffad1519059fb414-1]': getCheckboxValue(room.food.food[3]),
                'custom[wpcf-food][wpcf-fields-checkboxes-option-d9a2b43022a7a5364521102517c84fbb-1]': getCheckboxValue(room.food.food[4]),
                'custom[wpcf-food][wpcf-fields-checkboxes-option-c0d291b2658b1bdb4ac6d5ae60120872-1]': getCheckboxValue(room.food.food[5])
            },
            url: urlPathNameAddOn + '/?json=posts/update_post'
        });
    };

    this.createRoom = function (data, room) {
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
            url: urlPathNameAddOn + '/?json=posts.create_post&nonce=' + data.data.nonce + '&title=' + title + '&content=' + content + '&status=publish&type=room&custom_fields={"wpcf-contact-person": "' + contactPerson + '","wpcf-webpage":"' + webPage + '","wpcf-host-id":"' + hostId + '", "wpcf-startdate":"' + startDate + '", "wpcf-enddate":"' + endDate + '","wpcf-nr-of-people":' + nrOfPeople + ', "wpcf-starttime":' + startTime + ',"wpcf-endtime":' + endTime + ', "wpcf-area":' + area + ', "wpcf-price":' + price + ' }'
        });
    };

    this.generateUserCookie = function (username, password) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/generate_auth_cookie/?username=' + username + '&password=' + password + '&insecure=cool'
        });

    };

    this.updateUserInfo = function (cookie, userInfo) {
        //Replace all , by ; The url does not take commas.
        userInfo.biography = userInfo.biography.replace(/,/g, ";");
        return $http({
            method: "POST",
            url: urlPathNameAddOn + '/api/user/update_user_meta_vars/?cookie=' + cookie + '&description="' + userInfo.biography + '"&first_name=' + userInfo.firstname + '&last_name=' + userInfo.lastname + '&nickname=' + userInfo.nickname + '&wpcf-slogan=' + userInfo.slogan + '&wpcf-phone=' + userInfo.phone + '&wpcf-priomail=' + userInfo.email + '&wpcf-cancel-deadline=' + userInfo.cancelDeadline + '&insecure=cool'
        });
    };

    this.getUserInfo = function (userId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/get_userinfo/?user_id=' + userId + '&insecure=cool'
        });
    };

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