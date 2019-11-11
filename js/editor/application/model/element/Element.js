/**
* Родительский класс для работы с элементом страницы
*
*/
var Element = new Element();
function Element()  
{	
	/**
	* Данные текущего элемента
	*
	*/
	this.data;

	/**
	* Список стилей основы
	* @see this.setStyle()
	*/
	this.listStyleMain;
	
	/**
	* Стили страницы
	*
	*/
	this.listStylePage;

	/**
	* Стили выбранного элемента
	*
	*/
	this.style;

	/**
	* Предыдущий выбраный элемент
	*
	* @set 	EditorController.setEventTab()
	* @set  EditorController.setEventNavMenu()
	* @see 	
	*/
	this.prevElm = false;
/***********************************************************************************************/
	/**
	* Установка список стилей для страницы
	*
	* @see 	Page.replace()
	*/
	this.setListStylePage = function(listStyle)
	{
		// устанавливаем в css блок


		// устанавливаем в  массиве
	}
/**********************************************************************************************/
	/**
	* Отдает элементы
	*
	* @see 	ElementSettingGrid.editMargin(), ElementSettingGrid.editNoDesctop()
	* @see 	ElementSettingGrid.setEventEditSizeColumn()
	*/
	this.get = function(elm)
	{
		var currentClass = this.getCurrentClass(elm);
		return $("."+currentClass);
	}

	/**
	* Отдает список элементов
	*
	* @see 	removeImg.EditElementImage()
	*/
	this.getList = function()
	{
		return $(".contentWrap .element");
	}
/*********************************************************************************************/
	/**
	* Получить id нового элемента
	*
	* @see 	ElementMap.getElementHtml()
	* @see 	ElementSection.getElementHtml()
	* @see 	ElementMan.insert()
	* @see 	Page.setSectionNewId()
	* @see 	ElementModal.getElementHtml()
	*@see 	ManagerModal.addTemplateModal()
	*/
	this.getNewElmId = function(elmClass)
	{		
		var elm = Element.obj;
		var listElm = $("."+elmClass);
		var maxNum = this.getMaxNumberClass(listElm, "id"); //максимальное число
		var newId = elmClass+maxNum;
		return newId;
	};

	/**
	* Получить id нового элемента
	*
	* @see 	ElementBasic.createElement(), .setEventEnterClass()
	* @see 	StyleMenuFixed.editClass()
	* @see 	ElementSettingGrid.setCountColumnElement();
	* @see 	ElementColumn.getElementHtml() (element_layout.js)
	* @see 	ElementForm.getElementHtml()
	* @see 	ElementModal.getElementHtml()
	* @see 	ElementMan.insert()
	*/
	this.getNewClassUnique = function(elmClass, elmType)
	{	
		// elmClass = "hlp-" + elmClass;
		
		var elm = Element.obj;
		if (!elmType) elmType = this.getTypeByParent(elm);
		
		var listElm = this.getListElmClass(elm, elmClass);//выборка этого класса
		// var maxNum = this.getMaxNumberClass(listElm, "class-unique"); //максимальное число
		var maxNum = this.getMaxNumberOnlyClass(elmClass, false, elmType, elm);	

		// получаем класс
		var newClass = this.attachNewClass(elmClass, maxNum, elmType, elm);

		// удаляем стили если есть
		var elmStyle = $("style[id^='style_"+newClass+"']");
		if (elmStyle.length) ElementCss.deleteByClass(newClass);

		// добавляем классу префикс
		newClass = this.addClassPrefix(newClass);

		return newClass;
	};

	/**
	* Отдает тип по родитю
	* 
	* @see 	this.getNewClassUnique()
	*/
	this.getTypeByParent = function(elm)
	{
		if (!elm || !elm.length) return "";
		var elmClass = elm.attr("elm-type");

		var typeElm = "";
		if (elm.closest(".modal").length && elmClass != "modal") { //модальное
			var typeElm = "modal";
		}

		return typeElm;
	} 

	/**
	* Отдает элементы определенного класса(типа)
	*
	* @see 	this.getNewClassUnique()	
	*/
	this.getListElmClass = function(elm, elmClass)
	{
		var parentObj = $("body");
		var elmType = this.getTypeByParent(elm);
		var listElm = '';

		if (elmClass == "modal") {
			listElm = $('.modal');
		} else if (elm.closest(".modal").length) {
			listElm = $('.modal .'+elmClass);
		} else if (elmType == "frame") {
			listElm = $(".site > .section").find("."+elmClass);

		} else {
			listElm = parentObj.find('.'+elmClass);
			var exeption = $('.'+elmClass).parent().closest(".modal");//потомки modal
			listElm = listElm.not(exeption);
		}

		return listElm;
	}

	/**
	* Отдает максимамльное число класса
	*
	* @see 	this.getNewClassUnique()
	* @see 	ElementSection.getElementHtml()
	* @see 	ElementModal.create()
	* @see 	ManagerModal.addNewPageInList(), .addTemplateModal()
	*/
	this.getMaxNumberClass = function(listElm, attrElm)
	{
		var maxNum = 0; //максимальное число
		var countElm = listElm.length;
		
		for (var i = 0; i < countElm; i++) {
			var item = listElm.eq(i);
			var currentClass = item.attr(attrElm);
			if (currentClass) {
				currentClass = currentClass.replace(/^m[0-9]+/g, '');
				var curNum = parseInt(currentClass.match(/[0-9]+$/gim));
				if (curNum > maxNum) maxNum = curNum;
			}
		}

		maxNum++;

		return maxNum;
	}

	/**
	* Отдаем max значение только для классов
	*
	* @see 	this.getNewClassUnique()
	* @see 	this.getNewClassAdded()
	*/
	this.getMaxNumberOnlyClass = function(classElm, isAddedClass, elmType, elm)
	{	
		ElementMan.setBufferInPage();

		if (isAddedClass) var classMain = classElm; 
		else var classMain = classElm.replace(/-?[0-9]+$/, '');  

		// добавляем классу префикс
		classMain = this.addClassPrefix(classMain);
		
		for (var maxNum = 1; maxNum < 500; maxNum++) {
			var classPart = classMain + "-" + maxNum;
			if (isAddedClass) {
				var classItem = classPart;
			} else {
				var classItem = this.attachNewClass(classMain, maxNum, elmType, elm);
			}
			
			var elmItem = $("." + classItem);
			if (!elmItem.length) break;
		}

		ElementMan.clearBufferInPage();

		return maxNum;
	}

	/**
	* Сформировывает новый класс
	*
	* @see 	this.getNewClassUnique()
	*/
	this.attachNewClass = function(elmClass, maxNum, elmType, elm)
	{
		// если элемент каркаса то добавляем к классу 
		var partClass = '';

		// if (elmClass == "modal") {
		// 	partClass = '';
		// } else if (elm.closest(".modal").length || elmType == "modal") {
		// 	var modalId = elm.closest(".modal").attr("elm-id");
			
		// 	if (!modalId) modalId = "modal-1";
		// 	var modalNum = modalId.replace(/[^0-9]+/, '');
		// 	partClass = "m"+modalNum+"-";
		// } else if (elmType == "frame") {
		// 	partClass = "m-";
		// } 
		
		// новый класс
		var newClass = partClass+elmClass+"-"+maxNum;

		return newClass;
	}

	/**
	* Очищает класс
	*
	* @see 	ElementBasic.setEventEnterClass()
	* @see 	StyleMenuFixed.editClass(), .setEventAddClass()
	*/ 
	this.clearClass = function(classElm)
	{
		classElm = classElm.replace(/\s/gim, '-');
		classElm = classElm.replace(/[^\w\-]+/gim, '');

		// только числа
		if (classElm.match(/^[0-9]+/gim, '')) {
			classElm = "c" + classElm;
		}

		return classElm;
	}
/***************************************************************************************/
	/**
	* Отдает новый id
	*
	* @see 	ElementBasic.create()
	* @see 	ElementMan.insert()
	* @see 	Page.replace()
	* @see 	ElementModal.create(), .addNewPageInList
	* @see 	ElementNavPanelMobile.create()
	* @see 	ElementSettingGrid.editCountRow(), .editDesctopCount()
	* @see 	TemplateSection.insertTemplatePage()
	* @see 	ElementModal.setStyleModalClose()
	* @see 	ElementWidgetBasicList.addItem()
	* @see 	PrivacyPolicy.addPersonalData()
	*/
	this.addNewId = function(elm, replaceIdV)
	{
		if (elm.hasClass("column")) elm = elm.closest(".row");

		// сам элемент
		var newId = this.getNewId(elm);
		if (!elm.attr("data-id") || replaceIdV) elm.attr("data-id", newId);
		
		// потомки элемента
		var listChild = elm.find(".element");
		var countChild = listChild.length; 
		for (var iChild = 0; iChild < countChild; iChild++) {
			var elmChild = listChild.eq(iChild);
			if (elmChild.attr("data-id") && !replaceIdV) continue;

			var newId = this.getNewId(elmChild);
			elmChild.attr("data-id", newId);
		}
	}	

	/**
	* Отдает новый id
	*
	* @see 	this.addNewId()
	*/
	this.getNewId = function(elm)
	{
		var lastId = parseInt(Data.page.data.last_id);
		if (!lastId) lastId = 0;
		lastId++;
		Data.page.data.last_id = lastId;
		var newId = "i-p"+Page.getId()+"-"+lastId;

		if ($("*[data-id='"+newId+"']").length) newId = this.getNewId(elm);

		return newId;
	}


	/**
	* Отдает id  элемента
	*
	* @see 	ElementSettingClick.setListSection() 
	*/
	this.getDataId = function(elm)
	{
		if (!elm) elm = this.obj;
		return elm.attr("data-id");
	}
/*********************************************************************************************/
	/**
	* Отдает все объект
	*
	* @see 	StyleCanvas.setEventMoveElement()
	* @see 	ElementCss.set()
	* @see 	Resize.setEvent()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleMenu.valueBgColorPicker()
	* @see 	ElementStyleController.setEventElmState()
	* @see 	ElementCss.getStyle()
	* @see 	StyleMenuGeometry.editFloatSide(), .editFillVacuum()
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.getAllObject = function(elm, noAdded, isUniqueCls)
	{
		// если уникальный класс
		if (isUniqueCls) {
			var listElm = $("."+this.getClassUnique(elm));
		} else {
			var listElm = $("."+this.getCurrentClass(elm));
		}

		// если не надо added и текущий не added
		if (noAdded && !this.existClassAdded(elm)) {
			listElm = listElm.filter(function() {
				return $(this).attr("class-added") ? false : true;
			});
		}

		if (!listElm.length) listElm = elm;

		return listElm;
	}


	/**
	* Отдает уникальный класс элемента
	*
	* @see 	this.getAllObject()
	* @see 	this.setData()
	* @see 	PageStruct.getStruct()
	* @see 	ElementMan.getHtmlElmAll()
	* @see 	ElementSettingFixed.setClassAdded()
	* @see 	ElementCss.delete()
	* @see 	ElementSettingClick.setListSection()
	* @see 	StyleUnit.setMenuProperty()
	* @see 	TemplateSection.getNewTemplateCss()
	* @see 	PageStruct.getSelectorForVisible()
	*/
	this.getClassUnique = function(elm)
	{
		if (!elm) elm = this.obj;
		else if (!elm.length) elm = this.obj;

		// уникальный класс есть
		var elmClass = elm.attr("class-unique");
		if (elmClass) return elmClass;

		if (!elmClass) {
			var elmChildFormV = this.isElmChildForm(elm);
			if (elmChildFormV) {
				var parentElmV = elm.closest(".form");
			} else {
				var parentElmV = elm.parent().closest("[class-unique], [class-added]");
			}
			
			if (parentElmV.attr("class-added")) {
				var parentClass = parentElmV.attr("class-added"); 
			} else {
				var parentClass = parentElmV.attr("class-unique");
			}

			var isParentClassV = elm.parent().attr("class-unique");
			if (isParentClassV && !elmChildFormV && !elm.hasClass("nav-item")) {
				var directChild = ' >';
			} else {
				var directChild = '';
			}

			var elmClassListPart = elm.attr("class").match(/[^\s]+/gim);
			elmClassPart = elmClassListPart[1];
			if (!elmClassPart) elmClassPart = elm.attr("elm-type");
			if (!elmClassPart) elmClassPart = elmClassListPart[0];

			elmClass = parentClass+directChild+" ."+elmClassPart;
		} 

		return elmClass;
	}

	/**
	* Элемент формы
	*
	* @see 	this.getClassUnique()
	* @see 	StyleUnit.getDefaultUnit()
	*/
	this.isElmChildForm = function(elm)
	{
		if (!elm) elm = Element.obj;

		if (elm.hasClass("submit")
				|| elm.hasClass("input")
				|| elm.hasClass("textarea")
				|| elm.hasClass("hlp-select")
				|| elm.hasClass("select")
				|| elm.hasClass("checkbox")
				|| elm.hasClass("radio")
				|| elm.hasClass("label")

				|| elm.hasClass("hlp-upload-file-wrap")
				|| elm.hasClass("hlp-upload-file-name")
				|| elm.hasClass("hlp-upload-file")
				
			) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узначет есть такой класс или нет
	*
	* @see 	
	*/
	this.existsClassUnique = function(classElm)
	{
		return $(".element[class-unique='"+classElm+"']").length ? true : false;
	}

	/**
	* Отдает текущий класс
	*
	* @see 	ElementCss.getListValueVisible() 
	* @see 	ElementCss.setData()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	ElementSettingGrid.editMargin() 	
	* @see 	StyleMenuGeometry.getParentElmAlign()	
	* @see 	StyleCanvas.getNextElm()
	* @see 	ElementCss.delete()
	* @see 	this.get()
	* @see 	this.getAllObject()
	* @see 	PageStruct.createSectionNested()
	* @see 	PageStruct.getStruct()
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.getCurrentClass = function(elm)
	{
		if (!elm) elm = this.obj;
		var currentClass = this.getClassAdded(elm);
		if (!currentClass) currentClass = this.getClassUnique(elm);
		
		return currentClass;
	}

	/**
	* Отдает родителя
	*
	* @see 	Guides.getMaxOffsetLeft()
	* @see 	Guides.addItem()
	* @see 	Guides.guidesDown()
	* @see 	PageStruct.*()
	* @see 	this.getListElmClass()
	* @see 	ElementMan.insert()
	* @see 	ElementCss.deleteClass()
	*/
	this.getParentWrap = function(elm, isDelete)
	{
		if (!elm) elm = Element.obj;

		if (elm && elm.closest(".modal").length && isDelete) return $(".listModal");
		else if (Screen.isModal()) return $(".contentModal");
		else return $(".content .site");
	}


	/**
	* Отдает родителя
	*
	* @see 	ElementMan.insert(), .copy(), .cut()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	PageStruct.moveElm()
	*/
	this.getParent = function(elm)
	{
		if (!elm) elm = this.obj;
		if (!elm) return $(".site");

		var parentObj = elm.parent().closest(".element");
		if (parentObj.hasClass("section")) {
			parentObj = parentObj.find("> .section-content");
		}

		return parentObj;
	} 
/***********************************************************************************************/
	/**
	* Отдает дополнительный класс
	*
	* @see 	ElementSettingFixed.setClassAdded()
	* @see 	this.getCurrentClass()
	* @see 	ElementCss.delete()
	* @see 	ElementCss.manipAllBgOther()
	* @see 	TemplateSection.getNewTemplateCss()
	* @see 	PageStruct.getSelectorForVisible()
	*/
	this.getClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		var classAdded = elm.attr("class-added");
		return classAdded;
	}

	/**
	* Ставит новый дополнительный класс
	*
	* @see 	this.setNewClassAdded()
	* @see 	elements_z_longreads
	* @see 	ElementFixed.editClass()
	*/
	this.getNewClassAdded = function(elm, elmClass)
	{
		if (!elmClass) {
			elmClass = elm.attr("class-unique");
			if (!elmClass) elmClass = elm.attr("elm-type");
		}
		
		var listElm = this.getListElmClass(elm, elmClass);//выборка этого класса
		var maxNum = this.getMaxNumberOnlyClass(elmClass, true);

		var newClass = elmClass+'-'+maxNum;
		
		return newClass;
	}

	/**
	* Ставит новый дополнительный класс
	*
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.setNewClassAdded = function(elm)
	{
		var oldAddedClass = Element.getClassAdded(elm);
		var newAddedClass = this.getNewClassAdded(elm);

		elm.removeClass(oldAddedClass)
				.addClass(newAddedClass)
				.attr("class-added", newAddedClass);
	}

	/**
	* Добавляет класс
	*
	* @see 	StyleMenuFixed.setEventAdd()
	*/
	this.addClassAdded = function(value, elm)
	{
		if (!elm) elm = this.obj;

		value = value.trim().replace(/\s/gim, '-');
		elm.addClass(value).attr("class-added", value);
	}
	
	/**
	* Удаляет класс
	*
	* @see 	StyleMenuFixed.setEventDelete()
	*/
	this.removeClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		var elmClass = elm.attr("class-added");

		// удаляем с массива
		ElementCss.deleteClass(elmClass, elm);
		// убираем класс 
		elm.removeClass(elmClass).removeAttr("class-added");
	}

	/**
	* Узнает это элемент имеет класс или нет 
	*
	* @see 	this.isGeneral()
	* @see 	Element.clearAllStyleScreen()
	* @see 	ElementCss.getStyle()
	* @see 	StyleMenuBg.editBgStyle()
	* @see 	this.getAllObject()
	* @see 	StyleMenuGeometry.setMGMarginH()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	StyleUnit.setMenuProperty()
	* @see 	ElementCss.actionAfterClearing()
	* @see 	ElementSettingFixed.setVisible()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	*/
	this.existClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		return elm.attr("class-added") ? true : false;
	}
	
	/**
	* Элемент в обычном состоянии
	*
	* @see 	ElementBorder.editBorderSide()
	*/		
	this.isGeneral = function(elm)
	{
		if (!elm) elm = Element.obj;
		if (Screen.isDesktop() 
					&& this.isStateStatic(elm)
					&& !this.existClassAdded(elm)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узнает это дополнительный класс или нет 
	*
	* @see 	Element.getSelector()
	* @see 	ElementMenuFixed.setEventEditClass()
	*/
	this.isClassAdded = function(value)
	{
		return $(".element[class-added='"+value+"']").length;
	}

	/**
	* Узнает одинаковый или нет
	*
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.isEqual = function(objOne, objTwo)
	{
		return objOne.attr("data-id") == objTwo.attr("data-id");
	}


	/**
	* Копирует классы
	*
	*
	* TemplateSection.replaceClassTemplate()
	*/
	this.setNewClass = function(newElm)
	{
		var listElm = newElm;
		listElm = listElm.add(newElm.find(".element"));

		console.log(listElm.length)

		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var elmType = elmItem.attr("elm-type");

			if (!Element.isNoEditClass(elmItem)) {
				var classUnique = elmItem.attr("class-unique");
				var newClassUnique = this.getNewClassUnique(elmType);
				ElementCss.editClass("class-unique", classUnique, newClassUnique, elmItem);
				elmItem.attr("class-unique", newClassUnique);
			}

			var classAdded = elmItem.attr("class-added");
			if (classAdded) {
				var newClassAdded = this.getNewClassUnique(classAdded);
				ElementCss.editClass("class-added", classAdded, newClassAdded, elmItem);
				elmItem.attr("class-added", newClassAdded);
			}
		}

	}

/**********************************************************************************************/
	/**
	* Устанавливает определенный тип
	* @uses ListElementObject - ElementBasic
	* @see 	ElementStyleController.noteElement()
	* @see 	ElementMan.setParCutElm() 
	* @see 	ElementSelf.isNotFit()
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.setData = function(elm)
	{
		if (!elm) elm = this.obj;

		// ставим данные
		var key = elm.attr("elm-type");
		this.data = ListElementObject[key];
		
		//ставим объект
		this.oldObj = this.obj;
		if (!this.oldObj) this.oldObj = $(".site");

		this.obj = elm;//один 

		// ставим класс
		this.classUnique = this.getClassUnique();
	}

	/**
	* Отдает список объектов
	*
	* @see 	this.setData()
	*/
	this.getListObj = function(elm)
	{
		var classUnique = elm.attr("class-unique");
		var listObj = $("."+classUnique);

		return listObj;
	}

/*****************************************************************************************/
	/**
	* Отдает свойство элемента
	*
	* @uses ListElementObject - ElementBasic
	* @see 	ElementStyleController.actionBeforeSelected()
	*/
	this.getValueProperty = function(elm, property)
	{
		var key = this.getTypeById(elm.attr("id"));
		return ListElementObject[key][property];
	}
/****************************************************************************************/
	/**
	* Устанавливает стиль элемента
	*
	*
	*/
	this.setStyle = function(id)
	{
		// this.style = this.listStyle[id];
	}
/************************************************************************************************/
	
	/**
	* Float или нет
	*
	* @see 	StyleCanvas.getMaxLeft(), StyleCanvas.getNextElm()
	* @see 	StyleMenuGeometry.setAlign()
	* @see 	Resize.setMaxWidth()
	* @see 	Key.moveElm()
	*/
	this.isFloat = function(elm, statusFillVacuum)
	{
		if (!elm) elm = this.obj;

		if (elm.css("position") == "absolute") return false;

		var valueFloat = elm.css("float");
		var isFloatV =  valueFloat == "left" || valueFloat == "right" ? true : false;
		
		return isFloatV;
	}

/*************************************************************************************************/
	/**
	* Отдает padding по горизонтали
	*
	* @see 	StyleCanvas.getMaxLeft()
	* @see 	Resize.setEventMouseUp()
	* @see 	Resize.setEvent(), .addBlockModeSimple(), .setMaxWidth()
	* @see 	StyleMenuGeometry.setMarginH(), .setMarginV(), .setMGWidth()
	* @see 	StyleMenuGeometry.setWidth()
	* @see 	StyleMenuGeometry.setPosition()
	* @see 	ElementMan.getFullWidth()
	* @see 	ElemenSelf.getEmptyWidth()
	* @see 	this.getMaxLeft()
	* @see 	StyleCanvas.getParamsForMove()
	*/
	this.getWidth = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = this.getPaddingH(elm);
		var width = elm.width() + padding;

		return parseFloat(width);
	}

	/**
	* Отдает высоту
	*
	* @see 	StyleMenuGeometry.setMarginV(), StyleMenuGeometry.setHeight()
	* @see 	StyleMenuGeometry.setPosition()
	* @see 	Resize.addBlockModeSimple()
	*/
	this.getHeight = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = this.getPaddingV(elm);
		var height = elm.height() + padding;
		
		return parseFloat(height);
	}

	/**
	* Отдает padding по горизонтали
	*
	* @see 	this.getWidth()
	* @see 	Resize.setEvent()
	* @see 	Resize.setMaxWidth()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	*/
	this.getPaddingH = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = parseFloat(elm.css("padding-left"))+parseFloat(elm.css("padding-right"));
		var border = parseFloat(elm.css("border-left-width")) + parseFloat(elm.css("border-right-width"));
		return padding + border;
	}

	/**
	* Отдает padding по аертикали
	*
	* @see 	this.getHeight()
	*/
	this.getPaddingV = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = parseFloat(elm.css("padding-top"))+parseFloat(elm.css("padding-bottom"));
		var border = parseFloat(elm.css("border-top-width")) + parseFloat(elm.css("border-bottom-width"));
		return padding+border;
	}
