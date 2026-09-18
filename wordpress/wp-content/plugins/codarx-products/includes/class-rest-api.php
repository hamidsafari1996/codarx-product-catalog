<?php
/**
 * REST API registration and product collection endpoint.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers product meta for REST and the public products collection route.
 */
class Codarx_Products_REST_API implements Codarx_Products_Registrable {

	public const NAMESPACE       = 'codarx/v1';
	public const ROUTE           = '/products';
	public const CATEGORIES_ROUTE = '/categories';

	/**
	 * @var Codarx_Products_Sanitize
	 */
	private $sanitize;

	/**
	 * @var Codarx_Products_Product_Query
	 */
	private $query;

	/**
	 * @var Codarx_Products_Product_Transformer
	 */
	private $transformer;

	/**
	 * @param Codarx_Products_Sanitize            $sanitize     Sanitization service.
	 * @param Codarx_Products_Product_Query       $query        Product query builder.
	 * @param Codarx_Products_Product_Transformer $transformer  Response transformer.
	 */
	public function __construct(
		Codarx_Products_Sanitize $sanitize,
		Codarx_Products_Product_Query $query,
		Codarx_Products_Product_Transformer $transformer
	) {
		$this->sanitize    = $sanitize;
		$this->query       = $query;
		$this->transformer = $transformer;
	}

	/**
	 * @return void
	 */
	public function register() {
		$this->register_meta_fields();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_products' ),
				'permission_callback' => '__return_true',
				'args'                => $this->get_collection_args(),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			self::ROUTE . '/(?P<slug>[a-zA-Z0-9-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_product' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'slug' => array(
						'description'       => __( 'Product slug.', 'codarx-products' ),
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_title',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			self::CATEGORIES_ROUTE,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_categories' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public function get_products( WP_REST_Request $request ) {
		$result   = $this->query->execute( $request->get_params() );
		$wp_query = $result['query'];
		$page     = $result['page'];
		$per_page = $result['per_page'];
		$total    = (int) $wp_query->found_posts;

		$items = $this->transformer->transform_many( $wp_query->posts );

		return rest_ensure_response(
			array(
				'items'      => $items,
				'pagination' => array(
					'page'        => $page,
					'per_page'    => $per_page,
					'total'       => $total,
					'total_pages' => (int) ceil( $total / max( 1, $per_page ) ),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public function get_categories( WP_REST_Request $request ) {
		unset( $request );

		$terms = get_terms(
			array(
				'taxonomy'   => Codarx_Products_Taxonomy::TAXONOMY,
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $terms ) ) {
			return rest_ensure_response( array( 'items' => array() ) );
		}

		$items = array();

		foreach ( $terms as $term ) {
			$items[] = array(
				'id'   => (int) $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
			);
		}

		return rest_ensure_response( array( 'items' => $items ) );
	}

	/**
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_product( WP_REST_Request $request ) {
		$slug = sanitize_title( (string) $request['slug'] );

		$posts = get_posts(
			array(
				'name'             => $slug,
				'post_type'        => Codarx_Products_CPT::POST_TYPE,
				'post_status'      => 'publish',
				'posts_per_page'   => 1,
				'suppress_filters' => false,
			)
		);

		if ( empty( $posts ) ) {
			return new WP_Error(
				'codarx_product_not_found',
				__( 'Product not found.', 'codarx-products' ),
				array( 'status' => 404 )
			);
		}

		return rest_ensure_response( $this->transformer->transform( $posts[0] ) );
	}

	/**
	 * @return array<string, array<string, mixed>>
	 */
	private function get_collection_args() {
		return array(
			'page'      => array(
				'description'       => __( 'Current page of results.', 'codarx-products' ),
				'type'              => 'integer',
				'default'           => Codarx_Products_Product_Query::DEFAULT_PAGE,
				'sanitize_callback' => 'absint',
			),
			'per_page'  => array(
				'description'       => __( 'Number of items per page.', 'codarx-products' ),
				'type'              => 'integer',
				'default'           => Codarx_Products_Product_Query::DEFAULT_PER_PAGE,
				'sanitize_callback' => 'absint',
			),
			'search'    => array(
				'description'       => __( 'Search products by title.', 'codarx-products' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'category'  => array(
				'description'       => __( 'Filter by product category ID or slug.', 'codarx-products' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'available' => array(
				'description' => __( 'Filter by stock availability (true/false).', 'codarx-products' ),
				'type'        => 'boolean',
			),
			'min_price' => array(
				'description'       => __( 'Minimum product price.', 'codarx-products' ),
				'type'              => 'number',
				'sanitize_callback' => array( $this, 'sanitize_price_param' ),
			),
			'max_price' => array(
				'description'       => __( 'Maximum product price.', 'codarx-products' ),
				'type'              => 'number',
				'sanitize_callback' => array( $this, 'sanitize_price_param' ),
			),
			'orderby'   => array(
				'description' => __( 'Sort field. Supported: date, price.', 'codarx-products' ),
				'type'        => 'string',
				'enum'        => array( 'date', 'price' ),
				'default'     => 'date',
			),
			'order'     => array(
				'description' => __( 'Sort direction when orderby is set.', 'codarx-products' ),
				'type'        => 'string',
				'enum'        => array( 'asc', 'desc', 'ASC', 'DESC' ),
				'default'     => 'desc',
			),
		);
	}

	/**
	 * @return void
	 */
	private function register_meta_fields() {
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
	 * @param mixed           $value   Raw value.
	 * @param WP_REST_Request $request Request object.
	 * @param string          $param   Parameter name.
	 * @return float|null
	 */
	public function sanitize_price_param( $value, $request = null, $param = null ) {
		unset( $request, $param );

		if ( '' === $value || null === $value ) {
			return null;
		}

		return is_numeric( $value ) ? (float) $value : null;
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
