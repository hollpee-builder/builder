/**
* Виджет слайдер
*
*
*/

ElementWidgetSlider.prototype = ElementWidgetBasicList;
var ElementWidgetSlider = new ElementWidgetSlider();
function ElementWidgetSlider() {
	this.elmClassHide = "hlp-elm-hide";
	this.elmClassNav = "hlp-slider-arrow";
	this.elmClassList = "hlp-slider-list-bullets";
	this.elmAttrNavNone = "data-hlp-slider-arrows-hide";
	this.elmAttrListNone = "data-hlp-slider-bullets-hide";
	this.elmAttrAnimate = "data-hlp-slider-animate";

	this.elmAttrDuration = "data-hlp-slider-duration";
	this.elmAttrDelay = "data-hlp-slider-delay";

	this.listDefaultValue = {
		"other" : {"delay":4000, "duration":800},
		"s1" : {"delay":5000, "duration":600},
		"s2" : {"delay":4000, "duration":800}
	}

	this.class = {};
	this.class.input_list = "valueSliderCurSlide";
	this.class.but_add = "butWidgetSliderAdd";
	this.class.but_delete = "butWidgetSliderDelete";
	this.class.list_item = "hlp-slider-item";
	this.class.select_chosen = "valueClickSlider"; 
	this.selector = {};
	this.selector.list = "> .hlp-slider-list-item > .hlp-slider-item";
	this.selector.add = "> .hlp-slider-list-item";

	/**
	* Установка параметров элемента в правой панели
	* 
	* @see 	ElementSettingController.setEvent()
	*/
	this.set = function(elm) 
	{
		// устанавливаем сами слайды
		this.setList(elm);
		this.setAnimate(elm);
		this.setDuration(elm);
		this.setDelay(elm);
		this.setVisible(elm);
	}

	this.setAnimate = function(elm)
	{
		var value = elm.attr(this.elmAttrAnimate);
		
		/*для старого слайдера******************************/	
		if (value == "fade") {
			value = "fadeIn";
			elm.attr(this.elmAttrAnimate, value);
		} else if (value == "slide") {
			value = "slideInLeft";
			elm.attr(this.elmAttrAnimate, value);
		}
		/*******************************/

		Select.set($(".valueWidgetSliderAnimate"), value);
	}

	this.setDelay = function(elm)
	{
		var value = elm.attr(this.elmAttrDelay);
		if (!value) value = this.getDefaultValue(elm, "delay");
		$(".valueSliderDelay").val(value);
	}

	this.setDuration = function(elm)
	{
		var value = elm.attr(this.elmAttrDuration);
		if (!value) value = this.getDefaultValue(elm, "duration");
		$(".valueSliderDuration").val(value);
	}

	// отображение элементов
	this.setVisible = function(elm)
	{
		var elmSliderV = elm.closest(".hlp-slider");
		var visibleNav = elmSliderV.attr(this.elmAttrNavNone) == "true" ? "no" : "yes";
		StyleMenu.chosenToggleBut($(".valueWidgetSliderVisibleNav"), visibleNav);
		
		var visibleList = elmSliderV.attr(this.elmAttrListNone) == "true" ? "no" : "yes";
		StyleMenu.chosenToggleBut($(".valueWidgetSliderVisibleList"), visibleList);
	}

	/**
	* Отдает значение по умолчанию
	*
	* @see 	this.setDelay()
	* @see 	this.setDuration() 
	* @see 	this.editDelay()
	* @see 	this.editDuration()
	*/
	this.getDefaultValue = function(elm, key)
	{
		var slideNameV = this.getName(elm);
		var propertyV = this.listDefaultValue[slideNameV];
		if (!propertyV) propertyV = this.listDefaultValue["other"];

		return propertyV[key];
	}

	/**
	* Отдает имя слайдера
 	*
	* @see 	this.getDefaultValue()
	*/
	this.getName = function(elm)
	{
		if (!elm) elm = Element.obj;
		var slideNameV = elm.attr("data-hlp-widget-name");

		return slideNameV;
	}
/************************************************************************************/
	
	this.editAnimate = function(elm, value)
	{
		elm.attr(this.elmAttrAnimate, value);
	}
		
	this.editDelay = function(elm, value)
	{
		if (!value) value = this.getDefaultValue(elm, "delay");
		elm.attr(this.elmAttrDelay, value);
	}

	this.editDuration = function(elm, value)
	{
		if (!value) value = this.getDefaultValue(elm, "duration");
		elm.attr(this.elmAttrDuration, value);
	}

	/**
	* Отображение
	*
	*/
	this.editVisibleNav = function(elm, value)
	{
		this.editVisible(elm, value, this.elmAttrNavNone);
	}

	this.editVisibleList = function(elm, value)
	{
		this.editVisible(elm, value, this.elmAttrListNone);
	}

	this.editVisible = function(elm, value, attrV)
	{
		var elmSliderV = elm.closest(".hlp-slider");
		if (value == "yes") elmSliderV.removeAttr(attrV);
		else elmSliderV.attr(attrV, "true"); 
	}

/************************************************************************************/

} // end class
