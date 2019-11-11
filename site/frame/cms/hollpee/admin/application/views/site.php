<div class="listSites" >
	<?php  
		$listPagesHtml = '';
		// выводим список сайтов
		foreach ($listSites as $pageId => $site) {
			$fileNameShow = $site['file'];
			if ($fileNameShow == "index.php") $fileNameShow = '';

		// #######################################################################
			$listPagesHtml .= '
				<div class="siteBlock page-item" data-id="'.$pageId.'">
					
					<div class="siteBlockBottom">
						<div class="siteBlockName">
							<div class="siteName page-file-name">
								'.$site['file'].'
							</div>
							<div class="siteInfo">id: '.$pageId.'</div>
							<div class="clear"></div>
						</div>
						<div class="siteBlockBut">
							<a href="'.HlpUrl::attach('/../hlp_editor.php?hlp-page-id='.$pageId).'" class="siteBut" target="_blank">
								<img src="'.HlpUrl::attach('/img/menu_page_n/edit.png').'" alt="" class="siteButImg" label="">
							</a>
							<a href="../'.$fileNameShow.'" class="siteBut but-page-show" target="_blank">
								<img src="'.HlpUrl::attach('/img/menu_page_n/show.svg').'" alt="" class="siteButImg" label="">
							</a>
							<div class="siteBut butSiteDelete but-page-delete">
								<img src="'.HlpUrl::attach('/img/menu_page_n/delete.png').'" label="" alt="" class="siteButImg">
							</div>
							<a href="'.HlpUrl::attach('/page').'?id='.$pageId.'" class="butMarketer">Маркетинг</a>
							<div class="clear"></div>
						</div>
					</div>
				</div>
			';
		}

		echo $listPagesHtml;
	?>
	<div class="clear"></div>
</div>
<div class="listProject">
	
</div>
<div class="clear"></div>

