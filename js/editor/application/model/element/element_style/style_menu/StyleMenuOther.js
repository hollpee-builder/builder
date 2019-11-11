/**
* Other элемента
*
*
*/
StyleMenuOther.prototype = StyleMenu;
var StyleMenuOther = new StyleMenuOther();
function StyleMenuOther() {
	/**
	* Установить
	*/
	this.set = function(elm)
	{
		// z-index
		this.setZindex(elm);
		this.setOverflow(elm);
		this.setCursorF(elm);
	}

	/**
	* Установка z-index
	*
	*/
	this.setZindex = function(elm) 
	{
		value = elm.css('z-index');
		// if (value == 2) value = 0;
		
		$('.valueZindex').val(value);
		// if (elm.css("position") == "absolute" || elm.hasClass("section")) {
		// } else {
			// $(".menuOther").css("display", "none");
		// }
	}

	this.setOverflow = function(elm)
	{
		var value = ElementCss.getStyleAllScreen("overflow", false, false, elm);
		if (!value) {
			if (elm.hasClass("hlp-tabs") 
					// || elm.hasClass("hlp-embed") 
					// || elm.hasClass("block")
					) {
				value = "hidden";
			} else {
				value = "visible";
			}
		}
		Select.set($(".selectStyleOtherOverflow"), value);
	}

	this.setCursorF = function(elm)
	{
		var value = ElementCss.getStyleAllScreen("cursor", false, false, elm);
		if (!value) value = "auto";

		Select.set($(".selectStyleOtherCursor"), value);
	}
/***************************************************************************************/	
	
	this.editOverflow = function(elm, value)
	{
		elm.css("overflow", value);
	}

	this.editCursor = function(elm, value)
	{
		elm.css("overflow", value);
	}

	/*изменение*/
	/**
	* Ставим zindex
	*
	*
	*/
	this.editZindex = function(elm, value)
	{
		// if (value < 2) {
		// 	value = 2;
		// 	$(".valueZindex").val(value);
		// }

		elm.css('z-index', value);
	}
/*****************/
	/**
	* Экстрэмум zindex
	*
	*/
	this.editZindexExtremum = function(elm, value)
	{
		//список элементов секции в который находиться выбраный элемент
		if (elm.hasClass("section")) {
			var listElm = $(".section");
		} else {
			var listElm = elm.closest('.element-content').find('> .element');
		}
		
		// получаем экстремум
		var extremunValue = this.getExtrZindex(listElm, value);

		// количество элементов с таким экстремумом
		var currZindexValue = elm.css("z-index");
		var countElmExtremum = listElm.filter(function() {
			return $(this).css("z-index") == currZindexValue ? true : false;
		});

		// если элемент не является экстремумом или их несколько
		if ((currZindexValue != extremunValue) || (countElmExtremum.length > 1)) {
			if (value == "min") {
				extremunValue = extremunValue > 150 ? extremunValue - 100 : extremunValue - 10;
			} else {
				extremunValue += 100;
			}

			// ставим значение
			$('.valueZindex').val(extremunValue);
			elm.css('z-index', extremunValue);
		}

		// сбрасываем у кнопки выделение
		$(".zindexExtremum .menuButValue").removeAttr("chosen");
	}

	/**
	*  Отдает экстремум z-index
	* 
	* @param 	string 		type(max|min) - тип экстремума	 	 		
	* @return 	int 		экстремум z-index элементов секции
	*
	* @see 		this.editZindexExtremum()
	*/
	this.getExtrZindex = function(listElm, type)
	{
		//начальное значение - для max это 0, а для min это max значение z-index
		var extrval = type == 'max' ? 0 : parseInt($('.valueZindex').val());
		
		//проходим циклом каждый элемнт
		for (var i = 0; listElm[i]; i++) {
			//значение текущего
			var zindex = parseInt(listElm.eq(i).css('z-index'));
			
			if (type == 'max') {
				//определяем если текущий больше максимального
				if (zindex > extrval) {
					extrval = zindex;
				}
			} else {
				//определяем если текущий больше максимального
				if (zindex < extrval) {
					extrval = zindex;
				}
			}

		}
		return extrval;
	}

/**************************************************************************************/
} //end class









