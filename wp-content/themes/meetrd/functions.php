<?php
/**
 * Meetrd functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Meetrd
 */

if ( ! function_exists( 'meetrd_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function meetrd_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Meetrd, use a find and replace
	 * to change 'meetrd' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'meetrd', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary Menu', 'meetrd' ),
		) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		) );

	/*
	 * Enable support for Post Formats.
	 * See https://developer.wordpress.org/themes/functionality/post-formats/
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
		));
}
endif; // meetrd_setup
add_action( 'after_setup_theme', 'meetrd_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function meetrd_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'meetrd_content_width', 640 );
}
add_action( 'after_setup_theme', 'meetrd_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function meetrd_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'meetrd' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
		) );
    register_sidebar( array(
		'name' =>esc_html__( 'hostwidget', 'meetrd' ),
		'id' => 'hostwidget',
		'description' => 'Lägg in karusell för populära värdar här',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}
add_action( 'widgets_init', 'meetrd_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function meetrd_scripts() {

$version = 1.58;
	//Scripts and styles used on all pages
	//Scripts
	//angular
	wp_enqueue_script( 'angularjs-min', get_template_directory_uri() . '/assets/angular/angular.js');
	//bootstrap
	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/assets/bootstrap-3.3.5-dist/js/bootstrap.js');
	wp_enqueue_script( 'bootstrap-tpls', 'http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.3.js');
	//Moment
	wp_enqueue_script( 'moment', get_template_directory_uri() . '/assets/Moment/moment.js');
	//Lo Dash
	wp_enqueue_script( 'lo-dash', get_template_directory_uri() . '/assets/LoDash/loDash.js');

	//Navigation
	wp_enqueue_script( 'meetrd-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );
	wp_enqueue_script( 'meetrd-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );
	//header app
	wp_enqueue_script( 'headerCtrl', get_template_directory_uri() . '/js/app/controllers/headerCtrl.js', array(), $version, true );
	wp_enqueue_script( 'headerSvc', get_template_directory_uri() . '/js/app/services/headerSvc.js', array(), $version, true );
	//footer app
	wp_enqueue_script( 'footerCtrl', get_template_directory_uri() . '/js/app/controllers/footerCtrl.js', array(), $version, true );
    //Loader directive
    wp_enqueue_script( 'meetrd_loader_directive', get_template_directory_uri() . '/js/app/directives/meetrdLoaderDir.js', array(), $version, false);
    //Filters
    wp_enqueue_script( 'uniqueFilter', get_template_directory_uri() . '/js/app/filters/uniqueFilter.js', array(), $version, false);

    
    
	//Styles
	wp_enqueue_style('meetrd-custom-style', get_template_directory_uri() . '/layouts/meetrd-custom-style.css', array(), $version, false );	
    wp_enqueue_style('parallax-custom-style', get_template_directory_uri() . '/layouts/parallax.css', array(), $version, false  );


	//bootstrap
	wp_enqueue_style('simplemodal-login-meetrd', get_template_directory_uri() . '/layouts/simplemodal-login-meetrd.css' );
	wp_enqueue_style('bootstrap-css', get_template_directory_uri() . '/assets/bootstrap-3.3.5-dist/css/bootstrap.css' );
	//Font awesome
	wp_enqueue_style('font-awesome', get_template_directory_uri() . '/assets/fontawesome/css/font-awesome.css' );
	//Style.css
	wp_enqueue_style( 'meetrd-style', get_stylesheet_uri() );

	$page_template = basename(get_page_template());



	//Specific scripts for certain pages
	if ($page_template == 'page-start.php' || $page_template == 'page-all-hosts.php') {
		 wp_enqueue_script( 'startCtrl', get_template_directory_uri() . '/js/app/controllers/startCtrl.js', array(), $version, false);
        		wp_enqueue_script( 'startSvc', get_template_directory_uri() . '/js/app/services/startSvc.js', array(), $version, false);


	}
   	else if ($page_template == 'page-searchresults.php' ) {
		//room app
		wp_enqueue_script( 'roomCtrl', get_template_directory_uri() . '/js/app/controllers/roomCtrl.js', array(), $version, false);
		wp_enqueue_script( 'roomSvc', get_template_directory_uri() . '/js/app/services/roomSvc.js', array(), $version, false);
		//Date picker
		wp_enqueue_script( 'angular-datepicker-js', get_template_directory_uri() . '/assets/angular-datepicker-master/src/js/angular-datepicker.js');
		wp_enqueue_style('angular-datepicker-css', get_template_directory_uri() . '/assets/angular-datepicker-master/src/css/angular-datepicker.css' );
		//Google maps
        wp_enqueue_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGqEqZZk9N4I2ck5kN7tfXkoVOGfB8598');
        wp_enqueue_script( 'angularGoogleMapsDir', get_template_directory_uri() . '/js/app/directives/angularGoogleMapsDir.js', array(), $version, false);
        wp_enqueue_script( 'roomFilter', get_template_directory_uri() . '/js/app/filters/roomFilter.js', array(), $version, false);

	}
	//Single-room.php
	else if (is_single()) {
		//booking app
		wp_enqueue_script( 'bookingCtrl', get_template_directory_uri() . '/js/app/controllers/bookingCtrl.js', array(), $version, false);
		wp_enqueue_script( 'bookingSvc', get_template_directory_uri() . '/js/app/services/bookingSvc.js', array(), $version, false);

		//Google maps
		wp_enqueue_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGqEqZZk9N4I2ck5kN7tfXkoVOGfB8598');
		wp_enqueue_script( 'angularGoogleMapsDir', get_template_directory_uri() . '/js/app/directives/angularGoogleMapsDir.js', array(), $version, false);

		//Date picker
		wp_enqueue_script( 'angular-datepicker-js', get_template_directory_uri() . '/assets/angular-datepicker-master/src/js/angular-datepicker.js');
		wp_enqueue_style('angular-datepicker-css', get_template_directory_uri() . '/assets/angular-datepicker-master/src/css/angular-datepicker.css' );

	}

	else if ($page_template == 'page-admin.php') {
		wp_enqueue_script( 'adminCtrl', get_template_directory_uri() . '/js/app/controllers/adminCtrl.js', array(), $version, false);
		wp_enqueue_script( 'adminSvc', get_template_directory_uri() . '/js/app/services/adminSvc.js', array(), $version, false);

	}
	else if ($page_template == 'page-host.php') {
		wp_enqueue_script( 'hostCtrl', get_template_directory_uri() . '/js/app/controllers/hostCtrl.js', array(), $version, false);
		wp_enqueue_script( 'hostSvc', get_template_directory_uri() . '/js/app/services/hostSvc.js', array(), $version, false);
         wp_enqueue_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGqEqZZk9N4I2ck5kN7tfXkoVOGfB8598');
	}
	else if ($page_template == 'page-guest.php') {
		wp_enqueue_script( 'guestCtrl', get_template_directory_uri() . '/js/app/controllers/guestCtrl.js', array(), $version, false);
		wp_enqueue_script( 'guestSvc', get_template_directory_uri() . '/js/app/services/guestSvc.js', array(), $version, false);
	}
	//Page.php
	else {
		wp_enqueue_script( 'pageCtrl', get_template_directory_uri() . '/js/app/controllers/pageCtrl.js', array(), $version, false);
		wp_enqueue_script( 'pageSvc', get_template_directory_uri() . '/js/app/services/pageSvc.js', array(), $version, false);
	}

	//Calendar
	//wp_enqueue_script( 'clndr', get_template_directory_uri() . '/assets/calendar/clndr.js');
	//wp_enqueue_script( 'clndr-angular', get_template_directory_uri() . '/assets/calendar/clndr-angular.js');

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

add_action( 'wp_enqueue_scripts','meetrd_scripts' );
if ( (isset($_GET['action']) && $_GET['action'] != 'logout') || (isset($_POST['login_location']) && !empty($_POST['login_location'])) ) {
        add_filter('login_redirect', 'my_login_redirect', 10, 3);
        function my_login_redirect() {
                $location = $_SERVER['HTTP_REFERER'];
                wp_safe_redirect($location);
                exit();
        }
}



/**
* Custom login logo
*/
function my_login_logo() { ?>
    <style type="text/css">
        .login h1 a {
            background-image: url(<?php echo get_home_url();
            ?>/wp-content/themes/meetrd/layouts/Images/logo_rosa_test.svg);
            padding-bottom: 10px;
            background-size: 250px;
            width: 250px;
            background-position: center;
            margin: 0 auto;
        }
        
        .login #nav {
            background-color: #fff;
            margin: 0;
            text-align: right;
            padding: 0 20px 10px 0;
        }
        
        .login form {
            padding: 20px 20px 20px 20px;
        }
        
        body.login {
            background-image: url(<?php echo get_template_directory_uri();
            ?>/layouts/Images/Lamps.jpg);
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center;
            background-position-x: -106px;
            font-family: 'Rock Salt', Arial, Helvetica, sans-serif;
            color: rgb(84, 84, 84);
        }
        
        .mobile #login #nav {
            margin-left: 0;
        }
        
        p#backtoblog {
            display: none;
        }
        
        .login .button-primary {
            color: #ffffff;
            background-color: #325d88;
            border-color: transparent;
            border-radius: 0;
            display: inline-block;
            margin-bottom: 5px;
            font-weight: normal;
            text-align: center;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-image: none;
            white-space: nowrap;
            padding: 12px 16px;
            font-size: 14px;
            line-height: 1.42857143;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    </style>
    <?php }
