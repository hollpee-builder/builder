/**
* размер для блока 
*
*/
var Resize = new Resize();
function Resize() {
	/**
	* Создание элемента
	*
	* @see 	ElementStyleController.noteElement()
	* @see 	Editor.editMode()
	* @see 	Editor.setModeWork()
	* @see 	ElementMan.getHtmlElmAll()
	* @see 	ElementMan.insertElmInBuffer()
	* @see 	History.getHtml()
	* @see 	Site.clearHtml()
	* @see 	ElementMap.reloadCode()
	* @see 	ElementSettingGrid.editDesctopCount()
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	ElementSettingGeneral.editBlockingMove()
	* @see 	StyleCanvas.setNewFloatSide()
	*/	
	this.create = function() 
	{
		if (!Element.obj) return false;
		
		// создаем ставим
		this.addBlock();
		// ставим блок ровно
		StyleMenuTransform.setTransformResizeBlock(); 

		this.addAddedBlock();

		if (Editor.isModeSimple()) {
			ModeSimple.create();
		}

		// события для секции, для блока манипуляции
		var elmType = Element.data.type;
		if ((elmType == "section" && Element.data.is_added_block)) {
			ElementManController.setEventModeSimpleMove();
			ModeSimple.setPropetyModeSimple();
		} else if (elmType == "nav-button-mobile") {
			ElementNavPanelMobile.setEvent();
		}

		// событие для кнопки
		TemplateSection.setEvent();
		// события
		this.setEvent();
		//ставим размер 
		this.setSize();
	}

	/** 
	* Ставит размер
	*
	* @see 	this.create()
	* @see 	ElementCss.updateStyle()
	* @see 	Editor.setSize()
	* @see 	EditorController.setEventEditScreen()
	* @see 	Editor.setPropertyPageModal()
	* @see 	Grid.setPropety();
	*/
	this.setSize = function()
	{
		// выравниваем по середине
		var secContentWidthV = Element.getWidth($(".site .section:not([class-added]) .section-content"));
		// if (secContentWidthV < 900) secContentWidthV = 900;
		var secContentLeftV = ($(".content .section").width() - secContentWidthV) / 2;
			
		$(".addedBlockSectionWrap, .grid").css({"width":secContentWidthV+"px", "left":secContentLeftV+"px"});
	}

	this.addAddedBlock = function()
	{
		var elm = Element.obj;
		if (elm.hasClass("section")) {
			elmContentV = elm.find('.section-content');
			// вставляем дополнительный блок для секции
			if (Element.data.is_added_block) {
				var block = this.getAddBlockForSection();
				elmContentV.prepend(block);
			}
		} else if (elm.hasClass("modal")) {
			var block = this.getAddBlockForSection();
			elm.prepend(block);
		}

		// добавляем дополнительный блок
		if (Element.data.addAddedBlock) Element.data.addAddedBlock();
		// расположение дополнительного блока у элемента
		ElementBasic.setPositionAddedBlock();
	}

	/**
	* Показать элемент
	*
	*/
	this.show = function()
	{
		$(".resizeBlock").removeClass("resizeBlockHide");
	}

	this.isShow = function()
	{
		if (Element.data.no_move) return false;
		else return true;
	}

	/**
	* Спрятать элемент
	*
	*/
	this.hide = function()
	{
		$(".resizeBlock").addClass("resizeBlockHide");
		ModeSimple.hideSimpleBlock();
	}

/************************************************************************************************/
	/**
	* Добавляет к элементу кнопки(изменения размера)
	*
	* @see 	this.create() Resize.addBlock();
	*/
	this.addBlock = function()
	{
		//удаляем блок
		this.remove();
		
		var elm = Element.obj;
		var elmType = Element.data.type;

		if (Editor.isModeSimple()) {
			if (elm.hasClass("section")) elm = elm.find("> .section-content");
			elm.attr('border', 'true');
		} else if ( (!Element.data.no_move || !Element.data.no_resize) ) { //если можно изменять размер
			var moveBlock = '';

			var blockEditWidth = '<div class="moveCenterRight" side="center_right"></div>\
										<div class="moveCenterLeft" side="center_left"></div>';

			var resizeBlock = '	<div class="resizeBlock">\
									<div class="lineElementCenter"></div>\
									<div class="moveLeft resizeBlockSide" side="left"></div>\
									<div class="moveRight resizeBlockSide" side="right"></div>\
									<div class="moveTop resizeBlockSide" side="top"></div>\
									<div class="moveBottom resizeBlockSide" side="bottom"></div>\
									'+blockEditWidth+'\
								</div>';				

			// вставляем на страницу 
			// 
			if (elm.hasClass("row")) elm.eq(0).append(resizeBlock);
			else if (elm.hasClass("nav")) elm.eq(0).append(resizeBlock); 
			else elm.eq(0).prepend(resizeBlock);
		//если нельзя изменять
		} else {
			if (elm.hasClass("section")) elm = elm.find("> .section-content");
			elm.attr('border', 'true');
		}
	};

	/**
	* Удаляем
	*
	* @see 	this.addBlock
	* @see 	ElementMan.getHtmlElmAll()
	* @see 	History.getHtml()
	* @see 	Site.clearHtml()
	*/
	this.remove = function()
	{	
		$('.resizeBlock, .addedBlock, .butAddTemplate, .addedBlockSectionWrap, .sectionAddedPanel').remove();

		//убираем рамку
		var listElm = $('.element, .section-content');
		listElm.removeAttr("border").removeAttr("data-hover");

		if (!Element.obj.closest(".block-hover-active").length) listElm.removeAttr("data-active");

		ModeSimple.hideSimpleBlock();
	}

	/**
	* Дополнительный элемент
	*
	* @see 	this.addBlock()
	*/
	this.getAddBlockForSection = function()
	{
		var block = '';
			
		// если не коммерческий 
		if (!Site.isCommerce()) {
			block += '<div class="butAddTemplate">'+Resource.hlp_canvas_but_create_template+'</div>'
		}
		
		var elm = Element.obj;
		if (elm.hasClass("section")) {
			block += '\
			<div class="addedBlockSection addedBlock">\
				<img src="/img/editor/simple/top.png" alt="" class="butAddedItemSection butPrevSimpleBlock butMoveSection" type="moveUp" />\
				<img src="/img/editor/simple/bottom.png" alt="" class="butAddedItemSection butNextSimpleBlock butMoveSection" type="moveDown" />\
			</div>';

			block = '<div class="addedBlockSectionWrap addedBlock">'+block+'</div>';
		}

		return block;
	}

/*********************************************************************************************/
	
	/**
	* Событие блока - изменения размера
	*
	* @uses 	StyleCanvas.*()
	* @uses 	MenuStyleSet.proportions() 	устанавливаем значение в правой панели
	* @see 		this.create()
	* @todo  	разбить на функции
	*/
	this.setEvent = function()
	{	
		if (Editor.isModeSimple()) return false;
		else if (Element.data.no_resize) return false;

		var obj = this;//объект
		var elm = Element.obj;
		var elmWidth = Element.data.type == "section" ? elm.find(".section-content") : elm;

		//классы кнопак resize
		var listMove = ".moveCenterLeft, .moveCenterRight"; //список элементов
		$(listMove).off('mousedown');
		$(listMove).on('mousedown', function(e) {
			Data.is_move = false;
			var elmEvent = $(this);
			var listProperty = StylePosition.getListProperty(elm);

			//данные
			var data = {};
			data['elm'] = elm;
			data['is_static'] = StylePosition.isStatic(elm);
			data['list_elm'] = Element.getAllObject(elm, true);
			data['top_property'] = listProperty[0];
			data['left_property'] = listProperty[1];
			data['x'] = e.pageX;
			data['y'] = e.pageY;
			data['padding_h'] = Element.getPaddingH();
			data['width'] = elm.width();//Element.getWidth();
			data['height'] = elm.height();
			data['top'] = parseFloat(elm.css(data['top_property']));
			data['left'] = parseFloat(elm.css(data['left_property']));

			// для модульной сеткии
			var pointZero = $(".section .section-content:first").offset().left;
			if ($(this).hasClass("moveCenterLeft")) {
				data['оffsetLeft'] = elm.offset().left - pointZero + data['width'];
			} else {
				data['оffsetLeft'] = elm.offset().left - pointZero + Element.getPaddingH();
			}
			
			// позиционирование по центру
			data["isPositionCenter"] = Element.isPositionCenter(elm);
			
			// ставим максимальную ширину
			obj.setMaxWidth(elm, data["isPositionCenter"], data);

			// для пропорции
			var params = {
				"elmWidth":elmWidth,
				"side":$(this).attr('side'), //класс кнопки
				"isProportion":elmEvent.attr("proportion"),//есть ли пропорция
				"indexProportion":data['width']/data['height'],
				"proportionOtherSide":elmEvent.attr("otherSide")
			}
			
			//событие передвижение мышью
			obj.setEventMouseMove(elm, data, params);
			// отпускание мыши
			obj.setEventMouseUp(elm);

			return false;
		});
	}

	this.setMaxWidth = function(elm, isPositionCenter, params)
	{
		var elmParent = elm.parent();
		this.maxWidth = elmParent.width();
		var left = parseFloat(elm.css(params.left_property));	
		var widthParent = Element.getParentWidth(elm);
		var width = params.width;
		var paddingH = params['padding_h'];
		//позиционирование по центру
		if (isPositionCenter) {
			this.maxWidthLeft = widthParent - paddingH;
			this.maxWidthRight = widthParent - paddingH;
		} else { 
			if (params.left_property == "right" || params.left_property == "margin-right") { //это absolute позиционирование right
				this.maxWidthLeft = widthParent - left - paddingH;
			} else {
				var positionRight = widthParent - left - width;
				this.maxWidthLeft = widthParent - positionRight;
			}

			this.maxWidthRight = widthParent - left - paddingH;
		} 
	}

/**************************************************************************************************/

	/**
	* Передвижение клавиши мышки
	* @see 	this.setEvent()
	*/
	this.setEventMouseMove = function(elm, data, params)
	{
		var obj = this;//объект
		var newMoveX = 0;
		var resetLeftAuto = false;
		this.isMarginLeftAuto = ElementCss.getStyle("margin-left", "geometry") == "auto" ? true : false;

		$(document).off('mousemove');
		$(document).on('mousemove', function(e) {
			//изменяем размер(стало)
			data['moveX'] = e.pageX - data['x'];
			data['moveY'] = e.pageY - data['y'];
			
			// сбрасываем margin-left auto
			if (params["side"] == "center_right" && obj.isMarginLeftAuto 
						&& !data["isPositionCenter"] 
						&& !resetLeftAuto) {
				data.list_elm.css("margin-left", parseFloat(elm.css("margin-left")));
				$(".butGeometryAlign").removeAttr("chosen");
				resetLeftAuto = true;
				obj.isMarginLeftAuto = false;
			}

			//запускаем функцию изменения размера
			var isMoveLeft = params["side"] == "center_left";
			obj.setWidth(data, isMoveLeft);

			obj.isResize = true;
		})
	}

	/**
	* Отпускание клавиши мышки
	*
	* @see 	this.setEvent()
	*/
	this.setEventMouseUp = function(elm)
	{
		var obj = this;
		//отжатие кнопки
		$(document).on('mouseup', function() {
			$(document).off('mousemove');
			$(document).off('mouseup');
			
			Data.is_move = true;
			obj.isResize = false;
			
			if (obj.isMarginLeftAuto) elm.css("margin-left", "auto");

			// если px и элемент на всю ширину, ставим 100%
			var unit = StyleUnit.getUnitMenu("width");
			var elmWidth = elm.width();
			if (unit == "px") {
				var elmParentObjV = elm.parent();
				var parentWidth = elmParentObjV.width() - 5;
				elmWidth = Element.getWidth(elm);

				if (parentWidth <= elmWidth) {
					StyleUnit.setUnitMenu("width", "%");
					// elm.width("100%");
					ElementCss.setStyle({"width":"100%","margin-left":"0px", "margin-right":"0px"}, elm);
					StyleMenuGeometry.setMGAlign(elm);
				}
			}

			// ставим стиль
 			ElementCss.set("geometry");

			// если modal ставим позицию линейки
			if (Screen.isModal()) Editor.setScale();

			// фиксируем историю
			History.record();
			
			return false;
		});
	}

/**************************************************************************************************/

	/**
	* Ставит ширину 
	*
	*/
	this.setWidth = function(params, isMoveLeft)
	{
		var left = parseFloat(params['moveX']);
		var elm = params.elm;	

		// движение в лево(кнопка с лева)
		if (isMoveLeft) left *= (-1);
		// если по центру стоит, то в два раза быстрей, увеличение в 2 стороны
		if (params["isPositionCenter"]) left *= 2;

		var width = parseFloat(params['width']) + left;

		if (!isMoveLeft) { //движение в право
			// позиционирование с право, смещаем
			if (params.left_property == "right" || params.left_property == "margin-right") {
				var rightValue = params.left - left;
				if (rightValue < 0) { //упирается в правый край
					rightValue = 0;
					width = params.width + params.left;
				}

				// доделать
				if (width > 10) {
					elm.css(params.left_property, rightValue+"px");	
				}
			// больше максимальной ширины
			} else if (width > this.maxWidthRight) {
				width = this.maxWidthRight;
			}
		} else { //движение в лево
			// ширина больше максимальной
			if (this.maxWidthLeft && this.maxWidthLeft < width) width = this.maxWidthLeft;
			// меньше минимальной ширины
			if (width < 11) width = 12; 

			// не по центру и не справа
			if (!params["isPositionCenter"] 
					&& params.left_property != "right"
					&& params.left_property != "margin-right") {
				var leftValue = this.maxWidthLeft - width;
				params.list_elm.css(params.left_property, leftValue);	
			}
		}
		
		if (width > 10) {
			// если больше максимальной ширины
			if (this.maxWidth < width) width = this.maxWidth;
			// ставим значение
			params.list_elm.width(parseInt(width));
			return true;
		} else {
			return false;
		}
	}

/****************************************************************************************/
}//end class

