/**
* История
*
*/ 
var History = new History();
function History() {
	/**
	* @var 	array 	список данных о элементах
	* @set 	this.record()
	* @see 	this.set()
	*/
	this.listData = [];

	/**
	* @var 	array 	список страниц
	* @set 	this.record()
	* @see 	this.set()
	*/
	this.listPage = [];

	/**
	* @var 	array 	текущий номер
	* @set	this.record(), this.back(), this.next()	
	* @see 	this.set()
	*/
	this.currKey = 'false';

	/**
	* @var 		int 			лимит записей в истории
	* @see 		this.record()
	*/
	this.limit = 30;

	/**
	* Статус фиксирования истории
	*
	* @set 	Key.incDecInput() 
	* @set 	SpecialInput.editValue()
	*/
	this.isFixed = true;

	this.noFixedAll = false;

	this.attr = {};
	this.attr.no_fixed = "data-history-no-fixed";
/***********************************************************************************/
	/**
	* Записует в историю
	* 
	* @see 	ElementStyleController.setEventMenuEdit()	изменение стиля
	* @see 	ElementManController.setEvent()				вставить элемент
	* @see 	ElementBasic.create()						добавление элемента
	* @see 	this.newPage() 								новая страница
	* @see 	PageStruct.moveElm()
	* @see 	Resize.ssetEventMouseUp()
	* @see 	TextEditor.hide()
	* @see 	Guides.guidesDown()
	* @see 	Input.init()
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	StyleMenuFixed.setEventDelete()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	EditElementImage.saveVideo()
	* @see 	ElementSlider.setEventAdd(), .setEventDelete() 
	* @see 	ElementMan.delete()
	* @see 	EditElementImage.save()
	* @see 	PageSetting.setEventCode(), .setEventSeo()
	*/
	this.record = function()
	{ 
		//ключ
		this.currKey = this.currKey == 'false' ? 0 : this.currKey + 1;
		var key = this.currKey;

		//устанавливаем значение
		//страница
		this.listPage[key] = this.getHtml();
		//данные
		/**
		* @todo  помещять стили css
		*/
		var listData = [
			copyArray(Data.site.data), 
			copyArray(Data.page.data)];
		this.listData[key] = JSON.stringify(listData);
		
		//очищяет первый элемент, если превышен лимит
		if (key > this.limit) {
			this.clearExcess();
		}
		
		//очищаем то что после ключа если после шага назад, произошла запись истории
		var pos = key+1;
		if (this.listPage[pos]) {
			this.clearAfter(pos);
		}

		//убираем кнопку вперед 
		$('.topMenuNext').attr('status', 'false');
		//если первая запись в истории, показываем кнопку назад
		if (key == 1) $('.topMenuBack').attr('status', 'true');

		/********/
		//фиксируем шаг для автосохранения, самое первое не фиксируем
		if (key > 0) Site.addStepAutoSave(); 
		// статус - не опубликован
		Site.setStatusPublishedNo();

		History.isFixedAll = false;
	}
	
	/**
	* Заменяем картинки в истории
	*
	* @see 	EditElementImage.replaceImageForPage()
	*/
	this.replaceImage = function(oldSrc, newSrc)
	{
		var patter = new RegExp(oldSrc, "gim");
		// страница
		var historyPage = JSON.stringify(History.listPage).replace(patter, newSrc);
		History.listPage = JSON.parse(historyPage);
		// данные
		var historyData = JSON.stringify(History.listData).replace(patter, newSrc);
		History.listData = JSON.parse(historyData);
	}
/*************************************************************************************/
	/**
	* Отдает html страницы
	*
	* @return 	html 	текущию страницу 
	*
	* @see 		this.record()
	*/
	this.getHtml = function()
	{
		// Resize.remove();
		var contentHtml = this.getParentContent().html();
		// Resize.create();

		return contentHtml;
	}
	
	/**
	* Отдает родителя содержимого
	*
	* @see 	this.getHtml()
	* @see 	this.set()
	*/
	this.getParentContent = function()
	{
		var elmContent = $('.content');
		// страница иил модальное
		if (elmContent.css("display") == "block") var parentContent = elmContent;
		else  var parentContent = $(".contentModal");

		return parentContent;
	}
/*************************************************************************************/
	/**
	* Если привышен лимит то убирает первый элемент
	*
	* @uses 	this.currKey 		получаем текущий ключ
	* @uses 	this.listPage 		список страниц
	* @uses 	this.listData 		список данных
	* @see 		this.record()
	*/
	this.clearExcess = function() {
		this.listPage.splice(0, 1);
		this.listData.splice(0, 1);
		//меньшаем ключ на один	
		this.currKey--;
	}
/************************************************************************************/
	/**
	* Очищяет массив после указаного ключа
	*
	* @see 	this.record()
	* @see 	Page.replace()
	*/
	this.clearAfter = function(key)
	{
		//сколько записей нужно убрать
		var count = this.listPage.length - key; 
		//убираем записи
		this.listPage.splice(key, count);
		this.listData.splice(key, count);
	}

/**********************************************************************************/
/*********************************************************************************/
	/**
	* Устанавливаем запись из истории
	* 
	* @uses 	this.currKey 			получаем текущий ключ
	* @uses 	this.listPage 			список страниц
	* @uses 	this.listData 			список данных
	* @uses 	SetEvent.newCanvas() 	установить события для полотна
	* @uses 	this.setPosTabHover() 	установить положение вкладки hover
	*
	* @see 		this.back(), this.next()
	*/
	this.set = function() {
		var parentContent = this.getParentContent();

		//ключ
		var key = this.currKey;
		//устанавливаем текущию запись
		//страница
		parentContent.html(this.listPage[key]);
		//ставим css стили
		var listData = JSON.parse(this.listData[key]);
		// основа страницы
		Data.site.data = listData[0];
		ElementCss.createListTagStyle("site");

		// страница
		Data.page.data = listData[1];
		ElementCss.createListTagStyle("page"); 

		//ставим события для полотна
		Input.newCanvas();
		// ставим тип экрана
		$(".butShowItem[screen='"+$(".content").attr("screen")+"']").mousedown();

		//эмитируем клик
		$('.elementSelected').removeClass('elementSelected')
			.mousedown()
			.mouseup();

		//установить положение вкладки hover
		/**
		* @todo  потом доделать, когда будит понятно как будит ставиться hover
		*/
		// this.setPosTabHover();
		
		// ставим скрол
		StyleCanvas.setScrollTopElm(Element.obj);
		// $(".content").scrollTop(scrollTop);
		// установка кнопки "Назад на страницу"
		EditorController.setEventTab();
	}
/***************************************************************************************/
	/**
	* Установить положение вкладки hover
	*
	* @see 	this.set()
	*/
	this.setPosTabHover = function()
	{
		//если это не первый клик
		var data = Data.getElement($('.elementSelected').attr('id'));
		if (data && $('.elementSelected').length) {
			//если у элемента есть hover
			if (data.is_hover) {
				//ставим вкладку в положение соответсвующего текущему состоянию
				var status = data.style.status;
				$('.rightHoverNavItem[type="'+status+'"]')
					.mousedown();//@event 	StyleMenu.toggleHover()
			}
		}
	}
/**************************************************************************************/
	/**
	* Обнулить
	*
	* @see 	Page.replace()
	* @see 	EditorController.setEventTab()
	* @see 	ManagerModal.setInCanvas()
	*/
	this.reset = function()
	{
		$(".topMenuBlockHistory .topMenuItem").attr("status", "false");
		this.listData = [];
		this.listPage = [];
		this.currKey = "false";
		this.record();
	}
/************************************************************************************/
/***********************************************************************************/
	/**
	* Назад по истории
	*
	* @uses 	this.set() 			устаналиваем запись из истории
	* @uses 	this.currKey 		получаем текущий ключ
	* @see 		PageController.setEventHistory()
	*/
	this.back = function() {
		//устанавливаем значение
		this.currKey--;
		//востанавливаем историю
		this.set();

		//устанавливаем кнопку вперед
		$('.topMenuNext').attr('status', 'true');
		//если первая запись убираем кнопку назад
		if (!this.currKey) $('.topMenuBack').attr('status', 'false');
	}

	/**
	* Вперед по истории
	*
	* @uses 	this.set() 			устаналиваем запись из истории
	* @uses 	this.currKey 		устанавливает значение
	* @see 		PageController.setEventHistory()
	*/
	this.next = function() {
		//устанавливаем значение
		this.currKey++;
		//востанавливаем историю
		this.set();

		//показать кнопку назад
		$('.topMenuBack').attr('status', 'true');
		//если последняя запись, убираем кнопку вперед
		if (this.currKey >= (this.listData.length-1)) $('.topMenuNext').attr('status', 'false');
	}
/****************************************************************************/


}









