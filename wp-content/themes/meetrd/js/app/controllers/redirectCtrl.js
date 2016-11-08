angular.module('redirectApp', []).controller('redirectCtrl', function ($scope) {
    $scope.redirectToHostPage = function () {

        angular.forEach(allhosts, function (host) {
            var hostName = host.data.user_login.toLowercase();
            console.log(hostName);
            var hostNick = host.data.user_nicename.toLowercase();
            console.log(hostNick);
        });
    };
    $scope.redirectToHostPage();

});