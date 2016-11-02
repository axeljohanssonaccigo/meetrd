<?php
/**
 * Baskonfiguration för WordPress.
 *
 * Denna fil innehåller följande konfigurationer: Inställningar för MySQL,
 * Tabellprefix, Säkerhetsnycklar, WordPress-språk, och ABSPATH.
 * Mer information på {@link https://codex.wordpress.org/Editing_wp-config.php 
 * Editing wp-config.php}. MySQL-uppgifter får du från ditt webbhotell.
 *
 * Denna fil används av wp-config.php-genereringsskript under installationen.
 * Du behöver inte använda webbplatsen, du kan kopiera denna fil direkt till
 * "wp-config.php" och fylla i värdena.
 *
 * @package WordPress
 */

// ** MySQL-inställningar - MySQL-uppgifter får du från ditt webbhotell ** //
/** Namnet på databasen du vill använda för WordPress */
define('DB_NAME', 'meetrd_se');


/** MySQL-databasens användarnamn */
define('DB_USER', 'meetrd@m128667');


/** MySQL-databasens lösenord */
define('DB_PASSWORD', 'S3cur3L0cal');


/** MySQL-server */
define('DB_HOST', 'mysql513.loopia.se');


/** Teckenkodning för tabellerna i databasen. */
define('DB_CHARSET', 'utf8mb4');


/** Kollationeringstyp för databasen. Ändra inte om du är osäker. */
define('DB_COLLATE', '');

/**#@+
 * Unika autentiseringsnycklar och salter.
 *
 * Ändra dessa till unika fraser!
 * Du kan generera nycklar med {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * Du kan när som helst ändra dessa nycklar för att göra aktiva cookies obrukbara, vilket tvingar alla användare att logga in på nytt.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '`paU;;mY55VQ.1`nc+L%YthRy{@c1VhayK8E.-*%#~>;=ZQMlXNAm!Ms0V>+$)$/');

define('SECURE_AUTH_KEY',  '`ofw_]g-Staw@mV(p%,Y0)X~-cdz-9eBw5*Nd!4R#v7o|_D+~Z$!ikE){1m$kpSK');

define('LOGGED_IN_KEY',    '6dr&>Gf2U@&-jws0Gs0eWFx(I@,U}*Z{0~D#~]kW`C|#V-udGVCy~b DJBa&>eIl');

define('NONCE_KEY',        'Lu|))~f]-6j(.}Ek.*ftq0i+?OEk-74}8eqSF=6+Ix8mwx6o?O&CC.H%Z2o|TXMg');

define('AUTH_SALT',        'rK}%ro4IY#(=B%Wh-.@ 7dp<+Z.&F?lOZW&aJIUj2PvSsp8wZ}p4w)i|$Hs,Q,So');

define('SECURE_AUTH_SALT', 'VA;E[G9>t*Y-#EZ>jA^/9B,5:RP-~,dE&6wcg<*!Z@d|]IOz.TCXcgwQocVB)ruK');

define('LOGGED_IN_SALT',   '1jfI/XAEO#b;njaq0b(hO[K2d=r}-r+IOkKvP+#uIgs5#[Zlsv-^lnl Ov?PdNYU');

define('NONCE_SALT',       '~)ccLQ9Pr_zKkogh]Z?fV|R|bms+JvG1&4f+Kcp?3I~%$P&vYEeuxD2vD81hUa8P');


/**#@-*/

/**
 * Tabellprefix för WordPress Databasen.
 *
 * Du kan ha flera installationer i samma databas om du ger varje installation ett unikt
 * prefix. Endast siffror, bokstäver och understreck!
 */
$table_prefix  = 'wp_m_';


/** 
 * För utvecklare: WordPress felsökningsläge. 
 * 
 * Ändra detta till true för att aktivera meddelanden under utveckling. 
 * Det är rekommderat att man som tilläggsskapare och temaskapare använder WP_DEBUG 
 * i sin utvecklingsmiljö. 
 */ 
define('WP_DEBUG', false);

/* Det var allt, sluta redigera här! Blogga på. */

/** Absoluta sökväg till WordPress-katalogen. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Anger WordPress-värden och inkluderade filer. */
require_once(ABSPATH . 'wp-settings.php');