<div class="menuStyleBlackout"></div>


<!-- для колонки -->
<div class="menuOneStyle menuSettingGrid">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_grid_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem menuColumnDelete">
			<div class="menuStyleItemLabel">

			</div>
			<div class="menuStyleItemValue">
				<div class="butDeleteColumn">
					<?php echo Resource::$setting_grid_delete_column; ?>
				</div>
				<div class="clear"></div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem menuGridMargin" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_grid_label_indent; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm" setting="gridMargin" css="margin-left:7px;">
					<div class="menuButValue menuButValueText" value="no">
						<?php echo Resource::$setting_grid_but_value_no; ?>
					</div>
					<div class="menuButValue menuButValueText" value="yes">
						<?php echo Resource::$setting_grid_but_value_yes; ?>
					</div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem menuGridCountRow" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_grid_label_row; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueCountRow" setting="gridCountRow">
					<div class="menuButValue menuButValueText" value="1">1</div>
					<div class="menuButValue menuButValueText" value="2">2</div>
					<div class="menuButValue menuButValueText" value="3">3</div>
					<div class="menuButValue menuButValueText" value="4">4</div>
					<div class="menuButValue menuButValueText" value="5">5</div>
					<div class="menuButValue menuButValueText" value="6">6</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem" >
			<div class="menuStyleItemRow menuCountColumns">
				<div class="menuStyleItemLabel menuLabelGrid menuLabelGridDesctop">
					<img src="/img/editor/screen/desktop.png" alt="" class="gridLabelImg gridLabelImgDesctop">
					<span>
						<?php echo Resource::$setting_grid_label_desktop; ?>
					</span>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuSettingBlockValue menuCountColumnsValue" setting="gridDesctopCount" type="desktop">
						<div class="menuSettingButValue menuSettingOptionColumn" style="margin-bottom:10px;" row="1" value="1" chosen="true"><span is-image="true"></span></div>
						<div class="clear"></div>
						<div class="menuSettingButValue menuSettingOptionColumn" value="2"><span is-image="true"></span></div>
						<div class="menuSettingButValue menuSettingOptionColumn" value="3"><span is-image="true"></span></div>
						<div class="menuSettingButValue menuSettingOptionColumn" value="4"><span is-image="true"></span></div>
						<div class="menuSettingButValue menuSettingOptionColumn" value="5"><span is-image="true"></span></div>
						<div class="menuSettingButValue menuSettingOptionColumn" value="6"><span is-image="true"></span></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow menuColumnsSize">
				<!-- <div class="menuStyleItemLabel">
					<?php echo Resource::$setting_grid_label_size; ?>
				</div> -->
				<div class="menuStyleItemValue menuColumnsSizeValue">
					<div class="blockSizingColumns">
						<div class="columnsSiziBlockSeparators">
							<div class="columnsSiziSeparator" value="3"><span></span></div>
							<div class="columnsSiziSeparator" value="6"><span></span></div>
							<div class="columnsSiziSeparator" value="9"><span></span></div>
						</div>
						<div class="listSizingColumn">
							<div class="itemSizingColumn" value="3"><span>3</span></div>
							<div class="itemSizingColumn" value="3"><span>3</span></div>
							<div class="itemSizingColumn" value="3"><span>3</span></div>
							<div class="itemSizingColumn" value="3"><span>3</span></div>
						</div>
					</div>
				</div>

				<div class="clear"></div>
			</div>
		</div>
		<div class="menuStyleItem menuGridTabH" >
			<div class="menuStyleItemLabel menuLabelGrid">
				<img src="/img/editor/screen/tab_h.png" alt="" class="gridLabelImg"> 
				<span>
					<?php echo Resource::$setting_grid_label_tl; ?>
				</span>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuSettingBlockValue menuCountColumnsValue" setting="gridNoDesctop" type="tab-l">
					<div class="menuSettingButValue menuSettingOptionColumn" row="1" value="1" chosen="true"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn " row="2" value="2"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn " row="3" value="3"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn " row="4" value="4"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn " row="5" value="5"><span is-image="true"></span></div>
					<!-- <div class="menuSettingButValue menuSettingOptionColumn menuBetterThreeColumn" value=""><span is-image="true"></span></div> -->
				</div>

			</div>
			<div class="clear"></div>
		</div>

		<div class="menuStyleItem menuGridTabV" >
			<div class="menuStyleItemLabel menuLabelGrid">
				<img src="/img/editor/screen/tab_v.png" alt="" class="gridLabelImg"> 
				<span>
					<?php echo Resource::$setting_grid_label_tp; ?>
				</span>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuSettingBlockValue menuCountColumnsValue" setting="gridNoDesctop" type="tab-p">
					<div class="menuSettingButValue menuSettingOptionColumn" row="1" value="1" chosen="true"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="2" value="2"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="3" value="3"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="4" value="4"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="5" value="5"><span is-image="true"></span></div>
					<!-- <div class="menuSettingButValue menuSettingOptionColumn menuBetterThreeColumn" value=""><span is-image="true"></span></div> -->
				</div>

			</div>
			<div class="clear"></div>
		</div>
		
		<div class="menuStyleItem menuGridMobileH" >
			<div class="menuStyleItemLabel menuLabelGrid">
				<img src="/img/editor/screen/mobile_h.png" alt="" class="gridLabelImg"> 
				<span>
					<?php echo Resource::$setting_grid_label_ml; ?>
				</span>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemValue"> 
				<div class="menuSettingBlockValue menuCountColumnsValue" setting="gridNoDesctop" type="mobile-l">
					<div class="menuSettingButValue menuSettingOptionColumn" row="1" value="1" chosen="true"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="2" value="2"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="3" value="3"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="4" value="4"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="5" value="5"><span is-image="true"></span></div>
					<!-- <div class="menuSettingButValue menuSettingOptionColumn menuBetterThreeColumn" value=""><span is-image="true"></span></div> -->
				</div>

			</div>
			<div class="clear"></div>
		</div>
		
		<div class="menuStyleItem menuGridMobileV" >
			<div class="menuStyleItemLabel menuLabelGrid">
				<img src="/img/editor/screen/mobile_v.png" alt="" class="gridLabelImg"> 
				<span>
					<?php echo Resource::$setting_grid_label_mp; ?>
				</span>
				<div class="clear"></div>
			</div> 
			<div class="menuStyleItemValue">
				<div class="menuSettingBlockValue menuCountColumnsValue" setting="gridNoDesctop" type="mobile-p">
					<div class="menuSettingButValue menuSettingOptionColumn" row="1" value="1" chosen="true"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="2" value="2"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="3" value="3"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="4" value="4"><span is-image="true"></span></div>
					<div class="menuSettingButValue menuSettingOptionColumn" row="5" value="5"><span is-image="true"></span></div>
					<!-- <div class="menuSettingButValue menuSettingOptionColumn menuBetterThreeColumn" value=""><span is-image="true"></span></div> -->
				</div>

			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<!-- ############################################################################################# -->
