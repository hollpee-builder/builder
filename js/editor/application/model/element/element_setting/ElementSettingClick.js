var ElementSettingClick = new ElementSettingClick();
function ElementSettingClick() {
	this.attr = {};
	this.attr.modal_formname = "data-hlp-formname";

	this.getAttrModalFormName = function()
	{
		return this.attr.modal_formname;
	}	

/*********************************************************************************/

	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		// показываем блок с параметрами
		var type = elm.attr("data-action");
		if (!type) type = "none"; 
		this.showBlockAction(type);

		var actionName = '';
		var actionValue = elm.attr("data-value");
		if (type == "page") this.setPage(elm, actionValue);
		else if (type == "section") this.setSection(elm, actionValue);	
		else if (type == "modal") this.setModal(elm, actionValue);
		else if (type == "link") this.setLink(elm, actionValue);	
		else if (type == "close_modal") this.setCloseModal(elm, actionValue);	
		else if (type == "slider") this.setSlider(elm, actionValue);
		else if (type == "tabs") this.setTabs(elm, actionValue);
		else if (type == "contact") this.setContact(elm, actionValue);
		else if (type == "download") this.setDownload(elm, actionValue);


		var elmSelectV = $(".valueTypeActionClick");

		Select.set(elmSelectV, type);

		// // for link, page
		// var butLinkV = elmSelectV.find(".option[value='link'], .option[value='page'], .option[value='download'], .option[value='contact']");
		// var butLinkVisible = elm.hasClass("button") || elm.hasClass("block") ? "block" : "none";
		// butLinkV.css("display", butLinkVisible);
	}
/************************************************************************************************/
	/**
	* Устанавливает страницу
 	*
 	* @see 	this.set()
	*/
	this.setPage = function(elm, value)
	{
		// ставит имя
		Select.set($(".valuePage"), value);
		// ставит target
		this.setTarget(elm);
	}
/******************************************************************************************/
	// ставим секцию
	this.setSection = function(elm, value)
	{
		this.setListSection();
		Select.set($(".valueSection"), value);
	}


	/**
	* Ставит список секций в меню
	* 
	* @see 	this.setSection()
	* @see 	this.editActionType()
	*/
	this.setListSection = function()
	{
		var listOption = '<div class="option" value="none">Нет</div>';
		var listSection = $('.content').find(".section");
		var countSection = listSection.length;
		
		for (var iSection = 0; iSection < countSection; iSection++) {
			var sectionObj = listSection.eq(iSection);
			var sectionName = Element.getCurrentClass(sectionObj);
			var sectionNum = sectionObj.attr("data-num");

			listOption += '<div class="option" value="'+sectionNum+'">'+sectionName+'</div>'
		}

		$(".valueSection .optionBlock").html(listOption);
	}
/************************************************************************************************/
	/**
	* Устанавливает модальное
 	*
 	* @see 	this.set()
	*/
	this.setModal = function(elm, value)
	{
		Select.set($(".valueModal"), value);
		// ставим имя
		ManagerModal.setCurrentName();
		// имя формы
		var formNameV = elm.attr(this.getAttrModalFormName());
		$(".valueSettingClickModalFormname").val(formNameV);
	}

	/**
	* Устанавливает закрыть модальное
 	*
 	* @see 	this.set()
	*/
	this.setCloseModal = function(elm, value)
	{
		// Select.set($(".valueCloseModal"), value);
	}
/************************************************************************************************/
	/**
	* Устанавливает ссылку
 	*
 	* @see 	this.set()
	*/
	this.setLink = function(elm)
	{
		// url
		$(".valueLink").val(elm.attr("href"));

		this.setTarget(elm);
	}

/********************************************************************************************/
	/**
	* Ставит target
	*
	* @see 	this.setLink()
	* @see 	this.setPage()
	*/
	this.setTarget = function(elm)
	{
		var valueTarget = elm.attr("target");
		if (valueTarget != "_blank") valueTarget = "_self";

		Select.set($(".valueLinkOpen"), valueTarget);
	}

/******************************************************************************************/
		
	this.setSlider = function(elm, value)
	{
		Select.set($("."+ElementWidgetSlider.class.select_chosen), value);
	}	

	this.setTabs = function(elm, value)
	{
		ElementWidgetTabs.setSelectBut(elm);
		Select.set($("."+ElementWidgetTabs.class.select_chosen), value);

		// 
		var attrEventV = this.getAttrTabsButEvent();
		var hlpEventV = elm.attr(attrEventV);
		if (!hlpEventV) hlpEventV = "hlp_click";
		Select.set($(".selectTabsEvent"), hlpEventV);

		// dynamic
		this.setTabsDynamicValue(elm);
	}

	this.editTabsEvent = function(elm, value)
	{
		var attrEventV = this.getAttrTabsButEvent();
		if (value == "hlp_click") elm.removeAttr(attrEventV);
		else elm.attr(attrEventV, value);
	}

	this.getAttrTabsButEvent = function()
	{
		return "data-hlp-tabs-but-event";
	}

	/** dynamic ******************************/
	this.setTabsDynamicValue = function(elm)
	{
		// ставим стисок id
		this.addDynamicSelectValue();
		
		// устанавливаем id
		var selectIdObj = $("."+this.getClassButtonDynamicId());
		var valueId = elm.attr(this.getAttrButtonDynamicId());
		if (!valueId) valueId = "none";
		Select.set(selectIdObj, valueId);

		// устанавливаем имя
		var valueValue = elm.attr(this.getAttrButtonDynamicValue());
		var classValueV = this.getClassButtonDynamicValue();
		$("."+classValueV).val(valueValue);
	}

	this.addDynamicSelectValue = function()
	{
		var listValue = ElementSettingForm.getListDynamicValue();
		var listAllValue = {"none":"Нет"};
		for (var iValue in listValue) listAllValue[iValue] = listValue[iValue];
		
		var selectIdObj = $("."+this.getClassButtonDynamicId());
		Select.setListOptions(selectIdObj, listAllValue);
	}

	this.editTabsButtonDynamicId = function(elm, value)
	{
		var attrId = this.getAttrButtonDynamicId();
		if (value == "none") elm.removeAttr(attrId);
		else elm.attr(attrId, value);
	}

	this.editTabsButtonDynamicValue = function(elm, value)
	{
		var attrValue = this.getAttrButtonDynamicValue();
		elm.attr(attrValue, value);
	}

	this.getClassButtonDynamicId = function()
	{
		return "selectTabsButtonDynamicId";
	}

	this.getClassButtonDynamicValue = function()
	{
		return "valueButtonDynamicValue";
	}

	this.getAttrButtonDynamicId = function()
	{
		return "data-hlp-dynamic-button-id";
	}

	this.getAttrButtonDynamicValue = function()
	{
		return "data-hlp-dynamic-button-value";
	}


