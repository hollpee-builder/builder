<?php  
	header('Cache-Control: no-store, no-cache');
	header("Cache-Control: no-cache, must-revalidate");
	header("Cache-Control: post-check=0,pre-check=0", false);
	header("Cache-Control: max-age=0", false);

	$HLP_JS_INDEX = false;

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title; ?></title>
	<link rel="icon" type="image/png" href="/img/icon.png" sizes="32x32" />
	<link rel="stylesheet" href="<?php echo Url::get('/site/frame/css/hlp_main.css') ?>">

	<link rel="stylesheet" href="<?php echo Url::get('/css/main/modal.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/main/support.css') ?>">

	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/style.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/colorpicker.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/menu_top.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/menu_right.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/menu_right_setting.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/menu_right_style.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/menu_right_widget.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/content.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/content_widget.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/content_grid.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/list_form.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/modal_element.css') ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/editor/mode_simple.css') ?>">

	<!--widget !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->

	<!--  
	<link rel="stylesheet" href="<?php echo Url::get('/site/frame/widget/slider/s1/s1_style.css') ?>">
	-->
	
	<!--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
	<!-- библиотеки -->
	
	<script type="text/javascript" src="<?php echo Url::get('/js/main/jquery.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_MAIN) ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_JS) ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/html2canvas.js') ?>" ></script>
	<!-- 
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/lib/colorpicker.js') ?>" ></script>
	 -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/lib/color/colors.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/lib/color/jqColorPicker.min.js') ?>" ></script>
	
	<?php if($HLP_JS_INDEX): ?>   
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/index.js') ?>" ></script>
	<?php endif; ?>

	<script type="text/javascript" src="<?php echo Url::get('/js/editor/loading.js') ?>" ></script>
	


	


	<?php if(!$HLP_JS_INDEX): ?>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/function.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/modal.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/notification.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/file.js') ?>" ></script>
	
	<!--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
	<!-- события(не относящийся к изменению) -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/event/event_general.js') ?>" ></script>

	<!--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
	<!--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
	<!-- приложение -->
	<!-- контроллер -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/SiteController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/PageController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/EditorController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/ElementStyleController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/ElementSettingController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/ElementAddController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/ElementEditController.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/controller/ElementManController.js') ?>" ></script>
	<!--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
	<!-- модель -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/Data.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/User.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/Element.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/TemplateSection.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/MenuListItem.js') ?>" ></script>
	<!-- создание и манипулирование -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/ElementSelf.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/ElementBasicType.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_man/ElementMan.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/ElementBasic.js') ?>" ></script>	
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_a_standart.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_b_layout.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_frame.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_nav_mobile.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_form.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/elements_widget.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_self/element_create/ElementModal.js') ?>" ></script>

	<!-- стиль -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/ElementCss.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/Color.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_canvas/Resize.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_canvas/Grid.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_canvas/StyleCanvas.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_canvas/ModeSimple.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenu.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuFixed.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuGeometry.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuBg.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuBorder.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuBoxShadow.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuTextShadow.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuFilter.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuTransform.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuText.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuOther.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuList.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuAnimate.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/style_menu/StyleMenuSite.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/list_style/StylePosition.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/list_style/StyleFont.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_style/list_style/StyleUnit.js') ?>" ></script>
	<!-- настройки -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSetting.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingFixed.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingGrid.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingClick.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingHeading.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingSection.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingForm.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingSEO.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingGeneral.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_setting/ElementSettingTriger.js') ?>" ></script>
	
	<!-- виджет -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidget.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidgetBasicList.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidgetSlider.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidgetGalleryModal.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidgetBlockHover.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_widget/ElementWidgetTabs.js') ?>" ></script>

	<!-- изменение -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementBasic.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementImage.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/TextEditor.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementVideo.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementForm.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementMap.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/element/element_edit/EditElementIframe.js') ?>" ></script>
	<!-- страница -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/History.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/Page.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/PageSetting.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/Site.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/PageStruct.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/EditorCode.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/PrivacyPolicy.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/manager/ManagerBasic.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/manager/ManagerPage.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/page/manager/ManagerModal.js') ?>" ></script>
	<!-- редактор в общем -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/editor/Editor.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/editor/Key.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/editor/Scale.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/editor/Guides.js') ?>" ></script>	
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/model/editor/Screen.js') ?>" ></script>
	<!-- запуск приложения -->
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/list_object.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/editor/application/launch.js') ?>" ></script>

	<?php endif; ?>

