var ElementSettingForm = new ElementSettingForm();
function ElementSettingForm() {

	this.attr = {};

	this.class = {};

/**********************************************************************************/

	/**
	* Установка значений для поля
	*
	*/
	this.setMGInput = function(elm)
	{
		// имя
		this.setInputName(elm);
		// подсказка
		this.setInputPlaceholder(elm);
		// обязательность
		this.setInputRequired(elm);
		// у textarea типа нет
		this.setInputType(elm);
		// динамическое поле
		this.setDynamic(elm);
	}

	// имя
	this.setInputName = function(elm)
	{
		var inputType = elm.attr("input-type");
		// var displayValue = inputType ? "none" : "block";
		var displayValue = "block";
		$(".settingFormName").css("display", displayValue);

		var name = elm.attr("name");

		var inputNameObj = $(".valueInputName");
		inputNameObj.val(name);

		/***********************************************************/
		if (elm.attr("data-mask")) inputNameObj.attr("only-eng", "true");
		else inputNameObj.removeAttr("only-eng");
		SpecialInput.setEventOnlyEng();
	}

	// подсказка
	this.setInputPlaceholder = function(elm)
	{
		var placeholder = elm.attr("placeholder");
		$(".valueInputPlaceholder").val(placeholder);
	}

	// тип
	this.setInputType = function(elm)
	{
		// маска
		var itemType = $(".menuStyleInputMask");
		if (!elm.hasClass("input")) {
			itemType.css("display", "none");
			return false;
		}
		itemType.css("display", "block");

		// ставим маску
		var inputMask = elm.attr("data-mask");
		if (!inputMask) inputMask = "none";
		Select.set($(".menuStyleInputMask"), inputMask);
		
		/*тип*****/
		var inputTypeV = elm.attr("type");
		this.setVisibleInputType(inputTypeV);
		$(".valueInputType .menuButValueText[value='"+inputTypeV+"']").attr("chosen", "true");
		$(".valueInputValue").val(elm.val());
	}

	// Обязательность
	this.setInputRequired = function(elm)
	{
		var noRequired = elm.attr("data-empty");
		var status = noRequired == "true" ? "no" : "yes";
		$(".valueInputRequired .menuButValue[value='"+status+"']").attr("chosen", "true");
	}


/***********************************************************************************************/
	// Установка формы
	this.setMGForm = function(elm)
	{
		// показываем и убираем блоки
		$(".settingSubmitText").css("display", "none");
		$(".settingFormName").css("display", "block");

		// ставим имя формы
		var inputNameObj = elm.find("input[name='hlp-form-name']")
		if (!inputNameObj.length) {
			elm.find("input[name='form-name']").attr("name", "hlp-form-name");
			inputNameObj = elm.find("input[name='hlp-form-name']");
		}

		var name = inputNameObj.val();
		$(".valueFormName").val(name);

		// устанавливаем параметры формы
		this.setFormProperty(elm);
	}

	// для submit
	this.setMGSubmit = function(elm)
	{
		// показываем и убираем блоки
		$(".settingFormName").css("display", "none");
		$(".settingSubmitText").css("display", "block");

		$(".valueSubmitText").val(elm.val());

		// устанавливаем параметры формы
		this.setFormProperty(elm);
	}


	/**
	* Устанавливает параметры формы
	*
	* @see 	this.setSubmit()
	* @see 	this.setForm()
	*/
	this.setFormProperty = function(elm)
	{
		var elmForm = elm.closest(".form");

		// перенаправление
		this.setFormRedirect(elm, elmForm);

		// action
		var formAction = elmForm.attr("action");
		$(".valueFormAction").val(formAction);
		this.setVisibleFormRedirect(formAction);

		// метод
		var method = elmForm.attr("method");
		$(".valueFormMethod .menuButValue[value='"+method+"']").attr("chosen", "true");
	}

	/**
	* Перенаправление
	*
	* @see 	this.setFormProperty()
	*/
	this.setFormRedirect = function(elm, elmForm)
	{
		// данные
		var redirect = elmForm.find("input[name='hlp-redirect']");
		if (!redirect.length) {
			elmForm.find("input[name='redirect']").attr("name", "hlp-redirect");
			redirect = elmForm.find("input[name='hlp-redirect']");
		}

		var redirectType = redirect.attr("redirect-type");
		if (!redirectType) redirectType = "link";

		// показываем блок
		this.showBlockRedirect(redirectType);

		// ставим данные
		var redirectValue = redirect.val();
		if (redirectType == "page" || redirectType == "modal") {
			var selectRedirectObj = redirectType == "page" ? $(".valueFormRedirect") : $(".valueFormRedirectModal");
			Select.set(selectRedirectObj, redirectValue);
		} else {
			$(".valueFormRedirect").val(redirectValue);
		}

		Select.set($(".valueTypeFormRedirect"), redirectType);
	}


	/**
	* Показать блок перенаправления
	*
	* @see 	this.setFormRedirect()
	* @see 	this.editRedirectType()
	*/
	this.showBlockRedirect = function(redirectType)
	{
		// показываем блоки 
		$(".settingFormRedirectItem").css("display", "none")
									.filter("[type='"+redirectType+"']")
									.css("display", "block")
									.attr("");
	}

/**************************************************************************************************/

	/**
	* Отображение панели redirect
	*
	* @see 	this.setFormProperty()
	* @see 	this.editFormAction()
	*/
	this.setVisibleFormRedirect = function(formAction)
	{
		var redirectDisplay = formAction ? "none" : "block"; 
		$(".settingFormRedirect").css("display", redirectDisplay);
	}

	/**
	* Отображение панели - тип input
	*
	* @see 	this.setInputType()
	* @see 	this.editInputTypeSelf()
	*/
	this.setVisibleInputType = function(typeValueV)
	{
		$(".settingFormInputTypeBlock").css("display", "none");

		var blockClassVisible = typeValueV == "hlp-hidden" ? "settingFormInputTypeHidden" : "settingFormInputTypeText";
		$("."+blockClassVisible).css("display", "block");
	}

/***********************************************************************************/
	
	this.setMGCheckbox = function(elm)
	{
		$(".valueInputName").val(elm.attr("name"));
		$(".valueInputValue").val(elm.val());
		
		this.setInputRequired(elm);

		// 
		var checkedStatus = elm.attr("checked") ? "yes" : "no";	
		StyleMenu.chosenToggleBut($(".valueCheckboxChecked"), checkedStatus);
	}

	this.setMGSelect = function(elm)
	{
		var name = elm.attr("name");
		$(".valueInputName").val(name);
		
		$(".settingFormInputTypeBlock").css("display", "block");

		// установка списка
		this.setListOptionProperty(elm);	
	}

	this.setMGUploadFile = function(elm)
	{
		// обязательность
		this.setInputRequired(elm);
	}
	
/************************************************************************************/

	/*
	* Установка списка
	*
	* @see 	this.setMGSelect()
	*/
	this.setListOptionProperty = function(elm)
	{
		
		var listOptionProperty = this.getListOptionProperty(elm);
		MenuListItem.addList("form-option", listOptionProperty);
	}

	/**
	* Открытие 
	* 
	*
	* @see 	MenuListItem.setEventEditBg()
	*/
	this.setOptionProperty = function(elmEvent)
	{
		$(".valueSettingFormOptionValue").val(elmEvent.attr("option-value"));
		$(".valueSettingFormOptionName").val(elmEvent.attr("option-name"));
	}

	/**
	* Удаление
	*
	*
	* @see 	MenuListItem.setEventDeleteBg()
	*/
	this.deleteOption = function(itemIndexV)
	{
		Element.obj.find("option").eq(itemIndexV).remove();
	}

	/**
	* Добавление нового элемента 
	*
	* @see 	MenuListItem.addNewItem()
	*/
	this.addNewOption = function()
	{
		var elm = Element.obj;
		
		var optionNameV = 'new option'; 
		var optionValueV = 'new';

		var optionBlock = '<option value="'+optionValueV+'">'+optionNameV+'</option>';
		elm.append(optionBlock);
		
		var newPropertyV = {
			"name" : optionNameV,
			"property" : {
				"option-value": optionValueV,
				"option-name": optionNameV,
			}
		}	

		return newPropertyV;
	}


	/**
	* Изменение значения
	*
	*
	*/
	this.editSelectOption = function(elm, value, elmEvent)
	{
		var optionIndex = MenuListItem.getItemIndex(elmEvent);
		var optionObj = elm.find("option").eq(optionIndex);

		// ставим элементу ноывй список
		var optionValueV = $(".valueSettingFormOptionValue").val();
		var optionNameV = $(".valueSettingFormOptionName").val();
		optionObj.val(optionValueV);
		optionObj.text(optionNameV);

		// обновляем список
		var listOptionProperty = this.getListOptionProperty(elm);
		MenuListItem.uploadListValue(listOptionProperty, elmEvent);
	}

	/**
	* Отдает список элментов
	*
	* @see 	this.setListOptionProperty()
	* @see 	this.addNewOption()
	*/
	this.getListOptionProperty = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listOptionProperty = []; 

		var listOption = elm.find("option");
		var countOption = listOption.length;
		for (var iOption = 0; iOption < countOption; iOption++) {
			var optionObj = listOption.eq(iOption);

			var optionValueV = optionObj.val();
			var optionNameV = optionObj.text();

			listOptionProperty[iOption] = {
				"name" : optionNameV,
				"property" : {
					"option-value": optionValueV,
					"option-name": optionNameV,
				}
			}	
		}

		return listOptionProperty;
	}


