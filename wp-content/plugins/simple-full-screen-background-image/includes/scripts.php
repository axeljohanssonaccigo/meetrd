<?php

function sfsb_load_css() {
	global $sfsb_options;
	if( isset( $sfsb_options['image'] ) ) {
		wp_enqueue_style( 'fsb-image', plugin_dir_url( __FILE__ ) . 'fullscreen-image.css' );
	}
}
add_action( 'wp_enqueue_scripts', 'sfsb_load_css' );

function sfsb_load_admin_scripts( $hook ) {
	if( 'appearance_page_full-screen-background' !== $hook )
		return;

	wp_enqueue_media();
	wp_enqueue_script( 'fsb-scripts', plugin_dir_url( __FILE__ ) . 'fsb-scripts.js', array( 'jquery', 'media-upload', 'thickbox' ), filemtime( plugin_dir_path( __FILE__ ) . 'fsb-scripts.js' ) );
}
add_action( 'admin_enqueue_scripts', 'sfsb_load_admin_scripts' );
