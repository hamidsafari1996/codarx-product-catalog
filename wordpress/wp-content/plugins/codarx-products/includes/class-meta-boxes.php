<?php
/**
 * Product meta box registration and persistence.
 *
 * @package Codarx_Products
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles Price and Stock meta boxes for Products.
 */
class Codarx_Products_Meta_Boxes implements Codarx_Products_Registrable {

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
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post_' . Codarx_Products_CPT::POST_TYPE, array( $this, 'save_meta' ), 10, 2 );
	}

	/**
	 * @return void
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'codarx_product_details',
			__( 'Product Details', 'codarx-products' ),
			array( $this, 'render_meta_box' ),
			Codarx_Products_CPT::POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * @param WP_Post $post Current post object.
	 * @return void
	 */
	public function render_meta_box( $post ) {
		wp_nonce_field( 'codarx_product_meta', 'codarx_product_meta_nonce' );

		$price = get_post_meta( $post->ID, Codarx_Products_Sanitize::META_PRICE, true );
		$stock = get_post_meta( $post->ID, Codarx_Products_Sanitize::META_STOCK, true );

		if ( '' === $price ) {
			$price = '0.00';
		}

		$in_stock = '' === $stock ? true : ( (int) $stock ) > 0;
		?>
		<p>
			<label for="codarx_product_price">
				<strong><?php esc_html_e( 'Price', 'codarx-products' ); ?></strong>
			</label><br />
			<input
				type="number"
				id="codarx_product_price"
				name="codarx_product_price"
				value="<?php echo esc_attr( $price ); ?>"
				min="0"
				step="0.01"
				class="widefat"
			/>
		</p>
		<fieldset>
			<legend>
				<strong><?php esc_html_e( 'Stock', 'codarx-products' ); ?></strong>
			</legend>
			<label style="display:block;margin:6px 0;">
				<input
					type="radio"
					name="codarx_product_stock"
					value="in_stock"
					<?php checked( $in_stock ); ?>
				/>
				<?php esc_html_e( 'In Stock', 'codarx-products' ); ?>
			</label>
			<label style="display:block;margin:6px 0;">
				<input
					type="radio"
					name="codarx_product_stock"
					value="out_of_stock"
					<?php checked( ! $in_stock ); ?>
				/>
				<?php esc_html_e( 'Out of Stock', 'codarx-products' ); ?>
			</label>
		</fieldset>
		<?php
	}

	/**
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 * @return void
	 */
	public function save_meta( $post_id, $post ) {
		if ( ! isset( $_POST['codarx_product_meta_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce(
			sanitize_text_field( wp_unslash( $_POST['codarx_product_meta_nonce'] ) ),
			'codarx_product_meta'
		) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( isset( $_POST['codarx_product_price'] ) ) {
			$price = $this->sanitize->price( wp_unslash( $_POST['codarx_product_price'] ) );
			update_post_meta( $post_id, Codarx_Products_Sanitize::META_PRICE, $price );
		}

		if ( isset( $_POST['codarx_product_stock'] ) ) {
			$stock = $this->sanitize->stock( wp_unslash( $_POST['codarx_product_stock'] ) );
			update_post_meta( $post_id, Codarx_Products_Sanitize::META_STOCK, $stock );
		}
	}
}
