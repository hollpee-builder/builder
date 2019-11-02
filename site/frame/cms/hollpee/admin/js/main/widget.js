/**
* Модальное окно
*
*/
var Modal = new Modal();
function Modal() {
	/**
	* @var 	array 	классы кнопок
	*
	* @see 	this::getOneButton()
	*/
	this.buttton_class = {
		'add':'hollpee-but-add butAdd', 
		'ok':'hollpee-but-ok butOk', 
		'cancel':'hollpee-but-cancel butCancel',
		'delete':'hollpee-but-delete butDelete',	
		'edit':'hollpee-but-edit butEdit',	
		'buy':'hollpee-but-buy butBuy',
		'instruction':'hollpee-but-instruction butInstruction'
	};

/******************************************************************************************/

	/**
	* Создание модального окна
	*
	*/
	this.create = function(params)
	{
		this.params = params;
		
		// создаем
		this.createBlock();
		this.setFocus();

		// ставим события
		if (!params["no_event"]) this.setEvent();
		ElementInputS.setEventOnlyEng();
	};

	/**
	* Ставит focus
	*
	* @see 	this.create()
	*/
	this.setFocus = function()
	{
		setTimeout(function() {
			var firstInput = $(".h-modal-block").find("input[type='text'], textarea");
			firstInput.eq(0).focus()
		}, 50)
	}

/************************************************************************************************/	
	
	/**
	* Создание блок модального окна
	*
	* @see 		Modal.create() 				при создании модального окна	
	*/
	this.createBlock = function(params) 
	{
		//получаем блок
		var block = this.getBlock();
		//вставляем на страницу
		var bodyObj = $(".h-canvas");
		if (!bodyObj.length) bodyObj = $('body');
		bodyObj.append(block);

		// ставим параметры
		$("#"+this.params.id).width(this.params.width)
							.height(this.params.height)
							.css("margin-top", this.params.top + "px");
		
		// убираем scroll
		this.hideScroll(); 

		// прячем кнопки в редакторе
		$(".h-block-manager").css("display", "none");
	};

	/**
	* Ставим нажатие enter
 	*
	* @see 	this.create()
	*/
	this.setKeyEnter = function()
	{
		$(document).off("keydown");
		$(document).on("keydown", function(e) {
			var keyCode = e.keyCode;
			if (keyCode != 13) return true;
			
			if ($("textarea:focus").length) return true;
			if ($("*[contenteditable='true']:focus").length) return true;

			// кнопка действия
			var lastModal = $(".modalBlock:last, .h-modal-block:last");
			var butAction = lastModal.find(".butAdd, .hollpee-but-add");
			if (!butAction.length) butAction = lastModal.find(".butOk, .hollpee-but-ok");
			if (!butAction.length) butAction = lastModal.find(".butDelete, .hollpee-but-delete");
			
			// эмитируем нажатие 
			butAction.mousedown();

			return false;
		});
	}

	/**
	* прячем прокутку
	*
	* @see 		this.createBlock()
	*/
	this.hideScroll = function()
	{
		// ширина до
		var width = $("body").width();
		//прячем прокрутка
		$("body").css({"overflow":"hidden"});
		var scrollWidth = $("body").width() - width;

		//делаем отступ с права на ширину скролла
		if (scrollWidth) if (scrollWidth) $("body").css("padding-right", scrollWidth);
		$('.h-panel-editor').width(width);	
	};

	/**
	* показываем прокутку
	*
	* @see 		this.delete()
	*/
	this.showScroll = function()
	{
		//показываем прокрутку
		$('body').css({'overflow':'auto'});
		//убираем отступ
		$('body').css('padding-right', '0');

		$('.h-panel-editor').width("100%");
	};
/********************************************************************************************/
	/**
	* Отдать блок
	*
	* @see 		this.createBlock();
	*/
	this.getBlock = function()
	{
		var blockHead = this.getBlockHead();
		var blockNav = this.getBlockNav();
		var blockButton = this.getBlockButton();

		//формируем блок
		var block = '	<div class="h-modal-block" id="'+this.params['id']+'">'
							+blockHead
							+blockNav+
							'<div class="h-modal-block-cont">'
								+this.params['content']+
							'</div>'
								+blockButton+
							'<div class="clear"></div>\
						</div>';

		block = '\
			<div class="modal-wrap" data-id="'+this.params['id']+'">\
				<div class="blackout"></div>'
				+block+
			'</div>';
						
		return block;
	};

	/**
	* Отдает часть блока - заголовок
	*
	* @see 		this.getBlock()
	*/
	this.getBlockHead = function()
	{	
		if (!this.params['title']) return '';

		return '<div class="h-modal-block-head">\
					<div class="h-modal-block-title">'
						+this.params['title']+ 
					'</div>\
					<div class="h-modal-block-head-buttom">\
						<div class="modal-head-buttom-item modal-head-close">\
							<img src="/'+ADMIN_FOLDER+'/img/close.png" alt="" />\
						</div>\
					</div>\
				</div>';
	};

	/**
	* Отдает блок навигации
	*
	* @see 		this.getBlock()
	*/
	this.getBlockNav =  function()
	{
		//список пунктов навигации
		var listNav = this.params['nav']; 
		if (!listNav) return '';

		//если есть навигация
		var block = '';
		
		for (var iNav in listNav) {
			var navItem = listNav[iNav];
			var classAct = iNav == 0 ? 'modal-nav-item-act': '';  
			//формируем вкладку
			block += '<div class="modal-nav-item '+classAct+'" type="'+navItem[0]+'">'+navItem[1]+'</div>';
		}

		return 	'<div class="modal-nav">'
					+block+
					'<div class="clear"></div>\
				</div>';	
	};

	/**
	* Отдает часть блока - кнопки
	*
	* @see 		this.getBlock()
	*/
	this.getBlockButton = function()
	{
		//кнопки
		var listButton = this.params['button'];
		if (!listButton) return '';

		//формируем блок
		var block = '<div class="h-modal-block-buttton">';
		//разбиваем набор на кнопки
		for (var iButton in listButton) {
			var button = listButton[iButton];
			//получить одну кнопку
			block += '<div class="hollpee-but-block '+this.buttton_class[button[0]]+'">\
						<div class="text-in-but">'+button[1]+'</div>\
					</div>';
		}

		block += '		<div class="clear"></div>\
					</div>';

		return '<div class="h-modal-block-footer">'+block+'<div class="clear"></div></div>';
	};

/********************************************************************************************/

	/**
	* Устанавливаем события 
	*
	* @see 		this.create()
	*/
	this.setEvent = function()
	{
		//удаление блока 
		this.setEventDelete();
		//выбор элемента
		this.setEventNoteItemBlock();
		//навигация
		this.setEventNav();
		// ставим фокус
		this.setFocus();
		// нажатие enter
		this.setKeyEnter();
	}

	/**
	* Удаление модального окна
	*
	* @uses 	Modal.delete() 		удаление модального окна полностью
	* @see 		this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var listBut = $('.h-modal-block .hollpee-but-cancel, .modal-head-close, .blackout');
		//кнопка cancel
		listBut.off('click');
		listBut.on('click', function() {
			if ($(".h-modal-block").length > 1) Modal.removeLast("modal-add-folder");
			else Modal.delete();
		});
	}

	/**
	* Отметить элемент
	*
	* @see 	this.setEvent()
	*/
	this.setEventNoteItemBlock = function()
	{
		$('.h-modal-block-item').off('mousedown');
		$('.h-modal-block-item').on('mousedown', function() {
			//убираем выделение у элемента
			$('.h-modal-block-item').attr('note', 'false');
			//отмечаем элемент
			$(this).attr('note', 'true');
		})
	}

	/**
	* Навигация
	*
	* @see 	this.setEvent()
	*/
	this.setEventNav = function() 
	{
		$('.modal-nav-item').off('mouseup');
		$('.modal-nav-item').on('mouseup', function() {
			//убираем класс у всех
			$('.modal-nav-item').removeClass('modal-nav-item-act');
			//добавляем класс
			$(this).addClass('modal-nav-item-act');
		})
	}
	
/********************************************************************************************/

	/**
	* Удалить блок модального окна
	*
	* @see 	Modal.delete()
	*/
	this.delete = function()
	{
		//убираем затемнение
		$('.modal-wrap').remove();
		//показываем прокрутку
		if (!$(".modal-section").length) this.showScroll();
		// убираем события на кнопки
		$(document).off("keydown");
	};

	/**
	* Убрать последний блок
	*
	* @see 	this.confirmationDelete()
	*/
	this.removeLast = function(modalId)
	{
		// удаляем сам блок
		$(".modal-wrap:last").remove();
		
		// показываем предыдущий
		if ($(".h-modal-block").length) $(".h-modal-block:last").css("display", "block");
		else this.delete();
	}

/*********************************************************************************************/

	/**
	* Создание загрузки
	*
	* @param 	string 		label-заголовок оперпции
	*
	* @uses 	this.create() - создание  модального окна
	*/
	this.createLoading = function(label)
	{
		if (!label) label = '';
		var content = '<img src="/'+ADMIN_FOLDER+'/img/loading.gif" alt="" class="modal-loading-image" />\
		 				<div class="modal-loading-label">'
		 					+label+"..."+
		 				'</div>';
		 
		 this.create({
		 	'id':'modalLoading',
		 	'width': '285',
		 	'height': '',
		 	'top': '180',
		 	'content': content,
		 	'no_event':true
		 });
	};

	/**
	* Удаление загрузки
	* 
	*
	*/
	this.deleteLoadind = function(is_delay) {
		this.removeLast();
	}

	/**
	* Подтверждение удаления
	*
	*
	*/
	this.confirmationDelete = function(label, funcLaunch, butName)
	{
		var content = '<div class="confirmation-delete-label">'+label+'</div>';

		if (!butName) butName = "Удалить";

		this.create({
			"title":"Подтверждение удаления",
			"id":"confirmationDelete",
			"width":400,
			"top":100,
			"content":content,
			"button":[
				["cancel", "Отмена"],
				["delete", butName]]
		});

		var obj = this;
		// нажатие любой кнопки
		var butDel = $("#confirmationDelete .hollpee-but-delete");
		butDel.off("click"); 
		butDel.on("click", function() {
			obj.removeLast("confirmationDelete");

			if (funcLaunch) funcLaunch();
		});
	}

}//end class

