/**
* Редакатор в общем
*
*
*/
var Editor = new Editor();
function Editor() {
	/**
	* Текущий экран
	* @set 	EditroController.setEventEditScreen()
	* @see 	StyleUnit.setMenuProperty()
	* @see 	StyleMenuGeometry.editFloat()
	*/
	this.screen = "desktop";


/****неактивные кнопки*************************************************************************/
	/**
	* Делает не активными некоторые кнопки
	*
	* @param 	string 	type-тип элемента
	*
	* @uses		this.setButActive() 	делает кнопку активной
	* @uses		this.setButInactive()   делает кнопку не активной
	* @see 	 	ElementStyleController.noteElement() 
	*/
	this.setMenuButtonInactive = function()
	{
		var elm = Element.obj;
		var elmType = Element.data.type;

		$(".elementsItem").removeAttr("no-add");

		var listButNav = $(".elementsItem[type='nav-item']");
		var listButNavLevel = $(".elementsItem[type='nav-level']");
		var listButLi = $(".elementsItem[type='hlp-li']");
		var listButForm = $(".listElementsForm .elementsItem").not("[type='form']");
		var listButNoModal = $(".elementsItem").filter("[type='section'], [type='nav'], [type='nav-button-mobile']");

		listButNav.attr("no-add", "true");
		listButNavLevel.attr("no-add", "true");
		listButForm.attr("no-add", "true");
		listButNoModal.attr("no-add", "true");
		listButLi.attr("no-add", "true");

		if (elm.hasClass("nav") || elm.hasClass("nav-item") || elm.hasClass("hlp-nav-level")) listButNav.removeAttr("no-add");
		else if (elm.closest(".form").length) listButForm.removeAttr("no-add");
		else if (elm.closest(".hlp-ol, .hlp-ul").length) listButLi.removeAttr("no-add");

		if (!elm.closest(".modal").length) listButNoModal.removeAttr("no-add");

		if (elm.hasClass("nav-item") && !elm.parent().find("> .hlp-nav-level-wrap").length) {
			if (!elm.closest(".hlp-nav-level").length) {
				listButNavLevel.removeAttr("no-add");
			}
		}
	}
	
	/**
	* Делает кнопку активными
	*
	* @see 	this.setMenuButtonInactive(), this.setButInsert()
	*/
	this.setButActive = function(elm)
	{
		elm.attr('status', 'true');
	}

	/**
	* Делает кнопку не активными
	*
	* @see 	this.setMenuButtonInactive(), this.setButInsert()
	*/
	this.setButInactive = function(elm)
	{
		elm.attr('status', 'false');
	}

	/**
	* Установить кнопку insert
	*
	* @see 	this.setMenuButtonInactive()
	*/
	this.setButInsert = function()
	{
		var elm_but = $('.topMenuInsert');
		//в буффере есть
		if ($('.bufferElementInsert').html()) {
			this.setButActive(elm_but);
		//буффер пуст
		} else {
			this.setButInactive(elm_but);
		}
	}
/*************************************************************************************************/
	/**
	* Сброс фокуса
	*
	* @see 	ElementStyleController.setEventCanvas()
	* @see 	EditorController.setEventReset()
	* @see 	ElementAddController.setEventAdd()
	*/
	this.resetFocus = function()
	{
		// убираем фокус
		$("#inputResetFocus").focus();
		// убираем панель цвета
		this.closeColorPicker();
		// убираем панель с элементами
		this.hideListElements();
		// закрываем select
		this.closeSelect();
		// закрывам модальное в меню
		MenuListItem.hideModal();
		// закрываем панель дополнительного классс
		StyleMenuFixed.closePanelClassAdded();

		// для новой color picker
		StyleMenu.resetObjColorPicker();
	}

	/**
	* Закрыть палитру
	*
	* @see 	this.resetFocus()
	* @see 	EditorController.setEventReset()
	* @see 	StyleMenu.edit()
	*/
	this.closeColorPicker = function()
	{
		$('.colorpicker').css("display", "none");
	}

	/**
	* Закрывает select
	*
	* @see 	this.resetFocus()
	* @see 	EditorController.setEventReset()
	* @see 	StyleMenu.edit()
	*/
	this.closeSelect = function()
	{
		$(".optionBlock").css("display", "none");
	}
/***********************************************************************************************/
/***установить название элемента в правом меню*****************************************************************************/					
	

/************************************************************************************/
	/**
	* Изменяет режим редактора
	*
	* @see 	Key.key32()
	*/
	this.editMode = function()
	{
		if ($('.redactorPageEdit').css('display') == "block") this.modeShow();
		else this.modeEdit();

		// 
		
	}

	/**
	* Режим просмотра
	*
	* @see 	EditorController.setEventRedactorMode()
	*/
	this.modeShow = function()
	{
		// для паралакс video bg
		// $("html, body, .wrapper").css({"height":"auto","overflow":"auto"});
		// $("html, body, .wrapper").css({"overflow":"auto"});
		var elm = Element.obj;
		if (!elm.hasClass("section")) {
			var parentSectionObj = Element.obj.closest(".section");
			if (parentSectionObj.find(".hlp-bg-video-paralax").length) {
				parentSectionObj.mousedown().mouseup();
			}
		}
		/*******/

		// статус модального окна
		var isModal = Screen.isModal();

		var sectionEdit = $('.redactorPageEdit');
		//фиксируем позицию скролла
		var valueScroll = sectionEdit.find(".contentWrap").scrollTop();

		//убираем блок редактирования
		sectionEdit.css('display', 'none');
		
		// показываем блок просмотра
		var sectionShow = $('.redactorPageShow');
		sectionShow.css('display', 'block');

		var elmContent = $('.content');
		var elmWrap = elmContent.css("display") == "block" ? elmContent : $('.contentModal');
		var contentClass = elmWrap.attr("class");
		var elmStyle = elmWrap.height();

		elmWrap.find(".resizeBlock").remove();

		var content = '\
			<div class="'+contentClass+'" screen="'+elmContent.attr("screen")+'">'
				+elmWrap.html()+
			'</div>';
		
		var elmShowContent = $('.redactorPageShowContent');
		elmShowContent.html(content);//помещяем в блок просмотра страницу
		// 

		// ставим scroll
		sectionShow.scrollTop(valueScroll);

		// если модальное
		if (isModal) {
			var modalWrapHeight = $("body").height() - 41;
			elmShowContent.find(".modalWrap").css("min-height", modalWrapHeight+"px");
			
			elmShowContent.find(".topPanelNavPage").remove();
		}

		/*****************/
		// hover effect
		this.modeShowEfectHover();
	}

	this.modeShowEfectHover = function()
	{
		var listElm = $('.redactorPageShow').find(".element, .hlp-nav-item-mobile");
		listElm.hover(function() {
			if ($(this).attr("state") != "chosen"
					&& !$(this).hasClass("hlp-section-fixed")) {
				$(this).attr("state", "hover");
			}
		}, function() {
			if ($(this).attr("state") == "hover") {
				$(this).removeAttr("state");
				
				if ($(this).closest(".hlp-section-fixed").length) {
					$(this).attr("state", "fixed")
				}
			}
		});
	};

	/**
	* Режим изменения
	* 
	* @see 	EditorController.setEventRedactorMode()
	* @see 	Input.init()
	*/
	this.modeEdit = function()
	{
		// для паралакс video bg
		// $("html, body, .wrapper").removeAttr("style");

		var sectionShow = $('.redactorPageShow');
		// фиксируем скролл
		var valueScroll = sectionShow.scrollTop();

		// убираем блок просмотра
		sectionShow.css('display', 'none');
		$('.redactorPageShowContent').html('');

		//показываем блок редактирования
		$('.redactorPageEdit').css('display', 'block');
	
		// устанавливаем скролл
		$(".contentWrap").scrollTop(valueScroll);

		// устанавливаем экран после просмотра
		Screen.setEditorAfterShowing();

		// ставим позицию линейки
		this.setSize();
		Resize.create();
	}

	/**
	* Отдает режим просмотра
	*
	* @see 	this.setSize()
	*/
	this.getModeType = function()
	{
		var mode = $('.redactorPageEdit').css("display") == "block" ? "edit" : "show";
		return mode;
	}

	/**
	* Ставит позицию линейки
	*
	* @see 	this.modeEdit()
	* @see 	Resize.setEventMouseUp()
	* @see 	EditorController.setEventEditScreen()
	* @see 	EditorController.setEventTab()
	*/
	this.setScale = function()
	{
		if (!Scale.isShow()) return false;

		Scale.setPosition();
		Guides.setPositionVertical();
	}
/*************************************************************************************************/
/****************************************************************************************************/
	/**
	* Ставит размер экрана
	*
	*
	* @see 	EditorController.setEventResizeWindow()
	* @see 	EditorController.setEventVisibleRuler()
	* @see 	this.setModeWork()
	*/
	this.setSize = function()
	{	
		// если не декстоп то ставим
		if (this.getModeType() == "show") Screen.setDesktop();

		var windowHeight = $("body").height();
		var contentTooterHeight = $(".contentSectionFooter").height(); 

		// полотно
		var contentWrapObj = $(".contentWrap");
		var contentWrapPosToop = contentWrapObj.offset().top;
		var contentWrapHeight = windowHeight - contentTooterHeight - contentWrapPosToop;
		contentWrapObj.height(contentWrapHeight);
		$(".contentModal").height(contentWrapHeight);

		// панель элементов
		var panelElementsObj = $(".listAddElements");
		var panelElementsPosTop = $(".redactorPageTop").height();
		var panelElementsHeight = windowHeight - panelElementsPosTop - contentTooterHeight;
		panelElementsObj.height(panelElementsHeight);
		panelElementsObj.css({"top":panelElementsPosTop+"px"});

		// правая панель
		var rightPanelObj = $(".rightMenuListContent");
		// var rightPanelTop = rightPanelObj.offset().top;
		var rightPanelTop = 105;
		var rightPanelHeight = windowHeight - rightPanelTop;

		if (this.isModeSimple()) rightPanelHeight -= 28;

		rightPanelObj.height(rightPanelHeight);

		// для блока
		Resize.setSize();
		
		Scale.setPosition();
	}

	/**
	* Видно top panel
	*
	* @see 	this.setSize()
	* @see 	TextEditor.setProportion()
	*/
	this.isShowTopPanle = function()
	{
		return $(".topPanel").css("display") != "none";
	}


	this.setModeWork = function(modeType)
	{
		if (!modeType) {
			modeType = Data.site.data.mode_simple ? "lite" : "pro";
		} else {

			Data.site.data.mode_simple = modeType == "lite" ? true : false;
		}

		if (Data.site.data.mode_simple) {
			$(".wrapper").addClass("modeSimple");
			$(".listAddElements").css("display", "none");

			// переходим на style
			setTimeout(function() {
				$(".rightMenuNavItem[type='style']").mousedown();
			}, 1000);
			// убираем линейку
			$(".butVisibleRuler").attr("data-visible", "true").mousedown();
		} else {
			$(".wrapper").removeClass("modeSimple");
		}

		$(".butChosenMode").removeAttr("data-chosen")
							.filter("[data-type='"+modeType+"']")
							.attr("data-chosen", "true"); 


		// ставим размер  
		Editor.setSize();
		// ставим resize
		Resize.create();

		StyleMenu.set();
	}

	/**
	* Узнает простой режим
	*
	* @see 	this.setSize()
	* @see 	Resize.create(), .showSimpleBlock()
	* @see 	StyleCanvas.setEventMoveElement()
	* @see 	ElementStyleController.
	* @see  Key.key32(), .key9()
	* @see 	ElementManController.delete()
	* @see 	ElementBasic.setPositionAddedBlock()
	* @see 	ElementStyleController.setEventCanvas()
	*/
	this.isModeSimple = function()
	{
		var isSimpleV = $(".wrapper").hasClass("modeSimple");
		// Data.site.data.mode_simple = isSimpleV;

		return isSimpleV;
	}

/***********************************************************************************************/
/********************************************************************************************/
	
	/**
	* Работа с панелью добавить элемент
	*
	*
	* @see 	EditorController.setEventListElements()
	*/
	this.turnListElements = function()
	{
		var opacity = $('.listAddElements').css("opacity");
		//разворачивание
		if (opacity == 0) Editor.showListElements();
		else Editor.hideListElements(); //сворачивание 
	}

	/**
	* Сворачивание списка элемента
	*
	* @see 	this.turnListElements()
	*/
	this.showListElements = function()
	{
		$('.listAddElements').animate({'opacity':1}, 50).css("display", "block");

		// если модальное окно, но не выбран элемент модального окна
		if (Screen.isModal() && !$(".contentModal .elementSelected").length) {
			$(".elementsItem").attr("no-add", "true");
		}
	}

	/**
	* Разворачивание списка элементов
	*
	* @see 	this.turnListElements()
	* @see 	EditorController.setEventListElements()
	* @see 	this.resetFocus()
	*/
	this.hideListElements = function()
	{
		$('.listAddElements').css({"display":"none", "opacity":"0"});
	}

	/**
	* Сворачивание || разворачивание секции
	*
	*
	* @see 	EditorController.setEventListElements()
	*/
	this.turnListElementsSection = function(elmEvent)
	{
		var section = elmEvent.next();
		var display = section.css("display");
		var icon = elmEvent.find(".elementsBlockLabelIcon"); 

		//разворачивание
		if (display == "none") {
			section.css("display", "block");
			icon.text("-");
		} else {
			section.css("display", "none");
			icon.text("+");
		}
	}
/*******************************************************************************************/
/**********************************************************************************************/
	/**
	* Если экран desktop
	*
	* @see 	this.setSize()
	* @see 	StyleMenuBg.editImageStyle()
	* @see 	StyleMenuBorder.editBorderSide()
	*/
	this.isDesktop = function()
	{
		var screen = $(".butShowItem[chosen='true']").attr("screen");
		if (screen == "desktop") return true;
		else return false;
	}

	/**
	* Отдает объект полотна
	*
	* @see 	Screen.setScroll()
	* @see 	Resize.addBlockModeSimple()
	* @see  TextEditor.setProportion()
	*/
	this.getCanvas = function()
	{
		return $(".contentWrap");
	}

	/**
	* Отдает высоту top Panel
	*
	* @see 	TextEditor.setProportion()
	*/
	this.getTopPanelHeight = function()
	{
		var panelObj = $(".topPanel");
		return panelObj.css("display") == "block" ? panelObj.height() + 5 : 0;
	}
/********************************************************************************************/
/********************************************************************************************/

	/**
	* Ставит кнопки для режима полотна
	*
	* @see 	ManegerBasic::setEventChoosePage()
	* @see 	EditorController::setEventTab()
	* @see 	Page::replace()
	*/
	this.setPropertyPageModal = function(typeV)
	{
		$(".listIconFooter").attr("data-type", typeV);
		// ставим размер
		if (typeV == "page") Resize.setSize();

		$(".contentSection").attr("data-type", typeV);
	}


/********************************************************************************************/
}//end class