/***********************************************************************************************/
	/**
	* Узнает позиция по середине или нет
	*
	* @see 	Resize.setEvent()
	*/
	this.isPositionCenter = function(elm) 
	{
		if (!elm) elm = Element.obj;

		var marginLeft = $(".valueMarginLeft").val();
		var marginRight = $(".valueMarginRight").val();

		if (marginLeft == "auto" 
				&& marginRight == "auto" 
				&& elm.css("position") != "absolute") return true;
		else if (elm.hasClass("modal")) return true;
		else return false;
	}

	/**
	* Узнает есть следующий элемент
	*
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	this.getMaxLeft()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	Resize.setPropetyModeSimple()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	ElementSelf.insertElement()
	*/
	this.getNextElm = function(elm, allElm)
	{
		return this.getNearElm(elm, "next", allElm);
	}


	/**
	* Отдает предыдущий элемент
	*
	* @see 	StylePosition.addRightPrevLeft()
	* @see 	Resize.setPropetyModeSimple()
	* @see 	ElementManController.setEventModeSimpleMove()
	*/
	this.getPrevElm = function(elm, allElm)
	{
		return this.getNearElm(elm, "prev", allElm);
	}

	/**
	* Отдает ближайший элемент
	*
	* @see 	this.getNextElm()
	* @see 	this.getPrevElm()
	*/
	this.getNearElm = function(elm, type, allElm)
	{
		if (!elm) elm = Element.obj;

		if (!StylePosition.isStatic() 
				|| (!this.isFloat(elm, true) && !allElm) ) return false;


		var nearElm = elm;
		var floatSide = elm.css("float");

		for (var i = 0; i < 50; i++) {
			if (type == "prev") nearElm = nearElm.prev();
			else nearElm = nearElm.next();

			// элемент что бы был виден
			if (!nearElm.length) return false; 
			else if (nearElm.hasClass("page")) return false; 

			// если есть элемент то отдаем его сразу
			if (nearElm.css("display") != "none" 
				&& nearElm.hasClass("element")
				&& (floatSide == nearElm.css("float") || allElm)
				&& nearElm.css("position") != "absolute"
				) return nearElm; 
		}

	}