/**********************************************************************************************/
/**********************************************************************************************/

// form
var Form = new Form();
function Form() {
	/**
	* Список функций для проверок
	*
	*/
	this.listVarify = ["isFull", "isAllowedCharacters", "validation"];

	/**
	* Патерны для валидации
	*
	*/
	this.listPatterValid = {
		"email":"^[a-z0-9\-_\.]{1,50}@[a-z0-9\-_]{1,50}\.[a-z0-9\-_]{1,120}$",
		"password":"^.{6,}$"
	}

	/**
	* Список ошибок
	*
	*/
	this.listError = {
		"isFull": {
			"text":"Поле не заполено",
			"password":"Поле не заполено"
		},
		"isAllowedCharacters": {
			"text":"Использованы запрещеные символы: -- ; /"
		},
		"validation": {
			"email":"Email должен иметь форму user123@gmail.com",
			"password":"Пароль должен состоять минимум из 6 символов"
		},
		"exists": {
			"email":"Email уже существует, введите другой"
		},
		"isChecked": {
			"checkbox":"Поле должно быть отмечено"
		},
		"noEqual": {
			"password":"Пароли разные"
		},
	}	
/***********************************************************************************************/
	/**
	* Ставим события
	*
	* 
	*/
	this.setEvent = function()
	{
		// проверка введенных данных
		this.setEventVerify();
		// поле телефон
		this.setEventPhone();
	}

	/**
	* Проверка
	*
	* @see 	this.setEvent()
	*/
	this.setEventVerify = function()
	{
		var submit = $(".form input[type='submit']");
		submit.off("click");
		submit.on("click", function() {
			var form = $(this).closest(".form");
			var isVerify = ElementForm.verify(form);
			if (!isVerify) return false;
		});
	}

	/**
	* Поле телефон
	*
	* @see 	this.setEvent()
	*/
	this.setEventPhone = function()
	{
		var inputPhone = $(".form input[name='phone']");
		inputPhone.off("keydown");
		inputPhone.on("keydown", function(event) {
			var keyCode = event.keyCode;
			// вводить нельзя символы
			if ((keyCode >= 65 && keyCode <= 90) // a-z
				|| keyCode == 186 || keyCode == 188
				|| keyCode == 190 || keyCode == 191
				|| keyCode == 219 || keyCode == 220 
				|| keyCode == 221 || keyCode == 222) {
				return false;
			}
			
		});
	}
/********************************************************************************************/	
	this.verify = function(elmForm) 
	{
		this.clearError();

		var listInput = elmForm.find("input[type='text'], input[type='password'], input[type='checkbox'], textarea");
		listInput.removeAttr("style");
		var listStatus = {};
		this.varifyStatus = true;

		// проходим все input
		var inputCount = listInput.length;
		for (var i = 0; i < inputCount; i++) {
			var input = listInput.eq(i);
			var inputType = input.attr("type");

			if (inputType == "checkbox") this.verifyInputCheckbox(input);  
			else this.verifyInputText(input);	
		}

		// если несколько паролей
		this.varifyEqualPsw(elmForm);

		return this.varifyStatus;
	}


	this.verifyInputText = function(input)
	{
		var value = input.val();
		//проверяем элемент 
		for (var indexFunc in this.listVarify) {
			var varifyFunc =  this.listVarify[indexFunc];
			var statusVarify = this[varifyFunc](input, value);
			// ошибка
			if (!statusVarify) {	
				this.showError(input, varifyFunc);
				this.varifyStatus = false;
				break;
			}
		}
	}


	this.verifyInputCheckbox = function(input)
	{
		var isChecked = input.prop("checked");
		if (!isChecked && input.attr("data-empty") != "true") {
			this.varifyStatus = false;
			this.showError(input, "isChecked");
		}
	}

	/**
	* Проверка паролей на одинаковость
	*
	* @see 	this.verify()
	*/
	this.varifyEqualPsw = function(elmForm)
	{
		var inputPsw = elmForm.find("input[type='password']");
		var inputPswCount = inputPsw.length;
		if (inputPswCount > 1) {
			var inputPswOne = inputPsw.eq(inputPswCount-2);
			var inputPswTwo = inputPsw.eq(inputPswCount-1);

			// и они не равны
			if (inputPswOne.val() != inputPswTwo.val()) {
				this.showError(inputPswTwo, "noEqual");
				this.varifyStatus = false;
			}
		}
	}
/*********************************************************************************************/
	/**
	* Проверка на заполненость
	*
	* @see 	this.varify()
	*/
	this.isFull = function(input, value)
	{
		if (value || input.attr("data-empty") == "true") {
			return true;
		}  else {
			return false;
		}
	}
/*******************************************************************************************/
	/**
	* Проверка на запрещеные символы
	*
	*
	*/
	this.isAllowedCharacters = function(input, value)
	{
		var res = value.match(/[;\/]+|[-]{2}/gim);
		if (!res) return true;
		else return false;
	}

/********************************************************************************************/
	/**
	* Проверка на валидацию
	*
	* @see 	this.varify()
	*/	
	this.validation = function(input, value) 
	{
		var inputName = input.attr("input-type");
		if (!inputName) inputName = input.attr("name");

		this.inputName = inputName;

		if (this.listPatterValid[inputName]) {
			return this.verifyInput(value, inputName, this.listPatterValid);
		} else {
			return true; 
		}
	}
/***********************************************************************************************/
	this.verifyInput = function(value, inputType, listPattern)
	{
		var patternString = listPattern[inputType];
		var pattern = new RegExp(patternString, "gim");
		var res = value.match(pattern);

		if (res) {
			return true;
		} else {
			return false;
		}
	}


/***ошибки*********************************************************************************************/
	/**
	* Убираем все ошибки
	*
	*/
	this.clearError = function() {
		$(".error-label").remove();
		// ставим стили по умолчанию
		this.setInputDefaultStyle();
	}

	/**
	* Ставим стили  input по умолчанию
	*
	*
	*/
	this.setInputDefaultStyle = function()
	{
		if (!this.inputDefaultStyle) {
			var input = $("input[type='text']");
			this.inputDefaultStyle = {
				"background-color":input.css("background-color"),
				"border":input.css("border")
			}
		}

		$("input[type='text'], input[type='password']").css(this.inputDefaultStyle);
	}

	/**
	* Выводим ошибку
	*
	*
	*/
	this.showError = function(input, errorType) {
		
		if (errorType == "isFull") {
			var name = "text";
		} else if ( errorType == "isChecked"
				|| errorType == "noEqual"
				|| errorType == "isAllowedCharacters") {
			var name = input.attr("type");
		} else {
			var name = this.inputName;
		}
		
		var errorString = this.listError[errorType][name];
		this.setError(input, errorString);
	}


	/**
	* Ставит заголовок ошибок
	*
	*/
	this.setError = function(input, errorString)
	{
		var errorBlock = this.getErrorBlock(errorString);
		
		// вставляем значение
		input.after(errorBlock);
		this.setStyleError(input);
	}

	/**
	* Отдает html блок ошибки
	*
	*
	*/
	this.getErrorBlock = function(errorString)
	{
		return '<div class="error-label">'+errorString+'</div>';
	}

	/**	
	* Установить стиль ошибкам
	*
	* 
	*/
	this.setStyleError = function(input) {
		input.addClass("error-input");
	}
/*************************************************************************************************/
	/**
	*  список ошибок
	*
	*/
	this.listErrorByGET = {
		"error_email_password":"showErrorsEmailPassword",
		"error_email_exist":"showErrorEmailExists"	
	}

	/**
	* Показываем ошибки по запросу GET
	*
	*
	*/
	this.showErrorsByGET = function(emlForm, GET)
	{
		// для фиксации стилей
		this.clearError();

		for (var errorName in GET) {
			var nameFunction = this.listErrorByGET[errorName];
			if (this[nameFunction]) {
				this[nameFunction](emlForm);
			}
		}
	}

	/**
	* Неправильный email или пароль 
	*
	*
	*/
	this.showErrorsEmailPassword = function(elmForm) {
		// вставляем ошибку
		var errorString = "Не правильный email или пароль";
		var block = this.getErrorBlock(errorString);
		elmForm.prepend(block);

		// ставим стили
		var listInput = elmForm.find("input[name='email'], input[name='password']");
		this.setStyleError(listInput);
	}

	/**
	* Email существует
	*
	*
	*/
	this.showErrorEmailExists = function(elmForm){
		var input = elmForm.find("input[name='email']");
		this.showError(input, "exists");
	}
/***********************************************************************************************/
}//end class

