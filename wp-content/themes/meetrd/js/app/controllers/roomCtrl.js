var roomApp = angular.module('roomApp', ['720kb.datepicker']);


roomApp.controller('roomCtrl', function($scope, roomSvc) {
    //Simplemodal login adds amp; to the url, strip the url of this and reload once.
    var hasReplaced = false;
    if (window.location.href.search("amp;") > -1 && !hasReplaced) {
        window.location.href = window.location.href.replace(/amp;/g,"");
        hasReplaced = true;
    } else {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0,7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    }  else if(window.location.pathname.substr(0,7) === "/meetrd" ){
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }
    $scope.allHosts = [];
    $scope.allPosts = [];
    $scope.allRoomsLoaded = false;
    $scope.roomsForHostLoaded = false;
    $scope.allRooms = [];
    $scope.allBlogPosts = [];
    //The room that match the search query
    $scope.queriedRooms = [];
    //The rooms that matches the search query and the filter in search result
    $scope.filteredRooms = [];
    //The rooms that does not match the search query
    $scope.otherRooms = [];
    $scope.otherRoomsAreShown = false;
    $scope.bookingFormIsShown = false;
    $scope.isHostPage = false;
    $scope.currentHost = [];
    //Max rating is 5 for a host. Used to loop and display filled or unfilled stars as rating
    $scope.hostRatingRange = [1,2,3,4,5];
    //The nr of chars to display in mobile view (default value)
    $scope.hostBiographyBreakpoint = 250;
    $scope.showMoreInfo = false;
    $scope.hostInfoHeightIsSet = false;
    $scope.mapIsInitilized = false;
    $scope.isSearchResult = false;




    //Array to hold all the markers on the map
    $scope.locations = [];
    $scope.query = {
        "date": null,
        "start": 0,
        "end": 0,
        "nrOfPeople": null,
        "nrOfHits": 0,
        "host": null
    };
    $scope.nrOfRoomsShown = {value: 0};

    //On scroll
    jQuery(window).scroll(function(){
        if ($scope.isSearchResult) {
            if ($scope.isHostPage) {
                if (!$scope.hostInfoHeightIsSet) {
                    $scope.hostInfoContainer = document.getElementById('host-info-container');
                    $scope.hostInfoHeight = $scope.hostInfoContainer.clientHeight;
                    $scope.hostInfoHeightIsSet = true;
                };
            //Dynamic distance to top depending on the host info container height
            var mapToTopDistance = $scope.hostInfoHeight + 96; //Adding the space between map and host info container
        } else {
            //Fixed distance to top on a regular search result.
            var mapToTopDistance = 186;
        }
        var toTop = jQuery(document).scrollTop();

        if (toTop >= mapToTopDistance ) {
            jQuery("#map-container").addClass('sticky-map');

        } else {
            jQuery("#map-container").removeClass('sticky-map');
        }

        //Compress map height if it does not fit in the window
        $scope.reduceMapHeight();
    };
});
jQuery('.parallax').parallax();
    //Triggered on window resize
    jQuery(window).resize(function () {
        if ($scope.isSearchResult) {
         $scope.reduceMapHeight();
     };
 });

    $scope.reduceMapHeight = function(){
        if ($scope.mapIsInitilized) {
            //Get the initial width of the map (100% of the container)
            $scope.mapCanvasWidth = document.getElementById('map-canvas').clientWidth;
            //Apply this 100% width as the max-width
            jQuery("#map-container").css("cssText", "max-width: " + $scope.mapCanvasWidth + "px !important;");
            jQuery("#map-canvas").css("cssText", "max-width: " + $scope.mapCanvasWidth + "px !important;");
        };
        $scope.windowHeight = jQuery(window).height();
        //Initial map Canvas width
        //var mapCanvas = document.getElementById('map-canvas');
        //Apply the initial width (100%) as the max width for the canvas.
        //var mapCanvasWidth = mapCanvas.clientWidth;
        var defaultMapHeight = 505;
        var menuHeight = 61;
        var footerHeight = 100;
        var marginBottom = 20;
        var reducedMapHeight = $scope.windowHeight - (menuHeight + footerHeight + marginBottom);
        var toBottom =  jQuery(document).height() - jQuery(window).height() - jQuery(window).scrollTop();
        //If the map cant fit the window, and the scroll is closer than footerHeight + marginBottom to the bottom: reduce the height.
        if (reducedMapHeight < defaultMapHeight && toBottom < (footerHeight + marginBottom)) {
            jQuery(".compressed-map").css("cssText", "max-height: " + reducedMapHeight + "px !important;");
            jQuery("#map-canvas").addClass('compressed-map');
        } else {
            jQuery("#map-canvas").removeClass('compressed-map');
        }
    };
    $scope.getFormattedDate = function(date){
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!
        var yyyy = date.getFullYear();
        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }
        date = yyyy+'-'+mm+'-'+dd;
        return date;
    };

    $scope.datePickerSettings = {
        "minDate": $scope.getFormattedDate(new Date()),
        "maxDate": null,
        "isShown": false,
        "pattern": 'yyyy-MM-dd'

    };


    //Returns an 5 element array of ints from 1 to integer. Fills the rest with zeros if integer < 5 (max rating)
    $scope.getIntRange = function(integer){
        var returnRange = [];
        for (var i = 1; i <= 5; i++) {
            if (i <= integer) {
                returnRange.push(i);
            } else {
                returnRange.push(null);
            }

        };
        return returnRange;
    };
    //Return the host rating, rounded to integer.
    $scope.calculateHostRating = function(host){
        var hostRating = 0;
        var voteSum = 0;
        angular.forEach(host.votes, function(vote){
            voteSum = voteSum + parseInt(vote);
        });
        hostRating = Math.round(voteSum / host.votes.length);
        return hostRating;
    };

    $scope.defineHostAttributes = function(){
        $scope.allHosts = allHosts;
        angular.forEach($scope.allHosts,function(host){
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
                host["rating"] = $scope.calculateHostRating(host);
            }
        });

};
$scope.defineHostAttributes();

