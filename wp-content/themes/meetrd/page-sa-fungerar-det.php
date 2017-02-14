<?php
/* Template Name: Så fungerar det
 *
 * @package Meetrd
 */
$custom_fields = get_post_custom();
$page_id = get_the_id();
get_header(); ?>

    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <div class="container">
                <div class="page-php-container">
                    <div class="row">
                        <div class="col-xs-12" id="page-php" ng-app="pageApp" ng-controller="pageCtrl" ng-cloak>
                            <h1>
							<?php the_title();
							?>
						</h1>
                            <?php
		// Start the loop.
						while ( have_posts() ) : the_post();

			// Include the page content template.
						get_template_part( 'content', 'page' );

			// If comments are open or we have at least one comment, load up the comment template.
						if ( comments_open() || get_comments_number() ) :
							comments_template();
						endif;

		// End the loop.
						endwhile;
						?>
                                <div class="single-post">
                                    <?php if (has_post_thumbnail( $post->ID ) ): ?>
                                        <?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' ); ?>
                                            <div class="featured-img">
                                                <img src="<?php echo $image[0]; ?>">
                                            </div>
                                            <?php endif; ?>
                                                <div class="single-post-content">
                                                    <?php the_content(); ?>
                                                </div>

                                                <div data-toggle="modal" data-target="#registerUserModal" data-backdrop="" class="col-xs-12 col-md-6 btn btn-primary" ng-if="isPage('att-hyra') || isPage('faq')">
                                                    Skapa konto hos Meetrd
                                                </div>
                                </div>
                                <!-- Register user Modal -->
                                <div class="modal fade" id="registerUserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 class="modal-title" id="myModalLabel" ng-show="!userTriedToRegister">Skapa ett konto hos Meetrd</h4>
                                                <h4 class="modal-title" id="myModalLabel" ng-show="userTriedToRegister">Var god vänta...</h4>
                                            </div>
                                            <div class="modal-body clearfix">
                                                <form name="registerUserForm" id="registerUserForm" autocomplete="off" novalidate ng-hide="userTriedToRegister">
                                                    <!-- <label for="username" class="col-xs-12 no-padding">Användarnamn (används för inloggning) *</label>
										<input type="text" autocomplete="off" class="col-xs-12 form-control" id="registerUsername" name="username" ng-model="newUser.username" required>
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

                                                    <label for="biography" class="col-xs-12 no-padding">Presentera ditt företag</label>
                                                    <textarea class="col-xs-12 form-control" name="biography" ng-model="newUser.biography"></textarea>
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
                                                <div ng-show="userTriedToRegister">
                                                    <div class="loader-container">
                                                        <meetrd-loader></meetrd-loader>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <div ng-show="!userTriedToRegister">

                                                    <button type="button" class="btn btn-primary col-xs-8" ng-click="registerUser()" ng-disabled="!isUrlValid(registerUserForm, registerUserForm.website.$viewValue) || registerUserForm.$invalid || !passwordsMatch() || !phoneNumberIsValid(newUser.phone)">Skapa konto</button>
                                                    <button type="button" class="btn btn-danger col-xs-offset-1 col-xs-3 pull-right" data-dismiss="modal">Avbryt</button>

                                                </div>
                                                <div ng-show="userWasRegistered">
                                                    <button type="button" class="col-xs-12 btn btn-primary" data-dismiss="modal"><a href="/wp-login.php" id="loginButton" class="simplemodal-login">Logga in</a></button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Confirm new host Modal -->
                                <div class="modal fade" id="newHostConfirmation" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 class="modal-title" id="myModalLabel">Bli värd</h4>
                                            </div>
                                            <div class="modal-body clearfix">
                                                <center>{{messageToUser}}</center>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-primary col-xs-12" data-dismiss="modal" ng-click="reloadPage()">Ok</button>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <!-- Confirm new host Modal END-->
                                <!-- Register user Modal END-->
                                <div class="sign-up-as-host-form-container" ng-if="isPage('bli-vard')">
                                    <form ng-submit="createMailFromForm()" name="registerHostForm">
                                        <label for="name" class="col-xs-12 no-padding">Ditt för- och efternamn *</label>
                                        <input type="text" autocomplete="off" class="col-xs-12 form-control" name="name" ng-model="newHost.name" required>
                                        <div class="error" ng-show="registerHostForm.name.$dirty && registerHostForm.name.$invalid">
                                            Ange ditt för- och efternamn
                                        </div>

                                        <label for="email" class="col-xs-12 no-padding">Din e-post *</label>
                                        <input type="email" autocomplete="off" class="col-xs-12 form-control" name="email" ng-model="newHost.email" required>
                                        <div class="error" ng-show="registerHostForm.email.$dirty && registerHostForm.email.$error.email">
                                            Ange en giltig e-postadress
                                        </div>

                                        <label for="website" class="col-xs-12 no-padding">Ditt företags webbplats</label>
                                        <input type="text" autocomplete="off" class="col-xs-12 form-control" name="website" ng-model="newHost.website">
                                        <div class="error" ng-show="registerHostForm.website.$dirty && !isUrlValid(registerHostForm, registerHostForm.website.$viewValue)">
                                            Ange en giltig adress
                                        </div>

                                        <label for="comments" class="col-xs-12 no-padding">Kommentar *</label>
                                        <textarea autocomplete="off" class="col-xs-12 form-control" name="comments" ng-model="newHost.comments" required></textarea>
                                        <div class="error" ng-show="registerHostForm.comments.$dirty && registerHostForm.comments.$invalid">
                                            Ange en kommentar
                                        </div>


                                        <div class="col-xs-12 no-padding">
                                            * Obligatoriskt fält
                                        </div>
                                        <button type="submit" class="btn btn-primary" data-toggle="modal" data-target="#newHostConfirmation" ng-disabled="!isUrlValid(registerHostForm, registerHostForm.website.$viewValue) || registerHostForm.$invalid">Skicka</button>
                                    </form>


                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
        <!-- #main -->
    </div>
    <!-- #primary -->


    <?php get_footer(); ?>