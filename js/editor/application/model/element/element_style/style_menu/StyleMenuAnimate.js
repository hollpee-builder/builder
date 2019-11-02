StyleMenuAnimate.prototype = StyleMenu;
var StyleMenuAnimate = new StyleMenuAnimate();
function StyleMenuAnimate() {
	this.durationDefault = 1500;
	this.delayDefault = 300;

	this.set = function(elm)
	{
		var loadValueV = elm.attr("data-hlp-animated-load");
		if (!loadValueV) loadValueV = "none";
		Select.set($(".selectAnimatedLoad"), loadValueV);
		
		var scrollValueV = elm.attr("data-hlp-animated-scroll");
		if (!scrollValueV) scrollValueV = "none";
		Select.set($(".selectAnimatedScroll"), scrollValueV);

		var hoverValueV = elm.attr("data-hlp-animated-hover");
		if (!hoverValueV) hoverValueV = "none";
		Select.set($(".selectAnimatedHover"), hoverValueV);

		// тип события
		this.setEventType(elm);

		/**/
		// dalay
		this.setProperty(elm, "delay", false, $(".valueSettingAnimateDelay"));
		this.setProperty(elm, "delay", "hover", $(".valueSettingAnimateDelayHover"));

		// duration
		this.setProperty(elm, "duration", false, $(".valueSettingAnimateDuration"));
		this.setProperty(elm, "duration", "hover", $(".valueSettingAnimateDurationHover"));
	}

	this.setProperty = function(elm, type, stateV, inputObjV)
	{
		var propertyValueV = ElementCss.getStyle("animation-"+type, "style", elm, "desktop", stateV);
		var classAddedStatusV = Element.existClassAdded(elm);
		if (!propertyValueV && classAddedStatusV) {
			var classUniqV = Element.getClassUnique(elm);
			propertyValueV = ElementCss.getStyle("animation-"+type, "style", elm, "desktop", stateV, classUniqV);
		}

		if (propertyValueV) {
			propertyValueV = parseFloat(propertyValueV);
			propertyValueV = parseInt(propertyValueV * 1000);
		} else {
			if (type == "duration") {
				// propertyValueV = parseFloat(elm.css("animation-duration"));
				// propertyValueV *= 1000;
				propertyValueV = this.durationDefault;
			} else {
				propertyValueV = this.delayDefault;
			}
		}

		inputObjV.val(propertyValueV);
	}

	this.setEventType = function(elm)
	{
		var eventTypeV = elm.attr("data-animated-event");
		if (!eventTypeV) eventTypeV = "scroll";

		var scrollBlockVisible = eventTypeV == "scroll" ? "block" : "none";
		var loadBlockVisible = eventTypeV == "load" ? "block" : "none";
		$(".menuRowAnimateScroll").css("display", scrollBlockVisible);
		$(".menuRowAnimateLoad").css("display", loadBlockVisible);

		Select.set($(".selectAnimatedEventType"), eventTypeV);
	}

/*********************************************************************************/

	this.editEventType = function(elm, value)
	{
		var classUniqV = Element.getClassUnique(elm);
		var listElmV = $("."+classUniqV);

		listElmV.attr("data-animated-event", value);
		listElmV.removeAttr("data-hlp-animated-scroll");
		listElmV.removeAttr("data-hlp-animated-load");

		// var listElmScrollV = this.getAllObjV(elm, "scroll");
		// listElmScrollV.removeAttr("data-hlp-animated-scroll");
		// var listElmLoadV = this.getAllObjV(elm, "load");
		// listElmLoadV.removeAttr("data-hlp-animated-load");
		
		this.set(elm);
	}

	this.editLoad = function(elm, value)
	{
		this.editAnimate(elm, "load", value);
	}

	this.editScroll = function(elm, value)
	{
		this.editAnimate(elm, "scroll", value);
	}

	this.editHover = function(elm, value)
	{
		this.editAnimate(elm, "hover", value);
	}

	this.editAnimate = function(elm, typeV, value)
	{
		var listElmObjV = this.getAllObjV(elm, typeV);

		if (value == "none") {
			listElmObjV.removeAttr("data-hlp-animated-"+typeV);
		} else {
			listElmObjV.attr("data-hlp-animated-"+typeV, value);
		}
	}

	this.getAllObjV = function(elm, typeV)
	{
		var animPropV = "data-hlp-animated-"+typeV;
		var animPropValueV = elm.attr(animPropV);
		var listElmV = Element.getAllObject(elm);

		if (animPropValueV) {
			listElmV = listElmV.filter("["+animPropV+"='"+animPropValueV+"']");
		} else {
			listElmV = listElmV.not("["+animPropV+"]");
		}

		return listElmV;
	}

	/**
	* Перенес в Element.addStdAddedClass()
	*
	* Когда изменяется класс
	*
	* @see 	StyleMenuFixed.editClass() 
	* @see 	StyleMenuFixed.setEventAddClass()
	* @see 	ElementBasic.createAction() StyleMenuAnimate.editClass
	*/
	// this.editClass = function(originElmV, newElmV)
	// {
	// 	if (!originElmV.length) return false;

	// 	var eventTypeV = originElmV.attr("data-animated-event");
	// 	newElmV.attr("data-animated-event", eventTypeV);

	// 	var anmTypeLoad = originElmV.attr("data-hlp-animated-load");
	// 	var anmTypeScroll = originElmV.attr("data-hlp-animated-scroll");
	// 	var anmTypeHover = originElmV.attr("data-hlp-animated-hover");

	// 	if (anmTypeLoad) newElmV.attr("data-hlp-animated-load", anmTypeLoad);
	// 	if (anmTypeScroll) newElmV.attr("data-hlp-animated-scroll", anmTypeLoad);
	// 	if (anmTypeHover) newElmV.attr("data-hlp-animated-hover", anmTypeLoad);
	// }

/********************************************************************************/

	this.editDelay = function(elm, value, elmEvent)
	{
		this.editProperty(elm, value, elmEvent, "delay");
	}

	this.editDuration = function(elm, value, elmEvent)
	{
		this.editProperty(elm, value, elmEvent, "duration");
	}

	this.editProperty = function(elm, value, elmEvent, type)
	{
		if (value) value = parseInt(value);
		elmEvent.val(value);

		var stateV = elmEvent.attr("data-state");

		value = value / 1000;
		value = parseFloat(value.toFixed(2));
		elm.css("animation-"+type, value+"s");
		ElementCss.set("style", elm, "desktop", false, stateV);
	}

	/**
	* Сброс стилей
	*
	* @see 	ElementCss.actionAfterClearing()
	*/
	this.resetStyle = function(elm)
	{
		if (!elm) elm = Element.obj;

		var elmClassUniqV = Element.getClassUnique(elm);
		var elmNoClassAddedV = $("."+elmClassUniqV).not("[class-added]");

		var listTypeEventV = ["load", "scroll", "hover"];
		for (var iEvent in listTypeEventV) {
			var eventTypeV = listTypeEventV[iEvent];
			var listAllObjV = this.getAllObjV(elm, eventTypeV);

			var eventPropV = "data-hlp-animated-"+eventTypeV;
			var eventPropValueV = elmNoClassAddedV.attr(eventPropV);
			
			listAllObjV.removeAttr(eventPropV);

			// если есть доп класс
			if (Element.existClassAdded(elm) && eventPropValueV) {
				listAllObjV.attr(eventPropV, eventPropValueV);
			}
		}
	}

	/**
	* Очищает все от анимаций
	*
	* @see 	Editor.modeEdit()
	* @see 	Page.replace()
	* @see 	Site.clearHtml()
	*/
	this.clearAll = function()
	{
		var listElm = $(".animated");
		var countElmV = listElm.length;
		for (var iElm = 0; iElm < countElmV; iElm++) {
			var elmObjV = listElm.eq(iElm);

			var anmTypeLoad = elmObjV.attr("data-hlp-animated-load");
			var anmTypeScroll = elmObjV.attr("data-hlp-animated-scroll");
			var anmTypeHover = elmObjV.attr("data-hlp-animated-hover");

			elmObjV.removeClass("animated")
					.removeClass(anmTypeLoad)
					.removeClass(anmTypeScroll)
					.removeClass(anmTypeHover)
					.removeAttr("data-hlp-offset-top");
		}

	}

} // end class
