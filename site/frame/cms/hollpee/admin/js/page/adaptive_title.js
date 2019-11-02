$(document).ready(function() {
	PageDetailAdptiveTitle.init();
});

var Element = new Element();
function Element() {
	this.obj = false;
}

var Site = new Site();
function Site() {
	this.siteId = false;
}

var PageDetailAdptiveTitle = new PageDetailAdptiveTitle();
function PageDetailAdptiveTitle() {
	this.listElm = {};
	this.listValue = {};
	this.urlPage = {};
	this.fullUrl = false;

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	}

	this.setProperty = function()
	{
		Site.siteId = PageDetailMain.siteInfo['site_id'];

		this.setPropertyVariable();
		this.setPropetyInPage();
	}

	/**
	* Устанавливает переменные
	* 
	* @see 	this.setProperty()
	*/
	this.setPropertyVariable = function()
	{
		var propertyJson = $("#adaptiveTitleJson").html().trim();
		if (propertyJson) {
			var property = JSON.parse(propertyJson);
			this.listElm = property['list_elm'];
			this.listValue = property['list_value'];
		}
	}

	/**
	* Устанавливает значение на странице
	* 
	* @see 	this.setProperty()
	* @see 	this.setEventModalAddSave()
	*/
	this.setPropetyInPage = function()
	{
		var blockContent = '';
		var blockHead = false;

		var urlNoSrc = location.hostname;
		urlNoSrc += this.fullUrl.replace(/index\.php$/gim, '');

		for (var valueId in this.listValue) {
			var valueItem = this.listValue[valueId];

			var listCell = '';
			var blockHeadRow = '';
			var countElm = 0;
			for (var elmId in this.listElm) {
				// заголовок
				var elmProperty = this.listElm[elmId];
				var elmName = elmProperty["name"];
				var elmType = elmProperty["type"];
				blockHeadRow += '<div class="tableCell" data-type="elm"><span>'+elmName+'</span></div>';

				// значение
				var elmIdValue = elmId;
				if (elmType == "image") elmIdValue += "-img";
				var elmValue = valueItem[elmIdValue];
				if (!elmValue) elmValue = '';
				
				// контент
				if (elmType == "image") {
					if (elmValue) elmValue = "../" + elmValue;
					var cellContent = '<img src="'+elmValue+'" class="adaptiveElmImage" alt="" />';
				} else {
					var cellContent = '<span>'+elmValue+'</span>';
				}
				
				listCell += '<div class="tableCell tableCellBut" data-elm-id="'+elmId+'" data-elm-type="'+elmType+'" data-type="elm">'+cellContent+'</div>';
				countElm++;
			}

			blockHead = blockHeadRow;
			
			var urlPage = urlNoSrc + "?utm_source=" + valueId;
			var row = '\
				<div class="tableRow" data-value-id="'+valueId+'" data-count-elm="'+countElm+'">\
					<a target="_blank" href="http://'+urlPage+'" class="tableCell valueDymTtlLink" data-type="url"><span>utm_source='+valueId+'</span></a>\
					'+listCell+'\
					<div class="tableCell" data-type="button"><div class="butDeleteAdaptiveTitle">Удалить</div></div>\
					<div class="clear"></div>\
				</div>\
			';

			blockContent += row;
		}

		for (var elmId in this.listElm) break;
		if (!elmId) {
			$(".tableAdaptiveTitle, .butAddAdaptiveTitleValue").css("display", "none");
			return false;
		}

		var parentObj = $(".tableAdaptiveTitle");
		parentObj.find(".tableContent").html(blockContent);
		parentObj.find(".tableCellListElmH").html(blockHead);
		parentObj.find(".tableRowH").attr("data-count-elm", countElm);

		this.setEventList();
	} 

/******************************************************************************/
/******************************************************************************/

	this.setEvent = function()
	{
		this.setEventAddValue();
	}

	/**
	* События для списка
	*
	* @see 	this.setPropetyInPage()
	*/
	this.setEventList = function()
	{
		this.setEventDeleteValue();
		this.setEventEditValue();
	}

