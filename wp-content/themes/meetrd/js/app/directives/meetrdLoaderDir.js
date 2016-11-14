angular.module('meetrdLoaderDir', []).directive('meetrdLoader', function () {
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }
    return {
        restrict: 'E',
        template: '<div class="meetrd-loader-container"><img class="spin" src="' + urlPathNameAddOn + '/wp-content/themes/meetrd/layouts/Images/meetrd.se-ikon-logo_pink.png"/></div>',
        replace: true,
        scope: {

        }
    };
});