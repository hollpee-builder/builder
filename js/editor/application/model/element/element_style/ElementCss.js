 /**
* Работа с css элемента
*
*
*/
var ElementCss = new ElementCss();
function ElementCss() {
	/**
	* Список стилей для страницы 
	*
	* @set 	this.setStyle()
	* @see 	StyleMenu.set()
	*/
	this.listStyle = {};

	/**
	* Тип экрана
	*
	*/
	this.screen = "desktop";

	/**
	* Состояние элемента
	*/
	this.state = false;

	/**
	* Не фиксировать
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	Key.incDecInput()
	* @see 	SpecialInput.setEvent()
	*/
	this.noFixed = false;
	this.noStyle = false;

	/**
	* Значение не ставить в меню
	*
	* @see 	this.updateStyle()
	* @set  StyleMenuGeometry.setValueWithOffset()
	* @set  StyleCanvas.setEventMoveMouseUp()
	*/
	this.noSetInput = false;
/******************************************************************************************/
	/**
	* Создать список тегов стилей при запуске сайта или страницы 
	*
	* @see 	Site.set() 
	* @see 	Page.setFullPage()
	* @see 	History.set()
	* @see 	this.editClass();
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.createListTagStyle = function()
	{
		// список стилей
		var listStyle = Data.page.data.css;

		// очищаем секцию
		this.clearSectionCss();

		// добавляем тэг
		for (var id in listStyle) {
			// параметры одного элемента
			var styleElm = listStyle[id];
			this.addListTagElm(id, styleElm);
		}

		// для старых версий section-content	
		this.setStyleOldSite();
	}

	this.setStyleOldSite = function()
	{
		/**дополнительные классы********************/
		$(".element.button").addClass("hlp-but");
		$(".element.image").addClass("hlp-img");
		// для формы
		$(".element.form").addClass("hlp-form");
		$(".element.textarea").addClass("input").removeClass("textarea");
	}

/****************************************************************************************/
	/**
	* Секция css для быстрого изменения
	*
	*/
	$("body").ready(function() {
		ElementCss.sectionCssFast = $(".sectionCssFast");
	});
	

	/**
	* Быстрая установка
	*
	* @see 	StyleCanvas.moveElement()
	* @see 	Resize.edit()
	*/
	this.fastSet = function(elmClass, screen)
	{
		// данные
		var elm = Element.obj;
		var listStyle = elm.attr("style");
		if (screen.indexOf("mobile") >= 0) screen = "mobile";
		
		// селектор
		var selector = "."+elmClass;
		if (screen != "desktop") selector = '.contentItem[screen^="'+screen+'"] '+selector;
		  
		// блок
		var block = "<style>"+selector+" {"+listStyle+"}</style>";
		// устанавливаем
		this.sectionCssFast.html(block);

		// console.log(9999999)
	}

/*************************************************************************************/
	/**
	* Устанавливает стиль из атрибута
	*
	* @see 	StyleMenu.edit()
	* @see 	StyleCanvas.fixedHistoryMove()
	* @see 	ElementBasic.setCssNewElm()
	* @see 	StyleCanvas.setEventMoveMouseUp(), StyleCanvas.moveElement()
	* @see 	Rezize.setEventMouseUp()
	* @see 	ElementMan.insert()
	* @see 	ElementSettingFixed.setVisible()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.resetAlign()
	* @see 	StylePosition.set() 
	* @see 	Resize.edit()
	* @see 	Key.moveElmKeyUp()
	* @see 	ElementModal.create()
	* @see 	StyleMenuGeometry.editMinHeight()
	* @see 	ElementCss.editBg()
	* @see 	StyleMenuBg.setStyleBg()
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBg.editSize()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	StyleMenuBg.setPropertyBg()
	* @see 	StyleMenuGeometry.editFloat(), editWidth()
	* @see 	ElementModal.actionAfter()
	*
	* 	нужно оптимизировать
	* @see 	StyleMenu.valueBgColorPicker()
	*/
	this.set = function(cssType, elm, screen, listStyle, state, elmClass)
	{
		// очищаем блок быстрой установки
		if (!elm) elm = Element.obj;
		if (!elm) return false;
		this.elm = elm;

		// получаем список стилей из атрибута
		if (!listStyle) {
			listStyle = this.getListStyleFromAttr();
			if (!listStyle) return false;
		}

		// стиль контента
		if (Element.isEditContentStyle(elm) && Element.existsListStyleContent(listStyle)) {
			if (listStyle["height"] || listStyle["min-height"] || listStyle["max-height"]) {
				elm = Element.getForEditStyle(elm);
			}
		}
		
		// устанавливаем данные
		this.setData(cssType, screen, state, elmClass);
		// обновляем массив 
		this.updateStyle(listStyle, cssType);
		// добавляем tag style 
		this.addTag();
		
		//убираем атрибут у элемента
		var listObj = Element.getAllObject(elm);
		listObj.removeAttr("style");
		
		elm.removeAttr("style");

		/******************************************************/
		if (this.elm.hasClass("section") && (listStyle["width"] || listStyle["min-width"])) {
			Resize.setSize();
		}
	}