/******************************************************************************/
	
	/**
	* Добавление значение
	*
	* @see 	this.setEvent()
	*/
	this.setEventAddValue = function()
	{
		var obj = this;
		var butObj = $(".butAddAdaptiveTitleValue");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {

			obj.createModalAddValue();
		});
		
	}

	/**
	* Создает модальное - изменить значение
	*
	* @see 	this.setEventAddValue()
	*/
	this.createModalAddValue = function()
	{
		var content = this.getModalContentAddValue();

		Modal.create({
			"id" : "modalAdaptiveTitleAddValue",
			"title" : "Добавление нового значения",
			"width" : 650,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Добавить"]
			]
		});

		this.setEventModalAddSave();
	}

	/**
	* Отдает контент модального
	*
	* @see 	this.createModalAddValue()
	*/
	this.getModalContentAddValue = function()
	{
		var listPropertyBlock = '';

		listPropertyBlock += '\
				<div class="modalAdaptiveTitleAddPropertyItem">\
					<div class="modalAdaptiveTitleAddPropertyName">UTM метка (utm_source)</div>\
					<input class="modalAdaptiveTitleAddPropertyValue valueAddTitleUtmSource"/>\
					<div class="clear"></div>\
				</div>\
			';

		for (var elmId in this.listElm) {
			var elmProperty = this.listElm[elmId];
			var elmName = elmProperty["name"];
			var elmType = elmProperty["type"];

			if (elmType == "image") {
				var blockValue = 'по умолчанию';
			} else {
				var blockValue = '<textarea class="modalAdaptiveTitleAddPropertyValue"></textarea>';
			}
			
			listPropertyBlock += '\
				<div class="modalAdaptiveTitleAddPropertyItem" data-elm-id="'+elmId+'">\
					<div class="modalAdaptiveTitleAddPropertyName">'+elmName+'</div>\
					'+blockValue+'\
					<div class="clear"></div>\
				</div>\
			';
		}
		

		var content = '\
			<div class="modalAdaptiveTitleAddLabel">Введите значения</div>\
			<div class="modalAdaptiveTitleAddListItem">'+listPropertyBlock+'</div>\
		';

		return content;
	}

	/**
	* Сохранение изменения
	*
	* @see 	this.createModalAddValue()
	*/
	this.setEventModalAddSave = function()
	{
		var obj = this;
		var butObj = $("#modalAdaptiveTitleAddValue .butOk");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var newValue = $(".valueAdaptiveTitleEdit").val();
			if (newValue) newValue = newValue.trim();

			var newId = obj.getNewValueId();
			var newValue = obj.getNewValue();
			obj.listValue[newId] = newValue;

			obj.setPropetyInPage();
			Modal.delete();
			obj.saveChange("Новое значение сохранено");
		});
	}

	/**
	* Отдает новый id значения
	*
	* @see 	this.setEventModalAddSave()
	*/
	this.getNewValueId = function()
	{
		// var newId = 0;
		// for (var valueId in this.listValue) {
		// 	if (newId < valueId) newId = valueId;
		// }
		// newId++;
		// return newId;

		return $(".valueAddTitleUtmSource").val().trim();
	}

	/**
	* Отдает новое значение
	*
	* @see 	this.setEventModalAddSave()
	*/
	this.getNewValue = function()
	{
		var newValue = {};

		var listItemObj = $("#modalAdaptiveTitleAddValue .modalAdaptiveTitleAddPropertyItem");
		var countItem = listItemObj.length;

		for (var iItem = 0; iItem < countItem; iItem++) {
			var itemObj = listItemObj.eq(iItem);
			var elmId = itemObj.attr("data-elm-id");
			if (!elmId) continue;

			var elmValue = itemObj.find(".modalAdaptiveTitleAddPropertyValue").val();
			if (elmValue) elmValue = elmValue.trim();

			newValue[elmId] = elmValue;
		}

		return newValue;
	}

