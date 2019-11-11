var Html = new Html();
function Html() {
	/**
	* Форматирует html
	*
	* @see 	this.formatingList()
	*/
	this.formating = function(buffer)
	{
		if (!Formating.isOperatorShow()) {
			var sliderArrowNext = buffer.find(".hlp-slider-arrow-img-next");
			if (sliderArrowNext.attr("src") == "/site/frame/widget/slider/s1/images/arrow_next.png") {
				sliderArrowNext.attr("src", "images/hlp_main/hlp_slider/arrow_next.png");
			}

			var sliderArrowPrev = buffer.find(".hlp-slider-arrow-img-prev");
			if (sliderArrowPrev.attr("src") == "/site/frame/widget/slider/s1/images/arrow_prev.png") {
				sliderArrowPrev.attr("src", "images/hlp_main/hlp_slider/arrow_prev.png");
			}
		}
		
		/********/
		this.convertOldVersion(buffer);
		/********/
		
		buffer.find(".text, .heading, .hlp-li, .button, .image, .hlp-self-video, .hlp-nav-item").addClass("hlp-customizer-elm");
		
		this.setPrivatyPolicy(buffer);

		// фиксируем виджеты
		Widget.set(buffer);
		// очищаем
		this.clearHtml(buffer);
		this.clearRemovedClass(buffer);
		this.clearLongreads(buffer);
		// ставим ссылки
		this.setElmLink(buffer);
		// оброботка для формы
		this.setPropertyForm(buffer);
		// форматируем модальные окна
		this.formatingModal();
		//форматируем
		this.formatingPage();
		//очистка после 
		this.clearHtmlAfter();
		// установка параметров экспорта
		this.setPropertyExport(buffer);
		/**************/
		// костомизация
		var listElmCust = $(".hlp-customizer-elm");
		this.setCustomizerElm(listElmCust);
		listElmCust.removeClass("hlp-customizer-elm");
		// последний атрибут
		this.clearEditorAttr(buffer.find("*"));
		/**************/

		// lazy load
		this.setLazyLoad(buffer);

		var pageHtml = $(".contentBoofer").html();

		// последняя очистка 
		pageHtml = pageHtml.replace(/\<\!\-\-\?/gim, "<?");
		pageHtml = pageHtml.replace(/\-\-\>/gim, ">");
		pageHtml = pageHtml.replace(/allowfullscreen="true"/gim, "allowfullscreen");

		pageHtml = pageHtml.replace(/<strike>/gim, '<s>');
		pageHtml = pageHtml.replace(/<\/strike>/gim, '</s>');
		pageHtml = pageHtml.replace(/[\r\n]+[\t]+[\r\n]+/gim, '\r\n');

		return pageHtml;
	}

	/** 
	* Для старых слайдеров
	*
	*
	*/
	this.convertOldVersion = function(buffer)
	{
		buffer.find(".hlp-slider").each(function() {
			var sliderObj = $(this);
			var listArrowImg = sliderObj.find(".hlp-slider-arrow-img");

			// если не старый слайдер
			if (!listArrowImg.hasClass("element")) {
				return false;
			}

			// убираем класс
			listArrowImg.removeClass("element")
						.removeAttr("elm-type")
						.removeAttr("data-id");
			listArrowImg.off("mousedown");

			sliderObj.find(".hlp-slider-arrow").attr("elm-type", "hlp-slider-arrow-img");
			// arrow prev
			var butArrowPrev = sliderObj.find(".hlp-slider-arrow-prev");
			butArrowPrev.attr("class", "element hlp-slider-arrow-prev hlp-slider-arrow");
			// arrow next
			var butArrowNext = sliderObj.find(".hlp-slider-arrow-next");
			butArrowNext.attr("class", "element hlp-slider-arrow-next hlp-slider-arrow")
					.attr("position-side", "t-r");

			// добавляем класс
			var elmListBullet = sliderObj.find(".hlp-slider-list-bullets");
			elmListBullet.attr("class", "element hlp-slider-list-bullets")
						.attr("elm-type", "hlp-slider-list-bullets")
						.attr("position-side", "b-l");
		});
	}

/********************************************************************************************/
	/**
	* Очистить 
	*
	* @see 	this.formatingHtml()
	*/
	this.clearHtml = function(buffer)
	{
		buffer.find(".addedBlock, .sectionAddedPanel, .resizeBlock, .scaleWrap, .guides, .grid, .selfVideoBlackout, .selfElementBlackout, .butAddTemplate").remove(); //линейка

		var listElm = buffer.find(".element"); 
		//убираем классы
		listElm.removeClass("element");
		listElm.removeClass("elementSelected");

		// заменяем классы
		listElm.filter("[class~='parentColumn']").removeClass("parentColumn")
												.addClass("list-column");
	}


	this.clearLongreads = function(buffer)
	{
		buffer.find(".longreads-section").remove();
	}


	this.clearRemovedClass = function(buffer)
	{
		buffer.find("*[data-remove-class]").filter(function() {
			var elm = $(this);
			elm.removeClass(elm.attr("data-remove-class"));
		});
	}

	this.setCustomizerElm = function(listElmText)
	{
		Formating.setCustomizerElm(listElmText);
	}
/*********************************************************************************************/
	/**
	* Очистка после
	*
	* @see 	this.formatingHtml()
	*/
	this.clearHtmlAfter = function(buffer)
	{
		if (!buffer) buffer = $(".contentBoofer");

		buffer.find(".listElmBasicType").remove();

		// очищам классы базового типа
		this.clearClassBasicType(buffer);
		// убираем классы
		this.clearUnnecessaryClass(buffer);
		// для тригеров
		this.replaceClassTriger(buffer);
		// заменяем некоторые атрибу
		this.replaceCustomerAllAttrs(buffer);
		// для изобрежений
		this.setImageAttrAltEmpty(buffer);
		// установка классов для анимации
		this.setClassAnimated(buffer);

		buffer.find("*[class='']").removeAttr("class");
		buffer.find("*[name='']").removeAttr("name");
		buffer.find("*[value='']").removeAttr("value");
		buffer.find("*[placeholder='']").removeAttr("placeholder");
		buffer.find(".show-element").removeClass("show-element");
	}

	this.clearEditorAttr = function(elm)
	{
		elm.removeAttr("class-unique")
				.removeAttr("class-added")
				.removeAttr("elm-type")
				.removeAttr("data-id")
				.removeAttr("hlp-export-code-status")
				.removeAttr("hlp-export-code-position");

		elm.filter(function() {
			if (!$(this).attr("class")) $(this).removeAttr("class");
		});
	}

	this.clearClassBasicType = function(buffer)
	{
		var attrBasicTypeV = "data-basic-type";
		var listElmV = buffer.find("*["+attrBasicTypeV+"]");
		var countElm = listElmV.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elm = listElmV.eq(iElm);
			var elmClassType = elm.attr(attrBasicTypeV);

			if (elmClassType == "hlp-type-sub-title") {
				elm.addClass("hlp-subtitle");
			} else if (elm.hasClass("button")) {
				// elm.addClass("hlp-but");
			} else if (elmClassType == "hlp-video" 
						|| elmClassType == "hlp-map"
						|| elmClassType == "hlp-form"
						|| elmClassType == "hlp-section-content"
						|| elmClassType == "hlp-row"
						|| elmClassType == "hlp-col") {
				continue;
			}

			elm.removeClass(elmClassType);
		}

		listElmV.removeAttr(attrBasicTypeV);
	}

	this.setClassAnimated = function(buffer)
	{
		buffer.find("*[data-hlp-animated-load]").filter(function() {
			return !$(this).closest(".hlp-modal").length;
		}).addClass("hlp-hide");
	}

