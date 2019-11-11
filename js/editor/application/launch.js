/**
* Входная точка
*
*/
/********************************************************************************/
var Input = new Input();
function Input() {
	/**
	* Запуск системы
	*
	*
	*/	
	this.init = function(params)
	{
		//ставим переменые
		Data.set(params);

		//вставляем страницу в редактор
		Site.insert();
		Page.insertFirst();
		
		// ставим события
		this.setEvent();

		// делаем не активными некоторые действия
		this.setNoActivityAction();
		// ставим размер экрана
		Editor.setSize();

		// фиксируе историю
		History.record();

		// // режим редактора
		// var modeV = Data.site.data.mode_simple ? "lite" : "pro";
		// Editor.setModeWork(modeV);

		// режим редактора
		Editor.setModeWork("pro");
	}	
/*************************************************************************************/
	/**
	* Устанавливает события для всего редактора
	*
	*
	*/
	this.setEvent = function()
	{
		//переделать
		setEventGeneral();
	/***************************************************************************/
	/****************************************************************************/
		//изменение стиля
		ElementStyleController.setEvent();
		//изменение настроек
		ElementSettingController.setEvent();
		//добавление элемента
		ElementAddController.setEvent();
		//манипуляция с элементом
		ElementManController.setEvent();
		// для сайта
		SiteController.setEvent();
		//страница
		PageController.setEvent();
		//редактор
		EditorController.setEvent();
	}
/***********************************************************************************/
	/**
	* Делаем не активными некоторые действия
	*
	*/
	this.setNoActivityAction = function()
	{
		//делаем что бы не чего не выделялось
		var list = $('.topPanel, .scaleWrap, .leftMenu, .scroll, .rightMenuSectionTitle, .handBorderBlock');
		list.attr('onmousedown', 'return false');
	}
/*************************************************************************************/
	/**
	* Новый элемент
	*
	* @see 	SelfElement.setEvent() 			создание и вставление на страницу элемента
	* @see 	History.set()  					устанавливаем запись из истории
	* @see 	Page.replace() 				замена страницы
	* @see 	ElementSettingGrid.editDesctopCount()
	* @see 	PageStruct.moveElm()
	* @see 	ElementSettingHeading.edit()
	* @see 	ManagerModal.setInCanvas()
	* @see 	ElementManController.moveUpSection()
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	ElementSlider.setEventAdd()
	* @see 	ElementGallery.setEventAddItem()
	* @see 	ElementManController.setEventModeSimpleCopy()
	*/
	this.newCanvas = function() 
	{		
		//событие полотна
		ElementStyleController.setEventCanvas();
		//изменение элемента
		ElementEditController.setEvent();
		//выделить элементы рамкой(если стоят галочки)
		// StyleCanvas.allocateAll();
		// строим структуру
		PageStruct.build();

		setTimeout(function() {
			Guides.setEvent();
		}, 100);
	}
/****************************************************************************************/

}

