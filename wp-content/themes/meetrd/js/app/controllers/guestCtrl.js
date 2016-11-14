var guestApp = angular.module('guestApp', ['meetrdLoaderDir']);



guestApp.controller('guestCtrl', function ($scope, guestSvc) {
    //Custom hack to fix the /Meetrd url in dev and test. urlPathNameAddOn is added at the beginning of the urls.
    if (window.location.pathname.substr(0, 7) === "/Meetrd") {
        var urlPathNameAddOn = "/Meetrd";
    } else if (window.location.pathname.substr(0, 7) === "/meetrd") {
        var urlPathNameAddOn = "/meetrd";
    } else {
        var urlPathNameAddOn = "";
    }


    $scope.userIsLoggedIn = userIsLoggedIn;
    if (!$scope.userIsLoggedIn) {
        //If the user is not logged in, wait for document ready and then click the hidden login button in page-guest.php
        jQuery(document).ready(function () {
            jQuery("#menuLoginButton")[0].click()
        });
    } else {


        /* SCOPE VARIABLES */
        $scope.dataIsLoaded = false;
        $scope.bookingsForUser = [];
        //Contains all the unique hostids for the user's bookings
        $scope.bookingHostIds = [];
        //Contains all hosts for the user's bookings
        $scope.bookingHosts = [];
        //Contains all the unique roomIds for the user's bookings
        $scope.bookingRoomIds = [];
        //Contains all rooms for the user's bookings
        $scope.bookingRooms = [];
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
        $scope.roomsForUser = [];
        $scope.triedToUpdateUserInfo = false;
        $scope.bookingsForUserLoaded = false;

        $scope.tabs = {
            bookingTab: {
                "id": 1,
                "name": "Bokningar",
                "isOpen": true
            },
            userTab: {
                "id": 2,
                "name": "Mina uppgifter",
                "isOpen": false
            }
        }
        $scope.userId = userId;

        //Get user info
        guestSvc.getUserInfo($scope.userId).then(function (response) {
            $scope.userInfo = response.data;
            $scope.userInfo["userLogin"] = userData.data.user_login;
            //Replace the "" that is added when getting the description.
            //Replace all ; by , since the opposite is done when updating. The url does not take commas.
            $scope.userInfo["biography"] = userMetaData.description[0].replace(/"/g, "").replace(/;/g, ",");
            $scope.userInfo["role"] = userData.roles[0];
            $scope.userInfo["roleDisplayName"] = "Gäst";
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

            $scope.getBookingsForUser();
            //Set timeout to make sure the bookings have been initialized
            setTimeout(function () {
                $scope.$apply($scope.bookingsForUserLoaded = true);
            }, 50);
        });

        //Get bookings for user
        $scope.getBookingsForUser = function () {
            guestSvc.getBookingsForUser($scope.userId).then(function (response) {
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
                    if ('wpcf-booking-status' in booking['custom_fields']) {
                        booking["bookingStatus"] = parseInt(booking['custom_fields']['wpcf-booking-status'][0]);
                    };
                    if ('wpcf-room-id' in booking['custom_fields']) {
                        booking["roomId"] = booking['custom_fields']['wpcf-room-id'][0];
                        $scope.bookingRoomIds.push(parseInt(booking.roomId));
                    };
                    if ('wpcf-host-id' in booking['custom_fields']) {
                        booking["hostId"] = booking['custom_fields']['wpcf-host-id'][0];
                        $scope.bookingHostIds.push(parseInt(booking.hostId));
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
                    if ('wpcf-room-name' in booking['custom_fields']) {
                        booking["roomName"] = booking['custom_fields']['wpcf-room-name'][0];
                    };
                    if ('wpcf-booking-starttime' in booking['custom_fields'] && 'wpcf-booking-endtime' in booking['custom_fields']) {
                        booking["slot"] = $scope.formatHour(booking.startTime) + ":00-" + $scope.formatHour(booking.endTime) + ":00";
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

                });
                //get the hosts and rooms for the bookings, to display additional contact info for the booking when it has been approved
                $scope.getBookingHostsAndRooms();
            });
        };

        $scope.getBookingHostsAndRooms = function () {
            //Remove the hostids array from duplicates
            $scope.bookingHostIds = jQuery.grep($scope.bookingHostIds, function (v, k) {
                return jQuery.inArray(v, $scope.bookingHostIds) === k;
            });
            //Now get host info for the unique hosts
            angular.forEach($scope.bookingHostIds, function (hostId) {
                guestSvc.getUserInfo(hostId).then(function (response) {
                    $scope.bookingHosts.push(response.data);
                    console.log($scope.bookingHosts);
                });
            });



            //Remove the roomids array from duplicates
            $scope.bookingRoomIds = jQuery.grep($scope.bookingRoomIds, function (v, k) {
                return jQuery.inArray(v, $scope.bookingRoomIds) === k;
            });
            //Get the rooms for the user's bookings
            var count = 1;
            //If there are no bookings
            if ($scope.bookingRoomIds.length === 0) {
                $scope.dataIsLoaded = true;
            } else {
                angular.forEach($scope.bookingRoomIds, function (roomId) {

                    guestSvc.getRoom(roomId).then(function (response) {
                        var room = response.data.post;
                        room["contactPerson"] = room["custom_fields"]["wpcf-contact-person"][0];
                        room["contactEmail"] = room["custom_fields"]["wpcf-contact-email"][0];
                        room["contactPhone"] = room["custom_fields"]["wpcf-contact-phone"][0];
                        if ('wpcf-cancel-deadline' in room['custom_fields']) {
                            room["cancelDeadline"] = parseInt(room["custom_fields"]["wpcf-cancel-deadline"][0]);
                        };
                        $scope.bookingRooms.push(room);
                        //If this is the last room
                        if (count === $scope.bookingRoomIds.length) {
                            $scope.dataIsLoaded = true;
                            console.log($scope.bookingRooms);
                            //Update the bookings with the cancel deadlines for the corresponding rooms.
                            angular.forEach($scope.bookingsForUser, function (booking) {
                                //Check if the booking is cancelable
                                if (booking.bookingStatus === 2) {
                                    booking["isCancelable"] = $scope.bookingIsCancelable(booking);
                                };
                            })
                        };
                        count++;
                    });

                });
            }


        };

        //Returns a host with a given id
        $scope.getHostByHostId = function (hostId) {
            hostId = parseInt(hostId);
            var returnHost = null;
            angular.forEach($scope.bookingHosts, function (host) {
                if (hostId === host.id) {
                    returnHost = host;
                };
            });
            return returnHost;
        };
        //Returns a room with a given id
        $scope.getRoomByRoomId = function (roomId) {
            roomId = parseInt(roomId);
            var returnRoom = null;
            angular.forEach($scope.bookingRooms, function (room) {
                if (roomId === room.id) {
                    returnRoom = room;
                };
            });
            return returnRoom;
        };



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
        //Counts the nr of bookings for each status
        $scope.addBookingCountToStatus = function (booking) {
            angular.forEach($scope.bookingStatuses, function (status) {
                if (booking.bookingStatus === status.id) {
                    status.bookings++;
                };
            });
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

        $scope.bookingIsCancelable = function (booking) {
            //var hostCancelDeadline = 1000*60*60*24;
            var hostCancelDeadline = $scope.getRoomByRoomId(booking.roomId).cancelDeadline; //In hours
            hostCancelDeadline = hostCancelDeadline * 1000 * 60 * 60; //In milliseconds
            console.log(hostCancelDeadline);
            var bookingDate = booking.bookingDate;
            var startTime = booking.startTime;

            //The moment when the booking starts
            var bookingStart = moment(bookingDate).add(parseInt(startTime), 'hours');
            var now = moment();
            var diff = bookingStart.diff(now);
            console.log("cancelable?");
            console.log(booking.id + " " + diff);
            console.log(hostCancelDeadline < diff);

            return hostCancelDeadline < diff;
        };

        $scope.switchTab = function (tabId) {
            switch (tabId) {
            case 1:
                $scope.tabs.bookingTab.isOpen = true;
                $scope.tabs.userTab.isOpen = false;
                break;
            case 2:
                $scope.tabs.bookingTab.isOpen = false;
                $scope.tabs.userTab.isOpen = true;
                break;
            }
        };

        $scope.updateUserInfo = function (password) {

            guestSvc.generateUserCookie($scope.userInfo.userLogin, password).then(function (response) {
                guestSvc.updateUserInfo(response.data.cookie, $scope.userInfo).then(function (response) {
                    $scope.userInfoUpdated = true;

                }).catch(function () {
                    console.log("Error in updateUserInfo!");
                    $scope.triedToUpdateUserInfo = true;
                    $scope.userInfoUpdated = false;
                });
            });
        };
        //Resets the variables used for updating userinfo
        $scope.resetUpdateUserInfo = function () {
            $scope.userInfoUpdated = false;
            $scope.userPass = "";
            $scope.triedToUpdateUserInfo = false;

        };

        $scope.updateBooking = function (booking) {
            guestSvc.getUpdatingNonce().then(function (response) {
                guestSvc.updateBooking(response, booking).then(function (response) {});

            }).catch(function () {
                console.log('Error in updateBooking!');
            });
        };

        $scope.setCancelBookingModalTexts = function (booking) {
            //setting the clicked booking to a scope variable to update the right booking from the modal
            $scope.clickedBooking = booking;
            $scope.showCommentInput = true;
            $scope.cancelBookingModalTitle = "Avboka";
            $scope.bookingMessageToUser = "Är du säker på att du vill avboka bokning " + booking.id + "?";


        };

        $scope.createAndSendCancelEmails = function (booking) {
            //Get currentbooking
            var currentBookingAsMail = $scope.getCurrentBookingMail(booking);
            //Create and send mail to the guest
            var mailTemplateSlug = "notifiering-till-gast-vid-avbokning";
            var mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);

            //Get the host
            var host = $scope.getHostByHostId(booking.hostId);
            //Replace HOST and GUEST in mailtemplate with the actual names
            mailTpl.body = mailTpl.body.replace("GUEST", booking.title)
                .replace("HOST", host.nickname)
                .replace("BOOKINGCOMMENT", booking.comments)
                .replace("BOOKINGID", booking.id);
            //Append the mail body with the booking
            mailTpl.body = mailTpl.body + currentBookingAsMail;

            //Send the guest mail
            guestSvc.sendMail($scope.userInfo.email, mailTpl.subject, mailTpl.body).then(function (response) {
                console.log('Mail was sent to guest');
                var guestMailSucceeded = true;
                //Create and send mail to the host
                mailTemplateSlug = "notifiering-till-vard-vid-avbokning";
                mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                //Replace HOST and GUEST in mailtemplate with the actual names
                mailTpl.body = mailTpl.body.replace("GUEST", booking.title)
                    .replace("HOST", host.nickname)
                    .replace("BOOKINGCOMMENT", booking.comments)
                    .replace("BOOKINGID", booking.id);
                mailTpl.body = mailTpl.body + currentBookingAsMail;

                //Send the host mail
                guestSvc.sendMail(host.email, mailTpl.subject, mailTpl.body).then(function (response) {
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
                mailTemplateSlug = "notifiering-till-vard-vid-avbokning";
                mailTpl = $scope.getMailTemplateBySlug(mailTemplateSlug);
                //Replace HOST and GUEST in mailtemplate with the actual names
                mailTpl.body = mailTpl.body.replace("GUEST", booking.title)
                    .replace("HOST", host.nickname)
                    .replace("BOOKINGCOMMENT", booking.comments)
                    .replace("BOOKINGID", booking.id);
                mailTpl.body = mailTpl.body + currentBookingAsMail;

                //Send the host mail
                guestSvc.sendMail(host.email, mailTpl.subject, mailTpl.body).then(function (response) {
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

        $scope.getCurrentBookingMail = function (booking) {

            //Making sure the date is in the right format (not an int)
            if (booking.bookingDate === parseInt(booking.bookingDate)) {
                booking.bookingDate = moment.unix(booking.bookingDate).format('YYYY-MM-DD');
            };
            var mailString = "";
            mailString = mailString.
            concat('<h2>Om bokningen</h2>').
            concat('<p><b>Bokningsnummer</b><br>' + booking.id + '<br>').
                //concat('<b>Värd</b><br>' + room.hostName + '<br>').
            concat('<b>Lokal</b><br>' + booking.roomName + '<br>').
            concat('<b>Datum</b><br>' + booking.bookingDate + '<br>').
            concat('<b>Tid</b><br>' + booking.slot + '<br>').
            concat('<b>Pris (exkl. moms)</b><br>' + booking.price + 'kr </p>').

            concat('<p><b>Företagsnamn</b><br>' + booking.title + '<br>').
            concat('<b>Kontaktperson</b><br>' + booking.contact + '<br>').
            concat('<b>Presentation av företaget</b><br>' + booking.guestBiography + '<br>').
            concat('<b>Faktureringsadress</b><br>' + booking.billingAddress + '<br></p>');
            //if (booking.content !== "") {
            //	mailString = mailString.concat('<b>Övriga kommentarer</b><br>' + booking.content + '<br><br>');
            //};
            return mailString;
        };

        $scope.setMessageToUser = function (guestMailSucceeded, hostMailSucceeded) {
            //Message to user depending on the success of the mails
            if (guestMailSucceeded && hostMailSucceeded) {
                $scope.bookingMessageToUser = "Din avbokning har bekräftats.";
            } else if (!guestMailSucceeded && hostMailSucceeded) {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail till dig. Kontakta Meetrd på support@meetrd.se.";
            } else if (guestMailSucceeded && !hostMailSucceeded) {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail till värden. Kontakta Meetrd på support@meetrd.se för att försäkra dig om att din avbokning har gått fram till värden.";
            } else {
                $scope.bookingMessageToUser = "Det uppstod ett fel vid sändning av mail. Kontakta Meetrd på support@meetrd.se.";
            }
        };

        $scope.cancelBooking = function () {
            var booking = $scope.clickedBooking;
            //Setting the booking status top canceled
            booking.bookingStatus = 5;
            $scope.bookingMessageToUser = "Din bokning uppdateras...";
            $scope.showCommentInput = false;
            //Update booking
            guestSvc.getUpdatingNonce().then(function (response) {
                jQuery('.modal-backdrop').hide();
                jQuery('#cancelBookingModal').modal('show');
                guestSvc.updateBooking(response, booking).then(function (response) {
                    $scope.bookingMessageToUser = "Din bokning " + booking.id + " har avbokats. Skickar mail...";
                    //Create and send emails to guest and host
                    $scope.createAndSendCancelEmails(booking);
                }).catch(function () {
                    console.log('Error in updateBooking!');
                    $scope.updateBookingModalBody = "Det uppstod ett fel i din avbokning. Kontakta Meetrd på support@meetrd.se";
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

                angular.forEach($scope.bookingsForUser, function (loopedBooking) {
                    if (booking.id === loopedBooking.id) {
                        booking.showDetails = true;
                    } else {
                        loopedBooking.showDetails = false;
                    }
                });
            }

        };

        //SEND MAIL
        $scope.mailTemplates = [];

        $scope.getAllMailTemplates = function () {
            guestSvc.getAllMailTemplates().then(function (response) {
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


    };
});