/*********************************************************************************/



	this.isDownHtml = function()
	{
		if (Formating.typeOperation == "show") {
			return false;
		} else {
			return true;
		}
	}

	this.addClassFirst = function(buffer, classV)
	{
		buffer.find("."+classV)
				.removeClass(classV)
				.filter(function() {
					var elmItem = $(this);
					var newClass = classV+" "+elmItem.attr("class");
					elmItem.attr("class", newClass.trim());
				});	
	}

	this.setImageAttrAltEmpty = function(buffer)
	{
		buffer.find("img").not("[alt]").attr("alt", "").attr("title", "");
		buffer.find("a[alt]").filter(function() {
			var elmA = $(this);
			var aTitle = elmA.attr("title");
			elmA.find("> img").attr("title", aTitle).attr("alt", aTitle);
			return true;
		}).removeAttr("alt").removeAttr("title");
	}

	this.replaceClassTriger = function(buffer)
	{
		// video timer
		buffer.find(".hlp-triger-videotimer-hide-replace")
				.removeClass("hlp-triger-videotimer-hide-replace")
				.addClass("hlp-triger-videotimer-hide");
	}

/*************************************************************************************/
	
	/**
	* Lazy Load
	*/
	this.setLazyLoad = function(buffer)
	{
		if (this.isLazyLoadRunning()) {
			var listImgLazy = this.getListLazyLoadImg(buffer);
			var obj = this;
			listImgLazy.filter(function() {
				obj.setLazyLoadAttr($(this));
			});
		}
	}

	this.setLazyLoadAttr = function(elmImg)
	{
		var elmImgSelf = elmImg.find("> img");
		if (elmImgSelf.length) elmImg = elmImgSelf;
		var imgSrc = elmImg.attr("src");
		if (!elmImg.attr("data-original")) {
			elmImg.attr("data-original", imgSrc).attr("src", '');
		}
	}

	this.getListLazyLoadImg = function(buffer)
	{
		var listImg = buffer.find(".hlp-img");
		var listSection = buffer.find(".hlp-section");
		listImg = listImg.filter(function() {
			var elm = $(this);
			var elmSection = elm.closest(".hlp-section");
			var sectionIndex = listSection.index(elmSection);
			
			// первые 2 секции
			if (elmSection.length && (sectionIndex == 0 || sectionIndex == 1)) {
				return false;
			} else if (elm.closest(".hlp-slider").length || elm.closest(".hlp-tabs").length || elm.closest(".hlp-nav-panel-mobile").length) {
				return false;
			// анимация 
			} else if (elm.closest("*[data-hlp-animated-scroll]").length || elm.closest("*[data-hlp-animated-load]").length) {
				return false;
			} else {
				return true;
			}
		});

		return listImg;
	}

	this.isLazyLoadRunning = function()
	{
		return Formating.site.data.lazyload_running;
	}
/*************************************************************************************/

	/**
	* Заменяем пользовательские атрибуты
	*
	*
	*/
	this.replaceCustomerAllAttrs = function(buffer)
	{
		this.replaceCustomerAttr(buffer, "data-hlp-elm-id");
		this.replaceCustomerAttr(buffer, "data-hlp-elm-class");
		this.replaceCustomerAttr(buffer, "data-hlp-elm-attr");
	}

	this.replaceCustomerAttr = function(buffer, attrName)
	{
		var listElm = buffer.find("["+attrName+"]");
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm); 
			var elmAttrValue = elmItem.attr(attrName);
			elmItem.removeAttr(attrName);
			if (!elmAttrValue) continue;

			// id 
			if (attrName == "data-hlp-elm-id") {
				elmAttrValue = elmAttrValue.trim().replace(/[^\w\-]+/gim, '');
				elmItem.attr("id", elmAttrValue);
				continue;
			}

			// class и атрибуты
			elmAttrValue = this.replaceQuote(elmAttrValue);
			var listAttrValue = JSON.parse(elmAttrValue);

			for (var iAttr in listAttrValue) {
				var attrItem = listAttrValue[iAttr]["property"];

				// для класс
				if (attrName == "data-hlp-elm-class") {
					elmItem.addClass(attrItem["attr-class"]);
				} else {
					var attrItemPartKey = attrItem["attr-key"];
					if (!attrItemPartKey) continue;
					var attrItemPartValue = attrItem["attr-value"]
					elmItem.attr(attrItemPartKey, attrItemPartValue);
				}

			} // end two for
		} // end first for
	} // end function


	this.replaceQuote = function(text)
	{
		text = text.replace(/@@@@@quote_1@@@@@/gim, '\'');
		text = text.replace(/@@@@@quote_2@@@@@/gim, '\"');
		
		return text;
	}