/***********************************************************************************************/
/***********************************************************************************************/
	this.editInputTypeSelf = function(elm, value)
	{
		elm.attr("type", value);

		if (value == "hlp-hidden") {
			elm.removeAttr("data-mask")
				.removeAttr("input-type")
				.removeAttr("placeholder");
			$(".valueInputPlaceholder").val('');
			// Select.set($(".menuStyleInputMask .selectBlockButton"), "none");
		} else {
			elm.removeAttr("value");
		}

		// панель
		this.setVisibleInputType(value);
		// имя в структуре
		PageStruct.setStructItemNameInput(elm);
	}

	this.editInputValue = function(elm, value)
	{
		elm.val(value).attr("value", value);
	}	

	// имя 
	this.editInputName = function(elm, value, elmEvent)
	{
		var elmForm = elm.closest(".form");
		var listInput = elmForm.find(".input").not(elm);
		var isExistsName = listInput.filter("[name='"+value+"']").length;
		var isMaskV = elm.attr("data-mask");

		if (value && isMaskV) value = value.replace(/\s/gim, "_");

		// если не существует имя
		if (!isExistsName) {
			elm.attr("name", value);
			elmEvent.val(value);
		} else { // существует имя
			var oldValue = elm.attr("name");
			var inputName = $(".valueInputName");
			$(".valueInputName").val(oldValue);
			
			Notification.error(Resource.hlp_setting_input_notification_name_exists, "left");
		}

		if (elm.attr("type") == "hlp-hidden") {
			// имя в структуре
			PageStruct.setStructItemNameInput(elm);
		}
	}

	// подсказка 
	this.editInputPlaceholder = function(elm, value)
	{
		elm.attr("placeholder", value);
	}

	// тип
	this.listInputType = {
		"none":["new", Resource.hlp_setting_input_name_new],
		"name":["name", "Имя"],
		"email":["email", Resource.hlp_setting_input_name_email],
		"phone":["phone", Resource.hlp_setting_input_name_phone],
		"addr":["addr", "Адрес"]
	} 
	this.editInputType = function(elm, value)
	{
		var property = this.listInputType[value]; 

		// type
		if (value == "none") {
			elm.removeAttr("input-type").removeAttr("data-mask");
		} else {
			elm.attr("input-type", value).attr("data-mask", value);
		}

		// name
		var name = property[0];
		elm.attr("name", name);
		$(".valueInputName").val(name);


		// ставим или убираем блок с именем 
		this.setInputName(elm);

		// placeholder
		var placeholder = property[1];
		elm.attr("placeholder", placeholder);
		$(".valueInputPlaceholder").val(placeholder);
	}

	// маска
	this.editInputMask = function(elm, value)
	{
		if (value == "none") elm.removeAttr("data-mask");
		else elm.attr("data-mask", value);
	}

	// обязательность
	this.editInputRequired = function(elm, value)
	{
		if (value == "no") elm.attr("data-empty", "true");
		else  elm.removeAttr("data-empty");
	}

	this.editCheckboxChecked = function(elm, value)
	{
		if (value == "yes") elm.attr("checked", "checked");
		else elm.removeAttr("checked");

		// что бы изменился checked
		Element.reload(elm);
	}
