$(window).ready(function() {
	Editor.init();
});


var Editor = new Editor();
function Editor() {
	
	this.init = function()
	{	
		// устанавливает параметры
		$(".hlp-site:first").addClass("h-canvas");
		Site.siteId = $(".h-site-id").text().trim();
		Site.pageId = Site.siteId;

		// устанавливает события
		this.setEvent();
		// init элементов
		Element.init();
	}

	/**
	* Устанавливает события
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		// сохранение
		this.setEventSave();
		// seo
		this.setEventSeo();
		// modal
		this.setEventModal();
		// выход
		this.setEventExit();
		// изменение размера окна браузера
		this.setEventResize();
	}

	/**
	* Сохранение
	*
	* @see 	this.setEvent()
	*/
	this.setEventSave = function()
	{
		var obj = this;
		$(".h-but-save").off("click");
		$(".h-but-save").on("click", function() {
			Site.save();
		});
	}

	/**
	* Модальные окна
	*
	* @see 	this.setEvent()
	*/
	this.setEventModal = function()
	{
		$(".h-but-modal").off("click");
		$(".h-but-modal").on("click", function() {
			// показываем менеджера модальных окон
			ElementModalE.showManager();

			return false;
		});
	}

/***********************************************************************************/
	/**
	* Выход из редактора
	*
	* @see 	this.setEvent()
	*/
	this.setEventExit = function()
	{
		$(window).off("beforeunload");
		$(window).on("beforeunload", function() {
			if (!Site.isSave()) {
				var msg = "ВАШ САЙТ НЕ СОХРАНЕН!";
				return msg;
			}
		});
	}
	
	/**
	*
	*
	*
	*/
	this.setEventResize = function()
	{
		$(window).off("resize");
		$(window).on("resize", function() {
			ManagerElement.create();
		});
	}

/*********************************************************************************/

	this.setEventSeo = function()
	{
		var obj = this;
		var butSeo = $(".h-but-seo");
		butSeo.off("click");
		butSeo.on("click", function() {
			obj.showModalSeo();
		});
	}

	this.showModalSeo = function()
	{
		this.createModalSeo();
		this.setEventModalSeo();
	}

	this.createModalSeo = function()
	{
		var content = this.getContentModalSeo();
		
		Modal.create({
			"id":"modalSeo",
			"title":"Настройка SEO",
			"content":content,
			"top":50,
			"width":500,
			"button":[
				["cancel", "Отмена"],
				["ok", "Сохранить"],
			]
		});
	}

	this.getContentModalSeo = function()
	{
		var content = '';

		// title
		var title = Element.listCustomizerPage[this.getCustSeoIdTitle()];
		if (!title) title = '';
		content += '\
			<div class="modal-block-item">\
				<div class="modal-block-label">title</div>\
				<input type="text" class="h-seo-title" value="'+title+'" />\
			</div>';
		
		// desc
		var description = Element.listCustomizerPage[this.getCustSeoIdDesc()];
		if (!description) description = '';
		content += '\
			<div class="modal-block-item">\
				<div class="modal-block-label">description</div>\
				<input type="text" class="h-seo-description" value="'+description+'" />\
			</div>';

		var keywords = Element.listCustomizerPage[this.getCustSeoIdKeywords()];
		if (!keywords) keywords = '';
		content += '\
			<div class="modal-block-item">\
				<div class="modal-block-label">keywords</div>\
				<input type="text" class="h-seo-keywords" value="'+keywords+'" />\
			</div>';

		return content;
	}

	this.setEventModalSeo = function()
	{
		var obj = this;
		var butObj = $("#modalSeo .hollpee-but-ok");
		butObj.off("click");
		butObj.on("click", function() {

			Element.listCustomizerPage[obj.getCustSeoIdTitle()] = $(".h-seo-title").val().trim();
			Element.listCustomizerPage[obj.getCustSeoIdDesc()] = $(".h-seo-description").val().trim();
			Element.listCustomizerPage[obj.getCustSeoIdKeywords()] = $(".h-seo-keywords").val().trim();
			Site.setStatusSave("false");
			
			Modal.delete();
		});
	}

	this.getCustSeoIdMain = function()
	{	
		var pageId = Site.getPageId();
		return 'i-p'+pageId;
	}

	this.getCustSeoIdTitle = function()
	{
		var main = this.getCustSeoIdMain();
		return main + "-title";
	}

	this.getCustSeoIdDesc = function()
	{
		var main = this.getCustSeoIdMain();
		return main + "-description";
	}

	this.getCustSeoIdKeywords = function()
	{
		var main = this.getCustSeoIdMain();
		return main + "-keywords";
	}

/*********************************************************************************/


} // end class

