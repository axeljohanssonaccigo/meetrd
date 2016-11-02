<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Meetrd
 */
the_post();
get_header(); ?>

<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">

		<div class="container ">

			<div class="row">
				<div class="page-php-container clearfix">
					<div class="col-xs-12">
					<h1>
						<?php the_title(); 
						?>
					</h1>
					<div class="single-post">
						<div id="single-post-img-container">
							<?php the_post_thumbnail(); ?>
						</div>
						<p class="single-post-content"> <?php the_content(); ?></p>
						<div class="single-post-text-container">

						</div>
					</div>
</div>

				</div>
			</div>

		</div>

	</main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
