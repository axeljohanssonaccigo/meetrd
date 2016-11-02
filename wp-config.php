<?php
/**
 * Baskonfiguration för WordPress.
 *
 * Denna fil används av wp-config.php-genereringsskript under installationen.
 * Du behöver inte använda webbplatsen, du kan kopiera denna fil direkt till
 * "wp-config.php" och fylla i värdena.
 *
 * Denna fil innehåller följande konfigurationer:
 *
 * * Inställningar för MySQL
 * * Säkerhetsnycklar
 * * Tabellprefix för databas
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL-inställningar - MySQL-uppgifter får du från ditt webbhotell ** //
/** Namnet på databasen du vill använda för WordPress */
define('DB_NAME', 'meetrd.se');

/** MySQL-databasens användarnamn */
define('DB_USER', 'root');

/** MySQL-databasens lösenord */
define('DB_PASSWORD', '');

/** MySQL-server */
define('DB_HOST', 'localhost');

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
define('AUTH_KEY',         'Tc-$*i9$n@L1D_d8=v^x.:RtzHV1V#d2~2 S A|Z1KcYZdeh+S*zd?rpdA=y6AH<');
define('SECURE_AUTH_KEY',  'HC0 ]j_9^i?L*%Hje@s}B[^lBN5R~b82kK{bl>+$s<c+ v^fWe>s9vjX5ql9^Chx');
define('LOGGED_IN_KEY',    'Xyuq+l}Er*|:^p(9%`v5hYag_.2dTsID%GR)R>P!E{e~E+cD-6@-H/6Y)H9nk.-C');
define('NONCE_KEY',        ' Y([}y@ShV+_>Bmb({0D1}aAn6Oc<=+UYl.ddUNWmbHw=M}BYmuP_8(^Mmqp!g5b');
define('AUTH_SALT',        'uY@?e|?O qrk(9tl&tj-42j.}[YH7>Q]s7|_d.P(9-~jBeeuduCwDZHmbZD#tx( ');
define('SECURE_AUTH_SALT', ',$B]r6Udu{tjF<o:g4yn[m5cOu?IR`(/R-ln(#K;i%|:!30d05*BmEyqMx-&0R0@');
define('LOGGED_IN_SALT',   'Be_!D%-2 n-HxSe$SjKmA<):^[:&;rSZK^~aY5GOiWKHBVbA)j_k+i1y`OH,h<1F');
define('NONCE_SALT',       'eua}4Rnxy,|/Uz.m?n;L>$OilyT.9)JN<`[JSl-(b `pdMyI5JSJILV,%;`?fU+%');

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
 *
 * För information om andra konstanter som kan användas för felsökning,
 * se dokumentationen.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* Det var allt, sluta redigera här! Blogga på. */

/** Absoluta sökväg till WordPress-katalogen. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Anger WordPress-värden och inkluderade filer. */
require_once(ABSPATH . 'wp-settings.php');
