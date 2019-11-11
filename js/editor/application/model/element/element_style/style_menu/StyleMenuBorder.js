/**
* Border элемента
*
*
*/
StyleMenuBorder.prototype = StyleMenu;
var StyleMenuBorder = new StyleMenuBorder();
function StyleMenuBorder() {
	/**
	* Установить 
	*
	*/
	this.set = function(elm)
	{
		//стиль 
		this.setStyle(elm);
		//толшина
		this.setWidth(elm);
		//цвет
		this.setColor(elm);
		//закругление
		this.setRadius(elm);
		//отмечаем стороны border
		this.setSide(elm);
	}

	/**
	* Стиль рамки
	* @see 	this.border()
	* @see 	this.setSide()
	*/
	this.setStyle = function(elm, borderStyle)
	{
		if (!borderStyle) borderStyle = this.getStyle(elm);
		if (!borderStyle) borderStyle = 'none';

		$(".menuValueBorderStyle .menuButValue[value='"+borderStyle+"']")
										.attr("chosen", "true");
	}

	/**
	* Толшина рамки
	*
	* @uses 	this.getWidth()-parent 	получить толшину рамки
	* @see 		this.border()
	*/
	this.setWidth = function(elm)
	{
		var borderWidth = this.getWidth(elm);
		
		var isBorderStyleNone = $(".menuValueBorderStyle .menuButValue[value='none']")
																.filter("[chosen='true']")
																.length; 
		// if (!borderWidth) borderWidth = 1;
		// else if (!borderWidth) borderWidth = 2;

		$(".valueBorderSize").val(borderWidth);
	}

	/**
	* Цвет рамки
	*
	* @see 	this.border()
	*/
	this.setColor = function(elm)
	{
		var colorRgba = elm.css("border-color");
		var elmEvent = $('.valueBorderColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);
	}

	/**
	* Получить толшину рамки
	*
	* @param 	obj 	elm-выбраный элемент
	*
	* @see 	this.setWidth()
	* @see 	this.setStandartWidth()
	*/
	this.getWidth = function(elm)
	{
		//список - ширина сторон 
		var list = elm.css('border-width').match(/[0-9]+/ig, '');
		
		if (!list) return 0; //для firefox
		//отдаем значение не равно 0
		for (var i = 0; i < 4; i++) {
			value = parseInt(list[i]);
			//если не равно 0, отдаем результат
			if (value > 0) {
				return value;
				break;
			}
		}
		return 0;
	}

	/**
	* Отдает стиль
	*
	* @see 	this.editWidth()
	* @see 	this.setStyle()
	* @see 	this.setStandartStyle()
	* @see 	this.editSide()
	*/
	this.getStyle = function(elm)
	{
		var list = elm.css("border-style").match(/[a-z]+/ig, '');	
		if (!list) return false;
		
		//отдаем значение не равно 0
		for (var i = 0; i < 4; i++) {
			value = list[i];
			//если не равно none
			if (value && value != "none") return value;
		}
		return "none";
	}
/*********************************************************************/
	/**
	* @var 	array 	список сторон - класс и css стиль
	* @see 	this.borderRadius()
	*/
	this.listBorderRadius = {'valueBorderRadiusTr':'border-top-right-radius',
							'valueBorderRadiusTl':'border-top-left-radius',
							'valueBorderRadiusBr':'border-bottom-right-radius',
							'valueBorderRadiusBl':'border-bottom-left-radius'}

	/**
	* закругление рамки
	*
	* @uses 	this.listBorderRadius 					список сторон - класс и css стиль
	* @see 		this.border()
	* @todo 	переработать фукцию
	*/
	this.setRadius = function(elm)
	{
		//стороны
		var list = this.listBorderRadius;

		var diff_value = false;
		var old_value = '';

		//устанавливаем стороны
		for (var k in list) {
			var value = elm.css(list[k]).replace(/px/ig, '');
			
			if (old_value != value && k != 'valueBorderRadiusTr') {
				diff_value = true
			}

			old_value = value;

			//элемент input  скролла
			var elm_input = $('.'+k);
			//устанавливаем значение
			elm_input.val(value);
		}

		//у рамки разные стороны
		if (diff_value) {
			//прячем блок стороны
			$('.menuBorderRadiusSide').css('display', 'block');
			//показываем все стороны
			$('.menuBorderRadiusAll').css('display', 'none');
		//одинаковые стороны
		} else {
			//прячем блок стороны
			$('.menuBorderRadiusSide').css('display', 'none');
			//показываем все стороны
			$('.menuBorderRadiusAll').css('display', 'block');

			//вставляем значение
			var elm_all = $('.valueBorderRadiusAll');
			elm_all.val(value);
		}
		
	}
/**********************************************************************/
	/**
	* @var 	array 	писок классов checkbox - стороны рамки
	*
	* @see 	this.setSide()
	* @see 	this.setAllSide()
	*/
	this.listBorderSide = { 'handBorderTop': 	'top',
							'handBorderBottom': 'bottom',
							'handBorderLeft': 	'left',
							'handBorderRight': 	'right'
						}

	/**
	* установить chekcbox для бордер
	*
	* @see 		this.border()
	*/
	this.setSide = function(elm)
	{
		//список
		var list = this.listBorderSide;
		
		//проходим все стороны
		var countHide = 0;
		for (var name in list) {
			var side = "border-"+list[name]+"-style";
			var value = elm.css(side);
			// console.log(value)
			// статус - ставить или не ставить
			var status = value == "none" ? false : true;
			//устанавливаем стороны
			CheckBox.set($('.'+name), status);
			// количество не видных
			if (!status) countHide++;
		}

		// если все не видны, то все показываем
		if (countHide == 4) this.setAllSide(elm, true);

		// если все сотороны ноне(отключение каждой стороны)
		var allSideStyle = $(".menuValueBorderStyle .menuButValue[chosen='true']").attr("value");
		// if (allSideStyle && value) {
		// 	$(".menuValueBorderStyle .menuButValue").removeAttr("chosen")
		// 											.filter("[value='solid']")
		// 											.attr("chosen", "true");
		// }
	}

	/**
	* Отмечает все стороны
	*
	* @see 	this.setSide()
	* @see 	this.editBorderSide()
	* @see 	this.clearAllSide()
	*/
	this.setAllSide = function(elm, status)
	{
		// стававим none
		var list = this.listBorderSide; 
		for (var name in list) {
			var side = "border-"+list[name]+"-style";
			CheckBox.set($('.'+name), status);
		}
	}
/**************************************************************************************************/
/************************************************************************************************/
	// стиль
	this.editStyle = function(elm, value, elmEvent)
	{
		this.edit(elm, value, "style", elmEvent);
	}

	// цвет
	this.editColor = function(elm, value, elmEvent)
	{
		this.edit(elm, value, "color", elmEvent);
	}


	// размер
	this.editWidth = function(elm, value, elmEvent)
	{
		this.edit(elm, value, "width", elmEvent);
	}
/**********************************************************************************************/
	/**
	* Изменяет бордер
	*
	* @see 	this.editStyle(), this.editWidth(), this.editColor()
	* @see 	this.editBorderSide()
	*/
	this.edit = function(elm, value, stylePart, elmEvent) {
		// если в состоянии
		var typeStyle = Element.isStateStatic(elm) ? "geometry" : "style";
		// убираем все стороны, если style 
		if (stylePart == "style") this.clearAllSide(elm, typeStyle);

		// значения
		var style = $(".menuValueBorderStyle .menuButValue[chosen='true']").attr("value");
		var width = $(".valueBorderSize").val();
		var color = Color.getRgbaFromMenu($(".valueBorderColor"));

		var isGeneralV = Element.isGeneral(elm);

		if (isGeneralV) {
			if ( (stylePart == "width" && !parseInt(width))
					||  (stylePart == "style" && value == "none") ) {
				this.clearAllBorder();
				return false;
			}
		}

		if (isGeneralV) {
			if (style == "none") {
				style = "solid";
				this.chosenStyle("solid");
			} 
			if (!parseInt(width)) {
				width = 1;
				$(".valueBorderSize").val(1);
			}
		}
			
		// ставим стиль
		var listStyle = {};

		if (isGeneralV) {
			if (!width) {
				width = 1;
				$(".valueBorderSize").val(1)
			}

			var property = "border";
			listStyle[property] = width+"px "+style+" "+color;
		} else {
			var property = "border-" + stylePart;
			if (stylePart == "style") value = style;
			else if (stylePart == "color") value = color;
			else if (stylePart == "width") value = width + "px";
			listStyle[property] = value;
		}

		// ставим стили
		ElementCss.set(typeStyle, elm, false, listStyle);
	}

	/**
	* Очищает все стороны
	*
	* @see 	this.edit()
	*/
	this.clearAllSide = function(elm, cssType, noSet)
	{
		// if (!cssType) cssType = "geometry";
		// cssType = "geometry";

		var listClear = ["border-top-style", "border-bottom-style", "border-left-style", "border-right-style"];
		ElementCss.clear(listClear, cssType);

		// показываем все стороны
		this.setAllSide(elm, true);//галочки
	}
/**********************************************************************************************/
	//стороны
	this.editTop = function(elm, value) 
	{
		this.editBorderSide(elm, 'top', value);
	};
	//стороны
	this.editBottom = function(elm, value) 
	{
		this.editBorderSide(elm, 'bottom', value);
	};
	//стороны
	this.editLeft = function(elm, value) 
	{
		this.editBorderSide(elm, 'left', value);
	};
	//стороны
	this.editRight = function(elm, value) 
	{
		this.editBorderSide(elm, 'right', value);
	};

	/**
	* Изменяет все стороны
	*
	* @see 	this.edit()
	*/
	this.editAllSide = function(elm, status)
	{
		this.editBorderSide(elm, 'top', status);
		this.editBorderSide(elm, 'left', status);
		this.editBorderSide(elm, 'bottom', status);
		this.editBorderSide(elm, 'right', status);
	}

	/**
	* Изменение стороны
	*
	* @param 	obj 		elm - выбраный элемент
	* @param 	string 		side - сторона
	* @param 	int 		value - значение
	*
	* @see     	this.valueBorder*
	* @see 		this.editF()
	*/
	this.editBorderSide = function(elm, side, value)
	{
		var isGeneralV = Element.isGeneral(elm);

		// если стиль none
		if (this.getStyle(elm) == "none") {
			// this.setAllSide(elm, true);
			if (isGeneralV) {
				var borderColor = Color.getRgbaFromMenu($(".valueBorderColor"));
				var borderValue = "1px solid "+borderColor;
				elm.css("border", borderValue);
				this.chosenStyle("solid");
				$(".valueBorderSize").val(1);

				ElementCss.set("geometry", elm);
			} 
		}

		var typeStyle = Element.getState(elm) ? "style" : "geometry";
		var style = 'border-'+side+"-style";

		//убираем
		if (value == 0) {
			var countChecked = CheckBox.countChecked($(".handBorder"));
			// ставим none, если все убраны
			if (!countChecked && isGeneralV) {
				this.setNone();
				return false;
			}

			// если нету none т основного класса
			if (elm.css(style) != "none") elm.css(style, "none");
		} else { //ставим
			if (Editor.isDesktop() && !Element.existClassAdded(elm)) {
				ElementCss.clear(style, "geometry");
			} else {
				var borderStyle = $(".menuValueBorderStyle .menuButValue[chosen='true']").attr("value");
				elm.css(style, borderStyle);
			}
		}

		ElementCss.set(typeStyle, elm);
	};

	/**
	* Установка none
	*
	* @see 	this.editBorderSide()
	* @see 	this.edit()
	*/
	this.setNone = function()
	{
		if (Element.isGeneral()) {
			this.clearAllBorder();
			this.chosenStyle("none");
		} else {
			$(".menuValueBorderStyle .menuButValue[value='none']").mousedown();
		}
		$(".valueBorderSize").val(0);
	}

	this.clearAllBorder = function()
	{
		ElementCss.clear(["border", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style"], "geometry");
		this.setAllSide(Element.obj, true);
	}

	/**
	* Ставит стиль
	*
	* @see 	this.editBorderSide()
	*/
	this.chosenStyle = function(styleValue)
	{
		$(".menuValueBorderStyle .menuButValue").removeAttr("chosen")
									.filter("[value='"+styleValue+"']")
									.attr("chosen", "true");
	}

/********************************************************************************************/
	//скругление как полностью так и сторон
	this.editRadiusAll = function(elm, value)
	{
		this.editRadius(elm, value, "border-radius");
	}
	this.editRadiusTl = function(elm, value)
	{
		this.editRadius(elm, value, "border-top-left-radius");
	}
	this.editRadiusTr = function(elm, value)
	{
		this.editRadius(elm, value, "border-top-right-radius");
	}
	this.editRadiusBl = function(elm, value)
	{
		this.editRadius(elm, value, "border-bottom-left-radius");
	}
	this.editRadiusBr = function(elm, value)
	{
		this.editRadius(elm, value, "border-bottom-right-radius");
	}

	this.editRadius = function(elm, value, cssStyle)
	{
		elm.css(cssStyle, value+'px');
	}
/**********************************************************************************************/
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		this.turnBlockBorderRadius(); //радиус
	}

	/**
	* сворачивание скругления для border
	*
	* @uses 	StyleMenu.setScroll() 	установка скролла на позицию
	* @see 		this.setEvent()
	*/
	this.turnBlockBorderRadius = function()
	{
		//развернуть
		$('.menuBorderRadiusAll .borderRariusImg').off('mousedown');
		$('.menuBorderRadiusAll .borderRariusImg').on('mousedown', function() {
			//убираем блок все стороны
			$('.menuBorderRadiusAll').css('display', 'none');

			//показываем блок стороны
			elm_block_side = $('.menuBorderRadiusSide');
			elm_block_side.css('display', 'block');

			//задаем значения сторонам равное всем сторонам
			elm_block_side_input = elm_block_side.find('input');
			var value = $('.valueBorderRadiusAll').val();
			elm_block_side_input.val(value);

			//устанавливаем скролл
			StyleMenu.setScroll(elm_block_side_input);
		});

		//свернуть
		$('.menuBorderRadiusSide .borderRariusImg').off('mousedown');
		$('.menuBorderRadiusSide .borderRariusImg').on('mousedown', function() {
			//убираем блок стороны
			$('.menuBorderRadiusSide').css('display', 'none');

			//показываем блок все стороны
			$('.menuBorderRadiusAll').css('display', 'block');
			//получаем значение стороны TL
			var value = $('.valueBorderRadiusTl').val();
			//задаем всем сторонам полученое значение
			var elm_input_all = $('.valueBorderRadiusAll');
			elm_input_all.val(value);
			//устанавливаем скролл
			StyleMenu.setScroll(elm_input_all);
			
			// очищаем стороны
			var listBorderSide = [
				"border-top-left-radius", "border-top-right-radius", 
				"border-bottom-left-radius", "border-bottom-right-radius"];
			ElementCss.clear(listBorderSide);

			//закругляем сам элемент
			Element.obj.css('border-radius', value+'px');
		});
	}
/**********************************************************************************************/
/**********************************************************************************************/








} //end class









