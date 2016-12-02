var roomApp = angular.module('roomApp', ['720kb.datepicker', 'angularGoogleMapsDir', 'meetrdLoaderDir', 'roomSearchFilter', 'uniqueFilter']);


roomApp.controller('roomCtrl', function ($scope, roomSvc, $timeout) {
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
        $scope.sortField = '-host.rating';
        $scope.allRoomsLoaded = false;
        $scope.meetrdHeadQuarters = {
            lat: 59.3320652,
            lng: 18.05767990000004
        };
        $scope.mapDefaultCenter = {
            lat: 58.410807,
            lng: 15.621373
        };
        $scope.mapSettings = {
            rooms: [],
            zoom: {
                current: 5,
                default: 5,
                city: 10,
                address: 13,
                markerSwitch: 8
            },
            center: {
                current: $scope.mapDefaultCenter,
                default: $scope.mapDefaultCenter
            },
            enableMarkerClick: true,
            type: google.maps.MapTypeId.ROADMAP,
            enableScroll: false,
            marker: {
                urlBase: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|',
                color: 'e6008a',
                clickedColor: 'f1f1f1',
                fullUrl: '',
                size: new google.maps.Size(21, 34),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 34)
            },
            cityCenters: [],
            loadingControl: {
                hasRooms: false,
                hasCityCenters: false
            }
        };

        $scope.allRooms = [];
        $scope.allCompanies = [];
        $scope.allCities = [];
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
        $scope.cityIsSetFromParam = false;

        function isNullOrUndefined(value) {
            return value === null || angular.isUndefined(value);
        };


        $scope.setCityCenters = function (currentCityIndex) {
            if ($scope.allCities.length > 0) {
                //check if the coordinates have been fetched for the city center
                var isUniqueCity = true;

                angular.forEach($scope.mapSettings.cityCenters, function (cityCenter) {
                    if (cityCenter.name === $scope.allCities[currentCityIndex]) {
                        isUniqueCity = false;
                    }
                });
                //Get the coordinates if unique city center
                if (isUniqueCity) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                        'address': $scope.allCities[currentCityIndex]
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var cityCenter = {
                                name: $scope.allCities[currentCityIndex],
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            };
                            $scope.mapSettings.cityCenters.push(cityCenter);
                            currentCityIndex++;
                            console.log($scope.mapSettings.cityCenters);
                            if (currentCityIndex < $scope.allCities.length) {
                                $scope.setCityCenters(currentCityIndex);
                            } else {
                                $scope.mapSettings.loadingControl.hasCityCenters = true;
                            }
                        }
                    });
                }
            } else {
                $scope.mapSettings.loadingControl.hasCityCenters = true;
            }
        };

        $scope.getCityCenter = function (cityName) {
            var cityCenter = {};
            angular.forEach($scope.mapSettings.cityCenters, function (cityC) {
                if (cityC.name === cityName) {
                    cityCenter = cityC;
                }
            });
            return cityCenter;
        };

        $scope.setRoomsOnMap = function () {
            $scope.mapSettings.loadingControl.hasRooms = false;
            $scope.mapSettings.rooms = [];
            angular.forEach($scope.filteredRooms, function (room) {
                if (!$scope.roomAddressIsOnMap(room.address)) {
                    $scope.mapSettings.rooms.push(room);
                }
            });
            $timeout(function () {
                $scope.mapSettings.loadingControl.hasRooms = true;
            });
        };

        $scope.roomAddressIsOnMap = function (address) {
            var isOnMap = false;
            angular.forEach($scope.mapSettings.rooms, function (room) {
                if (room.address === address) {
                    isOnMap = true;
                }
            });
            return isOnMap;
        };

        $scope.getQueryCoordinates = function () {
            var coordinates = {
                lat: 0,
                lng: 0
            };
            angular.forEach($scope.allCompanies, function (company) {
                if (company.name === $scope.query.companyName && company.city === $scope.query.city) {
                    coordinates.lat = company.coordinates.lat;
                    coordinates.lng = company.coordinates.lng;
                }
            });
            return coordinates;
        };

        $scope.setMapOptions = function () {
            //            if ($scope.query.city !== null) {
            //                var cityCenter = $scope.getCityCenter($scope.query.city);
            //                $scope.mapSettings.center.current.lat = cityCenter.lat;
            //                $scope.mapSettings.center.current.lng = cityCenter.lng;
            //                // set zoom
            //                if ($scope.query.companyName === null) {
            //                    $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.city;
            //                } else if ($scope.query.company !== null) {
            //                    $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.address;
            //                }
            //            }

            if (!isNullOrUndefined($scope.query.city) && !isNullOrUndefined($scope.query.companyName)) {
                // center for address
                var coordinates = $scope.getQueryCoordinates();
                $scope.mapSettings.center.current.lat = coordinates.lat;
                $scope.mapSettings.center.current.lng = coordinates.lng;
                // zoom for address
                $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.address;
            } else if (!isNullOrUndefined($scope.query.city) && isNullOrUndefined($scope.query.companyName)) {
                // center for city
                var cityCenter = $scope.getCityCenter($scope.query.city);
                $scope.mapSettings.center.current.lat = cityCenter.lat;
                $scope.mapSettings.center.current.lng = cityCenter.lng;
                // zoom for city
                $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.city;
            } else if (isNullOrUndefined($scope.query.city) && !isNullOrUndefined($scope.query.companyName)) {
                // center for multiple cities = default center
                $scope.mapSettings.center.current = $scope.mapDefaultCenter;
                //                $scope.mapSettings.center.current.lng = $scope.mapDefaultCenter.lng;
                // zoom for multiple cities = default zoom
                $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.default;
            } else {
                $scope.mapSettings.center.current = $scope.mapDefaultCenter;
                $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.default;
            }
        };

        $scope.resetMapToDefault = function () {
            var centerReset = false;
            var zoomReset = false;
            if (!angular.equals($scope.mapSettings.center.default, $scope.mapSettings.center.current)) {
                $scope.mapSettings.center.current = $scope.mapSettings.center.default;
                centerReset = true;
            }
            if (!angular.equals($scope.mapSettings.zoom.default, $scope.mapSettings.zoom.current)) {
                $scope.mapSettings.zoom.current = $scope.mapSettings.zoom.default;
                zoomReset = true;
            }
            if (centerReset || zoomReset) {
                // rerender map
                $scope.mapSettings.loadingControl.hasRooms = false;
                $timeout(function () {
                    $scope.mapSettings.loadingControl.hasRooms = true;
                }, 500);

            }
        };

        $scope.initPage = function () {
            //Get all rooms for host
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
                        //                        Get coordinates for the room if the address is unique


                        //Push to roomsOnMap if the room address is unique
                        var isOnMap = $scope.roomAddressIsOnMap(room.address);
                        if (!isOnMap) {
                            $scope.mapSettings.rooms.push(room);
                        }
                    });
                    $scope.query.shownRooms = $scope.query.shownRoomsDefault;
                    $scope.allRoomsLoaded = true;
                    $scope.mapSettings.loadingControl.hasRooms = true;
                    $scope.setCityCenters(0);
                    console.log($scope.mapSettings.cityCenters);

                });
            }
        }

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
                } else {
                    host["rating"] = 1;
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

        function containsCompany(companyObject) {
            var containsCompany = false;
            angular.forEach($scope.allCompanies, function (company) {
                if (company.name === companyObject.name && company.city === companyObject.city && companyObject.street === company.street) {
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
                room['street'] = room['custom_fields']['wpcf-street-address'][0];
                room['address'] = room.street + ", " + room.city;
            }
            if ('wpcf-lat' in room['custom_fields']) {
                room['lat'] = parseFloat(room['custom_fields']['wpcf-lat'][0]);
            } else {
                room['lat'] = 0;
            }
            if ('wpcf-long' in room['custom_fields']) {
                room['lng'] = parseFloat(room['custom_fields']['wpcf-long'][0]);
            } else {
                room['lng'] = 0;
            }
            room["index"] = index;

            var companyObject = {
                name: room.company,
                city: room.city,
                street: room.street,
                address: room.street.concat(', ').concat(room.city),
                coordinates: {
                    lat: room.lat,
                    lng: room.lng
                }
            };
            //Push unique companies to array
            if (!angular.isUndefined(room.company) && !angular.isUndefined(room.city) && !containsCompany(companyObject)) {
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
        };

        //Sorting functions
        function numOrdA(a, b) {
            return (a - b);
        };

        function numOrdD(a, b) {
            return (b - a);
        };

        $scope.resetQueryAddress = function () {
            // if the city is changed when an address is selected - then reset rooms on map
            if (!isNullOrUndefined($scope.query.address)) {
                $scope.query.address = null;
            }
        }

        $scope.setCompanyCity = function () {
            $scope.query.address = null;
            var companyCities = $scope.getCitiesForCompany($scope.query.companyName);
            angular.forEach($scope.allCompanies, function (company) {
                if ($scope.query.companyName === company.name) {
                    //If the company is in only one city - set this city
                    if (companyCities.length === 1) {
                        $scope.query.city = company.city;
                    }
                    // If the company exists in the chosen city - do nothing
                    else if (jQuery.inArray($scope.query.city, companyCities) > -1) {
                        //Keep the chosen city
                    }
                    //Else set the city to null
                    else {
                        $scope.query.city = null;
                    }
                }
            });
        };

        $scope.getCitiesForCompany = function (companyName) {
            var companyCitites = [];
            angular.forEach($scope.allCompanies, function (company) {
                if (company.name === companyName) {
                    companyCitites.push(company.city);
                }
            });
            return companyCitites;
        };

        $scope.resetSearchQuery = function () {
            var shownRoomsDefault = 12;
            $scope.query = {
                nrOfPeople: '',
                nrOfHits: 0,
                companyName: null,
                city: null,
                address: null,
                host: 0,
                shownRooms: shownRoomsDefault,
                moreRoomsIncrease: shownRoomsDefault,
                shownRoomsDefault: shownRoomsDefault,
                isSearchResult: false,
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
            $scope.resetMapToDefault();
        };
        $scope.setCityParam = function () {
            if (location.search.search('city') > -1) {
                var city = location.search.replace('?city=', '');
                switch (city) {
                case 'stockholm':
                    $scope.query.city = 'Stockholm';
                    break;
                case 'malmo':
                    $scope.query.city = 'Malmö';
                    break;
                case 'goteborg':
                    $scope.query.city = 'Göteborg';
                    break;
                default:
                    $scope.query.city = null;
                    break;
                }
                $scope.cityIsSetFromParam = true;
            }
        };

        $scope.showMoreRooms = function () {
            if ($scope.query.nrOfHits > $scope.query.shownRooms) {
                var roomsNotShown = $scope.query.nrOfHits - $scope.query.shownRooms;
                if (roomsNotShown > $scope.query.moreRoomsIncrease) {
                    $scope.query.shownRooms += $scope.query.moreRoomsIncrease;
                } else {
                    $scope.query.shownRooms += roomsNotShown;
                }
            }
        };

        $scope.queriesAreIdentic = function (newQuery, oldQuery) {
            return oldQuery.nrOfPeople === newQuery.nrOfPeople && oldQuery.companyName === newQuery.companyName && oldQuery.city === newQuery.city;
        };

        $scope.$watch('query', function (newQuery, oldQuery) {
            //if (!angular.equals(newQuery, oldQuery)) {
            $timeout(function () {
                //If the city is changed from one to another and the company in query has only one city - then reset company drop
                var companyCities = $scope.getCitiesForCompany(newQuery.companyName);
                if (oldQuery.city !== null && oldQuery.city !== newQuery.city && oldQuery.companyName === newQuery.companyName && !(jQuery.inArray(newQuery.city, companyCities) > -1)) {
                    $scope.query.companyName = null;
                }
                if (($scope.query.shownRooms < $scope.query.shownRoomsDefault && $scope.query.nrOfHits > $scope.query.shownRoomsDefault) || $scope.query.shownRooms > $scope.query.nrOfHits) {
                    $scope.query.shownRooms = $scope.query.shownRoomsDefault;
                }
                if (!$scope.queriesAreIdentic(newQuery, oldQuery) || $scope.cityIsSetFromParam) {
                    $scope.setRoomsOnMap();
                    $scope.setMapOptions();
                }
            }, 250);
            //}

            // 
        }, true);
        $scope.resetSearchQuery();
        $scope.initPage();
        $scope.setCityParam();
    };
});