/**********************************************************************************/
	// ставим ссылки элементам
	this.setElmLink = function(buffer)
	{
		var listElm = buffer.find(".block, .text, .heading, .hlp-li");
		var countElm = listElm.length;

		for (var iElm = 0; iElm < countElm; iElm++) {
			var elm = listElm.eq(iElm);

			if (!this.isElmLink(elm)) continue;

			var isTextElm = !elm.hasClass("block");
			if (isTextElm) {
				var elmContenV = elm.find("> .element-content");
				if (!elmContenV.length) elmContenV = elm; 
				var content = elmContenV.html();
			} else {
				var content = '';
			}

			

			var dataAction = elm.attr("data-action");
			if (dataAction == "page" || dataAction == "download") {
				var dataValue = elm.attr("data-value");
				if (!dataValue) dataValue = '';
				var attrDataValue = 'data-value="'+dataValue+'"';
			} else {
				var dataValue = elm.attr("href");
				if (!dataValue) dataValue = '';
				var attrDataValue = 'href="'+dataValue+'"';
			}

			if (dataAction == "download") {
				elm.removeAttr("data-action").removeAttr("data-value");
			}
				
			var target = elm.attr("target");
			var targetAttr = target == "_blank" ? ' target="_blank"' : '';
			
			// elm.removeAttr("data-action")
				// .removeAttr("data-value")
				// .removeAttr("target");
				
			var attrClass = ' class="hlp-block-link"';
			if (isTextElm) {
				var link = '<a'+attrClass+' data-action="'+dataAction+'"'+targetAttr+' '+attrDataValue+'></a>'+content;
				
				elmContenV.html(link);
				elm.addClass("hlp-element");
			} else {
				var link = '<a'+attrClass+' data-action="'+dataAction+'"'+targetAttr+' '+attrDataValue+'>'+content+'</a>';
				elm.prepend(link);
			}

		}
	}

/**********************************************************************************/
	/**
	* Установка параметров для формы
	*
	*
	*/
	this.setPropertyForm = function(buffer)
	{
		var listForm = buffer.find(".form");
		var countForm = listForm.length;

		for (var iElm = 0; iElm < countForm; iElm++) {
			var elm = listForm.eq(iElm);
			var listRadio = elm.find("input[type='radio']");
			var countRadio = listRadio.length;
			var listType = {};
			for (var iRadio = 0; iRadio < countRadio; iRadio++) {
				var radio = listRadio.eq(iRadio);
				var radioName = radio.attr("name");
				if (!listType[radioName]) {
					listType[radioName] = true;
					radio.attr(this.getAttrHlpChecked(), "true");
				}
			}
		}

		// установка action при скачивании only_html
		if (Formating.isCmsNameOnlyHtml()) {
			listForm.filter(function() {
				if (!$(this).attr("action")) {
					$(this).attr("action", "hlp_form/index.php");
				}
			});
		}
	}

	this.getAttrHlpChecked = function()
	{
		return "data-hlp-checked";
	}

/**********************************************************************************/
	/**
	* Установка параметров при экспорте элементов
	*
	*
	*/
	this.setPropertyExport = function(buffer)
	{
		// замена кода
		this.setPropertyExportCode(buffer);
	}

	this.setPropertyExportCode = function(buffer)
	{
		var listElmCode = buffer.find(".hlp-element-code");
		var countElmCode = listElmCode.length;

		for (var iElm = (countElmCode-1); iElm >= 0; iElm--) {
			var elmCode = listElmCode.eq(iElm);
			var code = elmCode.html().trim();

			if (code) code = this.replaceQuote(code);
			else code = "";

			var elm = elmCode.parent();
			var codeStatus = elm.attr("hlp-export-code-status");
			var codePosition = elm.attr("hlp-export-code-position");

			if (codeStatus != "yes") {
				elmCode.remove();
				continue;
			}

			// вставляем код внутрь
			if (codePosition == "insert") {
				elm.html(code);
			} else {
				elm.after(code);
				elm.remove();
			}
			elmCode.remove();
		}
	}
	
	/**
	*
	*
	* @see 	this.getElmBlock()
	* @see 	this.getElmContent()
	*/
	this.isElmCodeReplace = function(elm)
	{
		return elm.attr("hlp-export-code-status") == "yes";
	}

