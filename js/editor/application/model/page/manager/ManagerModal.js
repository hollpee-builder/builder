/**
* Выбор модального окна
*
*
*/
ManagerModal.prototype = ManagerBasic;
var ManagerModal = new ManagerModal();
ManagerModal.parent = ManagerBasic;
function ManagerModal() {
	this.width = 470;
	this.type = "modal";
	// название модального окна
	this.title = Resource.hlp_manager_title_modal;
	// название кнопки добавить
	this.buttonName = Resource.hlp_manager_modal_but_ok;
	this.emptyBlockLabel = Resource.hlp_manager_modal_empty_block;
/**********************************************************************************************/
	/**
	* Действия после создания
	*
	* @see 	this.create()
	*/
	this.actionAfterCreate = function() 
	{
		// return false;
		// // если нету выбранного
		// var chosneItem = $(".selectPageItem[selected='selected']");
		// // console.log($(".modalWrap .modal").length)
		// if (!chosneItem.length || !$(".contentModal .modal").length) {
		// 	$(".selectPageItem:first").click();	
		// }
	}
/********************************************************************************************/
	/**
	* Ставит параметры
	*
	* @see 	this.create()-parent
	*/
	this.setProperty = function()
	{
		// список элементов
		this.listItem = this.getListItem();
		// текущий id
		this.currentId = this.getCurrentId();
	}

	/**
	* Устанавливает список элементов
	*
	* @see 	this.setProperty()
	*/
	this.getListItem = function()
	{
		var listItem = {};
		var listModal = this.getListModal();
		
		var countModal = listModal.length;
		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			listItem[i] = {};
			listItem[i]["name"] = modal.attr("name");
			listItem[i]["id"] = modal.attr("id");
		}

		return listItem;
	}

	/**
	* Отдает текущий id страницы
	*/
	this.getSelectedId = function()
	{
		return $(".contentModal .modal").attr("elm-id");
		// var modalId = $(".contentModal .modal").attr("elm-id");
		// var modalId = $(".butSelectModalName").attr("elm-id");
		// if (Element.obj.attr("data-action") == "modal") {
		// 	var dataNum = Element.obj.attr("data-value");
		// 	return $(".modal[data-num='"+dataNum+"']").attr("id");
		// } else {
		// 	return false;
		// }
		// return 
		// return modalId;
	} 
/**********************************************************************************************/
	/**
	* Выбор модального окна
	*
	* @see 	parent
	* @see 	this.addNewElm()
	* @see 	TemplateSection.insertTemplatePage() 
	*/
	this.chosenItem = function(elmEvent, modalId) {
		if (elmEvent) this.parent.chosenItem(elmEvent);
		// переключаемся на модальное
		Screen.toggleModal();
		
		// фиксируем
		this.fix();
		//выбор страницы
		if (!modalId && elmEvent) modalId = elmEvent.attr("page");
		this.setInCanvas(modalId);

		setTimeout(function() {
			$(".contentModal .modal:first").mousedown().mouseup();
		}, 100);

	};

	/**
	* Фиксируем модальное  окно
	*
	* @see 	this.chosenItem()
	* @see 	this.deleteElm()
	* @see 	this.addNewPageInList()
	* @see 	EditorController.setEventTab()
	* @see 	Site.fix()
	*/
	this.fix = function()
	{
		if (!Screen.isModal()) return false;

		var modal = $(".contentModal .modal");
		var modalId = modal.attr("elm-id");
		var block = modal.parent().html();
		var modalObj = this.getModal(modalId);
		var modalName = modalObj.attr("name");
		modalObj.parent().html(block);

		// убираем атрибут и ставим id 
		var objSiteContent = Element.getSiteContentObj();
		objSiteContent.find(".listModal .modal[elm-id='"+modalId+"']")
							.removeAttr("elm-id")
							.attr("id", modalId)
							.attr("name", modalName);
	}
