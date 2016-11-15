var roomApp = angular.module('roomApp', ['720kb.datepicker', 'angularGoogleMapsDir', 'meetrdLoaderDir', 'roomSearchFilter']);


roomApp.controller('roomCtrl', function ($scope, roomSvc) {
    //Simplemodal login adds amp; to the url, strip the url of this and reload once.
    var hasReplaced = false;
    if (window.location.href.search("amp;") > -1 && !hasReplaced) {
        window.location.href = window.location.href.replace(/amp;/g, "");
        hasReplaced = true;
    } else {
        //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
        if (window.location.pathname.substr(0, 7) === "/Meetrd") {
            var urlPathNameAddOn = "/Meetrd";
        } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
            var urlPathNameAddOn = "/meetrd";
        } else {
            var urlPathNameAddOn = "";
        }
        $scope.allHosts = [];
        //        $scope.allPosts = [];
        $scope.sortField = 'host.rating';
        $scope.allRoomsLoaded = false;
        $scope.roomsOnMap = [];
        //        $scope.roomsForHostLoaded = false;
        $scope.allRooms = [];
        $scope.allCompanies = [];
        $scope.allCities = [];
        //The room that match the search query
        //        $scope.queriedRooms = [];
        //The rooms that matches the search query and the filter in search result
        //        $scope.filteredRooms = [];
        $scope.bookingFormIsShown = false;
        $scope.isHostPage = false;
        $scope.currentHost = [];
        //Max rating is 5 for a host. Used to loop and display filled or unfilled stars as rating
        $scope.hostRatingRange = [1, 2, 3, 4, 5];
        //The nr of chars to display in mobile view (default value)
        $scope.hostBiographyBreakpoint = 250;
        $scope.showMoreInfo = false;
        $scope.hostInfoHeightIsSet = false;
        $scope.isSearchResult = true;
        $scope.shownRoomsDefault = 11;

        $scope.nrOfRoomsShown = {
            value: 0
        };
        $scope.roomAddressIsOnMap = function (address) {
            var isOnMap = false;
            angular.forEach($scope.roomsOnMap, function (room) {
                if (room.address === address) {
                    isOnMap = true;
                }
            });
            return isOnMap;
        };
        $scope.initPage = function () {


            if (location.search.search('host') > -1) {
                $scope.isHostPage = true;
                $scope.query.host = parseInt(location.search.replace('?host=', ''));
                $scope.currentHost = $scope.getHostFromHostId($scope.query.host);
                roomSvc.getRoomsForHost($scope.query.host).then(function (response) {
                    var index = 0;
                    angular.forEach(response.data.posts, function (room) {
                        $scope.defineRoomAttributes(room, index);
                        index++;
                    });
                    $scope.allRooms = response.data.posts;
                    $scope.query.shownRooms = 1000;
                    $scope.allRoomsLoaded = true;
                    console.log($scope.allRooms);
                });

            }

            //Get all rooms
            if (!$scope.isHostPage) {
                roomSvc.getAllRooms().then(function (response) {
                    var index = 0;
                    angular.forEach(response.data.posts, function (room) {
                        $scope.defineRoomAttributes(room, index);
                        index++;
                        $scope.allRooms.push(room);
                        //Push to roomsOnMap if the room address is unique
                        var isOnMap = $scope.roomAddressIsOnMap(room.address);
                        if (!isOnMap) {
                            $scope.roomsOnMap.push(room);
                        }
                        //Pushes the room in queriedRooms if it matches the query

                        //$scope.roomMatchesSearchQuery(room);
                    });
                    //$scope.query.nrOfHits = $scope.queriedRooms.length;
                    $scope.query.shownRooms = $scope.shownRoomsDefault;
                    // $scope.allRoomsLoaded = true;

                    //On page load, show the first 10 rooms (or all rooms if less than 10)
                    //$scope.pushToFilteredRooms(0, $scope.nrOfRoomsShown.value);
                    $scope.allRoomsLoaded = true;
                });
            }
        }

        $scope.getFormattedDate = function (date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            date = yyyy + '-' + mm + '-' + dd;
            return date;
        };

        $scope.datePickerSettings = {
            "minDate": $scope.getFormattedDate(new Date()),
            "maxDate": null,
            "isShown": false,
            "pattern": 'yyyy-MM-dd'

        };


        //Returns an 5 element array of ints from 1 to integer. Fills the rest with zeros if integer < 5 (max rating)
        $scope.getIntRange = function (integer) {
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
        $scope.calculateHostRating = function (host) {
            var hostRating = 0;
            var voteSum = 0;
            angular.forEach(host.votes, function (vote) {
                voteSum = voteSum + parseInt(vote);
            });
            hostRating = Math.round(voteSum / host.votes.length);
            return hostRating;
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
                    host["rating"] = $scope.calculateHostRating(host);
                }
            });

        };
        $scope.defineHostAttributes();

        $scope.getHostFromHostId = function (hostId) {
            var returnHost = "";
            angular.forEach(allHosts, function (host) {
                if (host.ID === parseInt(hostId)) {
                    returnHost = host;
                }
            });
            return returnHost;
        };

        function containsCompany(companyName) {
            var containsCompany = false;
            angular.forEach($scope.allCompanies, function (company) {
                if (company.name === companyName) {
                    containsCompany = true;
                }
            });
            return containsCompany;
        }

        $scope.defineRoomAttributes = function (room, index) {
            //Create new attributes from custom fields to facilitate handling

            if ('wpcf-contact-person' in room['custom_fields']) {
                room['contactPerson'] = room['custom_fields']['wpcf-contact-person'][0];
            }
            if ('wpcf-contact-email' in room['custom_fields']) {
                room['contactEmail'] = room['custom_fields']['wpcf-contact-email'][0];
            }
            if ('wpcf-contact-phone' in room['custom_fields']) {
                room['contactPhone'] = room['custom_fields']['wpcf-contact-phone'][0];
            }
            if ('wpcf-end-time' in room['custom_fields']) {
                room['endTime'] = room['custom_fields']['wpcf-end-time'][0];
            }
            if ('wpcf-host-id' in room['custom_fields']) {
                room['hostId'] = room['custom_fields']['wpcf-host-id'][0];
                room['host'] = $scope.getHostFromHostId(room.hostId);
                room['company'] = room.host.nickname;
            }
            if ('wpcf-nr-of-people' in room['custom_fields']) {
                room['nrOfPeople'] = parseInt(room['custom_fields']['wpcf-nr-of-people'][0]);
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
            room["isOnMap"] = false;
            room["index"] = index;
            //Push unique companies to array
            var companyObject = {
                'name': room.company,
                'city': room.city
            };
            if (!angular.isUndefined(room.company) && !angular.isUndefined(room.city) && !containsCompany(room.company)) {
                $scope.allCompanies.push(companyObject);
            }
            //Push unique cities to array
            if (!angular.isUndefined(room.city) && jQuery.inArray(room.city, $scope.allCities) === -1) {
                $scope.allCities.push(room.city);
            }

        };
        //Sets indices to an array of rooms, used to display queriedrooms (or filtered rooms) as grid
        $scope.setRoomIndices = function (roomArray) {
            var index = 1;
            angular.forEach(roomArray, function (room) {
                room["index"] = index;
                index++;
            });
        }

        //Sorting functions
        function numOrdA(a, b) {
            return (a - b);
        };

        function numOrdD(a, b) {
            return (b - a);
        };


        $scope.setCompanyCity = function () {
            angular.forEach($scope.allCompanies, function (company) {
                if ($scope.query.companyName === company.name) {
                    $scope.query.city = company.city;
                }
            });
        };
        $scope.resetSearchQuery = function () {
            $scope.query = {
                nrOfPeople: '',
                nrOfHits: 0,
                companyName: null,
                city: null,
                host: 0,
                shownRooms: $scope.shownRoomsDefault,
                moreRoomsIncrease: $scope.shownRoomsDefault,
                clickedMoreRoomsButton: false,
                sortFields: [
                    {
                        name: 'Minst först',
                        value: 'nrOfPeople'
                    },
                    {
                        name: 'Störst först',
                        value: '-nrOfPeople'
                    },
                    {
                        name: 'Billigast först',
                        value: 'price'
                    },
                    {
                        name: 'Dyrast först',
                        value: '-price'
                    }
                ]
            };

        };

        $scope.showMoreRooms = function () {
            $scope.query.clickedMoreRoomsButton = true;
            if ($scope.query.nrOfHits > $scope.query.shownRooms) {
                var roomsNotShown = $scope.query.nrOfHits - $scope.query.shownRooms;
                if (roomsNotShown > $scope.query.moreRoomsIncrease) {
                    $scope.query.shownRooms += $scope.query.moreRoomsIncrease;
                } else {
                    $scope.query.shownRooms += roomsNotShown;
                }
            }
            console.log($scope.query);
        };

        $scope.queriesAreIdentic = function (newQuery, oldQuery) {
            return oldQuery.nrOfPeople === newQuery.nrOfPeople && oldQuery.companyName === newQuery.companyName && oldQuery.city === newQuery.city;
        };

        $scope.$watch('query', function (newQuery, oldQuery) {
            //If the city is changed from one to another - reset company drop
            if (oldQuery.city !== null && oldQuery.city !== newQuery.city && oldQuery.companyName === newQuery.companyName) {
                $scope.query.companyName = null;
            }
//            //Nånting som inte riktigt
  //            if($scope.query.nrOfHits < $scope.shownRoomsDefault){
  //                $scope.
  //            }
            if ($scope.query.shownRooms < $scope.shownRoomsDefault && $scope.query.nrOfHits > $scope.shownRoomsDefault) {
                console.log("reset to 9");
                $scope.query.shownRooms = $scope.shownRoomsDefault;

            }
        }, true);
        $scope.resetSearchQuery();

        $scope.initPage();

    };

});