<!-- ############################################################################################# -->
<!-- клик по элементу -->
<div class="menuOneStyle menuSettingClick">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_click_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_click_label_action; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="select valueTypeActionClick">
					<div class="selectBlockButton">
						<input type="button" value="<?php echo Resource::$setting_click_action_page; ?>" setting="clickActionType" status="false">
						<div class="selectButtonArrow">
							<span is-image="true"></span>
						</div>
					</div>
					<div class="optionBlock">
						<div class="option" value="none"><?php echo Resource::$setting_click_action_none; ?></div>
						<div class="optionLabel"><?php echo Resource::$setting_click_action_group_general; ?></div>
						<div class="option" value="page"><?php echo Resource::$setting_click_action_page; ?></div>
						<div class="option" value="section"><?php echo Resource::$setting_click_action_section; ?></div>
						<div class="option" value="modal"><?php echo Resource::$setting_click_action_modal; ?></div>
						<div class="option" value="link"><?php echo Resource::$setting_click_action_link; ?></div>
						<div class="option" value="contact"><?php echo Resource::$setting_click_action_contact; ?></div>
						
						<div class="optionLabel"><?php echo Resource::$setting_click_action_group_widget; ?></div>
						<div class="option" value="slider"><?php echo Resource::$setting_click_action_slider; ?></div>
						<div class="option" value="tabs"><?php echo Resource::$setting_click_action_tab; ?></div>
						
						<div class="optionLabel"><?php echo Resource::$setting_click_action_group_other; ?></div>
						<div class="option" value="download"><?php echo Resource::$setting_click_action_download; ?></div>
						<div class="option" value="modal-close"><?php echo Resource::$setting_click_action_closemodal; ?></div>
						<div class="option" value="menu-close"><?php echo Resource::$setting_click_action_closemenu; ?></div>
					</div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuTypeClickBlock" type="none">
		</div>
		<div class="menuTypeClickBlock" type="link">
			<div class="menuStyleItem ">
				<div class="menuStyleItemRow" >
					<div class="menuStyleItemLabel">
						URL
					</div>
					<div class="menuStyleItemValue">
						<textarea type="text" class="valueLink" setting="clickLickUrl" value=""></textarea>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow" >
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_click_label_link_open; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="select valueLinkOpen">
							<div class="selectBlockButton">
								<input type="button" value="В том же окне" setting="clickLinkTarget" status="false">
								<div class="selectButtonArrow">
									<span is-image="true"></span>
								</div>
							</div>
							<div class="optionBlock">
								<div class="option" value="_self"><?php echo Resource::$setting_click_link_open_self; ?></div>
								<div class="option" value="_blank"><?php echo Resource::$setting_click_link_open_blank; ?></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>	
			</div>
		</div>
		<div class="menuTypeClickBlock" type="modal">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_label_modal; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueModal" type="modal">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="clickModal" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_click_action_none; ?></div>
							<div class="option" value="_self">modal1</div>
							<div class="option" value="_blank">modal2</div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_modal_nameform; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSettingClickModalFormname" setting="clickModalFormname">
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="menuTypeClickBlock" type="page">
			<div class="menuStyleItem" >
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_click_label_page; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="select valuePage" type="page">
							<div class="selectBlockButton">
								<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="clickValue" status="false">
								<div class="selectButtonArrow">
									<span is-image="true"></span>
								</div>
							</div>
							<div class="optionBlock">
								<div class="option" value="none"><?php echo Resource::$setting_click_action_none; ?></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_click_label_link_open; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="select valueLinkOpen">
							<div class="selectBlockButton">
								<input type="button" value="В том же окне" setting="clickLinkTarget" status="false">
								<div class="selectButtonArrow">
									<span is-image="true"></span>
								</div>
							</div>
							<div class="optionBlock">
								<div class="option" value="_self"><?php echo Resource::$setting_click_link_open_self; ?></div>
								<div class="option" value="_blank"><?php echo Resource::$setting_click_link_open_blank; ?></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>	
			</div>
		</div>
		<div class="menuTypeClickBlock" type="section">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_label_section; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueSection" type="section">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="clickValue" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_click_action_none; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<!-- contact -->
		<div class="menuTypeClickBlock" type="contact">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_contact_label_type; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectClickCotactType">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$setting_click_contact_option_phone; ?>" setting="clickContactType" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="tel"><?php echo Resource::$setting_click_contact_option_phone; ?></div>
							<div class="option" value="whatsapp">WhatsApp</div>
							<div class="option" value="skype">Skype</div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_contact_label_value; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueClickContactValue" setting="clickContactValue">
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<!-- download -->
		<div class="menuTypeClickBlock" type="download">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_label_downfile; ?>
				</div>
				<div class="menuStyleItemValue">
					<?php echo Resource::$setting_click_downfile_value_desc; ?>
					<input type="text" setting="clickDownloadFile" class="valueClickDownloadFile">
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<!-- виджеты -->
		<div class="menuTypeClickBlock" type="slider">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_action_slider; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueClickSlider" type="slider">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="clickValue" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="prev"><?php echo Resource::$setting_click_action_slider_next; ?></div>
							<div class="option" value="next"><?php echo Resource::$setting_click_action_slider_prev; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="menuTypeClickBlock" type="tabs">
			
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_action_tab; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueClickTabs" type="tabs">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="clickValue" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_click_tab_label_event; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectTabsEvent">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$setting_click_tab_event_click; ?>" setting="clickTabsEvent" class="valueTabsEvent" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="hlp_click"><?php echo Resource::$setting_click_tab_event_click; ?></div>
							<div class="option" value="hlp_mouseover"><?php echo Resource::$setting_click_tab_event_mouseover; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>

			<!-- dynamic -->
			<div class="menuStyleItem" >
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel" style="width:90%;">
						Динамическое значение
					</div>
					<div class="menuStyleItemValue">
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						Имя
					</div>
					<div class="menuStyleItemValue">
						<div class="select selectTabsButtonDynamicId">
							<div class="selectBlockButton">
								<input type="button" value="" setting="clickTabsButtonDynamicId" class="valueButtonDynamicId" status="false">
								<div class="selectButtonArrow">
									<span is-image="true"></span>
								</div>
							</div>
							<div class="optionBlock">
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						Значение
					</div>
					<div class="menuStyleItemValue">
						<input type="text" setting="clickTabsButtonDynamicValue" class="valueButtonDynamicValue">
					</div>
					<div class="clear"></div>
				</div>
					
				<div class="clear"></div>
			</div>

		</div>
	</div>
