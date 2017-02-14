<?php /* Template Name: Gästsida
 *
 * @package Meetrd
 */

$custom_fields = get_post_custom();
$page_id = get_the_id();
get_header(); 

?>
    <script type="text/javascript">
        var userIsLoggedIn = <?php echo json_encode( is_user_logged_in() ); ?>;
        console.log(userIsLoggedIn);
        if (userIsLoggedIn) {
            <?php  $user_ID = get_current_user_id();  
	$userData = wp_get_current_user();
	$all_meta_for_user = get_user_meta($user_ID); ?>
            var userData = <?php echo json_encode($userdata); ?>;
            var userMetaData = <?php echo json_encode($all_meta_for_user); ?>;
            var userId = <?php echo $user_ID ?>;
        };
    </script>

    <div id="primary" class="content-area" ng-app="guestApp" ng-controller="guestCtrl" ng-cloak>
        <a href="/wp-login.php" id="menuLoginButton" class="simplemodal-login ng-hide">Logga in</a>
        <main id="main" class="site-main" role="main">
            <div class="container">
                <div class="row">
                    <div ng-hide="dataIsLoaded" class="loader-container">
                        <meetrd-loader></meetrd-loader>
                    </div>
                    <div class="standard-container col-xs-12" ng-show="userIsLoggedIn && dataIsLoaded">
                        <div class="tabs">

                            <div ng-repeat="tab in tabs" class="custom-tab" ng-class="{activeTab: tab.isOpen}" ng-click="switchTab(tab.id)">
                                {{tab.name}}
                            </div>
                            <div class="logged-in-container visible-lg visible-md hidden-sm hidden-xs"><b>{{userInfo.roleDisplayName}}</b> | {{userInfo.userLogin}}</div>

                        </div>



                        <div class="booking-list grey-section clearfix user-content-container" ng-show="tabs.bookingTab.isOpen">
                            <div ng-repeat="status in bookingStatuses" class="col-xs-12">
                                <div class="col-xs-12 status-container" ng-click="openOrCloseStatusContainer(status)">
                                    <h3>
									<i class="fa fa-angle-double-down" ng-if="!status.isOpen"></i>
									<i class="fa fa-angle-double-up" ng-if="status.isOpen"></i>
									&nbsp;&nbsp;{{status.status}} <span class="booking-count" ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4, isCanceled: status.id === 5, isTonedOut: status.bookings === 0}">{{status.bookings}}<span>
								</h3>
                                </div>
                                <div ng-if="status.bookings === 0 && status.isOpen" class="col-xs-12">
                                    Du har inga bokningar att visa.
                                </div>

                                <div ng-if="status.id === booking.bookingStatus" class="clearfix" ng-repeat="booking in bookingsForUser | orderBy: 'bookingDate'" ng-show="status.isOpen">
                                    <div class="row booking-row">
                                        <div class="col-md-7 col-md-offset-1 col-xs-12">


                                            <!-- Cancel booking Modal -->
                                            <div class="modal fade in" id="cancelBookingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                            <h4 class="modal-title" id="myModalLabel">{{cancelBookingModalTitle}}</h4>
                                                        </div>
                                                        <div class="modal-body clearfix">
                                                            <p>
                                                                <center>{{bookingMessageToUser}}</center>
                                                            </p>
                                                            <form name="cancelCommentForm" id="cancelCommentForm">
                                                                <div ng-show="showCommentInput">
                                                                    <label for="comments">Lämna en kommentar till värden</label>
                                                                    <textarea type="text" class="col-xs-12 form-control" name="comments" ng-model="clickedBooking.comments" required></textarea>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <div ng-show="showCommentInput">
                                                                <button type="button" ng-click="cancelBooking()" ng-disabled="cancelCommentForm.comments.$invalid" class="btn btn-primary col-xs-12">Avboka</button>
                                                                <button type="button" data-dismiss="modal" class="btn btn-danger col-xs-12">Avbryt</button>
                                                            </div>
                                                            <div ng-show="mailsAreDone">
                                                                <button type="button" class="btn btn-primary col-xs-12" ng-click="reloadPage()" data-dismiss="modal">OK</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Cancel booking Modal END-->

                                            <div class="booking clearfix " ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4, isCanceled: status.id === 5}">

                                                <div class="col-xs-12">
                                                    <h3><i class="fa fa-1 fa-home"></i> {{booking.roomName}} | <i class="fa fa-1 fa-h-square"></i> {{getHostByHostId(booking.hostId).nickname}}</h3>
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
                                            <div class="booking-detailed-info-container clearfix">
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
                                                        Ditt företag
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
                                                        Din presentation
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
                                                    <div class="booking-host-comment col-xs-12 no-padding" ng-show="booking.showDetails && booking.hostComment.length > 0">

                                                        <div class="col-xs-12 col-md-6 bold">
                                                            Kommentar från värden
                                                        </div>
                                                        <div class="col-xs-12 col-md-6">
                                                            {{booking.hostComment}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- CONTACT INFO FOR THE HOST -->
                                                <div ng-if="booking.bookingStatus === 2">
                                                    <div class="booking-about-the-host col-xs-12 no-padding" ng-show="booking.showDetails">
                                                        <div class="col-md-6 bold">
                                                            Värd
                                                        </div>
                                                        <div class="col-md-6">
                                                            {{getHostByHostId(booking.hostId).nickname}}
                                                        </div>
                                                        <div class="col-md-6 bold">
                                                            Hemsida
                                                        </div>
                                                        <div class="col-md-6">
                                                            {{getHostByHostId(booking.hostId).url}}
                                                        </div>
                                                        <div class="col-md-6 bold">
                                                            Kontaktperson
                                                        </div>
                                                        <div class="col-md-6">
                                                            {{getRoomByRoomId(booking.roomId).contactPerson}}
                                                        </div>
                                                        <div class="col-md-6 bold">
                                                            E-mail
                                                        </div>
                                                        <div class="col-md-6">
                                                            {{getRoomByRoomId(booking.roomId).contactEmail}}
                                                        </div>
                                                        <div class="col-md-6 bold">
                                                            Telefonnummer
                                                        </div>
                                                        <div class="col-md-6">
                                                            {{getRoomByRoomId(booking.roomId).contactPhone}}
                                                        </div>

                                                    </div>

                                                </div>
                                                <div class="booking-status-container col-xs-12" ng-if="booking.bookingStatus === 2" ng-show="booking.showDetails">
                                                    <button type="button" class="btn btn-danger col-xs-12" ng-disabled="!booking.isCancelable" data-backdrop="" data-toggle="modal" data-target="#cancelBookingModal" ng-click="setCancelBookingModalTexts(booking)">
                                                        <i class="fa fa-trash-o"></i>&nbsp;Avboka
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="user-creds-container grey-section user-content-container clearfix" ng-show="tabs.userTab.isOpen">
                            <div class="col-xs-12">
                                <form name="editUserForm">
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label>Användarnamn</label>
                                            <div class="user-info-help-text">Kan inte ändras</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            {{userInfo.userLogin}}
                                        </div>
                                    </div>


                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="nickname">Företagsnamn</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class="form-control" name="nickname" ng-model="userInfo.nickname" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="biography">Presentation av företaget</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <textarea class="form-control" name="biography" ng-model="userInfo.biography"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-xs-12">
                                        <h3>Kontaktuppgifter</h3>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="firstname">Förnamn</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class=" form-control" name="firstname" ng-model="userInfo.firstname" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="lastname">Efternamn</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class="form-control" name="lastname" ng-model="userInfo.lastname" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="billingAddress">Faktureringsadress</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <textarea class="form-control" name="billingAddress" ng-model="userInfo.billingAddress"></textarea>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label>Telefonnummer</label>
                                            <div class="user-info-help-text">Visas på dina bokningar (kan också redigeras vid bokningstillfället)</div>

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="tel" class="form-control" name="phone" ng-model="userInfo.phone" required>
                                        </div>
                                    </div>
                                    <!-- <div class="col-xs-12 no-padding input-container">
									<div class="col-sm-3 col-xs-12">
										<label>E-mail</label>
										<div class="user-info-help-text">Ändras av Meetrd</div>
										<div class="user-info-help-text">Visas på dina bokningar (kan redigeras vid bokningstillfället)</div>

									</div>
									<div class="col-sm-9 col-xs-12">
										{{userInfo.email}}
									</div>
								</div> -->
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label>Hemsida</label>
                                            <div class="user-info-help-text">Ändras av Meetrd</div>

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            {{userInfo.url}}
                                        </div>
                                    </div>
                                    <button type="button" data-toggle="modal" data-target="#enterPasswordModal" ng-click="resetUpdateUserInfo()" ng-disabled="editUserForm.$invalid" class="btn btn-primary col-xs-12">Uppdatera användaruppgifter</button>
                                </form>



                                <!-- Enter Password Modal -->
                                <div class="modal fade" id="enterPasswordModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 class="modal-title" id="myModalLabel">Ange ditt lösenord för att uppdatera dina användaruppgifter</h4>
                                            </div>
                                            <div class="modal-body clearfix">
                                                <div ng-show="!userInfoUpdated">
                                                    <input type="password" placeholder="Ange ditt lösenord" class="col-xs-12 form-control" name="password" ng-model="userPass" required>

                                                    <span class="col-xs-12 error" style="" ng-show="triedToUpdateUserInfo">
													Fel lösenord
												</span>
                                                </div>
                                                <div ng-show="userInfoUpdated" class="align-center">
                                                    Dina uppgifter har uppdaterats!
                                                </div>

                                            </div>
                                            <div class="modal-footer">
                                                <div ng-show="!userInfoUpdated">
                                                    <button type="button" ng-click="updateUserInfo(userPass)" ng-disabled="userPass.length === 0" class="btn btn-primary col-xs-12 col-md-5">Uppdatera</button>
                                                    <button type="button" class="btn btn-danger col-xs-12 col-md-5 col-md-offset-2" data-dismiss="modal">Avbryt</button>

                                                </div>
                                                <div ng-show="userInfoUpdated">
                                                    <button type="button" class="btn btn-primary col-xs-12" data-dismiss="modal" ng-click="reloadPage()">OK</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Enter Password Modal END-->
                                <!-- Cancel booking Modal -->
                                <div class="modal" id="cancelBookingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 class="modal-title" id="myModalLabel">{{cancelBookingModalTitle}}</h4>
                                            </div>
                                            <div class="modal-body clearfix">
                                                <p>
                                                    <center>{{bookingMessageToUser}}</center>
                                                </p>
                                                <form name="cancelCommentForm" id="cancelCommentForm">
                                                    <div ng-show="showCommentInput">
                                                        <label for="comments">Lämna en kommentar till värden</label>
                                                        <textarea type="text" class="col-xs-12 form-control" name="comments" ng-model="clickedBooking.comments" required></textarea>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer" ng-hide="bookingStatusIsUpdated">
                                                <button type="button" ng-click="cancelBooking()" ng-disabled="cancelCommentForm.comments.$invalid" class="btn btn-primary col-xs-12">Avboka</button>
                                                <button type="button" data-dismiss="modal" class="btn btn-danger col-xs-12">Avbryt</button>
                                                <div ng-show="bookingStatusIsUpdated && mailsAreDone">
                                                    <button type="button" class="btn btn-primary col-xs-12" ng-click="reloadPage()" data-dismiss="modal">OK</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Cancel booking Modal END-->

                            </div>
                        </div>
                    </div>

                </div>
            </div>






        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->


    <?php get_footer(); ?>