var TemplateSection = new TemplateSection();
function TemplateSection() {
	// режим разработчика
	// this.developerReplaceStatus = true;
	// не сохранять аватар
	// this.deleloperNoSaveAvatar = true;
	
	/**************************************/
	/**************************************/

	this.class = {};
	this.class.list_but_section = "sectionListButTemplate";
	this.class.but_section_add = "sectionButAddTemplate";

	this.value = {};

	this.attr = {};
	this.attr.std_folder_id = "data-std-folder-id";


	this.currentType = 'standart';
	this.currentNavItemIndex = 10;

	// последни добавленый щаблон
	this.folderIdLastAddTemlate = false;
	this.managerOperator = false;


	this.getClassButSectionAdd = function()
	{
		return this.class.but_section_add;
	}

	this.isCurTypeStandart = function(typeAccess)
	{
		if (!typeAccess) typeAccess = this.currentType;
		return !this.isAccessTypeUser(typeAccess);
	}

	this.getStdType = function()
	{
		return "standart";
	}

	this.setStdType = function()
	{
		this.currentType = this.getStdType();
	}

	this.getAttrStdFolderId = function()
	{
		return this.attr.std_folder_id;
	}

/************************************************************************************/

	/**
	* Установка события
	*
	* @see 	Resize.create()
	*/
	this.setEvent = function()
	{
		this.setEventShowManager();
		this.setEventCreateTemplate();
	}

	/**
	* Добавление шаблона
	*
	* 
	*/
	this.setEventShowManager = function()
	{	
		var obj = this;
		var butTemplate = $(".butAddTemplateSection");
		butTemplate.off("mousedown");
		butTemplate.on("mousedown", function() {
			obj.showManager();
		});
	}

	/**
	* Навигация по типам
	*
	* @see 	this.setEventShowManager()
	*/
	this.setEventNavType = function()
	{
		var obj = this;
		var butObj = $(".managerTemplateTypeNavItem");
		butObj.off("mousedown");	
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			var navType = elmEvent.attr("data-type");
				
			obj.currentType = navType;

			butObj.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");

			$(".templateNavList").css("display", "none")
								.filter("[data-type='"+navType+"']")
								.css("display", "block");

			var firstNavItemV = obj.getFirstNavItem();
			firstNavItemV.mousedown();
			
			$(".managerTemplateListItem").attr("data-type", navType);				
			
			return false;
		});
	}

/********************************************************************************/

	/**
	* Показываем 
	*
	* @see 	this.setEventManager()
	* @see 	this.setEventButSectionAddNew()
	*/
	this.showManager = function()
	{	
		var titleV = Resource.hlp_template_modal_title_add;

		var content = this.getModalContentManager();
		Modal.create({
			"id":"modalTemplate",
			"title":titleV,
			"width":1100,
			"top":10,
			"content":content
		});

		this.setNav('my');
		this.setNav('standart');
			
		/***********/
		$(".managerTemplateTypeNavItem")
				.removeAttr("data-chosen")
				.filter("[data-type='"+this.currentType+"']")
				.attr("data-chosen", "true");

		var currItemIndex = this.currentNavItemIndex;
		if (!currItemIndex) {
			for (var currItemIndex in Data.user.folder_template) {
				if (this.currentType == Data.user.folder_template[currItemIndex]["type_access"]) {
					break;
				}
			}
		}

		$(".templateNavList")
				.css("display", "none")
				.filter("[data-type='"+this.currentType+"']")
				.css("display", "block")
				.find(".managerTemplateNavItem[data-id='"+currItemIndex+"']")
				.mousedown().mouseup();

		// установка событий 
		this.setEventNavType();
	}

	/**
	* Отдает содержимое
	*
	* @see 	this.showManager()
	*/
	this.getModalContentManager = function()
	{
		var content = '\
			<div class="managerTemplateNav">\
				<div class="managerTemplateTypeNav">\
					<div class="managerTemplateTypeNavItem" data-type="standart" data-chosen="true">\
						'+Resource.hlp_template_modal_nav_standart+'\
					</div>\
					<div class="managerTemplateTypeNavItem" data-type="my" data-chosen="true">\
						'+Resource.hlp_template_modal_nav_my+'\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="templateNavList" data-type="standart">\
					<div class="listManagerTemplateFolder"></div>\
					<div class="clear"></div>\
				</div>\
				<div class="templateNavList" data-type="my">\
					<div class="listManagerTemplateFolder"></div>\
					<div class="clear"></div>\
					<div class="butAddFolderTemplate">'+Resource.hlp_template_modal_add_folder+'</div>\
				</div>\
			</div>\
			<div class="managerTemplateListItem" data-type="'+this.currentType+'"></div>\
			<div class="clear"></div>';

		return content;
	}

	/**
	* Устанавливает навигацию
	* 
	* @see 	this.showManager()
	* @see 	this.setEventButAddFolder()
	* @see 	this.setEventDeleteFolder()
	* @see 	this.setEventButTemplateMove()
	*/
	this.setNav = function(typeAccess)
	{
		if (!typeAccess) {
			typeAccess = this.getCurrentTypeAccess();
		}

		var folderId = this.getFolderObj().attr("data-id"); 

		var navBlock = '';
		if (this.isAccessTypeUser(typeAccess)) {
			var listFolder = Data.user.folder_template;
		} else {
			var listFolder = this.listFolderStandart;
		}
		
		for (var iFolder in listFolder) {
			var folderItem = listFolder[iFolder];

			navBlock += '\
				<div class="managerTemplateNavItem" data-id="'+folderItem['id']+'">\
					<span class="folderNameTemplate">'+folderItem['name']+'</span>\
					<div class="managerNavItemListBut">\
						<img src="/img/editor/edit.png" alt="" label="'+Resource.hlp_template_label_folder_edit+'" class="butFolderTemplate butFolderTemplateEdit" />\
						<img src="/img/editor/delete-2.png" alt="" label="'+Resource.hlp_template_label_folder_delete+'" class="butFolderTemplate butFolderTemplateDelete" />\
						<div class="clear"></div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			';
		}
		
		// если нет, папки то создаем
		if (!navBlock.trim()) {
			this.addNewFolder("First "+typeAccess, typeAccess, true);
			this.setNav(typeAccess);
			return false;
		}

		var parentContentObj = $(".templateNavList[data-type='"+typeAccess+"']");
		parentContentObj.find(".listManagerTemplateFolder").html(navBlock);
		this.getFolderObj(folderId).attr("data-chosen", "true");

		// ставим событие
		this.setEventFolder();
	}

	this.isAccessTypeUser = function(typeAccess)
	{
		if (!typeAccess) typeAccess = this.getCurrentTypeAccess();
		return typeAccess == "my";
	}

