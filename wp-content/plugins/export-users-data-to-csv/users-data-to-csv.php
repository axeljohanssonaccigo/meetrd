<?php
/*
Plugin Name: Export Users Data to CSV for MS Excel
Description: Export Users Data and metadata to CSV file for MS Excel.
Plugin URI: http://pkweb.ru/
Version: 1.0.0
Author: Penzin Konstantin
Email: penzin85@gmail.com
Author URI: http://pkweb.ru/
License: GPL2
Text Domain: export-users-data-to-csv
*/

ini_set("memory_limit", "1048M");
set_time_limit(60);

class Export_Users_CSV {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_pages' ) );
		add_action( 'init', array( $this, 'generate_csv' ) );
		add_filter( 'exclude_data_csv', array( $this, 'exclude_data' ) );
	}

	public function add_admin_pages() {
		add_users_page( __( 'User Data to CSV', 'users-data-to-csv' ), __( 'User Data to CSV', 'users-data-to-csv' ), 'list_users', 'users-data-to-csv', array( $this, 'users_page' ) );
	}

	public function generate_csv() {
		if ( isset( $_POST['_export-users-page_export'] ) ) {
			check_admin_referer( 'export-users-page_export', '_export-users-page_export' );

			$args = array(
				'fields' => 'all_with_meta',
				'role' => stripslashes( $_POST['role'] )
			);

			add_action( 'pre_user_query', array( $this, 'pre_user_query' ) );
			$users = get_users( $args );
			remove_action( 'pre_user_query', array( $this, 'pre_user_query' ) );

			if ( ! $users ) {
				$referer = add_query_arg( 'error', 'empty', wp_get_referer() );
				wp_redirect( $referer );
				exit;
			}

			$sitename = sanitize_key( get_bloginfo( 'name' ) );
			if ( ! empty( $sitename ) )
				$sitename .= '.';
			$filename = $sitename . 'users.' . date( 'Y-m-d-H-i-s' ) . '.csv';

			header( 'Content-Description: File Transfer' );
			header( 'Content-Disposition: attachment; filename=' . $filename );
			header( 'Content-Type: text/csv; charset=' . get_option( 'blog_charset' ), true );

			$exclude_data = apply_filters( 'exclude_data_csv', array() );

			global $wpdb;

			$data_keys = array(
				'ID', 'user_login', 'user_pass', 'user_nicename', 'user_email', 'user_registered', 'user_status', 'display_name'
			);
			$meta_keys = $wpdb->get_results( "SELECT distinct(meta_key) FROM $wpdb->usermeta" );
			$meta_keys = wp_list_pluck( $meta_keys, 'meta_key' );
			$fields = array_merge( $data_keys, $meta_keys );

			$headers = array();
			foreach ( $fields as $key => $field ) {
				if ( in_array( $field, $exclude_data ) )
					unset( $fields[$key] );
				else
					$headers[] = '"' . strtolower( $field ) . '"';
			}
			echo implode( ';', $headers ) . "\n";

			foreach ( $users as $user ) {
				$data = array();
				foreach ( $fields as $field ) {
					$value = isset( $user->{$field} ) ? $user->{$field} : '';
					$value = is_array( $value ) ? serialize( $value ) : $value;
					$data[] = '"' . str_replace( '"', '""', $value ) . '"';
				}
				echo implode( ';', $data ) . "\n";
			}

			exit;
		}
	}

	public function users_page() {
		if ( ! current_user_can( 'list_users' ) )
			wp_die( __( 'You do not have sufficient permissions to access this page.', 'users-data-to-csv' ) );
?>

<div class="wrap">
	<h2><?php _e( 'Export users to a CSV file', 'users-data-to-csv' ); ?></h2>
	<?php
	if ( isset( $_GET['error'] ) ) {
		echo '<div class="updated"><p><strong>' . __( 'No user found.', 'users-data-to-csv' ) . '</strong></p></div>';
	}
	?>
	<form method="post" action="" enctype="multipart/form-data">
		<?php wp_nonce_field( 'export-users-page_export', '_export-users-page_export' ); ?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><label for="users_role"><?php _e( 'Role', 'users-data-to-csv' ); ?></label></th>
				<td>
					<select name="role" id="users_role">
						<?php
						echo '<option value="">' . __( 'All', 'users-data-to-csv' ) . '</option>';
						global $wp_roles;
						foreach ( $wp_roles->role_names as $role => $name ) {
							echo "\n\t<option value='" . esc_attr( $role ) . "'>$name</option>";
						}
						?>
					</select>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label><?php _e( 'Date range', 'users-data-to-csv' ); ?></label></th>
				<td>
					<!--<select name="start_date" id="users_start_date">
						<option value="0"><?php _e( 'Start Date', 'users-data-to-csv' ); ?></option>
						<?php $this->export_date(); ?>
					</select>
					<select name="end_date" id="users_end_date">
						<option value="0"><?php _e( 'End Date', 'users-data-to-csv' ); ?></option>
						<?php $this->export_date(); ?>
					</select>-->
                <?php
                $start = $_POST['start'];
                if (!$start) $start = date("Y-m-d", time()-86400*30);
                $end = $_POST['end'];
                if (!$end) $end = date("Y-m-d", time());
                ?>

                <input type="date" name="start_date" value="<?= $start ?>" /> - <input type="date" name="end_date" value="<?= $end ?>" />

				</td>
			</tr>
		</table>
		<p class="submit">
			<input type="hidden" name="_wp_http_referer" value="<?php echo $_SERVER['REQUEST_URI'] ?>" />
			<input type="submit" class="button-primary" value="<?php _e( 'Export user', 'users-data-to-csv' ); ?>" />
		</p>
	</form>
<?php
	}

	public function exclude_data() {
		$exclude = array( 'user_pass', 'user_activation_key' );

		return $exclude;
	}

	public function pre_user_query( $user_search ) {
		global $wpdb;

		$where = '';

		if ( ! empty( $_POST['start_date'] ) )
			$where .= $wpdb->prepare( " AND $wpdb->users.user_registered >= %s", date( 'Y-m-d', strtotime( $_POST['start_date'] ) ) );

		if ( ! empty( $_POST['end_date'] ) )
			$where .= $wpdb->prepare( " AND $wpdb->users.user_registered < %s", date( 'Y-m-d', strtotime( $_POST['end_date'] ) ) );

		if ( ! empty( $where ) )
			$user_search->query_where = str_replace( 'WHERE 1=1', "WHERE 1=1$where", $user_search->query_where );

		return $user_search;
	}

	private function export_date() {
	/*	global $wpdb, $wp_locale;

		$months = $wpdb->get_results( "
			SELECT DISTINCT YEAR( user_registered ) AS year, MONTH( user_registered ) AS month
			FROM $wpdb->users
			ORDER BY user_registered DESC
		" );

		$month_count = count( $months );
		if ( !$month_count || ( 1 == $month_count && 0 == $months[0]->month ) )
			return;

		foreach ( $months as $date ) {
			if ( 0 == $date->year )
				continue;

			$month = zeroise( $date->month, 2 );
			echo '<option value="' . $date->year . '-' . $month . '">' . $wp_locale->get_month( $month ) . ' ' . $date->year . '</option>';
		}  */
	}
}

new Export_Users_CSV;