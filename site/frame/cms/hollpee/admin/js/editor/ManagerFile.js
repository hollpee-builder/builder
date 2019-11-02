/**
* Управление файлами
*
*
*/
var ManagerFile = new ManagerFile();
function ManagerFile() {
	this.listFile = false;
	this.fileType = false;
	this.modalObj = false;
	this.prevParentFolder = '';
	this.parentFolder = '';

	/** 
	* Изменение файла
	*
	* @see 	Element.setEventEdit()
	*/
	this.edit = function(fileType, src, isDymTitle, functSave)
	{
		var elm = this.getElm();

		this.fileType = fileType;
		this.isDymTitle = isDymTitle ? true : false;
		this.functSave = functSave;
		this.src = src && isDymTitle ? src : elm.attr("src");
		this.setListFile();

		this.createManager();
	}

	this.getElm = function()
	{
		var elm = Element.obj;
		if (elm.find("> img").length) elm = elm.find("img");
		return elm;
	}

	/**
	* Устанавливает список файлов
	*
	* @see 	this.edit() 
	*/
	this.setListFile = function()
	{
		var fileJson = $(".h-folder-file[data-hlp-type='" + this.fileType + "']").html();
		this.listFile = JSON.parse(fileJson);
		
		this.setPropertyParentFolder(this.src);
	}


	/**
	* Обновляет список файлов
	*
	* @see 	this.createButUpload()
	* @see 	this.confirmationDelete()
	*/
	this.uploadListFile = function()
	{
		var listFileJson = JSON.stringify(this.listFile);
		var listObj = $(".h-folder-file[data-hlp-type='" + this.fileType + "']");
		listObj.html(listFileJson);
	}

/*******************************************************************************/

	/**
	* Создает модальное
	*
	* @see 	this.edit()
	* @see 	this.createManager()
	*/
	this.createManager = function()
	{
		this.createModalFile();
	}

	/**
	* Создает модальное окно для изменения картинки
	*
	* @see 	this.setEventManager()
	*/
	this.createModalFile = function()
	{
		var modalId = "modalEditFile";

		Modal.create({
			"id" : modalId,
			"title" : "Изменения файла",
			"width" : 900,
			"top" : 20,
			"content" : '',
			"button" : [
				["ok", "Сохранить"],
				["cancel", "Отмена"]
			]
		});

		this.modalObj = $("#"+modalId);
		this.setManagerContent();

		// добавляем блок для сброски значений
		if (typeof(Element) != "undefined" && Element.addClearCustomizer) {
			Element.addClearCustomizer(this.modalObj);
		}
	}

	/**
	* Устанавливает в менеджер содержимое
	*
	* @see 	this.createModalFile()
	* @see 	this.replaceSrc()
	*/
	this.setManagerContent = function()
	{
		var content = this.getModalContent();
		$("#modalEditFile .h-modal-block-cont").html(content);

		this.noteCurrentFile();

		this.setEventModalManager();
	}

	/**
	* Отметить текущий фаил
	*
	* @see 	this.createModalFile()
	*/
	this.noteCurrentFile = function()
	{
		if (this.fileType == "files") {
			var elmHref = Element.obj.attr("href");
			var fileName = /[^=]+$/gim.exec(elmHref);
			var fileObj = $(".h-modal-img-self[data-hlp-name='"+fileName[0]+"']");
		} else {
			var elm = Element.obj;
			var fileSrc = elm.attr("src");
			var fileObj = $(".h-modal-img-self[src='"+fileSrc+"']");
		}
		
		fileObj.closest(".h-modal-img-item").attr("data-hlp-chosen", "true");
	}


	/**
	* Отдает содержимое модального - изменить изображение
	*
	*
	* @see 	this.createModalFile()
	*/
	this.getModalContent = function()
	{
		// this.listFile
		var listImgContent = '';
		for (var fileId in this.listFile) {
			var file = this.listFile[fileId];
			var fileName = file["name"];
			var fileType = file["type"];
			var parentId = file["parent_id"];


			if (this.fileType == "images" && this.parentFolder != parentId) {
				continue;
			}

			if (fileType == "dir") {
				var fileSrc = "/" + ADMIN_FOLDER + "/img/editor/folder-icon.png";
			} else if (this.fileType == "files") {
				var fileSrc = "/" + ADMIN_FOLDER + "/img/editor/file-icon.png";
			} else {
				var fileSrc = fileId;
			}

			if (this.isDymTitle && fileType != "dir") {
				fileSrc = '../' + fileSrc;
			}

			listImgContent += '\
				<div class="h-modal-img-item" data-hlp-type="'+fileType+'" data-hlp-id="'+fileId+'">\
					<div class="h-modal-img-wrap">\
						<img src="'+fileSrc+'" data-hlp-name="'+fileName+'" class="h-modal-img-self" alt="" />\
					</div>\
					<div class="h-modal-img-name">'+fileName+'</div>\
					<div class="h-block-img-delete">\
						<div class="h-but-img-delete">удалить</div>\
					</div>\
				</div>\
			';
		}

		listImgContent += '<div class="clear"></div>';

		var statusButBakc = this.parentFolder ? "true" : "false";
		var content = '\
			<div class="hlp-manager-file-top-panel">\
				<div class="but-manager-file-back" data-hlp-folder="'+this.parentFolder+'" data-hlp-active="'+statusButBakc+'">Назад</div>\
				<div class="hlp-clear"></div>\
			</div>\
			<div class="hlp-manager-file-list-img">'+listImgContent+'</div>\
		';

		return content;
	}

	/**
	* Установка параметров папок 
	*
	*
	*/
	this.setPropertyParentFolder = function(fileName)
	{
		if (!fileName) fileName = '';
		var folder = fileName.replace(/\/[^\/]+\/?$/, '');
		if (!this.listFile[folder]) folder = '';
		else folder = folder.replace(/images\/[0-9]+/gim, '');

		this.parentFolder = folder;
	}

/***************************************************************************************/

	/**
	* События для модального
	*
	* @see 	this.setEventManager()
	*/
	this.setEventModalManager = function()
	{
		// удаление
		this.setEventDelete(); 
		// выбор картинки
		this.setEventChosen();
		// выбор изменение
		this.setEventEdit();
		// загрузка
		this.createButUpload();
		// кнопка назад
		this.setEventButBack();
	}

	/**
	* Кнопка назад
	*
	* @see 	this.setEventModalManager()
	*/
	this.setEventButBack = function()
	{
		var obj = this;
		var butObj = $(".but-manager-file-back");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var folderPrev = $(this).attr("data-hlp-folder");
			obj.setPropertyParentFolder(folderPrev);
			obj.setManagerContent();
		});
	}


	this.createButUpload = function()
	{
		var but = '\
			<div class="hollpee-but-block hollpee-but-add h-but-upload-file">\
				<div class="text-in-but">Загрузить фаил</div>\
			</div>\
		';

		var parentButUpload = $(".h-modal-block-buttton");
		var url = "/" + ADMIN_FOLDER + "/editor/addFile";
		var folder = this.fileType == "images" ? Site.siteId+this.parentFolder : false;
		var obj = this;
		File.createButUpload(parentButUpload, but, url, this.fileType, function(newfileName) {
			newfileName = newfileName.trim();

			if (newfileName) {
				Modal.delete();
				
				newfileName = JSON.parse(newfileName);
				obj.listFile[newfileName["src"]] = newfileName;
				// obj.listFile.unshift(newfileName);
				obj.uploadListFile();

				obj.createManager();
			} else {
				Modal.deleteLoadind();
				Notification.error();
			}
		}, folder);
	}
	
