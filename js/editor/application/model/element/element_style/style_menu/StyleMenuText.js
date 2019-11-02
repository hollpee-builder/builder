/**
* 
*
*
*/
StyleMenuText.prototype = StyleMenu;
var StyleMenuText = new StyleMenuText();
function StyleMenuText() {
	/**
	* Установить 
	*
	* @see
	* @see 	StyleFont.addLinkFont()
	*/
	this.set = function(elm)
	{
		if (!elm) elm = Element.obj;

		var sectionText = $(".menuSelfText");

		// если elementText
		if (Element.data.is_show_text) {
			// оказываем и стави текст
			sectionText.css("display", "block");
			this.setText(elm);
		} else {
			sectionText.css("display", "none");
		}

		// шрифт
		var curFontV = elm.css("font-family").replace(/[']+/g, '').replace(/"/gim,'');
		this.setFamily(elm, curFontV);
		// размер
		this.setSize(elm);
		// цвет
		this.setColor(elm);
		// выравнивание
		this.setAlign(elm);
		// стиль
		this.setStyle(elm);
		// тольшина
		this.setWeight(elm, curFontV);
		// межстрочный интервал
		this.setLineHeight(elm);
		// ширина
		this.setWidth(elm);
		// сам текст
		this.setSelfText(elm);
		// фон
		this.setBg(elm);
		// регистр
		this.setTransform(elm);
		// placeholder
		this.setPlaceholder(elm);
		// перенос строки
		this.setWordWrap(elm);

	}



/****************************************************************************************/
	// Устанавливаем значение
	this.setText = function(elm)
	{
		$(".valueText").val(elm.find(".element-content").text());
	}

	//шрифт
	this.setFamily = function(elm, curFontV)
	{
		$(".butFamily .option[value='"+curFontV+"']").attr("chosen", "true");
	}

	/*
	* размер
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setSize = function(elm)
	{
		var size = parseInt(elm.css("font-size"));
		$(".valueTextSize").val(size);
	}

	// цвет
	this.setColor = function(elm)
	{
		var color = Color.getHexRGB(elm.css("color"));
		$(".valueTextColor").val(color);
	}

	this.setPlaceholder = function(elm)
	{
		var placeholderBlockV = $(".menuStylePlaceholderColor");

		if (elm.hasClass("input") || elm.hasClass("textarea")) {
			var placeholderVisibleV = "block";
			var colorV = ElementCss.getStyle("placeholder", "geometry", elm, "desktop", "static");
			if (!colorV) colorV = "rgba(200,200,200,1)";
			$(".valuePlaceholderColor").val(colorV);
		} else {
			var placeholderVisibleV = "none";
		}

		placeholderBlockV.css("display", placeholderVisibleV);
	}

	/*
	* выравнивание
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setAlign = function(elm)
	{
		var value = elm.css("text-align");
		if (value == "start") value = "left"; 

		$(".menuButTextAlign[value='"+value+"']").attr("chosen", "true");

		var valueVisibleValueV = elm.hasClass("text-span") ? "none" : "block";
		$(".menuStyleItemTextAlign").css("display", valueVisibleValueV);
	}

	//стиль
	this.setStyle = function(elm)
	{
		var listBut = $(".menuButTextStyle");
		
		// курсив
		var cursiv = elm.css("font-style");
		listBut.filter("[value='"+cursiv+"']").attr("chosen", "true");

		// подчеркивание или перечеркивание
		var line = elm.css("text-decoration");
		listBut.filter("[value='"+line+"']").attr("chosen", "true");
	} 

	this.setWeight = function(elm, curFontV)
	{
		// ставим значение
		var value = elm.css("font-weight");
		if (value == "bold") value = "700";
		else if (value == "normal") value = "400";

		Select.set($(".selectFontWeight"), value);
		/****************/

		// прячем некоторые значения
		var listOptionV = $(".selectFontWeight .option");
		listOptionV.css("display", "none");
		// по умолчанию
		listOptionV.filter("[value='400']").css("display", "block");
		listOptionV.filter("[value='700']").css("display", "block");

		// если он не google 
		var fontPropertyV = Data.site.font[curFontV];
		if (!fontPropertyV || !fontPropertyV["link"]) return false;
		// если нет этого параметра
		var fontWeightV = fontPropertyV["weight"];
		if (!fontWeightV) return false;

		// показываем толщину
		for (var weightValueV in fontWeightV) {
			listOptionV.filter("[value='"+weightValueV+"']").css("display", "block");
		}
	}

	// межстрочный интервал
	this.setLineHeight = function(elm)
	{
		var lineHeight = elm.css("line-height");

		if (lineHeight == "normal") {
			lineHeight = parseInt(elm.css("font-size")) * 1.5;
		}

		lineHeight = parseInt(lineHeight);
		$(".valueTextLineHeight").val(lineHeight);
	}

	/**
	* Установка ширины
	*
	* @see 	this.set()
	*/
	this.setWidth = function(elm)
	{
		var textWidth = elm.css("letter-spacing");
		textWidth = parseInt(textWidth);
		$(".valueTextWidth").val(textWidth);
	}

	/**
	* Устанавливаем сам текст
	*
	* @see 	this.set()
	*/
	this.setSelfText = function(elm)
	{
		if (elm.hasClass("submit")) {
			var text = elm.val();
		} else if (elm.hasClass("input") || elm.hasClass("textarea")) {
			var text = elm.attr("placeholder");
		} else {
			var text = elm.find("> .element-content").html();
			if (text) text = text.replace(/<br\/?>/gim, "\n");
		}

		if (text) text = text.trim();
		$(".valueText").val(text);
	}

	/**
	* Установить фон
	*
	* @see 	this.set()
	*/
	this.setBg = function(elm)
	{
		var type = Element.data.type;
		// только у текста и заголовка
		if (type != "text" && type != "heading") {
			$(".menuStyleTextBg").css("display", "none");
			return false;
		} else {
			$(".menuStyleTextBg").css("display", "block");
		}

		var colorRgba = elm.find(">span").css("background-color");
		var elmEvent = $('.valueTextBgColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);
	}

	this.setTransform = function(elm)
	{
		var valueV = elm.css("text-transform");
		Select.set($(".selectTextTransform"), valueV);
	}

	// перенос строки
	this.setWordWrap = function(elm)
	{
		var valueV = elm.css("word-wrap");
		Select.set($(".selectTextWordWrap"), valueV);
	}

	this.editWordWrap = function(elm, value)
	{
		elm.css("word-wrap", value);
	}

/***************************************************************************************/
/******************************************************************************************/
	// изменение

	//шрифт
	this.editFamily = function(elm, value)
	{
		elm.css("font-family", value);

		this.setWeight(elm, value);
	}

	// размер
	this.editSize = function(elm, value)
	{		
		if (value < 5) value = 5; 
		elm.css("font-size", value+'px');

		this.setLineHeight(elm);
	}

	// цвет
	this.editColor = function(elm, value)
	{
		if (!value.match(/^rgb/gim)) value = "#" + value;
		elm.css("color", value);
		ElementCss.set("geometry", elm);
	}

	// выравнивание
	this.editAlign = function(elm, value)
	{
		elm.css("text-align", value)
	}

	this.editWeight = function(elm, value)
	{
		elm.css("font-weight", value);
	}

	// стиль
	this.editStyle = function(elm, value, elmEvent)
	{
		var cssStyle = '';
		switch (value) {
			case "bold": cssStyle = "font-weight"; break;
			case "italic": cssStyle = "font-style"; break;
			default: cssStyle = "text-decoration";
		}	

		var isChosen = elmEvent.attr("chosen");

		// отключение стиля
		if (!isChosen) value = cssStyle == "text-decoration" ? "none" : "normal";

		// для всех остальных
		// if (isChosen == "true") {
			elm.css(cssStyle, value);

			// скидуем вторую кнопку
			if (elmEvent.attr("is-decoration") == "true") {
				var styleReset = value == "underline" ? "line-through": "underline";
				$(".menuButTextStyle[value='"+styleReset+"']").removeAttr("chosen");
			}
		// } else {
		// 	ElementCss.clear(cssStyle, "style", elm);	
		// }
	}

	// межстрочный интервал
	this.editLineHeight = function(elm, value) 
	{
		var elmFontSize = parseInt(elm.css("font-size"));
		value = parseFloat(value);
		if (!value) value = 1;
		value = value / elmFontSize;
		value = parseFloat(value.toFixed(2));

		elm.css("line-height", value);

	}

	// изменение 
	this.editWidth = function(elm, value)
	{
		value = parseInt(value);
		value += "px";
		elm.css("letter-spacing", value);
	}

	// сам текст
	this.editSelf = function(elm, value)
	{
		if (!value) value = "";
		
		if (elm.hasClass("submit")) {
			var text = elm.val(value);
		} else if (elm.hasClass("input") || elm.hasClass("textarea")) {
			elm.attr("placeholder", value);
		} else {
			if (value) value = value.replace(/\n/gim, "<br/>");
			elm.find("> .element-content").html(value);
		}
	}

	/**
	* Цвет фона
	*
	*/
	this.editBg = function(elm, value) {
		elm = elm.find("> span");
		elm = Element.getAllObject(elm);
		elm.attr("is-color", "true");

		var colorRgba = Color.getRgbaFromMenu($(".valueTextBgColor"));

		elm.css("background-color", colorRgba);
		ElementCss.set("geometry", elm);
	}

	this.editTransform = function(elm, value)
	{
		elm.css("text-transform", value);
	}

	/**
	* Цвет подсказки
	*
	*
	*/
	this.editPlaceholderColor = function(elm, value)
	{
		var colorV = Color.getRgbaFromMenu($(".valuePlaceholderColor"));
		ElementCss.setStyle({"placeholder":colorV}, elm, "desktop", "static");
	}

/**********************************************************************************************/
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventAddFont()
	}

	/**
	* Добавить новый шрифт
	*
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventAddFont = function()
	{
		$(".butAddFont").off("mousedown");
		$(".butAddFont").on("mousedown", function() {
			StyleFont.show();
		});
	}
/**********************************************************************************************/
/**********************************************************************************************/
} //end class









