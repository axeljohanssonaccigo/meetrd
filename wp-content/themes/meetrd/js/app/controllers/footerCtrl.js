'use strict';
var footerApp = angular.module('footerApp', ['meetrdLoaderDir']);




footerApp.controller('footerCtrl', function ($scope) {
    $scope.isAtBottom = true;
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() + jQuery(window).height() === jQuery(document).height()) {
            $scope.isAtBottom = true;
        } else {
            $scope.isAtBottom = false;
        }
    });

});