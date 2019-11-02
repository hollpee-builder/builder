<?php  

$listElmBasicType = '
	<div class="option" value="hlp-type-heading2">Заголовок h2</div>
	<div class="option" value="hlp-type-heading3">Заголовок h3</div>
	<div class="option" value="hlp-type-heading4">Заголовок h4</div>
	<div class="option" value="hlp-but">Кнопка</div>
';

$optionsAnimate = '
							
<div class="optionLabel">Bouncing Entrances</div>
<div class="option" value="bounceIn">bounceIn</div>
<div class="option" value="bounceInDown">bounceInDown</div>
<div class="option" value="bounceInLeft">bounceInLeft</div>
<div class="option" value="bounceInRight">bounceInRight</div>
<div class="option" value="bounceInUp">bounceInUp</div>

<div class="optionLabel">Fading Entrances</div>
<div class="option" value="fadeIn">fadeIn</div>
<div class="option" value="fadeInDown">fadeInDown</div>
<div class="option" value="fadeInDownBig">fadeInDownBig</div>
<div class="option" value="fadeInLeft">fadeInLeft</div>
<div class="option" value="fadeInLeftBig">fadeInLeftBig</div>
<div class="option" value="fadeInRight">fadeInRight</div>
<div class="option" value="fadeInRightBig">fadeInRightBig</div>
<div class="option" value="fadeInUp">fadeInUp</div>
<div class="option" value="fadeInUpBig">fadeInUpBig</div>

<div class="optionLabel">Flippers</div>
<div class="option" value="flip">flip</div>
<div class="option" value="flipInX">flipInX</div>
<div class="option" value="flipInY">flipInY</div>

<div class="optionLabel">Lightspeed</div>
<div class="option" value="lightSpeedIn">lightSpeedIn</div>

<div class="optionLabel">Rotating Entrances</div>
<div class="option" value="rotateIn">rotateIn</div>
<div class="option" value="rotateInDownLeft">rotateInDownLeft</div>
<div class="option" value="rotateInDownRight">rotateInDownRight</div>
<div class="option" value="rotateInUpLeft">rotateInUpLeft</div>
<div class="option" value="rotateInUpRight">rotateInUpRight</div>

<div class="optionLabel">Sliding Entrances</div>
<div class="option" value="slideInUp">slideInUp</div>
<div class="option" value="slideInDown">slideInDown</div>
<div class="option" value="slideInLeft">slideInLeft</div>
<div class="option" value="slideInRight">slideInRight</div>

<div class="optionLabel">Zoom Entrances</div>
<div class="option" value="zoomIn">zoomIn</div>
<div class="option" value="zoomInDown">zoomInDown</div>
<div class="option" value="zoomInLeft">zoomInLeft</div>
<div class="option" value="zoomInRight">zoomInRight</div>
<div class="option" value="zoomInUp">zoomInUp</div>


';


?>

