<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Meetrd
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">
		<div class="site-info"   >
			<div class="meetrd-footer-container" id="meetrd-footer-div"> 
				<?php wp_nav_menu(array('menu' => 'meetrd-footer')); ?>
				<div>
				Copyright 2015 meetrd | All Rights Reserved | Sponsored by<a href="http://www.centigo.se" target="_blank">Centigo AB</a>& Powered by<a href="http://www.accigo.se" target="_blank">Accigo AB</a>
				</div>
			</div>
			
		</div>
		
	</footer>
</div>
<script type="text/javascript" src="<?php echo get_home_url().'/wp-content/themes/meetrd/assets/materializejs/materialize.min.js'; ?>"></script>
<?php wp_footer(); ?>
</body>
</html>