$scope.getHostFromHostId = function(hostId){
    var returnHost = "";
    angular.forEach(allHosts, function(host){
        if (host.ID === parseInt(hostId)) {
            returnHost = host;
        }
    });
    return returnHost;
};

    //Get the params from the search query on start page
    if (window.location.pathname === urlPathNameAddOn + "/search/") {
        $scope.isSearchResult = true;
        jQuery.extend({
          getQueryParameters : function(str) {
              return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
          }
      });
        $scope.query = jQuery.getQueryParameters();
        if ($scope.query.date === "null") {
            $scope.query.date = "";
            //$scope.query.date = $scope.getFormattedDate($scope.query.date);
        }
        if ($scope.query.nrOfPeople === "null") {
            $scope.query.nrOfPeople = "";
        } else {
            $scope.query.nrOfPeople = parseInt($scope.query.nrOfPeople);

        }
        if ('host' in $scope.query) {
            $scope.isHostPage = true;
            $scope.currentHost = $scope.getHostFromHostId($scope.query.host);
            roomSvc.getRoomsForHost($scope.query.host).then(function(response){
                var index = 0;
                angular.forEach(response.data.posts, function(room){
                    $scope.defineRoomAttributes(room, index);
                    index++;
                    $scope.queriedRooms.push(room);
                    //$scope.getCoordinatesForRoom(room);
                });
                if ($scope.queriedRooms.length < 40) {
                    $scope.nrOfRoomsShown.value = $scope.queriedRooms.length;
                }
                else{
                   $scope.nrOfRoomsShown.value = 40;
               }
                //On page load, show the first 10 rooms (or all rooms if less than 10


                    $scope.pushToFilteredRooms(0,$scope.nrOfRoomsShown.value);

                    $scope.roomsForHostLoaded = true;

                    $scope.query.nrOfHits = $scope.queriedRooms.length;
                });


        }
        //Else = page is start page
    } else {
        //Get the blog posts
        roomSvc.getAllPosts().then(function(response){
            angular.forEach(response.data.posts, function(post){
                //strip the blog content from html
                post.content = post.content.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');

            });
            $scope.allBlogPosts = response.data.posts;
        });
    }
//Pushes rooms from queriedRooms to filteredRooms, start and end index in queried rooms
$scope.pushToFilteredRooms = function(startIndex, endIndex){
    if ($scope.isSearchResult) {
        //Push rooms to filtered rooms
        for (var i = startIndex; i < endIndex; i++) {
         $scope.filteredRooms.push($scope.queriedRooms[i]);
         $scope.getCoordinatesForRoom($scope.queriedRooms[i]);
     };

     setTimeout(function(){
        $scope.$apply($scope.initMap());
    }, 1000);
 };
};

$scope.showMoreRooms = function(){
    var addToShowMoreRooms = 10;
    var shownRooms = $scope.nrOfRoomsShown.value;
    if ($scope.queriedRooms.length < $scope.nrOfRoomsShown.value + addToShowMoreRooms) {
        $scope.nrOfRoomsShown.value = $scope.queriedRooms.length;
    }
    else{
       $scope.nrOfRoomsShown.value = $scope.nrOfRoomsShown.value + addToShowMoreRooms;
   }
     //Push rooms to filtered rooms
     $scope.pushToFilteredRooms(shownRooms, $scope.nrOfRoomsShown.value);

 };
