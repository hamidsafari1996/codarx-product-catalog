<?php
/**
 * Taxonomy registration.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the Product Category taxonomy.
 */
class Codarx_Products_Taxonomy implements Codarx_Products_Registrable {

	public const TAXONOMY = 'codarx_product_category';

	/**
	 * @return void
	 */
	public function register() {
		$labels = array(
			'name'              => _x( 'Product Categories', 'Taxonomy general name', 'codarx-products' ),
			'singular_name'     => _x( 'Product Category', 'Taxonomy singular name', 'codarx-products' ),
			'search_items'      => __( 'Search Product Categories', 'codarx-products' ),
			'all_items'         => __( 'All Product Categories', 'codarx-products' ),
			'parent_item'       => __( 'Parent Product Category', 'codarx-products' ),
			'parent_item_colon' => __( 'Parent Product Category:', 'codarx-products' ),
			'edit_item'         => __( 'Edit Product Category', 'codarx-products' ),
			'update_item'       => __( 'Update Product Category', 'codarx-products' ),
			'add_new_item'      => __( 'Add New Product Category', 'codarx-products' ),
			'new_item_name'     => __( 'New Product Category Name', 'codarx-products' ),
			'menu_name'         => __( 'Product Categories', 'codarx-products' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'product-category' ),
			'show_in_rest'      => true,
		);

		register_taxonomy(
			self::TAXONOMY,
			array( Codarx_Products_CPT::POST_TYPE ),
			$args
		);
	}
}
