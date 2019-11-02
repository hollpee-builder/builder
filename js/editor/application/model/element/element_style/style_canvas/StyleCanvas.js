/**
* Изменение стиля на полотне
*
*/
var StyleCanvas = new StyleCanvas();
function StyleCanvas() {
	/**
	* Статус передвижения
	*/
	this.isMove = false;

/*******************************************************************************/
	/**
	* перемещение блока 
	* 
	* @param 	obj 	elm-элемент 
	* @param 	obj 	ev-событие 	
	*
	* @uses 	StyleCanvas.moveElement() 		перемещение элемента
	* @uses 	this.setValueMoveElement() 		устанавливает значение после передвижение
	* @see 	 	this.setEventCanvas() 			
	*/
	this.setEventMoveElement = function(elm, ev) 
	{
		if (Editor.isModeSimple()) return false;


		var param = {};
		param["is_static"] = StylePosition.isStatic();
		
		var listProperty = StylePosition.getListProperty(elm);
		param["top_property"] = listProperty[0];
		param["left_property"] = listProperty[1];
	
		// переменые необходимые для передвижение
		var param = this.getParamsForMove(elm, ev, param, listProperty);

		// передвижение
		this.setEventMouseMove(param);
		//выключаем перемещение
		this.setEventMoveMouseUp(elm, param);
	}

	/**
	* Отдает параметры для передвижения
	*
	*  @see this.setEventMoveElement()
	*/
	this.getParamsForMove = function(elm, ev, param, listProperty)
	{
		var pointZero = $(".section .section-content:first").offset().left;

		param["elm"] = elm;
		param["list_elm"] = Element.getAllObject(elm, true); 
		param["parent_elm"] = elm.parent().closest(".element");
		param["top"] = parseFloat(elm.css(param.top_property));
		param["left"] = parseFloat(elm.css(param.left_property));
		param["x"] = ev.pageX;
		param["y"] = ev.pageY; 
		param["step"] = 10; 
		param["statusMove"] = $(".toggleMethodMove input:checked").val();
		param["screen"] = ElementCss.getScreen();
		param["elm_class"] = Element.getCurrentClass(); 

		param["input_top"] = StyleMenu.getInputTop(param["top_property"]);
		param["input_left"] = StyleMenu.getInputLeft(param["left_property"]);

		// максимально с  лева
		param["maxLeft"] = Element.getMaxLeft(param["left_property"]);
		param["total_left"] = param["maxLeft"];
		
		var elmWidth = Element.getWidth(elm);

		// для модульной сетки
		this.isPositionRight = param["left_property"] == "margin-right" || param["left_property"] == "right";
		if (this.isPositionRight) {
			param["оffsetLeft"] = elm.offset().left - pointZero + param["left"] + elmWidth;
		} else {
			param["оffsetLeft"] = elm.offset().left - pointZero - param["left"];
		}

		// центровка элемента
		if (elm.css("float") == "none") {
			var parentWidth = Element.getParentWidth(elm);
			param["margin_center"] = (parentWidth / 2 ) - (elmWidth / 2);
			var offsetHLine = 10;
			param["margin_center_min"] = param["margin_center"] - offsetHLine;
			param["margin_center_max"] = param["margin_center"] + offsetHLine;
			param["is_line_center"] = true;
		}
		param["lineCenterObj"] = $(".lineElementCenter");

		if (ElementCss.getStyle("width") == "100%") {
			param["is_line_center"] = false;
		}

		return param;
	}
/*************************************************************************************/
	/**
	* Передвижение событие mouse move
	*
	*  @see this.setEventMoveElement()
	*/
	this.setEventMouseMove = function(param)
	{
		var obj = this;
		var eventCount = 0;
		obj.isMove = false;

		$('body').on('mousemove', function(e) {
			eventCount++;
			if (Data.is_move && !(eventCount % 3)) { //срабатывать на каждое 3 событие
				param["e"] = e;
				obj.isMove = true;
				obj.moveElement(param);
			}
		});
	}

	/**
	* Перемещение элемента
	* 
	* @param 	array() 	param - параметры
	*
	* @see 	ElementStyleControlller.setEventMoveElement()	
	*/
	this.moveElement = function(param)
	{
		// в переменые ложить не надо, переделать
		var elm = param['elm'];
		var listElm = param['list_elm'];
		var parentElm = param['parent_elm'];
		var leftProperty = param['left_property'];
		var topProperty = param['top_property'];
		var e = param['e']; 
		var top = param['top']; 
		var left = param['left'];
		var maxLeft = param["maxLeft"];
		var step = param['step'];
		var statusMove = param['statusMove'];
		var totalLeft = param["total_left"];

		var pageX = e.pageX;
		var pageY = e.pageY;

		//координаты куда переместить
		if (param["top_property"] == "bottom") var moveTop = top + parseInt(param['y'] - pageY);
		else var moveTop = top - parseInt(param['y'] - pageY);

		if (param["left_property"] == "right" || param["left_property"] == "margin-right") {
			var moveLeft = left + parseInt(param['x'] - pageX);
		} else {
			var moveLeft = left - parseInt(param['x'] - pageX);
		}

		// если меньше 0
		if (moveTop < 0) moveTop = 0;
		if (moveLeft < 0) moveLeft = 0;

		// для модульной сетки
		var gridType = this.isPositionRight ? "move_right" : "";

		param["lineCenterObj"].css("display", "none");
		// вырвнивание по центру
		if (param["is_line_center"]) { //если элемент крайний или он один
			
			var minCenter = param["margin_center_min"];
			var maxCenter = param["margin_center_max"];

			// оцентровка по центру
			if (moveLeft > minCenter && moveLeft < maxCenter) {
				
				if (param["is_static"]) listElm.css({"margin-left":"auto", "margin-right":"auto"});
				else listElm.css(leftProperty, param["margin_center"]+"px");
				listElm.css(topProperty, moveTop);
				
				// показываем линию центровки
				var topLine = elm.offset().top - 7;
				if (topLine < 50) topLine = 50;
				param["lineCenterObj"].css({
					"display":"block", 
					"top":"-"+topLine+"px",
					"height": topLine+"px"
				});
				return false;
			}
		} 
		
		if (param["maxLeft"] < moveLeft) moveLeft = param["maxLeft"];
		//если меньше 0 
		if (moveLeft < 0) moveLeft = 0;

		// ставим значение
		listElm.css(leftProperty, parseInt(moveLeft));
		listElm.css(topProperty, parseInt(moveTop));
	}

/*************************************************************************************/
	/**
	* Передвижение событие mouseup
	*
	* @see this.setEventMoveElement()
	*/
	this.setEventMoveMouseUp = function(elm, params)
	{
		var obj = this;
		$('body').off('mouseup');
		$('body').on('mouseup', function() {
			$('body').off('mousemove');
			$('body').off('mouseup');

			$(".lineElementCenter").css("display", "none");
			
			// ставим параметры
			if (obj.isMove) obj.setStyleAfter(elm, params);
		});
	}

	this.setStyleAfter = function(elm, params)
	{
		StyleMenu.fixed("geometry", elm);
		
		var cssMarginLeft = ElementCss.getStyle("margin-left", "geometry");
		var cssMarginRight = ElementCss.getStyle("margin-right", "geometry");

		var isAlignRightV = (params["maxLeft"] - 10) < parseInt(elm.css("margin-left"));
		var cssWidth = ElementCss.getStyleAllScreen("width", "geometry", false, elm);

		// после выравнивания по центру
		if (cssMarginRight == "auto" && cssMarginLeft != "auto") elm.css("margin-right", "0px");
		// выравнивание по праваму краю
		if (isAlignRightV) elm.css({"margin-left":"auto", "margin-right":"0px"});
		// если ширина на 100
		if (cssMarginLeft == "auto" && cssWidth == "100%") elm.css("margin-left", "0px");

		// если выше были установлены стили
		if (elm.attr("style")) ElementCss.set("geometry", elm);
		
		// ставим выравнивание
		StyleMenuGeometry.setMGAlign(elm);
	}

/***********************************************************************************************/
/*********************************************************************************************/
	/**
	* Перемещает scroll на уровень элемента
	*
	* @see 	PageStruct.setEvent()
	* @see 	PageStruct.setEventMarkSelected()
	* @see 	PageStruct.setEventNested()
	* @see 	ElementMan.insert()
	* @see 	ElementBasic.create()
	* @see 	ElementManController.moveUpSection()
	* @see 	ManagerBasic.setEventChoosePage()
	* @see 	TemplateSection.insertTemplatePage()
	* @see 	ElementManController.setEventModeSimpleCopy(), .setEventModeSimpleMove()
	* @see 	History.set()
	*/
	this.setScrollTopElm = function(elm, isAlways)
	{
		if (!elm) elm = Element.obj; 

		if (elm.hasClass("site")) return false;

		var contentElm = $(".contentWrap");
		// получаем top относительно .content
		var scrollElm = this.getOffsetTop(elm);

		// content top и bottom
		var scrollContentTop = contentElm.scrollTop();
		var scrollContentBottom = scrollContentTop + contentElm.height() - 50;//-100 что бы небыло в самом низу
		
		// если входит в промежуток не передвигаем
		if (!isAlways && scrollElm >= scrollContentTop && scrollElm <= scrollContentBottom) {
			return false;
		}
		
		// ставим screenroll
		contentElm.scrollTop(scrollElm - 50);
	}

	/**
	* Отдает позицио элемента на странице 
	*
	* @see 	this.setScrollTopElm()
	*/
	this.getOffsetTop=  function(elm)
	{
		if (!elm.length) return 0;

		var scroll = 0;
		for (var i = 0; i < 50; i++) {	

			scroll += elm.position().top;
			elm = elm.parent().closest(".element, .page");
			if (!elm.length) break; 
		}
		
		return scroll;
	}
/*************************************************************************************************/

}// end class