add_action( 'login_enqueue_scripts', 'my_login_logo' );

function my_login_logo_url() {
	return home_url();
}
add_filter( 'login_headerurl', 'my_login_logo_url' );

function my_login_logo_url_title() {
	return 'Meetrd - Öppna dörren för nya möjligheter';
}
add_filter( 'login_headertitle', 'my_login_logo_url_title' );


/**
* Add custom fields to api
*/
function json_api_prepare_post( $post_response, $post, $context ) {
	$field = get_post_custom($post['ID']);
	$post_response['custom-fields'] = $field;
	return $post_response;
}
add_filter( 'json_prepare_post', 'json_api_prepare_post', 10, 3 );
function allowAuthorEditing()
{
  add_post_type_support( 'booking', 'author' );
}
add_action('init','allowAuthorEditing');
/*
*
*
* MAIL WITH ANGULAR JS
*
*
*/

//Setting from address (lost your password mail)
add_filter( 'wp_mail_from', 'wpse_new_mail_from' );
function wpse_new_mail_from( $old ) {
    return 'noreply@meetrd.se'; // Edit it with your email address
}

//Setting from nam (lost password mail)
add_filter('wp_mail_from_name', 'wpse_new_mail_from_name');
function wpse_new_mail_from_name( $old ) {
    return 'Meetrd'; // Edit it with your/company name
}

