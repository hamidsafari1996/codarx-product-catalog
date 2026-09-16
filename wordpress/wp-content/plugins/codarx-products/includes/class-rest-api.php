<?php
/**
 * REST API meta field registration.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Exposes product meta fields through the REST API.
 */
class Codarx_Products_REST_API implements Codarx_Products_Registrable {

	/**
	 * @var Codarx_Products_Sanitize
	 */
	private $sanitize;

	/**
	 * @param Codarx_Products_Sanitize $sanitize Sanitization service.
	 */
	public function __construct( Codarx_Products_Sanitize $sanitize ) {
		$this->sanitize = $sanitize;
	}

	/**
	 * @return void
	 */
	public function register() {
		register_post_meta(
			Codarx_Products_CPT::POST_TYPE,
			Codarx_Products_Sanitize::META_PRICE,
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'auth_callback'     => array( $this, 'can_edit_product_meta' ),
				'sanitize_callback' => array( $this->sanitize, 'price' ),
			)
		);

		register_post_meta(
			Codarx_Products_CPT::POST_TYPE,
			Codarx_Products_Sanitize::META_STOCK,
			array(
				'single'            => true,
				'type'              => 'integer',
				'show_in_rest'      => true,
				'auth_callback'     => array( $this, 'can_edit_product_meta' ),
				'sanitize_callback' => array( $this->sanitize, 'stock' ),
			)
		);
	}

	/**
	 * @param bool   $allowed Whether the user can add the meta.
	 * @param string $meta_key Meta key.
	 * @param int    $post_id Post ID.
	 * @return bool
	 */
	public function can_edit_product_meta( $allowed, $meta_key, $post_id ) {
		unset( $allowed, $meta_key );

		return current_user_can( 'edit_post', $post_id );
	}
}