/*********************************************************************************/
/*********************************************************************************/
	
	/**
	* Отдает объект папки
	*
	* @see 	this.setNav()
	* @see 	this.setStatusButDeleteFolder()
	*/
	this.getFolderObj = function(folderId)
	{
		var listFolder = $(".managerTemplateNavItem");

		if (folderId) return listFolder.filter("[data-id='"+folderId+"']");
		else return listFolder.filter("[data-chosen='true']");
	}

	/**
	*  Устанавливает статус кнопки - удалить папку
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setStatusButDeleteFolder = function()
	{
		var typeAccess = this.getCurrentTypeAccess();

		var managerNavItemObjV = $(".managerNavItemListBut");
		if (this.isAccessTypeUser(typeAccess)) {
			managerNavItemObjV.removeAttr("style");
		} else {
			managerNavItemObjV.css("display", "none");
			return false;
		}

		var countNavItemFolder = $(".templateNavList[data-type='"+typeAccess+"'] .managerTemplateNavItem").length;
		
		var isNoTemplate = $(".managerTemplateListItem").text();
		var folderObj = this.getFolderObj();
		var butDeleteFolderObj = folderObj.find(".butFolderTemplateDelete");
		if (isNoTemplate || countNavItemFolder == 1) {
			var labelNoDelete = Resource.hlp_template_label_folder_no_delete;
			butDeleteFolderObj.attr("data-no-active", "true")
								.attr("label", labelNoDelete);
			Tip.setEvent();
		} else {
			butDeleteFolderObj.removeAttr("data-no-active")
							.attr("label", Resource.hlp_template_label_folder_delete);
		} 
	}


/********************************************************************************/

	/**
	* Ставит события для менеджера
	*
	* @see 	this.showManager()
	*/
	this.setEventFolder = function()
	{
		// навигация
		this.setEventManagerNav();
		// добавление папки
		this.setEventAddFolder();
		// удаление папки
		this.setEventDeleteFolder();
		// изменение папки
		this.setEventEditNameFolder();
	}

	/**
	* Установить событие - навигация
	*
	* @see 	this.setEventManager()
	*/
	this.setEventManagerNav = function()
	{
		var obj = this;
		var butNav = $(".managerTemplateNavItem");
		butNav.off("mousedown");
		butNav.on("mousedown", function() {
			var elmEvent = $(this);
			butNav.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");
			
			obj.setFolderTemplate(elmEvent);
			$(".managerTemplateListItem").scrollTop(0);

			return false;
		});
	}

	/**
	* Показывает модальное имя папки
	*
	* @see 	this.setEventAddFolder()
	* @see 	this.setEventEditNameFolder()
	*/
	this.showModalName = function(modalTitle, butName, nameFolder)
	{
		if (!nameFolder) nameFolder = '';

		var content = '\
				<div class="modalLabel">'+Resource.hlp_template_label_folder_name+'</div>\
				<input type="text" value="'+nameFolder+'" class="valueManagerTemplateName" />\
			';

			Modal.create({
				"id" : "modalManagerTemplateName",
				"title" : modalTitle,
				"width" : 450,
				"top" : 80,
				"content" : content,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", butName]
				]
			});
	}

/***********************************************************************************/
	
	/**
	* Добавление папки
	*
	* @see 	this.setEvent()
	*/
	this.setEventAddFolder = function()
	{
		var obj = this;
		var butObj = $(".butAddFolderTemplate");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var modalTitle = Resource.hlp_template_title_folder_add;
			obj.showModalName(modalTitle, Resource.main_modal_but_add);

			obj.setEventButAddFolder();
		});
	}

	/**
	* Кнопка добавить папку
	*
	* @see 	this.setEventAddFolder()
	*/
	this.setEventButAddFolder = function()
	{
		var obj = this;
		var butObj = $("#modalManagerTemplateName .butAdd");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var inputTempFolderObj = $(".valueManagerTemplateName");
			var newName = inputTempFolderObj.val().trim();

			// newName = newName.replace(/[^\w\s]+/gim, '');
			if (!newName) {
				inputTempFolderObj.val('');
				Notification.error("Поле должно быть заполнено");
				return false;
			}

			obj.addNewFolder(newName);
		});
	}

	/**
	* Добавляет папку
 	*
	* @see 	this.setEventButAddFolder()
	* @see 	this.setNav()
	*/
	this.addNewFolder = function(newName, typeAccess, onlyAdd)
	{
		var obj = this;

		var listFolder = Data.user.folder_template;

		var newId = 0;
		for (var folderItemIndex in listFolder) {
			var folderItemId = parseInt(listFolder[folderItemIndex]["id"]);
			if (folderItemId > newId) newId = folderItemId;
		}
		newId++;
		
		if (!typeAccess) typeAccess = obj.getCurrentTypeAccess();
		
		var newFolder = {"id" : newId, "name" : newName, "type_access":typeAccess};
		Data.user.folder_template[newId] = newFolder;

		if (!onlyAdd) {
			obj.setNav();
			Modal.removeLast();
		}

		User.save();
	}

	/**
	* Удалить папку
	*
	* @see 	this.setEventManager()
	*/
	this.setEventDeleteFolder = function()
	{
		var obj = this;
		var butObj = $(".butFolderTemplateDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("data-no-active") == "true") return false;

			var folderObj = elmEvent.closest(".managerTemplateNavItem");
			var besideObj = folderObj.next();
			if (!besideObj.length) besideObj = folderObj.prev();
			var folderIndex = folderObj.attr("data-id");

			Modal.confirmationDelete(Resource.main_confirmation_delete_label, function() {
				delete Data.user.folder_template[folderIndex];
				
				// выбираем ближайшую вкладку
				besideObj.mousedown();

				obj.setNav();
				User.save();
			});
		});
	}

	/**
	* Изменить имя папку
	*
	* @see 	this.setEventManager()
	*/
	this.setEventEditNameFolder = function()
	{
		var obj = this;
		var butObj = $(".butFolderTemplateEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var folderObj = $(this).closest(".managerTemplateNavItem");
			var folderIndex = folderObj.attr("data-id");
			var folderNameObj = folderObj.find(".folderNameTemplate");

			var modalTitle = Resource.hlp_template_title_folder_edit;
			var folderName = folderNameObj.text();
			obj.showModalName(modalTitle, Resource.main_modal_but_save, folderName);

			var butObj = $("#modalManagerTemplateName .butAdd");
			butObj.off("mousedown");
			butObj.on("mousedown", function() {
				var inputTempFolderObj = $(".valueManagerTemplateName");
				var newFolderName = inputTempFolderObj.val();
				
				// newFolderName = newFolderName.replace(/[^\w\s]+/gim, '');
				if (!newFolderName) {
					inputTempFolderObj.val('');
					Notification.error("Поле должно быть заполнено");
					return false;
				}

				Data.user.folder_template[folderIndex]["name"] = newFolderName;
				folderNameObj.text(newFolderName);
				Modal.removeLast();

				User.save();
			});


		});
	}

