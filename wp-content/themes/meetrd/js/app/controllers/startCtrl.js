angular.module('startApp', []).controller('startCtrl', function ($scope, startSvc) {

    $scope.allHosts = [];
    $scope.htmltest = '<div class="hello">tja</div>';

    jQuery('.wp-posts-carousel-desc').append($scope.htmltest);



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

    if (jQuery('.parallax').length > 0) {
        jQuery('.parallax').parallax();
        //This is the startpage - get all rooms for carousel
        startSvc.getAllRooms().then(function (response) {
            $scope.allRooms = response.data.posts;
            angular.forEach($scope.allRooms, function (room) {
                if ('wpcf-nr-of-people' in room.custom_fields) {
                    room['nrOfPeople'] = parseInt(room.custom_fields['wpcf-nr-of-people'][0]);
                }
                if ('wpcf-host-id' in room.custom_fields) {
                    room['hostId'] = parseInt(room.custom_fields['wpcf-host-id'][0]);
                }
                if ('wpcf-price' in room.custom_fields) {
                    room['price'] = parseInt(room.custom_fields['wpcf-price'][0]);
                }
                if ('wpcf-city' in room.custom_fields) {
                    room['city'] = room.custom_fields['wpcf-city'][0];
                }
                if ('wpcf-area' in room.custom_fields) {
                    room['area'] = room.custom_fields['wpcf-area'][0];
                }
                if ('wpcf-street-address' in room.custom_fields) {
                    room['address'] = room.custom_fields['wpcf-street-address'][0];
                }
            });
            console.log($scope.allRooms);
        });
    }
    $scope.getCarouselPostTitle = function () {
        jQuery('#popular-hosts-container .wp-posts-carousel-title')[0].innerText;
    };

    $scope.mapHostsToHostPosts = function () {
        var hostPostElements = jQuery('#popular-hosts-container .wp-posts-carousel-title');
        angular.forEach(hostPostElements, function (element) {
            var hostName = element.innerText.toLowerCase();
            console.log(element.innerText);

        });
    };
    $scope.getHostPostContent = function (hostName) {
        var returnContent = '';
        angular.forEach($scope.allHosts, function (host) {
            if (host.data.user_nicename === hostName) {
                returnContent = '<div class="address">'.concat(host.address);
            }
        });

        return returnContent;
    };
    $scope.mapHostsToHostPosts();

});