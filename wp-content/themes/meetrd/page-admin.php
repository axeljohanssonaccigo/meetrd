<?php /* Template Name: adminmeetrd
 *
 * @package Meetrd
 */

$page_id = get_the_id();
get_header();

$args = array(
	'role' => 'meetrdhost',
	); 
$all_hosts = get_users($args);
for ($i=0; $i < count($all_hosts); $i++) { 
	$temp = (array)$all_hosts[$i];
	$host_meta = get_user_meta($temp['ID']);
	$all_hosts[$i] = array_merge($temp, $host_meta);
}

$args = array(
	'role' => 'meetrdguest',
	); 
$all_guests = get_users($args);

?>
    <script type="text/javascript">
        var userIsLoggedIn = <?php echo json_encode( is_user_logged_in() ); ?>;
        if (userIsLoggedIn) {
            <?php $userData = wp_get_current_user(); ?>;
            var userData = <?php echo json_encode($userdata); ?>;
        };
        var allHosts = <?php echo json_encode($all_hosts); ?>;
        var allGuests = <?php echo json_encode($all_guests); ?>;
    </script>

    <div id="primary" class="content-area" ng-app="adminApp" ng-controller="adminCtrl" ng-cloak>
        <main id="main" class="site-main" role="main">
            <div class="container">
                <div class="row">
                    <div ng-hide="bookingsAreLoaded" class="loader-container">
                        <meetrd-loader></meetrd-loader>
                    </div>
                    <div class="standard-container col-xs-12" ng-if="userIsLoggedIn" ng-show="bookingsAreLoaded">
                        <div class="tabs">
                            <div ng-repeat="tab in tabs" class="custom-tab" ng-class="{activeTab: tab.isOpen}" ng-click="switchTab(tab.id)">
                                {{tab.name}}
                            </div>
                            <div class="logged-in-container visible-lg visible-md hidden-sm hidden-xs"><b>{{userData.roleDisplayName}}</b> | {{userData.data.user_login}}</div>

                        </div>

                        <div class="room-list grey-section clearfix user-content-container" ng-show="tabs.roomTab.isOpen">
                            <div class="filter-container col-xs-12" style="margin-top: 0">
                                <label>
                                    <input placeholder="Sök på rum" ng-model="roomQuery">
                                </label>
                            </div>
                            <div class="room col-xs-12" ng-repeat="room in allRooms | filter:roomQuery">
                                <div class="host-admin-photo-container col-xs-4 col-md-3">
                                    <img src="{{room.photo}}">
                                </div>

                                <div class="col-xs-8 col-md-9 no-padding">
                                    <h3><a href="{{room.url}}">{{room.title}}</a>
									<button type="button" class="btn btn-primary btn-xs" title="Redigera rum" ng-click="editItem(room.id)"><i class="fa fa-edit fa-1"></i></button>

								</h3>


                                </div>
                            </div>
                        </div>


                        <!-- BOOKING LIST -->
                        <div class="booking-list grey-section clearfix user-content-container" ng-show="tabs.bookingTab.isOpen">
                            <div class="filter-container col-xs-12" style="margin-top: 0">
                                <label>
                                    <input placeholder="Sök på bokning" ng-model="bookingQuery">
                                </label>
                            </div>
                            <div ng-repeat="status in bookingStatuses" class="col-xs-12">
                                <div class="col-xs-12 status-container" ng-click="openOrCloseStatusContainer(status)">
                                    <h3>
									<i class="fa fa-angle-double-down" ng-if="!status.isOpen"></i>
									<i class="fa fa-angle-double-up" ng-if="status.isOpen"></i>
									&nbsp;&nbsp;{{status.status}} <span class="booking-count" ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4, isCanceled: status.id === 5, isTonedOut: status.bookings === 0}">{{status.bookings}}</span>
								</h3>
                                </div>
                                <div ng-if="status.bookings === 0 && status.isOpen" class="col-xs-12">
                                    Det finns inga bokningar att visa.
                                </div>

                                <div ng-if="status.id === booking.bookingStatus" class="clearfix" ng-repeat="booking in allBookings | orderBy: 'bookingDate' | filter:bookingQuery" ng-show="status.isOpen">
                                    <div class="row booking-row">
                                        <div class="col-md-7 col-md-offset-1 col-xs-12">
                                            <div class="booking clearfix " ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4, isCanceled: status.id === 5}">
                                                <div class="col-xs-12">
                                                    <h3><i class="fa fa-1 fa-home"></i> {{booking.roomName}} 
													<button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#pleaseWaitModal" title="Redigera bokning" ng-click="editItem(booking.id)"><i class="fa fa-edit fa-1"></i></button>
												</h3>
                                                </div>
                                                <div class="booking-brief-info">
                                                    <div class="col-xs-6 col-md-8">
                                                        <i class="fa fa-1 fa-calendar"></i>&nbsp;&nbsp;{{booking.bookingDate}}
                                                    </div>

                                                    <div ng-show="!booking.showDetails" class="col-xs-6 col-md-4 align-right" ng-click="openOrCloseBookingDetails(booking)">
                                                        <i class="fa fa-lg fa-info-circle"></i>&nbsp;&nbsp;<span class="more-info-info-link">Mer info...</span>
                                                    </div>
                                                    <div ng-show="booking.showDetails" class="col-xs-6 col-md-4 align-right" ng-click="openOrCloseBookingDetails(booking)">
                                                        <i class="fa fa-lg fa-info-circle"></i>&nbsp;&nbsp;<span class="more-info-info-link">Dölj info</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="booking-detailed-info-container clearfix" ng-show="booking.showDetails">
                                                <div class="booking-detailed-info clearfix col-xs-12 no-padding" ng-show="booking.showDetails">
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Bokningsnummer
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.id}}
                                                    </div>

                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Tid
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.slot}}
                                                    </div>
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Pris
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.price}} kr (exkl. moms)
                                                    </div>
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Förfrågan skickad
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.date}}
                                                    </div>
                                                    <br>
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Gästens företag
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.title}}
                                                    </div>
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Kontaktperson
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.contact}}
                                                    </div>

                                                    <div class="col-xs-12 col-md-6 bold">
                                                        E-mail
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.email}}
                                                    </div>
                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Telefonnummer
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.phone}}
                                                    </div>
                                                    <div ng-show="booking.billingAddress.length > 0">
                                                        <div class="col-xs-12 col-md-6 bold">
                                                            Faktureringsadress
                                                        </div>
                                                        <div class="col-xs-12 col-md-6">
                                                            {{booking.billingAddress}}
                                                        </div>
                                                    </div>


                                                    <div class="col-xs-12 col-md-6 bold">
                                                        Gästens presentation
                                                    </div>
                                                    <div class="col-xs-12 col-md-6">
                                                        {{booking.guestBiography}}
                                                    </div>
                                                    <div ng-show="booking.comments.length > 0">

                                                        <div class="col-xs-12 col-md-6 bold">
                                                            Övriga kommentarer
                                                        </div>
                                                        <div class="col-xs-12 col-md-6">
                                                            {{booking.comments}}
                                                        </div>
                                                    </div>

                                                </div>
                                                <!-- HOST COMMENT -->
                                                <div ng-if="booking.bookingStatus !== 1">
                                                    <div class="booking-host-comment col-xs-12 no-padding" ng-show="booking.hostComment.length > 0">

                                                        <div class="col-xs-12 col-md-6 bold">
                                                            Värdens kommentar
                                                        </div>
                                                        <div class="col-xs-12 col-md-6">
                                                            {{booking.hostComment}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- APPROVE/REJECT BUTTONS -->
                                                <!-- <div class="booking-status-container col-xs-12" ng-hide="booking.bookingStatus !== 1">
												<button type="button" ng-click="setUpdateModalTexts(true, booking)" data-toggle="modal" data-target="#updateBookingModal" class="col-xs-12 col-md-5 btn btn-success" ng-show="booking.bookingStatus !== 4" ng-disabled="booking.bookingStatus === 2 || booking.bookingStatus === 3">
													Godkänn bokning
												</button>
												<button type="button" ng-click="setUpdateModalTexts(false, booking)" data-toggle="modal" data-target="#updateBookingModal" class="col-xs-12 col-md-5 col-md-offset-2 btn btn-danger" ng-show="booking.bookingStatus !== 4" ng-disabled="booking.bookingStatus === 2 || booking.bookingStatus === 3">
													Neka bokning
												</button>

											</div> -->


                                            </div>


                                        </div>
                                    </div>

                                </div>
                                <!-- ng-repaet end: booking in user bookings-->
                            </div>
                            <!-- ng-repaet end: status in bookingstatuses-->
                        </div>
                        <!-- BOOKING LIST END-->

                        <div class="grey-section clearfix">
                            <div class="host-list" ng-show="tabs.hostTab.isOpen">
                                <div class="filter-container col-xs-12">
                                    <label>
                                        <input placeholder="Sök på värd" ng-model="hostQuery">
                                    </label>
                                    <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#pleaseWaitModal" ng-click="goTo(newUserPath, true)">+ Lägg till ny värd</button>
                                </div>

                                <div ng-repeat="host in allHosts | filter:hostQuery" class="col-xs-12">
                                    <div class="user clearfix">
                                        <div class="col-xs-12 col-sm-6">
                                            <h1><i class="fa fa-user fa-lg"></i> {{host.data.user_login}} 
											<button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#pleaseWaitModal" title="Redigera användare" ng-click="goTo('/wp-admin/user-edit.php?user_id=' + host.ID + '&wp_http_referer=%2FMeetrd%2Fwp-admin%2Fusers.php', true)"><i class="fa fa-edit fa-1"></i></button>
										</h1>
                                            <div class="row">
                                                <div class="col-xs-12 bold">
                                                    ID
                                                </div>
                                                <div class="col-xs-12">
                                                    {{host.ID}}
                                                </div>
                                                <div class="col-xs-12 bold">
                                                    Hemsida
                                                </div>
                                                <div class="col-xs-12">
                                                    <a href="{{host.data.user_url}}">{{host.data.user_url}}</a>
                                                </div>
                                                <div class="col-xs-12 bold">
                                                    Medlem sedan
                                                </div>
                                                <div class="col-xs-12">
                                                    {{host.data.user_registered}}
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-xs-12 col-sm-3 host-bookings">
                                            <h1><i class="fa fa-calendar fa-lg"></i> Bokningar</h1>
                                            <div ng-repeat="booking in allBookings | filter:{hostId:host.data.ID}:true">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <b>{{booking.id}}</b> | {{booking.title}}
                                                        <button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#pleaseWaitModal" title="Redigera bokning" ng-click="editItem(booking.id)"><i class="fa fa-edit fa-1"></i></button>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-3 host-rooms">
                                            <h1><i class="fa fa-home fa-lg"></i> Rum
											<button type="button" title="Lägg till nytt rum" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#pleaseWaitModal"  ng-click="createRoomForHost(host)"><i class="fa fa-plus-square fa-1"></i></button>

										</h1>
                                            <div ng-repeat="room in allRooms | filter:{hostId:host.data.ID}:true">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <b>{{room.id}}</b> | {{room.title}}
                                                        <button type="button" class="btn btn-primary btn-xs" title="Redigera rum" data-toggle="modal" data-target="#pleaseWaitModal" ng-click="editItem(room.id)"><i class="fa fa-edit fa-1"></i></button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="grey-section clearfix">

                                <div class="guest-list" ng-show="tabs.guestTab.isOpen">
                                    <div class="filter-container col-xs-12">
                                        <label>
                                            <input placeholder="Sök på gäst" ng-model="guestQuery">
                                        </label>
                                        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#pleaseWaitModal" ng-click="goTo(newUserPath, true)">+ Lägg till ny gäst</button>
                                    </div>

                                    <div ng-repeat="guest in allGuests | filter:guestQuery" class="col-xs-12">
                                        <div class="user clearfix">
                                            <div class="col-xs-xs-12 col-sm-6">
                                                <h1><i class="fa fa-user fa-lg"></i> {{guest.data.user_login}} 
												<button type="button" class="btn btn-primary btn-xs" title="Redigera användare" data-toggle="modal" data-target="#pleaseWaitModal" ng-click="goTo('/wp-admin/user-edit.php?user_id=' + guest.data.ID + '&wp_http_referer=%2FMeetrd%2Fwp-admin%2Fusers.php', true)"><i class="fa fa-edit fa-1"></i></button>

											</h1>
                                                <div class="row">
                                                    <div class="col-xs-12 bold">
                                                        ID
                                                    </div>
                                                    <div class="col-xs-12">
                                                        {{guest.ID}}
                                                    </div>
                                                    <div class="col-xs-12 bold">
                                                        Hemsida
                                                    </div>
                                                    <div class="col-xs-12">
                                                        <a href="{{guest.data.user_url}}">{{guest.data.user_url}}</a>
                                                    </div>
                                                    <div class="col-xs-12 bold">
                                                        Medlem sedan
                                                    </div>
                                                    <div class="col-xs-12">
                                                        {{guest.data.user_registered}}
                                                    </div>
                                                </div>


                                            </div>
                                            <div class="col-xs-12 col-sm-6 guest-bookings">
                                                <h1><i class="fa fa-calendar fa-1"></i> Bokningar</h1>
                                                <div ng-repeat="booking in allBookings | filter:{authorId:guest.ID}:true">
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <b>{{booking.id}}</b>
                                                            <button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#pleaseWaitModal" title="Redigera bokning" ng-click="editItem(booking.id)"><i class="fa fa-edit fa-1"></i></button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Please wait modal -->
            <div class="modal fade" id="pleaseWaitModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body clearfix">
                            <div class="loader-container">
                                <meetrd-loader></meetrd-loader>
                                <div class="col-xs-12 align-center">
                                    Var god vänta...
                                </div>
                            </div>
                            <div class="modal-footer">

                            </div>
                        </div>
                    </div>
                </div>
                <!-- Please wait modal -->


        </main>
        <!-- #main -->
        </div>
        <!-- #primary -->


        <?php get_footer(); ?>