<?php
/**
 * PHPUnit bootstrap for Codarx Products.
 *
 * @package Codarx_Products
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' ) ? getenv( 'WP_TESTS_DIR' ) : getenv( 'WP_PHPUNIT__DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find WordPress PHPUnit test library at: {$_tests_dir}" . PHP_EOL;
	exit( 1 );
}

require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin for tests.
 *
 * @return void
 */
function _codarx_products_manually_load_plugin() {
	require dirname( __DIR__ ) . '/codarx-products.php';
}

tests_add_filter( 'muplugins_loaded', '_codarx_products_manually_load_plugin' );

require $_tests_dir . '/includes/bootstrap.php';
