/**
* Работа с Редактором
*
*
*
*/
var EditorController = new EditorController();
function EditorController() {
	//статус, false-если стоит фокус на input
	/**
	* Статус о том можно ли чтобы срабатывало событие повешаное на кнопку
	* @set 	this.setEventKey(), EditElementText.setEventReplaceText()
	* @see 	this.setEventKey()
	*/
	this.status_down_key = true;

	this.objTimeoutSave = false;
	this.oldInputValue = false;

/****************************************************************************/
	/**
	* События 
	*
	* @uses 	this.setEventTip()			подсказка
	* @uses 	this.setEventKey() 			нажатие клавиш
	* @uses 	this.setEventNavMenu() 		навигация по меню
	* @see 		setEvent() 					
	*/
	this.setEvent = function()
	{	
		//при наведении показываются подсказки
		this.setEventTip();
		//нажатие клавиш(комбинаций)
		this.setEventKey();
		//навигация по правой панели
		this.setEventNavMenu();
		// свернуть правое меню
		this.setEventListElements();
		// свернуть секции в правом
		this.setEventTurnSectionMenu();
		// изменить тип экрана
		this.setEventEditScreen();
		// режим просмотра
		this.setEventModeShow();
		// режим работы
		this.setEventModeWork();
		// сброс
		this.setEventReset();
		// изменение размера экрана
		this.setEventResizeWindow();
		// переключение вкладок
		this.setEventTab();
		// кпопка просмотр
		this.setEventButFullShow();
		// закрыть редактор
		this.setEventExit();
		// отображение линейки
		this.setEventVisibleRuler();
		// детально о типах просмотра
		this.setEventDetailShowType();
		// настройки страницы
		this.setEventPageSetting();
		// настройки магазина
		this.setEventManagerFile();

		// для направляющих
		Guides.setEvent();
		// ставим модальную сетку
		Grid.setEvent();

		// ставим список страниц в select
		ManagerPage.setSelectListItem();
		ManagerModal.setSelectListItem();

		// Список элементов
		MenuListItem.setEvent();

		/**********/
		// Store.showModal();
	}
/********************************************************************************/
	/**
	* Подсказки на кнопках меню
	*
	* @see 	this.setEvent()
	* @see 	ElementSlider.addAddedBlock()
	*/
	this.setEventTip = function()
	{
		//при наведении
		$('*[label]').off('mouseover');
		$('*[label]').on('mouseover', function() {
			Tip.show($(this));
		});
	}
/****************************************************************************/
	/**
	* Нажатие клавиш
	*
	* @uses 	this.status_down_key 	статус можно выполять событие кнопки или нет
	* @uses 	Key.key*() 				нажатие клавиш
	* @see 		this.setEvent()
	*
	* @todo  	разбить на функции
	*/
	this.setEventKey = function() {
		var obj = this;

		$('body').off('keydown keyup');
		$('body').on('keydown keyup', function(e) {	
			var code = e.keyCode;
			var func_name = obj.getFunctionByPressKey(code);
			if (e.type == "keyup") {
				func_name += "_keyup";
				Key.resetDown();
			} else {
				Key.setDown(e);
			}

			//если есть такая функция и мы не в режиме редактирования
			if (Key[func_name] && !TextEditor.isShow()) {
				var status = !$('input[type="text"], textarea').not("#inputResetFocus").filter(":focus").length;
				
				//выполняем действие
				var res = Key[func_name](e, status);
				//что бы не выполнялось стандартное действие привязаное на данную клавишу
				if (res) return false;
			}

			// при нажатии на enter сбрасываем фокус, если он стоит в правой панели
			if (code == "13" && $(".rightMenu input:focus").length) {
				Editor.resetFocus();
			}
			
		});

		//для отслеживания что находиться курсор в блоке .content
		$('.wrapper input[type="text"], .wrapper textarea').off('focus');
		$('.wrapper input[type="text"], .wrapper textarea').on('focus', function() {
			// obj.status_down_key = false;
			var elmEvent = $(this);
			obj.setEventWheelInput();

			// вводить можно только английский
			SpecialInput.setEventOnlyEng(elmEvent);

			obj.oldInputValue = elmEvent.val();
			History.isFixedAll = true;
		});

		$('.wrapper input[type="text"], .wrapper textarea').off('focusout');
		$('.wrapper input[type="text"], .wrapper textarea').on('focusout', function() {
			var elmEvent = $(this);

			// obj.status_down_key = true;
			obj.clearEventWheelInput();
			// убираем событие
			SpecialInput.clearEventOnlyEng();

			if (obj.oldInputValue != elmEvent.val()) {
				History.record();
			}
			History.isFixedAll = false;
		});
	}

	/**
	* Отдает имя функции по нажатой клавише
	*
	* @see 	this.setEventKey()
	*/
	this.getFunctionByPressKey = function(code)
	{
		var funcName = 'key'+code;
		

		// если в фокусе цвет
		if($(".rightMenu input:focus").filter("[color]").length) funcName += "color";
		// если открыто модальное окно
		else if ($(".modalBlock").css("display") == "block") funcName += "modal"; 
		else if ($(".textRedactor").css("display") == "block") funcName += "text";

		return funcName;
	}
/**********************************************************************************************/
	/**
	* Скрол при фокусе в input
	* 
	* @see setEventKey()
	*/
	this.setEventWheelInput = function()
	{	
		$(document).off("wheel mousewheel MozMousePixelScroll");
		$(document).on("wheel", function(e) {
			if (!Key.isDownShift()) return true;

			var isFocus = $(".rightMenuContent input:focus").length;
			var inputFocus = $(".rightMenuContent input:focus");

			if (isFocus && !inputFocus.attr("color")) {
				var value = e.originalEvent.deltaY || e.originalEvent.detail || e.originalEvent.wheelDelta;
				if (!value) return false;
				
				if (value > 0) {
					Key.keyWheelBottom();
				} else {
					Key.keyWheelTop();
				}
				return false;
			}
		})
	}
	
	this.clearEventWheelInput = function()
	{
		$("body").off("wheel");
	}
/***********************************************************************************************/
	/**
	* Навигация по меню правой панелт
	*
	* @uses 	Editor.setTitleRightMenu() 		устанавливаем заголовк в правой панели
	* @see 		this.setEvent()
	*/
	this.setEventNavMenu = function()
	{
		var obj = this;
		$('.rightMenuNavItem').off('mousedown');
		$('.rightMenuNavItem').on('mousedown', function() {
			var elmEvent = $(this);
			var type = elmEvent.attr('type');
			var oldType = $(".rightMenuNavItem[chosen='true']").attr("type");
			var elm = Element.obj;

			// выбираем вкладку
			obj.setTabMenuRight(elmEvent, type);

			// особеность для вкладки сайт
			if (type == "site") {
				// запоминаем текущий элемент, для возрата на него
				// если модал то элемент запомнили, в this.setEventTab() при переходе на modal
				if (!Screen.isModal()) Element.prevElm = Element.obj;
				// показываем секцию со стилями
				$(".menuStyle").css("display", "block");
				// переходим на сайт с модального
				// $(".topPanelNavPage:not([chosen='true'])").mousedown();
				// эмитируем нажатие
				$(".content .site").mousedown();
				// прячем геометрию
				$(".menuGeometry").css("display", "none");
				// нельзя вставить элементы, и ими манипулировать
				$(".addNewElm, .topMenuBlockManip .menuItem").attr("status", "false");
			// если не вкладка site и есть предыдущий элемент
			} else if (oldType == "site" && Element.prevElm) {
				// выбираем предыдущий элемент
				Element.prevElm.mousedown().mouseup();
				// обнуляем
				Element.prevElm = false;
			}

			// для вкладки struct 
			$(".rightMenuTitleItem").css("display", "none");
			if (type == "struct") {
				$(".rightMenuTitleItem[type='struct']").css("display", "block");
			} else { //если не структура
				$(".rightMenuTitleItem[type='element']").css("display", "block");
				
				var blockStateObj = $(".selectElmState");
				if (type == "style" && !elm.hasClass("site")) {
					blockStateObj.removeClass("displayNone");
				} else {
					blockStateObj.addClass("displayNone");
				}
			}

			return false;
		});
	}

	/**
	* Выбирает вкладку меню
	*
	* @see this.setEventNavMenu()
	*/
	this.setTabMenuRight = function(elmEvent, type)
	{
		//убираем выделение
		$('.rightMenuNavItem').removeAttr('chosen');
		//ставим выделение выбранному элементу
		elmEvent.attr('chosen', 'true');

		//прячем все блоки
		$('.rightMenuContent, .rightMenuFixedProperty').css('display', 'none');
		//показываем выбраный
		$('.rightMenuContent[type="'+type+'"]').css('display', 'block');
		$('.rightMenuFixedProperty[type="'+type+'"]').css('display', 'block');

		// выделяем элемент структуры, что бы скролл стал на место
		if (type == "struct") PageStruct.select(Element.obj);

		// блок с состоянием (hover)
		var displayState = type == "style" ? "block" : "none";
		$(".blockTypeState").css("display", displayState);
	}
/***********************************************************************************************/
	/**
	* Сворачивание списка меню
	*
	* @see 	setEventMenu()listElementsButClose
	*/
	this.setEventListElements = function()
	{
		// сворачивание || разворачивание панели
		$('.butAddElement').off('mousedown');
		$('.butAddElement').on('mousedown', function() {
			Editor.turnListElements($(this));
			return false;
		});
			
		// закрытие
		$('.listElementsButClose').off('mousedown');
		$('.listElementsButClose').on('mousedown', function() {
			Editor.hideListElements($(this));
			return false;
		});

		// сворачивание || разворачивание секции
		$('.elementsBlockLabel ').off('mousedown');
		$('.elementsBlockLabel ').on('mousedown', function() {
			Editor.turnListElementsSection($(this));
			return false;
		});
	}		
/***********************************************************************************************/
	/** 
	* Сворачивание секции меню
	*
	* @see 	this.setEvent()
	*/
	this.setEventTurnSectionMenu = function() 
	{
		$('.menuStyleName').off('mousedown');
		$('.menuStyleName').on('mousedown', function() {		
			var elm = $(this).closest('.menuOneStyle').find('.menuStyleBlock');
			//сворачиваем
			if (elm.css('display') == 'block') {
				elm.css('display', 'none');
				$(this).find(".menuStyleNameButton").text('+');
			//разворачиваем
			} else {
				elm.css('display', 'block');
				$(this).find(".menuStyleNameButton").text('-');
			}

			return false;
		});
	}
/*******************************************************************************************/
	/**
	* Изменить экран
	*
	* @see 	this.setEvent() 
	*/
	this.setEventEditScreen = function()
	{
		var obj = this;
		var listBut = $(".butShowItem, .butShowItemH");
		
		listBut.off("mousedown");
		listBut.on("mousedown", function() {
			var elmEvent = $(this);
			var elm = Element.obj;
			if (elmEvent.attr("chosen") == "true") return false;//выбран
			
			var screenType = elmEvent.attr("screen");

			// отмечаем
			listBut.removeAttr("chosen");
			listBut.filter("[screen='"+screenType+"']").attr("chosen", "true");

			// изменяем тип экрана
			$(".contentItem, .contentWrap").attr("screen", screenType);
			Editor.screen = screenType;
			
			//ставим static 
			Element.setStateStatic();
			// ставим стили
			StyleMenu.set();
			
			// ставим позицию линейки
			Editor.setScale();
			// ставим размер
			Resize.setSize();

			// убираем модальное в правом меню
			MenuListItem.hideModal();
			// ставим значение display для мобильной панели
			ElementNavPanelMobile.setDisplayScreen();
		});
	}
/***************************************************************************************/
	/**
	* Режим просмотра
	*
	*
	*/
	/**
	* Переключение режимов просмотра
	* 
	* @see 		this.setEvent()
	*/
	this.setEventModeShow = function()
	{
		var obj = this;

		//режим просмотра
		$('.topMenuFastShow').off('mousedown');
		$('.topMenuFastShow').on('mousedown', function() {		
			Editor.modeShow();
		});

		//режим редактирования
		$('.butModeEdit').off('mousedown');
		$('.butModeEdit').on('mousedown', function() {
			Editor.modeEdit();
		});
		 
	}

	/**
	* Режим работы
	*
	*
	* @see 	this.setEvent()
	**/
	this.setEventModeWork = function()
	{
		var butObj = $(".butChosenMode");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var modeType = $(this).attr("data-type");
			Editor.setModeWork(modeType);
		});
	}
	
