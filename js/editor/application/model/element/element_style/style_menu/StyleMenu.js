/**
* Стиль в правой меню
*
* @child 	StyleMenuSet
* @child 	StyleMenuEdit
*/
var StyleMenu = new StyleMenu();
/**
* Какие стили доступны определеному элементу
*
* @see this.set()
*/
function StyleMenu() {
	/**
	* Отдает единицу измерения из меню
	*
	* @see 	ElementCss.updateStyle()
	*/	
	this.getUnit = function(property)
	{
		// ElementCss.get

		// return unit;
	}
/********************************************************************************************/
	/**
	* Устанавливаем значения стилей
	*
	* @uses this.listStyleByType 			список доступных стилей по типу
	* @see 	StyleCanvas.selectElement()
	* @see 	this.toggleHover()
	* @see 	ElementStyleController.setEventResetStyle()
	* @see 	EditController.setEventEditScreen()
	* @see 	ElementStyleController.setEventElmState()
	* @see 	StyleMenuGeometry.editPositionType()
	* @see 	StyleMenuFixed.setEventDelete()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StyleMenuGeometry.editFullWidth()
	*/
	this.set = function() 
	{
		// фиксируем положение скролла
		var scrollTop = $(".rightMenuContent").scrollTop();
		// убираем текстовый редактор
		TextEditor.hide();
		//прячем блоки
		this.hideMenuBlock();
		this.showMenuBlock();
		this.clearMenu();//очищаем меню

		// данные
		var type = Element.data.type;// тип	
		//список доступных стилей
		var listStyle = Element.data.css;

		// устанавливаем список стилей
		for (var key in listStyle) {
			var styleType = listStyle[key];
			var style = this.list[styleType]; 

			//показываем блок 
			var blockStyle = $("."+style["block"]);
			blockStyle.css("display", "block");
			
			//устанавливаем стиль
			var elm = this.getElementSelected(styleType);
			// console.log(style["object"][nameFunc])
			var nameFunc = style["function"];
			style["object"][nameFunc](elm);
		}
		
		// если все margin убраны
		if ($(".menuMarginV").css("display") == "none" && $(".menuMarginH").css("display") == "none") {
			$(".menuMargin").css("display", "none");
		}
		
		// анимация
		this.setAnimate(elm);

		// цвет
		this.setMenuColor($(".colorpickerField"));
		//устанавливаем элемент scroll
		this.setScroll();
		// устанавливаем значения в .select
		this.setValueInSelect();
		// ставим фиксированые
		StyleMenuFixed.set(elm);

		// устанавливаем скролл блока где находяться стили
		if (!PageStruct.noSetScrollTop) $(".rightMenuContent").scrollTop(scrollTop);
		
		// если нет в geometry значений
		var geometryChildVisible = $(".menuGeometry .menuStyleItem").filter(function() {
			return $(this).css("display") == "block";
		});
		if (!geometryChildVisible.length) $(".menuGeometry").css("display", "none");
		
		this.setNoWidth(elm);
		this.setNoHeight(elm);

		// для полменю
		if (elm.hasClass("hlp-nav-level-item")) {
			$(".menuFloatSide, .menuMarginH, .menuProportion").css("display", "none");
		}

		// для слайдера
		this.hideMenuBlockForSlider();

		// сам пункт fixed
		StyleMenuGeometry.setVisibleOptionPosFixed(elm);
	};

	this.setAnimate = function(elm)
	{
		if (elm.hasClass("site") || elm.hasClass("section")) {
			var blockAnimateVisible = "none";
		} else {
			var blockAnimateVisible = "block";
			StyleMenuAnimate.set(elm);
		}

		$(".menuStyleAnimate").css("display", blockAnimateVisible);
	}

	this.setNoWidth = function(elm)
	{
		$(".menuWidth").css("display", "block");

		var listInputWidth = $(".inputBlock").filter("[data-style='width'],[data-style='min-width'],[data-style='max-width']");
		if (Element.obj.hasClass("column")) {
			listInputWidth.attr("data-no-activite", "true");
		} else if (Element.obj.hasClass("section") && !Screen.isDesktop()) {
			$(".menuWidth .inputBlock").attr("data-no-activite", "true");
		} else {
			listInputWidth.removeAttr("data-no-activite");
		}
	}

	this.setNoHeight = function(elm)
	{
		$(".menuHeight").css("display", "block");
		$(".menuGeometryPropertyExtendedContent .menuOneParam").css("display", "block");

		var listInputWidth = $(".inputBlock").filter("[data-style='height'],[data-style='min-height'],[data-style='max-height']");
		if (Element.obj.hasClass("video")) {
			listInputWidth.attr("data-no-activite", "true");
			StyleMenuGeometry.setMGMinHeight(elm);
		} else {
			listInputWidth.removeAttr("data-no-activite");
		}

		// убираем параметры высоты
		if (!elm.hasClass("embed") 
				&& !elm.hasClass("block")
				&& !elm.hasClass("text")
				&& !elm.hasClass("heading")
				&& !elm.hasClass("hlp-slider-bullet")
				) {
			$(".menuHeight .inputBlock, .menuMaxHeight .inputBlock").attr("data-no-activite", "true");
		}
	}


	/**
	* Прячем блоки меню
	*
	* @see 	this.set()
	*/
	this.hideMenuBlock = function()
	{
		// прячем все блоки
		$(".menuStyle .menuOneStyle, .menuStyle .menuStyleBlockNone").css("display", "none");
		
		//показываем блок геометрии, но прячем стили внутри него
		// var geometryDisplay = Element.data.type == "site" ? "none" : "block";
		var geometryDisplay = "block";

		$(".menuGeometry").css("display", geometryDisplay);
		$(".menuGeometry .menuStyleItem")
							.css("display", "none");

		// прячем блок width и height
		$(".menuProportion .menuOneParam").css("display", "none");

		// прячем margin вертикальный и горизонтальный
		$(".menuMarginH, .menuMarginV, .menuPaddingH, .menuPaddingV").css("display", "none");
		
	}

	/**
	* Очищаем 
	*
	* @see 	this.set()
	*/
	this.clearMenu = function()
	{
		// убираем все выделения
		$(".menuStyle").find("input[type='button'], .option, .menuButValue").removeAttr("chosen");
		// убираем атрибут
		$(".menuOneStyle").removeAttr("last");
	}


	this.showMenuBlock = function()
	{
		$(".menuStyleItemFullHeight").css("display", "block");
		$(".menuPositionType").css("display", "block");
		$(".settingFormName").css("display", "block");
	}

	this.hideMenuBlockForSlider = function()
	{
		var elmObj = Element.getObj();
		if (elmObj.hasClass("hlp-slider-list-bullets")) {
			$(".menuStyleItemFullHeight").css("display", "none");
		}

		if (elmObj.hasClass("hlp-slider-list-bullets")
				|| elmObj.hasClass("hlp-slider-arrow")) {
			$(".menuPositionType").css("display", "none");
		}

	}

/************************************************************************************************/
	/**
	* Ставит состояние элемента
	*
	* @see 	this.set()
	*/
	this.setStateElm = function(elm)
	{
		return false;
	}

	/**
	* Выбирает кнопку переключателя
	*
	* @see 	StyleCanvas.setEventMoveMouseUp()
	*/
	this.chosenToggleBut = function(elmToggleObj, value)
	{
		elmToggleObj.find(".menuButValue")
					.removeAttr("chosen")
					.filter("[value='"+value+"']")
					.attr("chosen", "true");
	}
	

	
/*****************************************************************************************/
	/**
	* Изменение свойства элемента
	*
	* @param obj 	elm_event-элемента на котором сраюотало событие
	*
	* @uses	this.getElementSelected()-parent 	получить выбраный элемент
	* @uses this.setScroll()-parent 			устанавливает скрол на заданое значение
	* @see 	ElementStyleController.setEventMenuEdit()
	*/
	this.edit = function(elmEvent)
	{
		// закрываем элементы редактора
		Editor.closeSelect();
		
		//значение
		var value = this.getElmValue(elmEvent);

		//класс инпута на котором сработало событие
		var typeStyle = elmEvent.attr("css");
		if (!typeStyle) typeStyle = elmEvent.parent().attr("css");
		if (!typeStyle) return false;
		
		//выбраный элемент
		var className = this.getClassName(typeStyle);
		var nameMethod = this.getMethodName(typeStyle);
		var elm = this.getElementSelected(className, typeStyle);

		//изменяем стиль у элемента
		var className = this.launchByName(elm, value, elmEvent, className, nameMethod);
		
		// переносим стиль в css, если не передвигается скролл
		if (!ElementCss.noSetStyle) {
			var typeCss = this.getTypeCss(className, typeStyle);
			ElementCss.set(typeCss, elm);
		} else {
			ElementCss.noSetStyle = false;
		}
		
/********действия после изменения стиля*********************/
		//если это scroll то ставим его на позицию нового значения
		if (elmEvent.attr("maxval")) {
			this.setScroll(elmEvent); 
		}

		//если этот элемент цвет
		if (elmEvent.attr("color") == "color") {
			//окрашиваем кнопку
			elmEvent.closest(".menuSectionItemColor")
					.find(".colorpickerField")
					.css("background-color", "#"+value);
		}

		// не сохранен
		Site.setSaveNo();
	}

	/**
	* Фиксирует
	*
	* @see 	StyleMenuBg.editImage(), StyleMenuBg.setEventBgImage()
	* @see 	StyleMenuBg.setFullBg()
	* @see 	StyleCanvas.fixedHistoryMove()
	*/
	this.fixed = function(typeCss, elm)
	{
		ElementCss.set(typeCss, elm);
		History.record();
	}

	/**
	* Отдает значение элемента
	*
	* @see 	this.edit()
	* @see 	ElementSetting.edit()
	*/
	this.getElmValue = function(elmEvent)
	{
		var value = elmEvent.attr("val"); //для не стандарного элеммента
		if (!value) value = elmEvent.val();
		if (!value) value = elmEvent.attr("value");
		
		var maxVal = elmEvent.attr("maxval");
		var minVal = parseFloat(elmEvent.attr("minval"))*(-1);

		// положительное число
		var minValPositive = elmEvent.attr("minval-positive");
		if (minValPositive) minVal = minValPositive;

		// если есть максимальное значение или минимальное
		if (maxVal || minVal) {
			value = parseFloat(value);
			if (maxVal && maxVal < value) value = maxVal;
			if (minVal && minVal > value) value = minVal;

			elmEvent.val(value);
		}
		
		if (elmEvent.attr("only-integer") && value.toString().match(/[^0-9]+/gim)) {
			value = parseFloat(value);
			if (!value) value = 0;

			elmEvent.val(value);
		}

		return value;
	}

	/**
	* Запускает функию определенного класса по имени
	*
	* @see 	this.edit()
	* @see 	this.valueBgColorPicker()
	*/
	this.launchByName = function(elm, value, elmEvent, className, nameMethod)
	{
		//если открыт редактор, закрываем его
		TextEditor.hide();
		
		// запускаем
		var classObject = this.list[className]["object"];
		// если нету такого метода
		// if (!classObject[nameMethod]) nameMethod = ListFunct[nameMethod];
		classObject[nameMethod](elm, value, elmEvent);

		return className;
	} 

	this.pattern = new RegExp("^(fixed|geometry|list|bg|border|boxShadow|textShadow|transform|text|other|seo|page_setting|animate|filter)", "i");

	/**
	* Отдает имя класса
	*
	* @see 	this.launchByName()
	* @see 	this.setVariablesColorPicker()
	*/
	this.getClassName = function(name)
	{
		return this.pattern.exec(name)[0]; // имя объекта
	}
	
	/**
	* Отдает имя метода
	*
	* @see 	this.launchByName()
	*/
	this.getMethodName = function(name)
	{
		var nameMethod = name.replace(this.pattern, ''); // имя функции
		return "edit"+nameMethod;
	}

	/**
	* Отдает тип css
	*
	* @see 	this.edit()
	*/
	this.getTypeCss = function(className, typeStyle)
	{
		if (	// text
				typeStyle == "textAlign"
				|| typeStyle == "textSize"
				|| typeStyle == "textLineHeight"
				// bg
				|| typeStyle == "bgSize"
				|| typeStyle == "bgPosition"
				|| typeStyle == "bgPositionSide"
				// border
				|| typeStyle == "borderTop" || typeStyle == "borderBottom"
				|| typeStyle == "borderLeft" || typeStyle == "borderRight"
				) {
			return "geometry";
		} else if (typeStyle == "geometryPositionType"
					|| typeStyle == "geometryPositionSide"
					|| typeStyle == "geometryFloatSide"
					// || typeStyle == "borderRadiusAll"
					) {
			return '';
		} else if (className == "geometry") {
			return "geometry";
		} else if (className == "bg" 
					|| className == "border" 
					|| className == "transform"
					|| className == "boxShadow"
					|| className == "text"
					|| typeStyle == "textColor"
					|| typeStyle == "textBg") {
			return "style";
		} else {
			return '';
		}
	}

/**************************************************************************************/
/***вспомогательные функции***********************************************************************************/
	/**
	* Устанавливает переменые необходимые для работы colorPicker
	* в в начале работы
	*
	* @see 	ElementStyleController().setEventBgColor()
	*/
	this.setVariablesColorPicker = function(elmEvent) 
	{
		StyleMenu.elmEventPickerBut = elmEvent;
		this.isColorTextEditor = elmEvent.closest(".textRedactor").length;

		if (!elmEvent.attr("css") && !this.isColorTextEditor) {
			elmEvent = elmEvent.prev().find("input");
		}
		StyleMenu.elmEventPickerField = elmEvent;

		var name = elmEvent.attr("css");
		if (!name) return false;
		this.nameStyle = name;
		this.className = this.getClassName(name);		
		this.methodName = this.getMethodName(name);
	}
	
	/**
	* Изменяет цвет или градиент элемента, при mousemove
	*
	* @see 	colorpicker.change()
	*/
	this.valueBgColorPicker = function(color) {
		var color = Color.getHexRGB(color);
		var butEvent = this.elmEventPickerBut;
		
		//ставим статус что цвет изменен 
		this.isChangeMenuColor = true;

		// окрашиваем кнопку
		butEvent.val(color).css("background-color", "#"+color);
		this.elmEventPickerField.val(color);

		// если не м
		if (this.isColorTextEditor) return false;
			
		elm = this.getElementSelected("bg", "color");
		if (!Element.getState()) {
			elm = Element.getAllObject(elm, true);	
		}

		this.launchByName(elm, color, butEvent, this.className, this.methodName);
	}

	/**
	* Фиксируем цвет элемента, при событие mouseup
	*
	* @see 	colorpicker.upHue(), colorpicker.upSelector()
	*/
	this.colorPickerChange = function()
	{
		// if (!this.isChangeMenuColor) return false;
		// эмитируем событие изменения цвета и его фиксации
		// this.elmEventPickerField.change();
		if (!this.elmEventPickerField) return false;

		this.edit(this.elmEventPickerField);
		// this.isChangeMenuColor = false;
	}

	/**
	* Сброс объекта
	*
	* @see 	Editor.resetFocus();
	*/
	this.resetObjColorPicker = function()
	{
		this.elmEventPickerField = false;
	}
/****************************************************************************************/
	/**
	*  Устанавливает цвет в меню
	*
	* @param 	obj 	par_elm - родительсктй элемент
	* @param 	string 	color - цвет
	* 
	* @uses 	this.getColorFromRgba() 	получить цвет из rgba
	* @see 		this.set()-child
	* @see 		StyleMenuBg.edtGradient()-child
	* @see 		StyleMenuBg.editType()
	* @see 		EditElementText.setValInMenu()
	* @see 	StyleMenuBg.set()
	*/
	this.setMenuColor = function(listElm)
	{	
		var len = listElm.length;
		for (var i = 0; i < len; i++) {
			var elm_input = listElm.eq(i);
			//родительский элемент
			var elm_field = elm_input.closest(".menuStyleItemValue")
										.find(".colorpickerField");
			
			//цвет
			var color_hex = Color.getHexRGB(elm_field.val());

			//окрашиваем кнопку в цвет элемента и вставляем значени
			elm_field.css("background-color", "#"+color_hex)
				.val(color_hex);//ставим кнопке значение

			//пошещяем в input цвет элемента
			elm_input.val(color_hex);
		}		
	}

	/**
	* Установить позицию скрола взависимости от значения
	*
	* @param 	string 		scroll_input - скролл
	* 
	* @see 	this.set()
	* @see 	StyleMenuBg.set()
	* @see 	StyleMenuBg.editColor(), .setTypeVideo()
	* @see 	ElementSetting.edit()
	*/
	this.setScroll = function(list_input)
	{
		if (!list_input) list_input = $(".scrollBlock input");

		for (var i = 0; list_input.eq(i).length; i++) {
			var scroll_input = list_input.eq(i);
			var value = parseFloat(scroll_input.val());
			if (value == "auto") {
				this.setScrollBut(scroll_input, 0);
				continue;
			}

			var maxval = parseInt(scroll_input.attr("maxval"));
			var minval = parseInt(scroll_input.attr("minval"));
			if (!minval) minval = 0;
			var n = maxval + minval;

			//если в input больше чем в maxval, то ставим в input maxval
			if (value >= maxval) {
				scroll_input.val(maxval);
				value = n;
			} else if (value < minval * (-1)) {
				value = 0;
			} else {
				value = minval + value;
			} 

			var width = scroll_input.closest(".scrollBlock").find(".scroll").width() - 10;
			var step = width / n;
			var move = value * step;

			//устанавливаем скролл
			this.setScrollBut(scroll_input, move);
			// ставим значение
			if (scroll_input.val() != "auto") {
				scroll_input.val(value - minval);
			}
		}
	}

	this.setScrollBut = function(scrollInput, value) 
	{
		scrollInput.closest(".scrollBlock").find(".scrollButton").css("left", value+"px");
	}

	/**
	* Отдает элемент для изменения
	*
	* @see 		edit(), set(), valueBgColorPicker()
	* @see 	EditElementImage.save()
	* @see 	EditElementImage.manipAllBgOther()
	*/
	this.getElementSelected = function(classType, typeStyle) 
	{
		var elmSelected = Element.obj;

		return elmSelected;
	}
/**************************************************************************************/
	/**
	* Ставит значения в .select 
	* @see 	this.set()
	*/
	this.setValueInSelect = function() 
	{
		var listSelect = $(".select");

		var countSelect = listSelect.length;
		for (var indexSelect = 0; indexSelect < countSelect; indexSelect++) {
			var select = listSelect.eq(indexSelect);
			var valueSelectedOption = select.find(".option[chosen='true']").text();
			
			if (valueSelectedOption) 
				select.find("input[type='button']").val(valueSelectedOption);
		}
	}

/*************************************************************************************/
	/**
	* Очищяет число от текста и округляем его
	*
	*/
	this.clearNumber = function(num)
	{
		if (num) {
			num = num.toString();
			var new_num = num.replace(/(\.[0-9]+$)|px/ig, "");
			//округляем в большую сторону если больше чем половина
			if (parseInt(new_num) + parseInt(0.5) < num) {
				new_num++;
			}
			return new_num;
		} else {
			return 0;
		}
	};
/************************************************************************************************/
/***отдает поля*******************************************************************************************/
	/*
	* отдает top
	*
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	*/
	this.getInputTop = function(side)
	{
		if (StylePosition.isStatic()) return $(".valueMarginTop");
		else if (side == "bottom")  return $(".valuePositionBottom");
		else return $(".valuePositionTop");
	}


	/*
	* отдает left
	*
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	*/
	this.getInputLeft = function(side)
	{
		if (StylePosition.isStatic()) return $(".valueMarginLeft");
		else if (side == "right")  return $(".valuePositionRight");
		else return $(".valuePositionLeft");
	} 

	/*
	* ширина
	*
	* @see 	Resize.setEvent()
	*/
	this.getInputWidth = function()
	{
		return $(".valueWidth");
	} 

	/*
	* высота
	*
	* @see 	Resize.setEvent()
	*/
	this.getInputHeight = function()
	{
		return $(".valueHeight");
	} 
/********************************************************************************************/
/*****************************************************************************************/
	/**
	* Ставит события для меню
	*
	*
	* @see 	ElementStyleController.setEventMenu()
	*/
	this.setEvent = function()
	{
		// для фона
		StyleMenuBg.setEvent();
		// текст
		StyleMenuText.setEvent();
		// рамка
		StyleMenuBorder.setEvent();
		// фиксированые
		StyleMenuFixed.setEvent();

		StyleMenuGeometry.setEvent();
		StyleMenuTransform.setEvent();


		var obj = this;
		var inputObjV = $(".menuStyle .inputBlock input");
		inputObjV.off("focus");
		inputObjV.on("focus", function() {
			obj.menuInputValue = $(this).val();
		});

		inputObjV.off("focusout");
		inputObjV.on("focusout", function() {
			if (obj.menuInputValue != $(this).val()) {
				History.record();
			}
		});
	}

/********************************************************************************************/
/*****************************************************************************************/
	
	/**
	* Сворачивает блок geometry
	*
	* @see 	Input.init()
	*/
	this.blockGeometryHide = function()
	{
		var blockGeomV = $(".menuGeometry");
		blockGeomV.find(".menuStyleBlock").css("display", "none");
		blockGeomV.find(".menuStyleNameButton").text("+");
	}
	

/************************************************************************************************/
}//end class