/************************************************************************************/
/**********************************************************************************/
	
	/**
	* Ставит папку шаблона
	*
	* @see 	this.showManager()
	* @see 	this.confirmationDeleteTemplate()
	*/
	this.setFolderTemplate = function(elmEvent)
	{
		var folderId = elmEvent.attr("data-id");
		var folderIndex = elmEvent.attr("data-id");
		this.currentNavItemIndex = folderIndex;
			
		var typeAccess = this.getCurrentTypeAccess();
		

		if (this.isAccessTypeUser(typeAccess)) {
			var listTemplate = Data.user.list_template;
			var profileId = $("#userId").text();
		} else {
			var listTemplate = this.listTemplateStandart;
			var profileId = '';
		}

		var imgRootPath = '/user/'+profileId+'/0_template/0_avatar';
		
		var listTemplateHtml = '';
		for (var iTemplate in listTemplate) {
			var templateItem = listTemplate[iTemplate];
			if (!templateItem) continue;

			if (templateItem.folder_id != folderId) continue;

			var templateId = templateItem["id"];
			var templateIsModal = templateItem["is_modal"];
			var attrModal = templateIsModal ? 'data-modal="true"' : '';
			var modalType = templateIsModal ? '<span class="teplateItemType">'+Resource.hlp_template_label_part_modal+'</span>' : '';

			var tempNameV = templateItem["name"];

			listTemplateHtml += '\
				<div class="teplateItemBlock" '+attrModal+' data-name="'+templateItem["name"]+'" data-id="'+templateId+'">\
					<img src="'+imgRootPath+'/avatar_'+templateId+'.png" alt="" class="templateItemImg" />\
					<div class="templateItemBlackout">\
						<div class="listButManagerTemplate">\
							<div class="butManagerTemplate butAddtemplate" label="'+Resource.hlp_template_label_but_add+'">\
								<img src="/img/editor/plus-2.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateDelete" label="'+Resource.hlp_template_label_but_delete+'">\
								<img src="/img/editor/delete.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateEdit" label="'+Resource.hlp_template_label_but_edit+'">\
								<img src="/img/editor/edit.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateMove"  label="'+Resource.hlp_template_label_but_move+'">\
								<img src="/img/editor/move.png" alt="" class="" />\
							</div>\
							<div class="clear"></div>\
						</div>\
					</div>\
					<div class="teplateItemName">'+modalType+tempNameV+'</div>\
				</div>'; 
		}

		listTemplateHtml += '<div class="clear"></div>';
		
		$(".managerTemplateListItem").html(listTemplateHtml);

		// ставим события
		this.setEventTemplate();
		// ставим статус кнопки удалить папку
		this.setStatusButDeleteFolder();
	}

	/**
	* Отдает текущий тип доступа
	*
	* @see 	this.setFolderTemplate()
	* @see 	this.chosenFirstFolder()
	* @see 	this.setEventButAddFolder()
	* @see 	this.setEventAddTemplate()
	* @see 	this.saveNewTemplate()
	*/
	this.getCurrentTypeAccess = function()
	{
		return $(".managerTemplateTypeNavItem[data-chosen='true']").attr("data-type");
	}

	/**
	*
	*
	*
	*/
	this.getFirstNavItem = function()
	{
		var typeAccess = this.getCurrentTypeAccess();
		return $(".templateNavList[data-type='"+typeAccess+"'] .managerTemplateNavItem:first");
	}

/**********************************************************************************/

	/**
	* События для шаблонов
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setEventTemplate = function()
	{
		// добавление шаблона на страницу
		this.setEventAddTemplate();
		// изменение имени
		this.setEventTemplateEditName();
		// удаление
		this.setEventTemplateDelete();
		// перемещение
		this.setEventTemplateMove();
	}

	/**
	* Изменение имени
	*
	*
	* @see 	this.setEventTemplate()
	*/
	this.setEventTemplateEditName = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var templateObj = $(this).closest(".teplateItemBlock");
			var templateNameObj = templateObj.find(".teplateItemName");
			var templateIndex = templateObj.attr("data-id");

			var modalTitle = Resource.hlp_template_title_edit;
			var templateName = templateNameObj.text();
			obj.showModalName(modalTitle, "Сохранить", templateName);

			var butObj = $("#modalManagerTemplateName .butAdd");
			butObj.off("mousedown");
			butObj.on("mousedown", function() {
				var inputTempFolderObj = $(".valueManagerTemplateName");
				var newName = inputTempFolderObj.val();
			
				// newName = newName.replace(/[^\w\s]+/gim, '');
				if (!newName) {
					inputTempFolderObj.val('');
					Notification.error("Поле должно быть заполнено");
					return false;
				}

				Data.user.list_template[templateIndex]["name"] = newName;
				templateNameObj.text(newName);

				Modal.removeLast();
				User.save();
			});
		});
	}

	/**
	* Удаление шаблона
	*
	* @see 	this.setEventTemplate()	
	*/
	this.setEventTemplateDelete = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var labelDelete = Resource.main_confirmation_delete_label;

			var templateObj = $(this).closest(".teplateItemBlock");
			Modal.confirmationDelete(labelDelete, function() {
				obj.confirmationDeleteTemplate(templateObj);
			});
		});
	}

	/**
	* Удаление шаблона
	*
	* @see 
	*/ 
	this.confirmationDeleteTemplate = function(templateObj)
	{
		var obj = this;
		var templateIndex = templateObj.attr("data-id");
		var templateId = templateObj.attr("data-id");

		Modal.removeLast();
		Modal.createLoading(Resource.hlp_template_load_start_delete);
		
		// запрос на сервер
		ajaxPost('/editor/deleteTemplate', "template_id="+templateId, function(req) {
			var deleteStatus = req.responseText.trim();

			if (deleteStatus) {
				templateObj.remove();

				// Data.user.list_template.splice(templateIndex, 1);
				delete Data.user.list_template[templateId];
				User.save();

				// переустанавливаем
				var navItemObj = $(".managerTemplateNavItem[data-chosen='true']");
				obj.setFolderTemplate(navItemObj);

				Notification.ok(Resource.hlp_template_notification_end_delete);
				setTimeout(function() { Tip.hide();}, 1000);	
			} else {
				// выводим ошибку
				Notification.error();
			}
		});
	}

