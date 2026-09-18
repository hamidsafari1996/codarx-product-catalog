<?php
/**
 * REST API integration tests for Codarx Products.
 *
 * @package Codarx_Products
 */

/**
 * @coversDefaultClass Codarx_Products_REST_API
 */
class Test_Codarx_Products_REST_API extends WP_UnitTestCase {

	/**
	 * REST route for the products collection.
	 *
	 * @var string
	 */
	private $route = '/' . Codarx_Products_REST_API::NAMESPACE . Codarx_Products_REST_API::ROUTE;

	/**
	 * Category term ID used in fixtures.
	 *
	 * @var int
	 */
	private $bitumen_term_id;

	/**
	 * Category term ID used in fixtures.
	 *
	 * @var int
	 */
	private $base_oil_term_id;

	/**
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->bitumen_term_id = self::factory()->term->create(
			array(
				'taxonomy' => Codarx_Products_Taxonomy::TAXONOMY,
				'name'     => 'Bitumen',
				'slug'     => 'bitumen',
			)
		);

		$this->base_oil_term_id = self::factory()->term->create(
			array(
				'taxonomy' => Codarx_Products_Taxonomy::TAXONOMY,
				'name'     => 'Base Oil',
				'slug'     => 'base-oil',
			)
		);

		$this->create_product(
			'Bitumen 60/70',
			'bitumen-60-70',
			'600.00',
			45,
			$this->bitumen_term_id
		);
		$this->create_product(
			'Bitumen 80/100',
			'bitumen-80-100',
			'550.00',
			0,
			$this->bitumen_term_id
		);
		$this->create_product(
			'Recycled Base Oil',
			'recycled-base-oil',
			'380.00',
			120,
			$this->base_oil_term_id
		);
		$this->create_product(
			'Petroleum Jelly',
			'petroleum-jelly',
			'290.00',
			0,
			$this->base_oil_term_id
		);
	}

	/**
	 * @param string $title Product title.
	 * @param string $slug Product slug.
	 * @param string $price Price meta value.
	 * @param int    $stock Stock quantity / availability meta value.
	 * @param int    $term_id Category term ID.
	 * @return int
	 */
	private function create_product( $title, $slug, $price, $stock, $term_id ) {
		$post_id = self::factory()->post->create(
			array(
				'post_type'   => Codarx_Products_CPT::POST_TYPE,
				'post_status' => 'publish',
				'post_title'  => $title,
				'post_name'   => $slug,
			)
		);

		update_post_meta( $post_id, Codarx_Products_Sanitize::META_PRICE, $price );
		update_post_meta( $post_id, Codarx_Products_Sanitize::META_STOCK, $stock );
		wp_set_object_terms( $post_id, array( (int) $term_id ), Codarx_Products_Taxonomy::TAXONOMY );

		return $post_id;
	}

	/**
	 * @param array<string, mixed> $params Query params.
	 * @return WP_REST_Response
	 */
	private function request_products( array $params = array() ) {
		$request = new WP_REST_Request( 'GET', $this->route );

		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}

		$response = rest_get_server()->dispatch( $request );
		$this->assertInstanceOf( WP_REST_Response::class, $response );

		return $response;
	}

	/**
	 * Filters products by category slug.
	 *
	 * @return void
	 */
	public function test_category_filter_returns_matching_products() {
		$response = $this->request_products(
			array(
				'category' => 'bitumen',
			)
		);

		$this->assertSame( 200, $response->get_status() );

		$data = $response->get_data();
		$this->assertArrayHasKey( 'items', $data );
		$this->assertCount( 2, $data['items'] );

		$slugs = wp_list_pluck( $data['items'], 'slug' );
		sort( $slugs );

		$this->assertSame( array( 'bitumen-60-70', 'bitumen-80-100' ), $slugs );

		foreach ( $data['items'] as $item ) {
			$this->assertSame( 'bitumen', $item['category']['slug'] );
		}
	}

	/**
	 * Availability filter uses `_codarx_product_stock` with stock > 0.
	 *
	 * @return void
	 */
	public function test_availability_filter_uses_stock_meta() {
		$in_stock = $this->request_products(
			array(
				'available' => true,
			)
		);

		$this->assertSame( 200, $in_stock->get_status() );
		$in_stock_data = $in_stock->get_data();
		$this->assertCount( 2, $in_stock_data['items'] );

		foreach ( $in_stock_data['items'] as $item ) {
			$this->assertTrue( $item['available'] );
		}

		$in_stock_slugs = wp_list_pluck( $in_stock_data['items'], 'slug' );
		sort( $in_stock_slugs );
		$this->assertSame( array( 'bitumen-60-70', 'recycled-base-oil' ), $in_stock_slugs );

		$out_of_stock = $this->request_products(
			array(
				'available' => false,
			)
		);

		$this->assertSame( 200, $out_of_stock->get_status() );
		$out_of_stock_data = $out_of_stock->get_data();
		$this->assertCount( 2, $out_of_stock_data['items'] );

		foreach ( $out_of_stock_data['items'] as $item ) {
			$this->assertFalse( $item['available'] );
		}
	}

	/**
	 * Products can be sorted by `_codarx_product_price`.
	 *
	 * @return void
	 */
	public function test_price_sort_order() {
		$asc = $this->request_products(
			array(
				'orderby' => 'price',
				'order'   => 'asc',
			)
		);

		$this->assertSame( 200, $asc->get_status() );
		$asc_prices = wp_list_pluck( $asc->get_data()['items'], 'price' );
		$this->assertSame( array( 290, 380, 550, 600 ), $asc_prices );

		$desc = $this->request_products(
			array(
				'orderby' => 'price',
				'order'   => 'desc',
			)
		);

		$this->assertSame( 200, $desc->get_status() );
		$desc_prices = wp_list_pluck( $desc->get_data()['items'], 'price' );
		$this->assertSame( array( 600, 550, 380, 290 ), $desc_prices );
	}

	/**
	 * Invalid page values fail REST schema validation with HTTP 400.
	 *
	 * @return void
	 */
	public function test_invalid_page_parameter_returns_400() {
		$response = $this->request_products(
			array(
				'page' => -1,
			)
		);

		$this->assertSame( 400, $response->get_status() );

		$data = $response->get_data();
		$this->assertSame( 'rest_invalid_param', $data['code'] );
		$this->assertArrayHasKey( 'page', $data['data']['params'] );
	}

	/**
	 * Pagination totals reflect the filtered collection size.
	 *
	 * @return void
	 */
	public function test_pagination_totals() {
		$response = $this->request_products(
			array(
				'page'     => 1,
				'per_page' => 2,
			)
		);

		$this->assertSame( 200, $response->get_status() );

		$data = $response->get_data();
		$this->assertCount( 2, $data['items'] );
		$this->assertSame(
			array(
				'page'        => 1,
				'per_page'    => 2,
				'total'       => 4,
				'total_pages' => 2,
			),
			$data['pagination']
		);

		$page_two = $this->request_products(
			array(
				'page'     => 2,
				'per_page' => 2,
			)
		);

		$this->assertSame( 200, $page_two->get_status() );
		$page_two_data = $page_two->get_data();
		$this->assertCount( 2, $page_two_data['items'] );
		$this->assertSame( 2, $page_two_data['pagination']['page'] );
		$this->assertSame( 4, $page_two_data['pagination']['total'] );
		$this->assertSame( 2, $page_two_data['pagination']['total_pages'] );
	}
}