/******************************************************************************/
	
	/**
	* Удаление значений
	*
	* @see 	this.setEvent()
	*/
	this.setEventDeleteValue = function()
	{
		var obj = this;
		var butObj = $(".tableAdaptiveTitle .butDeleteAdaptiveTitle");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var itemObj = $(this).closest(".tableRow");
			var valueId = itemObj.attr("data-value-id");

			Modal.confirmationDelete("Подтвердите удаление");
			obj.setEventButConfirmationDelete(itemObj, valueId);
		})
	}

	/**
	*  Удаление 
	*
	* @see 	this.setEventDelete()
	*/
	this.setEventButConfirmationDelete = function(itemObj, valueId)
	{
		var obj = this;
		var butObj = $('#confirmationDelete .butDelete');
		butObj.off('mousedown');
		butObj.on('mousedown', function() {
			delete obj.listValue[valueId];
			itemObj.remove();

			Modal.delete();
			obj.saveChange("Значение удалено");
		});
	}

/******************************************************************************/

	/**
	* Изменение значение
	*
	* @see 	this.setEvent()
	*/
	this.setEventEditValue = function()
	{
		var obj = this;
		var butObj = $(".tableAdaptiveTitle .tableCellBut");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var cellObj = $(this).closest(".tableCell");
			var elmType = cellObj.attr("data-elm-type");

			obj.currentValueId = $(this).closest(".tableRow").attr("data-value-id");
			obj.currentElmId = cellObj.attr("data-elm-id");
			obj.currentElmType = elmType;
			obj.currentCell = $(this);

			if (elmType == "image") {
				var imgSrc = obj.listValue[obj.currentValueId][obj.currentElmId];
				if (imgSrc) imgSrc = imgSrc.replace(/^https?:\/\/[^\/]+/gim, '');

				Element.obj = cellObj.find(".adaptiveElmImage");
				ManagerFile.edit("images", imgSrc, true, function(src) {
					Element.obj.attr("src", src);
					src = src.replace(/^\.\.\//gim, '');
					obj.listValue[obj.currentValueId][obj.currentElmId+"-img"] = src;
					obj.saveChange("Изображение изменено");					
				});
			} else {
				obj.createModalEditValueText();
			}
		});
	}

	this.saveModalEditValueImage = function(newValue)
	{
		this.listValue[this.currentValueId][this.currentElmId] = newValue;
		this.currentCell.find(".adaptiveElmImage").attr("src", newValue);

		Modal.delete();
		this.saveChange("Изменение сохранено");
	}
/*********************************************************************************/

	/**
	* Создает модальное - изменить значение
	*
	* @see 	this.setEventEditValue()
	*/
	this.createModalEditValueText = function()
	{
		var content = this.getModalContentEditValue();

		Modal.create({
			"id" : "modalAdaptiveTitleEditValue",
			"title" : "Изменение значения",
			"width" : 550,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Сохранить"]
			]
		});

		this.setEventModalEditSave();
	}

	/**
	* Отдает контент модального
	*
	* @see 	this.createModalEditValue()
	*/
	this.getModalContentEditValue = function()
	{
		var value = this.listValue[this.currentValueId][this.currentElmId];
		if (!value) value = '';

		var content = '<textarea class="valueAdaptiveTitleEdit">'+value+'</textarea>';

		return content;
	}

	/**
	* Сохранение изменения
	*
	* @see 	this.createModalEditValue()
	*/
	this.setEventModalEditSave = function()
	{
		var obj = this;
		var butObj = $("#modalAdaptiveTitleEditValue .butOk");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var newValue = $(".valueAdaptiveTitleEdit").val();
			if (newValue) newValue = newValue.trim();

			obj.listValue[obj.currentValueId][obj.currentElmId] = newValue;
			obj.currentCell.find("> span").html(newValue);

			Modal.delete();

			obj.saveChange("Изменение сохранено");
		});
	}

/******************************************************************************/
	
	/**
	* Сохранение изменений
	*
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
		
		$.post("page/saveAdaptiveTitle", params, function(res) {
			res = res.trim();
			
			if (res) {
				Notification.ok(labelOk);
			} else {
				Notification.error();
			}
		});
	}

} // end class