/********************************************************************************************/
/***********************************************************************************************/
	/**
	* Форматирование
	*
	*
	*/
	this.formatingPage = function()
	{
		var step = Formating.isSiteTypeSite() ? 2 : 1;
		// очищаем от пробельных символов
		$(".contentBoofer").html($(".contentBoofer").html().replace(/[\r\r\n\t]/g, ''));
		// формируем элементы
		this.formatingElements($(".contentBoofer"), step);
		// убираем пустые строки
		var content = $(".contentBoofer").html().replace(/\t+\r?\n/g, '').trim()+"\r\n";
		var tab = step ? this.getTabs(step+1) : "\t";
		$(".contentBoofer").html(tab+content);
	}

	/**
	* Форматируем потомки элемента
	*
	* @see 	this.formatingPage()
	*/
	this.formatingElements = function(parent, steps)
	{
		if (!steps) var steps = 0;
		steps++;

		var list_elm = parent.children().not("br, b, i, u, strong, strike, span, .text-span");
		var count = list_elm.length;
		
		for (var i=0; i<count; i++) {
			var elm = list_elm.eq(i);

			if (elm.hasClass("text") || elm.hasClass("heading")) {
				var listSpan = elm.find(".text-span");
				var countSpan = listSpan.length;
				for (var iSpan = 0; iSpan < countSpan; iSpan++) {
					var elmSpan = listSpan.eq(iSpan);
					this.formatingElm(elm, elmSpan, steps);
				}
			}

			// формируем элемент
			var newElm = this.formatingElm(parent, elm, steps);
			
			// если есть потомки то рекурсия
			if (newElm.children().length && !newElm.hasClass("text-span")) {
				// var steps_child = newElm.hasClass("section") ? steps+1 : steps;

				// для карты при скачивании 
				if (newElm.hasClass('map')) {
					var elmScriptObj = newElm.find("script");
					var elmSrc = escape(elmScriptObj.attr("src"));
					elmScriptObj.removeAttr("src");
					elmScriptObj.attr("src-map", elmSrc);
				}
				
				var steps_child = steps;
				this.formatingElements(newElm, steps_child);
			} 
			
		}
	}

	/**
	* Форматируем элемент
	*
	* @see 	this.formatingElements()
	*/
	this.formatingElm = function(parent, elm, steps)
	{
		// форматированый элемент
		var tabs_start  = this.getTabs(steps);
		// var tabs_end = this.getTabs(steps-1);
		var tabs_end = this.getTabs(steps-1);
		
		var elm_block = this.getElmBlock(elm, tabs_start);

		// вставляем элемент
		if (elm.hasClass("text-span")) {
			elm.after(elm_block);
		} else {
			var formating_elm_block = "\r\n"+tabs_start+elm_block+"\r\n"+tabs_end;
			parent.append(formating_elm_block);
		}

		elm.remove();// убираем старый элемент
		var newElm = parent.find("[new-element='true']");// новый элемент
		
		// убираем не нужный класс
		newElm.removeAttr("new-element");
			
		return newElm
	}

	/**
	* Отдает html блока
	*
	* @return 	htlm-блок
	* @uses 	this.formatingElm()
	*/
	this.getElmBlock = function(elm, tabs_start)
	{
		var style = elm.attr("style");
		var elmDataId = elm.attr("data-id");
		var elmClass = elm.attr("class");
		if (elmClass) elmClass = elmClass.replace(/\s?undefined/gim, '');
		var id = elm.attr("id");
		var attr_class_unique = elm.attr("class-unique");
		var elmType = elm.attr("elm-type");

		if (elmClass) elmClass = elmClass.replace(/\s{2,}/, " "); 
		var actionType = elm.attr("data-action");
		var actionValue = elm.attr("data-value");
		// дополнительные
		var attr_added = this.getAttrAdded(elm, actionType, actionValue);

		// если изображение
		if (elm.hasClass("image") && !this.isElmLink(elm) && !this.isElmCodeReplace(elm)) {
			elm = elm.find("img");
		}

		var tagName = elm.prop("tagName");
		var content = this.getElmContent(elm, tabs_start);
		
		// для кнопки
		if (this.isElmLink(elm) && !this.isLinkContent(elm)) {
			tagName = "A";
		} else if (elm.hasClass("text")) {
			tagName = "P";
		} else if (tagName == "A" && elm.attr("class")) {
			tagName = "DIV";
		} else if (elm.hasClass("hlp-but")) {
			if (actionType == "modal" || actionType == "section") {
				tagName = "A";
			}
		}

		// для секции
		if (elm.hasClass("section")) {
			var isHeadingElm = elm.find("> .section-content > .heading").length;
			if (isHeadingElm) tagName = "SECTION";
			else tagName = "DIV";
		}

		// стандартные атрибуты
		var attr_id = id && !elm.hasClass("section") ? 'id="'+id+'"' : '';	
		var attr_class = elmClass ? 'class="'+elmClass+'"' : '';
		var attr_style = style ? 'style="'+style+'"' : '';
		if (attr_class_unique) attr_class_unique = 'class-unique="'+attr_class_unique+'"';
		else attr_class_unique = '';

		// атрибуты
		var attr_main = this.getAttrMain(elm, tagName);
		var attr_specific = this.getAttrSpecific(elm, tagName);

		if (elmDataId) {
			attr_main += ' data-id="'+elmDataId+'"';
			if (Formating.isCmsNameHollpee() && this.isElmEdit(elm, tagName)) {
				attr_main += ' data-hlp-id="'+elmDataId+'"';
			}
		}

		// тип элемента
		if (elmType) attr_main += ' elm-type="'+elmType+'"';

		// формируем блок
		var block = '<'+tagName+' '+attr_class_unique+' '+attr_main+' new-element="true" '+attr_class+' '+attr_specific+' '+attr_style+' '+attr_added+'>'+content+'</'+tagName+'>';

		return block;
	}

	this.isElmLink = function(elm, actionType)
	{
		if (!actionType) actionType = elm.attr("data-action");
		if (actionType == "page" 
				|| actionType == "link" 
				|| actionType == "download"
				|| actionType == "contact") {
			return true;
		} else {
			return false;
		}
	}

	this.isLinkContent = function(elm)
	{
		if (elm.hasClass("text") 
				|| elm.hasClass("heading") 
				|| elm.hasClass("hlp-li")
				|| elm.hasClass("block")) {
			return true;
		} else {
			return false;
		}
	}

	this.isElmEdit = function(elm, tagName)
	{
		if (elm.hasClass("text") 
				|| elm.hasClass("heading")
				|| elm.hasClass("button")
				|| elm.hasClass("hlp-video")
				|| elm.hasClass("hlp-nav-item")
				|| elm.closest(".hlp-img").length
				|| elm.prop("tagName") == "LI"

				) {
			return true;
		} else {
			return false;
		}
	}

