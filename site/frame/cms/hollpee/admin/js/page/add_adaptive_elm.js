$(document).ready(function() {
	PageAddAdaptiveElm.init();
});

var PageAddAdaptiveElm = new PageAddAdaptiveElm();
function PageAddAdaptiveElm() {
	this.listElm = {};
	this.listValue = {};

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	}

/******************************************************************************/
	
	/**
	* Установка параметров
	*
	* @see 	this.init()
	*/
	this.setProperty = function()
	{
		this.setPropertyId();
		this.setPropertyVariable();

		for (var elmId in this.listElm) {
			var elm = $("[data-hlp-id='"+elmId+"']");
			if (elm.length) {
				elm.attr("data-hlp-adaptive-elm", "true");
			} else {
				this.deleteElm(elmId, false, true)
			}
		}
	}

	this.setPropertyId = function()
	{
		$("a[data-hlp-id] > img").filter(function() {
			$(this).parent().removeAttr("data-hlp-id");
		});
	}

	/**
	* Устанавливает переменные
	* 
	* @see 	this.setProperty()
	*/
	this.setPropertyVariable = function()
	{
		this.siteId = $("#siteId").text().trim();

		var propertyJson = $("#adaptiveTitleJson").html().trim();
		if (!propertyJson) return false;
		var property = JSON.parse(propertyJson);

		this.listElm = property['list_elm'];
		if (!this.listElm) this.listElm = {};

		this.listValue = property['list_value'];
		if (!this.listValue) this.listValue = {};
	}

/******************************************************************************/	

	/**
	* Установка событий
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		this.setEventAdd();
		this.setEventEdit();

		$("a").off("click");
		$("a").on("click", function() {return false;});
	}

	/**
	* Добавление элемента 
	*
	*
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var listElm = $("h1, h2, h3, h4, h5, h6, p, a, .hlp-img, .hlp-but");
		listElm = listElm.filter("[data-hlp-id]");

		listElm = listElm.not("[data-hlp-adaptive-elm='true']");
		listElm.off("mousedown");
		listElm.on("mousedown", function() {
			obj.createModalAdd($(this));
			return false;
		});
	}

	/**
	* Создает модальное - изменить значение
	*
	* @see 	this.setEventAdd()
	*/
	this.createModalAdd = function(elm)
	{
		var content = this.getModalContentAdd();

		Modal.create({
			"id" : "modalAdaptiveTitleAdd",
			"title" : "Добавление динамического элемента",
			"width" : 450,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Добавить"]
			]
		});

		this.setEventModalAddSave(elm);
	}

	/**
	* Отдает контент модального
	*
	* @see 	this.createModalAddValue() 
	*/
	this.getModalContentAdd = function()
	{
		var content = '\
			<div class="modalAdaptiveElmLabel">Введите имя элемента</div>\
			<input type="text" class="valueNewAdaptiveElm" />\
		';

		return content;
	}

	/**
	* Сохранение изменения
	*
	* @see 	this.createModalAddValue()
	*/
	this.setEventModalAddSave = function(elm)
	{
		var obj = this;
		var butObj = $("#modalAdaptiveTitleAdd .butOk");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var inputObj = $(".valueNewAdaptiveElm");
			var name = inputObj.val();
			if (name) name = name.trim();

			if (!name) {
				inputObj.val('');
				Notification.error("Введите имя элемента");
				return false;
			}
			
			if (obj.isElmText(elm)) var type = "text";
			else if (obj.isElmImage(elm)) var type = "image";
			else if (obj.isElmBut(elm)) var type = "button";
			else if (elm.attr("type") == "submit") var type = "submit";

			var newId = elm.attr("data-hlp-id");
			obj.listElm[newId] = {
				"name" : name,
				"type" : type
			};

			elm.attr("data-hlp-adaptive-elm", "true");
			obj.setEvent();

			Modal.delete();
			obj.saveChange("Добавлен новый элемент");
		});
	}

	this.isElmImage = function(elm)
	{
		var tagName = elm.prop("tagName");
		if (tagName == "IMG") {
			return true;
		} else {
			return false;
		}
	}

	this.isElmBut = function(elm)
	{
		return elm.hasClass("hlp-but");
	}

	this.isElmText = function(elm)
	{
		var tagName = elm.prop("tagName");
		if (tagName == "H1" 
				|| tagName == "H2"
				|| tagName == "H3"
				|| tagName == "H4"
				|| tagName == "H5"
				|| tagName == "H6"
				|| tagName == "P") {
			return true;
		} else {
			return false;
		}
	}

