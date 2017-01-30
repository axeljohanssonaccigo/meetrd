var hostApp = angular.module('hostApp', ['meetrdLoaderDir']);



hostApp.controller('hostCtrl', function ($scope, hostSvc, $timeout) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

    function isNullOrUndefined(value) {
        return value === null || angular.isUndefined(value);
    };

    //redirecting the user to login page if not already logged in
    $scope.userIsLoggedIn = userIsLoggedIn;
    if (!$scope.userIsLoggedIn) {
        //If the user is not logged in, wait for document ready and then click the hidden login button in page-host.php
        jQuery(document).ready(function () {
            jQuery("#menuLoginButton")[0].click()
        });
    } else {


        $scope.userId = userData.data.ID;
        $scope.triedToUpdateUserInfo = false;
        $scope.meetrdCities = ['Göteborg', 'Malmö', 'Stockholm'];

        $scope.forms = {};
        //Get additional userinfo from API
        hostSvc.getUserInfo($scope.userId).then(function (response) {
            $scope.userInfo = response.data;
            $scope.userInfo["userLogin"] = userData.data.user_login;
            //Replace the "" that is added when getting the description.
            //Replace all ; by , since the opposite is done when updating. The url does not take commas.
            $scope.userInfo["biography"] = userMetaData.description[0].replace(/"/g, "").replace(/;/g, ",");
            $scope.userInfo["role"] = userData.roles[0];
            $scope.userInfo["roleDisplayName"] = "Värd";
            $scope.userInfo["email"] = userData.data.user_email;
            if ('wpcf-phone' in userMetaData) {
                $scope.userInfo["phone"] = userMetaData['wpcf-phone'][0];
            }
            if ('wpcf-logotype' in userMetaData) {
                $scope.userInfo["logotype"] = userMetaData['wpcf-logotype'][0];
            }
            if ('wpcf-show-banner' in userMetaData) {
                $scope.userInfo["showBanner"] = userMetaData['wpcf-show-banner'][0];
                if ($scope.userInfo["showBanner"] === 1) {
                    $scope.userInfo["showBanner"] = true;
                } else {
                    $scope.userInfo["showBanner"] = false;
                }
            }
            if ('wpcf-banner' in userMetaData) {
                $scope.userInfo["banner"] = userMetaData['wpcf-banner'][0];
            }
            if ('wpcf-reviews' in userMetaData) {
                $scope.userInfo["reviews"] = userMetaData['wpcf-reviews'];
            }
            if ('wpcf-slogan' in userMetaData) {
                $scope.userInfo["slogan"] = userMetaData['wpcf-slogan'][0];
            }
            if ('wpcf-votes' in userMetaData) {
                $scope.userInfo["votes"] = userMetaData['wpcf-votes'];
            }
            if ('wpcf-cancel-deadline' in userMetaData) {
                $scope.userInfo["cancelDeadline"] = userMetaData['wpcf-cancel-deadline'][0];
            } else {
                $scope.userInfo["cancelDeadline"] = 0;
            }
            if ('wpcf-default-deny-response' in userMetaData) {
                $scope.userInfo["defaultDenyResponse"] = userMetaData['wpcf-default-deny-response'][0].replace(/"/g, "").replace(/;/g, ",");
            } else {
                $scope.userInfo["defaultDenyResponse"] = '';
            }
            if ('wpcf-default-confirm-response' in userMetaData) {
                $scope.userInfo["defaultConfirmResponse"] = userMetaData['wpcf-default-confirm-response'][0].replace(/"/g, "").replace(/;/g, ",");
            } else {
                $scope.userInfo["defaultConfirmResponse"] = '';
            }

            //Prioritized email
            if ('wpcf-priomail' in userMetaData && !isNullOrUndefined(userMetaData['wpcf-priomail'][0])) {
                $scope.userInfo["email"] = userMetaData['wpcf-priomail'][0];
            } else if ('user_email' in userData.data) {
                $scope.userInfo["email"] = userData.data.user_email;
            } else {
                $scope.userInfo["email"] = '';
            }
            $scope.initNewRoom();
            $scope.userInfoIsLoaded = true;
            $scope.getRoomsForUser();
            $scope.getBookingsForUser();

        });


        //MODALS
        var enterPasswordModal = null;
        $scope.openEnterPasswordModal = function () {
            enterPasswordModal = $modal.open({
                scope: $scope,
                templateUrl: '../layouts/templates/openEnterPasswordModal.html?v=1',
                show: true,
                size: 'md',
                backdrop: 'static',
                keyboard: false

            });
        };
        $scope.roomsForUser = [];

        $scope.tabs = {
            bookingTab: {
                "id": 1,
                "name": "Bokningar",
                "isOpen": true
            },
            roomTab: {
                "id": 2,
                "name": "Rum",
                "isOpen": false
            },
            userTab: {
                "id": 3,
                "name": "Mina uppgifter",
                "isOpen": false
            }
        }

        $scope.switchTab = function (tabId) {
            switch (tabId) {
            case 1:
                $scope.tabs.bookingTab.isOpen = true;
                $scope.tabs.roomTab.isOpen = false;
                $scope.tabs.userTab.isOpen = false;
                break;
            case 2:
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.roomTab.isOpen = true;
                $scope.tabs.userTab.isOpen = false;
                break;
            case 3:
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.roomTab.isOpen = false;
                $scope.tabs.userTab.isOpen = true;
                break;
            }
        };

        $scope.bookingStatuses = [
            {
                "id": 1,
                "status": "Väntar på bekräftelse",
                "isOpen": false,
                "bookings": 0
            },
            {
                "id": 2,
                "status": "Bekräftade",
                "isOpen": false,
                "bookings": 0
            },
            {
                "id": 3,
                "status": "Nekade",
                "isOpen": false,
                "bookings": 0
            },
            {
                "id": 4,
                "status": "Passerade",
                "isOpen": false,
                "bookings": 0
            },
            {
                "id": 5,
                "status": "Avbokade",
                "isOpen": false,
                "bookings": 0
            }
	];
        $scope.weekdays = [
            {
                "index": 1,
                "value": "monday",
                "displayName": "Måndag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-7a641ce9576c8e26d7faa64c75e9148f-1"
            },
            {
                "index": 2,
                "value": "tuesday",
                "displayName": "Tisdag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-55199bbd95148fe5905ba5d3bcccb9ed-1"
            },
            {
                "index": 3,
                "value": "wednesday",
                "displayName": "Onsdag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-5edb138b8c58f9b55ad25fd6cd890a23-1"
            },
            {
                "index": 4,
                "value": "thursday",
                "displayName": "Torsdag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-68f7c374a56aefa5cb16b22b9f055dd1-1"
            },
            {
                "index": 5,
                "value": "friday",
                "displayName": "Fredag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-307d9b3003cb28a30b486100d3a850bd-1"
            },
            {
                "index": 6,
                "value": "saturday",
                "displayName": "Lördag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-2e1cd86eb650ca8c8a124bdcbf5ffee8-1"
            },
            {
                "index": 7,
                "value": "sunday",
                "displayName": "Söndag",
                "isChecked": false,
                "fieldName": "wpcf-fields-checkboxes-option-a383b71a669dd5f90d2c5029960e43d5-1"
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
        $scope.roomSettings = [
            {
                index: 1,
                value: 'Aula'
            },
            {
                index: 2,
                value: 'Konferensrum'
            },
            {
                index: 3,
                value: 'Mötesrum'
            }
        ];
        //Sets the isChecked prop for each checkbox option
        $scope.setCheckboxValues = function (checkboxArray, funnyObject) {
            angular.forEach(checkboxArray, function (checkbox) {
                if (funnyObject.search(checkbox.value) > -1) {
                    checkbox.isChecked = true;
                }
            });
        };

        $scope.getCoordinates = function (room) {
            if (room.postalCity !== '' && !isNullOrUndefined(room.postalCity) && room.street !== '' && !isNullOrUndefined(room.street)) {
                room.validation.checkingAddress = true;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'address': room.street.concat(', ').concat(room.postalCity)
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        room.lat = results[0].geometry.location.lat();
                        room.lng = results[0].geometry.location.lng();
                        // set address variables from response 
                        $timeout(function () {
                            room.street = results[0].address_components[1].long_name.concat(' ').concat(results[0].address_components[0].long_name);
                            room.area = results[0].address_components[2].long_name;
                            room.postalCity = results[0].address_components[3].long_name;
                            room.validation.addressIsValid = true;
                        });

                    } else {
                        $timeout(function () {
                            room.lat = 0;
                            room.lng = 0;
                            room.validation.addressIsValid = false;
                        });

                    }
                    $timeout(function () {
                        room.validation.checkingAddress = false;
                    });

                });

            }
        };
        $scope.isHalfHour = function (hourString) {
            return parseFloat(hourString) % 1 > 0;
        };

        //Returns x.5 for numbers equal to x.3 (converting from time to number)
        $scope.toHalfNumber = function (floatNr) {
            if (floatNr % 1 > 0) {
                return floatNr + 0.2; //to 0.5
            } else {
                return floatNr;
            }
        };

        $scope.setEndTimeSlots = function (room) {
            if (room.startTime !== '' && !isNullOrUndefined(room.startTime)) {
                //Compare selected start time with end times
                angular.forEach(room.endTimeSlots, function (slot) {
                    if (room.startTime.slotFloat >= slot.slotFloat) {
                        slot.visible = false;
                    } else {
                        slot.visible = true;
                    }
                });
            }
        };

        $scope.getRoomTimeSlots = function () {
            var bookableTimeSlots = [];
            var startTime = $scope.toHalfNumber(0);
            var endTime = $scope.toHalfNumber(23.30);
            var nrOfSlots = (endTime - startTime) * 2;
            var currentSlot = 0;
            var currentSlotFloat = parseFloat(currentSlot);
            for (var i = 0; i <= nrOfSlots; i++) {
                if ($scope.isHalfHour(currentSlot)) {
                    currentSlotHour = Math.round(currentSlotFloat - 0.3);
                    var slotObject = {
                        slotString: currentSlot,
                        slotFloat: currentSlotFloat,
                        slot: currentSlotHour.toString().concat(':30'),
                        visible: true
                    };
                    bookableTimeSlots.push(slotObject);
                    currentSlotFloat += 0.7
                    currentSlot = currentSlotFloat.toString();

                } else {
                    currentSlotHour = currentSlotFloat;
                    var slotObject = {
                        slotString: currentSlot,
                        slotFloat: currentSlotFloat,
                        slot: currentSlotHour.toString().concat(':00'),
                        visible: true
                    };
                    bookableTimeSlots.push(slotObject);
                    currentSlotFloat += 0.3;
                    currentSlot = currentSlotFloat.toString()
                }
            }
            return bookableTimeSlots;
        };

        $scope.setRoomValidity = function (room) {
            room.validation.isValid = true;
            //var coords = $scope.getCoordinates(room.street.concat(', ').concat(room.city));
            if (room.lat === 0 || room.lng === 0) {
                room.validation.addressIsValid = false;
                room.validation.isValid = false;
            } else {
                room.validation.addressIsValid = true;
            }
            if (parseFloat(room.endTime) < parseFloat(room.startTime)) {
                room.validation.endTimeToLittle = true;
                room.validation.isValid = false;
            } else {
                room.validation.endTimeToLittle = false;
            }
            if (parseInt(room.setting) < 1) {
                room.validation.roomTypeSelected = false;
                room.validation.isValid = false;
            } else {
                room.validation.roomTypeSelected = true;
            }
        };

        $scope.bookingsForUser = [];
        $scope.addNewRoom = false;
        $scope.hostComment = "";
        $scope.bookingStatusIsUpdated = false;
        $scope.updateMessage = '';

        $scope.showOrHideNewRoom = function () {
            $scope.addNewRoom = !$scope.addNewRoom;
        }

        $scope.initNewRoom = function () {
            $scope.newRoom = {
                id: 0,
                title: "",
                content: "",
                url: '',
                contactPerson: $scope.userInfo.displayname,
                contactEmail: $scope.userInfo.email,
                contactPhone: $scope.userInfo.phone,
                hostId: $scope.userInfo.id,
                cancelDeadline: $scope.userInfo.cancelDeadline,
                nrOfPeople: "",
                price: "",
                area: "",
                startTime: "",
                endTime: "",
                street: "",
                city: "",
                postalCity: "",
                status: 'publish',
                webPage: $scope.userInfo.url,
                setting: 0,
                showOnMeetrd: 0,
                lat: 0,
                lng: 0,
                photo: 'http://www.meetrd.se/wp-content/themes/meetrd/layouts/Images/exempel-rumsbild.jpg',
                croppedPhoto: 'http://www.meetrd.se/wp-content/themes/meetrd/layouts/Images/exempel-rumsbild-cropped.jpg',
                food: {
                    src: "",
                    food: angular.copy($scope.food)
                },
                weekdays: {
                    src: "",
                    days: angular.copy($scope.weekdays)
                },
                equipment: {
                    src: "",
                    equipment: angular.copy($scope.equipment)
                },
                validation: {
                    checkingAddress: false,
                    addressIsValid: true,
                    roomTypeSelected: true,
                    isValid: true,
                    isUpdating: false,
                    wasUpdated: false
                },
                startTimeSlots: $scope.getRoomTimeSlots(),
                endTimeSlots: $scope.getRoomTimeSlots()
            };
            $scope.forms.addNewRoomForm.$setPristine();
        }


        $scope.getRoomsForUser = function () {
            hostSvc.getRoomsForUser($scope.userId).then(function (response) {
                angular.forEach(response.data.posts, function (room) {
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
                        room['endTime'] = {
                            slotString: '',
                            slotFloat: parseFloat(room['custom_fields']['wpcf-end-time'][0]),
                            slot: '',
                            visible: true
                        };
                    }
                    if ('wpcf-host-id' in room['custom_fields']) {
                        room['hostId'] = room['custom_fields']['wpcf-host-id'][0];
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
                        room['startTime'] = {
                            slotString: '',
                            slotFloat: parseFloat(room['custom_fields']['wpcf-start-time'][0]),
                            slot: '',
                            visible: true
                        };
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
                    if ('wpcf-postal-city' in room['custom_fields']) {
                        room['postalCity'] = room['custom_fields']['wpcf-postal-city'][0];
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
                    if ('wpcf-room-setting' in room['custom_fields']) {
                        room['setting'] = parseInt(room['custom_fields']['wpcf-room-setting'][0]);
                    }
                    if ('wpcf-show-on-meetrd' in room['custom_fields']) {
                        room['showOnMeetrd'] = parseInt(room['custom_fields']['wpcf-show-on-meetrd'][0]);
                    } else {
                        room['showOnMeetrd'] = 1;
                    }
                    if (room.showOnMeetrd === 1) {
                        room.showOnMeetrd === true;
                    } else {
                        room.showOnMeetrd === false;
                    }
                    if ('wpcf-street-address' in room['custom_fields']) {
                        room['street'] = room['custom_fields']['wpcf-street-address'][0];
                        room['address'] = room.street + ", " + room.city;
                    }
                    if ('wpcf-days' in room['custom_fields']) {
                        room['weekdays'] = {
                            src: room['custom_fields']['wpcf-days'][0],
                            days: angular.copy($scope.weekdays)
                        };
                    }
                    if ('wpcf-food' in room['custom_fields']) {
                        room['food'] = {
                            src: room['custom_fields']['wpcf-food'][0],
                            food: angular.copy($scope.food)
                        };
                    }
                    if ('wpcf-equipment' in room['custom_fields']) {
                        room['equipment'] = {
                            src: room['custom_fields']['wpcf-equipment'][0],
                            equipment: angular.copy($scope.equipment)
                        };
                    }
                    room['validation'] = {
                        checkingAddress: false,
                        addressIsValid: false,
                        roomTypeSelected: true,
                        isValid: true,
                        isUpdating: false,
                        wasUpdated: false
                    };
                    room['startTimeSlots'] = $scope.getRoomTimeSlots();
                    room['endTimeSlots'] = $scope.getRoomTimeSlots();
                    $scope.setEndTimeSlots(room);

                    $scope.setCheckboxValues(room.weekdays.days, room.weekdays.src);
                    $scope.setCheckboxValues(room.food.food, room.food.src);
                    $scope.setCheckboxValues(room.equipment.equipment, room.equipment.src);
                    room['inEditMode'] = false;
                    $scope.roomsForUser.push(room);
                });
            });
        };

        $scope.sendOutDatedBookingMail = function (booking) {
            var mailTemplateSlug = "automatiskt-svar-till-gast-efter-24h-2";
            var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
            var hostInfo = $scope.getHostContactInfoMail(booking);
            //Replace HOST and GUEST in mailtemplate with the actual names, and booking id and host comment with the actual values
            mailTpl.body = mailTpl.body.replace("GUEST", booking.contact).replace(/HOST/g, $scope.userInfo.nickname).replace("BOOKINGID", booking.id);
            mailTpl.body = mailTpl.body + hostInfo;
            hostSvc.sendMail(booking.email, mailTpl.subject, mailTpl.body).then(function (response) {
                console.log('Mail returned true');
                var mailSucceded = true;
                $scope.bookingStatusIsUpdated = true;
            }).catch(function () {
                console.log('Error send mail');
                var mailSucceded = false;
                $scope.bookingStatusIsUpdated = true;
            });
        }

        $scope.getBookingSlot = function (startTime, endTime) {
            var slot = '';
            if (startTime % 1 > 0) {
                slot = slot.concat(parseInt(startTime).toString()).concat(':30-');
            } else {
                slot = slot.concat(startTime).concat(':00-');
            }
            if (endTime % 1 > 0) {
                slot = slot.concat(parseInt(endTime).toString()).concat(':30');
            } else {
                slot = slot.concat(endTime).concat(':00');
            }
            return slot;
        };

        $scope.getBookingsForUser = function () {
            hostSvc.getBookingsForUser($scope.userId).then(function (response) {
                if (response.data.posts.length === 0) {
                    $scope.bookingsAreLoaded = true;
                };
                var bookingCount = 1;
                angular.forEach(response.data.posts, function (booking) {

                    if ('wpcf-booking-date' in booking['custom_fields']) {
                        booking["bookingDate"] = moment.unix(booking['custom_fields']['wpcf-booking-date'][0]).format('YYYY-MM-DD');
                    }
                    if ('wpcf-booking-starttime' in booking['custom_fields']) {
                        booking["startTime"] = booking['custom_fields']['wpcf-booking-starttime'][0];
                    }
                    if ('wpcf-booking-endtime' in booking['custom_fields']) {
                        booking["endTime"] = booking['custom_fields']['wpcf-booking-endtime'][0];
                    };
                    if ('wpcf-phone' in booking['custom_fields']) {
                        booking["phone"] = booking['custom_fields']['wpcf-phone'][0];
                    };
                    if ('wpcf-room-id' in booking['custom_fields']) {
                        booking["roomId"] = booking['custom_fields']['wpcf-room-id'][0];
                    };
                    if ('wpcf-host-id' in booking['custom_fields']) {
                        booking["hostId"] = booking['custom_fields']['wpcf-host-id'][0];
                    };
                    if ('wpcf-e-mail' in booking['custom_fields']) {
                        booking["email"] = booking['custom_fields']['wpcf-e-mail'][0];
                    };
                    if ('wpcf-total-price' in booking['custom_fields']) {
                        booking["price"] = booking['custom_fields']['wpcf-total-price'][0];
                    };
                    if ('wpcf-duration' in booking['custom_fields']) {
                        booking["duration"] = booking['custom_fields']['wpcf-duration'][0];
                    };
                    if ('wpcf-contact-person' in booking['custom_fields']) {
                        booking["contact"] = booking['custom_fields']['wpcf-contact-person'][0];
                    };
                    if ('wpcf-booking-status' in booking['custom_fields']) {
                        booking["bookingStatus"] = parseInt(booking['custom_fields']['wpcf-booking-status'][0]);
                    };
                    if ('wpcf-room-name' in booking['custom_fields']) {
                        booking["roomName"] = booking['custom_fields']['wpcf-room-name'][0];
                    };
                    if ('wpcf-booking-starttime' in booking['custom_fields'] && 'wpcf-booking-endtime' in booking['custom_fields']) {
                        //booking["slot"] = $scope.formatHour(booking.startTime) + ":00-" + $scope.formatHour(booking.endTime) + ":00";
                        booking["slot"] = $scope.getBookingSlot(booking.startTime, booking.endTime);

                    };
                    if ('wpcf-guest-biography' in booking['custom_fields']) {
                        booking["guestBiography"] = booking['custom_fields']['wpcf-guest-biography'][0].replace(/"/g, "").replace(/;/g, ",");
                    };
                    if ('wpcf-billing-address' in booking['custom_fields']) {
                        booking["billingAddress"] = booking['custom_fields']['wpcf-billing-address'][0].replace(/;/g, ",");
                    } else {
                        booking["billingAddress"] = "";
                    }
                    if ('wpcf-host-comment' in booking['custom_fields']) {
                        booking["hostComment"] = booking['custom_fields']['wpcf-host-comment'][0].replace(/;/g, ",");
                    } else {
                        booking["hostComment"] = "";
                    }
                    if ('wpcf-read-by-host' in booking['custom_fields']) {
                        booking["readByHost"] = parseInt(booking['custom_fields']['wpcf-read-by-host'][0]);
                        if (booking.readByHost === 0) {
                            booking.readByHost = false;
                        } else {
                            booking.readByHost = true;
                        }
                    };
                    //Format the booking content
                    booking["comments"] = booking.content.replace(/;/g, ",").replace("<p>", "").replace("</p>", "");
                    booking["authorId"] = booking['author'].id;
                    booking["showDetails"] = false;
                    //If the booking is pending, then check if it outdated
                    if (booking.bookingStatus === 1) {
                        var bookingIsOutDated = $scope.isBookingOutDated(booking);
                        if (bookingIsOutDated) {
                            booking.bookingStatus = 3;
                            booking.hostComment = "Din bokningsförfrågan inte besvarats inom 24 timmar och har därmed avslagits.";
                            //$scope.sendOutDatedBookingMail(booking);
                            $scope.updateBooking(booking);
                        }
                    }

                    //Check for bookings that are not passed but maybe should be set to passed. If they have passed, then update the status.
                    if (booking.bookingStatus !== 4) {
                        var bookingHasPassed = $scope.hasBookingPassed(booking);
                        if (bookingHasPassed) {
                            booking.bookingStatus = 4;
                            $scope.updateBooking(booking);
                        }
                    }
                    $scope.addBookingCountToStatus(booking);

                    $scope.bookingsForUser.push(booking);
                    if (bookingCount === response.data.posts.length) {
                        setTimeout(function () {
                            $scope.$apply($scope.bookingsAreLoaded = true);

                        }, 50);
                    };
                    bookingCount++;
                });
            });
        };

        /* SCOPE FUNCTIONS */
        //Checks if the booking is passed.
        $scope.hasBookingPassed = function (booking) {
            var now = moment(); //Now as timestamp
            var bookingStart = moment(booking.bookingDate).add(parseInt(booking.startTime), 'hours');
            var bookingEnd = moment(booking.bookingDate).add(parseInt(booking.endTime), 'hours');
            var diff = bookingEnd.diff(now);
            return diff < 0;
        };

        $scope.addBookingCountToStatus = function (booking) {
            angular.forEach($scope.bookingStatuses, function (status) {
                if (booking.bookingStatus === status.id) {
                    status.bookings++;
                }
            });
        };
        $scope.updateBookingCounts = function () {
            angular.forEach($scope.bookingStatuses, function (status) {
                status.bookings = 0;
            });
            angular.forEach($scope.bookingsForUser, function (booking) {
                angular.forEach($scope.bookingStatuses, function (status) {
                    if (booking.bookingStatus === status.id) {
                        status.bookings++;
                    }
                });
            });

        };
        //Checks if a booking with status "pending" has been created more than 24h ago
        $scope.isBookingOutDated = function (pendingBooking) {
            var now = moment();
            var bookingCreationMoment = moment(pendingBooking.date);
            var diff = now.diff(bookingCreationMoment);
            var oneDay = 1000 * 60 * 60 * 24; //24 h as timestamp (milliseconds)
            //var twomin = 1000*60*2;
            return diff > oneDay;
        };

        $scope.editRoom = function (roomId) {
            angular.forEach($scope.roomsForUser, function (room) {
                if (room.id === roomId) {
                    room.inEditMode = !room.inEditMode;
                } else {
                    room.inEditMode = false;
                }
            });
        };

        $scope.createRoom = function () {
            $scope.setRoomValidity($scope.newRoom);
            if ($scope.newRoom.validation.isValid) {
                $scope.newRoom.validation.isUpdating = true;
                hostSvc.getCreationNonce().then(function (response) {
                    hostSvc.createRoom(response, $scope.newRoom).then(function (response) {
                        $scope.newRoom.id = response.data.post.id;
                        $scope.newRoom.url = response.data.post.url;
                        $scope.updateRoom($scope.newRoom, true);
                    });

                }).catch(function () {
                    console.log('Error in createRoom!');
                });
            }
        };

        $scope.updateRoom = function (room, isNewRoom) {
            if (!isNewRoom) {
                $scope.setRoomValidity(room);
            }
            if (room.validation.isValid) {
                room.validation.isUpdating = true;
                room.validation.wasUpdated = false;
                hostSvc.getUpdatingNonce().then(function (response) {
                    hostSvc.updateRoom(response, room).then(function (response) {
                        room.validation.isUpdating = false;
                        room.validation.wasUpdated = true;
                        room.inEditMode = false;
                        $timeout(function () {
                            room.validation.wasUpdated = false;
                        }, 3000);
                        if (isNewRoom) {
                            $scope.addNewRoom = false;
                            $scope.updateMessage = room.title.concat(' har skapats!');
                            $scope.initNewRoom();
                            $scope.roomsForUser.push(room);
                            //Send notification mail to admin
                            hostSvc.sendMail('support@meetrd.se', 'Nytt rum upplagt!', 'Ett nytt rum har lagts upp. Yo! =)<br>Namn: '.concat(room.title)).then(function (response) {
                                console.log('Mail returned true');
                            }).catch(function () {
                                console.log('Error send mail');
                            });

                        } else {
                            $scope.updateMessage = room.title.concat(' har uppdaterats!');
                        }
                    });

                }).catch(function () {
                    console.log('Error in updateRoom!');
                    room.validation.isUpdating = false;
                    room.validation.wasUpdated = false;
                });
            }
        };

        $scope.setUpdateModalTexts = function (isApproval, booking) {
            //setting the clicked booking to a scope variable to update the right booking from the modal
            $scope.clickedBooking = booking;

            $scope.showCommentInput = true;
            if (isApproval) {
                $scope.isApproval = true;
                $scope.currentBookingPrice = booking.price;
                $scope.updateBookingModalTitle = "Godkänn bokningsförfrågan";
                $scope.updateBookingModalBody = "Är du säker på att du vill godkänna denna bokningsförfrågan?";
                $scope.hostComment = angular.copy($scope.userInfo.defaultConfirmResponse);

                //If the booking is rejected
            } else {
                $scope.isApproval = false;
                $scope.updateBookingModalTitle = "Neka bokningsförfrågan";
                $scope.updateBookingModalBody = "Är du säker på att du vill neka denna bokningsförfrågan?";
                $scope.showUpdateBookingModal = true;
                $scope.hostComment = angular.copy($scope.userInfo.defaultDenyResponse);
            }
        };

        //TODO: Fix error handling of update booking
        $scope.approveBooking = function (hostComment, currentBookingPrice) {
            var booking = $scope.clickedBooking;
            booking.bookingStatus = 2;
            booking.hostComment = hostComment;
            booking.price = parseInt(currentBookingPrice);
            $scope.showCommentInput = false;
            $scope.updateBookingModalBody = "Din bokning uppdateras...";

            //Update booking
            hostSvc.getUpdatingNonce().then(function (response) {
                jQuery('.modal-backdrop').hide()
                jQuery('#updateBookingModal').modal('show');
                hostSvc.updateBooking(response, booking).then(function (response) {
                    $scope.updateBookingModalBody = "Din bokning har uppdaterats. Skickar mail...";

                    //Send mail to the guest
                    //Get mail template
                    var mailTemplateSlug = "bekraftelse-mail-till-gast";
                    var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                    var hostInfo = $scope.getHostContactInfoMail(booking);
                    //Replace HOST and GUEST in mailtemplate with the actual names, and booking id and host comment with the actual values
                    mailTpl.body = mailTpl.body.replace("GUEST", booking.contact).replace(/HOST/g, $scope.userInfo.nickname).replace("BOOKINGID", booking.id);
                    mailTpl.body = mailTpl.body + hostInfo;
                    hostSvc.sendMail(booking.email, mailTpl.subject, mailTpl.body).then(function (response) {
                        console.log('Mail returned true');
                        var mailSucceded = true;
                        $scope.bookingStatusIsUpdated = true;
                        $scope.updateBookingModalBody = "Din bokningsförfrågan har godkänts! En mailbekräftelse har skickats till gästen.";
                    }).catch(function () {
                        console.log('Error send mail');
                        var mailSucceded = false;
                        $scope.bookingStatusIsUpdated = true;
                        $scope.updateBookingModalBody = "Det uppstod ett fel vid sändning av mail. Kontakta Meetrd på support@meetrd.se";

                    });
                }).catch(function () {
                    console.log('Error in updateBooking!');
                    $scope.updateBookingModalBody = "Det uppstod ett fel i din bokning. Kontakta Meetrd på support@meetrd.se";

                });
            });
        };

        //TODO: Fix error handling of update booking
        $scope.rejectBooking = function (hostComment) {
            var booking = $scope.clickedBooking;
            booking.bookingStatus = 3;
            booking.hostComment = hostComment;
            $scope.showCommentInput = false;
            $scope.updateBookingModalBody = "Din bokning uppdateras...";
            //Update booking
            hostSvc.getUpdatingNonce().then(function (response) {
                jQuery('.modal-backdrop').hide()
                jQuery('#updateBookingModal').modal('show');
                hostSvc.updateBooking(response, booking).then(function (response) {
                    $scope.updateBookingModalBody = "Din bokning har uppdaterats. Skickar mail...";
                    //Send mail to the guest
                    //Get mail template
                    var mailTemplateSlug = "avslag-till-gast";
                    var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                    //Replace HOST and GUEST in mailtemplate with the actual names, and booking id and host comment with the actual values
                    mailTpl.body = mailTpl.body.replace("GUEST", booking.contact).replace("HOSTCOMMENT", '<b>Kommentar från värden</b><br>' + booking.hostComment).replace(/HOST/g, $scope.userInfo.nickname).replace("BOOKINGID", booking.id);
                    hostSvc.sendMail(booking.email, mailTpl.subject, mailTpl.body).then(function (response) {
                        console.log('Mail returned true');
                        var mailSucceded = true;
                        $scope.bookingStatusIsUpdated = true;
                        $scope.updateBookingModalBody = "Din bokningsförfrågan har avslagits. En mailbekräftelse har skickats till gästen.";
                    }).catch(function () {
                        console.log('Error send mail');
                        var mailSucceded = false;
                        $scope.bookingStatusIsUpdated = true;
                        $scope.updateBookingModalBody = "Det uppstod ett fel vid sändning av mail. Kontakta Meetrd på support@meetrd.se";

                    });
                }).catch(function () {
                    console.log('Error in updateBooking!');
                    $scope.updateBookingModalBody = "Det uppstod ett fel i din bokning. Kontakta Meetrd på support@meetrd.se";

                });
            });
        };

        $scope.updateBooking = function (booking) {
            $scope.updateBookingCounts();
            hostSvc.getUpdatingNonce().then(function (response) {
                hostSvc.updateBooking(response, booking).then(function (response) {});

            }).catch(function () {
                console.log('Error in updateBooking!');
            });
        };

        $scope.updateUserInfo = function (password) {
            $scope.resetUpdateUserInfo();
            $scope.clickedUpdateUserInfo = true;
            hostSvc.generateUserCookie($scope.userInfo.userLogin, password).then(function (response) {
                hostSvc.updateUserInfo(response.data.cookie, $scope.userInfo).then(function (response) {
                    //Update the cancel deadline prop for all the host's rooms
                    var roomCount = 1;
                    angular.forEach($scope.roomsForUser, function (room) {
                        hostSvc.getUpdatingNonce().then(function (response) {
                            room.cancelDeadline = $scope.userInfo.cancelDeadline;
                            hostSvc.updateRoom(response, room).then(function (response) {
                                if (roomCount === $scope.roomsForUser.length) {
                                    $scope.userInfoUpdated = true;

                                };
                                roomCount++;
                            });

                        }).catch(function () {
                            console.log('Error in updateRoom!');
                        });

                    });

                }).catch(function () {
                    console.log("Error in updateUserInfo!");
                    $scope.triedToUpdateUserInfo = true;
                    $scope.clickedUpdateUserInfo = false;
                    $scope.userInfoUpdated = false;
                });
            });
        };
        //Resets the variables used for updating userinfo
        $scope.resetUpdateUserInfo = function () {
            $scope.userInfoUpdated = false;
            $scope.userPass = "";
            $scope.triedToUpdateUserInfo = false;
            $scope.clickedUpdateUserInfo = false;

        };
        $scope.reloadPage = function () {
            location.reload();
        };
        //Creates the slot string in the correct format, adding 0 to the hours that are less than 10
        $scope.formatHour = function (hour) {
            if (hour < 10) {
                return "0" + hour;
            } else {
                return hour.toString();
            }
        };

        //SEND MAIL
        $scope.mailTemplates = [];

        $scope.getAllMailTemplates = function () {
            hostSvc.getAllMailTemplates().then(function (response) {
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
            hostSvc.sendMail(recipient, subject, body).then(function (response) {
                console.log('Mail returned true');
                var mailSucceded = true;
                return mailSucceded;

            }).catch(function () {
                console.log('Error send mail');
                var mailSucceded = false;
                return mailSucceded;
            });
        };

        $scope.getHostContactInfoMail = function (booking) {
            var hostInfo = $scope.userInfo;
            var mailString = "";
            mailString = mailString.
            concat('<h2>Värdens kontaktuppgifter</h2>').
            concat('<p><b>Bokningsnummer</b><br>' + booking.id + '<br>').
            concat('<b>Värd</b><br>' + hostInfo.nickname + '<br>').
            concat('<b>E-mail</b><br>' + hostInfo.email + '<br>').
            concat('<b>Telefonnummer</b><br>' + hostInfo.phone + '<br>').
            concat('<b>Hemsida</b><br>' + hostInfo.url + '<br></p>').
            concat('<p><b>Kommentar från värden</b><br>' + booking.hostComment + '<br></p>');
            return mailString;
        };
        $scope.openOrCloseStatusContainer = function (status) {
            //If an opened status is clicked
            if (status.isOpen) {
                status.isOpen = false;
            } else {

                angular.forEach($scope.bookingStatuses, function (loopedStatus) {
                    if (status.id === loopedStatus.id) {
                        status.isOpen = true;
                    } else {
                        loopedStatus.isOpen = false;
                    }
                });
            }

        };
        $scope.openOrCloseBookingDetails = function (booking) {
            //If an opened status is clicked
            if (booking.showDetails) {
                booking.showDetails = false;
            } else {

                angular.forEach($scope.bookingsForUser, function (loopedBooking) {
                    if (booking.id === loopedBooking.id) {
                        booking.showDetails = true;
                    } else {
                        loopedBooking.showDetails = false;
                    }
                });
            }

        };
    };

});