/**
* Функции для работы со страницей
*
*
*/
var Page = new Page();
function Page() {
	/**
	* Поставить имя страницу в редаторе
	*
	* @see 	this.replace()
	* @see 	SelectPage.focusoutEditPageName()
	*/	
	this.setNameInEditor = function(name)
	{
		$(".butSelectPageName").text(name);
	}	
/********************************************************************************************/
	/**
	* Поставит первую
	*
	* @see 	Input.init();
	*/
	this.insertFirst = function() 
	{
		if (Data.site.data.last_page_id) {
			var pageId = Data.site.data.last_page_id;
		} else {
			// id первой страницы
			for (var pageId in Data.listPages) { break;}
		}

		
		// устанавливаем страницу c вариантами
		this.replace(pageId, true);
		
		//если в секции нет элементов
		for (var firstPageId in Data.listPages) { break;}
		if (firstPageId == pageId) {
			var countElmV = $(".section:not(.hlp-privacy-policy)").find(".element").length;
			if (!countElmV) {
				$(".butAddTemplateSection").mousedown().mouseup();
			}
		}
	}

	/**
	* Заменяем страницу
	*
	* @see 	this.insertFirst()
	* @see 	SelectPage.setEventChoosePage()
	*/	
	this.replace = function(pageId, noHistoryReset)
	{
		$(".sectionCssPage .sectionCssItem").html('');

		// ставим вкладку
		$(".topPanelNavPage:not([chosen])").mousedown();
		
		// ставим данные для новой страницы
		this.setFullPage(pageId);
		// заменяем страницу
		this.insterToEditor();
		// если у элементов нету id
		Element.addNewId($(".site"));

		// добавляем базовые стили
		ElementBasicType.setSiteStyle();
		// формируем tag style
		ElementCss.createListTagStyle();
		// базовыйй стиль
		ElementBasicType.addListElm();

		// изменяем название текущей страницы
		var pageName = Data.listPages[pageId]["name"];
		this.setNameInEditor(pageName);
		// ставим события
		Input.newCanvas();
		// создаем горизонтальную линейку
		Scale.create();

		/* отмечаем первую секцию *********/
		$(".element").removeClass("elementSelected");
		if ($(".longreads-section").length) {
			var firstSectionObj = $(".longreads-section").next();
			var firstElmSectionObj = firstSectionObj.find(".element:first");
			if (!firstElmSectionObj.length) firstElmSectionObj = firstSectionObj;
			firstElmSectionObj.mousedown().mouseup();
		} else {
			$(".content .section:first").mousedown().mouseup();
		}
		/********************************/


		// обнуляем историю
		if (!noHistoryReset) History.reset();

		// очищаем поле модальное окно
		ManagerModal.clearCanvas();
		// ставим на вверх scroll
		$(".content").scrollTop(0);

		// сохраняем если нужно
		if (Site.isSave) Site.save(true);

		// ставим шрифты
		if (!StyleFont.isSetEditor) StyleFont.setFontInEditor();

		// ставим секциям id
		this.setSectionNewId();

		// сохраняем последнию страницу
		Data.site.data.last_page_id = Data.page.page_id;

		// для редактора некотрые параметры
		Editor.setPropertyPageModal("page");
		
		// ставим видео оболочку, почему то она удаляется
		setTimeout(function() {
			var listVideo = $(".site .video").filter(function() {
				return $(this).find("> .selfVideoBlackout").length ? false : true;
			});
			listVideo.prepend('<div class="selfVideoBlackout"></div>');
		}, 1000);

		// обнуляем анимацию
		StyleMenuAnimate.clearAll();
		
		// если есть дубли номера
		ElementSection.replaceDublNum();
		// создаем мобильное меню
		ElementNavPanelMobile.createIsNoExists();
		// ставим модальные
		ManagerModal.setSelectListItem();
		
		/************/
		// переводим старое меню в новое
		ElementNav.reloadOld();
		ElementSlider.convertOldVersion();
		/***********/
	}

	/**
	* Устанавливает полностью страницу
	*
	* @see this.replace()
	*/
	this.setFullPage = function(pageId)
	{
		// текущая страница
		Data.page = Data.listPages[pageId];
		
		// данные страницы
		Data.page.data = Data.page["data"];
		if (!Data.isArray(Data.page.data)) Data.page.data = {};
		if (!Data.isArray(Data.page.data.css)) Data.page.data.css = {};
		if (!Data.isArray(Data.page.modal)) Data.page.data.modal = {};
		if (!Data.isArray(Data.page.data.seo)) Data.page.data.seo = {};
		
		// подключаемые файлы
		if (!Data.isArray(Data.page.data.include_file)) {
			Data.page.data.include_file = {};
			Data.page.data.include_file.css = [];
			Data.page.data.include_file.java_script = [];
		}

		// подключаемый код
		if (!Data.isArray(Data.page.data.added_code)) {
			Data.page.data.added_code = {};
			Data.page.data.added_code.head = '';
			Data.page.data.added_code.body_start = '';
			Data.page.data.added_code.body_end = '';
		}

		// для экспорта
		if (!Data.isArray(Data.page.data.export)) {
			Data.page.data.export = {};
		}

	}	

	/**
	* Ставим секциям id
	*
	* @see 	this.replace()
	*/
	this.setSectionNewId = function()
	{
		$(".content .section").removeAttr("id");

		var listSection = $(".content .section:not([data-num])");
		var countSection = listSection.length;
		for (var iSection = 0; iSection < countSection; iSection++) {
			var sectionObj = listSection.eq(iSection);
			// var newSectionId = Element.getNewElmId("section");
			// sectionObj.attr("id", elmNum);

			var elmNum = Element.getMaxNumberClass(listSection, "data-num");
			sectionObj.attr("data-num", elmNum);
		}
	}

	/**
	* Отдает index текущей страницы
	*
	* @see 	EditorController.setEventButFullShow()
	* @see 	Site.isSaveAvatar()
	*/
	this.getCurrentPageIndex = function()
	{
		var currentPageId = Data.page.page_id;
		var listPage = Data.listPages;
		var pageIndexV = 0;
		for (var pageId in listPage) {
			if (pageId == currentPageId) break;
			pageIndexV++;
		}
		
		return pageIndexV;
	}
/****************************************************************************************/
	/**
	* Вставить страницу в редактор
	*
	* @see Input.init()
	*/
	this.insterToEditor = function()
	{
		var htmlV = Data.page.html;
		htmlV = htmlV.replace(/%26nbsp;/gim, ' ');
		$(".page").html(htmlV);	
	}
/****************************************************************************************/
	/**
	* Фиксирует страницу в массиве данных
	*
	* @see 	SiteController.setEventChoosePage()
	* @see 	Site.fix()
	*/
	this.fix = function() {
		// если остались
		ElementCss.setCssByAttrStyle();

		if (Data.site.pages[Data.page.page_id]) {
			// html
			var pageHtmlV = $(".contentItemPage").find(".page").html();
			pageHtmlV = Site.clearHtml(pageHtmlV);
			// фиксируем html
			Data.page["html"] = pageHtmlV;
			// фиксируем базовые стили
			ElementBasicType.fixedSiteStyle();

			Data.site.pages[Data.page.page_id] = Data.page;
		}
	}

/********************************************************************************************/

	/**
	* Отдает pageId
	*
	* @see 	Element.getNewId()
	*/
	this.getId = function()
	{
		return Data.page.page_id;
	}

	/**
	* Страница основа или нет
	*
	* @see 	ManagerBasic.changeEditPageName()
	* @see 	ManagerPage.setSelectListItem()
	* @see 	TemplateSection.replaceClassTemplate()
	*/
	this.isTypeMain = function(pageName)
	{
		if (Site.isTypeLp()) return false;
		if (!pageName) pageName = this.getName();

		if (pageName == "header" || pageName == "footer") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Отдает имя страницы
	*
	* @see 	this.isTypeMain()
	*/
	this.getName = function()
	{
		return Data.page.name;
	}

/***********************************************************************************************/
/********************************************************************************************/
	/**
	* @see Input.init()
	*/
	this.setMain = function()
	{
		// добавляем основу
		var block = '<div class="siteWrapper"><div class="page"></div></div>';
		$(".content").html(block);
		// добавляем элементы
		ElementHeader.createElement({});
	}


/********************************************************************************************/

}//end class



















