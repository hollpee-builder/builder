/**
* Создание элемента
*
* @parent  	ElementSelf  		
*
*/ 
ElementMan.prototype = ElementSelf;
var ElementMan = new ElementMan();
ElementMan.parent = ElementSelf;
function ElementMan()  
{
	/**
	* @var 	array		 	данные элементов(самого элемента и его потомков) кот скопировали
	* @set 	this.copyDataElm()
	*/
	this.elm_data = {};

	/**
	* @var 	string 			тип операции(copy|cut)	
	* @set 	this.copy(), this.cut()
	* @see 	this.insert()
	*/
	this.operationType = '';

	/**
	* @var 	int 				top скопираваного элемента	
	* @set 	this.copy()
	* @see 	this.setVarCopyInsert()
	*/
	this.copy_top = '';
	/**
	* @var 	int 				left скопираваного элемента	
	* @set 	this.copy()
	* @see 	this.setVarCopyInsert()
	*/
	this.copy_left = '';

	/**
	* Статус элемента в каркасе он или нет
	*
	*/
	this.isFrameElmV = false;

	/**
	* Колонка или нет
	*
	*/
	this.isColumn = false;

	this.elmOrigin;
/**********************************************************************************/
	/**
	* Копирование элемента
	*
	* @see 	ElementManController.setEvent() 			 	 	
	* @see 	Key.key67()	
	*/
	this.copy = function()
	{
		var elm = Element.obj;

		// фиксируем сам элемнт и родителя
		this.elmOrigin = elm;

		//устанавливаем тип операции
		this.operationType = 'copy';
		//помещяем элемент в буффер
		this.insertElmInBuffer('new');
		//скопировать даные копируемого элемента
		this.copyDataElm();
		//статус колонки
		this.isColumn = Element.data.type == "column" ? true : false;
		this.elmType = Element.data.type;
		
		// делаем активной кнопку вставить
		$(".topMenuInsert").attr("status", "true");

		/*************/
		this.isNewClass = false;
		/*************/
	};

	/**
	* Вырезать элемент
	*
	* @see 	ElementManController.setEvent() 
	* @see 	ElementManController.moveDownSection()
	* @see 	ElementManController.moveUpSection()			 	 	
	* @see 	PageStruct.moveElm()
	* @see 	Key.key88()	
	*/
	this.cut = function()
	{
		var elm = Element.obj;
		
		this.elmOrigin = elm;

		var type = Element.data.type;
		this.operationType = 'cut';

		//помещяем элемент в буффер
		this.insertElmInBuffer('old');
		// ширина
		this.width = this.getFullWidth(elm);
		//статус колонки
		this.isColumn = type == "column" ? true : false;
		this.elmType = Element.data.type;

		//удаляем элемент c полотна
		if (type != "column") this.deleteElement(elm, Element.data.type);
		else elm.html("");//просто очищаем
		
		// строим структуру
		PageStruct.build();
	};

/****************************************************************************************/
	/**
	* Поместить элемент в буфер
	*
	* @see 	this.copy(), this.cut()
	* @see 	ElementManController.moveUpSection()	
	*/
	this.insertElmInBuffer = function(elm_status)
	{
		var elm = Element.obj;
		//устанавливаем тип элемента
		this.type = Element.data.type;

		//получить html элемента
		// если это колонка, отдаем просто содержимое 
		if (this.type == "column") var block = elm.html();
		else var block = this.getHtmlElmAll();

		//вставляем в хранилище
		this.bufferHtml = block;
		// var buffer = $('.bufferElementInsert');
		// buffer.html(block).find(".elementSelected")
		// 						.removeClass("elementSelected")
		// 						.find(".resizeBlock, .addedBlock")
		// 						.remove();

		// this.bufferHtml = buffer.html(block);
		// buffer.html('');	

		return block;				
	}

	/*
	* Очищает buffer
	*
	* @see ManagerPage.chosenItem()
	*/
	this.clearBuffer = function()
	{
		// $('.bufferElementInsert').html('');
		this.bufferHtml = false;
	}

	/**
	* Отдает элемент с оболочкой
	*
	* @see 	this.getHtmlElmAll()
	* @see 	this.delete()
	* @see 	this.deleteElement()
	*/
	this.getElmWithWrap = function(elm)
	{
		if (!elm) elm = Element.obj;
		return elm;
	}

	/**
	* Получить элемент полностью
	*
	* @param 	string 		status-тип элемента(new|old)
	* 
	* @see 	this.insertElmInBuffer()
	* @see 	PageStruct.moveElm() 
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	ElementManController.setEventModeSimpleCopy()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	StyleCanvas.setNewFloatSide()
	* @see 	ElementSettingHeading.edit()
	*/
	this.getHtmlElmAll = function(elm, noNew, elm_tag)
	{
		elm = this.getElmWithWrap(elm);

		// параметры элемента
		if (!elm_tag) elm_tag = elm[0].tagName.toLowerCase(); //имя тега	
		
		//содержимое	
		Resize.remove();
		var elm_block = elm.html();
		Resize.create();

		// список атрибутов
		var listAttrString = '';
		var listAttr = elm[0].attributes;
		var countAttr = listAttr.length;
		for (var i = 0; i < countAttr; i++) {
			var attr = listAttr[i];
			listAttrString += attr.nodeName+'="'+attr.nodeValue+'" '
		}	
		
		var attrNew = noNew ? '' : 'status="new"';

		var block = '<'+elm_tag+' '+listAttrString+' '+attrNew+'>'
						+elm_block+
					'</'+elm_tag+'>';
		return block;
	};


	/**
	* Скопировать даные копируемого элемента
	*
	* @uses 	this.elm_data 	устанавливаем значение
	* @see 		this.copy();
	*/
	this.copyDataElm = function()
	{
		var data = {};
		
		var elm = Element.obj;
		data[0] = {"id":elm.attr("id")}; 


		//если есть потомки у скопиравонного элемента
		var listChild = elm.find(".element");
		var countChild = listChild.length;
		//проходим циклом потомков
		for (var i = 0; i < countChild; i++) {
			var child = listChild.eq(i);
			data[i+1] = {"id":child.attr("id")};
		}	

		//помещаем в переменую
		this.elm_data = data;
		// ширина
		this.width = this.getFullWidth(elm);
	}


/**********************************************************************************/
	
	/**
	* УСтанавливает буффер на страницу
	*
	* @see 	Element.getMaxNumberOnlyClass();
	*/
	this.setBufferInPage = function()
	{
		$(".bufferElementWork").html(this.bufferHtml);
	}

	/**
	* Очищает буффер с страницы
	*
	* @see 	Element.getMaxNumberOnlyClass();
	*/
	this.clearBufferInPage = function()
	{
		$(".bufferElementWork").html('');	
	}

	/**
	*
	*
	* @see 	PageSetting.setEventSeo()
	*/
	this.getBuffer = function()
	{
		return $(".bufferElementWork");
	}

/***********************************************************************************************/
	/**
	* Отдает ширину элемента
	*
	* @see 	this.cut()
	* @see 	this.copyDataElm()
	*/
	this.getFullWidth = function(elm)
	{
		var margin = parseInt(elm.css("margin-left"));
		var width = Element.getWidth() + margin;	

		// return width;
		return Element.getWidth();
	}

/*********************************************************************************************/
/********************************************************************************************/
	/**
	* Можно вставить элемент или нет
	*
	* @see 	Editor.setMenuButtonInactive()
	*/
	this.isInsertElm = function()
	{
		// элементы
		var elm = Element.obj;
		// типы
		var typeElm = Element.data.type;
		var typeElmInsert = this.elmType;

		// li
		if (typeElmInsert == "hlp-li" && !elm.closest(".hlp-ul, .hlp-ol").length) return false;
		// navitem
		if (typeElmInsert == "nav-item" && !elm.closest(".nav").length) return false;
		// если буффер не пустой и у них один родитель (frame|page)
		else if (this.bufferHtml) return true;
		else return false;
	}

	/**
	* Вставить элемент
	* @uses this.isNotFit()-parent(ElementSelf)
	* @see 	ElementManController.setEvent() 			 	 	
	* @see 	ElementManController.moveDownSection()
	* @see 	ElementManController.moveUpSection()
	* @see 	PageStruct.moveElm()
	* @see 	Key.key86()
	*/
	this.insert = function(typeInsert)
	{
		if (!this.isInsertElm()) return false;
 
		var elm = Element.obj;
		
		//блок элемента который надо вставить на страницу
		var elm_block = this.bufferHtml;
		if (!elm_block) return false;

		//вставляем элемент на страницу
		$(".element").removeAttr("status");
		
		typeInsert = this.getTypeInsert(typeInsert, elm);
		this.insertElement(elm_block, this.type, typeInsert);

		//новый элемент
		var newElm = Element.getParentWrap(elm).find('.element[status="new"]');
		if (!newElm.length) newElm = elm;
			
		//взависимости от того был элемент вырезан или скопиравон 
		if (this.operationType == 'cut') { 
			this.bufferHtml = false; // очищаем buffer
		} else {
			newElm.removeAttr("data-id").find("*").removeAttr("data-id");
			// ставим новый id
			Element.addNewId(newElm);

			// для секции для навигации
			if (newElm.hasClass("section")) {
				var elmNum = Element.getMaxNumberClass($(".section"), "data-num");
				newElm.attr("data-num", elmNum);
			}

			/*************/
			if (this.isNewClass) {
				Element.setNewClass(newElm);
			}
			/*************/
		}	

		//убираем атрибут отметку
		$("*").removeAttr('status');
		// стативм стили
		this.setStyle(newElm);
		// Эммитируем нажатие
		newElm.mousedown().mouseup();

		PageStruct.build(newElm);// строим структуру
		StyleCanvas.setScrollTopElm(newElm);// ставим scroll  на полотне
		
		// убираем пустые параграфы, не понятно почему они повляются
		$("p").filter(function() {
			return !$(this).attr("class") ? true : false; 
		}).remove();
	};


	/**
	* Отдает тип вставки
	*
	* @see 	this.insert()
	*/
	this.getTypeInsert = function(typeInsert, elm)
	{
		// если не вмещается, всавляем после элемента
		if (this.operationType == 'copy' 
				&& this.elmOrigin == elm) {
			typeInsert = "after";
		} else if (this.elmOrigin.attr("data-id") == elm.attr("data-id")) {
			typeInsert = "after";
		}

		return typeInsert;
	}

	this.setStyle = function(newElm)
	{
		// слишком большой margin-left
		if (newElm.hasClass("row")) return false;
		else if (newElm.hasClass("column")) return false;
		else if (newElm.hasClass("section")) return false;
		else if (newElm.css("position") == "absolute") return false;

		var elmWidth = Element.getWidth(newElm);
		var elmMarginLeft = parseInt(newElm.css("margin-left"));
		if (!elmMarginLeft) return false;
		var elmParentWidth = newElm.parent().width();

		var widthSpaceElm = elmWidth + elmMarginLeft;

		// слишком большой отступ
		if (widthSpaceElm > elmParentWidth) {
			newElm.css("margin-left", "0px");
			ElementCss.set(false, newElm);
		}
	}

/********************************************************************************************/
/**********************************************************************************************/
	/**
	* Удаление элемента
	*
	* @see 	Key.key8()
	* @see 	ManagerModal.deleteElm()
	*/
	this.delete = function(elm, noChosenAfterDeleteV)
	{
		if (!elm) elm = Element.obj;

		if (elm.closest(".modal").length && Screen.isModal()) ManagerModal.fix();

		// если это последняя секция на странице
		if (elm.hasClass("section") && elm.closest(".page").length) {
			var listSectionV = $(".content .page .section").not("[data-delete='true']");
			listSectionV = listSectionV.filter(function() {
				return $(this).css("display") != "none";
			});
			if (listSectionV.length == 1) {
				Notification.error(Resource.hlp_manipulation_notification_no_delete_last_section);
				return false;
			}
		}

		// elm на всю ширину, убираем класс
		if (elm.hasClass("hlp-elm-full-width")) {
			elm.closest(".hlp-section-static").removeClass("hlp-section-static");
		}

		// прячем элемент
		var type = Element.data.type;
		var parentElm = false;
		var elmDeleteObj = this.getElmWithWrap(elm);
		
		if (type != "column") {
			//родительский элемент
			var parentElm = this.getParSelectedElm(elm, type);
			elmDeleteObj.css("display", "none").attr("data-delete", "true");
			if (!noChosenAfterDeleteV) {
				parentElm.mousedown().mouseup();
			}
		} else {
			elm.find(">*").css("display", "none").attr("data-delete", "true");
		}

		// если есть в буффере
		this.clearBufferExiststDeleting(elm);

		// удаляем элемент

		var obj = this;
		setTimeout(function() {
			// если это колонка и она не пустая
			if (type == "column") {
				//убираем только потомков
				obj.deleteDataChildElm(elm); 
				elm.html("");
			} else {
				var bgImg = elm.css("background-image");
				obj.deleteDataElm(elm, type); //данные
				
				// для модального удаляем его оболочку 
				if (elm.hasClass("modal")) {
					var modalId = elm.attr("data-id");
					
					// на полотне
					$(".contentModal .modal[data-id='"+modalId+"']").remove();
					// удаляем в списке
					elmDeleteObj = $(".listModal .modal[data-id='"+modalId+"']").parent()
				}
				
				elmDeleteObj.remove();
			}

			// выделяем элемент
			if (parentElm) PageStruct.select(parentElm);
			// фиксируем историю
			History.record();
			// строим структуру
			PageStruct.build(parentElm);
		}, 300);	
	};
/******************************************************************************************/
	/**
	* Удалить элемент с полотна
	*
	* @see 	this.delete(), this.cut()
	*/
	this.deleteElement = function(elm, type, src)
	{
		//родительский элемент
		var parentElm = this.getParSelectedElm(elm, type);

		//удаляем элемент
		elm = this.getElmWithWrap(elm);
		elm.remove();

		/**
		* эмитируем клик на родителя, что бы он выбрался
		* @event 	ElementStyleController.setEventCanvas()
		*/
		parentElm.mousedown().mouseup();

		return parentElm;
	}

	/**
	* Отдает родителя выбраного элемента
	*
	* @uses 	Element.sel_type 	тип выбраного элемента
	* @see 		this.deleteElement()
	*/
	this.getParSelectedElm = function(elm, type)
	{
		//выбираем родителя удаляемого элемента
		//если это секция
		if (type == 'section') {
			//выделяем предыдущию секцию
			var elm_par = elm.next();
			//если ее нет то выбираем следующию секцию
			if (!elm_par.hasClass('section')) {
				elm_par = elm.prev();
			}
		} else {
			//родитель
			var elm_par = elm.parent().closest(".element");
		}

		return elm_par;
	};

	/**
	* Удаляет потомков
	*
	* @see 	this.delete()
	*/
	this.deleteDataChildElm = function(elm)
	{
		var listChildElm = elm.find(".element, .element-content");
		var countChild = listChildElm.length;

		for (var iChild = countChild - 1; iChild >= 0; iChild--) {
			var childElm = listChildElm.eq(iChild);
			// если есть в буффере
			this.clearBufferExiststDeleting(childElm);

			//удаляем из масиива css
			this.deleteElmClass(childElm);
			// кдаляем сам элемент
			childElm.remove();
		}
	}

	/**
	* Очищает буффер если там удаляемый элемент
	*
	* @see 	this.delete()
	* @see 	this.deleteDataChildElm()
	*/
	this.clearBufferExiststDeleting = function(elm)
	{
		if (this.bufferHtml) {
			var elmId = elm.attr("data-id");
			var patter = new RegExp('data-id="'+elmId+'"', "gim");
			var isExistsInBuffer = this.bufferHtml.match(patter);
			
			if (isExistsInBuffer) this.bufferHtml = '';
		}
	}

	/**
	* Очищает буффер
	*
	* @see 	EditorContoller.setEventTab()
	*/
	this.clearBuffer = function(elm)
	{
		this.bufferHtml = '';
	}

	/**
	* Удаляем данные элемента
	*
	* @see 	this.delete()
	*/
	this.deleteDataElm = function(listElm, type)
	{
		// если это колонка, удаляется и его братья
		// if (type == "column") listElm = listElm.parent().find(">.column");

		// удаляем элемнт (цикл нужен для колонок)
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var item = listElm.eq(iElm);
			//удаляем из масиива css
			this.deleteElmClass(item);

			// удаляем потомков
			this.deleteDataChildElm(item);
		}
	}

	/**
	* Удаляем классы элемента
	*
	* @see 	this.deleteDataElm()
	* @see 	this.deleteDataChildElm()
	*/
	this.deleteElmClass = function(elm)
	{
		ElementCss.delete(elm);
	}
/**********************************************************************************/
	

}//конец класса 


