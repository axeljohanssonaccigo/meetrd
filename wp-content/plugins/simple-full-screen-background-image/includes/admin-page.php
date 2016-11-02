<?php

function sfsb_admin_page() {

	global $sfsb_options;
?>
	<div class="wrap">
		<div id="fsb-wrap" class="fsb-help">
			<h2>Full Screen Background Image</h2>
			<?php
			if ( ! isset( $_REQUEST['updated'] ) )
				$_REQUEST['updated'] = false;
			?>
			<?php if ( false !== $_REQUEST['updated'] ) : ?>
			<div class="updated fade"><p><strong><?php _e( 'Options saved', 'simple-full-screen-background-image' ); ?></strong></p></div>
			<?php endif; ?>
			<form method="post" action="options.php">

				<?php settings_fields( 'fsb_register_settings' ); ?>

				<h4><?php _e( 'Choose Your Image', 'simple-full-screen-background-image' ); ?></h4>

				<p>
					<input id="fsb_settings[image]" name="fsb_settings[image]" type="text" class="upload_field" value="<?php echo $sfsb_options['image']; ?>"/>
					<input class="upload_image_button button-secondary" type="button" value="<?php _e( 'Choose Image', 'simple-full-screen-background-image' ); ?>"/>
					<label class="description" for="fsb_settings[image]"><?php _e( 'This image will be applied to the background of your website', 'simple-full-screen-background-image' ); ?></label>
				</p>

				<p>
					<?php if( ! empty( $sfsb_options['image'] ) ) { ?>
						<img src="<?php echo $sfsb_options['image']; ?>" id="fsb_preview_image" style="padding: 3px; border: 1px solid #f0f0f0; max-width: 600px; overflow: hidden;"/>
					<?php } else { ?>
						<img src="<?php echo plugin_dir_url( __FILE__ ) . 'preview.jpg'; ?>" id="fsb_preview_image" style="padding: 3px; border: 1px solid #f0f0f0; max-width: 600px; overflow: hidden;"/>
					<?php } ?>
				</p>

				<!-- save the options -->
				<p class="submit">
					<input type="submit" class="button-primary" value="<?php _e( 'Save Options', 'simple-full-screen-background-image' ); ?>" />
				</p>

			</form>
		</div><!--end fsb-wrap-->
	</div><!--end wrap-->
<?php
}
function sfsb_init_admin() {
	add_submenu_page( 'themes.php', __( 'Full Screen Background Image', 'simple-full-screen-background-image' ), __( 'Fullscreen BG Image', 'simple-full-screen-background-image' ), 'manage_options', 'full-screen-background', 'sfsb_admin_page' );
}
add_action('admin_menu', 'sfsb_init_admin');

// register the plugin settings
function sfsb_register_settings() {
	register_setting( 'fsb_register_settings', 'fsb_settings' );
}
add_action( 'admin_init', 'sfsb_register_settings' );