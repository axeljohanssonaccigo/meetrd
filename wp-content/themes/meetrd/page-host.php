<?php /* Template Name: Värdsida
 *
 * @package Meetrd
 */

$page_id = get_the_id();
get_header();
?>
    <script type="text/javascript">
        var userIsLoggedIn = <?php echo json_encode( is_user_logged_in() ); ?>;
        console.log(userIsLoggedIn);
        if (userIsLoggedIn) {
            <?php $userData = wp_get_current_user(); ?>;
            <?php $all_meta_for_user = get_user_meta($user_ID); ?>;
            var userData = <?php echo json_encode($userdata); ?>;
            var userMetaData = <?php echo json_encode($all_meta_for_user); ?>;
        };
    </script>

    <div id="primary" class="content-area" ng-app="hostApp" ng-controller="hostCtrl" ng-cloak>
        <a href="/wp-login.php" id="menuLoginButton" class="simplemodal-login ng-hide">Logga in</a>
        <main id="main" class="site-main" role="main">
            <div class="container">
                <div class="row">
                    <div ng-hide="bookingsAreLoaded" class="loader-container">
                        <div class="meetrd-loader-container"><img class="spin" src="http://www.meetrd.se/wp-content/themes/meetrd/layouts/Images/meetrd.se-ikon-logo_pink.png" /></div>
                    </div>
                    <div class="standard-container col-xs-12" ng-if="userIsLoggedIn" ng-show="bookingsAreLoaded">
                        <div class="tabs">

                            <div ng-repeat="tab in tabs" class="custom-tab" ng-class="{activeTab: tab.isOpen}" ng-click="switchTab(tab.id)">
                                {{tab.name}}
                            </div>
                            <div class="logged-in-container visible-lg visible-md hidden-sm hidden-xs"><b>{{userInfo.roleDisplayName}}</b> | {{userInfo.userLogin}}</div>
                        </div>

                        <div class="room-list grey-section clearfix user-content-container" ng-show="tabs.roomTab.isOpen">

                            <div class="col-xs-12">
                                <button class="btn btn-primary btn-sm" type="button" ng-click="addNewRoom = !addNewRoom">
                                    <span ng-hide="addNewRoom"><i class="fa fa-plus"></i>&nbsp;Skapa nytt rum</span><span ng-show="addNewRoom"><i class="fa fa-minus"></i>&nbsp;Dölj nytt rum</span>
                                </button>
                            </div>
                            <div class="add-new-room-form" ng-show="addNewRoom">

                                <form ng-submit="createRoom()" name="addNewRoomForm">
                                    <div class="col-xs-12 col-md-12">
                                        <label for="title" class="control-label">Namn</label>
                                        <input type="text" class="form-control" name="title" ng-model="newRoom.title" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.title.$error.required && addNewRoomForm.title.$dirty" class="error">
                                                Ange namn
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-12">
                                        <label for="photo" class="control-label">Foto</label>
                                        <div>För att lägga till ett foto, bifoga fotot i ett mail och skicka till <a href="mailto:support@meetrd.se">support@meetrd.se</a></div>
                                        <div class="min-height"></div>
                                    </div>
                                    <div class="col-xs-12 col-md-12">
                                        <label for="description" class="control-label">Beskrivning</label>
                                        <textarea class="form-control" rows="6" name="description" ng-model="newRoom.content" required></textarea>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.description.$error.required && addNewRoomForm.description.$dirty" class="error">
                                                Ange beskrivning
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="startTime" class="control-label">Rummet öppnar (Hel eller halv timme, ex: 9.30)</label>
                                        <input type="text" class="form-control" name="startTime" ng-model="newRoom.startTime" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.startTime.$dirty">
                                                <span ng-show="addNewRoomForm.startTime.$error.required || addNewRoomForm.startTime.$error.number" class="error">
                                                    Ange öppningstid, hel eller halv timme. Ex: 10.30 
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="endTime" class="control-label">Rummet stänger (Hel eller halv timme, ex: 17)</label>
                                        <input type="text" class="form-control" name="endTime" ng-model="newRoom.endTime" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.endTime.$dirty">
                                                <span ng-show="addNewRoomForm.endTime.$error.required || addNewRoomForm.endTime.$error.number || endTimeLessThanStartTime(newRoom)" class="error">
                                                    Ange stängningstid som är senare än starttiden, hel eller halv timme. Ex: 17.30
                                                </span>

                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="price" class="control-label">Pris per timme (exkl. moms)</label>
                                        <input type="number" class="form-control" name="price" ng-model="newRoom.price" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.price.$error.required && addNewRoomForm.price.$dirty" class="error">
                                                Ange pris per timme
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="nrOfPeople" class="control-label">Antal personer</label>
                                        <input type="number" class="form-control" name="nrOfPeople" ng-model="newRoom.nrOfPeople" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.nrOfPeople.$error.required && addNewRoomForm.nrOfPeople.$dirty" class="error">
                                                Ange antal personer
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="street" class="control-label">Gatuadress</label>
                                        <input type="text" class="form-control" name="street" ng-model="newRoom.street" ng-blur="getCoordinates(newRoom)" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.street.$error.required && addNewRoomForm.street.$dirty" class="error">
                                                Ange  gatuadress
                                            </span>
                                            <span class="error" ng-show="!newRoom.validation.checkingAddress && !newRoom.validation.addressIsValid && addNewRoomForm.street.$dirty">
                                                Den angivna adressen kunde inte lokaliseras. Har det smugit sig in ett stavfel? 
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="city" class="control-label">Stad</label>
                                        <input type="text" class="form-control" name="city" ng-model="newRoom.city" ng-blur="getCoordinates(newRoom)" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.city.$error.required && addNewRoomForm.city.$dirty" class="error">
                                                Ange stad
                                            </span>
                                            <span class="error" ng-show="!newRoom.validation.checkingAddress && !newRoom.validation.addressIsValid  && addNewRoomForm.city.$dirty">
                                                Den angivna adressen kunde inte lokaliseras. Har det smugit sig in ett stavfel? 
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="area" class="control-label">Stadsdel</label>
                                        <input type="text" class="form-control" name="area" ng-model="newRoom.area" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.area.$error.required && addNewRoomForm.area.$dirty" class="error">
                                                Ange stadsdel
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="contactPerson" class="control-label">Kontaktperson</label>
                                        <input type="text" class="form-control" name="contactPerson" ng-model="newRoom.contactPerson" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.contactPerson.$error.required && addNewRoomForm.contactPerson.$dirty" class="error">
                                                Ange kontaktperson
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="contactEmail" class="control-label">Kontakt-email</label>
                                        <input type="email" class="form-control" name="contactEmail" ng-model="newRoom.contactEmail" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.contactEmail.$dirty">
                                                <span ng-show="addNewRoomForm.contactEmail.$error.required" class="error">
                                                    Ange kontakt-email
                                                </span>
                                            <span ng-show="addNewRoomForm.contactEmail.$error.email" class="error">
                                                    Ange en korrekt e-mailadress
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="contactPhone" class="control-label">Kontakttelefon</label>
                                        <input type="text" class="form-control" name="contactPhone" ng-model="newRoom.contactPhone" required>
                                        <div class="min-height">
                                            <span ng-show="addNewRoomForm.contactPhone.$error.required && addNewRoomForm.contactPhone.$dirty" class="error">
                                                Ange kontakttelefon
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="setting" class="control-label"><i class="fa fa-home fa-lg"></i>Rumstyp</label>
                                        <div ng-repeat="setting in roomSettings">
                                            <div class="row">
                                                <div class="col-xs-2 col-sm-1">
                                                    <input ng-change="newRoom.validation.roomTypeSelected = true" type="radio" value="{{setting.index}}" ng-model="$parent.newRoom.setting" name="setting" class="form-control">
                                                </div>
                                                <div class="col-xs-10 col-sm-11">
                                                    {{setting.value}}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="min-height">
                                            <span ng-show="!newRoom.validation.roomTypeSelected" class="error">
                                                Ange rumstyp
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Kan hyras</label>
                                        <div ng-repeat="day in newRoom.weekdays.days">
                                            <div class="row">
                                                <div class="col-xs-2 col-sm-1">
                                                    <input type="checkbox" ng-model="day.isChecked" class="form-control">
                                                </div>
                                                <div class="col-xs-10 col-sm-11">
                                                    {{day.displayName}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="separator"></div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="equipment" class="control-label"><i class="fa fa-paperclip fa-lg"></i> Utrustning</label>
                                        <div ng-repeat="eq in newRoom.equipment.equipment">
                                            <div class="row">
                                                <div class="col-xs-2 col-sm-1">
                                                    <input type="checkbox" ng-model="eq.isChecked" class="form-control">
                                                </div>
                                                <div class="col-xs-10 col-sm-11">
                                                    {{eq.displayName}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-md-6">
                                        <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Mat & dryck</label>
                                        <div ng-repeat="food in newRoom.food.food">
                                            <div class="row">
                                                <div class="col-xs-2 col-sm-1">
                                                    <input type="checkbox" ng-model="food.isChecked" class="form-control">
                                                </div>
                                                <div class="col-xs-10 col-sm-11">
                                                    {{food.displayName}}
                                                </div>
                                            </div>

                                        </div>
                                    </div>




                                    <div class="separator"></div>


                                    <div class="col-xs-12">
                                        <button type="submit" class="btn btn-primary form-control button-margin-top" ng-disabled="addNewRoomForm.$invalid">Spara nytt rum</button>
                                    </div>
                                    <div ng-hide="newRoom.validation.isValid" class="error-big col-xs-12 text-center">

                                        Rummet kunde inte skapas. Kontrollera att alla fält är korrekt ifyllda.
                                    </div>
                                </form>
                            </div>
                            <div class="col-xs-12">
                                <h3 class="edit-room-heading">Redigera dina rum    
                                </h3>
                            </div>
                            <div class="room" ng-repeat="room in roomsForUser">

                                <div class="col-xs-12 col-md-12">
                                    <h3><a href="{{room.url}}">{{room.title}}</a>
									<button type="button" class="btn btn-primary btn-xs" title="Redigera rum" ng-click="editRoom(room.id)"><i class="fa fa-edit fa-1"></i></button></h3>
                                    <div ng-show="room.showOnMeetrd">
                                        Publicerat på Meetrd.se</div>
                                    <div ng-show="!room.showOnMeetrd">
                                        Väntar på godkännande av Meetrd</div>
                                </div>


                                <div class="host-admin-photo-container col-xs-12 col-md-4">
                                    <img src="{{room.photo}}">
                                </div>

                                <div class="room-info">
                                    <div class="edit-room" ng-show="room.inEditMode">
                                        <form name="editRoomForm" ng-submit="updateRoom(room)">
                                            <!--
                                            <div class="col-xs-12 col-md-12">
                                                <label for="title" class="control-label">Namn</label>
                                                <input type="text" class="form-control" name="title" ng-model="room.title" required>
                                            </div>
                                            <div class="col-xs-12 col-md-12">
                                                <label for="photo" class="control-label">Foto</label>
                                                <div>För att ändra foto, bifoga fotot i ett mail och skicka till <a href="mailto:support@meetrd.se">support@meetrd.se</a></div>
                                            </div>
                                            <div class="col-xs-12 col-md-12">
                                                <label for="description" class="control-label">Beskrivning</label>
                                                <textarea class="form-control" rows="6" name="description" ng-model="room.content" required></textarea>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="startTime" class="control-label">Rummet öppnar (Hel eller halv timme, ex: 9.30)</label>
                                                <input type="text" class="form-control" name="startTime" ng-model="room.startTime" required>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="endTime" class="control-label">Rummet stänger (Hel eller halv timme, ex: 9)</label>
                                                <input type="text" class="form-control" name="endTime" ng-model="room.endTime" required>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="price" class="control-label">Pris per timme (exkl. moms)</label>
                                                <input type="text" class="form-control" name="price" ng-model="room.price" required>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="nrOfPeople" class="control-label">Antal personer</label>
                                                <input type="text" class="form-control" name="nrOfPeople" ng-model="room.nrOfPeople" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="street" class="control-label">Gatuadress</label>
                                                <input type="text" class="form-control" name="street" ng-model="room.street" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="city" class="control-label">Stad</label>
                                                <input type="text" class="form-control" name="city" ng-model="room.city" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="area" class="control-label">Stadsdel</label>
                                                <input type="text" class="form-control" name="area" ng-model="room.area" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactPerson" class="control-label">Kontaktperson</label>
                                                <input type="text" class="form-control" name="contactPerson" ng-model="room.contactPerson" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactEmail" class="control-label">Kontakt-email</label>
                                                <input type="text" class="form-control" name="contactEmail" ng-model="room.contactEmail" required>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactPhone" class="control-label">Kontakttelefon</label>
                                                <input type="text" class="form-control" name="contactPhone" ng-model="room.contactPhone" required>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="setting" class="control-label"><i class="fa fa-home fa-lg"></i>&nbsp;Rumstyp</label>
                                                <div ng-repeat="setting in roomSettings">
                                                    <div class="row">
                                                        <div class="col-xs-2 col-sm-1">
                                                            <input type="radio" value="{{setting.index}}" ng-model="$parent.room.setting" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10 col-sm-11">
                                                            {{setting.value}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Kan hyras</label>
                                                <div ng-repeat="day in room.weekdays.days">
                                                    <div class="row">
                                                        <div class="col-xs-2">

                                                            <input type="checkbox" ng-model="day.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10">
                                                            {{day.displayName}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="separator"></div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="equipment" class="control-label"><i class="fa fa-paperclip fa-lg"></i> Utrustning</label>
                                                <div ng-repeat="eq in room.equipment.equipment">
                                                    <div class="row">
                                                        <div class="col-xs-2">
                                                            <input type="checkbox" ng-model="eq.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10">
                                                            {{eq.displayName}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div class="col-xs-12 col-md-6">
                                                <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Mat & dryck</label>
                                                <div ng-repeat="food in room.food.food">
                                                    <div class="row">
                                                        <div class="col-xs-2">
                                                            <input type="checkbox" ng-model="food.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10">
                                                            {{food.displayName}}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="separator"></div>


                                            <div class="col-xs-12 col-md-6">

                                                <button type="button" class="btn btn-primary form-control button-margin-top" ng-disabled="editRoomForm.$invalid && !editRoomForm.$dirty" ng-click="updateRoom(room)">Spara ändringar av {{room.title}}</button>
                                            </div>
-->
                                            <div class="col-xs-12 col-md-12">
                                                <label for="title" class="control-label">Namn</label>
                                                <input type="text" class="form-control" name="title" ng-model="room.title" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.title.$error.required && editRoomForm.title.$dirty" class="error">
                                                Ange namn
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-12">
                                                <label for="photo" class="control-label">Foto</label>
                                                <div>För att ändra foto, bifoga fotot i ett mail och skicka till <a href="mailto:support@meetrd.se">support@meetrd.se</a></div>
                                                <div class="min-height"></div>
                                            </div>
                                            <div class="col-xs-12 col-md-12">
                                                <label for="description" class="control-label">Beskrivning</label>
                                                <textarea class="form-control" rows="6" name="description" ng-model="room.content" required></textarea>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.description.$error.required && editRoomForm.description.$dirty" class="error">
                                                Ange beskrivning
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="startTime" class="control-label">Rummet öppnar (Hel eller halv timme, ex: 9.30)</label>
                                                <input type="text" class="form-control" name="startTime" ng-model="room.startTime" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.startTime.$dirty">
                                                <span ng-show="editRoomForm.startTime.$error.required || editRoomForm.startTime.$error.number" class="error">
                                                    Ange öppningstid, hel eller halv timme. Ex: 10.30 
                                                </span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="endTime" class="control-label">Rummet stänger (Hel eller halv timme, ex: 17)</label>
                                                <input type="text" class="form-control" name="endTime" ng-model="room.endTime" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.endTime.$dirty">
                                                <span ng-show="editRoomForm.endTime.$error.required || editRoomForm.endTime.$error.number" class="error">
                                                    Ange stängningstid som är senare än starttiden, hel eller halv timme. Ex: 17.30
                                                </span>

                                                    </span>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="price" class="control-label">Pris per timme (exkl. moms)</label>
                                                <input type="number" class="form-control" name="price" ng-model="room.price" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.price.$error.required && editRoomForm.price.$dirty" class="error">
                                                Ange pris per timme
                                            </span>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="nrOfPeople" class="control-label">Antal personer</label>
                                                <input type="number" class="form-control" name="nrOfPeople" ng-model="room.nrOfPeople" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.nrOfPeople.$error.required && editRoomForm.nrOfPeople.$dirty" class="error">
                                                Ange antal personer
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="street" class="control-label">Gatuadress</label>
                                                <input type="text" class="form-control" name="street" ng-model="room.street" ng-blur="getCoordinates(room)" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.street.$error.required && editRoomForm.street.$dirty" class="error">
                                                Ange  gatuadress
                                            </span>
                                                    <span class="error" ng-show="!room.validation.checkingAddress && !room.validation.addressIsValid && editRoomForm.street.$dirty">
                                                Den angivna adressen kunde inte lokaliseras. Har det smugit sig in ett stavfel? 
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="city" class="control-label">Stad</label>
                                                <input type="text" class="form-control" name="city" ng-model="room.city" ng-blur="getCoordinates(room)" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.city.$error.required && editRoomForm.city.$dirty" class="error">
                                                Ange stad
                                            </span>
                                                    <span class="error" ng-show="!room.validation.checkingAddress && !room.validation.addressIsValid  && editRoomForm.city.$dirty">
                                                Den angivna adressen kunde inte lokaliseras. Har det smugit sig in ett stavfel? 
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="area" class="control-label">Stadsdel</label>
                                                <input type="text" class="form-control" name="area" ng-model="room.area" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.area.$error.required && editRoomForm.area.$dirty" class="error">
                                                Ange stadsdel
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactPerson" class="control-label">Kontaktperson</label>
                                                <input type="text" class="form-control" name="contactPerson" ng-model="room.contactPerson" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.contactPerson.$error.required && editRoomForm.contactPerson.$dirty" class="error">
                                                Ange kontaktperson
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactEmail" class="control-label">Kontakt-email</label>
                                                <input type="email" class="form-control" name="contactEmail" ng-model="room.contactEmail" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.contactEmail.$dirty">
                                                <span ng-show="editRoomForm.contactEmail.$error.required" class="error">
                                                    Ange kontakt-email
                                                </span>
                                                    <span ng-show="editRoomForm.contactEmail.$error.email" class="error">
                                                    Ange en korrekt e-mailadress
                                                </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-md-6">
                                                <label for="contactPhone" class="control-label">Kontakttelefon</label>
                                                <input type="text" class="form-control" name="contactPhone" ng-model="room.contactPhone" required>
                                                <div class="min-height">
                                                    <span ng-show="editRoomForm.contactPhone.$error.required && editRoomForm.contactPhone.$dirty" class="error">
                                                Ange kontakttelefon
                                            </span>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="setting" class="control-label"><i class="fa fa-home fa-lg"></i>Rumstyp</label>
                                                <div ng-repeat="setting in roomSettings">
                                                    <div class="row">
                                                        <div class="col-xs-2 col-sm-1">
                                                            <input ng-change="room.validation.roomTypeSelected = true" type="radio" value="{{setting.index}}" ng-model="$parent.room.setting" name="setting" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10 col-sm-11">
                                                            {{setting.value}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="min-height">
                                                    <span ng-show="!room.validation.roomTypeSelected" class="error">
                                                Ange rumstyp
                                            </span>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Kan hyras</label>
                                                <div ng-repeat="day in room.weekdays.days">
                                                    <div class="row">
                                                        <div class="col-xs-2 col-sm-1">
                                                            <input type="checkbox" ng-model="day.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10 col-sm-11">
                                                            {{day.displayName}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="separator"></div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="equipment" class="control-label"><i class="fa fa-paperclip fa-lg"></i> Utrustning</label>
                                                <div ng-repeat="eq in room.equipment.equipment">
                                                    <div class="row">
                                                        <div class="col-xs-2 col-sm-1">
                                                            <input type="checkbox" ng-model="eq.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10 col-sm-11">
                                                            {{eq.displayName}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-md-6">
                                                <label for="food" class="control-label"><i class="fa fa-cutlery fa-lg"></i> Mat & dryck</label>
                                                <div ng-repeat="food in room.food.food">
                                                    <div class="row">
                                                        <div class="col-xs-2 col-sm-1">
                                                            <input type="checkbox" ng-model="food.isChecked" class="form-control">
                                                        </div>
                                                        <div class="col-xs-10 col-sm-11">
                                                            {{food.displayName}}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>




                                            <div class="separator"></div>


                                            <div class="col-xs-12">
                                                <button type="submit" class="btn btn-primary form-control button-margin-top" ng-disabled="editRoomForm.$invalid">Spara ändringar av {{room.title}}</button>
                                            </div>
                                            <div ng-hide="room.validation.isValid" class="error-big col-xs-12 text-center">
                                                Rummet kunde inte uppdateras. Kontrollera att alla fält är korrekt ifyllda.
                                            </div>
                                        </form>




                                    </div>
                                </div>

                            </div>
                        </div>





                        <!-- BOOKING LIST -->
                        <div class="booking-list grey-section clearfix user-content-container" ng-show="tabs.bookingTab.isOpen">
                            <div ng-repeat="status in bookingStatuses" class="col-xs-12">
                                <div class="col-xs-12 status-container" ng-click="openOrCloseStatusContainer(status)">
                                    <h3>
									<i class="fa fa-angle-double-down" ng-if="!status.isOpen"></i>
									<i class="fa fa-angle-double-up" ng-if="status.isOpen"></i>
									&nbsp;&nbsp;{{status.status}} <span class="booking-count" ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4, isCanceled: status.id === 5, isTonedOut: status.bookings === 0}">{{status.bookings}}</span>
								</h3>
                                </div>
                                <div ng-if="status.bookings === 0 && status.isOpen" class="col-xs-12">
                                    Du har inga bokningar att visa.
                                </div>

                                <div ng-if="status.id === booking.bookingStatus" class="clearfix" ng-repeat="booking in bookingsForUser | orderBy: 'bookingDate'" ng-show="status.isOpen">
                                    <div class="row booking-row">
                                        <div class="col-md-7 col-md-offset-1 col-xs-12">
                                            <div class="booking clearfix " ng-class="{isWaitingForApproval: status.id === 1, isApproved: status.id === 2, isRejected: status.id === 3, isPassed: status.id === 4,  isCanceled: status.id === 5}">
                                                <div class="col-xs-12">
                                                    <h3><i class="fa fa-1 fa-home"></i> {{booking.roomName}}</h3>
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
                                                            Din kommentar
                                                        </div>
                                                        <div class="col-xs-12 col-md-6">
                                                            {{booking.hostComment}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- APPROVE/REJECT BUTTONS -->
                                                <div class="booking-status-container col-xs-12" ng-hide="booking.bookingStatus !== 1">
                                                    <button type="button" ng-click="setUpdateModalTexts(true, booking)" data-toggle="modal" data-target="#updateBookingModal" class="col-xs-12 col-md-5 btn btn-success" ng-show="booking.bookingStatus !== 4" ng-disabled="booking.bookingStatus === 2 || booking.bookingStatus === 3">
                                                        Godkänn bokning
                                                    </button>
                                                    <button type="button" ng-click="setUpdateModalTexts(false, booking)" data-toggle="modal" data-target="#updateBookingModal" class="col-xs-12 col-md-5 col-md-offset-2 btn btn-danger" ng-show="booking.bookingStatus !== 4" ng-disabled="booking.bookingStatus === 2 || booking.bookingStatus === 3">
                                                        Neka bokning
                                                    </button>

                                                </div>


                                            </div>


                                        </div>
                                    </div>
                                    <!-- Update booking Modal -->
                                    <div class="modal" id="updateBookingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                    <h4 class="modal-title" id="myModalLabel">{{updateBookingModalTitle}}</h4>
                                                </div>
                                                <div class="modal-body clearfix">

                                                    <p>
                                                        <center>{{updateBookingModalBody}}</center>
                                                    </p>
                                                    <form name="hostCommentForm" id="hostCommentForm">
                                                        <div ng-show="showCommentInput">
                                                            <label for="hostComment">Lämna en kommentar till gästen</label>
                                                            <textarea type="text" class="col-xs-12 form-control" name="hostComment" ng-model="hostComment" required></textarea>
                                                            <div ng-show="isApproval">
                                                                <label for="price">Slutpris</label>
                                                                <input type="text" class="col-xs-12 form-control" name="currentBookingPrice" ng-model="currentBookingPrice" required />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer" ng-show="isApproval">
                                                    <div ng-show="showCommentInput">
                                                        <button type="button" ng-click="approveBooking(hostComment, currentBookingPrice)" ng-disabled="hostCommentForm.hostComment.$invalid" class="btn btn-success col-xs-12">Godkänn bokning</button>
                                                        <button type="button" data-dismiss="modal" class="btn btn-danger col-xs-12">Avbryt</button>
                                                    </div>
                                                    <div ng-show="bookingStatusIsUpdated">
                                                        <button type="button" class="btn btn-primary col-xs-12" ng-click="reloadPage()" data-dismiss="modal">OK</button>
                                                    </div>
                                                </div>
                                                <div class="modal-footer" ng-show="!isApproval">
                                                    <div ng-show="showCommentInput">
                                                        <button type="button" ng-click="rejectBooking(hostComment)" ng-disabled="hostCommentForm.hostComment.$invalid" class="btn btn-primary col-xs-12">Neka bokning</button>
                                                        <button type="button" data-dismiss="modal" class="btn btn-danger col-xs-12">Avbryt</button>
                                                    </div>
                                                    <div ng-show="bookingStatusIsUpdated">
                                                        <button type="button" class="btn btn-primary col-xs-12" ng-click="reloadPage()" data-dismiss="modal">OK</button>
                                                    </div>

                                                </div>




                                            </div>
                                        </div>
                                    </div>
                                    <!-- Update booking Modal END-->
                                </div>
                                <!-- ng-repaet end: booking in user bookings-->
                            </div>
                            <!-- ng-repaet end: status in bookingstatuses-->
                        </div>
                        <!-- BOOKING LIST END-->


                        <div class="user-creds-container grey-section clearfix" ng-show="tabs.userTab.isOpen">
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
                                            <label>Logotyp</label>
                                            <div class="user-info-help-text">Ändras av Meetrd</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12" ng-if="userInfoIsLoaded">
                                            <img src="{{userInfo.logotype}}">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="nickname">Företagsnamn</label>
                                            <div class="user-info-help-text">Visas på alla era rum och tillhörande bokningar</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class="form-control" name="nickname" ng-model="userInfo.nickname" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="biography">Presentation av företaget</label>
                                            <div class="user-info-help-text">Visas på era rum</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <textarea class="form-control" rows="6" name="biography" ng-model="userInfo.biography" required></textarea>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="cancelDeadline">Avbokningsdeadline (timmar)</label>
                                            <div class="user-info-help-text">Avbokning av era rum kan ske senast så många timmar före bokningens starttid.</div>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input class="form-control" name="cancelDeadline" ng-model="userInfo.cancelDeadline" required />
                                        </div>
                                    </div>
                                    <div class="col-xs-12">
                                        <h3>Kontaktuppgifter</h3>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="firstname">Förnamn</label>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class=" form-control" name="firstname" ng-model="userInfo.firstname" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label for="lastname">Efternamn</label>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="text" class="form-control" name="lastname" ng-model="userInfo.lastname" required>
                                        </div>
                                    </div>

                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label>Telefonnummer</label>
                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="tel" class="form-control" name="phone" ng-model="userInfo.phone" required>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 no-padding input-container">
                                        <div class="col-sm-3 col-xs-12">
                                            <label>E-mail</label>
                                            <!--										<div class="user-info-help-text">Ändras av Meetrd</div>-->

                                        </div>
                                        <div class="col-sm-9 col-xs-12">
                                            <input type="email" class="form-control" name="email" ng-model="userInfo.email" required>
                                        </div>
                                    </div>
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
                                                    <input type="password" placeholder="Ange ditt lösenord" class="col-xs-12 form-control" name="password" ng-model="userPass" ng-hide="clickedUpdateUserInfo" required>

                                                    <span class="col-xs-12 error" ng-show="triedToUpdateUserInfo">
													Fel lösenord
												</span>
                                                </div>
                                                <div ng-show="!userInfoUpdated && clickedUpdateUserInfo && !triedToUpdateUserInfo" class="loader-container">
                                                    <meetrd-loader></meetrd-loader>
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