angular.module('startApp').service('startSvc', function ($http) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }



    this.getAllRooms = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=room&posts_per_page=-1'
        });
    };

    this.getAllRoomCarouselPosts = function () {
        return $http({
            method: "GET",
            url: urlPathNameAddOn + '/api/get_posts/?post_type=popular-hosts&posts_per_page=-1'
        });
    };




});