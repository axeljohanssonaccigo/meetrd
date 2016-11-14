<?php
/** Template Name: sökresultatsida
 *
 *
 * @package Meetrd
 */
$custom_fields = get_post_custom();
$page_id = get_the_id();
get_header();

#Get all hosts
$args = array(
	'role' => 'meetrdhost',
	);
$all_hosts = get_users($args);
for ($i=0; $i < count($all_hosts); $i++) {
	#($all_hosts[$i]['ID']);
	$temp = (array)$all_hosts[$i];
	$host_meta = get_user_meta($temp['ID']);
	$all_hosts[$i] = array_merge($temp, $host_meta);
}
?>
    <script type="text/javascript">
        allHosts = <?php echo json_encode($all_hosts); ?>;
    </script>

    <div id="primary" class="content-area" ng-app="roomApp" ng-controller="roomCtrl" ng-cloak onscroll="onScroll()">
        <main id="main" class="site-main container-fluid" role="main">
            <!-- UPDATE SEARCH RESULT -->
            <div class="row white-section">
                <div class="container">
                    <div class="row">
                        <div class="popular-hosts" ng-show="!isHostPage">
                            SÖK MÖTESRUM
                        </div>
                        <div class="update-search-container clearfix" ng-show="!isHostPage">
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <form name="updateSearchForm" ng-submit="search(query)">
                                    <div class="col-xs-12 col-sm-4">
                                        <label class="control-label" for="nrOfPeople">Hur många är ni?</label>
                                        <input type="number" min="1" placeholder="Antal personer" ng-model="query.nrOfPeople" name="nrOfPeople" id="nrOfPeople" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-sm-4">
                                        <label class=" control-label" for="company">Vet du vilket företag du vill boka hos?</label>
                                        <select class="form-control" name="company" id="company" ng-model="query.company">
                                            <option ng-repeat="company in allCompanies" value="{{company.name}}">{{company.name}}</option>
                                        </select>
                                    </div>
                                    <div class="col-xs-12 col-sm-4">
                                        <label class="control-label" for="city">Vilken stad vill du boka i?</label>
                                        <select class="form-control" name="city" id="city" ng-model="query.city">
                                            <option ng-repeat="company in allCompanies" value="{{company.city}}">{{company.city}}</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" ng-if="allRoomsLoaded">
                                <angular-google-maps rooms-on-map="roomsOnMap" center="" zoom="5"></angular-google-maps>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!--
                                        <button type="submit" class="col-xs-12 btn btn-primary btn-search" ng-disabled="!updateSearchForm.$dirty">
                                            Uppdatera
                                        </button>
-->

            <!-- Meetrd Loader -->
            <div ng-if="!allRoomsLoaded && !isHostPage" class="container loader-container">
                <meetrd-loader></meetrd-loader>
                <!-- <h2>Meetrd söker efter rum...</h2> -->
            </div>
            <div ng-if="!roomsForHostLoaded && isHostPage" class="container loader-container">
                <meetrd-loader></meetrd-loader>
                <!-- <h2>Var god vänta...</h2> -->
            </div>


            <!-- HOST INFO -->
            <div class="container white-section" ng-if="roomsForHostLoaded">
                <div class="">
                    <div class="row">
                        <div class="host-info-container clearfix" id="host-info-container">
                            <div class="host-logo-container clearfix">

                                <div class="col-xs-12 align-center">
                                    <a href="{{currentHost.data.user_url}}" target="_blank"><img src="{{currentHost.logotype}}" /></a>
                                </div>
                            </div>

                            <div class="col-xs-12 no-padding" ng-show="isHostPage">
                                <div class="col-xs-12 host-biography-container hidden-xs hidden-sm visible-md visible-lg">
                                    <h1>{{currentHost.slogan}}</h1>
                                    <span class="preserve-paragraphs">{{currentHost.biography}}

									För mer information, besök vår <a target="_blank" href="{{currentHost.data.user_url}}">hemsida</a>.

								</span>
                                </div>
                                <div class="col-xs-12 host-biography-container visible-xs visible-sm hidden-md hidden-lg">
                                    <span ng-hide="showMoreInfo" class="preserve-paragraphs">{{currentHost.biography.slice(0,hostBiographyBreakpoint)}}... <span class="more-info-link link-color" ng-hide="showMoreInfo" ng-click="showMoreInfo = !showMoreInfo">Läs mer</span></span>
                                    <span ng-show="showMoreInfo" class="preserve-paragraphs">{{currentHost.biography}}

									För mer information, besök vår <a target="_blank" href="{{currentHost.data.user_url}}">hemsida</a>.

									<span class="more-info-link link-color" ng-show="showMoreInfo" ng-click="showMoreInfo = !showMoreInfo">Dölj</span></span>
                                </div>


                                <!--
                                <div class="separator"></div>
                                <div class="col-xs-12 host-rating-container">
                                    <div ng-repeat="star in hostRatingRange" class="rating-star">
                                        <i class="fa fa-star fa-lg" ng-if="star <= currentHost.rating"></i>
                                        <i class="fa fa-star-o fa-lg" ng-if="star > currentHost.rating"></i>
                                    </div>
                                    baserat på {{currentHost.votes.length}} röster.
                                </div>
                                <div class="separator"></div>