add_action( 'wp_ajax_send_message', 'do_send_message' );
add_action( 'wp_ajax_nopriv_send_message', 'do_send_message' );

function do_send_message() {
	//enabling html in mail
	add_filter( 'wp_mail_content_type', 'set_html_content_type' );

	//Send the mail


	if ( isset($_REQUEST['email']) && isset($_REQUEST['message']) && isset($_REQUEST['subject'])) {
		$email = $_REQUEST['email'];
		$message = $_REQUEST['message'];
		$message = stripallslashes($message);
		$subject = $_REQUEST['subject'];
		$headers = 'From: Meetrd <noreply@meetrd.se>;' .  "\r\n";

   wp_mail( $email, $subject, $message, $headers ); //mail($email, $subject, $message);

    // Reset content-type to avoid conflicts -- http://core.trac.wordpress.org/ticket/23578
	remove_filter( 'wp_mail_content_type', 'set_html_content_type' );
 //    if ($success){
 //    	echo 'email sent!!!';
 //    	return true;
 //    }else{
 //    	echo 'email error!!!';
 //    	return false;
	// }
}else{
	echo 'parameter missing in headers';
	return false;
}
}
function set_html_content_type() {
	return 'text/html';
}

function stripallslashes($string) {
    while(strchr($string,'\\')) {
        $string = stripslashes($string);
    }
    return $string;
}

/**
 * Redirects users based on their role
 *
 * @since 1.0
 * @author SFNdesign, Curtis McHale
 *
 * @uses wp_get_current_user()          Returns a WP_User object for the current user
 * @uses wp_redirect()                  Redirects the user to the specified URL
  */
function cm_redirect_users_by_role() {
	// if (is_user_logged_in()) {
	// 	$current_user   = wp_get_current_user();
	// 	$role_name      = $current_user->roles[0];
	// 	// if ( 'administrator' === $role_name ) {
	// 	// 	wp_redirect( get_home_url().'/meetrd-admin' );
	// 	// }
	// 	if ( 'meetrdguest' === $role_name ) {
	// 		wp_redirect( get_home_url().'/gast-administration' );
	// 	}
	// 	if ( 'meetrdhost' === $role_name ) {
	// 		wp_redirect( get_home_url().'/vard-administration' );
	// 	}
	// }


} // cm_redirect_users_by_role
add_action( 'admin_init', 'cm_redirect_users_by_role' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

//Navigation menus
register_nav_menus(array(
	'footer' => __('Footer Menu'),
	'meetrd-navigation' => __('Meetrd Navigation')
	));