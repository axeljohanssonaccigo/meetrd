<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Meetrd
 */

get_header(); ?>

<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">

		<section class="error-404 not-found">


			<div class="page-content">
				<div class="container">
					<header class="page-header">
						<h1 class="page-title"><?php esc_html_e( 'Oj, den här sidan kunde inte hittas.', 'meetrd' ); ?></h1>
					</header><!-- .page-header -->
					 <i class="fa fa-arrow-left fa-1"></i> <a href="<?php echo get_home_url(); ?>">Gå tillbaka till Meetrd</a>
				</div>

			</div><!-- .page-content -->
		</section><!-- .error-404 -->

	</main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
