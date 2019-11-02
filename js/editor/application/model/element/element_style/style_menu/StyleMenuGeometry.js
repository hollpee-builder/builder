/**
* Border элемента
*
*
*/
StyleMenuGeometry.prototype = StyleMenu;
var StyleMenuGeometry = new StyleMenuGeometry();
function StyleMenuGeometry() {
	this.classFullHeight = "hlp-full-height";

	/**
	* Установить
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.set = function()
	{
		var elm = Element.obj;

		this.setMGProportion(elm);
		this.menuPositionType(elm);

		if (elm.css("position") == "absolute") {
			this.setPosition(elm);
		} else {
			this.setMGMargin(elm);
		}

		this.setMGPadding(elm);
		this.setMGAlign(elm);// выравнивание
	}	

/**************************************************************************************/
	/**
	* Установить width и height
	*
	*
	*/
	this.setMGProportion = function(elm)
	{
		$(".menuWidth, .menuHeight, .menuMinHeight").css("display", "none");

		// это нужно при переключении экрана (в так оно не нужно)
		var listCss = Element.data.css;
		for (var index in listCss) {
			var style = listCss[index];
			if (style == "height") {
				this.setMGHeight(elm);
			} else if (style == "min-height") {
				this.setMGMinHeight(elm);
			} else if (style == "width") {
				this.setMGWidth(elm);
			}
		}
	}

	/**
	* Устанавливает width
	*
	*/
	this.setMGWidth = function(elm)
	{
		var widthBlock = $(".menuWidth");
		var widthUnitParser = widthBlock.find(".inputUnitItem").not("[value='px']");
		var widthElm = false;

		widthBlock.css("display", "block");
		widthUnitParser.css("display", "block");

		var unitPersentObj = $(".menuWidthUnitPersent");
		unitPersentObj.css("display", "block");

		// если секция
		if (Element.isSection(elm)) {
			if (!Screen.isDesktop()) {
				$(".menuWidth .inputBlock").attr("data-no-activite", "true");
				return false; 
			} else if (elm.hasClass("hlp-full-width")) {
				widthBlock.css("display", "none");
				return false;
			}

			elm = elm.not(".hlp-full-width").find(" > .section-content");	
			widthElm = ElementCss.getStyle("width", "geometry", elm, "desktop", false, "hlp-section-content");
			
			if (!widthElm) {
				if (!widthElm) {
					widthElm = Screen.getWidthDefault()+"px";
				}
			}
			StyleUnit.setUnitMenu("width", widthElm);

			if (widthElm != "auto") widthElm = parseInt(widthElm);
			$(".valueWidth").val(widthElm);
			
		
			return false;
		} else if (Element.isElmChildForm(elm)) {
			widthElm = ElementCss.getStyleAllScreen("width", "geometry", false, elm);
			if (!widthElm) widthElm = "100%";
		} else {
			widthElm = ElementCss.getStyleAllScreen("width", "geometry", false, elm);
			if (!widthElm && Element.getState() != "static") {
				widthElm = ElementCss.getStyle("width", "geometry", elm, false, "static");
				if (!widthElm) widthElm = ElementCss.getStyle("width", "geometry", elm, "desktop", "static");
			}
		}


		StyleUnit.setMenuProperty(elm, "width", false, widthElm);
	}

	this.setMGHeight = function(elm)
	{
		StyleUnit.setMenuProperty(elm, "height", "geometry", elm.css("height"));
		// this.hideBlockNoActivite("height");
	}

	this.hideBlockNoActivite = function(property)
	{
		var blockInput = $(".inputBlock[data-style='"+property+"']");
		blockInput.removeAttr("data-no-activite");
		blockInput.find(".menuPropertyNoActivite").remove();
	}

/*****************************************************************************/
	
	/**
	* Минимальная высота
	*
	*/
	this.setMGMinHeight = function(elm)
	{
		if (elm.hasClass("section")) elm = elm.find(".hlp-section-content");
		
		// показываем блок
		$(".menuMinHeight").css("display", "block");
		
		//ставим значение 
		elm = Element.getForEditStyle(elm, "min-height");

		var value = elm.css("min-height");
		StyleUnit.setMenuProperty(elm, "min-height", "geometry");
		
		// дополнительно - костыль
		this.setPropertyExtended(elm);
	}

	/**
	* Устанавливает height
	*
	*/
	this.setPropertyExtended = function(elm)
	{
		$(".menuGeometryPropertyExtended .menuOneParam, .menuHeight").css("display", "block");
		StyleUnit.setMenuProperty(elm, "height", "geometry");
		StyleUnit.setMenuProperty(elm, "max-height", "geometry");
		StyleUnit.setMenuProperty(elm, "min-width", "geometry");
		StyleUnit.setMenuProperty(elm, "max-width", "geometry");
	}

/**************************************************************************************/
	/**
	* Установка типа позиции
	* 
	*
	*/
	this.setMGMenuPositionType = function(elm)
	{
		var typePosition = elm.css("position");
		if (typePosition == "relative") typePosition = "static";

		if (typePosition == "static") { //статик
			// показываем блок margin
			var blockClass = "menuMargin";
			// ставим margin
			if (!elm.hasClass("section")) this.setMGMargin(elm);

			// выравнивание для блока, если не в row
			// if (!elm.parent().hasClass("row"))
				$(".menuPositionAlign").css("display", "block");
		} else { //absolute и fixed
			// var blockClass = elm.hasClass("section") ? false : 
			var blockClass = "menuPosition";
			// устанавливаем значение position
			this.setPosition(elm);

			if ( this.isPositionFixed(elm)) typePosition = "fixed";
		}

		// показываемм блок
		if (blockClass) $("."+blockClass).css("display", "block");
		// отмечаем выриант
		$(".selectGeometryPosition .option[value='"+typePosition+"']")
														.attr("chosen", "true");

		// показываем или убираем блок выбора 
		var displayValue  = Element.data.no_chosen_position ? "none" : "block";
		$(".menuPositionType").css("display", displayValue);

		if (elm.hasClass("section")) {
			$(".menuPositionAlign").css("display", "none");
		}
	}
/************************************************************************************/
	/*
	* Позиция
	*
	* @see 	this.editPositionSide()
	*/
	this.setPosition = function(elm)
	{
		// получаем список сторон
		var listSide = StylePosition.getAdsoluteSide(elm);
		var sideV = listSide[0];
		var sideH = listSide[1];


		var inputV = $(".menuPosition .menuOneParam[side='"+sideV+"']");
		var inputH = $(".menuPosition .menuOneParam[side='"+sideH+"']");

		// показываем
		$(".menuPosition .menuOneParam").css("display", "none");
		inputV.css("display", "block");
		inputH.css("display", "block");

		// ставим значение в меню
		StyleUnit.setMenuProperty(elm, sideV);
		StyleUnit.setMenuProperty(elm, sideH);

		// отмечаем сторон у в меню
		$(".menuPositionSide").removeAttr("chosen")
							.filter("[value='"+listSide[2]+"']")
							.attr("chosen", "true");

		//на всю высоту
		var fullHeightStatus = this.isElmFullHeight(elm) ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valuePosAbsoluteFullHeight"), fullHeightStatus);
	}

	this.setMGPositionPanel = function(elm)
	{
		var positionSide = elm.hasClass("hlp-position-right") ? "right" : "left";
		$(".butGeometryPositionPanel[value='"+positionSide+"']").attr("chosen", "true");
	}

	this.setVisibleOptionPosFixed = function(elm)
	{
		var optionFixed = $(".selectGeometryPosition .option[value='fixed']");
		if (elm.hasClass("block") 
				|| elm.hasClass("text") 
				|| elm.hasClass("heading")
				|| elm.hasClass("button")
				|| elm.hasClass("image")) {
			optionFixed.css("display", "block");
		} else {
			optionFixed.css("display", "none");
		}
	}
/***************************************************************************************/
	/*отступы*/
	/**
	* Внутрений отступ 
	*/
	this.setMGPadding = function(elm)
	{
		// вертикальный
		this.setMGPaddingV(elm);
		// горизонтальный 
		this.setMGPaddingH(elm);
	}

	this.setMGPaddingV = function(elm)
	{
		elm = Element.getForEditStyle(elm, "padding-top");

		$(".menuPaddingV").css("display", "block");

		var top = ElementCss.getStyleAllScreen("padding-top", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-top", false, top);

		var bottom = ElementCss.getStyleAllScreen("padding-bottom", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-bottom", false, bottom);

	}

	this.setMGPaddingH = function(elm)
	{
		elm = Element.getForEditStyle(elm, "padding-left");

		$(".menuPaddingH").css("display", "block");

		var left = ElementCss.getStyleAllScreen("padding-left", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-left", false, left);

		var right = ElementCss.getStyleAllScreen("padding-right", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-right", false, right);
	}
/*****************************************************************************************/
	/**
	* внешний отступ
	*/
	this.setMGMargin = function(elm)
	{
		// повертикали
		this.setMGMarginV(elm);
		// по горизонтали
		this.setMGMarginH(elm);
	}

	this.setMGMarginV = function(elm)
	{	
		// потому что стили ставяться для всех секций
		if (elm.hasClass("site")) elm = elm.find(".section");

		// сверху
		StyleUnit.setMenuProperty(elm, "margin-top", false, false, elm);
		// снизу
		StyleUnit.setMenuProperty(elm, "margin-bottom", false, false, elm);
		
		// показываем блок
		$(".menuMarginV").css("display", "block");
	}	

	this.setMGMarginH = function(elm)
	{
		$(".menuMarginH").css("display", "block");
		// слева
		StyleUnit.setMenuProperty(elm, "margin-left", false, false, elm);
		// справа
		StyleUnit.setMenuProperty(elm, "margin-right", false, false, elm);

		// ставим максимальное значение
		var width = Element.getWidth();
		var listInput = $(".valueMarginLeft, .valueMarginRight");

		var marginLeft = parseInt($(".valueMarginLeft").val());
		var marginRight = parseInt($(".valueMarginRight").val());

		if (marginLeft && marginLeft == marginRight) {
			if (Element.existClassAdded(elm) || Element.getState() != "static") {
				if (!Element.data.modePosAbsolute) {
					this.setUnitAuto(listInput);
				}
			}
		}
	}

	this.setUnitAuto = function(listInput)
	{
		listInput.val("auto").parent()
								.find(".inputUnitCurrent")
								.attr("type", "auto")
								.text("-");
	}
/**********************************************************************************************/
	// обтекание
	this.setMGFloatSide = function(elm)
	{
		if (elm.hasClass("row") || elm.hasClass("column")) {
			elm = elm.closest(".row");
			var floatSide = elm.hasClass("hlp-children-float-right") ? "right" : "left";
		} else {
			if (elm.hasClass("nav-item")) elm = elm.parent();
			var floatSide = elm.css("float");
		}
		$(".butGeometryFloatSide[value='"+floatSide+"']").attr("chosen", "true");
	} 


/*********************************************************************************************/
	/*
	* выравнивание
	*
	* @see 	StyleMenu.fixedHistoryMove()
	* @see 	this.editMarginLeft(), this.editMarginRight()
	*/
	this.setMGAlign = function(elm)
	{
		// если absolute
		if (Element.isAbsolute(elm)) {
			$(".menuPositionAlign").css("display", "none");
			return false;
		}

		// показываем или убираем блок оптикание
		$(".butGeometryFloat, .butGeometryFloatSide").removeAttr("chosen");

		// ставим значение
		this.setAlignProperty(elm);
		// float
		this.setMGFloat(elm);
	}

	/**
	* Устанавливаем параметры выравнивания
	*
	* @see 	this.setMGAlign()
	*/
	this.setAlignProperty = function(elm)
	{
		// убираем кнопки
		$(".butGeometryAlign").removeAttr("chosen");

		// данные
		var marginLeft = ElementCss.getStyleAllScreen("margin-left", false, false, elm);
		var marginRight = ElementCss.getStyleAllScreen("margin-right", false, false, elm);
		
		// сторона
		var align = '';
		if (Element.isFloat()) {
			$(".butGeometryResetAlign").attr("chosen", "true");
			return false; 
		} else if (!marginLeft || parseFloat(marginLeft) == 0) {
			align = "left";
		} else if (marginLeft == marginRight) {
			align = "center";
		} else if (marginLeft == "auto") {
			align = "right";
		}

		// отмечаем
		$(".butGeometryAlign[value='"+align+"']").attr("chosen", "true");
	}

/*********************************************************************************************/
/***изменение*************************************************************************************/
	/*ширина*/
	this.editWidth = function(elm, value)
	{
		var maxWidthV = 2000;
		var minWidthV = 400;
		
		//если это секция
		if (Element.isSection(elm)) {
			var sectionClassV = Element.existClassAdded(elm) ? "" : "hlp-section-content";

			var widthUnitV = StyleUnit.getUnitMenu("width");
			if (value != "auto") value += widthUnitV;
			
			ElementCss.set("geometry", elm, false, {"width":value}, false, sectionClassV);
				
			// выход за пределы
			if (widthUnitV == "px") {
				var secWidthPxV = parseInt(value);
				if (secWidthPxV > maxWidthV) {
					ElementCss.set("geometry", elm, false, {"width":maxWidthV+"px"}, false, sectionClassV);
				} else if(secWidthPxV < minWidthV) {
					ElementCss.set("geometry", elm, false, {"width":minWidthV+"px"}, false, sectionClassV);
				}
			}

			// обновляем значение модульной сетки
			Grid.setPropety();
			
			// направляющие и линейку
			Guides.setPositionVertical();
			Scale.setPosition();
		} else {
			//изменяем ширину
			this.editProperty("width", parseFloat(value), elm);
		}
	}

	// высота
	this.editHeight = function(elm, value) 
	{
		this.editProperty("height", value, elm);
	}

	// минимальная высота
	this.editMinHeight = function(elm, value)
	{
		elm = Element.getForEditStyle(elm, "min-height");

		if (value != "auto") value = parseFloat(value);

		// изменяем минимальную ширину 
		this.editProperty("min-height", value, elm);
	}

	this.editProportionExtend = function(elm, value, elmEvent)
	{
		if (value != "auto") value = parseFloat(value);
		var propertyCssV = elmEvent.attr("data-css-type");

		if (propertyCssV == "max-height" && value == "none") {
			value = "auto";
		}

		if (elm.hasClass("section")) {
			if (propertyCssV == "width" && !Element.existClassAdded(elm)) {
				var listStyleV = {};
				var unitV = StyleUnit.getUnitMenu(propertyCssV);
				listStyleV[propertyCssV] = value+unitV;

				elm = elm.find(" > .section-content");
				ElementCss.set("geometry", elm, false, listStyleV, false, "hlp-section-content");

				return false;	
			} else {
				elm = elm.find(" > .section-content");
			}

			/*это потом убрать******/
			if (propertyCssV == "min-width" && !Element.existClassAdded(elm)) {
				ElementCss.clear("min-width", "geometry", elm, false, false, "hlp-section-content");
			}
		}

		this.editProperty(propertyCssV, value, elm);
	}

	

	/**
	* Обновляем информацию в меню о пропорциях
	*
	* @see 	Resize.setEventMouseUp();
	*/
	this.updataInfoProportion = function()
	{
		var elm = Element.obj;
		$('.valueWidth').val(elm.width());
		$('.valueHeight').val(elm.height());
	}


/*********************************************************************************************/
	/*позиция*/
	this.editPositionType = function(elm, value)
	{
		this.clearClassPositionFixed(elm);
		// для position absolute
		if (value == "fixed") this.setPropertyPositionFixed(elm);

		if (elm.hasClass("section")) {
			if (value == "static") {
				value = "relative";
				ElementCss.clear("z-index");
				
				if (Screen.isDesktop() && !Element.existClassAdded(elm)) {
					ElementCss.clear("position");
				} else {
					elm.css("position", "relative");
				}
			} else if (parseInt(elm.css("z-index")) < 1000) {
				elm.css("z-index", "1000");
				$(".valueZindex").val(1000);
				elm.css("position", value);
			}
			
			StyleMenu.set();

			return false;
		}

		ElementCss.clear("z-index");

		if (value == "static") {
			if (Screen.isDesktop()) {
				//убираем
				ElementCss.clear("position");
				ElementCss.clearAllScreen("top", "geometry", elm);
				ElementCss.clearAllScreen("left", "geometry", elm);
				ElementCss.clearAllScreen("bottom", "geometry", elm);
				ElementCss.clearAllScreen("right", "geometry", elm);
				
				var listElmObjV = Element.getAllObject(elm);
				listElmObjV.removeAttr("position-side");
			} else {
				var elmPostAbsV = elm.attr("position-side");
				if (elmPostAbsV.match(/^t-/gim)) elm.css("top", "0px");
				else elm.css("bottom", "0px");
				if (elmPostAbsV.match(/-l$/gim)) elm.css("left", "0px");
				else elm.css("right", "0px");

				elm.css({"position":"relative"});
			}
				

			// убираем блоки в меню
			$(".menuPosition").css("display", "none");
		} else { //absolute

			if (Screen.isDesktop()) { 
				//убираем
				ElementCss.clearAllScreen("margin-top", "geometry", elm);
				ElementCss.clearAllScreen("margin-left", "geometry", elm);
				ElementCss.clearAllScreen("margin-right", "geometry", elm);
				ElementCss.clearAllScreen("margin-bottom", "geometry", elm);
				//ставим значение 
			} else {
				elm.css({"margin-top":"0px", "margin-left":"0px", "margin-right":"0px", "margin-bottom":"0px"});
			}

			elm.css({"position":"absolute", "top":"0px", "left":"0px", "z-index":"100"});
				
			StylePosition.setAdsoluteSide();
		}

		// ставим стили
		StyleMenu.set();
	}


	// позиция мобильной панели
	this.editPositionPanel = function(elm, value)
	{
		if (value == "right") elm.addClass("hlp-position-right");
		else elm.removeClass("hlp-position-right");
	}
/**********************************************************************************************/
	this.editPositionTop = function(elm, value)
	{
		this.editProperty("top", value);
	}

	this.editPositionBottom = function(elm, value)
	{
		this.editProperty("bottom", value);
	}

	this.editPositionLeft = function(elm, value)
	{
		this.editProperty("left", value);
	}

	this.editPositionRight = function(elm, value)
	{
		this.editProperty("right", value);
	}

	/**
	* Изменения стороны позиционирования
	*
	* @see 	parent
	* @see 	StylePosition.reset()
	* @see 	ElementCss.afterClearStyleGeometry()
	*/
	this.editPositionSide = function(elm, value)
	{
		Screen.setDesktop();

		// ставит значение
		StylePosition.setAdsoluteSide(value, elm);
		
		//получаем стороны 
		var listSide = StylePosition.getAdsoluteSide(elm);
		// console.log(listSide)
		var setSideV = listSide[0];
		var setSideH = listSide[1];
		var clearSideV = setSideV == "top" ? "bottom" : "top";
		var clearSideH = setSideH == "left" ? "right" : "left";

		// очищаем
		ElementCss.clear(clearSideV, "", elm);
		ElementCss.clear(clearSideH, "", elm);
			
		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("bottom", "px");
		StyleUnit.setUnitMenu("left", "px");
		StyleUnit.setUnitMenu("right", "px");

		// ставим стили
		var listSet = {};
		listSet[setSideV] = "0px";
		listSet[setSideH] = "0px";
		ElementCss.setStyle(listSet);
		
		// ставим в меню
		this.setPosition(elm);
	}

	/**
	* На всю высоту
	*/
	this.editAbsoluteFullHeight = function(elm, value)
	{
		if (value == "yes") {
			// this.addClassFullHeight(elm);
			
			ElementCss.clearAllScreen(["top", "bottom"], "geometry", elm, "desktop");
			ElementCss.setStyle({"top":"0px", "bottom":"0px"}, elm, "desktop");
		} else {
			// this.removeClassFullHeight(elm);
			
			var listSide = StylePosition.getAdsoluteSide(elm);
			var sideV = listSide[0];
			var clearSide = sideV == "top" ? "bottom" : "top";
			ElementCss.clearAllScreen([clearSide], "geometry", elm, "desktop");
		}
	}

	this.getClassFullHeight = function()
	{
		return this.classFullHeight;
	}

	this.isElmFullHeight = function(elm)
	{
		var topV = ElementCss.getStyleAllScreen("top", false, false, elm);
		var bottomV = ElementCss.getStyleAllScreen("bottom", false, false, elm); 

		return topV && bottomV ? true : false;
	}

	/**
	*
	*
	* @see 	thsi.editAbsoluteFullHeight()
	*/
	this.addClassFullHeight = function(elm)
	{
		elm = Element.getAllObject(elm);

		var fullClassV = this.getClassFullHeight();
		elm.addClass(fullClassV);

		var listSide = StylePosition.getAdsoluteSide(elm);
		var posVerV = listSide[0];
		elm.css(posVerV, "0px");

		this.setPosition(elm);
	}


	/**
	*
	*
	* @see 	this.editPositionType()
	* @see 	thsi.editAbsoluteFullHeight()
	*/
	this.removeClassFullHeight = function(elm)
	{
		elm = Element.getAllObject(elm);
		
		var classFullHeight = this.getClassFullHeight();
		elm.removeClass(classFullHeight);

		ElementCss.clearAllScreen(["top", "bottom"], "geometry", elm, "desktop");
	}


	/*fixed*****/
	this.isPositionFixed = function(elm)
	{
		return ElementCss.getStyle("position_fixed", false, elm);
	}

	this.setPropertyPositionFixed = function(elm)
	{
		ElementCss.setStyle({"position_fixed":"1"}, elm);

		var elmSecV = elm.closest(".section");
		StyleMenuOther.editZindexExtremum(elmSecV, "max");
		ElementCss.set("geometry", elmSecV);
	}

	this.clearClassPositionFixed = function(elm)
	{
		ElementCss.clear("position_fixed", false, elm);
	}

	/*side****/
	this.getAttrPositionSide = function()
	{
		return "position-side";
	}

	this.clearClassPositionSide = function(elm)
	{
		if (!elm) elm = Element.getObj();

		elm.removeAttr(this.getAttrPositionSide());
	}

	this.clearAttrPositionFixed = function(elm)
	{
		this.clearClassPositionSide();
	}

/**********************************************************************************************/
	// margin
	this.editMarginTop = function(elm, value)
	{
		this.editProperty("margin-top", value);
	}

	this.editMarginBottom = function(elm, value)
	{
		this.editProperty("margin-bottom", value);
	}

	this.editMarginLeft = function(elm, value)
	{
		this.editMarginH(elm, value, "left");
	}

	this.editMarginRight = function(elm, value)
	{
		this.editMarginH(elm, value, "right");
	}

	this.editMarginH = function(elm, value, side)
	{
		// ставим значение
		this.editProperty("margin-"+side, value);
		// устанавливаем заново кнопки выравнивание
		this.setMGAlign(elm);
	}
/***************************************************************************************/
	// padding
	this.editPaddingTop = function(elm, value)
	{
		this.editPaddingVer(elm, value, "top");
	}

	this.editPaddingBottom = function(elm, value)
	{
		this.editPaddingVer(elm, value, "bottom");
	}

	this.editPaddingVer = function(elm, value, side)
	{
		elm = Element.getForEditStyle(elm, "padding-top");
		
		if ( (Element.data.is_insert || Element.obj.hasClass("site")) 
				&& (!parseFloat(value) 
					|| ( parseFloat(value) == 1 && this.isPaddingVOnePx(elm) ) ) ) {
			if (Screen.getCurrent() == "desktop" 
					&& !elm.hasClass("section-content")
					&& !Element.existClassAdded(elm)) {
				var property = "padding-"+side;
				ElementCss.clear(property, "geometry", elm);	
			
				if (StyleUnit.getUnitMenu(property) == "px"
						&& this.isPaddingVOnePx(elm)) {
					if (side == "top") $(".valuePaddingTop").val(1);
					else $(".valuePaddingBottom").val(1);
				}

				return false;
			} else {
				value = this.isPaddingVOnePx(elm) ? "1px" : "0px";
			}
		}

		this.editPadding(elm, side, value);
	}

	this.isPaddingVOnePx = function(elm)
	{
		var elmType = elm.attr("elm-type");
		if (!elmType) elmType = Element.obj.attr("elm-type");

		if (
				elmType == "block" 
				|| elmType == "form"
				// ----------------------
				|| elmType == "modal" 
				|| elmType == "section" 
				|| elmType == "section-content"
				|| elmType == "slider"
				|| elmType == "hlp-tabs"
				) {
			return true;
		} else {
			return false;
		}
	}

	this.editPaddingLeft = function(elm, value)
	{
		this.editPadding(elm, "left", value);
	}

	this.editPaddingRight = function(elm, value)
	{
		this.editPadding(elm, "right", value);
	}

	this.editPadding = function(elm, side, value)
	{
		var property = "padding-"+side;
		
		elm = Element.getForEditStyle(elm, property);
		// если секция
		value = parseFloat(value);

		this.editProperty(property, value, elm);
	}
/**********************************************************************************************/
	/**
	* Изменяет значение
	*
	* @see 	this.edit*
	*/
	this.editProperty = function(property, value, elm, noSetUnit)
	{
		if (!elm) elm = Element.obj;

		// если в процентах
		var unit = StyleUnit.getUnitMenu(property);
		
		if ((unit != "auto") && value != "auto" && !noSetUnit) {
			value = parseFloat(value)+unit;
		}

		//ставим значение 
		var listProperty = {};
		listProperty[property] = value;
		ElementCss.noSetStyle = true;

		// ставит не текущему элементу
		if (noSetUnit 
				|| elm.hasClass("nav-item")
				|| (elm.css("float") !=  "none") && elm.parent().hasClass("block")) {
			ElementCss.noSetInput = true;
			ElementCss.setStyle(listProperty, elm);
		// ставит текущему элементу
		} else {
			elm.css(listProperty);
			ElementCss.noSetStyle = false;
			ElementCss.set("geometry", elm);
		}
	}


/********************************************************************************************************/
	
	/**
	* Сторона обтикания у колонки
	*
	*
	*/
	this.editFloatSide = function(elm, value, elmEvent, noAllElm)
	{
		var classFloat = "hlp-children-float-right";
		if (!elm.hasClass("row")) elm = elm.parent().closest(".element");

		if (value == "left") elm.removeClass(classFloat); 
		else elm.addClass(classFloat);
	}

	// выравнивание
	this.editPositionAlign = function(elm, value)
	{
		var style = {};

		if (value == "center") { //по центру
			style["margin-left"] = "auto";
			style["margin-right"] = "auto";

			StyleUnit.setUnitMenu("margin-left", "auto");
			StyleUnit.setUnitMenu("margin-right", "auto");
		} else if (value == "left") {
			style["margin-left"] = "0px";
			ElementCss.clear("margin-right", "geometry");

			StyleUnit.setUnitMenu("margin-left", "px");
			StyleUnit.setUnitMenu("margin-right", "px");
		} else if (value == "right") { // по краям
			style["margin-left"] = "auto";
			style["margin-right"] = "0px";

			StyleUnit.setUnitMenu("margin-right", "px");
			StyleUnit.setUnitMenu("margin-left", "auto");
		}
		
		// убираем параметр с кнопки reset
		$(".butGeometryResetAlign").removeAttr("chosen");
		
		// ставим параметры
		elm.css(style);
	}
/********************************************************************************************************/
	this.setMGFloat = function(elm)
	{
		var floatSide = elm.css("float"); 
		var elmParentV = elm.parent();
		var blockVisibleV = elmParentV.hasClass("block") || floatSide != "none" ? "block" : "none";
		if (elmParentV.hasClass("hlp-block")) blockVisibleV = "none";
		$(".menuFloat").css("display", blockVisibleV);

		StyleMenu.chosenToggleBut($(".valueGeometryFloat"), floatSide);
	}

	//float
	this.editFloat = function(elm, value)
	{
		elm.css({"float":value, "margin-left":"0px", "margin-right":"0px"});
	} 

/*********************************************************************************************************/	
/********************************************************************************************************/
	
	/**
	*
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventExtendsProportion();
	}

	/**
	* Расширенные пропорции
	*
	* @see 	this.setEvent()
	*/
	this.setEventExtendsProportion = function()
	{
		var butObj = $(".menuGeometryPropertyExtendedBut");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			$(this).closest(".menuGeometryPropertyExtended").attr("data-type", $(this).attr("data-type"));
			return false;
		});
	}


} //end class