/********************************************************************************************/
	/**
	* Отдает оснавные атрибуты
	*
	* @see 	this.getElmBlock()
	*/
	this.getAttrMain = function(elm, tagName)
	{
		var attr_main = '';
		if (tagName == "A") {
			var hrefValue = this.getHref(elm, elm.attr("data-action"));
			attr_main += 'href="'+hrefValue+'"';

			// при просмотре 
			if (elm.attr("data-action") == "page" 
					&& Formating.typeOperation != "download"
					&& elm.attr("data-value")) {
				attr_main += ' data-hlp-action-page="'+elm.attr("data-value")+'"';
			}

			elm.removeAttr("data-action").removeAttr("data-value");
		}

		// src
		var elmSrc = elm.attr("src");
		if (elmSrc) {
			if (!elm.closest(".modal").length) {
				elmSrc = elmSrc.replace(/autoplay\-yes/gim, "autoplay");
			}

			if (tagName == "IFRAME" && elm.parent().hasClass("hlp-bg-video-content")) {
				if (elmSrc.match(/youtube/gim)) elmSrc += "&autoplay=1";
				else elmSrc += "&autoplay=true";
			}

			elmSrc = escape(elmSrc);
			attr_main += ' src="'+elmSrc+'"';
		}

		if (elm.hasClass("radio") && elm.attr(this.getAttrHlpChecked())) {
			attr_main += ' checked="checked"';
		}

		return attr_main;
	}


	/**
	* Отдает дополнительные атрибуты
	*
	*
	*
	*/
	this.getAttrAdded = function(elm, actionType, actionValue)
	{
		var attr = '';
		
		// заголовок
		var title = elm.attr("title");
		if (elm.hasClass("gallery-image")) {
			elm.find("> img").attr("alt", elm.attr("alt")).attr("title", elm.attr("title"));
		} else if (title) {
			attr += 'alt="'+title+'" title="'+title+'"';
		} else if (elm.hasClass("image") || elm.parent().hasClass("gallery-image")) {
			attr += 'alt="" title=""';
		}

		// действие
		if (actionType && actionType != "page" 
						&& actionType != "link"
						&& actionType != "contact"
						// && actionType != "download"
						&& actionType != "none") {
			attr += ' data-hlp-action="'+actionType+'"';

			// для модального
			if (actionType == "modal") {
				// actionValue = actionValue.replace(/[^0-9]+/gim, '');
			}

			if (actionValue && actionType != "download") {
				attr += ' data-hlp-value="'+actionValue+'"';
			}
		} else if (actionValue == "section-fixed") {
			attr += ' data-hlp-value="'+actionValue+'"';
		}

		return attr;
	}

	/**
	*
	*
	*
	*/
	this.getAttrYandexGoal = function(attr_specific, elm)
	{
		var eventId = elm.attr("data-hlp-ya-eventid");
		if (!eventId) return attr_specific;
		
		var page = this.getPage();
		var counterId = page.data.yandex_counter_id;
		if (!counterId) return attr_specific;

		var eventName = elm.hasClass("form") || elm.hasClass("submit") ? "onsubmit" : "onclick";
		attr_specific += " "+eventName+'="yaCounter'+counterId+'.reachGoal(\''+eventId+'\'); return true;"';
		
		return attr_specific;
	}

	this.getPage = function()
	{
		return Formating.page;
	}

/*******************************************************************************************/	
	/**
	* Отдает содержимое элемента
	*
	* @see 	this.getElmBlock()
	*/
	this.getElmContent = function(elm, tabs_start)
	{
		if (this.isElmContentText(elm)) {
			// замена на код
			if (this.isElmCodeReplace(elm)) {
				// что бы он не прошел, потому что его уже нет в выборке
				var textElmContentV = elm.find("> .element-content");
				textElmContentV.after(textElmContentV.html());
				textElmContentV.remove();
				// отдаем содержимое
				return elm.html();
			}
			
			var elmContent = elm.find(">.element-content");
			if (!elmContent.length) elmContent = elm;

			//если не стоит цвет 
			var isContentColor = elmContent.attr("is-color") == "true";
			if (isContentColor) var content = elm.html(); 
			else var content = elmContent.html();

			// для текста
			if (elm.hasClass("text") || elm.hasClass("heading")) {
				content = this.setTabForTextContent(elm, content, tabs_start);
			}

			return content;
		} else if (elm.hasClass("embed")) {
			var embedConten = elm.find("> .element-content, > .hlp-element-content").html();
			embedConten = "\r\n\t"+tabs_start+embedConten+"\r\n"+tabs_start;
			return embedConten;
		} else {
			return elm.html();
		}
	}

	this.isElmContentText = function(elm)
	{
		if (elm.hasClass("text") 
				|| elm.hasClass("heading")
				|| elm.hasClass("button")
				|| elm.hasClass("nav-item")
				) {
			return true;
		} else {
			return false;
		}
	}


	/**
	* Ставит tab для содержимого текста 
	*
	* @see 	this.getElmContent()
	*/
	this.setTabForTextContent = function(elm, content, tabs_start)
	{
		if (!content) return content;

		var tabs_end = "\r\n" + tabs_start;
		tabs_start = "\r\n\t" + tabs_start;
		
		// очищаем
		content = content.trim();
		content = content.replace(/\s+/i, ' ');
		content = content.replace(/<br\/?>$/i, '');

		if (content.match(/hlp-element-content/gim)) {
			content = elm.find("> .hlp-element-content").html();
			content = '<span class="hlp-element-content">'+content+'</span>';
		}
			
		return content;
	}

/*********************************************************************************/

	/**
	* Получить определеное количество tabs
	* 
	* @param 	int 	count-количество tabs
	* @uses 	this.formatingElm()
	*/
	this.getTabs = function(count)
	{
		var text = "";
		for (var i=0; i<count; i++) {
			text += "\t";
		}
		return text;
	}

	/**
	* Отдает href 
	*
	* @see 	this.getElmBlock()
	* @see 	this.getAttrSpecific()
	*/
	this.getHref = function(elm, type)
	{
		var href = '';
		if (type == "page") {
			var actionPageId = elm.val();
			if (!actionPageId) actionPageId = elm.attr("data-value");
			if (!actionPageId) return '';
			if (!Formating.site.pages[actionPageId]) return '';

			var actionPageName = Formating.site.pages[actionPageId]["url_name"];

			if (actionPageId != "none") {
				if (Formating.typeOperation == "show") {
					href = location.pathname + "?page_id="+actionPageId;
				} else if (Formating.isCmsNameHollpee()) {
					// href = Formating.site.site_id+"_"+actionPageId+".php";
					href = actionPageName;
					if (actionPageName == "index") href = "index.php";
				} else if (Formating.isCmsNameWp()) {
					if (actionPageName == "index") href = "/";
					else href = "/"+actionPageName;
				} else {
					href = actionPageName;
					href += Formating.isFileTypeHtml() ? ".html" :  ".php";
				}
			}
		} else if (type == "download") {
			var nameDownFile = elm.attr("data-value");
			if (!nameDownFile) nameDownFile = "file_down.txt";
			href = "files/hlp_download.php?file="+nameDownFile;
		} else {
			href = elm.attr("href");
			href = escape(href);
		} 

		if (!href || href == "undefined") href = '';

		return href;
	}
