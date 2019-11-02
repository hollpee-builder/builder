/**
* Трансформация
*
*
*/
StyleMenuTransform.prototype = StyleMenu;
var StyleMenuTransform = new StyleMenuTransform();
function StyleMenuTransform() {
	this.scaleIndex = 100;
	this.transitionDefault = 300;

	/**
	* Установить 
	*/
	this.set = function(elm)
	{
		this.setRotate(elm);
		this.setOpacity(elm);
		this.setBlur(elm);
		this.setTransition(elm);
	} 

	/** 
	* Прозрачность
	*
	* @see 	this.set()
	*/
	this.setOpacity = function(elm)
	{
		var opacityValue = elm.css("opacity");
		// if (!opacityValue) opacityValue = 1;
		opacityValue = parseFloat(opacityValue).toFixed(2);
		opacityValue = parseFloat(opacityValue)*100;

		// ставим значение
		$(".valueTransformOpacity").val(opacityValue);
	}

	this.setBlur = function(elm)
	{
		var blurValue = elm.css("filter");
		if (blurValue == "none") blurValue = elm.css("-webkit-filter");
		if (blurValue == "none") blurValue = elm.css("-moz-filter");
		if (blurValue == "none") blurValue = elm.css("-o-filter");

		if (blurValue && blurValue.match(/blur/gim)) {
			blurValue = blurValue.replace(/[^0-9\.]+/, '');
		} else {
			blurValue = 0;
		}

		$(".valueTransformBlur").val(blurValue);
	}

/************************************************************************************/

	this.setTransition = function(elm)
	{
		// var value = elm.css("transition");
		var value = ElementCss.getStyleAllScreen("transition", "style", false, elm);
		if (value) value = value.match(/^all [0-9\.]+s/gim);

		if (value) {
			value = value[0];
			value = value.replace(/[^0-9\.]+/gim, '');
			value = parseFloat(value) * 1000;
		}
		if (!value) value = this.getTransitionDefault(elm);

		$(".valueTransformTransition").val(value);
	}

	this.editTransition = function(elm, value)
	{
		value = parseInt(value);
		value = value / 1000;
		value = parseFloat(value.toFixed(2));

		elm.css("transition", "all "+value+"s ease");
		ElementCss.set("style", elm, false, false);
	}


	this.getTransitionDefault = function(elm)
	{
		if (elm.hasClass("button") 
				|| elm.hasClass("nav-item")
				|| elm.hasClass("submit")) {
			return this.transitionDefault;
		} else {
			return 0;
		}
	}

/************************************************************************************/

	/**
	* Узнает транcформирован элемент или нет
	*
	* @see 	Guides.show()
	* @see 	this.setTransformResizeBlock()	
	*/
	this.getRotateWithParent = function(elm)
	{
		var rotateValue = 0;
		var status = false;

		for (var i = 0; i < 100; i++) { //для страховки, потому что работа с классом
			if (elm.hasClass("section")) break;
			// есть трансформация
			status = elm.css("transform") != "none";			
			if (status) {
				rotateValue = this.getRotateValue(elm);
				break;
			}
			// вверх по дереву
			elm = elm.parent().closest(".element");
		}


		return rotateValue;
	}

	/**
	* Отдает значение rotate
	*
	* @see 	this.set()
	* @see 	this.getRotateWithParent() 
	*/
	this.getRotateValue = function(elm)
	{
		var matrixValue = elm.css("transform");
		if (!matrixValue || matrixValue == "none") return 0;

		var listValue =  matrixValue.replace(/[a-z\(\)]+/gi, '').split(',');
		var rotateValue = Math.round(Math.asin(listValue[1]) * (180/Math.PI));

		if (listValue[3] < 0) {
			if (rotateValue) {
				rotateValue = parseInt(180 + rotateValue);
				if (rotateValue != 0) rotateValue *= (-1);
			} else {
				rotateValue = 180;
			}		
		}
		

		return rotateValue;
	}

	/**
	* Ставит в нормальное положение блок resize
	*
	* @see 	this.editRotate()
	* @see 	Resize.create()
	*/
	this.setTransformResizeBlock = function()
	{
		var value = this.getRotateWithParent(Element.obj);
		var roatateForGuides = "rotate(" + value * (-1) + "deg)"; 
		$(".resizeBlock").css("transform", roatateForGuides);
	}
/***************************************************************************************/
/*****************************************************************************************/
	// изменение
	/**
	* Поворот
	*/
	this.editRotate = function(elm, value)
	{
		value = parseInt(value);
	
		if (value) var rotate = "rotate("+value+"deg)";
		else var rotate = "none";

		elm.css("transform", rotate);
		// для направляющих и блока resize, что бы стояли ровно
		this.setTransformResizeBlock();
	}

	/**
	* Прозрачность
	*/
	this.editOpacity = function(elm, value)
	{
		value = parseInt(value) / 100;
		elm.css("opacity", value);
	}

	this.editBlur = function(elm, value)
	{
		value = parseFloat(value) + "px";
		value = "blur("+value+")";
		elm.css("-webkit-filter", value);
		elm.css("-moz-filter", value);
		elm.css("-o-filter", value);
		elm.css("-ms-filter", value);
		elm.css("filter", value);
	}

/**************************************************************************************/
/**************************************************************************************/
	
	/** 
	* Установить rotate
	*
	* @see 	this.set()
	*/
	this.setRotate = function(elm)
	{
		var listPropV = this.getListTransformProperty(elm, true);
		MenuListItem.addList("transform", listPropV);
	}

	/**
	* Изменение значения
	*
	*
	*/
	this.edit = function(elm, value, elmEvent)
	{
		var listOptionProperty = this.getListTransformProperty(elm);
		var propIndex = MenuListItem.getItemIndex(elmEvent);

		listOptionProperty = this.editItemFromList(listOptionProperty, propIndex);

		MenuListItem.uploadListValue(listOptionProperty, elmEvent);
		MenuListItem.addList("transform", listOptionProperty);

		this.setValueElm(elm, listOptionProperty);
	}

	/**
	* Добавление нового значения
	*
	* @see 	MenuListItem.addNewItem()
	*/
	this.addNewValue = function()
	{
		$(".menuTransformListBlock").attr("data-type", "translate");

		var newPropertyV = {
			"name" : "translate",
			"property" : {
				"trs-type" : "translate",
				"trs-hor": "0",
				"trs-ver" : "0",
			}
		}

		var elm = Element.obj;
		var trsAttr = this.getTrsAttr(elm);

		var transformValueV = elm.attr(trsAttr);
		if (transformValueV && transformValueV != "none") transformValueV += " ";
		else transformValueV = "";
		var value = this.getValueItem("translate", 0, 0);
		transformValueV += value;
		elm.css("transform", transformValueV);
		elm.attr(trsAttr, transformValueV);


		return newPropertyV;
	}

	/**
	* Установка параметра в можальное
	* 
	* @see 	MenuListItem.setEventEditBg()
	*/
	this.setOptionProperty = function(elmEvent)
	{
		$(".valueTransformHor, .valueTransformVer").val(0);
		$(".menuTransformBlock[data-type='scale']").find(".valueTransformHor, .valueTransformVer").val(this.scaleIndex);

		var trsType = elmEvent.attr("trs-type");
		$(".menuTransformListBlock").attr("data-type", trsType);
		$(".menuTransformTab").removeAttr("data-chosen")
							.filter("[data-type='"+trsType+"']")
							.attr("data-chosen", "true");

		var modalObjV = $(".menuTransformBlock[data-type='"+trsType+"']");

		var trsHor = elmEvent.attr("trs-hor");
		trsHor = trsHor ? parseFloat(trsHor) : 0;
		if (trsType == "scale" && trsHor) trsHor = parseInt(trsHor * this.scaleIndex);
		modalObjV.find(".valueTransformHor").val(trsHor);

		var trsVer = elmEvent.attr("trs-ver");
		trsVer = trsVer ? parseFloat(trsVer) : 0;
		if (trsType == "scale" && trsVer) trsVer = parseInt(trsVer * this.scaleIndex);
		modalObjV.find(".valueTransformVer").val(trsVer);
	}	

	/**
	* Удаление параметра
	* 
	* @see 	MenuListItem.deleteItem()
	*/
	this.deleteProp = function(itemIndexV)
	{
		var elm = Element.obj;
		var listOptionProperty = this.getListTransformProperty(elm);
		listOptionProperty.splice(itemIndexV, 1);

		this.setValueElm(elm, listOptionProperty);
	}

	/**
	* Сброс стиля
	*
	* @see 	ElementCss.actionAfterClearing()
	*/
	this.resetStyle = function(elm)
	{
		var trsAttr = this.getTrsAttr(elm);
		elm.removeAttr(trsAttr);
	}

	/**
	* Отдает атрибут трансформации
	*
	* @see 	this.resetStyle()
	* @see 	this.setValueElm()
	* @see 	this.getListTransformProperty()
	* @see 	this.addNewValue()
	*/
	this.getTrsAttr = function(elm)
	{
		if (!elm) elm = Element.obj;

		var trsAttr = "data-transform";
		var state = Element.getState(elm);
		if (state && state != "static") {
			trsAttr += "-"+state;
			// if (!elm.attr(trsAttr)) trsAttr = "data-transform";
		}

		return trsAttr;
	}

/*********************************************************************************/
			
	/**
	* Формирует одно значение
	*
	* @see 	this.addNewAttr()
	*/	
	this.getValueItem = function(typeV, horV, verV)
	{
		var value = '';
		if (typeV == "translate") {
			value = 'translate('+horV+'px,'+verV+'px)';
		} else if (typeV == "scale") {
			horV = parseInt(horV) / this.scaleIndex;
			verV = parseInt(verV) / this.scaleIndex;

			value = 'scale('+horV+','+verV+')';
		} else if (typeV == "rotate") {
			value = 'rotate('+horV+'deg)';
		} else if (typeV == "skew") {
			value = 'skew('+horV+'deg,'+verV+'deg)';
		}

		return value;
	}
	
	/**
	* Установка значения элементу
	*
	* @see 	this.deleteOption()
	* @see 	this.edit()
	*/
	this.setValueElm = function(elm, listOptionProperty)
	{
		value = this.getValueFromProp(listOptionProperty);
		value = value.trim();
		elm.css("transform", value);

		if (value) {
			var trsAttr = this.getTrsAttr(elm);
			elm.attr(trsAttr, value);
			ElementCss.set("style", elm);
		} else {
			ElementCss.clear("transform", "style", elm);
			var listElmV = Element.getAllObject(elm);
			listElmV.removeAttr("data-transform");
		}
	}

		/**
	* Отдает значение из списка параметров
	*
	* @see 	this.setValueElm()
	*/
	this.getValueFromProp = function(listPropertyV)
	{
		var countProp = listPropertyV.length;

		var value = '';
		var countItem = listPropertyV.length;
		for (var iItem = 0; iItem < countItem; iItem++) {
			var propV = listPropertyV[iItem];

			propV = propV["property"];
			var valueItem = propV["trs-hor"];
			if (propV["trs-ver"]) valueItem += ","+propV["trs-ver"];
			value += propV["trs-type"]+"("+valueItem+") ";
		}

		value = value.trim();

		return value;
	}

	/**
	* Отдает список параметров из значения
	*
	* @see 	this.setRotate()
	* @see 	this.edit()
	* @see 	this.deleteProp()
	*/
	this.getListTransformProperty = function(elm, isSetStyleV)
	{
		if (!elm) elm = Element.obj;

		var transformValueV = ElementCss.getStyleAllScreen("transform", false, false, elm);

		if (!transformValueV) return [];
		var listTransformP = transformValueV.split(") ");

		var listOptionProperty = []; 
		var trsCount = listTransformP.length;
		for (var iTrs = 0; iTrs < trsCount; iTrs++) {
			var trsValueV = listTransformP[iTrs];
			var trsTypeV = trsValueV.match(/^[^\(]+/gim);
			trsTypeV = trsTypeV[0];

			trsValueV = trsValueV.replace(/\)$/gim, '');
			trsValueV = trsValueV.replace(/^[^\(]+\(/gim, '');
			var listValueTrs = trsValueV.replace(/\s/gim, '').split(",");
			
			listOptionProperty[iTrs] = {
				"name" : trsTypeV,
				"property" : {"trs-type":trsTypeV}
			};

			var valueHorV = listValueTrs[0];
			var valueVerV = listValueTrs[1];

			listOptionProperty[iTrs]["property"]["trs-hor"] = valueHorV;
			if (valueVerV) listOptionProperty[iTrs]["property"]["trs-ver"] = valueVerV;
		}

		return listOptionProperty;
	}


	/**
	* Ставим элементу ноывй список
	*
	* @see 	this.edit()
	*/
	this.editItemFromList = function(listOptionProperty, propIndex)
	{
		if (!listOptionProperty) listOptionProperty = [];
		if (!listOptionProperty[propIndex]) {
			listOptionProperty[propIndex] = {"property":{}, "name":""};
		}

		var trsType = $(".menuTransformTab[data-chosen]").attr("data-type"); 
		listOptionProperty[propIndex]["property"]["trs-type"] = trsType;
		listOptionProperty[propIndex]["name"] = trsType;

		var modalObjV = $(".menuTransformBlock[data-type='"+trsType+"']");
		var inputHorObjV = modalObjV.find(".valueTransformHor");
			
		var unitV = "";
		if (trsType == "rotate" || trsType == "skew") unitV = "deg";
		else if (trsType == "translate") unitV = "px";

		var horV = parseInt(inputHorObjV.val());
		if (trsType == "scale" && horV) horV = horV / this.scaleIndex;
		listOptionProperty[propIndex]["property"]["trs-hor"] = horV+unitV;

		var inputVerObjV = modalObjV.find(".valueTransformVer");
		if (inputVerObjV.length) {
			var verV = parseInt(inputVerObjV.val());
			if (trsType == "scale" && verV) verV = verV / this.scaleIndex;
			listOptionProperty[propIndex]["property"]["trs-ver"] = verV+unitV;
		}

		if (trsType == "rotate") {
			listOptionProperty[propIndex]["property"]["trs-ver"] = false;
		}

		return listOptionProperty;
	}


/**************************************************************************************/
/**************************************************************************************/

	/**
	* Установка событий
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		var listTabsObj = $(".menuTransformTab"); 
		listTabsObj.off("mousedown");
		listTabsObj.on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = elmEvent.attr("data-type");

			listTabsObj.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");

			$(".menuTransformListBlock").attr("data-type", typeV);

			return false;
		});
	}

/**************************************************************************************/
} //end class


