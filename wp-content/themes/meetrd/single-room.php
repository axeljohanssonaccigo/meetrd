<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Meetrd
 */

get_header();
the_post();
$custom_fields = get_post_custom();
$photo_url = $custom_fields['wpcf-photo'][0];
$cropped_photo_url = $custom_fields['wpcf-cropped-photo'][0];
$nr_of_people = $custom_fields['wpcf-nr-of-people'][0];
$company_url = $custom_fields['wpcf-webpage'][0];
$contact = $custom_fields['wpcf-contact-person'][0];
$contactEmail = $custom_fields['wpcf-contact-email'][0];
$contactPhone= $custom_fields['wpcf-contact-phone'][0];

$roomStartTime = $custom_fields['wpcf-start-time'][0];
$roomEndTime = $custom_fields['wpcf-end-time'][0];
$price = $custom_fields['wpcf-price'][0];
$area = $custom_fields['wpcf-area'][0];
$hostId = $custom_fields['wpcf-host-id'][0];
$address = $custom_fields['wpcf-street-address'][0];
$city = $custom_fields['wpcf-city'][0];

$weekdays = $custom_fields['wpcf-days'][0];
$room_setting_index = $custom_fields['wpcf-room-setting'][0];
$food = $custom_fields['wpcf-food'][0];
$equipment = $custom_fields['wpcf-equipment'][0];

$user_ID = get_current_user_id();
$userData = wp_get_current_user();
$hostData = get_userdata( $hostId );
$all_meta_for_user = get_user_meta($user_ID);
$all_meta_for_host = get_user_meta($hostId);
?>


<!--GLOBAL VARIABLES FOR THE ROOM-->
<script type="text/javascript">
var roomTitle = '<?php echo the_title(); ?>';
var roomId = '<?php the_ID(); ?>';
var roomPrice = '<?php echo $price; ?>';
var roomStartTime = '<?php echo $roomStartTime; ?>';
var roomContact = '<?php echo $contact; ?>';
var roomContactEmail = '<?php echo $contactEmail; ?>';
var roomContactPhone = '<?php echo $contactPhone; ?>';
var roomAddress = '<?php echo $address; ?>';
var roomCity = '<?php echo $city; ?>';
var roomPhoto = '<?php echo $photo_url; ?>';
var roomCroppedPhoto = '<?php echo $photo_url; ?>';
var nrOfPeople = <?php echo $nr_of_people; ?>;
var roomCompanyUrl = '<?php echo $company_url; ?>';
var roomEndTime = <?php echo $roomEndTime; ?>;
var weekdays = <?php echo json_encode($weekdays); ?>;
var roomSettingIndex = <?php echo $room_setting_index; ?>;
var roomFood = <?php echo json_encode($food); ?>;
var roomEquipment = <?php echo json_encode($equipment); ?>;


var hostId = <?php echo $hostId; ?>;
var hostData = <?php echo json_encode($hostData); ?>;
var hostMetaData = <?php echo json_encode($all_meta_for_host); ?>;

var userIsLoggedIn = <?php echo json_encode( is_user_logged_in() ); ?>;
if (userIsLoggedIn) {
  var userMetaData = <?php echo json_encode($all_meta_for_user); ?>;
  var userId = <?php echo $user_ID; ?>;
  var userData = <?php echo json_encode($userData); ?>;
}
</script>



