/**
* Работа с единицей
*
*
*
*/
var StyleUnit = new StyleUnit();
function StyleUnit() {
	/**
	* Список полей по стилям
	*
	* @see 	this.getPropertyUnit()
	* @see 	this.getUnitField()
	* @see 	this.translate()
	*/
	this.listClass = {
		"width":"valueWidth",
		"min-width":"valueMinWidth",
		"max-width":"valueMaxWidth",
		"height":"valueHeight",
		"min-height":"valueMinHeight",
		"max-height":"valueMaxHeight",
		"top":"valuePositionTop",
		"left":"valuePositionLeft",
		"bottom":"valuePositionBottom",
		"right":"valuePositionRight",
		"margin-top":"valueMarginTop",
		"margin-bottom":"valueMarginBottom",
		"margin-left":"valueMarginLeft",
		"margin-right":"valueMarginRight",
		"padding-top":"valuePaddingTop",
		"padding-bottom":"valuePaddingBottom",
		"padding-left":"valuePaddingLeft",
		"padding-right":"valuePaddingRight",
		"background-size":"valueBgImgSize",
		"background-position-left":"valueBgPositionLeft",
		"background-position-top":"valueBgPositionTop"
	}

	/**
	* Список стилей
	*
	* @see 	this.translate()
	* @see 	this.getPropertyByClass()
	* @see 	SpecialInput.editValue()
	*/
	this.listProperty = {
		"valueWidth":"width",
		"valueMinWidth":"min-width",
		"valueMaxWidth":"max-width",

		"valueHeight":"height",
		"valueMinHeight":"min-height",
		"valueMaxHeight":"max-height",


		"valuePositionTop":"top",
		"valuePositionLeft":"left",
		"valuePositionBottom":"bottom",
		"valuePositionRight":"right",
		"valueMarginTop":"margin-top",
		"valueMarginBottom":"margin-bottom",
		"valueMarginLeft":"margin-left",
		"valueMarginRight":"margin-right",
		"valuePaddingTop":"padding-top",
		"valuePaddingBottom":"padding-bottom",
		"valuePaddingLeft":"padding-left",
		"valuePaddingRight":"padding-right",
		"valueBgImgSize":"background-size",
		"valueBgPositionLeft":"background-position-left",
		"valueBgPositionTop":"background-position-top"
	}


	/**
	* Текущий input с которым работаем
	*
	* @set 	this.translate()
	* @see 	this.getParentValue()
	*/
	this.currentInput = false;
/*******************************************************************************************/
	/**
	* Отдает параметр по классу
	*
	*
	* @see 	this.setValueMenu() 
	* @see 	this.getUnitMenu() 
	* @see 	this.getUnitField()
	*/
	this.getClassByProperty = function(property) 
	{
		return this.listClass[property];
	}

	/**
	* Отдает параметр по классу
	*
	* @see 	Key.incDecInput()
	*/
	this.getPropertyByClass = function(elmClass)
	{
		return this.listProperty[elmClass];
	}
/*********************************************************************************************/
	/**
	* Отдает значение свойства
 	*
	* @see 	StyleMenuGeometry.set*()
	*/
	this.setMenuProperty = function(elm, property, propertyType, value)
	{
		/*******/
		if (!value && property == "max-height") {
			value = elm.css(property);
			// if (value == "none") value = "100vh";
			if (value == "none") value = "auto";
		} else if (!value && property == "max-width") {
			value = elm.css(property);
		}
		/*******/

		if (!propertyType) propertyType = "geometry";
		if (!value) {
			value = ElementCss.getStyleAllScreen(property, propertyType, false, elm);
		}

		if (!value && Element.existClassAdded()) {
			var uniqueClass = Element.getClassUnique(elm);
			value = ElementCss.getStyleAllScreen(property, propertyType, uniqueClass, elm);
		}

		// если нету значение в css массиве
		if (!value) {
			var defaultUnit = this.getDefaultUnit(property);
			if (defaultUnit == "auto") {
				value = "auto";
			} else {
				value = elm.css(property);
				if (defaultUnit != "px") {
					value = this.pxToPercent(value, property, elm);
					if (!parseFloat(value)) value = "0"+defaultUnit;
				}
			}
				
		}

		// ставим единицу в меню
		this.setUnitMenu(property, value);
		// значение в меню
		if (value != "auto" && value != "full") value = parseInt(value);
		this.setValueMenu(property, value);
	}

	/**
	* Отдает значение по умолчанию
	*
	* @see 	this.setMenuProperty()
	* @see 	StyleMenuGeometry.setMGWidth()
	*/
	this.getDefaultUnit = function(property)
	{
		if (property == "height") {
			return "auto";
		} else if (property == "max-width") {
			return "%";
		} else {
			return "px";	
		}
		return "px";
		
		// if (!property) return "px";
		// else if (Element.data.type == "section" && property == "width" && Screen.isDesktop()) return "px"; 
		// else if (property.match(/(padding)|(top)|(bottom)|(height)|(border)/)) return "px";
		// else return "%";
	}

	/**
	* Устанавливает все по умолчанию
	*
	* @see 	ElementBasic.setUnitMenu()
	*/
	this.setAllDefault = function()
	{
		StyleUnit.setUnitMenu("height", "px");
		StyleUnit.setUnitMenu("width", "px");

		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("bottom", "px");
		// StyleUnit.setUnitMenu("left", "%");
		// StyleUnit.setUnitMenu("right", "%");
		StyleUnit.setUnitMenu("left", "px");
		StyleUnit.setUnitMenu("right", "px");

		StyleUnit.setUnitMenu("padding-top", "px");
		StyleUnit.setUnitMenu("padding-bottom", "px");
		StyleUnit.setUnitMenu("padding-left", "px");
		StyleUnit.setUnitMenu("padding-right", "px");

		StyleUnit.setUnitMenu("margin-top", "px");
		StyleUnit.setUnitMenu("margin-bottom", "px");
		// StyleUnit.setUnitMenu("margin-left", "%");
		// StyleUnit.setUnitMenu("margin-right", "%");
		StyleUnit.setUnitMenu("margin-left", "px");
		StyleUnit.setUnitMenu("margin-right", "px");
	}
/*******************************************************************************************/
	
	/**
	* Перевод пикселий в  проценты
	*
	* @see 	this.translateBg()
	* @see 	this.setMenuProperty()
	* @see 	ElementCss.updateStyle()
	* @see 	Key.incDecInput()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	SpecialInput.editValue()
	*/
	this.pxToPercent = function(valuePx, style, elm)
	{
		// var currentUnit = "%";
		var currentUnit = StyleUnit.getUnitMenu(style);
		if (!elm) elm = Element.obj;
		if (!parseFloat(valuePx)) return "0"+currentUnit;

		valuePx = valuePx.toString();

		// если процент то возращаем
		if (valuePx.indexOf(currentUnit) > 0) return valuePx; 

		// значение от которого делать расчет
		// var parentValue = this.getParentValue(elm, style);
		if (currentUnit == "vh") var parentValue = $("body").height();
		else if (currentUnit == "vw") var parentValue = $("body").width();
		else var parentValue = this.getParentValue(elm, style);

		// получаем значение
		var value = parseFloat(valuePx);
		value = (value / parentValue)*100;

		// преобразовываем
		if (elm.css("float") == "none" 
				|| (style != "width" && style != "margin-left" && style != "margin-right")) {
			value = value.toFixed(5);
		}

		value = parseFloat(value);
		if (style == "width" && value > 99 && value < 100) value = 100;

		/*нужно протестировать, может нужно и убрать*************/		
		value = parseInt(value);
		/**********/

		return value+currentUnit;
	} 

	/**
	* Конвертирует проценты в px
	*
	* @see 	this.translateBg()
	* @see 	this.getParentValue()
	* @see 	StyleMenutGomettry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	*/
	this.percentToPx = function(valuePersent, style, elm)
	{
		if (!elm) elm = Element.obj;
		
		valuePersent = valuePersent.toString();
		// если процент то возращаем
		if (valuePersent.indexOf("px") > 0) return valuePersent; 
		// значение от которого делать расчет
		var parentValue = this.getParentValue(elm, style);
		var valuePx = parentValue * (valuePersent / 100);
		// console.log(parentValue+"->"+valuePersent);
		// valuePx -= 0.1;

		return valuePx;
	}


	/**
	* Отдает значение родителя
	*
	* @see 	this.pxToPercent()
	* @see 	this.percentToPx()
	*/
	this.getParentValue = function(elm, property)
	{
		var value = 0;
		
		if (elm.hasClass("modal")) var elmParent = $(".contentModal .modalWrap");//var elmParent = $(".contentWrap .content");
		else var elmParent = elm.parent();

		if (property == "height" || property == "min-hieght") {
			value = elmParent.height();
		} else if (property.match(/background-position/)) {
			if (this.currentInput.hasClass("valueBgPositionLeft")) {
				value = elm.width();
			} else {
				var unitBgSite = this.getUnitMenu("background-size");
				value = $(".valueBgImgSize").val();
				if (value == "auto") value = 100;
				else if (unitBgSite == "%") value = this.percentToPx(value, "background-size");
				value = parseFloat(value)/2;

				value = elm.height();
			}
		} else if (property.match(/padding/) || property.match(/background/)) {
			value = elm.width();
		} else if (property == "top") {
			value = Element.getHeight(elm.parent());
		} else {
			value = Element.getParentWidth(elm);
		}

		return value;
	}
/**********************************************************************************************/
	/**
	* Установить значение в меню
	*
	* @see 	this.setMenuProperty()
	* @see 	ElementCss.updateStyle()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	ElementCss.updateStyle()
	*/
	this.setValueMenu = function(style, value)
	{
		var inputClass = this.getClassByProperty(style);
		if (value != "auto" && value != "full") value = parseInt(value);
		// console.log(style +"->"+ value)

		$("."+inputClass).val(value); 
	}
/**********************************************************************************************/
	/**
	* Отдает единицу из меню
	*
	* @see 	this.getParentValue()
	* @see 	ElementCss.updateStyle()
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft(), .editPaddingVer
	* @see 	Editor.editSize()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleMunuGeometry.editWidth()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	SpecialInput.editValue()
	* @see 	ElementBasic.setCssNewElm()
	*/
	this.getUnitMenu = function(property)
	{
		// var unit = "px";
		var unit = this.getDefaultUnit(property);

		var filedClass = this.getClassByProperty(property);
		if (filedClass) { 
			var field = this.getUnitField(property);//поле
			unit = field.attr("type");//получаем единицу
		} 

		if (unit == "auto") {
			// unit = "%";
			unit = this.getDefaultUnit(property);
			this.setUnitMenu(property, unit);
			/**********************/
			// this.setUnitMenu(property, unit);
			/********************/
		}

		return unit;
	}

	/**
	* Ставит единицу в меню
	*
	* @see 	this.getPropertyValue()
	* @see 	this.getUnitMenu()
	* @see 	StyleMenuGeometry.editPositionAlign()
	* @see 	ElementBasic.create() .setCssNewElm()
	* @see 	Key.incDecInput()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleMenuGeometry.setMGWidth(), .setValueWithOffset()
	* @see 	ElementModal.actionAfter()
	* @see 	ElementMan.setStyle();
	* @see 	StyleCanvas.moveElement()
	* @see 	ElementSlider.addButToggle()
	*/
	this.setUnitMenu = function(property, value)
	{
		if (!$.isNumeric(value)) {
			var unit = value.replace(/[0-9\.\-]+/gim, '');
		} else {
			var unit = this.getDefaultUnit(property);
		}
		
		var field = this.getUnitField(property);

		field.attr("type", unit);
		if (unit.match(/(auto)|(full)/gim)) unit = "-";

		field.text(unit);
	}

	/**
	* Отдает поле единицы
 	*
 	* @see 	this.getUnitMenu()
	* @see 	this.setUnitMenu()
	* @see 	this.translate()
	*/
	this.getUnitField = function(property, field)
	{
		if (!field) {
			var fieldClass = this.getClassByProperty(property);
			field = $("."+fieldClass);
		}
		
		field = field.closest(".inputBlock").find(".inputUnitCurrent");

		return field;
	}
/********************************************************************************************/
	/**
	* Переводим значение
	*
	* @see 	SpecialInput.setEventSelectUnit()
	*/
	this.translate = function(inputElm, newUnit)
	{
		var currentField = this.getUnitField(false, inputElm);
		if (currentField.attr("type") == newUnit) return false;

		this.currentInput = inputElm;
		var elm = Element.obj;
		var inputClass = inputElm.attr("class");
		var property = this.getPropertyByClass(inputClass); 

		if (elm.hasClass("section") && property.match(/(width)|(height)/gim)) {
			elm = elm.find("> .section-content");
		}

		//ставим на кнопки единицу 
		var elmButCurrent = inputElm.closest(".inputBlock").find(".inputUnitCurrent");
		var oldUnit = elmButCurrent.attr("type");
		var newUnitText = newUnit.match(/(auto)|(full)/gim) ? "-" : newUnit;
		elmButCurrent.attr("type", newUnit).text(newUnitText);

		// для bg особенность 
		if (property.match(/background/)) {
			this.translateBg(inputElm, property, newUnit, oldUnit);
			return false;
		}

		// получаем значение
		var value = elm.css(property);
		if (newUnit == "auto") {
			value = "auto";
		} else {
			value = parseFloat(value);
		}

		if (property == "min-width") {
			if (oldUnit == "%") value = elm.width();
			else if (oldUnit == "vw") value = $("body").width();
			else if (oldUnit == "vh") value = $("body").height();
		}

		var listStyle = {};
		listStyle[property] = value;

		if (Element.isSectionContentStyle(elm, property)) {
			ElementCss.set("geometry", elm, false, listStyle, false, "hlp-section-content");
		} else {
			ElementCss.setStyle(listStyle, elm);
		}

		this.currentInput = false;
		History.record();
	}

	/**
	* Перевод для bg
	*
	* @see 	this.translate()
	*/
	this.translateBg = function(inputElm, property, newUnit, oldUnit)
	{
		if (newUnit == "full") {
			value = "full";
		} else if ( (newUnit == "px" || newUnit == "%") && oldUnit != "px" && oldUnit != "%" ) {
			var value = newUnit == "px" ? 100 : 50; 
		} else {
			var value = inputElm.val();
			if (newUnit == "%") value = this.pxToPercent(value, property);
			else if (newUnit == "px") value = this.percentToPx(value, property);
			else value = "auto";

			if (value != "auto") {
				value = parseFloat(value);
				value = value.toFixed(2);
			}
		}
		
		// convertPxToPercent
		inputElm.val(value).change();
	}
/**************************************************************************************************/	

} //end class


