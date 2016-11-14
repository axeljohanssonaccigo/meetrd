var bookingApp = angular.module('bookingApp', ['720kb.datepicker', 'ui.bootstrap.popover', 'angularGoogleMapsDir', 'meetrdLoaderDir']);

bookingApp.controller('bookingCtrl', function ($scope, bookingSvc, $uibPosition) {
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
        // ON PAGE LOAD

        $scope.hourSelectWasClicked = function () {
            $scope.hourSelectHasBeenClicked = true;

        };
        $scope.$watch('selectedHoursToBook.value', function (newValue, oldValue) {
            if (oldValue === newValue) {}
            if ($scope.selectedHoursToBook.value > 0 && $scope.pageIsLoaded && $scope.hourSelectHasBeenClicked) {
                $scope.setChoosableTimeSlots();
                //If the hours change, reset the added hours and the current booking
                $scope.resetCurrentBooking();
                $scope.resetChosenSlots();
                //$scope.showBookingContainer = true;
                $scope.showBookingSlots = true;

            };

        });

        $scope.$watch('datePickerSettings.date', function (newValue, oldValue) {
            if ($scope.pageIsLoaded && $scope.datePickerSettings.wasClicked) {
                $scope.resetCurrentBooking();
                $scope.fillBookingsOfChosenDay($scope.bookingsForRoom);
                $scope.showBookingSlots = true;
            }
        });


        //Scope Variables
        $scope.userIsLoggedIn = userIsLoggedIn;
        $scope.userInfoIsLoaded = false;
        $scope.userTriedToRegister = false;
        $scope.userWasRegistered = false;
        $scope.calendarIsShown = false;
        $scope.pricePerHour = parseInt(roomPrice);
        $scope.triedToConfirmBooking = false;
        $scope.bookingWasConfirmed = false;
        $scope.showBookingSlots = true;
        $scope.windowHeight = jQuery(window).height();
        $scope.windowWidth = jQuery(window).width();
        $scope.mobileBreakpoint = 991;
        $scope.hostInfoLoaded = false;
        $scope.hostBiographyBreakpoint = 250;
        $scope.hostInfo = [];
        $scope.bookingIsSetFromQuery = false;
        $scope.pageIsLoaded = false;
        $scope.roomImgHeightIsSet = false;
        $scope.mailsAreDone = false;
        $scope.userIsGuest = false;
        $scope.roomsOnMap = [];

        //Check for window size
        if ($scope.windowWidth < $scope.mobileBreakpoint) {
            $scope.isMobileView = true;
            $scope.showBookingContainer = false;
        } else {
            $scope.isMobileView = false;
            $scope.showBookingContainer = true;

        };
        //Booking container
        $scope.bookingsForRoom = [];
        $scope.bookingsOfChosenDay = [];
        $scope.currentBooking = {};
        $scope.bookingFormIsShown = false;
        $scope.bookingsAreLoaded = false;
        $scope.registrationFormIsShown = false;
        $scope.maxHoursToBook = 0;
        $scope.bookingHoursOptions = [];
        $scope.selectedHoursToBook = {
            value: 1
        };
        $scope.hourSelectHasBeenClicked = false;

        $scope.bookingMessageToUser = "";
        //Max rating is 5 for a host. Used to loop and display filled or unfilled stars as rating
        $scope.hostRatingRange = [1, 2, 3, 4, 5];
        //CHECKBOX ARRAYS
        $scope.weekdays = [
            {
                "index": 1,
                "value": "monday",
                "displayName": "Måndag",
                "isChecked": false
            },
            {
                "index": 2,
                "value": "tuesday",
                "displayName": "Tisdag",
                "isChecked": false
            },
            {
                "index": 3,
                "value": "wednesday",
                "displayName": "Onsdag",
                "isChecked": false
            },
            {
                "index": 4,
                "value": "thursday",
                "displayName": "Torsdag",
                "isChecked": false
            },
            {
                "index": 5,
                "value": "friday",
                "displayName": "Fredag",
                "isChecked": false
            },
            {
                "index": 6,
                "value": "saturday",
                "displayName": "Lördag",
                "isChecked": false
            },
            {
                "index": 7,
                "value": "sunday",
                "displayName": "Söndag",
                "isChecked": false
            },
	];
        $scope.food = [
            {
                "index": 1,
                "value": "own-food",
                "displayName": "Egen mat tillåten",
                "isChecked": false
            },
            {
                "index": 2,
                "value": "own-bevs",
                "displayName": "Egen dryck tillåten",
                "isChecked": false
            },
            {
                "index": 3,
                "value": "liqour-provided",
                "displayName": "Utskänkningstillstånd",
                "isChecked": false
            },
            {
                "index": 4,
                "value": "coffee",
                "displayName": "Kaffe finns att tillgå",
                "isChecked": false
            },
            {
                "index": 5,
                "value": "catering",
                "displayName": "Catering via värd möjlig",
                "isChecked": false
            },
            {
                "index": 6,
                "value": "pay-for-coffee",
                "displayName": "Kaffe och kaka mot avgift",
                "isChecked": false
            },
	];
        $scope.equipment = [
            {
                "index": 1,
                "value": "whiteboard",
                "displayName": "Whiteboard",
                "isChecked": false
            },
            {
                "index": 2,
                "value": "projector",
                "displayName": "Projektor",
                "isChecked": false
            },
            {
                "index": 3,
                "value": "tv",
                "displayName": "TV",
                "isChecked": false
            },
            {
                "index": 4,
                "value": "video-conference",
                "displayName": "Videokonferens",
                "isChecked": false
            },
            {
                "index": 5,
                "value": "conference-phone",
                "displayName": "Konferenstelefon",
                "isChecked": false
            },
            {
                "index": 6,
                "value": "flip-chart",
                "displayName": "Blädderblock",
                "isChecked": false
            },
            {
                "index": 7,
                "value": "note-material",
                "displayName": "Anteckningsmaterial",
                "isChecked": false
            },
            {
                "index": 8,
                "value": "wifi",
                "displayName": "Wi-fi",
                "isChecked": false
            },
            {
                "index": 9,
                "value": "sound-system",
                "displayName": "Ljudanläggning",
                "isChecked": false
            },
	];



        //Get query params from url on page load
        $scope.bookingQuery = {
            "date": "",
            "startTime": "",
            "endTime": ""
        };
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
            "date": $scope.getFormattedDate(new Date()),
            "minDate": $scope.getFormattedDate(new Date()),
            "maxDate": null,
            "pattern": 'yyyy-MM-dd',
            "wasClicked": false
        };
        //Creates the slot string in the correct format, adding 0 to the hours that are less than 10
        $scope.formatHour = function (hour) {
            if (hour < 10) {
                return "0" + hour;
            } else {
                return hour.toString();
            }

        }
        $scope.getRoomSetting = function () {
            switch (roomSettingIndex) {
            case 1:
                return "Aula";
                break;
            case 2:
                return "Konferensrum";
                break;
            case 3:
                return "Mötesrum";
                break;
            };
        };
        //Return the host rating, rounded to integer.
        $scope.calculateHostRating = function (votes) {
            var hostRating = 0;
            var voteSum = 0;
            angular.forEach(votes, function (vote) {
                voteSum = voteSum + parseInt(vote);
            });
            hostRating = Math.round(voteSum / votes.length);
            return hostRating;
        };

        //Store room variables in json object
        var nickname;
        if (typeof (hostMetaData.nickname) == 'undefined') {
            nickname = '';
        } else {
            nickname = hostMetaData.nickname[0];
        }
        //Sets scope variable mapCenter to the current room's address
        $scope.setMapCenter = function (address) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    $scope.mapCenter = {
                        'latitude': latitude,
                        'longitude': longitude
                    };
                    //new google.maps.LatLng(latitude, longitude);
                }
            });
        };

        $scope.defineCurrentRoomAttributes = function () {
            $scope.currentRoom = {
                "title": roomTitle,
                "id": roomId,
                "hostId": hostId,
                "nrOfPeople": nrOfPeople,
                "price": roomPrice,
                "startTime": roomStartTime,
                "endTime": roomEndTime,
                "contactPerson": roomContact,
                "contactEmail": roomContactEmail,
                "contactPhone": roomContactPhone,
                "photo": roomPhoto,
                "croppedPhoto": roomCroppedPhoto,
                "website": roomCompanyUrl,
                "hostName": nickname,
                "address": roomAddress + ", " + roomCity,
                "setting": $scope.getRoomSetting(),
                "hostBiography": "",
                "hostLogotype": "",
                "hostReviews": "",
                "hostVotes": "",
                "hostRating": "",
                "hostUrl": "",
                "hostNickname": "",
                "hostEmail": "",
                "hostSlogan": "",
                "city": roomCity

            };
            $scope.setMapCenter($scope.currentRoom.address);
            $scope.roomsOnMap.push($scope.currentRoom);

            if ('description' in hostMetaData) {
                //Replace the "" that is added when getting the description.
                //Replace all ; by , since the opposite is done when updating. The url does not take commas.
                $scope.currentRoom.hostBiography = hostMetaData.description[0].replace(/"/g, "").replace(/;/g, ",");
                if ($scope.currentRoom.hostBiography.search("\n") > -1) {
                    $scope.hostBiographyBreakpoint = $scope.currentRoom.hostBiography.search("\n") - 10;
                }
            }
            if ('wpcf-logotype' in hostMetaData) {
                $scope.currentRoom.hostLogotype = hostMetaData['wpcf-logotype'][0];
            }
            if ('wpcf-reviews' in hostMetaData) {
                $scope.currentRoom.hostReviews = hostMetaData['wpcf-reviews'];
            }
            if ('wpcf-votes' in hostMetaData) {
                $scope.currentRoom.hostVotes = hostMetaData['wpcf-votes'];
                $scope.currentRoom.hostRating = $scope.calculateHostRating($scope.currentRoom.hostVotes);
            }
            if ('user_email' in hostData.data) {
                $scope.currentRoom.hostEmail = hostData.data.user_email;
            };
            if ('wpcf-slogan' in hostMetaData) {
                $scope.currentRoom.hostSlogan = hostMetaData['wpcf-slogan'][0];
            };
            //Get additional host info
            bookingSvc.getUserInfo(hostId).then(function (response) {
                $scope.hostInfo = response.data;
                $scope.hostInfoLoaded = true;
                $scope.currentRoom.hostUrl = $scope.hostInfo.url;
                $scope.currentRoom.hostNickname = $scope.hostInfo.nickname;
            });
            $scope.editableBookingFields = {
                "contact": false,
                "email": false,
                "phone": false,
                "biography": false
            };
        };
        $scope.defineCurrentRoomAttributes();

        $scope.getQueryParams = function () {

            jQuery.extend({
                getQueryParameters: function (str) {
                    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
                        return n = n.split("="), this[n[0]] = n[1], this
                    }.bind({}))[0];
                }
            });
            $scope.bookingQuery = jQuery.getQueryParameters();
            $scope.datePickerSettings.date = $scope.bookingQuery.date;
        };

        $scope.setCurrentBookingFromQuery = function () {
            //            $scope.currentBooking.date = $scope.datePickerSettings.date;
            //            $scope.showBookingSlots = true;
            if ('date' in $scope.bookingQuery) {
                $scope.currentBooking.date = $scope.datePickerSettings.date;
                $scope.showBookingSlots = true;
                $scope.resetCurrentBooking();
                $scope.fillBookingsOfChosenDay($scope.bookingsForRoom);

            } else {
                $scope.datePickerSettings.date = $scope.getFormattedDate(new Date());
            }
            //If the user returns to the booking after logging in
            if ('startTime' in $scope.bookingQuery && 'endTime' in $scope.bookingQuery) {
                $scope.currentBooking.startTime = parseInt($scope.bookingQuery.startTime);
                $scope.currentBooking.endTime = parseInt($scope.bookingQuery.endTime);
                $scope.currentBooking.duration = $scope.bookingQuery.endTime - $scope.bookingQuery.startTime;
                $scope.selectedHoursToBook.value = $scope.currentBooking.duration;
                $scope.currentBooking.roomId = $scope.currentRoom.id;
                $scope.currentBooking.hostId = $scope.currentRoom.hostId;
                $scope.currentBooking.roomName = $scope.currentRoom.title;
                $scope.currentBooking.slot = $scope.formatHour($scope.currentBooking.startTime) + ":00-" + $scope.formatHour($scope.currentBooking.endTime) + ":00";
                $scope.currentBooking.price = $scope.currentBooking.duration * $scope.currentRoom.price;
                angular.forEach($scope.bookingsOfChosenDay, function (slot) {
                    if (slot.startTime >= $scope.currentBooking.startTime && slot.endTime <= $scope.currentBooking.endTime) {
                        slot.isAdded = true;
                    };
                });
                if ($scope.isMobileView) {
                    $scope.showBookingContainer = true;
                    jQuery("#booking-container").addClass('sticky-scrollable');
                };

                if ($scope.userIsLoggedIn && $scope.userInfoIsLoaded) {
                    //The title of the booking is the username of the guest
                    $scope.currentBooking.title = $scope.userInfo.nickname;
                    $scope.currentBooking.email = $scope.userInfo.email;
                    $scope.currentBooking.guestBiography = $scope.userInfo["biography"];
                    $scope.currentBooking.contact = $scope.userInfo.firstname + " " + $scope.userInfo.lastname;
                    $scope.currentBooking.phone = $scope.userInfo["phone"];
                    $scope.currentBooking.billingAddress = $scope.userInfo.billingAddress;
                    $scope.showBookingSlots = false;
                    $scope.bookingIsSetFromQuery = true;
                }
            };
        };
        //Getting the user info, then getting the query parameters and setting the booking from query
        if ($scope.userIsLoggedIn) {
            //Get the user info
            bookingSvc.getUserInfo(userId).then(function (response) {
                $scope.userInfo = response.data;
                $scope.userInfo["userLogin"] = userData.data.user_login;
                //Replace the "" that is added when getting the description.
                //Replace all ; by , since the opposite is done when updating. The url does not take commas.
                $scope.userInfo["biography"] = userMetaData.description[0].replace(/"/g, "").replace(/;/g, ",");
                $scope.userInfo["role"] = userData.roles[0];
                if ($scope.userInfo.role === "meetrdguest") {
                    $scope.userIsGuest = true;
                }
                $scope.userInfo["email"] = userData.data.user_email;
                if ('wpcf-phone' in userMetaData) {
                    $scope.userInfo["phone"] = userMetaData['wpcf-phone'][0];
                } else {
                    $scope.userInfo["phone"] = "";
                }
                if ('wpcf-billing-address' in userMetaData) {
                    //Replace all ; by , since the opposite is done when updating. The url does not take commas.
                    $scope.userInfo["billingAddress"] = userMetaData['wpcf-billing-address'][0].replace(/;/g, ",");
                } else {
                    $scope.userInfo["billingAddress"] = "";
                }

                $scope.userInfoIsLoaded = true;
                $scope.getQueryParams();
                $scope.setCurrentBookingFromQuery();
            });
            //If the user is not logged in, set the date in the datepicker from the search query
        } else {
            $scope.getQueryParams();
            $scope.datePickerSettings.date = $scope.getFormattedDate(new Date());
        }

        // Attaching scroll event when document/window is loaded
        function OnFirstLoad() {
            if (document.attachEvent) {
                document.attachEvent('onscroll', scrollEvent);
            } else if (document.addEventListener) {
                document.addEventListener('scroll', scrollEvent, false);
            }
        };


        //Sets the isChecked prop for each checkbox option
        $scope.setCheckboxValues = function (checkboxArray, funnyObject) {
            angular.forEach(checkboxArray, function (checkbox) {
                if (funnyObject.search(checkbox.value) > -1) {
                    checkbox.isChecked = true;
                }
            });
        };
        $scope.setCheckboxValues($scope.weekdays, weekdays);
        $scope.setCheckboxValues($scope.food, roomFood);
        $scope.setCheckboxValues($scope.equipment, roomEquipment);

        //Get the date from the url search query
        $scope.getQueryDate = function () {
            if (window.location.search.search('Invalid') > -1) {
                return $scope.getFormattedDate(new Date());
            } else {
                return window.location.search.slice(6);
            }
        };

        $scope.showOrHideBookingContainer = function () {
            if ($scope.isMobileView) {
                $scope.showBookingContainer = !$scope.showBookingContainer;
                jQuery("#booking-container").addClass('sticky');

                if ($scope.showBookingContainer) {
                    jQuery("#booking-container").addClass('sticky-scrollable');
                } else {
                    jQuery("#booking-container").removeClass('sticky-scrollable');

                }
            }
        };
        //Triggered on window resize
        jQuery(window).resize(function () {
            $scope.windowHeight = jQuery(window).height();
            $scope.windowWidth = jQuery(window).width();
            //Height of the room photo
            $scope.roomImgHeightIsSet = false;
            $scope.img = document.getElementById('single-room-img');
            if ($scope.img !== typeof 'undefined') {
                $scope.roomImgHeight = $scope.roomImg.clientHeight;
            }

            if ($scope.windowWidth < $scope.mobileBreakpoint) {
                $scope.isMobileView = true;
                $scope.showBookingContainer = false;
            } else {
                $scope.isMobileView = false;
                $scope.showBookingContainer = true;
            }
        });



        //Triggered on scroll
        function scrollEvent(e) {
            if (!$scope.roomImgHeightIsSet) {
                $scope.roomImg = document.getElementById('single-room-img');
                $scope.roomImgHeight = $scope.roomImg.clientHeight;
                $scope.roomImgHeightIsSet = true;
            };
            var toTop = jQuery(document).scrollTop();
            var marginInPhoto = 15;
            if (toTop > $scope.roomImgHeight - marginInPhoto) {
                jQuery("#booking-container").addClass('sticky');
            } else {
                //Only remove the sticky class if the booking container is not shown in mobile view
                if ($scope.isMobileView && !$scope.showBookingContainer) {
                    jQuery("#booking-container").removeClass('sticky');
                };
                //Remove class sticky if no mobile view
                if (!$scope.isMobileView) {
                    jQuery("#booking-container").removeClass('sticky');

                };
            }
        };
        //Return the height on which the sticky booking container should stick (depending on image size which depends on window width)
        $scope.getStickyHeightTrigger = function () {
            var stickyLimit = 0;
            if ($scope.windowWidth < 768) {
                stickyLimit = 150 + 60 + 1 - 30; //photo height + menu height + border - margin
            } else if ($scope.windowWidth >= 768 && $scope.windowWidth < 991) {
                stickyLimit = 250 + 60 + 1 - 30; //photo height + menu height + border - margin

            } else if ($scope.windowWidth >= 991 && $scope.windowWidth < 1200) {
                stickyLimit = 350 + 52 + 1 - 30; //photo height + menu height + border - margin
            } else if ($scope.windowWidth >= 1200) {
                stickyLimit = 550 + 52 + 1 - 30; //photo height + menu height + border - margin
            }
            return stickyLimit;
        };
        //jQuery(document).scroll();

        //Scope variables


        $scope.reloadPage = function () {
            location.reload();
        };


        $scope.newUser = {
            "username": "",
            "nickname": "",
            "email": "",
            "password": "",
            "password2": "",
            "firstName": "",
            "lastName": "",
            "website": "http://",
            "biography": "",
            "phone": "",
            "billingAddress": ""
        };

        $scope.passwordsMatch = function () {
            return $scope.newUser.password === $scope.newUser.password2;
        };

        $scope.isUrlValid = function (form, url) {
            if (form.$dirty) {
                //In some cases website is undefined for some reason.
                if (url === undefined) {
                    return true;
                } else {
                    var returnBall = false;
                    //Allow all urls that start with http://
                    if (form !== undefined) {
                        //Allow urls that are empty strings or begins by http://
                        if (url.substr(0, 7) === "http://" || url.length === 0) {
                            form.website.$setValidity("url", true);
                            returnBall = true;
                        }
                    };
                    return returnBall;
                }
            };
        };
        //Initiate the current booking array
        $scope.resetCurrentBooking = function () {

            $scope.currentBooking = {
                "duration": 0,
                "price": 0,
                "startTimes": [],
                "startTime": 0,
                "endTime": 0,
                "slot": "",
                "date": $scope.datePickerSettings.date,
                "title": "",
                "content": "",
                "roomId": $scope.currentRoom.id,
                "roomName": $scope.currentRoom.title,
                "hostId": $scope.currentRoom.hostId,
                "phone": "",
                "email": "",
                "guestBiography": "",
                "contact": "",
                "billingAddress": "",
                "bookingStatus": 1,
                "readByHost": 0

            };
            if ($scope.userIsLoggedIn && $scope.userInfoIsLoaded) {
                //The title of the booking is the username of the guest
                $scope.currentBooking.title = $scope.userInfo.nickname;
                $scope.currentBooking.email = $scope.userInfo.email;
                $scope.currentBooking.guestBiography = $scope.userInfo["biography"];
                $scope.currentBooking.contact = $scope.userInfo.firstname + " " + $scope.userInfo.lastname;
                $scope.currentBooking.phone = $scope.userInfo["phone"];
                $scope.currentBooking.billingAddress = $scope.userInfo.billingAddress;
            }
        };

        //Sorting functions
        function numOrdA(a, b) {
            return (a - b);
        };

        function numOrdD(a, b) {
            return (b - a);
        };

        //RAnge function
        $scope.getRange = function (anInteger) {
            var range = [];
            for (var i = 1; i <= anInteger; i++) {
                range.push(i);
            };
            return range;
        };

        bookingSvc.getBookingsForRoom($scope.currentRoom.id).then(function (response) {
            angular.forEach(response.data.posts, function (booking) {
                booking["creationDate"] = booking.date;
                booking["date"] = moment.unix(booking['custom_fields']['wpcf-booking-date'][0]).format('YYYY-MM-DD');
                booking["startTime"] = booking['custom_fields']['wpcf-booking-starttime'][0];
                booking["endTime"] = booking['custom_fields']['wpcf-booking-endtime'][0];
                booking["phone"] = booking['custom_fields']['wpcf-phone'][0];
                booking["roomId"] = booking['custom_fields']['wpcf-room-id'][0];
                booking["hostId"] = booking['custom_fields']['wpcf-host-id'][0];
                booking["bookingStatus"] = parseInt(booking['custom_fields']['wpcf-booking-status'][0]);
                booking["email"] = booking['custom_fields']['wpcf-e-mail'][0];
                booking["price"] = booking['custom_fields']['wpcf-total-price'][0];
                booking["duration"] = booking['custom_fields']['wpcf-duration'][0];
                //Replace all ; by , since the opposite is done when updating. The url does not take commas.
                if ('wpcf-billing-address' in booking['custom_fields']) {
                    booking["billingAddress"] = booking['custom_fields']['wpcf-billing-address'][0].replace(/;/g, ",");
                } else {
                    booking["billingAddress"] = "";
                }
                if ('wpcf-guest-biography' in booking['custom_fields']) {
                    //Replace the "" that is added when getting the description.
                    booking["guestBiography"] = booking['custom_fields']['wpcf-guest-biography'][0].replace(/"/g, "").replace(/;/g, ",");
                } else {
                    booking["guestBiography"] = "";
                }
                $scope.bookingsForRoom.push(booking);
            });
            $scope.fillBookingsOfChosenDay($scope.bookingsForRoom);
            setTimeout(function () {
                $scope.$apply($scope.bookingsAreLoaded = true);

            }, 50);


        });

        //Fills the bookingsChosenDay array with the existing bookings and creates empty slots for the unbooked hours
        $scope.fillBookingsOfChosenDay = function (bookings) {
            $scope.bookingsOfChosenDay = [];

            var bookedHours = [];
            $scope.maxHoursToBook = 0;
            $scope.bookingHoursOptions = [];
            //$scope.selectedHoursToBook = 1;
            angular.forEach(bookings, function (booking) {
                if (booking.date === $scope.datePickerSettings.date) {
                    var start = parseInt(booking.startTime);
                    var end = parseInt(booking.endTime);
                    //Adding the bookings that have been confirmed to the list of booked hours
                    if (booking.bookingStatus === 2) {
                        for (var i = start; i < end; i++) {
                            bookedHours.push(i.toString());
                        }
                    };
                };
            });

            var index = 0;
            for (var i = parseInt($scope.currentRoom.startTime); i < parseInt($scope.currentRoom.endTime); i++) {
                var isBooked = jQuery.inArray(i.toString(), bookedHours) > -1;

                if (isBooked) {
                    $scope.bookingsOfChosenDay.push({
                        index: index,
                        slot: $scope.formatHour(i) + ":00 - " + $scope.formatHour(i + 1) + ":00",
                        startTime: i,
                        endTime: i + 1,
                        status: "Bokat",
                        isAdded: false,
                        isChoosable: false,
                        isFirstSlotOfBooking: false,
                        isBooked: true
                    })
                } else {
                    $scope.bookingsOfChosenDay.push({
                        index: index,
                        slot: $scope.formatHour(i) + ":00 - " + $scope.formatHour(i + 1) + ":00",
                        startTime: i,
                        endTime: i + 1,
                        status: "Tillgängligt",
                        isAdded: false,
                        isChoosable: false,
                        isFirstSlotOfBooking: false,
                        isBooked: false
                    })
                }
                index++;
            };
            $scope.calculateMaxHoursToBook();
            $scope.setChoosableTimeSlots();
        };



        $scope.showEvents = function (events) {
            alert(events.map(function (e) {
                return e.title
            }).join("\n"));
        };

        $scope.showBookings = function (bookings, date) {
            // $scope.calendarIsShown = false;
            // if (typeof (date) !== 'string') {
            // 	date = date.format('YYYY-MM-DD');
            // }
            // //if (date !== $scope.options.selectedDate) {
            // 	//If the chosen day is a different day, then reset the currentBooking and set the new date
            // 	$scope.options.selectedDate = date;
            // 	$scope.currentBooking.date = date;
            // 	$scope.resetCurrentBooking();
            // 	$scope.bookingsOfChosenDay = [];
            // 	$scope.fillBookingsOfChosenDay(bookings);
            // //}


        };
        $scope.showOrHideCalendar = function () {
            $scope.calendarIsShown = !$scope.calendarIsShown;
        };
        $scope.showOrHideBookingSlots = function () {
            $scope.showBookingSlots = !$scope.showBookingSlots;
        };

        $scope.showBookingForm = function () {
            $scope.bookingFormIsShown = !$scope.bookingFormIsShown;
            //$scope.calculateMaxHoursToBook();

        };

        $scope.dayIsAvailableForBooking = function (day) {
            var bookedHours = [];
            for (var i = $scope.currentRoom.startTime; i <= $scope.currentRoom.endTime; i++) {
                bookedHours.push({
                    startHour: i,
                    isBooked: false
                });
            };


        };

        $scope.calculateMaxHoursToBook = function () {
            var localMax = 0;
            var localMaxes = [];
            var allDayFree = true;
            angular.forEach($scope.bookingsOfChosenDay, function (booking) {
                if (booking.isBooked) {
                    allDayFree = false;
                    localMaxes.push(localMax);
                    localMax = 0;
                } else {
                    localMax++;
                }
            });
            localMaxes.push(localMax);

            if (allDayFree) {
                $scope.maxHoursToBook = $scope.bookingsOfChosenDay.length;
            } else {
                //Take the first element in the sorted list of local maxes (descending order)
                $scope.maxHoursToBook = localMaxes.sort(numOrdD)[0];
            }
            //Set the options for nr of hours dropdown
            for (var i = 1; i <= $scope.maxHoursToBook; i++) {
                $scope.bookingHoursOptions.push(i);
            }
        };


        $scope.setChoosableTimeSlots = function () {
            var nrOfSlots = $scope.bookingsOfChosenDay.length;
            angular.forEach($scope.bookingsOfChosenDay, function (slot) {
                //If the slot is not booked and there are enough time slots after the chosen one to satisfy the max hours to book
                var slotsAfterAreBooked = false;
                if (!slot.isBooked && ((nrOfSlots - slot.index) >= $scope.selectedHoursToBook.value)) {

                    //Check if the slots after the chosen one are already booked
                    for (var i = 0; i < $scope.selectedHoursToBook.value; i++) {

                        if ($scope.bookingsOfChosenDay[i + slot.index].isBooked) {
                            slotsAfterAreBooked = true;
                        }
                    };
                    slot.isChoosable = !slotsAfterAreBooked;
                } else { //If there is not enought time slots after the chosen slot then set isChoosable to false
                    slot.isChoosable = false;
                }

            });
        };

        $scope.addSlotsToBooking = function (startingSlot) {
            if (startingSlot.isChoosable) {
                $scope.resetCurrentBooking();
                $scope.resetChosenSlots();
                $scope.showBookingSlots = false;
                //Setting the startingslot and the slots after to added
                for (var i = startingSlot.index; i < $scope.selectedHoursToBook.value + startingSlot.index; i++) {
                    $scope.bookingsOfChosenDay[i].isAdded = true;
                    if (i === startingSlot.index) {
                        $scope.bookingsOfChosenDay[i].isFirstSlotOfBooking = true;
                    }
                };
                $scope.currentBooking.duration = $scope.getCurrentBookingTotalTime();
                $scope.currentBooking.price = $scope.currentBooking.duration * $scope.currentRoom.price;
                $scope.currentBooking.startTime = startingSlot.startTime;
                $scope.currentBooking.endTime = startingSlot.startTime + $scope.selectedHoursToBook.value;
                $scope.currentBooking.slot = $scope.formatHour($scope.currentBooking.startTime) + ":00-" + $scope.formatHour($scope.currentBooking.endTime) + ":00";
            }
        };

        $scope.resetChosenSlots = function () {
            angular.forEach($scope.bookingsOfChosenDay, function (slot) {
                slot.isAdded = false;
                slot.isFirstSlotOfBooking = false;
            });
        };

        $scope.getCurrentBookingTotalTime = function () {
            var time = 0;
            angular.forEach($scope.bookingsOfChosenDay, function (slot) {
                if (slot.isAdded) {
                    time = time + 1;
                };
            });
            return time;
        };


        $scope.createBooking = function () {
            $scope.triedToConfirmBooking = true;
            $scope.bookingMessageToUser = "Din bokningsförfrågan behandlas...";
            bookingSvc.getNonce().then(function (response) {
                bookingSvc.createBooking(response, $scope.currentBooking).then(function (response) {
                    $scope.currentBooking["id"] = response.data.post.id;
                    //If the booking has been created but no custom fields have been filled, check this by checking for the custom field room id. Then update booking.
                    if (!('wpcf-room-id' in response.data.post.custom_fields)) {
                        bookingSvc.getUpdatingNonce().then(function (response) {
                            bookingSvc.updateBooking(response, $scope.currentBooking).then(function (response) {
                                $scope.bookingWasConfirmed = true;
                                $scope.bookingMessageToUser = "Din bokning har registrerats. Skickar mail...";
                                //If the booking was confirmed, then send the emails to the guest and host
                                $scope.createAndSendBookingEmails();
                            }).catch(function () {
                                console.log('Error in updateBooking!');
                                $scope.bookingWasConfirmed = false;
                                $scope.bookingMessageToUser = "Det uppstod ett fel i  din bokning. Kontakta Meetrd på support@meetrd.se";
                            });
                        });
                    } else {
                        $scope.bookingWasConfirmed = true;
                        $scope.bookingMessageToUser = "Din bokning har registrerats. Skickar mail...";
                        //If createBooking succeeded, then send the emails to the guest and host
                        $scope.createAndSendBookingEmails();
                    }
                }).catch(function () {
                    console.log('Error in createBooking!');
                    //Not sending any mails in this case
                    $scope.mailsAreDone = true;
                    $scope.bookingMessageToUser = "Det uppstod ett fel i din bokning. Kontakta Meetrd på support@meetrd.se.";

                });
            });

        };

        $scope.createAndSendBookingEmails = function () {
            //If the booking is confirmed, then send mails

            //Get currentbooking
            var currentBookingAsMail = $scope.getCurrentBookingMail();
            //Create and send mail to the guest
            var mailTemplateSlug = "notifiering-till-gast-vid-bokningsforfragan";
            var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
            //Replace HOST and GUEST in mailtemplate with the actual names
            mailTpl.body = mailTpl.body.replace("GUEST", $scope.userInfo.firstname + " " + $scope.userInfo.lastname).replace("HOST", $scope.currentRoom.hostNickname);
            //Append the mail body with the booking
            mailTpl.body = mailTpl.body + currentBookingAsMail;

            //Send the guest mail
            bookingSvc.sendMail($scope.currentBooking.email, mailTpl.subject, mailTpl.body).then(function (response) {
                console.log('Mail was sent to guest');
                var guestMailSucceeded = true;
                //Create and send mail to the host
                mailTemplateSlug = "notifiering-till-vard-vid-bokningsforfragan";
                mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                //Replace HOST and GUEST in mailtemplate with the actual names
                mailTpl.body = mailTpl.body.replace("GUEST", $scope.currentBooking.title).replace("HOST", $scope.currentRoom.hostNickname);
                mailTpl.body = mailTpl.body + currentBookingAsMail;

                //Send the host mail
                bookingSvc.sendMail($scope.currentRoom.hostEmail, mailTpl.subject, mailTpl.body).then(function (response) {
                    console.log('Mail was sent to host');
                    var hostMailSucceeded = true;
                    $scope.mailsAreDone = true;
                    $scope.setMessageToUser(guestMailSucceeded, hostMailSucceeded);
                }).catch(function () {
                    console.log('Error in send mail to host');
                    var hostMailSucceeded = false;
                    $scope.mailsAreDone = true;
                    $scope.setMessageToUser(guestMailSucceeded, hostMailSucceeded);
                });

            }).catch(function () {
                console.log('Error in send mail to guest');
                var guestMailSucceeded = false;
                //Create and send mail to the host
                mailTemplateSlug = "notifiering-till-vard-vid-bokningsforfragan";
                mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                //Replace HOST and GUEST in mailtemplate with the actual names
                mailTpl.body = mailTpl.body.replace("GUEST", $scope.currentBooking.title).replace("HOST", $scope.currentRoom.hostNickname);
                mailTpl.body = mailTpl.body + currentBookingAsMail;

                //Send the host mail
                bookingSvc.sendMail($scope.currentRoom.hostEmail, mailTpl.subject, mailTpl.body).then(function (response) {
                    console.log('Mail was sent to host');
                    var hostMailSucceeded = true;
                    $scope.mailsAreDone = true;
                    $scope.setMessageToUser(guestMailSucceeded, hostMailSucceeded);
                }).catch(function () {
                    console.log('Error in send mail to host');
                    var hostMailSucceeded = false;
                    $scope.mailsAreDone = true;
                    $scope.setMessageToUser(guestMailSucceeded, hostMailSucceeded);
                });
            });

        };

        $scope.setMessageToUser = function (guestMailSucceeded, hostMailSucceeded) {
            //Message to user depending on the success of the mails
            if (guestMailSucceeded && hostMailSucceeded) {
                $scope.bookingMessageToUser = "Din bokningsförfrågan har skickats! Följ din bokning på Mina sidor.";
            } else if (!guestMailSucceeded && hostMailSucceeded) {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail till dig. Kontakta Meetrd på support@meetrd.se.";
            } else if (guestMailSucceeded && !hostMailSucceeded) {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail till värden. Kontakta Meetrd på support@meetrd.se för att försäkra dig om att din förfrågan har gått fram till värden.";
            } else {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail. Kontakta Meetrd på support@meetrd.se.";
            }
        };

        $scope.updateBooking = function (booking) {

            bookingSvc.getUpdatingNonce().then(function (response) {
                bookingSvc.updateBooking(response, booking).then(function (response) {
                    return true;
                });

            }).catch(function () {
                console.log('Error in updateBooking!');
                return false;
            });
        };



        /*
         *
         * Send mail Example Angular JS
         * By Jenssiii
         */
        $scope.mailTemplates = [];

        $scope.getAllMailTemplates = function () {
            bookingSvc.getAllMailTemplates().then(function (response) {
                $scope.mailTemplates = response.data.posts;
                angular.forEach($scope.mailTemplates, function (mail) {
                    mail["subject"] = mail["custom_fields"]["wpcf-subject"][0];
                    mail["body"] = mail.content;
                });
            });
        };
        $scope.getAllMailTemplates();

        $scope.getMailTemplateBySlug = function (mailTemplateSlug) {
            var returnTpl = null;
            angular.forEach($scope.mailTemplates, function (mail) {
                if (mail.slug === mailTemplateSlug) {
                    returnTpl = mail;
                };
            });
            return returnTpl;
        };

        $scope.sendMail = function (recipient, subject, body) {
            var mailSucceded = null;
            bookingSvc.sendMail(recipient, subject, body).then(function (response) {
                console.log('Mail returned true');
                var mailSucceded = true;
                return mailSucceded;

            }).catch(function () {
                console.log('Error send mail');
                var mailSucceded = false;
                return mailSucceded;
            });

        };

        $scope.getCurrentBookingMail = function () {
            var booking = $scope.currentBooking;
            //Making sure the date is in the right format (not an int)
            if (booking.date === parseInt(booking.date)) {
                booking.date = moment.unix(booking.date).format('YYYY-MM-DD');
            };
            var room = $scope.currentRoom;
            var mailString = "";
            mailString = mailString.
            concat('<h2>Om bokningsförfrågan</h2>').
            concat('<p><b>Bokningsnummer</b><br>' + booking.id + '<br>').
            concat('<b>Värd</b><br>' + room.hostName + '<br>').
            concat('<b>Lokal</b><br>' + room.title + '<br>').
            concat('<b>Datum</b><br>' + booking.date + '<br>').
            concat('<b>Tid</b><br>' + booking.slot + '<br>').
            concat('<b>Pris (exkl. moms)</b><br>' + booking.price + 'kr </p>').

            concat('<p><b>Företagsnamn</b><br>' + booking.title + '<br>').
            concat('<b>Kontaktperson</b><br>' + booking.contact + '<br>').
            concat('<b>Presentation av företaget</b><br>' + booking.guestBiography + '<br>').
            concat('<b>Faktureringsadress</b><br>' + booking.billingAddress + '<br></p>');
            if (booking.content !== "") {
                mailString = mailString.concat('<b>Övriga kommentarer</b><br>' + booking.content + '<br><br>');
            };
            return mailString;
        };

        $scope.registerUser = function () {
            //Set the username to the entered email
            $scope.newUser.username = $scope.newUser.email;
            //reset the user website if none is entered
            if ($scope.newUser.website === "http://") {
                $scope.newUser.website = "";
            };
            $scope.userTriedToRegister = true;
            $scope.registerMessageToUser = "Ditt konto skapas..."
            bookingSvc.getRegisterNonce().then(function (response) {
                bookingSvc.registerUser(response.data.nonce, $scope.newUser).then(function (response) {
                    //Update user info to get the custom user fields in
                    bookingSvc.generateUserCookie($scope.newUser.username, $scope.newUser.password).then(function (response) {
                        bookingSvc.updateUserInfo(response.data.cookie, $scope.newUser).then(function (response) {
                            $scope.userWasRegistered = true;
                            $scope.registerMessageToUser = "Ditt gästkonto har skapats!"
                                //Auto click the login button to come to the login form
                            jQuery("#loginButton")[0].click();
                        });
                    });

                }).catch(function (response) {
                    console.log("Error in registerUser");
                    $scope.userTriedToRegister = false;
                    var error = response.data.error;
                    switch (error) {
                    case "E-mail address is already in use.":
                        $scope.registerMessageToUser = "Det finns redan en användare med denna e-mailadress.";
                        jQuery("#registerEmail").addClass('higlight-error');
                        jQuery("#registerUsername").removeClass('higlight-error');
                        break;
                    case "Username already exists.":
                        $scope.registerMessageToUser = "Det finns redan en användare med detta användarnamn.";
                        jQuery("#registerUsername").addClass('higlight-error');
                        jQuery("#registerEmail").removeClass('higlight-error');
                        break;
                    }
                });
            });

        };

        //In wp-login.php L: 801-802. the else body is changed to redirect back to the previous page
        $scope.setBookingUrl = function () {
            var roomQuery = "";
            //If the user entered the login page from a room, then add á room query to the url to redirect back wehn logging in.
            if (window.location.href.search('room') > -1) {
                var roomName = window.location.href.slice(window.location.href.search('room/') + 5).replace("/", "");
                roomQuery = "room/" + roomName;
            }

            if ($scope.currentBooking.duration > 0) {
                var startQuery = $scope.currentBooking.startTime;
                var endQuery = $scope.currentBooking.endTime;
                var dateQuery = $scope.currentBooking.date;
                var query = urlPathNameAddOn + "/" + roomQuery + "/?date=" + dateQuery + "&startTime=" + startQuery + "&endTime=" + endQuery;
                window.history.pushState("", "", query);
                //window.location.href = window.location.origin + query;
            }
            var suffix = urlPathNameAddOn + "/wp-login.php";
        };

        $scope.showRegisterUserForm = function () {
            $scope.registrationFormIsShown = true;
        };
        $scope.phoneNumberIsValid = function (phoneNr) {
            return /^\d+$/.test(phoneNr);
        };
        $scope.getHostPageUrl = function (hostId) {
            return window.location.origin + urlPathNameAddOn + '/search/?host=' + hostId;
        };
        $scope.goToMyPages = function (isGuest) {
            if (isGuest) {
                window.location.href = window.location.origin + urlPathNameAddOn + '/gast-administration';
            } else {
                window.location.href = window.location.origin + urlPathNameAddOn + '/vard-administration';

            }
        };
        $scope.reloadRoomPage = function () {

            var date = moment($scope.datePickerSettings.date).format('YYYY-MM-DD');
            var dateQuery = '/?date=' + date;
            //Splt removes all the query params, adding the current date to the url and then reload the room.
            window.location.href = window.location.href.split("?")[0] + dateQuery;
        };
    };

    //Document ready
    jQuery(document).ready(function () {
        OnFirstLoad();
        $scope.$apply($scope.pageIsLoaded = true);
    });

});