<div id="primary" class="content-area col-xs-12 overflow-fix">
  <main id="main" class="site-main" role="main" ng-app="bookingApp" ng-controller="bookingCtrl" ng-cloak>

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
      <header class="entry-header col-xs-12">

      </header><!-- .entry-header -->

      <div class="entry-content" ng-if="bookingsAreLoaded">

        <div class="row">

          <div class="single-room-img" >
            <img id="single-room-img" src="<?php echo $cropped_photo_url; ?>" />
          </div>

        </div>
        <div class="row">
          <div class="send-mail-container col-xs-12 ng-hide">
            <input type="text" ng-model="testMail"></input>
            <div class="btn btn-lg btn-default" ng-click="sendMail()">Send test mail</div>
          </div>
        </div>
        <div class="row">
          <div class="container-fluid white-section">
            <div class="container no-padding">
              <!-- BOOKING CONTAINER -->
              <div class="booking-container clearfix" id="booking-container">
                <!-- PRICE TAG -->
                <div class="room-price-container" ng-click="showOrHideBookingContainer()">
                  <div class="col-xs-4 price-tag" ng-show="pricePerHour > 0">
                    {{pricePerHour}} kr
                  </div>
                  <div class="col-xs-4 price-tag" ng-show="pricePerHour === 0">
                    GRATIS
                  </div>
                  <div class="col-xs-8 price-definition" ng-hide="isMobileView">
                    Se lediga tider & boka
                  </div>
                  <div class="col-xs-8 price-definition" ng-show="isMobileView && showBookingContainer">
                    Dölj
                    <i class="fa fa-arrow-circle-up fa-lg"></i>
                  </div>
                  <div class="col-xs-8 price-definition" ng-show="isMobileView && !showBookingContainer">
                    Se lediga tider & boka
                    <i class="fa fa-arrow-circle-down fa-lg"></i>
                  </div>
                </div>
                <div ng-show="showBookingContainer" id="booking-container-content" class="booking-options-price-container clearfix">
                  <div class="booking-options">
                    <div class="booking-option clearfix ">
                      <div class="booking-option-label col-xs-12 col-sm-3 col-md-7 no-padding">
                        <div class="col-xs-2">
                          <i class="fa fa-calendar fa-lg"></i>
                        </div>
                        <div class="col-xs-10" style="padding-top: 5px;">Datum</div>
                      </div>
                      <div class="col-xs-12 col-sm-3 col-md-5" ng-click="datePickerSettings.wasClicked = true">

                        <datepicker  date-min-limit="{{datePickerSettings.minDate}}" date-format="{{datePickerSettings.pattern}}" button-prev="<i class='fa fa-arrow-left'></i>" button-next="<i class='fa fa-arrow-right'></i>">
                          <input onfocus="blur();" type="text" autocomplete="off" placeholder="När är mötet?"  ng-model="datePickerSettings.date" name="date" class="btn form-control" required/>
                        </datepicker>

                      </div>

                    </div>


                    <div class="booking-option clearfix" ng-show="datePickerSettings.date.length > 0">
                      <div class="booking-option-label col-md-7 col-sm-3 col-xs-7 no-padding">
                        <div class="col-xs-2">
                          <i class="fa fa-hourglass-start fa-lg"></i>
                        </div>
                        <div class="col-xs-10" style="padding-top: 5px; -webkit-appearance: none;">Antal timmar </div>
                      </div>
                      <div class="hours-dropdown-container col-xs-12 col-sm-3 col-md-5" >
                        <select ng-click="hourSelectWasClicked()" name="hoursDropdown" id="hoursDropdown"
                        ng-options="hour for hour in bookingHoursOptions"
                        ng-model="selectedHoursToBook.value"
                        class="btn btn-primary col-xs-12" style="line-height: 40px; padding-left: 40%; background-color: #325d88;"></select>
                      </div>
                    </div>
                    <div class="booking-option clearfix" ng-show="!showBookingSlots">
                      <div class="booking-option-label col-md-7 col-sm-3 col-xs-7 no-padding">

                        <div class="col-xs-2">
                          <i class="fa fa-clock-o fa-lg"></i>
                        </div>
                        <div class="col-xs-10" style="padding-top: 5px;">Tid </div>
                      </div>
                      <div class="col-md-5 col-sm-3 col-xs-12">
                        <span type="text" class="col-xs-12 btn btn-primary chosen-slot" ng-click="showOrHideBookingSlots()">{{currentBooking.slot}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="slots-of-today-container col-xs-12" ng-show="showBookingSlots">
                    <h4>När börjar mötet?</h4>
                    <div ng-repeat="slot in bookingsOfChosenDay">
                      <div class="col-xs-8 col-xs-offset-2 btn btn-xs booking-slot" ng-click="addSlotsToBooking(slot)" ng-class="{isBooked: slot.isBooked, 'btn-success': !slot.isBooked, isAdded: slot.isAdded, isNotChoosable: !slot.isChoosable && !slot.isBooked}">
                        {{formatHour(slot.startTime) + ":00 "}}
                <!-- <i class="fa fa-plus-square pointer" title="Välj denna starttid"  ng-show="userIsLoggedIn && slot.isChoosable && !slot.isBooked && !slot.isAdded"></i>
                <i class="fa fa-minus-square pointer" title="Ta bort denna starttid" ng-click="resetChosenSlots()" ng-show="slot.isChoosable && !slot.isBooked && slot.isAdded && slot.isFirstSlotOfBooking"></i> -->
              </div>
            </div>
          </div>

          <div ng-show="currentBooking.duration > 0">
            <div class="separator"></div>
            <div class="booking-option col-md-7 col-xs-7 no-padding">
              <div class="col-xs-2">
                <i class="fa fa-money fa-lg"></i>
              </div>
              <div class="col-xs-10" style="padding-top: 5px;">Pris </div>

            </div>
            <div class="col-xs-5 col-md-5 booking-price-container">
              {{currentBooking.price}} kr
            </div>
            <!-- <div class="col-xs-5 col-md-5 booking-price-container" ng-if="currentBooking.price === 0">
              GRATIS
            </div> -->
            <div class="separator"></div>
            <div class="col-xs-12">
              <div ng-if="userIsLoggedIn && userIsGuest" class="col-xs-12 btn btn-primary" ng-disabled="currentBooking.duration === 0" data-toggle="modal" data-target="#bookingModal">
                Skicka bokningsförfrågan
              </div>
              <div ng-if="!registrationFormIsShown && (!userIsLoggedIn || (userIsLoggedIn && !userIsGuest))" class="col-xs-12 btn btn-primary" ng-disabled="currentBooking.duration === 0" ng-click="showRegisterUserForm()">
                Skicka bokningsförfrågan
              </div>
            </div>
          </div>
          <div class="login-container" ng-show="registrationFormIsShown">
            <div class="login-info clearfix">
              <div class="col-xs-2">
                <i class="fa fa-info-circle fa-3x"></i>
              </div>
              <div class="col-xs-10">
                För att boka rummet behöver du vara inloggad som gäst.
              </div>
            </div>
            <div class="col-xs-12">
              <div class="btn btn-primary col-xs-12" id="bookingLoginButton"><a href="/wp-login.php" class="simplemodal-login" ng-click="setBookingUrl()">Logga in</a></div>
              <center><div class="col-xs-12 vertical-spacing">--- eller ---</div></center>
              <div data-toggle="modal" data-backdrop="" data-target="#registerUserModal" class="btn btn-primary col-xs-12" ng-click="setBookingUrl()">SKAPA GÄSTKONTO</div>
            </div>
          </div>
        </div>
      </div>

      <!-- HOST INFO -->
      <div class="host-info-container clearfix col-xs-12 col-md-7 no-padding">
        <div class="host-logo-container clearfix">
          <div class="col-xs-12">
            <a href="{{getHostPageUrl(currentRoom.hostId)}}"><img src="{{currentRoom.hostLogotype}}"/></a>
          </div>
        </div>
        <div class="col-xs-12 host-biography-container hidden-xs hidden-sm visible-md visible-lg">

          <span class="preserve-paragraphs">{{currentRoom.hostBiography}}

            För mer information, besök vår <a target="_blank" href="{{currentRoom.hostUrl}}">hemsida</a>.

          </span>
        </div>
        <div class="col-xs-12 host-biography-container visible-xs visible-sm hidden-md hidden-lg">

          <span ng-hide="showMoreInfo" class="preserve-paragraphs">{{currentRoom.hostBiography.slice(0,hostBiographyBreakpoint)}}... <span class="more-info-link link-color" ng-hide="showMoreInfo" ng-click="showMoreInfo = !showMoreInfo">Läs mer</span></span>
          <span ng-show="showMoreInfo" class="preserve-paragraphs">{{currentRoom.hostBiography}}
            <br>För mer information, besök vår <a target="_blank" href="{{currentRoom.hostUrl}}">hemsida</a>.
            <span class="more-info-link link-color" ng-show="showMoreInfo" ng-click="showMoreInfo = !showMoreInfo">Dölj</span></span>
          </div>

          <div class="separator"></div>
          <div class="col-xs-12 host-rating-container">
            <div ng-repeat="star in hostRatingRange" class="rating-star">
              <i class="fa fa-star fa-lg" ng-if="star <= currentRoom.hostRating"></i>
              <i class="fa fa-star-o fa-lg" ng-if="star > currentRoom.hostRating"></i>
            </div>
            baserat på {{currentRoom.hostVotes.length}} röster.
          </div>
          <div class="separator"></div>
          <div class="host-review-container" ng-repeat="review in currentRoom.hostReviews">
            <div class="col-xs-12 host-review">
              "{{review}}"
            </div>


          </div>
        </div>
      </div>
    </div>


    <!-- ABOUT THE ROOM -->
    <div class="container-fluid off-white-section">
      <div class="container no-padding">
        <!-- ABOUT THE ROOM -->

        <div class="room-info-container clearfix col-xs-12 col-md-7 no-padding">
          <div class="col-xs-12">
            <h3>Om rummet <?php the_title(); ?></h3>
          </div>
          <!-- CONTENT -->
          <div class="col-xs-12">

            <?php the_content(); ?>
          </div>

          <!-- Location -->


          <div class="col-xs-12">
            <h4><i class="fa fa-location-arrow fa-lg"></i>&nbsp;{{currentRoom.address}}</h4>
          </div>

          <div id="single-map-container" class="col-xs-12">
            <div id="single-map-canvas" style="width: 100%; height:300px;"></div>
          </div>
          <div class="separator"></div>
          <!-- other info -->

          <div class="room-prop clearfix">
            <div class="col-xs-5 col-sm-4">
              <i class="fa fa-home fa-lg"></i> Lokalen
            </div>
            <div class="col-xs-7 col-sm-8">
              <i class="fa fa-users fa-lg"></i>
              {{currentRoom.nrOfPeople}} personer
            </div>
            <div class="col-xs-7 col-xs-offset-5 col-sm-offset-4 col-sm-8">
              <i class="fa fa-home fa-lg"></i>
              {{currentRoom.setting}}
            </div>
          </div>
          <div class="separator"></div>
          <!-- <div class="room-prop clearfix">
            <div class="col-xs-5 col-sm-4">
              <i class="fa fa-clock-o fa-lg"></i> Tider
            </div>
            <div class="col-xs-7 col-sm-8">
              {{formatHour(currentRoom.startTime) + ":00 - " + formatHour(currentRoom.endTime) + ":00"}}
            </div>
            <div class="col-xs-7 col-xs-offset-5 col-sm-offset-4 col-sm-8" ng-repeat="day in weekdays" ng-class="{isTonedOut: !day.isChecked}">
              <i class="fa fa-check-square-o fa-lg"></i>

              {{day.displayName}}
            </div>
          </div>
          <div class="separator"></div> -->

          <div class="room-prop clearfix">
            <div class="col-xs-5 col-sm-4">
              <i class="fa fa-paperclip fa-lg"></i> Utrustning
            </div>

            <div class="col-xs-7 col-sm-8">
              <div ng-repeat="eq in equipment" ng-class="{isTonedOut: !eq.isChecked}">
                <i class="fa fa-check-square-o fa-lg"></i>

                {{eq.displayName}}
              </div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="room-prop clearfix">
            <div class="col-xs-5 col-sm-4">
              <i class="fa fa-cutlery fa-lg"></i> Mat & dryck
            </div>

            <div class="col-xs-7 col-sm-8">
              <div ng-repeat="food in food" ng-class="{isTonedOut: !food.isChecked}">
                <i class="fa fa-check-square-o fa-lg"></i>

                {{food.displayName}}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>


    <div class="container">

      <!-- Register user Modal -->
      <div class="modal fade" id="registerUserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel" ng-show="!userTriedToRegister">Skapa ett gästkonto hos Meetrd</h4>
              <h4 class="modal-title" id="myModalLabel" ng-show="userTriedToRegister">Var god vänta...</h4>
            </div>
            <div class="modal-body clearfix">
              <form name="registerUserForm" id="registerUserForm" autocomplete="off"  novalidate ng-hide="userTriedToRegister">
                <!-- <label for="username" class="col-xs-12 no-padding">Användarnamn (används för inloggning) *</label>
                <input type="text" autocomplete="off" class="col-xs-12 form-control" name="username" id="registerUsername" ng-model="newUser.username" required>
                <div class="error" ng-show="registerUserForm.username.$dirty && registerUserForm.username.$invalid">
                  Ange ett användarnamn
                </div> -->
                <label for="email" class="col-xs-12 no-padding"><i class="fa fa-envelope-o fa-lg"></i> E-mail (användarnamn)*</label>
                <input type="email" autocomplete="off" class="col-xs-12 form-control" id="registerEmail" name="email" ng-model="newUser.email" required>
                <div class="error" ng-show="registerUserForm.email.$dirty && (registerUserForm.email.$error.email || registerUserForm.email.$invalid)">
                  Ange en giltig e-mailadress
                </div>
                <label for="password" class="col-xs-12 no-padding"><i class="fa fa-key fa-lg"></i> Lösenord *</label>
                <input type="password" autocomplete="off" class="col-xs-1 form-control" name="password" ng-model="newUser.password" required>
                <div class="error" ng-show="registerUserForm.password.$dirty && registerUserForm.password.$invalid">
                  Ange ett lösenord
                </div>
                <label for="password2" class="col-xs-12 no-padding"><i class="fa fa-key fa-lg"></i> Upprepa lösenord *</label>
                <input type="password" autocomplete="off" class="col-xs-1 form-control" name="password2" ng-model="newUser.password2" required>
                <div class="error" ng-show="registerUserForm.password2.$dirty && registerUserForm.password.$invalid ">
                  Upprepa lösenordet
                </div>
                <div class="error" ng-show="!passwordsMatch()">
                  Lösenorden matchar inte
                </div>
                <div class="col-xs-12 no-padding">
                  <h3>Om ditt företag</h3>
                </div>
                <label for="nickname" class="col-xs-12 no-padding">Företagsnamn (detta namn kommer synas på dina bokningar) *</label>
                <input type="text" autocomplete="off" class="col-xs-12 form-control" name="nickname" ng-model="newUser.nickname" required>
                <div class="error" ng-show="registerUserForm.nickname.$dirty && registerUserForm.nickname.$invalid">
                  Ange ett företagsnamn
                </div>

                <label for="biography" class="col-xs-12 no-padding">Presentera ditt företag *</label>
                <textarea  class="col-xs-12 form-control" name="biography" ng-model="newUser.biography" required></textarea>
                <div class="error" ng-show="registerUserForm.biography.$dirty && registerUserForm.biography.$invalid">
                  Presentera ditt företag
                </div>
                <label for="website" class="col-xs-12 no-padding"><i class="fa fa-home fa-lg"></i> Hemsida</label>
                <input type="url" autocomplete="off" class="col-xs-12 form-control" name="website" ng-model="newUser.website">
                <div class="error" ng-show="registerUserForm.website.$dirty && !isUrlValid(registerUserForm, registerUserForm.website.$viewValue)">
                  Ange en giltig adress
                </div>

                <div class="col-xs-12 no-padding">
                  <h3>Kontaktuppgifter</h3>
                </div>

                <label for="firstName" class="col-xs-12 no-padding"><i class="fa fa-user fa-lg"></i> Förnamn *</label>
                <input type="text" autocomplete="off" class="col-xs-12 form-control" name="firstName" ng-model="newUser.firstName" required>
                <div class="error" ng-show="registerUserForm.firstName.$dirty && registerUserForm.firstName.$invalid">
                  Ange ditt förnamn
                </div>
                <label for="lastName" class="col-xs-12 no-padding"><i class="fa fa-user fa-lg"></i> Efternamn *</label>
                <input type="text" autocomplete="off" class="col-xs-12 form-control" name="lastName" ng-model="newUser.lastName" required>
                <div class="error" ng-show="registerUserForm.lastName.$dirty && registerUserForm.lastName.$invalid">
                  Ange ditt efternamn
                </div>

                <label for="phone" class="col-xs-12 no-padding"><i class="fa fa-phone fa-lg"></i> Telefonnummer *</label>
                <input type="tel" autocomplete="off" class="col-xs-12 form-control" name="phone" ng-model="newUser.phone" required>
                <div class="error" ng-show="registerUserForm.phone.$dirty && (registerUserForm.phone.$invalid || !phoneNumberIsValid(newUser.phone))">
                 Ange telefonnummer
               </div>
               <label for="billingAddress" class="col-xs-12 no-padding">Faktureringsadress</label>
               <textarea autocomplete="off" class="col-xs-12 form-control" name="billingAddress" ng-model="newUser.billingAddress"></textarea>
               <div class="error" ng-show="registerUserForm.billingAddress.$dirty && registerUserForm.billingAddress.$invalid">
                 Ange faktureringsadress
               </div>

               <div class="col-xs-12 no-padding">
                * Obligatoriskt fält
              </div>

            </form>
            <center>{{registerMessageToUser}}</center>
            <div ng-show="userTriedToRegister && !userWasRegistered">
              <div class="loader-container">
                <img src=" <?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/meetrd-loader.gif'?> ">
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div ng-show="!userTriedToRegister">
              <button type="button" class="btn btn-primary col-xs-7" ng-click="registerUser()" ng-disabled="!isUrlValid(registerUserForm, registerUserForm.website.$viewValue) || registerUserForm.$invalid || !passwordsMatch() || !phoneNumberIsValid(newUser.phone)">Skapa konto</button>
              <button type="button" class="btn btn-danger col-xs-offset-1 col-xs-4 pull-right" data-dismiss="modal">Avbryt</button>
            </div>
            <div ng-show="userWasRegistered">
              <button type="button" class="col-xs-12 btn btn-primary" data-dismiss="modal" ><a href="/wp-login.php" id="loginButton" class="simplemodal-login" style="color: #fff !important">Logga in</a></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Register user Modal END-->



    <!-- Booking Modal -->
    <div class="modal fade" id="bookingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content clearfix">
          <div class="modal-header clearfix">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel" ng-show="!bookingWasConfirmed" >Bekräfta bokningsförfrågan</h4>
          </div>
          <div class="modal-body clearfix">
            <div class="row">
              <div ng-show="!triedToConfirmBooking && !bookingWasConfirmed">

                <div ng-model="currentBooking">
                  <h4 class="col-xs-12">Om bokningen</h4>
                  <div class="booking-details clearfix">

                    <div class="col-xs-4">
                      <i class="fa fa-home fa-lg"></i> Lokal
                    </div>
                    <div class="col-xs-8">
                      {{currentRoom.title}}
                    </div>
                    <div class="col-xs-4">
                     <i class="fa fa-h-square fa-lg"></i> Värd
                   </div>
                   <div class="col-xs-8">
                    {{currentRoom.hostName}}
                  </div>
                </div>
                <div class="separator"></div>
                <div class="booking-details clearfix">
                  <div class="col-xs-4">
                    <i class="fa fa-calendar fa-lg"></i> Datum
                  </div>
                  <div class="col-xs-8">
                    {{currentBooking.date}}
                  </div>
                  <div class="col-xs-4">
                   <i class="fa fa-clock-o fa-lg"></i> Tid
                 </div>
                 <div class="col-xs-8">
                  {{currentBooking.slot}}
                </div>
              </div>
              <div class="separator"></div>
              <div class="col-xs-12 big-price-container">
                <span class="big-price-tag">
                  {{currentBooking.price}} kr
                </span> (exkl. moms)

              </div>
              <!-- <div class="col-xs-12 big-price-container" ng-show="currentBooking.price === 0">
                <span class="big-price-tag">
                  GRATIS
                </span>

              </div> -->
              <h4 class="col-xs-12">Dina uppgifter</h4>
              <div class="booking-details clearfix">

                <div class="booking-form">
                  <form name="bookingForm" novalidate>
                    <div class="col-xs-12 booking-details">
                      <label for="companyName" class="bold">Företagsnamn</label>
                      <input type="text" class="col-xs-12 form-control" name="companyName" ng-model="currentBooking.title" required>
                      <div class="error" ng-show="bookingForm.companyName.$invalid">
                        Ange ditt företags namn
                      </div>

                    </div>
                    <div class="col-xs-12 booking-details">
                      <label for="contact" class="bold"><i class="fa fa-user fa-lg"></i> Kontaktperson (för- och efternamn)</label>
                      <input type="text" class="col-xs-12 form-control" name="contact" ng-model="currentBooking.contact" required>
                      <div class="error" ng-show="bookingForm.contact.$invalid">
                        Ange kontaktperson
                      </div>

                    </div>
                    <!-- <div class="col-xs-12 booking-details">
                      <label for="email" class="bold"><i class="fa fa-envelope-o fa-lg"></i> E-mail</label>
                      <input type="email" class="col-xs-12 form-control" name="email" ng-model="currentBooking.email" required>
                      <div class="error" ng-show="bookingForm.email.$error.email || bookingForm.email.$invalid">
                        Ange en giltig e-mailadress
                      </div>

                    </div> -->
                    <div class="col-xs-12 booking-details">
                      <label for="telephone" class="bold"><i class="fa fa-phone fa-lg"></i> Telefonnummer</label>
                      <input type="tel" class="col-xs-12 form-control" name="phone" ng-model="currentBooking.phone" required>
                      <div class="error" ng-show="bookingForm.phone.$invalid || !phoneNumberIsValid(currentBooking.phone)">
                        Ange telefonnummer
                      </div>
                    </div>

                    <div class="col-xs-12 booking-details">
                     <label for="guestBiography" class="bold">Presentera ditt företag för värden</label>
                     <textarea class="col-xs-12 form-control" name="guestBiography" ng-model="currentBooking.guestBiography" required></textarea>
                     <div class="error" ng-show="bookingForm.guestBiography.$invalid">
                       Presentera ditt företag för värden
                     </div>
                   </div>

                   <div class="col-xs-12 booking-details">
                     <label for="billingAddress" class="bold">Faktureringsadress</label>
                     <textarea class="col-xs-12 form-control" name="billingAddress" ng-model="currentBooking.billingAddress"></textarea>
                     <div class="error" ng-show="bookingForm.billingAddress.$invalid">
                       Ange faktureringsadress
                     </div>
                   </div>

                   <div class="col-xs-12 booking-details">
                    <label for="comments" class="bold">Övriga kommentarer</label>
                    <textarea class="col-xs-12 form-control" name="comments" ng-model="currentBooking.content"></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- TELLING THE USER WHAT HAPPENS-->
        <div class="col-xs-12" ng-show="triedToConfirmBooking && !mailsAreDone">
          <center>{{bookingMessageToUser}}<br>
            <div class="loader-container" ng-hide="mailsAreDone">
              <img src=" <?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/meetrd-loader.gif'?> ">
              <!-- <h2>Var god vänta...</h2> -->
            </div>
          </center>

        </div>
        <div ng-show="triedToConfirmBooking && mailsAreDone">
          <center>{{bookingMessageToUser}}</center>
        </div>


      </div>
    </div>
    <div class="modal-footer clearfix">
      <div class="row">
        <div ng-show="!bookingWasConfirmed && !triedToConfirmBooking" class="clearfix col-xs-12">
          <div class="btn btn-primary col-sm-8 col-xs-12" style="" ng-disabled="bookingForm.$invalid || !phoneNumberIsValid(currentBooking.phone)" ng-click="createBooking()">Bekräfta bokningsförfrågan</div>
          <div  class="btn btn-danger col-sm-offset-1 col-sm-3 col-xs-12" data-dismiss="modal">Avbryt</div>
        </div>
        <div ng-show="bookingWasConfirmed && mailsAreDone" class="clearfix col-xs-12">
          <button class="btn btn-primary col-xs-12 col-md-5" data-dismiss="modal" ng-click="reloadRoomPage()">OK</button>
          <button class="btn btn-primary col-xs-12 col-md-5 col-md-offset-2" data-dismiss="modal" ng-click="goToMyPages(true)">Mina sidor</button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<!-- Booking Modal END-->


</div>
</div>
</div><!-- .entry-content -->


</article><!-- #post-## -->



<?php
                // If comments are open or we have at least one comment, load up the comment template.
if ( comments_open() || get_comments_number() ) :
  comments_template();
endif;
?>



</main><!-- #main -->
</div><!-- #primary -->

<div id="testFot" ng-show="isAtBottom">
  <?php get_footer(); ?>

</div>
