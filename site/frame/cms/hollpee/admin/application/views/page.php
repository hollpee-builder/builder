<?php  
$siteId = $site['page_id'];
$abtest = json_decode($abtestJson, true);

?>

<div id="canvasFormating" style="display:none;"></div>

<div id="info" style="display:none;">
	<div id="siteId">
		<?php echo $siteId; ?>
	</div>
	<div id="fullUrl">
		<?php echo $fullUrl; ?>
	</div>
	<div id="siteInfoJson">
		<?php echo json_encode($site, true); ?>
	</div>
	<div id="abtestJson">
		<?php echo json_encode($abtest, true); ?>
	</div>
	<div id="listPagesJson">
		<?php echo json_encode($listPages, true); ?>
	</div>
	<div id="adaptiveTitleJson">
		<?php echo $adaptiveTitleJson; ?>
	</div>
	<div id="listVisitJson">
		<?php echo json_encode($listVisit, true); ?>
	</div>
	<div id="listLeadJson">
		<?php echo json_encode($listLead, true); ?>
	</div>
</div>

<div class="listSection" data-type="sts" data-sts="date">
	<div class="listSectionListBut">
		<div class="sectionPageTitle sectionPageTitleHeading">Статистика по дате</div>

		<div class="butChosenSection" data-type="adaptive_title">Мультилендинг</div>
		<div class="butChosenSection" data-type="ab_test">A/B тест</div>
		<div class="butChosenSection" data-type="sts" data-chosen="true" data-sts="date">Статистика</div>
		<div class="clear"></div>
	</div>
	<div class="listSectionContent">
		<div class="sectionPage" data-type="ab_test">
			<div class="sectionPageTitle">
				A/B тест
			</div>
			<div class="sectionPageContent">
				<div class="table abtest">
					<div class="tableRow abtestItem abtestItemH">
						<div class="abtestItemCell tableCell" data-type="variant">
							<span>Вариант</span>
						</div>
						<div class="abtestItemCell tableCell" data-type="user">
							<span>Посетители</span>
						</div>
						<div class="abtestItemCell tableCell" data-type="lead">
							<span>Лиды</span>
						</div>
						<div class="abtestItemCell tableCell" data-type="conversion">
							<span>Конверсия</span>
						</div>
						<div class="abtestItemCell tableCell" data-type="delete">

						</div>
						<div class="clear"></div>
					</div>
					<div class="abtestContent tableContent">
						<div class="abtestContentListVariant">
							<?php  
								$abtestList = $abtest['list'];
								foreach ($abtestList as $abtestPageId => $abtestPageRunning) {

								}
							?>
						</div>
						<div class="tableRow abtestItem" data-id="all">
							<div class="abtestItemCell tableCell" data-type="variant">
								<div class="abtestLabelAll">Всего</div>
								<div class="clear"></div>
							</div>
							<div class="abtestItemCell tableCell abtestCountUserAll" data-type="user">
								<span></span>
							</div>
							<div class="abtestItemCell tableCell abtestCountLeadAll" data-type="lead">
								<span></span>
							</div>
							<div class="abtestItemCell tableCell abtestCountConversionAll" data-type="conversion">
								<span></span>
							</div>
							<div class="abtestItemCell tableCell" data-type="delete">

							</div>
							<div class="clear"></div>
						</div>
					</div>
				</div>
				<div class="abtestListBut">
					<div class="butAbtestVariantAdd">Добавить вариант</div>
					<div class="butAbtestResetStat">Сбросить статистику</div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
	
		<div class="sectionPage" data-type="adaptive_title">
			<div class="sectionPageTitle">
				Мультилендинг
			</div>
			<div class="sectionPageContent">
				<a href="../hlp_title.php?hlp-page-name=<?php echo $site['file']; ?>&hlp-page-id=<?php echo $siteId; ?>" target="_blank" class="butAddAdaptiveTitleElm">Добавить динамический элемент</a>
				<div class="clear"></div>

				<div class="table tableAdaptiveTitle">
					<div class="tableRow tableRowH">
						<div class="tableCell" data-type="url">
							<span>Ссылка</span>
						</div>
						<div class="tableCellListElmH">
							
						</div>
						<div class="tableCell" data-type="button">
							<span></span>
						</div>
						<div class="clear"></div>
					</div>
					<div class="tableContent">
						
					</div>
				</div>
				<div class="butAddAdaptiveTitleValue">Добавить новое значение</div>
				
				<div class="h-folder-file" style="display:none;" data-hlp-type="images">
					<?php echo json_encode($listImg, true); ?>
				</div>
			</div>
		</div>

		<div class="sectionPage" data-type="sts">
			<div class="sectionPageTitle" data-sts="date">Статистика по дате</div>
			<div class="sectionPageTitle" data-sts="utm">Статистика по источникам</div>
			<div class="sectionPageTitle" data-sts="ttl">Статистика по заголовкам</div>
			<div class="sectionPageContent">
				<!-- <div class="stsListTabVariant"></div> -->

				<div class="pageStsList">
					<div class="pageSts" data-type="date"></div>
					<div class="pageStsListFooter">
						<div class="butResetSts">Сбросить статистику</div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>

	</div>
</div>
