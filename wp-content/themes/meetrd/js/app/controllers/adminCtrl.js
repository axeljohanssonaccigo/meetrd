var adminApp = angular.module('adminApp', ['meetrdLoaderDir']);



adminApp.controller('adminCtrl', function ($scope, adminSvc) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }

    //redirecting the user to login page if not already logged in
    $scope.userIsLoggedIn = userIsLoggedIn;
    if (!$scope.userIsLoggedIn) {
        window.location.href = window.location.origin + urlPathNameAddOn + '/wp-login.php';
    } else if (userData.roles[0] !== 'administrator') {
        window.location.href = window.location.origin + urlPathNameAddOn;
    } else {

        /* SCOPE VARIABLES */
        $scope.userData = userData;
        $scope.userData["roleDisplayName"] = "Administratör";
        $scope.allHosts = allHosts;
        $scope.allGuests = allGuests;
        $scope.bookingsAreLoaded = false;
        $scope.allRooms = [];
        $scope.tabs = {
            bookingTab: {
                "id": 1,
                "name": "Bokningar",
                "isOpen": true,
                "target": "_self"
            },
            roomTab: {
                "id": 2,
                "name": "Rum",
                "isOpen": false,
                "target": "_self"
            },

            hostTab: {
                "id": 3,
                "name": "Värdar",
                "isOpen": false,
                "target": "_self"
            },
            guestTab: {
                "id": 4,
                "name": "Gäster",
                "isOpen": false,
                "target": "_self"
            }

        };

        //Redirect paths
        $scope.newRoomPath = '/wp-admin/post-new.php?post_type=room';
        $scope.newUserPath = '/wp-admin/user-new.php';

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
        $scope.allBookings = [];
        $scope.addNewRoomFormIsShown = false;
        //$scope.userSlug = userSlug;
        $scope.newRoom = {
            title: "",
            content: "",
            contactPerson: "",
            webPage: "",
            hostId: "",
            nrOfPeople: "",
            price: "",
            startTime: "8",
            endTime: "17"

        };
        /* GET ALL ROOMS AND BOOKINGS */
        adminSvc.getAllRooms().then(function (response) {
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
                    room['endTime'] = room['custom_fields']['wpcf-end-time'][0];
                }
                if ('wpcf-host-id' in room['custom_fields']) {
                    room['hostId'] = room['custom_fields']['wpcf-host-id'][0];
                }
                if ('wpcf-nr-of-people' in room['custom_fields']) {
                    room['nrOfPeople'] = room['custom_fields']['wpcf-nr-of-people'][0];
                }
                if ('wpcf-price' in room['custom_fields']) {
                    room['price'] = room['custom_fields']['wpcf-price'][0];
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
                if ('wpcf-street-address' in room['custom_fields']) {
                    room['address'] = room['custom_fields']['wpcf-street-address'][0];
                }
                if ('wpcf-rating' in room['custom_fields']) {
                    room['rating'] = room['custom_fields']['wpcf-rating'][0];
                }
                if ('wpcf-review' in room['custom_fields']) {
                    room['review'] = room['custom_fields']['wpcf-review'][0];
                };
                if ('wpcf-cancel-deadline' in room['custom_fields']) {
                    room['cancelDeadline'] = room['custom_fields']['wpcf-cancel-deadline'][0];
                };
                room['inEditMode'] = false;
                $scope.allRooms.push(room);

            });
        });
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

        adminSvc.getAllBookings().then(function (response) {
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
                    booking["slot"] = $scope.getBookingSlot(booking.startTime, booking.endTime);
                };
                if ('wpcf-guest-biography' in booking['custom_fields']) {
                    booking['guestBiography'] = booking['custom_fields']['wpcf-guest-biography'][0];
                };
                if ('wpcf-host-comment' in booking['custom_fields']) {
                    booking["hostComment"] = booking['custom_fields']['wpcf-host-comment'][0].replace(/;/g, ",");
                };
                if ('wpcf-read-by-host' in booking['custom_fields']) {
                    booking["readByHost"] = parseInt(booking['custom_fields']['wpcf-read-by-host'][0]);
                    if (booking.readByHost === 0) {
                        booking.readByHost = false;
                    } else {
                        booking.readByHost = true;
                    }
                };
                booking["authorId"] = booking['author'].id;
                booking["comments"] = booking.content.replace(/;/g, ",").replace("<p>", "").replace("</p>", "");
                booking["showDetails"] = false;


                //If the booking is pending, then check if it outdated
                if (booking.bookingStatus === 1) {
                    var bookingIsOutDated = $scope.isBookingOutDated(booking);
                    if (bookingIsOutDated) {
                        booking.bookingStatus = 3;
                        booking.hostComment = "Din bokningsförfrågan inte besvarats inom 24 timmar och har därmed avslagits.";

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
                $scope.allBookings.push(booking);
            });
            $scope.updateBookingCounts();
            $scope.bookingsAreLoaded = true;


        });

        /* SCOPE FUNCTIONS */
        //Checks if the booking is passed.
        $scope.hasBookingPassed = function (booking) {
            var now = moment(); //Now as timestamp
            var bookingStart = moment(booking.bookingDate).add(parseInt(booking.startTime), 'hours');
            var bookingEnd = moment(booking.bookingDate).add(parseInt(booking.endTime), 'hours');
            var diff = bookingEnd.diff(now);
            console.log("has booking passed?")
            console.log(diff < 0);
            return diff < 0;
        };
        //Checks if a booking with status "pending" has been created more than 24h ago
        $scope.isBookingOutDated = function (pendingBooking) {
            var now = moment();
            var bookingCreationMoment = moment(pendingBooking.date);
            var diff = now.diff(bookingCreationMoment);
            var oneDay = 1000 * 60 * 60 * 24; //24 h as timestamp (milliseconds)
            //var twomin = 1000*60*2;
            console.log("is booking outdated? " + pendingBooking.id)
            return diff > oneDay;
        };

        $scope.switchTab = function (tabId) {
            switch (tabId) {
            case 1:
                $scope.tabs.roomTab.isOpen = false;
                $scope.tabs.bookingTab.isOpen = true;
                $scope.tabs.hostTab.isOpen = false;
                $scope.tabs.guestTab.isOpen = false;

                break;
            case 2:
                $scope.tabs.roomTab.isOpen = true;
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.hostTab.isOpen = false;
                $scope.tabs.guestTab.isOpen = false;

                break;
            case 3:
                $scope.tabs.roomTab.isOpen = false;
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.hostTab.isOpen = true;
                $scope.tabs.guestTab.isOpen = false;
                break;
            case 4:
                $scope.tabs.roomTab.isOpen = false;
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.hostTab.isOpen = false;
                $scope.tabs.guestTab.isOpen = true;
                break;
            case 5:
                window.location.href = window.location.origin + urlPathNameAddOn + "/wp-admin";
                break;


            }
        };

        $scope.showAddNewRoomForm = function () {
            $scope.addNewRoomFormIsShown = true;
        };

        $scope.goToAddNewRoomForm = function () {
            window.location.href = window.location.origin + urlPathNameAddOn + '/wp-admin/post-new.php?post_type=room'
        };

        $scope.goTo = function (path, newTab) {
            var url = window.location.origin + urlPathNameAddOn + path;
            if (newTab) {
                //var win = window.open(url, '_blank');
                window.location.href = url;

            } else {
                window.location.href = url;
            }
        };

        $scope.editItem = function (itemId) {
            $scope.goTo('/wp-admin/post.php?post=' + itemId + '&action=edit')
                // angular.forEach($scope.allRooms, function(room){
                // 	if (room.id === roomId) {
                // 		room.inEditMode = !room.inEditMode;
                // 	} else {
                // 		room.inEditMode = false;
                // 	}
                // });
        };

        $scope.createRoom = function () {
            adminSvc.getCreationNonce().then(function (response) {
                adminSvc.createRoom(response, $scope.newRoom).then(function (response) {});

            }).catch(function () {
                console.log('Error in createRoom!');
            });
        };
        $scope.createRoomForHost = function (host) {
            adminSvc.getCreationNonce().then(function (response) {
                adminSvc.createRoomForHost(response.data.nonce, host).then(function (response) {
                    //If the custom fields have not been set properly, then update the room then go to edit mode in wp-admin
                    if (!('wpcf-host-id' in response.data.post.custom_fields)) {
                        var room = response.data.post;
                        room['hostId'] = host.ID;
                        room['contactPerson'] = host.first_name[0] + " " + host.last_name[0];
                        room['webpage'] = host.data.user_url;
                        room['contactEmail'] = host.data.user_email;
                        room['contactPhone'] = host['wpcf-phone'][0];
                        room['cancelDeadline'] = host['wpcf-cancel-deadline'][0];
                        adminSvc.getUpdatingNonce().then(function (response) {
                            adminSvc.updateRoom(response, room).then(function (response) {
                                $scope.goTo('/wp-admin/post.php?post=' + response.data.post.id + '&action=edit', true);
                            }).catch(function () {
                                console.log('Error in updateRoom!');
                            });

                        });
                    } else {
                        $scope.goTo('/wp-admin/post.php?post=' + response.data.post.id + '&action=edit', true);
                    }

                }).catch(function () {
                    console.log('Error in createRoom!');
                });
            });
        };

        $scope.updateRoom = function (room) {
            adminSvc.getUpdatingNonce().then(function (response) {
                adminSvc.updateRoom(response, room).then(function (response) {

                });

            }).catch(function () {
                console.log('Error in updateRoom!');
            });
        };

        $scope.approveBooking = function (booking) {
            booking.bookingStatus = 2;
            $scope.updateBooking(booking);
        };


        $scope.rejectBooking = function (booking) {
            booking.bookingStatus = 3;
            $scope.updateBooking(booking);
        };

        $scope.updateBooking = function (booking) {
            adminSvc.getUpdatingNonce().then(function (response) {
                adminSvc.updateBooking(response, booking).then(function (response) {});

            }).catch(function () {
                console.log('Error in updateBooking!');
            });
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
            angular.forEach($scope.allBookings, function (booking) {
                angular.forEach($scope.bookingStatuses, function (status) {
                    if (booking.bookingStatus === status.id) {
                        status.bookings++;
                    }
                });
            });

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

                angular.forEach($scope.allBookings, function (loopedBooking) {
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