/***********************************************************************************************/
	/**
	* Удаляет элемент
	*
	*
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.deleteElm = function(modalId)
	{ 
		var currentModalId = this.getCurId();

		// фиксируем текущий modal
		if (Screen.isModal()) this.fix();
		
		var elmModal = this.getModal(modalId);

		// удаляем modal
		ElementMan.delete(elmModal);

		// убираем с поля
		// $(".contentModal .modal[elm-id='"+modalId+"']").remove();

		// убираем у элементов
		$(".element[data-action='modal']").filter("[data-value='"+modalId+"']").attr("data-value", "none");
		// у формы 
		$("input[redirect-type='modal']").filter("[value='"+modalId+"']").attr("value", "none");
		
		// если удалена текущая
		if (modalId == currentModalId && Screen.isModal()) {
			$(".selectPageItem:first").click();
		}

	}

	this.actionAfterDelete = function()
	{
		if (Element.obj.hasClass("site")) {
			Element.obj.find(".section:first").mousedown().mouseup();
		}
	}

	/**
	* Добавляет новый элемент
	*
	* @see 	parent
	* @see 	this.setBlockNoModal()
	*/
	this.addNewElm = function()
	{
		// переключаем на desktop
		Screen.setDesktop();
		// создаем элемент
		ElementModal.create();
	}

	/**
	*  Добавляем новую страницу 
	*/
	this.addNewPageInList = function(orgModalId) {
		if (Screen.isModal()) this.fix();

		var modal = this.getModal(orgModalId);
		// параметры
		var modalContent = modal.html();
		var modalClass = modal.attr("class");
		var classUnique = modal.attr("class-unique");
		var modalName = modal.attr("name")+"_copy";
		var modalId = ElementModal.getNewModalId();
		var modalNum = modalId;//Element.getMaxNumberClass($(".modal"), "data-num");

		// добавляем
		var block = '<div class="new-element '+modalClass+'" data-num="'+modalNum+'" id="'+modalId+'" elm-type="modal" name="'+modalName+'" class-unique="'+classUnique+'">'+modalContent+'</div>';
		block = '<div class="modalWrap">'+block+'</div>';
		// block = block;
		$(".contentWrap .listModalPage").append(block);

		var newModal = $(".new-element").removeClass("new-element");
		Element.addNewId(newModal);

		this.fix();
	}

/*******************************************************************************************/
	/**
	* Изменить имя
	*
	* @see 	this.focusoutEditPageName()
	*/
	this.editName = function(newName, modalId)
	{
		var modal = this.getModal(modalId);
		var oldName = modal.attr("name");
		modal.attr("name", newName);

		// ставим на кнопки
		var but = $(".butSelectModalName");
		if (but.text() == oldName) but.text(newName);
	}
