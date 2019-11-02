<!-- затемнение -->
<div class="menuStyleBlackout"></div>

<!-- ######################################################################################## -->
<!-- геометрия --> 
<div class="menuGeometryWrap">
	<div class="menuOneStyle menuGeometry">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$panel_style_title_geometry; ?>
			<div class="butResetStyle" type="geometry">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem menuPositionType">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_geometry_label_state; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectGeometryPosition">
						<div class="selectBlockButton">
							<input type="button" value="Статическое" css="geometryPositionType" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="static"><?php echo Resource::$panel_style_geometry_state_static; ?></div>
							<div class="option" value="absolute"><?php echo Resource::$panel_style_geometry_state_absolute; ?></div>
							<div class="option" value="fixed">Фиксированое</div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuPosition">
				<div class="menuStyleItemLabelBlock">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_geometry_label_position; ?>
					</div>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuPositionSideBlock">
						<div class="menuPositionSideRow">
							<div class="menuPositionSide" value="t-l" css="geometryPositionSide" chosen="true" label="Позиция<br/>ввверх-слево" pos="bottom">
								<div class="menuPositionSidePoint" side="t-l"></div>
							</div>
							<div class="menuPositionSide" value="t-r" css="geometryPositionSide" label="Позиция<br/>ввверх-справо" pos="bottom">
								<div class="menuPositionSidePoint" side="t-r"></div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuPositionSideRow">
							<div class="menuPositionSide" value="b-l" css="geometryPositionSide" label="Позиция<br/>снизу-слево" pos="bottom">
								<div class="menuPositionSidePoint" side="b-l"></div>
							</div>
							<div class="menuPositionSide" value="b-r" css="geometryPositionSide" label="Позиция<br/>снизу-справо" pos="bottom">
								<div class="menuPositionSidePoint" side="b-r"></div>
							</div>
							<div class="clear"></div>
						</div>
					</div>

					<div class="menuPositionContent">
						<div class="menuOneParam" side="top">
							<div class="menuOneParamName">
								<?php echo Resource::$panel_style_geometry_label_pos_top; ?>
							</div>
							<div class="menuOneParamValue">
								<div class="inputBlock">
									<input class="valuePositionTop" type="text"  no-negative="true" minval="1000" value="0" css="geometryPositionTop">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="px">px</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="px">px</div>
											<div class="inputUnitItem" value="%">%</div>
											<div class="inputUnitItem" value="vh">vh</div>
											<div class="inputUnitItem" value="vw">vw</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuOneParam" side="bottom">
							<div class="menuOneParamName">
								<?php echo Resource::$panel_style_geometry_label_pos_bottom; ?>
							</div>
							<div class="menuOneParamValue">
								<div class="inputBlock">
									<input class="valuePositionBottom" type="text"  no-negative="true" minval="1000" value="0" css="geometryPositionBottom">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="px">px</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="px">px</div>
											<div class="inputUnitItem" value="%">%</div>
											<div class="inputUnitItem" value="vh">vh</div>
											<div class="inputUnitItem" value="vw">vw</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuOneParam" side="left">
							<div class="menuOneParamName">
								<?php echo Resource::$panel_style_geometry_label_pos_left; ?>
							</div>
							<div class="menuOneParamValue">
								<div class="inputBlock">
									<input class="valuePositionLeft" type="text"  no-negative="true" minval="1000" value="0" css="geometryPositionLeft">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="%">%</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="px">px</div>
											<div class="inputUnitItem" value="%">%</div>
											<div class="inputUnitItem" value="vh">vh</div>
											<div class="inputUnitItem" value="vw">vw</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuOneParam" side="right">
							<div class="menuOneParamName">
								<?php echo Resource::$panel_style_geometry_label_pos_right; ?>
							</div>
							<div class="menuOneParamValue">
								<div class="inputBlock">
									<input class="valuePositionRight" type="text"  no-negative="true" minval="1000" value="0" css="geometryPositionRight">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="%">%</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="px">px</div>
											<div class="inputUnitItem" value="%">%</div>
											<div class="inputUnitItem" value="vh">vh</div>
											<div class="inputUnitItem" value="vw">vw</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
				<div class="menuStyleItemRow menuStyleItemFullHeight">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_geometry_label_full_height; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="menuBlockValue menuBlockValueTwoElm valuePosAbsoluteFullHeight" css="geometryAbsoluteFullHeight">
							<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
							<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="menuStyleItem menuPositionPanel">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_geometry_label_mobpanel_side; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm" css="geometryPositionPanel">
						<div class="menuButValue menuButValueText butGeometryPositionPanel" value="left"><?php echo Resource::$panel_style_geometry_mobpanel_side_left; ?></div>
						<div class="menuButValue menuButValueText butGeometryPositionPanel" value="right"><?php echo Resource::$panel_style_geometry_mobpanel_side_right; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuProportion">
				<div class="menuProportionContent">
					<div class="menuOneParam menuWidth">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_width; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock" data-style="width">
								<div class="menuPropertyNoActivite" label="Не активный" ></div>
								<input type="text" class="valueWidth" value="0" css="geometryWidth">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem menuWidthUnitPersent" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
										<div class="inputUnitItem" value="auto">auto</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					
					<div class="menuOneParam menuMinHeight">
						<div class="menuOneParamName">
							Min <br/><?php echo Resource::$panel_style_geometry_label_height; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock" data-style="min-height">
								<div class="menuPropertyNoActivite" label="Не активный" ></div>
								<input type="text" class="valueMinHeight" value="0" css="geometryMinHeight" data-css-type="min-height">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="auto">-</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
										<div class="inputUnitItem" value="auto">auto</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="clear"></div>
					<div class="menuGeometryPropertyExtended" data-type="general">
						<div class="menuGeometryPropertyExtendedBut" data-type="extended">
							<?php echo Resource::$panel_style_geometry_show_ext_setting; ?>
						</div>
						<div class="menuGeometryPropertyExtendedBut" data-type="general">
							<?php echo Resource::$panel_style_geometry_hide_ext_setting; ?>
						</div>
						<div class="clear"></div>
						<div class="menuGeometryPropertyExtendedContent">
							<div class="menuStyleItemRow">
								<div class="menuOneParam menuMinWidth">
									<div class="menuOneParamName">
										Min <br><?php echo Resource::$panel_style_geometry_label_width; ?>
									</div>
									<div class="menuOneParamValue">
										<div class="inputBlock" data-style="min-width">
											<div class="menuPropertyNoActivite" label="Не активный" ></div>
											<input type="text" class="valueMinWidth" value="0" css="geometryProportionExtend" data-css-type="min-width">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="px">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="px">px</div>
													<div class="inputUnitItem" value="%">%</div>
													<div class="inputUnitItem" value="vh">vh</div>
													<div class="inputUnitItem" value="vw">vw</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="menuOneParam menuHeight">
									<div class="menuOneParamName">
										<?php echo Resource::$panel_style_geometry_label_height; ?>
									</div>
									<div class="menuOneParamValue">
										<div class="inputBlock" data-style="height">
											<div class="menuPropertyNoActivite" label="Не активный" ></div>
											<input type="text" class="valueHeight" value="0" css="geometryProportionExtend" data-css-type="height">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="px">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="px">px</div>
													<div class="inputUnitItem" value="%">%</div>
													<div class="inputUnitItem" value="vh">vh</div>
													<div class="inputUnitItem" value="vw">vw</div>
													<div class="inputUnitItem" value="auto">auto</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			

			<div class="menuStyleItem menuMargin">
				<div class="menuStyleItemLabel menuLabelFullWidth">
					<?php echo Resource::$panel_style_geometry_label_margin; ?>
				</div>
				<div class="menuPositionContent menuMarginV">
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_top; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginTop" no-negative="true" minval="1000" type="text" value="0"  css="geometryMarginTop">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_bottom; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginBottom" no-negative="true" minval="1000" type="text" value="0" css="geometryMarginBottom">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuPositionContent menuMarginH">
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_left; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginLeft" no-negative="true" minval="1000" type="text" value="0" css="geometryMarginLeft">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_right; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginRight" no-negative="true" minval="1000" type="text" value="0"  css="geometryMarginRight">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
			</div>

			<div class="menuStyleItem menuMarginVSite">
				<div class="menuStyleItemLabel" style="width:100%;margin-bottom:8px;">
					Внешний отступ для секции
				</div>
				<div class="menuPositionContent menuMarginV">
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_top; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginTop" no-negative="true" minval="1000" type="text" value="0"  css="geometryMarginTop">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_bottom; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valueMarginBottom" no-negative="true" minval="1000" type="text" value="0" css="geometryMarginBottom">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>

			<div class="menuStyleItem menuPositionAlign menuAlign">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_geometry_label_align; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue" css="geometryPositionAlign">
						<div class="menuButValue butGeometryAlign" value="left"><span is-image="true"></span></div>
						<div class="menuButValue butGeometryAlign" value="center"><span is-image="true"></span></div>
						<div class="menuButValue butGeometryAlign" value="right"><span is-image="true"></span></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			
			<div class="menuStyleItem menuFloatSide">
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_geometry_label_float; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="menuBlockValue menuBlockValueTwoElm" css="geometryFloatSide">
							<div class="menuButValue menuButValueText butGeometryFloatSide" value="left"><?php echo Resource::$panel_style_geometry_label_pos_left; ?></div>
							<div class="menuButValue menuButValueText butGeometryFloatSide" value="right"><?php echo Resource::$panel_style_geometry_label_pos_right; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="menuStyleItem menuPadding">
				<div class="menuStyleItemLabel menuLabelFullWidth">
					<?php echo Resource::$panel_style_geometry_label_padding; ?>
				</div>
				<div class="menuPositionContent menuPaddingV">
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_top; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valuePaddingTop" type="text" value="0"  css="geometryPaddingTop">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_bottom; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valuePaddingBottom" type="text" value="0" css="geometryPaddingBottom">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuPositionContent menuPaddingH">
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_left; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valuePaddingLeft" type="text" value="0" css="geometryPaddingLeft">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuOneParam">
						<div class="menuOneParamName">
							<?php echo Resource::$panel_style_geometry_label_pos_right; ?>
						</div>
						<div class="menuOneParamValue">
							<div class="inputBlock">
								<input class="valuePaddingRight" type="text" value="0"  css="geometryPaddingRight">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="vh">vh</div>
										<div class="inputUnitItem" value="vw">vw</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
			</div>

			<div class="menuStyleItem menuFloat">
				<div class="menuStyleItemLabel">
					Float
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue valueGeometryFloat" css="geometryFloat">
						<div class="menuButValue menuButValueText" value="none">Нет</div>
						<div class="menuButValue menuButValueText" value="left"><?php echo Resource::$panel_style_geometry_label_pos_left; ?></div>
						<div class="menuButValue menuButValueText" value="right"><?php echo Resource::$panel_style_geometry_label_pos_right; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
				
		</div>
	</div>
