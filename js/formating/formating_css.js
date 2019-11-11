var Css = new Css();
function Css() {
	/**
	* Текущая страница с которой работаем
	*
	*/
	this.currentPage;

	this.currentPageType;

	this.listFontLocal = {};

	this.mediaQuery = {
		"tab-l": 	"screen and (max-width: 1024px), screen and (max-device-width: 1024px)",
		"tab-p": 	"screen and (max-width: 799px), screen and (max-device-width: 799px)", 
		"mobile-l": "screen and (max-width: 599px), screen and (max-device-width: 599px)", 
		"mobile-p": "screen and (max-width: 429px), screen and (max-device-width: 429px)"
	};

	/**
	* Форматирует данные
	*
	* @see 	this.formating()
	*/
	this.formating = function(page, pageType, buffer, listClass, listCss)
	{
		if (!page.data) return '';

		this.buffer = buffer;

		/************/
		buffer.find(".button").addClass("hlp-but");
		buffer.find(".image").addClass("hlp-img");
		buffer.find(".form").addClass("hlp-form");
		/***********/

		// данные
		this.pageData = page.data;
		var data = page.data;
		
		/****************/
		// параметры передаються для типа site, когда конвертируем основу
		if (!listClass) listClass = this.getListClass(page);
		if (!listCss) listCss = data.css;
		if (!listCss) listCss = {};
		/*************/

		this.currentPage = page;
		this.currentPageType = pageType;
		var listCssDesctop = '';
		var listCssTabH = '';	
		var listCssTabV = '';
		var listCssMobileH = '';	
		var listCssMobileV = '';	
		this.countModal = 0;
		
		var listCssOrg = JSON.parse( JSON.stringify(listCss) );
		this.listCssOrg = listCssOrg;

		// проходим все стили
		for (elmClass in listClass) {
			var classProperty = listClass[elmClass];
			this.classProperty = classProperty;
			this.elmClassType = classProperty["class_type"];
			this.elmType = classProperty["type"];
			this.elmClass = elmClass;
			this.isElmColumn = this.elmType == "column";
			var elmCss = listCss[elmClass];
			this.elm = classProperty["elm"];

			// если нету стиля
			if (!elmCss) continue;

			/*орегинальные стили*/
			var elmCssOrg = listCssOrg[elmClass];

			// если дополнительный класс
			this.isClassAdded = $("*[class-added='"+elmClass+"']").length ? true : false;

			// стили desktop
			listCssDesctop += this.getStyleElmDesctop(elmClass, elmCss, elmCssOrg);
			// не desktop
			listCssTabH += this.getStyleElmTabH(elmClass, elmCss, elmCssOrg);
			listCssTabV += this.getStyleElmTabV(elmClass, elmCss, elmCssOrg);
			listCssMobileH += this.getStyleElmMobileH(elmClass, elmCss, elmCssOrg);
			listCssMobileV += this.getStyleElmMobileV(elmClass, elmCss, elmCssOrg);
		}	

		this.countModal = 0;
		// получаем текст
		var listCssScreen = {"tab-l":listCssTabH, "tab-p":listCssTabV, "mobile-l":listCssMobileH, "mobile-p":listCssMobileV};
		var cssString = this.getCssString(listCssDesctop, listCssScreen);

		//подключаем локальные шрифты, для многостраничника они подключаться потом
		if (!Formating.isSiteTypeSite() && !Formating.isCmsNameWp()) {
			cssString = this.getListFontLocalInc() + cssString;
		}

		return cssString;
	}

	/**
	* Отдает список классов
	*
	* @see 	this.formatingCss()
	*/
	this.getListClass = function(page)
	{
		// базовые классы
		var listClass = {};
		
		if (!Formating.isSiteTypeSite() || page.page_id == 1) {
			listClass = this.getListClassBasicType(listClass);
		}

		// list elm
		var listElm = $(".contentBoofer .element, .contentBoofer .element-content, .section-content, .but-modal-close, .hlp-bg-video-opacity, .hlp-slider-item, .hlp-tabs-item");
		listElm = listElm.not(".form textarea"); // с input одинаковый класс .input, поэтому конфликт

		var elmCount = listElm.length;
		for (var i = 0; i < elmCount; i++) {
			var elm = listElm.eq(i);
			var elmClass = this.getUniqueClass(elm, "unique");
			
			var elmType = elm.attr("elm-type");
			if (!elmType) {
				if (elmClass.match(/> .hlp-section-content$/gim)) {
					elmType = "section-content";
				}
			}

			// что бы один отже класс не проходил, что бы был не
			if (!listClass[elmClass]) {
				listClass[elmClass] = this.getClassProperty("unique", elmType, elmClass);
			}

			// дополнительный класс
			var classAdded = elm.attr("class-added"); 
			if (classAdded) {
				listClass[classAdded] = this.getClassProperty("added", elmType, classAdded);
			// для nav item итд
			} else if (!elm.attr("class-unique")) {
				classAdded = this.getUniqueClass(elm, "added");
				listClass[classAdded] = this.getClassProperty("added", elmType);
			}
			
			if (this.isElmTypeSection(elmType)) {
				listClass[elmClass+" > .hlp-section-bg-mask"] = this.getClassProperty("unique", "hlp-section-bg-mask");
				if (classAdded) listClass[classAdded+" > .hlp-section-bg-mask"] = this.getClassProperty("added", "hlp-section-bg-mask");
			}
		}

		return listClass;
	}

	// this.getClassProperty();
	this.getClassProperty = function(classType, type, elmClass)
	{
		// параметры
		var elm = this.buffer.find("."+elmClass);
		var property = {
			"class_type":classType,
			"type":type,
			// "tag":tag,
			// "class_parent":classParent,
			// "clear_class":false,
			"elm":elm
		};

		return property;
	}

/***********************************************************************************/

	/**
	* Отдает уникальный класс элемента
	*
	* @see 	this.getListClass()
	*/
	this.getUniqueClass = function(elm, classType)
	{
		var elmClass = elm.attr("class-unique");
		
		//если нету класса 
		if (!elmClass) {
			var fullClassType = "class-"+classType;

			if (this.isElmChildrenForm(elm)) {
				var parentElmV = elm.closest(".form");
			} else {
				// var parentElmV = elm.parent().closest("[class-unique], [class-added]");
				var parentElmV = elm.parent().closest("[class-unique]");
			}
			
			var parentClass = parentElmV.attr(fullClassType);
			
			var isParentClassV = elm.parent().attr("class-unique");

			if (isParentClassV && !this.isElmChildrenForm(elm) && !elm.hasClass("nav-item")) {
				var directChild = ' >';
			} else {
				var directChild = '';
			}
			
			var elmClassListPart = elm.attr("class").match(/[^\s]+/gim);
			elmClassPart = elmClassListPart[1];
			if (!elmClassPart) elmClassPart = elm.attr("elm-type");
			if (!elmClassPart) elmClassPart = elmClassListPart[0];

			if (parentClass != undefined) {
				elmClass = parentClass+directChild+" ."+elmClassPart;
			} else {
				elmClass = elmClassPart;
			}

		}

		return elmClass;
	}

	this.isElmChildrenForm = function(elm)
	{
		if (elm.hasClass("input")
				|| elm.hasClass("textarea")
				|| elm.hasClass("submit")
				|| elm.hasClass("select")
				|| elm.hasClass("hlp-select")
				|| elm.hasClass("radio")
				|| elm.hasClass("checkbox")

				|| elm.hasClass("hlp-upload-file-wrap")
				|| elm.hasClass("hlp-upload-file-name")
				|| elm.hasClass("hlp-upload-file")
				) {
			return true;
		} else {
			return false;
		}
	} 

	/**
	* Отдает текст css
	*
	*
	* @see 	this.formatingCss()
	*/
	this.getCssString = function(listCssDesctop,  listCssScreen)
	{
		// убираем с тавим перенос строки
		var cssString = listCssDesctop.replace(/^\r?\n/, '');
		var cssStringNoDesktop = '';

		for (var screen in listCssScreen) {
			var cssScreen = listCssScreen[screen];
			var mediaQuery = this.mediaQuery[screen];
			var cssScreenStr = '';
			if (cssScreen) {
				cssScreenStr += '\r\n@media '+mediaQuery+' {\r\n'+cssScreen+'\r\n}\r\n';
			}

			cssStringNoDesktop += cssScreenStr;
		}
		
		if (cssStringNoDesktop) cssString += cssStringNoDesktop;

		// в конце пустая строка
		cssString += '\r\n';
		
		
		return cssString;
	}

	/**
	* Подклюяение локальных шрифтов
	*
	* @see 	this.formatingCss()
	*/
	this.getListFontLocalInc = function()
	{
		var listFontCssLink = '';
		var listFontCssLocal = '';

		var fontOpenSans = Formating.site.font["Open Sans"];
		// есть mlp то только основе, если lp то каждой странице
		if (fontOpenSans) {
			this.listFontLocal["Open Sans"] = fontOpenSans["link"];
		} else {
			delete this.listFontLocal["Open Sans"];
		}

		for (var fontFamily in this.listFontLocal) {
			var link = this.listFontLocal[fontFamily];

			if (link != "local") {
				link = unescape(link);
				var fontSrc = /href=("|')([^"']+)("|')/gim.exec(link);
				if (!fontSrc) continue;
				fontSrc = fontSrc[2];

				if (!fontSrc) continue;
				fontSrc = fontSrc.trim();
				if (!fontSrc) continue;

				fontSrc = fontSrc.replace(/\s/gim, '&#43;');
				
				// нет символов
				if (!fontSrc.match(/subset/gim)) {
					fontSrc += "&subset=cyrillic,latin";
				}

				fontSrc = escape(fontSrc);
				listFontCssLink += "@import url("+fontSrc+");\r\n";
			} else {
				/**************************/
				if (Formating.isCmsNameWp()) {
					var fontPath = "css/fonts/";
				} else {
					var fontPath = "fonts/";
				}
				/**************************/

				if (Formating.typeOperation != "download") fontPath = "../" + fontPath;
				fontPath += fontFamily+"/" + fontFamily;

				var fontUrl = "\r\n\tsrc:";
				fontUrl += " url("+fontPath+".woff) format('woff'),\r\n";
				fontUrl += "\t\turl("+fontPath+".ttf) format('opentype'),\r\n";
				fontUrl += "\t\turl("+fontPath+".svg) format('svg')";
				
				listFontCssLocal += "@font-face {\r\n\tfont-family: '"+fontFamily+"';"+fontUrl+";\r\n}";
				listFontCssLocal += "\r\n\r\n";
			}
		}

		var listFontCss = listFontCssLink;
		if (listFontCssLocal) listFontCss += "\r\n" + listFontCssLocal;
		
		listFontCss = listFontCss.replace(/\+/gim, "@@@@@plus@@@@@");
		listFontCss += "\r\n";

		// обнуляем
		this.listFontLocal = {};

		return listFontCss;
	}

/********************************************************************************************/
	/**
	* Отдает стили элемента desctop
	*
	*  @see this.formatingCss()
	*/
	this.getStyleElmDesctop = function(elmClass, elmCss, elmCssOrg)
	{
		return this.getStyleElmList(elmClass, elmCss, elmCssOrg, "desktop");
	}

	this.getStyleElmTabH = function(elmClass, elmCss, elmCssOrg)
	{
		return this.getStyleElmList(elmClass, elmCss, elmCssOrg, "tab-l");
	}

	this.getStyleElmTabV = function(elmClass, elmCss, elmCssOrg)
	{
		return this.getStyleElmList(elmClass, elmCss, elmCssOrg, "tab-p");
	}

	this.getStyleElmMobileH = function(elmClass, elmCss, elmCssOrg)
	{
		return this.getStyleElmList(elmClass, elmCss, elmCssOrg, "mobile-l");
	}

	this.getStyleElmMobileV = function(elmClass, elmCss, elmCssOrg)
	{
		return this.getStyleElmList(elmClass, elmCss, elmCssOrg, "mobile-p");
	}

	this.getStyleElmList = function(elmClass, elmCss, elmCssOrg, screen)
	{
		var listStyle = elmCss[screen];
		var style = '';
		if (!listStyle) return style;

		var listState = ["static", "fixed", "parent_hover", "hover", "active", "focus", "chosen", "load"];

		var countTabV = screen == "desktop" ? 0 : 2; 
		for (var iState in listState) {
			var state = listState[iState];
			var stateV = state == "static" ? false : state;
			style += this.getStyleElm(elmClass, listStyle[state], countTabV, screen, elmCssOrg, stateV);
		}

		return style;
	}	
/*********************************************************************************************/
	/**
	* Отдает стиль элемента
 	*
	* @see 	this.getStyleElmDesctop(), this.getStyleElmTab(), this.getStyleElmMobile()
	*/
	this.getStyleElm = function(elmClass, css, countTab, screen, allCss, state)
	{
		if (!css) return '';

		var isGeneral = screen == "desktop" && !state && this.elmClassType == "unique";
		if (isGeneral) css = this.clearStyle(css);

		// для position:fixed
		if (css["position_fixed"] && css["position"] == "absolute") {
			css["position"] = "fixed";
			delete css["position_fixed"];
		}
		
		// фиксируем дополнительный font
		this.addAddedFont(css);
		// если
		css = this.setZindex(css, elmClass);// z-index
		// для паралакс ie 11
		if (css["background-attachment"] == "fixed") {
			css["transition"] = "transform 10ms linear";
		}

		var content = this.attachCssElm(css, allCss, state, countTab);
		if (!content) return '';
		
		// формируем селектор
		elmClass = this.attachSelectorClass(elmClass, state);
		// формируем блок
		var tabBlock = countTab ? '\t' : '';
		var style = '\r\n'+tabBlock+elmClass+' {'+content+'\r\n'+tabBlock+'}\r\n';

		// для placeholder
		if (screen == "desktop" && !state) {
			style = this.addStyleBlockPlaceholder(css, elmClass, style, tabBlock);
		}

		return style;
	}

	this.clearStyle = function(css)
	{
		if (css["margin-left"] == "0px" || css["margin-left"] == "0%") delete css["margin-left"];
		if (css["margin-right"] == "0px" || css["margin-right"] == "0%") delete css["margin-right"];

		if (!this.elm.hasClass("column")) {
			if (css["margin-bottom"] == "0px" || css["margin-bottom"] == "0%") delete css["margin-bottom"];
		}

		if (!this.elm.hasClass("row")) {
			if (css["margin-top"] == "0px" || css["margin-top"] == "0%") delete css["margin-top"];
		}
		
		/***********************/
		// css = this.setIndent(css, "margin");
		// css = this.setIndent(css, "padding");
		// // width
		if (css["width"] == "100%" 
				&& !css["float"]
				&& !css["position"]
				&& !this.elm.hasClass("hlp-but")) {
			delete css["width"];
		} 
		/************************/

		return css;
	}

	this.setIndent = function(css, property)
	{
		var valueVer = property == "padding" && this.isPaddingVOnePx(this.elm) ? "1px" : "0";

		var margin = '';
		var countMarginItem = 0;
		if (css[property+"-top"]) {
			margin += css[property+"-top"];
			countMarginItem++;
		} else {
			if (this.elm.hasClass("row") && property == "margin") {
				margin += "70px";
			} else {
				margin += valueVer;
			}
		}
		margin += " ";
		if (css[property+"-right"]) {
			margin += css[property+"-right"];
			countMarginItem++;
		} else {
			margin += "0";
		}
		margin += " ";
		if (css[property+"-bottom"]) {
			margin += css[property+"-bottom"];
			countMarginItem++;
		} else {
			margin += valueVer;
		}
		margin += " ";
		if (css[property+"-left"]) {
			margin += css[property+"-left"];
			countMarginItem++;
		} else {
			margin += "0";
		}


		/*********************/
		// что бы не перебило
		if (property == "padding" && this.isDefaultPaddingVer()) {
			if (!css["padding-top"] || !css["padding-bottom"]) {
				return css;
			}
		}
		/*********************/

		if (countMarginItem > 1) {
			css[property] = margin;
			delete css[property+"-top"];
			delete css[property+"-right"];
			delete css[property+"-bottom"];
			delete css[property+"-left"];
		}

		return css;
	}

	this.isDefaultPaddingVer = function()
	{
		if (this.elm.hasClass("section-content") 
				|| this.elm.hasClass("button")) {
			return true;
		} else {
			return false;
		}
	}

	this.isPaddingVOnePx = function(elm)
	{
		var elmType = elm.attr("elm-type");

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

/*************************************************************************/	

	this.setZindex = function(css, elmClass)
	{
		if (!css["z-index"] || css["position"]) return css;	
		css["position"] = "relative";
		return css;
	}

	/**
	* Отдает размер в em
	*
	* @see 	this.combineStyleFont()
	*/
	this.getFontSizeRem = function(sizePx)
	{
		var sizeRoot = $("html").css("font-size");
		var sizeRem = parseFloat(sizePx) / parseFloat(sizeRoot);
		sizeRem = parseFloat(sizeRem.toFixed(2));
		return sizeRem + 'rem';
	}

	/**
	* Формирует селектор
	*
	* @see 	this.getStyleElm()
	*/
	this.attachSelectorClass = function(elmClass, state)
	{
		// дополнительный класс
		var elmAddedObj = $(".element[class-added='"+elmClass+"']");
		var isAddSiteClass = false;
		if (elmAddedObj.length) {
			isAddSiteClass = true;
			// для колонок и nav-item
			if (!elmAddedObj.attr("class-unique")) elmClass += "[class]";
		}

		var selectorNoClass = false;
		var classProperty = this.classProperty;
		var elm = classProperty["elm"];

		// селектор пользователя
		var elmCustomerSelector = elm.attr("data-export-selector");
		if (elmCustomerSelector) {
			elmClass = elmCustomerSelector;
			selectorNoClass = true;
		}

		if (this.elmType = "hlp-li") elmClass = elmClass.replace(/\.hlp-li/gim, 'li');

		// в состояние
		if (state == "chosen") {
			elmClass += '[data-hlp-chosen="true"]';
		} else if (state == "load") {
			elmClass += '[data-hlp-load="1"]';
			elm.attr("data-hlp-load", "0");
		} else if (state == "fixed") {
			if (this.isElmTypeSection()) {
				elmClass += '[class~="hlp-section-fixed"]';

			} else if (elmClass == "hlp-section-content") {
				elmClass = "hlp-section-fixed .hlp-section-content";
				isAddSiteClass = false;
			} else if (elmClass.match(/hlp-section-content/gim)) {
				elmClass = elmClass.replace(/ > .hlp-section-content/gim, '[class~="hlp-section-fixed"] > .hlp-section-content');
				isAddSiteClass = false;
			} else {
				elmClass = 'hlp-section-fixed.'+elmClass+", .hlp-section-fixed ."+elmClass;
				isAddSiteClass = false;
			}
		} else if (state) {
			if (state == "parent_hover") {
				var elmParent = elm.parent().closest("[class-unique], [class-added]");
				// classParent = elmParent.attr("class-added");
				// if (!classParent) 
				classParent = elmParent.attr("class-unique");
				
				if (this.buffer.find("."+classParent).hasClass("row")) {
					classParent += " > .hlp-col";
				}
				elmClass = classParent+":hover ."+elmClass;
			} else {
				elmClass += ":"+state;
			}
		}

		if (elmClass == "site") elmClass = "hlp-site";

		/*для wp***********************/
		if (Formating.isCmsNameWp()) {
			elmClass = "page-"+Formating.pageName+" ."+elmClass;
		}
		/************************/

		if (isAddSiteClass || this.elmClassType == "added") {
			elmClass = "hlp-site ."+elmClass;
		}

		// баззовый heading
		if (elmClass.match(/^hlp-type-heading[0-9]$/gim)) {
			elmClass = "h"+elmClass.replace(/[^0-9]+/gim, '');
		// другие 
		} else if (!selectorNoClass) {
			elmClass = "." + elmClass;
		}

		return elmClass;
	}

	this.isElmTypeSection = function(elmType)
	{
		if (!elmType) elmType = this.elmType;

		if (elmType == "section") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* формировать css 1 элемента
	*
	*
	*/
	this.attachCssElm = function(css, allCss, state, countTab)
	{
		var tabProperty = countTab ? '\t\t' : '\t';
		var content = '';

		for (var property in this.listOrderProperty) {
			if (property == "placeholder") continue;

			var value = css[property];
			if (!value) continue;

			if (state && allCss["desktop"] && allCss["desktop"][property] == value) {
				continue; 
			}
			
			content += '\r\n'+tabProperty+property+': '+value+';';

			// если это шрифт и за ним нету font
			if (property == "font-size" && this.elmType != "input") {
				var valueRem = this.getFontSizeRem(value);
				content += '\r\n'+tabProperty+"font-size"+': '+valueRem+';';
			}
		}

		// все остальные
		for (var property in css) {
			if (this.listOrderProperty[property]) continue;
			else if (property == "placeholder") continue;

			var value = css[property];
			// если состояние и стиль равен как у desktop то не ставим его
			if (state && allCss["desktop"][property] == value) continue;
			
			content += '\r\n'+tabProperty+property+': '+value+';';
		}

		return content;
	}


/************************************************************************************/
	
	this.addStyleBlockPlaceholder = function(css, elmClass, style, tabBlock)
	{
		var color = css["placeholder"];
		if (!color) return style;

		var styleBody = ' {color: '+color+';}';

		// потому что бывает список тегов
		var elmClassWeb = elmClass.replace(/"],/gim, '"]::-webkit-input-placeholder,');
		var elmClassMoz1 = elmClass.replace(/"],/gim, '"]::-moz-placeholder,');
		var elmClassMoz2 = elmClass.replace(/"],/gim, '"]:-moz-placeholder,');
		var elmClassMs = elmClass.replace(/"],/gim, '"]:-ms-input-placeholder,');
		
		style += '\r\n'+tabBlock+elmClassWeb+'::-webkit-input-placeholder'+styleBody;
		style += '\r\n'+tabBlock+elmClassMoz1+'::-moz-placeholder'+styleBody;
		style += '\r\n'+tabBlock+elmClassMoz2+':-moz-placeholder'+styleBody;
		style += '\r\n'+tabBlock+elmClassMs+':-ms-input-placeholder'+styleBody;
		style += "\r\n";

		return style;
	}


/***********************************************************************************/
	/**
	* Добовляет дополнительный шрифт
	*
	* @see 	this.getStyleElm()
	*/
	this.listAddedFont = {};
	this.addAddedFont = function(css)
	{
		var font = css["font-family"];
		if (!font) return false;
		font = font.replace(/'|"/gim, '');

		if (font != "Arial"
			&& font != "Times New Roman"
			&& font != "Courier"
			&& font != "Georgia"
			&& font != "Verdana"
			&& font != "Geneva") {

			var listFont = Formating.site.font;

			// при просмотре
			var isStyle = false;
			if (!listFont) {
				listFont = Formating.site.data.added_font;
				isStyle = true;
			}

			if (listFont[font]) {
				// если это страница и этот font добавлен у страницы
				if (this.currentPageType == "page" && Formating.site.added_font[font]) return false;

				// локальный шрифт
				if (listFont[font]["local"]) {
					link = "local";
				// google font
				} else {
					var link = isStyle ? listFont[font] : listFont[font]["link"];
					
					// экранируем
					link = escape(link);
				}

				// если нет символов
				if (link != "local" && !link.match(/subset/gim)) {
					link += "&subset=cyrillic,latin";
				}
				
				// добавляем в список
				this.listFontLocal[listFont[font]["family"]] = link;

				if (!this.currentPage["added_font"]) this.currentPage["added_font"] = {};
				this.currentPage["added_font"][font] = link;
			}
		}
	}

/**************************************************************************************/
/***************************************************************************************/
	
	/**
	* Порядок стилей
	*
	*
	*/
	this.listOrderProperty = {
				"display":true,
				"position":true, "top":true, "bottom":true, "left":true, "right":true,
				"z-index":true, "overflow":true,
				"width":true, "min-width":true, "max-width":true, "height":true, "min-height":true, "max-height":true, "float":true, 
				"margin":true, "margin-top":true, "margin-bottom":true, "margin-left":true, "margin-right":true,
				"padding":true, "padding-top":true, "padding-bottom":true, "padding-left":true, "padding-right":true,
				"text-align":true, "font-size":true, "font":true, "line-height":true, "letter-spacing":true, 
				"font-family":true, "font-weight":true, "font-style":true, "text-decoration":true, "color":true, "text-transform":true,
				"background":true, "background-size":true, "background-attachment":true, "background-color":true,
				
				"border":true, 
				"border-top":true, "border-bottom":true, "border-left":true, "border-right":true,
				"border-color":true, "border-width":true, 
				"border-style":true, "border-top-style":true, "border-bottom-style":true, "border-left-style":true, "border-right-style":true, 
				"border-radius":true, "border-top-left-radius":true, "border-top-right-radius":true, "border-bottom-left-radius":true, "border-bottom-right-radius":true, 
				
				"box-shadow":true, "text-shadow":true, "opacity":true, "transform":true, "transition":true, 
				
				"animation-delay":true, "animation-duration":true,
				};
				
/****************************************************************************************/
	

	this.getListClassBasicType = function(listClass)
	{
		if (!listClass) listClass = {};

		// 
		listClass["hlp-section > .hlp-section-content"] = this.getClassProperty("unique", "section > .hlp-section-content");
		listClass["site"] = this.getClassProperty("unique", "site");
		listClass["hlp-site"] = this.getClassProperty("unique", "hlp-site");
		listClass["hlp-section"] = this.getClassProperty("unique", "section");
		listClass["hlp-section-content"] = this.getClassProperty("unique", "section-content");
		
		// basic type
		listClass["hlp-type-heading1"] = this.getClassProperty("unique", "heading", "hlp-type-heading1");
		listClass["hlp-type-heading2"] = this.getClassProperty("unique", "heading", "hlp-type-heading2");
		listClass["hlp-type-heading3"] = this.getClassProperty("unique", "heading", "hlp-type-heading3");
		listClass["hlp-type-heading4"] = this.getClassProperty("unique", "heading", "hlp-type-heading4");

		listClass["hlp-type-text1"] = this.getClassProperty("unique", "text", "hlp-type-text1");
		listClass["hlp-type-text2"] = this.getClassProperty("unique", "text", "hlp-type-text2");
		listClass["hlp-type-text3"] = this.getClassProperty("unique", "text", "hlp-type-text3");
		listClass["hlp-type-text4"] = this.getClassProperty("unique", "text", "hlp-type-text4");

		listClass["hlp-but"] = this.getClassProperty("unique", "button", "hlp-but");
		listClass["hlp-row"] = this.getClassProperty("unique", "row", "hlp-row");
		listClass["hlp-col"] = this.getClassProperty("unique", "column", "hlp-col");
		
		// mobile
		listClass["hlp-nav-panel-mobile"] = this.getClassProperty("unique", "hlp-nav-panel-mobile");
		listClass["hlp-nav-mobile"] = this.getClassProperty("unique", "hlp-nav-mobile");
		listClass["hlp-nav-mobile > .hlp-nav-item-mobile"] = this.getClassProperty("unique", "hlp-nav-item-mobile");

		return listClass;
	}

/****************************************************************************************/
	
} // end class
