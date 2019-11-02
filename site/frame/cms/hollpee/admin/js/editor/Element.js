/**
* Элемент страницы
*
*
*/
var Element = new Element();
function Element() {
	this.listCustomizerPage = false;
	this.isInit = false;

	/**
	*
	*
	* @see 	Editor.init()
	*/
	this.init = function()
	{
		if (!this.obj) this.obj = $(".hlp-section:first");

		this.setEvent();
		this.setCustomizer();
		this.isInit = true;
	}	

	/**
	*
	*
	* @see 	this.init()
	*/
	this.setCustomizer = function()
	{
		if (this.isInit) return false;

		var jsonPage = $(".h-list-customizer-page").html();
		if (jsonPage) this.listCustomizerPage = JSON.parse(jsonPage.trim());
		else this.listCustomizerPage = {};

		var jsonMain = $(".h-list-customizer-main").html().trim();
		if (jsonMain) this.listCustomizerMain = JSON.parse(jsonMain);
		else this.listCustomizerMain = {};
	}

	/**
	* Изменение
	*
	* @see 	ElementText.editText()
	* @see 	ManagerFile.replaceSrc()
	* @see 	ElementLink.setEventSave()
	* @see 	ElementVideo.setEvent()
	* @see 	ManagerElement.actionAfter()
	* @see 	ElementForm.actionAfter()
	*/
	this.editCustomizer = function(elm, value, elmType)
	{
		if (value) value = value.trim();
		var elmCustomizerId = elm.attr("data-hlp-id");

		elmCustomizerId = this.getIdWithType(elmCustomizerId, elmType);
		
		// добавляем в массив
		if (this.isFrame(elm)) {
			if (!this.listCustomizerMain) this.listCustomizerMain = {};
			this.listCustomizerMain[elmCustomizerId] = value;
		} else {
			if (!this.listCustomizerPage) this.listCustomizerPage = {};
			this.listCustomizerPage[elmCustomizerId] = value;
		}
	}

	this.isFrame = function(elm)
	{
		var isMlp = $(".hlp-page").length;
		// не многостраничник
		if (!isMlp) {
			return false;
		// многостраничник, но внутри page 
		} else if (isMlp && elm.closest(".hlp-page").length) {
			return false;
		// многостраничник, но не внутри page
		} else {
			return true;
		}
	}


/******************************************************************************/
/******************************************************************************/

	/**
	* Устанавливает события для элементов
	*
	* @see 	this.editModal()
	* @see 	ManagerElement.setEventMove()
	* @see 	ManagerElement.setEventCopy()
	* @see 	ElementModalE.setEventEdit()
	* @see 	this.replaceTag()
	*/
	this.setEvent = function()
	{
		// ставим параметры
		this.setProperty();
		// выбор элемента
		this.setEventSelected(); 
		// при наведении
		this.setEventHover();
	}

/*********************************************************************************************/

	/**
	* Ставим параметры
	*
	* @see 	this.setEvent()
	*/
	this.setProperty = function()
	{
		// устанавливаем id
		this.listObjCanvas = this.getPropertyId();
		// для секции
		$("*[data-hlp-value='section-fixed']").attr("data-hlp-value", "section-fixed-hollpee");
		// для галереи
		$(".gallery-but-zoom, .gallery-nav").remove();

		// для видео
		ElementVideo.setPropertyInit();
		// для событий
		this.setPropertyGoal();
		// для img
		this.setPropertyImages();

		// for form
		var listForm = $(".h-canvas form");
		listForm.attr("method", "get");
		listForm.find("input[type='submit']").on("click", function() {
			return false;
		});
	}

	this.setPropertyGoal = function()
	{
		$(".h-canvas *").removeAttr("onclick").removeAttr("onsubmit");
	}

	this.setPropertyImages = function()
	{
		$(".h-canvas img").filter(function() {
			var imgObj = $(this);
			var dataOrg = imgObj.attr("data-original");
			if (dataOrg && !imgObj.attr("src")) imgObj.attr("src", dataOrg);
		});
	}

	/**
	* Устанавливает id
	*
	* @see 	this.setProperty()
	*/
	this.getPropertyId = function()
	{
		var selector = "p, li, h1, h2, h3, h4, h5, h6, .hlp-img, .hlp-but, .hlp-li, .hlp-video, .hlp-nav-item";
		var listObj = $(".hlp-section-content, .hlp-modal").find(selector);
		listObj = listObj.filter("[data-hlp-id]");

		return listObj;
	}
	
/**********************************************************************************************/

	/**
	* Действие при наведении
	*
	* @see 	this.setEvent()
	*/
	this.setEventHover = function()
	{
		var obj = this;

		this.listObjCanvas.off("mouseover");
		this.listObjCanvas.on("mouseover", function() {
			$(this).addClass("h-element-over");
			return false;
		});

		this.listObjCanvas.off("mouseout");
		this.listObjCanvas.on("mouseout", function() {
			obj.listObjCanvas.removeClass("h-element-over");
		});
	}

	/**
	* Выбор элемента
	*
	* @see 	this.setEvent()
	*/
	this.setEventSelected = function()
	{
		var obj = this;
		this.listObjCanvas.off("mousedown");
		this.listObjCanvas.on("mousedown", function() {
			var elm = $(this);

			$(".h-element-selected").removeClass("h-element-selected");
			elm.addClass("h-element-selected");

			Element.obj = elm;

			// создаем блок управления
			ManagerElement.create();
			// изменение
			obj.setEventEdit();

			return false;
		});

		this.listObjCanvas.off("click");
		this.listObjCanvas.on("click", function() {
			return false;
		});
	}


	/**
	* Изменение
	*
	* @see 	this.setEventSelected()
	*/
	this.setEventEdit = function()
	{
		var obj = this;
		$(".h-but-manager-edit").off("mousedown");
		$(".h-but-manager-edit").on("mousedown", function() {
			obj.edit();
			return false;
		});

		$("*").off("dblclick");
		this.obj.on("dblclick", function() {
			obj.edit();
			return false;
		});
	}

	this.edit = function()
	{
		// Modal.delete();
		
		var elm = Element.obj;
		var tagName = elm.prop("tagName");
			
		if (elm.hasClass("hlp-img")) ManagerFile.edit("images");
		else if (this.isText(elm)) ElementText.editText(elm);
		else if (elm.hasClass("hlp-video")) ElementVideo.edit(elm);
		else if (elm.attr("data-hlp-action") == "download") ManagerFile.edit("files");
	}
/**********************************************************************************************/
	this.getAllObj = function(elm)
	{
		return this.getObj();
	} 

	this.getObj = function()
	{
		return this.obj;
	}

	this.getId = function()
	{
		var elm = this.getObj();
		return elm.attr("data-hlp-id");
	}

	this.getIdWithType = function(elmId, elmType)
	{
		var listType = this.getListType();
		if (listType[elmType]) elmId += "-"+elmType;

		return elmId;
	}

	this.getListType = function()
	{
		return {
			"link":1, 
			"img":1, 
			"video":1
		};
	}

	/**
	* Это текст или нет
	*
	* @see 	this.setEventSelected()
	*/
	this.isText = function(elm)
	{
		var tagName = elm.prop("tagName");
		
		if (elm.hasClass("hlp-but")) return true;

		switch (tagName) {
			case "P" : return true;
			case "A" : return true;
			case "LI" : return true;
			case "H1" : return true;
			case "H2" : return true;
			case "H3" : return true;
			case "H4" : return true;
			case "H5" : return true;
			case "H6" : return true;
			default: return false;
		}
	}

	/**
	* Узнает можно изменить или нет
	* 
	* @see 	ManagerElement.getBlock()
	*/
	this.isEdit = function()
	{
		var elm = Element.obj;

		if (this.isText(elm) 
				|| elm.prop("tagName") == "IMG" 
				|| elm.hasClass("hlp-video")) {
			return true;
		} else {
			return false;
		}
	}

/*****************************************************************************************/
	// очищение значений 

	/**
	* Добавляет блок для очищения значения
	*
	* @see 	ElementText.createModal()
	* @see 	ManagerFile.createModalFile()
	* @see 	ElementVideo.createModal()
	*/
	this.addClearCustomizer = function(modalObj, objectType)
	{
		var isEdit = this.isEditingElm();

		if (!isEdit) return false;

		this.createBlockClearCustmoizer(modalObj, objectType);
		this.setEventClearCustomizer(objectType);
	}

	this.createBlockClearCustmoizer = function(modalObj, objectType)
	{
		var content = '\
			<div class="h-block-clear-customizer">\
				<div class="h-block-clear-customizer-status">Значения были изменены</div>\
				<div class="h-block-clear-customizer-but">Сбросить</div>\
				<div class="hlp-clear"></div>\
			</div>\
		';

		modalObj.find(".h-modal-block-cont").prepend(content);
	}

	this.setEventClearCustomizer = function(objectType)
	{
		var obj = this;
		var objBut = $(".h-block-clear-customizer-but");
		objBut.off("click");
		objBut.on("click", function() {
			Modal.confirmationDelete("Подтвердите сброс значения", function() {
				var elmId = obj.getId();
				obj.clearCustomizer(elmId, objectType);
			})
		});
	}

	this.clearCustomizer = function(elmId, objectType)
	{
		// удаляем значение
		delete this.listCustomizerPage[elmId];
		delete this.listCustomizerMain[elmId];
		var listType = this.getListType();
		for (var elmType in listType) {
			var elmIdType = elmId+"-"+elmType;
			delete this.listCustomizerPage[elmIdType];
			delete this.listCustomizerMain[elmIdType];
		}

		// ставим загрузку
		Modal.createLoading("Очищаеться значение");

		// сохраянем и перезагружаем
		Site.setStatusSave("true");
		var isReload = true;
		Site.save(isReload);
	}

	/**
	* Элемент был изменен или нет
	*
	* @see 	this.createBlockClearCustmoizer()
	*/
	this.isEditingElm = function()
	{
		var elmId = this.getId();

		var isEdit = this.listCustomizerPage[elmId];
		if (isEdit) {
			return true;
		} else {
			isEdit = this.listCustomizerMain[elmId];
			if (isEdit) return true;
		} 
		
		var listType = this.getListType();
		for (var elmType in listType) {
			var elmIdType = elmId+"-"+elmType;
			var isEditElm = this.listCustomizerPage[elmIdType];
			if (isEditElm) {
				return true;
			} else {
				isEditElm = this.listCustomizerMain[elmIdType];
				if (isEditElm) return true;
			}
		}

		return isEdit;
	}


/*****************************************************************************************/

} // end class