</head>
<body>
	<?php echo $consultantLable; ?>
	
	<!-- список дополнительных шрифтов пользователя -->
	<div class="headListAddedFont">
		<div class="headListAddedFontGoogle"></div>
		<div class="headListAddedFontLocal"></div>
	</div>

	<div class="loadingSiteSection">
		<div class="loadingSiteSectionContent">
			
			<div class="loadingSiteBlock">
				<img src="/img/logo.png" alt="" class="loadingSiteLogo">
				<img src="/img/editor/loading.gif" alt="" class="loadingSiteIcon" />
				<div class="loadingSiteLabel"><?php echo Resource::$start_loading; ?>...</div>
			</div>
		</div>
	</div>
	<!-- необходимые данные для работы -->
	<div class="sectionForWork" style="display:none;">
		<!-- буффер -->
		<div class="bufferElementInsert"></div>
		<div class="bufferElementWork"></div>
		<!-- данные -->
		<div id="siteId"><?php echo $siteId; ?></div>
		<div id="userId"><?php echo $userId; ?></div>
		<div id="rateInfo"><?php echo $rateInfo; ?></div>
		<div id="jsPropertyJson"><?php echo $jsPropertyJson; ?></div>
		<div id="siteName"><?php echo $siteInfo['style_name']; ?></div>
	</div>
	<!-- инпут для сброса фокуса -->
	<input type="text" id="inputResetFocus" style="position:absolute;top:-1000px;">
	<!-- блок с css стилями -->
	<div class="sectionCssMain">
		<div class="sectionCssItem" screen="desktop"></div>
		<div class="sectionCssItem" screen="tab-l"></div>
		<div class="sectionCssItem" screen="tab-p"></div>
		<div class="sectionCssItem" screen="mobile-l"></div>
		<div class="sectionCssItem" screen="mobile-p"></div>
	</div>
	<div class="sectionCssPage">
		<div class="sectionCssItem" screen="desktop"></div>
		<div class="sectionCssItem" screen="tab-l"></div>
		<div class="sectionCssItem" screen="tab-p"></div>
		<div class="sectionCssItem" screen="mobile-l"></div>
		<div class="sectionCssItem" screen="mobile-p"></div>
	</div>
	<div class="sectionCssFast"></div><!--для быстрой установки-->