//Get all rooms if it a regular search and not a host page
if (!$scope.isHostPage) {
    roomSvc.getAllRooms().then(function(response){
        var index = 0;
        angular.forEach(response.data.posts, function(room){
            $scope.defineRoomAttributes(room, index);
            index++;
            $scope.allRooms.push(room);
            //Pushes the room in queriedRooms if it matches the query
            $scope.roomMatchesSearchQuery(room);
        });
        $scope.query.nrOfHits = $scope.queriedRooms.length;
           // $scope.allRoomsLoaded = true;
           if ($scope.queriedRooms.length < 40) {
            $scope.nrOfRoomsShown.value = $scope.queriedRooms.length;
        }
        else{
           $scope.nrOfRoomsShown.value = 40;
       }
        //On page load, show the first 10 rooms (or all rooms if less than 10)
        $scope.pushToFilteredRooms(0,$scope.nrOfRoomsShown.value);
        $scope.allRoomsLoaded = true;


    });
    console.log($scope.allRooms);
};


$scope.defineRoomAttributes = function(room, index){
    //Create new attributes from custom fields to facilitate handling

    if ('wpcf-contact-person' in room['custom_fields']) {
        room['contactPerson'] = room['custom_fields']['wpcf-contact-person'][0];
    }
    if ('wpcf-contact-email' in room['custom_fields']){
        room['contactEmail'] = room['custom_fields']['wpcf-contact-email'][0];
    }
    if ('wpcf-contact-phone' in room['custom_fields']){
        room['contactPhone'] = room['custom_fields']['wpcf-contact-phone'][0];
    }
    if ('wpcf-end-time' in room['custom_fields']) {
        room['endTime'] = room['custom_fields']['wpcf-end-time'][0];
    }
    if ('wpcf-host-id' in room['custom_fields']) {
        room['hostId'] = room['custom_fields']['wpcf-host-id'][0];
        room['host'] = $scope.getHostFromHostId(room.hostId);
    }
    if ('wpcf-nr-of-people' in room['custom_fields']) {
        room['nrOfPeople'] = room['custom_fields']['wpcf-nr-of-people'][0];
    }
    if ('wpcf-price' in room['custom_fields']) {
        room['price'] = parseInt(room['custom_fields']['wpcf-price'][0]);
    }
        if ('wpcf-area' in room['custom_fields']) {
        room['area'] = room['custom_fields']['wpcf-area'][0];
    }
    if ('wpcf-start-time' in room['custom_fields']) {
        room['startTime'] = room['custom_fields']['wpcf-start-time'][0];
    }
    if ('wpcf-webpage' in room['custom_fields']) {
        room['webPage'] = room['custom_fields']['wpcf-webpage'][0];
    }
    if ('wpcf-photo' in room['custom_fields']) {
        room['photo'] = room['custom_fields']['wpcf-photo'][0];
    }
    if ('wpcf-city' in room['custom_fields']) {
        room['city'] = room['custom_fields']['wpcf-city'][0];
    }
    if ('wpcf-street-address' in room['custom_fields']) {
        room['address'] = room['custom_fields']['wpcf-street-address'][0] + ", " + room.city;
    }

    console.log(room.city);
    room["isOnMap"] = false;
    room["index"] = index;
};
//Sets indices to an array of rooms, used to display queriedrooms (or filtered rooms) as grid
$scope.setRoomIndices = function(roomArray){
    var index = 1;
    angular.forEach(roomArray, function(room){
        room["index"] = index;
        index++;
    });
}

