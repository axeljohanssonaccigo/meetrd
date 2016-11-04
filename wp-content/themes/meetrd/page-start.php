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
        console.log(allHosts);
    </script>

    <div id="primary" class="content-area" ng-app="startApp" ng-controller="startCtrl" ng-cloak>
        <main id="main" class="site-main container-fluid" role="main">
            <div class="parallax-container row">
                <div class="container">
                    <!--HEADING TEXT-->
                    <div class="col-xs-12 heading-text">
                        <h1>Boka mötesrum hos andra företag</h1>
                        <h2>✓ Socialt  ✓ Hållbart  ✓ Prisvärt</h2>
                    </div>
                    <!-- Search container -->
                    <div class="search-container col-xs-12 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
                        <div class="col-xs-12 text-center">
                            <a href="<?php  echo get_home_url().'/search/?nrOfPeople=null'; ?>">
                                <button type="submit" class="btn btn-meetrd">Sök mötesrum</button>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="parallax">
                    <img src="<?php echo get_home_url().'/wp-content/uploads/2016/06/orange-cup-crop.jpg'; ?>" />
                </div>
            </div>

            <div class="off-white-section row">
                <div class="container">
                    <div class="three-steps-container col-xs-12 no-padding">
                        <div class="col-xs-12 col-sm-4 one-step no-padding-mobile">
                            <a href="<?php echo get_home_url().'/hyra-ut'; ?>">
                                <div class="col-xs-12">
                                    <img src="<?php echo get_home_url().'/wp-content/uploads/2015/10/keys14.png'; ?>">
                                </div>
                                <h1>Bli värd</h1>
                                <p> </p>
                            </a>

                        </div>
                        <div class="col-xs-12 col-sm-4 one-step no-padding-mobile">
                            <a href="<?php echo get_home_url().'/att-hyra'; ?>">
                                <div class="col-xs-12">
                                    <img src="<?php echo get_home_url().'/wp-content/uploads/2015/10/agreement_blue.png'; ?>">
                                </div>
                                <h1>Att hyra</h1>
                                <p> </p>
                            </a>
                        </div>
                        <div class="col-xs-12 col-sm-4 one-step no-padding-mobile">
                            <a href="<?php echo get_home_url().'/sa-har-fungerar-det'; ?>">
                                <div class="col-xs-12">
                                    <img src="<?php echo get_home_url().'/wp-content/uploads/2015/10/question_blue.png'; ?>">
                                </div>
                                <h1>Vi hjälper dig</h1>
                                <p> </p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            <div class="container-fluid white-section row no-padding-mobile">
                <div class="container first-page">
                    <div class="popular-hosts">
                        VILKET FÖRETAG VILL DU BOKA HOS?
                    </div>
                    <div class="hosts-rooms-container">
                        <div ng-repeat="host in allHosts" class="host-rooms-container col-sm-3 col-xs-12 clearfix no-padding-mobile" ng-if="host.showBanner">
                            <a href="<?php echo get_home_url().'/search/?host='?>{{host.ID}}">
                                <div class="host-rooms-photo-container">
                                    <img src="{{host.banner}}">
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <p class="popular-hosts-info text-center">För tillfället hittar du alla våra företag i Stockholm och Malmö</p>
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

            <div class="parallax">
                <img src="<?php echo get_home_url().'/wp-content/uploads/2016/06/Coffee_break.jpg'; ?>" />
            </div>
        </div>
    </div>
</div>
            <div class="container-fluid white-section row">
                <div class="container first-page">
                    <div class="popular-hosts">
                        BLOGG
                    </div>
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