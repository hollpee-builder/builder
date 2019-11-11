$(document).ready(function() {
	Tip.setEvent();
	PageSite.init();
});

var PageSite = new PageSite;
function PageSite() {
	this.listPage = {};

	this.class = {};
	this.class.modal_edit_name = "modalEditValueName";
	this.class.modal_edit_link = "modalEditValueLink";	
	this.class.modal_edit_redirect = "modalEditValueRedirect";
	this.class.modal_edit_cmsname = "modalEditValueCmsName";

	this.getClassModalEditName = function()
	{
		return this.class.modal_edit_name;
	}

	this.getClassModalEditLink = function()
	{
		return this.class.modal_edit_link;
	}

	this.getClassModalEditRedirect = function()
	{
		return this.class.modal_edit_redirect;
	}

	this.getClassModalEditCmsName = function()
	{
		return this.class.modal_edit_cmsname;
	}

	this.getListPages = function()
	{
		return this.listPage;
	}

	this.getPage = function(pageId)
	{
		var listPages = this.getListPages();
		return listPages[pageId];
	}

/********************************************************************************/	

	/**
	* 
	*
	*/
	this.init = function()
	{
		// this.setProperty();
		this.setEvent();

		// создаем кнопку для загрузки файла
		this.createButUpload();
	}

	/**
	* Устанавливает параметры
	*
	* @see 	this.init()
	*/
	this.setProperty = function()
	{
		var listPageJson = $(".list-page-json").text();
		this.listPage = JSON.parse(listPageJson);
	}

	/**
	* Создаем кнопку загрузки файла
	*
	* @see 	this.init()
	*/
	this.createButUpload = function()
	{	
		var but = '<div class="h-but-upload-file btn butAddSite">Загрузить сайт</div>'; 
		var parentButUpload = $(".wrap-but-upload-file");
		var url = "/" + ADMIN_FOLDER + "/index/uploadTemplate";
		File.createButUpload(parentButUpload, but, url, "files", function(data) {
			data = data.trim();
				
			// console.log(data);
			// return false;	

			if (data == "no_cms") {
				Notification.error("Загружена не CMS Hollpee");
				Modal.delete();
			} else if (data == "cms_other_type") {
				Notification.error("CMS загружена другого типа");
				Modal.delete();
			}else if (data) {
				// location.reload();
				location.href = data;
			} else {
				Modal.delete();
				Notification.error();
			}
		});
	}

/*************************************************************************************************/
	
	/**
	* Ставит события
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		// удаление
		this.setEventDelete();
	}
	
	/**
	* Изменение имя файла
	*
	* @see 	this.setEvent()
	*/
	this.setEventName = function()
	{
		var obj = this;
		var butName = $(".siteName");
		butName.off("mousedown");
		butName.on("mousedown", function() {
			var pageObj = $(this).closest(".page-item");
			var pageNameObj = pageObj.find(".page-file-name");
			var pageId = pageObj.attr("data-id");
			var fileName = pageNameObj.text().trim();
			obj.createModalEditName(fileName);
			obj.setEventModalEditName(pageObj, pageNameObj, fileName, pageId);
		});
	}

	/**
	* Создание модального окга - изменить имя
	*
	* @see 	this.setEventName()
	*/
	this.createModalEditName = function(fileName)
	{
		var content = '<input type="text" data-only-eng="true" class="valueFileName" value="'+fileName+'"/>';

		Modal.create({
			"id" : "modalEditName",
			"title" : "Изменить имя файла",
			"content" : content,
			"width" : 400,
			"top" : 100,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Изменить"],
			]
		});
	}

	/**
	* Событие для модального окна
	*
	* @see 	this.setEventName()
	*/
	this.setEventModalEditName = function(pageObj, pageNameObj, oldName, pageId)
	{
		return false;
		var butOk = $("#modalEditName .hollpee-but-ok");
		butOk.off("mousedown");
		butOk.on("mousedown", function() {
			var newName = $("#modalEditName .valueFileName").val().trim();
			if (!newName) newName = "index.php";
			Modal.delete();

			if (oldName == newName) return false;

			newName = newName.replace(/[^\w\-\.]+/gim, '');

			pageNameObj.text(newName);

			var url = "/" + ADMIN_FOLDER + "/index/editPageName";
			var queryString = {"new" : newName, "page_id" : pageId};
			$.post(url, queryString, function(data, status) {
				data = data.trim();

				if (!data) {
					Notification.error();
					return false;
				}

				var butShowObj = pageObj.find(".but-page-show");

				if (newName == "index") newName = "";
				var hrefShow = butShowObj.attr("href").replace(/[\w\-\.]*$/, newName);
				butShowObj.attr("href", hrefShow);

				Notification.ok("Имя изменено");
			});
		});
	}

/************************************************************************************/
	/**
	* Удаление страницы
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var butDelete = $(".but-page-delete");
		var obj = this;
		butDelete.off("mousedown");
		butDelete.on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите удаление страницы");
			obj.confirmationDelete($(this));
		});
	}

	/**
	* Подтвержения удаления
	*
	* @see 	this.setEventDelete()
	*/
	this.confirmationDelete = function(butEvent)
	{
		$("#confirmationDelete .hollpee-but-delete").off("mousedown");
		$("#confirmationDelete .hollpee-but-delete").on("mousedown", function() {

			var pageObj = butEvent.closest(".page-item");
			pageObj.css("display", "none");
			var pageIndex = pageObj.attr("data-id");

			$.post("/" + ADMIN_FOLDER + "/index/deletePage", {"id" : pageIndex}, function(data, status) {
				data = data.trim();

				// console.log(data)
				// return false;

				if (data) {
					location.reload();
				} else {
					pageObj.css("display", "block");

					Notification.error();
					Modal.delete();
				}	
			});
		});
	}

/*********************************************************************************************/

} // end class

