/**
* События для всей страницы
*
* @uses 	mySelect() 		селект
* @uses 	myCheckBox() 	checkbox
* @see 		setEvent() 		
*
* @todo переделать в классы
*/
var SpecialInput = new SpecialInput();
function setEventGeneral()
{	
	//селект
	Select.setEvent();
	//check box
	CheckBox.setEvent();
	//панель цвета
	getColorPicker();
	//скролл
	Scroll.setEvent();
	//инпут
	SpecialInput.setEvent();
}
/*****************************************************************************/
/****************************************************************************/
var Select = new Select();
function Select() {
	/**
	* Установка события 
	*
	*
	*/
	this.setEvent = function()
	{
		//redactorFrame redacrotModalButton redactorModal redactorModalItem
		$('.selectBlockButton').unbind('mousedown');
		$('.selectBlockButton').on('mousedown', function() {
			var select = $(this).closest('.select');
			var button = $(this).find('input');
			var option_block = select.find('.optionBlock');

			//открываем
			if (option_block.css('display') == 'none') {
				//закрываем все окна
				$('.optionBlock').css({'display':'none'});
				
				//показываем option
				option_block.css({'display':'block'});
				
				if ($(this).closest('.rightMenuSectionParam').length) {
					$('.rightMenuSectionParam').css('overflow', 'visible');
				}
			//закрываем
			} else {
				option_block.css({'display':'none'})
			}

			//выбор элемента
			$('.option').unbind('mousedown');
			$('.option').on('mousedown', function() {
				var oldElm = select.find('.option[chosen="true"]');
				var newElm = $(this);

				// если выбрано другое значение
				if (oldElm[0] != newElm[0]) {
					//убираем выделение
					select.find('.option').removeAttr('chosen');
					//отмечаем класс как выбраный
					newElm.attr('chosen', 'true');
					
					//отмечаем выбраный элемент
					button.val($(this).text());
					//заносим значение в переменую
					button.attr('val', $(this).attr('value'));
					//вызываем событие
					button.change();
				}
				
				//убираем блок select
				option_block.css({'display':'none'})
			});

			//убираем select при клике вне области
			var docObjV = $(document).add(".optionBlock");
			docObjV.off('mousedown');
			docObjV.on('mousedown', function() {
				if ($(this).hasClass("optionBlock")) return false;
				docObjV.off('mousedown');

				$('.optionBlock').css({'display':'none'});
				$('.rightMenuSectionParam').css('overflow', 'hidden');
			});
			return false;
		});
	}
/************************************************************************************************/
	/**
	* Ставит имя
	*
	*/ 
	this.set = function(parentValue, value)
	{
		if (!parentValue.hasClass("select")) parentValue = parentValue.find(".select");

		// если нету то первый элемент
		if (!value) value = parentValue.find(".option").eq(0).attr("value");
		
		// имя
		var itemName = parentValue.find(".option[value='"+value+"']").html();

		// ставим значение кнопки
		parentValue.find("input[type='button']").val(itemName);
		// отмечаем section 
		parentValue.find(".option").removeAttr("chosen")
									.filter("[value='"+value+"']")
									.attr("chosen", "true");
	}

	this.get = function(parentValue)
	{
		parentValue = parentValue.closest(".select");
		var listOption = parentValue.find(".option[chosen='true']");
		return listOption.length ? listOption.attr("value").trim() : false;
	}

	this.setListOptions = function(selectObj, listValue)
	{
		var listOption = '';
		for (var valueId in listValue) {
			var valueName = listValue[valueId];
			listOption += '<div class="option" value="'+valueId+'">'+valueName+'</div>';
		}

		selectObj.find(".optionBlock").html(listOption);
	}


/*******************************************************************************************/
}//end class
/*************************************************************************************************/
/**************************************************************************************************/
/**
* CheckBox
*
* @uses 	checkBoxSet() 		установить chekbox	
* @see 		setEventPage()
*/
var CheckBox = new CheckBox();
function CheckBox() {
	this.setEvent = function()
	{
		var obj = this;
		$('.checkBox').unbind('mousedown');
		$('.checkBox').on('mousedown', function() {
			elm = $(this);
			var status =  elm.find('.checkBoxChecked').length ? false : true;
			//устанавливаем chekbox
			obj.set(elm, status);
			//эмитируем событие
			elm.find('input').change();
		})
	}

	/**
	* Установить
	*
	* @param 	boolean  	status - ставить или не ставить
	*
	* @see 	checkBox()
	* @see 	MenuStyleSet.borderSide()
	* @see 	MenuStyleEdit.valueBorderStyle()
	*/
	this.set = function(elm, status)
	{
		//input блока
		var child_input = elm.find('input');

		//ставим
		if (status) {
			elm.find(".checkBoxChecked").remove();
			elm.append('<div class="checkBoxChecked" is-image="true"></div>');
			child_input.val(1);
		//убираем
		} else {
			elm.find('.checkBoxChecked').remove();
			child_input.val(0);
		}
	}
/************************************************************************************************/
	/**
	* Общие количество выделенных check
	*
	* @see 	StyleMenuBorder
	*/
	this.countChecked = function(elm)
	{
		return elm.find(".checkBoxChecked").length;
	}

/********************************************************************************************/	
}//end class

