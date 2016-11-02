<?php
/*
Plugin Name: Simple Full Screen Background Image
Description: Easily set an automatically scaled full-screen background images
Version: 1.2
Author: Pippin Williamson
Author URI: http://pippinsplugins.com
*/

function sfsb_textdomain() {

	// Set filter for plugin's languages directory
	$lang_dir = dirname( plugin_basename( __FILE__ ) ) . '/languages/';
	$lang_dir = apply_filters( 'sfsb_languages_directory', $lang_dir );

	// Load the translations
	load_plugin_textdomain( 'simple-full-screen-background-image', false, $lang_dir );
}
add_action( 'init', 'sfsb_textdomain' );

/*****************************************
* global
*****************************************/

$sfsb_options = get_option('fsb_settings');

/*****************************************
* includes
*****************************************/
include('includes/admin-page.php');
include('includes/display-image.php');
include('includes/scripts.php');