</div>
<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- seo -->
<div class="menuOneStyle menuSettingSEO">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		SEO
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_seo_label_heading; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueSEOTitle" setting="seoTitle" value="">
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<!-- ######################################################################################### -->
<!-- заголовок -->
<div class="menuOneStyle menuSettingHeading">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_heading_level_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuBlockValue blockValueHeading" setting="heading">
				<div class="menuButValue menuSettingButValue menuButHeading" value="h1"><span class="text">h1</span></div>
				<div class="menuButValue menuSettingButValue menuButHeading" value="h2"><span class="text">h2</span></div>
				<div class="menuButValue menuSettingButValue menuButHeading" value="h3"><span class="text">h3</span></div>
				<div class="menuButValue menuSettingButValue menuButHeading" value="h4"><span class="text">h4</span></div>
				<div class="menuButValue menuSettingButValue menuButHeading" value="h5"><span class="text">h5</span></div>
				<div class="menuButValue menuSettingButValue menuButHeading" value="h6"><span class="text">h6</span></div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>

<!-- ######################################################################################### -->
<!-- секция -->
<div class="menuOneStyle menuSettingSection">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_section_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_section_label_fixed; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm blockValueSection" setting="section">
					<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
					<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>

<!-- #################################################################################################### -->
<!-- элементы формы -->
<div class="menuOneStyle menuSettingFormInput">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_form_input_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem settingFormName" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_input_label_name; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueInputName" only-eng="true" setting="formInputName">
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem settingFormInputType" >
			<div class="menuStyleItemLabel">
				Type
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm valueInputType" setting="formInputTypeSelf">
					<div class="menuButValue menuButValueText" value="text">text</div>
					<div class="menuButValue menuButValueText" value="hlp-hidden" chosen="true">hidden</div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="settingFormInputTypeBlock settingFormInputTypeHidden">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					Value
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueInputValue" setting="formInputValue">
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="settingFormInputTypeBlock settingFormInputTypeText">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_input_label_placehoder; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueInputPlaceholder" setting="formInputPlaceholder">
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuStyleInputMask" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_input_label_mask; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select">
						<div class="selectBlockButton">
							<input type="button" class="valueInputTypeMask" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="formInputType" status="false" >
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_form_input_mask_none; ?></div>
							<div class="option" value="name"><?php echo Resource::$setting_form_input_mask_name; ?></div>
							<div class="option" value="email"><?php echo Resource::$setting_form_input_mask_email; ?></div>
							<div class="option" value="phone"><?php echo Resource::$setting_form_input_mask_phone; ?></div>
							<div class="option" value="addr"><?php echo Resource::$setting_form_input_mask_addr; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_input_label_mandatory; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueInputRequired" setting="formInputRequired">
						<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes" chosen="true"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- динамическое поле -->
