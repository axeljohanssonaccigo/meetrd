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

    </div>
    <!-- #content -->

    <footer id="colophon" class="site-footer" role="contentinfo">
        <div class="site-info">
            <div class="meetrd-footer-container" id="meetrd-footer-div">
                <div class="col-xs-12 col-sm-6 logo-container">
                    <img src="<?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/Meetrd-logo-vit.png'; ?>" />
                </div>
                <div class="col-xs-12 col-sm-6 social-media-container ">
                    <a href="https://www.linkedin.com/company/meetrd" target="_blank"><i class="fa fa-linkedin fa-3x "></i></a>
                    <a href="http://www.facebook.com/meetrd.se" target="_blank"><i class="fa fa-facebook fa-3x "></i></a>
                    <a href="https://www.instagram.com/meetrd.se/" target="_blank"><i class="fa fa-instagram fa-3x "></i></a>
                    <a href="https://twitter.com/meetrdSE" target="_blank"><i class="fa fa-twitter fa-3x "></i></a>
                </div>
                <div class="col-xs-12 col-sm-6 contact-container hidden-xs ">
                    <a href="mailto:support@meetrd.se ">support@meetrd.se</a>
                    <div>073 - 987 86 27</div>

                </div>
                <div class="col-xs-12 col-sm-6 pages-container ">
                    <ul class="col-xs-6 text-right">
                        <li><a href="<?php echo get_home_url(). '/om-oss'; ?>">Om Meetrd</a>
                        </li>
                        <li><a href="<?php echo get_home_url().'/faq'; ?>">FAQ</a></li>
                        <li><a href="<?php echo get_home_url().'/allmanna-villkor'; ?>">Allmänna villkor</a></li>
                        <li><a href="<?php echo get_home_url().'/kontakt'; ?>">Kontakt</a></li>

                    </ul>
                    <ul class="col-xs-6">
                        <li><a href="<?php echo get_home_url().'/search'; ?>">Sök mötesrum</a></li>
                        <li><a href="<?php echo get_home_url().'/bli-vard'; ?>">Bli värd</a></li>
                        <li><a href="<?php echo get_home_url().'/vardforetag'; ?>">Våra värdföretag</a></li>
                        <li><a href="<?php echo get_home_url().'/hyra-ut'; ?>">Att vara värd</a></li>
                        <li><a href="<?php echo get_home_url().'/att-hyra'; ?>">Så bokar du mötesrum</a></li>
                    </ul>

                </div>
                <div class="col-xs-12 col-sm-6 contact-container hidden-sm hidden-md hidden-lg">
                    <a href="mailto:support@meetrd.se">support@meetrd.se</a>
                    <div>073 - 987 86 27</div>
                </div>


                <div class="col-xs-12 col-sm-12 all-rights">
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