/**
* Манипулирование элементом(удаление, копирование)
*
*
*
*/
var ElementManController = new ElementManController();
function ElementManController() {
	/**
	* События
	*
	* @uses 	ElementMan.*() 	манипуляция с элементом
	* @see 		setEvent() 		
	*/
	this.setEvent = function()
	{	
		this.setEventStandart();
		this.setEventModeSimple();
	}

	/**
	* Сиандартные
	*
	* @see 	this.setEvent()
	*/
	this.setEventStandart = function()
	{
		var listBut = $('.butElementMan, .butDeleteSimpleBlock');
		listBut.off('mousedown');
		listBut.on('mousedown', function() {
			if ($(this).attr("data-no-active")) return false;
			
			var elm_event = $(this);
			var elm = Element.obj;
			var type = elm_event.attr('type');

			var errorNoMan = Resource.hlp_manipulation_notification_no;
			if (!Element.isManipulation(elm, type)) {
				Notification.error(errorNoMan);
				return false;
			} else if (elm.attr("data-property-no-manipulation") == "true" && type != 'insert') {
				Notification.error(errorNoMan);
				return false;
			} else if (Element.data.only_delete && (type == 'cut' || type == 'copy')) {
				return false;
			} else {
				ElementMan[type]();

				//если не копирование, то фиксируем историю
				if (type != 'copy' && type != 'delete') {
					History.record();
				}
			}
		});
	}

/*************************************************************************************/
	
	/**
	* Для упращеного режима
	*
	* @see 	this.setEvent()
	*/
	this.setEventModeSimple = function()
	{
		this.setEventModeSimpleMove();
	}

	/**
	* Перемещение
	*
	* @see 	this.setEventModeSimple()
	*/
	this.setEventModeSimpleMove = function()
	{
		var butObj = $(".butPrevSimpleBlock, .butNextSimpleBlock, .butMoveSection");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var butEvent = $(this);
			if (butEvent.attr("data-no-active")) return false;
			var operationType = butEvent.hasClass("butPrevSimpleBlock") 
									|| butEvent.hasClass("butMoveUpSection") 
										? "prev" : "next";

			var elm = Element.obj;
			var elmHtml = ElementMan.getHtmlElmAll(elm, true); 

			if (operationType == "prev") {
				var prevElm = elm.prev();
				if (!prevElm || !prevElm.length) return false;
				elm.remove();
				prevElm.before(elmHtml);
				var newElm = prevElm.prev();
			} else {
				var nextElm = elm.next();
				elm.remove();
				nextElm.after(elmHtml);
				
				if (!nextElm || !nextElm.length) return false;
				var newElm = nextElm.next();
			}

			Input.newCanvas();
			Element.obj = newElm;
			Resize.create();

			StyleCanvas.setScrollTopElm(newElm);

			// если колонка
			if (Element.isColumn(newElm)) {
				ElementSettingGrid.setColumnNoIndent();
			}

			// история
			History.record();

			return false;
		});
	}
	

/********************************************************************************************/
/***********************************************************************************************/
	/**
	* События для секции
	*
	* @see 	Resize.create()
	*/
	this.setEventForSection = function()
	{
		// ставим статус для кнопок секции
		this.setStatusButForSection();

		// ставим событие
		var obj = this;
		var listButObj = $(".butAddedItemSection, .butMoveDownSection, .butMoveUpSection");
		listButObj.off("mousedown");
		listButObj.on("mousedown", function() {
			var elmEvent = $(this);
			var status = elmEvent.attr("status");
			// кнопка активная
			if (status != "false") {
				var type = elmEvent.attr("type");
				// запускаем функцию
				var nameFunc = type+"Section";
				obj[nameFunc]();
			}
		});
	}

	/**
	* Удаление секции
	* @see 	this.setEventForSection()
	*/
	this.deleteSection = function()
	{
		var elm = Element.obj;
		var elmNext = elm.next();
		if (!elmNext.length) elmNext = elm.prev();

		$(".topMenuDelete").mousedown();

		setTimeout(function() { elmNext.mousedown().mouseup(); }, 10);
	}

	/**
	* Копирование секции
	* @see 	this.setEventForSection()
	*/
	this.copySection = function()
	{
		$(".topMenuCopy").mousedown();
		$(".topMenuInsert").mousedown();

		setTimeout(function() { Element.obj.next().mousedown().mouseup(); }, 10);
	}

	/**
	* Перемещение вниз секции
	* @see 	this.setEventForSection()
	*/
	this.moveDownSection = function()
	{
		// вырезаем
		ElementMan.cut();
		// вставляем
		ElementMan.insert("after");
		// ставим отметку что нельзя выбирать сайт
		ElementStyleController.noSelectedSite = true;
	}

	/**
	* Перемещение вверх секции
	* @see 	this.setEventForSection()
	*/
	this.moveUpSection = function()
	{
		// данные
		var elm = Element.obj;
		var elmBefore = elm.prev();
		var block = ElementMan.insertElmInBuffer();

		// удаляем
		elm.remove();

		// вставляем 
		elmBefore.before(block);
		Input.newCanvas();
		var newElm = $(".section[status='new']").removeAttr("status");
		StyleCanvas.setScrollTopElm(newElm); // ставим scroll  на полотне
		setTimeout(function() { newElm.mousedown().mouseup(); }, 10);
	}
/*******************************************************************************************/
	/**
	* Устанавливает статус для кпопок секции
	*
	* @see 	this.setEventForSection()
	*/
	this.setStatusButForSection = function()
	{
		var selectedElm = Element.obj;

		// секция первая
		if (this.isFirstSection(selectedElm)) {
			$(".butMoveUpSection").attr("status", "false");
		 
		} 
		//последняя секция
		if (this.isLastSection(selectedElm)) {
			$(".butMoveDownSection").attr("status", "false");
		}
	}

	/**
	* Узнает первая секция или нет
	* @see 	this.setStatusButForSection()
	*/
	this.isFirstSection = function(elm) 
	{
		var res = elm.prev().hasClass("section");
		if (res) return false;	
		else return true;
	}

	/**
	* Узнает последяняя секция или нет
	* @see 	this.setStatusButForSection()
	* @see 	this.moveUpSection()
	*/
	this.isLastSection = function(elm) 
	{
		var res = elm.next().hasClass("section");
		if (res) return false;	
		else return true;
	}

/**********************************************************************************/	
/**для элементов*****************************************************************************************/
	




/***********************************************************************************/

}//end class
























