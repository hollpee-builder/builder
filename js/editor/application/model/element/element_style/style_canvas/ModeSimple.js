var ModeSimple = new ModeSimple();
function ModeSimple() {
	/**
	* Создает для упращеного режима
	*
	* @see 	Resize.create()
	*/
	this.create = function()
	{
		if (Element.obj.hasClass("site")) {
			this.hideSimpleBlock();
			return false;
		}

		//удаляем блок
		// Resize.remove();
		this.setPropetyModeSimple();
		this.setEventModeSimple();		
		this.showSimpleBlock();
	}


	/**
	* Добавляет блок для режима lite
	*
	* @see 	this.createSimple() 
	* @see 	StyleMenuGeometry.editPositionAlign()
	* @see 	EditorController.setEventEditScreen() 
	* @see 	StyleMenuGeometry.editWidth(), .editMarginTop(), .edi
	* @see 	Page.replace()
	* @see 	StyleMenutext.editSize(), .editLineHeight()
	*/
	this.setPosition = function()
	{
		if (!Editor.isModeSimple()) return false;

		var elm = Element.obj;

		if (elm.hasClass("section")) elm = elm.find("> .section-content"); 
		var widthElm = Element.getWidth(elm);
		var offset = elm.offset();

		var topV = offset.top + Editor.getCanvas().scrollTop() - 65;
		if (Element.obj.hasClass("section") || elm.hasClass("modal")) {
			topV += Element.getHeight(elm) + 47;
		}
			
		var leftV = offset.left;	
		if (Element.obj.hasClass("section")) {
			topV -= 37;
			leftV++;

			// для первой секции
			if (elm.attr("data-id") == $(".section:first").attr("data-id")) {
				topV -= 27;
			}
		}

		/*****/
		if (!Editor.isShowTopPanle()) {
			topV += 32;
		}
		/******/

		if ($(".blockManModeSimpleContent").hasClass("addedBlockPosBottom")) {
			topV += parseInt(Element.getHeight(elm));
			if (Element.data.no_resize) {
				topV -= 4;
			}
		}

		this.getSimbleBlockObj().css({
			"top": topV,
			"left": leftV,
			"width": widthElm
		});

		// elm.attr('border', 'true');
	}

	/**
	* Установка параметров
	*
	* @see 	this.createSimple()
	*/
	this.setPropetyModeSimple = function()
	{
		var elm = Element.obj;

		// кнопки перемещения
		var butMoveVertical = $(".butManSimpleBlock[data-pos='vertical']");
		var butMoveHorizontal = $(".butManSimpleBlock[data-pos='horizontal']");
		
		if (elm.css("float") == "none" && !elm.hasClass("column")) {
			butMoveVertical.css("display", "block");
			butMoveHorizontal.css("display", "none");
		} else {
			butMoveVertical.css("display", "none");
			butMoveHorizontal.css("display", "block");
		}

		// статус активности
		$(".butManSimpleBlock").removeAttr("data-no-active");
		
		if (!Element.isManipulation()) {
			var isNextElm = false;
			var isPrevElm = false;
		} else {
			var isNextElm = Element.getNextElm(elm, true);
			var isPrevElm = Element.getPrevElm(elm, true);
		}

		if (!isPrevElm) $(".butPrevSimpleBlock").attr("data-no-active", "true");
		if (!isNextElm) $(".butNextSimpleBlock").attr("data-no-active", "true");
		
		var simpleBlockContent = $(".blockManModeSimpleContent");
		simpleBlockContent.removeAttr("data-edit");

		// кнопка edit
		var butEdit = $(".butEditSimpleBlock");
		if (Element.data.is_edit || Element.data.is_edit_simple) {
			butEdit.css("display", "block");

			simpleBlockContent.attr("data-edit", "true");
		} else {
			butEdit.css("display", "none");
		}

		// кнопка копирования и удаления
		if (!Element.isManipulation() || Element.obj.hasClass("hlp-col")) {
			$(".butCopySimpleBlock, .butDeleteSimpleBlock").attr("data-no-active", "true");
		}

		$(".blockManModeSimple").attr("data-type", Element.data.type);
	}

	/**
	* События для режима lite
	*
	* @see 	this.createSimple()
	*/
	this.setEventModeSimple = function()
	{
		var obj = this;

		var menuObjV = $(".rightMenu");
		var butSettingObj = $(".butSettingSimpleBlock, .rightMenuButShow");
		butSettingObj.off("click");
		butSettingObj.on("click", function() {
			menuObjV.attr("data-show", "true");
			obj.setPosition();
			Resize.setSize();
			return false;
		});

		butSettingObj.off("mousedown");
		butSettingObj.on("mousedown", function() {
			return false;
		});

		var butHideObj = $(".rightMenuButHide");
		butHideObj.off("mousedown");
		butHideObj.on("mousedown", function() {
			menuObjV.removeAttr("data-show");
			obj.setPosition();
			Resize.setSize();
			Editor.resetFocus();
			return false;
		});
	}

	/**
	* Изменение отображени секции
	*
	* @see 	Key.key9()
	*/
	this.editVisibleMenuRight = function()
	{
		var menuRightObjV = $(".rightMenu");
		if (menuRightObjV.attr("data-show") == "true") menuRightObjV.removeAttr("data-show");
		else menuRightObjV.attr("data-show", "true");
	}

	/**
	* Прячет правую панель
	*
	* @see 	ElementStyleController.setEventCanvas()
	*/
	this.hideMenuRight = function()
	{
		// if (!Element.obj || !Element.oldObj) return false;

		// if (!Element.obj.hasClass("site")
		// 		&& !Element.oldObj.hasClass("site")) {
			$(".rightMenu").removeAttr("data-show");
		// }

	}

	/**
	* Отдает блок simple
	* 
	* @see 	this.addBlockModeSimple()
	* @see 	this.hideSimpleBlock()
	* @see  this.showSimpleBlock() 
	*/
	this.getSimbleBlockObj = function()
	{
		return $(".blockManModeSimple");
	}

	/**
	* Прячет блок
	*
	* @see 	Resize.remove()
	* @see 	Resize.hide(), .setEvent
	* @see 	TextEditor.hideElm()
	* @see 	EditorController.setEventTab()
	* @see 	StyleCanvas.setEventMoveElement()
	*/
	this.hideSimpleBlock = function()
	{
		this.getSimbleBlockObj().removeAttr("data-show");
	}

	/**
	* Показывает блок
	*
	* @see 	this.addBlockModeSimple()
	* @see  TextEditor.showElm()
	* @see 	EditorController.setEventTab()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	Resize.setEventMouseUp()
	*/
	this.showSimpleBlock = function()
	{
		if (Editor.isModeSimple()) {
			this.setPosition();
			this.getSimbleBlockObj().attr("data-show", "true");
		}
	}


/**********************************************************************************/
/**********************************************************************************/
	
	/**
	* Установка стилей
	*
	* @see 	StyleMenu.set()
	*/	
	this.setMenuStyle = function()
	{
		if (!Editor.isModeSimple()) return false;

		$(".menuMarginH, .menuPositionType, .menuFloat, .menuFloatSide").css("display", "none");

		var elm = Element.obj; 

		// для секции 
		if (Element.obj.hasClass("section")) {
			$(".menuMargin, .menuProportion").css("display", "none");
		}

		if (elm.hasClass(ElementSliderArrowImg.class)) {
			$(".menuMarginH").css("display", "block");
		}

	}


/**********************************************************************************/


} // end class
