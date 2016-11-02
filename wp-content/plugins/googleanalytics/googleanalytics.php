<?php
/*
Plugin Name: Google Analytics
Plugin URI: http://wordpress.org/extend/plugins/googleanalytics/
Description: Enables <a href="http://www.google.com/analytics/">Google Analytics</a> on all pages.
Version: 1.0.7
Author: Kevin Sylvestre
Author URI: http://ksylvest.com/
*/

if (!defined('WP_CONTENT_URL'))
      define('WP_CONTENT_URL', get_option('siteurl').'/wp-content');
if (!defined('WP_CONTENT_DIR'))
      define('WP_CONTENT_DIR', ABSPATH.'wp-content');
if (!defined('WP_PLUGIN_URL'))
      define('WP_PLUGIN_URL', WP_CONTENT_URL.'/plugins');
if (!defined('WP_PLUGIN_DIR'))
      define('WP_PLUGIN_DIR', WP_CONTENT_DIR.'/plugins');

function activate_googleanalytics() {
  add_option('web_property_id', 'UA-0000000-0');
}

function deactive_googleanalytics() {
  delete_option('web_property_id');
}

function admin_init_googleanalytics() {
  register_setting('googleanalytics', 'web_property_id');
}

function admin_menu_googleanalytics() {
  add_options_page('Google Analytics', 'Google Analytics', 'manage_options', 'googleanalytics', 'options_page_googleanalytics');
}

function options_page_googleanalytics() {
  include(WP_PLUGIN_DIR.'/googleanalytics/options.php');
}

function googleanalytics() {
  $web_property_id = get_option('web_property_id');
?>
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '<?php echo $web_property_id ?>', 'auto');
ga('send', 'pageview');
</script>
<?php
}

register_activation_hook(__FILE__, 'activate_googleanalytics');
register_deactivation_hook(__FILE__, 'deactive_googleanalytics');

if (is_admin()) {
  add_action('admin_init', 'admin_init_googleanalytics');
  add_action('admin_menu', 'admin_menu_googleanalytics');
}

if (!is_admin()) {
  add_action('wp_head', 'googleanalytics');
}

?>