</div>
<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- список -->
<div class="menuStyleListWrap">
	<div class="menuOneStyle menuStyleList">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">-</span>
			<?php echo Resource::$panel_style_title_list; ?>
		</div>
		<div class="menuStyleBlock">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_list_label_style; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm menuBlockListStyle" css="listStyle">
						<div class="menuButValue menuButValueText" value="no"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- текст -->
<div class="menuOneStyle menuText">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$panel_style_title_text; ?>
		<div class="butResetStyle" type="text">
			<?php echo Resource::$panel_style_but_clear; ?>
		</div>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem menuSelfText">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_text; ?>
			</div>
			<div class="menuStyleItemValue">
				<textarea class="valueText" css="textSelf"></textarea>
			</div>
			<div class="clear"></div> 
		</div>
		<div class="menuStyleItem menuTextStyle menuTextProperty">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_property; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuStyleItemRow menuStyleTextSize">
					<div class="menuTextItemBlock menuTextItemColor" label="<?php echo Resource::$panel_style_text_label_color; ?>">
						<img src="/img/text/color.png" alt="" class="menuTextItemIcon">
						<input class="colorpickerField butTextColor valueTextColor" is-image="true" css="textColor" type="button" value="" />
					</div>

					<div class="menuTextItemBlock menuTextItemSize" style="float:right;" label="<?php echo Resource::$panel_style_text_label_size; ?>">
						<img src="/img/text/size.png" alt="" class="menuTextItemIcon">
						<div class="inputBlock inputBlockTextSize">
							<input type="text" value="0" status="false" css="textSize" class="valueTextSize">
							<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="clear"></div>

			<div class="menuGeometryPropertyExtended" data-type="general">
				<div class="menuGeometryPropertyExtendedBut" style="margin-right:15px;" data-type="extended">
					<?php echo Resource::$panel_style_geometry_show_ext_setting; ?>
				</div>
				<div class="menuGeometryPropertyExtendedBut" style="margin-right:15px;" data-type="general">
					<?php echo Resource::$panel_style_geometry_hide_ext_setting; ?>
				</div>
				<div class="clear"></div>
				<div class="menuGeometryPropertyExtendedContent">
					<div class="menuStyleItemRow">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_text_label_interval; ?>
						</div>
						<div class="menuStyleItemValue">
							<div class="menuTextItemBlock menuTextItemHeight" label="<?php echo Resource::$panel_style_text_label_height; ?>">
								<img src="/img/text/height-2.png" alt="" class="menuTextItemIcon">
								<div class="inputBlock">
									<input type="text" value="23" maxval="100" css="textLineHeight" class="valueTextLineHeight">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="px">px</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="px">px</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div style="float:right;" class="menuTextItemBlock menuTextItemWidth" label="<?php echo Resource::$panel_style_text_label_width; ?>">
								<img src="/img/text/width.png" alt="" class="menuTextItemIcon">
								<div class="inputBlock inputBlockTextSize">
									<input type="text" value="0" status="false" css="textWidth" class="valueTextWidth">
									<div class="inputUnitBlock">
											<div class="inputUnitCurrent" type="px">px</div>
											<div class="inputUnitList">
												<div class="inputUnitItem" value="px">px</div>
											</div>
										</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>	
					</div>

					<div class="menuStyleItemRow">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_text_label_style; ?>
						</div>
						<div class="menuStyleItemValue">
							<div class="menuBlockValue blockValueText blockValueTextStyle" css="textStyle">
								<div class="menuButValue menuButTextStyle" label="<?php echo Resource::$panel_style_text_style_italic; ?>" value="italic"><span>I</span></div>
								<div class="menuButValue menuButTextStyle" label="<?php echo Resource::$panel_style_text_style_underline; ?>" value="underline" is-decoration="true"><span>U</span></div>
								<div class="menuButValue menuButTextStyle" label="<?php echo Resource::$panel_style_text_style_strike; ?>" value="line-through" is-decoration="true"><span>S</span></div>
							</div>
						</div>
						<div class="clear"></div> 
					</div>
					
					<div class="menuStyleItemRow">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_text_label_register; ?>
						</div>
						<div class="menuStyleItemValue">
							<div class="select selectTextTransform" >
								<div class="selectBlockButton">
									<input type="button" value="<?php echo Resource::$panel_style_geometry_value_no; ?>" css="textTransform" status="false" class="valueTextTransform">
									<div class="selectButtonArrow"><span is-image="true"></span></div>
								</div>
								<div class="optionBlock">
									<div class="option" value="none"><?php echo Resource::$panel_style_text_register_none; ?></div>
									<div class="option" value="uppercase"><?php echo Resource::$panel_style_text_register_uppercase; ?></div>
									<div class="option" value="lowercase"><?php echo Resource::$panel_style_text_register_lowercase; ?></div>
									<div class="option" value="capitalize"><?php echo Resource::$panel_style_text_register_capitalize; ?></div>
								</div>
							</div>
						</div>
						<div class="clear"></div> 
					</div>
					
					<div class="menuStyleItemRow">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_text_label_wordwrap; ?>
						</div>
						<div class="menuStyleItemValue">
							<div class="select selectTextWordWrap" >
								<div class="selectBlockButton">
									<input type="button" value="<?php echo Resource::$panel_style_text_wordwrap_break; ?>" css="textWordWrap" status="false" class="valueTextWordWrap">
									<div class="selectButtonArrow"><span is-image="true"></span></div>
								</div>
								<div class="optionBlock">
									<div class="option" value="normal"><?php echo Resource::$panel_style_text_wordwrap_normal; ?></div>
									<div class="option" value="break-word"><?php echo Resource::$panel_style_text_wordwrap_break; ?></div>
								</div>
							</div>
						</div>
						<div class="clear"></div> 
					</div>
					
					<div class="menuStyleTextBgWrap" style="display:none;">
						<div class="menuStyleItemRow menuStyleTextBg">
							<div class="menuStyleItemLabel">
								<?php echo Resource::$panel_style_text_label_bg; ?>
							</div>
							<div class="menuStyleItemValue">
								<input class="colorpickerField butTextBgColor valueTextBgColor" is-image="true" css="textBg" type="button" value="" />
								<div class="scrollBlock scrollOpacity">
									<div class="scroll ">
										<div class="scrollButton"></div>
									</div>
									<div class="inputBlock">
										<input type="text" value="100" maxval="100" css="textBg" class="valueMenuColorOpacity valueTextBgOpacity">
										<div class="inputUnitBlock">
											<div class="inputUnitCurrent" type="%">%</div>
											<div class="inputUnitList">
												<div class="inputUnitItem" value="%">%</div>
											</div>
										</div>
										<div class="inputAddedElement">
											<div class="inputListArrows">
												<div class="inputArrow inputArrowUp" is-image="true"></div>
												<div class="inputArrow inputArrowDown" is-image="true"></div>
											</div>
										</div>	
									</div>
								</div>
								<div class="clear"></div>
							</div>
							<div class="clear"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="menuStyleItem menuStylePlaceholderColor">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_placeholder; ?>
			</div>
			<div class="menuStyleItemValue">
				<input class="colorpickerField valuePlaceholderColor" is-image="true" css="textPlaceholderColor" type="button" value="" />
				<div class="scrollBlock scrollOpacity">
					<div class="scroll ">
						<div class="scrollButton"></div>
					</div>
					<div class="inputBlock">
						<input type="text" value="100" maxval="100" css="textPlaceholderColor" class="valueMenuColorOpacity">
						<div class="inputUnitBlock">
							<div class="inputUnitCurrent" type="%">%</div>
							<div class="inputUnitList">
								<div class="inputUnitItem" value="%">%</div>
							</div>
						</div>
						<div class="inputAddedElement">
							<div class="inputListArrows">
								<div class="inputArrow inputArrowUp" is-image="true"></div>
								<div class="inputArrow inputArrowDown" is-image="true"></div>
							</div>
						</div>	
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="clear"></div> 
		</div>
		
		<div class="menuStyleItem menuStyleItemTextAlign">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_align; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuTextAlign menuBlockValue blockValueTextAlign" css="textAlign">
					<div class="menuButValue menuButTextAlign" value="left" chosen="true"><span is-image="true"></span></div>
					<div class="menuButValue menuButTextAlign" value="center"><span is-image="true"></span></div>
					<div class="menuButValue menuButTextAlign" value="right"><span is-image="true"></span></div>
					<div class="menuButValue menuButTextAlign" value="justify"><span is-image="true"></span></div>
				</div>
			</div>
			<div class="clear"></div> 
		</div>
			
		<div class="menuStyleItem ">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_weight; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="select selectFontWeight" >
					<div class="selectBlockButton">
						<input type="button" value="" css="textWeight" status="false" class="valueTextWeight">
						<div class="selectButtonArrow"><span is-image="true"></span></div>
					</div>
					<div class="optionBlock">
						<div class="option" value="100" style="font-weight:100;" >Thin 100</div>
						<div class="option" value="200" style="font-weight:200;" >Extra-Light 200</div>
						<div class="option" value="300" style="font-weight:300;" >Light 300</div>
						<div class="option" value="400" style="font-weight:300;">Normal 400</div>
						<div class="option" value="500" style="font-weight:500;">Medium 500</div>
						<div class="option" value="600" style="font-weight:600;">Semi-Bold 600</div>
						<div class="option" value="700" style="font-weight:700;">Bold 700</div>
						<div class="option" value="800" style="font-weight:800;">Extra-Bold 800</div>
						<div class="option" value="900" style="font-weight:900;">Black 900</div>
					</div>
				</div>
			</div>
			<div class="clear"></div> 
		</div>
		<div class="menuStyleItem menuTextFont">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_text_label_font; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="menuStyleItemRow">
					<div class="select butFamily" >
						<div class="selectBlockButton">
							<input type="button" value="Шрифт" css="textFamily" status="false" class="valueTextFamily">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="Arial" style="font-family:Arial" >Arial</div>
							<div class="option" value="Times New Roman" style="font-family:Times New Roman">Times New Roman</div>
							<div class="option" value="Courier" style="font-family:Courier">Courier</div>
							<div class="option" value="Verdana" style="font-family:Verdana">Verdana</div>
							<div class="menuListAddedFont"></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="butAddFont">
						<?php echo Resource::$panel_style_text_but_manager_font; ?>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="clear"></div>
		</div>	
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- bg -->
<div class="menuOneStyle menuBg">  
	<div class="menuStyleName">
		<span class="menuStyleNameButton">-</span>
		<?php echo Resource::$panel_style_bg_title; ?>
		<div class="butResetStyle" type="bg">
			<?php echo Resource::$panel_style_but_clear; ?>
		</div>
	</div>
	<div class="menuStyleBlock">
		<div class="menuStyleItem">
			<div class="menuStyleItemLabel">
				<?php echo Resource::$panel_style_bg_label_type; ?>
			</div>
			<div class="menuStyleItemValue">
				<div class="select selectBgType">
					<div class="selectBlockButton">
						<input type="button" class="valueBgType" value="Стандартный" css="bgType" status="false">
						<div class="selectButtonArrow"><span is-image="true"></span></div>
					</div>
					<div class="optionBlock bgTypeSelect">
						<div class="option" chosen="true" value="image"><?php echo Resource::$panel_style_bg_type_standart; ?></div>
						<div class="option" value="gradient"><?php echo Resource::$panel_style_bg_type_gradient; ?></div>
						<div class="option" value="video"><?php echo Resource::$panel_style_bg_type_video; ?></div>
					</div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
