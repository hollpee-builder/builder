var ElementSettingGeneral = new ElementSettingGeneral();
function ElementSettingGeneral() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		this.setAttr(elm);
		this.setYaGoal(elm);
	}

/**********************************************************************************/
/**********************************************************************************/

	this.setAttr = function(elm)
	{
		$(".valueSettingGeneralElmId").val(elm.attr("data-hlp-elm-id"));
		// $(".valueSettingGeneralElmClass").val(elm.attr("data-hlp-elm-class"));

		// класс
		var elmClassV = this.getElmAttr(elm, "class");
		MenuListItem.addList("class", elmClassV);

		// атрибут
		var elmAttr = this.getElmAttr(elm, "attr");
		MenuListItem.addList("attr", elmAttr);
		// $(".valueSettingGeneralElmAttr").val(elmAttr);
	}

	this.setAttrItem = function(elmEvent)
	{
		var attrKeyV = elmEvent.attr("attr-key").trim();
		var attrValueV = elmEvent.attr("attr-value").trim();

		var menuItemKeyObj = $(".menuStyleItemGenAttrKey");
		if (attrKeyV == "new-attr") {
			$(".valueSettingGenAttrKey").val(attrKeyV);
			menuItemKeyObj.css("display", "block");
		} else {
			menuItemKeyObj.css("display", "none");
		}
		
		$(".valueSettingGenAttrValue").val(attrValueV);
	}

	this.setAttrClass = function(elmEvent)
	{
		$(".valueSettingGenAttrClass").val(elmEvent.attr("attr-class"));
	}


/************************************************************************************************/
/************************************************************************************************/

	this.editElmId = function(elm, value)
	{
		if (value) {
			value = value.trim().replace(/[^\w\-]+/gim, '');
			elm.attr("data-hlp-elm-id", value);
		} else {
			elm.removeAttr("data-hlp-elm-id");
		}
	}



