<?php
class CHPCS_widget extends WP_Widget {

	public function CHPCS_widget() {
			parent::__construct(false, $name = __('CHPC Slider', 'wa_chpcs_txt') );
	}

	// widget form creation
	function form($instance) {

	// Check values
	if( $instance) {
	     $title = esc_attr($instance['title']);
	} else {
	     $title = '';
	}
	?>

	<p>
	<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Widget Title', 'wp_widget_plugin'); ?></label>
	<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
	</p>
	<?php
	}

// update widget
function update($new_instance, $old_instance) {
      $instance = $old_instance;
      $instance['title'] = strip_tags($new_instance['title']);
     return $instance;
}

// display widget
function widget($args, $instance) {
   extract( $args );
   // these are the widget options
   $title = apply_filters('widget_title', $instance['title']);
   echo $before_widget;
   // Display the widget
   echo '<div class="widget-text wp_widget_plugin_box">';

   // Check if title is set
   if ( $title ) {
      echo $before_title . $title . $after_title;
   }
   echo do_shortcode('[carousel-horizontal-posts-content-slider]');
   echo '</div>';
   echo $after_widget;
	}
}
// register widget
add_action('widgets_init', create_function('', 'return register_widget("CHPCS_widget");'));