<!-- ############################################################# -->
		<div class="menuBgType menuGradient" type="gradient">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_bg_label_direction; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="valueBgGradientTypeBlock" css="bgGradient">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="top" value="to top">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="bottom" value="to bottom">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="left" value="to left">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="right" value="to right">
						
						<input type="button" class="valueBgGradientType" is-image="true" arrow="top_right" value="to right top">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="top_left" value="to left top">
						<input type="button" class="valueBgGradientType" is-image="true" arrow="bottom_left" value="to left bottom">
						<input type="button" class="valueBgGradientType" is-image="true" chosen="true" arrow="bottom_right" value="to right bottom" />
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemRow menuGradientColor" style="display:none;" type="basic">
					<!-- <div class="menuGradientBlackout"></div> -->
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_bg_label_gradient_basic; ?>
					</div>
					<div class="menuStyleItemValue">
						<input class="colorpickerField valueBgGradientBasic" is-image="true" css="bgGradientBasic" type="button" value="" />
						<div class="scrollBlock scrollOpacity">
							<div class="scroll ">
								<div class="scrollButton"></div>
							</div>
							<div class="inputBlock">
								<input type="text" value="100" maxval="100" css="bgGradientBasic" class="valueMenuColorOpacity valueGradiendBOpacity">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="%">%</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="%">%</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuGradientColor" type="special">
					<div class="gradientColorToggle" style="display:none;" status="special">
						<span  is-image="true"></span>
					</div>
					<div class="menuStyleItemRow">
						<!-- <div class="menuGradientBlackout"></div> -->
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_bg_label_gradient_start; ?>
						</div>
						<div class="menuStyleItemValue">
							<input class="colorpickerField valueBgGradient1" is-image="true" css="bgGradient" type="button" value="" />
							<div class="scrollBlock scrollOpacity">
								<div class="scroll ">
									<div class="scrollButton"></div>
								</div>
								<div class="inputBlock">
									<input type="text" value="100" maxval="100" css="bgGradient" class="valueMenuColorOpacity valueGradiend1Opacity">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="%">%</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="%">%</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuStyleItemRow menuGradientColorEnd">
						<!-- <div class="menuGradientBlackout"></div> -->
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_bg_label_gradient_end; ?>
						</div>
						<div class="menuStyleItemValue">
							<input class="colorpickerField valueBgGradient2" is-image="true" css="bgGradient" type="button" value="" />
							<div class="scrollBlock scrollOpacity">
								<div class="scroll ">
									<div class="scrollButton"></div>
								</div>
								<div class="inputBlock">
									<input type="text" value="100" maxval="100" css="bgGradient" class="valueMenuColorOpacity valueGradiend2Opacity">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="%">%</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="%">%</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
		</div>
		
