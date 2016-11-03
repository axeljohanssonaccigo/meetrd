angular.module('angularGoogleMapsDir', []).
directive('angularGoogleMaps', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow, mapCenter, mapZoom;
        var markers = [];
        var meetrdHeadQuarters = {
            "latitude": 59.3320652,
            "longitude": 18.05767990000004
        };
        if (typeof scope.center === 'undefined') {
          mapCenter = meetrdHeadQuarters;
        } else{
          mapCenter = scope.center;
        }
        if (typeof scope.zoom === 'undefined') {
          //Default zoom
          mapZoom = 13;
        } else {
          mapZoom = scope.zoom;
        }

        // map config
        var mapOptions = {
            center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
            zoom: mapZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };

        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }

        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array

            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }

        function setMarkers(roomsOnMap) {
          angular.forEach(roomsOnMap, function(room){
            var marker = {
              'address': room.address,
              'title': room.title,
              'content': room.hostBiography,
              'coordinates': {
                'longitude': 0,
                'latitude': 0
              }
            };
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': marker.address}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                marker.coordinates.latitude = results[0].geometry.location.lat();
                marker.coordinates.longitude = results[0].geometry.location.lng();
                setMarker(map, new google.maps.LatLng(marker.coordinates.latitude, marker.coordinates.longitude), marker.title, marker.content)
              }
            });
          });
        }
        initMap();
        setMarkers(scope.roomsOnMap);
        // function getRoomMarkerSettings(room){
        //   var marker = {
        //     'address': room.address,
        //     'title': room.title,
        //     'content': room.hostBiography,
        //     'coordinates': {
        //       'longitude': 0,
        //       'latitude': 0
        //     }
        //   };
        //   var geocoder = new google.maps.Geocoder();
        //   geocoder.geocode( { 'address': marker.address}, function(results, status) {
        //     if (status == google.maps.GeocoderStatus.OK) {
        //       marker.coordinates.latitude = results[0].geometry.location.lat();
        //       marker.coordinates.longitude = results[0].geometry.location.lng();
        //     }
        //
        //   });
        //
        // };

        // show the map and place some markers

        // angular.forEach(scope.roomsOnMap, function(room){
        //   //var marker = getRoomMarkerSettings(room);
        //   setMarker(map, new google.maps.LatLng(marker.coordinates.latitude, marker.coordinates.longitude), marker.title, marker.content)
        //   setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        // });

        // setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        // setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        // setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };

    return {
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope: {
          roomsOnMap: '=',
          center: '=',
          zoom: '='
        },
        link: link
    };


});