/*********************************************************************************************/
	// кнопка
	this.editSubmitText = function(elm, value)
	{
		elm.val(value);
	}

	// имя формы
	this.editFormName = function(elm, value)
	{
		var elmForm = elm.closest(".form");
		elmForm.find("input[name='hlp-form-name']").val(value);
	}

/****параметры формы******************************************************************************************/
	// изменение типа перенаправления
	this.editRedirectType = function(elm, value)
	{
		// показываем блок
		this.showBlockRedirect(value);
		// ставим значение
		if (value == "page") {
			var redirectValue = "none";
			Select.set($(".valuePageFormRedirect"), redirectValue);
		} else {
			var redirectValue = "";
			$(".valueFormRedirect").val(redirectValue);
		}

		// ставим тип
		var redirect = elm.closest(".form").find("input[name='hlp-redirect']");
		redirect.attr("redirect-type", value);
		redirect.val(redirectValue);

		// ставим значения в меню
		this.setMGForm(elm);
	}

	// перенаправление link
	this.editFormRedirectLink = function(elm, value, elmEvent)
	{
		this.editFormRedirect(elm, value, elmEvent);
	}

	// перенаправление link
	this.editFormRedirectElm = function(elm, value, elmEvent)
	{
		Select.set($(".valuePageFormRedirect"), value);
		this.editFormRedirect(elm, value, elmEvent);
	}

	// перенаправление
	this.editFormRedirect = function(elm, hrefValue, elmEvent)
	{
		// if (value) value = value.replace(/\s/gim, "_");
		// elmEvent.val(value);

		var elmForm = elm.closest(".form");
		elmForm.find("input[name='hlp-redirect']").val(hrefValue);
	}

	/*********************/
	// action формы
	this.editFormAction = function(elm, value, elmEvent)
	{
		if (value) value = value.replace(/\s/gim, "_");
		else value = '';
		elmEvent.val(value);

		elm.closest(".form").attr("action", value);
		
		this.setVisibleFormRedirect(value);
	}

	// метод формы
	this.editFormMethod = function(elm, value)
	{
		elm.closest(".form").attr("method", value);
	}