/**********************************************************************************************/
	/**
	* Сброс
	*
	* @see 	this.setEvent()
	*/
	this.setEventReset = function()
	{
		var listElm = $(".menuItem, .rightMenuNavItem");
		listElm.off("mouseup");
		listElm.on("mouseup", function() {
			Editor.resetFocus();
		});

		// нажатие colorPicker
		// $(".colorpickerField").off("mouseup");
		// $(".colorpickerField").on("mouseup", function() {
		// 	Editor.closeSelect();
		// });
		
		// нажатие select
		$(".selectBlockButton").off("mouseup");
		$(".selectBlockButton").on("mouseup", function() {
			Editor.closeColorPicker();
		});
	}
/*************************************************************************************************/
	/**
	* Переключение вкладок
	*
	*
	* @see 	this.setEvent()
	* @see 	History.set()
	*/
	this.setEventTab = function()
	{
		var obj = this;
		var contentItem = $(".contentItem");
		var contentPage = $(".contentItemPage");
		var contentModal = $(".contentModal:first");
		var contentWrapObj = $(".contentWrap:first");

		$(".topPanelNavItem").off("mousedown");
		$(".topPanelNavItem").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("chosen")) return false;
			var type = elmEvent.attr("type");

			if (type == "modal") { 
				// фиксируем скролл полотна
				obj.scrollTopPageCanvas = contentWrapObj.scrollTop();
				contentWrapObj.scrollTop(0);
			} else {
				ManagerModal.fix();
			}
			
			// отмечаем закладку
			$(".topPanelNavItem").removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// фиксируем
			// Site.fix();

			// убираем экраны
			contentItem.css("display", "none");

			// для модального окна
			if (type == "modal") {
				contentModal.css("display", "block");

				Element.prevElm = Element.obj;
				// фиксируем выбраный элемент
				$(".elementSelected").attr("is-selected", "true");
				// ставим в модальное окно
				ManagerModal.setInCanvas();
			} else {
				contentPage.css("display", "block")

				// отмечаем элемент
				$(".element[is-selected='true']")
					.removeAttr("is-selected")
					.removeClass("elementSelected").mousedown().mouseup();
			}

			// ставим события
			PageStruct.build();
			
			// ставим
			Editor.setScale();
			// сбрасываем
			History.reset();

			Editor.setPropertyPageModal(type);

			// ставим скролл полотна
			if (type != "modal") {
				contentWrapObj.scrollTop(obj.scrollTopPageCanvas);
			}

			return false;
		});
	}