//Sorting functions
function numOrdA(a, b){ return (a-b); };
function numOrdD(a, b){ return (b-a); };

    //Initiate the maps
    $scope.initMap = function(){
        var meetrdHeadQuarters = {
            "latitude": 59.3320652,
            "longitude": 18.05767990000004
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 13,
            center: new google.maps.LatLng(meetrdHeadQuarters.latitude, meetrdHeadQuarters.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < $scope.locations.length; i++) {
            var imageMarker = {
                url: $scope.locations[i][5],
                size: new google.maps.Size(100,50),
                scaledSize: new google.maps.Size(60,30)

            }
            marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.locations[i][1], $scope.locations[i][2]),
                map: map,

                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent('<a target="_self" class="map-room-link" href="' + $scope.locations[i][4] + '">' + $scope.locations[i][5] + '</a>');//<br>' + $scope.locations[i][0] + '<br>' + $scope.locations[i][3]);

            infowindow.open(map, marker);
        }
    })(marker, i));
        }
        //Get the initial width of the map (100% of the container)
        $scope.mapCanvasWidth = document.getElementById('map-canvas').clientWidth;
        //Apply this 100% width as the max-width

        jQuery("#map-container").css("cssText", "max-width: " + $scope.mapCanvasWidth + "px !important;");
        jQuery("#map-canvas").css("cssText", "max-width: " + $scope.mapCanvasWidth + "px !important;");
        $scope.mapIsInitilized = true;

    };

    //Gets the coordinates for a given address. Then initiates the map after the coordiantes hav been fetched.
    $scope.getCoordinatesForRoom = function(room){
        var date = moment($scope.query.date).format('YYYY-MM-DD');
        var coordinates = {
            "address": room.address,
            "hostName": room.host.nickname,
            "title": room.title,
            //Url links to the host page
            "url": window.location.origin + urlPathNameAddOn + '/search/?host=' + room.hostId
            // "icon": $scope.getHostFromHostId(room.hostId).logotype

        };
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': coordinates.address}, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                coordinates['latitude'] = results[0].geometry.location.lat();
                coordinates['longitude'] = results[0].geometry.location.lng();
                //var x = $scope.locations.length + 1;
                $scope.locations.push([coordinates.title, coordinates.latitude, coordinates.longitude, coordinates.address, coordinates.url, coordinates.hostName]);
            }
        });
        room.isOnMap = true;
    };


    $scope.search = function(query){
        if (query.date === null || query.date === "") {
            var dateQuery = null;
        } else {
            var dateQuery = moment(query.date).format('YYYY-MM-DD');
        }

        var url = window.location.origin + urlPathNameAddOn + '/search/?date=' + dateQuery + '&nrOfPeople=' + query.nrOfPeople;
        window.location.href = url;
    };
    $scope.goToHostPage = function(hostId){
        window.location.href = window.location.origin + urlPathNameAddOn + '/search/?host=' + hostId;
    };
    $scope.goToBlogPost = function(blogPostUrl){
        window.location.href = blogPostUrl;
    };

    $scope.roomMatchesSearchQuery = function(room){
        if ($scope.query.nrOfPeople === "") {
            var nrOfPeople = 0;
        } else {
            var nrOfPeople = $scope.query.nrOfPeople;
        }
        //Check if the room can fit in the nr of people requested in the query and if it is not already on the map
        if (parseInt(room.nrOfPeople) >= parseInt(nrOfPeople) && !room.isOnMap) {
            $scope.queriedRooms.push(room);
            $scope.setRoomIndices($scope.queriedRooms);



        };
    };
    $scope.goToRoom = function(roomUrl, queryDate){
        if (queryDate === "") {
            var date = $scope.getFormattedDate(new Date());
        } else{
            var date = moment(queryDate).format('YYYY-MM-DD');
        }
        var url = roomUrl + '/?date=' + date;
        var win = window.open(url, '_self');
        win.focus();
    };


    $scope.dateIsFullyBooked = function(room, bookingsForRoom){
        var date = $scope.query.date;
        var roomStartTime = room.startTime;
        var roomEndTime = room.endTime;

    //The total hours that the room can be booked
    var hoursOfDayAndRoom = parseInt(room.endTime) - parseInt(room.startTime) + 1;
    //The total duration of all bookings for this room and date
    var bookingsTotalDuration = 0;
    angular.forEach(bookingsForRoom, function(booking){
        //If the date is right, and the booking is confirmed. Add the duration to the total duration
        if (moment.unix(booking["custom_fields"]["wpcf-booking-date"]).format("YYYY-MM-DD") === $scope.query.date && booking.bookingStatus === 2) {
            bookingsTotalDuration = bookingsTotalDuration + parseInt(booking.duration);
        }
    });
    if (bookingsTotalDuration === hoursOfDayAndRoom) {
        return true;
    } else {
        return false;
    }


    // var bookingsForRoomAndDate = [];
    // //Get the bookings for the specific date
    // angular.forEach(bookingsForRoom, function(booking){
    //     if (booking.date === date) {
    //         bookingsForRoomAndDate.push(booking);
    //     }

    // });
    // var maxHoursToBook = $scope.calculateMaxHoursToBook(bookingsForRoomAndDate);
    // if (maxHoursToBook === 0) {
    //     return true;
    // } else {
    //     return false;
    // }
};

//Calcultaes the max hours to book for a given date
$scope.calculateMaxHoursToBook = function(bookingsForRoomAndDate){
    var localMax = 0;
    var localMaxes = [];
    var maxHoursToBook = 0;
    angular.forEach(bookingsForRoomAndDate, function(booking){
            //If the booking is confirmed
            if (booking.bookingStatus === 2) {
                localMaxes.push(localMax);
                localMax = 0;
            }
            else {
                localMax++;
            }
        });
    localMaxes.push(localMax);
        //Take the first element in the sorted list of local maxes (descending order)
        maxHoursToBook = localMaxes.sort(numOrdD)[0];
        return maxHoursToBook;
    };

    $scope.showOrHideOtherRooms = function(){
        $scope.otherRoomsAreShown = !$scope.otherRoomsAreShown;
    };

    $scope.goToPage = function(page){
        location.href = location.origin + urlPathNameAddOn + page;
    };


}

});
