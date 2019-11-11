/**
* Фиксированые настройки
*
*
*/
var ElementSettingFixed = new ElementSettingFixed();
function ElementSettingFixed() {
	/**
	* Устанавливаем настройки 
	*
	*
	*/
	this.set = function(elm)
	{
		// отображение
		this.setVisible(elm);
	}
/*****************************************************************************************/
	/** 
	* Устанавливаем параметр отображение
	* 
	* @see 	this.set()
	*/
	this.setVisible = function(elm)
	{
		var sectionVisible = $(".menuFixedVisible");
		sectionVisible.css("display", "block"); //показываем если после row

		if (!Element.isSettingVisible(elm)) {
			sectionVisible.css("display", "none");
			return false;
		}
		
		var listVisible = ElementCss.getListValueVisible();
		$(".menuButVisible").removeAttr("chosen");
		
		// устанавливаем значение
		for (var screen in listVisible) {
			var visible = listVisible[screen];
			var butItem = $(".menuButVisible[value^='"+screen+"']");
			if (visible == "block" || visible == "inline-block") {
				butItem.attr("chosen", "true");
			}
		}
	}

	/**
	* Изменить отображение 
	*
	*
	*/
	this.editVisible = function(elm, screenAction, elmEvent)
	{
		// ставим стиль
		if (elmEvent.attr("chosen")) {
			var visibleNew = elm.hasClass("text-span") ? "inline-block" : "block";
		} else {
			var visibleNew = "none";
		}
		
		ElementCss.clearAllScreen(["display"], "geometry", elm, screenAction);
		elm.css("display", visibleNew);
		ElementCss.set("geometry", elm, screenAction);
		
		// ставим кнопки
		this.setVisible(elm);
	}

	/**
	* Устанавливает visible на определеный экран
	*
	* @see 	this.editVisible()
	*/
	this.setPropertyVisible = function(elmObj, screenItem, propertyValue)
	{
		var listStyle = {"display":propertyValue};
		ElementCss.set("geometry", elmObj, screenItem, listStyle);
	}

/**********************************************************************************************/

}//end class