/***********************************************************************************************/
/**********************************************************************************************/
/** 
* Устанавливает панель цвета
*
* @uses 	Style.setMenuColor() 	установка цвета в меню
* @see 		setEventPage()
*/
function getColorPicker()
{
	var options = {
		customBG: '#222',
		margin: '4px -2px 0',
		doRender: 'div div',
		opacity: false,
		/**********************/
		objSaveColor: false,
		isActionOpen: 0,
		/*******************/

		// change
		renderCallback: function(elm, toggled) {
			var colors = this.color.colors.RND,
				modes = {
					r: colors.rgb.r, g: colors.rgb.g, b: colors.rgb.b,
					h: colors.hsv.h, s: colors.hsv.s, v: colors.hsv.v,
					HEX: this.color.colors.HEX
				};

			$('input', '.cp-panel').each(function() {
				this.value = modes[this.className.substr(3)];
			});

			/*Изменение************************/
			elm.css("color", "transparent");
			if (isActionOpen) {
				isActionOpen--;
			} else {
				StyleMenu.colorPickerChange();
			}
			/**************************/
		},

		// open
		positionCallback: function(elm) {
			/************/
			StyleMenu.setVariablesColorPicker(elm);
			$(".cp-hlp-color-detail").css("display", "none");
			elm.css("color", "transparent");
			// потому что при открытии происходит 2 изменения
			isActionOpen = 2;
			/***********/
		}, 

		buildCallback: function($elm) {
			
			var colorInstance = this.color,
				colorPicker = this;

			$elm.prepend('<div class="cp-panel">' +
				'R <input type="text" class="cp-r" /><br>' +
				'G <input type="text" class="cp-g" /><br>' +
				'B <input type="text" class="cp-b" /><hr>' +
				'H <input type="text" class="cp-h" /><br>' +
				'S <input type="text" class="cp-s" /><br>' +
				'B <input type="text" class="cp-v" /><hr>' +
				'<input type="text" class="cp-HEX" />' +
			'</div>').on('change', 'input', function(e) {
				var value = this.value,
					className = this.className,
					type = className.split('-')[1],
					color = {};

				color[type] = value;
				colorInstance.setColor(type === 'HEX' ? value : color,
					type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
				colorPicker.render();
				this.blur();
			});
			/**********************************************/
			/**********************************************/

			var colorInstance = this.color,
				colorPicker = this,
				random = function(n) {
					return Math.round(Math.random() * (n || 255));
				};
				/******************/
				getSaveColor = function(n) {
					if (!Data.site.data.colorPicker || !Data.site.data.colorPicker[n]) {
						return 'rgb(190,190,190)';
					} else {
						return Data.site.data.colorPicker[n];
					}
				}
				/******************/

			$elm.append('<div class="cp-memory">' +
				'<div></div><div></div><div></div><div></div>' +
				'<div></div><div></div><div></div><div class="cp-store">S</div>').
			on('click', '.cp-memory div', function(e) {
				var $this = $(this);

				if (this.className) {
					$this.parent().prepend($this.prev()).children().eq(0).
						css('background-color', '#' + colorInstance.colors.HEX);
				} else {
					colorInstance.setColor($this.css('background-color'));
					colorPicker.render();
				}

				/*****************************/
				if (!$this.hasClass("cp-store")) {
					$(".cp-hlp-color").css('background-color', '#' + colorInstance.colors.HEX);
					objSaveColor = $this;
					$(".cp-hlp-color-detail").css("display", "block");
				} else {
					Site.addStepAutoSave();
				}
				/*******************************/
			}).find('.cp-memory div').each(function(n) {
				!this.className && $(this).css({background:
					// 'rgb(' + random() + ', ' + random() + ', ' + random() + ')'
					getSaveColor(n)
				});
			});

			/****************/
			/*моя понель удаления*****************/
			var hlpBlockColor = '\
				<div class="cp-hlp-color-detail" style="display:none;">\
					<div class="cp-hlp-color" style="width: 50px;height:15px;float:left;"></div>\
					<div class="cp-hlp-but-delete" style="margin-left:10px;color:rgb(240,240,240);font-size:12px;float:left;cursor:pointer;">Удалить</div>\
					<div style="clear:both;"></div>\
				</div>';
			$elm.append(hlpBlockColor);
			$(".cp-hlp-but-delete").on("click", function(){
				if (objSaveColor) {
					objSaveColor.remove();
					$('.cp-memory .cp-store').before("<div style='background-color:rgb(190,190,190);'></div>");
					$(".cp-hlp-color-detail").css("display", "none");
					objSaveColor = false;
				}
			});
		},

		cssAddon: // could also be in a css file instead
			'.cp-memory {width:155px; margin-bottom:6px; clear:both;}' +
			'.cp-xy-slider:active {cursor:none;}' +
			'.cp-memory div {cursor:pointer;float:left; width:17px; height:17px; margin-right:2px;' +
				'background:rgba(0,0,0,1); text-align:center; line-height:17px;}' +
			'.cp-memory .cp-store {width:21px; margin:0; background:none; font-weight:bold;' +
				'box-sizing:border-box; border: 1px solid; border-color: #666 #222 #222 #666;}'+

			'.cp-color-picker{z-index:9990;box-sizing:border-box; width:226px;}' +
			'.cp-color-picker .cp-panel {line-height: 21px; float:right;' +
				'padding:0 1px 0 8px; margin-top:-1px; overflow:visible}' +
			'.cp-xy-slider:active {cursor:none;}' +
			'.cp-panel, .cp-panel input {color:#bbb; font-family:monospace,' +
				'"Courier New",Courier,mono; font-size:12px; font-weight:bold;}' +
			'.cp-panel input {width:28px; height:12px; padding:2px 3px 1px;' +
				'text-align:right; line-height:12px; background:transparent;' +
				'border:1px solid; border-color:#222 #666 #666 #222;}' +
			'.cp-panel hr {margin:0 -2px 2px; height:1px; border:0;' +
				'background:#666; border-top:1px solid #222;}' +
			'.cp-panel .cp-HEX {width:44px; position:absolute; margin:1px -3px 0 -2px;}' +
			'.cp-alpha {width:155px;}'+
			'.cp-hlp-color-detail{padding:10px 0;}'+
			'.cp-hlp-but-delete:hover{color:rgb(255,255,255)}'
	};

    $('.colorpickerField').colorPicker(options).css("color", "transparent"); // that's it

    
	return false;

	// var elmClass = 'not';
	// $('.colorpickerField').unbind('mousedown');
	// $('.colorpickerField').on('mousedown', function(){
	// 	//убираем панель
	// 	$('.colorpicker').css('display', 'none');

	// 	var elmClass = $(this).attr('class').replace(/colorpickerField/ig, '').trim();
	// 	var elm = $(this);
	// 	return false;
	// });

	// $('.colorpickerField').ColorPicker({
	// 							onSubmit: function(hsb, hex, rgb) {
	// 							    $('.colorpicker').css('display', 'none');
	// 							 	//ставим цвет 
	// 								elm.closest('.menuSectionItemColor').find('.valueColorValBlock input').val(hex);
								 	

	// 							 	elm.closest('.menuSectionItemColor')
	// 							    		.find('.valueColorValBlock input')
	// 							    		.change();

	// 							},
	// 							onBeforeShow: function () {
	// 							    $(this).ColorPickerSetColor(this.value);
	// 							},
	// 						})
	// 						.bind('keyup', function(){
	// 							$(this).ColorPickerSetColor(this.value);
								
	// 						});
	// //запрещяем сброс выделения при выборе цвета (работает везде кроме Opera)
	// var listFalse = '.colorpicker, .redactorMenu > *';
	// $(listFalse).unbind('mousedown');
	// $(listFalse).on('mousedown', function() {
	// 	return false;
	// });
	// //для Opera
	// $('.colorpicker_submit').unbind('mousedown');
	// $('.colorpicker_submit').on('mousedown', function() {
	// 	$(this).click()
	// })
}
/***************************************************************************/
/****************************************************************************/
/**
* Скролл
*
* @uses 	eventScrollButton()  	перемещение
* @uses 	eventScrollClickField() 	клик
*
* @see 	setEventMenu()
**/
var Scroll = new Scroll();
function Scroll() {
	/**
	* Статус передвижения
	* @see 	StyleMenu.edit()
	* @see 	ElementStyleController.edit()
	*/
	this.isMove = false;
/********************************************************************************************/
	this.setEvent = function()
	{
		//перемещение
		this.setEventScrollButton();
		//клик по полосе
		this.setEventScrollClickField();	
	}
/******************************************************************************************/
	/**
	* Перемещение скрола 
	*
	* @uses 	StyleMenu.getElementSelected() 		выделеный элемент
	* @see 		eventScroll()
	* @todo 	все перебрать, выделить в одельный класс
	*/
	this.setEventScrollButton = function() 
	{
		var obj = this;
		//перемещение скролла
		$('.scrollButton').unbind('mousedown');
		$('.scrollButton').on('mousedown', function(e) {
			//ставим статус передвижения
			obj.isMove = true; 

			// данные
			var elm = $(this).closest('.scrollBlock');
			var elm_input = elm.find('input');
			var minValue = parseInt(elm_input.attr("minval"));
			if (!minValue) minValue = 0;
			var maxValue = parseInt(elm_input.attr("maxval"));

			var n = maxValue+minValue;
			var width = parseInt(elm.find('.scroll').width()) - parseInt(elm.find('.scrollButton').width());
			var step = width / n;
			var self = this;

			var x = e.pageX;
			var y = e.pageY;
			var left = elm.find('.scrollButton').css('left').replace(/px/ig, '');

			$(document).unbind('mousemove');
			$(document).on('mousemove', function(e) {
				var currentLeft = elm.find('.scrollButton').css('left').replace(/px/ig, '');
				var moveX = parseInt(left) + parseInt(e.pageX - x);

				var value = 0;
				if (moveX >= 0 && moveX <= width) {
					elm.find('.scrollButton').css('left', moveX);
					point = moveX / step;
					point = Math.round(point);
					
					if (point < minValue) point = (minValue - point)*(-1);	 
					else if (point > minValue) point -= minValue;
					else point = 0;
					
					value = point;
				} else if ( 0 > moveX) {
					elm.find('.scrollButton').css('left', '0');
					elm_input.val('0');
					value = minValue * (-1);
				} else if (moveX > width) {
					elm.find('.scrollButton').css('left', width);
					elm_input.val(n);
					value = maxValue;
				}	

				// прилепание к 0
				if (minValue > 0 && value > (-10) && value < 10) {
					value = 0;
				}

				// ставим значение
				elm_input.val(value)
							.change();//эмитируем изменение
			});

			$(document).unbind('mouseup');
			$(document).on('mouseup', function() {	
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
				//сбрасываем статус передвижения
				obj.isMove = false; 

				//делаем эмитацию
				obj.imitationScrollInput($(self));	
			});

			return false;
		})
	}
/****************************************************************************************/
	/**
	* Клик по полосе скрола 
	*
	* @see 		eventScroll()
	*/
	this.setEventScrollClickField = function()
	{
		var obj = this;
		// при клике по скроллу
		$('.scroll').unbind('mousedown');
		$('.scroll').on('mousedown', function(e) {
			var elm = $(this).closest('.scrollBlock');
			var elmInput = elm.find('input');
			// максимум минимум
			var maxVal = parseInt(elmInput.attr('maxval'));
			var minVal = parseInt(elmInput.attr('minval'));
			if (!minVal) minVal = 0;
			var n = maxVal + minVal;

			var width = parseInt(elm.find('.scroll').width());// - parseInt(elm.find('.scrollButton').width());
			var step = width / n;

			// var width = $('.scrollButton').width() / 2;
			var left = $(this).offset().left;
			var x = (e.pageX - left - width)*(-1);
			elm.find('.scrollButton').css('left', x);

			point = n - (x / step);
			point = Math.round(point);

			// минус
			if (point <= minVal) {
				point = (minVal - point)*(-1);
			// больше нуля
			} else if (point > minVal) {
				point = point - minVal;
			// вышел с лева
			} else if (point < 0) {
				point = minVal;
			// вышел с права
			} else if (point > n) {
				point = maxVal;
			}

			//помещяем в значение input
			elm.find('input').val(point);

			//делаем эмитацию
			obj.imitationScrollInput($(this));
		});
	}
	/*************************************************************************/
	/**
	* Эмитируем изменение input
	*
	* @param 	link  	elm-элемент на котором сработало
	*
	* @see 		this.setEventScrollButton()  	
	* @see 		this.setEventScrollClickField() 	
	*/
	this.imitationScrollInput = function(elm)
	{
		elm.closest('.scrollBlock').find('input').change();
	}
}//end class

/**********************************************************************************/
/*********************************************************************************/
/**
* блок Input
*
*/
function SpecialInput() {
	this.timeoutShowBlockUnit = false;	

	/**
	* Ставит событие
	*
	*
	*/	
	this.setEvent = function()
	{
		this.setEventUnit();
		this.setEventArrow();
	}

/*********************************************************************************************/
	/**
	* Единица измерения
	*
	* @see 	this.setEvent()
	*/
	this.setEventUnit = function()
	{
		// показать блок выбора
		this.setEventShowUnitBlock();
		// выбрать
		this.setEventSelectUnit();

	}

	/**
	* Показать блок выбора типа единиц
	* 
	* @see 	this.setEventUnit()
	*/
	this.setEventShowUnitBlock = function()
	{
		var obj = this;
		var listInputObj = $(".inputUnitCurrent");
		// открытие закрытие
		listInputObj.unbind("mousedown");
		listInputObj.on("mousedown", function() {
			var parentElm = $(this).parent();
			// если уже открыт то закрываем
			if (parentElm.attr("show")) {
				parentElm.removeAttr("show");
				return false;
			}

			// открываем список
			$(".inputUnitBlock").removeAttr("show");
			parentElm.attr("show", "true");

			clearTimeout(obj.timeoutShowBlockUnit);
			obj.timeoutShowBlockUnit = setTimeout(function() {
				$("body").unbind("click");
				$("body").on("click", function() {
					$("body").unbind("click");
					$(".inputUnitBlock").removeAttr("show");
				});
			}, 2000);

			return false;
		});

		// закрытие
		listInputObj.unbind("mouseup");
		listInputObj.on("mouseup", function() {
			$("body").on("mouseup", function() {
				$("body").unbind("mouseup");
				$(".inputUnitBlock").removeAttr("show");
			});

			return false;
		});
	}


	/**
	* Выбрать тип единицы
	*
	* @see 	this.setEventUnit()
	*/
	this.setEventSelectUnit = function()
	{
		$(".inputUnitItem").unbind("mousedown");
		$(".inputUnitItem").on("mousedown", function() {
			// данные
			var elmEvent = $(this);
			var newType = elmEvent.attr("value");
			
			// изменяем значение в поле
			var elmInput = elmEvent.closest(".inputBlock").find("input");
			StyleUnit.translate(elmInput, newType);

			return false;
		});
	}

/******************************************************************************************/
	/**
	* Нажатие стрелочек 
	*
	* @see 	this.setEvent()
	*/
	this.setEventArrow = function()
	{
		var listBut = $(".inputArrowUp, .inputArrowDown");
		var obj = this;
		listBut.unbind("mousedown");
		listBut.on("mousedown", function(){
			// obj.isMouseUp = false;
			var objCurrentUnit = $(this).closest(".inputBlock").find(".inputUnitCurrent");
			if (objCurrentUnit.attr("type") == "auto") return false; 

			// если кнопка не нажата
			if (!obj.isMouseDown) {
				// ставим статус
				ElementCss.noFixed = true;
				// начало изменение
				obj.startEdit($(this));
			}

			return false;
		});

		// останавливает изменение
		listBut.unbind("mouseup");
		listBut.on("mouseup", function(){
			obj.stopEdit();
			// кнопка отжата для передвижения
			Key.moveElmKeyUp();
			obj.isMouseUp = true;
		});

		listBut.unbind("mouseout");
		listBut.on("mouseout", function(){
			obj.stopEdit();
		});
	}

	/**
	* Изменяет значение
	*
	*
	*/
	this.startEdit = function(elmEvent)
	{
		//ставим статус что кнопка нажата
		this.isMouseDown = true;
		// сбрасываем статус
		this.isMouseUp = false;

		// данные
		var elmInput = elmEvent.closest(".inputBlock").find("input");
		var isIncrement = elmEvent.hasClass("inputArrowUp") ? true : false;

		// изменяем
		this.editValue(elmInput, isIncrement);	
		// если нажатие более 0.15 секунды, тогда изменяем
		var obj = this;	
		var countStep = 0;
		this.objIntervalStart = setTimeout(function(){
			if (!obj.isMouseUp) {
				// это ставим что бы изменялось при нажатой кнопке 
				obj.objIntervalEdit = setInterval(function(){
					obj.editValue(elmInput, isIncrement);
					
					// для предотвращения ошибки, максимальное количество шагов
					countStep++;
					if (obj.isMouseUp || countStep > 100) obj.stopEdit();
				}, 35);
			}
		}, 150); 
	}

	/**
	* Останавливает изменение
	*
	*/
	this.stopEdit = function()
	{
		// очищаем интервал
		clearInterval(this.objIntervalStart);
		clearInterval(this.objIntervalEdit);
		// кнопка отжата
		this.isMouseUp = true;
		// сбрасываем статус нажатия
		this.isMouseDown = false;
	}

	/**
	* Изменяет значение input
	*
	*/
	this.editValue = function(elmInput, isIncrement)
	{
		var oldValue = elmInput.val();
		if (!oldValue) oldValue = 0;
		
		if (oldValue != "auto") oldValue = parseFloat(oldValue);
		else oldValue = this.getValueFromAuto(elmInput);

		var minValue = parseFloat(elmInput.attr("minval"))*(-1);
		if (!minValue) minValue = 0;

		// декремент или инкремент
		var newValue = oldValue;
		if (isIncrement) newValue++; 
		else if (newValue > minValue) newValue--;
		
		// не фиксировать историю
		History.isFixed = false;
		
		// ставим значение, если оно изменилось 
		if (oldValue != newValue) elmInput.val(newValue).change();		
	}

	/**
	* Отдает значение при auto
	*
	* @see 	this.editValue()
	* @see 	Key.incDecInput()
	*/
	this.getValueFromAuto = function(elmInput)
	{
		var inputClass = elmInput.attr("class");
		var inputProperty = StyleUnit.listProperty[inputClass];
		var oldValue = parseFloat(Element.obj.css(inputProperty));
		
		if (StyleUnit.getUnitMenu(inputProperty) == "%") {
			oldValue = StyleUnit.pxToPercent(oldValue, inputProperty);
			oldValue = parseInt(oldValue);
		}

		return oldValue;
	}
/***************************************************************************************************/
/****************************************************************************************************/
	/**
	* Ввод в поле только английского
	*
	* @see  EditorController.setEventKey()
	*/
	this.setEventOnlyEng = function(elmEvent)
	{
		elmEvent = $("*[only-eng='true']");

		var obj = this;
		elmEvent.unbind("keypress");
		elmEvent.on("keypress", function(e) {
			var keyCode = e.keyCode;
			if (keyCode != 13) {
				if (!$(this).attr("only-eng")) return true;

				var keyChar = obj.getCharEng(keyCode);
				if (!keyChar) return true;
				var newValue = $(this).val() + keyChar;
				$(this).val(newValue);
				
				return false;
			} else {
				$('input:focus').change();
			}	
		});

		elmEvent.unbind("keyup");
		elmEvent.on("keyup", function(e) {
			var elmEvent = $(this);

			if (elmEvent.attr("data-letter-lower")) {
				var newValue = elmEvent.val();
				newValue = newValue.toLowerCase();
				$(this).val(newValue);
			}
		});

			
	}

	/**
	* Очищает событие только английский
	*
	* @see  EditorController.setEventKey()
	*/
	this.clearEventOnlyEng = function()
	{
		$(document).unbind("keypress");
	}

	/**
	* Отдает английский символ
	*
	* @see 	this.setEventOnlyEng()
	*/
	this.getCharEng = function(keyCode)
	{
		var tableChar = {
			"47":"_", 
			"1040":"F", "1041":" ", "1042":"D", "1043":"U", "1044":"L",
			"1045":"T", "1046":" ", "1047":"P", "1048":"B", "1049":"Q", "1050":"R", 
			"1051":"K", "1052":"V", "1053":"Y", "1054":"J", "1055":"G", "1056":"H", 
			"1057":"C", "1058":"N", "1059":"E", "1060":"A", "1061":" ", "1062":"W", 
			"1063":"X", "1064":"I", "1065":"O", "1066":" ", "1067":"S", "1068":"M", 
			"1069":" ", "1070":".", "1071":"Z",
			"1072":"f", "1073":" ", "1074":"d", 
			"1075":"u", "1076":"l", "1077":"t", "1078":" ", "1079":"p", "1080":"b", 
			"1081":"q", "1082":"r", "1083":"k", "1084":"v", "1085":"y", "1086":"j",
			"1087":"g", "1088":"h", "1089":"c", "1090":"n", "1091":"e", "1092":"a", 
			"1093":" ", "1094":"w", "1095":"x", "1096":"i", "1097":"o", "1098":" ", 
			"1099":"s", "1100":"m", "1101":" ", "1102":".", "1103":"z", "1105":"e" 
		};
		
		var keyChar = tableChar[keyCode];
		if (!keyChar) keyChar = "";
		
		return keyChar;
	}
/***************************************************************************************************/

}//end class





















