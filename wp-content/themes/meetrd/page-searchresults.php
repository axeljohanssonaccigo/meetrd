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

    <div id="primary" class="content-area" ng-app="roomApp" ng-controller="roomCtrl" ng-cloak>
        <main id="main" class="site-main" role="main">
            <!-- FILTER SEARCH RESULT -->
            <div class="white-section container">
                <div class="row">
                    <h1 class="popular-hosts" ng-show="!isHostPage">
                        SÖK MÖTESRUM
                    </h1>
                </div>
                <div class="" ng-show="!isHostPage">
                    <div class="row search-form-container">
                        <form name="updateSearchForm" id="updateSearchForm" class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div class="col-xs-12 text-center search-input">
                                <label class="control-label" for="nrOfPeople">Hur många är ni?</label>
                                <input type="number" min="1" ng-model="query.nrOfPeople" name="nrOfPeople" id="nrOfPeople" class="form-control" />
                            </div>
                            <div class="col-xs-12 text-center search-input">
                                <label class="control-label" for="city">Vilken stad vill du boka i?</label>
                                <select class="form-control" placeholder="Välj stad" name="city" id="city" ng-model="query.city">
                                    <option ng-repeat="city in allCities" value="{{city}}">{{city}}</option>
                                </select>
                            </div>
                            <div class="col-xs-12 text-center search-input">
                                <label class=" control-label" for="company">Vet du vilket företag du vill boka hos?</label>
                                <select class="form-control" name="company" id="company" ng-model="query.companyName" ng-change="setCompanyCity()">
                                    <option ng-repeat="company in allCompanies | unique:'name' | orderBy:'name'" value="{{company.name}}">{{company.name}}</option>
                                </select>
                            </div>
                            <div class="col-xs-12">
                                <label class=" control-label" for="company">&nbsp;</label>
                                <button type="button" ng-click="resetSearchQuery()" class="form-control btn btn-primary">Rensa sök</button>
                            </div>
                            <div class="col-xs-12" ng-show="query.isSearchResult">
                                <h4> Din sökning gav {{query.nrOfHits}} rum</h4>
                                <h5 ng-show="query.address !== null"> {{query.address}}</h5>
                            </div>

                        </form>
                        <div class="col-sm-8 col-md-8 col-lg-8 hidden-xs search-form-map-container">
                            <angular-google-maps ng-if="mapSettings.loadingControl.hasRooms" map-settings="mapSettings"></angular-google-maps>
                        </div>
                        <!--                        On map: {{mapSettings.rooms.length}} Zoom: {{mapSettings.zoom}} Center: {{mapSettings.center}} {{mapSettings.loadingControl}}-->
                    </div>
                </div>

            </div>


            <!-- Meetrd Loader -->
            <div ng-hide="allRoomsLoaded" class="container loader-container">
                <meetrd-loader></meetrd-loader>
            </div>

            <!-- HOST INFO -->
            <div class="container white-section" ng-show="allRoomsLoaded" ng-if="isHostPage">
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
                            <div class="host-review-container" ng-repeat="review in currentHost.reviews">
                                <div class="col-xs-12 host-review">
                                    "{{review}}"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- SEARCH RESULT -->
            <div class="row">
                <div class="container-fluid off-white-section" ng-show="allRoomsLoaded">
                    <div class="container">
                        <div class="search-result-container ">
                            <div class="row" ng-show="query.nrOfHits > 0">
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <label class="control-label" for="sort">Sortera</label>
                                    <select class="form-control" name="sort" id="sort" ng-model="sortField">
                                        <option ng-repeat="sortField in query.sortFields" value="{{sortField.value}}">{{sortField.name}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row" ng-show="query.nrOfHits === 0">
                                <div class="col-xs-12">
                                    Din sökning gav inga träffar.
                                </div>
                            </div>
                            <div data-ng-repeat="room in filteredRooms = (allRooms | roomFilter:query) | orderBy: sortField" class="search-result-room-container col-sm-4 clearfix" ng-show="$index + 1 <= query.shownRooms">
                                <div>
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
                                            <h1 ng-hide="isHostPage"><a href="<?php echo get_home_url().'/search/?host='?>{{room.hostId}}">{{getHostFromHostId(room.hostId).nickname}}</a></h1>
                                            <h1 ng-show="isHostPage"><a href="{{room.url}}">{{room.title}}</a></h1>

                                            <!--                                    <span class="hidden-sm hidden-md">{{room.area}} - {{room.city}}</span>-->
                                            <span class="block-display">{{room.area}} - {{room.city}} - {{room.street}}</span>

                                        </div>
                                        <span class="col-xs-12 ng-hide" ng-click="goToRoom(room.url, query.date)"><a href="">{{room.title}}</a></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12 show-more-rooms-container no-padding" ng-if="!isHostPage" ng-show="query.nrOfHits > 0">
                                <div class="shows-x-rooms bold pull-left" ng-show="allRoomsLoaded && !isHostPage">Visar {{query.shownRooms}} av {{query.nrOfHits}} rum</div>
                                <button ng-hide="query.nrOfHits === query.shownRooms" type="button" ng-click="showMoreRooms()" ng-show="true" class="pull-right btn btn-primary">Visa fler rum</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php get_footer(); ?>

        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->