/***********************************************************************************/

	/**
	* Перемещение шаблона
	*
	* @see 	this.setEventTemplate()	
	*/
	this.setEventTemplateMove = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateMove");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var templateObj = $(this).closest(".teplateItemBlock");
			var templateIndex = templateObj.attr("data-id");
			var oldFolderId = Data.user.list_template[templateIndex]["folder_id"];

			var selectFolder = obj.getSelectFolder(oldFolderId);
			var content = '\
				<div class="modalLabel">'+Resource.hlp_template_modal_move_label+'</div>\
				'+selectFolder;

			Modal.create({
				"id" : "modalManagerMoveTemplate",
				"title" : Resource.hlp_template_title_move,
				"content" : content,
				"width" : 450,
				"top" : 100,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", Resource.main_modal_but_move]
				]
			});

			// отмечаем папку
			if (obj.currentNavItemIndex) {
				$(".selectFolder").val(obj.currentNavItemIndex);
			}

			obj.setEventButTemplateMove(templateObj, templateIndex, oldFolderId);
		});
	}

	/**
	* Событие на кнопку - перемещение шаблона
	*
	* @see 	this.setEventTemplateMove()
	*/
	this.setEventButTemplateMove = function(templateObj, templateIndex, oldFolderId)
	{
		var obj = this;
		var butAdd = $("#modalManagerMoveTemplate .butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var newFolderId = $("#modalManagerMoveTemplate select").val();
			
			Modal.removeLast();
			if (newFolderId == oldFolderId) return false;

			Data.user.list_template[templateIndex]["folder_id"]	= newFolderId;		

			templateObj.remove();
			obj.setNav();
			User.save();
		});
	}


	/**
	* Отдает select папок
	*
	* @see 	this.setEventTemplateMove()
	* @see 	this.enterInfoNewTemplate()
	*/
	this.getSelectFolder = function(folderSelected)
	{
		var selectFolder = '<select class="selectFolder">';
		var listFolder = Data.user.folder_template;

		var firstFolderId = false;
		for (var iFolder in listFolder) {
			var folder = listFolder[iFolder];

			var folderId = folder['id'];
			if (!firstFolderId) {
				firstFolderId = folderId;
				folderSelected = folderId;
			}
			var selected = folderSelected == folderId ? 'selected="selected"' : '';

			selectFolder += '<option '+selected+' value="'+folderId+'">'+folder["name"]+'</option>';
		}

		selectFolder += "</select>";

		return selectFolder;
	}