/******************************************************************************************/

	/**
	* Удаление изображения
	*
	* @see 	this.setEventModalManager()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		$(".h-but-img-delete").off("mousedown");
		$(".h-but-img-delete").on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите удаление файла");	
			obj.confirmationDelete($(this));
		});
	}

	/**
	* Удаление
	*
	* @see 	this.setEventDelete()
	*/
	this.confirmationDelete = function(elmEvent)
	{
		var fileObj = elmEvent.closest(".h-modal-img-item");
		var imgId = fileObj.attr("data-hlp-id");
		var fileName = fileObj.find(".h-modal-img-self").attr("data-hlp-name");

		var obj = this;

		$("#confirmationDelete .hollpee-but-delete").off("mousedown");
		$("#confirmationDelete .hollpee-but-delete").on("mousedown", function() {
			Modal.createLoading("Удаляется фаил");
			if (obj.fileType == "images") fileName = Site.pageId+obj.parentFolder+ '/' + fileName;

			var queryString = {"type" : obj.fileType, "name" : fileName};

			$.post("/" + ADMIN_FOLDER + "/editor/deleteFile", queryString, function(data) {
				var isDelete = data.trim();

				if (isDelete) {
					Modal.delete();

					fileObj.remove();
					delete obj.listFile[imgId];
					obj.uploadListFile();

					obj.createManager();
				} else {
					Modal.deleteLoadind();
					Notification.error();
				}
			})
		});

	}

/*********************************************************************************************/

	/**
	* Выбор файла
	*
	* @see 	this.setEventModalManager()
	*/
	this.setEventChosen = function()
	{	
		var listFileObj = $(".h-modal-img-item");
		listFileObj.off("mousedown");
		listFileObj.on("mousedown", function() {
			listFileObj.removeAttr("data-hlp-chosen");
			$(this).attr("data-hlp-chosen", "true");
		});
	}

	/**
	* Событие изменение файла
	*
	* @see 	this.setEventModalManager()
	*/
	this.setEventEdit = function()
	{	
		var obj = this;

		$(".h-modal-img-item").off("dblclick");
		$(".h-modal-img-item").on("dblclick", function() {
			obj.replaceSrc($(this));
		});

		this.modalObj.find(".hollpee-but-ok").off("mousedown");
		this.modalObj.find(".hollpee-but-ok").on("mousedown", function() {
			var chosenImg = $(".h-modal-img-item[data-hlp-chosen='true']");
			obj.replaceSrc(chosenImg);
		});
	}

	/**
	* Изменить src файла
	*
	* @see 	this.setEventEdit()
	*/
	this.replaceSrc = function(imgItemObj)
	{
		var fileId = imgItemObj.attr("data-hlp-id");
		if (this.listFile[fileId]["type"] == "dir") {
			this.parentFolder = fileId.replace(/images\/[0-9]+/gim, '');
			this.setManagerContent();
			return false;
		}

		var fileObj = imgItemObj.find(".h-modal-img-self");
		var elm = Element.obj;
		if (elm.hasClass("gallery-image")) elm = elm.find("> img");
		var src = fileObj.attr("src");

		if (this.isDymTitle) {
			this.functSave(src);
		} else if (this.fileType == "files") {
			var fileName = fileObj.attr("data-hlp-name");
			var href = "php/hlp_download.php?file=" + fileName;
			Element.editCustomizer(elm, href, "link");
			elm.attr("href", href);

			Site.setStatusSave(false);
		} else {
			if (src) {
				Element.editCustomizer(elm, src, "img");
				
				if (elm.prop("tagName") != "IMG") elm = elm.find("img");
				elm.attr("src", src);

				Site.setStatusSave(false);
			}
		}
		
		Modal.delete();
	}

} // end class

