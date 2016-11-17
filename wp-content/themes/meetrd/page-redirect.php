<?php
/**  Template Name: Värd Redirect
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
        var pageName = '<?php echo $pagename; ?>';
        pageName = pageName.replace(/-/g, ' ').toLowerCase();
        console.log('pagename: ' + pageName);
        for (i = 0; i < allHosts.length; i++) {
            //var hostName = allHosts[i].data.user_login.toLowerCase();
            //            var hostNick = allHosts[i].data.user_nicename.toLowerCase();
            var hostNick = allHosts[i].nickname[0].toLowerCase();

            console.log(hostNick);
            if (hostNick === pageName) {
                var hostId = allHosts[i].data.ID;
                if (location.pathname.search('meetrd') > -1) {
                    var urlAddOn = '/meetrd';
                } else {
                    var urlAddOn = '';
                }
                if (hostId > 0) {
                    console.log(hostNick + " redirectar");

                    location.href = location.origin.concat(urlAddOn).concat('/search/?host=').concat(hostId);
                }

            }
        }
    </script>


    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <div id="page-redirect">
            </div>
        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->