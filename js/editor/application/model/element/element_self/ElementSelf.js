/**
* Работа не посредствено 
* с самим элементом (добавление, удаление, копирование и тд.)
*
* @parent 	Element 		
* @child 	ElementBasic  	базовый класс для самих элементов 
* @child 	ElementMan  	манипуляция с элементами 	
*
*/
var ElementSelf = new ElementSelf();
function ElementSelf() {
	/** 
	* @var 	string 	тип элемента 
	* @set 	ElementMan.copy(), ElementCut.copy()
	*/
	this.type = '';
/****************************************************************************/
	/**
	* Вставляет элемент на страницу
	*
	* @param 	html 	block - html элемента
	* @param 	string 	type - тип элемента
	*
	* @see 		ElementBasic.createElement()-child, ElementMan.insert()-child
	*/
	this.insertElement = function(block, type, typeInsert)
	{
		// ставим экран desktop
		Screen.setDesktop();

		// если сайт
		if (Element.obj.hasClass("site")) {
			var prevElm = Element.prevElm;
			if (!prevElm) prevElm = $(".section:first");
			Element.setData(prevElm);
			Element.prevElm = false;
		}

		var elm = Element.obj;

		if (elm.hasClass("nav-item")) elm = elm.closest(".nav");
		else if (elm.hasClass("nav-item-mobile")) elm = elm.closest(".nav-mobile");
		else if (elm.hasClass("text-span")) elm = elm.parent().closest(".element");
		else if (elm.hasClass("hlp-li") && type != "hlp-li") elm = elm.closest(".hlp-ul, .hlp-ol");
		else if (elm.hasClass("slider")) elm = ElementWidgetSlider.getCurItem(elm);
		else if (elm.hasClass("hlp-tabs")) elm = ElementWidgetTabs.getCurItem(elm);
		else if (elm.hasClass("hlp-comparison-image")) elm = elm.closest(".hlp-comparison");

		var isBefore = typeInsert == "before" ? true : false;
		var isAfter = typeInsert == "after" ? true : false;
		var isFirst = typeInsert == "first" ? true : false;

		if ( (elm.hasClass("hlp-ul") || elm.hasClass("hlp-ol")) && type != "hlp-li") {
			isAfter = true;
		}

		var insertAfterParentSelector = Element.data.insert_after_parent_selector;

		if (type == 'section') { 
			this.insertElementSection(elm, block, isBefore, isAfter);

		} else if (elm.closest(".hlp-upload-file-wrap").length) {
			elm.closest(".hlp-upload-file-wrap").after(block);
			
		} else if (insertAfterParentSelector) {
			elm.closest(insertAfterParentSelector).after(block);
		} else if (type == 'nav-item' && Element.data.type == "nav-item") {
			Element.obj.after(block);
		} else if (type == 'nav-item' && Element.data.type == "nav") {
			elm.append(block);
		} else if (Element.data.type == "column" || Element.data.only_insert) {
			elm.append(block);
		
		} else if (isAfter) {// вставляем после элемента
			elm.closest(".element").after(block);
			
		} else if (isFirst) {//первым элементом
			if (Element.data.type == "section") elm = elm.find(".section-content");
			elm.prepend(block);
		
		} else if (this.isNotInsertInForm(elm, type)) {
			elm.closest("form").after(block);
			
		} else if (Element.data.is_insert) {
			this.insertElementInside(elm, block);
		// стандартный
		} else {
			this.insertElementAfter(elm, block);
		}
		
		//ставим события для элемента на полотне
		this.setEvent();

		// ставим линейку если изменилась высота
		Scale.setPosition();
	};

	/**
	* Нельзя вставить в форму
	*
	* @see 	this.insertElement()
	*/
	this.isNotInsertInForm = function(elm, type)
	{
		if (elm.closest("form").length 
				&& (type == "form"
					|| type.match(/nav/gim)
					|| type == "map"
					|| type == "video" )
				) {
			return true;
		} else {
			false;
		}
	}
/*********************************************************************************************/
	/**
	* Вставляем секцию
	* @see this.insertElement()
	*/
	this.insertElementSection = function(elmSelected, block, isBefore, isAfter)
	{
		// элемент frame или нет
		var elmInsert = elmSelected.closest('.section');
		
		if (elmInsert.length) {
			if (isBefore) elmInsert.before(block);
			else elmInsert.after(block);
		} else {
			$(".content .site").prepend(elmInsert);
		}
	}

	/**
	* Вставляем элементы формы
	* @see this.insertElement()
	*/
	this.insertElementItemForm = function(elmSelected, block)
	{
		//вставляем элемент после выбранного элемента
		elmSelected.parent().after(block);
	}

	/**
	* Вставляем внутрь элемента
	*
	* @see this.insertElement()
	*/
	this.insertElementInside = function(elm, block)
	{
		// если секция
		if (elm.hasClass("section")) elm = elm.find(".section-content");
		
		// вставляем
		elm.append(block);
	}

	/**
	* Вставляет элемент после
	*
	* @see 	this.insertElement()
	*/
	this.insertElementAfter = function(elm, block)
	{
		// вставляем элемент
		elm.after(block);
	}
/*********************************************************************************************/
	/**
	* Добавляет ряд если элемент не вмещается
	*
	* @see 	ElementBasic.createElement()
	* @see 	ElementMan.insert()
	*/
	this.isNotFit = function(widthElm, elm)
	{
		if (!Element.obj) return false;
		if (!elm) elm = Element.obj;

		var blockObj = elm.hasClass("block") ? elm : elm.parent();
		var listBrother = Element.getListBrother(blockObj);
		elm = listBrother.filter(":last");
		var floatElm = elm.css("float");

		// если строка и можно изменять размер элемента
		if (blockObj.hasClass("block") && elm.length && floatElm != "none") {

			// получаем
			var params = {};
			params.width = widthElm;
			params.padding_h = Element.getPaddingH(elm);
			params.left_property = "margin-" + floatElm;
			Resize.nextElm = false;
			Resize.setMaxWidth(elm, false, params);

			var widthEmpty = floatElm == "left" ? Resize.maxWidthRight : Resize.maxWidthLeft;
			widthEmpty -= Element.getWidth(elm) - 5;

			if (widthEmpty < widthElm) {
				// если не вмещается один и один потомок, убирам float
				if (listBrother.length == 1) {
					StyleMenuGeometry.setChildrenNoFloat(blockObj);
				} else {
					Element.setData(blockObj);
					return true;
				}
			}
		}
		
		return false;
	}

	/**
	* Отдает пустую ширину
	*
	* @see 	this.isNotFit()
	*/
	this.getEmptyWidth = function(elm)
	{
		if (!elm) elm = Element.obj;
		var width = elm.width();
		var listChild = Element.getListBrother(elm);

		var countChild = listChild.length;
		for (var i = 0; i < countChild; i++) {
			var item = listChild.eq(i);
			width = width - Element.getWidth(item) - parseInt(item.css("margin-left"));
		}

		return width;
	}
/*******************************************************************************************/
	/**
	* Устанавливаем события для элемента
	*
	* @param 	obj 	elm-элемент по кот нужно сымитировать клик
	*
	* @see 		this.insertElement()-child 	
	*/
	this.setEvent = function()
	{
		Input.newCanvas();
	} 	
/********************************************************************************/
	

}//end class