<div class="rightMenuWrap">
	<!-- навигация -->
	<div class="rightMenuNav">
		<div class="rightMenuNavItem" chosen="true" type="style">
			<?php echo Resource::$panel_right_tab_style; ?>
		</div>
		<div class="rightMenuNavItem" type="setting">
			<?php echo Resource::$panel_right_tab_setting; ?>
		</div>
		<div class="rightMenuNavItem" type="struct">
			<?php echo Resource::$panel_right_tab_struct; ?>
		</div>
		<div class="rightMenuNavItem" type="site">
			Сайт
		</div>
	</div>
	<!-- название активного элемента и кнопка изменить если есть -->
	<div class="rightMenuTop">
		<!-- заголовок -->
		<div class="rightMenuTitle" type="elm">
			<div class="rightMenuTitleItem" type="element">
				<!--  название элемента -->
				<div class="rightMenuLabel rightMenuTypeElm"></div>
				
				<!-- <div class="menuBlockValue blockTypeState" css="">
					<div class="menuButValue menuButValueText menuButElmState" value="static" label="Обычное">static</div>
					<div class="menuButValue menuButValueText menuButElmState" label="Выбраный" value="chosen">chosen</div>
					<div class="menuButValue menuButValueText menuButElmState" label="При наведениие" value="hover">:hover</div>
					<div class="menuButValue menuButValueText menuButElmState" label="Фокус" value="focus">:focus</div>
				</div> -->
				<div class="select selectElmState" >
					<div class="selectBlockButton">
						<input type="button" value="Статическое" css="geometryPositionType" status="false">
						<div class="selectButtonArrow"><span is-image="true"></span></div>
					</div>
					<div class="optionBlock">
						<div class="option" value="static">:static</div>
						<div class="option" value="hover">:hover</div>
						<div class="option" value="parent_hover">parent:hover</div>
						<div class="option" value="active">:active</div>
						<div class="option" value="chosen">:chosen</div>
						<div class="option" value="focus">:focus</div>
						<div class="option" value="fixed">:fixed</div>
						<!-- <div class="option" value="load">:load</div> -->
					</div>
				</div>
				<!-- <div class="butAddTemplate" pos="top">Добавить в шаблоны</div> -->
				<!-- кнопка изменить -->
				<!-- <div class="rightMenuTopButton" label="Двойной клик<br/>по элементу" pos="bottom"><span class="rightMenuTopButtonText">Изменить видео</span></div> -->
				<div class="clear"></div>
			</div>	
			<div class="rightMenuTitleItem" type="struct">
				<div class="rightMenuLabel">
					<?php echo Resource::$panel_right_struct_title; ?>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<!-- секция параметров у всех -->
		<div class="rightMenuListFixedProperty">
			<div class="rightMenuFixedProperty" type="style">
				<div class="menuFixedPropertyItem menuFixedItemClass">
					<div class="menuListClassLabel">
						<?php echo Resource::$panel_right_key_class; ?>:
					</div>
					<div class="menuListClassBlock">
						<div class="menuListClass">
							<div class="menuFixedClass menuClassUnique" type="unique" label="<?php echo Resource::$panel_right_class_edit_label; ?>">unique-class</div>
							<div class="menuFixedClass menuClassAdded" type="added" label="<?php echo Resource::$panel_right_class_edit_label; ?>"></div>
							<div class="clear"></div>
						</div>
						<div class="menuListButClassAdded">
							<div class="menuClassBut menuClassButAdd valueAddClass" label="<?php echo Resource::$panel_right_class_edit_label; ?>" pos="bottom"></div>
							<div class="menuClassBut menuClassButDelete" label="<?php echo Resource::$panel_right_class_delete_label; ?>" pos="bottom"></div>
						</div>
						<div class="clear"></div>
					</div>
					<input type="text" class="valuleMenuClassAdded" only-eng="true">
					<div class="clear"></div>	
				</div>
			</div>
			<div class="rightMenuFixedProperty" type="setting"> 
				<div class="menuFixedVisibleWrap">
					<div class="menuFixedPropertyItem menuFixedVisible">
						<div class="menuFixedPropertyLabel">
							<?php echo Resource::$panel_right_display_label; ?>
						</div>
						<div class="menuFixedPropertyValue">
							<div class="menuBlockValue menuBlockVisibleElm" setting="fixedVisible" toggle="true">
								<div class="menuButValue menuSettingButValue menuButVisible" chosen="true" label="<?php echo Resource::$panel_top_screen_desktop; ?>" pos="bottom" toggle="true" value="desktop"><img src="/img/editor/screen/desktop.png" type="desktop" alt="" /></div>
								<div class="menuButValue menuSettingButValue menuButVisible" chosen="true" label="<?php echo Resource::$panel_top_screen_tl; ?>" pos="bottom" toggle="true" value="tab-l"><img src="/img/editor/screen/tab_h.png" type="tab_h" alt="" /></div>
								<div class="menuButValue menuSettingButValue menuButVisible" chosen="true" label="<?php echo Resource::$panel_top_screen_tp; ?>" pos="bottom" toggle="true" value="tab-p"><img src="/img/editor/screen/tab_v.png" type="tab_v" alt="" /></div>
								<div class="menuButValue menuSettingButValue menuButVisible" chosen="true" label="<?php echo Resource::$panel_top_screen_ml; ?>" pos="bottom" toggle="true" value="mobile-l"><img src="/img/editor/screen/mobile_h.png" type="mobile_h" alt="" /></div>
								<div class="menuButValue menuSettingButValue menuButVisible" chosen="true" label="<?php echo Resource::$panel_top_screen_mp; ?>" pos="left" toggle="true" value="mobile-p"><img src="/img/editor/screen/mobile_v.png" type="mobile_v" alt="" /></div>
							</div>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
			<div class="rightMenuFixedProperty" type="site">
				<div class="menuFixedPropertyItem">
					<div class="menuFixedPropertyLabel">
						<?php echo Resource::$panel_right_site_type_block_title; ?>
					</div>
					<div class="select selectStyleBasicElmType">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_right_site_type_all; ?>" css="fixedBasicElmType" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="all">Сайт</div>
							<?php echo $listElmBasicType; ?>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
	</div>
	<!-- блоки -->
	<div class="rightMenuListContent">
		<!-- стили -->
		<div class="rightMenuContent menuStyle" type="style" chosen="true">
			<?php require_once $_SERVER['DOCUMENT_ROOT']."/application/views/editor/menu_right_style.php" ?>
		</div>
		<!-- настройки -->
		<div class="rightMenuContent menuSetting" type="setting">
			<?php require_once $_SERVER['DOCUMENT_ROOT']."/application/views/editor/menu_right_setting.php" ?>
		</div>
		<!-- структура -->
		<div class="rightMenuContent menuStruct" type="struct">
		</div>
	</div>
</div>


<div class="rightMenuListButShowHide">
	<div class="rightMenuButShowHide rightMenuButShow"><?php echo Resource::$panel_right_but_show; ?></div>
	<div class="rightMenuButShowHide rightMenuButHide"><?php echo Resource::$panel_right_but_hide; ?></div>
</div>