/******************************************************************************************/
	/**
	* Кнопка просмотр
	*
	* @see 	this.setEvent()
	*/
	this.setEventButFullShow = function()
	{
		$(".butFullShow").off("mousedown");
		$(".butFullShow").on("mousedown", function(){
			// если не сохранен
			if (!Site.isSaveStatus()) Site.save();

			var currentPageIndex = Data.page.page_id//Page.getCurrentPageIndex();
			var butShow = $(this);
			var butShowHref = butShow.attr("href").trim().replace(/&page=[0-9]+$/gim, '');
			butShowHref = butShowHref + "&page="+currentPageIndex;
			butShow.attr("href", butShowHref);
		});
	}

/****************************************************************************/

	/**
	* Показ линейки
	*
	* @see 	this.setEvent()
	*/
	this.setEventVisibleRuler = function()
	{
		var butRullerV = $(".butVisibleRuler");
		butRullerV.off("mousedown");
		butRullerV.on("mousedown", function(){
			var elmEvent = $(this);
			var isVisible = elmEvent.attr("data-visible") == "true" ? false : true;
			if (isVisible) {
				elmEvent.attr("data-visible", "true");
				$(".wrapper").addClass("visibleRuler");
				Data.site.data.visibleRuler = true;
			} else {
				elmEvent.removeAttr("data-visible");
				$(".wrapper").removeClass("visibleRuler");
				Data.site.data.visibleRuler = false;
			}

			Editor.setSize();
			Grid.setPropety();
		});

		if (Data.site.data.visibleRuler) {
			$(".wrapper").addClass("visibleRuler");
			$(".butVisibleRuler").attr("data-visible", "true");
		}
	}
	
