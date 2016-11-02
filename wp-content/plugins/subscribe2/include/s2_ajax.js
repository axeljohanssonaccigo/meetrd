/* global s2_script_strings */
// Version 1.0 - original version
// Copyright Matthew Robinson 2015

var s2jQuery = jQuery.noConflict();
s2jQuery( document ).ready( function() {
	var dialog = s2jQuery( '<div></div>' );
	var ajaxurl = s2_script_strings.ajaxurl;
	s2jQuery( 'a.s2popup' ).click( function(){
		var data = {
			'action': 'subscribe2_form',
			'data': s2jQuery( 'a.s2popup' ).attr( 'id' )
		};
		jQuery.post( ajaxurl, data, function( response ) {
			dialog.html( response );
		});
		dialog.dialog( { modal: true, zIndex: 10000, title: s2_script_strings.title } );
		dialog.dialog( 'open' );
	});
	s2jQuery( document ).on( 'submit', '#s2ajaxform', function( event ) {
		event.preventDefault();
		var email = s2jQuery( '#s2ajaxform input[name=email]' ).val();
		var ip = s2jQuery( '#s2ajaxform input[name=ip]' ).val();
		var firstname = s2jQuery( '#s2ajaxform input[name=firstname]' ).val();
		if ( typeof firstname === 'undefined' ) {
			firstname = '';
		}
		var lastname = s2jQuery( '#s2ajaxform input[name=lastname]' ).val();
		if ( typeof lastname === 'undefined' ) {
			lastname = '';
		}
		var uri = s2jQuery( '#s2ajaxform input[name=uri]' ).val();
		if ( typeof uri === 'undefined' ) {
			uri = 'http://';
		}
		var btn = s2jQuery( this ).find( 'input[type=submit][clicked=true]' );
		if ( btn.length && s2jQuery( '#s2ajaxform' ).has( btn ) ) {
			var data = {
				'action': 'subscribe2_submit',
				'data': {
					email: email,
					ip: ip,
					firstname: firstname,
					lastname: lastname,
					uri: uri,
					button: btn.attr( 'name' )
				}
			};
			jQuery.post( ajaxurl, data, function( response ) {
				dialog.html( response );
			});
		}
	});
	// Allows detection of which button was clicked
	s2jQuery( document ).on( 'click', '#s2ajaxform input[type=submit]', function() {
		s2jQuery( '#s2ajaxform input[type=submit]' ).removeAttr( 'clicked' );
		s2jQuery( this ).attr( 'clicked', 'true' );
	});
	// when form is closed return to default
	s2jQuery( document ).on( 'dialogclose', function() {
		var data = {
			'action': 'subscribe2_form',
			'data': s2jQuery( 'a.s2popup' ).attr( 'id' )
		};
		jQuery.post( ajaxurl, data, function( response ) {
			dialog.html( response );
		});
	});
});