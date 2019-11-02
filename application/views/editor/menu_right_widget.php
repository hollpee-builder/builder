<!-- slider -->
<div class="menuWidgetElement menuWidgetSlider">
	<div class="menuOneStyle">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$setting_slider_title; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_slider_label_list; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuStyleItemRow">
						<div class="menuBlockValue valueSliderCurSlide" data-history-no-fixed="true" widget="sliderCurSlide">
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuStyleItemRow">
						<div class="butWidgetSlider butWidgetSliderAdd" data-type="add"><?php echo Resource::$but_add; ?></div>
						<div class="butWidgetSlider butWidgetSliderDelete" data-type="delete"><?php echo Resource::$but_delete; ?></div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_widget_effect_label; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueWidgetSliderAnimate">
						<div class="selectBlockButton">
							<input type="button" value="Статическое" widget="sliderAnimate" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<!-- <div class="option" value="slide"><?php echo Resource::$setting_widget_effect_width; ?></div> -->
							<!-- <div class="option" value="fade"><?php echo Resource::$setting_widget_effect_pop; ?></div> -->
							<?php echo $optionsAnimate; ?>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>

			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_slider_label_delay; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSliderDelay" only-integer="true" widget="sliderDelay" value="">
				</div>
				<div class="clear"></div>
			</div>
			
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_slider_label_speed; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSliderDuration" only-integer="true" widget="sliderDuration" value="">
				</div>
				<div class="clear"></div>
			</div>

		</div>
	</div>

	<div class="menuOneStyle">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$setting_widget_visible_show; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_widget_visible_nav; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueWidgetSliderVisibleNav" widget="sliderVisibleNav">
						<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>

			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_widget_visible_list; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueWidgetSliderVisibleList" widget="sliderVisibleList">
						<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>

		</div>
	</div>
</div>

<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- tabs -->

<div class="menuWidgetElement menuWidgetTabs">
	<div class="menuOneStyle">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$setting_tab_title; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_tab_label_list; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuStyleItemRow">
						<div class="menuBlockValue valueTabsCurItem" data-history-no-fixed="true" widget="tabsCurSlide">
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuStyleItemRow">
						<div class="butWidgetSlider butWidgetTabsAdd" data-type="add"><?php echo Resource::$but_add; ?></div>
						<div class="butWidgetSlider butWidgetTabsDelete" data-type="delete"><?php echo Resource::$but_delete; ?></div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- галлерея в модальном -->

<div class="menuWidgetElement menuWidgetGalleryModal">
	<div class="menuOneStyle">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$setting_zoom_title; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleBlockNone">
				<div class="menuStyleBlockNoneText"><?php echo Resource::$setting_zoom_label_parent; ?></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_zoom_label_status; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueGalleryModalWork" widget="gallery_modalWork">
						<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<!-- <div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_zoom_label_type; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueGalleryModalType" widget="gallery_modalType">
						<div class="menuButValue menuButValueText" value="gm1"><?php echo Resource::$setting_zoom_type_modal; ?></div>
						<div class="menuButValue menuButValueText" value="gm2"><?php echo Resource::$setting_zoom_type_panel; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div> -->
		</div>
	</div>
</div>

<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- hover блок -->

<div class="menuWidgetElement menuWidgetBlockHover">
	<div class="menuOneStyle">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			Ховер блок
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					Анимация
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectWidgetHoverAnimate">
						<div class="selectBlockButton">
							<input type="button" value="Статическое" widget="block_hoverAnimate" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="lily">lily</div>
							<div class="option" value="sadie">sadie</div>
							<!-- <div class="option" value="honey">honey</div> -->
							<div class="option" value="layla">layla</div>
							<div class="option" value="oscar">oscar</div>
							<div class="option" value="marley">marley</div>
							<div class="option" value="ruby">ruby</div>
							<div class="option" value="roxy">roxy</div>
							<div class="option" value="bubba">bubba</div>
							<div class="option" value="romeo">romeo</div>
							<div class="option" value="dexter">dexter</div>
							<div class="option" value="sarah">sarah</div>
							<div class="option" value="chico">chico</div>
							<div class="option" value="milo">milo</div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					Изображение
				</div>
				<div class="menuStyleItemValue ">
					<div class="menuBlockValue menuBlockValueFull" widget="block_hoverImg">
						<div class="menuButValue menuButValueText" value="no">Изменить</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

