<?php 
	if (is_single() && isset( $post->post_author ) ) : 

		$hollpee_author_description = get_the_author_meta( 'user_description', $post->post_author );
		$hollpee_author_description = nl2br($hollpee_author_description);

		$hollpee_author_name = get_the_author_meta( 'display_name', $post->post_author );
		if ( empty( $hollpee_author_name ) ){
			$hollpee_author_name = get_the_author_meta( 'nickname', $post->post_author );
		}
?>
		<footer class="blog-article-author" >
			<div class="blog-article-author-gravatar"> 
					<?php echo get_avatar( get_the_author_meta('user_email'), 90 ); ?> 
				</div>
			<div class="blog-article-author-info fill-vacuum">
					<h3 class="blog-article-author-name">
						<?php echo $hollpee_author_name; ?> 
					</h3>
					<div class="blog-article-author-desc"> 
						<?php echo $hollpee_author_description; ?>
					</div>
			</div>
			<div class="hlp-clear" style="clear:both;"></div>
		</footer>
		
<?php endif; ?>