/**********************************************************************************/

	/**
	* Отдает стиль
	*
	* @see 	StyleMenuBorder.setSide()
	* @see 	StyleMenuGeometry.setAlign(), .setMGWidth()
	* @see 	this.getStyleGeometry()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.setInMenu()
	* @see 	Resize.setEventMouseMove()
	* @see 	StyleCanvas.setEventMouseMove(), .setEventMouseMove()
	* @see 	ElementMan.addAddedClassInserting()
	*
	* @todo  	Переделать на список стилей(массив)
	*/
	this.getStyle = function(style, cssType, elm, screen, state, elmClass)
	{
		if (!elm) elm = Element.obj;
		this.elm = elm;
		this.setData(cssType, screen, state, elmClass); // установить данные
		value =  this.listStyle[style]; // отдаем стиль

		//если нету значение и улемента есть дополнительный класс
		if (!value && Element.existClassAdded(elm)) {
			this.elm = Element.getAllObject(elm, true);
			this.setData(cssType, screen, state); // установить данные
			value =  this.listStyle[style]; // отдаем стиль
		} 

		return value;
	}

	/**
	* Отдает стиль, проходит по всем экранам
	*
	* @see 	StyleUnit.getPropertyValue() 	
	*/
	this.getStyleAllScreen = function(style, cssType, elmClass, elm)
	{
		if (!elm) elm = Element.obj;
		var propertyValue = false;

		var state = Element.getState();
		if (!state) state = "static";

		/**********/
		var classAdV = Element.getClassAdded();
		if (classAdV) propertyValue = this.getStyleAllScreenOnly(style, cssType, classAdV, elm, state);
		if (propertyValue) return propertyValue;
			
		if (classAdV && state != "static") {
			propertyValue = this.getStyleAllScreenOnly(style, cssType, classAdV, elm, "static");
			if (propertyValue) return propertyValue;
		}
		/***********/

		/************/
		var classUniqueV = Element.getClassUnique(elm);
		propertyValue = this.getStyleAllScreenOnly(style, cssType, classUniqueV, elm, state);
		if (propertyValue) return propertyValue;
			
		if (state != "static") {
			propertyValue = this.getStyleAllScreenOnly(style, cssType, classUniqueV, elm, "static");
			if (propertyValue) return propertyValue;
		}	
		/**********/

		return false;
	}

	this.getStyleAllScreenOnly = function(style, cssType, elmClass, elm, state)
	{
		var currentScreen = Editor.screen;
		var listScreen = Screen.getListScreenTo(currentScreen);
		if (!elm) elm = Element.obj;

		var propertyValue = '';

		var countScreen = listScreen.length - 1;
		for (var i = countScreen; i >= 0; i--) {
			var screenItem = listScreen[i];
			propertyValue = this.getStyle(style, "geometry", elm, screenItem, state, elmClass);
			if (propertyValue) break;
		}

		return propertyValue;
	}

	/**
	* Устанавливает стиль
	*
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.reset()
	* @see 	StyleMenuGeometry.editPositionSide()
	*/
	this.setStyle = function(listStyle, elm, screen, state, cssType)
	{
		if (!elm) elm = Element.obj;

		if (!screen) screen = this.getScreen();
		if (!cssType) cssType = "geometry";
		
		this.set(cssType, elm, screen, listStyle, state)
	}

	/**
	* Очищает стиль
	*
	* @see 	this.clearAllScreen()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	StyleMenuGeometry.seditPositionType() 
	* @see 	StyleMenuGeometry.editPositionAlign(), StyleMenuGeometry.setElmAlignProperty()
	* @see 	ElementStyleController.setEventBgImage()
	* @see 	StyleMenuText.editStyle()
	* @see 	StyleMenuBg.editPosition(), .editRepeat(), .editSize()
	* @see 	EditElementImage.removeImg()
	* @see 	StyleMenuText.editBg()
	* @see 	StyleMenuBg.setColorRgba()
	* @see 	StyleMenuBg.editType()
	* @see 	StyleMenuBg.editFullBg()
	* @see 	StyleMenuBg.editType()
	* @see 	StyleMenuBg.setStyleBg()
	* @see 	ElementSettingFixed.editVisible()
	* @see 	StyleMenuBorder.edit()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	StyleMenuGeometry.editPositionSide()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StylePosition.reset()
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	editRotate.editRotate()
	*
	* @todo  	Переделать на список стилей(массив)
	*/
	this.clear = function(listClear, cssType, elm, screen, state, elmClass)
	{
		if (!elm) elm = Element.obj;
		this.elm = elm;

		this.setData(cssType, screen, state, elmClass); // установить данные
		
		if (listClear instanceof Object) {
			var count = listClear.length;
			for (var i = 0; i < count; i++) {
				delete this.listStyle[listClear[i]];
			}
		} else {
			delete this.listStyle[listClear]; // удаляем элемент
		}
		
	
		this.addTag();// добавляем tag style 
	}

	/**
	* Очищает все дочерние экраны
	*
	* @see 	StyleMenuGeometry.seditPositionType() 
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	ElementSettingFixed.editVisible()
	*/
	this.clearAllScreen = function(listClear, cssType, elm, currentScreen, state, elmClass)
	{
		if (!currentScreen) currentScreen = this.getScreen();

		var listScreen = Screen.getListScreen(currentScreen);


		var countScreen = listScreen.length;
		for (var i = 0; i < countScreen; i++) {
			var screen = listScreen[i];
			// убираем стили у экрана
			this.clear(listClear, cssType, elm, screen, state, elmClass);
		}
	}
