<?php
/**
 * Plugin Name:       Codarx Products
 * Description:       Custom Product post type with categories, pricing, and stock management.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Hamid Safari
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       codarx-products
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

define( 'CODARX_PRODUCTS_VERSION', '1.0.0' );
define( 'CODARX_PRODUCTS_PATH', plugin_dir_path( __FILE__ ) );
define( 'CODARX_PRODUCTS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Contract for components that register WordPress hooks.
 */
interface Codarx_Products_Registrable {

	/**
	 * Register actions and filters.
	 *
	 * @return void
	 */
	public function register();
}

require_once CODARX_PRODUCTS_PATH . 'includes/class-sanitize.php';
require_once CODARX_PRODUCTS_PATH . 'includes/class-cpt.php';
require_once CODARX_PRODUCTS_PATH . 'includes/class-taxonomy.php';
require_once CODARX_PRODUCTS_PATH . 'includes/class-meta-boxes.php';
require_once CODARX_PRODUCTS_PATH . 'includes/class-rest-api.php';

/**
 * Main plugin bootstrap (Singleton).
 */
final class Codarx_Products_Plugin {

	/**
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * @var Codarx_Products_Registrable[]
	 */
	private $components = array();

	/**
	 * @return self
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		$this->load_components();
		$this->register_hooks();
	}

	/**
	 * @return void
	 */
	private function load_components() {
		$sanitize = new Codarx_Products_Sanitize();

		$this->components = array(
			new Codarx_Products_CPT(),
			new Codarx_Products_Taxonomy(),
			new Codarx_Products_Meta_Boxes( $sanitize ),
			new Codarx_Products_REST_API( $sanitize ),
		);
	}

	/**
	 * @return void
	 */
	private function register_hooks() {
		add_action( 'init', array( $this, 'register_components' ), 0 );
	}

	/**
	 * @return void
	 */
	public function register_components() {
		foreach ( $this->components as $component ) {
			$component->register();
		}
	}

	private function __clone() {}

	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize singleton.' );
	}
}

Codarx_Products_Plugin::instance();
