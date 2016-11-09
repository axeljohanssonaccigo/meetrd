angular.module('startApp').service('startSvc', function ($http) {
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
            url: urlPathNameAddOn + '/api/get_posts/?post_type=post&posts_per_page=-1'
        });
    };

    this.getAllRooms = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=room&posts_per_page=-1'
        });
    };

    this.getBookingsForDate = function (date) {

        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&meta_key=wpcf-booking-date&meta_value=' + Date.parse(date) / 1000 + '&posts_per_page=-1'
        });
    };

    this.getBookingsForRoom = function (roomId) {
        return $http({
            async: true,
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=booking&meta_key=wpcf-room-id&meta_value=' + roomId + '&posts_per_page=-1'
        });
    };
    this.getRoomsForHost = function (userId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=room&meta_key=wpcf-host-id&meta_value=' + userId + '&posts_per_page=-1'
        });
    };
    this.getHostInfo = function (hostId) {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/user/get_userinfo/?user_id=' + hostId + '&insecure=cool'
        });
    };


});