/******************************************************************************************/
	/**
	* Список стилей по категориям
	*
	* @see 	this.clearAllStyleOneScreen()
	*/
	this.listStyleCategory = {
		"geometry":["position", "position_fixed", "float", "width", "min-width", "max-width", "height", "min-height", "max-height", "top", "left", "right", "bottom", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left"],
		"text":["placeholder", "word-wrap", "font-family", "font-size", "color", "text-align", "text-decoration", "font-weight", "font-style", "line-height", "letter-spacing", "text-transform"],
		"bg":["background", "background-color", "background-image", "background-position", "background-repeat", "background-size", "background-attachment"],
		"border":["border", "border-width", "border-style", "border-color", "border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius", "border-style", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style"],
		"animate":["animation-delay", "animation-duration"],
		"box-shadow":["box-shadow"], "text-shadow":["text-shadow"],
		"filter":["filter"],
		"transform":["transform", "opacity", "transition"],
		"other":["z-index", "overflow"],
	};

	/**
	* Очищает все стили экрана
	*
	* @see 	ElementStyleController.setEventResetStyle()
	*/
	this.clearAllStyleScreen = function(styleType, elm, elmClass)
	{
		if (!elm) elm = Element.obj;
		if (!Element.existClassAdded()) {
			elm = Element.getAllObject(elm, false, true);
		}

		var listStyleCategory = this.listStyleCategory[styleType];
		var currentScreen = this.getScreen();
		var stateElm = Element.getState();

		var listScreen = stateElm ? ["desktop"] : Screen.getListScreen(currentScreen);
		var countScreen = listScreen.length;
		var styleTypeClearing = stateElm ? "style" : "geometry";
		if (!elmClass) elmClass = Element.getCurrentClass(elm);

		var countStyle = listStyleCategory.length;
		for (var i = 0; i < countStyle; i++) {
			var style = listStyleCategory[i];
			
			if (currentScreen == "desktop" && !stateElm) {
				if (Element.isSectionContentStyle(elm, style)) {
					continue;
				} else if (elm.hasClass("image") && style == "width"
								&& !Element.existClassAdded(elm) ) {
					continue;
				}
			}

			// если на разных экранах стиль
			for (var iScreen = 0; iScreen < countScreen; iScreen++) {
				var curScreenV = listScreen[iScreen];
				if (curScreenV == "desktop") {
					if (styleType == "position") {
						continue;
					} else if (elm.hasClass(StyleMenuGeometry.isElmFullHeight(elm))
									&& (styleType == "top" || styleType == "bottom")) {
						continue;
					}
				}

				this.clear(style, styleTypeClearing, elm, curScreenV, stateElm, elmClass);
			}
		}
		
		this.actionAfterClearing(styleType, elm, stateElm, currentScreen, listScreen);

		// обновляем тег
		this.setData(styleTypeClearing, false, stateElm);
		this.addTag();

		//фиксируем историю
		History.record();
	}


	/**
	* Действия после удаления
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.actionAfterClearing = function(styleType, elm, stateElm, currentScreen, listScreen)
	{
		// для geometry 
		if (styleType == "geometry" && stateElm && stateElm != "static") {
			
			if (elm.hasClass("section")){
				ElementCss.clear("width", false, elm.find("> .section-content"), false, false, "hlp-section-content");
			}

		} else if (styleType == "geometry" && !stateElm) {
			// действия после удаления geometry
			this.afterClearStyleGeometry(elm, currentScreen, listScreen);
		// очищение текста
		} else if (styleType == "text" && Element.data.is_text) {
			var elmContentObj = elm.find("> .element-content");	
			this.clear("background-color", "style", elmContentObj);

			if (!stateElm) {
				var attrIsColV = Element.getAttrTextContentBg();
				elm.removeAttr(attrIsColV);
				elmContentObj.removeAttr(attrIsColV);
			}
		} else if (styleType == "animate") {
			StyleMenuAnimate.resetStyle(elm);
		} else if (styleType == "transform") {
			StyleMenuTransform.resetStyle(elm);
		}
	
		// сброс для bg
		if (styleType == "bg") {
			// паралакс
			elm.removeAttr("data-paralax");
			elm.removeClass("hlp-section-bg-paralax");

			// видео фон
			if (Screen.isDesktop() && Element.isStateStatic(elm)) {
				var bgVideoObj = elm.find(">.bg-video");
				if (bgVideoObj.length) bgVideoObj.remove();
			}
			
			// маска фона у секции 
			var elmMaskObj = elm.find("> .hlp-section-bg-mask");
			if (elmMaskObj.length) {
				ElementCss.clearAllStyleScreen("bg", elmMaskObj);
				if (Screen.isDesktop()) elmMaskObj.remove();
			}

			// для секции
			if (elm.hasClass("section")) {
				this.clearAllStyleScreen("bg", elm.find("> .section-content"));
			} else if (elm.hasClass("site")) {
				this.clearAllStyleScreen("bg", elm.find(".section-content:first"), "hlp-section-content");
				this.clearAllStyleScreen("bg", elm.find(".section:first"), "hlp-section");
			}
		}	
	}

	/**
	* действия после удаления geometry
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.afterClearStyleGeometry = function(elm, currentScreen, listScreen)
	{
		// ставим ширину по умолчанию
		var elmType = elm.attr("elm-type");
		var elmObj = ListElementObject[elmType];
		if (elmObj && currentScreen == "desktop" 
				&& !Element.existClassAdded(elm)) {
			var widthStd = ListElementObject[elmType].width; 
			
			if (widthStd && elm.css("float") == "none")  {
				// если ширина больше родительской
				var parentWidthV = elm.parent().width();
				if (widthStd > parentWidthV) widthStd = parentWidthV;
				// ставим значение
				this.set("geometry", elm, "desktop", {"width":widthStd+"px"});
			}
		}

		// если секция убираем min-height
		if (Element.isEditContentStyle(elm)) {
			var elmSection = Element.getForEditStyle(elm);
			var countScreen = listScreen.length;
			for (var i = 0; i < countScreen; i++) {
				// минимальную ширину
				var listClearSection = ["max-width", "min-width", "height", "min-height", "max-height", "min-height", "padding-top", "padding-bottom", "padding-left", "padding-right"];
				this.clear(listClearSection, "geometry", elmSection, listScreen[i]);
			}
			// ес
			if (currentScreen == "desktop" && !elm.hasClass("section")) {
				this.clear("width", "geometry", elmSection, "desktop", false, "hlp-section-content");
			}
		}

		// при position: absolute - сторона позиционирования 
		if (elm.css("position") == "absolute" && Screen.isDesktop()) {
			StyleMenuGeometry.editPositionSide(elm, elm.attr("position-side"));
		}

		// если desktop
		if (currentScreen == "desktop") {
			ElementCss.clear("position", "geometry", false, "tab-l");

			// у row очищаем
			if (elm.hasClass("row")) {
				ElementSettingGrid.resetColumnSize(elm);
			}
		}

		if (elm.hasClass("site")) {
			this.clearAllStyleScreen("geometry", elm.find(".section:first"), "hlp-section");
		} else if (elm.hasClass("section")) {
			elm.removeClass("hlp-full-width");
		}

		if (elm.hasClass("section")) {
			ElementCss.clear("z-index", false, elm);
		}

		// убираем для pos absolute
		if (Screen.isDesktop()) {
			StyleMenuGeometry.clearAttrPositionFixed(elm);
		}
	}
/*********************************************************************************************/
	/**
	* Отдает список стилей из атрибута
	*
	* @see this.set()
	*/
	this.getListStyleFromAttr = function()
	{
		if (!this.elm) this.elm = Element.obj;

		// разбиваем на обычный список стили
		var stringStyle = this.elm.attr("style");
		if (!stringStyle) return false;

		var list = stringStyle.split(";");
		// разбиваем на ключ значение
		var listStyle = {};
		for (var indexList in list) {
			var style = list[indexList];
			var item = style.split(/\:(?!\/)/gim);
			
			//если не пустой
			if (item[1]) listStyle[item[0].trim()] = item[1].trim();
		}

		return listStyle;
	}

	/**
	* Обновляем список
	*
	* @see  this.set()
	*/
	this.updateStyle = function(listStyle) 
	{
		var cssType = '';

		// обновляем стили
		for (var style in listStyle) {
			var value = listStyle[style];

			if (this.isGeometry(style)) {
				if (value != "auto" 
						&& (!value || !value.toString().match(/((%)|(vh)|(vw))$/gim))) {
					// единица проценты
					var unit = StyleUnit.getUnitMenu(style);//берем из меню
					
					// если нужно переводим в проценты
					if (unit == "px") value = parseFloat(value)+"px"; 
					else value = StyleUnit.pxToPercent(value, style, this.elm);
				} else {
					StyleUnit.setUnitMenu(style, value);
				}

				// ставим значение в  меню
				if (!ElementCss.noSetInput) StyleUnit.setValueMenu(style, value);
				ElementCss.noSetInput = false;
			} 

			if (style == "background-image") value = value.replace(/["']/gim, '');

			if (!this.listStyle) this.listStyle = {};
			this.listStyle[style] = value;
		}

		var cssMarginTop = this.listStyle["margin-top"];
		if (cssMarginTop) this.listStyle["margin-top"] = cssMarginTop;

		/* если 100% **********/
		this.updateStyleWidth100(listStyle);
	}

	this.updateStyleWidth100 = function(listStyle)
	{
		// if (Editor.isModeSimple()) return false;

		if ( (listStyle["width"] || this.listStyle["width"] == "100%")
				&& (listStyle["margin-left"] == "auto" || listStyle["margin-right"] == "auto") ) {
			if (StyleUnit.getUnitMenu("width") == "%" && parseInt(this.listStyle["width"]) >= 99) {
				if (//Screen.isDesktop() &&
						this.listStyle['position'] != "absolute"
						// && !this.elm.attr("class-added")
						) {
					
					if (this.listStyle["margin-left"] == "auto") {
						this.listStyle["margin-left"] = "0px";
						listStyle["margin-left"] = "0px";
						StyleUnit.setUnitMenu("margin-left", "px");
					}
					if (this.listStyle["margin-right"] == "auto") {
						this.listStyle["margin-right"] = "0px";
						listStyle["margin-right"] = "0px";
						StyleUnit.setUnitMenu("margin-right", "px");
					}

					$(".valueMarginLeft, .valueMarginRight").val(0);
					StyleMenuGeometry.setMGAlign(this.elm);
				}
			}
		}
	}
/********************************************************************************************/
	/**
	* Узнает стиль геометрии или нет
	*
	* @see 	this.updateStyle()
	* @see 	this.isStyleDiffrentScreen()
	*/
	this.isGeometry = function(style) {
		if (style == "width"
			|| style == "min-width"
			|| style == "max-width"
			|| style == "height"
			|| style == "min-height"
			|| style == "max-height"
			|| style == "top"
			|| style == "bottom" 
			|| style == "left"
			|| style == "right"
			|| style == "margin-top"
			|| style == "margin-right"
			|| style == "margin-bottom"
			|| style == "margin-left"
			|| style == "padding-top"
			|| style == "padding-right"
			|| style == "padding-bottom"
			|| style == "padding-left"

			) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Ставится на разных экранах
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.isStyleDiffrentScreen = function(style)
	{
		if ( this.isGeometry(style)
				/*******************************/
				|| style == "text-align"
				|| style == "text-size"
				|| style == "background-size"
				|| style == "background-position"
				|| style == "border-top-style"
				|| style == "border-bottom-style"
				|| style == "border-left-style"
				|| style == "border-right-style"
			/*****************************************/
				) {
			return true;
		} else {
			return false;
		}
	}
/******************************************************************************************/
	/**
	* Устанавливает данные
	*
	* @param	string 		className-тип css класса
	* @see 		this.set()
	* @see 		this.clear()
	* @see 		this.clearAllStyleOneScreen()
	* @see 		this.getStyle()
	* @see 		StyleMenu.set()
	*/
	this.setData = function(cssType, screen, state, elmClass)
	{
		if (!elmClass) elmClass = Element.getCurrentClass(this.elm);
		this.class = elmClass;

		if (!screen) screen = this.getScreen();
		if (!state) state = Element.getState(this.elm);
		if (state == "static") state = "";

		var list = this.getListStyle(this.class); //список типов стилей
		this.state = false;
		this.screen = screen;
		this.state = state;
		
		
		/*************/
		if (!state) state = "static";
			
		if (!list || !Data.isArray(list)) {
			var defArr1V = {};
			// почему то превращаеться массив в список, что бы стили не пропали
			if (list && !Data.isArray(list) && list["desktop"]) {
				defArr1V = {"desktop":list["desktop"]};
			}

			Data.page.data.css[elmClass] = defArr1V;
			list = this.getListStyle(this.class);
		}

		if (!list[screen] || !Data.isArray(list[screen])) {
			Data.page.data.css[elmClass][screen] = {};
			list = this.getListStyle(this.class);
		}

		if (!list[screen][state] || !Data.isArray(list[screen][state])) {
			Data.page.data.css[elmClass][screen][state] = {};
			list = this.getListStyle(this.class);
		}
		/******************/

		this.listStyle = list[screen][state];
	}

	/**
	* Отдает список всех элементов
	*
	* @see 	this.getListStyle()
	* @see 	this.delete()
	* @see 	this.editClass()
	*/
	this.getAllListStyle = function(elmClass)
	{
		return Data.page.data.css;
	}

	/**
	* Отдает список стилей
	*
	* @see 	this.setStyle()
	* @see 	this.delete() 
	* @see 	this.addListTagElm()
	* @see  this.getListValueVisible()
	*/
	this.getListStyle = function(elmClass)
	{
		var listCss =  this.getAllListStyle(elmClass);
		
		// если такого стиля нет
		if (!listCss[elmClass]) listCss[elmClass] = this.getNew();

		return listCss[elmClass];
	}

	/**
	* Добавляем новый стиль, при добавлении нового элемента
	*
	* @see this.getListStyle()
	*/
	this.getNew = function()
	{
		return {
			"desktop":{
				"static":{}
			}
		};

	}

	/**
	* Отдает тип экрана
	*
	* @see 	this.setData()
	* @see 	this.fastSet()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	StyleMenuGeometry.getClassAlignScreen()
	* @see 	this.setStyle()
	*/
	this.getScreen = function()
	{
		// return $(".butShowItem[chosen='true']").attr("device");
		return $(".butShowItem[chosen='true']").attr("screen");
	}
/******************************************************************************************/
/***************************************************************************************/
	/**
	* Добавляет список тегов для элемента
	*
	* @see 	this.createListTagStyle()
	*/
	this.addListTagElm = function(elmClass, styleElm)
	{
		this.class = elmClass;
		for (var screenV in styleElm) {
			this.screen = screenV;
			var screeenItemValue = styleElm[screenV];
			if (!screeenItemValue) continue;
			
			var isScreenStyle = false; 

			for (var stateV in screeenItemValue) {
				var listStyleV = screeenItemValue[stateV];
				if (!listStyleV) {
					continue;
				} else {
					var isNoEmplty = false;
					for (var isNoEmplty in listStyleV) break;
					if (!isNoEmplty) {
						/*очищаем пустые********/		
						if (Data.page.data.css[elmClass] && Data.page.data.css[elmClass][screenV]) delete Data.page.data.css[elmClass][screenV][stateV];
						/**********/
						continue;
					}
				}

				if (stateV == "static") stateV = false;
				this.state = stateV;
				this.listStyle = listStyleV;
				this.addTag();

				isScreenStyle = true;
			}

			/*очищаем пустые********/
			if (!isScreenStyle) {
				if (Data.page.data.css[elmClass] && Data.page.data.css[elmClass][screenV]) delete Data.page.data.css[elmClass][screenV];
			}
			/**********/
		}

		return false;
	}

	/**
	* Добавляем значение в css тэг
	*
	* @see 	this.set()
	* @see 	this.addListTagElm()
	* @see 	this.clear()
	* @see 	this.clearAllStyleOneScreen()
	*/
	this.addTag = function()
	{
		//содержимое style 
		var tagContent = this.getStyleTag();

		var placeholderColorV = this.listStyle["placeholder"];
		if (placeholderColorV) {
			var placeholderBlockV = " ."+this.class+"::-webkit-input-placeholder {color:"+placeholderColorV+";}"; 
			tagContent += placeholderBlockV;
		}
		
		// заменяет тэг
		var tagStyleV = this.getSectionCss();
		var tagId = this.getTagId();
		var elmTag = tagStyleV.find("#"+tagId);

		if (!tagContent) { //если нету стиля удаляем тег
			$(elmTag).remove();
		} else if (elmTag.length) { //тег уже есть
			elmTag.html(tagContent);
		} else { //тега нет
			var tag = '<style id="'+tagId+'">'+tagContent+'</style>';

			// для базового класса
			if (ElementBasicType.getSelector(this.class)) {
				tagStyleV.prepend(tag);
			} else {
				tagStyleV.append(tag);
			}
		}
	}

	/**
	* Отдает тэг
	*
	* @see 	this.updateTag()
	*/
	this.getStyleTag = function()
	{		
		var listStyle = this.listStyle;
		if (!listStyle) return false;

		// формируем tag
		var styleBlock = " {";
		for (var style in listStyle) {
			styleBlock += style+":"+listStyle[style]+";";
		}	
		styleBlock += "}";

		var selector = this.getSelector();//селектор
		var tag = selector+styleBlock;

		//если не десктоп 
		if (this.screen != "desktop") { //экран не десктоп
			// селектор для экранов
			var selectorScreen = this.getSelectorScreen(selector);

			// media 
			var mediaQuery = Screen.mediaQuery[this.screen];
			tag = selectorScreen+styleBlock;
			tag += " @media "+mediaQuery+" { "+selector+styleBlock+"}"; 
		}

		return tag;
	}


	/**
	* Отдает id тега
	*
	* @see 	this.addTag()
	*/
	this.getTagId = function()
	{
		var id = "style_"+this.class;

		if (this.screen != "desktop") id += "_"+this.screen;
		if (this.state) id += "_"+this.state;

		id = id.replace(/[\s\.>]/gim, "_");

		return id;
	}

	/**
	* Отдает селектор
	*
	* @see 	this.getStyleTag()
	*/
	this.getSelector = function()
	{
		if (this.elm && !this.elm.attr("class-unique")
				&& this.elm.closest("[class-unique]").attr("class-added")) {
			var elmParentClassAdded = true;
		} else {
			var elmParentClassAdded = false;
		}

		// это для базового класса
		var defaultSelectorV = ElementBasicType.getSelector(this.class);
		if (defaultSelectorV) {
			var selector = defaultSelectorV;
		// если это дополнительный класс	
		} else if (Element.isClassAdded(this.class) || elmParentClassAdded) {
			var selector = ".site:not([super12]):not([super13])[class] ."+ this.class;
		} else if (this.class == "site") {
			var selector = "." + this.class;
		} else if (this.class == "hlp-section") {
			var selector = ".hlp-section";
		} else {
			var selector = ".site ." + this.class;
		}

		//если это hover
		if (this.state) selector += "[state='"+this.state+"']";

		return selector;
	}

	/**
	* Отдает селектор под экранами
	*
	* @see 	this.getStyleTag()
	*/
	this.getSelectorScreen = function(selector)
	{
		var selectorScreen = "";

		switch (this.screen) {
			case "desktop" : break;
			case "tab-l" : selectorScreen += '.contentItem[screen="tab-l"] '+selector+", ";
			case "tab-p" : selectorScreen += '.contentItem[screen="tab-p"] '+selector+", ";
			case "mobile-l" : selectorScreen += '.contentItem[screen="mobile-l"] '+selector+", ";
			case "mobile-p" : selectorScreen += '.contentItem[screen="mobile-p"] '+selector;
			default: break;
		}

		selectorScreen = selectorScreen.replace(/,\s$/, '');

		return selectorScreen;
	}
/*****************************************************************************************/
	/**
	* Отдает секцию css
	*
	* @see 	this.addTag()
	* @see 	this.clearSectionCss()
	* @see 	this.delete()
	*/
	this.getSectionCss = function()
	{
		var parentSection = $(".sectionCssPage");
		return parentSection.find(".sectionCssItem[screen='"+this.screen+"']");
	}

	/**
	* Очищает секцию css
	*
	* @see 	this.createListTagStyle();
	*/
	this.clearSectionCss = function()
	{
		this.getSectionCss().html("");
	}

/*************************************************************************************************/
/**********************************************************************************************/
	/**
	* Изменяет класс
	*
	* @see 	StyleMenuFixed.editClass()
	*/	
	this.editClass = function(typeClass, oldClass, newClass, elm)
	{
		var listStyle = this.getAllListStyle(oldClass);

		for (var styleItemName in listStyle) {
			var pattern = new RegExp("^"+oldClass+"( |$)");
			var isCoincides = styleItemName.match(pattern);
			if (isCoincides) {
				var patterRep = new RegExp("^"+oldClass);
				var newSelector = styleItemName.replace(patterRep, newClass);

				// добавляем новый и удаляем старый
				if (!$("."+newClass).length) {
					listStyle[newSelector] = copyArray(listStyle[styleItemName]);
				}

				if ($("."+oldClass).length == 1) {
					delete listStyle[styleItemName];
				}
			}
		}

		// у элемента изменяем класс
		if (!elm) elm = $(".element[class-"+typeClass+"='"+oldClass+"']");
		elm.removeClass(oldClass).addClass(newClass).attr("class-"+typeClass, newClass);

		//обновляем стили 
		this.createListTagStyle();
	}

	/**
	* Копирование стилей одного элемента другому
	*
	* @see 	ElementMan.setNewClassAddedInseringElm()
	*/
	this.copyStyle = function(oldElm, newElm, oldClass, newClass)
	{
		this.elm = oldElm;
		var listAllStyle = this.getListStyle(oldClass);
		var newListStyle = JSON.parse(JSON.stringify(listAllStyle));

		if (!Data.page.data.css[newClass]) {
			Data.page.data.css[newClass] = newListStyle;
		} else {
			for (var styleGroup in newListStyle) {
				for (styleItem in newListStyle[styleGroup]) {
					Data.page.data.css[newClass][styleGroup][styleItem] = newListStyle[styleGroup][styleItem];
				}
			}
		}

		newListStyle = Data.page.data.css[newClass];
		this.addListTagElm(newClass, newListStyle);
	}
	
/********************************************************************************************/
/**********************************************************************************************/
	/*манипуляция*/
	/**
	* Удаление
	*
	* @see 	ElementMan.deleteElmClass()
	* @see 	EditElementImage.removeImg();
	*/
	this.delete = function(elm)
	{
		//основной класс 
		var elmClass = Element.getClassUnique(elm);
		this.deleteClass(elmClass, elm);

		// дополнительный класс img-modal-2
		var classAdded = Element.getClassAdded(elm);
		if (classAdded) this.deleteClass(classAdded, elm);
	}
	
	/**
	* Удаляет определенный класс
	*
	* @see 	this.delete()
	* @see 	Element.removeClassAdded()
	* @see 	StyleMenuFixed.editClass()
	*/ 
	this.deleteClass = function(elmClass, elm)
	{
		var isDelete = true;
		var countElm = $("."+elmClass).length;
		
		// если больше одного, то не удаляем стили
		if (countElm > 1) return false;

		// удаляем по классу
		this.deleteByClass(elmClass, elm);
	}

	/**
	* Удаляем по классу
	*
	* @see 	this.delete()
	* @see 	Element.getNewClassUnique()
	*/
	this.deleteByClass = function(classUnique, elm)
	{
		// удаляем из стилей 
		var listScreen = Screen.getListScreen("desktop");
		var countScreen = listScreen.length;

		var classUniqueStr = classUnique.replace(/\s\>\s\./gim, "____");
		classUniqueStr = classUniqueStr.replace(/\s+\./gim, "__");

		// экраны
		for (var iAdded = 0; iAdded < 2; iAdded++) {				
			for (var i = 0; i < countScreen; i++) {
				var screenItem = listScreen[i];
				var screenStr = screenItem == "desktop" ? "" : "_"+screenItem;

				$("style[id='style_"+classUniqueStr+screenStr+"']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_hover']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_parent_hover']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_focus']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_chosen']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_fixed']").remove();

				// animated
				$("style[id='style_"+classUniqueStr+screenStr+"_load']").remove();
			}
		}

		// удаляем из списка
		delete Data.page.data.css[classUnique];

		// удаляем класс ребенка
		this.deleteByClassChild(classUnique, elm);
	}

	/**
	* Удалет класс ребенка
	*
	* @see 	this.deleteByClass()
	*/
	this.deleteByClassChild = function(classUnique, elm)
	{
		var listChildClass = [
			" > .hlp-element-content",
			" > .hlp-section-content",
			" > .hlp-section-bg-mask",
			" .hlp-slider-item",
			" > .hlp-tabs-item",
			" > .hlp-block-hover-active",
			" > .text-span"];

		for (var iChildClass in listChildClass) {
			var childClass = listChildClass[iChildClass];
			var classUniqueContent = classUnique + childClass;
			
			if ($("."+classUniqueContent).length) {
				this.deleteByClass(classUniqueContent, elm);
				break;
			}
		}
	}
/****************************************************************************************/
	/**
	* Отдает список visible элемента
	*
	* @see 	ElementSettingFixed.set(), ElementSettingFixed.editVisible()
	*/
	this.getListValueVisible = function()
	{
		var listVisible = {};
		// var listScreen = ["desktop", "tab-p", "mobile-l"];
		var listScreen = Screen.getListScreen("desktop");
		var elmClass = Element.getCurrentClass();
		var listStyle = this.getListStyle(elmClass);
		var lastValue = "block";
		var state = Element.getState(Element.obj);
		if (!state) state = "static";

		for (var iScreen in listScreen) {
			var screenItem = listScreen[iScreen];
			var listStyleScreenV = listStyle[screenItem];
			var screenProperty = listStyleScreenV ? listStyleScreenV[state] : false;
			var valueItem = screenProperty ? screenProperty["display"] : false;
			
			if (valueItem) lastValue = valueItem;
			else valueItem = lastValue;

			listVisible[screenItem] = valueItem;
		}
		
		return listVisible;
	}

/**************************************************************************************/
	/**
	* Устанавливает стиль по атрибуту
	*
	* @see 	ElementStyleController.setEventCanvas()
	* @see 	Page.fix()
	*/
	this.setCssByAttrStyle = function(listElm)
	{
		if (!listElm) listElm = $(".element[style]");
		else listElm.filter("[style]");

		var countElm = listElm.length;

		for (var iElm = 0; iElm < countElm; iElm++) {
			var elm = listElm.eq(iElm);
			var groupCssType = false;
			var elmAttrStyleValue = elm.attr("style");
			if (elmAttrStyleValue.match(/(width)|(margin)/gim)) {
				groupCssType = "geometry";
			} else if (elmAttrStyleValue.match(/(color)|(background)|(border)|(box\-shadow)/gim)) {
				groupCssType = "style";
			}
			if (groupCssType) {
				ElementCss.set(groupCssType, elm);
			}
		}
	}
	

}//end class