/******************************************************************************************/
	/**
	* Кнопка просмотр
	*
	* @see 	this.setEvent()
	*/
	this.setEventExit = function()
	{
		$(window).off("beforeunload");
		$(window).on("beforeunload", function() {
			var msg = Resource.hlp_editor_notification_no_save;
			
			if ($(".topMenuSave").attr("is-save") == "false") return msg;
		});

		$(".logoEditor").off("mousedown");
		$(".logoEditor").on("mousedown", function() {
			var msg = Resource.hlp_editor_notification_no_save;
			
			if ($(".topMenuSave").attr("is-save") == "false") {
				alert(msg);
				return false;
			}
		});
	}

	/**
	* Подробней о типах просмотра
	*
	* @see 	this.setEvent()
	*/
	this.setEventDetailShowType = function()
	{
		var butObj = $(".butDetailShowInfo");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var videoIdV = 'IcGn_tixPww';
			var content = '<iframe allowfullscreen frameborder="0" class="videoDetailShowType" src="http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&autoplay=1" frameborder="0"></iframe>';

			Modal.create({
				"id" : "modalDetailShowType",
				"title" : "Типы просмотра сайта",
				"width" : 500,
				"top" : 50,
				"content" : content,
				"button" : [
					["cancel", "Закрыть"]
				]
			});

			// если просмотренно 10 секунд
			setTimeout(function() {
				if ($("#modalDetailShowType").length) {
					Data.user.showing_tutorial.show_type = true;
					User.save();
				}
			}, 5000);
		});

		// если просмотренна инструкция
		if (!Data.user.showing_tutorial.show_type) {
			$(".modeShowHeaderLeft").attr("data-showing-tutorial", "no");
		}
	}

	/**
	* Настройка страницы
	*
	* @see 	this.setEvent()
	*/
	this.setEventPageSetting = function()
	{
		var butSettingObj = $(".butSettingPage");
		butSettingObj.off("mousedown");
		butSettingObj.on("mousedown", function() {
			PageSetting.showModal();
			return false;
		});
	}

	/**
	* Настройки магазина
	*
	*
	*/
	this.setEventManagerFile = function()
	{
		// это убрать потом
		var butFileObj = $(".topMenu .butManagerFile");
		butFileObj.off("mousedown");
		butFileObj.on("mousedown", function() {
			var filePropertyV = {
				"file_type":"video", 
				"category":"my", 
				"operation":"add",
				"no_chosen":true};
			EditElementImage.edit(filePropertyV);
			
			return false;
		});	
	}

/**********************************************************************************************/
/************************************************************************************************/
	/**
	* Изменение размера экрана
	*
	* @see 	this.setEvent()
	*/
	this.setEventResizeWindow = function() 
	{
		$(window).off("resize");
		$(window).on("resize", function() {
			Editor.setSize();
		});
	}

/*****************************************************************************************************/
}//end class

