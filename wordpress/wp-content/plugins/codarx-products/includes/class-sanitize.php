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
	 * @param mixed $value Raw stock status (in_stock|out_of_stock|1|0|true|false).
	 * @return int 1 when in stock, otherwise 0.
	 */
	public function stock( $value ) {
		if ( is_bool( $value ) ) {
			return $value ? 1 : 0;
		}

		if ( is_numeric( $value ) ) {
			return ( (int) $value ) > 0 ? 1 : 0;
		}

		$status = strtolower( trim( (string) $value ) );

		if ( in_array( $status, array( 'in_stock', 'instock', 'true', 'yes', '1' ), true ) ) {
			return 1;
		}

		return 0;
	}
}
