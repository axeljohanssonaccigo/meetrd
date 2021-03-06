<?php
/** Template Name: startsida
 *
 *
 * @package Meetrd
 */
$custom_fields = get_post_custom();
$page_id = get_the_id();

get_header();
#Get all hosts data
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

    <div id="primary" class="content-area" ng-app="startApp" ng-controller="startCtrl" ng-cloak>
        <main id="main" class="site-main container-fluid row" role="main">
            <div class="container-fluid white-section">
                <div class="heading-text white-section container no-padding-mobile">
                    <!--                    <h1 class="hidden-lg hidden-md hidden-sm hidden-xs"><span class="highlight">Mötesrum</span><br> för det <br>moderna <br>företaget</h1>-->
                    <h1><span class="highlight">Mötesrum</span> för<br>moderna företag</h1>
                    <h2>Hyr <span class="highlight">personliga</span> och <span class="highlight">prisvärda</span><br>mötesrum av andra företag</h2>
                    <div class="col-xs-12 text-center btn-container-start">
                        <a href="<?php  echo get_home_url().'/search'; ?>">
                            <button type="submit" class="btn btn-meetrd btn-lg">Sök mötesrum</button>
                        </a>
                    </div>
                </div>
            </div>

            <!--
            <div class="parallax-container row" id="meetrd-banner-container">
                <div class="container">
            <div class="col-xs-12 heading-text">
                <h1>Mötesrum för det moderna företaget</h1>
                <h2>Hyr personliga och prisvärda mötesrum av andra företag</h2>
            </div>
            <div class=" col-xs-12 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
                
            </div>
    </div>

    <div class="parallax" id="meetrd-banner">
        <img ng-src="{{viewPort.bannerUrl}}" />
    </div>

    </div>-->

            <div class="container-fluid off-white-section row no-padding-mobile hidden-xs">
                <div id="meetrd-fans" class="clearfix">
                    <h3>
                        Vi har bokat genom meetrd.se
                    </h3>
                    <div class="fan-logo" ng-repeat="fan in meetrdFans | orderBy: 'name'">
                        <img ng-src="{{fan.logoUrl}}" />
                        <!--      ng-class="{'push-up flip-up': ($index % 2) > 0, 'push-down flip-down': ($index % 2) === 0}"                   -->
                    </div>
                </div>
            </div>
            <div class="container-fluid white-section row no-padding-mobile">
                <div class="container first-page">
                    <div id="cities" class="clearfix">
                        <h1 class="popular-hosts">
                            Var är ditt nästa möte?
                        </h1>
                        <a href="<?php  echo get_home_url().'/search?city=stockholm'; ?>">
                            <div class="col-md-4 col-sm-4 col-xs-12 city-container">
                                <div class="city-name">
                                    stockholm
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_stockholm_800.jpg'; ?>" />
                            </div>
                        </a>
                        <a href="<?php  echo get_home_url().'/search?city=malmo'; ?>">
                            <div class="col-md-4 col-sm-4 col-xs-12 city-container">
                                <div class="city-name">
                                    malmö
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_malmo_800.jpg'; ?>" />
                            </div>
                        </a>
                        <a href="<?php  echo get_home_url().'/search?city=goteborg'; ?>">
                            <div class="col-md-4 col-sm-4 col-xs-12 city-container">
                                <div class="city-name">
                                    göteborg
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_goteborg_800.jpg'; ?>" />
                            </div>
                        </a>
                        <a href="<?php  echo get_home_url().'/search?city=boras'; ?>">
                            <div class="col-md-offset-2 col-md-4 col-sm-4 col-sm-offset-2 col-xs-12 city-container">
                                <div class="city-name">
                                    borås
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_boras_800.jpg'; ?>" />
                            </div>
                        </a>
                        <a href="<?php  echo get_home_url().'/search?city=norrkoping'; ?>">
                            <div class="col-md-4 col-sm-4 col-xs-12 city-container">
                                <div class="city-name">
                                    norrköping
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_norrkoping_800.jpg'; ?>" />
                            </div>
                        </a>
                        <!--
                        <a href="<?php  echo get_home_url().'/search?city=linkoping'; ?>">
                            <div class="col-md-4 col-sm-4 col-xs-12 city-container">
                                <div class="city-name">
                                    linköping
                                </div>
                                <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/startpage_linkoping_800.jpg'; ?>" />
                            </div>
                        </a>
-->
                    </div>
                </div>
            </div>

            <div class="container-fluid pink-section row no-padding-mobile">
                <div class="container first-page">
                    <div id="step-number-container" class="clearfix">
                        <h1 class="popular-hosts">
                            Så enkelt är det att boka mötesrum
                        </h1>
                        <div class="col-md-4 col-sm-4 col-xs-12 ">
                            <div class="step-number">
                                01
                            </div>
                            <div class="step-number-content">
                                Klicka på <a href="<?php  echo get_home_url().'/search'; ?>">sök mötesrum</a> och hitta ett rum som passar ditt behov eller ett företag som du är nyfiken på. Skapa därefter ett konto och logga in.
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12 buffer-top-desktop">

                            <div class="step-number pull-up hidden-sm hidden-md hidden-lg">
                                02
                            </div>
                            <div class="step-number-content">
                                Välj dag och tid för mötet och skicka iväg din bokningsförfrågan. Värdföretaget har sedan 24 timmar på sig att ta ställning till din förfrågan och besvara den.
                            </div>
                            <div class="step-number hidden-xs">
                                02
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="step-placeholder">
                                <div class="step-number">
                                    03
                                </div>
                                <div class="step-number-content">
                                    Håll ditt inspirerande möte hos värdföretaget! Efter mötet skickar meetrd.se ut en faktura på överenskommen summa.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-fluid row no-padding-mobile">
                <div class="container first-page">
                    <div id="room-carousel">
                        <h1 class="popular-hosts">
                            Vilket företag vill du boka mötesrum hos?
                        </h1>
                        <div id="popular-hosts-container">
                            <?php dynamic_sidebar( 'hostwidget' ); ?>

                        </div>
                        <div class="text-center all-hosts-link">
                            <a href="<?php echo get_home_url().'/vardforetag'; ?>">Här hittar du alla våra värdföretag</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="newsletter-container">
                <div class="parallax-container newsletter-height row">
                    <div class="container">
                        <div class="newsletter text-center">
                            <?php
                                                $istance = array( 'title' => 'Få uppdateringar om det senaste');
                                                $args = array('before_title' => '<h3>', 'after_title' => '</h3>' );
                                                the_widget('ALO_Easymail_Widget', $istance, $args );
                                                ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid white-section row">
                <div class="container first-page">
                    <h1 class="popular-hosts">
                        Blogg
                    </h1>
                    <div class="blog-posts-container clearfix">
                        <?php get_sidebar(); ?>
                    </div>
                </div>
            </div>
        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->
    <?php get_footer(); ?>