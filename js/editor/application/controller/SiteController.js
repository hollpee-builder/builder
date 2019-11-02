/**
* работа с сайтом
*
*
*/
var SiteController = new SiteController();
function SiteController() {
	/**
	* Ставим события
	*
	*/
	this.setEvent = function()
	{
		// сохранения сайта
		this.setEventSaveSite();
		// управление страницей
		this.setEventManagerPage();
		// управление модальными окнами
		this.setEventManagerModal();
		// изменение иконки
		this.setEventEditIcon();
		// публикация сайта
		this.setEventPublished();
	}
/***********************************************************************************************/
/***************************************************************************************************/
	/**
	* Сохранение страницы
	*
	* @uses 	this.getQueryString() 	получить строку запроса	
	* @see 		this.setEvent();
	*/
	this.setEventSaveSite = function()
	{
		var obj = this;
		$('.topMenuSave').off('mousedown');
		$('.topMenuSave').on('mousedown', function() {
			//если это элемент с hover
			if (Element.data.is_hover) {
				/**
				* @event 	StyleMenu.toggleHover()
				*/
				$('.rightHoverNavItem[type="static"]').mousedown();
			}
			
			// сохраняем
			Site.save();
		});
	}	
/********************************************************************************************/
	/**
	* Управление страницей
	*
	* @see 	this.setEvent()
	*/
	this.setEventManagerPage = function()
	{
		$(".butSelectPage").off("mousedown");
		$(".butSelectPage").on("mousedown", function() {
			ManagerPage.create();
			return false;
		});
	}

	/**
	* Управление модальным
	*
	* @see 	this.setEvent()
	*/
	this.setEventManagerModal = function()
	{
		$(".butSelectModal").off("mousedown");
		$(".butSelectModal").on("mousedown", function() {
			ManagerModal.create();
			return false;
		});
	}
/*******************************************************************************************/
	/**
	* Иконка сайта
	* 
	* @see 	this.setEvent()
	*/
	this.setEventEditIcon = function()
	{
		$(".memuButEditSiteIcon").off("mousedown");
		$(".memuButEditSiteIcon").on("mousedown", function() {
			// открываем картинок окно
			var params = {"operation":"edit_icon", "src": Data.site.data.icon};
			EditElementImage.edit(params);
		});
	}

/****************************************************************************/
	
	/**
	* Публикация сайта
	*
	* @see 	this.setEvent()
	*/
	this.setEventPublished = function()
	{
		var butObj = $(".butSitePublished");
		butObj.off("click");
		butObj.on("click", function() {
			Site.published($(this));
			return false;
		});
	}

/**************************************************************************************/
}//end class

























