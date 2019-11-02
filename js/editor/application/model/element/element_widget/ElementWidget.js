/**
* Настройки элемента в правой меню
*
*
*/
var ElementWidget = new ElementWidget();
function ElementWidget() {
	/**
	* Установка параметров элемента в правой панели
	* 
	*/
	this.set = function() 
	{
		var elm = Element.obj;
		$(".menuWidget .menuWidgetElement").css("display", "none");

		// устанавливаем значение
		var listWidget = Element.data.widget;
		if (!listWidget) listWidget = [];
		for (var iWidget in listWidget) {
			var widgetName = listWidget[iWidget];

			var widgetV = this.list[widgetName];
			if (!widgetV) return false;

			// показываем блок
			var blockObjV = $('.'+widgetV["block"]);
			blockObjV.css("display", "block");
			blockObjV.find(".menuOneStyle").css("display", "block");
			
			// запускаем функцию установки значения
			var nameFunc = widgetV.function;
			if (!nameFunc) nameFunc = "set";
			widgetV.object[nameFunc](elm);
		}

		StyleMenu.setScroll(); 
	}

/*****************************************************************************************************/
	
	/**
	* Изменить
	*
	* @see 	ElementSettingController.edit() 
	*/
	this.edit = function(elmEvent)
	{
		var elm = Element.obj;
		// настройка
		var setting = elmEvent.attr("widget");
		if (!setting) setting = elmEvent.parent().attr("widget");

		var valueSetting = StyleMenu.getElmValue(elmEvent);

		// запускаем функцию
		this.launchByName(elm, setting, valueSetting, elmEvent);

		//если это scroll то ставим его на позицию нового значения
		if (elmEvent.attr("maxval")) {
			StyleMenu.setScroll(elmEvent); 
		}
	}

	/**
	* Запускаем функцию
	* 
	* @see this.edit()
	*/
	this.launchByName = function(elm, setting, valueSetting, elmEvent)
	{
		var pattern = new RegExp("^(slider|tabs|gallery_modal|gallery|block_hover)", "gi");
		// название объекта
		var nameObj = pattern.exec(setting)[0];
		// название функции
		var nameFunc = setting.replace(pattern, '');
		nameFunc = "edit"+nameFunc;
		
		var classObject = this.list[nameObj];
		
		// запускаем
		classObject["object"][nameFunc](elm, valueSetting, elmEvent);
	}

/***************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* Установка событий
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		ElementWidgetSlider.setEvent();
		ElementWidgetTabs.setEvent();
	}

/***************************************************************************************************/
}//end class