<!-- ############################################################# -->
		<div class="menuBgType menuBgVideo" type="video">
			<div class="menuStyleItem menuStyleItemVideoSrc">
				<div class="menuStyleItemLabel">
					<!-- Url <br/>Youtube или<br/> Vimeo -->
					Src
				</div>
				<div class="menuStyleItemValue">
					<!-- <textarea class="valueBgVideoSrc" css="bgVideoSrc"></textarea> -->
					<div class="rightMenuBut butEditBgVideoSrc">
						<?php echo Resource::$panel_style_bg_video_but_edit; ?>
					</div>
				</div>
				<div class="clear"></div>
			</div>


			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_bg_label_video_blackout; ?>
				</div>
				<div class="menuStyleItemValue">
					<input class="colorpickerField valueVideoColor" is-image="true" css="bgVideoOpacity" type="button" value="" />
					<div class="scrollBlock scrollOpacity">
						<div class="scroll ">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="100" maxval="100" css="bgVideoOpacity" class="valueMenuColorOpacity valueVideoOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="%">%</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="%">%</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuStyleItemBgVideoParalax">	
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_label_paralax; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue valueBgVideoParalaxStatus menuBlockValueTwoElm" css="bgVideoParalaxStatus">
						<div class="menuButValue menuButValueText" value="no" chosen="true"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
						<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
