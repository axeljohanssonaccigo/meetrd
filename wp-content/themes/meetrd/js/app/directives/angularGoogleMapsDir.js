angular.module('angularGoogleMapsDir', []).
directive('angularGoogleMaps', ['$timeout', function ($timeout) {
    // directive link function
    var link = function (scope, element, attrs) {
        /**********************/
        /*** VARIABLE SETUP ***/
        /**********************/
        var currentScope = scope;
        var map, infoWindow;
        var markers = [];
        var cityCenters = [];
        var meetrdHeadQuarters = {
            lat: 59.3320652,
            lng: 18.05767990000004
        };
        var defaultCenter = meetrdHeadQuarters;
        var infoWindowOptions = {
            content: ''
        };
        infoWindow = new google.maps.InfoWindow(infoWindowOptions);

        if (angular.isUndefined(scope.mapSettings.rooms)) {
            scope.mapSettings.rooms = [];
        }
        if (angular.isUndefined(scope.mapSettings.type)) {
            scope.mapSettings.type = google.maps.MapTypeId.ROADMAP;
        }
        if (angular.isUndefined(scope.mapSettings.center)) {
            scope.mapSettings.center = {
                current: defaultCenter,
                default: defaultCenter
            };
        }
        if (angular.isUndefined(scope.mapSettings.center.current)) {
            scope.mapSettings.center.current = defaultCenter;
        }
        if (angular.isUndefined(scope.mapSettings.center.default)) {
            scope.mapSettings.center.default = defaultCenter;
        }
        if (angular.isUndefined(scope.mapSettings.zoom)) {
            scope.mapSettings.zoom = {
                current: 5,
                city: 13,
                markerSwicth: 8
            };
        }
        if (angular.isUndefined(scope.mapSettings.zoom.current)) {
            scope.mapSettings.zoom.current = 5;
        }
        if (angular.isUndefined(scope.mapSettings.zoom.default)) {
            scope.mapSettings.zoom.default = 5;
        }
        if (angular.isUndefined(scope.mapSettings.zoom.city)) {
            scope.mapSettings.zoom.city = 10;
        }
        if (angular.isUndefined(scope.mapSettings.zoom.address)) {
            scope.mapSettings.zoom.address = 13;
        }
        if (angular.isUndefined(scope.mapSettings.zoom.markerSwitch)) {
            scope.mapSettings.zoom.markerSwitch = 8;
        }
        if (angular.isUndefined(scope.mapSettings.enableMarkerClick)) {
            scope.mapSettings.enableMarkerClick = false;
        }
        if (angular.isUndefined(scope.mapSettings.marker)) {
            scope.mapSettings.marker = {
                urlBase: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|',
                color: 'ff0000',
                clickedColor: 'ff0000',
                fullUrl: '',
                size: new google.maps.Size(21, 34),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 34)
            };
        }
        if (angular.isUndefined(scope.mapSettings.marker.urlBase)) {
            scope.mapSettings.marker.urlBase = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|';
        }
        if (angular.isUndefined(scope.mapSettings.marker.color)) {
            scope.mapSettings.marker.color = 'ff0000';
        }
        if (angular.isUndefined(scope.mapSettings.marker.clickedColor)) {
            scope.mapSettings.marker.color = 'ff0000';
        }
        if (angular.isUndefined(scope.mapSettings.marker.fullUrl)) {
            scope.mapSettings.marker.fullUrl = '';
        }
        if (angular.isUndefined(scope.mapSettings.marker.size)) {
            scope.mapSettings.marker.size = new google.maps.Size(21, 34);
        }
        if (angular.isUndefined(scope.mapSettings.marker.origin)) {
            scope.mapSettings.marker.origin = new google.maps.Point(0, 0);
        }
        if (angular.isUndefined(scope.mapSettings.marker.anchor)) {
            scope.mapSettings.marker.anchor = new google.maps.Point(10, 34);
        }
        scope.mapSettings.marker.fullUrl = scope.mapSettings.marker.urlBase.concat(scope.mapSettings.marker.color);
        if (angular.isUndefined(scope.mapSettings.cityCenters)) {
            scope.mapSettings.cityCenters = [];
        }
        var pinImage = new google.maps.MarkerImage(scope.mapSettings.marker.urlBase + scope.mapSettings.marker.color,
            scope.mapSettings.marker.size,
            scope.mapSettings.marker.origin,
            scope.mapSettings.anchor);

        var mapOptions = {
            center: null,
            zoom: scope.mapSettings.zoom.current,
            mapTypeId: scope.mapSettings.type,
            scrollwheel: scope.mapSettings.enableScroll
        };



        /***********************/
        /*** INNER FUNCTIONS ***/
        /***********************/

        function setMapZoom(zoom, fromCode) {
            if (angular.isDefined(zoom)) {
                //Clicking zoom in the gui already runs this method
                if (fromCode) {
                    map.setZoom(zoom);
                } else {
                    //Update scope variable
                    $timeout(function () {
                        currentScope.$parent.mapSettings.zoom.current = zoom;
                    });
                }
                mapOptions.zoom = zoom;
            }
        };

        function setMapCenter(center) {
            if (angular.isDefined(center.lat) && angular.isDefined(center.lng)) {
                $timeout(function () {
                    currentScope.$parent.mapSettings.center.current = center;
                });
                mapOptions.center = center;
                map.panTo(center);
            }
        };

        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
                var newCenter = {
                    lat: currentScope.mapSettings.center.current.lat,
                    lng: currentScope.mapSettings.center.current.lng
                };
                setMapCenter(newCenter);
                setMapZoom(currentScope.mapSettings.zoom.current, true);
                map.addListener('zoom_changed', function () {
                    return setMapZoom(map.getZoom(), false);
                });
            }
        };

        function filterRoomsOnMarker(marker) {
            console.log(marker);
            if (marker.map.zoom >= currentScope.mapSettings.zoom.markerSwitch) {
                //Filter on room address
                $timeout(function () {
                    currentScope.$parent.query.address = marker.room.address;
                    var newCenter = {
                        lat: marker.room.lat,
                        lng: marker.room.lng
                    };
                    setMapCenter(newCenter);
                    setMapZoom(currentScope.mapSettings.zoom.address, true);
                });

            } else {
                //Filter rooms on city
                $timeout(function () {
                    currentScope.$parent.query.city = marker.room.city;
                    var cityCenter = currentScope.$parent.getCityCenter(marker.room.city);
                    var newCenter = {
                        lat: cityCenter.lat,
                        lng: cityCenter.lng
                    };
                    setMapCenter(newCenter);
                });
            }
        };

        function setMarkerIcon(marker, iconUrl, markers, onClick) {
            // set new icon color if click on address 
            marker.setIcon(new google.maps.MarkerImage(iconUrl,
                currentScope.$parent.mapSettings.marker.size,
                currentScope.$parent.mapSettings.marker.origin,
                currentScope.$parent.mapSettings.marker.anchor));
            if (onClick) {
                // reset other markers 

            }

        }

        // pinImage = currentScope.$parent.mapSettings.pin.markerUrl.concat(currentScope.$parent.mapSettings.pin.clickedColor);


        function setMarker(map, position, room) {
            var markerOptions = {
                position: position,
                map: map,
                icon: ''
            };
            var marker = new google.maps.Marker(markerOptions);
            marker['room'] = room;
            markers.push(marker);
            setMarkerIcon(marker, currentScope.$parent.mapSettings.marker.fullUrl, markers, false);

            // listener for clicks
            if (scope.mapSettings.enableMarkerClick) {
                google.maps.event.addListener(marker, 'click', (function (marker, markers) {
                    return function () {
                        // set new marker color
                        if (marker.map.zoom >= currentScope.$parent.mapSettings.zoom.markerSwitch && marker.room.address === currentScope.$parent.query.address) {
                            setMarkerIcon(marker, currentScope.$parent.mapSettings.marker.urlBase.concat(currentScope.$parent.mapSettings.marker.clickedColor), markers, true);
                        }
                        filterRoomsOnMarker(marker);
                    }
                })(marker, markers));
            }
            // listener for hover
            google.maps.event.addListener(marker, 'mouseover', (function (marker) {
                return function () {
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    if (currentScope.$parent.mapSettings.zoom.current < currentScope.$parent.mapSettings.zoom.markerSwitch) {
                        var content = marker.room.city;
                    } else {
                        var content = marker.room.street;
                    }
                    if (angular.isDefined(infoWindow) && content !== infoWindow.getContent()) {
                        infoWindow.setContent(content);
                    }
                    infoWindow.open(map, marker);
                };
            })(marker));
            // listener for mouseout
            google.maps.event.addListener(marker, 'mouseout', (function (marker) {
                return function () {
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                };
            })(marker));

        };

        function setMarkers(roomsOnMap) {
            angular.forEach(roomsOnMap, function (room) {
                if (room.lat > 0 && room.lng > 0) {
                    setMarker(map, new google.maps.LatLng(room.lat, room.lng), room);
                }
            });
        };
        /*********************/
        /****** GO MAP! ******/
        /*********************/
        initMap();
        setMarkers(scope.mapSettings.rooms);
    };

    return {
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope: {
            mapSettings: '='
        },
        link: link
    };
}]);