/***************************************************************************************************/
/***************************************************************************************************/
	/**
	* Форматируем модальные окна
	*
	* @see 	this.formatingHtml()
	*/
	this.formatingModal = function()
	{
		var buffer = $(".contentBoofer");
		var elmListModal = buffer.find(".listModal");	

		if (!elmListModal.length) return false;

		// заменяем классы у оболочки
		elmListModal.attr("class", "list-modal");
		
		// убираем оболочку и ставим коментарий модальному окну
		var listModal = buffer.find(".modalWrap");
		var countModal = listModal.length;
		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			var modalHtml = modal.html();
			modalHtml = '<div class="hlp-modal-section">'+modalHtml+'<div class="hlp-modal-blackout"></div></div>';
			modal.replaceWith(modalHtml);
		}
	}

/***********************************************************************************************************/
/***********************************************************************************************************/
		/**
	* Удаляем не нужные классы
	*
	* @see 	this.clearHtmlAfter()
	*/
	this.clearUnnecessaryClass = function(buffer)
	{
		var allElm = buffer.find("*");
		
		// embed
		buffer.find(".hlp-embed > .element-content[class='element-content']").filter("[style='display:none;']").removeAttr("style");

		buffer.find(".modal").removeAttr("id");
			
		buffer.find("iframe").removeAttr("frameborder");
		buffer.find(".false").removeClass("false");
		buffer.find(".true").removeClass("true");
		buffer.find(".text-span").removeClass("text-span");
		buffer.find(".button").removeClass("button").addClass("hlp-but");
		buffer.find(".image").removeClass("image");
		buffer.find(".element-added").removeClass("element-added");
		buffer.find(".nav").removeClass("nav");
		buffer.find(".section-content").removeClass("element-content");
		buffer.find(".form").removeClass("form");
		buffer.find(".text").removeClass("text");
		buffer.find(".heading").removeClass("heading");

		buffer.find(".hlp-ul").removeClass("hlp-ul");
		buffer.find(".hlp-li").removeClass("hlp-li");
		buffer.find(".hlp-ol").removeClass("hlp-ol");

		/*************************************/
		/*************************************/
		buffer.find(".map").removeClass("map");
		buffer.find(".section").removeClass("section");
		buffer.find(".section-content").removeClass("section-content");
		buffer.find(".block").removeClass("block");
		buffer.find(".iframe").removeClass("iframe");
		buffer.find(".embed").removeClass("embed");
		buffer.find(".slider").removeClass("slider");
		buffer.find(".nav-item").removeClass("nav-item");
		buffer.find(".nav-button-mobile").removeClass("nav-button-mobile");
		buffer.find(".nav-panel-mobile").removeClass("nav-panel-mobile");
		buffer.find(".list-nav-item").removeClass("list-nav-item").addClass("hlp-list-nav-item");
		buffer.find(".video-wrap").removeClass("video-wrap");
		buffer.find(".video").removeClass("video");
		buffer.find(".self-video").removeClass("self-video");
		buffer.find(".element-content").removeClass("element-content");
		buffer.find(".modal").removeClass("modal");
		buffer.find(".modal-section").removeClass("modal-section");
		buffer.find(".bg-video").removeClass("bg-video");
		buffer.find(".bg-video-opacity").removeClass("bg-video-opacity");
		buffer.find(".row").removeClass("row");
		buffer.find(".column").removeClass("column");
		
		/**************************************************************/
		/**************************************************************/
		buffer.find(".list-modal").removeClass("list-modal").addClass("hlp-list-modal");
	
		// block
		buffer.find(".float-right").removeClass("float-right").addClass("hlp-float-right");
		buffer.find(".float-right-tl").removeClass("float-right-tl").addClass("hlp-float-right-tl");
		buffer.find(".float-right-tp").removeClass("float-right-tp").addClass("hlp-float-right-tp");
		buffer.find(".float-right-ml").removeClass("float-right-ml").addClass("hlp-float-right-ml");
		buffer.find(".float-right-mp").removeClass("float-right-mp").addClass("hlp-float-right-mp");

		buffer.find(".float-left").removeClass("float-left").addClass("hlp-float-left");
		buffer.find(".float-left-tl").removeClass("float-left-tl").addClass("hlp-float-left-tl");
		buffer.find(".float-left-tp").removeClass("float-left-tp").addClass("hlp-float-left-tp");
		buffer.find(".float-left-ml").removeClass("float-left-ml").addClass("hlp-float-left-ml");
		buffer.find(".float-left-mp").removeClass("float-left-mp").addClass("hlp-float-left-mp");

		buffer.find(".children-float").removeClass("children-float").addClass("hlp-children-float");
		buffer.find(".children-float-tl").removeClass("children-float-tl").addClass("hlp-children-float-tl");
		buffer.find(".children-float-tp").removeClass("children-float-tp").addClass("hlp-children-float-tp");
		buffer.find(".children-float-ml").removeClass("children-float-ml").addClass("hlp-children-float-ml");
		buffer.find(".children-float-mp").removeClass("children-float-mp").addClass("hlp-children-float-mp");

		buffer.find(".children-no-float").removeClass("children-no-float").addClass("hlp-children-no-float");
		buffer.find(".children-no-float-tl").removeClass("children-no-float-tl").addClass("hlp-children-no-float-tl");
		buffer.find(".children-no-float-tp").removeClass("children-no-float-tp").addClass("hlp-children-no-float-tp");
		buffer.find(".children-no-float-ml").removeClass("children-no-float-ml").addClass("hlp-children-no-float-ml");
		buffer.find(".children-no-float-mp").removeClass("children-no-float-mp").addClass("hlp-children-no-float-mp");
		
		buffer.find(".fill-vacuum").removeClass("fill-vacuum");
		buffer.find(".hlp-full-height").removeClass("hlp-full-height");
		buffer.find(".hlp-section-static").removeClass("hlp-section-static");
		
		

		//мобильное меню	
		$(".hlp-nav-mobile").removeClass("nav-mobile");
		$(".hlp-nav-mobile").html(""); 

		// site
		buffer.find(".site").removeClass("site")
					.addClass("hlp-site")
					.addClass("hlp-no-flexbox");

		// непонятно от куда береться
		buffer.find("*").not(".hlp-block")
				.removeClass("hlp-children-no-float")
				.removeClass("hlp-children-no-float-tl")
				.removeClass("hlp-children-no-float-tp")
				.removeClass("hlp-children-no-float-ml")
				.removeClass("hlp-children-no-float-mp");

		// убираем класс block
		var blockNoFloat = buffer.find(".hlp-children-no-float");
		blockNoFloat.removeClass("hlp-children-no-float")
					.removeClass("hlp-block")
					.addClass("hlp-wrap");

		/*ставим вперед класс**********/
		this.addClassFirst(buffer, "hlp-wrap");
		this.addClassFirst(buffer, "hlp-but");
		this.addClassFirst(buffer, "hlp-modal");
		this.addClassFirst(buffer, "hlp-img");
		this.addClassFirst(buffer, "hlp-form");
		/***********/
		// из-за старых шаблонов
		buffer.find(".hlp-type-button").removeClass("hlp-type-button");
		// замена классов
		buffer.find(".hlp-video-wrap").removeClass("hlp-video-wrap").addClass("hlp-video-content");
		
		// классы остались с экспорта
		allElm.removeAttr("hlp-export-class-no-clear");

		// удаляем пустой класс
		buffer.find("*").filter(function() {
			return !$(this).attr("class") ? true : false;
		}).removeAttr("class");
	}	
