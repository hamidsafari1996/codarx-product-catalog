<?php
/**
 * WordPress PHPUnit tests config for Codarx Products.
 *
 * Intended to run inside the WordPress Docker container against the `db` service.
 * Credentials match docker-compose / project `.env` defaults.
 *
 * @package Codarx_Products
 */

/* Path to the WordPress codebase inside the container. */
define( 'ABSPATH', '/var/www/html/' );

define( 'WP_DEFAULT_THEME', 'default' );

define( 'WP_DEBUG', true );
define( 'WP_DEBUG_DISPLAY', true );

define( 'DB_NAME', 'codarx_test' );
define( 'DB_USER', getenv( 'WORDPRESS_DB_USER' ) ?: 'wp' );
define( 'DB_PASSWORD', getenv( 'WORDPRESS_DB_PASSWORD' ) ?: 'wp_pass_123' );
define( 'DB_HOST', getenv( 'WORDPRESS_DB_HOST' ) ?: 'db' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wptests_';

define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Codarx Products Tests' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WPLANG', '' );
