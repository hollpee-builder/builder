/**
* Позиция элемента 
*
*/
var StylePosition = new StylePosition();
function StylePosition() {
	/**
	* Отдает значение позиции (margin-top или top)
	*
	* @see 	StyleCanvas.setEventMoveElement()
	* @see 	StyleCanvas.fixedHistoryMove()
	* @see 	Resize.getPropertyPosition()
	* @see 	Key.moveElm()
	* @see 	Resize.setMaxWidth()
	*/
	this.get = function(side, elm) 
	{
		if (!elm) elm = Element.obj;
		var partStyle = this.isStatic() ? "margin-" : "";
		var value = elm.css(partStyle+side);

		if (value == "auto") value = 0;
		return parseFloat(value);
	}

	/**
	* Отдает максимальное position left
	*
	* @see 	Resize.setMaxWidth()
	*/
	this.getMaxPositionLeft = function(elm)
	{
		var floatSide = elm.css("float") == "left" ? "right" : "left";
		var elmParent = elm.parent();

		// выбираем элемент крайний с другой стороны
		var listBrother = elmParent.find(">.element"); 
		var lastElm = listBrother.filter(function() {
			var isSide = $(this).css("float") == floatSide ? true : false;
			var isNot = $(this).css("display") == "none" ? true : false;
			return isSide && !isNot ? true : false;
		}).filter(":last()");
		

		if (!lastElm.length) return elmParent.width();

		var positionLeft = lastElm.position().left;
		
		if (floatSide == "left") {
			positionLeft += parseFloat(lastElm.css("margin-left"));
			positionLeft += Element.getWidth(lastElm);
		}

		return positionLeft;
	}
/******************************************************************************************/
	/**
	* Ставит значение в меню
	*
	* @see 	Key.moveElm()
	*/
	this.setInMenu = function(top, left)
	{
		var elm = Element.obj;

		if (this.isStatic()) {
			$('.valueMarginTop').val(parseInt(ElementCss.getStyle("margin-top", "geometry")));
			
			var elmLeft = ElementCss.getStyle(left, "geometry");
			elmLeft = elmLeft ? parseInt(elmLeft) : 0;
			var propertyInput = left == "margin-left" ? $('.valueMarginLeft') : $('.valueMarginRight');
			propertyInput.val(elmLeft);
		} else {
			if (top == "bottom") $('.valuePositionBottom').val(parseInt(ElementCss.getStyle("bottom", "geometry")));
			else $('.valuePositionTop').val(parseInt(ElementCss.getStyle("top", "geometry"))); 
			
			if (left == "right") $('.valuePositionRight').val(parseInt(ElementCss.getStyle("right", "geometry")));
			else $('.valuePositionLeft').val(parseInt(ElementCss.getStyle("left", "geometry")));
		}
	}
/******************************************************************************************/
	/**
	* Узнает элемент статик или нет
	*
	* @see 	this.setPosition(), this.getPosition(), this.setInMenu()
	* @see 	Resize.
	* @see 	StyleCanvas.setEventMoveElement(),StyleCanvas.isNextElm()
	* @see 	ElementMan.setParCopyElm() 
	* @see 	StyleMenu.getInputTop(), StyleMenu.getInputLeft()
	* @see 	StyleMenuGeometry.setEvent()
	* @see 	this.getListProperty()
	*/
	this.isStatic = function(elm)
	{
		if (!elm) elm = Element.obj;
		var typePosition = elm.css("position");
		
		if (typePosition == "static" || typePosition == "relative") return true;
		else return false;
	}
/*********************************************************************************************/
/***********************************************************************************************/
	/**
	* Отдает стороны позиционирования при absolute
	*
	* @see 	this.getListProperty()
	* @see 	this.setNewPostOffset()
	* @see 	ElementStyleGeometry.setPosition()
	* @see 	ElementStyleGeometry.editPositionSide()
	*/
	this.getAdsoluteSide = function(elm)
	{
		if (!elm) elm = Element.obj;
		var sideProperty = elm.attr("position-side");
		if (!sideProperty) sideProperty = "t-l";

		// по вертикали
		var setSideV = sideProperty.match(/t/) ? "top" : "bottom";
		// по горизонтали
		var setSideH = sideProperty.match(/l/) ? "left" : "right";

		var listSide = [setSideV, setSideH, sideProperty];

		return listSide;
	}

	/**
	* Установка со смещением
	*
	* @see 	this.addAddedClassInserting()
	*/
	this.setNewPostOffset = function(elm)
	{
		var listSide = StylePosition.getAdsoluteSide(elm);
		var sideV = listSide[0];
		var sideH = listSide[1];
		var valueV = parseInt(elm.css(sideV)) + 50;
		var valueH = parseInt(elm.css(sideH)) + 50;
		var elmAbsProp = {};
		elmAbsProp[sideV] = valueV+"px";
		elmAbsProp[sideH] = valueH+"px";
		elm.css(elmAbsProp);
	}
	/**
	* Ставит значение
	*
	* @see 	ElementStyleGeometry.setPosition()
	* @see 	StyleMenuGeometry.editPositionType()
	*/
	this.setAdsoluteSide = function(sideProperty, elm)
	{
		if (!sideProperty) sideProperty = "t-l";
		if (!elm) elm = Element.obj;
		elm.attr("position-side", sideProperty);
	}

	/**
	* Очищает
	*
	* @see 	StyleMenuGeometry.editPositionType()
	*/
	this.clearAdsoluteSide = function(elm)
	{
		elm.removeAttr("position-side");
	}

	/**
	* Отдает список параметров
 	*
	* @see 	StyleCanvas.setEventMoveElement()
	* @see 	Resize.setEvent()
	*/
	this.getListProperty = function(elm)
	{
		var listProperty = [];
		if (this.isStatic()) {
			listProperty[0] = "margin-top";
			// listProperty[1] = "margin-left";
			var sideH = elm.css("float");
			if (sideH == "none") sideH = "left";
			listProperty[1] = "margin-"+sideH;
		} else {
			var list = this.getAdsoluteSide(elm);
			listProperty[0] = list[0];
			listProperty[1] = list[1];
		}

		return listProperty;
	}

	/**
	* Очищает параметрв
	*
	* @see 	ElementMan.insert()
	*/
	this.reset = function(elm)
	{
		if (elm.css("position") == "absolute") {			
			var listSide = this.getAdsoluteSide(elm);
			var listStyle = {};
			listStyle[listSide[0]] = "0px";
			listStyle[listSide[1]] = "0px";
			
			ElementCss.setStyle(listStyle, elm);
		} else {
			var listClear = ["margin-top", "margin-left", "margin-top", "margin-right", "float"];
			ElementCss.clear(listClear, "geometry", elm, "desktop");
			// elm.removeClass("float-right");
			StyleMenuGeometry.clearFloatListElm(elm);
		}
	}
/**********************************************************************************************/
/**********************************************************************************************/
	





	
/**********************************************************************************************/
}//end class