/************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	* @see 	this.setEventNoModal()
	* @see 	ElementModal.createAction()
	* @see 	this.addTemplateModal()
	*/
	this.setSelectListItem = function()
	{
		// формируем список 
		var listOption = '<div class="option" value="none">Нет</div>';
		var listModalPage = this.getModalPropertyPage(this.getListModalParent().html());
		listOption += this.listOptionFromProperty(listModalPage);
		// для многостраничника
		if (!Site.isTypeLp()) {
			if (Data.page.page_id != 1) {
				var modalHeader = this.getModalPropertyPage(Data.site.pages[1]["html"]);
				listOption += '<div class="optionLabel">Header</div>';
				listOption += this.listOptionFromProperty(modalHeader);
			}
			
			if (Data.page.page_id != 2) {
				var modalFooter = this.getModalPropertyPage(Data.site.pages[2]["html"]);
				listOption += '<div class="optionLabel">Footer</div>';
				listOption += this.listOptionFromProperty(modalFooter);
			}
		}

		// добавляем его
		var listSelect = $(".valueModal, .valueFormRedirectModal, .selectSettingTrigerModalScroll");
		listSelect.find(".optionBlock").html(listOption);
		//ставим текущие 
		var selectVal = listSelect.find(".option[chosen='true']").text();		
		//если был модальное было удалено
		if (!selectVal) {
			selectVal = "Нет";
			listSelect.find(".option[value='none']").attr("chosen", "true");
		} 
		// ставим значение
		listSelect.find("input[type='button']").val(selectVal);
	}

	this.getModalPropertyPage = function(pageHtml)
	{
		var bufferV = Site.getBuffer();
		bufferV.html(pageHtml);
		var listModalObj = bufferV.find(".modal");
		var listModalProperty = [];

		var countModal = listModalObj.length;
		for (var iModal = 0; iModal < countModal; iModal++) {
			var modalObj = listModalObj.eq(iModal);
			listModalProperty.push({
				"id":modalObj.attr("id"),
				"name" : modalObj.attr("name"),
				"data-num" : modalObj.attr("data-num")
			});
		}

		Site.clearBuffer();

		return listModalProperty;
	}

	this.listOptionFromProperty = function(listModal)
	{
		var listOption = "";
		var countModal = listModal.length;
		for (var i = 0; i < countModal; i++) {
			var modal = listModal[i];
			var modalId = modal["id"];
			var modalName = modal["name"];
			var modalNum = modal["data-num"];
			listOption += '<div class="option" value="'+modalNum+'">'+modalName+'</div>';
		}

		return listOption;
	}

	/**
	* Отдает список options
	*
	* @see 	Store.getModalContent()
	*/
	this.getListOptions = function()
	{
		var listModal = this.getListModal();
		var listOption = '<option value="none">Нет</option>';
		var countModal = listModal.length;

		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			var modalName = modal.attr("name");
			var modalNum = modal.attr("data-num");
			listOption += '<option value="'+modalNum+'">'+modalName+'</option>';
		}

		return listOption;
	}

/**********************************************************************************************/
	/**
	* Вставляет модальное окно в поле
	*
	* @see 	this.chosenItem()
	* @see 	this.setBlockNoModal()
	* @see 	EditorController.setEventTab()
	*/
	this.setInCanvas = function(modalId)
	{	
		if (!modalId) modalId = this.getCurrentId();
		
		//нету модального окна 
		if (!modalId) {
			this.setBlockNoModal();
			return false;
		}
		
		var parentModal = $(".contentModal");
		
		// формируем модальное окно
		var block = this.getModalBlock(modalId);
		
		// вставляем на страницу
		var modalWrapObj = parentModal.find(".modalWrap");
		modalWrapObj.html(block);
		modalWrapObj.height($("body").height()*0.87);
		// ставим id как атрибут
		var elmModal = parentModal.find(".modal");
		elmModal.removeAttr("id").attr("elm-id", modalId);

		// сбрасываем историю
		History.reset();
		
		// если он стоит 
		if (parentModal.css("display") == "block" && elmModal.length) {
			// ставим события
			Input.newCanvas();
			// отмечаем
			// elmModal.mousedown().mouseup();
		}

		// ставим имя
		this.setCurrentName(modalId);
	}

	/**
	* Отдает блок модального окна
	*
	* @see 	this.setInCanvas()
	*/
	this.getModalBlock = function(modalId)
	{
		var modal = this.getModal(modalId);
		// var modalContent = modal.html();
		// if (!modalContent) modalContent = '';
		// var modalClass = modal.attr("class");
		// var modalClassUnique = modal.attr("class-unique");
		// var block = '<div class="'+modalClass+'" id="'+modalId+'" elm-type="modal" class-unique="'+modalClassUnique+'">'+modalContent+'</div>';
		
		var block = modal.parent().html();

		return block;
	}

	/**
	* Устанавливает блок когда нет модального
	*
	* @see 	this.deleteElm()
	* @see 	this.setInCanvas()
	*/
	this.setBlockNoModal = function()
	{
		// добавляем модальное
		var blockNoModal = '<div class="butAddModal">'+Resource.hlp_manager_modal_but_ok+'</div>';
		$(".contentModal .modalWrap").html(blockNoModal);

		this.setEventNoModal();
	}

	/**
	* События на кнопку когда нет модыльных окон 
	*
	* @see 	this.setBlockNoModal();
	*/
	this.setEventNoModal = function()
	{
		// ставим события
		var obj = this;
		$(".butAddModal").off("mousedown");
		$(".butAddModal").on("mousedown", function() {
			// создаем модальное
			obj.addNewElm();
			// вставляем его на страницу
			var modalId = 'modal1';
			obj.setInCanvas(modalId);

			// ставим список
			obj.setSelectListItem();
		});
	}