<div class="menuOneStyle menuSettingFormInput">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		Динамическое значение
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				Включить
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm valueInputDynamicStatus" setting="formInputDynamicStatus">
					<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
					<div class="menuButValue menuButValueText" value="yes" chosen="true"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				Имя
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm" setting="">
					<input type="text" class="valueInputDynamicName" setting="formInputDynamicName">
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>

<!-- элементы формы -->
<div class="menuOneStyle menuSettingFormCheckbox">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_form_input_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem settingFormName" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_input_label_name; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueInputName" only-eng="true" setting="formInputName">
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				Value
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueInputValue" setting="formInputValue">
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				Отмечен
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm valueCheckboxChecked" setting="formCheckboxChecked">
					<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
					<div class="menuButValue menuButValueText" value="yes" chosen="true"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_input_label_mandatory; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm valueInputRequired" setting="formInputRequired">
					<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
					<div class="menuButValue menuButValueText" value="yes" chosen="true"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>

<!-- элементы формы загрузка файла-->
<div class="menuOneStyle menuSettingFormFile">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_form_input_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_input_label_mandatory; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuBlockValue menuBlockValueTwoElm valueInputRequired" setting="formInputRequired">
					<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$setting_grid_but_value_no; ?></div>
					<div class="menuButValue menuButValueText" value="yes" chosen="true"><?php echo Resource::$setting_grid_but_value_yes; ?></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>