/*****************************************************************************************/
	/**
	* Отдаем специальные атрибуты
	*
	* @see 	this.getElmBlock()
	*/	
	this.getAttrSpecific = function(elm, tagName)
	{
		// 
		if (tagName == "IMG" && !elm.attr("class")) elm = elm.parent();

		var attr_specific = '';

		if (tagName == "A") {
			if (elm.attr("target") == "_blank") attr_specific += ' target="_blank"';
		} else if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT" || tagName == "OPTION") {
			var value = elm.val();
			var redirectType = elm.attr("redirect-type");
			if (redirectType == "page") value = this.getHref(elm, redirectType);
			var placeholder = elm.attr("placeholder");
			var mask = elm.attr("data-mask");
			var name = elm.attr("name");

			if (value && tagName != "SELECT") attr_specific += 'value="'+value+'" ';
			if (name) attr_specific += 'name="'+name+'" ';
			if (placeholder) attr_specific += 'placeholder="'+placeholder+'" ';
			if (mask) attr_specific += 'data-hlp-mask="'+mask+'" ';
			if (redirectType == "modal") attr_specific += 'data-hlp-redirect-type="modal" ';
		} else if (elm.hasClass("form")) {
			var method = elm.attr("method");
			var action = elm.attr("action");
			if (!action) action = '';
			if (!method) method = 'post';

			attr_specific = 'action="'+action+'" method="'+method+'"'; 
		} else if (tagName == "VIDEO" && !elm.hasClass("video")) {
			var videoPoster = elm.attr('poster');
			var videoLoop = elm.attr("loop");
			if (!videoLoop) videoLoop = ''; 
			attr_specific += 'autoplay '+videoLoop+' muted poster="'+videoPoster+'"';

		} else if (elm.hasClass("section")) {
			var secNum = elm.attr("data-num");
			var isActionSecExist = $("*[data-action='section'][data-value='"+secNum+"']").length;
			if (!isActionSecExist) isActionSecExist = $("*[data-hlp-action='section'][data-hlp-value='"+secNum+"']").length;
			if (isActionSecExist) {
				attr_specific += 'data-hlp-num="'+secNum+'"';
			}
		} else if (elm.hasClass("modal")) {
			var dataNum = elm.attr("data-num");
			if (dataNum) attr_specific += 'data-hlp-num="'+dataNum+'"';
		}

		// для карты
		var elmSrcMap = elm.attr("src-map");
		if (elmSrcMap) {
			attr_specific += ' src-map="'+elmSrcMap+'"';
		}

		var empty = elm.attr("data-empty");
		if (empty) attr_specific += 'data-hlp-empty="'+empty+'" ';

		// пользовательскте атрибуты
		var attrElmId = elm.attr("data-hlp-elm-id");
		if (attrElmId) attr_specific += ' data-hlp-elm-id="'+attrElmId+'" ';
		var attrElmClass = elm.attr("data-hlp-elm-class");
		if (attrElmClass) attr_specific += ' data-hlp-elm-class="'+attrElmClass+'" ';
		var attrElmAttr = elm.attr("data-hlp-elm-attr");
		if (attrElmAttr) attr_specific += ' data-hlp-elm-attr="'+attrElmAttr+'" ';

		// type 
		var type = elm.attr("type");
		if (type) {
			if (type == "hlp-hidden" && elm.hasClass("input")) type = "hidden";
			attr_specific += ' type="'+type+'" ';
		}

		if (elm.hasClass("hlp-self-video")) {
			attr_specific += ' allowfullscreen="true" frameborder="0" ';
		}

		var attrBasicType = elm.attr("data-basic-type");
		if (attrBasicType) attr_specific += ' data-basic-type="'+attrBasicType+'" ';

		/**********************************/
		/**********************************/
		/**анимация**/
		// load
		var attrAnmLoad = elm.attr("data-hlp-animated-load");
		if (attrAnmLoad) attr_specific += ' data-hlp-animated-load="'+attrAnmLoad+'" ';
		// scroll
		var attrAnmScroll = elm.attr("data-hlp-animated-scroll");
		if (attrAnmScroll) attr_specific += ' data-hlp-animated-scroll="'+attrAnmScroll+'" ';
		// hover
		var attrAnmHover = elm.attr("data-hlp-animated-hover");
		if (attrAnmHover) attr_specific += ' data-hlp-animated-hover="'+attrAnmHover+'" ';
		/**********************************/
		/**********************************/

		var attrChecked = elm.attr("checked");
		if (attrChecked) attr_specific += ' checked="'+attrChecked+'" ';
		/****************************/
		// widget
		var butChosen = elm.attr("data-hlp-chosen");
		if (butChosen) attr_specific += ' data-hlp-chosen="'+butChosen+'" ';
		var elmIndexW = elm.attr("data-hlp-index");
		if (elmIndexW) attr_specific += ' data-hlp-index="'+elmIndexW+'" ';
		// slider
		var sliderS2Row = elm.attr("data-glide-dir");
		if (sliderS2Row) attr_specific += ' data-glide-dir="'+sliderS2Row+'" ';
		var sliderAnimate = elm.attr("data-hlp-slider-animate");
		if (sliderAnimate) attr_specific += ' data-hlp-slider-animate="'+sliderAnimate+'" ';
		var sliderDelay = elm.attr("data-hlp-slider-delay");
		if (sliderDelay) attr_specific += ' data-hlp-slider-delay="'+sliderDelay+'" ';
		var sliderDuration = elm.attr("data-hlp-slider-duration");
		if (sliderDuration) attr_specific += ' data-hlp-slider-duration="'+sliderDuration+'" ';
		var sliderArrowNone = elm.attr("data-hlp-slider-arrows-hide");
		if (sliderArrowNone) attr_specific += ' data-hlp-slider-arrows-hide="'+sliderArrowNone+'" ';
		var sliderBulletsNone = elm.attr("data-hlp-slider-bullets-hide");
		if (sliderBulletsNone) attr_specific += ' data-hlp-slider-bullets-hide="'+sliderBulletsNone+'" ';

		// tabs but
		var tabsButEvent = elm.attr("data-hlp-tabs-but-event");
		if (tabsButEvent) attr_specific += ' data-hlp-tabs-but-event="'+tabsButEvent+'" ';
		// export
		var exportCodeStatus = elm.attr("hlp-export-code-status");
		if (exportCodeStatus) attr_specific += ' hlp-export-code-status="'+exportCodeStatus+'" ';
		var exportCodePos = elm.attr("hlp-export-code-position");
		if (exportCodePos) attr_specific += ' hlp-export-code-position="'+exportCodePos+'" ';
		
		/****************************/
		// modal
		var actionFormName = elm.attr("data-hlp-formname");
		if (actionFormName) attr_specific += ' data-hlp-formname="'+actionFormName+'" ';
		// gallery modal
		if (elm.attr("data-hlp-widget-gm")) attr_specific += ' data-hlp-widget-gm="true" ';
		var galleryImgWidth = elm.attr("data-hlp-width");
		if (galleryImgWidth) attr_specific += ' data-hlp-width="'+galleryImgWidth+'" ';
		var galleryImgHeight = elm.attr("data-hlp-height");
		if (galleryImgHeight) attr_specific += ' data-hlp-height="'+galleryImgHeight+'" ';

		/**********/
		// triger
		var trigerType = elm.attr("data-hlp-triger-event");
		if (trigerType) attr_specific += ' data-hlp-triger-event="'+trigerType+'" ';
		var trigerValue = elm.attr("data-hlp-triger-value");
		if (trigerValue) attr_specific += ' data-hlp-triger-value="'+trigerValue+'" ';
		
		// video bg
		var dataServiceType = elm.attr("data-service");
		if (dataServiceType) attr_specific += ' data-service="'+dataServiceType+'" ';
		//yandex goal
		attr_specific = this.getAttrYandexGoal(attr_specific, elm);
		// dynamic name
		var dynamicInputId = elm.attr("data-hlp-dynamic-input-id");
		if (dynamicInputId) attr_specific += ' data-hlp-dynamic-input-id="'+dynamicInputId+'" ';
		var dynamicButtonId = elm.attr("data-hlp-dynamic-button-id");
		if (dynamicButtonId) attr_specific += ' data-hlp-dynamic-button-id="'+dynamicButtonId+'" ';
		var dynamicButtonValue = elm.attr("data-hlp-dynamic-button-value");
		if (dynamicButtonValue) attr_specific += ' data-hlp-dynamic-button-value="'+dynamicButtonValue+'" ';
		/**************/
		// animate
		var attrAnimLoad = elm.attr("data-hlp-load");
		if (attrAnimLoad) attr_specific += ' data-hlp-load="'+attrAnimLoad+'" ';
		


		attr_specific = attr_specific.replace(/\s+/gim, ' ');
		return attr_specific;
	}

/***********************************************************************************************************/
/***********************************************************************************************************/
	// политика конфеденциальности
	this.setPrivatyPolicy = function(buffer)
	{
		var hrefPrivacyPolicy = 'hlp_privacy_policy.php';
		var hrefPersonalData = 'hlp_personal_information.php';

		// политика
		buffer.find(".hlp-privacy-policy-link")
				.attr("data-action", "link")
				.attr("target", "_blank")
				.attr("href", hrefPrivacyPolicy);
		// персональные данные 
		buffer.find(".hlp-personal-data-link")
				.attr("data-action", "link")
				.attr("target", "_blank")
				.attr("href", hrefPersonalData);
	}

/***********************************************************************************************************/

}//end class

