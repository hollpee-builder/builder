/**
* Выбор страницы
*
*
*/
var ManagerBasic = new ManagerBasic();
function ManagerBasic() {
	this.emptyBlockLabel = '';
	this.noDeleteLast = false;

/******************************************************************************************/	
	/**
	* Выбор страницы
	*
	* @see SiteController.setEventSelectPage();
	*/
	this.create = function()
	{
		// ставим параметры
		this.setProperty();
		// список элементов
		var block = this.getListItems();
		block += this.getBlockEmpty();


		// создаем модальное окно
		Modal.create({
			"width":this.width,
			"top":50,
			"id":"modalManagerElement",
			"title":this.title,
			"content":block,
			"button":[
				["add", this.buttonName]
			]
		});

		Tip.setEvent();

		// ставим события
		this.setEventModal();
		// ставим значение пустому блоку 
		this.setDisplayEmptyBlock(); 
		// действия после создания
		this.actionAfterCreate();

		// убираем нажатие enter
		$(document).off("keydown");

		SpecialInput.setEventOnlyEng();
	}

	// действий после создания
	this.actionAfterCreate = function() {};

	/**
	* Блок для модального окна выбор страницы
	*
	* @see 	this.setEventSelectPage()
	*/
	this.getListItems = function()
	{
		var block = '<div id="selectPagelist" type="'+this.type+'">';

		for (var index in this.listItem) {
			var page = this.listItem[index];
			if (page) block += this.getOneItem(page);
		}

		block += '</div>';

		return block;
	}

	/**
	* Отдает один блок
	*
	*
	*/
	this.getOneItem = function(params)
	{
		var pageId = params["page_id"];
		if (!pageId) pageId = params["id"];
		var statusChosen = params["url_name"] == "index" ? "true" : "false";
		
		var selected = pageId == this.getSelectedId() ? "selected='selected'" : "";
		var isManipulationV = true;

		var pageNameV = params["name"];
		if (this.type == "page") {
			var inputBlock = '<input type="text" only-eng="true" class="selectPageName" value="'+pageNameV+'"/>';
		} else {
			var inputBlock = '<input type="text" class="selectPageName" value="'+params["name"]+'"/>';
		}

		if (Page.isTypeMain(pageNameV)) {
			var blockManipulaction = '';
			inputBlock = '<div class="selectPageNameNoChanged">'+pageNameV+'</div>';
		} else {
			var blockManipulaction = '\
				<div class="selectPageBlockManage">\
					<div class="selectPageManageItem butSelectPageDelete">'+Resource.main_modal_but_delete+'</div>\
					<div class="selectPageManageItem butSelectPageCopy">'+Resource.main_modal_but_copy+'</div>\
				</div>'; 
		}

		var block = '\
				<div class="selectPageItem" page="'+pageId+'" '+selected+'>\
					<div class="selectPageImg" is-image="true"></div>\
					'+inputBlock+'\
					'+blockManipulaction+'\
					<div class="clear"></div>\
				</div>\
			';

		return block;
	}

	/**
	* Отдает id страницы
	* 
	* @see this.changeEditPageName()
	*/
	this.getId = function(elm) 
	{
		return elm.closest(".selectPageItem").attr("page");
	}


	/**
	* Отдает выбраные id
	*
	* @see 	this.getOneItem()
	*/
	this.getSelectedId = function() {};

	/**
	* Отдает элемент - выбора страница
	* 
	* @see this.setEventDeletePage();
	*/
	this.getElement = function(elm)
	{
		return elm.closest(".selectPageItem");
	}

	/**
	* Отдает id выбраного элемента 
	*
	* @see 	ManagerModal.deleteElm()
	*/
	this.getCurId = function()
	{
		return this.getIdElm($(".selectPageItem[selected='selected']"));
	}

	/**
	* Отдает id выбраного элемента 
	*
	* @see 	ManagerModal.deleteElm()
	*/
	this.getFirstId = function()
	{
		return this.getIdElm($(".selectPageItem:first"));
	}

	/**
	* Отдает id элемента
	*
	* @see 	this.getCurId()
	* @see 	this.getFirstId()
	*/
	this.getIdElm = function(elmObj)
	{
		return elmObj.attr("page");
	}

/************************************************************************************************/
	/**
	* Отдает пустой блок
	*
	* @see 	this.create()
	*/
	this.getBlockEmpty = function()
	{
		var block = '<div class="emptyModalBlock">'+this.emptyBlockLabel+'</div>';

		return block;
	}

	/**
	* Ставит значение display пустому блоку
	*
	* @see 	this.create()
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.setDisplayEmptyBlock = function()
	{
		var display = $(".selectPageItem").length ? "none" : "block";
		$(".emptyModalBlock").css("display", display);
	}
/***********************************************************************************************/
	/**
	* События для модального окна - выбор страницы
	*
	* @see 	this.create()
	*/
	this.setEventModal = function()
	{
		// выбрать страницу
		this.setEventChoosePage();
		// изменить имя
		this.setEventEdinPageName();
		// удалить
		this.setEventDeletePage();
		// копировать
		this.setEventCopyPage();
		// создать новый
		this.setEventAddElm();

		// выбор домашней страницы
		// this.setEventChooseHome();
	}

	/**
	* Выбор домашней страницы 
	*
	* @see 	this.setEventModal()
	*/
	this.setEventChooseHome = function() {};

/***********************************************************************************************/
	/**
	* Выбор страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventChoosePage = function()
	{
		var obj = this;
		$(".selectPageItem").off("click");
		$(".selectPageItem").on("click", function() {
			if (!obj.clickName) {
				// Modal.createLoading("Заменяю элемент");

				// переходим
				obj.chosenItem($(this));

				// ставим scroll на вверх
				StyleCanvas.setScrollTopElm();

				// setTimeout(function() {
				// 	// сохраняем
				// 	Site.fix();
				// }, 1000);
				Modal.delete();

				// ставим значение, для модального
				Editor.setPropertyPageModal(obj.type);
			}
		});

		// что бы работал input
		var inputNameObj = $("input.selectPageName");
		inputNameObj.off("click");
		inputNameObj.on("click", function() {
			return false;
		})
	}

	/**
	* Выбор страницу
	*
	* @see 	this.setEventChoosePage()
	*/	
	this.chosenItem = function(elmEvent) {
		if (elmEvent.attr("selected") == "selected") return false;
		
		// отмечаем страницу
		$(".selectPageItem").removeAttr("selected");
		elmEvent.attr("selected", "selected");
	};
/***************************************************************************************/
	/**
	* Изменить имя страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventEdinPageName = function()
	{
		var obj = this;
		$(".selectPageName").off("focus");
		$(".selectPageName").on("focus", function() {
			var elmEvent = $(this);
			var oldName = elmEvent.val();

			// событие теряет фокус
			obj.changeEditPageName(elmEvent, oldName);
		});
	}

	/**
	* Потеря фокуса для поля имя страницы
	*
	* @see 	this.setEventEdinPageName()
	*/
	this.changeEditPageName = function(elmEvent, oldName)
	{
		var obj = this;
		// теряет фокус
		$(".selectPageName").off("change focusout");
		$(".selectPageName").on("change focusout", function() {
 			var newName = elmEvent.val().trim();
 			// если имя небыло изменено 
 			if (newName == oldName) { return false;}

			// если имя пустое
			if (!newName || Page.isTypeMain(newName)) { 
				elmEvent.val(oldName);
				return false;
			}

			if (obj.type == "page") {
				newName = newName.replace(/\s+/gim, '_');
				elmEvent.val(newName);
			}

			var isExistName = obj.isExistName(newName, elmEvent);
			if (isExistName) {
				elmEvent.val(oldName);

				var labelError = Resource.hlp_manager_page_name_exists;
				Notification.error(labelError);
				return false;
			}

			// изменяем имя в массиве
			var editPageId = obj.getId(elmEvent);
			obj.editName(newName, editPageId);
			// ставим список страниц в select
			obj.setSelectListItem();

			// if (obj.type == "page") {
			// 	Page.editAbtestName(editPageId, newName);
			// }
			Site.setSaveNo();
			
			// сохраняем страницу
			Site.fix();
		});
	}


	/**
	* Проверяет существование имени
	*
	* @see 	this.changeEditPageName()
	* @see 	ManagerPage.getNewName()
	*/
	this.isExistName = function(itemName, elmEvent)
	{
		return $(".selectPageName[value='"+itemName+"']").not(elmEvent).length;
	}
/***************************************************************************************/
	/**
	* Удаление страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventDeletePage = function()
	{
		var obj = this;
		$(".butSelectPageDelete").off("click");
		$(".butSelectPageDelete").on("click", function() {
			// последнию страницу удалить нельзя
			if ($(".selectPageItem").length == 1 && obj.noDeleteLast) {
				Notification.error(Resource.hlp_manager_page_no_last_delete);
				return false;
			}

			var elmEvent = $(this);
			// подтверждение удаления
			var nameDelElmV = elmEvent.closest(".selectPageItem").find(".selectPageName").val();
			var labelConfirmatinonV = "Подтвердите удаление <b>"+nameDelElmV+"</b>";
			Modal.confirmationDelete(labelConfirmatinonV, function() {
				obj.confirmationDeletePage(elmEvent);
			});

			return false;
		});
	}

	/**
	* Подверждение удаления 
	*
	* @see 	this.setEventDeletePage()
	*/
	this.confirmationDeletePage = function(elmEvent)
	{
		var deletedPageId = this.getId(elmEvent);
		var modalItemObj = $(".selectPageItem[page='"+deletedPageId+"']");

		// удаляем элемент
		this.deleteElm(deletedPageId, elmEvent);
		// убираем с модального окна
		modalItemObj.remove();
		// сохраняем страницу
		Site.fix();
		// ставим значение display
		this.setDisplayEmptyBlock();

		var obj = this;
		// ставим список страниц в select
		setTimeout(function() { 
			obj.setSelectListItem();
		}, 500);

		this.actionAfterDelete();
	}

	this.actionAfterDelete = function() {}
 	
 	// ставим кнопку home
	this.setHomePageByDelete = function() {};
/*********************************************************************************************/
	/**
	* Дублировать страницу
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventCopyPage = function()
	{
		var obj = this;
		$(".butSelectPageCopy").off("click");
		$(".butSelectPageCopy").on("click", function() {
			var elmEvent = $(this);
			var pageId = obj.getId(elmEvent);

			// добавляем новую страницу в список, отдвет id имя
			obj.addNewPageInList(pageId);
			// перезагружает список 
			obj.reloadListElm();
			// ставим список
			obj.setSelectListItem();

			return false;
		});
	}

	/**
	*  Добавляем скопированые элемент
	* 
	* @see 	this.setEventCopyPage()
	*/
	this.addNewPageInList = function(pageId) {};

	/**
	* Отдает id  новой страницы
	*
	* @see 	this.addNewPageInList()
	*/
	this.getNewPageId = function() {
		var newId = "_";
		for (var iNew = 0; iNew < 300; iNew++) {
			newId += "1";
			if (!Data.listPages[newId]) return newId;
		}
	} 
/********************************************************************************************/
	/**
	* Добывить новый элемент
	*
	* 
	* @see 	this.setEvent()
	*/
	this.setEventAddElm = function()
	{
		var obj = this;
		$("#modalManagerElement .butAdd").off("click");
		$("#modalManagerElement .butAdd").on("click", function() {
			Modal.createLoading(Resource.hlp_manager_page_load_start_create);
			// добавляем
			obj.addNewElm();
			// перегружаем окно
			// obj.reloadListElm();
			// ставим список страниц в select
			obj.setSelectListItem();

			if (obj.type == "modal") return false;

			setTimeout(function() {
				Modal.delete();
				Notification.ok(Resource.hlp_manager_page_load_finish_create);
			}, 1000);
		});
	}

	/**
	* Добавляет новый элемент
	*
	* @see 	this.setEventAddElm()
	*/
	this.addNewElm = function() {};
/******************************************************************************************/
	/**
	* Изменяем id  у списка страниц
	*
	* @see 	Site.save()
	*/
	this.editListPagesId = function(listId)
	{
		for (var oldId in listId) {
			var newId = listId[oldId];

			// добавляем новый
			Data.listPages[newId] = copyArray(Data.listPages[oldId]);
			Data.listPages[newId]["page_id"] = newId; //меняем id
			
			// удаляем старый
			delete Data.listPages[oldId];
			
			// ставим в html
			$(".selectPageItem[page='"+oldId+"']").attr("page", newId);
		}

		// ставим список страниц в select
		this.setSelectListItem();
	}
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	* @see 	EditorController.setEvent()
	* @see 	this.editListPagesId()
	* @see 	this.setEventConfirmationDeletePage()
	* @see 	this.changeEditPageName()
	* @see 	this.setEventCopyPage()
	*/
	this.setSelectListItem = function() {};

	/**
	* Перезагружает список элементов
	*
	* @see 	this.setEventCopyPage()
	*/
	this.reloadListElm = function()
	{
		// закрываем и открываем, что бы появилась новая страница в списке
		Modal.delete();

		if (this.type == "page") $(".butSelectPage").mousedown();
		else $(".butSelectModal").mousedown();
	}
/************************************************************************************************/



/*******************************************************************************************/
} //end class











