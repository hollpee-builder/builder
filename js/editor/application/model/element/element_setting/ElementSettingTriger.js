/**
* Тригер
*
*
*/
var ElementSettingTriger = new ElementSettingTriger();
function ElementSettingTriger() {
	this.attr = {};
	this.attr.event = "data-hlp-triger-event";
	this.attr.value  = "data-hlp-triger-value";
	this.attr.videotimer_time  = "data-hlp-triger-videotimer-time";

	this.class = {};
	this.class.type_event = "selectSettingTrigerEvent";
	this.class.videotimer_time = "valueTrigerVideotimerTime";
	this.class.videotimer_hide = "valueTrigerVideotimerHide";
	this.class.videotimer_hide_elm = "hlp-triger-videotimer-hide-replace";

	this.value = {};
	this.value.event_videotimer = 'videotimer';


	this.getAttrTrigerEvent = function()
	{
		return this.attr.event;
	}

	this.getAttrTrigerValue = function()
	{
		return this.attr.value;
	}

	this.getValueEventNone = function()
	{
		return "none";
	}

	this.getAttrVideotimerTime = function()
	{
		return this.attr.videotimer_time;
	}

	this.getClassTypeEvent = function()
	{
		return this.class.type_event;
	}

	this.getClassVideotimerTime = function()
	{
		return this.class.videotimer_time;
	}

	this.getClassElmHide = function()
	{
		return this.class.videotimer_hide_elm;
	}

	// 
	this.getVarEventVideotimer = function()
	{	
		return this.value.event_videotimer;
	}

	// 
	this.isEventVideotimer = function(typeV)
	{
		return typeV == this.getVarEventVideotimer();
	}


/*********************************************************************************/

	this.getValueTypeEvent = function(elm)
	{
		if (!elm) elm = Element.getObj();

		var attrTriger = this.getAttrTrigerEvent();
		var typeV = elm.attr(attrTriger);
		if (!typeV) typeV = this.getValueEventNone();

		return typeV;
	}

	this.setValueTypeEvent = function(elm, value)
	{
		var attrTriger = this.getAttrTrigerEvent();
		if (value == this.getValueEventNone()) elm.removeAttr(attrTriger);
		else elm.attr(attrTriger, value);
	}

/**************************************************************************************/
/**************************************************************************************/

	this.set = function(elm)
	{
		// показываем блок
		this.setBlockEvent(elm);
	}

	// тип собятия
	this.setTypeEvent = function(elm)
	{
		var value = elm.attr(this.getAttrTrigerValue());
		if (!value) value = 0;

		$("."+this.getClassVideotimerTime()).val(value);
	}

/**************************************************************************************/
/**************************************************************************************/
	
	// событие
	this.editEvent = function(elm, value)
	{
		// ставим новое значение
		this.setValueTypeEvent(elm, value);
		// убираем старые значения
		elm.removeAttr(this.getAttrTrigerValue())

		// показываем
		this.setBlockEvent(elm);
	}

	this.editVideotimerTime = function(elm, value)
	{
		if (value) value = value.trim();
		if (value) value = parseInt(value);
		else value = 0;

		elm.attr(this.getAttrTrigerValue(), value);
	}

/**************************************************************************************/
	/**
	* Показываем блок событий
	*
	* @see 	this.set()
	* @see 	this.editEvent()
	*/
	this.setBlockEvent = function(elm)
	{
		// показываем блок
		var typeV = this.getValueTypeEvent(elm);
		var listBlock = $(".menuStyleBlockTriger");
		listBlock.css("display", "none");
		listBlock.filter("[data-type='"+typeV+"']").css("display", "block");

		// отмечаем select
		Select.set($("."+this.getClassTypeEvent()), typeV);

		// ставим параметры
		// видео таймер
		if (this.isEventVideotimer(typeV)) {
			this.setTypeEvent(elm);
			this.setVideotimer(elm);
		}
	}

	this.setVideotimer = function(elm)
	{
		var classHideV = this.getClassElmHide();
		var value = elm.hasClass(classHideV) ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valueTrigerVideotimerHide"), value);
	}

	this.editVideotimerHide = function(elm, value)
	{
		var classHideV = this.getClassElmHide();
		if (value == "yes") elm.addClass(classHideV);
		else elm.removeClass(classHideV);
	}


	

} // end class