/*************************************************************************************/
/**************************************************************************************/
/**********************************************************************************/

	/**
	* Добавление шаблона
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setEventAddTemplate = function()
	{
		var obj = this;
		var butAdd = $(".butAddtemplate");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var elmEvent = $(this);
			obj.addTemplateAction(elmEvent);
		});
	}

	/**
	* Добавление шаблона
	*
	*
	*/
	this.addTemplateAction = function(elmEvent)
	{
		var templateObj = elmEvent.closest(".teplateItemBlock");
			
		var modalStatus = templateObj.attr("data-modal");
		if (!modalStatus && Screen.isModal()) {
			Screen.togglePage();
		}

		var templateId = templateObj.attr("data-id");
		var templateProperty = this.getTemplateProperty(templateId);
		if (templateProperty) {
			var templateName = templateProperty["name"];
			var templateFolder = templateProperty["folder"];
		} else {
			var templateName = false;
			var templateFolder = false;
		}
		var typeAccess = this.getCurrentTypeAccess();

		Modal.createLoading(Resource.hlp_template_load_start_add);

		var query_string = "site_id="+Data.site.site_id
						+"&template_id="+templateId
						+"&type_access="+typeAccess
						+"&template_name="+templateName
						+"&folder="+templateFolder;

		var obj = this;
		// запрос на сервер
		ajaxPost('/editor/addTemplate', query_string, function(req) {
			var res = req.responseText.trim();
			
			if (res) {
				res = JSON.parse(res);
				var templateFolder = res["folder_name"];

				// добавляем
				var template = JSON.parse(res["template"]);
				obj.addTemplate(templateId, template, templateFolder, templateName);
				//сбрасываем файлы
				EditElementImage.resetCategoryFiles();

				History.record();	
				setTimeout(function() { 
					Tip.hide();
					Notification.ok(Resource.hlp_template_notification_end_add);
				}, 1000);	
			} else {
				// выводим ошибку
				Notification.error();
				Modal.delete();
			}
		})
	}

	this.getTemplateProperty = function(templateId)
	{
		var listTemplates = this.getListTemplates();
		return listTemplates[templateId];
	}

	this.getListTemplates = function()
	{
		return Data.user.list_template;
	}

	/**
	* Добавляет шаблон
	*
	* @see 	this.setEventAddTemplate()
	*/
	this.addTemplate = function(templateId, template, templateFolder, templateName)
	{
		// замена пути картинок
		template = this.replaceImgTemplate(template, templateFolder, templateId);
		template = JSON.parse(template);
		// заменяем одинаковые классы
		template = this.replaceClassTemplate(template);
		// вставляем на страницу
		var secObjV = this.insertTemplatePage(template, templateFolder);

		/*для разработчика***************/
		if (this.developerReplaceStatus) {
			secObjV.attr("hlp-template-id", templateId);
			secObjV.attr("hlp-template-name", templateName);
		}

		// ставим тип секции
		if (this.isCurTypeStandart()) {
			var attrFolderIdV = this.getAttrStdFolderId()
			secObjV.attr(attrFolderIdV, this.getCurFolderId());
		}

		/***************/
		// номер
		ElementSection.addNum(secObjV);
		/****************/
	}

	/**
	* Заменяет путь картинок при добавление шаблона
	*
	* @see 	this.addTemplate()
	*/
	this.replaceImgTemplate = function(template, templateFolder, templateId)
	{
		var userId = $("#userId").text();
		var siteId = Data.site.site_id;
		template = JSON.stringify(template);

		var patterImg = new RegExp("\/user\/[0-9]+\/[a-z0-9_]+\/img(\/[a-z0-9\._\-]+)*\/", "gim");

		if (this.isAccessTypeUser(this.currentType)) {
			var imgPathNew = "/user/"+userId+"/"+siteId+"/img/"+templateFolder+"/";
			template = template.replace(patterImg, imgPathNew);
		} else {
			var imgPathNew = "/user/0_template/"+templateId+"/";
			template = template.replace(patterImg, imgPathNew);
		}

		return template;
	}

	/**
	* Замена классов у шаблона
	*
	* @see 	this.addTemplate()
	*/
	this.replaceClassTemplate = function(template)
	{
		if (Element.obj.hasClass("site")) {
			Element.obj.find(".section:first").mousedown().mouseup();
		}

		var buffer = $(".contentBoofer");
		var content = $(".contentItem")
		buffer.html(template["html"]);
		var listElm = buffer.find(".element");
		var css = JSON.stringify(template["css"]);

		var elm = Element.obj;

		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var classUnique = elmItem.attr("class-unique");
			var classAdded = elmItem.attr("class-added");
			// не изменять базовый класс
			if (Element.isNoEditClass(elmItem)) classUnique = false;
			// 
			var listClass = {"class-unique":classUnique, "class-added":classAdded}

			for (var classType in listClass) {
				var classItem = listClass[classType];
				if (!classItem) continue;

				var elmItemV = content.find("."+classItem);
				if (Page.isTypeMain() || elmItemV.length) {

					var listElmSite = $("."+classItem);
					// получаем новый класс
					var newClass = this.getNewClass(classItem);

					//заменяем 
					var patClass = new RegExp('"'+classItem+'"', "gim");
					css = css.replace(patClass, '"'+newClass+'"');
					var patClass = new RegExp('"'+classItem+' ', "gim");
					css = css.replace(patClass, '"'+newClass+' ');
					var patClass = new RegExp(' '+classItem+'"', "gim");
					css = css.replace(patClass, ' '+newClass+'"');

					buffer.find("."+classItem)
							.removeClass(classItem)
							.addClass(newClass)
							.attr(classType, newClass);
				}
			}
		}
		
		buffer.find("> .section").addClass("new-element"); 

		template["css"] = JSON.parse(css);
		template["html"] = buffer.html();
		buffer.html('');

		return template;
	}

	/**
	* Отдает новый класс
	*
	* @see 	this.replaceClassTemplate()
	*/
	this.getNewClass = function(classElm)
	{	
		// добавляем классу префикс, для многостраничника
		classElm = Element.addClassPrefix(classElm);
		
		// если такого класса нет на странице
		var countElmInSite = $(".site ."+classElm).length;
		if (!countElmInSite) return classElm;

		// очищаем от оконцовке
		var classMain = classElm.replace(/-?[0-9]+$/, ''); 
		var parentObjV = $("body");

		for (var maxNum = 0; maxNum < 500; maxNum++) {
			if (maxNum == 0) {
				var elmSelectorV = classMain;
			} else {
				var elmSelectorV = classMain + "-" + maxNum;
			}
			
			if (! parentObjV.find("."+elmSelectorV).length) break;
		}


		return elmSelectorV;
	}

	/**
	* Вставка шаблона на страницу
	*
	* @see 	this.addTemplate()
	*/
	this.insertTemplatePage = function(template, templateFolder)
	{
		var newElm = false;

		if (template.is_modal) {
			newElm = ManagerModal.addTemplateModal(template["html"]);
		} else {
			var elmSectionObj = Element.obj.closest(".section");
			if (!elmSectionObj.length) elmSectionObj = $(".site .section:first");
			
			elmSectionObj.after(template["html"]);
		}

		// новый элемент
		if (!newElm) newElm = $(".new-element");

		// обновляем
		var css = template["css"];
		for (var cssClass in css) {
			Data.page.data.css[cssClass] = css[cssClass];
		}
		// стили
		ElementCss.createListTagStyle();

		//события 
		Input.newCanvas();

		// удаляем атрибуты
		newElm.removeClass("new-element").removeClass("elementSelected").removeAttr("status");

		// добавляем новые data-id
		newElm.removeAttr("data-id").find("*").removeAttr("data-id");
		Element.addNewId(newElm);

		// если модальное
		if (template.is_modal) {
			// меняем modal id
			var newModalId = Element.getMaxNumberClass($(".modal"), "data-num");
			newModalId = Element.addClassPrefix(newModalId);
			newElm.attr("data-num", newModalId);
			/**************/
			ManagerModal.chosenItem(false, newElm.attr("id"));
		} else {
			// ставим сетку
			var gridType = $(".site .section:first .grid").attr("data-type");
			newElm.find(".grid").attr("data-type", gridType);

			// строим структуру
			PageStruct.build();

			// обновляем изображения
			EditElementImage.loadingCategoryServer(true, Data.site.site_id, "img");
		}

		setTimeout(function() {
			// выделяем элемент
			newElm.mousedown().mouseup();
			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(newElm);

			Modal.delete();
		}, 1000);

		return newElm;
	}

	/**
	* Отдает шаблон
	*
	* @see 	this.addTemplate()
	*/
	this.getTemplate = function(templateId, folderId)
	{
		if (!folderId) {
			folderId = $(".managerTemplateNavItem[data-chosen='true']")
						.attr("data-id");
		}
		return Data.user.list_template[folderId]["template"][templateId];
	}

	/**
	* Отдает текущий folder id
	* 
	* @see 	this.addTemplate()
	*/
	this.getCurFolderId = function()
	{
		return this.currentNavItemIndex;
	}

