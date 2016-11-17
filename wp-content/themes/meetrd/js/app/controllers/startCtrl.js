angular.module('startApp', ['meetrdLoaderDir']).controller('startCtrl', function ($scope, startSvc) {
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }
    $scope.allHosts = [];
    $scope.viewPort = {
        height: 0,
        width: 0
    };

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
    if (location.href.search('vardforetag') > -1) {
        $scope.defineHostAttributes();
    }

    $scope.getAllRooms = function () {
        startSvc.getAllRooms().then(function (response) {
            $scope.allRooms = response.data.posts;
            //Set attributes on rooms
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
                //Map room to carousel rooms
                angular.forEach($scope.carouselRooms, function (carouselRoom) {
                    if (room.id === carouselRoom.roomId) {
                        $scope.mapRoomToCarouselPost(room, carouselRoom);
                    }
                });

            });
            jQuery('#room-carousel-loader img').addClass('hidden');
        });
    };

    $scope.getAllRoomCarouselPosts = function () {
        $scope.appendCarouselWithLoader();
        startSvc.getAllRoomCarouselPosts().then(function (response) {
            $scope.carouselRooms = response.data.posts;
            angular.forEach($scope.carouselRooms, function (room) {
                if ('wpcf-room-id' in room.custom_fields) {
                    room['roomId'] = parseInt(room.custom_fields['wpcf-room-id'][0]);
                }
            });
            //Get all rooms
            $scope.getAllRooms();
        });
    };

    $scope.appendCarouselWithLoader = function () {
        var elementToAppend = jQuery('#popular-hosts-container .wp-posts-carousel-container .wp-posts-carousel-details .wp-posts-carousel-desc');
        var meetrdLoader = '<div class="meetrd-loader-container"><img class="spin" src="' + urlPathNameAddOn + '/wp-content/themes/meetrd/layouts/Images/meetrd.se-ikon-logo_pink.png"/></div>';
        var loaderElement = '<div id="room-carousel-loader">' + meetrdLoader + '</div>';
        elementToAppend.append(loaderElement);
    };

    $scope.mapRoomToCarouselPost = function (room, carouselRoom) {
        var carouselPostElements = jQuery('#popular-hosts-container .wp-posts-carousel-container');
        angular.forEach(carouselPostElements, function (element) {
            var hostName = jQuery(element).find('.wp-posts-carousel-details .wp-posts-carousel-title')[0].innerText;
            if (hostName.toLowerCase() === carouselRoom.title.toLowerCase()) {
                var elementToAppend = jQuery(element).find('.wp-posts-carousel-details .wp-posts-carousel-desc');
                var addressElement = '<div class="address"> ' + room.address + ', ' + room.city + '</div>';
                var hostNameElement = '<div class="host-name">' + hostName + '</div>';
                var roomInfoElement = '<div class="room-info"><span class="nr-of-people"> ' +
                    room.nrOfPeople + ' pers, </span>' + '<span class="price"> ' + room.price + ' kr/h</span></div>';
                var bookButtonElement = '<div class="book-button-container"><button type="button" class="btn btn-sm btn-primary"><a href="' + location.href + 'search/?host=' + room.hostId + '">BOKA</a></button></div>'
                elementToAppend.append(addressElement);
                elementToAppend.append(hostNameElement);
                elementToAppend.append(roomInfoElement);
                elementToAppend.append(bookButtonElement);
                //Set image link
                jQuery(element).find('.wp-posts-carousel-image a')[0].href = location.href + 'search/?host=' + room.hostId;

            }
        });
    };

    //Disable tags on page load - these will then be set to links to the host page
    $scope.disableDefaultCarouselImageLinks = function () {
        var linkTags = jQuery('#popular-hosts-container .wp-posts-carousel-container .wp-posts-carousel-image a');
        angular.forEach(linkTags, function (tag) {
            tag.href = "javascript:;";
        })
    }
    $scope.setViewPort = function () {
        $scope.viewPort.height = jQuery(window).height();
        $scope.viewPort.width = jQuery(window).width();
        if ($scope.viewPort.width < 768) {
            $scope.isMobile = true;
            $scope.imgUrl = location.href + '/wp-content/themes/meetrd/layouts/Images/meetrd-banner-mobile.jpg';
        } else {
            $scope.imgUrl = location.href + '/wp-content/themes/meetrd/layouts/Images/meetrd-banner-desktop.jpg';
            $scope.bannerImg = 'meetrd-banner-desktop.jpg';

            $scope.isMobile = false;
        }

        console.log($scope.isMobile);
    }

    jQuery(document).ready(function () {
        if (jQuery('.parallax').length > 0) {
            jQuery('.parallax').parallax();
            //This is the startpage - get all rooms for carousel
            $scope.disableDefaultCarouselImageLinks();
            $scope.getAllRoomCarouselPosts();
            $scope.setViewPort();
        }
    });
    jQuery(window).resize(function () {
        $scope.setViewPort();
    });

});