/***********************************************************************************************/
	/**
	* Добавляет шаблон модального
	*
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.addTemplateModal = function(modalHtml)
	{
		modalHtml = '<div class="modalWrap">'+modalHtml+'</div>';
		var listModalParentObj = ManagerModal.getListModalParent();
		listModalParentObj.append(modalHtml);

		// новый id
		var listModal = ManagerModal.getListModal();
		var newModal = listModal.filter(":last");
		var newModalId = Element.getNewElmId("modal");
		newModal.attr("id", newModalId);

		// новый num 
		var modalNum = Element.getMaxNumberClass($(".modal"), "data-num");
		newModal.attr("data-num", modalNum);
		// console.log(modalNum)

		// имя
		newModal.attr("name", "modal " + modalNum);

		// убираем не нужное
		newModal.removeAttr("elm-id");

		// обновляем select 
		this.setSelectListItem();

		return newModal;
	}

	/**
	* Отдает родителя списка модальных
	*
	* @see 	this.addTemplateModal()
	* @see 	this.getListModal()
	*/
	this.getListModalParent = function()
	{
		var parentV = ElementModal.getListParent();

		return parentV;
	}

	/**
	* Отдает список модальных окон
	*
	* @see 	this.setSelectListItem()
	* @see 	this.getListItem()
	*/
	this.getListModal = function()
	{
		var listModalParentObj = this.getListModalParent();
		return listModalParentObj.find(".modal");
	}

	/**
	* Отдает текущий id
	*
	* @see 	this.setProperty()
	* @see 	this.setCurrentName()
	* @see 	this.setInCanvas()
	* @see 	this.setSelectListItem()
	*/
	this.getCurrentId = function()
	{
		var elm = Element.obj;
		if (!elm) return false;

		var actionType = elm.attr("action-type");
		var actionValue = elm.attr("action-value");
		if (actionValue == "none") actionValue = "";
		var modal = $(".contentModal .modal");
		var currentId = '';

		// id modal у элемента
		if (actionType == "modal" && actionValue) {
			currentId = actionValue;
		} else {	
			// если есть на полотне
			if (modal.length) {
				currentId = modal.attr("elm-id")
			// отдаем первый, если нету на полотне
			} else {
				var listModal = this.getListModal();
				currentId = listModal.filter(":first").attr("id");
			}
		}  

		return currentId;
	}

	/**
	* Отдает модальное окно
	*
	* 
	*/
	this.getModal = function(modalId)
	{
		var objSiteContent = Element.getSiteContentObj();
		return objSiteContent.find(".listModal #"+modalId);
	}
/************************************************************************************************/
	/**
	* Устанавливает название текущего модального
	*
	* @see 	this.setInCanvas()
	* @see 	ElementSettingClick.editModal()
	* @see 	ElementSettingClick.setModal()
	*/
	this.setCurrentName = function(modalId)
	{
		if (!modalId) modalId = this.getCurrentId();
		if (modalId) var modalName = this.getModal(modalId).attr("name");
		else var modalName = Resource.main_value_none;
		$(".butSelectModalName").html(modalName).attr("elm-id", modalId);
	}

/***********************************************************************************************/
	/**
	* Очищает полотно
	*
	*
	* @see 	Page.replace()
	*/
	this.clearCanvas = function() 
	{
		$(".contentModal .modalWrap").html("");
		ManagerModal.setCurrentName();// ставим имя
	}

/**************************************************************************************************/	
} //end class