/***********************************************************************************/
/***********************************************************************************/
/*********************************************************************************/

	/**
	* Создание шаблона
	*
	* @see 	this.setEvent()
	*/
	this.setEventCreateTemplate = function()
	{
		var obj = this;
		var butAddTemplateObj = $(".butAddTemplate");
		butAddTemplateObj.off("mousedown");
		butAddTemplateObj.on("mousedown", function() {
			// показываем модальное
			obj.modalEnterInfoNewTemplate();
			// ставим событие на добавление
			obj.setEventEnterInfoNewTemplate();

			return false;
		});
	}

	/**
	* Модальное - введение данных нового шаблона
	*
	* @see 	this.setEventCreateTemplate()
	*/
	this.modalEnterInfoNewTemplate = function()
	{
		var selectFolder = this.getSelectFolder();

		var content = '\
			<div class="modalLabel">'+Resource.hlp_template_label_template_name+'</div>\
			<input type="text" class="valueNewTemplateName" />\
			<div class="modalLabel lableSelectFolderNewTemplate">'+Resource.hlp_template_label_chosen_folder+'</div>\
			'+selectFolder;

		Modal.create({
			"id" : "modalInfoNewTemplate",
			"title" : Resource.hlp_template_title_add,
			"content" : content,
			"width" : 450,
			"top" : 50,
			"button" : [
				["cancel", Resource.main_modal_but_cancel],
				["add", Resource.main_modal_but_add]
			]
		});
		
		// отмечаем папку
		if (this.currentNavItemIndex && this.isAccessTypeUser(this.currentType)) {
			$(".selectFolder").val(this.currentNavItemIndex);
		}

		/*****************/
		// для разработки при замене
		if (this.developerReplaceStatus) {
			var inputTempIdV = '<input type="text" placeholder="Id шаблона" class="valueNewTemplateId" />';
			$("#modalInfoNewTemplate .valueNewTemplateName").after(inputTempIdV);
			
			var sectObjV = Element.obj;
			var sectNameV = sectObjV.attr("hlp-template-name");
			var sectIdV = sectObjV.attr("hlp-template-id");	
			// var folderId = 
			if (sectNameV) $(".valueNewTemplateName").val(sectNameV);
			if (sectIdV) $(".valueNewTemplateId").val(sectIdV);
		}
		/***************/
	}

	/**
	* Введены новые данные шаблона
	*
	* @see 	this.setEventCreateTemplate()
	*/
	this.setEventEnterInfoNewTemplate = function()
	{
		var obj = this;
		var butObj = $("#modalInfoNewTemplate .butAdd");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var folderId = $(".selectFolder").val();
			var inputNewNameObjV = $(".valueNewTemplateName");
			var templateName = inputNewNameObjV.val();

			if (templateName.match(/^[0-9]/gim)) templateName = "t"+templateName;

			// templateName = templateName.replace(/[^\w\s]+/gim, '');

			if (!templateName) {
				inputNewNameObjV.val('');
				Notification.error(Resource.hlp_template_notification_no_enter_name);
				return false;
			}

			Modal.createLoading(Resource.hlp_template_load_add_template);

			obj.addNewTemplate(templateName, folderId);
			obj.currentNavItemIndex = folderId;

		});
	}

