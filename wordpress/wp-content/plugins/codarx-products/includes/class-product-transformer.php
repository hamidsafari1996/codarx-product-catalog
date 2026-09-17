<?php
/**
 * Transforms product posts into API response payloads.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Maps WP_Post products to the public API shape.
 */
class Codarx_Products_Product_Transformer {

	/**
	 * @param WP_Post $post Product post.
	 * @return array<string, mixed>
	 */
	public function transform( WP_Post $post ) {
		$price = get_post_meta( $post->ID, Codarx_Products_Sanitize::META_PRICE, true );
		$stock = get_post_meta( $post->ID, Codarx_Products_Sanitize::META_STOCK, true );

		$price_value = is_numeric( $price ) ? (float) $price : 0.0;
		$available   = is_numeric( $stock ) ? ( (int) $stock ) > 0 : false;

		return array(
			'id'          => (int) $post->ID,
			'title'       => get_the_title( $post ),
			'slug'        => $post->post_name,
			'description' => $this->transform_description( $post ),
			'price'       => $this->format_price( $price_value ),
			'available'   => $available,
			'image'       => $this->transform_image( $post->ID ),
			'category'    => $this->transform_category( $post->ID ),
		);
	}

	/**
	 * @param WP_Post $post Product post.
	 * @return string Rendered product content/description.
	 */
	private function transform_description( WP_Post $post ) {
		$content = $post->post_content;

		if ( '' === trim( $content ) ) {
			return '';
		}

		return apply_filters( 'the_content', $content );
	}

	/**
	 * @param WP_Post[] $posts Product posts.
	 * @return array<int, array<string, mixed>>
	 */
	public function transform_many( array $posts ) {
		$items = array();

		foreach ( $posts as $post ) {
			if ( $post instanceof WP_Post ) {
				$items[] = $this->transform( $post );
			}
		}

		return $items;
	}

	/**
	 * Prefer integer output when price has no fractional part.
	 *
	 * @param float $price Price value.
	 * @return int|float
	 */
	private function format_price( $price ) {
		if ( floor( $price ) === $price ) {
			return (int) $price;
		}

		return round( $price, 2 );
	}

	/**
	 * @param int $post_id Product ID.
	 * @return array{url: string, alt: string}|null
	 */
	private function transform_image( $post_id ) {
		$thumbnail_id = get_post_thumbnail_id( $post_id );

		if ( ! $thumbnail_id ) {
			return null;
		}

		$url = wp_get_attachment_image_url( $thumbnail_id, 'full' );

		if ( ! $url ) {
			return null;
		}

		$alt = get_post_meta( $thumbnail_id, '_wp_attachment_image_alt', true );

		if ( ! is_string( $alt ) || '' === $alt ) {
			$alt = get_the_title( $post_id );
		}

		return array(
			'url' => $url,
			'alt' => $alt,
		);
	}

	/**
	 * @param int $post_id Product ID.
	 * @return array{id: int, name: string, slug: string}|null
	 */
	private function transform_category( $post_id ) {
		$terms = get_the_terms( $post_id, Codarx_Products_Taxonomy::TAXONOMY );

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return null;
		}

		$term = $terms[0];

		return array(
			'id'   => (int) $term->term_id,
			'name' => $term->name,
			'slug' => $term->slug,
		);
	}
}
