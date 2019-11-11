<?php
$hlpFileCustomizer = get_template_directory().'/includes/customizer.php';
if (file_exists($hlpFileCustomizer)) require_once ( $hlpFileCustomizer );

function hollpee_enqueue_stylesheets() {
	// general style
	wp_enqueue_style( 'hlp_main', get_template_directory_uri() . '/css/hlp_main.css', array(), false, 'all' );
	wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css', array(), false, 'all' );

	// style for page
	// $page_slug = is_single() ? 'single' : basename( get_permalink() );
	// if ( is_404() ) {
	// 	$page_slug = '404';
	// } else {
	// 	$css_path = get_template_directory() . '/css/' . $page_slug . '.css';
	// 	if ( !file_exists( $css_path ) ) $page_slug = 'index';
	// }

	// $url_file = get_template_directory_uri() . '/css/' . $page_slug . '.css';
	// wp_enqueue_style( $page_slug, $url_file, array(), false, 'all' );
}
add_action( 'wp_enqueue_scripts', 'hollpee_enqueue_stylesheets' );


function hollpee_enqueue_javascripts() {
	wp_deregister_script( 'jquery' );
	wp_enqueue_script( 'jquery', get_template_directory_uri() . '/js/jquery.js' );
	wp_enqueue_script( 'jquery' );
	
	wp_enqueue_script( 'hlp_script', get_template_directory_uri() . '/js/hlp_script.js', array( 'jquery' ) );
}
add_action( 'wp_enqueue_scripts', 'hollpee_enqueue_javascripts' );

if ( function_exists( 'add_theme_support' ) ) {
  add_theme_support( 'post-thumbnails' );
}

// Allow HTML in author bio section 
remove_filter('pre_user_description', 'wp_filter_kses');

?>


