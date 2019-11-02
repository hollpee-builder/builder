/**
* Модальное меню
*
*
*
*/
var MenuListItem = new MenuListItem();
function MenuListItem() {

	/**
	* Установка событий
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventAdd();
		this.setEventCloseModal()
	}

	/**
	* Добавление значения
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		$(".butAddBg").off("mousedown");
		$(".butAddBg").on("mousedown", function() {
			var typeV = obj.getType($(this));
			obj.addNewItem(typeV);
		});
	}

	/**
	* Добавление пункта
	*
	* @see 	this.setEventAdd()
	*/
	this.addNewItem = function(typeV)
	{
		var parentListObjV = this.getParentList(typeV);
		
		if (typeV == "attr" || typeV == "class") {
			var newPropertyV = ElementSettingGeneral.addNewAttr(typeV);
		} else if (typeV == "form-option") {
			var newPropertyV = ElementSettingForm.addNewOption();
		} else if (typeV == "transform") {
			var newPropertyV = StyleMenuTransform.addNewValue();
		} else {
			return false;
		}

		// добавляем на страницу
		this.addItem(parentListObjV, newPropertyV); 

		// показываем модальное
		var listItemObj = parentListObjV.find(".menuBgItem");
		newBgObj = listItemObj.last();
		newBgObj.mousedown().mouseup();

		// убираем блок none
		this.butNoneHide(typeV);

		History.record();
	}


	this.getObj = function(typeV)
	{
		if (typeV == "attr" || typeV == "class") {
			var objV = ElementSettingGeneral;
		} else if (typeV == "form-option") {
			var objV = ElementSettingForm;
		} else if (typeV == "transform") {
			var objV = StyleMenuTransform;
		} else {
			return false;
		}

		return objV;
	}

	this.edit = function(elm, elmEvent, typeV)
	{
		var objV = this.getObj(typeV);
		if (!objV) return false;

		var listOptionProperty = objV.getListProperty(elm);
		var propIndex = this.getItemIndex(elmEvent);
		// listOptionProperty = objV.editItemFromList(listOptionProperty, propIndex);
		if (!listOptionProperty[propIndex]) {
			listOptionProperty[propIndex] = {"name":"", "property":{}}
		}

		this.uploadListValue(listOptionProperty, elmEvent);
		this.addList(typeV, listOptionProperty);

		return listOptionProperty;
	}



	/**
	* Отдает тип списка 
	*
	* @see 	this.setEventAdd()
	*/
	this.getType = function(elmEvent)
	{
		return elmEvent.closest(".menuListBgBlock, .menuStyleModal").attr("data-type")
	}

	/**
	* Отдает родителя списка
	*
	* @see 	this.addList()
	* @see 	this.setEventAdd()
	*/
	this.getParentList = function(typeV)
	{
		return $(".menuListBgBlock[data-type='"+typeV+"'] .menuListBg");
	}

	/**
	* Отдает родитель
	*
	* @see 	this.setEventAdd()
	*/
	this.getParent = function(typeV)
	{
		return $(".menuListBgBlock[data-type='"+typeV+"']");
	}

	/**
	* Отдает список элементов
	*
	* @see 	StyleMenuBg.
	* @see 	.
	*/
	this.getListItem = function(typeV)
	{
		var parentListObj = this.getParentList(typeV);
		return parentListObj.find(".menuBgItem");
	}

	/**
	* Отдает список элементов
	*
	* @see 	this.addItem()
	*/
	this.getListItemByParent = function(parentListObj)
	{
		return parentListObj.find(".menuBgItem");
	}

	/**
	*
	*
	* @see 	ElementSettingForm.editSelectOption()
	*/
	this.getItemIndex = function(elmEvent)
	{
		return elmEvent.closest(".menuStyleModal, .menuBgItem").attr("data-hlp-index");
	}

	/**
	* Отдает имя пункта
	*
	* @see 	this.setEventDelete
	*/
	this.getItemName = function(elmEvent)
	{
		return elmEvent.closest(".menuBgItem").find(".bgItemName").text().trim();
	}

	/****************/	

	this.butNoneHide = function(typeV)
	{
		this.butNoneVisible(typeV, "none");
	}

	this.butNoneShow = function(typeV)
	{
		this.butNoneVisible(typeV, "block");
	}

	this.butNoneVisible = function(typeV, visibleValue)
	{
		var parentObjV = this.getParent(typeV);
		parentObjV.find(".menuBgItemNone").css("display", visibleValue);
	}

/**********************************************************************************/

	/**
	* Закрытие модального
	*
	* @see 	this.setEvent()
	*/
	this.setEventCloseModal = function()
	{
		var obj = this;
		var butClose = $(".menuStyleBlackout, .menuStyleModalExit");
		butClose.off("mousedown");
		butClose.on("mousedown", function() {
			obj.hideModal();
		});
	}

/*******************************************************************************/

	/**
	* Добавление списка элементов
	*
	* @see 	StyleMenuBg.addListBgBlock()
	*/
	this.addList = function(typeV, listValue)
	{
		var parentListObj = this.getParentList(typeV);
		parentListObj.html('');

		for (var iItem in listValue) {
			var itemValue = listValue[iItem];
			if (!itemValue) continue;

			this.addItem(parentListObj, itemValue, iItem);
		}

		var parentObj = this.getParent(typeV);
		var visibleNone = iItem ? "none" : "block"; 
		parentObj.find(".menuBgItemNone").css("display", visibleNone);
	}

	/**
	* Одает один блок
	*
	* @see 	this.addList()
	* @see 	StyleMenuBg.setEventAddImage() 
	*/
	this.addItem = function(parentObj, itemValue, iItem)
	{
		if (!iItem) {
			var listItemV = this.getListItemByParent(parentObj);
			iItem = listItemV.length
		}

		var block = this.getBlockItem(itemValue, iItem);
		parentObj.append(block);

		// ставим события
		this.setEventListBg();
	}

	/**
	* Отдает блок элемента bg
	*
	* @see 	this.addBgBlock()
	* @see 	this.setEventMoveBg()
	*/
	this.getBlockItem = function(itemValue, iItem) 
	{
		var listPropety = itemValue["property"];
		var propertyAttr = '';
		for (var keyProperty in listPropety) {
			propertyAttr += keyProperty+'="'+listPropety[keyProperty]+'" '
		}

		var block = '\
			<div class="menuBgItem" data-hlp-index="'+iItem+'" '+propertyAttr+'>\
				<div class="bgItemButTop"></div>\
				<div class="bgItemName">'+itemValue["name"]+'</div>\
				<div class="bgItemButDelete"></div>\
			</div>';

		return block;
	}

/************************************************************************************/
	
	/**
	* Показывает модальное
	*
	*
	* @see 	StyleMenuBg.showModal()
	*/
	this.showModal = function(modalType, elmEvent)
	{
		var modalObjV = $(".menuStyleModal[data-type='"+modalType+"']");
		modalObjV.css("display", "block").attr("data-hlp-index", elmEvent.attr("data-hlp-index"));

		//показываем ставим событие 
		$(".menuStyleBlackout").css("display", "block");
	}

	/**
	* Убирает модальное
	*
	* @see 	StyleMenuBg.setEventCloseModal()
	* @see 	StyleMenuBg.addListBgBlock()
	* @see 	Editor.resetFocus()
	* @see 	EditorController.setEventEditScreen()
	*/
	this.hideModal = function()
	{
		$(".menuStyleModal *").removeAttr("chosen", "true");
		$(".menuStyleBlackout, .menuStyleModal").css("display", "none");
	}

/************************************************************************************/
	
	/**
	* Ставит события
	*
	* @see 	this.addListBgBlock()
	* @see 	this.setEventAddImage()
	* @see 	this.setEventMoveBg()
	*/
	this.setEventListBg = function()
	{
		// изменение
		this.setEventEditBg();
		// поднять на вверх
		this.setEventMoveBg();
		// удаление
		this.setEventDeleteBg();
	}


	/**
	* Изменение
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventEditBg = function()
	{
		var obj = this;
		$(".menuBgItem").off("mousedown");
		$(".menuBgItem").on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = obj.getType(elmEvent);
			obj.showModal(typeV, elmEvent);
			var iItemV = obj.getItemIndex(elmEvent);

			if (typeV == "attr") {
				ElementSettingGeneral.setAttrItem(elmEvent);
			} else if (typeV == "class") {
				ElementSettingGeneral.setAttrClass(elmEvent);
			} else if (typeV == "form-option") {
				ElementSettingForm.setOptionProperty(elmEvent);
			} else if (typeV == "transform") {
				StyleMenuTransform.setOptionProperty(elmEvent);
			} else {
				return false;
			}
		});
	}

	/**
	* Изменение значения в массиве
	*
	* @see 	ElementSettingGeneral.editElmAttr()
	* @see 	ElementSettingForm.editSelectOption()
	*/
	this.uploadListValue = function(listAttrV, elmEvent)
	{
		var modalObjV = elmEvent.closest(".menuStyleModal");
		var indexValue = modalObjV.attr("data-hlp-index");
		var typeV = modalObjV.attr("data-type");
		var nameAttrV = modalObjV.attr("data-item-name");

		var listItemBlockObjV = $(".menuListBgBlock[data-type='"+typeV+"'] .menuListBg");
		var listItemV = listItemBlockObjV.find("> .menuBgItem");
		var curItemV = listItemV.filter("[data-hlp-index='"+indexValue+"']");

		var listInputObj = modalObjV.find("*[data-list-attr]");
		var countInput = listInputObj.length;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputObjV = listInputObj.eq(iInput);

			// если параметр скрыт
			var isPropertyNoneV = inputObjV.closest(".menuStyleItem").css("display") == "none";
			if (isPropertyNoneV) continue;

			var inputAttrV = inputObjV.attr("data-list-attr");
			var inputValueV = inputObjV.val();

			curItemV.attr(inputAttrV, inputValueV);
			listAttrV[indexValue]["property"][inputAttrV] = inputValueV;

			if (inputAttrV == nameAttrV) {
				listAttrV[indexValue]["name"] = inputValueV;
				curItemV.find(".bgItemName").text(inputValueV);
			}
		}

		return listAttrV;
	}

