/**
* Работа со стилями у элемента
*
*
*/
var ElementStyleController = new ElementStyleController();
function ElementStyleController() {
	/**
	* Отметка не выберать сайт 
	*
	* @set  ElementManController.moveDownSection()
	* @set 	ElementManController.moveUpSection()
	*/
	this.noSelectedSite = false;

/****************************************************************************/
	/**
	* Изменение стиля на полотне
	*
	* @uses 	this.setEventAllocateAll() 	рамка вокруг элементов
	* @uses 	this.setEventMenu() 		события меню
	* @uses 	this.setEventTopMenu()	 	для вверхнего меню
	* @see 		setEvent() 	
	*/
	this.setEvent = function()
	{
		//события в меню
		this.setEventMenu();
	}
/*********************************************************************************************/
/*************************************************************************************************/
/*******************************************************************************************************/
	/**
	* События для полотна
	*
	* @uses 	this.actionBeforeSelected() 	действие над старым до выбора нового элемента	
	* @uses 	this.noteElement() 				выделение элемента
	* @uses 	this.setEventMoveElement()  	перемещение элемента 
	* @uses 	this.actionAfterSelected() 		действие над новым элемнтом	
	* @uses 	obj.is_click 					отмечаем что это клик
	* @see 		SetEvent.newElement()
	*/
	this.setEventCanvas = function()
	{
		var obj = this;
		Data.is_move = true;
		$('.element, .site').off('mousedown');
		$('.element, .site').on('mousedown', function(e) {		
			var elm = $(this);

			// нельзя отметить сайт
			if (obj.noSelectedSite) {
				if (elm.hasClass("site")) obj.noSelectedSite = false;
				return false;
			}

			// если остался атрибут style
			if (Element.obj && Element.obj.attr("style")) {
				ElementCss.setCssByAttrStyle(Element.obj);
			}

			// если в режиме модаль нажимаем на сайт
			if (elm.hasClass("site") && Screen.isModal()) return false;

			// скидуем фокус
			Editor.resetFocus();

			//выделяем элемент, если клик не по выбраному элементу
			if (elm[0] != $('.elementSelected')[0]) {
				//если не первый клик 
				if (Element.data) {
					//дейсвие с текщий элементом до того как выбрали новый
					obj.actionBeforeSelected(elm)
				}
				//отмечаем элемент
				obj.noteElement(elm);

				//дествие над элементом после добавления
				obj.actionAfterSelected(elm);
			}

			//ставим событие перетаскивания элемента если можно
			if (!Element.data.no_move) {
				StyleCanvas.setEventMoveElement(elm, e);
			}	
			
			//что бы не срабатывали родительские элементы
			return false;
		});

		$(".checkbox, .radio").off("click");
		$(".checkbox, .radio").on("click", function() {
			return false;
		});
		
	}
/*************************************************************************************/
	/**
	* Действия над элементом до выбора нового
	*
	* @uses 	EditElementText.hide()			спрятать блок редактирования
	* @see 		this.seyEventCanvas()
	*/
	this.actionBeforeSelected = function(elm)
	{
		// если стоит редактор то убираем его 
		if (TextEditor.isShow()) TextEditor.hide();

		// меню
		if (elm.hasClass("hlp-nav-level")) {

		} else if (elm.hasClass("nav-item")) {
			elm.parent().parent().find("li").removeAttr("data-hlp-nav-open-level");
		} else if (elm.hasClass("nav-item-mobile")) {
			elm.parent().parent().find("li").removeAttr("data-hlp-nav-open-level-mobile");
		} else {
			$("li").removeAttr("data-hlp-nav-open-level").removeAttr("data-hlp-nav-open-level-mobile");
		}
	}
/*************************************************************************************/
	/**
	* Действие над элементам после выделения
	*
	* @uses 	EditElementText.insertTextInRedactor() 	изменить текст в едакторе
	* @uses 	EditElementForm.showPanelManInput() 	манипулирование с input
	* @see 		this.setEventCanvas()
	*/
	this.actionAfterSelected = function(elm)
	{
		//показываем панель манипуляции c input
		if (Element.data.type == 'form_input') {
			EditElementForm.showPanelManInput();
		}

		// ставим значение display
		ElementNavPanelMobile.setDisplaySelect();

		// показываем по меню
		if (elm.hasClass("nav-item")) {
			elm.closest("li").attr("data-hlp-nav-open-level", "true");
		} else if (elm.hasClass("nav-item-mobile")) {
			elm.closest("li").attr("data-hlp-nav-open-level-mobile", "true");
		}
	}
/*************************************************************************************/
	/**
	* Отметить элемент
	*
	* @uses 	Resize.create() 			добавляем блок изменения размера элементу
	* @uses 	Editor.setTitleRightMenu() 		установить название элемента в правом меню
	* @uses 	Editor.setButtonInactive() 		делаем не активными некоторые кнопки
	* @uses 	StyleMenuSet.set() 				устанавливаем стили элемента
	* @uses 	ElementSetting.set() 			устанавливает параметры
	* @see 		this.setEventCanvas()
	*/
	this.noteElement = function(elm)
	{
		//убираем элементы элемента необходимые для его работы
		$('*[is_delete="true"]').remove();
		
		// если открыта вклада сайт и элемент не сайт
		if (!elm.hasClass("site") && $(".rightMenuNavItem[chosen='true']").attr("type") == "site") {
			$(".rightMenuNavItem[type='style']").mousedown();
		}

		//добавляем елементу класс выделения
		this.addClassSelected(elm);
		Element.setData(elm);//устанавливаем данные текущего  элемента
		
		if (!Element.obj) return false;

		//добавляем блок изменения размера
		Resize.create();

		setTimeout(function() {
			//устанавить стили в правой панели
			StyleMenu.set();
		}, 40);

		// убираем статус
		Element.removeState();

		setTimeout(function() {
			// выбираем элемент в структуре
			PageStruct.select(elm);
			PageStruct.buildNested(elm);

			//делаем некоторые кнопки не активными в верхнем меню
			Editor.setMenuButtonInactive();
			//устанавливаем параметры элемента
			ElementSetting.set();
			ElementWidget.set();
		}, 200);
	}

	/**
	* Добавляет класс выделения
	*
	*
	* @see 	this.noteElement()
	*/
	this.addClassSelected = function(elm)
	{
		// ставим класс выделения
		$('.elementSelected').removeClass('elementSelected');
		elm.addClass('elementSelected');

		// ставим атрибут родителям выделения
		var parentElm = elm;
		$(".element").removeAttr("is-parent-selected");
		if (elm.hasClass("section")) return false;
		for (var i = 0; i < 100; i++) {
			parentElm = parentElm.parent().closest(".element");
			parentElm.attr("is-parent-selected", "true");
			if (parentElm.hasClass("section")) break; //ставим до секции
		}
	}
/***************************************************************************************/
/*************************************************************************************/
/**правая панель***************************************************************************/
	/**
	* События
	*
	* @uses 	this.edit() 					изменить стиль
	* @uses 	this.turnBlockBorderRadius()
	* @uses 	this.toggleHover()
	* @uses 	this.toggleTypeFormationGradientColor()
	* @see 		this.setEvent() 		
	*/
	this.setEventMenu = function()
	{
		//изменить стиль
		this.setEventMenuEdit();
		//переключение hover
		this.toggleHover();
		// кнопка сброс стиля
		this.setEventResetStyle();
		// состояние элемента(hover)
		this.setEventElmState();
		// для правой меню
		StyleMenu.setEvent();
		// авто класс
		this.setEventTypeEnterClass();

		// для настроек
		ElementSetting.setEvent();
	};
/**********************************************************************************************/
	/**
	* Изменяем значения стилей
	*
	* @uses 	MenuStyleEdit.edit()
	* @uses 	this.is_click() 		узнаем это клик или нет
	* @see 		this.setEvent() 	
	*/
	this.setEventMenuEdit = function() {
		var obj = this;
		var parent = $(".menuStyle, .selectStyleBasicElmType");

		var listInputV = parent.find('input, .option');
		listInputV.off('change');
		listInputV.on('change', function() {
			obj.edit($(this));
		});

		//кнопки input
		var list = '.valueBgPosition, .menuButValue, input[type="button"]:not(.colorpickerField, input[status="false"])';
		parent.find(list).off('mousedown');
		parent.find(list).on('mousedown', function() {
			var elmEvent = $(this);
			
			// если клик по выбраному элементу, то не срабатывает
			if (elmEvent.attr("chosen")) return false;

			// убираем выделение и отмечаем выбраный элемент
			elmEvent.parent().find('*').removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// изменяем
			obj.edit($(this));

			return false;
		});

		// для стилей текста
		parent.find(".blockValueText .menuButValue").off("mousedown");
		parent.find(".blockValueText .menuButValue").on("mousedown", function(){
			var elmEvent = $(this);
			
			var isChosen = elmEvent.attr("chosen");
			if (isChosen && elmEvent != "undefined") elmEvent.removeAttr("chosen");
			else elmEvent.attr("chosen", "true");

			obj.edit(elmEvent);
			return false;
		});


		//textarea
		parent.find('.menuOneStyle textarea').off('keyup');
		parent.find('.menuOneStyle textarea').on('keyup', function() {
			obj.edit($(this));
		});

		parent.find('.menuPositionSide').off('mousedown');
		parent.find('.menuPositionSide').on('mousedown', function() {
			var elmEvent = $(this);

			$(".menuPositionSide").removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			obj.edit(elmEvent);
		});
	};


	/**
	* Изменить стиль
 	*
 	*
 	* @uses 	MenuStyleEdit.edit()
	* @uses 	this.is_click() 		узнаем это клик или нет
	* @see 	this.setEventMenuEdit()
	*/
	this.edit = function(elmEvent) 
	{
		//изменяем элемент
		StyleMenu.edit(elmEvent);
		
		if (History.isFixedAll) {
			History.isFixed = true;
			return false;
		}

		//фиксируем историю
		if (History.isFixed && !Scroll.isMove) History.record();
		else History.isFixed = true; //если фиксирована ставим в  - fixed
	}
/****************************************************************************/
/***события**********************************************************************/
	/**
	* Перекючение в меню hover у элемента
	* 
	* @uses 	MenuStyle.setStyleHover() -parent
	* @see 		this.setEvent()
	*/
	this.toggleHover = function()
	{
		var obj = this;
		//клик по вкладке переключения
		$('.rightHoverNavItem').off('mousedown');
		$('.rightHoverNavItem').on('mousedown', function() {
			var elmEvent = $(this);
			//выбраный статус 
			var newStatus = elmEvent.attr('type');

			//убираем класс активности
			$('.rightHoverNavItem').removeClass('rightHoverNavItemAct');
			//ставим класс активности
			elmEvent.addClass('rightHoverNavItemAct');

			//заменяем массив с данными на текущие состояние элемента
			Element.data_style = Element.data.style[newStatus]; 
			//ставим стили элементу
			StyleCanvas.setStyleHover($('.elementSelected'), newStatus);

			//ставим стили в правой панели
			StyleMenuSet.set();
		});
	};
/*************************************************************************************************/

	/**
	* Очищает все стили экрана
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventResetStyle = function()
	{
		$(".butResetStyle").off("mousedown");
		$(".butResetStyle").on("mousedown", function() {
			var styleType = $(this).attr("type");
			// сбрасываем стили
			ElementCss.clearAllStyleScreen(styleType);
			// ставим заново стили
			StyleMenu.set();

			if (styleType == "transform") $(".resizeBlock").css("transform", "none");

			return false;
		});		
	}
/********************************************************************************************/
	/**
	* Состояние элемента 
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventElmState = function()
	{
		var listBut = $(".selectElmState");
		listBut.off("change");
		listBut.on("change", function() {
			// if ($(this).attr("no-active")) return false;

			var state = $(this).find("input").attr("val");

			//ставим элемнту состояние 
			Element.setState(state);

			StyleMenu.set();
			ElementSettingFixed.setVisible(Element.obj);
		});
	}

	/**
	* Авто класс
	*
	* @see 	this.setEvent()
	*/
	this.setEventTypeEnterClass = function()
	{
		var enterClassType = Data.site.data.autoclass ? "auto" : "manual";
		this.setTypeEnterClass(enterClassType);

		var obj = this;
		$(".topMenuAutoClass").off("mousedown");		
		$(".topMenuAutoClass").on("mousedown", function() {
			if (Data.site.data.autoclass) {
				var enterClassType = "manual";
				Data.site.data.autoclass = false;
			} else {
				var enterClassType = "auto";
				Data.site.data.autoclass = true;
			}

			obj.setTypeEnterClass(enterClassType);

			// Site.save(true);

			return false;
		});
	}

	/**
	* Устанавливает тип ввода класса
	*
	* @see 	this.setEventTypeEnterClass()
	*/
	this.setTypeEnterClass = function(enterClassType)
	{
		var listProperty = {
			"auto" : {"img" : "autoclass.png", "part_label" : "автоматически"},
			"manual" : {"img" : "autoclass-manual.png", "part_label" : "вручную"},
		}

		var propertyBut = listProperty[enterClassType];
		var labelValue = "Добавлять класс <br/>"+propertyBut.part_label;
		$(".topMenuAutoClass").attr("label", labelValue)
					.attr("src", "/img/editor/top_panel/"+propertyBut.img);
	}

/************************************************************************************************/
/*******************************************************************************************/

}//end class
