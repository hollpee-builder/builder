/**
* Настройки элемента в правой меню
*
*
*/
var ElementSetting = new ElementSetting();
function ElementSetting() {
	/**
	* Установка параметров элемента в правой панели
	* 
	* @uses 	this.list_func_by_type					список функций
	* @see 		ElementStyleController.noteElement() 	при выборе нового элемента
	*/
	this.set = function() 
	{
		var elm = Element.obj;

		//убираем блоки
		$('.menuSetting .menuOneStyle').css('display', 'none');
		// сбрасываем выделение
		$(".menuSetting *, .rightMenuFixedProperty[type='setting'] .menuSettingButValue")
										.removeAttr("chosen");

		// устанавливаем значение
		var listSetting = Element.data.setting;
		if (!listSetting) listSetting = [];

		// для всех
		if (!elm.hasClass("modal")) {
			listSetting[listSetting.length] = "triger";
		}

		if (!Element.isElmChildForm(elm)) {
			listSetting[listSetting.length] = "export";
		}
		
		// устанавливаем параметры
		for (var indexSetting in listSetting) {
			var setting = this.list[listSetting[indexSetting]];

			// показываем блок
			$('.'+setting["block"]).css("display", "block");
			
			// запускаем функцию установки значения
			var nameFunc = setting.function;
			if (!nameFunc) nameFunc = "set";
			setting.object[nameFunc](elm);
		}

		// фиксированые параметры
		ElementSettingFixed.set(elm);
		// general настройки
		$(".menuSettingGeneral").css("display", "block");
		ElementSettingGeneral.set(elm);

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
		var setting = elmEvent.attr("setting");
		if (!setting) setting = elmEvent.parent().attr("setting");

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
		var pattern = new RegExp("^(fixed|general|grid|click|heading|text|section|form|seo|export|triger|template)", "gi");
		// название объекта
		var nameObj = pattern.exec(setting)[0];
		 // название функции
		var nameFunc =setting.replace(pattern, '');
		nameFunc = "edit"+nameFunc;
		
		var classObject = this.list[nameObj];
		
		// если нету такого метода
		// if (!classObject["object"][nameFunc]) nameFunc = ListFunct[nameFunc];

		// запускаем
		classObject["object"][nameFunc](elm, valueSetting, elmEvent);
	}

/***************************************************************************************************/
/***************************************************************************************************/
	
	this.setEvent = function()
	{
		ElementSettingGeneral.setEvent();
	}


/***************************************************************************************************/
}//end class