<!-- ########################################################### -->
		<!-- тип изображение -->
		<div class="menuBgType" type="image">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_bg_label_std_color; ?>
				</div>
				<div class="menuStyleItemValue">
					<input class="colorpickerField butBgColor valueBgColor" is-image="true" css="bgColor" type="button" value="" />
					<div class="scrollBlock scrollOpacity">
						<div class="scroll ">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="100" maxval="100" css="bgOpacity" class="valueMenuColorOpacity valueBgOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="%">%</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="%">%</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			

			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<img src="" style="width:85%;" alt="" class="menuBgImageSelf">
				</div>
				<div class="menuStyleItemValue">
					<div class="valueBgImageBlock">
						<div class="valueBgImageMask"></div>
						<input type="text" class="valueBgImage"  css="bgImage" value="">
						<div class="clear"></div>
					</div>
					<div class="butBgImageBlock">
						<div class="rightMenuBut butBgImage butBgImageChange">
							<?php echo Resource::$panel_style_bg_std_but_edit; ?>
						</div>
						<div class="rightMenuBut butBgImage butBgImageDelete" status="false">
							<?php echo Resource::$panel_style_bg_std_but_delete; ?>
						</div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			

			<div class="menuGeometryPropertyExtended" data-type="general">
				<div class="menuGeometryPropertyExtendedButWrap" data-type="extended">
					<span style="float:left;">Параметры</span>
					<div class="menuGeometryPropertyExtendedBut" data-type="extended">
						Показать
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuGeometryPropertyExtendedButWrap" data-type="general">
					<span style="float:left;">Параметры</span>
					<div class="menuGeometryPropertyExtendedBut" data-type="general">
						Скрыть
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
				<div class="menuGeometryPropertyExtendedContent">
					<div class="menuStyleItem menuBgImgPosition">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_bg_std_label_position; ?>
						</div>
						<div class="menuStyleItemValue">
							
							<div class="valueBgPositionBlock" css="bgPosition">
								<input type="button" class="valueBgPosition" value="top left">
								<input type="button" class="valueBgPosition" value="top center">
								<input type="button" class="valueBgPosition" value="top right">
								<input type="button" class="valueBgPosition" value="center left">
								<input type="button" class="valueBgPosition" value="center">
								<input type="button" class="valueBgPosition" value="center right">
								<input type="button" class="valueBgPosition" value="bottom left">
								<input type="button" class="valueBgPosition" value="bottom center">
								<input type="button" class="valueBgPosition" value="bottom right">
								<div class="clear"></div>
							</div>
							
							
							<div class="menuBgPositionNotStandart">
								<div class="menuOneParam menuBgPositionTop">
									<div class="menuOneParamName">
										<?php echo Resource::$panel_style_bg_std_position_top; ?>
									</div>
									<div class="menuOneParamValue">
										<div class="inputBlock">
											<input class="valueBgPositionTop" type="text" minval="5000" value="0" css="bgPositionSide">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="px">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="px">px</div>
													<div class="inputUnitItem" value="%">%</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
									<div class="clear"></div>
								</div>
								<div class="menuOneParam">
									<div class="menuOneParamName">
										<?php echo Resource::$panel_style_bg_std_position_left; ?>
									</div>
									<div class="menuOneParamValue">
										<div class="inputBlock">
											<input class="valueBgPositionLeft" type="text" minval="5000" value="0" css="bgPositionSide">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="px">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="px">px</div>
													<div class="inputUnitItem" value="%">%</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
									<div class="clear"></div>
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
					
					<div class="menuStyleItem">
						<div class="menuStyleItemLabel" multy-string="true">
							<?php echo Resource::$panel_style_bg_std_label_repeat; ?>
						</div>
						<div class="menuStyleItemValue">
							
							<div class="menuBlockValue blockValueBgRepeat menuBgRepeat" css="bgRepeat">
								<div class="menuButValue" value="repeat" chosen="true"><span is-image="true"></span></div>
								<div class="menuButValue" value="repeat-x"><span is-image="true"></span></div>
								<div class="menuButValue" value="repeat-y"><span is-image="true"></span></div>
								<div class="menuButValue" value="no-repeat" value-none="true"><span is-image="true"></span></div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
					
					<div class="menuStyleItem menuStyleBgSize">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_bg_std_label_size; ?>
						</div>
						<div class="menuStyleItemValue">
							<div class="inputBlock">
								<input type="text" value="50" css="bgSize" class="valueBgImgSize">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="auto">-</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
										<div class="inputUnitItem" value="%">%</div>
										<div class="inputUnitItem" value="auto">auto</div>
										<div class="inputUnitItem" value="full">full</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="clear"></div>
					</div>

					<div class="menuStyleItem menuParalax">
						<div class="menuStyleItemRow">	
							<div class="menuStyleItemLabel">
								<?php echo Resource::$panel_style_label_paralax; ?>
							</div>
							<div class="menuStyleItemValue">
								<div class="menuBlockValue valueBgParalaxStatus menuBlockValueTwoElm" css="bgParalaxStatus">
									<div class="menuButValue menuButValueText" value="no" chosen="true"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
									<div class="menuButValue menuButValueText" value="yes"><?php echo Resource::$panel_style_geometry_value_yes; ?></div>
								</div>
							</div>
							<div class="clear"></div>
						</div>
					</div>
					<div class="menuStyleItem menuStyleBgImgMask">
						<div class="menuStyleItemLabel">
							<?php echo Resource::$panel_style_bg_label_mask; ?>
						</div>
						<div class="menuStyleItemValue">
							<input class="colorpickerField valueBgImgMask" is-image="true" css="bgImageMask" type="button" value="" />
							<div class="scrollBlock scrollOpacity">
								<div class="scroll ">
									<div class="scrollButton"></div>
								</div>
								<div class="inputBlock">
									<input type="text" value="100" maxval="100" css="bgImageMask" class="valueMenuColorOpacity">
									<div class="inputUnitBlock">
										<div class="inputUnitCurrent" type="%">%</div>
										<div class="inputUnitList">
											<div class="inputUnitItem" value="%">%</div>
										</div>
									</div>
									<div class="inputAddedElement">
										<div class="inputListArrows">
											<div class="inputArrow inputArrowUp" is-image="true"></div>
											<div class="inputArrow inputArrowDown" is-image="true"></div>
										</div>
									</div>	
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- border -->
<div class="menuBorderWrap">
	<div class="menuOneStyle menuBorder">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_border_title; ?>
			<div class="butResetStyle" type="border">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;"> 
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_border_label_style; ?>
				</div>
				<div class="menuStyleItemValue menuStyleItemBorderStyle">
					<!-- стороны -->
					<div class="handBorder">
						<div class="menuValueRowSide">
							<div class="checkBox checkBoxBorder handBorderTop menuValueSideTop" side="top">
								<input type="text" class="valueBorderTop" css="borderTop">
								<div class="checkBoxChecked"></div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuValueRowSide menuValueRowSideCenter">
							<div class="checkBox checkBoxBorder handBorderLeft menuValueSideLeft" side="left">
								<input type="text" class="valueBorderLeft" css="borderLeft">
								<div class="checkBoxChecked"></div>
							</div>
							<div class="checkBox checkBoxBorder handBorderRight menuValueSideRight" side="right">
								<input type="text" class="valueBorderRight" css="borderRight">
								<div class="checkBoxChecked"></div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="menuValueRowSide">
							<div class="checkBox checkBoxBorder handBorderBottom menuValueSideBottom" side="bottom">
								<input type="text" class="valueBorderBottom" css="borderBottom">
								<div class="checkBoxChecked"></div>
							</div>
							<div class="clear"></div>
						</div>
					</div>
					<div class="borderStyleLeftBlock">
						<!-- размер -->
						<div class="inputBlock menuValueBorderWidth" label="<?php echo Resource::$panel_style_border_label_width; ?>">
							<input type="text" class="valueBorderSize" value="0" css="borderWidth">
							<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>

						<!-- стиль -->
						<div class="menuBlockValue menuValueBorderStyle" css="borderStyle" label="<?php echo Resource::$panel_style_border_label_style_l; ?>">
							<div class="menuButValue" chosen="true" value="solid"><span is-image="true"></span></div>
							<div class="menuButValue" value="none" value-none="true"><span is-image="true"></span></div>
							<div class="menuButValue" value="dashed"><span is-image="true"></span></div>
							<div class="menuButValue" value="dotted"><span is-image="true"></span></div>
							<!-- <div class="clear"></div> -->
						</div>
						<br/>
						
						<!-- цвет -->
						<!-- <input class="colorpickerField butBorderColor valueBorderColor" label="Цвет рамки" is-image="true" type="button" css="borderColor" value="" /> -->
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_border_label_color; ?>
				</div>
				<div class="menuStyleItemValue">
					<input class="colorpickerField valueBorderColor" is-image="true" css="borderColor" type="button" value="" />
					<div class="scrollBlock scrollOpacity">
						<div class="scroll" style="width:40px;">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="100" maxval="100" css="borderColor" class="valueMenuColorOpacity valueBorderColorOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="%">%</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="%">%</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<!-- все стороны -->
			<div class="menuStyleItem menuBorderRadius menuBorderRadiusAll">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_border_label_radius; ?>
				</div>
				<div class="scrollBlock">
					<div class="borderRariusImg" is-image="true" type="all"></div>
					<div class="scroll">
						<div class="scrollButton"></div>
					</div>
					<div class="inputBlock">
						<input type="text" value ="" maxval="500" css="borderRadiusAll" class="valueBorderRadiusAll">
						<div class="inputUnitBlock">
							<div class="inputUnitCurrent" type="px">px</div>
							<div class="inputUnitList">
								<div class="inputUnitItem" value="px">px</div>
							</div>
						</div>
						<div class="inputAddedElement">
							<div class="inputListArrows">
								<div class="inputArrow inputArrowUp" is-image="true"></div>
								<div class="inputArrow inputArrowDown" is-image="true"></div>
							</div>
						</div>	
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<!-- разные стороны -->
			<div class="menuBlockBorderRadius menuBorderRadius menuBorderRadiusSide">
				<div class="menuStyleItem">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_border_label_radius; ?>
					</div>
					<div class="scrollBlock">
						<div class="borderRariusImg" is-image="true" type="tl"></div>
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value ="" maxval="500" css="borderRadiusTl" class="valueBorderRadiusTl">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="scrollBlock">
						<div class="borderRariusImg" is-image="true" type="tr"></div>
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value ="" maxval="500" css="borderRadiusTr" class="valueBorderRadiusTr">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>	
				<div class="menuStyleItem">
					<div class="scrollBlock">
						<div class="borderRariusImg" is-image="true" type="br"></div>
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value ="" maxval="500" css="borderRadiusBr" class="valueBorderRadiusBr">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItem">
					<div class="scrollBlock">
						<div class="borderRariusImg" is-image="true" type="bl"></div>
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value ="" maxval="500" css="borderRadiusBl" class="valueBorderRadiusBl">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- box-shadow -->
<div class="menuBoxShadowWrap">
	<div class="menuOneStyle menuBoxShadow">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_boxshadow_title; ?>
			<div class="butResetStyle" type="box-shadow">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem menuShadowType">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_type; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue menuBlockValueTwoElm boxShadowType" data-list-attr="boxshadow-type" css="boxShadow" >
						<div class="menuButValue menuButValueText valueShadowType" value="inset">
							<?php echo Resource::$panel_style_boxshadow_type_but_inset; ?>
						</div>
						<div class="menuButValue menuButValueText valueShadowType" value="" chosen="true">
							<?php echo Resource::$panel_style_boxshadow_type_but_outer; ?>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_color; ?>
				</div>
				<div class="menuStyleItemValue">
					<input class="colorpickerField valueShadowColor" is-image="true" css="boxShadow" type="button" value="" />
					
					<div class="scrollBlock scrollOpacity">
						<div class="scroll ">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="100" maxval="100" css="boxShadow" class="valueMenuColorOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="%">%</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="%">%</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>

					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuShadowOffset">
				<div class="menuStyleItemLabel menuShadowOffset">
					<?php echo Resource::$panel_style_boxshadow_label_offset; ?>
				</div>
				<div class="clear"></div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_boxshadow_label_offset_horizontal; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="scrollBlock">
							<div class="scroll">
								<div class="scrollButton"></div>
							</div>
							<div class="inputBlock">
								<input type="text" value ="0" minval="500" maxval="500" css="boxShadow" class="valueShadowOffsetX">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_boxshadow_label_offset_vertical; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="scrollBlock">
							<div class="scroll">
								<div class="scrollButton"></div>
							</div>
							<div class="inputBlock">
								<input type="text" value ="0" minval="500" maxval="500" css="boxShadow" class="valueShadowOffsetY">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_radius; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="scrollBlock">
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="0" maxval="500" css="boxShadow" class="valueShadowRadius">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_width; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="scrollBlock">
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="0" minval="50" maxval="200" css="boxShadow" class="valueShadowWidth">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>	
</div>
<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- text-shadow -->
<div class="menuTextShadowWrap">
	<div class="menuOneStyle menuTextShadow">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_textshadow_title; ?>
			<div class="butResetStyle" type="text-shadow">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_color; ?>
				</div>
				<div class="menuStyleItemValue">
					<input class="colorpickerField valueTextShadowColor" is-image="true" css="textShadow" type="button" value="" />
					<div class="scrollBlock scrollOpacity">
						<div class="scroll ">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="100" maxval="100" css="textShadow" class="valueMenuColorOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="%">%</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="%">%</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="clear"></div>
				</div>
				
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem menuShadowOffset">
				<div class="menuStyleItemLabel menuShadowOffset">
					<?php echo Resource::$panel_style_boxshadow_label_offset; ?>
				</div>
				<div class="clear"></div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_boxshadow_label_offset_horizontal; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="scrollBlock">
							<div class="scroll">
								<div class="scrollButton"></div>
							</div>
							<div class="inputBlock">
								<input type="text" value ="0" minval="250" maxval="250" css="textShadow" class="valueTextShadowOffsetX">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="menuStyleItemRow">
					<div class="menuStyleItemLabel">
						<?php echo Resource::$panel_style_boxshadow_label_offset_vertical; ?>
					</div>
					<div class="menuStyleItemValue">
						<div class="scrollBlock">
							<div class="scroll">
								<div class="scrollButton"></div>
							</div>
							<div class="inputBlock">
								<input type="text" value ="0" minval="250" maxval="250" css="textShadow" class="valueTextShadowOffsetY">
								<div class="inputUnitBlock">
									<div class="inputUnitCurrent" type="px">px</div>
									<div class="inputUnitList">
										<div class="inputUnitItem" value="px">px</div>
									</div>
								</div>
								<div class="inputAddedElement">
									<div class="inputListArrows">
										<div class="inputArrow inputArrowUp" is-image="true"></div>
										<div class="inputArrow inputArrowDown" is-image="true"></div>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_boxshadow_label_radius; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="scrollBlock">
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="0" maxval="30" css="textShadow" class="valueTextShadowRadius">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="px">px</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="px">px</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- анимация -->
<div class="menuOneStyle menuStyleAnimate">
	<div class="menuStyleName">
		<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_animate_title; ?>
		<div class="butResetStyle" type="animate">
			<?php echo Resource::$panel_style_but_clear; ?>
		</div>
	</div>
	<div class="menuStyleBlock" style="display:none;">
		<div class="menuStyleItem">
			<div class="menuStyleItemRow">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_animate_label_event; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectAnimatedEventType">
						<div class="selectBlockButton">
							<input type="button" value="" css="animateEventType" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="scroll" chosen="true"><?php echo Resource::$panel_style_animate_event_scroll; ?></div>
							<div class="option" value="load"><?php echo Resource::$panel_style_animate_event_load; ?></div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow menuRowAnimateLoad">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_animate_event_load; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectAnimatedLoad">
						<div class="selectBlockButton">
							<input type="button" value="Статическое" css="animateLoad" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none" chosen="true"><?php echo Resource::$panel_style_geometry_value_no; ?></div>

							<?php echo $optionsAnimate; ?>

							<div class="optionLabel">Specials</div>
							<div class="option" value="rollIn">rollIn</div>
							<div class="option" value="bounce">bounce</div>
							<div class="option" value="flash">flash</div>
							<div class="option" value="pulse">pulse</div>
							<div class="option" value="rubberBand">rubberBand</div>
							<div class="option" value="shake">shake</div>
							<div class="option" value="swing">swing</div>
							<div class="option" value="tada">tada</div>
							<div class="option" value="wobble">wobble</div>
							<div class="option" value="jello">jello</div>
							<div class="option" value="hinge">hinge</div>

						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow menuRowAnimateScroll">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_animate_event_scroll; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectAnimatedScroll">
						<div class="selectBlockButton">
							<input type="button" value="Статическое" css="animateScroll" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="none" chosen="true"><?php echo Resource::$panel_style_geometry_value_no; ?></div>
							
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

							<div class="optionLabel">Specials</div>
							<div class="option" value="rollIn">rollIn</div>
							<div class="option" value="bounce">bounce</div>
							<div class="option" value="flash">flash</div>
							<div class="option" value="pulse">pulse</div>
							<div class="option" value="rubberBand">rubberBand</div>
							<div class="option" value="shake">shake</div>
							<div class="option" value="swing">swing</div>
							<div class="option" value="tada">tada</div>
							<div class="option" value="wobble">wobble</div>
							<div class="option" value="jello">jello</div>
							<div class="option" value="hinge">hinge</div>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_animate_event_delay; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" only-integer="true" class="valueSettingAnimateDelay" css="animateDelay">
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItemRow">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_animate_event_duration; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" only-integer="true" class="valueSettingAnimateDuration" css="animateDuration">
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- трансформация -->
<div class="menuTransformWrap">
	<div class="menuOneStyle menuTransform">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_transform_title; ?>
			<div class="butResetStyle" type="transform">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_transform_label_opacity; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="scrollBlock">
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value ="0" only-integer="true" maxval="100" css="transformOpacity" class="valueTransformOpacity">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="-">-</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="-">-</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>

			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_transform_label_transition; ?>
				</div>
				<div class="menuStyleItemValue">
					<input type="text" only-integer="true" class="valueTransformTransition" css="transformTransition">
				</div>
				<div class="clear"></div>
			</div>

			<div class="menuStyleItem">
				<div class="menuListBgBlock" data-type="transform">
					<div class="listBgTop">
						<div class="bgTopLabel">
							<?php echo Resource::$panel_style_transform_label; ?>
						</div>
						<div class="bgTopButAdd butAddBg">
							<?php echo Resource::$panel_style_transform_add; ?>
						</div>
						<div class="clear"></div>
					</div>
					<div class="menuBgItemNone butAddBg">
						<?php echo Resource::$panel_style_transform_add_value; ?>
					</div>
					<div class="menuListBg"></div>
				</div>
			</div>
			<div class="menuStyleModal" data-type="transform" data-item-name="attr-key">
				<div class="menuStyleModalTop">
					<div class="menuStyleModalTitle">
						<?php echo Resource::$panel_style_transform_label_property; ?>
					</div>
					<img src="/img/editor/delete-white-2.png" class="menuStyleModalExit" alt="">
				</div>
				<div class="menuTransformList menuStyleItem">
					<div class="menuTransformListTabs">
						<div class="menuTransformTab" data-type="translate" data-chosen="true">Move</div>
						<div class="menuTransformTab" data-type="scale">Scale</div>
						<div class="menuTransformTab" data-type="rotate">Rotate</div>
						<div class="menuTransformTab" data-type="skew">Skew</div>
						<div class="clear"></div>
					</div>
					<div class="menuTransformListBlock" data-type="translate">
						<div class="menuTransformBlock" data-type="translate">
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_hor; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="0" only-integer="true" minval="1500" maxval="1500" css="transform" class="valueTransformHor">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">px</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_ver; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="0" only-integer="true" minval="1500" maxval="1500" css="transform" class="valueTransformVer">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">px</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">px</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
						</div>
						<div class="menuTransformBlock" data-type="scale">
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_hor; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="100" only-integer="true" minval="500" maxval="500" css="transform" class="valueTransformHor">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">-</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">-</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_ver; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="100" only-integer="true" minval="500" maxval="500" css="transform" class="valueTransformVer">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">-</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">-</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
						</div>
						<div class="menuTransformBlock" data-type="rotate">
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_hor; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="0" only-integer="true" minval="960" maxval="960" css="transform" class="valueTransformHor valueTransformHor333">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">-</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">-</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
						</div>
						<div class="menuTransformBlock" data-type="skew">
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_hor; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="0" only-integer="true" minval="80" maxval="80" css="transform" class="valueTransformHor">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">-</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">-</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
							<div class="menuStyleItemRow">
								<div class="menuStyleItemLabel">
									<?php echo Resource::$panel_style_transform_label_ver; ?>
								</div>
								<div class="menuStyleItemValue">
									<div class="scrollBlock">
										<div class="scroll">
											<div class="scrollButton"></div>
										</div>
										<div class="inputBlock">
											<input type="text" value="0" only-integer="true" minval="80" maxval="80" css="transform" class="valueTransformVer">
											<div class="inputUnitBlock">
												<div class="inputUnitCurrent" type="-">-</div>
												<div class="inputUnitList">
													<div class="inputUnitItem" value="-">-</div>
												</div>
											</div>
											<div class="inputAddedElement">
												<div class="inputListArrows">
													<div class="inputArrow inputArrowUp" is-image="true"></div>
													<div class="inputArrow inputArrowDown" is-image="true"></div>
												</div>
											</div>	
										</div>
									</div>
								</div>
								<div class="clear"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- фильтер -->
