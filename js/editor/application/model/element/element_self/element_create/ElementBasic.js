/**
* Базовый элемент
*
* @parent  	ElementSelf  	
* @child 	CreateSection 	
* @child 	CreateBlock 	
*
*/ 
ElementBasic.prototype = ElementSelf;
var ElementBasic = new ElementBasic();
ElementBasic.parent = ElementSelf;
function ElementBasic()  
{
	/**
	* Создает элемент
	* 
	* @param 	array 	дополнительные параметры
	*
	* @see 		ElementAddController.setEvent()
	*/
	this.create = function(params)
	{
		if (!params) params = {};
		this.params = params;

		this.createAction();
	};

	/**
	* Создает элемент
	*
	*
	* @see 	this.create()
	*/
	this.createAction = function()
	{
		Modal.delete();
		
		$(".element, li").removeAttr("status");
		//создаем элемент
		var newElm = this.createElement(this.params);
			
		// добавляем id
		Element.addNewId(newElm);

		// если такой уже есть элемент
		if ($("."+newElm.attr("class-unique")).length > 1) {
			newElm.removeAttr("style");
		}
		
		// ставим у ширины проценты
		this.setUnitMenu();
		// ставим размер
		this.setSize(newElm);
		// стили по умолчанию
		this.setStyleDefault(newElm);
		//станавливаем css
		this.setCssNewElm(newElm);
		// строим структуру
		PageStruct.build();
		//фиксируем историю
		History.record();
			
		// если только создание 
		if (this.params.only_create) return false;

		//если колонки клик по первой
		if (newElm.children().hasClass("column")) newElm = newElm.find(".column:eq(0)");
		newElm.mousedown().mouseup();//эмитируем клик
		
		// ставим scroll  на полотне
		StyleCanvas.setScrollTopElm(newElm);
		// действие после добавления
		this.actionAfter(this.params);
	}

/**********************************************************************************************/

	/**
	* Ставим размер
	*
	* @see 	this.createElement()
	*/
	this.setSize = function(elm)
	{
		if (!elm || !elm.length) return false;

		// если больше родителя
		var elmParent = elm.parent();
		if (elm.hasClass("image")) {
			this.setSizeImage(elm);
		} else if (this.type != "nav-item" && this.type != "button") {
			// var maxWidth = elmParent.width();
			// var width = elm.width();

			// if (width >= maxWidth) {
			// 	StyleUnit.setUnitMenu("width", "100%");
			// 	elm.css("width", "100%");
			// 	ElementCss.set("geometry", elm);
			// }
		}
	}


	this.setSizeImage = function(elm)
	{
		var elmParent = elm.parent();
		
		var imgSelfV = elm.find("> img");
		imgSelfV.css("width", "auto");
		var imgWidthV = imgSelfV.width();
		imgSelfV.removeAttr("style");	

		var imgParentWidthV = elmParent.width() - 5;
		if (imgWidthV > imgParentWidthV) imgWidthV = "100%";
		else imgWidthV += "px";
		
		// var maxWidth = 500;
		// if (imgWidthV > maxWidth) imgWidthV = maxWidth;

		// if (!imgWidthV) imgWidthV = 100;
		// imgWidthV = imgWidthV+"px";

		StyleUnit.setUnitMenu("width", imgWidthV);
		elm.css({"width":imgWidthV});
		ElementCss.set("geometry", elm);
	}
/************************************************************************************************/
	/**
	* Создаем элемент
	*
	* @uses 	this.getElementHtml() 				получить html элемента
	* @uses 	this.insertElement()-ElementSelf 	вставить элемент
	* @uses 	this.setVarDataElm() 				установить в переменую массив данных нового элемента
	* @see 		this.create()
	*/
	this.createElement = function(params)
	{
		//устанавливаем  дополнительные параметры, которые используются
		// обычно в this.getElementHtml()
		var elm = Element.obj;
		this.param = params;

		//получить html элемента
		var block = this.getElementHtml();
		
		var typeInsert = "";
		//если нужно вставить после
		if (params["insert_after"]) var typeInsert = "after";
		//вставить элемент на страницу
		this.insertElement(block, this.type, typeInsert); //стандартная вставка

		//новый элемент
		var newElm = $(".new-element").removeClass("new-element"); 
		// добавляем тип
		if (!newElm.attr("elm-type")) newElm.attr("elm-type", this.type);
		
		// добавляем уникальный класс
		if ( !this.notAddClass && this.class != "column"
				&& !newElm.attr("class-unique") ) {
			this.addClassUnique(newElm);
		}

		newElm = newElm.eq(0);

		return newElm;
	}

	/**
	* Добавляем уникальный класс новому элементу 
	*
	* @see 	this.createElement()
	*/
	this.addClassUnique = function(listNewElm)
	{
		var countElm = listNewElm.length;

		for (var i = 0; i < countElm; i++) {
			var newElm = listNewElm.eq(i);
			if (newElm.attr("class-unique")) continue;

			var uniqueClass = Element.getNewClassUnique(this.class);
			newElm.addClass(uniqueClass).attr("class-unique", uniqueClass);
		}
	}

/***********************************************************************************************/
	/**
	* Стили по умолчанию
	*
	* @see 	this.create() 
	*/
	this.setStyleDefault = function(newElm)
	{
		var elmParentObjV = newElm.parent(); 

		// для ряда
		if (newElm.hasClass("column") || newElm.hasClass("row")) {
			var objRowV = newElm.closest(".row");
			if (objRowV.parent().hasClass("section-content")) {
				var countColV = objRowV.attr("count-column");
				var countColTP = countColV == 2 ? 1 : 2;
				var countColTPClass = "hlp-row-col-"+countColTP+"-tp";
				objRowV.addClass(countColTPClass);
			// если несколько уровней вложености
			} else {
				objRowV.css("margin-top", "0px");
				objRowV.find("> .column").css("margin-bottom", "0px");
			}
		}

		// var width100Per = "100%";
	
		// // потомки колонки
		// if (elmParentObjV.hasClass("column")) {
		// 	if (newElm.hasClass("text") || newElm.hasClass("heading")) {
		// 		newElm.css({"width":width100Per});
		// 	} else if (newElm.hasClass("button")) {
		// 		newElm.css({"margin-top":"25px", "margin-left":"auto", "margin-right":"auto"});
		// 	} else if (newElm.hasClass("image")) {
		// 		newElm.css({"margin-left":"auto", "margin-right":"auto"});
		// 	}
		// }

		// // потомки формы
		// if (elmParentObjV.hasClass("form")) {
		// 	if (newElm.hasClass("text") || newElm.hasClass("heading")) {
		// 		newElm.css({"width":width100Per});
		// 	}
		// }
	}

	/**
	* Ставит стили новым элементам
	*
	*
	* @see 	this.create()
	*/
	this.setCssNewElm = function(newElm)
	{
		var elmClassUnique = newElm.attr("class-unique");
		if ($("."+elmClassUnique).length > 1) {
			var newElmStyle = newElm.attr("style");
			if (newElmStyle) {
				newElmStyle = newElmStyle.replace(/width:[^;]+/gim, '');
				newElm.attr("style", newElmStyle);
			}
		}

		ElementCss.set("geometry", newElm);

		var listChild = newElm.find(".element");
		var countChild = listChild.length;
		for (var i = 0; i < countChild; i++) {
			var elmChildObj = listChild.eq(i);
			ElementCss.set("geometry", elmChildObj);
		}
	}

	/**
	* Ставит unit в меню
	*
	* @see 	create()
	*/
	this.setUnitMenu = function()
	{
		StyleUnit.setAllDefault();
		// if (this.noWidthPersent) StyleUnit.setUnitMenu("width", "px");	
		// else StyleUnit.setUnitMenu("width", "%");
	}
/***************************************************************************************************/
	/**
	* Действия после добавление
	*
	*/
	this.actionAfter = function() {};

	/**
	* Получить html елемента 
	*
	* @return 	html 	элемент
	* 
	* @see 		this.create()
	* @set 		CreateSection, CreateBlock
	*/	
	this.getElementHtml = function() {};

	/**
	* добавляет дополнительный блок
	*
	* @see 	Resize.addBlock()
	*/
	this.addAddedBlock = function() {};


	/**
	* Устанавливает позицию
	*
	* @see 	ElementCanvas.setEventMoveMouseUp()
	* @see 	Resize.addBlock()
	*/
	this.setPositionAddedBlock = function()
	{
		var elm = Element.obj;
		var addedBlockObj = elm.find(".addedBlockModeSimple");

		// если нету дополнитеьного класса
		if (!addedBlockObj.length) return false;
		
		var elmIndex = elm.index(elm.parent().find(".element"));
		var offsetTop = elm.offset().top;

		if (offsetTop < 80 && !elm.hasClass("section")) {
			addedBlockObj.addClass("addedBlockPosBottom");
		} 
		// else if (elm.parent().hasClass("section-content") && elmIndex == 0) {
			// addedBlockObj.addClass("addedBlockPosBottom");
		// } 
		else {
			addedBlockObj.removeClass("addedBlockPosBottom");
		}
	} 

/**************************************************************************************************/
	
	this.isAddThisClass = function(newClass)
	{
		if (this.isInterdictedClass(newClass)) return false;
		else return true;
	}

	/**
	* Запрещеный класс или нет
	*
	* @see 	this.setEventEnterClass()
	* @see 	StyleMenuFixed.editClass(), .setEventAddClass()
	*/
	this.isInterdictedClass = function(newClass)
	{
		var listClass = [
			"element", "element-content", "section-content",
			"head", "site", "page", "wrapper",
			"section", "row", "column", "block", "text", "heading", "button",
			"image", "video", "map", "map-full-width", "embed",
			"modal-section", "modal", "modal-wrap", "new-element", "blackout", 
			"grid", "gridBg", "gridLine", "butAddTemplate", "addedBlock",
			"addedBlockSection", "listGridLine", "show-element", 
			"fill-vacuum",

			"form", "input", "textarea", "submit", "select", "checkbox", "radio", "label",

			"nav", "nav-item", "nav-button-mobile", "nav-panel-mobile",
			"nav-mobile", "nav-item-mobile",

			"animated", 
			"strip",
		];	
				
		var iClass = 0;		
		for (iClass in listClass) {
			var classItem = listClass[iClass];
			if (newClass == classItem) return true;
		}	

		// как исключение
		if (newClass.match(/^hlp-error-label/gim)) return false;
		else if (newClass.match(/^hlp-error-input/gim)) return false;

		// нельзя
		if (newClass.match(/^hlp-children-float/gim)) return true;
		else if (newClass.match(/^hlp-children-no-float/gim)) return true;
		else if (newClass.match(/^hlp\-/gim)) return true;
		else if (newClass.match(/\-m[lp]$/gim)) return true;
		else if (newClass.match(/\-hover$/gim)) return true;

		// если модальное
		if (Screen.isModal()) {
			if ($(".section ."+newClass).length || $(".section[class~='"+newClass+"']").length) {
				return true;
			}
			if ($(".nav-panel-mobile ."+newClass).length || $(".nav-panel-mobile[class~='"+newClass+"']").length) {
				return true;
			}
		} else {
			if ($("."+newClass).closest(".modal").length || $(".modal[class~='"+newClass+"']").length) {
				return true;
			}
		}
	}


/******************************************************************************/

}//конец класса 