<!-- элементы формы -->
<div class="menuOneStyle menuSettingFormSelect">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_form_input_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem settingFormName" >
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_input_label_name; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueInputName" only-eng="true" setting="formInputName">
			</div>
			<div class="clear"></div>
		</div>
		<div class="settingFormInputTypeBlock">
			<!-- <div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					Value
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueInputValue" setting="formInputValue">
				</div>
				<div class="clear"></div>
			</div> -->
			<!--  -->
			<div class="menuStyleItem">
				<div class="menuListBgBlock" data-type="form-option">
					<div class="listBgTop">
						<div class="bgTopLabel">
							<?php echo Resource::$setting_form_input_list_option; ?>
						</div>
						<div class="bgTopButAdd butAddBg">
							<?php echo Resource::$setting_form_input_option_add; ?>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuBgItemNone butAddBg">
						<?php echo Resource::$setting_form_input_option_add_full; ?>
					</div>
					<div class="menuListBg"></div>
				</div>
			</div>
			<div class="menuStyleModal" data-type="form-option" data-item-name="option-name">
				<div class="menuStyleModalTop">
					<div class="menuStyleModalTitle">
						Option
					</div>
					<img src="/img/editor/delete-white-2.png" class="menuStyleModalExit" alt="">
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_form_input_option_value; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueSettingFormOptionValue" data-list-attr="option-value" setting="formSelectOption" only-eng="true">
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_form_input_option_name; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueSettingFormOptionName" data-list-attr="option-name" setting="formSelectOption">
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!--  -->

		</div>
	</div>
