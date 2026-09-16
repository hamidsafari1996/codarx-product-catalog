<?php
/**
 * Custom Post Type registration.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the Product custom post type.
 */
class Codarx_Products_CPT implements Codarx_Products_Registrable {

	public const POST_TYPE = 'codarx_product';

	/**
	 * @return void
	 */
	public function register() {
		$labels = array(
			'name'                  => _x( 'Products', 'Post type general name', 'codarx-products' ),
			'singular_name'         => _x( 'Product', 'Post type singular name', 'codarx-products' ),
			'menu_name'             => _x( 'Products', 'Admin Menu text', 'codarx-products' ),
			'name_admin_bar'        => _x( 'Product', 'Add New on Toolbar', 'codarx-products' ),
			'add_new'               => __( 'Add New', 'codarx-products' ),
			'add_new_item'          => __( 'Add New Product', 'codarx-products' ),
			'new_item'              => __( 'New Product', 'codarx-products' ),
			'edit_item'             => __( 'Edit Product', 'codarx-products' ),
			'view_item'             => __( 'View Product', 'codarx-products' ),
			'all_items'             => __( 'All Products', 'codarx-products' ),
			'search_items'          => __( 'Search Products', 'codarx-products' ),
			'not_found'             => __( 'No products found.', 'codarx-products' ),
			'not_found_in_trash'    => __( 'No products found in Trash.', 'codarx-products' ),
			'featured_image'        => _x( 'Featured Image', 'Product featured image', 'codarx-products' ),
			'set_featured_image'    => _x( 'Set featured image', 'Product featured image', 'codarx-products' ),
			'remove_featured_image' => _x( 'Remove featured image', 'Product featured image', 'codarx-products' ),
			'use_featured_image'    => _x( 'Use as featured image', 'Product featured image', 'codarx-products' ),
		);

		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'publicly_queryable'  => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'query_var'           => true,
			'rewrite'             => array( 'slug' => 'products' ),
			'capability_type'     => 'post',
			'has_archive'         => true,
			'hierarchical'        => false,
			'menu_position'       => 20,
			'menu_icon'           => 'dashicons-cart',
			'supports'            => array( 'title', 'editor', 'thumbnail' ),
			'show_in_rest'        => true,
		);

		register_post_type( self::POST_TYPE, $args );
	}
}
