/**
* Действия привязаные к кнопкам
*
* @see 	EditorController.setEventKey()
*/
var Key = new Key();
function Key() {
	this.statusDownShift = false;

	this.setDown = function(event)
	{
		this.setDownShift(event);
	}

	this.setDownShift = function(event)
	{
		if (event.shiftKey) {
			this.statusDownShift = true;
		}
	}

	this.isDownShift = function()
	{
		return this.statusDownShift;
	}

	this.resetDown = function()
	{
		this.statusDownShift = false;
	}

/********************************************************************************/

	this.isCtrlKey = function(e)
	{
		return (e.ctrlKey || e.metaKey);
	}

	/**
	* Сохранение
	*/
	this.key83 = function(e, status)
	{
		if (this.isCtrlKey(e)) {
			Site.save();
			return true;
		}
	}

	/**
	* Переключение режима просмотра и редактирования 
	*/  
	this.key32 = function(e, status)
	{

		if (status) {
			Editor.editMode();	
			return true;
		}
	}
/****история************************************************************************/
	/**
	* 
	*/
	this.key90 = function(e, status)
	{
		if (status) {
			if (this.isCtrlKey(e) && e.shiftKey) {
				$('.topMenuItem[type="next"]').mousedown();
				return true; 
			} else if (this.isCtrlKey(e)) {
				$('.topMenuItem[type="back"]').mousedown();
				return true;
			}
		}
	}	
/****манипуляция с элементам****************************************************************************/
	/**
	* Копировать
	*/
	this.key67 = function(e, status)
	{
		if (this.isCtrlKey(e) && status) {
			$('.topMenuCopy').mousedown();
			// ElementMan.copy();
			return true;
		}
	}

	/**
	* Копировать
	*/
	this.key65 = function(e, status)
	{
		if (this.isCtrlKey(e) && status) {
			$('.topMenuCopy').mousedown();
			ElementMan.isNewClass = true;
			// ElementMan.copy();
			return true;
		}
	}
	
	/**
	* Вырезать
	*/
	this.key88 = function(e, status)
	{
		if (this.isCtrlKey(e) && status) {
			$('.topMenuCut').mousedown();
			// ElementMan.cut();
			return true;
		}
	}

	/**
	* Вставить
	*/
	this.key86 = function(e, status)
	{
		if (this.isCtrlKey(e) && status) {
			$('.topMenuInsert').mousedown();
			// ElementMan.insert();
			return true;
		}
	}

	/**
	* Удалить
	*/
	this.key8 = function(e, status)
	{
		if (status) {
			$('.topMenuDelete').mousedown();
			// ElementMan.delete();
			return true;
		}
	}

	/**
	* Удалить
	*/
	this.key46 = function(e, status)
	{
		if (status) {
			// $('.topMenuItem[type="delete"]').mousedown();
			$('.topMenuDelete').mousedown();
			return true;
		}
	}
/***********************************************************************************************/
	/**
	* сворачивание панели с элементами
	*
	* @event 	turnMenu() 
	*/
	this.key9 = function(e, status)
	{
		$('.butAddElement').mousedown();
		return true;
	}

	/**
	* Закрыть модальное окно
	*
	*/
	this.key27modal = function(e, status)
	{
		Modal.delete();
		return true;
	}
/***передвижение элемента стрелками************************************************************************************************/
	/**
	* влево
	* @uses 	this.moveElm()
	*/
	this.key37 = function(e, status)
	{
		if (status) {
			this.moveElm('left', '-');
			return true;
		}
	}

	/**
	* вверх
	* @uses 	this.moveElm()
	*/
	this.key38 = function(e, status)
	{
		if (status) {
			this.moveElm('top', '-');
		} else {
			this.incDecInput(true, 1);
		}
		return true;
	}

	/**
	* вправо
	* @uses 	this.moveElm()
	*/
	this.key39 = function(e, status)
	{
		if (status) {
			this.moveElm('left', '+');
			return true;
		}
	}

	/**
	* вниз
	* @uses 	this.moveElm()
	*/
	this.key40 = function(e, status)
	{
		if (status) {
			this.moveElm('top', '+');
		} else {
			this.incDecInput(false, 1);
		}
		return true;
	}

	/**
	* Передвигает элемент
	*
	* @see this.key37(), this.key38(), this.key39(), this.key40() 	
	*/
	this.moveElm = function(side, operator) 
	{	
		var elm = Element.obj;
		// // имя input
		var isStatic = elm.css("position") != "absolute";
		if (side == "top" || side == "bottom") {
			if (isStatic) {
				var inputClass = "valueMarginTop";
			} else {
				// получаем список сторон
				var listSide = StylePosition.getAdsoluteSide(elm);
				if (listSide[0] == "bottom") {
					var inputClass =  "valuePositionBottom";
					operator = operator == '+' ? "-" : "+";
				} else {
					var inputClass =  "valuePositionTop";
				}
			}
		} else {
			if (isStatic) {
				var inputClass = "valueMarginLeft";
			} else {
				// получаем список сторон
				var listSide = StylePosition.getAdsoluteSide(elm);
				if (listSide[1] == "right") {
					var inputClass =  "valuePositionRight";
					operator = operator == '+' ? "-" : "+";
				} else {
					var inputClass =  "valuePositionLeft";
				}
			}
		}

		var input = $("."+inputClass);
		var isInc = operator == '+' ? true : false;
		this.incDecInput(isInc, 1, input);
	}

	/**
	* Отдает шаг
	* 
	* @see this.moveElm()	
	*/
	this.getStep = function()
	{
		return $('.toggleMethodMove input:checked').val() == 'true' ? 10 : 1;
	}

	/**
	* Поднятие клавиши
	*
	*/
	this.key37_keyup = function() { this.moveElmKeyUp()}
	this.key38_keyup = function() { this.moveElmKeyUp()}
	this.key39_keyup = function() { this.moveElmKeyUp()}
	this.key40_keyup = function() { this.moveElmKeyUp()}

	/**
	* Отжатие клавиши при перемещениее
	*
	* @see 	SpecialInput.setEvent()
	*/
	this.moveElmKeyUp = function()
	{
		var nextElm = Element.obj.next();
		// фиксируем css следующего элемента
		if (nextElm.length) ElementCss.set("geometry", nextElm);
		ElementCss.noFixed = false;
	}
/*scroll в инпуте**************************************************************************************************/
	this.keyWheelTop = function()
	{
		this.incDecInput(true, 5);
	}

	this.keyWheelBottom = function()
	{
		this.incDecInput(false, 5);
	}

	/**
	* Изменяет значение в input на шаг 
	*
	* @see 	this.key40() 
	* @see 	this.keyWheelTop(), this.keyWheelBottom() 
	*/
	this.incDecInput = function(is_inc, step, inputObj) 
	{
		if (!inputObj) inputObj = $("input:focus");
		if (!inputObj.closest(".inputBlock").length) return false;

		if (step == 1) ElementCss.noFixed = true;

		var value = inputObj.val();
		if (value == "auto" || value == "full" || !value) return false;
		// if (value == "auto") value = SpecialInput.getValueFromAuto(inputObj);		
		value = parseFloat(value);


		// выход за пределы
		var minValue = inputObj.attr("minval");
		var isNoNegavite = inputObj.attr("no-negative"); 
		if (minValue && isNoNegavite != "true") minValue *= (-1);
		else minValue = 0;

		// инкремен декремент
		value += is_inc ? step : step*(-1);
		if (value < minValue) value = minValue;
		
		// не фикисровать историю
		History.isFixed = false;

		//изменяем
		inputObj.val(parseInt(value)).change();
	}
/**************************************************************************************/
} //end class