/*********************************************************************************/
	/**
	* Удалить
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventDeleteBg = function()
	{
		var obj = this;
		$(".bgItemButDelete").off("mousedown");
		$(".bgItemButDelete").on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = obj.getType(elmEvent);

			if (typeV == "class" || typeV == "attr") {
				var itemNameV = obj.getItemName(elmEvent);
				var deleteLabelV = "Подтвердите удаление <b>"+itemNameV+"</b>";
				Modal.confirmationDelete(deleteLabelV, function() {
					obj.deleteItem(elmEvent);
				});
			} else {
				obj.deleteItem(elmEvent);
			}

			return false;
		});
	}

	/**
	* Удаляет элемент
	* 
	* @see 	this.setEventDeleteBg()
	*/
	this.deleteItem = function(elmEvent)
	{
		var obj = this;
		var typeV = obj.getType(elmEvent);
		var itemIndexV = obj.getItemIndex(elmEvent);

		if (typeV == "attr" || typeV == "class") {
			ElementSettingGeneral.deleteAttr(itemIndexV, typeV);
		} else if (typeV == "form-option") {
			ElementSettingForm.deleteOption(itemIndexV);
		} else if (typeV == "transform") {
			StyleMenuTransform.deleteProp(itemIndexV);
		} else {
			return false;
		}

		elmEvent.closest(".menuBgItem").remove();

		// ставим новые индексы
		var listItemV = obj.getListItem(typeV);
		var countItemV = listItemV.length;
		for (var iItem = 0; iItem < countItemV; iItem++) {
			listItemV.eq(iItem).attr("data-hlp-index", iItem);
		}

		if (!listItemV.length) {
			obj.butNoneShow(typeV);
		}

		History.record();
	}


/**********************************************************************************/
	/**
	* Поднять
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventMoveBg = function()
	{
		var obj = this;
		$(".bgItemButTop").off("mousedown");
		$(".bgItemButTop").on("mousedown", function() {
			var elmEvent = $(this);
			
			StyleMenuBg.moveBgItem(elmEvent);

			obj.setEventListBg();

			return false;
		});
	}
	

} // end class
