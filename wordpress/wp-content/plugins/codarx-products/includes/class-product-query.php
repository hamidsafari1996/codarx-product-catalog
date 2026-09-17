<?php
/**
 * Builds product listing queries from request parameters.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Query Builder for product collection requests.
 */
class Codarx_Products_Product_Query {

	public const DEFAULT_PAGE     = 1;
	public const DEFAULT_PER_PAGE = 12;
	public const MAX_PER_PAGE     = 100;

	/**
	 * @param array<string, mixed> $params Request query params.
	 * @return array{query: WP_Query, page: int, per_page: int}
	 */
	public function execute( array $params ) {
		$page     = $this->resolve_page( $params );
		$per_page = $this->resolve_per_page( $params );
		$args     = $this->build_args( $params, $page, $per_page );

		$title_search = isset( $params['search'] ) ? trim( (string) $params['search'] ) : '';

		if ( '' !== $title_search ) {
			add_filter( 'posts_where', array( $this, 'filter_title_search' ), 10, 2 );
			$GLOBALS['codarx_products_title_search'] = $title_search;
		}

		$query = new WP_Query( $args );

		if ( '' !== $title_search ) {
			remove_filter( 'posts_where', array( $this, 'filter_title_search' ), 10 );
			unset( $GLOBALS['codarx_products_title_search'] );
		}

		return array(
			'query'    => $query,
			'page'     => $page,
			'per_page' => $per_page,
		);
	}

	/**
	 * Restricts search to post titles only.
	 *
	 * @param string   $where Existing WHERE clause.
	 * @param WP_Query $query Current query.
	 * @return string
	 */
	public function filter_title_search( $where, $query ) {
		global $wpdb;

		if ( Codarx_Products_CPT::POST_TYPE !== $query->get( 'post_type' ) ) {
			return $where;
		}

		if ( empty( $GLOBALS['codarx_products_title_search'] ) ) {
			return $where;
		}

		$search = $GLOBALS['codarx_products_title_search'];
		$like   = '%' . $wpdb->esc_like( $search ) . '%';
		$where .= $wpdb->prepare( " AND {$wpdb->posts}.post_title LIKE %s", $like );

		return $where;
	}

	/**
	 * @param array<string, mixed> $params Request params.
	 * @param int                  $page Page number.
	 * @param int                  $per_page Items per page.
	 * @return array<string, mixed>
	 */
	private function build_args( array $params, $page, $per_page ) {
		$args = array(
			'post_type'      => Codarx_Products_CPT::POST_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'no_found_rows'  => false,
		);

		$tax_query  = $this->build_tax_query( $params );
		$meta_query = $this->build_meta_query( $params );

		if ( ! empty( $tax_query ) ) {
			$args['tax_query'] = $tax_query;
		}

		if ( ! empty( $meta_query ) ) {
			$args['meta_query'] = $meta_query;
		}

		$orderby = isset( $params['orderby'] ) ? sanitize_key( (string) $params['orderby'] ) : '';
		$order   = isset( $params['order'] ) ? strtoupper( sanitize_key( (string) $params['order'] ) ) : 'ASC';

		if ( ! in_array( $order, array( 'ASC', 'DESC' ), true ) ) {
			$order = 'ASC';
		}

		if ( 'price' === $orderby ) {
			$args['meta_key'] = Codarx_Products_Sanitize::META_PRICE;
			$args['orderby']  = 'meta_value_num';
			$args['order']    = $order;
		} else {
			$args['orderby'] = 'date';
			$args['order']   = 'DESC';
		}

		return $args;
	}

	/**
	 * @param array<string, mixed> $params Request params.
	 * @return array<int, array<string, mixed>>
	 */
	private function build_tax_query( array $params ) {
		if ( empty( $params['category'] ) ) {
			return array();
		}

		$category = sanitize_text_field( (string) $params['category'] );
		$field    = ctype_digit( $category ) ? 'term_id' : 'slug';

		return array(
			array(
				'taxonomy' => Codarx_Products_Taxonomy::TAXONOMY,
				'field'    => $field,
				'terms'    => ctype_digit( $category ) ? (int) $category : $category,
			),
		);
	}

	/**
	 * @param array<string, mixed> $params Request params.
	 * @return array<int, array<string, mixed>>
	 */
	private function build_meta_query( array $params ) {
		if ( ! isset( $params['available'] ) || '' === $params['available'] ) {
			return array();
		}

		$available = filter_var( $params['available'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );

		if ( null === $available ) {
			return array();
		}

		if ( $available ) {
			return array(
				array(
					'key'     => Codarx_Products_Sanitize::META_STOCK,
					'value'   => 1,
					'compare' => '=',
					'type'    => 'NUMERIC',
				),
			);
		}

		return array(
			'relation' => 'OR',
			array(
				'key'     => Codarx_Products_Sanitize::META_STOCK,
				'value'   => 0,
				'compare' => '=',
				'type'    => 'NUMERIC',
			),
			array(
				'key'     => Codarx_Products_Sanitize::META_STOCK,
				'compare' => 'NOT EXISTS',
			),
		);
	}

	/**
	 * @param array<string, mixed> $params Request params.
	 * @return int
	 */
	private function resolve_page( array $params ) {
		$page = isset( $params['page'] ) ? (int) $params['page'] : self::DEFAULT_PAGE;

		return max( 1, $page );
	}

	/**
	 * @param array<string, mixed> $params Request params.
	 * @return int
	 */
	private function resolve_per_page( array $params ) {
		$per_page = isset( $params['per_page'] ) ? (int) $params['per_page'] : self::DEFAULT_PER_PAGE;

		if ( $per_page < 1 ) {
			$per_page = self::DEFAULT_PER_PAGE;
		}

		return min( self::MAX_PER_PAGE, $per_page );
	}
}