/*************************************************************************************************/
	/**
	* Отдает максимальное значение в лево
	*
	* @see 	StylePosition.setProperty()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	*/
	this.getMaxLeft = function(property, elm)
	{ 	
		if (!elm) elm = Element.obj;
		var width = Element.getWidth();
		var parentWidth = this.getParentWidth(elm);
		var maxLeft = parentWidth - width;

		return maxLeft; 
	}

	/**
	* Отдает ширину родителя
	*
	* @see 	this.getMaxLeft()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleCanvas.setMaxWidth()
	* @see 	StyleUnit.getParentValue()
	*/
	this.getParentWidth = function(elm)
	{
		var parentElm = elm.parent();
		if (elm.css("position") == "absolute") {
			if (parentElm.hasClass("section-content")) parentElm = parentElm.parent();
			
			return Element.getWidth(parentElm);
		} else {
			return parentElm.width();
		}
	}

/**************************************************************************************************/
/**********************************************************************************************/
	/**
	* Узнает это id элемента каркаса или нет
	*
	* @see 	this.getNewClassUnique()
	* @see 	this.getNewId()
	* @see 	ElementSelf.insertElementSection()
	* @see 	ElementCss.getAllListStyle()
	* @see 	ElementMan.setIsFrameElm(), ElementMan.isInsertElm()
	* @see 	PageStruct.getListStructItem()
	* @see 	ElementCss.createListTagStyle(), .copyStyle()
	* @see 	this.getMaxNumberOnlyClass()
	* @see 	ElementBasic.isInterdictedClass()
	*/
	this.isElmFrame = function(elm)
	{
		return false;
	}

	/**
	*
	*
	* @see 	ElementModal.createAction(), .getNewModalId()
	* @see 	ManagerModal.getListModalParent(), .getModal(), .fix()
	* @see 	ElementBasic.isInterdictedClass()
	*/
	this.getSiteContentObj = function(elm)
	{
		return $(".contentItemPage > .element");
	}

	/**
	* Секция или нет
	*
	*
	* @see 	StyleMenuGeometry.setMGWidth(), editWidth()
	* @see 	StyleCanvas.getOffsetTop()
	*/
	this.isSection = function(elm)
	{

		if (elm.hasClass("section")) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Позиция absolute
	*
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.setAlign(0)
	*/
	this.isAbsolute = function(elm)
	{
		if (!elm) elm = this;
		return elm.css("position") == "absolute" ? true : false;
	}
/***************************************************************************************/
	/**
	* Отдает состояние элемента
	*
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	ElementCss.setData()
	* @see 	StyleMenu.valueBgColorPicker()
	* @see 	StyleMenuGeometry.setMGWidth()
	*/
	this.getState = function(elm)
	{
		if (!elm) elm = this.obj;
		
		var state = elm.attr("state");
		return !state || state == "static"  ? false : elm.attr("state");
	}

	/**
	* Ставит в состояние static
	*
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setStateStatic = function()
	{
		this.setState("static");
	}

	/**
	* Устанавливает состояние элемента
	*
	* @see 	this.setStateStatic()
	* @see 	ElementStyleController.setEventElmState()
	*/
	this.setState = function(stateType)
	{
		Select.set($(".selectElmState"), stateType);
		
		var elm = Element.obj;

		var listElm = elm;
		if (elm.hasClass("section")) {
			var childSection = elm.find(".element, .section-content");
			listElm = listElm.add(childSection);
		}

		if (stateType != "static") listElm.attr("state", stateType);
		else listElm.removeAttr("state");
	}

	/**
	* Удалить состояние
	*
	*
	* @see 	ElementStyleController.noteElement();
	*/
	this.removeState = function()
	{
		var elm = Element.obj;
		if (!elm.closest("[state='fixed']").length) {
			$(".element, .section-content").removeAttr("state");
		}

		// $(".element").removeAttr("state");
		var elmStateV = elm.attr("state");
		if (!elmStateV) elmStateV = "static";
		Select.set($(".selectElmState"), elmStateV);
	}

	/**
	* Показать кнопку статуса
	*
	* @see 	this.setStateElm()
	*/
	this.showButState = function(state)
	{
		$(".blockTypeState").find(".menuButValue").filter("[value='"+state+"']").css("display", "block");	
	}

	/**
	* Отдает состояние элемента
	*
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	StyleMenuBg.editSize()
	* @see 	StyleMenuBg.editImageStyle()
	*/
	this.isState = function(elm)
	{
		if (!elm) elm = this.obj;
		var state = elm.attr("state");
		return !state || state == "static"  ? true : false;
	}

	/**
	* Состояние статик
	*
	* @see 	this.isGeneral()
	* @see 	StyleMenuBorder.edit()
	*/
	this.isStateStatic = function(elm)
	{
		return this.isState(elm);
	}
		
/*********************************************************************************/
	
	/**
	* Мани
	*
	* @see 	ElementManController.setEventStandart()
	* @see 	ModeSimple.setPropetyModeSimple()
	* @see 	PageStruct.isMoveElm()
	*/
	this.isManipulation = function(elm, typeOperation)
	{
		if (!elm) elm = Element.obj;
		
		if (Element.data.no_manipulation 
				|| elm.attr("data-property-no-manipulation") == "true" ) {
			if (typeOperation != "insert") return false;
			else return true;
		} else {
			return true;
		}
	}

/*******************************************************************************************/

	/**
	* Для секции - стили для контента
	*
	* @see 	this.StyleUnit.js
	*/
	this.isSectionContentStyle = function(elm, style)
	{
		if (elm.hasClass("section-content")) elm = elm.parent();

		if (elm.hasClass("section")	
				&& !Element.existClassAdded(this.elm)
				&& (style == "width" || style == "min-width" || style == "max-width")) {
			return true;
		} else {
			return false;
		}
	}

/*******************************************************************************************/
/*******************************************************************************************/
	/**
	* Отдает элемент для изменения стиля
	*
	* @see StyleMenuGeometry.*
	*/
	this.getForEditStyle = function(elm, propertyV)
	{
		if (this.existsStyleContent(propertyV) || !propertyV) {
			if (elm.hasClass("section")) {
				elm = elm.find(" > .section-content");
			} else if (elm.hasClass("hlp-slider") 
							&& propertyV != "padding-left"
							&& propertyV != "padding-right") {
				elm = elm.find(".hlp-slider-item");
			} else if (elm.hasClass("hlp-tabs")) {
				elm = elm.find(".hlp-tabs-item");
			}
		} 

		return elm;
	}

	/**
	* Есть стиль у контента или нет
	*
	* @see 	ElementCss.set()
	*/
	this.isEditContentStyle = function(elm)
	{
		if (elm.hasClass("section") 
				|| elm.hasClass("hlp-slider")
				|| elm.hasClass("hlp-tabs")) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узнает есть такой стили или нет у контента
	*
	* @see 	this.getForEditStyle()
	* @see 	this.existsListStyleContent()
	*/
	this.existsStyleContent = function(propertyV)
	{
		if (propertyV == "height"
				|| propertyV == "min-height"
				|| propertyV == "max-height"
				|| propertyV == "padding-top"
				|| propertyV == "padding-right"
				|| propertyV == "padding-bottom"
				|| propertyV == "padding-left") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Е
	*
	* @see 	ElementCss.set()
	*/
	this.existsListStyleContent = function(listStyleV)
	{
		for (var styleV in listStyleV) {
			if (this.existsStyleContent(styleV)) return true;
		}
	}

	/**
	*
	*
	* @see 	ElementSettingFixed.setVisible()
	*/
	this.isSettingVisible = function(elm)
	{
		if (elm.hasClass("site") 
				|| elm.hasClass("row")
				|| elm.hasClass("hlp-slider-bullet")
				|| elm.hasClass("hlp-slider-arrow")
				|| elm.hasClass("hlp-slider-arrow-img")) {
			return false;
		} else {
			return true;
		}
	}

	/**
	* Отдает объект
	*
	*
	*/
	this.getObj = function()
	{
		return this.obj;
	}

	/**
	* Устанавливает объект
	*
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.setObj = function(elm)
	{
		this.obj = elm;
	}

	/**
	* Устанавливает объект
	*
	* @see 	ElementBasicType.addListElm()
	* @see 	ElementCss.getSelector()
	*/
	this.getAttrSelector = function()
	{
		return "data-hlp-selector";
	}

/*******************************************************************************************/

	this.getAttrTextContentBg = function()
	{
		return "is-color";
	}

	/**
	* Когда изменяется класс
	*
	* @see 	StyleMenuFixed.editClass() 
	* @see 	StyleMenuFixed.setEventAddClass()
	* @see 	ElementBasic.createAction()
	*/
	this.addStdAddedClass = function(originElmV, newElmV)
	{
		if (!originElmV.length) return false;

		// animated
		var eventTypeV = originElmV.attr("data-animated-event");
		if (eventTypeV) newElmV.attr("data-animated-event", eventTypeV);

		var anmTypeLoad = originElmV.attr("data-hlp-animated-load");
		var anmTypeScroll = originElmV.attr("data-hlp-animated-scroll");
		var anmTypeHover = originElmV.attr("data-hlp-animated-hover");
		

		if (anmTypeLoad) newElmV.attr("data-hlp-animated-load", anmTypeLoad);
		if (anmTypeScroll) newElmV.attr("data-hlp-animated-scroll", anmTypeScroll);
		if (anmTypeHover) newElmV.attr("data-hlp-animated-hover", anmTypeHover);
		
		//bg text
		var attrIsColorV = this.getAttrTextContentBg();
		var isColorConV = originElmV.find("> .element-content["+attrIsColorV+"='true']").length;
		if (isColorConV) newElmV.find("> .element-content").attr(attrIsColorV, "true");
		
		// position
		var attrPosSide = StyleMenuGeometry.getAttrPositionSide();
		var posAbsoluteSide = originElmV.attr(attrPosSide);
		if (posAbsoluteSide) newElmV.attr(attrPosSide, posAbsoluteSide);
	}

/*******************************************************************************************/
	
	/**
	* Заменяет тег у элемента
	*
	* @see 	ElementSettingHeading.edit()
	* @see 	ElementSettingClick.editActionType()
	*/
	this.replaceTag = function(elm, tag)
	{
		// заменяем
		var block = ElementMan.getHtmlElmAll(elm, false, tag);
		elm.replaceWith(block);
		
		//ставим события и эмитируем клик по элементу
		var newObjV = $("*[status='new']").removeAttr("status");
		this.setObj(newObjV);

		Input.newCanvas();
		Resize.create();
			
		return newObjV;
	}


/*******************************************************************************************/
	
	/**
	* Элемент колонка
	*
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	PageStruct.moveElm()
	*/
	this.isColumn = function(elm)
	{
		return elm.hasClass("column");
	}

	/**
	* Элемент span
	*
	* @see 	TextEditor.setTextInElm()
	*/
	this.isTypeTextSpan = function(elm)
	{	
		if (!elm) elm = this.getObj();
		return elm.hasClass("text-span");
	}

	this.isNoEditClass = function(elm)
	{
		return elm.attr("data-property-no-edit-class");
	}

/*******************************************************************************************/
	
	/**
	* Перезагрузка элемента
	*
	* @see 	ElementSettingForm.editCheckboxChecked()
	*/	
	this.reload = function(elm)
	{
		var blockHtml = ElementMan.getHtmlElmAll(elm, true);

		elm.after(blockHtml);
		Input.newCanvas();
		
		var newElm = elm.next();
		elm.remove();
		newElm.removeClass("elementSelected").mousedown().mouseup();
	}


/**********************************************************************************************/
/***для многостраничника*******************************************************************************************/
	/**
	* Добавляет префикс классу
	*
	* @see 	this.getNewClassUnique()
	* @see 	StyleMenuFixed.editClass()
	* @see 	ElementModal.createAction()
	* @see 	TemplateSection.replaceClassTemplate()
	*/
	this.addClassPrefix = function(newClass)
	{
		if (Page.isTypeMain()) {
			var pageName = Page.getName();
			var patName = new RegExp("^"+pageName+"-", "i");
			newClass = newClass.toString().replace(patName, '');
			newClass = pageName+"-"+newClass;
		}

		return newClass;
	}
	
/*******************************************************************************************/
/*******************************************************************************************/

}//конец класса