<div class="menuBoxShadowWrap">
	<div class="menuOneStyle menuFilter">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_filter_title; ?>
			<div class="butResetStyle" type="filter">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_filter_label_type; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectStyleVilterType">
						<div class="selectBlockButton">
							<input type="button" value="" class="valueStyleFilterType" data-list-attr="filter-type" css="filterType" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="blur">blur</div>
							<div class="option" value="grayscale">grayscale</div>
							<div class="option" value="sepia">sepia</div>
							<div class="option" value="contrast">contrast</div>
							<div class="option" value="brightness">brightness</div>
							<div class="option" value="hue-rotate">hue-rotate</div>
							<div class="option" value="saturate">saturate</div>
							<div class="option" value="invert">invert</div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>


			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					<?php echo Resource::$panel_style_filter_label_value; ?>
				</div>
				<div class="menuStyleItemValue">
					<div class="scrollBlock">
						<div class="scroll">
							<div class="scrollButton"></div>
						</div>
						<div class="inputBlock">
							<input type="text" value="0" only-integer="true" maxval="100" data-list-attr="filter-value" css="filter" class="valueStyleFilterValue">
							<div class="inputUnitBlock">
								<div class="inputUnitCurrent" type="-">-</div>
								<div class="inputUnitList">
									<div class="inputUnitItem" value="-">-</div>
								</div>
							</div>
							<div class="inputAddedElement">
								<div class="inputListArrows">
									<div class="inputArrow inputArrowUp" is-image="true"></div>
									<div class="inputArrow inputArrowDown" is-image="true"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>	