</div>
<!-- ########################################################################################## -->
<!-- параметры формы и submit -->
<div class="menuOneStyle menuSettingForm">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$setting_form_title; ?>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem settingSubmitText">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_label_button; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueSubmitText" setting="formSubmitText">
			</div>
			<div class="clear"></div>
		</div>
		
		<div class="menuStyleItem settingFormName">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$setting_form_label_name; ?>
			</div>
			<div class="menuStyleItemValue">
				<input type="text" class="valueFormName" setting="formFormName">
			</div>
			<div class="clear"></div>
		</div>

		<div class="menuStyleItem settingFormSelf">
			<div class="menuStyleItemRow settingFormAction">
				<div class="menuStyleItemLabel">
					Action
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueFormAction" setting="formFormAction" placeholder="(Hollpee по умолчанию)">
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow settingFormMethod">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_label_method; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm valueFormMethod" setting="formFormMethod">
						<div class="menuButValue menuButValueText" value="get">GET</div>
						<div class="menuButValue menuButValueText" value="post">POST</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>

		<div class="menuStyleItem settingFormRedirect">
			<div class="menuStyleItemRow">
				<div class="menuStyleItemLabel" style="width:100%;">
					<?php echo Resource::$setting_form_label_redirect; ?>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_label_type; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueTypeFormRedirect">
						<div class="selectBlockButton">
							<input type="button" value="Страница" setting="formRedirectType" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="page"><?php echo Resource::$setting_form_redirect_page; ?></div>
							<div class="option" value="modal"><?php echo Resource::$setting_form_redirect_modal; ?></div>
							<div class="option" value="link"><?php echo Resource::$setting_form_redirect_link; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow settingFormRedirectItem" type="page">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_redirect_page; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueFormRedirect valuePageFormRedirect">
						<div class="selectBlockButton">
							<input type="button" value="Страница" setting="formFormRedirectElm" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_form_value_none; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow settingFormRedirectItem" type="modal">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_redirect_modal; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select valueFormRedirect valueFormRedirectModal" type="modal">
						<div class="selectBlockButton">
							<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" setting="formFormRedirectElm" status="false">
							<div class="selectButtonArrow">
								<span is-image="true"></span>
							</div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_form_value_none; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow settingFormRedirectItem" type="link">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_form_redirect_link; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueFormRedirect" setting="formFormRedirectLink">
				</div>
				<div class="clear"></div>
			</div>			
		</div>
	</div>
</div>


<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- ############################################################################################# -->
<!-- для виджета -->
<div class="menuWidget">
	<?php require_once $_SERVER['DOCUMENT_ROOT']."/application/views/editor/menu_right_widget.php" ?>
</div>

<!-- ######################################################################################### -->
<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- triger -->

<div class="menuSettingTrigerWrap">
	<div class="menuOneStyle menuSettingTriger">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$setting_title_triger; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_triger_event; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectSettingTrigerEvent">
						<div class="selectBlockButton">
							<input type="button" class="valueSettingTrigerEvent" value="<?php echo Resource::$setting_triger_event_default; ?>" setting="trigerEvent" status="false" >
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none"><?php echo Resource::$setting_triger_event_default; ?></div>
							<div class="option" value="videotimer"><?php echo Resource::$setting_triger_event_videotimer; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleBlockType menuStyleBlockTriger" data-type="none">
			</div>
			<div class="menuStyleBlockType menuStyleBlockTriger" data-type="videotimer">
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_triger_event_videotimer_label_time; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueTrigerVideotimerTime" setting="trigerVideotimerTime">
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_triger_event_videotimer_label_display; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="menuBlockValue menuBlockValueTwoElm valueTrigerVideotimerHide" setting="trigerVideotimerHide">
							<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$value_no; ?></div>
							<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$value_yes; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
		
			<div class="menuStyleBlockType menuStyleBlockTriger" data-type="modal_timer">
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						Показывать
					</div>
					<div class="menuStyleItemValue">
						<div class="menuBlockValue menuBlockValueTwoElm valueTrigerModalTimerStatus" setting="trigerModalTimerStatus">
							<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$value_no; ?></div>
							<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$value_yes; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						Время (сек.)
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueTrigerModalTimerTime" setting="trigerModalTimerTime">
					</div>
					<div class="clear"></div>
				</div>
			</div>

			<div class="menuStyleBlockType menuStyleBlockTriger" data-type="modal_scroll">
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						Модальное
					</div>
					<div class="menuStyleItemValue">
						<div class="select selectSettingTrigerModalScroll">
							<div class="selectBlockButton">
								<input type="button" class="valueSettingTrigerModalScroll" value="<?php echo Resource::$setting_triger_event_default; ?>" setting="trigerModalScroll" status="false" >
								<div class="selectButtonArrow"><span is-image="true"></span></div>
							</div>
							<div class="optionBlock">
								<div class="option" value="none"><?php echo Resource::$setting_triger_event_default; ?></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>

		</div>
	</div>
</div>
	
