<?php
/**
 * Plugin Name: Kebo Code
 * Plugin URI:  https://kebo.io/plugins/code/
 * Description: Lightweight syntax highlighting using CodeMirror- outputting static HTML.
 * Version:     1.0.2
 * Author:      Kebo
 * Author URI:  https://www.kebo.io/
 * Text Domain: kebo-code
 *
 * @package Kebo Code
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Sorry, no direct access.' );
}

// Useful global constants.
define( 'KBCO_VERSION', '1.0.2' );
define( 'KBCO_URL', plugin_dir_url( __FILE__ ) );
define( 'KBCO_PATH', plugin_dir_path( __FILE__ ) );
define( 'KBCO_FILE', plugin_basename( __FILE__ ) );

// Include class-files used by the plugin.
require_once KBCO_PATH . '/includes/class-kebo-code.php';
require_once KBCO_PATH . '/includes/class-kebo-code-block.php';

// Register Activation/Deactivation Hooks.
register_activation_hook( __FILE__, array( 'Kebo_Code', 'activation' ) );

// Initialize our plugin.
new Kebo_Code();
