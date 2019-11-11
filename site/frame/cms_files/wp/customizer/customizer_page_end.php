	function hollpee_sanitize_text( $input ) {
		return wp_kses_post(force_balance_tags($input));
	}

	function hollpee_sanitize_none( $input ) {
		return $input;
	}
	function hollpee_sanitize_shortcode() {
		return force_balance_tags( $input );
	}
}
add_action( 'customize_register', 'customize_hollpee' );

if( class_exists( 'WP_Customize_Control' ) ):
	class Example_Customize_Textarea_Control extends WP_Customize_Control {
	    public $type = 'textarea';

	    public function render_content() { ?>

	        <label>
	        	<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
	        	<textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
	        </label>

	        <?php
	    }
	}
endif;

?>
