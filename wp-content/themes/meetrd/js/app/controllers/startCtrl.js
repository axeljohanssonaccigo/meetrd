angular.module('startApp', []).controller('startCtrl', function ($scope) {

    $scope.allHosts = [];

    $scope.defineHostAttributes = function () {
        $scope.allHosts = allHosts;
        angular.forEach($scope.allHosts, function (host) {
            host["userLogin"] = host.data.user_login;
            host["biography"] = host.description[0];
            //Find the first line break in biography and set the mobile break point to this value. Else, set to 250 chars.
            if (host.biography.search("\n") > -1) {
                $scope.hostBiographyBreakpoint = host.biography.search("\n") - 10;
            }
            host["role"] = host.roles[0];
            host["email"] = host.data.user_email;
            host["nickname"] = host.nickname[0];
            if ('wpcf-phone' in host) {
                host["phone"] = host['wpcf-phone'][0];
            }
            if ('wpcf-logotype' in host) {
                host["logotype"] = host['wpcf-logotype'][0];
            }
            if ('wpcf-show-banner' in host) {
                host["showBanner"] = host['wpcf-show-banner'][0];
                if (host["showBanner"] === '1') {
                    host["showBanner"] = true;
                } else {
                    host["showBanner"] = false;
                }
            }
            if ('wpcf-banner' in host) {
                host["banner"] = host['wpcf-banner'][0];
            }
            if ('wpcf-reviews' in host) {
                host["reviews"] = host['wpcf-reviews'];
            }
            if ('wpcf-slogan' in host) {
                host["slogan"] = host['wpcf-slogan'][0];
            }
            if ('wpcf-votes' in host) {
                host["votes"] = host['wpcf-votes'];
                //host["rating"] = $scope.calculateHostRating(host);
            }
        });

    };
    $scope.defineHostAttributes();
    jQuery('.parallax').parallax();


});