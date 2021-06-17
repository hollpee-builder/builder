<div class="sectionSitesTop">
	<div class="projectSection">
		<select class="listProject">
			<option value="">Все</option>
			<?php
				foreach ($listProject['list_project'] as $project) {
					$projectId = $project['project_id'];
					if ($selectedProject == $projectId) {
						$attrSelectedProject = 'selected="selected"';
					} else {
						$attrSelectedProject = '';
					}

					$name = $project['name'] .' ('.$project['count'].')';
					echo '
						<option value="'.$projectId.'" data-name="'.$project['name'].'" data-count="'.$project['count'].'" '.$attrSelectedProject.'>'.$name.'</option>
					';
				}
			?>
		</select>
		<div class="listButProject">
			<div class="butProject butCreateProject">
				<?php echo Resource::$page_site_project_but_create; ?>
			</div>
			<div class="butProject butEditProject" noactivity="<?php echo !empty($statusProjectAll) ? $statusProjectAll : ''; ?>">
				<?php echo Resource::$page_site_project_but_edit; ?>
			</div>
			<div class="clear"></div>
		</div>


		<div class="clear"></div>
	</div>

	<div class="listAddButSites">
		<a href="/choseStyle" target="_blank" class="butTop btn butAddSite">Добавить сайт</a>
		<div class="clear"></div>
	</div>
	<div class="clear"></div>
</div>



<div class="listSites" >
	<?php

		$listPagesHtml = '';
		// выводим список сайтов
		foreach ($listSites as $site) {
			$site_id = $site['id'];

			if ($site['type_access'] == 'private') {
				$typeAccess = '<span class="siteInfoTypeAccess"  label="Коммерческий сайт" data-type="private">Коммерческий</span>';
			} else {
				$typeAccess = '';
			}

			$siteType = $site['type'] != 'lp' ? 'cайт' : 'lp';

			/*костыль********************/
			$siteIdShowing = $site['cms_site_id'];
			if (!$siteIdShowing) $siteIdShowing = $site_id;
			/*********************/


		// #######################################################################
			$listPagesHtml .= '
				<div class="siteBlock" site="'.$site_id.'" project="'.$site['project_id'].'">
					<div class="siteAvatarWrap">
						<img src="'.$site['img'].'?id='.time().'" alt="" class="siteAvatar">
						<div class="siteAvatarBlackout"></div>
						<a href="/editor/?site='.$site_id.'" target="_blank" class="siteButEdit btn">
							<span class="siteButEditText">Редактировать</span>
						</a>
					</div>
					<div class="siteBlockBottom">
						<div class="siteBlockName">
							<div class="siteName" contenteditable="true" label="'.Resource::$page_site_list_label_edit_name.'" pos="bottom">
								'.$site['style_name'].'
							</div>
							<div class="clear"></div>
						</div>
						<div class="siteBlockBut">
							<a href="/editor/?site='.$site_id.'" class="siteBut" target="_blank">
								<img src="/img/menu_page_n/edit.png" alt="" class="siteButImg" label="'.Resource::$page_site_list_label_edit.'">
							</a>
							<a href="/show?id='.$site_id.'" class="siteBut" target="_blank">
								<img src="/img/menu_page_n/show.svg" alt="" class="siteButImg" label="'.Resource::$page_site_list_label_show.'">
							</a>
							<div class="siteBut butSiteDownload">
								<img src="/img/menu_page_n/download.png" alt="" class="siteButImg" label="'.Resource::$page_site_list_label_download.'">
							</div>
							<div class="siteBut butSiteMove">
								<img src="/img/menu_page_n/move.png" alt="" class="siteButImg" label="'.Resource::$page_site_list_label_move.'">
							</div>
							<div class="siteBut butSiteCopy">
								<img src="/img/menu_page_n/copy.png" alt="" class="siteButImg" label="'.Resource::$page_site_list_label_copy.'">
							</div>
							<div class="siteBut butSiteDelete">
								<img src="/img/menu_page_n/delete.png" label="'.Resource::$page_site_list_label_delete.'" alt="" class="siteButImg">
							</div>
							<div class="clear"></div>
						</div>
						<div class="siteInfo">
							id: '.$siteIdShowing.', тип: '.$siteType.' '.$typeAccess.'
						</div>
					</div>
				</div>
			';
		}

		if ($listPagesHtml) {
			echo $listPagesHtml;
		} else {
			echo '
				<div class="noSiteBlock">
					<div class="noSiteLabel">
						У Вас пока нет сайтов
					</div>
					<a href="/choseStyle" target="_blank" class="noSiteBut butAddSite">'.Resource::$page_site_but_add.'</a>
				</div>
			';
		}
	?>


	<div class="clear"></div>
</div>


<div class="clear"></div>


