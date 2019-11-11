/**
* Работа с страницей
*
*
*
*/
var PageController = new PageController();
function PageController() {
	/**
	* @var 	int 	id страницы 	
	*/
	this.page_id = '';

	/**
	* @var 	int 	номер варианта 	
	*/
	this.option_number = '';

	/**
	* @var 	html 	страница desctop 	
	*/
	this.html_desctop = '';
	
	/**
	* @var 	html 	страница mobile 	
	*/
	this.html_mobile = '';

	/**
	* @var 	 string 	текущий тип
	*/
	this.curr_type = 'desctop';
/***************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* События 
	*
	* @uses 	this.setEventSavePage() 	сохранение страницы
	* @uses 	this.setEventHistory() 		история
	* @uses 	this.setEventRedactorMode()	режим редактора
	* @see 		setEvent() 	
	*/
	this.setEvent = function()
	{
		//история
		this.setEventHistory();
		//устанавливаем видео в режим простотр
		this.editStateElmVideo($('.redactorPageEdit'));
	}
/************************************************************************************************/
	/**
	* История
	*
	* @uses 	History.next() 	вперед по истории
	* @uses 	History.back() 	назад по истории
	* @see 		this.setEvent()
	*/
	this.setEventHistory = function()
	{
		$('.topMenuBlockHistory .topMenuItem').off('mousedown');
		$('.topMenuBlockHistory .topMenuItem').on('mousedown', function() {
			var elm_event = $(this);
			//если активна кнопка
			if (elm_event.attr('status') != 'false') {
				//выполняем движение по истории
				History[elm_event.attr('type')]();
			}
		});
	} 
/**************************************************************************************************/
/***************************************************************************************************/
/************************************************************************************************/
	
/**********************************************************************************************/

	/**
	* События в режиме просмотр
	*
	* @see 	this.setEventRedactorMode()
	*/
	this.setEventShowMode = function()
	{
		//убираем состояние hover если оно есть у элемента
		StyleCanvas.setStyleHover($('.redactorPageShow .elementSelected'), 'static', 'true');

		var list_elm = '.redactorPageShow .elementWrap[is_hover="true"]';
		$(list_elm).off('mouseover');
		$(list_elm).on('mouseover', function() {	
			StyleCanvas.setStyleHover($(this), 'hover', true);
		});

		$(list_elm).off('mouseout');
		$(list_elm).on('mouseout', function() {
			StyleCanvas.setStyleHover($(this), 'static', true);
		});
	}
/***************************************************************************************************/
/****устанавливаем элементы в режим просмотра и редактирования***********************************************************************************************/
	/** 
	* События в режиме просмотр для элементов video (атрибут autoplay)
	*
	* @param 	obj 		par-родитель элементов
	* @param 	boolean 	status_autoplay - статус автоплея
	*
	* @see 		this.processHtmlAll()
	* @see 		this.setEventRedactorMode()
	* @see 		this.setEvent()
	*/
	this.editStateElmVideo = function(par, status_autoplay)
	{
		//список видео
		var list_elm = par.find('.elementVideo');
		
		var len = list_elm.length;
		for (var i = 0; i < len; i++) {	
			var elm = list_elm.eq(i);
			var id = elm.attr('id');
			
			//получить src	
			var src = EditElementVideo.getSrc(DataElm[id]['param'], status_autoplay);
			//вставить src
			elm.find('.selfVideo').attr('src', src);
		}

	}
/*************************************************************************************/
}//end class