/*******************************************************************************/

	/**
	* Добавление новой секции в шаблоны
	*
	* @see 	this.setEventEnterInfoNewTemplate()
	*/
	this.addNewTemplate = function(templateName, folderId)
	{
		var elm = Element.obj;
		var listElm = elm.find(".element, .element-content, .section-content, .bg-video, .hlp-section-bg-mask");
		listElm = listElm.add(elm);

		/********/
		if (this.developerReplaceStatus) {
			var devTempId = elm.attr("hlp-template-id");
			var devTempName = elm.attr("hlp-template-name");
			elm.removeAttr("hlp-template-id");
			elm.removeAttr("hlp-template-name");

			var newTemplateId = $(".valueNewTemplateId").val().trim();
		} else {
			var newTemplateId = this.getNewTemplateId();
		}
		if (!newTemplateId) newTemplateId = this.getNewTemplateId();
		/********/

		// получаем данные секции
		var sectionHtml = ElementMan.getHtmlElmAll(Element.obj);
		var sectionCss = this.getNewTemplateCss(listElm);
		var modalStatus = Screen.isModal();

		// заносим секцию в массив
 		var templateValue = {
			"id" : newTemplateId,
			"folder_id" : folderId,
			"name" : templateName,
			"is_modal" : modalStatus,
		};

		Data.user.list_template[newTemplateId] = templateValue;

		var template = { "html" : sectionHtml, "css" : sectionCss, "is_modal" : modalStatus};
		// сохраняем картинки на сервере
		var sectionImg = this.getNewTemplateImg(listElm);
		this.saveNewTemplate(newTemplateId, template, sectionImg);

		// что бы открывалась папка куда добавили, шаблон
		this.currentType = "my";
		this.currentNavItemIndex = folderId;

		if (this.developerReplaceStatus) {
			elm.attr("hlp-template-id", devTempId);
			elm.attr("hlp-template-name", devTempName);
		}
	}

	/**
	* Отдает css секции
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateCss = function(listElm)
	{
		var listCss = {};
		var listStyle = Data.page.data.css;
	
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);

			var elmClassUnique = Element.getClassUnique(elmItem);
			var elmCssUnique = listStyle[elmClassUnique];
			if (elmCssUnique) listCss[elmClassUnique] = copyArray(elmCssUnique);

			var elmClassAdded = Element.getClassAdded(elmItem);
			if (!elmClassAdded) continue; 
			var elmCssAdded = listStyle[elmClassAdded];
			if (elmCssAdded) listCss[elmClassAdded] = copyArray(elmCssAdded);
		}

		return listCss;
	}

	/**
	* Список изображений
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateImg = function(listElm)
	{
		var listImg = [];

		var iImgAll = 0;
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var imgItemSrc = '';
			
			if (elmItem.hasClass("image") || elmItem.hasClass("nav-button-mobile")) {
				imgItemSrc = elmItem.find("> img").attr("src");
				listImg[iImgAll] = imgItemSrc.replace(/\.\./gim, '');
				iImgAll++;
			}

			var elmBg = elmItem.css("background");
			var listBgImg = elmBg.match(/\/user\/[0-9]+\/[^\/]+\/img\/[\w\.\-\/]+/gim);
			if (listBgImg) {
				for (var iImg in listBgImg) {
					imgItemSrc = listBgImg[iImg];
					listImg[iImgAll] = imgItemSrc.replace(/\.\./gim, '');
					iImgAll++;
				}
			}
			
		}

		return listImg;
	}

	/**
	* Отдает id нового шаблона
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateId = function()
	{			
		var newId = Data.user.last_template_id + 1;
		Data.user.last_template_id = newId;

		return newId;
	}

	/**
	* Сохранение новой секции
	*
	* @see 	this.addNewTemplate()
	*/
	this.saveNewTemplate = function(newTemplateId, template, sectionImg)
	{
		template['type_access'] = this.getCurrentTypeAccess();

		var obj = this;
		var user = JSON.stringify(Data.user);//escape(JSON.stringify(Data.user));
		var query_string =	{
			"user":user,
			"new_id":newTemplateId,
			"template":JSON.stringify(template),
			"list_img":JSON.stringify(sectionImg),
			"site_id": Site.getId()
		}

		// запрос на сервер
		$.post('/editor/saveNewTemplate', query_string, function(req, status) {
			var res = req.trim();

			if (res) {
				/*********/
				if (obj.developerReplaceStatus && obj.deleloperNoSaveAvatar) {
					Modal.delete();
				} else {
					obj.saveTemplateAvatar(newTemplateId);
				}
				/*********/

				Notification.ok(Resource.hlp_template_notification_add_template);
			} else {
				Notification.error();
				Modal.delete();
			}
		})
	}

	/**
	* Сохраняем аватар
	*
	* @see 	this.saveNewTemplate()
	*/
	this.saveTemplateAvatar = function(newTemplateId)
	{
		// ставим scroll
		var elmTop = Element.obj.position().top;
		Screen.setScroll(elmTop);

		// прячем
		var listHide = $(".resizeBlock, .butAddTemplate, .addedBlock, .guides, .grid, ."+this.getClassListButSection());
		listHide.addClass("displayNone");

		html2canvas(document.querySelector(".content .site")).then(function(canvas) {
				var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, ''); 
			   	var params = {template_id:newTemplateId, data:data}; 

				$.post('/editor/saveTemplateAvatar', params, function(res) { 
					// показываем
					listHide.removeClass("displayNone");

					// убираем модальное
					Modal.delete();
			    }); 
		});
	}
/***************************************************************************/
	
	/**
	* Добавление списка кнопок для секции
	*
	* @see 	Resiz.addAddedBlock()
	*/
	this.addListButSection = function(elm)
	{
		var listButTemp = '\
				<div class="'+this.getClassListButSection()+'">\
					<div class="sectionListButTemplateContent">\
						<div class="butTemplateSection '+this.getClassButSectionAdd()+'">'+Resource.hlp_canvas_but_add_template+'</div>\
						<div class="clear"></div>\
					</div>\
				</div>\
			';
		elm.append(listButTemp);

		this.setEventButSection();
	}

	/**
	* Удаляет список кнопок
	*
	* @see 	Resize.remove()
	* @see 	Site.clearHtml()
	*/
	this.removeListButSection = function(parentObjV)
	{
		var classNameV = this.getClassListButSection();

		var butObjV = parentObjV ? parentObjV.find("."+classNameV) : $("."+classNameV);
		butObjV.remove();
	}
	
	/**
	* Отдает класс для секии
	*
	* @see 	this.addListButSection()
	* @see 	this.removeListButSection()
	*/
	this.getClassListButSection = function()
	{
		return this.class.list_but_section;
	}
	
	/**
	* События
 	*
	* @see 	this.addListButSection()
	*/
	this.setEventButSection = function()
	{
		this.setEventButSectionAddNew();
	}

	this.setEventButSectionAddNew = function()
	{
		var obj = this;
		var butObjV = $("."+this.getClassButSectionAdd());
		butObjV.off("mousedown");
		butObjV.on("mousedown", function() {
			obj.showManager();
		});
	}

/***************************************************************************/
/***************************************************************************/
} // end class

setTimeout(function(){
	// $(".butAddTemplateSection").mousedown();
}, 1000);


/***************************************************************************/
/***************************************************************************/
TemplateSection.listFolderStandart = [
	{"id" : "1", "name" : "Header"},
	{"id" : "10", "name" : "Первый экран"},

	{"id" : "20", "name" : "Список товаров"},
	{"id" : "30", "name" : "Один товар"},
	{"id" : "40", "name" : "Портфолио"},
	{"id" : "50", "name" : "Услуга"},

	{"id" : "60", "name" : "Список"},
	{"id" : "70", "name" : "Этапы работы"},
	{"id" : "80", "name" : "Сотрудники"},
	{"id" : "90", "name" : "Отзывы"},
	{"id" : "100", "name" : "Формы"},

	{"id" : "110", "name" : "Контакты"},
	{"id" : "120", "name" : "Footer"},

	{"id" : "130", "name" : "Текст"},
	{"id" : "140", "name" : "Изображения"},
	{"id" : "150", "name" : "Видео"},

/***********************************************************************************/

];