/******************************************************************************************/
/****************************************************************************************/
	/**
	* Изменить тип действия
	*
	*
	*/
	this.editActionType = function(elm, typeAction, elmEvent)
	{
		// показываем текущий блок
		this.showBlockAction(typeAction);

		// ставим тип элементу
		var listBrother = elm;
		// if (listBrother.hasClass("nav-item")) listBrother = elm.closest(".nav").find(".nav-item");
		
		listBrother.attr("data-action", typeAction);
		listBrother.attr("data-value", '');
		listBrother.removeAttr("href").removeAttr("target");

		// ставим значение элементу
		var parentValue = $(".menuSettingClick .select[type='"+typeAction+"']");
		var valueAction = parentValue.find(".option:first").attr("value");
		
		elm.attr("data-value", valueAction);

		// ставим в select
		Select.set(parentValue, valueAction);

		// если секции
		if (typeAction == "section") this.setListSection();

		// сбрасываем значение
		$(".valueLink").val(' ');

		this.set(elm);
	}
/*****************************************************************************************************/
	/**
	* Изменение url
	*
	*/
	this.editLickUrl = function(elm, value) {
		elm.attr("href", value.trim());
	}

	// blank
	this.editLinkTarget = function(elm, value) {
		if (value == "_blank") elm.attr("target", value);
		else elm.removeAttr("target");
	}

/******************************************************************************************/
	// изменение страницы (page, section)
	this.editValue = function(elm, value)
	{
		elm.attr("data-value", value);
	}

	// изменение модального
	this.editModal = function(elm, value)
	{
		elm.attr("data-value", value);
		// ставим имя
		ManagerModal.setCurrentName();
	}

	// имя формы
	this.editModalFormname = function(elm, value)
	{
		if (value) value = value.trim();
		elm.attr(this.getAttrModalFormName(), value);
	}


/******************************************************************************************/
	/**
	* Контакты
	*/
	this.setContact = function(elm, actionValue)
	{
		var property = this.getPropertyContact(elm);

		if (property[2]) var value = property[2];
		else var value = property[1];
		if (!value) value = '';

		Select.set($(".selectClickCotactType"), property[0]);
		$(".valueClickContactValue").val(value);
	}

	this.getPropertyContact = function(elm)
	{
		var value = elm.attr("data-value");
		if (!value) return ['tel', ''];

		var property = value.split(":");
		if (!property[1]) property[1] = '';


		// для whatsapp
		if (property[0] == "whatsapp") {
			property = value.split("=");
			property[0] = "whatsapp";
		}

		return property;
	}

	// type
	this.editContactType = function(elm, value)
	{
		this.editContactProperty(elm, value, "type");	
	}

	// value
	this.editContactValue = function(elm, value)
	{
		this.editContactProperty(elm, value, "value");	
	}

	this.editContactProperty = function(elm, newValue, typeEdit) {
		if (typeEdit == "type") {
			var value = $(".valueClickContactValue").val();
			var type = newValue;
		} else {
			var value = newValue;
			var type = Select.get($(".selectClickCotactType"));
		}

		if (!value) value = '';
		if (!type) type = 'tel';
		value = value.replace(/[^0-9\+]+/gim, '');

		if (type == "whatsapp") {
			var contValue = "whatsapp://send?phone="+value;
		} else {
			var contValue = type + ":" + value;
		}

		elm.attr("data-value", contValue).attr("href", contValue);
	}

/*************************************************************************************************/
	
	this.setDownload = function(elm)
	{
		$(".valueClickDownloadFile").val(elm.attr("data-value"));
	}

	this.editDownloadFile = function(elm, value)
	{
		if (value) value = value.replace(/^\/?files/gim, '');
		elm.attr("data-value", value);
	}

/**************************************************************************************************/
/*************************************************************************************************/
	/**
	* Показывает блок
	*
	* @see 	this.editActionType()
	* @see 	this.set()
	*/
	this.showBlockAction = function(type)
	{
		$(".menuTypeClickBlock").css("display", "none")
								.filter("[type='"+type+"']")
								.css("display", "block");
	}



/*************************************************************************************/
}//end class