<!-- ######################################################################################### -->
<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- атрибуты -->
<div class="menuSettingAttrWrap">
	<div class="menuOneStyle menuSettingGeneral menuSettingAttr">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$setting_attr_title; ?>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					Id
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSettingGeneralElmId" setting="generalElmId" value="" only-eng="true">
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuListBgBlock" data-type="class">
					<div class="listBgTop">
						<div class="bgTopLabel">
							<?php echo Resource::$setting_attr_label_class; ?>
						</div>
						<div class="bgTopButAdd butAddBg">
							<?php echo Resource::$but_add; ?>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuBgItemNone butAddBg">
						<?php echo Resource::$setting_attr_class_add; ?>
					</div>
					<div class="menuListBg"></div>
				</div>
			</div>
			<div class="menuStyleModal" data-type="class" data-item-name="attr-class">
				<div class="menuStyleModalTop">
					<div class="menuStyleModalTitle">
						<?php echo Resource::$setting_attr_class_modal_title; ?>
					</div>
					<img src="/img/editor/delete-white-2.png" class="menuStyleModalExit" alt="">
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_attr_label_class; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueSettingGenAttrClass" data-list-attr="attr-class" setting="generalElmAttr" only-eng="true">
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!-- ######################################  -->
			<div class="menuStyleItem">
				<div class="menuListBgBlock" data-type="attr">
					<div class="listBgTop">
						<div class="bgTopLabel">
							<?php echo Resource::$setting_attr_label_attr; ?>
						</div>
						<div class="bgTopButAdd butAddBg">
							<?php echo Resource::$but_add; ?>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuBgItemNone butAddBg">
						<?php echo Resource::$setting_attr_attr_add; ?>
					</div>
					<div class="menuListBg"></div>
				</div>
			</div>
			<div class="menuStyleModal" data-type="attr" data-item-name="attr-key">
				<div class="menuStyleModalTop">
					<div class="menuStyleModalTitle">
						<?php echo Resource::$setting_attr_attr_modal_title; ?>
					</div>
					<img src="/img/editor/delete-white-2.png" class="menuStyleModalExit" alt="">
				</div>
				<div class="menuStyleItem menuStyleItemGenAttrKey">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_attr_attr_modal_name; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueSettingGenAttrKey" data-list-attr="attr-key" setting="generalElmAttr" only-eng="true">
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_attr_attr_modal_key; ?>
					</div>
					<div class="menuStyleItemValue">
						<input type="text" class="valueSettingGenAttrValue" data-list-attr="attr-value" setting="generalElmAttr">
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!-- ######################################  -->
		</div>
	</div>
</div>


<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<!-- yandex goal -->
<div class="menuSettingAttrWrap">
	<div class="menuOneStyle menuSettingGeneral menuSettingYaGoal">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$setting_yagoal_title; ?>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_yagoal_label_counterid; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSettingGeneralYaCounterId" setting="generalYaCounterId" value="" only-eng="true">
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem" >
				<div class="menuStyleItemLabel">
					<?php echo Resource::$setting_yagoal_title_eventid; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" class="valueSettingGeneralYaEventId" setting="generalYaEventId" value="" only-eng="true">
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################# -->
<!-- ######################################################################################### -->
<div class="menuSettingExportWrap">
	<div class="menuOneStyle menuSettingExport">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			Экспорт
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem">
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_export_code_label_status; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="menuBlockValue menuBlockValueTwoElm valueSettingExportCodeStatus" setting="generalExportCodeStatus">
							<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$value_no; ?></div>
							<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$value_yes; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_export_label_code_position; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="select selectExportCodePosition">
							<div class="selectBlockButton">
								<input type="button" value="<?php echo Resource::$setting_export_code_position_insert; ?>" setting="generalExportCodePosition" status="false">
								<div class="selectButtonArrow"><span is-image="true"></span></div>
							</div>
							<div class="optionBlock" style="display: none;">
								<div class="option" value="replace"><?php echo Resource::$setting_export_code_position_replace; ?></div>
								<div class="option" value="insert" chosen="true"><?php echo Resource::$setting_export_code_position_insert; ?></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$setting_export_label_code_self; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="butMenu butExportCodeEdit"><?php echo Resource::$but_edit; ?></div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
	</div>
</div>