/**********************************************************************************************/
/**********************************************************************************************/
/**
* Оповещение
*
*
*/
var Notification = new Notification();
function Notification() {
	/**
	* Все нормально
	*
	*/
	this.ok = function(msg, position)
	{
		this.show(msg, "ok", 2000, position); 
	}

	/**
	* ошибка
	*
	*/
	this.error = function(msg, position)
	{
		if (!msg) msg = "Ошибка, попробуйте еще раз";
		this.show(msg, "error", 3000, position); 
	}

	this.show = function(msg, notificationType, speed, position) 
	{	
		if (!position) position = "center";

		// сам блок
		var block = '<div position="'+position+'" class="notification" data-type="'+notificationType+'">\
						<img class="notification-img" src="/'+ADMIN_FOLDER+'/img/notification_'+notificationType+'.png" alt="" />\
						<div class="notification-label">'+msg+'</div>\
					</div>';

		// вставляем на страницу
		$("body").prepend(block);
		var elmNotification = $(".notification");
		elmNotification.animate({"opacity":1}, 300);

		setTimeout(function(){
			elmNotification.remove();
		}, speed);
	}

}//end class


/**********************************************************************************/
/********************************************************************************/
var ElementInputS = new ElementInputS();
function ElementInputS() {
	/**
	* Ввод в поле только английского
	*
	* @see  EditorController.setEventKey()
	*/
	this.setEventOnlyEng = function()
	{
		var obj = this;

		var listInput = $("*[data-only-eng]");
		listInput.off("keypress");
		listInput.on("keypress", function(e) {
			var elmEvent = $(this);
			var keyCode = e.keyCode;
			if (keyCode != 13) {
				var keyChar = obj.getCharEng(keyCode);
				if (!keyChar) return true;
				var newValue = elmEvent.val() + keyChar;
				elmEvent.val(newValue);
				return false;
			} else {
				$('input:focus').change();
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
		$(document).off("keypress");
	}

	/**
	* Отдает английский символ
	*
	* @see 	this.setEventOnlyEng()
	*/
	this.getCharEng = function(keyCode)
	{
		var tableChar = {
			"47":" ", 
			"1040":"F", "1041":" ", "1042":"D", "1043":"U", "1044":"L",
			"1045":"T", "1046":" ", "1047":"P", "1048":"B", "1049":"Q", "1050":"R", 
			"1051":"K", "1052":"V", "1053":"Y", "1054":"J", "1055":"G", "1056":"H", 
			"1057":"C", "1058":"N", "1059":"E", "1060":"A", "1061":" ", "1062":"W", 
			"1063":"X", "1064":"I", "1065":"O", "1066":" ", "1067":"S", "1068":"M", 
			"1069":" ", "1070":" ", "1071":"Z",
			"1072":"f", "1073":" ", "1074":"d", 
			"1075":"u", "1076":"l", "1077":"t", "1078":" ", "1079":"p", "1080":"b", 
			"1081":"q", "1082":"r", "1083":"k", "1084":"v", "1085":"y", "1086":"j",
			"1087":"g", "1088":"h", "1089":"c", "1090":"n", "1091":"e", "1092":"a", 
			"1093":" ", "1094":"w", "1095":"x", "1096":"i", "1097":"o", "1098":" ", 
			"1099":"s", "1100":"m", "1101":" ", "1102":" ", "1103":"z" 
		};
		
		var keyChar = tableChar[keyCode];
		if (!keyChar) keyChar = "";
		
		return keyChar;
	}
} // end class

/***********************************************************************************************/
/***подсказки при наведении на элемент*********************************************************************************/
var Tip = new Tip();
function Tip() {
	/**
	* @var 	array 	список функций для получения значений position
	* @see 	setPositionTip()
	*/
	this.list_func_pos = {
		'top': 		'getValueTop',
		'bottom': 	'getValueBottom',
		'right': 	'getValueRight',
		'left': 	'getValueLeft'
	}

	/**
	* Ставить событие
	*
	* @see 	EditElementImage.setEventDeleteFolder();
	*/	
	this.setEvent = function(elm, label, position)
	{	
		if (!elm) elm = $("*[data-label]");

		elm.off('mouseover');
		elm.on('mouseover', function() {Tip.show($(this));});

		elm.off('mouseout');
		elm.on('mouseout', function() {Tip.hide($(this));});
	}

	/**
	* Убирает событие
	*
	* @see 	EditElementImage.setEventDeleteFolder();
	*/	
	this.removeEvent = function(elm)
	{
		elm.off('mouseover');
		elm.off('mouseout');
		elm.removeAttr("data-label").removeAttr("data-pos");
	}
/******************************************************************************************/
	/**
	* Показать подсказку
	*
	* @param 	obj 	elm_event - элемент на котором сработало события 		
	*
	* @see 	EditorController.setEventTip()
	*/
	this.show = function(elm_event)
	{
		if (this.showNow) {
			var delay = 10;
			this.showNow = false;
		} else {
			var delay = 800;
		}

		var obj = this;
		this.showEvent = setTimeout(function() {

			//формируем блок
			var block = '<div class="tip-block" >\
							<div class="tip-arrow"></div>\
							<div class="tip-text">'
								+elm_event.attr('data-label')+
						'	</div>\
						</div>';

			//добавлем на страницу
			$('body').append(block);
			//установить position блоку
			obj.setPosition(elm_event);
		}, delay);

		// сбрасываем
		elm_event.on("mouseout click", function() {
			elm_event.off("mouseout");
			clearTimeout(obj.showEvent);
			obj.hide();

			obj.showNow = false;
			setTimeout(function() { obj.showNow = false;}, 250);
		});
	}

	this.replaceText = function(label)
	{
		$(".tip-text").html(label);
	} 

	/**
	* Убрать подсказку
	*
	* @see 	EditorController.setEventTip()
	*/
	this.hide = function()
	{
		$('.tip-block').remove();
		clearTimeout(this.showEvent);
	}

/*******************************************************************************************/

	/**
	* Установить позицию 
	*
	* @param 	obj 	elm_event-элемент на котором сработало событие
	*
	* @see 	showTip()
	*/
	this.setPosition = function(elm_event)
	{
		var elm_block = $('.tip-block');
		var elm_arrow = $('.tip-arrow');
		//положение
		var pos = elm_event.attr('data-pos'); 
		if (!pos) pos = "bottom";

		//устанавливаем положение стрелки
		elm_arrow.attr('type', pos);

		var param = {};
		var paddingH = parseInt(elm_event.css("padding-left"))+parseInt(elm_event.css("padding-right"));
		var paddingV = parseInt(elm_event.css("padding-top"))+parseInt(elm_event.css("padding-bottom"));
		//данные элемента на котором сработало событие
		param['top_evt'] = elm_event.offset().top;
		param['left_evt'] = elm_event.offset().left;
		param['width_evt'] = elm_event.width()+paddingH;
		param['height_evt'] = elm_event.height()+paddingV;
		//данные блока tip
		param['width_block'] = elm_block.width();
		param['height_block'] = elm_block.height();

		//получаем значения 
		var list_value = this[this.list_func_pos[pos]](param);
		//устанавливаем значение блоку
		elm_block.css({'top':list_value['top'], 'left':list_value['left']});
		//устанавливаем значение стрелки
		elm_arrow.css(list_value['arrow']);//стили
		
		// показываем с анимацией
		elm_block.animate({"opacity":"1"}, 200);
	}
/********************************************************************************/
	/**
	* Отдать top и left для положения top
	*
	* @see 	this.setPosition()
	*/
	this.getValueTop = function(param) {
		var result = this.getPropertyVertical(param);
		//для блока
		result['top'] = param['top_evt'] - param['height_block']-12;

		return result;
	}

	/**
	* Отдать top и left для положения bottom
	*
	* @see 	this.setPosition()
	*/
	this.getValueBottom = function(param) {
		var result = this.getPropertyVertical(param);
		//для блока
		result['top'] = param['top_evt'] + param['height_evt']+12;

		return result;
	}

	/**
	* Отдает параметры для вертикали
	*
	* @see 	this.getValueTop()
	* @see 	this.getValueBottom()
	*/
	this.getPropertyVertical = function (param)
	{
		var result = {};

		result['left'] = param['left_evt'] -(param['width_block']-param['width_evt'])/2;
		
		//для стрелки
		var arrow_left = (param['width_block']/2)-9;
		result['arrow'] = {'left': arrow_left}; 

		return result;
	}

	/**
	* Отдать top и left для положения right
	*
	* @see 	this.setPosition()
	*/
	this.getValueRight = function(param) {
		var result = this.getPropertyHorizontal(param);
		//для блока
		result['left'] = param['left_evt'] + param['width_evt'] + 17;

		return result;
	}

	/**
	* Отдать top и left для положения left
	*
	* @see 	this.setPosition()
	*/
	this.getValueLeft = function(param) {
		var result = this.getPropertyHorizontal(param);
		//для блока
		result['left'] = param['left_evt'] - param['width_block'] - 13;

		return result;
	}

	/**
	* Отдает параметры для горизонтали
	*
	* @see 	this.getValueLeft()
	* @see 	this.getValueRight()
	*/
	this.getPropertyHorizontal = function (param)
	{
		var result = {};

		result['top'] = param['top_evt'] - (param['height_block'] - param['height_evt'])/2;
		
		//для стрелки
		var arrow_left = (param['height_block']/2)-(parseInt($('.tip-arrow').css('border-left-width'))/2);
		result['arrow'] = {'top': arrow_left-4};
		
		return result;
	}

} // end class



// модальное окно
var HlpElementModal = new HlpElementModal();
function HlpElementModal() { 	
	/**
	* Ставит события
	*
	*
	*/
	this.setEvent = function()
	{
		var obj = this;
		var butModal = $("*[data-hlp-action='modal']");
	
		butModal.off("click"); 
		butModal.on("click", function() {
			var modalNum = $(this).attr("data-hlp-value");
			obj.show(modalNum);

			return false;
		});
	}	

	/**
	*
	*
	*
	*/
	this.show = function(modalNum)
	{
		var modal = $(".hlp-list-modal .hlp-modal[data-hlp-num='"+modalNum+"']");
		if (!modal.length) return false;
		// само модальное
		var modalClass = modal.attr("class");
		var modalContent = modal.html();
		var modalSection = '<div class="'+modalClass+'">'+modalContent+'</div>';

		// создаем модальное окно
		HlpElementModal.create({"content":modalSection});

		// ставим события
		if ( (typeof HlpShowIframe) != "undefined" && HlpShowIframe.setEvent) {
			HlpShowIframe.setEvent();
		}
	}

/****************************************************************************************/
	/**
	* Создание блок модального окна
	*
	* @see 		ElementModal.create() 				при создании модального окна	
	*/
	this.create = function(params) 
	{
		this.params = params;
		//вставляем модальное окно на страницу
		this.createBlock();
		// прячем скролл
		this.hideScroll();
		//устанавливаем параметры для блока
		this.setEventClose();
	};
/***********************************************************************************************/
	/**
	* Вставляем модальный блок на страницу
	*
	* @see 		this.create()
	*/	
	this.createBlock = function()
	{
		//получаем блок
		var block = this.getBlock();
		//вставляем на страницу
		$('.hlp-site').append(block);

		//текущие модальное окно
		var modalObj = $('.hlp-modal-section > .hlp-modal');
		this.curr_modal = modalObj;
	}

	/**
	* Отдать блок
	*
	* @see 		this.createBlock();
	*/
	this.getBlock = function()
	{
		//формируем блок
		var block = '	<div class="hlp-modal-section" id="'+this.params['id']+'">'
							+this.params['content']+		
						'</div>';

		block  = block.replace(/autoplay\-yes/gim, "autoplay");				
		return block;
	};
/********************************************************************************************/
	/**
	* Устанавливаем события 
	*
	* @see 		this.create()
	*/
	this.setEventClose = function()
	{
		var obj = this;
		var listObj = $(".hlp-modal-section, *[data-hlp-action='modal-close'], .hlp-modal");

		this.noClose = false;
		// удаление модального
		listObj.off("mousedown");
		listObj.on("mousedown", function() {
			if (!$(this).closest(".hlp-modal").length
					|| $(this).attr("data-hlp-action") == "modal-close") {
				if(!obj.noClose) obj.delete();
				obj.noClose = false;
			} else {
				obj.noClose = true;
			}
		});
	}
/**********************************************************************************************/
	/**
	* Удалить блок модального окна
	*
	* @see 	Modal.delete()
	*/
	this.delete = function()
	{
		// удаляем модальное
		$('.hlp-modal-section').remove();
		// показываем модальное
		this.showScroll();
	};
/***********************************************************************************************/
	/**
	* прячем прокутку
	*
	* @see 		this.create()
	*/
	this.hideScroll = function()
	{
		// ширина до
		var width = $("body").width();
		//прячем прокрутка
		$('body').css({'overflow':'hidden'});
		$(document).css({'overflow':'hidden'});
		var scrollWidth = $("body").width()-width; 

		//делаем отступ с права на ширину скролла
		if (scrollWidth) $('body').css('padding-right', scrollWidth);		
	};

	/**
	* показываем прокутку
	*
	* @see 		this.delete()
	*/
	this.showScroll = function()
	{
		//показываем прокрутку
		$('body').removeAttr("style");
		$(document).removeAttr("style");
	};			
}//end class
