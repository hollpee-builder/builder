/**
* Структура страницы
*
*
*/
var PageStruct = new PageStruct();
function PageStruct() {
	/**
	* Устанавливает структуру страницы
	*
	* @see 	ElementMan.delete(), ElementMan.insert(), ElementMan.cut()
	* @see 	BasicElement.create()
	* @see 	ElementSettingGrid.editDesctopCount(), .setEventDeleteColumn()
	* @see 	Input.newCanvas()
	* @see 	EditController.setEventTab()
	* @see 	StyleMenuFixed.updateEditorClass(), .editClass()
	* @see 	ElementNavPanelMobile.setDisplay()
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.build = function(elmSelected)
	{
		var parentElm = Element.getParentWrap();
		// получить структуру элементов
		var struct = this.getStruct(parentElm);
		struct = "<ul>"+struct+"</ul>";
		// вставляем блок
		$(".menuStruct").html(struct);
		// ставим событие
		this.setEvent();

		// выделяем элемент, если он есть
		if (elmSelected) PageStruct.select(elmSelected);
	}
/********************************************************************************************/
	/**
	* Получить список страниц
	*
	* @see 	this.build()
	*/
	this.getStruct = function(parent, level)
	{
		var listChild = '';
		// непосредственные потомки
		for (var i = 0; i < 100; i++) {
			if (!parent.length) break;//если пустой элемент
			listChild = parent.find("> .element, > .page, > .hlp-slider-list-item > .hlp-slider-item");	//непосредственные потомки
			if (listChild.length) break;//если потомки есть перекращаем цикл
			else parent = parent.children();//иначем опускаем вниз по дереву
		}

		var count = listChild.length;
		if (!count) return false;

		if (!level) level = 1;
		else level++;

		var block = '';
		// формируем один элемент
		for (var i = 0; i < count; i++) {
			var elm = listChild.eq(i);
			var elmId = elm.attr("data-id");
			var classUnique = Element.getClassUnique(elm);
			var type = elm.attr("elm-type");
			if (elm.hasClass("page")) type = "page";
			if (!type) type = elm.closest(".element").attr("elm-type");

			if (!type) continue;
			else if (type == "hlp-slider-list-bullets") continue;
			else if (type == "hlp-slider-bullet") continue;
			
			var name = Element.getCurrentClass(elm); //classUnique;
			var sectionTrue = elm.attr("section-main") ? 'section-main="true"' : '';
			var structChildrens = this.getStruct(elm, level);
			// если это родитель колонокстрока
			var isParentColumn = elm.hasClass("parentColumn") ? 'is-parent-column="true"' : '';
			var isChild = "false";
			
			if (elm.hasClass("page")) {
				name = "page";
				classUnique = "page";
			}

			if (structChildrens) {
				structChildrens = '<ul class="sctructChildrens">'+structChildrens+'</ul>'; 
				isChild = "true";
			} else {
				structChildrens = '';
			}

			if (type == "section" || type == "nav-panel-mobile") var isSection = true;
			else var isSection = false;

			name = this.getSelectorForVisible(elm);
			if (elm.hasClass("input") && elm.attr("type") == "hidden") {
				name = "hidden - " + elm.attr("name");
			}

			var structItemStyle = '';
			// если без id, то не активный 
			if (!elmId) {
				structItemStyle = 'opacity:0.5;cursor:default;';
				elmId = false;
			}

			var attrElmId = elmId ? 'elm-id="'+elmId+'"' : "";

			block += '\
				<li class="structItemWrap" section="'+isSection+'" type="'+type+'" status="show">\
					<div class="structItem" '+isParentColumn+' type="'+type+'" '+attrElmId+' '+sectionTrue+' elm-class-unique="'+classUnique+'" level="'+level+'">\
						<div class="structItemArrow" is-child="'+isChild+'" is-image="true"></div>\
						<span class="structItemName" style="'+structItemStyle+'">'+name+'</span>\
						<div class="clear"></div>\
					</div>'
					+structChildrens+
				'</li>';
		}

		return block;
	}

	/**
	* Устанавливает имя input в структуре
	*
	* @see 	ElementSettingForm.editInputTypeSelf(), .editInputName()
	*/
	this.setStructItemNameInput = function(elm)
	{
		var elmIdV = elm.attr("data-id");
		var elmNameV = "input";
		if (elm.attr("type") == "hidden") {
			elmNameV = "hidden - " + elm.attr("name");
		}

		$(".structItem[elm-id='"+elmIdV+"'] > .structItemName").text(elmNameV);
	}

/****************************************************************************************/
	/**
	* Выбрать элемент
	*
	* @see 	ElementStyleController.noteElement()
	* @see 	ElementMan.delete()
	* @see 	ElementMan.insert()
	* @see 	EditorController.setTabMenuRight()
	*/
	this.select = function(elm)
	{
		var elmId = elm.attr("data-id");

		// убираем выделение и сворачиваем секции
		$(".structItem").removeAttr("chosen");
		$(".structItemWrap[section='true']").attr("status", "hide");

		// ставим выделение и показываем секцию
		var selectedItem = $(".structItem[elm-id='"+elmId+"']");
		selectedItem.attr("chosen", "true");
		
		$(".structItemWrap").attr("status", "hide");
		// selectedItem.closest(".structItemWrap[section='true']").attr("status", "show");

		selectedItem = selectedItem.closest(".structItemWrap");

		for (var iIndex = 0; iIndex < 200; iIndex++) {
			selectedItem = selectedItem.parent().closest(".structItemWrap");
			if (!selectedItem.length) break;

			selectedItem.attr("status", "show");
		}

		// ставим скролл 
		var elmMenuStruct = $(".menuStruct");
		if (selectedItem.length) {
			var scroll = selectedItem.offset().top - elmMenuStruct.offset().top - 100;
		} else {
			var scroll = 0;
		}
		
		if (!this.noSetScrollTop) elmMenuStruct.scrollTop(scroll);
	}

/****************************************************************************************/
/*************************************************************************************/
	/**
	* Ставим событие на выбор
	*
	* @see 	this.build()
	*/
	this.setEvent = function()
	{
		var obj = this;
		$(".structItem").off("mousedown");
		$(".structItem").on("mousedown", function(event) {
			var elmEvent = $(this);
			var elmId = elmEvent.attr("elm-id");
			if (!elmId) return false;
			
			// фиксируем положение скролла
			var elmMenuStruct = $(".menuStruct");
			var scrollValue = elmMenuStruct.scrollTop();
			
			// выделяем элемент
			var elm = Element.getParentWrap().find(".element[data-id='"+elmId+"']"); 
			var isSelectedV = elm.hasClass("elementSelected");
			if (!isSelectedV) {
				obj.noSetScrollTop = true;
				elm.eq(0).mousedown().mouseup();
				setTimeout(function() {
					obj.noSetScrollTop = false;
				}, 200);
			}
				
			
			// ставим скролл в меню
			elmMenuStruct.scrollTop(scrollValue);

			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(elm); 

			// добавляем элемент передвижения
			obj.addItemMove(elmEvent);
			// ставим событие на передвижение
			obj.setEventMove(elmEvent);

			if (!isSelectedV) elmEvent.mouseup();

			return false;
		});

		var butArrowObj = $(".structItemArrow");
		butArrowObj.off("mousedown");
		butArrowObj.on("mousedown", function() {
			var itemObjV = $(this).closest(".structItemWrap");
			
			var itemStatusV = itemObjV.attr("status") == "hide" ? "show" : "hide";
			itemObjV.attr("status", itemStatusV);

			if (itemStatusV == "hide") {
				itemObjV.find(".structItemWrap").attr("status", "hide");
			}

			return false;
		});
	}

	/**
	* Добавляем элемент передвижения
	*
	* @see 	this.setEvent()
	*/
	this.addItemMove = function(elmEvent)
	{
		var type = elmEvent.attr("type");
		var elmId = elmEvent.attr("elm-id");
		var text = elmEvent.find(">span").text();

		var block = '\
			<div class="structItem structItemMove" type="'+type+'" elm-id="'+elmId+'">\
				<span>'+text+'</span>\
				<div class="clear"></div>\
			</div>';
		$("body").append(block);
	}

/************************************************************************************************/
/********************************************************************************************/
	/** 
	* Передвижение
	*
	* @see 	this.setEvent()
	*/
	this.setEventMove = function(elmEvent)
	{
		// передвижение элемента
		this.setEventMoveElm(elmEvent);
		// остановить передвижение
		this.setEventResetMove();
		// отметить выбраный
		this.setEventMarkSelected(elmEvent);	
	}

	/**
	* Передвижение элемента
	*
	* @see 	this.setEventMove()
	*/
	this.setEventMoveElm = function(elmEvent)
	{
		var menuStructOffset = $(".menuStruct").offset();
		var minLeft = menuStructOffset.left;
		var minTop = menuStructOffset.top;

		$("body").off("mousemove");
		$("body").on("mousemove", function(event) {
			var top = event.pageY;
			var left = event.pageX+20;
			// положение блока перемещения
			if (left < minLeft) left = minLeft;
			if (top < minTop) top = minTop;
			$(".structItemMove").css({"display":"block", "top":top, "left":left});

			return false;
		});
	}
/**************************************************************************************/
	/**
	* Сброс передвижекния
	*
	* @see 	this.setEventMove()
	*/
	this.setEventResetMove = function() {
		var obj = this;
		$("body").off("mouseup");
		$("body").on("mouseup", function() {

			//убираем событие
			$("body").off("mousemove");
			$("body").off("mouseup");
			$(".structItem").off("mousemove").removeAttr("no-show");
			$("*").removeAttr("insert-after");

			// перемещаем элемент
			obj.moveElm();

			// удаляем передвигаемый элемент
			$(".structItemMove").remove();
			$(".structItemLineSelect").remove();
			//показываем все элементы
			$(".structItem").attr("show", "true"); 
			// разворачиваем секцию если она есть
			var sectionShow = $(".structItemWrap[show-section='true']");
			if (sectionShow.length) sectionShow.removeAttr("show-section")
												.attr("status", "show");

			return false;
		});
	}

	/**
	* Перемещаем элемент
	*
	* @see 	this.setEventResetMove() 	
	*/ 
	this.moveElm = function()
	{
		// индекс элемента после которого нужно вставить
		var idInsertAfter = $(".structItemLineSelect[show='true']")
													.closest(".structItem")
													.attr("elm-id");
		if (!idInsertAfter) return false;

		var elm = Element.obj;
		var elmWidth = elm.width();
		var parentElm = Element.getParentWrap();
		var type = Element.data.type;
		// элемент после которого вставить
		var elmInsertAfter = parentElm.find(".element[data-id='"+idInsertAfter+"']"); 

		// html элемента
		var elmHtml = ElementMan.getHtmlElmAll();
		// если вставка внутри элемента
		var isPrepend = elmInsertAfter.find(".element[data-id='"+elm.attr("data-id")+"']").length;

		parentElm = Element.getParent(elm);
		
		var isColV = elm.hasClass("column");
		// удаляем элемент
		elm.remove();

		// вставляем
		if (elmInsertAfter.find(">.section-content").length && type != "section") {
			if (elmInsertAfter.hasClass("section")) {
				elmInsertAfter = elmInsertAfter.find(".section-content");
			}
			elmInsertAfter.prepend(elmHtml);
		} else if (elmInsertAfter.hasClass("nav-panel-mobile") && type != "section") {
			elmInsertAfter.prepend(elmHtml);
		// вставка в родителя
		} else if (isPrepend && (!elmInsertAfter.hasClass("row") || isColV)) {
			elmInsertAfter.prepend(elmHtml);
		} else { // после
			elmInsertAfter.after(elmHtml);
		}

		// ставим событие
		Input.newCanvas();

		// выделяем вставленый элемент
		$(".elementSelected").removeClass("elementSelected");
		var newElm = $("*[status='new']");
		newElm.removeAttr("status");

		Element.obj = newElm;
		Resize.create();
		this.select(newElm);

		// если колонка
		if (Element.isColumn(newElm)) {
			ElementSettingGrid.setColumnNoIndent();
		}

		// записываем в историю
		History.record();
	}
/***************************************************************************************/
	/**
	* Показывает выбраный
	*
	* @see 	this.setEventMove()
	*/
	this.setEventMarkSelected = function(currentStructItem)
	{
		// элементы структуры
		var listStructItem = this.getListStructItem(currentStructItem);
		
		if (listStructItem.length) {
			listStructItem.removeAttr("no-show");// осветляем активные
			// добавляем линую выбора
			listStructItem.not("[chosen='true']").append('<div class="structItemLineSelect"></div>');
		}
		
		// при наведении линия выбора появляется, а не активные элементы затемняются
		// событие передвижения
		this.setEventMarkSelectedMove(listStructItem, currentStructItem);
	}

	/**
	* Показывает выбраный - событие передвижение
	*
	* @see 	this.setEventMarkSelected(0)
	*/
	this.setEventMarkSelectedMove = function(listStructItem, currentStructItem)
	{
		if (!listStructItem.length) return false;
		var obj = this;
		var listElm = Element.getParentWrap().find(".element");
		var listStructItemLine = listStructItem.find(".structItemLineSelect");
		var currentId = currentStructItem.attr("elm-id");

		$(".structItem").off("mousemove");
		$(".structItem").on("mousemove", function(event) {
			var elmEvent = $(this);

			// показываем линию подчеркивания
			listStructItemLine.removeAttr("show");
			elmEvent.find(".structItemLineSelect").attr("show", "true");

			// отмечаем что он текущий
			listStructItem.removeAttr("current");
			elmEvent.attr("current", "true");

			// отмечаем элемент рамкой
			var elmId = elmEvent.attr("elm-id"); 
			listElm.add(".section-content").removeAttr("insert-after");
			if (elmEvent.attr("no-show") != "true" && currentId != elmId) {
				// отметить элемент после которого вставка
				var elmAfter = listElm.filter("[data-id='"+elmId+"']");
				if (elmAfter.hasClass("section")) {
					elmAfter.find(">.section-content").attr("insert-after", "true");
				} else {
					elmAfter.attr("insert-after", "true");
				}
				
				// ставим scroll
				StyleCanvas.setScrollTopElm(elmAfter);
			}
		});
	}
/*********************************************************************************************/
	/**
	* Отдает список элементов структуры
	*
	* @see this.setEventMarkSelected()
	*/
	this.getListStructItem = function(elmEvent)
	{
		var elm = Element.obj;
		var type = Element.data.type;
		var isParentColumn = elmEvent.attr("is-parent-column");

		// var listStructItem = $(".structItem:not(.structItemMove)");
		// var listStructItem = $(".structItem").not(elmEvent);
		var listStructItem = $(".structItem").not(".structItemMove").not(elmEvent);
		listStructItem.attr("no-show", "true");//затемняем все элементы

		// убираем предыдущий элемент
		listStructItem = listStructItem.not(elmEvent.parent().prev().find(">.structItem"));
		// убираем которые нельзя перемещать
		if (!elm.closest(".nav-panel-mobile").length) {
			listStructItem = listStructItem.not("[type='nav-panel-mobile']");
		}
		
		listStructItem = listStructItem.not("[type='nav-item-mobile']");
		listStructItem = listStructItem.not("[type='page']");
		// listStructItem = listStructItem.not("[type='text-span']");
		listStructItem = listStructItem.filter("[elm-id]");

		if (type != "nav-item") listStructItem = listStructItem.not("[type='nav-item']");
		if (type != "hlp-li") listStructItem = listStructItem.not("[type='hlp-li']");
		if (type != "column") listStructItem = listStructItem.not("[type='column']");

		// из site в page и наоборот запретить
		listStructItem = listStructItem.not("[section-main='true']");

		// фильтруем элементы
		if (!this.isMoveElm(elm, elmEvent, type)) { //элементы каркаса передвигать нельзя
			listStructItem = [];
		} else if (type == "section") {//если секция
			// фиксируем развернутый элемент, при отпускание разворачиваем обратно
			$(".structItemWrap[status='show']").attr("show-section", "true");
			// сворачиваем секции
			listStructItem.filter("[type='section']").parent().attr("status", "hide");
			listStructItem = listStructItem.not("[type='nav-panel-mobile']");
		} else if (isParentColumn) {//если родитель колонок
			var notListElm = $(".structItem[is-parent-column='true']").next().find(".structItem");
			listStructItem = listStructItem.not(notListElm);
		} else if (type == "row") { 
			//нельзя в потомки row
			var listStructRow = $(".structItem[type='row']").next().find(".structItem");
			listStructItem = listStructItem.not(listStructRow);
		} else if (type == "column") { // если колонка
			var listFilterColumn = elmEvent.closest(".sctructChildrens")
											.find(">li>.structItem");
			listStructItem = listStructItem.filter(listFilterColumn);
		} else if (elm.hasClass("nav-item")) {
			listStructItem = listStructItem.filter("[type='nav-item']");
		// потомки мобильной панели
		} else if (elm.closest(".nav-panel-mobile").length) {
			listStructItem = listStructItem.not("[type='section']");
		} else if (elm.hasClass("hlp-li")) {
			listStructItem = listStructItem.filter("[type='hlp-li']");
		} else { //все остальное
			
		}

		// добавляем родителя 
		var parentRowObj = elmEvent.closest(".sctructChildrens").prev();
		if (listStructItem.length) listStructItem = listStructItem.add(parentRowObj);


		// убираем всех потомков
		var child = elmEvent.next().find(".structItem");
		if (listStructItem.length) {
			listStructItem = listStructItem.not(child);
			listStructItem = listStructItem.not("[elm-class-unique='page']");
		} 

		return listStructItem;
	}

	/**
	* Статус передвижения элемента
	*
	*
	*/
	this.isMoveElm = function(elm, elmEvent, type)
	{
		if (	!Element.isManipulation()
				|| elm.hasClass("modal")
				|| elmEvent.attr("type") == "page"
				|| elm.hasClass("text-span")
				|| elm.hasClass("nav-panel-mobile")
				|| elm.hasClass("nav-item-mobile")
				) {
			return false;
		} else {
			return true;
		}
	}

/*************************************************************************************************/
/************************************************************************************************/
	/**
	* Вложеность элементов
	*
	* @see 	ElementStyleController.noteElement()
	* @see 	StyleMenuFixed.updateEditorClass(), .editClass()
	*/
	this.buildNested = function(elm)
	{
		if (!elm) elm = Element.obj;
		// создаем блок
		this.createSectionNested(elm);
		// ставим события
		this.setEventNested()
	}

	/**
	* Создает блок
	*
	* @see 	this.buildNested()
	*/
	this.createSectionNested = function(elm)
	{
		var curId = elm.attr("data-id");

		var block = '';
		for (var i = 0; i < 50; i++) {
			var type = elm.attr("elm-type");
			// if (!type) type = "site";
			if (!type) continue;

			var title = ListElementObject[type]["title"];
			var name = title.name;
			var classUnique = Element.getCurrentClass(elm);

			// отдает класс для отображения 
			classUnique = this.getSelectorForVisible(elm);

			var img = title.img;
			var elmId = elm.attr("data-id");
			var chosen = curId == elmId ? true : false;
			// блок
			block = '\
				<div class="nestedSectionItem" chosen="'+chosen+'" elm-id="'+elmId+'">\
					<img src="/img/editor/elements/'+img+'" alt="" class="nestedSectionItemImg">\
					<div class="nestedSectionItemText">'+classUnique+'</div>\
					<div class="clear"></div>\
				</div>'+block;

			// если секция то прерываем
			if (type == "section") {
				block = '\
					<div class="nestedSectionItem" chosen="" elm-id="site">\
						<img src="/img/editor/elements/section.png" alt="" class="nestedSectionItemImg">\
						<div class="nestedSectionItemText">site</div>\
						<div class="clear"></div>\
					</div>'+block;

				break;
			}
			// вверх о иерархии
			elm = elm.parent().closest(".element");
		}

		block += '<div class="clear"></div>';

		// вставляем блок
		$(".nestedSection").html(block);
	}


	/**
	* События 
	*
	* @see 	this.buildNested()
	*/
	this.setEventNested = function()
	{
		// клик по родителю и его выбор
		$(".nestedSectionItem").off("mousedown");
		$(".nestedSectionItem").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("chosen") == "true") return false;
			
			var elmId = elmEvent.attr("elm-id");
			if (elmId == "site") elm = $(".contentItemPage .site");
			else var elm = Element.getParentWrap().find(".element[data-id='"+elmId+"']");
			
			if (!elm.length) {
				var elmSiteObjV = $(".contentItemPage .site");
				if (elmSiteObjV.attr("data-id") == elmId) {
					elm = elmSiteObjV;
				}
			}
			
			elm.mousedown().mouseup();

			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(elm);

			return false;
		});
	}

	/**
	* Отдает селектор для отображения
	*
	* @see 	this.getStruct()
	* @see 	this.createSectionNested()
	*/
	this.getSelectorForVisible = function(elm)
	{	
		var elmClass = Element.getClassAdded(elm);
		if (elmClass) return elmClass;

		elmClass = Element.getClassUnique(elm);
		elmClass = /[\w\-]+$/i.exec(elmClass, '');
		if(elmClass) return elmClass[0];
		else return elmClass;
	}

/**********************************************************************************************/
/*********************************************************************************************/
}//end class



