/**
* Выбор страницы
*
*
*/
ManagerPage.prototype = ManagerBasic;
var ManagerPage = new ManagerPage();
ManagerPage.parent = ManagerBasic;
function ManagerPage() {
	this.width = 510;
	this.type = "page";
	this.noDeleteLast = true;
	// название модального окна
	this.emptyBlockLabel = Resource.hlp_manager_page_empty_block;
/**********************************************************************************************/
	/**
	* Ставит параметры
	*
	* @see 	this.create()-parent
	*/
	this.setProperty = function()
	{
		this.title = Resource.hlp_manager_title_page;
		this.buttonName = Resource.hlp_manager_page_but_ok;

		this.listItem = Data.site.pages;
		this.currentId = Data.page["page_id"];
	}

	/**
	* Отдает текущий id страницы
	*/
	this.getSelectedId = function()
	{
		return Data.page["page_id"];
	} 
/***********************************************************************************************/
	/**
	* Выбор страницу
	*
	* @see 	parent
	* @see 	this.addNewElm() 
	*
	*/	
	this.chosenItem = function(elmEvent, pageId)
	{
		Grid.fixedType();

		if (elmEvent) this.parent.chosenItem(elmEvent);
		if (!pageId) pageId = elmEvent.attr("page");
		
		// фиксируем модальное
		if ($(".contentModal").css("display") == "block") ManagerModal.fix();
		// очищаем страницу 
		Site.formatPagesData();
		// фиксируем страницу
		Page.fix();
		// заменить новую страницу
		Page.replace(pageId);

		// чистим буффер
		ElementMan.clearBuffer();

		//ставим модульную сетку
		Grid.create();
	}


/*********************************************************************************************/
	/**
	* Удаляет страницу
	*
	*
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.deleteElm = function(deletedPageId, elmEvent)
	{
		var currentPageId = Data.page['page_id'];
			
		// убираем с массива
		delete Data.listPages[deletedPageId];
		delete Data.site.pages[deletedPageId];

		// если страница была добавлена, то убираем ее из добавленых
		if (Data.listAddPages[deletedPageId]) {
			delete Data.listAddPages[deletedPageId];
		// если небыла то заносим в массив удаленых
		} else {
			Data.listDeletePages[deletedPageId] = true;
		}

		// если была удалена текущая страница
		if (deletedPageId == currentPageId) {
			var currentElm = this.getElement(elmEvent);
			// страницу которую выделим после удаления текущей
			var selectPage = currentElm.next();
			if (!selectPage.length) {selectPage = currentElm.prev()}
			selectPage.click();
		}
	}

	this.actionAfterDelete = function()
	{

	}
/*******************************************************************************************/
	/**
	*  Добавляем новую страницу
	* 
	*/
	this.addNewPageInList = function(pageId)
	{
		// фиксируем страницу
		Site.fix();

		var newPage = {};
		var page = Data.listPages[pageId];
		var newName = ''; 

		// копируем
		// проходим параметры страницы
		for (var pageKey in page) {
			var pageValue = page[pageKey];
			// модифицируем параметры
			if (pageKey == "page_id") { 
				pageValue = this.getNewPageId();
				var newPageId = pageValue;
			} else if (pageKey == "data") { 
				Page.fix(); //фиксируем, что бы сохранилось в массиве
				pageValue = copyArray(pageValue);
			} else if (pageKey == "url_name") {
				pageValue = "page_"+newPageId;
				newName = pageValue;
			} else if(pageKey == "name") {
				pageValue = "page_"+newPageId;
			}
			// добавляем параметр
			newPage[pageKey] = pageValue;
		}

		// добавляем в массив
		Data.listPages[newPageId] = newPage;
		// заносим в массив добавления
		Data.listAddPages[newPageId] = true;
	}

/*******************************************************************************************/
	/**
	* Изменить имя
	*
	* @see 	this.focusoutEditPageName()
	*/
	this.editName = function(newName, editPageId)
	{
		if (newName.match(/hlp_/)) {
			newName = newName.replace(/hlp/gim, "usr"); 
		}

		// заносим в массив
		Data.listPages[editPageId]["name"] = newName;
		Data.listPages[editPageId]["url_name"] = newName;

		//изменяем в редакторе, если текущая страница
		if (editPageId == Data.page.page_id) $(".butSelectPageName").text(newName);
	}
/*********************************************************************************************/
	/**
	* Добавляет новый элемент
	*
	*/
	this.addNewElm = function()
	{
		// новая страница
		var newPage = {};
		var newPageId = this.getNewPageId();
		newPage.page_id = newPageId;
		
		newPage.name = "page_"+newPageId; 
		newPage.url_name = "page_"+newPageId; 
		
		newPage.html = this.getNewHtml();
		newPage.data = {};
		newPage.data.css = {};
		
		// добавляем в массив
		Data.listPages[newPageId] = newPage;
		// заносим в массив добавления
		Data.listAddPages[newPageId] = true;

		// политику конфиденциальности
		PrivacyPolicy.addPropertyPage(newPageId);
	}

	/**
	* Отдает новое имя
	*
	* @see this.addNewElm()
	*/
	this.getNewName = function()
	{
		var newName = "new_page"; 
		if (!this.isExistName(newName)) return newName;

		for (var i = 1; i < 100; i++) {
			var nameItem = newName+"-"+i;
			if (!this.isExistName(nameItem)) {
				newName = nameItem;
				break;
			}
		}

		return newName;
	}
	

	/**
	* Отдает html для новой страницы
	*
	* @see this.addNewElm() 	
	*/
	this.getNewHtml = function()
	{
		var listSection = '';
		var countSection = 4;
		for (var iSection = 1; iSection <= countSection; iSection++) {
			listSection += '<section class="element hlp-section section section-'+iSection+'" elm-type="section" class-unique="section-'+iSection+'"><div class="element-content hlp-section-content section-content"></div></section>';
		}

		return listSection;
	}

	/**
	* Отдает id  новой страницы
	*
	* @see 	this.addNewPageInList()
	*/
	this.getNewPageId = function() {
		var newId = parseInt(Data.site.data.max_page_id);
		if (!newId) newId = 0;
		newId++;
		Data.site.data.max_page_id = newId;

		return newId;
	} 
/************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	*/
	this.setSelectListItem = function()
	{
		var select = $(".valuePage, .valuePageFormRedirect");
		var currentValue = select.find(".option[chosen='true']").attr("value");

		// формируем список 
		var listPage = Data.site.pages;
		

		var listOption = '<div class="option" value="none">'+Resource.main_value_none+'</div>';

		for (pageId in listPage) {
			var pageName = listPage[pageId].name;
			if (Page.isTypeMain(pageName)) continue;

			listOption += '<div class="option" value="'+pageId+'">'+pageName+'</div>';
		}

		// добавляем его
		select.find(".optionBlock").html(listOption);
		Select.set(select, currentValue);
	}
/*************************************************************************************************/
	/**
	* Выбор(изменение) домашней страницы 
	*/
	this.setEventChooseHome = function()
	{
		var butHome = $(".selectPageIconHome");
		butHome.off("click");
		butHome.on("click", function() {
			var elmEvent = $(this);
			// id
			var oldId = $(".selectPageIconHome[chosen=true]").closest(".selectPageItem").attr("page");
			var newId = elmEvent.closest(".selectPageItem").attr("page");
			
			// ставим и убираем id
			var listPages = Data.listPages;
			if (oldId) listPages[oldId]["url_name"] = "";
			listPages[newId]["url_name"] = "index";

			// отмечаем
			butHome.removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// сохраняем
			Site.save(true);

			return false;
		});
	}


	/**
	* Ставим домашнию страницу при удалении
	*
	* @see 	ManagerBasic.setEventConfirmationDeletePage()
	*/
	this.setHomePageByDelete = function()
	{
		// если не удалена домашняя
		if ($(".selectPageIconHome[chosen='true']").length) return false;

		// ставим в массиве
		var firstPage = $(".selectPageItem:first");
		if (!firstPage.length) return false;

		var pageId = firstPage.attr("page");
		Data.listPages[pageId]["url_name"] = "index";
		

		// отмечаем кнопку
		firstPage.find(".selectPageIconHome").attr("chosen", "true");
	}

	/**
	*
	*
	*/
	this.actionAfterCreate = function()
	{

	}

/*******************************************************************************************/

} //end class











