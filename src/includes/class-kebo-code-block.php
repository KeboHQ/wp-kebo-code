<?php
/**
 * Class file for the Kebo_Code_Block class.
 *
 * @package Kebo Code
 */

if ( ! class_exists( 'Kebo_Code_Block' ) ) {
	/**
	 * Class Kebo_Code_Block
	 */
	class Kebo_Code_Block {
		/**
		 * Kebo_Code_Block constructor.
		 *
		 * @return void
		 */
		public function __construct() {
			$this->init();
		}

		/**
		 * Class initiation.
		 *
		 * A helper function, called by `Kebo_Code_Block::__construct()` to initiate actions, hooks and other features needed.
		 *
		 * @return void
		 */
		public function init() {
			register_block_type(
				'kebo/code',
				array(
					'editor_script'   => 'kebo-code-script',
					'editor_style'    => 'kebo-code-style',
					'render_callback' => array( $this, 'render' ),
				)
			);

			add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );
		}

		/**
		 * Block Editor Assets.
		 *
		 * Enqueues Gutenberg Block editor assets.
		 *
		 * @return void
		 */
		public function editor_assets() {

			$dependencies = array(
				'wp-blocks',
				'wp-i18n',
				'wp-element',
				'wp-components',
			);
			if ( SCRIPT_DEBUG ) {
				wp_enqueue_script( 'kebo-code-script', KBCO_URL . 'assets/js/block.build.js', $dependencies, KBCO_VERSION, true );
			} else {
				wp_enqueue_script( 'kebo-code-script', KBCO_URL . 'assets/js/block.build.min.js', $dependencies, KBCO_VERSION, true );
			}
			wp_localize_script( 'kebo-code-script', 'kebo_code_vars', array( 'site_url' => esc_url( KBCO_URL ) ) );

			wp_enqueue_style( 'kebo-code-style', KBCO_URL . 'assets/css/editor.css', array(), KBCO_VERSION );

		}

		/**
		 * Block Render.
		 *
		 * Renders the Block on the frontend.
		 *
		 * @param {array} $attributes Array containing block attributes.
		 *
		 * @return string
		 */
		public function render( $attributes ) {

			global $post;

			$atts = shortcode_atts(
				array(
					'lang'        => 'php',
					'theme'       => 'default',
					'lines'       => false,
					'content'     => '',
					'highlighted' => '',
				),
				$attributes
			);

			$classes = array(
				'wp-block-kebo-code',
				'kebo-code',
				'lang-' . $atts['lang'],
				'theme-' . $atts['theme'],
				( $atts['lines'] ) ? 'lines-true' : 'lines-false',
			);

			if ( ! empty( $atts['highlighted'] ) ) {

				wp_enqueue_style( 'kebo-code-themes', KBCO_URL . 'assets/css/theme.css', array(), KBCO_VERSION, 'all' );

				return sprintf(
					'<div class="%1$s">%2$s</div>',
					join( ' ', $classes ),
					$atts['highlighted']
				);

			} else {

				return sprintf(
					'<div class="%1$s"><pre><code>%2$s</pre></code></div>',
					join( ' ', $classes ),
					esc_html( $atts['content'] )
				);

			}

		}

	}

}
new Kebo_Code_Block();