<!-- ############################################################################################### -->
	
	<!-- оболочка страницы -->
	<div class="wrapper" style="display:block;">
	<!-- <div class="wrapper modeLongreads" style="display:block;"> -->
		<!-- все что ниже header -->
		<div class="contentAdmin">
			<!-- режим - просмотр страницы -->
			<div class="redactorPageShow redactorPageShowHollpee">
				<div class="redactorPageShowHeader">
					<div class="modeShowHeaderContent">
						<div class="modeShowHeaderLeft">
							<img src="/img/logo.png" alt="" class="logoShow">
						</div>

						<div class="butModeEdit" label="Space(пробел)">
							<?php echo Resource::$show_but_back; ?>
						</div>
						<div class="modeEditListDevices">
							<div class="butShowMobileV butShowItemH" screen="mobile-p" label="<?php echo Resource::$panel_top_screen_mp; ?>" pos="bottom"></div>
							<div class="butShowMobileH butShowItemH" screen="mobile-l" label="<?php echo Resource::$panel_top_screen_ml; ?>" pos="bottom"></div>
							<div class="butShowTabV butShowItemH" screen="tab-p" label="<?php echo Resource::$panel_top_screen_tp; ?>" pos="bottom"></div>
							<div class="butShowTabH butShowItemH" screen="tab-l" label="<?php echo Resource::$panel_top_screen_tl; ?>" pos="bottom"></div>
							<div class="butShowDesctop butShowItemH" screen="desktop" chosen="true"  label="<?php echo Resource::$panel_top_screen_desktop; ?>" pos="bottom"></div>
							<div class="clear"></div>
						</div>
						
						<div class="clear"></div>
					</div>	
				</div>
				<div class="redactorPageShowContent"></div>
			</div>
			<!-- режим - редактирование страницы -->
			<div class="redactorPageEdit">
				<!-- вверхняя панель -->
				<div class="redactorPageTop">	
					<div class="redactorPageTopRight">
						<a href="/sites" class="logo-editor butExit">
							<img src="/img/logo.png" alt="" stle="width:100%;">
						</a>
						
						<!-- <a href="" target="_blank" class="butTopPanel butFullShow">Просмотр</a> -->
						<!-- <a href="" class="butExit"> -->
							<!-- <img src="/img/editor/exit.png" alt=""> -->
						<!-- </a> -->
					</div>
					<div class="redactorPageTopCenter">
						<div class="topMenu topMenuLeft" >
							<a href="" target="_blank" class="logoEditor butExit">H</a>
							<div class="topMenuBlock">
								<div class="topMenuButton butSelectPage" label="<?php echo Resource::$panel_top_but_page_lable; ?>">
									<!-- <span class="topMenuItemLabelPage">СТРАНИЦА: </span> -->
									<img src="/img/editor/top_panel/page.png" alt="" class="topMenuLeftIcon topMenuLeftIconPage">
									<!-- <span class="butSelectBlockName butSelectPageName">Home</span> -->
									<div class="clear"></div>
								</div>
								<div class="topMenuButton butSelectModal" label="<?php echo Resource::$panel_top_but_modal_lable; ?>">
									<!-- <span class="topMenuItemLabelPage">МОДАЛЬНОЕ: </span> -->
									<img src="/img/editor/top_panel/modal.png" alt="" class="topMenuLeftIcon topMenuLeftIconModal">
									<!-- <span class="butSelectBlockName butSelectModalName">Нет</span> -->
									<div class="clear"></div>
								</div>
								
								<div class="topMenuButton butSettingPage" label="<?php echo Resource::$panel_top_but_setting_page; ?>">
									<img src="/img/editor/top_panel/setting.png" alt="" class="topMenuLeftIcon topMenuLeftIconSetting">
									<div class="clear"></div>
								</div>

								<div class="topMenuButton butAddTemplateSection"><div class="topMenuIconPlus">+</div><span><?php echo Resource::$panel_top_but_template_pro; ?></span></div>
								<div class="topMenuButton butAddElement" label="Нажмите Tab" pos="bottom"><div class="topMenuIconPlus">+</div><span><?php echo Resource::$panel_top_but_elements_pro; ?></span></div>
								<!-- <div class="topMenuButton butSettingSimpleBlock" label="Нажмите Tab" pos="bottom"><span data-type="lite">Настроить стили</span></div> -->
							</div>
							<div class="clear"></div>
						</div>
						<div class="topMenu topMenuRight">
							<!-- <div class="topMenuBlock topMenuSupport butSupport">
								<div class="menuItem topMenuItem" type="support">
									<img src="/img/editor/top_panel/help.png" alt="">
									<div class="supportSubMenuWrap">
										<div class="supportSubMenu">
											<a href="/support/tutorial" target="_blanck" class="supportItem" data-type="tutorial">
												Инструкция
											</a>
											<a href="/support/listTicket" target="_blanck" class="supportItem" data-type="email">
												Тикеты
											</a>
										</div>
									</div>
								</div>
							</div> -->
							
							
							<div class="topMenuBlock">
								<a href="" target="_blank" class="menuItem topMenuItem butFullShow" label="<?php echo Resource::$panel_top_fullshow_label; ?>" pos="bottom">
									<img src="/img/editor/top_panel/show.png" alt="">
								</a>
							</div>
							
							<div class="topMenuBlock butFastShowWrap">
								<div class="menuItem topMenuItem topMenuFastShow" type="show" label="<?php echo Resource::$panel_top_fastshow_label; ?>" pos="bottom">
									<img src="/img/editor/top_panel/show-fast.png" alt="">
								</div>
							</div>
							
							<div class="topMenuBlock">
								<div class="menuItem topMenuItem topMenuSave" type="save" label="<?php echo Resource::$panel_top_save_label; ?>" pos="bottom">
									<div class="topMenuSaveIcon"></div>
								</div>
							</div>
							<div class="topMenuBlock" style="display:none;">
								<a href="" target="_blank" class="menuItem topMenuItem butSitePublished" label="<?php echo Resource::$panel_top_published_label; ?>" pos="bottom">
								</a>
							</div>
							<div class="topMenuBlock topMenuBlockHistory">
								<div class="menuItem topMenuItem topMenuBack" status="false" type="back" label="<?php echo Resource::$panel_top_history_back; ?>" pos="bottom">
									<img src="/img/editor/history-back.png" alt="">
								</div>
								<div class="menuItem topMenuItem topMenuNext" status="false" type="next" label="<?php echo Resource::$panel_top_history_next; ?>" pos="bottom">
									<img src="/img/editor/history-next.png" alt="">
								</div>
							</div>
						</div>
						<div class="topMenuListSrcreen">
							<div class="blockSelectShowDevice">
								<div class="butShowMobileV butShowItem" screen="mobile-p" label="<?php echo Resource::$panel_top_screen_mp; ?>" pos="bottom"></div>
								<div class="butShowMobileH butShowItem" screen="mobile-l" label="<?php echo Resource::$panel_top_screen_ml; ?>" pos="bottom"></div>
								<div class="butShowTabV butShowItem" screen="tab-p" label="<?php echo Resource::$panel_top_screen_tp; ?>" pos="bottom"></div>
								<div class="butShowTabH butShowItem" screen="tab-l" label="<?php echo Resource::$panel_top_screen_tl; ?>" pos="bottom"></div>
								<div class="butShowDesctop butShowItem" screen="desktop" chosen="true"  label="<?php echo Resource::$panel_top_screen_desktop; ?>" pos="bottom"></div>
								<div class="clear"></div>
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<!-- все что ниже верхне панели -->
				<div class="redactorBottom">
					<!-- левая панель: добавление элементов -->
					<div class="listAddElements">
						<div class="listElementsTop">
							<div class="listElementsLabel">
								<?php echo Resource::$panel_elements_title; ?>
							</div>
							<!-- <div class="listElementsButClose" is-image="true"></div> -->
							<img src="/img/editor/elements/cancel.png" class="listElementsButClose" alt="">
							<div class="clear"></div>
						</div>
						<div class="listElementsContent">

							<div class="listElementsBlock listElementsLayout">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_layout; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">	
										<div class="elementsItem elementsItemSection" type="section">
											<img src="/img/editor/elements/section.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_sectoin; ?>
											</div>
										</div>
										<div class="elementsItem elementsItemColumn" type="column">
											<img src="/img/editor/elements/columns.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_column; ?>
											</div>
										</div>
										<div class="elementsItem elementsItemBlock" type="block">
											<img src="/img/editor/elements/block.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_block; ?>
											</div>
										</div>
										<div class="clear"></div>
									</div>
								</div>
							</div>
						<!-- 	<div class="listElementsBlock listElementsColumn">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										Колонки
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									
								</div>
							</div> -->

							<div class="listElementsBlock listElementsNav">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_menu; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">	
										<div class="elementsItem " type="nav">
											<img src="/img/editor/elements/nav.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_menu; ?>
											</div>
										</div>
										<div class="elementsItem " type="nav-button-mobile">
											<img src="/img/editor/elements/nav.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_menu_mobile; ?>
											</div>
										</div>
										<div class="elementsItem" type="nav-item">
											<img src="/img/editor/elements/nav-item.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_menu_item; ?>
											</div>
										</div>
										<div class="clear"></div>
									</div>
								</div>
							</div>
							<div class="listElementsBlock">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_basic; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">
										<div class="elementsItem" type="heading">
											<img src="/img/editor/elements/heading.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_heading; ?>
											</div>
										</div>
										<div class="elementsItem" type="text">
											<img src="/img/editor/elements/text.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_text; ?>
											</div>
										</div>
										<div class="elementsItem" type="button">
											<img src="/img/editor/elements/button.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_button; ?>
											</div>
										</div>
										<div class="clear"></div>
									</div>
									<div class="elementsListItemRow">
										<div class="elementsItem" type="image" operation="modal">
											<img src="/img/editor/elements/image.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_image; ?>
											</div>
										</div>
										<!-- <div class="elementsItem" type="image_text">
											<img src="/img/editor/elements/image.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												Img + Text
											</div>
										</div> -->
										
										<div class="clear"></div>
									</div>
									
								</div>
							</div>
							<div class="listElementsBlock listElementsWidget">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_extansion; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">
										<div class="elementsItem" type="embed" operation="modal">
											<img src="/img/editor/elements/iframe.png" class="elementsItemImage elementItemIframe" alt="">
											<div class="elementsItemName">Embed</div>
										</div>
										<div class="elementsItem" type="map" operation="modal">
											<img src="/img/editor/elements/map.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_map; ?>
											</div>
										</div>
										<div class="elementsItem" type="video" operation="modal">
											<img src="/img/editor/elements/video.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_video; ?>
											</div>
										</div>
										<div class="clear"></div>
									</div>
									<div class="elementsListItemRow">
										<div class="elementsItem" type="hlp-ol">
											<img src="/img/editor/elements/nav-item.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Ol</div>
										</div>
										<div class="elementsItem" type="hlp-ul">
											<img src="/img/editor/elements/nav-item.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Ul</div>
										</div>
										<div class="elementsItem" type="hlp-li">
											<img src="/img/editor/elements/nav-item.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Li</div>
										</div>
										<div class="clear"></div>
									</div>
								</div>
							</div>
							<div class="listElementsBlock listElementsForm">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_form; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">
										<div class="elementsItem" type="form" operation="modal">
											<img src="/img/editor/elements/form.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">
												<?php echo Resource::$panel_elements_form; ?>
											</div>
										</div>
										<div class="elementsItem" type="input">
											<img src="/img/editor/elements/input.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Input</div>
										</div>
										<div class="elementsItem" type="textarea">
											<img src="/img/editor/elements/textarea.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Textarea</div>
										</div>
										<div class="clear"></div>
									</div>
									<div class="elementsListItemRow">
										<div class="elementsItem" type="hlp-select">
											<img src="/img/editor/elements/input.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Select</div>
										</div>
										<div class="elementsItem" type="checkbox">
											<img src="/img/editor/elements/input.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Checkbox</div>
										</div>
										<div class="elementsItem" type="radio">
											<img src="/img/editor/elements/input.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Radio</div>
										</div>
										<!-- <div class="elementsItem" type="submit">
											<img src="/img/editor/elements/submit.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Submit</div>
										</div> -->
										<div class="clear"></div>
									</div>
									<div class="elementsListItemRow">
										<div class="elementsItem" type="submit">
											<img src="/img/editor/elements/submit.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Submit</div>
										</div>
										<div class="elementsItem" type="upload_file_wrap">
											<img src="/img/editor/elements/submit.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Файл</div>
										</div>
										<div class="clear"></div>
									</div>
								</div>
							</div>
							
							<div class="listElementsBlock listElementsWidget">
								<div class="elementsBlockLabel">
									<div class="elementsBlockLabelIcon">-</div>
									<span class="elementsBlockLabelText">
										<?php echo Resource::$panel_elements_label_widget; ?>
									</span>
									<div class="clear"></div>
								</div>
								<div class="elementsListItem">
									<div class="elementsListItemRow">
										<div class="elementsItem" type="slider">
											<img src="/img/editor/elements/slider.png" class="elementsItemImage" alt="">
											<div class="elementsItemName"><?php echo Resource::$panel_elements_slider; ?></div>
										</div>
										<div class="elementsItem" type="hlp-tabs">
											<img src="/img/editor/elements/slider.png" class="elementsItemImage" alt="">
											<div class="elementsItemName"><?php echo Resource::$panel_elements_tab; ?></div>
										</div>
										<!-- <div class="elementsItem" type="hlp-comparison">
											<img src="/img/editor/elements/slider.png" class="elementsItemImage" alt="">
											<div class="elementsItemName"><?php echo Resource::$panel_elements_comparison; ?></div>
										</div> -->
										<div class="clear"></div>
									</div>
									<!-- <div class="elementsListItemRow">
										<div class="elementsItem" type="hlp-block-hover">
											<img src="/img/editor/elements/block.png" class="elementsItemImage" alt="">
											<div class="elementsItemName">Hover</div>
										</div>
									</div> -->
								</div>
							</div>

						</div>
					</div>
					<!-- правая панель: изменение стиля страницы и др параметры -->
					<div class="rightMenu">
						<?php require_once $_SERVER['DOCUMENT_ROOT']."/application/views/editor/menu_right.php" ?>
					</div>

					<!-- левая часть: добавление не стдр. элементов и палотно работы -->
					<div class="sectionCenter">
						<!-- верхняя часть -->
						<div class="topPanel">
							<!-- навигация порежимам -->
							<div class="topPanelNav">
								<div class="topPanelNavItem topPanelNavPage" chosen="true" type="page"><?php echo Resource::$panel_top_tab_page; ?></div>
								<div class="topPanelNavItem topPanelNavModal" type="modal"><?php echo Resource::$panel_top_tab_modal; ?></div>
								<div class="clear"></div>
							</div>

							<div class="topPanelSiteName"><?php echo Resource::$panel_top_name_key; ?>: <span class="siteNameText"></span></div>
							
							
							<!-- правая часть -->
							<div class="topPanelSetting" >

							</div>
							<div class="clear"></div>
						</div>
	<!-- ################################################### -->
						<!-- поле работы -->
						<div class="contentSection">
							<!-- для внутреней работы -->
							<div class="contentBoofer" style="display:none"></div>

							<!-- рабочие поле: сама редактируемая страница -->
							<div class="contentWrap" screen="desktop"> 
								<div class="contentItem contentItemPage content hlp-site" type="page" screen="desktop">
								</div>
								<div class="contentModal contentItem" type="modal">
									<!-- <div class="element section modalWrap site"></div> -->
									<div class="topPanelNavItem topPanelNavPage" type="page">Назад на страницу</div>
									<div class="modalWrap site hlp-site" style="height:auto;min-height:100%;padding-bottom:50px;background:none;background-image:none;background-color:rgba(0,0,0,0.3);"></div>
								</div>
								
								<!-- mode simple -->
								<div class="blockManModeSimple">
									<div class="blockManModeSimpleContent">
										<img src="/img/editor/simple/copy.png" label="<?php echo Resource::$panel_simple_but_copy; ?>" alt="" class="butManSimpleBlock butCopySimpleBlock">
										<img src="/img/editor/simple/delete.png" label="<?php echo Resource::$panel_simple_but_delete; ?>" alt="" type="delete" class="butManSimpleBlock butDeleteSimpleBlock">
										<img src="/img/editor/simple/prev.png" data-pos="horizontal" alt="" class="butManSimpleBlock butPrevSimpleBlock">
										<img src="/img/editor/simple/next.png" data-pos="horizontal" alt="" class="butManSimpleBlock butNextSimpleBlock">
										<img src="/img/editor/simple/top.png" data-pos="vertical" alt="" class="butManSimpleBlock butPrevSimpleBlock">
										<img src="/img/editor/simple/bottom.png" data-pos="vertical" alt="" class="butManSimpleBlock butNextSimpleBlock">
										
										<!-- <img src="/img/editor/simple/setting.png" label="<?php echo Resource::$panel_simple_but_setting; ?>" alt="" class="butManSimpleBlock butSettingSimpleBlock"> -->
										<img src="/img/editor/simple/edit.png" label="<?php echo Resource::$panel_simple_but_edit; ?>" alt="" class="butManSimpleBlock butEditSimpleBlock">
										<div class="clear"></div>
									</div>
								</div>

							</div>

							<!-- ######################### -->
							<div class="textRedactor">
								<div class="textRedactorMenu">
									<div class="textRedactorBlockHistory">
										<img src="/img/editor/top_panel/back.png" label="Назад по истории" value="undo" alt="" class="butTextHistory butTextHistoryBack">
										<img src="/img/editor/top_panel/next.png" label="Вперед по истории" value="redo" alt="" class="butTextHistory butTextHistoryNext">
									</div>
									<div class="textRedactorBlockButtons">
										<div class="textRedactorButton" label="Жирный" value="bold"><span>B</span></div>
										<div class="textRedactorButton" label="Курсив" value="italic"><span>I</span></div>
										<div class="textRedactorButton" label="Подчеркнутый" value="underline"><span>U</span></div>
										<div class="textRedactorButton" label="Перечеркнутый" value="strikeThrough"><span>S</span></div>
										<div class="textRedactorButton textRedactorButtonWrap" style="width:50px;" value="span" label="Оболочка"><span>Wrap</span></div>
										<div class="textRedactorButton textRedactorButClear" label="Сбросить стили" ><span is-image="true"></span></div>
									</div>
									
								</div>
								<div class="textRedactorField elementSelected" style="" contenteditable="true"></div>
							</div>
							<!-- ######################### -->

							<!-- элементы для направляющих -->
							<div class="listGuidesElm">
								<div class="guidesInfo"></div>
								<div class="guidesPropertySection">
									<input type="text" class="valueGuidesPosition" value="23">
									<div class="guidesBlockColor">
										<div class="guidesColorRow">
											<div class="guidesColorItem" style="background-color:rgb(255,0,0);"></div>
											<div class="guidesColorItem" style="background-color:rgb(186,84,255);"></div>
											<div class="guidesColorItem" style="background-color:rgb(56,191,0);"></div>
											<div class="guidesColorItem" style="background-color:rgb(51,153,102);"></div>
											<div class="clear"></div>
										</div>
										<div class="guidesColorRow">
											<div class="guidesColorItem" style="background-color:rgb(64,61,163);"></div>
											<div class="guidesColorItem" style="background-color:rgb(255,0,255);"></div>
											<div class="guidesColorItem" style="background-color:rgb(255,117,17);"></div>
											<div class="guidesColorItem" style="background-color:rgb(238,233,9);"></div>
											<div class="clear"></div>
										</div>
									</div>
									<img src="/img/editor/delete-white-2.png" alt="" class="butGuidesDelete" label="Удалить <br> направляющую" pos="bottom">
									<div class="clear"></div>
								</div>
							</div>
						</div>


						<div class="contentSectionFooter">
							<div class="editorModeBlock">
								<div class="chosenEditorMode">
									<div class="butChosenMode butChosenModeLite" data-type="lite" label="<?php echo Resource::$panel_bottom_mode_lite_label; ?>" pos="top">Lite</div>
									<div class="butChosenMode butChosenModePro" data-type="pro" label="<?php echo Resource::$panel_bottom_mode_pro_label; ?>" pos="top">Pro</div>
									<div class="clear"></div>
								</div>
								<div class="chosenEditorModeLabel">
									<?php echo Resource::$panel_bottom_mode_label; ?>
								</div>
							</div>
							
							<div class="listIconFooter" data-type="page">
								<div class="listIconFooterBlackoutModal"></div>
								<div class="butVisibleRuler" label="<?php echo Resource::$panel_bottom_ruller_label; ?>" pos="top"></div>
								<div class="butShowGrid" label="<?php echo Resource::$panel_bottom_grid_label; ?>" data-type="none" pos="top"></div>
								<div class="clear"></div>
							</div>

							<div class="butTutorial">Видео инструкция</div>
							
							<!-- манипулирование элементом -->
							<div class="footerElementMan topMenuBlockManip">
								<img src="" type="copy" class="butElementMan topMenuCopy" label="Копировать<br/>Ctr+C" pos="top">
								<img src="" type="insert" class="butElementMan topMenuInsert " label="Вставить<br/>Ctr+V" pos="top">
								<img src="" type="cut" class="butElementMan topMenuCut" label="Вырезать<br/>Ctr+X " pos="top">
								<img src="" type="delete" class="butElementMan topMenuDelete" label="Удалить<br/>Backspace, Delete" pos="top">
								<div class="clear"></div>
							</div>

							<!-- вложеность элементов -->
							<div class="nestedSection">
								
							</div>
							<div class="clear"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

<script type='text/javascript' src="/js/widget/analytics.js"></script>	

</body>
</html>

