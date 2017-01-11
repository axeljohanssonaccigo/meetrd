<?php
/**  Template Name: Alla värdar
 * The template for displaying all pages.
 *
 * This is the template that redirects to a host page. To enable nicer sharing links for host pages in social media. 
 *
 * @package Meetrd
 */
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
        var allHosts = <?php echo json_encode($all_hosts); ?>;
        console.log(allHosts);
    </script>


    <div id="primary" class="content-area" ng-app="startApp" ng-controller="startCtrl">
        <main id="main" class="site-main" role="main">

            <div class="container-fluid white-section row no-padding-mobile">
                <div class="container first-page">
                    <div class="popular-hosts">
                        ALLA VÅRA VÄRDFÖRETAG
                    </div>
                    <div class="hosts-rooms-container">
                        <div ng-repeat="host in allHosts | orderBy:'nickname'" class="host-rooms-container col-sm-3 col-xs-12 clearfix no-padding-mobile" ng-show="host.showBanner">
                            <a href="<?php echo get_home_url().'/search/?host='?>{{host.ID}}">
                                <div class="host-rooms-photo-container">
                                    <img src="{{host.banner}}">
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>


        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->
    <?php get_footer(); ?>