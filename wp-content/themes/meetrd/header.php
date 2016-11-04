<?php

/**

 * The header for our theme.

 *

 * This is the template that displays all of the <head> section and everything up until <div id="content">

 *

 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials

 *

 * @package Meetrd

 */



?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>

    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <link rel="profile" href="http://gmpg.org/xfn/11">
        <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
        <?php wp_enqueue_script("jquery"); ?>
            <title>Meetrd - Boka mötesrum hos andra företag</title>
            <?php wp_head(); ?>
                <script type="text/javascript">
                    var userIsLoggedIn = <?php echo json_encode( is_user_logged_in() ); ?>;
                </script>
                <?php

  if (is_user_logged_in()) {
    $userData = wp_get_current_user();
    $user_role = $userData->roles[0];
    $user_name = $userData->user_login;
    switch ($user_role) {
     case 'administrator':
     $role_display_name = 'Administratör';
     $my_pages_url = get_home_url().'/meetrd-admin';
     break;
     case 'meetrdguest':
     $role_display_name = 'Gäst';
     $my_pages_url = get_home_url().'/gast-administration';
     break;
     case 'meetrdhost':
     $role_display_name = 'Värd';
     $my_pages_url = get_home_url().'/vard-administration';
     break;
     default:
     $role_display_name = $user_role;
     $my_pages_url = get_home_url();
   }
   ?>
                    <script type="text/javascript">
                        var userData = <?php echo json_encode($userData); ?>;
                        var userRole = '<?php echo $user_role; ?>';
                        console.log(userRole);
                    </script>
                    <?php } ?>
    </head>

    <body <?php body_class(); ?>>
        <div id="page" class="hfeed site container-fluid">
            <div class="sticky-header row" id="meetrd-header">
                <div class="container">
                    <a class="skip-link screen-reader-text" href="#content">
                        <?php esc_html_e( 'Skip to content', 'meetrd' ); ?>
                    </a>
                    <header id="masthead" class="site-header" role="banner">
                        <div>
                            <div class="site-branding" ng-controller="headerCtrl" id="meetrd-header" ng-cloak>
                                <div class="meetrd-logo-container col-md-4 col-xs-10">
                                    <a href="<?php echo get_home_url(); ?>"><img src="<?php echo get_home_url().'/wp-content/uploads/2016/06/Meetred-Logo.SE_.png'; ?>"></a>
                                    <div class="user-name-container hidden-xs hidden-sm visible-md visible-lg ng-hide">
                                        <?php if (is_user_logged_in()) {
                      echo $role_display_name." | ".$user_name;
                    }?>
                                    </div>
                                </div>
                                <div class="visible-xs visible-sm hidden-md hidden-lg col-xs-2 hamburger-bars">
                                    <i class="fa fa-bars fa-2x" ng-click="showOrHideMobileMenu()"></i>
                                </div>
                                <!-- #site-navigation DESKTOP-->
                                <nav id="desktop-nav" class="clearfix col-md-8 hidden-xs hidden-sm visible-md visible-lg" role="navigation">

                                    <ul class="nav nav-tabs">
                                        <li ng-hide="<?php echo is_user_logged_in(); ?>"><a href="/wp-login.php" class="simplemodal-login">Logga in</a></li>
                                        <li ng-show="<?php echo is_user_logged_in(); ?>"><a href="<?php echo wp_logout_url( home_url() ); ?>">Logga ut</a></li>
                                        <li ng-show="<?php echo is_user_logged_in(); ?>"> <a href="<?php echo $my_pages_url; ?>">Mina sidor</a></li>
                                        <li> <a href="<?php echo get_home_url().'/search/?nrOfPeople=null' ?>">Sök mötesrum</a></li>
                                        <?php wp_nav_menu( array( 'theme_location' => 'meetrd-navigation', 'menu_class' => 'nav nav-tabs', 'link_before' => '<span class="icon"><i aria-hidden="true" class="icon-home"></i></span><span class="MenuName">', 'link_after' => '</span>' ) ); ?>

                                    </ul>
                                </nav>

                                <!-- #site-navigation DESKTOP END-->
                                <!-- #site-navigation MOBILE-->
                                <nav id="mobile-nav" class="clearfix visible-xs visible-sm hidden-md hidden-lg col-xs-12 no-padding" role="navigation" ng-show="showMobileMenu">
                                    <div class="mobile-menu-item">
                                        <a href="<?php echo get_home_url().'/om-oss'; ?>">Om Meetrd</a>
                                    </div>
                                    <div class="mobile-menu-item">
                                        <a href="<?php  echo get_home_url().'/bli-vard'; ?>">Bli värd</a>
                                    </div>
                                    <div class="mobile-menu-item">
                                        <a href="<?php  echo get_home_url().'/kontakt'; ?>">Kontakt</a>
                                    </div>
                                    <div class="mobile-menu-item">
                                        <a href="<?php  echo get_home_url().'/search/?nrOfPeople=null'; ?>">Sök mötesrum</a>
                                    </div>


                                    <div class="mobile-menu-item" ng-show="<?php echo is_user_logged_in(); ?>">
                                        <a href="<?php echo $my_pages_url; ?>">Mina sidor</a><span class="isTonedOut ng-hide"><?php echo $role_display_name." | ".$user_name; ?> </span>
                                    </div>
                                    <div class="mobile-menu-item">
                                        <span ng-hide="<?php echo is_user_logged_in(); ?>"><a href="/wp-login.php" class="simplemodal-login">Logga in</a></span>
                                        <span ng-show="<?php echo is_user_logged_in(); ?>"><a href="<?php echo wp_logout_url( home_url() ); ?>">Logga ut</a></span>
                                        <div ng-show="<?php echo is_user_logged_in(); ?>" class="logged-in-container"><b><?php echo $role_display_name; ?></b> | {{userInfo.data.user_login}}</div>
                                    </div>

                                </nav>
                                <!-- #site-navigation MOBILE-->
                                <!-- Register user Modal -->
                                <div class="modal fade" id="registerUserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 class="modal-title" id="myModalLabel" ng-show="!userTriedToRegister">Skapa ett gästkonto hos Meetrd</h4>
                                                <h4 class="modal-title" id="myModalLabel" ng-show="userTriedToRegister">Var god vänta...</h4>
                                            </div>
                                            <div class="modal-body clearfix">
                                                <form name="registerUserForm" id="registerUserForm" autocomplete="off" novalidate ng-hide="userTriedToRegister">
                                                    <!-- <label for="username" class="col-xs-12 no-padding">Användarnamn (används för inloggning) *</label>
                <input type="text" autocomplete="off" class="col-xs-12 form-control" name="username" id="registerUsername" ng-model="newUser.username" required>
                <div class="error" ng-show="registerUserForm.username.$dirty && registerUserForm.username.$invalid">
                  Ange ett användarnamn
                </div> -->
                                                    <label for="email" class="col-xs-12 no-padding"><i class="fa fa-envelope-o fa-lg"></i> E-mail (användarnamn)*</label>
                                                    <input type="email" autocomplete="off" class="col-xs-12 form-control" id="registerEmail" name="email" ng-model="newUser.email" required>
                                                    <div class="error" ng-show="registerUserForm.email.$dirty && (registerUserForm.email.$error.email || registerUserForm.email.$invalid)">
                                                        Ange en giltig e-mailadress
                                                    </div>
                                                    <label for="password" class="col-xs-12 no-padding"><i class="fa fa-key fa-lg"></i> Lösenord *</label>
                                                    <input type="password" autocomplete="off" class="col-xs-1 form-control" name="password" ng-model="newUser.password" required>
                                                    <div class="error" ng-show="registerUserForm.password.$dirty && registerUserForm.password.$invalid">
                                                        Ange ett lösenord
                                                    </div>
                                                    <label for="password2" class="col-xs-12 no-padding"><i class="fa fa-key fa-lg"></i> Upprepa lösenord *</label>
                                                    <input type="password" autocomplete="off" class="col-xs-1 form-control" name="password2" ng-model="newUser.password2" required>
                                                    <div class="error" ng-show="registerUserForm.password2.$dirty && registerUserForm.password.$invalid ">
                                                        Upprepa lösenordet
                                                    </div>
                                                    <div class="error" ng-show="!passwordsMatch()">
                                                        Lösenorden matchar inte
                                                    </div>
                                                    <div class="col-xs-12 no-padding">
                                                        <h3>Om ditt företag</h3>
                                                    </div>
                                                    <label for="nickname" class="col-xs-12 no-padding">Företagsnamn (detta namn kommer synas på dina bokningar) *</label>
                                                    <input type="text" autocomplete="off" class="col-xs-12 form-control" name="nickname" ng-model="newUser.nickname" required>
                                                    <div class="error" ng-show="registerUserForm.nickname.$dirty && registerUserForm.nickname.$invalid">
                                                        Ange ett företagsnamn
                                                    </div>

                                                    <label for="biography" class="col-xs-12 no-padding">Presentera ditt företag *</label>
                                                    <textarea class="col-xs-12 form-control" name="biography" ng-model="newUser.biography" required></textarea>
                                                    <div class="error" ng-show="registerUserForm.biography.$dirty && registerUserForm.biography.$invalid">
                                                        Presentera ditt företag
                                                    </div>
                                                    <label for="website" class="col-xs-12 no-padding"><i class="fa fa-home fa-lg"></i> Hemsida</label>
                                                    <input type="url" autocomplete="off" class="col-xs-12 form-control" name="website" ng-model="newUser.website">
                                                    <div class="error" ng-show="registerUserForm.website.$dirty && !isUrlValid(registerUserForm, registerUserForm.website.$viewValue)">
                                                        Ange en giltig adress
                                                    </div>

                                                    <div class="col-xs-12 no-padding">
                                                        <h3>Kontaktuppgifter</h3>
                                                    </div>

                                                    <label for="firstName" class="col-xs-12 no-padding"><i class="fa fa-user fa-lg"></i> Förnamn *</label>
                                                    <input type="text" autocomplete="off" class="col-xs-12 form-control" name="firstName" ng-model="newUser.firstName" required>
                                                    <div class="error" ng-show="registerUserForm.firstName.$dirty && registerUserForm.firstName.$invalid">
                                                        Ange ditt förnamn
                                                    </div>
                                                    <label for="lastName" class="col-xs-12 no-padding"><i class="fa fa-user fa-lg"></i> Efternamn *</label>
                                                    <input type="text" autocomplete="off" class="col-xs-12 form-control" name="lastName" ng-model="newUser.lastName" required>
                                                    <div class="error" ng-show="registerUserForm.lastName.$dirty && registerUserForm.lastName.$invalid">
                                                        Ange ditt efternamn
                                                    </div>

                                                    <label for="phone" class="col-xs-12 no-padding"><i class="fa fa-phone fa-lg"></i> Telefonnummer *</label>
                                                    <input type="tel" autocomplete="off" class="col-xs-12 form-control" name="phone" ng-model="newUser.phone" required>
                                                    <div class="error" ng-show="registerUserForm.phone.$dirty && (registerUserForm.phone.$invalid || !phoneNumberIsValid(newUser.phone))">
                                                        Ange telefonnummer
                                                    </div>
                                                    <label for="billingAddress" class="col-xs-12 no-padding">Faktureringsadress</label>
                                                    <textarea autocomplete="off" class="col-xs-12 form-control" name="billingAddress" ng-model="newUser.billingAddress"></textarea>
                                                    <div class="error" ng-show="registerUserForm.billingAddress.$dirty && registerUserForm.billingAddress.$invalid">
                                                        Ange faktureringsadress
                                                    </div>

                                                    <div class="col-xs-12 no-padding">
                                                        * Obligatoriskt fält
                                                    </div>

                                                </form>
                                                <center>{{registerMessageToUser}}</center>
                                                <div ng-show="userTriedToRegister && !userWasRegistered">
                                                    <div class="loader-container">
                                                        <img src=" <?php echo get_home_url().'/wp-content/themes/meetrd/layouts/Images/meetrd-loader.gif'?> ">
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="modal-footer">
                                                <div ng-show="!userTriedToRegister">
                                                    <button type="button" class="btn btn-primary col-xs-7" ng-click="registerUser()" ng-disabled="!isUrlValid(registerUserForm, registerUserForm.website.$viewValue) || registerUserForm.$invalid || !passwordsMatch() || !phoneNumberIsValid(newUser.phone)">Skapa konto</button>
                                                    <button type="button" class="btn btn-danger col-xs-offset-1 col-xs-4 pull-right" data-dismiss="modal">Avbryt</button>
                                                </div>
                                                <div ng-show="userWasRegistered">
                                                    <button type="button" class="col-xs-12 btn btn-primary" data-dismiss="modal"><a href="/wp-login.php" id="loginButton" class="simplemodal-login">Logga in</a></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Register user Modal END-->

                            </div>
                            <!-- .site-branding -->
                        </div>
                    </header>
                    <!-- #masthead -->
                </div>
            </div>

            <div id="content" class="site-content row">