/*************************************************************************************************/
	// динамическое поле
	this.setDynamic = function(elm)
	{
		var attrStatus = this.getAttrDynamicStatus();
		var statusV = elm.attr(attrStatus);
		if (!statusV) statusV = "no";

		// статус
		StyleMenu.chosenToggleBut($(".valueInputDynamicStatus"), statusV);
		// имя
		var attrName = this.getAttrDynamicName();
		var valueName = elm.attr(attrName);
		$(".valueInputDynamicName").val(valueName);
	}

	// изменение статуса
	this.editInputDynamicStatus = function(elm, value)
	{
		var attrStatus = this.getAttrDynamicStatus();
		if (value == "yes") elm.attr(attrStatus, value);
		else elm.removeAttr(attrStatus);

		// установка id
		var attrId = this.getAttrDynamicId();
		if (!elm.attr(attrId)) {
			elm.attr(attrId, "id"+Date.now());
		}
	}

	// изменить имя
	this.editInputDynamicName = function(elm, value)
	{
		var attrName = this.getAttrDynamicName();
		elm.attr(attrName, value);
	}

	/**
	* Атрибут - статус
	* 
	* @see 	this.
	*/
	this.getAttrDynamicStatus = function()
	{
		return "data-hlp-dynamic-input-status";	
	}

	/**
	* Атрибут - id
	* 
	* @see 	this.
	*/
	this.getAttrDynamicId = function()
	{
		return "data-hlp-dynamic-input-id";	
	}

	/**
	* Атрибут - имя
	* 
	* @see 	this.
	*/
	this.getAttrDynamicName = function()
	{
		return "data-hlp-dynamic-input-name";	
	}

	/**
	* Отдает список
	*
	* @see 	ElementsettingClick.setTabsDynamicValue()
	*/
	this.getListDynamicValue = function()
	{
		var attrName = this.getAttrDynamicName();
		var attrId = this.getAttrDynamicId();

		var listValue = {};
		var listInput = $(".input["+attrId+"]");
		var countInput = listInput.length;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputV = listInput.eq(iInput);
			var valueId = inputV.attr(attrId);
			var valueName = inputV.attr(attrName);

			listValue[valueId] = valueName;
		}

		return listValue;
	}

/*************************************************************************************************/
/**************************************************************************************************/

}//end class
