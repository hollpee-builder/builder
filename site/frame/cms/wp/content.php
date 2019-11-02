	<?php if ( have_posts() ) : ?>

		<?php if ( is_home() && ! is_front_page() ) : ?>
			<header>
				<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
			</header>
		<?php endif; ?>

		<?php

		while ( have_posts() ) : the_post();

			$hollpee_post_class = 'hlp-col' ?>

			<article id="post-<?php the_ID(); ?>" <?php post_class($hollpee_post_class); ?>>
				<header class="entry-header">
					<?php
						if (!is_single()) {
							$post_thumbnail_id = get_post_thumbnail_id();
			       			$post_thumbnail_url = wp_get_attachment_url( $post_thumbnail_id );
							$post_link = esc_url( get_permalink() );
							echo '<a href="'.$post_link.'"><img class="wp-post-image" src="' . $post_thumbnail_url .'"></a>';
						}
					?>
					<?php
				?>
				</header><!-- .entry-header -->

				<div class="entry-content">
					<?php
						if ( is_single() ) :
							the_title( '<h1 class="entry-title">', '</h1>' );
						else :
							the_title( sprintf( '<h3 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
						endif;
						
						/* translators: %s: Name of current post */
						the_content( sprintf(
							__( 'Подробние'),
							the_title( '<span class="screen-reader-text">', '</span>', false )
						) );

						wp_link_pages( array(
							'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentyfifteen' ) . '</span>',
							'after'       => '</div>',
							'link_before' => '<span>',
							'link_after'  => '</span>',
							'pagelink'    => '<span class="screen-reader-text">' . __( 'Page', 'twentyfifteen' ) . ' </span>%',
							'separator'   => '<span class="screen-reader-text">, </span>',
						) );
					?>
				</div><!-- .entry-content -->

				<?php
					

					// comment 
					// if ( comments_open() || get_comments_number() ) :
					// 	comments_template();
					// endif;
				?>

				<footer class="entry-footer">
					
				
				</footer><!-- .entry-footer -->

			</article><!-- #post-## -->
	<?php 
		endwhile;
		
		the_posts_pagination();
	// If no content, include the "No posts found" template.
	else :
		get_template_part( 'content', 'none' );

	endif;
	?>