</div>


<!-- ############################################################################################ -->
<!-- ############################################################################################ -->
<!-- дополнительно -->
<div class="menuOtherWrap">
	<div class="menuOneStyle menuOther">
		<div class="menuStyleName">
			<span class="menuStyleNameButton">+</span>
			<?php echo Resource::$panel_style_other_title; ?>
			<div class="butResetStyle" type="other">
				<?php echo Resource::$panel_style_but_clear; ?>
			</div>
		</div>
		<div class="menuStyleBlock" style="display:none;">
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					Z-index
				</div>
				<div class="menuStyleItemValue">
					<div class="menuBlockValue zindexExtremum" css="otherZindexExtremum">
						<div class="menuButValue menuButValueText" value="min" pos="left" chosen="true">Min</div>
						<div class="menuButValue menuButValueText" value="max" pos="top">Max</div>
					</div>
					<div class="inputBlock">
						<input type="text" value="0" minval="9999" maxval="9999" css="otherZindex" class="valueZindex">
						<div class="inputAddedElement">
							<div class="inputListArrows">
								<div class="inputArrow inputArrowUp" is-image="true"></div>
								<div class="inputArrow inputArrowDown" is-image="true"></div>
							</div>
						</div>	
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="menuStyleItem">
				<div class="menuStyleItemLabel">
					Overflow
				</div>
				<div class="menuStyleItemValue">
					<div class="select selectStyleOtherOverflow">
						<div class="selectBlockButton">
							<input type="button" value="" class="valueStyleOtherOverflow" css="otherOverflow" status="false">
							<div class="selectButtonArrow"><span is-image="true"></span></div>
						</div>
						<div class="optionBlock">
							<div class="option" value="visible"><?php echo Resource::$panel_style_other_overflow_visible; ?></div>
							<div class="option" value="hidden"><?php echo Resource::$panel_style_other_overflow_hidden; ?></div>
							<div class="option" value="auto"><?php echo Resource::$panel_style_other_overflow_auto; ?></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>

