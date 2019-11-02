/**
* Работа со настройками элемента
*
*
*/
var ElementSettingController = new ElementSettingController();
function ElementSettingController() {
	/**
	* Установка событий
	*
	*
	* @uses 	this.setEventClickTypeAction() 	тип действия при клике
	*/
	this.setEvent = function()
	{
		//изменение
		this.setEventEdit("menuSetting"); 

		// для виджета
		this.setEventEdit("menuWidget");
		ElementWidget.setEvent();

		//переключения типа - клик по элементу
		this.setEventClickTypeAction();
	}
/***************************************************************************************/
	/**
	* Изменение
	*
	* @see 	this.setEvent()
	* @see 	ElementWidgetSlider.setSlide()
	*/
	this.setEventEdit = function(parentClassV)
	{
		var obj = this;
		var list = $(".menuSettingButValue, ."+parentClassV+" .menuButValue"); //menuButValue
		list.off("mousedown");
		list.on("mousedown", function() {
			var elmEvent = $(this);

			// если клик по выбраной
			if (elmEvent.attr("chosen") == "true" && !elmEvent.attr("toggle")) return false;
			
			// выделяем текущий
			// если все элементы выключатели выключатель
			if (elmEvent.parent().attr("toggle")) {
				if (elmEvent.attr("chosen") == "true") elmEvent.removeAttr("chosen");
				else elmEvent.attr("chosen", "true");
			} else { // если нет
				elmEvent.parent().find(".menuSettingButValue, .menuButValue").removeAttr("chosen");
				elmEvent.attr("chosen", "true");
			}
			
			// значение
			var valueSetting = elmEvent.attr("value");
			// изменяем
			obj.edit(elmEvent, valueSetting);

			return false;
		});


		/***********************************************************/
		var parent = $("."+parentClassV);
		parent.find("input[type='button'], select").off("change");
		parent.find("input[type='button'], select").on("change", function() {
			var elmEvent = $(this);
			var value = elmEvent.attr("val");
			obj.edit(elmEvent, value);
			
			return false;
		});

		parent.find("input[type='text'], textarea").off("change keyup");
		parent.find("input[type='text'], textarea").on("change keyup", function() {
			var elmEvent = $(this);
			obj.edit(elmEvent, value);

			return false;
		});
	}

	/**
	* Изменить
	* 
	* @see this.setEventEdit()
	*/
	this.edit = function(elmEvent, value)
	{
		// Изменяем
		if (elmEvent.closest(".menuWidget").length) {
			ElementWidget.edit(elmEvent, value);
		} else {
			ElementSetting.edit(elmEvent, value);
		}

		// фиксируем историю
		if (elmEvent.hasClass("menuButValue")) elmEvent = elmEvent.parent();
		if (elmEvent.attr(History.attr.no_fixed) != "true")	{
			History.record();
		}
	}

/**********************************************************************************************/
	/**
	* Тип действия при клике по элементу
	*
	*
	*
	*/
	this.setEventClickTypeAction = function()
	{
		var obj = this;
		$('.valueTypeActionClick').off('change');
		$('.valueTypeActionClick').on('change', function() {
			//тип действия
			var type = $(this).val();

			//прячем все блоки
			$('.menuSettingClick .menuSectionParamBlock').css('display', 'none')
				.filter('[type="'+type+'"]').css('display', 'block');//показываем выбраный блок

		});
	}

/********************************************************************************************/
/*******************************************************************************************/
	




/**************************************************************************************************/
/******************************************************************************************************/



























}

