/*************************************************************************************/
/*************************************************************************************/
	this.getElmAttr = function(elm, typeAttrV)
	{
		if (!elm) var elm = Element.obj;
		if (!typeAttrV) typeAttrV = "attr";
			
		var elmAttr = elm.attr("data-hlp-elm-"+typeAttrV);

		if (elmAttr && elmAttr != "true") {
			elmAttr = elmAttr.replace(/@@@@@quote_1@@@@@/gim, '\'');
			elmAttr = elmAttr.replace(/@@@@@quote_2@@@@@/gim, '\"');
			elmAttr = JSON.parse(elmAttr);
		} else {
			elmAttr = [];
		}

		return elmAttr;
	}

	this.editElmClass = function(elm, value)
	{
		if (value) {
			value = value.trim().replace(/[^\w\-\s\,]+/gim, ' ');
			elm.attr("data-hlp-elm-class", value);
		} else {
			elm.removeAttr("data-hlp-elm-class");
		}
		
	}

	this.editElmAttr = function(elm, value, elmEvent)
	{
		var typeV = MenuListItem.getType(elmEvent);
		var inputObjV = typeV == "class" ? $(".valueSettingGenAttrClass") : $(".valueSettingGenAttrKey");
		var inputValueV = inputObjV.val().trim();
		if (inputValueV.match(/^[0-9]+/gim)) {
			inputValueV = "a" + inputValueV;
			inputObjV.val(inputValueV);
		}
		inputValueV = inputValueV.replace(/[^\w\-]+/gim, '');
		inputObjV.val(inputValueV);

		var listAttrV = this.getElmAttr(elm, typeV);
		listAttrV = MenuListItem.uploadListValue(listAttrV, elmEvent);

		listAttrV = this.getJson(listAttrV);

		elm.attr("data-hlp-elm-"+typeV, listAttrV);
	}

	this.deleteAttr = function(itemIndexV, attrTypeV)
	{
		var elm = Element.obj;
		var listAttrV = this.getElmAttr(elm, attrTypeV);
		listAttrV.splice(itemIndexV, 1);

		if (listAttrV.length) {
			listAttrV = this.getJson(listAttrV);
			elm.attr("data-hlp-elm-"+attrTypeV, listAttrV);
		} else {
			elm.removeAttr("data-hlp-elm-"+attrTypeV);
		}
	}

	/**
	* Добавление нового атрибута
	*
	*/
	this.addNewAttr = function(attrTypeV)
	{
		if (attrTypeV == "class") {
			var newAttrNameV = 'new-cls'; 
			var newPropertyV = {
				"name" : newAttrNameV,
				"property" : {
					"attr-class": newAttrNameV,
				}
			}
		} else {
			var newAttrNameV = 'new-attr'; 
			var newPropertyV = {
				"name" : newAttrNameV,
				"property" : {
					"attr-key": newAttrNameV,
					"attr-value": 'new',
				}
			}
		}

		var elm = Element.obj;
		var listAttrV = this.getElmAttr(elm, attrTypeV);
		listAttrV[listAttrV.length] = newPropertyV;

		listAttrV = this.getJson(listAttrV);
		elm.attr("data-hlp-elm-"+attrTypeV, listAttrV);

		return newPropertyV;
	}


	this.getJson = function(textV)
	{
		textV = JSON.stringify(textV);
		textV = textV.replace(/\'/gim, '@@@@@quote_1@@@@@');
		textV = textV.replace(/\"/gim, '@@@@@quote_2@@@@@');

		return textV;
	}

/**********************************************************************************/
/**********************************************************************************/
	
	// ya цели
	this.setYaGoal = function(elm)
	{
		if (!elm.hasClass("form")
				&& !elm.hasClass("button")
				&& !elm.hasClass("image")) {
			$(".menuSettingYaGoal").css("display", "none");
			return false;
		}

		var counterId = Data.page.data.yandex_counter_id;
		$(".valueSettingGeneralYaCounterId").val(counterId);
		
		var eventIdV = elm.attr(this.getAttrYaEventId());
		$(".valueSettingGeneralYaEventId").val(eventIdV);
	}

	this.editYaCounterId = function(elm, value)
	{
		if (value) value = value.replace(/[^0-9]+/gim, '');
		Data.page.data.yandex_counter_id = value;
	}

	this.editYaEventId = function(elm, value)
	{
		if (value) value = value.trim();
		var attrV = this.getAttrYaEventId();

		if (value) elm.attr(attrV, value);
		else elm.removeAttr(attrV);
	}

	this.getAttrYaEventId = function()
	{
		return "data-hlp-ya-eventid";
	}


/**********************************************************************************************************/
/**********************************************************************************************************/
	
	this.attr = {};
	this.attr.code_status = "hlp-export-code-status";
	this.attr.code_position = "hlp-export-code-position";

	this.class = {};
	this.class.code_status = "valueSettingExportCodeStatus";
	this.class.code_position = "selectExportCodePosition";

	// get attr
	this.getAttrCodeStatus = function() { return this.attr.code_status;}
	this.getAttrCodePosition = function() { return this.attr.code_position;}

	// get class
	this.getClassCodeStatus = function() { return this.class.code_status;}
	this.getClassCodePosition = function() { return this.class.code_position;}

	this.setMGExport = function(elm)
	{
		this.setCode(elm);
	}

	// code
	this.setCode = function(elm)
	{
		this.setCodeStatus(elm);
		this.setCodePosition(elm);
	}

	this.setCodeStatus = function(elm)
	{
		var attrCodeStatusV = this.getAttrCodeStatus();
		var value = elm.attr(attrCodeStatusV) ? "yes" : "no";

		var classCodeStatusV = this.getClassCodeStatus();
		var inputObjV = $("."+classCodeStatusV); 
		StyleMenu.chosenToggleBut(inputObjV, value);
	}

	this.setCodePosition = function(elm)
	{
		var attrPosV = this.getAttrCodePosition();
		var value = elm.attr(attrPosV);
		if (!value) value = "replace";

		var classCodePostV = this.getClassCodePosition();
		var inputObjV = $("."+classCodePostV); 
		Select.set(inputObjV, value);
	}

	// вставка кода
	this.editExportCodeStatus = function(elm, value)
	{
		var attrCodeStatusV = this.getAttrCodeStatus();

		if (value == "yes") elm.attr(attrCodeStatusV, value);
		else elm.removeAttr(attrCodeStatusV);
	}

	this.editExportCodePosition = function(elm, value)
	{
		var attrPosV = this.getAttrCodePosition();
		elm.attr(attrPosV, value);
	}

/***************************************************************************************/
	
	this.setEvent = function()
	{
		this.setEventExport();	
	}

	this.setEventExport = function()
	{
		this.setEventCodeEdit();
	}

	this.setEventCodeEdit = function()
	{
		var butObj = $(".butExportCodeEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elm = Element.obj;
			// if (elm.hasClass("row")) elm = elm.find(".column:first");

			var elmCodeV = elm.find("> .hlp-element-code");

			var modalTitle = "Code";
			var oldCodeV = elmCodeV.length ? elmCodeV.html() : "";
			EditorCode.edit(modalTitle, oldCodeV, function(newCodeV) {
					
				elmCodeV.remove();
				var codeBlockV = '<span class="hlp-element-code">'+newCodeV+'</span>';
				
				if (elm.hasClass("row")) {
					elm.append(codeBlockV);
				} else {
					elm.prepend(codeBlockV);
				}

				History.record();
				Modal.delete();
			});
		});
	}

/***************************************************************************************/

}//end class