-->
                                <div class="host-review-container" ng-repeat="review in currentHost.reviews">
                                    <div class="col-xs-12 host-review">
                                        "{{review}}"
                                    </div>


                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>


            <!-- SEARCH RESULT -->
            <!--ng-if="allRoomsLoaded || roomsForHostLoaded"-->
            <div class="off-white-section row">
                <div class="container-fluid">
                    <div class="container search-result-container ">


                        <!--					<div class="filter-rooms-container clearfix" ng-hide="isHostPage">

									<input type="text" name="filterSearch" class="form-control col-xs-12" placeholder="Filtera sökresultatet..." ng-model="roomFilter"></input>

								</div> -->
                        <div class="filter-rooms-container clearfix" ng-if="isHostPage">
                            <input type="text" name="filterSearch" class="form-control col-xs-12" placeholder="Filtrera {{currentHost.nickname}}s rum" ng-model="roomFilter"></input>
                        </div>
                        <!--<div ng-repeat="room in filteredRooms = (allRooms | filter:roomMatchesSearchQuery():true)" class="room col-xs-12">-->

                        <div data-ng-repeat="room in filtered = (allRooms | roomFilter:query) | orderBy: sortField" class="search-result-room-container col-sm-4 clearfix">

                            <div class="search-result-room-photo-container">
                                <a href="{{room.url}}">
                                    <img src="{{room.photo}}">
                                    <div class="search-result-price-tag">
                                        <i class="fa fa-users"></i>{{" " + room.nrOfPeople}} personer
                                        <br>
                                        <span ng-show="room.price > 0">{{room.price}} kr / timme</span>
                                        <span ng-show="room.price === 0">GRATIS</span>
                                    </div>
                                </a>

                            </div>
                            <div class="search-result-room-title">
                                <div class="col-xs-12 no-padding">
                                    <h1 ng-click="goToHostPage(room.hostId)"><a href="">{{getHostFromHostId(room.hostId).nickname}}</a></h1>

                                    <span class="hidden-sm hidden-md">{{room.area}} - {{room.city}}</span>
                                    <span class="hidden-xs hidden-lg block-display">{{room.area}} - {{room.city}}</span>

                                    <!--		<div ng-repeat="star in hostRatingRange" class="rating-star" ng-hide="isHostPage">
												<i class="fa fa-star" ng-if="star <= getHostFromHostId(room.hostId).rating"></i>
												<i class="fa fa-star-o" ng-if="star > getHostFromHostId(room.hostId).rating"></i>
											</div> -->
                                </div>
                                <span class="col-xs-12 ng-hide" ng-click="goToRoom(room.url, query.date)"><a href="">{{room.title}}</a></span>
                            </div>

                        </div>
                        <div class="col-xs-12 show-more-rooms-container no-padding" ng-click="showMoreRooms()">
                            <div class="shows-x-rooms bold pull-left" ng-show="!isHostPage">Visar {{query.nrOfHits}} av {{query.nrOfHits}} sökträffar</div>

                            <span ng-hide="queriedRooms.length === nrOfRoomsShown.value" class="pull-right btn btn-primary">Visa fler rum</span>
                        </div>
                        <!-- <angular-google-maps rooms-on-map="allRooms"></angular-google-maps> -->

                    </div>
                    <?php get_footer(); ?>
                </div>


        </main>
        <!-- #main -->
        </div>
        <!-- #primary -->