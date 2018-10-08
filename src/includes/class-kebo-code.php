<?php
/**
 * Primary class file for the Kebo Code plugin.
 *
 * @package Kebo Code
 */

if ( ! class_exists( 'Kebo_Code' ) ) {
	/**
	 * Class Kebo_Code
	 */
	class Kebo_Code {
		/**
		 * Kebo_Code constructor.
		 *
		 * @return void
		 */
		public function __construct() {
			$this->init();
		}

		/**
		 * Plugin initiation.
		 *
		 * A helper function, called by `Kebo_Code::__construct()` to initiate actions, hooks and other features needed.
		 *
		 * @uses add_action()
		 * @uses add_filter()
		 *
		 * @return void
		 */
		public function init() {
			add_action( 'plugins_loaded', array( $this, 'load_i18n' ) );
			add_action( 'wp_register_scripts', array( $this, 'register' ) );
		}

		/**
		 * Load translations.
		 *
		 * Loads the textdomain needed to get translations for our plugin.
		 *
		 * @uses load_plugin_textdomain()
		 *
		 * @return void
		 */
		public function load_i18n() {
			load_plugin_textdomain( 'kebo-code', false, KBCO_PATH . '/languages' );
		}

		/**
		 * Register assets.
		 *
		 * Register our CSS and JavaScript files.
		 *
		 * @uses wp_register_style()
		 *
		 * @return void
		 */
		public function register() {
			wp_register_style( 'kebo-code-editor', KBCO_URL . 'assets/css/editor.css', array(), KBCO_VERSION, 'all' );
			wp_register_style( 'kebo-code-themes', KBCO_URL . 'assets/css/themes.css', array(), KBCO_VERSION, 'all' );
		}

		/**
		 * Compatibility check on activation.
		 *
		 * @uses version_compare()
		 *
		 * @return void
		 */
		public static function activation() {

			$min_php_version = '5.6';
			$min_wp_version  = '4.2';

			if ( version_compare( $GLOBALS['wp_version'], $min_wp_version, '<' ) ) {
				// translators: WordPress version number.
				self::block_activation( sprintf( __( 'Kebo Code requires WordPress %s or later to function properly. Please upgrade WordPress before activating Kebo Code.', 'kebo-code' ), $min_wp_version ) );
			}

			if ( version_compare( phpversion(), $min_php_version, '<' ) ) {
				// translators: PHP version number.
				self::block_activation( sprintf( __( 'Kebo Code requires PHP %s or later to function properly. Please upgrade PHP before activating Kebo Code.', 'kebo-code' ), $min_php_version ) );
			}

		}

		/**
		 * Blocks Activation.
		 *
		 * Displays an HTML message explaining why activation was blocked.
		 *
		 * @param {string} $message String containing the activation message.
		 *
		 * @return void
		 */
		public static function block_activation( $message = '' ) {
			echo '<div class="error"><p>';
			echo esc_html( $message );
			echo '</p></div>';
			deactivate_plugins( array( 'kebo-code/kebo-code.php' ) );
		}
	}
}