TemplateSection.listTemplateStandart = [	
	// header
	{"id" : "1_1", "folder_id" : "1", "name" : "header 1"},
	{"id" : "1_2", "folder_id" : "1", "name" : "header 2"},
	{"id" : "1_3", "folder_id" : "1", "name" : "header 3"},
	{"id" : "1_4", "folder_id" : "1", "name" : "header 4"},
	{"id" : "1_5", "folder_id" : "1", "name" : "header 5"},
	{"id" : "1_6", "folder_id" : "1", "name" : "header 6"},
	{"id" : "1_7", "folder_id" : "1", "name" : "header 7"},

	// hero
	{"id" : "10_1", "folder_id" : "10", "name" : "hero 1"},
	{"id" : "10_2", "folder_id" : "10", "name" : "hero 2"},
	{"id" : "10_3", "folder_id" : "10", "name" : "hero 3"},
	{"id" : "10_4", "folder_id" : "10", "name" : "hero 4"},
	{"id" : "10_5", "folder_id" : "10", "name" : "hero 5"},
	{"id" : "10_6", "folder_id" : "10", "name" : "hero 6"},
	{"id" : "10_7", "folder_id" : "10", "name" : "hero 7"},
	{"id" : "10_8", "folder_id" : "10", "name" : "hero 8"},
	{"id" : "10_9", "folder_id" : "10", "name" : "hero 9"},
	{"id" : "10_10", "folder_id" : "10", "name" : "hero 10"},
	{"id" : "10_11", "folder_id" : "10", "name" : "hero 11"},
	{"id" : "10_12", "folder_id" : "10", "name" : "hero 12"},
	{"id" : "10_13", "folder_id" : "10", "name" : "hero 13"},
	{"id" : "10_14", "folder_id" : "10", "name" : "hero 14"},
	{"id" : "10_15", "folder_id" : "10", "name" : "hero 15"},

	// products
	{"id" : "20_1", "folder_id" : "20", "name" : "products 1"},
	{"id" : "20_2", "folder_id" : "20", "name" : "products 2"},
	{"id" : "20_3", "folder_id" : "20", "name" : "products 3"},
	{"id" : "20_4", "folder_id" : "20", "name" : "products 4"},

	// product
	{"id" : "30_1", "folder_id" : "30", "name" : "product 1"},
	{"id" : "30_2", "folder_id" : "30", "name" : "product 2"},
	{"id" : "30_3", "folder_id" : "30", "name" : "product 3"},
	{"id" : "30_4", "folder_id" : "30", "name" : "product 4"},
	{"id" : "30_5", "folder_id" : "30", "name" : "product 5"},

	// portfolio
	{"id" : "40_1", "folder_id" : "40", "name" : "portfolio 1"},
	{"id" : "40_2", "folder_id" : "40", "name" : "portfolio 2"},
	{"id" : "40_3", "folder_id" : "40", "name" : "portfolio 3"},
	{"id" : "40_4", "folder_id" : "40", "name" : "portfolio 4"},
	{"id" : "40_5", "folder_id" : "40", "name" : "portfolio 5"},
	{"id" : "40_6", "folder_id" : "40", "name" : "portfolio 6"},
	{"id" : "40_7", "folder_id" : "40", "name" : "portfolio 7"},
	{"id" : "40_8", "folder_id" : "40", "name" : "portfolio 8"},
	{"id" : "40_9", "folder_id" : "40", "name" : "portfolio 9"},
	{"id" : "40_10", "folder_id" : "40", "name" : "portfolio 10"},
	{"id" : "40_11", "folder_id" : "40", "name" : "portfolio 11"},
	{"id" : "40_12", "folder_id" : "40", "name" : "portfolio 12"},

	// service
	{"id" : "50_1", "folder_id" : "50", "name" : "service 1"},
	{"id" : "50_2", "folder_id" : "50", "name" : "service 2"},
	{"id" : "50_3", "folder_id" : "50", "name" : "service 3"},

	// list
	{"id" : "60_1", "folder_id" : "60", "name" : "list 1"},
	{"id" : "60_2", "folder_id" : "60", "name" : "list 2"},
	{"id" : "60_3", "folder_id" : "60", "name" : "list 3"},
	{"id" : "60_4", "folder_id" : "60", "name" : "list 4"},

	// steps
	{"id" : "70_1", "folder_id" : "70", "name" : "steps 1"},
	{"id" : "70_2", "folder_id" : "70", "name" : "steps 2"},
	{"id" : "70_3", "folder_id" : "70", "name" : "steps 3"},

	// employees
	{"id" : "80_1", "folder_id" : "80", "name" : "employees 1"},
	{"id" : "80_2", "folder_id" : "80", "name" : "employees 2"},

	// reviews
	{"id" : "90_1", "folder_id" : "90", "name" : "reviews 1"},
	{"id" : "90_2", "folder_id" : "90", "name" : "reviews 2"},
	{"id" : "90_3", "folder_id" : "90", "name" : "reviews 3"},

	// form
	{"id" : "100_1", "folder_id" : "100", "name" : "form 1"},
	{"id" : "100_2", "folder_id" : "100", "name" : "form 2"},
	{"id" : "100_3", "folder_id" : "100", "name" : "form 3"},

	// contact
	{"id" : "110_1", "folder_id" : "110", "name" : "contact 1"},
	{"id" : "110_2", "folder_id" : "110", "name" : "contact 2"},
	{"id" : "110_3", "folder_id" : "110", "name" : "contact 3"},

	// footer
	{"id" : "120_1", "folder_id" : "120", "name" : "footer 1"},
	{"id" : "120_2", "folder_id" : "120", "name" : "footer 2"},
	{"id" : "120_3", "folder_id" : "120", "name" : "footer 3"},
	{"id" : "120_4", "folder_id" : "120", "name" : "footer 4"},

	// text
	{"id" : "130_1", "folder_id" : "130", "name" : "text 1"},
	{"id" : "130_2", "folder_id" : "130", "name" : "text 2"},

	// image
	{"id" : "140_1", "folder_id" : "140", "name" : "image 1"},
	{"id" : "140_2", "folder_id" : "140", "name" : "image 2"},
	{"id" : "140_3", "folder_id" : "140", "name" : "image 3"},
	{"id" : "140_4", "folder_id" : "140", "name" : "image 4"},
	{"id" : "140_5", "folder_id" : "140", "name" : "image 5"},

	// video
	{"id" : "150_1", "folder_id" : "150", "name" : "video 1"},
	{"id" : "150_2", "folder_id" : "150", "name" : "video 2"},
	{"id" : "150_3", "folder_id" : "150", "name" : "video 3"},
	{"id" : "150_4", "folder_id" : "150", "name" : "video 4"},


];

