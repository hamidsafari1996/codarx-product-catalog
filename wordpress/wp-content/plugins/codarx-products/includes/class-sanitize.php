<?php
/**
 * Input sanitization helpers.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sanitizes product meta field values.
 */
class Codarx_Products_Sanitize {

	public const META_PRICE = '_codarx_product_price';
	public const META_STOCK = '_codarx_product_stock';

	/**
	 * @param mixed $value Raw price value.
	 * @return string Sanitized price stored as a decimal string.
	 */
	public function price( $value ) {
		$price = is_numeric( $value ) ? (float) $value : 0.0;

		if ( $price < 0 ) {
			$price = 0.0;
		}

		return number_format( $price, 2, '.', '' );
	}

	/**
	 * @param mixed $value Raw stock value.
	 * @return int Non-negative integer stock count.
	 */
	public function stock( $value ) {
		$stock = is_numeric( $value ) ? (int) $value : 0;

		return max( 0, $stock );
	}
}