/******************************************************************************/	
	
	/**
	* Изменение элемента 
	*
	*
	*/
	this.setEventEdit = function()
	{
		var obj = this;
		var listElm = $("[data-hlp-adaptive-elm='true']");			
		listElm.off("mousedown");
		listElm.on("mousedown", function() {
			obj.createModalEdit($(this));

			return false;
		});
	}

	/**
	* Создает модальное - изменить значение
	*
	* @see 	this.setEventEdit()
	*/
	this.createModalEdit = function(elm)
	{
		var content = this.getModalContentEdit(elm);

		Modal.create({
			"id" : "modalAdaptiveTitleEdit",
			"title" : "Изменение динамического элемента",
			"width" : 450,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["delete", "Удалить"],
				["ok", "Сохранить"]
			]
		});

		this.setEventModalEditSave(elm);
		this.setEventModalDelete(elm);
	}

	/**
	* Отдает контент модального
	*
	* @see 	this.createModalEditValue()
	*/
	this.getModalContentEdit = function(elm)
	{
		var elmId = elm.attr("data-hlp-id");
		var name = this.listElm[elmId]["name"];

		var content = '\
			<div class="modalAdaptiveElmLabel">Имя элемента</div>\
			<input type="text" class="valueAdaptiveElmName" value="'+name+'" />\
		';

		return content;
	}

	/**
	* Сохранение изменения
	*
	* @see 	this.createModalEditValue()
	*/
	this.setEventModalEditSave = function(elm)
	{
		var obj = this;
		var butObj = $("#modalAdaptiveTitleEdit .butOk");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var name = $(".valueAdaptiveElmName").val().trim();
			
			var elmId = elm.attr("data-hlp-id");
			obj.listElm[elmId]["name"] = name;

			Modal.delete();
			obj.saveChange("Изменение сохранено");
		});
	}


/******************************************************************************/	
	
	/**
	* Удаление 
	*
	* @see 	this.createModalEdit()
	*/
	this.setEventModalDelete = function(elm)
	{
		var obj = this;
		var butObj = $("#modalAdaptiveTitleEdit .butDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите удаление");
			obj.setEventButConfirmationDelete(elm);
		})
	}

	/**
	*  Удаление 
	*
	* @see 	this.setEventDelete()
	*/
	this.setEventButConfirmationDelete = function(elm)
	{
		var obj = this;
		var butObj = $('#confirmationDelete .butDelete');
		butObj.off('mousedown');
		butObj.on('mousedown', function() {
			var elmId = elm.attr("data-hlp-id");

			obj.deleteElm(elmId, elm);
		});
	}

	/**
	* Удаление элемента
	*
	* @see 	this.setEventButConfirmationDelete()
	* @see 	this.setProperty()
	*/
	this.deleteElm = function(elmId, elm, noNotification)
	{
		for (var valueId in this.listValue) {
			delete this.listValue[valueId][elmId];
		}

		delete this.listElm[elmId];
		if (elm) elm.removeAttr("data-hlp-adaptive-elm");

		var countAdpElm = $("*[data-hlp-adaptive-elm='true']").length
		if (!countAdpElm) this.listValue = {};

		this.setEvent();

		Modal.delete();

		var label = noNotification ? false : "Значение удалено";
		this.saveChange(label);
	}
/******************************************************************************/	
	
	/**
	* Сохранение изменений
	*
	* @see 	this.setEventModalAddSave()
	* @see 	this.setEventModalEditSave()
	* @see 	this.setEventButConfirmationDelete()
	*/
	this.saveChange = function(labelOk)
	{	
		var adaptiveTitle = {
			"list_elm" : this.listElm,
			"list_value" : this.listValue
		}

		var params = {
			"site_id": this.siteId,
			"adaptive_title": JSON.stringify(adaptiveTitle)
		};

		var url = "/"+ADMIN_FOLDER+"/page/saveAdaptiveTitle";
		$.post(url, params, function(res) {
			res = res.trim();

			if (!labelOk) return false;

			if (res) {
				Notification.ok(labelOk);
			} else {
				Notification.error();
			}
		});
	}

/******************************************************************************/	
	

} // end class
