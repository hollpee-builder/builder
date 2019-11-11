/**
* Работа с формой
*
*
*
*/
var Form = new Form();
function Form() {
	/**
	* Список функций для проверок
	*
	*/
	this.listVarify = ["isFull", "isAllowedCharacters", "validation"];

	/**
	* Валидация
	*
	* @param 	obj 	elmForm - форма для проверки
	*/
	this.verify = function(elmForm) 
	{
		// убираем все ошибки
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

	/**
	* Проверка текстового поля
	* 
	* @see 	this.verify() 	
	*/
	this.verifyInputText = function(input)
	{
		var value = input.val().trim();
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

	/**
	* Проверка поля checkbox 
	*
	* @see 	this.verify() 
	*/
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
	this.listAllowedCharacters = {
		// "text":"^[a-zа-я0-9\-_@\.,?!\ ,\'\"@]+$",
		"text":".+",
		"password":"^[a-z0-9!?@#$%^&*-_]+$"
	}

	/**
	* Проверка на запрещеные символы
	*
	*
	*/
	this.isAllowedCharacters = function(input, value)
	{
		var inputType = input.attr("type");
		return this.verifyInput(value, inputType, this.listAllowedCharacters);
	}

/********************************************************************************************/
	/**
	* Патерны для валидации
	*
	*/
	this.listPatterValid = {
		"email":"^[a-z0-9\-_\.]{1,50}@[a-z0-9\-_]{1,50}\.[a-z0-9\-_\.]{1,120}$",
		"password":"^.{6,}$"
	}

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

/**********************************************************************************************/
/***ошибки*********************************************************************************************/
	/**
	* Убираем все ошибки
	*
	*/
	this.clearError = function() {
		$(".errorForm").remove();
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
/*************************************************************************************************/
	/**
	* Список ошибок
	*
	*/
	this.listError = {
		"isFull": {
			"text":Resource.main_form_error_isfull,
			"password":Resource.main_form_error_isfull
		},
		"isAllowedCharacters": {
			"text":Resource.main_form_error_allowed_characters_text,
			"password":Resource.main_form_error_allowed_characters_psw
		},
		"validation": {
			"email":Resource.main_form_error_validation_email,
			"password":Resource.main_form_error_validation_psw
		},
		"exists": {
			"email":Resource.main_form_error_exists_email
		},
		"isChecked": {
			"checkbox":Resource.main_form_error_checked
		},
		"noEqual": {
			"password":Resource.main_form_error_no_equal
		},
	}		

	/**
	* Выводим ошибку
	*
	*
	*/
	this.showError = function(input, errorType) {
		if (errorType == "isFull" 
				|| errorType == "isChecked"
				|| errorType == "noEqual"
				|| errorType == "isAllowedCharacters") {
			var name = input.attr("type");
		} else {
			var name = input.attr("name");
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
		return '<div class="errorForm">'+errorString+'</div>';
	}

	/**	
	* Установить стиль ошибкам
	*
	* 
	*/
	this.setStyleError = function(input) {
		// тексту
		$(".errorForm").css({
			"font-family":"Verdana",
			"font-size":"14px",
			// "color":"rgb(169,18,28)",
			"color":"rgb(255,80,80)",
			"margin": "5px 0 13px 0"
		});

		input.css({
			"border":"1px solid rgb(169,102,107)"
		});
	}
/*************************************************************************************************/
/*********************************************************************************************/
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
		var errorString = Resource.main_form_error_wrong_login;
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
/***********************************************************************************************/


}
















var domain = 'hollpee.com';
var domain_root = 'root.'+domain; 
var domain_editor = 'editor.'+domain; 
/***************************************************************************/

/**************************************************************************************************/
/**
* Отдает параметры запроса GET в виде массива
*
*
*/
function requestGET()
{
	var requestString = location.search.replace(/^\?/, '');
	var listParams = requestString.split('#');
	var GET = {};

	for (var index in listParams) {
		var param = listParams[index].split('=');
		GET[param[0]] = param[1];
	}

	return GET;
}
/*********************************************************************************************/
/**
* Копирует
*
* @see 	SelectPage.editListPagesId()
* @see 	SelectPage.addNewPageInList()
* @see 	History.record()
*/
function copyArray(array)
{
	var newArray = {}; 
	for (var index in array) {
		var item = array[index];
		if (item instanceof Object) {
			// newArray[index] = this.copyArray(item);
			newArray[index] = copyArray(item);
		} else {
			newArray[index] = item;
		}
	}
	return newArray;
}

/**********************************************************************************************/
/************************************************************************************************/
/**
* Подсказка
*
*
*/
var Promt = new Promt();
function Promt()
{
	/**
	* Показывает
	*
	*
	*/
	this.show = function(elmEvent, label)
	{

	}

	/**
	* Устанавливаем события 
	*
	*
	*/
	this.setVariable = function()
	{

	}
/********************************************************************************************/
	/**
	* Прячет
	*
	*
	*/
	this.hide = function() 
	{

	}
/**************************************************************************************************/
}//end class

/**************************************************************************************************/
/***********************************************************************************************/






















/**
* Модальное окно
*
*/
var Modal = new Modal();
function Modal() {
	/**
	* Создание модального окна
	*
	* @param 	array 	params - параметрамы 
	*
	* @uses 	Blackout.create() 		создаем затемнение
	*
	* array = 	'width':'80',
	*			'height':'',
	*			'height_other':'50',
	*			'top':'50',
	*			'id':'modalImage',
	*			'title':'Изменить изображение',
	*			'is_resize':true,
	* 			'no_close':false,
				'no_hide_scroll':false
	*			'nav':[
	*				['my', 'Мои'],
	*				['icon', 'Иконки'],
	*				['bg', 'Фон'],
	*				['button', 'Кнопки'],
	*				['arrow', 'Стрелки'],
	*				['photo', 'Фотографии']
	*			],
	*			'content':content,
	*			'content_class':'modalImageContent',
	* 			'content_height':'max',
	*			'button':[
	*				['delete', 'Удалить изображение'],
	*				['ok', 'Сохранить'],
	*				['cancel', 'Отмена']
	*			]
	* @uses 	Blackout.create()		создаем затемнение
	* @uses 	ModalBlock.create() 	Блок модального
	*
	*/
	this.create = function(params)
	{
		//создаем затемнение
		Blackout.create(params);
		//создаем блок  
		ModalBlock.create(params);	
	};
/*********************************************************************************************/
	/**
	* Удаление модального окна
	*
	* @see 	Blackout.seEvent()
	* @see 	this.deleteLoadind()
	* @see 	ModalBlock.setEventDelete()
	*/
	this.delete = function(is_record)
	{
		//удаляем затемнение
		Blackout.delete();
		//удаляем блок  
		ModalBlock.delete();	

		//записываем в историю
		if (is_record) {
			History.record();
		}
	};
/***************************************************************************************/
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
		var content = '<img src="/img/loading.gif" alt="" class="modalLoadingImage" />\
		 				<div class="modalLoadingLabel">'
		 					+label+"..."+
		 				'</div>';
		 
		 this.create({
		 	'id':'modalLoading',
		 	'width': '285',
		 	'height': '',
		 	'top': '180',
		 	'content': content,
		 	'not_event':true
		 });
	};

	/**
	* Удаление загрузки
	* 
	* @param 	boolean 	is_delay-делать задержку
	*
	* @uses 	this.delete()	удаляет модальное окно полностью
	*/
	this.deleteLoadind = function(is_delay) {
		var obj = this;
		//делаем удаление с задержкой, если быстро произошло действие чтобы не дергало
		if (is_delay) {
			setTimeout(function(){
				obj.removeLast();
			}, 1500);
		} else {
			this.removeLast();
		}
	}
/***************************************************************************************/
	/**
	* Удаление загрузки
	*
	*
	*/
	this.removeLoading = function()
	{

	};
/************************************************************************************************/
	/**
	* Подтверждение удаления
	*
	*
	*/
	this.confirmationDelete = function(label, func)
	{
		if (!label) label = Resource.main_confirmation_delete_label;
		
		var content = '<div class="confirmationDeleteLabel">'+label+'</div>';

		this.create({
			"title":Resource.main_confirmation_delete_label,
			"id":"confirmationDelete",
			"width":400,
			"top":50,
			"content":content,
			"button":[
				["cancel", Resource.main_modal_but_cancel],
				["delete", Resource.main_modal_but_delete]]
		});

		var obj = this;
		// нажатие любой кнопки
		$("#confirmationDelete .butDelete").off("click"); 
		$("#confirmationDelete .butDelete").on("click", function() {
			if (func) func();
			
			obj.removeLast("confirmationDelete");
		});
	}
/*************************************************************************************************/
	/**
	* Убрать последний блок
	*
	* @see 	this.confirmationDelete()
	*/
	this.removeLast = function()
	{
		// удаляем сам блок
		$(".modalBlock:last").remove();
		$(".blackout:last").remove();
		
		// показываем предыдущий
		if ($(".modalBlock").length) {
			$(".modalBlock:last").css("display", "block");
		}
	}


/**********************************************************************************/
	
	this.tutorial = function(butObjV, titleV, embedV)
	{
		butObjV.off("mousedown");
		butObjV.on("mousedown", function() {
			
			var content = '\
				<div class="modalVideoFrameWrap">\
					<div class="modalVideoFrameContent">\
						<iframe style="width:100%;height:280px;display:block;" id="modalVideoFrame" src="http://www.youtube.com/embed/'+embedV+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
					</div>\
				</div>';

			Modal.create({
				'id':'modalTutorial',
				'content':content,
				'title': titleV,
				'button':[
							['cancel', 'Закрыть'],
						],
				'width':'550',
				'height':'', 
				'top':'50'});
		});
	}
	
/***********************************************************************************/
}//end class
/**********************************************************************************/
/***********************************************************************************/
/*затемнения******************************************************************************/
var Blackout = new Blackout();
function Blackout() {
	/**
	* Создание затемнения
	*
	* @param 	boolean 			not_event - не ставить событие 
	*
	* @uses 	this.hideScroll() 	убирает прокрутку
	* @uses 	this.show() 		показывает затемнение
	* @uses 	this.setEvent() 	установить событие для затемнения	 		
	* @see 		Modal.create() 		при создании модального окна	
	*/
	this.create = function(params) {
		this.params = params;

		//вставляем блок затемнения
		$('body').append('<div class="blackout"></div>');
		
		if (!params['no_hide_scroll']) {
			//прячем прокрутку
			this.hideScroll();
		}
		
		//показать затемнение
		// if($('.blackout').length == 1) 
			this.show();

		//событие затемнения на удаление
		if (!params["not_event"]) {
			//ставим
			this.setEvent();
		} else {
			//убираем
			this.deleteEvent();
		}
	};
/****************************************************************************************/
	/**
	* показать затемнение
	*
	* @uses 	this::speed - скорость анимации
	* @see 		this::createBlackout()	
	*/
	this.show = function()
	{
		$('.blackout').animate({'opacity':'1'}, 0);
	};
	/**
	* убрать затемнение
	*
	* @uses 	this::showScroll() 	показать прокрутку	
	* @see 		this::deleteModal()
	*/
	this.delete = function()
	{
		//убираем затемнение
		$('.blackout').remove();
		//показываем прокрутку
		this.showScroll();
		// убираем события на кнопки
		$(document).off("keydown");
	};
/*******************************************************************************/
	/**
	* Поставить событие - закрытие модального окна при клике 
	* вне области модального окна
	*
	* @uses 	Modal.delete() 		удаление блока
	* @see 		this.create()
	*/
	this.setEvent = function()
	{
		//клик вне области модального окна
		$('.blackout').off('click');
		$('.blackout').on('click', function() {
			if ($(".modalBlock").length > 1) Modal.removeLast("modalAddFolder");
			else Modal.delete();

			return false;
		});
	};	

	/**
	* Убираем событие
	*
	*/
	this.deleteEvent = function()
	{
		$('.blackout').off('mousedown');
	};

/**********************************************************************************/
	/**
	* прячем прокутку
	*
	* @see 		this.create()
	* @todo 	сделать padding-right у body
	*/
	this.hideScroll = function()
	{
		// ширина до
		var width = $("body").width();
		//прячем прокрутка
		$('body').css({'overflow':'hidden'});
		var scroll_width = $("body").width()-width; 
		
		//делаем отступ с права на ширину скролла
		if (scroll_width) $('body').css('padding-right', scroll_width);		
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
	};



}//end class
/**********************************************************************************/
/***********************************************************************************/
/*создание блока******************************************************************************/
var ModalBlock = new ModalBlock();
function ModalBlock() { 
	/**
	* @var 		array  параметры всех модальных окан 	
	* @set 		this.setVariables()
	*/
	this.data = {};

	/**
	* @var 		array  параметры текущего модального окна
	* @set 		this.setVariables()
	*/
	this.curr_data = {};

	/**
	* @var 		array  переменые 	
	* @set 		this.createBlock()
	* @see 		this.setOptionsBlock()
	*/
	this.curr_modal = {};

	/**
	* @var 	array 	ширина scroll
	* 
	*/
	this.scroll_width = 0;
/*************************************************************************************/	
	/**
	* Создание блок модального окна
	*
	* @param 	array					params - параметры блока 
	*
	* @uses 	this.setVariables()			устанавить переменые
	* @uses 	this.createBlock()			создаем модальный блок
	* @uses 	this.setOptionsNewBlock()	устанавливаем параметры новому блоку
	* @uses 	this.seEvent() 				устанавливаем события
	* @see 		Modal.create() 				при создании модального окна	
	*/
	this.create = function(params) 
	{
		//прячем все блоки
		// $('.modalBlock').css('display', 'none');

		//устанавить переменые
		this.setVariables(params);	
		//вставляем модальное окно на страницу
		this.createBlock();
		//устанавливаем параметры блока для созданного блока
		this.setOptionsNewBlock();
		//устанавливаем параметры для блока
		this.setEvent();

		// ставим фокус
		this.setFocus();
		// нажатие enter
		this.setKeyEnter();
	};

	/**
	* Ставит focus
	*
	* @see 	this.create()
	*/
	this.setFocus = function()
	{
		setTimeout(function() {
			var firstInput = $(".modalBlock:last").find("input[type='text'], textarea");
			firstInput.eq(0).focus()

		// 	var range = document.createRange();
		// 	var sel = window.getSelection();
		// 	range.setStart(firstInput[0], 1);
		// 	range.collapse(true);
		// 	sel.removeAllRanges();
		// 	sel.addRange(range);
		}, 50)
	}

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
			var lastModal = $(".modalBlock:last");
			var butAction = lastModal.find(".butAdd");
			if (!butAction.length) butAction = lastModal.find(".butOk");
			if (!butAction.length) butAction = lastModal.find(".butDelete");
				
			// эмитируем нажатие 
			butAction.mousedown().click();
			// удаляем
			// Modal.removeLast();
			return false;
		});
	}
/***************************************************************************************/
/***************************************************************************************/
	/**
	* Устанавливаем параметры
	*
	* @param 	array				params - параметры блока 
	*
	* @see 	this.create()
	*/
	this.setVariables = function(params)
	{
		//ширина и высота экрана
		this.screen_width = $('body').width();
		this.screen_height = $('body').height();
				
		//ширина экрана без скролла 
		this.screen_width_noscroll = this.screen_width + this.scroll_width;

		//ширина и высота блока 
		params['height'] = params['height'] ? params['height']+'px' : 'auto';

		// координат по x - ставим в центер экрана
		var elmWidth = params['width'];
		var widthUnit = elmWidth.toString().match(/%/) ? "%" : "px";
		var parentWidth = widthUnit == "%" ? 100 : this.screen_width;
		var elmLeft = (parentWidth - parseInt(elmWidth)) / 2;
		if (elmLeft < 0) elmLeft = 0;
		params['left'] = elmLeft + widthUnit;

		//класс контента
		params['content_class'] = params['content_class'] ? params['content_class'] : 'modalBlockCont';
	
		//класс блока
		modal_id = params['id'];
		//заносим в массив данные
		this.data[modal_id] = params;
		this.curr_data = params;
	}
/*************************************************************************************/
/************************************************************************************/
	/**
	* Вставляем модальный блок на страницу
	*
	* @uses 	this.getBlock() 	получить блок для встаки
	* @see 		this.create()
	*/	
	this.createBlock = function()
	{
		//получаем блок
		var block = this.getBlock();
		//вставляем на страницу
		$('body').append(block);
		//текущие модальное окно
		this.curr_modal = $('#'+this.curr_data['id']);
	}
/***********************************************************************************/
	/**
	* Отдать блок
	*
	* @uses 	this.getBlockHead() 	получить header 
	* @uses 	this.getBlockNav() 		получить навигацию (если есть)
	* @uses 	this.getBlockButton() 	получить блок кнопак (если есть)
	* @see 		this.createBlock();
	*/
	this.getBlock = function()
	{
		//заголок
		var block_head = this.getBlockHead();
		//навигация
		var block_nav = this.getBlockNav();
		//кнопки
		var block_button = this.getBlockButton();

		//формируем блок
		var block = '	<div class="modalBlock" id="'+this.curr_data['id']+'">'
							+block_head
							+block_nav+
							'<div class="modalBlockCont">'
								+this.curr_data['content']+
							'</div>'
								+block_button+
							'<div class="clear"></div>\
						</div>';
		return block;
	};
/***************************************************************************************/
	/**
	* Отдает часть блока - заголовок
	*
	* @uses 	this.params['title'] 	название блока
	* @see 		this.getBlock()
	*/
	this.getBlockHead= function()
	{
		//this.params['title']
		if (this.curr_data['title']) {
			//блок изменения размера
			var block_resize = this.curr_data['is_resize'] ? '<div class="modalHeadResize modalHeadButtomItem" status="min" is-image="true"></div>' : '';
			var block_close = !this.curr_data['no_close'] ? '<div class="modalHeadClose modalHeadButtomItem" is-image="true"></div>' : '';

			return '<div class="modalBlockHead">\
						<div class="modalBlockTitle">'
							+this.curr_data['title']+ 
						'</div>\
						<div class="modalBlockHeadButtom">'
							+block_close
							+block_resize+
						'	<div class="clear"></div>\
						</div>\
					</div>'
					;
			} else {
				return '';
			}
	};
/**************************************************************************************/
	/**
	* Отдает блок навигации
	*
	* @see 		this.getBlock()
	*/
	this.getBlockNav =  function()
	{
		//список пунктов навигации
		var list_nav = this.curr_data['nav']; 
		//если есть навигация
		if (list_nav) {
			var block = '';
			//gjпроходим по пунктам навигацию
			for (var k in list_nav) {
				//пункт
				var item = 	list_nav[k];
				//класс активности
				var class_act = k == 0 ? 'modalNavItemAct': '';  

				//формируем вкладку
				block += '<div class="modalNavItem '+class_act+'" type="'+item[0]+'">'+item[1]+'</div>';
			}

			return 	'<div class="modalNav">'
						+block+
						'<div class="clear"></div>\
					</div>';
		} else {
			return '';
		}	
	};
/****************************************************************************************/
	/**
	* @var 	array 	классы кнопок
	* @see 	this::getOneButton()
	*/
	this.buttton_class = {
		'add':'butAdd', 
		'ok':'butOk', 
		'cancel':'butCancel',
		'delete':'butDelete',	
		'edit':'butEdit',	
		'buy':'butBuy'
	};

	/**
	* Отдает часть блока - кнопки
	*
	* @return 	html 	блок с кнопками
	*
	* @uses 	this.params['button'] 		кнопки
	* @use 		this.getOneButton() 		отдает кнопку определенного типа
	* @see 		this.getBlock()
	*/
	this.getBlockButton = function()
	{
		//кнопки
		var buts = this.curr_data['button'];
		if (buts) {
			//формируем блок
			var block = '<div class="modalBlockButtton">';
			//разбиваем набор на кнопки
			for (var item in buts) {
				//получить одну кнопку
				block += this.getOneButton(buts[item])
			}
			block += '		<div class="clear"></div>\
						</div>';

			return '<div class="modalBlockFooter">'+block+'<div class="clear"></div></div>';
		} else {
			return '';
		}
	};

	/**
	* отдает кнопку
	*
	* @param 	array 	item - одна кнопка
	* @return 	html 	одну кнопку
	*
	* @uses 	this::buttton_class 	классы кнопок
	* @see 	this::getBlockButton()
	*/
	this.getOneButton = function(item)
	{
		var but = '	<div class="butBlock '+this.buttton_class[item[0]]+'">\
						<div class="textInBut">'+item[1]+'</div>\
					</div>';
		return but;
	};

/************************************************************************************/
/***установка параметров********************************************************************************/
	/**
	* Устанавливает параметры для окна
	*
	* @uses 	this.setOptionsBlock() 	 		для блока
	* @uses 	this.setOptionsBlockContent() 	для контента
	* @see 		this.create()
	*/
	this.setOptionsNewBlock = function()
	{
		//для блока
		this.setOptionsBlock();
		//для конента
		this.setOptionsBlockContent();
	};
	/**
	* Устанавливает параметры 
	*
	* @uses 	this.curr_data 				данные текущего блока
	* @see 		this.setOptionsNewBlock()
	*/
	this.setOptionsBlock =  function() 
	{
		//задаем блоку параметры
		this.curr_modal
			.css({
				'width':this.curr_data['width'], 
				'height':this.curr_data['height'],
				'top':this.curr_data['top']+'px',  
				'left':this.curr_data['left']
			});
	};
	
	/**
	* Устанавливает параметры для контента блока
	*
	* @uses 	this.getHeightContent() 	получить высоту контейнера
	* @see 		this.setOptionsNewBlock()
	* @see 		this.setEventResize
	*/
	this.setOptionsBlockContent =  function() 
	{
		//высота контенера
		var height = this.getHeightContent();
		//контент
		$('.'+this.curr_data['content_class']).height(height);
	};

	/**
	* Получить высоту контеннера
	*
	* @param 	int 	indent-отступ снизу
	*
	* @see 	this.setOptionsBlockContent() 		при создание блока
	* @see 	this.setEventResize() 			 	при изменении размера блока
	*/
	this.getHeightContent = function(indent)
	{
		//отступ с низу,
		var indent_bottom = indent ? indent : 80;

		if (this.curr_data['content_height'] == 'max') {
			//текущий блок
			var par = this.curr_modal;
			//дополнительная высота
			var height_other = this.curr_data['height_other'] ? this.curr_data['height_other'] : 0;
			//расчитываем высоту блока с контентом
			return this.screen_height - par.find('.modalBlockHead').height() - par.find('.modalNav').height() - par.find('.modalBlockFooter').height() - parseInt(this.curr_modal.css('top')) - height_other - indent_bottom; 
		} else {
			return this.curr_data['content_height'];
		}
	};
/*************************************************************************************/
/************************************************************************************/
	/**
	* Устанавливаем события 
	*
	* @uses 	this.setEventResize() 			изменить размер
	* @uses 	this.setEventDelete() 		 	удаление блока
	* @uses 	this.setEventNoteItemBlock()	выбор элемента из списка
	* @uses 	this.setEventNav() 				навигация
	* @see 		this.create()
	*/
	this.setEvent = function()
	{
		//изменение размера блока
		this.setEventResize();
		//удаление блока 
		this.setEventDelete();
		//выбор элемента
		this.setEventNoteItemBlock();
		//навигация
		this.setEventNav();
	}
/************************************************************************************/
	this.setEventResize = function()
	{
		var obj = this;
		//расширение блока
		$('.modalHeadResize').off('mousedown');
		$('.modalHeadResize').on('mousedown', function() {
			var elm = $(this);
			var status = elm.attr('status');

			if (status == 'min') {
				//изменяем параметры модального окна
				obj.curr_modal.css({
					'width':'95%',
					'top':'25px','left':'2.5%'
				});
							
				//изменяем блока с контентом
				$('.'+obj.curr_data['content_class']).height(obj.getHeightContent(50));

				//добавляем класс отмечающий что max 
				elm.addClass('modalHeadResizeMax');
			} else {
				//устанавливаем стили
				obj.curr_modal.css({
					'top':obj.curr_data['top']+'px', //позиция 
					'left':obj.curr_data['left']+'px',
					'width':obj.curr_data['width']
				});
				//убираем класс отмечающий что max 
				elm.removeClass('modalHeadResizeMax');
				//устанавливаем параметры контента так как параметры изменились
				obj.setOptionsBlockContent();
			}
						
			//отимечаем текущий размер
			var new_status = status == 'min' ? 'max' : 'min';
			elm.attr('status', new_status);
		});
	}
/**********************************************************************************/
	/**
	* Удаление модального окна
	*
	* @uses 	Modal.delete() 		удаление модального окна полностью
	* @see 		this.setEvent()
	*/
	this.setEventDelete = function()
	{
		
		// $('.modalHeadClose').off('mousedown');
		// $('.modalHeadClose').on('mousedown', function() {
		// 	Modal.delete();
		// });

		//кнопка cancel
		$('.modalBlock .butCancel, .modalHeadClose').off('mousedown');
		$('.modalBlock .butCancel, .modalHeadClose').on('mousedown', function() {
			if ($(".modalBlock").length > 1) Modal.removeLast("modalAddFolder");
			else Modal.delete();
		});
	}
/*******************************************************************************************/
	/**
	* Отметить элемент
	*
	* @see 	this.setEvent()
	*/
	this.setEventNoteItemBlock = function()
	{
		$('.modalBlockItem').off('mousedown');
		$('.modalBlockItem').on('mousedown', function() {
			//убираем выделение у элемента
			$('.modalBlockItem').attr('note', 'false');
			//отмечаем элемент
			$(this).attr('note', 'true');
		})
	}
/***************************************************************************************************/
	/**
	* Навигация
	*
	* @see 	this.setEvent()
	*/
	this.setEventNav = function() 
	{
		$('.modalNavItem').off('mouseup');
		$('.modalNavItem').on('mouseup', function() {
			//убираем класс у всех
			$('.modalNavItem').removeClass('modalNavItemAct');
			//добавляем класс
			$(this).addClass('modalNavItemAct');
		})
	}
/****************************************************************************************/
/*******************************************************************************************/
	/**
	* Показать модальное окно - анимация
	*
	* @see 		this.create()
	*/
	/*this.show = function()
	{
		this.curr_modal
			.css({'top':'-'+this.block_height})
			.animate({'top':this.pos_y},0);	
	};*/
	
	/**
	* Удалить блок модального окна
	*
	* @see 	Modal.delete()
	*/
	this.delete = function()
	{
		$('.modalBlock').remove();
	};
				
}//end class
/*************************************************************************************/
/***************************************************************************************/
/*загрузка**************************************************************************************/


/**
* Окно оповещения
*
*
*/
var Notification = new Notification();
function Notification() {
	/**
	* Все нормально
	*
	*/
	this.ok = function(msg, position, speedV)
	{
		if (!speedV) speedV = 2000;
		this._show(msg, "notificationOk", 2000, position); 
	}

	/**
	* ошибка
	*
	*/
	this.error = function(msg, position, speedV)
	{
		if (!speedV) speedV = 3000;
		if (!msg) msg = Resource.main_notification_error;
		this._show(msg, "notificationError", speedV, position); 
	}


	this._show = function(msg, notif_class, speed, position) 
	{	
		if (!position) position = "center";

		// сам блок
		var block = '<div position="'+position+'" class="notification '+notif_class+'">\
						<div id="notificationText">'+msg+'</div>\
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

/***********************************************************************************************/
/***подсказки при наведении на элемент*********************************************************************************/
var Tip = new Tip();
function Tip() {
	/**
	* Ставить событие
	*
	* @see 	EditElementImage.setEventDeleteFolder();
	*/	
	this.setEvent = function(elm, label, position)
	{	
		if (!elm) elm = $("*[label]");

		elm.off('mouseover');
		elm.on('mouseover', function() { Tip.show($(this));});

		elm.off('mouseout'); 
		elm.on('mouseout', function() { Tip.hide($(this));});
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
		elm.removeAttr("label").removeAttr("pos");
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
			var label = elm_event.attr('label');
			label = label.replace(/\n/gim, "<br/>");

			//формируем блок
			var block = '<div class="tipBlock" >\
							<div class="tipArrow"></div>\
							<div class="tipText">'
								+label+
						'	</div>\
						</div>';
			//добавлем на страницу
			$('body').append(block);
			//установить position блоку
			obj.setPosition(elm_event);
		}, delay);

		// сбрасываем
		elm_event.off("mouseout");
		elm_event.off("mouseup");
		elm_event.on("mouseout mouseup", function() {
			elm_event.off("mouseout");
			clearTimeout(obj.showEvent);
			obj.hide();

			obj.showNow = false;
			// obj.showNow = true;
			setTimeout(function() { obj.showNow = false;}, 250);
		});
	}

	this.replaceText = function(label)
	{
		// this.noShow = true;
		$(".tipText").html(label);
	} 

	/**
	* Убрать подсказку
	*
	* @see 	EditorController.setEventTip()
	*/
	this.hide = function()
	{
		$('.tipBlock').remove();
		clearTimeout(this.showEvent);
	}
/********************************************************************************/
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
	* Установить позицию 
	*
	* @param 	obj 	elm_event-элемент на котором сработало событие
	*
	* @see 	showTip()
	*/
	this.setPosition = function(elm_event)
	{
		var elm_block = $('.tipBlock');
		var elm_arrow = $('.tipArrow');
		//положение
		var pos = elm_event.attr('pos'); 
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
/**********************************************/

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
		var arrow_left = (param['height_block']/2)-(parseInt($('.tipArrow').css('border-left-width'))/2);
		result['arrow'] = {'top': arrow_left-4};
		
		return result;
	}

}











/**
* Работа с файлом
*
*
*/
var File = new File();
function File() {
	/**
	* Добавить нельзя
	*
	*/
	this.noAdd = false;

	/**
	* Один Mb
	*
	*/
	this.oneMb = 1048576;
		
	/**
	* Максимальное количество Mb
	*
	*/	
	this.maxSizeFileLpf = 50;
	this.maxSizeFileVideo = 2;
	this.maxSizeFileImage = 2;
	this.maxSizeFileFont = 1;

	/**
	* Создает кнопку для загрузки файла
	*
	*
	*/
	this.createButUpload = function(parentObj, but, url, fileType, siteId, funcAfterUpload)
	{
		this.siteId = siteId;
		this.url = url;
		this.fileType = fileType;
		this.funcAfterUpload = funcAfterUpload;

		// добавляем кнопку
		this.addButUpload(parentObj, but);
		// добавляем событе
		this.setEventButUpload(url);
	}

	/**
	* Добавляет кнопку
	*
	* @see 	this.createButUpload()
	*/
	this.addButUpload = function(parentObj, but)
	{
		if (but) $(".h-but-upload-file, .h-upload-file").remove();

		parentObj.find("#formUploadFileId").remove();

		var formUploadFile = '\
			<form action="" id="formUploadFileId" method="post" enctype="multipart/form-data" class="h-upload-file" style="display:none;" >\
				<input type="file" id="hNewFile" name="new_image" value=""/>\
				<input type="submit" id="hNewFileSub" value="Загрузить" />\
			</form>\
		';

		formUploadFile += but;

		var listChild = parentObj.find("*");
		var lastChild = listChild.filter(":last-child");
		if (lastChild.length) {
			if (listChild.length > 1 && lastChild.hasClass("clear")) lastChild = lastChild.prev();
			lastChild.after(formUploadFile);
		} else {
			parentObj.append(formUploadFile);			
		}
	}

	/**
	* Событие загрузки файла
	*
	* @see 	this.createButUpload()
	*/
	this.setEventButUpload = function(url) 
	{
		var obj = this;
		/**
		* Эмитация клика
		*/
		var butUpload = $(".h-but-upload-file");
		butUpload.off("mouseup"); 
		butUpload.on("mouseup", function() {
			if (obj.noAdd) {
				obj.noAdd = false;
				return false;
			}
			
			//эмитируем клик, для открытие окна для выбора файла
			$("#hNewFile").click();
			return false;
		});

		//файл выбран
		$("#hNewFile").off("change"); 
		$("#hNewFile").on("change", function() {
			var file = $(this)[0].files[0];
			if (!file) return false;

			// проверяем на валидность файла
    		var isValid = obj.isValidFile(file);
	    	if (!isValid) return false;

			Modal.createLoading(Resource.main_file_label_load);

			// Инициируем функцию FileReader
			var fileReader = new FileReader();
            fileReader.onload = (function(event) {
            	obj.handlerUploadImage(file, event);
            });
         	// Производим чтение файла по URI
         	fileReader.readAsDataURL(file);

         	var loadingLabelObj = $(".modalLoadingLabel");
	        fileReader.onprogress = function(data) {
	            if (data.lengthComputable) {   
	                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
	                // var loadingLabel = progress > 98 ? "Сохраняю..." 
	                // 							: "Загруженно " + progress + "%";
					// loadingLabelObj.text(loadingLabel);
	            }
	        }
		});
	}

	/**
	* Загрузка файла
	* 
	* @see 	this.setEventButUpload()
	*/
	this.handlerUploadImage = function(file, event) 
	{
		// перезагружаем поле загрузки файла
    	this.reloadInputNewImg();

	    var siteId = this.siteId;
	    if ($(".modalNavItemAct").attr("type") == "main") {
			siteId = "main";
	    }
 		
 		// текущая директория   переделать
 		var curDir = '';
 		var curDirElmObj = $("#modalImage");
 		if (curDirElmObj.length) {
 			curDir = curDirElmObj.attr("data-curent-dir");
 		}
 		
 		var fileName = file.name;
 		// fileName = fileName.replace(/-/gim, "");

 		fileName = fileName.replace(/\s+/gim, '');
    	fileName = fileName.replace(/\([^\)]+\)/gim, '');
    	
    	var obj = this;    
    	var content = event.target.result;
    	var queryString = {
    		"type" : this.fileType,
    		"site_id" : siteId,
    		"dir":curDir, 
    		"name" : fileName, 
    		"content" : content
    	};

    	if (fileName.match(/\.commerce\.hollpee$/gim)) {
    		this.enterActivateKey(queryString);
    	} else {
    		this.saveFile(queryString);
    	}
    }

    /**
    * Перезагружаем поле - новый фаил
    *
    * @see 	this.setEventButUpload()
    */
    this.reloadInputNewImg = function()
    {
    	$("#hNewFile").remove();
		var inputNewImg = '<input type="file" id="hNewFile" name="new_image" value=""/>';
		$(".h-upload-file").prepend(inputNewImg);
		this.setEventButUpload();
    }

    this.saveFile = function(queryString)
    {
    	var obj = this;
    	$.post(this.url, queryString, function(data) {
    		obj.funcAfterUpload(data.trim());
    	});
    }
    
/*****************************************************************************/

    this.enterActivateKey = function(queryString)
    {
    	Modal.delete();
    	this.showModalActivateKey();
    	this.setEventModalActivateKey(queryString);
    }

    this.showModalActivateKey = function()
    {
    	var content = '\
			<div class="modalLabel">'+Resource.main_modal_activate_key+'</div>\
			<input type="text" class="valueActivationKey" />\
    	';

    	Modal.create({
    		"id":"modalActivationKey",
    		"top":50,
    		"width":500,
    		"content":content,
    		"button":[
    			["cancel",Resource.main_modal_but_cancel],
				["add",Resource.main_modal_but_activate]
    		]
    	});
    }

    this.setEventModalActivateKey = function(queryString)
    {
    	var obj = this;
    	var butObj = $("#modalActivationKey .butAdd");
    	butObj.off("mousedown");
    	butObj.on("mousedown", function() {
    		var activationKeyV = $("#modalActivationKey .valueActivationKey").val();
    		if (!activationKeyV) return false;

    		Modal.createLoading(Resource.main_file_label_load);
    		queryString["activation_key"] = activationKeyV;
    		obj.saveFile(queryString);
    	});
    }

/*********************************************************************************/

	/**
	* Проверка на валидность
	*
	* @see 	this.setEventButUpload()
	*/
	this.isValidFile = function(file)
	{
		if (this.fileType == "img") return this.isValidFileImage(file);
		else if (this.fileType == "video") return this.isValidFileVideo(file);
		else if (this.fileType == "font") return this.isValidFileFont(file);
		else if (this.fileType == "template") return this.isValidFileTemplate(file);
	}
		
	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileImage = function(file)
	{
		var maxSizeImage = this.oneMb * this.maxSizeFileImage;

		if (!file.type.match(/^image/gim)) {
			Notification.error(Resource.main_file_upload_no_image);
			return false;
		} else if (file.size >= maxSizeImage) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileImage+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация видео
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileVideo = function(file)
	{
		var maxSizeVideo = this.oneMb * this.maxSizeFileVideo;

		// if (!file.name.match(/\.css$/gim) 
		// 		&& !file.name.match(/\.js$/gim)
		// 		&& !file.name.match(/\.zip$/gim)
		// 		&& !file.name.match(/\.rar$/gim) ) {
		// 	Notification.error("Загружать можно только формат .css, .js, .zip, .rar");
		// 	return false;
		// } else 
		if (file.size >= maxSizeVideo) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileVideo+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileFont = function(file)
	{
		var maxSizeFont = this.oneMb * this.maxSizeFileFont;

		if (!file.name.match(/\.ttf$/gim)) {
			Notification.error(Resource.main_file_upload_only+" .ttf");
			return false;
		} else if (file.size >= maxSizeFont) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileFont+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileTemplate = function(file)
	{
		var maxSizeLpf = this.oneMb * this.maxSizeFileLpf;
			
		// проверка типа
		if (!file.name.match(/\.hollpee$/)) {
			Notification.error(Resource.main_file_upload_only_hollpee);
			return false;
		} else if (file.size >= maxSizeLpf) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileLpf+" Mb");
			return false;
		} else {
			return true;
		}
	}

} // end class
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






















/**
* Работа с Редактором
*
*
*
*/
var EditorController = new EditorController();
function EditorController() {
	//статус, false-если стоит фокус на input
	/**
	* Статус о том можно ли чтобы срабатывало событие повешаное на кнопку
	* @set 	this.setEventKey(), EditElementText.setEventReplaceText()
	* @see 	this.setEventKey()
	*/
	this.status_down_key = true;

	this.objTimeoutSave = false;
	this.oldInputValue = false;

/****************************************************************************/
	/**
	* События 
	*
	* @uses 	this.setEventTip()			подсказка
	* @uses 	this.setEventKey() 			нажатие клавиш
	* @uses 	this.setEventNavMenu() 		навигация по меню
	* @see 		setEvent() 					
	*/
	this.setEvent = function()
	{	
		//при наведении показываются подсказки
		this.setEventTip();
		//нажатие клавиш(комбинаций)
		this.setEventKey();
		//навигация по правой панели
		this.setEventNavMenu();
		// свернуть правое меню
		this.setEventListElements();
		// свернуть секции в правом
		this.setEventTurnSectionMenu();
		// изменить тип экрана
		this.setEventEditScreen();
		// режим просмотра
		this.setEventModeShow();
		// режим работы
		this.setEventModeWork();
		// сброс
		this.setEventReset();
		// изменение размера экрана
		this.setEventResizeWindow();
		// переключение вкладок
		this.setEventTab();
		// кпопка просмотр
		this.setEventButFullShow();
		// закрыть редактор
		this.setEventExit();
		// отображение линейки
		this.setEventVisibleRuler();
		// детально о типах просмотра
		this.setEventDetailShowType();
		// настройки страницы
		this.setEventPageSetting();
		// настройки магазина
		this.setEventManagerFile();

		// для направляющих
		Guides.setEvent();
		// ставим модальную сетку
		Grid.setEvent();

		// ставим список страниц в select
		ManagerPage.setSelectListItem();
		ManagerModal.setSelectListItem();

		// Список элементов
		MenuListItem.setEvent();

		/**********/
		// Store.showModal();
	}
/********************************************************************************/
	/**
	* Подсказки на кнопках меню
	*
	* @see 	this.setEvent()
	* @see 	ElementSlider.addAddedBlock()
	*/
	this.setEventTip = function()
	{
		//при наведении
		$('*[label]').off('mouseover');
		$('*[label]').on('mouseover', function() {
			Tip.show($(this));
		});
	}
/****************************************************************************/
	/**
	* Нажатие клавиш
	*
	* @uses 	this.status_down_key 	статус можно выполять событие кнопки или нет
	* @uses 	Key.key*() 				нажатие клавиш
	* @see 		this.setEvent()
	*
	* @todo  	разбить на функции
	*/
	this.setEventKey = function() {
		var obj = this;

		$('body').off('keydown keyup');
		$('body').on('keydown keyup', function(e) {	
			var code = e.keyCode;
			var func_name = obj.getFunctionByPressKey(code);
			if (e.type == "keyup") {
				func_name += "_keyup";
				Key.resetDown();
			} else {
				Key.setDown(e);
			}

			//если есть такая функция и мы не в режиме редактирования
			if (Key[func_name] && !TextEditor.isShow()) {
				var status = !$('input[type="text"], textarea').not("#inputResetFocus").filter(":focus").length;
				
				//выполняем действие
				var res = Key[func_name](e, status);
				//что бы не выполнялось стандартное действие привязаное на данную клавишу
				if (res) return false;
			}

			// при нажатии на enter сбрасываем фокус, если он стоит в правой панели
			if (code == "13" && $(".rightMenu input:focus").length) {
				Editor.resetFocus();
			}
			
		});

		//для отслеживания что находиться курсор в блоке .content
		$('.wrapper input[type="text"], .wrapper textarea').off('focus');
		$('.wrapper input[type="text"], .wrapper textarea').on('focus', function() {
			// obj.status_down_key = false;
			var elmEvent = $(this);
			obj.setEventWheelInput();

			// вводить можно только английский
			SpecialInput.setEventOnlyEng(elmEvent);

			obj.oldInputValue = elmEvent.val();
			History.isFixedAll = true;
		});

		$('.wrapper input[type="text"], .wrapper textarea').off('focusout');
		$('.wrapper input[type="text"], .wrapper textarea').on('focusout', function() {
			var elmEvent = $(this);

			// obj.status_down_key = true;
			obj.clearEventWheelInput();
			// убираем событие
			SpecialInput.clearEventOnlyEng();

			if (obj.oldInputValue != elmEvent.val()) {
				History.record();
			}
			History.isFixedAll = false;
		});
	}

	/**
	* Отдает имя функции по нажатой клавише
	*
	* @see 	this.setEventKey()
	*/
	this.getFunctionByPressKey = function(code)
	{
		var funcName = 'key'+code;
		

		// если в фокусе цвет
		if($(".rightMenu input:focus").filter("[color]").length) funcName += "color";
		// если открыто модальное окно
		else if ($(".modalBlock").css("display") == "block") funcName += "modal"; 
		else if ($(".textRedactor").css("display") == "block") funcName += "text";

		return funcName;
	}
/**********************************************************************************************/
	/**
	* Скрол при фокусе в input
	* 
	* @see setEventKey()
	*/
	this.setEventWheelInput = function()
	{	
		$(document).off("wheel mousewheel MozMousePixelScroll");
		$(document).on("wheel", function(e) {
			if (!Key.isDownShift()) return true;

			var isFocus = $(".rightMenuContent input:focus").length;
			var inputFocus = $(".rightMenuContent input:focus");

			if (isFocus && !inputFocus.attr("color")) {
				var value = e.originalEvent.deltaY || e.originalEvent.detail || e.originalEvent.wheelDelta;
				if (!value) return false;
				
				if (value > 0) {
					Key.keyWheelBottom();
				} else {
					Key.keyWheelTop();
				}
				return false;
			}
		})
	}
	
	this.clearEventWheelInput = function()
	{
		$("body").off("wheel");
	}
/***********************************************************************************************/
	/**
	* Навигация по меню правой панелт
	*
	* @uses 	Editor.setTitleRightMenu() 		устанавливаем заголовк в правой панели
	* @see 		this.setEvent()
	*/
	this.setEventNavMenu = function()
	{
		var obj = this;
		$('.rightMenuNavItem').off('mousedown');
		$('.rightMenuNavItem').on('mousedown', function() {
			var elmEvent = $(this);
			var type = elmEvent.attr('type');
			var oldType = $(".rightMenuNavItem[chosen='true']").attr("type");
			var elm = Element.obj;

			// выбираем вкладку
			obj.setTabMenuRight(elmEvent, type);

			// особеность для вкладки сайт
			if (type == "site") {
				// запоминаем текущий элемент, для возрата на него
				// если модал то элемент запомнили, в this.setEventTab() при переходе на modal
				if (!Screen.isModal()) Element.prevElm = Element.obj;
				// показываем секцию со стилями
				$(".menuStyle").css("display", "block");
				// переходим на сайт с модального
				// $(".topPanelNavPage:not([chosen='true'])").mousedown();
				// эмитируем нажатие
				$(".content .site").mousedown();
				// прячем геометрию
				$(".menuGeometry").css("display", "none");
				// нельзя вставить элементы, и ими манипулировать
				$(".addNewElm, .topMenuBlockManip .menuItem").attr("status", "false");
			// если не вкладка site и есть предыдущий элемент
			} else if (oldType == "site" && Element.prevElm) {
				// выбираем предыдущий элемент
				Element.prevElm.mousedown().mouseup();
				// обнуляем
				Element.prevElm = false;
			}

			// для вкладки struct 
			$(".rightMenuTitleItem").css("display", "none");
			if (type == "struct") {
				$(".rightMenuTitleItem[type='struct']").css("display", "block");
			} else { //если не структура
				$(".rightMenuTitleItem[type='element']").css("display", "block");
				
				var blockStateObj = $(".selectElmState");
				if (type == "style" && !elm.hasClass("site")) {
					blockStateObj.removeClass("displayNone");
				} else {
					blockStateObj.addClass("displayNone");
				}
			}

			return false;
		});
	}

	/**
	* Выбирает вкладку меню
	*
	* @see this.setEventNavMenu()
	*/
	this.setTabMenuRight = function(elmEvent, type)
	{
		//убираем выделение
		$('.rightMenuNavItem').removeAttr('chosen');
		//ставим выделение выбранному элементу
		elmEvent.attr('chosen', 'true');

		//прячем все блоки
		$('.rightMenuContent, .rightMenuFixedProperty').css('display', 'none');
		//показываем выбраный
		$('.rightMenuContent[type="'+type+'"]').css('display', 'block');
		$('.rightMenuFixedProperty[type="'+type+'"]').css('display', 'block');

		// выделяем элемент структуры, что бы скролл стал на место
		if (type == "struct") PageStruct.select(Element.obj);

		// блок с состоянием (hover)
		var displayState = type == "style" ? "block" : "none";
		$(".blockTypeState").css("display", displayState);
	}
/***********************************************************************************************/
	/**
	* Сворачивание списка меню
	*
	* @see 	setEventMenu()listElementsButClose
	*/
	this.setEventListElements = function()
	{
		// сворачивание || разворачивание панели
		$('.butAddElement').off('mousedown');
		$('.butAddElement').on('mousedown', function() {
			Editor.turnListElements($(this));
			return false;
		});
			
		// закрытие
		$('.listElementsButClose').off('mousedown');
		$('.listElementsButClose').on('mousedown', function() {
			Editor.hideListElements($(this));
			return false;
		});

		// сворачивание || разворачивание секции
		$('.elementsBlockLabel ').off('mousedown');
		$('.elementsBlockLabel ').on('mousedown', function() {
			Editor.turnListElementsSection($(this));
			return false;
		});
	}		
/***********************************************************************************************/
	/** 
	* Сворачивание секции меню
	*
	* @see 	this.setEvent()
	*/
	this.setEventTurnSectionMenu = function() 
	{
		$('.menuStyleName').off('mousedown');
		$('.menuStyleName').on('mousedown', function() {		
			var elm = $(this).closest('.menuOneStyle').find('.menuStyleBlock');
			//сворачиваем
			if (elm.css('display') == 'block') {
				elm.css('display', 'none');
				$(this).find(".menuStyleNameButton").text('+');
			//разворачиваем
			} else {
				elm.css('display', 'block');
				$(this).find(".menuStyleNameButton").text('-');
			}

			return false;
		});
	}
/*******************************************************************************************/
	/**
	* Изменить экран
	*
	* @see 	this.setEvent() 
	*/
	this.setEventEditScreen = function()
	{
		var obj = this;
		var listBut = $(".butShowItem, .butShowItemH");
		
		listBut.off("mousedown");
		listBut.on("mousedown", function() {
			var elmEvent = $(this);
			var elm = Element.obj;
			if (elmEvent.attr("chosen") == "true") return false;//выбран
			
			var screenType = elmEvent.attr("screen");

			// отмечаем
			listBut.removeAttr("chosen");
			listBut.filter("[screen='"+screenType+"']").attr("chosen", "true");

			// изменяем тип экрана
			$(".contentItem, .contentWrap").attr("screen", screenType);
			Editor.screen = screenType;
			
			//ставим static 
			Element.setStateStatic();
			// ставим стили
			StyleMenu.set();
			
			// ставим позицию линейки
			Editor.setScale();
			// ставим размер
			Resize.setSize();

			// убираем модальное в правом меню
			MenuListItem.hideModal();
			// ставим значение display для мобильной панели
			ElementNavPanelMobile.setDisplayScreen();
		});
	}
/***************************************************************************************/
	/**
	* Режим просмотра
	*
	*
	*/
	/**
	* Переключение режимов просмотра
	* 
	* @see 		this.setEvent()
	*/
	this.setEventModeShow = function()
	{
		var obj = this;

		//режим просмотра
		$('.topMenuFastShow').off('mousedown');
		$('.topMenuFastShow').on('mousedown', function() {		
			Editor.modeShow();
		});

		//режим редактирования
		$('.butModeEdit').off('mousedown');
		$('.butModeEdit').on('mousedown', function() {
			Editor.modeEdit();
		});
		 
	}

	/**
	* Режим работы
	*
	*
	* @see 	this.setEvent()
	**/
	this.setEventModeWork = function()
	{
		var butObj = $(".butChosenMode");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var modeType = $(this).attr("data-type");
			Editor.setModeWork(modeType);
		});
	}
	
/**********************************************************************************************/
	/**
	* Сброс
	*
	* @see 	this.setEvent()
	*/
	this.setEventReset = function()
	{
		var listElm = $(".menuItem, .rightMenuNavItem");
		listElm.off("mouseup");
		listElm.on("mouseup", function() {
			Editor.resetFocus();
		});

		// нажатие colorPicker
		// $(".colorpickerField").off("mouseup");
		// $(".colorpickerField").on("mouseup", function() {
		// 	Editor.closeSelect();
		// });
		
		// нажатие select
		$(".selectBlockButton").off("mouseup");
		$(".selectBlockButton").on("mouseup", function() {
			Editor.closeColorPicker();
		});
	}
/*************************************************************************************************/
	/**
	* Переключение вкладок
	*
	*
	* @see 	this.setEvent()
	* @see 	History.set()
	*/
	this.setEventTab = function()
	{
		var obj = this;
		var contentItem = $(".contentItem");
		var contentPage = $(".contentItemPage");
		var contentModal = $(".contentModal:first");
		var contentWrapObj = $(".contentWrap:first");

		$(".topPanelNavItem").off("mousedown");
		$(".topPanelNavItem").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("chosen")) return false;
			var type = elmEvent.attr("type");

			if (type == "modal") { 
				// фиксируем скролл полотна
				obj.scrollTopPageCanvas = contentWrapObj.scrollTop();
				contentWrapObj.scrollTop(0);
			} else {
				ManagerModal.fix();
			}
			
			// отмечаем закладку
			$(".topPanelNavItem").removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// фиксируем
			// Site.fix();

			// убираем экраны
			contentItem.css("display", "none");

			// для модального окна
			if (type == "modal") {
				contentModal.css("display", "block");

				Element.prevElm = Element.obj;
				// фиксируем выбраный элемент
				$(".elementSelected").attr("is-selected", "true");
				// ставим в модальное окно
				ManagerModal.setInCanvas();
			} else {
				contentPage.css("display", "block")

				// отмечаем элемент
				$(".element[is-selected='true']")
					.removeAttr("is-selected")
					.removeClass("elementSelected").mousedown().mouseup();
			}

			// ставим события
			PageStruct.build();
			
			// ставим
			Editor.setScale();
			// сбрасываем
			History.reset();

			Editor.setPropertyPageModal(type);

			// ставим скролл полотна
			if (type != "modal") {
				contentWrapObj.scrollTop(obj.scrollTopPageCanvas);
			}

			return false;
		});
	}
/******************************************************************************************/
	/**
	* Кнопка просмотр
	*
	* @see 	this.setEvent()
	*/
	this.setEventButFullShow = function()
	{
		$(".butFullShow").off("mousedown");
		$(".butFullShow").on("mousedown", function(){
			// если не сохранен
			if (!Site.isSaveStatus()) Site.save();

			var currentPageIndex = Data.page.page_id//Page.getCurrentPageIndex();
			var butShow = $(this);
			var butShowHref = butShow.attr("href").trim().replace(/&page=[0-9]+$/gim, '');
			butShowHref = butShowHref + "&page="+currentPageIndex;
			butShow.attr("href", butShowHref);
		});
	}

/****************************************************************************/

	/**
	* Показ линейки
	*
	* @see 	this.setEvent()
	*/
	this.setEventVisibleRuler = function()
	{
		var butRullerV = $(".butVisibleRuler");
		butRullerV.off("mousedown");
		butRullerV.on("mousedown", function(){
			var elmEvent = $(this);
			var isVisible = elmEvent.attr("data-visible") == "true" ? false : true;
			if (isVisible) {
				elmEvent.attr("data-visible", "true");
				$(".wrapper").addClass("visibleRuler");
				Data.site.data.visibleRuler = true;
			} else {
				elmEvent.removeAttr("data-visible");
				$(".wrapper").removeClass("visibleRuler");
				Data.site.data.visibleRuler = false;
			}

			Editor.setSize();
			Grid.setPropety();
		});

		if (Data.site.data.visibleRuler) {
			$(".wrapper").addClass("visibleRuler");
			$(".butVisibleRuler").attr("data-visible", "true");
		}
	}
	
/******************************************************************************************/
	/**
	* Кнопка просмотр
	*
	* @see 	this.setEvent()
	*/
	this.setEventExit = function()
	{
		$(window).off("beforeunload");
		$(window).on("beforeunload", function() {
			var msg = Resource.hlp_editor_notification_no_save;
			
			if ($(".topMenuSave").attr("is-save") == "false") return msg;
		});

		$(".logoEditor").off("mousedown");
		$(".logoEditor").on("mousedown", function() {
			var msg = Resource.hlp_editor_notification_no_save;
			
			if ($(".topMenuSave").attr("is-save") == "false") {
				alert(msg);
				return false;
			}
		});
	}

	/**
	* Подробней о типах просмотра
	*
	* @see 	this.setEvent()
	*/
	this.setEventDetailShowType = function()
	{
		var butObj = $(".butDetailShowInfo");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var videoIdV = 'IcGn_tixPww';
			var content = '<iframe allowfullscreen frameborder="0" class="videoDetailShowType" src="http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&autoplay=1" frameborder="0"></iframe>';

			Modal.create({
				"id" : "modalDetailShowType",
				"title" : "Типы просмотра сайта",
				"width" : 500,
				"top" : 50,
				"content" : content,
				"button" : [
					["cancel", "Закрыть"]
				]
			});

			// если просмотренно 10 секунд
			setTimeout(function() {
				if ($("#modalDetailShowType").length) {
					Data.user.showing_tutorial.show_type = true;
					User.save();
				}
			}, 5000);
		});

		// если просмотренна инструкция
		if (!Data.user.showing_tutorial.show_type) {
			$(".modeShowHeaderLeft").attr("data-showing-tutorial", "no");
		}
	}

	/**
	* Настройка страницы
	*
	* @see 	this.setEvent()
	*/
	this.setEventPageSetting = function()
	{
		var butSettingObj = $(".butSettingPage");
		butSettingObj.off("mousedown");
		butSettingObj.on("mousedown", function() {
			PageSetting.showModal();
			return false;
		});
	}

	/**
	* Настройки магазина
	*
	*
	*/
	this.setEventManagerFile = function()
	{
		// это убрать потом
		var butFileObj = $(".topMenu .butManagerFile");
		butFileObj.off("mousedown");
		butFileObj.on("mousedown", function() {
			var filePropertyV = {
				"file_type":"video", 
				"category":"my", 
				"operation":"add",
				"no_chosen":true};
			EditElementImage.edit(filePropertyV);
			
			return false;
		});	
	}

/**********************************************************************************************/
/************************************************************************************************/
	/**
	* Изменение размера экрана
	*
	* @see 	this.setEvent()
	*/
	this.setEventResizeWindow = function() 
	{
		$(window).off("resize");
		$(window).on("resize", function() {
			Editor.setSize();
		});
	}

/*****************************************************************************************************/
}//end class

/**
* работа с сайтом
*
*
*/
var SiteController = new SiteController();
function SiteController() {
	/**
	* Ставим события
	*
	*/
	this.setEvent = function()
	{
		// сохранения сайта
		this.setEventSaveSite();
		// управление страницей
		this.setEventManagerPage();
		// управление модальными окнами
		this.setEventManagerModal();
		// изменение иконки
		this.setEventEditIcon();
		// публикация сайта
		this.setEventPublished();
	}
/***********************************************************************************************/
/***************************************************************************************************/
	/**
	* Сохранение страницы
	*
	* @uses 	this.getQueryString() 	получить строку запроса	
	* @see 		this.setEvent();
	*/
	this.setEventSaveSite = function()
	{
		var obj = this;
		$('.topMenuSave').off('mousedown');
		$('.topMenuSave').on('mousedown', function() {
			//если это элемент с hover
			if (Element.data.is_hover) {
				/**
				* @event 	StyleMenu.toggleHover()
				*/
				$('.rightHoverNavItem[type="static"]').mousedown();
			}
			
			// сохраняем
			Site.save();
		});
	}	
/********************************************************************************************/
	/**
	* Управление страницей
	*
	* @see 	this.setEvent()
	*/
	this.setEventManagerPage = function()
	{
		$(".butSelectPage").off("mousedown");
		$(".butSelectPage").on("mousedown", function() {
			ManagerPage.create();
			return false;
		});
	}

	/**
	* Управление модальным
	*
	* @see 	this.setEvent()
	*/
	this.setEventManagerModal = function()
	{
		$(".butSelectModal").off("mousedown");
		$(".butSelectModal").on("mousedown", function() {
			ManagerModal.create();
			return false;
		});
	}
/*******************************************************************************************/
	/**
	* Иконка сайта
	* 
	* @see 	this.setEvent()
	*/
	this.setEventEditIcon = function()
	{
		$(".memuButEditSiteIcon").off("mousedown");
		$(".memuButEditSiteIcon").on("mousedown", function() {
			// открываем картинок окно
			var params = {"operation":"edit_icon", "src": Data.site.data.icon};
			EditElementImage.edit(params);
		});
	}

/****************************************************************************/
	
	/**
	* Публикация сайта
	*
	* @see 	this.setEvent()
	*/
	this.setEventPublished = function()
	{
		var butObj = $(".butSitePublished");
		butObj.off("click");
		butObj.on("click", function() {
			Site.published($(this));
			return false;
		});
	}

/**************************************************************************************/
}//end class

























/**
* Работа со стилями у элемента
*
*
*/
var ElementStyleController = new ElementStyleController();
function ElementStyleController() {
	/**
	* Отметка не выберать сайт 
	*
	* @set  ElementManController.moveDownSection()
	* @set 	ElementManController.moveUpSection()
	*/
	this.noSelectedSite = false;

/****************************************************************************/
	/**
	* Изменение стиля на полотне
	*
	* @uses 	this.setEventAllocateAll() 	рамка вокруг элементов
	* @uses 	this.setEventMenu() 		события меню
	* @uses 	this.setEventTopMenu()	 	для вверхнего меню
	* @see 		setEvent() 	
	*/
	this.setEvent = function()
	{
		//события в меню
		this.setEventMenu();
	}
/*********************************************************************************************/
/*************************************************************************************************/
/*******************************************************************************************************/
	/**
	* События для полотна
	*
	* @uses 	this.actionBeforeSelected() 	действие над старым до выбора нового элемента	
	* @uses 	this.noteElement() 				выделение элемента
	* @uses 	this.setEventMoveElement()  	перемещение элемента 
	* @uses 	this.actionAfterSelected() 		действие над новым элемнтом	
	* @uses 	obj.is_click 					отмечаем что это клик
	* @see 		SetEvent.newElement()
	*/
	this.setEventCanvas = function()
	{
		var obj = this;
		Data.is_move = true;
		$('.element, .site').off('mousedown');
		$('.element, .site').on('mousedown', function(e) {		
			var elm = $(this);

			// нельзя отметить сайт
			if (obj.noSelectedSite) {
				if (elm.hasClass("site")) obj.noSelectedSite = false;
				return false;
			}

			// если остался атрибут style
			if (Element.obj && Element.obj.attr("style")) {
				ElementCss.setCssByAttrStyle(Element.obj);
			}

			// если в режиме модаль нажимаем на сайт
			if (elm.hasClass("site") && Screen.isModal()) return false;

			// скидуем фокус
			Editor.resetFocus();

			//выделяем элемент, если клик не по выбраному элементу
			if (elm[0] != $('.elementSelected')[0]) {
				//если не первый клик 
				if (Element.data) {
					//дейсвие с текщий элементом до того как выбрали новый
					obj.actionBeforeSelected(elm)
				}
				//отмечаем элемент
				obj.noteElement(elm);

				//дествие над элементом после добавления
				obj.actionAfterSelected(elm);
			}

			//ставим событие перетаскивания элемента если можно
			if (!Element.data.no_move) {
				StyleCanvas.setEventMoveElement(elm, e);
			}	
			
			//что бы не срабатывали родительские элементы
			return false;
		});

		$(".checkbox, .radio").off("click");
		$(".checkbox, .radio").on("click", function() {
			return false;
		});
		
	}
/*************************************************************************************/
	/**
	* Действия над элементом до выбора нового
	*
	* @uses 	EditElementText.hide()			спрятать блок редактирования
	* @see 		this.seyEventCanvas()
	*/
	this.actionBeforeSelected = function(elm)
	{
		// если стоит редактор то убираем его 
		if (TextEditor.isShow()) TextEditor.hide();

		// меню
		if (elm.hasClass("hlp-nav-level")) {

		} else if (elm.hasClass("nav-item")) {
			elm.parent().parent().find("li").removeAttr("data-hlp-nav-open-level");
		} else if (elm.hasClass("nav-item-mobile")) {
			elm.parent().parent().find("li").removeAttr("data-hlp-nav-open-level-mobile");
		} else {
			$("li").removeAttr("data-hlp-nav-open-level").removeAttr("data-hlp-nav-open-level-mobile");
		}
	}
/*************************************************************************************/
	/**
	* Действие над элементам после выделения
	*
	* @uses 	EditElementText.insertTextInRedactor() 	изменить текст в едакторе
	* @uses 	EditElementForm.showPanelManInput() 	манипулирование с input
	* @see 		this.setEventCanvas()
	*/
	this.actionAfterSelected = function(elm)
	{
		//показываем панель манипуляции c input
		if (Element.data.type == 'form_input') {
			EditElementForm.showPanelManInput();
		}

		// ставим значение display
		ElementNavPanelMobile.setDisplaySelect();

		// показываем по меню
		if (elm.hasClass("nav-item")) {
			elm.closest("li").attr("data-hlp-nav-open-level", "true");
		} else if (elm.hasClass("nav-item-mobile")) {
			elm.closest("li").attr("data-hlp-nav-open-level-mobile", "true");
		}
	}
/*************************************************************************************/
	/**
	* Отметить элемент
	*
	* @uses 	Resize.create() 			добавляем блок изменения размера элементу
	* @uses 	Editor.setTitleRightMenu() 		установить название элемента в правом меню
	* @uses 	Editor.setButtonInactive() 		делаем не активными некоторые кнопки
	* @uses 	StyleMenuSet.set() 				устанавливаем стили элемента
	* @uses 	ElementSetting.set() 			устанавливает параметры
	* @see 		this.setEventCanvas()
	*/
	this.noteElement = function(elm)
	{
		//убираем элементы элемента необходимые для его работы
		$('*[is_delete="true"]').remove();
		
		// если открыта вклада сайт и элемент не сайт
		if (!elm.hasClass("site") && $(".rightMenuNavItem[chosen='true']").attr("type") == "site") {
			$(".rightMenuNavItem[type='style']").mousedown();
		}

		//добавляем елементу класс выделения
		this.addClassSelected(elm);
		Element.setData(elm);//устанавливаем данные текущего  элемента
		
		if (!Element.obj) return false;

		//добавляем блок изменения размера
		Resize.create();

		setTimeout(function() {
			//устанавить стили в правой панели
			StyleMenu.set();
		}, 40);

		// убираем статус
		Element.removeState();

		setTimeout(function() {
			// выбираем элемент в структуре
			PageStruct.select(elm);
			PageStruct.buildNested(elm);

			//делаем некоторые кнопки не активными в верхнем меню
			Editor.setMenuButtonInactive();
			//устанавливаем параметры элемента
			ElementSetting.set();
			ElementWidget.set();
		}, 200);
	}

	/**
	* Добавляет класс выделения
	*
	*
	* @see 	this.noteElement()
	*/
	this.addClassSelected = function(elm)
	{
		// ставим класс выделения
		$('.elementSelected').removeClass('elementSelected');
		elm.addClass('elementSelected');

		// ставим атрибут родителям выделения
		var parentElm = elm;
		$(".element").removeAttr("is-parent-selected");
		if (elm.hasClass("section")) return false;
		for (var i = 0; i < 100; i++) {
			parentElm = parentElm.parent().closest(".element");
			parentElm.attr("is-parent-selected", "true");
			if (parentElm.hasClass("section")) break; //ставим до секции
		}
	}
/***************************************************************************************/
/*************************************************************************************/
/**правая панель***************************************************************************/
	/**
	* События
	*
	* @uses 	this.edit() 					изменить стиль
	* @uses 	this.turnBlockBorderRadius()
	* @uses 	this.toggleHover()
	* @uses 	this.toggleTypeFormationGradientColor()
	* @see 		this.setEvent() 		
	*/
	this.setEventMenu = function()
	{
		//изменить стиль
		this.setEventMenuEdit();
		//переключение hover
		this.toggleHover();
		// кнопка сброс стиля
		this.setEventResetStyle();
		// состояние элемента(hover)
		this.setEventElmState();
		// для правой меню
		StyleMenu.setEvent();
		// авто класс
		this.setEventTypeEnterClass();

		// для настроек
		ElementSetting.setEvent();
	};
/**********************************************************************************************/
	/**
	* Изменяем значения стилей
	*
	* @uses 	MenuStyleEdit.edit()
	* @uses 	this.is_click() 		узнаем это клик или нет
	* @see 		this.setEvent() 	
	*/
	this.setEventMenuEdit = function() {
		var obj = this;
		var parent = $(".menuStyle, .selectStyleBasicElmType");

		var listInputV = parent.find('input, .option');
		listInputV.off('change');
		listInputV.on('change', function() {
			obj.edit($(this));
		});

		//кнопки input
		var list = '.valueBgPosition, .menuButValue, input[type="button"]:not(.colorpickerField, input[status="false"])';
		parent.find(list).off('mousedown');
		parent.find(list).on('mousedown', function() {
			var elmEvent = $(this);
			
			// если клик по выбраному элементу, то не срабатывает
			if (elmEvent.attr("chosen")) return false;

			// убираем выделение и отмечаем выбраный элемент
			elmEvent.parent().find('*').removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// изменяем
			obj.edit($(this));

			return false;
		});

		// для стилей текста
		parent.find(".blockValueText .menuButValue").off("mousedown");
		parent.find(".blockValueText .menuButValue").on("mousedown", function(){
			var elmEvent = $(this);
			
			var isChosen = elmEvent.attr("chosen");
			if (isChosen && elmEvent != "undefined") elmEvent.removeAttr("chosen");
			else elmEvent.attr("chosen", "true");

			obj.edit(elmEvent);
			return false;
		});


		//textarea
		parent.find('.menuOneStyle textarea').off('keyup');
		parent.find('.menuOneStyle textarea').on('keyup', function() {
			obj.edit($(this));
		});

		parent.find('.menuPositionSide').off('mousedown');
		parent.find('.menuPositionSide').on('mousedown', function() {
			var elmEvent = $(this);

			$(".menuPositionSide").removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			obj.edit(elmEvent);
		});
	};


	/**
	* Изменить стиль
 	*
 	*
 	* @uses 	MenuStyleEdit.edit()
	* @uses 	this.is_click() 		узнаем это клик или нет
	* @see 	this.setEventMenuEdit()
	*/
	this.edit = function(elmEvent) 
	{
		//изменяем элемент
		StyleMenu.edit(elmEvent);
		
		if (History.isFixedAll) {
			History.isFixed = true;
			return false;
		}

		//фиксируем историю
		if (History.isFixed && !Scroll.isMove) History.record();
		else History.isFixed = true; //если фиксирована ставим в  - fixed
	}
/****************************************************************************/
/***события**********************************************************************/
	/**
	* Перекючение в меню hover у элемента
	* 
	* @uses 	MenuStyle.setStyleHover() -parent
	* @see 		this.setEvent()
	*/
	this.toggleHover = function()
	{
		var obj = this;
		//клик по вкладке переключения
		$('.rightHoverNavItem').off('mousedown');
		$('.rightHoverNavItem').on('mousedown', function() {
			var elmEvent = $(this);
			//выбраный статус 
			var newStatus = elmEvent.attr('type');

			//убираем класс активности
			$('.rightHoverNavItem').removeClass('rightHoverNavItemAct');
			//ставим класс активности
			elmEvent.addClass('rightHoverNavItemAct');

			//заменяем массив с данными на текущие состояние элемента
			Element.data_style = Element.data.style[newStatus]; 
			//ставим стили элементу
			StyleCanvas.setStyleHover($('.elementSelected'), newStatus);

			//ставим стили в правой панели
			StyleMenuSet.set();
		});
	};
/*************************************************************************************************/

	/**
	* Очищает все стили экрана
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventResetStyle = function()
	{
		$(".butResetStyle").off("mousedown");
		$(".butResetStyle").on("mousedown", function() {
			var styleType = $(this).attr("type");
			// сбрасываем стили
			ElementCss.clearAllStyleScreen(styleType);
			// ставим заново стили
			StyleMenu.set();

			if (styleType == "transform") $(".resizeBlock").css("transform", "none");

			return false;
		});		
	}
/********************************************************************************************/
	/**
	* Состояние элемента 
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventElmState = function()
	{
		var listBut = $(".selectElmState");
		listBut.off("change");
		listBut.on("change", function() {
			// if ($(this).attr("no-active")) return false;

			var state = $(this).find("input").attr("val");

			//ставим элемнту состояние 
			Element.setState(state);

			StyleMenu.set();
			ElementSettingFixed.setVisible(Element.obj);
		});
	}

	/**
	* Авто класс
	*
	* @see 	this.setEvent()
	*/
	this.setEventTypeEnterClass = function()
	{
		var enterClassType = Data.site.data.autoclass ? "auto" : "manual";
		this.setTypeEnterClass(enterClassType);

		var obj = this;
		$(".topMenuAutoClass").off("mousedown");		
		$(".topMenuAutoClass").on("mousedown", function() {
			if (Data.site.data.autoclass) {
				var enterClassType = "manual";
				Data.site.data.autoclass = false;
			} else {
				var enterClassType = "auto";
				Data.site.data.autoclass = true;
			}

			obj.setTypeEnterClass(enterClassType);

			// Site.save(true);

			return false;
		});
	}

	/**
	* Устанавливает тип ввода класса
	*
	* @see 	this.setEventTypeEnterClass()
	*/
	this.setTypeEnterClass = function(enterClassType)
	{
		var listProperty = {
			"auto" : {"img" : "autoclass.png", "part_label" : "автоматически"},
			"manual" : {"img" : "autoclass-manual.png", "part_label" : "вручную"},
		}

		var propertyBut = listProperty[enterClassType];
		var labelValue = "Добавлять класс <br/>"+propertyBut.part_label;
		$(".topMenuAutoClass").attr("label", labelValue)
					.attr("src", "/img/editor/top_panel/"+propertyBut.img);
	}

/************************************************************************************************/
/*******************************************************************************************/

}//end class
/**
* Работа с страницей
*
*
*
*/
var PageController = new PageController();
function PageController() {
	/**
	* @var 	int 	id страницы 	
	*/
	this.page_id = '';

	/**
	* @var 	int 	номер варианта 	
	*/
	this.option_number = '';

	/**
	* @var 	html 	страница desctop 	
	*/
	this.html_desctop = '';
	
	/**
	* @var 	html 	страница mobile 	
	*/
	this.html_mobile = '';

	/**
	* @var 	 string 	текущий тип
	*/
	this.curr_type = 'desctop';
/***************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* События 
	*
	* @uses 	this.setEventSavePage() 	сохранение страницы
	* @uses 	this.setEventHistory() 		история
	* @uses 	this.setEventRedactorMode()	режим редактора
	* @see 		setEvent() 	
	*/
	this.setEvent = function()
	{
		//история
		this.setEventHistory();
		//устанавливаем видео в режим простотр
		this.editStateElmVideo($('.redactorPageEdit'));
	}
/************************************************************************************************/
	/**
	* История
	*
	* @uses 	History.next() 	вперед по истории
	* @uses 	History.back() 	назад по истории
	* @see 		this.setEvent()
	*/
	this.setEventHistory = function()
	{
		$('.topMenuBlockHistory .topMenuItem').off('mousedown');
		$('.topMenuBlockHistory .topMenuItem').on('mousedown', function() {
			var elm_event = $(this);
			//если активна кнопка
			if (elm_event.attr('status') != 'false') {
				//выполняем движение по истории
				History[elm_event.attr('type')]();
			}
		});
	} 
/**************************************************************************************************/
/***************************************************************************************************/
/************************************************************************************************/
	
/**********************************************************************************************/

	/**
	* События в режиме просмотр
	*
	* @see 	this.setEventRedactorMode()
	*/
	this.setEventShowMode = function()
	{
		//убираем состояние hover если оно есть у элемента
		StyleCanvas.setStyleHover($('.redactorPageShow .elementSelected'), 'static', 'true');

		var list_elm = '.redactorPageShow .elementWrap[is_hover="true"]';
		$(list_elm).off('mouseover');
		$(list_elm).on('mouseover', function() {	
			StyleCanvas.setStyleHover($(this), 'hover', true);
		});

		$(list_elm).off('mouseout');
		$(list_elm).on('mouseout', function() {
			StyleCanvas.setStyleHover($(this), 'static', true);
		});
	}
/***************************************************************************************************/
/****устанавливаем элементы в режим просмотра и редактирования***********************************************************************************************/
	/** 
	* События в режиме просмотр для элементов video (атрибут autoplay)
	*
	* @param 	obj 		par-родитель элементов
	* @param 	boolean 	status_autoplay - статус автоплея
	*
	* @see 		this.processHtmlAll()
	* @see 		this.setEventRedactorMode()
	* @see 		this.setEvent()
	*/
	this.editStateElmVideo = function(par, status_autoplay)
	{
		//список видео
		var list_elm = par.find('.elementVideo');
		
		var len = list_elm.length;
		for (var i = 0; i < len; i++) {	
			var elm = list_elm.eq(i);
			var id = elm.attr('id');
			
			//получить src	
			var src = EditElementVideo.getSrc(DataElm[id]['param'], status_autoplay);
			//вставить src
			elm.find('.selfVideo').attr('src', src);
		}

	}
/*************************************************************************************/
}//end class






/**
* Работа со настройками элемента
*
*
*/
var ElementSettingController = new ElementSettingController();
function ElementSettingController() {
	/**
	* Установка событий
	*
	*
	* @uses 	this.setEventClickTypeAction() 	тип действия при клике
	*/
	this.setEvent = function()
	{
		//изменение
		this.setEventEdit("menuSetting"); 

		// для виджета
		this.setEventEdit("menuWidget");
		ElementWidget.setEvent();

		//переключения типа - клик по элементу
		this.setEventClickTypeAction();
	}
/***************************************************************************************/
	/**
	* Изменение
	*
	* @see 	this.setEvent()
	* @see 	ElementWidgetSlider.setSlide()
	*/
	this.setEventEdit = function(parentClassV)
	{
		var obj = this;
		var list = $(".menuSettingButValue, ."+parentClassV+" .menuButValue"); //menuButValue
		list.off("mousedown");
		list.on("mousedown", function() {
			var elmEvent = $(this);

			// если клик по выбраной
			if (elmEvent.attr("chosen") == "true" && !elmEvent.attr("toggle")) return false;
			
			// выделяем текущий
			// если все элементы выключатели выключатель
			if (elmEvent.parent().attr("toggle")) {
				if (elmEvent.attr("chosen") == "true") elmEvent.removeAttr("chosen");
				else elmEvent.attr("chosen", "true");
			} else { // если нет
				elmEvent.parent().find(".menuSettingButValue, .menuButValue").removeAttr("chosen");
				elmEvent.attr("chosen", "true");
			}
			
			// значение
			var valueSetting = elmEvent.attr("value");
			// изменяем
			obj.edit(elmEvent, valueSetting);

			return false;
		});


		/***********************************************************/
		var parent = $("."+parentClassV);
		parent.find("input[type='button'], select").off("change");
		parent.find("input[type='button'], select").on("change", function() {
			var elmEvent = $(this);
			var value = elmEvent.attr("val");
			obj.edit(elmEvent, value);
			
			return false;
		});

		parent.find("input[type='text'], textarea").off("change keyup");
		parent.find("input[type='text'], textarea").on("change keyup", function() {
			var elmEvent = $(this);
			obj.edit(elmEvent, value);

			return false;
		});
	}

	/**
	* Изменить
	* 
	* @see this.setEventEdit()
	*/
	this.edit = function(elmEvent, value)
	{
		// Изменяем
		if (elmEvent.closest(".menuWidget").length) {
			ElementWidget.edit(elmEvent, value);
		} else {
			ElementSetting.edit(elmEvent, value);
		}

		// фиксируем историю
		if (elmEvent.hasClass("menuButValue")) elmEvent = elmEvent.parent();
		if (elmEvent.attr(History.attr.no_fixed) != "true")	{
			History.record();
		}
	}

/**********************************************************************************************/
	/**
	* Тип действия при клике по элементу
	*
	*
	*
	*/
	this.setEventClickTypeAction = function()
	{
		var obj = this;
		$('.valueTypeActionClick').off('change');
		$('.valueTypeActionClick').on('change', function() {
			//тип действия
			var type = $(this).val();

			//прячем все блоки
			$('.menuSettingClick .menuSectionParamBlock').css('display', 'none')
				.filter('[type="'+type+'"]').css('display', 'block');//показываем выбраный блок

		});
	}

/********************************************************************************************/
/*******************************************************************************************/
	




/**************************************************************************************************/
/******************************************************************************************************/



























}

















/**
* Добавление новых элементов
*
*
*
*/
var ElementAddController = new ElementAddController();
function ElementAddController() {
	/**
	* @var 	array 	список параметров для функций добавления
	* @see 	this.setEvent()
	*/
	this.list_param_add = {
		'image': {'operation':'add', 'src':'', 'file_type':'img'}
	}

	/**
	* События
	*
	* @uses 	ListAddElement 			список элементов для добавления 		
	* @uses 	ListEditElement 		список элементов для редактирования		
	* @uses		this.list_param_add 	список параметров для функции 
	*/
	this.setEvent = function()
	{
		// добавления элементов
		this.setEventElement();
	}
/*****************************************************************************************/
	/**
	*
	* @see 	this.setEvent()
	*/
	this.setEventElement = function()
	{
		var obj = this;
		$('.elementsItem').off('mousedown');
		$('.elementsItem').on('mousedown', function() {
			var elmEvent = $(this);

			if (elmEvent.attr("no-add")) return false;

			//если активна
			var type = elmEvent.attr('type');
			var operation = elmEvent.attr('operation');

			//создаем сразу
			if (operation == 'modal') {
				var params = obj.list_param_add[type];
				if (!params) params = {'operation':'add'};

				//сначала вызываем модальное окно
				ListEditElement[type].edit(params);
			} else {
				var params = {};
				if (type == "column") params["count_column"] = elmEvent.attr("data-count");
				
				//создаем объект
				ListElementObject[type].create(params);
			}
			// сброс фокуса
			Editor.resetFocus();
			return false;
		});
	}
	


/**************************************************************************************/
}//end class














/**
* Манипулирование элементом(удаление, копирование)
*
*
*
*/
var ElementManController = new ElementManController();
function ElementManController() {
	/**
	* События
	*
	* @uses 	ElementMan.*() 	манипуляция с элементом
	* @see 		setEvent() 		
	*/
	this.setEvent = function()
	{	
		this.setEventStandart();
		this.setEventModeSimple();
	}

	/**
	* Сиандартные
	*
	* @see 	this.setEvent()
	*/
	this.setEventStandart = function()
	{
		var listBut = $('.butElementMan, .butDeleteSimpleBlock');
		listBut.off('mousedown');
		listBut.on('mousedown', function() {
			if ($(this).attr("data-no-active")) return false;
			
			var elm_event = $(this);
			var elm = Element.obj;
			var type = elm_event.attr('type');

			var errorNoMan = Resource.hlp_manipulation_notification_no;
			if (!Element.isManipulation(elm, type)) {
				Notification.error(errorNoMan);
				return false;
			} else if (elm.attr("data-property-no-manipulation") == "true" && type != 'insert') {
				Notification.error(errorNoMan);
				return false;
			} else if (Element.data.only_delete && (type == 'cut' || type == 'copy')) {
				return false;
			} else {
				ElementMan[type]();

				//если не копирование, то фиксируем историю
				if (type != 'copy' && type != 'delete') {
					History.record();
				}
			}
		});
	}

/*************************************************************************************/
	
	/**
	* Для упращеного режима
	*
	* @see 	this.setEvent()
	*/
	this.setEventModeSimple = function()
	{
		this.setEventModeSimpleMove();
	}

	/**
	* Перемещение
	*
	* @see 	this.setEventModeSimple()
	*/
	this.setEventModeSimpleMove = function()
	{
		var butObj = $(".butPrevSimpleBlock, .butNextSimpleBlock, .butMoveSection");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var butEvent = $(this);
			if (butEvent.attr("data-no-active")) return false;
			var operationType = butEvent.hasClass("butPrevSimpleBlock") 
									|| butEvent.hasClass("butMoveUpSection") 
										? "prev" : "next";

			var elm = Element.obj;
			var elmHtml = ElementMan.getHtmlElmAll(elm, true); 

			if (operationType == "prev") {
				var prevElm = elm.prev();
				if (!prevElm || !prevElm.length) return false;
				elm.remove();
				prevElm.before(elmHtml);
				var newElm = prevElm.prev();
			} else {
				var nextElm = elm.next();
				elm.remove();
				nextElm.after(elmHtml);
				
				if (!nextElm || !nextElm.length) return false;
				var newElm = nextElm.next();
			}

			Input.newCanvas();
			Element.obj = newElm;
			Resize.create();

			StyleCanvas.setScrollTopElm(newElm);

			// если колонка
			if (Element.isColumn(newElm)) {
				ElementSettingGrid.setColumnNoIndent();
			}

			// история
			History.record();

			return false;
		});
	}
	

/********************************************************************************************/
/***********************************************************************************************/
	/**
	* События для секции
	*
	* @see 	Resize.create()
	*/
	this.setEventForSection = function()
	{
		// ставим статус для кнопок секции
		this.setStatusButForSection();

		// ставим событие
		var obj = this;
		var listButObj = $(".butAddedItemSection, .butMoveDownSection, .butMoveUpSection");
		listButObj.off("mousedown");
		listButObj.on("mousedown", function() {
			var elmEvent = $(this);
			var status = elmEvent.attr("status");
			// кнопка активная
			if (status != "false") {
				var type = elmEvent.attr("type");
				// запускаем функцию
				var nameFunc = type+"Section";
				obj[nameFunc]();
			}
		});
	}

	/**
	* Удаление секции
	* @see 	this.setEventForSection()
	*/
	this.deleteSection = function()
	{
		var elm = Element.obj;
		var elmNext = elm.next();
		if (!elmNext.length) elmNext = elm.prev();

		$(".topMenuDelete").mousedown();

		setTimeout(function() { elmNext.mousedown().mouseup(); }, 10);
	}

	/**
	* Копирование секции
	* @see 	this.setEventForSection()
	*/
	this.copySection = function()
	{
		$(".topMenuCopy").mousedown();
		$(".topMenuInsert").mousedown();

		setTimeout(function() { Element.obj.next().mousedown().mouseup(); }, 10);
	}

	/**
	* Перемещение вниз секции
	* @see 	this.setEventForSection()
	*/
	this.moveDownSection = function()
	{
		// вырезаем
		ElementMan.cut();
		// вставляем
		ElementMan.insert("after");
		// ставим отметку что нельзя выбирать сайт
		ElementStyleController.noSelectedSite = true;
	}

	/**
	* Перемещение вверх секции
	* @see 	this.setEventForSection()
	*/
	this.moveUpSection = function()
	{
		// данные
		var elm = Element.obj;
		var elmBefore = elm.prev();
		var block = ElementMan.insertElmInBuffer();

		// удаляем
		elm.remove();

		// вставляем 
		elmBefore.before(block);
		Input.newCanvas();
		var newElm = $(".section[status='new']").removeAttr("status");
		StyleCanvas.setScrollTopElm(newElm); // ставим scroll  на полотне
		setTimeout(function() { newElm.mousedown().mouseup(); }, 10);
	}
/*******************************************************************************************/
	/**
	* Устанавливает статус для кпопок секции
	*
	* @see 	this.setEventForSection()
	*/
	this.setStatusButForSection = function()
	{
		var selectedElm = Element.obj;

		// секция первая
		if (this.isFirstSection(selectedElm)) {
			$(".butMoveUpSection").attr("status", "false");
		 
		} 
		//последняя секция
		if (this.isLastSection(selectedElm)) {
			$(".butMoveDownSection").attr("status", "false");
		}
	}

	/**
	* Узнает первая секция или нет
	* @see 	this.setStatusButForSection()
	*/
	this.isFirstSection = function(elm) 
	{
		var res = elm.prev().hasClass("section");
		if (res) return false;	
		else return true;
	}

	/**
	* Узнает последяняя секция или нет
	* @see 	this.setStatusButForSection()
	* @see 	this.moveUpSection()
	*/
	this.isLastSection = function(elm) 
	{
		var res = elm.next().hasClass("section");
		if (res) return false;	
		else return true;
	}

/**********************************************************************************/	
/**для элементов*****************************************************************************************/
	




/***********************************************************************************/

}//end class
























/**
* Изменение элемента
*
*
*
*/
var ElementEditController = new ElementEditController();
function ElementEditController() {
	/**
	* События - изменить
	*
	* @see 	Resize.create();
	*/
	this.setEvent = function()
	{
		//кнопка вправом меню
		this.setEventButMenu();
		//двойной клик по элементу
		this.setEventDblclick();
	}
/************************************************************************************/
/***изменение элемента********************************************************************************/
	/**
	* Устанавливает событие на кнопку в правом меню
	*
	* @uses 	this.edit()
	* @see 		this.setEvent()
	*/
	this.setEventButMenu = function()
	{
		var obj = this;
		//кнопка изменить в правом меню
		var butObj = $('.rightMenuTopButton, .butEditSimpleBlock');
		butObj.off('mousedown');
		butObj.on('mousedown', function() {
			//изменить
			obj.edit();
		});
	}


	/**
	* При двойном клике
	*
	* @uses 	this.edit()
	* @see 		this.setEvent()
	*/
	this.setEventDblclick = function()
	{
		var obj = this;
		$('.element').off('dblclick');
		$('.element').on('dblclick', function() {
			//если его можно изменить
			if (Element.data.is_edit 
					&& Element.obj.attr("data-property-no-edit") != "true") {
			
				//изменить
				obj.edit();
			}
			return false;
		});
	}
/**********************************************************************************/
	/**
	* Список параметров для функции изменения
	*
	* @see 	this.edit()
	*/
	this.listParamsForEdit = {
		'image': {'operation':'edit_image', 'src':'', 'file_type':'img'},
		'video': {'operation':'edit'},
	}
	
	/**
	* Изменить элемент
	*
	* @uses 	ListEditElement 		список объектов 	
	* @uses 	this.listParamsForEdit 	список параметров
	* @see 		this.setEventButMenu(), this.setEventDblclick()
	*/
	this.edit = function()
	{
		var type = Element.data.edit_type;
		if (!type) type = Element.data.type;
		
		// параметры
		var params = this.getParamsForEdit(type);

		//запускаем функцию
		ListEditElement[type].edit(params);
	}
/***************************************************************************************/
	/**
	* Отдает параметры
	* @see 	this.edit()
	*/
	this.getParamsForEdit = function(type)
	{
		var params = this.listParamsForEdit[type];
		if (!params) params = {};
		
		var childImgObjV = Element.obj.find(" > img");
		if (Element.obj.hasClass("image") || Element.data.edit_type == "image") {
			var elm = Element.obj.find("img");
			if (!elm.length) elm = Element.obj;
			params["src"] = elm.attr("src");
		} else if (childImgObjV.length) {
			params["src"] = childImgObjV.attr("src");
		}


		if (!params["operation"]) {
			if (Element.data.edit_type == "image") {
				params["operation"] = "edit_image";
				params["file_type"] = "img";
			} else {
				params["operation"] = "edit";
			}
		}

		return params;
	}


/*************************************************************************************/
}//end class













/**
* Выбор страницы
*
*
*/
var ManagerBasic = new ManagerBasic();
function ManagerBasic() {
	this.emptyBlockLabel = '';
	this.noDeleteLast = false;

/******************************************************************************************/	
	/**
	* Выбор страницы
	*
	* @see SiteController.setEventSelectPage();
	*/
	this.create = function()
	{
		// ставим параметры
		this.setProperty();
		// список элементов
		var block = this.getListItems();
		block += this.getBlockEmpty();


		// создаем модальное окно
		Modal.create({
			"width":this.width,
			"top":50,
			"id":"modalManagerElement",
			"title":this.title,
			"content":block,
			"button":[
				["add", this.buttonName]
			]
		});

		Tip.setEvent();

		// ставим события
		this.setEventModal();
		// ставим значение пустому блоку 
		this.setDisplayEmptyBlock(); 
		// действия после создания
		this.actionAfterCreate();

		// убираем нажатие enter
		$(document).off("keydown");

		SpecialInput.setEventOnlyEng();
	}

	// действий после создания
	this.actionAfterCreate = function() {};

	/**
	* Блок для модального окна выбор страницы
	*
	* @see 	this.setEventSelectPage()
	*/
	this.getListItems = function()
	{
		var block = '<div id="selectPagelist" type="'+this.type+'">';

		for (var index in this.listItem) {
			var page = this.listItem[index];
			if (page) block += this.getOneItem(page);
		}

		block += '</div>';

		return block;
	}

	/**
	* Отдает один блок
	*
	*
	*/
	this.getOneItem = function(params)
	{
		var pageId = params["page_id"];
		if (!pageId) pageId = params["id"];
		var statusChosen = params["url_name"] == "index" ? "true" : "false";
		
		var selected = pageId == this.getSelectedId() ? "selected='selected'" : "";
		var isManipulationV = true;

		var pageNameV = params["name"];
		if (this.type == "page") {
			var inputBlock = '<input type="text" only-eng="true" class="selectPageName" value="'+pageNameV+'"/>';
		} else {
			var inputBlock = '<input type="text" class="selectPageName" value="'+params["name"]+'"/>';
		}

		if (Page.isTypeMain(pageNameV)) {
			var blockManipulaction = '';
			inputBlock = '<div class="selectPageNameNoChanged">'+pageNameV+'</div>';
		} else {
			var blockManipulaction = '\
				<div class="selectPageBlockManage">\
					<div class="selectPageManageItem butSelectPageDelete">'+Resource.main_modal_but_delete+'</div>\
					<div class="selectPageManageItem butSelectPageCopy">'+Resource.main_modal_but_copy+'</div>\
				</div>'; 
		}

		var block = '\
				<div class="selectPageItem" page="'+pageId+'" '+selected+'>\
					<div class="selectPageImg" is-image="true"></div>\
					'+inputBlock+'\
					'+blockManipulaction+'\
					<div class="clear"></div>\
				</div>\
			';

		return block;
	}

	/**
	* Отдает id страницы
	* 
	* @see this.changeEditPageName()
	*/
	this.getId = function(elm) 
	{
		return elm.closest(".selectPageItem").attr("page");
	}


	/**
	* Отдает выбраные id
	*
	* @see 	this.getOneItem()
	*/
	this.getSelectedId = function() {};

	/**
	* Отдает элемент - выбора страница
	* 
	* @see this.setEventDeletePage();
	*/
	this.getElement = function(elm)
	{
		return elm.closest(".selectPageItem");
	}

	/**
	* Отдает id выбраного элемента 
	*
	* @see 	ManagerModal.deleteElm()
	*/
	this.getCurId = function()
	{
		return this.getIdElm($(".selectPageItem[selected='selected']"));
	}

	/**
	* Отдает id выбраного элемента 
	*
	* @see 	ManagerModal.deleteElm()
	*/
	this.getFirstId = function()
	{
		return this.getIdElm($(".selectPageItem:first"));
	}

	/**
	* Отдает id элемента
	*
	* @see 	this.getCurId()
	* @see 	this.getFirstId()
	*/
	this.getIdElm = function(elmObj)
	{
		return elmObj.attr("page");
	}

/************************************************************************************************/
	/**
	* Отдает пустой блок
	*
	* @see 	this.create()
	*/
	this.getBlockEmpty = function()
	{
		var block = '<div class="emptyModalBlock">'+this.emptyBlockLabel+'</div>';

		return block;
	}

	/**
	* Ставит значение display пустому блоку
	*
	* @see 	this.create()
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.setDisplayEmptyBlock = function()
	{
		var display = $(".selectPageItem").length ? "none" : "block";
		$(".emptyModalBlock").css("display", display);
	}
/***********************************************************************************************/
	/**
	* События для модального окна - выбор страницы
	*
	* @see 	this.create()
	* @see 	Rate.setCountPage()
	*/
	this.setEventModal = function()
	{
		// выбрать страницу
		this.setEventChoosePage();
		// изменить имя
		this.setEventEdinPageName();
		// удалить
		this.setEventDeletePage();
		// копировать
		this.setEventCopyPage();
		// создать новый
		this.setEventAddElm();

		// выбор домашней страницы
		// this.setEventChooseHome();
	}

	/**
	* Выбор домашней страницы 
	*
	* @see 	this.setEventModal()
	*/
	this.setEventChooseHome = function() {};

/***********************************************************************************************/
	/**
	* Выбор страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventChoosePage = function()
	{
		var obj = this;
		$(".selectPageItem").off("click");
		$(".selectPageItem").on("click", function() {
			if (!obj.clickName) {
				// Modal.createLoading("Заменяю элемент");

				// переходим
				obj.chosenItem($(this));

				// ставим scroll на вверх
				StyleCanvas.setScrollTopElm();

				// setTimeout(function() {
				// 	// сохраняем
				// 	Site.fix();
				// }, 1000);
				Modal.delete();

				// ставим значение, для модального
				Editor.setPropertyPageModal(obj.type);
			}
		});

		// что бы работал input
		var inputNameObj = $("input.selectPageName");
		inputNameObj.off("click");
		inputNameObj.on("click", function() {
			return false;
		})
	}

	/**
	* Выбор страницу
	*
	* @see 	this.setEventChoosePage()
	*/	
	this.chosenItem = function(elmEvent) {
		if (elmEvent.attr("selected") == "selected") return false;
		
		// отмечаем страницу
		$(".selectPageItem").removeAttr("selected");
		elmEvent.attr("selected", "selected");
	};
/***************************************************************************************/
	/**
	* Изменить имя страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventEdinPageName = function()
	{
		var obj = this;
		$(".selectPageName").off("focus");
		$(".selectPageName").on("focus", function() {
			var elmEvent = $(this);
			var oldName = elmEvent.val();

			// событие теряет фокус
			obj.changeEditPageName(elmEvent, oldName);
		});
	}

	/**
	* Потеря фокуса для поля имя страницы
	*
	* @see 	this.setEventEdinPageName()
	*/
	this.changeEditPageName = function(elmEvent, oldName)
	{
		var obj = this;
		// теряет фокус
		$(".selectPageName").off("change focusout");
		$(".selectPageName").on("change focusout", function() {
 			var newName = elmEvent.val().trim();
 			// если имя небыло изменено 
 			if (newName == oldName) { return false;}

			// если имя пустое
			if (!newName || Page.isTypeMain(newName)) { 
				elmEvent.val(oldName);
				return false;
			}

			if (obj.type == "page") {
				newName = newName.replace(/\s+/gim, '_');
				elmEvent.val(newName);
			}

			var isExistName = obj.isExistName(newName, elmEvent);
			if (isExistName) {
				elmEvent.val(oldName);

				var labelError = Resource.hlp_manager_page_name_exists;
				Notification.error(labelError);
				return false;
			}

			// изменяем имя в массиве
			var editPageId = obj.getId(elmEvent);
			obj.editName(newName, editPageId);
			// ставим список страниц в select
			obj.setSelectListItem();

			// if (obj.type == "page") {
			// 	Page.editAbtestName(editPageId, newName);
			// }
			Site.setSaveNo();
			
			// сохраняем страницу
			Site.fix();
		});
	}


	/**
	* Проверяет существование имени
	*
	* @see 	this.changeEditPageName()
	* @see 	ManagerPage.getNewName()
	*/
	this.isExistName = function(itemName, elmEvent)
	{
		return $(".selectPageName[value='"+itemName+"']").not(elmEvent).length;
	}
/***************************************************************************************/
	/**
	* Удаление страницы
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventDeletePage = function()
	{
		var obj = this;
		$(".butSelectPageDelete").off("click");
		$(".butSelectPageDelete").on("click", function() {
			// последнию страницу удалить нельзя
			if ($(".selectPageItem").length == 1 && obj.noDeleteLast) {
				Notification.error(Resource.hlp_manager_page_no_last_delete);
				return false;
			}

			var elmEvent = $(this);
			// подтверждение удаления
			var nameDelElmV = elmEvent.closest(".selectPageItem").find(".selectPageName").val();
			var labelConfirmatinonV = "Подтвердите удаление <b>"+nameDelElmV+"</b>";
			Modal.confirmationDelete(labelConfirmatinonV, function() {
				obj.confirmationDeletePage(elmEvent);
			});

			return false;
		});
	}

	/**
	* Подверждение удаления 
	*
	* @see 	this.setEventDeletePage()
	*/
	this.confirmationDeletePage = function(elmEvent)
	{
		var deletedPageId = this.getId(elmEvent);
		var modalItemObj = $(".selectPageItem[page='"+deletedPageId+"']");

		// удаляем элемент
		this.deleteElm(deletedPageId, elmEvent);
		// убираем с модального окна
		modalItemObj.remove();
		// сохраняем страницу
		Site.fix();
		// ставим значение display
		this.setDisplayEmptyBlock();

		var obj = this;
		// ставим список страниц в select
		setTimeout(function() { 
			obj.setSelectListItem();
		}, 500);

		this.actionAfterDelete();
	}

	this.actionAfterDelete = function() {}
 	
 	// ставим кнопку home
	this.setHomePageByDelete = function() {};
/*********************************************************************************************/
	/**
	* Дублировать страницу
	*
	* @see this.setEventModalSelectPage()
	*/
	this.setEventCopyPage = function()
	{
		var obj = this;
		$(".butSelectPageCopy").off("click");
		$(".butSelectPageCopy").on("click", function() {
			var elmEvent = $(this);
			var pageId = obj.getId(elmEvent);

			// добавляем новую страницу в список, отдвет id имя
			obj.addNewPageInList(pageId);
			// перезагружает список 
			obj.reloadListElm();
			// ставим список
			obj.setSelectListItem();

			return false;
		});
	}

	/**
	*  Добавляем скопированые элемент
	* 
	* @see 	this.setEventCopyPage()
	*/
	this.addNewPageInList = function(pageId) {};

	/**
	* Отдает id  новой страницы
	*
	* @see 	this.addNewPageInList()
	*/
	this.getNewPageId = function() {
		var newId = "_";
		for (var iNew = 0; iNew < 300; iNew++) {
			newId += "1";
			if (!Data.listPages[newId]) return newId;
		}
	} 
/********************************************************************************************/
	/**
	* Добывить новый элемент
	*
	* 
	* @see 	this.setEvent()
	*/
	this.setEventAddElm = function()
	{
		var obj = this;
		$("#modalManagerElement .butAdd").off("click");
		$("#modalManagerElement .butAdd").on("click", function() {
			Modal.createLoading(Resource.hlp_manager_page_load_start_create);
			// добавляем
			obj.addNewElm();
			// перегружаем окно
			// obj.reloadListElm();
			// ставим список страниц в select
			obj.setSelectListItem();

			if (obj.type == "modal") return false;

			setTimeout(function() {
				Modal.delete();
				Notification.ok(Resource.hlp_manager_page_load_finish_create);
			}, 1000);
		});
	}

	/**
	* Добавляет новый элемент
	*
	* @see 	this.setEventAddElm()
	*/
	this.addNewElm = function() {};
/******************************************************************************************/
	/**
	* Изменяем id  у списка страниц
	*
	* @see 	Site.save()
	*/
	this.editListPagesId = function(listId)
	{
		for (var oldId in listId) {
			var newId = listId[oldId];

			// добавляем новый
			Data.listPages[newId] = copyArray(Data.listPages[oldId]);
			Data.listPages[newId]["page_id"] = newId; //меняем id
			
			// удаляем старый
			delete Data.listPages[oldId];
			
			// ставим в html
			$(".selectPageItem[page='"+oldId+"']").attr("page", newId);
		}

		// ставим список страниц в select
		this.setSelectListItem();
	}
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	* @see 	EditorController.setEvent()
	* @see 	this.editListPagesId()
	* @see 	this.setEventConfirmationDeletePage()
	* @see 	this.changeEditPageName()
	* @see 	this.setEventCopyPage()
	*/
	this.setSelectListItem = function() {};

	/**
	* Перезагружает список элементов
	*
	* @see 	this.setEventCopyPage()
	*/
	this.reloadListElm = function()
	{
		// закрываем и открываем, что бы появилась новая страница в списке
		Modal.delete();

		if (this.type == "page") $(".butSelectPage").mousedown();
		else $(".butSelectModal").mousedown();
	}
/************************************************************************************************/



/*******************************************************************************************/
} //end class











/**
* Базовый элемент - изменение
*
* @parent 	Element
* @child 	EditElementImage
*
*/
var EditElementBasic = new EditElementBasic();
function EditElementBasic() {

}//end class















/**
* Работа не посредствено 
* с самим элементом (добавление, удаление, копирование и тд.)
*
* @parent 	Element 		
* @child 	ElementBasic  	базовый класс для самих элементов 
* @child 	ElementMan  	манипуляция с элементами 	
*
*/
var ElementSelf = new ElementSelf();
function ElementSelf() {
	/** 
	* @var 	string 	тип элемента 
	* @set 	ElementMan.copy(), ElementCut.copy()
	*/
	this.type = '';
/****************************************************************************/
	/**
	* Вставляет элемент на страницу
	*
	* @param 	html 	block - html элемента
	* @param 	string 	type - тип элемента
	*
	* @see 		ElementBasic.createElement()-child, ElementMan.insert()-child
	*/
	this.insertElement = function(block, type, typeInsert)
	{
		// ставим экран desktop
		Screen.setDesktop();

		// если сайт
		if (Element.obj.hasClass("site")) {
			var prevElm = Element.prevElm;
			if (!prevElm) prevElm = $(".section:first");
			Element.setData(prevElm);
			Element.prevElm = false;
		}

		var elm = Element.obj;

		if (elm.hasClass("nav-item")) elm = elm.closest(".nav");
		else if (elm.hasClass("nav-item-mobile")) elm = elm.closest(".nav-mobile");
		else if (elm.hasClass("text-span")) elm = elm.parent().closest(".element");
		else if (elm.hasClass("hlp-li") && type != "hlp-li") elm = elm.closest(".hlp-ul, .hlp-ol");
		else if (elm.hasClass("slider")) elm = ElementWidgetSlider.getCurItem(elm);
		else if (elm.hasClass("hlp-tabs")) elm = ElementWidgetTabs.getCurItem(elm);
		else if (elm.hasClass("hlp-comparison-image")) elm = elm.closest(".hlp-comparison");

		var isBefore = typeInsert == "before" ? true : false;
		var isAfter = typeInsert == "after" ? true : false;
		var isFirst = typeInsert == "first" ? true : false;

		if ( (elm.hasClass("hlp-ul") || elm.hasClass("hlp-ol")) && type != "hlp-li") {
			isAfter = true;
		}

		var insertAfterParentSelector = Element.data.insert_after_parent_selector;

		if (type == 'section') { 
			this.insertElementSection(elm, block, isBefore, isAfter);

		} else if (elm.closest(".hlp-upload-file-wrap").length) {
			elm.closest(".hlp-upload-file-wrap").after(block);
			
		} else if (insertAfterParentSelector) {
			elm.closest(insertAfterParentSelector).after(block);
		} else if (type == 'nav-item' && Element.data.type == "nav-item") {
			Element.obj.after(block);
		} else if (type == 'nav-item' && Element.data.type == "nav") {
			elm.append(block);
		} else if (Element.data.type == "column" || Element.data.only_insert) {
			elm.append(block);
		
		} else if (isAfter) {// вставляем после элемента
			elm.closest(".element").after(block);
			
		} else if (isFirst) {//первым элементом
			if (Element.data.type == "section") elm = elm.find(".section-content");
			elm.prepend(block);
		
		} else if (this.isNotInsertInForm(elm, type)) {
			elm.closest("form").after(block);
			
		} else if (Element.data.is_insert) {
			this.insertElementInside(elm, block);
		// стандартный
		} else {
			this.insertElementAfter(elm, block);
		}
		
		//ставим события для элемента на полотне
		this.setEvent();

		// ставим линейку если изменилась высота
		Scale.setPosition();
	};

	/**
	* Нельзя вставить в форму
	*
	* @see 	this.insertElement()
	*/
	this.isNotInsertInForm = function(elm, type)
	{
		if (elm.closest("form").length 
				&& (type == "form"
					|| type.match(/nav/gim)
					|| type == "map"
					|| type == "video" )
				) {
			return true;
		} else {
			false;
		}
	}
/*********************************************************************************************/
	/**
	* Вставляем секцию
	* @see this.insertElement()
	*/
	this.insertElementSection = function(elmSelected, block, isBefore, isAfter)
	{
		// элемент frame или нет
		var elmInsert = elmSelected.closest('.section');
		
		if (elmInsert.length) {
			if (isBefore) elmInsert.before(block);
			else elmInsert.after(block);
		} else {
			$(".content .site").prepend(elmInsert);
		}
	}

	/**
	* Вставляем элементы формы
	* @see this.insertElement()
	*/
	this.insertElementItemForm = function(elmSelected, block)
	{
		//вставляем элемент после выбранного элемента
		elmSelected.parent().after(block);
	}

	/**
	* Вставляем внутрь элемента
	*
	* @see this.insertElement()
	*/
	this.insertElementInside = function(elm, block)
	{
		// если секция
		if (elm.hasClass("section")) elm = elm.find(".section-content");
		
		// вставляем
		elm.append(block);
	}

	/**
	* Вставляет элемент после
	*
	* @see 	this.insertElement()
	*/
	this.insertElementAfter = function(elm, block)
	{
		// вставляем элемент
		elm.after(block);
	}
/*********************************************************************************************/
	/**
	* Добавляет ряд если элемент не вмещается
	*
	* @see 	ElementBasic.createElement()
	* @see 	ElementMan.insert()
	*/
	this.isNotFit = function(widthElm, elm)
	{
		if (!Element.obj) return false;
		if (!elm) elm = Element.obj;

		var blockObj = elm.hasClass("block") ? elm : elm.parent();
		var listBrother = Element.getListBrother(blockObj);
		elm = listBrother.filter(":last");
		var floatElm = elm.css("float");

		// если строка и можно изменять размер элемента
		if (blockObj.hasClass("block") && elm.length && floatElm != "none") {

			// получаем
			var params = {};
			params.width = widthElm;
			params.padding_h = Element.getPaddingH(elm);
			params.left_property = "margin-" + floatElm;
			Resize.nextElm = false;
			Resize.setMaxWidth(elm, false, params);

			var widthEmpty = floatElm == "left" ? Resize.maxWidthRight : Resize.maxWidthLeft;
			widthEmpty -= Element.getWidth(elm) - 5;

			if (widthEmpty < widthElm) {
				// если не вмещается один и один потомок, убирам float
				if (listBrother.length == 1) {
					StyleMenuGeometry.setChildrenNoFloat(blockObj);
				} else {
					Element.setData(blockObj);
					return true;
				}
			}
		}
		
		return false;
	}

	/**
	* Отдает пустую ширину
	*
	* @see 	this.isNotFit()
	*/
	this.getEmptyWidth = function(elm)
	{
		if (!elm) elm = Element.obj;
		var width = elm.width();
		var listChild = Element.getListBrother(elm);

		var countChild = listChild.length;
		for (var i = 0; i < countChild; i++) {
			var item = listChild.eq(i);
			width = width - Element.getWidth(item) - parseInt(item.css("margin-left"));
		}

		return width;
	}
/*******************************************************************************************/
	/**
	* Устанавливаем события для элемента
	*
	* @param 	obj 	elm-элемент по кот нужно сымитировать клик
	*
	* @see 		this.insertElement()-child 	
	*/
	this.setEvent = function()
	{
		Input.newCanvas();
	} 	
/********************************************************************************/
	

}//end class




/**
* Базовый элемент
*
* @parent  	ElementSelf  	
* @child 	CreateSection 	
* @child 	CreateBlock 	
*
*/ 
ElementBasic.prototype = ElementSelf;
var ElementBasic = new ElementBasic();
ElementBasic.parent = ElementSelf;
function ElementBasic()  
{
	/**
	* Создает элемент
	* 
	* @param 	array 	дополнительные параметры
	*
	* @see 		ElementAddController.setEvent()
	*/
	this.create = function(params)
	{
		if (!params) params = {};
		this.params = params;

		this.createAction();
	};

	/**
	* Создает элемент
	*
	*
	* @see 	this.create()
	*/
	this.createAction = function()
	{
		Modal.delete();
		
		$(".element, li").removeAttr("status");
		//создаем элемент
		var newElm = this.createElement(this.params);
			
		// добавляем id
		Element.addNewId(newElm);

		// если такой уже есть элемент
		if ($("."+newElm.attr("class-unique")).length > 1) {
			newElm.removeAttr("style");
		}
		
		// ставим у ширины проценты
		this.setUnitMenu();
		// ставим размер
		this.setSize(newElm);
		// стили по умолчанию
		this.setStyleDefault(newElm);
		//станавливаем css
		this.setCssNewElm(newElm);
		// строим структуру
		PageStruct.build();
		//фиксируем историю
		History.record();
			
		// если только создание 
		if (this.params.only_create) return false;

		//если колонки клик по первой
		if (newElm.children().hasClass("column")) newElm = newElm.find(".column:eq(0)");
		newElm.mousedown().mouseup();//эмитируем клик
		
		// ставим scroll  на полотне
		StyleCanvas.setScrollTopElm(newElm);
		// действие после добавления
		this.actionAfter(this.params);
	}

/**********************************************************************************************/

	/**
	* Ставим размер
	*
	* @see 	this.createElement()
	*/
	this.setSize = function(elm)
	{
		if (!elm || !elm.length) return false;

		// если больше родителя
		var elmParent = elm.parent();
		if (elm.hasClass("image")) {
			this.setSizeImage(elm);
		} else if (this.type != "nav-item" && this.type != "button") {
			// var maxWidth = elmParent.width();
			// var width = elm.width();

			// if (width >= maxWidth) {
			// 	StyleUnit.setUnitMenu("width", "100%");
			// 	elm.css("width", "100%");
			// 	ElementCss.set("geometry", elm);
			// }
		}
	}


	this.setSizeImage = function(elm)
	{
		var elmParent = elm.parent();
		
		var imgSelfV = elm.find("> img");
		imgSelfV.css("width", "auto");
		var imgWidthV = imgSelfV.width();
		imgSelfV.removeAttr("style");	

		var imgParentWidthV = elmParent.width() - 5;
		if (imgWidthV > imgParentWidthV) imgWidthV = "100%";
		else imgWidthV += "px";
		
		// var maxWidth = 500;
		// if (imgWidthV > maxWidth) imgWidthV = maxWidth;

		// if (!imgWidthV) imgWidthV = 100;
		// imgWidthV = imgWidthV+"px";

		StyleUnit.setUnitMenu("width", imgWidthV);
		elm.css({"width":imgWidthV});
		ElementCss.set("geometry", elm);
	}
/************************************************************************************************/
	/**
	* Создаем элемент
	*
	* @uses 	this.getElementHtml() 				получить html элемента
	* @uses 	this.insertElement()-ElementSelf 	вставить элемент
	* @uses 	this.setVarDataElm() 				установить в переменую массив данных нового элемента
	* @see 		this.create()
	*/
	this.createElement = function(params)
	{
		//устанавливаем  дополнительные параметры, которые используются
		// обычно в this.getElementHtml()
		var elm = Element.obj;
		this.param = params;

		//получить html элемента
		var block = this.getElementHtml();
		
		var typeInsert = "";
		//если нужно вставить после
		if (params["insert_after"]) var typeInsert = "after";
		//вставить элемент на страницу
		this.insertElement(block, this.type, typeInsert); //стандартная вставка

		//новый элемент
		var newElm = $(".new-element").removeClass("new-element"); 
		// добавляем тип
		if (!newElm.attr("elm-type")) newElm.attr("elm-type", this.type);
		
		// добавляем уникальный класс
		if ( !this.notAddClass && this.class != "column"
				&& !newElm.attr("class-unique") ) {
			this.addClassUnique(newElm);
		}

		newElm = newElm.eq(0);

		return newElm;
	}

	/**
	* Добавляем уникальный класс новому элементу 
	*
	* @see 	this.createElement()
	*/
	this.addClassUnique = function(listNewElm)
	{
		var countElm = listNewElm.length;

		for (var i = 0; i < countElm; i++) {
			var newElm = listNewElm.eq(i);
			if (newElm.attr("class-unique")) continue;

			var uniqueClass = Element.getNewClassUnique(this.class);
			newElm.addClass(uniqueClass).attr("class-unique", uniqueClass);
		}
	}

/***********************************************************************************************/
	/**
	* Стили по умолчанию
	*
	* @see 	this.create() 
	*/
	this.setStyleDefault = function(newElm)
	{
		var elmParentObjV = newElm.parent(); 

		// для ряда
		if (newElm.hasClass("column") || newElm.hasClass("row")) {
			var objRowV = newElm.closest(".row");
			if (objRowV.parent().hasClass("section-content")) {
				var countColV = objRowV.attr("count-column");
				var countColTP = countColV == 2 ? 1 : 2;
				var countColTPClass = "hlp-row-col-"+countColTP+"-tp";
				objRowV.addClass(countColTPClass);
			// если несколько уровней вложености
			} else {
				objRowV.css("margin-top", "0px");
				objRowV.find("> .column").css("margin-bottom", "0px");
			}
		}

		// var width100Per = "100%";
	
		// // потомки колонки
		// if (elmParentObjV.hasClass("column")) {
		// 	if (newElm.hasClass("text") || newElm.hasClass("heading")) {
		// 		newElm.css({"width":width100Per});
		// 	} else if (newElm.hasClass("button")) {
		// 		newElm.css({"margin-top":"25px", "margin-left":"auto", "margin-right":"auto"});
		// 	} else if (newElm.hasClass("image")) {
		// 		newElm.css({"margin-left":"auto", "margin-right":"auto"});
		// 	}
		// }

		// // потомки формы
		// if (elmParentObjV.hasClass("form")) {
		// 	if (newElm.hasClass("text") || newElm.hasClass("heading")) {
		// 		newElm.css({"width":width100Per});
		// 	}
		// }
	}

	/**
	* Ставит стили новым элементам
	*
	*
	* @see 	this.create()
	*/
	this.setCssNewElm = function(newElm)
	{
		var elmClassUnique = newElm.attr("class-unique");
		if ($("."+elmClassUnique).length > 1) {
			var newElmStyle = newElm.attr("style");
			if (newElmStyle) {
				newElmStyle = newElmStyle.replace(/width:[^;]+/gim, '');
				newElm.attr("style", newElmStyle);
			}
		}

		ElementCss.set("geometry", newElm);

		var listChild = newElm.find(".element");
		var countChild = listChild.length;
		for (var i = 0; i < countChild; i++) {
			var elmChildObj = listChild.eq(i);
			ElementCss.set("geometry", elmChildObj);
		}
	}

	/**
	* Ставит unit в меню
	*
	* @see 	create()
	*/
	this.setUnitMenu = function()
	{
		StyleUnit.setAllDefault();
		// if (this.noWidthPersent) StyleUnit.setUnitMenu("width", "px");	
		// else StyleUnit.setUnitMenu("width", "%");
	}
/***************************************************************************************************/
	/**
	* Действия после добавление
	*
	*/
	this.actionAfter = function() {};

	/**
	* Получить html елемента 
	*
	* @return 	html 	элемент
	* 
	* @see 		this.create()
	* @set 		CreateSection, CreateBlock
	*/	
	this.getElementHtml = function() {};

	/**
	* добавляет дополнительный блок
	*
	* @see 	Resize.addBlock()
	*/
	this.addAddedBlock = function() {};


	/**
	* Устанавливает позицию
	*
	* @see 	ElementCanvas.setEventMoveMouseUp()
	* @see 	Resize.addBlock()
	*/
	this.setPositionAddedBlock = function()
	{
		var elm = Element.obj;
		var addedBlockObj = elm.find(".addedBlockModeSimple");

		// если нету дополнитеьного класса
		if (!addedBlockObj.length) return false;
		
		var elmIndex = elm.index(elm.parent().find(".element"));
		var offsetTop = elm.offset().top;

		if (offsetTop < 80 && !elm.hasClass("section")) {
			addedBlockObj.addClass("addedBlockPosBottom");
		} 
		// else if (elm.parent().hasClass("section-content") && elmIndex == 0) {
			// addedBlockObj.addClass("addedBlockPosBottom");
		// } 
		else {
			addedBlockObj.removeClass("addedBlockPosBottom");
		}
	} 

/**************************************************************************************************/
	
	this.isAddThisClass = function(newClass)
	{
		if (this.isInterdictedClass(newClass)) return false;
		else return true;
	}

	/**
	* Запрещеный класс или нет
	*
	* @see 	this.setEventEnterClass()
	* @see 	StyleMenuFixed.editClass(), .setEventAddClass()
	*/
	this.isInterdictedClass = function(newClass)
	{
		var listClass = [
			"element", "element-content", "section-content",
			"head", "site", "page", "wrapper",
			"section", "row", "column", "block", "text", "heading", "button",
			"image", "video", "map", "map-full-width", "embed",
			"modal-section", "modal", "modal-wrap", "new-element", "blackout", 
			"grid", "gridBg", "gridLine", "butAddTemplate", "addedBlock",
			"addedBlockSection", "listGridLine", "show-element", 
			"fill-vacuum",

			"form", "input", "textarea", "submit", "select", "checkbox", "radio", "label",

			"nav", "nav-item", "nav-button-mobile", "nav-panel-mobile",
			"nav-mobile", "nav-item-mobile",

			"animated", 
			"strip",
		];	
				
		var iClass = 0;		
		for (iClass in listClass) {
			var classItem = listClass[iClass];
			if (newClass == classItem) return true;
		}	

		// как исключение
		if (newClass.match(/^hlp-error-label/gim)) return false;
		else if (newClass.match(/^hlp-error-input/gim)) return false;

		// нельзя
		if (newClass.match(/^hlp-children-float/gim)) return true;
		else if (newClass.match(/^hlp-children-no-float/gim)) return true;
		else if (newClass.match(/^hlp\-/gim)) return true;
		else if (newClass.match(/\-m[lp]$/gim)) return true;
		else if (newClass.match(/\-hover$/gim)) return true;

		// если модальное
		if (Screen.isModal()) {
			if ($(".section ."+newClass).length || $(".section[class~='"+newClass+"']").length) {
				return true;
			}
			if ($(".nav-panel-mobile ."+newClass).length || $(".nav-panel-mobile[class~='"+newClass+"']").length) {
				return true;
			}
		} else {
			if ($("."+newClass).closest(".modal").length || $(".modal[class~='"+newClass+"']").length) {
				return true;
			}
		}
	}


/******************************************************************************/

}//конец класса 

/**
* Список элементов
*
* @parent 	ElementBasic 	
*/

/******************************************************************************************/
/******************************************************************************************/

/**
* Базовый тип
*
*/
ElementBasicTypeSelf.prototype = ElementBasic;
var ElementBasicTypeSelf = new ElementBasicTypeSelf();
ElementBasicTypeSelf.parent = ElementBasic;
function ElementBasicTypeSelf()
{
	this.type = 'basic-type';
	this.class = 'basic-type';
	this.title = {'name':Resource.hlp_element_name_block, 'img':'block.png', 'type':'none'};
	this.css = ["width", "padding", "margin_v", "text", "bg", "border", "boxShadow", "transform"];
	
}// end class

/******************************************************************************************/
/*********************************************************************************************/
/**
* Создание блока
*
*/
ElementBlock.prototype = ElementBasic;
var ElementBlock = new ElementBlock();
ElementBlock.parent = ElementBasic;
function ElementBlock()
{
	this.type = 'block';
	this.class = 'block';
	this.is_insert = true;
	this.resize_width = true;
	this.is_hover = true;
	this.title = {'name':Resource.hlp_element_name_block, 'img':'block.png', 'type':'none'};
	this.css = ["width", "padding", "min-height", "text", "position", "align", "bg", "border", "boxShadow", "filter", "transform", "other"];
	this.setting = ["click"];
	this.widget = ["gallery_modal"];
	this.width = 150;
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element block hlp-wrap" style="width:'+this.width+'px;">\
						</div>';
		return block;
	}
}// end class

/**************************************************************************************************/
/***************************************************************************************************/
/**
* Создание текста
*
*/
ElementHeading.prototype = ElementBasic;
var ElementHeading = new ElementHeading();
ElementHeading.parent = ElementBasic;
function ElementHeading()
{
	this.type = 'heading';
	this.class = 'heading';
	this.is_edit = true;
	this.is_text = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_heading, 'img':'heading.png','type':'heading','but_text':'Изменить'};
	this.css = ["width", "min-height", "position", "padding", "align", "text", "bg", "boxShadow", "textShadow", "border", "transform", "other"];
	this.setting = ["click", "heading"];
	this.width = 500;
/*****************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this::create()
	*/	
	this.getElementHtml = function()
	{
		var elm = Element.obj;
		var elmSecV = elm.closest(".section");
		
		if (!elmSecV.length || elmSecV.find(".heading").length) var numHV = "3";
		else var numHV = "2";

		var block = '	<h'+numHV+' class="new-element element heading" style="width:'+this.width+'px;">\
							<span class="element-added hlp-element-content element-content">\
								'+Resource.hlp_element_name_heading_value+'\
							</span>\
						</h'+numHV+'>';

		return block;
	}
}// end class

/**
* Создание текста
*
*/
ElementText.prototype = ElementBasic;
var ElementText = new ElementText();
ElementText.parent = ElementBasic;
function ElementText()
{
	this.type = 'text';
	this.class = 'text';
	this.is_edit = true;
	this.is_text = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_text, 'img':'text.png', 'type':'text', 'but_text':'Изменить'};
	this.css = ["width", "min-height", "position",  "padding", "align", "text", "bg", "boxShadow", "textShadow", "border", "transform", "other"];
	this.setting = ["click"];
	this.width = 120;
/*******************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this::create()
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element text" style="width:'+this.width+'px;">\
							<span class="element-added hlp-element-content element-content">\
								'+Resource.hlp_element_name_text_value+'\
							</span>\
						</div>';

		return block;
	}
}// end class

/**
* Создание текста
*
*/
ElementTextSpan.prototype = ElementBasic;
var ElementTextSpan = new ElementTextSpan();
ElementTextSpan.parent = ElementBasic;
function ElementTextSpan()
{
	this.type = 'text-span';
	this.class = 'text-span';
	this.is_edit = true;
	this.is_text = true;
	this.title = {'name':Resource.hlp_element_name_text_span, 'img':'span.png', 'type':'none'};
	this.css = ["padding", "margin_h", "text", "bg", "border", "boxShadow", "textShadow"];
	this.setting = ["click"];

	this.no_move = true;
	this.no_resize = true;


	this.createAction = function(newClass)
	{
		if (!newClass) {
			newClass = Element.getNewClassUnique(this.class);
		}

		var uniqueClass = this.params.new_class;
		if (uniqueClass == newClass) return false;

		$("."+uniqueClass).removeClass(uniqueClass)
						.attr("class-unique", newClass)
						.addClass(newClass);

		Modal.delete();
	}
}// end class
/******************************************************************************************/
/***********************************************************************************************/
/**
* Создание кнопки
*
*/
ElementButton.prototype = ElementBasic;
var ElementButton = new ElementButton();
ElementButton.parent = ElementBasic;
function ElementButton()
{
	this.type = 'button';
	this.class = 'button';
	this.is_hover = true;
	this.is_show_text = true;//в панели меню поле с текстом
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_button, 'img':'button.png', 'type':'none'};
	this.css = ["position", "min-height", "width", "padding", "align", "bg", "border", "boxShadow", "textShadow", "text", "transform", "other"];
	this.setting = ["click"];
	this.noWidthPersent = true; //ширина не в процентах
/*****************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this::create()
	*/	
	this.getElementHtml = function()
	{ 
		var block = '	<div class="new-element element hlp-type-button hlp-but button" data-action="page">\
							<div class="element-content hlp-element-content">\
								'+Resource.hlp_element_name_button_value+'\
							</div>\
						</div>';
		return block;
	}
}// end class
/*****************************************************************************************************/
/*********************************************************************************************************/
/**
* Изображение
*
*
*/
ElementImage.prototype = ElementBasic;
var ElementImage = new ElementImage();
ElementImage.parent = ElementBasic;
function ElementImage()
{
	this.type = 'image';
	this.class = 'image';
	this.is_edit = true;
	this.is_hover = true;
	// this.resize_proportion = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_image, 'img':'image.png', 'type':'image', 'but_text':'Изменить'}
	this.css = ["width", "min-height", "position", "padding", "align", "bg", "border", "boxShadow", "transform", "filter", "other"];
	this.setting = ["click", "seo"];
	this.widget = ["gallery_modal"];
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this::create()
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element image hlp-img">\
							<img src="'+this.src+'" alt=""/>\
						</div>';

		return block;
	}

}// end class
/*******************************************************************************************/
/***********************************************************************************************/
/**
* Видео
*
*
*/
ElementVideo.prototype = ElementBasic;
var ElementVideo = new ElementVideo();
ElementVideo.parent = ElementBasic;
function ElementVideo()
{
	this.type = 'video';
	this.class = 'video';
	this.is_edit = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_video, 'img':'video.png', 'type':'video', 'but_text':'Изменить видео'}
	this.css = ["width", "align", "position", "boxShadow", "transform", "border", "other"];
	this.width = 400;

	/**
	* @var 		string 	src видео
	*/
	this.src = '';
/***********************************************************************************************/
/********************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this.create()
	* @uses 	this.getSrc() 	получить src
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element video hlp-video" style="width:'+this.width+'px;">\
							<div class="selfVideoBlackout"></div>\
							<div class="video-wrap hlp-video-wrap">\
								<iframe class="self-video hlp-self-video" src="'+this.src+'" frameborder="0" allowfullscreen></iframe>\
							</div>\
						</div>';
		return block;
	}
/********************************************************************************************/
}// end class


/*******************************************************************************************/
/***********************************************************************************************/
/**
* Список
*
*
*/
ElementListOl.prototype = ElementBasic;
var ElementListOl = new ElementListOl();
ElementListOl.parent = ElementBasic;
function ElementListOl()
{
	this.type = 'hlp-ol';
	this.class = 'hlp-ol';
	this.resize_width = true;
	this.is_insert = true;
	this.title = {'name':Resource.hlp_element_name_list, 'img':'nav-item.png'}
	this.css = ["min-height", "width", "list", "padding", "margin", "align", "bg", "text", "boxShadow", "transform", "border", "other"];
	this.width = 400;

	this.getElementHtml = function()
	{
		var block = '	<ol class="new-element element hlp-ol" style="width:'+this.width+'px;padding-left:20px;">\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 1</li>\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 2</li>\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 3</li>\
						</ol>';
		return block;
	}

}// end class

ElementListUl.prototype = ElementBasic;
var ElementListUl = new ElementListUl();
ElementListUl.parent = ElementBasic;
function ElementListUl()
{
	this.type = 'hlp-ul';
	this.class = 'hlp-ul';
	this.is_insert = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_list, 'img':'nav-item.png'}
	this.css = ["min-height", "width", "list", "padding", "margin", "align", "bg", "text", "boxShadow", "transform", "border", "other"];
	this.width = 400;

	this.getElementHtml = function()
	{
		var block = '	<ul class="new-element element hlp-ul" style="width:'+this.width+'px;">\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 1</li>\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 2</li>\
							<li class="element hlp-li" elm-type="hlp-li">'+Resource.hlp_element_name_list_value+' 3</li>\
						</ul>';
		return block;
	}

}// end class

ElementListLi.prototype = ElementBasic;
var ElementListLi = new ElementListLi();
ElementListLi.parent = ElementBasic;
function ElementListLi()
{
	this.type = 'hlp-li';
	this.class = 'hlp-li';
	this.is_edit = true;
	// this.resize_width = true;
	this.no_resize = true;
	this.no_move = true;
	this.title = {'name':Resource.hlp_element_name_list, 'img':'nav-item.png'}
	this.css = ["padding", "margin", "list", "text", "bg", "boxShadow", "transform", "border", "other"];
	this.width = 400;

	this.getElementHtml = function()
	{
		var block = '<li class="new-element element hlp-li" elm-type="hlp-li">Новый маркер</li>';
		return block;
	}

}// end class

var ElementSite = new ElementSite();
function ElementSite() {
	this.type = "site";
	this.class = "site";
	this.no_move = true;
	this.no_resize = true;
	this.no_manipulation = true;
	this.no_edit_class = true;
	this.title = {'name':Resource.hlp_element_name_site, 'img':'page.png', 'type':'none'};
	this.css = ["text"];
} 
/*****************************************************************************************/
/****************************************************************************************/
/**
* Создание секции
*/
ElementSection.prototype = ElementBasic;
var ElementSection = new ElementSection();
ElementSection.parent = ElementBasic;
function ElementSection() {
	this.type = "section";
	this.class = 'section';
	this.is_insert = true;
	this.no_move = true;
	this.no_resize = true;
	this.is_added_block = true;
	this.noParentModal = true; //не может быть родитель модальное окно
	// this.no_resize = true;
	this.title = {'name':Resource.hlp_element_name_section, 'img':'section.png', 'type':'none'};
	this.css = ["position", "width", "min-height", "padding", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["section"];
	this.widget = ["gallery_modal"];
	
	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var listSection = $(".section");
		var elmNum = Element.getMaxNumberClass(listSection, "data-num");

		//секция
		var block = '	<section class="new-element element section hlp-section" data-num="'+elmNum+'">\
							<div class="element-content hlp-section-content section-content">\
							</div>\
						</section>';
		return block;
	}

	this.actionAfter = function(params)
	{
		Grid.create(true);
	}

	/**
	*
	*
	*
	* @see 	PrivacyPolicy.addPrivacyPolicy()
	*/
	this.addNum = function(elmSecV)
	{
		var listSection = $("."+elmSecV.attr("elm-type"));
		var elmNum = Element.getMaxNumberClass(listSection, "data-num");
		elmSecV.attr("data-num", elmNum);
	}

	this.replaceDublNum = function()
	{
		var listSection = $(".section");
		var countV = listSection.length;

		var listNumV = {};
		for (var iSecV = 0; iSecV < countV; iSecV++) {
			var secObjV = listSection.eq(iSecV);
			var numV = secObjV.attr("data-num");

			// если дубль
			if (listNumV[numV]) {
				this.addNum(secObjV);
				numV = secObjV.attr("data-num");
			}
			
			listNumV[numV] = true;
		}
	}	

}// end class
/*********************************************************************************************/
/****************************************************************************************************/
/**
* Ряд
*/
ElementRow.prototype = ElementBasic;
var ElementRow = new ElementRow();
ElementRow.parent = ElementBasic;

function ElementRow()
{
	this.type = "row";
	this.class = 'row';
	// this.no_move = true;
	// this.no_resize = true;
	// this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_row, 'img':'row.png', 'type':'none'};
	this.css = ["width", "padding", "margin", "align", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["grid"];
	this.widget = ["gallery_modal"];

	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element row hlp-row">\
						</div>';
		return block;
	}

}// end class
/*********************************************************************************************/
/****************************************************************************************************/
/**
* Колонки
*/
ElementColumn.prototype = ElementBasic;
var ElementColumn = new ElementColumn();
ElementColumn.parent = ElementBasic;

function ElementColumn()
{
	this.type = "column";
	this.class = 'column';
	this.no_move = true;
	this.no_resize = true;
	this.is_insert = true;
	// this.notAddClass = true;
	// this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_column, 'img':'columns.png', 'type':'none'};
	this.css = ["margin_v", "padding", "min-height", "floatSide", "text", "bg", "border", "boxShadow", "transform", "other"];
	this.setting = ["grid"];
	this.widget = ["gallery_modal"];
/****************************************************************************************/
	/**
	* Список 
	* @see 	this.getElementHtml()
	* @see 	ElementSettingGrid.editDesctopCount()
	*/
	this.listCount = {
		"2":[6,6],
		"3":[4,4,4],
		"4":[3,3,3,3],
		"5":[3,2,2,2,3],
		"6":[2,2,2,2,2,2],
	} 

	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var elm = Element.obj;
		var type = Element.data.type;
		//выбраное количество колонок
		var countColumn = this.params.count_column;
		if (!countColumn) countColumn = 4;//определенно заранее

		//ставим вкладку настройки
		$(".rightMenuNavItem[type='setting']").mousedown();

		//создаем колонки 
		var listWeight = this.listCount[countColumn];
		var columnClassUnique = Element.getNewClassUnique("column");
		var block = ''; 
		for (var indexWeight in listWeight) {
			var weight = listWeight[indexWeight];

			block += '\
				<div class="new-element element hlp-col column">\
				</div>';
		}

		// если родитель не строка или строка не пустая  
		var rowClassUnique = Element.getNewClassUnique("row");
		block = '<div style="width:100%;" class="element row hlp-row '+rowClassUnique+' hlp-row-col-'+countColumn+'" class-unique="'+rowClassUnique+'" count-column="'+countColumn+'" count-row="1" elm-type="row">'+block+'</div>';

		return block;
	}


	this.actionAfter = function(params)
	{
		var elmColV = Element.getObj();
		var elmRowV = elmColV.parent();
		ElementCss.set(false, elmRowV);
	}

/*****************************************************************************************/
}// end class
/**************************************************************************************************/
/****************************************************************************************************/













/**
* Настройки элемента в правой меню
*
*
*/
var ElementSetting = new ElementSetting();
function ElementSetting() {
	/**
	* Установка параметров элемента в правой панели
	* 
	* @uses 	this.list_func_by_type					список функций
	* @see 		ElementStyleController.noteElement() 	при выборе нового элемента
	*/
	this.set = function() 
	{
		var elm = Element.obj;

		//убираем блоки
		$('.menuSetting .menuOneStyle').css('display', 'none');
		// сбрасываем выделение
		$(".menuSetting *, .rightMenuFixedProperty[type='setting'] .menuSettingButValue")
										.removeAttr("chosen");

		// устанавливаем значение
		var listSetting = Element.data.setting;
		if (!listSetting) listSetting = [];

		// для всех
		if (!elm.hasClass("modal")) {
			listSetting[listSetting.length] = "triger";
		}

		if (!Element.isElmChildForm(elm)) {
			listSetting[listSetting.length] = "export";
		}
		
		// устанавливаем параметры
		for (var indexSetting in listSetting) {
			var setting = this.list[listSetting[indexSetting]];

			// показываем блок
			$('.'+setting["block"]).css("display", "block");
			
			// запускаем функцию установки значения
			var nameFunc = setting.function;
			if (!nameFunc) nameFunc = "set";
			setting.object[nameFunc](elm);
		}

		// фиксированые параметры
		ElementSettingFixed.set(elm);
		// general настройки
		$(".menuSettingGeneral").css("display", "block");
		ElementSettingGeneral.set(elm);

		StyleMenu.setScroll(); 
	}
/*****************************************************************************************************/
	/**
	* Изменить
	*
	* @see 	ElementSettingController.edit() 
	*/
	this.edit = function(elmEvent)
	{
		var elm = Element.obj;
		// настройка
		var setting = elmEvent.attr("setting");
		if (!setting) setting = elmEvent.parent().attr("setting");

		var valueSetting = StyleMenu.getElmValue(elmEvent);

		// запускаем функцию
		this.launchByName(elm, setting, valueSetting, elmEvent);

		//если это scroll то ставим его на позицию нового значения
		if (elmEvent.attr("maxval")) {
			StyleMenu.setScroll(elmEvent); 
		}
	}

	/**
	* Запускаем функцию
	* 
	* @see this.edit()
	*/
	this.launchByName = function(elm, setting, valueSetting, elmEvent)
	{
		var pattern = new RegExp("^(fixed|general|grid|click|heading|text|section|form|seo|export|triger|template)", "gi");
		// название объекта
		var nameObj = pattern.exec(setting)[0];
		 // название функции
		var nameFunc =setting.replace(pattern, '');
		nameFunc = "edit"+nameFunc;
		
		var classObject = this.list[nameObj];
		
		// если нету такого метода
		// if (!classObject["object"][nameFunc]) nameFunc = ListFunct[nameFunc];

		// запускаем
		classObject["object"][nameFunc](elm, valueSetting, elmEvent);
	}

/***************************************************************************************************/
/***************************************************************************************************/
	
	this.setEvent = function()
	{
		ElementSettingGeneral.setEvent();
	}


/***************************************************************************************************/
}//end class



/**
* Стиль в правой меню
*
* @child 	StyleMenuSet
* @child 	StyleMenuEdit
*/
var StyleMenu = new StyleMenu();
/**
* Какие стили доступны определеному элементу
*
* @see this.set()
*/
function StyleMenu() {
	/**
	* Отдает единицу измерения из меню
	*
	* @see 	ElementCss.updateStyle()
	*/	
	this.getUnit = function(property)
	{
		// ElementCss.get

		// return unit;
	}
/********************************************************************************************/
	/**
	* Устанавливаем значения стилей
	*
	* @uses this.listStyleByType 			список доступных стилей по типу
	* @see 	StyleCanvas.selectElement()
	* @see 	this.toggleHover()
	* @see 	ElementStyleController.setEventResetStyle()
	* @see 	EditController.setEventEditScreen()
	* @see 	ElementStyleController.setEventElmState()
	* @see 	StyleMenuGeometry.editPositionType()
	* @see 	StyleMenuFixed.setEventDelete()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StyleMenuGeometry.editFullWidth()
	*/
	this.set = function() 
	{
		// фиксируем положение скролла
		var scrollTop = $(".rightMenuContent").scrollTop();
		// убираем текстовый редактор
		TextEditor.hide();
		//прячем блоки
		this.hideMenuBlock();
		this.showMenuBlock();
		this.clearMenu();//очищаем меню

		// данные
		var type = Element.data.type;// тип	
		//список доступных стилей
		var listStyle = Element.data.css;

		// устанавливаем список стилей
		for (var key in listStyle) {
			var styleType = listStyle[key];
			var style = this.list[styleType]; 

			//показываем блок 
			var blockStyle = $("."+style["block"]);
			blockStyle.css("display", "block");
			
			//устанавливаем стиль
			var elm = this.getElementSelected(styleType);
			// console.log(style["object"][nameFunc])
			var nameFunc = style["function"];
			style["object"][nameFunc](elm);
		}
		
		// если все margin убраны
		if ($(".menuMarginV").css("display") == "none" && $(".menuMarginH").css("display") == "none") {
			$(".menuMargin").css("display", "none");
		}
		
		// анимация
		this.setAnimate(elm);

		// цвет
		this.setMenuColor($(".colorpickerField"));
		//устанавливаем элемент scroll
		this.setScroll();
		// устанавливаем значения в .select
		this.setValueInSelect();
		// ставим фиксированые
		StyleMenuFixed.set(elm);

		// устанавливаем скролл блока где находяться стили
		if (!PageStruct.noSetScrollTop) $(".rightMenuContent").scrollTop(scrollTop);
		
		// если нет в geometry значений
		var geometryChildVisible = $(".menuGeometry .menuStyleItem").filter(function() {
			return $(this).css("display") == "block";
		});
		if (!geometryChildVisible.length) $(".menuGeometry").css("display", "none");
		
		this.setNoWidth(elm);
		this.setNoHeight(elm);

		// для полменю
		if (elm.hasClass("hlp-nav-level-item")) {
			$(".menuFloatSide, .menuMarginH, .menuProportion").css("display", "none");
		}

		// для слайдера
		this.hideMenuBlockForSlider();

		// сам пункт fixed
		StyleMenuGeometry.setVisibleOptionPosFixed(elm);
	};

	this.setAnimate = function(elm)
	{
		if (elm.hasClass("site") || elm.hasClass("section")) {
			var blockAnimateVisible = "none";
		} else {
			var blockAnimateVisible = "block";
			StyleMenuAnimate.set(elm);
		}

		$(".menuStyleAnimate").css("display", blockAnimateVisible);
	}

	this.setNoWidth = function(elm)
	{
		$(".menuWidth").css("display", "block");

		var listInputWidth = $(".inputBlock").filter("[data-style='width'],[data-style='min-width'],[data-style='max-width']");
		if (Element.obj.hasClass("column")) {
			listInputWidth.attr("data-no-activite", "true");
		} else if (Element.obj.hasClass("section") && !Screen.isDesktop()) {
			$(".menuWidth .inputBlock").attr("data-no-activite", "true");
		} else {
			listInputWidth.removeAttr("data-no-activite");
		}
	}

	this.setNoHeight = function(elm)
	{
		$(".menuHeight").css("display", "block");
		$(".menuGeometryPropertyExtendedContent .menuOneParam").css("display", "block");

		var listInputWidth = $(".inputBlock").filter("[data-style='height'],[data-style='min-height'],[data-style='max-height']");
		if (Element.obj.hasClass("video")) {
			listInputWidth.attr("data-no-activite", "true");
			StyleMenuGeometry.setMGMinHeight(elm);
		} else {
			listInputWidth.removeAttr("data-no-activite");
		}

		// убираем параметры высоты
		if (!elm.hasClass("embed") 
				&& !elm.hasClass("block")
				&& !elm.hasClass("text")
				&& !elm.hasClass("heading")
				&& !elm.hasClass("hlp-slider-bullet")
				) {
			$(".menuHeight .inputBlock, .menuMaxHeight .inputBlock").attr("data-no-activite", "true");
		}
	}


	/**
	* Прячем блоки меню
	*
	* @see 	this.set()
	*/
	this.hideMenuBlock = function()
	{
		// прячем все блоки
		$(".menuStyle .menuOneStyle, .menuStyle .menuStyleBlockNone").css("display", "none");
		
		//показываем блок геометрии, но прячем стили внутри него
		// var geometryDisplay = Element.data.type == "site" ? "none" : "block";
		var geometryDisplay = "block";

		$(".menuGeometry").css("display", geometryDisplay);
		$(".menuGeometry .menuStyleItem")
							.css("display", "none");

		// прячем блок width и height
		$(".menuProportion .menuOneParam").css("display", "none");

		// прячем margin вертикальный и горизонтальный
		$(".menuMarginH, .menuMarginV, .menuPaddingH, .menuPaddingV").css("display", "none");
		
	}

	/**
	* Очищаем 
	*
	* @see 	this.set()
	*/
	this.clearMenu = function()
	{
		// убираем все выделения
		$(".menuStyle").find("input[type='button'], .option, .menuButValue").removeAttr("chosen");
		// убираем атрибут
		$(".menuOneStyle").removeAttr("last");
	}


	this.showMenuBlock = function()
	{
		$(".menuStyleItemFullHeight").css("display", "block");
		$(".menuPositionType").css("display", "block");
		$(".settingFormName").css("display", "block");
	}

	this.hideMenuBlockForSlider = function()
	{
		var elmObj = Element.getObj();
		if (elmObj.hasClass("hlp-slider-list-bullets")) {
			$(".menuStyleItemFullHeight").css("display", "none");
		}

		if (elmObj.hasClass("hlp-slider-list-bullets")
				|| elmObj.hasClass("hlp-slider-arrow")) {
			$(".menuPositionType").css("display", "none");
		}

	}

/************************************************************************************************/
	/**
	* Ставит состояние элемента
	*
	* @see 	this.set()
	*/
	this.setStateElm = function(elm)
	{
		return false;
	}

	/**
	* Выбирает кнопку переключателя
	*
	* @see 	StyleCanvas.setEventMoveMouseUp()
	*/
	this.chosenToggleBut = function(elmToggleObj, value)
	{
		elmToggleObj.find(".menuButValue")
					.removeAttr("chosen")
					.filter("[value='"+value+"']")
					.attr("chosen", "true");
	}
	

	
/*****************************************************************************************/
	/**
	* Изменение свойства элемента
	*
	* @param obj 	elm_event-элемента на котором сраюотало событие
	*
	* @uses	this.getElementSelected()-parent 	получить выбраный элемент
	* @uses this.setScroll()-parent 			устанавливает скрол на заданое значение
	* @see 	ElementStyleController.setEventMenuEdit()
	*/
	this.edit = function(elmEvent)
	{
		// закрываем элементы редактора
		Editor.closeSelect();
		
		//значение
		var value = this.getElmValue(elmEvent);

		//класс инпута на котором сработало событие
		var typeStyle = elmEvent.attr("css");
		if (!typeStyle) typeStyle = elmEvent.parent().attr("css");
		if (!typeStyle) return false;
		
		//выбраный элемент
		var className = this.getClassName(typeStyle);
		var nameMethod = this.getMethodName(typeStyle);
		var elm = this.getElementSelected(className, typeStyle);

		//изменяем стиль у элемента
		var className = this.launchByName(elm, value, elmEvent, className, nameMethod);
		
		// переносим стиль в css, если не передвигается скролл
		if (!ElementCss.noSetStyle) {
			var typeCss = this.getTypeCss(className, typeStyle);
			ElementCss.set(typeCss, elm);
		} else {
			ElementCss.noSetStyle = false;
		}
		
/********действия после изменения стиля*********************/
		//если это scroll то ставим его на позицию нового значения
		if (elmEvent.attr("maxval")) {
			this.setScroll(elmEvent); 
		}

		//если этот элемент цвет
		if (elmEvent.attr("color") == "color") {
			//окрашиваем кнопку
			elmEvent.closest(".menuSectionItemColor")
					.find(".colorpickerField")
					.css("background-color", "#"+value);
		}

		// не сохранен
		Site.setSaveNo();
	}

	/**
	* Фиксирует
	*
	* @see 	StyleMenuBg.editImage(), StyleMenuBg.setEventBgImage()
	* @see 	StyleMenuBg.setFullBg()
	* @see 	StyleCanvas.fixedHistoryMove()
	*/
	this.fixed = function(typeCss, elm)
	{
		ElementCss.set(typeCss, elm);
		History.record();
	}

	/**
	* Отдает значение элемента
	*
	* @see 	this.edit()
	* @see 	ElementSetting.edit()
	*/
	this.getElmValue = function(elmEvent)
	{
		var value = elmEvent.attr("val"); //для не стандарного элеммента
		if (!value) value = elmEvent.val();
		if (!value) value = elmEvent.attr("value");
		
		var maxVal = elmEvent.attr("maxval");
		var minVal = parseFloat(elmEvent.attr("minval"))*(-1);

		// положительное число
		var minValPositive = elmEvent.attr("minval-positive");
		if (minValPositive) minVal = minValPositive;

		// если есть максимальное значение или минимальное
		if (maxVal || minVal) {
			value = parseFloat(value);
			if (maxVal && maxVal < value) value = maxVal;
			if (minVal && minVal > value) value = minVal;

			elmEvent.val(value);
		}
		
		if (elmEvent.attr("only-integer") && value.toString().match(/[^0-9]+/gim)) {
			value = parseFloat(value);
			if (!value) value = 0;

			elmEvent.val(value);
		}

		return value;
	}

	/**
	* Запускает функию определенного класса по имени
	*
	* @see 	this.edit()
	* @see 	this.valueBgColorPicker()
	*/
	this.launchByName = function(elm, value, elmEvent, className, nameMethod)
	{
		//если открыт редактор, закрываем его
		TextEditor.hide();
		
		// запускаем
		var classObject = this.list[className]["object"];
		// если нету такого метода
		// if (!classObject[nameMethod]) nameMethod = ListFunct[nameMethod];
		classObject[nameMethod](elm, value, elmEvent);

		return className;
	} 

	this.pattern = new RegExp("^(fixed|geometry|list|bg|border|boxShadow|textShadow|transform|text|other|seo|page_setting|animate|filter)", "i");

	/**
	* Отдает имя класса
	*
	* @see 	this.launchByName()
	* @see 	this.setVariablesColorPicker()
	*/
	this.getClassName = function(name)
	{
		return this.pattern.exec(name)[0]; // имя объекта
	}
	
	/**
	* Отдает имя метода
	*
	* @see 	this.launchByName()
	*/
	this.getMethodName = function(name)
	{
		var nameMethod = name.replace(this.pattern, ''); // имя функции
		return "edit"+nameMethod;
	}

	/**
	* Отдает тип css
	*
	* @see 	this.edit()
	*/
	this.getTypeCss = function(className, typeStyle)
	{
		if (	// text
				typeStyle == "textAlign"
				|| typeStyle == "textSize"
				|| typeStyle == "textLineHeight"
				// bg
				|| typeStyle == "bgSize"
				|| typeStyle == "bgPosition"
				|| typeStyle == "bgPositionSide"
				// border
				|| typeStyle == "borderTop" || typeStyle == "borderBottom"
				|| typeStyle == "borderLeft" || typeStyle == "borderRight"
				) {
			return "geometry";
		} else if (typeStyle == "geometryPositionType"
					|| typeStyle == "geometryPositionSide"
					|| typeStyle == "geometryFloatSide"
					// || typeStyle == "borderRadiusAll"
					) {
			return '';
		} else if (className == "geometry") {
			return "geometry";
		} else if (className == "bg" 
					|| className == "border" 
					|| className == "transform"
					|| className == "boxShadow"
					|| className == "text"
					|| typeStyle == "textColor"
					|| typeStyle == "textBg") {
			return "style";
		} else {
			return '';
		}
	}

/**************************************************************************************/
/***вспомогательные функции***********************************************************************************/
	/**
	* Устанавливает переменые необходимые для работы colorPicker
	* в в начале работы
	*
	* @see 	ElementStyleController().setEventBgColor()
	*/
	this.setVariablesColorPicker = function(elmEvent) 
	{
		StyleMenu.elmEventPickerBut = elmEvent;
		this.isColorTextEditor = elmEvent.closest(".textRedactor").length;

		if (!elmEvent.attr("css") && !this.isColorTextEditor) {
			elmEvent = elmEvent.prev().find("input");
		}
		StyleMenu.elmEventPickerField = elmEvent;

		var name = elmEvent.attr("css");
		if (!name) return false;
		this.nameStyle = name;
		this.className = this.getClassName(name);		
		this.methodName = this.getMethodName(name);
	}
	
	/**
	* Изменяет цвет или градиент элемента, при mousemove
	*
	* @see 	colorpicker.change()
	*/
	this.valueBgColorPicker = function(color) {
		var color = Color.getHexRGB(color);
		var butEvent = this.elmEventPickerBut;
		
		//ставим статус что цвет изменен 
		this.isChangeMenuColor = true;

		// окрашиваем кнопку
		butEvent.val(color).css("background-color", "#"+color);
		this.elmEventPickerField.val(color);

		// если не м
		if (this.isColorTextEditor) return false;
			
		elm = this.getElementSelected("bg", "color");
		if (!Element.getState()) {
			elm = Element.getAllObject(elm, true);	
		}

		this.launchByName(elm, color, butEvent, this.className, this.methodName);
	}

	/**
	* Фиксируем цвет элемента, при событие mouseup
	*
	* @see 	colorpicker.upHue(), colorpicker.upSelector()
	*/
	this.colorPickerChange = function()
	{
		// if (!this.isChangeMenuColor) return false;
		// эмитируем событие изменения цвета и его фиксации
		// this.elmEventPickerField.change();
		if (!this.elmEventPickerField) return false;

		this.edit(this.elmEventPickerField);
		// this.isChangeMenuColor = false;
	}

	/**
	* Сброс объекта
	*
	* @see 	Editor.resetFocus();
	*/
	this.resetObjColorPicker = function()
	{
		this.elmEventPickerField = false;
	}
/****************************************************************************************/
	/**
	*  Устанавливает цвет в меню
	*
	* @param 	obj 	par_elm - родительсктй элемент
	* @param 	string 	color - цвет
	* 
	* @uses 	this.getColorFromRgba() 	получить цвет из rgba
	* @see 		this.set()-child
	* @see 		StyleMenuBg.edtGradient()-child
	* @see 		StyleMenuBg.editType()
	* @see 		EditElementText.setValInMenu()
	* @see 	StyleMenuBg.set()
	*/
	this.setMenuColor = function(listElm)
	{	
		var len = listElm.length;
		for (var i = 0; i < len; i++) {
			var elm_input = listElm.eq(i);
			//родительский элемент
			var elm_field = elm_input.closest(".menuStyleItemValue")
										.find(".colorpickerField");
			
			//цвет
			var color_hex = Color.getHexRGB(elm_field.val());

			//окрашиваем кнопку в цвет элемента и вставляем значени
			elm_field.css("background-color", "#"+color_hex)
				.val(color_hex);//ставим кнопке значение

			//пошещяем в input цвет элемента
			elm_input.val(color_hex);
		}		
	}

	/**
	* Установить позицию скрола взависимости от значения
	*
	* @param 	string 		scroll_input - скролл
	* 
	* @see 	this.set()
	* @see 	StyleMenuBg.set()
	* @see 	StyleMenuBg.editColor(), .setTypeVideo()
	* @see 	ElementSetting.edit()
	*/
	this.setScroll = function(list_input)
	{
		if (!list_input) list_input = $(".scrollBlock input");

		for (var i = 0; list_input.eq(i).length; i++) {
			var scroll_input = list_input.eq(i);
			var value = parseFloat(scroll_input.val());
			if (value == "auto") {
				this.setScrollBut(scroll_input, 0);
				continue;
			}

			var maxval = parseInt(scroll_input.attr("maxval"));
			var minval = parseInt(scroll_input.attr("minval"));
			if (!minval) minval = 0;
			var n = maxval + minval;

			//если в input больше чем в maxval, то ставим в input maxval
			if (value >= maxval) {
				scroll_input.val(maxval);
				value = n;
			} else if (value < minval * (-1)) {
				value = 0;
			} else {
				value = minval + value;
			} 

			var width = scroll_input.closest(".scrollBlock").find(".scroll").width() - 10;
			var step = width / n;
			var move = value * step;

			//устанавливаем скролл
			this.setScrollBut(scroll_input, move);
			// ставим значение
			if (scroll_input.val() != "auto") {
				scroll_input.val(value - minval);
			}
		}
	}

	this.setScrollBut = function(scrollInput, value) 
	{
		scrollInput.closest(".scrollBlock").find(".scrollButton").css("left", value+"px");
	}

	/**
	* Отдает элемент для изменения
	*
	* @see 		edit(), set(), valueBgColorPicker()
	* @see 	EditElementImage.save()
	* @see 	EditElementImage.manipAllBgOther()
	*/
	this.getElementSelected = function(classType, typeStyle) 
	{
		var elmSelected = Element.obj;

		return elmSelected;
	}
/**************************************************************************************/
	/**
	* Ставит значения в .select 
	* @see 	this.set()
	*/
	this.setValueInSelect = function() 
	{
		var listSelect = $(".select");

		var countSelect = listSelect.length;
		for (var indexSelect = 0; indexSelect < countSelect; indexSelect++) {
			var select = listSelect.eq(indexSelect);
			var valueSelectedOption = select.find(".option[chosen='true']").text();
			
			if (valueSelectedOption) 
				select.find("input[type='button']").val(valueSelectedOption);
		}
	}

/*************************************************************************************/
	/**
	* Очищяет число от текста и округляем его
	*
	*/
	this.clearNumber = function(num)
	{
		if (num) {
			num = num.toString();
			var new_num = num.replace(/(\.[0-9]+$)|px/ig, "");
			//округляем в большую сторону если больше чем половина
			if (parseInt(new_num) + parseInt(0.5) < num) {
				new_num++;
			}
			return new_num;
		} else {
			return 0;
		}
	};
/************************************************************************************************/
/***отдает поля*******************************************************************************************/
	/*
	* отдает top
	*
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	*/
	this.getInputTop = function(side)
	{
		if (StylePosition.isStatic()) return $(".valueMarginTop");
		else if (side == "bottom")  return $(".valuePositionBottom");
		else return $(".valuePositionTop");
	}


	/*
	* отдает left
	*
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	*/
	this.getInputLeft = function(side)
	{
		if (StylePosition.isStatic()) return $(".valueMarginLeft");
		else if (side == "right")  return $(".valuePositionRight");
		else return $(".valuePositionLeft");
	} 

	/*
	* ширина
	*
	* @see 	Resize.setEvent()
	*/
	this.getInputWidth = function()
	{
		return $(".valueWidth");
	} 

	/*
	* высота
	*
	* @see 	Resize.setEvent()
	*/
	this.getInputHeight = function()
	{
		return $(".valueHeight");
	} 
/********************************************************************************************/
/*****************************************************************************************/
	/**
	* Ставит события для меню
	*
	*
	* @see 	ElementStyleController.setEventMenu()
	*/
	this.setEvent = function()
	{
		// для фона
		StyleMenuBg.setEvent();
		// текст
		StyleMenuText.setEvent();
		// рамка
		StyleMenuBorder.setEvent();
		// фиксированые
		StyleMenuFixed.setEvent();

		StyleMenuGeometry.setEvent();
		StyleMenuTransform.setEvent();


		var obj = this;
		var inputObjV = $(".menuStyle .inputBlock input");
		inputObjV.off("focus");
		inputObjV.on("focus", function() {
			obj.menuInputValue = $(this).val();
		});

		inputObjV.off("focusout");
		inputObjV.on("focusout", function() {
			if (obj.menuInputValue != $(this).val()) {
				History.record();
			}
		});
	}

/********************************************************************************************/
/*****************************************************************************************/
	
	/**
	* Сворачивает блок geometry
	*
	* @see 	Input.init()
	*/
	this.blockGeometryHide = function()
	{
		var blockGeomV = $(".menuGeometry");
		blockGeomV.find(".menuStyleBlock").css("display", "none");
		blockGeomV.find(".menuStyleNameButton").text("+");
	}
	

/************************************************************************************************/
}//end class
/**
* Виджет юазовый для списка
*
*
*/

var ElementWidgetBasicList = new ElementWidgetBasicList();
function ElementWidgetBasicList() {
	this.attr = {};
	this.attr.item_index = "data-hlp-index";

	this.class = {};
	this.class.input_list = "";
	this.class.but_add = "";
	this.class.but_delete = "";
	this.class.list_item = "";

	this.selector = {};
	this.selector.list = "";
	this.selector.add = false;


	this.setList = function(elm)
	{
		var slideBlockV = '';
		var listSlideV = elm.find(this.selector.list);
		var countSlide = listSlideV.length;

		for (var iSlide = 0; iSlide < countSlide; iSlide++) {
			var elmItemV = listSlideV.eq(iSlide);
			var dataIndexV = elmItemV.attr(this.attr.item_index);
			slideBlockV += '<div class="menuButValue menuButValueText" value="'+dataIndexV+'"><span>'+dataIndexV+'</span></div>';
		}

		var selectObjV = $("."+this.class.input_list);
		selectObjV.html(slideBlockV);

		var curSlideObj = listSlideV.filter("[data-hlp-chosen='true']");
		var curSlideIndex = curSlideObj.attr(this.attr.item_index);

		StyleMenu.chosenToggleBut(selectObjV, curSlideIndex);
		ElementSettingController.setEventEdit("menuWidget");
	}

	/**
	* Выбор текущего
	*
	* @see 	menu
	* @see 	this.editCurSlide()
	*/ 
	this.editCurSlide = function(elm, value)
	{
		var listItemV = this.getListItem(elm);
		listItemV.removeAttr("data-hlp-chosen");
		listItemV.filter("["+this.attr.item_index+"='"+value+"']")
					.attr("data-hlp-chosen", "true");

		// отмечаем в select
		StyleMenu.chosenToggleBut($("."+this.class.input_list), value);
	}

/************************************************************************************/
/************************************************************************************/

	/**
	* Отдает слайдер который сейчас виден
	*
	* @see 	ElementSelf.insertElement()
	* @see 	this.deleteSlide()
	* @see 	ElementMan.insertElmInBuffer()
	*/
	this.getCurItem = function(elm)
	{
		var listSliderItemV = this.getListItem(elm);
		var curSliderObjV = listSliderItemV.filter("[data-hlp-chosen='true']");
		if (!curSliderObjV.length) curSliderObjV = listSliderItemV.first(); 
		
		return curSliderObjV;
	}

	/**
	* Отдает список слайдов
	*
	* @see 	this.getCurSliderItem()
	* @see 	this.deleteSlide()
	* @see 	this.getCurItem()
	* @see 	this.addSlide()
	*/
	this.getListItem = function(elm)
	{
		if (!elm) elm = Element.obj;
		return elm.find(this.selector.list);
	}


/************************************************************************************/
/************************************************************************************/
	
	/**
	* События
	*
	* @see 	ElementWidget.setEvent()
	*/
	this.setEvent = function()
	{
		// добавление слайда
		this.setEventAdd();
		// удаление слайда
		this.setEventDelete();
	}

	/**
	* Добавление слада
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var butObj = $("."+this.class.but_add);
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.addItem();
		});
	}

	/**
	* Добавление слайда
	*
	* @see 	this.setEventAdd()
	*/
	this.addItem = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listItemBeforeAddV = this.getListItem(elm);
		var countItemV = listItemBeforeAddV.last().attr(this.attr.item_index);
		if (!countItemV) countItemV = 0;
		var itemIndexV = parseInt(countItemV)  + 1;

		// добавляем
		var oldElmV = this.getCurItem(elm);
		var elmContentV = oldElmV.html();

		var newSlideBlockV = '<div '+this.attr.item_index+'="'+itemIndexV+'" class="'+this.class.list_item+'">'+elmContentV+'</div>';
		var elmContent = elm;
		if (this.selector.add) elmContent = elmContent.find(this.selector.add);
		elmContent.append(newSlideBlockV);

		// ставим слайды в меню
		this.setList(elm);
		
		// выбираем текущий
		var listItemV = this.getListItem(elm);
		var lastIndexV = listItemV.last().attr(this.attr.item_index);
		this.editCurSlide(elm, lastIndexV);

		// 
		Element.addNewId(this.getCurItem(elm), true);
		Input.newCanvas();
	}
		
	/**
	* Удаление слада
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		var butObj = $("."+this.class.but_delete);
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите удаление текущего элемента", function() {
				obj.delete();
			})
		});
	}

	/**
	* Удаление слайда
	*
	* @see 	this.setEventDelete()
	*/
	this.delete = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listItemV = this.getListItem(elm);
		if (listItemV.length == 1) {
			Notification.error("Должен быть минимум 1 элемент");
			return false;
		}

		var curSlideObjV = this.getCurItem(elm);
		curSlideObjV.remove();

		var listSliderItemV = this.getListItem(elm);
		listSliderItemV.first().attr("data-hlp-chosen", "true");


		var countItems = listSliderItemV.length;
		for (var iItem = 0; iItem < countItems; iItem++) {
			listSliderItemV.eq(iItem).attr(this.attr.item_index, (iItem+1));
		}

		// ставим слайды в меню
		this.setList(elm);
	}


/************************************************************************************/

} // end class	
/**
* Работа с данными пользователя, растпространяется на все сайты
*
*/
var User = new User();
function User() {
	/**
	* Сохранение данных
	*
	* @see 	TemplateSection.setEventButAddFolder()
	* @see 	TemplateSection.setEventEditNameFolder()
	* @see 	TemplateSection.setEventDeleteFolder()
	* @see 	Editor.setModeWork()
	* @see 	StyleFont.fixedChange()
	* @see 	StyleFont.setEventAddLink()
	* @see 	EditorController.setEventDetailShowType()
	*/	
	this.save = function()
	{
		var user = JSON.stringify(Data.user);	
		$.post('/editor/saveUserData', {"user":user}, function(res, status) {
			res = res.trim();
		});	
	}


}//end class

/**
* Данные системы
*
* Просмотр в редакторе 
* Отдельный просмотр
* 
* На отдачу (у нас)
*
*
*/
var Data = new Data();
function Data() {
	/**
	* @see 	ElementMan.setParCutElm()
	* @see 	StyleMenuEdit.gradient()
	*/
	this.siteElement;
	this.optionElement;
	// this.listSiteUrl;

	this.isAddAbtest = false;

	/**
	* @see 	Site.insert()
	*
	*/
	this.site;

	/**
	* @see 	SelectPage.focusoutEditPageName()
	* @see 	SelectPage.setEventDeletePage()
	* @see  SelectPage.addNewPageInList()
	* @see 	Site.getPageData()
	* @see 	Page.replace()
	* @see 	Page.getNewPageId()
	* @see 	SelectPage.editListPagesId()
	*/
	this.listPages;
/**************************************************************************************/
	/**
	* Узнает массив или нет
	*
	* @see 	Page.setFullPage(), Site.set()
	* @see 	User.setData()
	*/
	this.isArray = function(array)
	{
		if (!(array instanceof Object) || array.length >= 0) return false;
		else return true;
	}
/******************************************************************************************/
	/**
	* Устанавливает данные
	*
	* @see Input.init() 	
	*/
	this.set = function(params)
	{
		// данные пользователя
		this.setDataUser();

		this.siteName = $("#siteName").text().trim();
		// this.listSiteUrl = params['listSiteUrl'];
	}

	/**
	* Ставит данные пользователя
	*
	* @see this.set()
	*/
	this.setDataUser = function()
	{
		var list = $("#jsonUserData").html();
		$("#jsonUserData").remove();
		
		// if (list && list != "undefined") this.user = JSON.parse(list));
		if (list && list != "undefined") this.user = JSON.parse(unescape(list));
		
		if (!this.isArray(this.user)) {
			this.user = {};
			this.user.count_save_site = 0;

			this.user.list_template = {};
			this.user.last_template_id = 0;
			this.user.folder_template = {
				"1" : {"id" : "1", "name" : "first"}
			};
		}
				
		// список просмотренных инструкций
		if (!this.user.showing_tutorial) {
			this.user.showing_tutorial = {};
		}


		this.userId = $("#userId").text();
	}

	/**
	* Для longreads
	*
	* @see 	Site.set()
	*/
	this.setPropertyLongreads = function()
	{
		// if (Site.isTypeLongreads()) {
		// 	this.user.autoclass = true;
		// 	this.user.mode_simple = true;
		// 	$(".wrapper").addClass("modeLongreads");
		// }
	}

/*************************************************************************************/
	/**
	* Добавляет список стандартных фонов
	*
	* @see 	this.setDataUser()
	*/
	this.addListStdFont = function()
	{
		var fontOne = "<link href='https://fonts.googleapis.com/css?family=Jura&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontTwo = "<link href='https://fonts.googleapis.com/css?family=PT+Sans+Narrow&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontThree = "<link href='https://fonts.googleapis.com/css?family=Comfortaa&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontFour = "<link href='https://fonts.googleapis.com/css?family=Cousine&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
	}


/****************************************************************************************/
}//end class


































/**
* Тариф
*
*/
var Rate = new Rate();
function Rate() {
	this.data = {};

	this.limitationProperty = {
		"editor_pro" : {
			"func_text" : "getLimitedTextModePro"
		},
		"count_page" : {
			"func_text" : "getLimitedTextCountPage"
		},
		"count_template" : {
			"func_text" : "getLimitedTextCountTemplate"
		}
	}


/************************************************************************************/	

	/**
	*  Инициализация
	* 
	* @see 	Input.init()
	*/
	this.init = function()
	{
		var dataJsonObj = $("#rateInfo");
		this.data = JSON.parse(dataJsonObj.html());
		dataJsonObj.remove();
	}

	/**
	* Количество страниц
	*
	* @see 	ManagerPage.actionAfterCreate()
	* @see 	ManagerPage.actionAfterDelete()
	*/
	this.setCountPage = function()
	{
		var modalObj = $("#modalManagerElement ");
		var countPage = modalObj.find(".selectPageItem").length;
		var listButObj = modalObj.find(".butSelectPageCopy, .butAdd");
		
		if (this.data.count_page <= countPage) {
			listButObj.attr("data-no-active", "true")
									.attr("data-rate-property", "count_page");
			
			this.setEventLimited();
		} else if (listButObj.attr("data-no-active")) {
			listButObj.removeAttr("data-no-active");
			ManagerPage.setEventModal();
		}
	}

	/**
	* Количество шаблонов
	*
	* @see 	TemplateSection.setEvent()
	* @see 	TemplateSection.setEventEnterInfoNewTemplate()
	* @see 	TemplateSection.confirmationDeleteTemplate()
	*/
	this.setCountTemplate = function()
	{
		var butObj = $(".butAddTemplate");
		
		if (this.data.count_template <= Data.user.list_template.length) {
			butObj.attr("data-no-active", "true")
									.attr("data-rate-property", "count_template");
			
			this.setEventLimited();
		} else if (butObj.attr("data-no-active")) {
			butObj.removeAttr("data-no-active");
			TemplateSection.setEventCreateTemplate();
		}
	}

/**********************************************************************************/

	/**
	* События для кнопок
	*
	* @see 	this.setModePro()
	* @see 	this.setCountPage()
	* @see 	this.setCountTemplate()
	*/
	this.setEventLimited = function()
	{
		var obj = this;
		var butObj = $("*[data-no-active]");
		butObj.off("mousedown click");
		butObj.on("click", function() {
			var rateProperty = $(this).attr("data-rate-property");
			if (!rateProperty) return true;
			obj.showModalLimitation(rateProperty);

			return false;
		});
	}

/**********************************************************************************/

	/**
	* Показыает модальное запрета
	*
	* 
	*/
	this.showModalLimitation = function(type)
	{
		var nameFuncContent = this.limitationProperty[type]["func_text"];
		var text = this[nameFuncContent]();
		var content = '\
			<div class="modalRateLimitedTitle">Ограничение тарифа</div>\
			<div class="noAddSiteDesc">'+text+'</div>\
			<a href="/payment" target="_blank" class="butRateLimited">Список тарифов</a>\
			';

		Modal.create({
			"id":"modalRateLimited",
			"width":"440",
			"top":"40",
			"content":content
		});

		return true;
	}

	/**
	* Добавление сайта
	*
	* @see 	this.showModalLimitation()
	* @see 	Editor.setModeWork()
	*/
	this.getLimitedTextModePro = function()
	{
		var text = 'Ваш тариф не позволяет работать в режиме PRO';

		return text;
	}

	/**
	*
	* @see 	Input.init()
	*/
	this.isExistsModePro = function()
	{
		// return true;
		return this.data.mode_pro == "yes";
	}

	/**
	*
	* @see 	Input.init()
	*/
	this.getModeLite = function()
	{
		return "lite";
	}

	/**
	* Добавление сайта
	*
	* @see 	this.showModalLimitation()
	*/
	this.getLimitedTextCountPage = function()
	{
		var text = 'Ваш тариф не позволяет создавать больше '+this.data.count_page+' страниц';

		return text;
	}

	/**
	* Добавление сайта
	*
	* @see 	this.showModalLimitation()
	*/
	this.getLimitedTextCountTemplate = function()
	{
		var text = 'Ваш тариф не позволяет создавать больше '+this.data.count_template+' шаблонов';

		return text;
	}
	
} // end class
/**
* Работа с ссайтом
*
*
*/
var Site = new Site();
function Site() {	
	/**
	* Количество шагов от сохранения
	*
	*/
	this.stepsFromSave = 0;

	/**
	* Количество шагов до сохранения
	*
	*/
	this.maxStepsToSave = 5;

	/**
	* Статус сохранения
	*
	* @set 	this.setForNewSite()
	* @see 	Page.replace()
	*/
	this.isSave = false;

/***************************************************************************************/	
	/**
	* Вставляет основу на страницу
	*
	* @see 	Input.init();
	*/
	this.insert = function() 
	{
		// ставим значения
		this.set(); 

		// ставим html
		var siteHtmlV = '<div class="element site page" class-unique="site" elm-type="site" data-id="i-1"></div>';
		$(".content").html(siteHtmlV);
		$(".content .page").html("");

		/*****************************************/
		/**
		* Не знаю почему добавляються после каждого li пустой ли
		* внизу их удаляю
		*/
		$(".content li:empty").remove();
		/*****************************************/

		// политика конфеденциальности
		PrivacyPolicy.addAllPage();
		
	}

	/**
	* Отдает буффер
	*
	* @see 	this.insert()
	* @see 	this.convectorSiteToLp()
	* @see 	this.clearHtml()
	*/
	this.getBuffer = function()
	{
		return $(".contentBoofer");
	}

	this.clearBuffer = function()
	{
		Site.getBuffer().html("");
	}

	/**
	* Установка
	*
	*  @
	*/
	this.set = function()
	{
		// сайт
		var elmJsonData = $("#jsonData");
		var jsonDataCode = elmJsonData.html();

		jsonDataCode = jsonDataCode.replace(/@@@@@plus@@@@@/gim, '+');

		/**********/
		jsonDataCode = jsonDataCode.replace(/"static":\[\]/gim, '"static":{}');
		jsonDataCode = jsonDataCode.replace(/"hover":\[\]/gim, '"hover":{}');
		jsonDataCode = jsonDataCode.replace(/"chosen":\[\]/gim, '"chosen":{}');
		jsonDataCode = jsonDataCode.replace(/"focus":\[\]/gim, '"focus":{}');
		jsonDataCode = jsonDataCode.replace(/"selected":\[\]/gim, '"selected":{}');
		jsonDataCode = jsonDataCode.replace(/"fixed":\[\]/gim, '"fixed":{}');
		/***********/

		Data.site = JSON.parse(jsonDataCode);

		// убираем со строницы чтобы небыло конфликтов
		elmJsonData.remove();

		/**
		* @see Element.getAllListStyle()
		* @todo переделать 
		*/
		if (!Data.isArray(Data.site.data)) {
			Data.site.data = {};
			Data.site.data.icon = "";
			Data.site.data.visibleRuler = false;
			Data.site.font = {};

			Data.site.data.autoclass = true;
			// Data.site.data.mode_simple = true;
			Data.site.data.basic_type_style = true;
		}
		if (!Data.isArray(Data.site.data.css)) Data.site.data.css = {};
		if (!Data.isArray(Data.site.data.seo)) Data.site.data.seo = {};
		if (!Data.site.data.max_page_id) Data.site.data.max_page_id = 1;
		if (!Data.isArray(Data.site.font)) Data.site.font = {};

		// для экспорта кода
		if (!Data.isArray(Data.site.data.export)) Data.site.data.export = {};


		// подключаемые файлы
		if (!Data.isArray(Data.site.data.include_file)) {
			Data.site.data.include_file = {};
			Data.site.data.include_file.css = [];
			Data.site.data.include_file.java_script = [];
		}

		// подключаемый код
		if (!Data.isArray(Data.site.data.added_code)) {
			Data.site.data.added_code = {};
			Data.site.data.added_code.head = '';
			Data.site.data.added_code.body_start = '';
			Data.site.data.added_code.body_end = '';
		}

		// abtest
		if (!Data.isArray(Data.abtest)) {
			Data.abtest = {'1':{'running':'yes'}};
		}

		// список страниц
		Data.listPages = Data.site["pages"];

		// манипуляция со страницами
		Data.listDeletePages = {}; 
		Data.listAddPages = {}; 

		// убираем некоторые настройки для многостраничника
		if (Data.site.type != "lp") {
			$(".menuPageSettingPage, .menuSEOPage").css("display", "none");
		}

		// кнопка сохранения
		this.setButSave();
	}

	/**
	* Тип если longread
	* 
	* @see 	Data.setPropertyLongreads()
	* @see 	Key.key9()
	*/ 
	this.isTypeLongreads = function()
	{
		return Data.site.type == "longreads";
	}

/**********************************************************************************************/
/*******************************************************************************************/

	/**
	* Сохранение
	*
	* @see 	SiteController.setEventSaveSite()
	* @see 	Key.key83()
	*/	
	this.save = function(noModal, func, noAnimate)
	{
		// включаем анимацию сохранение
		if (!noAnimate) this.startAnimateSave();
		// убираем редактор
		TextEditor.hide();

		// статус сохранения аватар
		var saveAvatarStatus = this.isSaveAvatar();
		if (saveAvatarStatus) {
			this.saveAvatar(noModal, func);
			return false;
		}


		/*****************************/
		/***********************/
		$('[data-hlp-widget-type="gallery_modal"]').filter(function() {
			if ($(this).hasClass("hlp-img")) {
				$(this).attr("data-hlp-width", $(this).width());
				$(this).attr("data-hlp-height", $(this).height());
			} else {
				$(this).find('.hlp-img').filter(function() {
					$(this).attr("data-hlp-width", $(this).width());
					$(this).attr("data-hlp-height", $(this).height());
				});
			}
		});
		/***********************/

		/*****************************/

		// что бы сохранились изменения
		Editor.resetFocus();

		$(".element[style='display: none;']").remove();
		// данные
		// var user = JSON.stringify(Data.user);
		var site = this.getSite();
		site = JSON.stringify(site);
		site = site.replace(/\+/gim, '@@@@@plus@@@@@');
		site = site.replace(/%26quot;/gim, "'");
		// var abtestV = Data.isAddAbtest ? JSON.stringify(Data.abtest) : '';


		var query_string = {
			"site_id" : Data.site.site_id,
			"site" : site,
			// "abtest" : abtestV,
			"site_type" : Data.site.type
		}

		var obj = this;
		// запрос на сервер
		$.post('/editor/save', query_string, function(res, status) {
			res = res.trim();	
			// console.log(res)
			
			if (res) {
				//статус сохрание - сохранен 
				$(".topMenuSave").attr("is-save", "true");
				// обнуляем счетчик для авто сохранения 
				obj.stepsFromSave = 0;
				Data.isAddAbtest = false;

				if (!noModal) Notification.ok(Resource.hlp_save_notification_successfully);

				// запускаем функцию 
				if (func) func();
			} else {
				// выводим ошибку
				Notification.error();
			}

			// останавливаем анимацию
			if (!noAnimate) obj.stopAnimateSave(); 
		})
	}

	/**
	*
	*
	*/
	this.saveFont = function()
	{
		var obj = this;
		var query_string = {
			"site_id" : Data.site.site_id,
			"font" : JSON.stringify(Data.site.font)
		}
		// запрос на сервер
		$.post('/editor/saveFont', query_string, function(req, status) {
			
		});
	}


	this.getButSave = function()
	{
		return this.butSaveObj;
	}

	this.setButSave = function()
	{
		this.butSaveObj = $(".topMenuSave");
	}

	/**
	* Статус сохранения
	*
	* @see 	EditorController.setEventButFullShow()
	*/
	this.isSaveStatus = function()
	{
		var butObj = this.getButSave();
		return butObj.attr("is-save") == "false" ? false : true;
	}

	/**
	* Установка статуса сохранения нет
	*
	* @see 	StyleMenu.edit()
	*/
	this.setSaveNo = function()
	{
		var butObj = this.getButSave();
		butObj.attr("is-save", "false")
	}

	this.setSaveYes = function()
	{
		var butObj = this.getButSave();
		butObj.attr("is-save", "true")
	}

	/**
	* устанавливем анимацию - сохранение
	*
	* @see 	this.save()
	* @see 	this.published()
	*/
	this.startAnimateSave = function(butObj, labelText)
	{
		if (!butObj) butObj = $(".topMenuSave");
		if (!labelText) labelText = Resource.hlp_save_load;

		this.stopAnimateSave();
		if (this.animateSaveObj) clearInterval(this.animateSaveObj);
		this.animateSaveObj = setInterval(function() {
			butObj.animate({"opacity":"0"}, 250)
							.animate({"opacity":"1"}, 250);
		}, 800);

		butObj.attr("label", labelText);
	}

	/**
	* останавливаем анимацию - сохранение 
	*
	* @see 	this.save()
	* @see 	this.published()
	*/
	this.stopAnimateSave = function(butObj, labelText)
	{	
		clearInterval(this.animateSaveObj);

		if (!butObj) butObj = $(".topMenuSave");
		if (!labelText) labelText = Resource.hlp_save_label;
		
		butObj.attr("label", labelText);
	}

	/**
	* Тип сайта lp
	*
	* @see 	ManagerPage.
	* @see 	this.save() Site.isTypeLp()
	* @see 	PrivacyPolicy.addPrivacyPolicy()
	* @see 	ElementBasicType.setStyle(), .fixedStyle()
	*/
	this.isTypeLp = function()
	{
		return Data.site.type == "lp";
	}

/********************************************************************************/	
	/**
	* Публикация сайта
	*
	* @see 	SiteController.setEventPublished()
	*/
	this.published = function(elmEvent)
	{
		var labelText = elmEvent.attr("label");

		this.startAnimateSave(elmEvent, Resource.hlp_published_load);	
		var obj = this;

		obj.save(true, function() {
			var hrefFrame = elmEvent.attr("href");
			var frameHtml = '<iframe src="'+hrefFrame+'" style="display:none;" id="iframeUpdateSitePublished" frameborder="0"></iframe>';
			
			$("#iframeUpdateSitePublished").remove();
			$("body").append(frameHtml);
			var frameUpdateObj = $("#iframeUpdateSitePublished");
			frameUpdateObj.ready(function() {
				setTimeout(function() {
					Notification.ok(Resource.hlp_published_notification);

					obj.stopAnimateSave(elmEvent, labelText);
					obj.setStatusPublishedYes();
				}, 1000);
			});
		}, true);
	}

	/**
	* Статус не опубликован
	*
	* @see 	History.record();
	*/
	this.setStatusPublishedNo = function()
	{
		$(".butSitePublished").removeAttr("data-published");
	}

	/**
	* Статус опубликован
	*
	* @see 	this.published()
	*/
	this.setStatusPublishedYes = function()
	{
		$(".butSitePublished").attr("data-published", "true");
	}
/*********************************************************************************/

	/**
	* Статус сохранения аватара
	*
	* @see 	this.save()
	*/
	this.isSaveAvatar = function()
	{
		if (!Data.site.count_save_site) Data.site.count_save_site = 0;
		Data.site.count_save_site++;

		if (!(Data.site.count_save_site % 10)) {
			if (Screen.isModal() 
					|| $(".modalBlock").length
					// || Page.getCurrentPageIndex()
					) {
				var avatarStatus = false;
				Data.site.count_save_site = 5;
			} else {
				var avatarStatus = true;
				Data.site.count_save_site = 0;
			}
		} else {
			var avatarStatus = false;
		}

		return avatarStatus;
	}

		/**
	* Сохранение аватар
	*
	* @see 	this.save()
	*/
	this.saveAvatar = function(noModal, func)
	{
		Screen.setScroll(0);
		Screen.setDesktop();

		var listHide = $(".resizeBlock, .butAddTemplate, .addedBlock, .guides, .grid");
		listHide.addClass("displayNone");

		html2canvas(document.querySelector(".content .site"), {'height':2000}).then(function(canvas) {
				var siteId = Data.site.site_id;
				var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, ''); 
			   	var params = {site_id:siteId, data:data}; 
			   	
			   	Notification.ok(Resource.hlp_save_screen_notification);

				$.post('/editor/saveSiteAvatar', params, function(res) { 
					listHide.removeClass("displayNone");

					// сохраняем сайт
					Site.save(noModal, func);
			    });  
		});
	}

/***********************************************************************************************/
	/**
	* Отдает данные сайта
	*
	* @see 		this.save()
	*/
	this.getSite = function()
	{
		// фиксируем изменения в массиве
		this.fix();

		// формируем страницы
		this.formatPagesData();
		// йиксируем цвета color picker
		this.fixedColorPicker();
		
		Data.site.pages[Data.page.page_id] = Data.page;

		return Data.site;
	}

	/**
	* Очищает сайт
	*
	* @see 	this.getData()
	*/
	this.formatSiteData = function()
	{
		Data.site["html"] = this.clearHtml(Data.site["html"]);
	}

	
	/**
	* Очищает страницу
	*
	* 
	* @see 	this.getData()
	* @see 	ManagerPage.chosenItem()
	*/
	this.formatPagesData = function()
	{
		if (Data.site.pages[Data.page.page_id]) {
			Data.site.pages[Data.page.page_id]["html"] = this.clearHtml(Data.page["html"]);
		}
	}

	/**
	* Фиксируем цвета
	*
	* @see 	this.getSite();
	*/
	this.fixedColorPicker = function()
	{
		// фиксируем цвета
		var listColorElmV = $(".cp-color-picker .cp-memory div");
		var countElmV = listColorElmV.length;
		for (var iColor = 0; iColor < countElmV; iColor++) {
			var colorV = listColorElmV.eq(iColor).css("background-color");
			if (!Data.site.data.colorPicker) Data.site.data.colorPicker = {};
			Data.site.data.colorPicker[iColor] = colorV;
		}
	}
/********************************************************************************************/
	/**
	* Очищает html
	*
	* @see 	this.clearSiteData()
	* @see 	this.clearPagesData()
	* @see 	Page.fix()
	*/
	this.clearHtml = function(html)
	{
		Resize.remove();
		StyleMenuAnimate.clearAll();

		//буффер 
		var buffer = this.getBuffer();
		//вставляем в буффер html
		buffer.html(html);
		
		//убираем // линейка, размер, направляющие
		buffer.find(".scaleWrap, .sectionListButTemplate, .resizeBlock, .addedBlock, .grid > *").remove();
		
		var listElmV = buffer.find(".element, .section-content, .slider-item, li, ul");
		listElmV.removeClass("elementSelected")
									.removeClass("displayBlock")
									.removeAttr("border") //рамка вокруг элемента
									.removeAttr("is-parent-selected")//родитель выделеного элемента
									.removeAttr("state")
									.removeAttr("status")
									.removeAttr("style")
									.removeAttr("data:image")
									.removeAttr("data-hlp-nav-open-level");
		//для карты
		this.clearForMap(buffer);
		buffer.find(".iframe > iframe").html('');


		// убираем пустые параграфы
		buffer.find("p").filter(function() {
			return !$(this).attr("class") ? true : false; 
		}).remove();
		
		//заносим результат с буффера в массив
		var newHtml =  buffer.html()
							.replace(/&/gim, '%26')//заменяем амперсант
							.replace(/^[\s\t]+/g, '')//убираем пробел в начале
							.replace(/[\t\r]+/g, '')
							.replace(/[\n]+/g, '');

		newHtml = newHtml.replace(/&/gim, "&amp;")

		//очищаем буффер
		buffer.html('');

		Resize.create();
		return newHtml;
	}


	/**
	* Очищние для карты
	*
	*
	* @see 	this.clearHtml()
	*/
	this.clearForMap = function(buffer)
	{
		buffer.find(".map > iframe").html("");
	}
/************************************************************************************************/
	/**
	* Фиксируем данные в массиве
	*
	* @see 	this.getData()
	* @see 	EditorController.setEventTab()
	* @see 	ManagerBasic.*()
	* @see 	ManagerPage.addNewPageInList()
	* @see 	ElementCss.createListTagStyle()
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.fix = function()
	{
		// фиксируем модальные
		if (Screen.isModal()) ManagerModal.fix();
		// фиксируем страницу
		Page.fix();
	}

	/**
	* Добавление шага до авто сохранения
	*
	* @see History.record()
	*/
	this.addStepAutoSave = function()
	{
		//статус сохрание - не сохранен 
		$(".topMenuSave").attr("is-save", "false");
	}

/*********************************************************************************************/
/******************************************************************************************/
	
	/**
	* Отдает статус
	*
	* @see 	PageSetting.setSite()
	*/
	this.isLazyLoadRunning = function()
	{
		return Data.site.data.lazyload_running;
	}

	/**
	* Устанавливает статус
	*
	* @see 	PageSetting.setEventSiteLazyLoad()
	*/
	this.setLazyLoadRunning = function(valueV)
	{
		Data.site.data.lazyload_running = valueV;
	}

/*********************************************************************************************/
	
	/**
	* Отдает id
	*
	* @see 	TemplateSection.saveNewTemplate()
	*/	
	this.getId = function()
	{
		return Data.site.site_id;
	}

	this.isCommerce = function()
	{
		return Data.site.type_access == "private";
	}



/*********************************************************************************************/
/*********************************************************************************************/

} //end class

/**
* Page source code
*
*
*/
var PageSetting = new PageSetting();
function PageSetting() {

	/**
	* Настройки страницу
	*
	* @see 	EditorController.setEventPageSetting()
	*/
	this.showModal = function()
	{
		var content = this.getModalContent();

		Modal.create({
			"id" : "modalPageSetting",
			"title" : Resource.hlp_modal_pagesetting_title,
			"width" : 850,
			"top" : 10,
			"content" : content,
			"button" : [
				["cancel", Resource.main_modal_but_cancel]
			]
		});

		this.set();
		this.setEvent();
	}

	/**
	* Отдает содержимое модального
	*
	* @see 	this.showModal()
	*/
	this.getModalContent = function()
	{
		var content = '\
			<div class="pageSettingBlock">\
				<div class="pageSettingBlockLeft">\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Страница</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									SEO\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSetting butPageSettingSeo">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Open Graph\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSetting butPageOpenGraph">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">'+Resource.hlp_modal_pagesetting_label_site+'</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Менеджер файлов\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butManagerFile">Открыть</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Lazy Load\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="pageSettingToggle valuePageSettingLazyLoad">\
										<div class="butPageSettingToggleItem" data-value="no">'+Resource.main_value_none+'</div>\
										<div class="butPageSettingToggleItem" data-value="yes">'+Resource.main_value_yes+'</div>\
										<div class="clear"></div>\
									</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="pageSettingBlockRight">\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Вставка кода для всего сайта</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									начало файла\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="before_head" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Head\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="head" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_start+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_start" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_end+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_end" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Вставка кода для текущей страницы</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									начало файла\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="before_head" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Head\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="head" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_start+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_start" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_end+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_end" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="clear"></div>\
			</div>\
		';

		return content;
	}

/*********************************************************************************/
	
	/**
	* Установить 
	*
	*/
	this.set = function(elm)
	{
		// seo
		this.setSite();
	}

	this.setSite = function()
	{
		this.setLazyLoad();
	}

	this.setLazyLoad = function()
	{
		// lazyload
		var lazyStatus = Site.isLazyLoadRunning() ? "yes" : "no";
		$(".butPageSettingToggleItem").removeAttr("data-chosen")
									.filter("[data-value='"+lazyStatus+"']")
									.attr("data-chosen", "true");
	}

/**********************************************************************************/
/**************************************************************************************/

	this.setEvent = function()
	{
		this.setEventPage();

		this.setEventCode();
		this.setEventSite();
		this.setEventManagerFile();
	}


	this.setEventPage = function()
	{
		this.setEventSeo();
		this.setEventOpenGraph();
	}

	this.setEventSeo = function()
	{
		var obj = this;
		var butObj = $(".butPageSettingSeo");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalSeo();
		});
	}

	this.showModalSeo = function()
	{
		this.createModalSeo();
		this.setEventModalSeo();
	}

	this.createModalSeo = function()
	{
		var content = this.getModalContentSeo();

		Modal.create({
			"id" : "modalSettingSeo",
			"title" : "Настройка SEO",
			"width" : 500,
			"top" : 40,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Сохранить"]
			]
		});
	}

	this.getModalContentSeo = function()
	{
		var listSeo = Data.page.data.seo;
		var seoTitle = listSeo.title;
		if (!seoTitle) seoTitle = '';
		var seoDesc = listSeo.description;
		if (!seoDesc) seoDesc = '';
		var seoKey = listSeo.key;
		if (!seoKey) seoKey = '';
		var iconSrc = Data.site.data.icon;

		var content = '\
			<div class="pageSettingBlockContent">\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Title\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoTitle" data-type="title">'+seoTitle+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Description\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoDescription" data-type="description">'+seoDesc+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Keywords\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoKey" data-type="key">'+seoKey+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Favicon\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<img src="'+iconSrc+'" class="menuSiteIcon" alt="">\
						<div class="butEditSiteIcon">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return content;
	}

	this.setEventModalSeo = function()
	{
		var butSave = $("#modalSettingSeo .butOk");
		butSave.off("mousedown");
		butSave.on("mousedown", function() {
			var seoTitle = $(".valueSeoTitle").val().trim();
			var seoDesc = $(".valueSeoDescription").val().trim();
			var seoKey = $(".valueSeoKey").val().trim();

			Data.page.data.seo.title = seoTitle;
			Data.page.data.seo.description = seoDesc;
			Data.page.data.seo.key = seoKey;

			History.record();

			Modal.removeLast();
		});

		var butIconObj = $(".butEditSiteIcon");	
		butIconObj.off("mousedown");
		butIconObj.on("mousedown", function() {
			var paramsV = {
				"src" : Data.site.data.icon,
				"operation" : "edit_icon",
				"fixed_history" : "yes"
			}
			EditElementImage.edit(paramsV);
			
			return false;
		});
	}

/**************************************************************************************/

	this.setEventOpenGraph = function()
	{
		var obj = this;
		var butObj = $(".butPageOpenGraph");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalOpenGraph();
		});
	}

	this.showModalOpenGraph = function()
	{
		this.createModalOpenGraph();
		this.setEventModalOpenGraph();
	}

	this.createModalOpenGraph = function()
	{
		var content = this.getModalContentOpenGraph();

		Modal.create({
			"id" : "modalSettingOpenGraph",
			"title" : "Настройка Open Graph",
			"width" : 500,
			"top" : 40,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Сохранить"]
			]
		});
	}

	this.getModalContentOpenGraph = function()
	{
		var listOpenGraph = Data.page.data.opengraph;
		if (!listOpenGraph) listOpenGraph = {};

		var openGraphTitle = listOpenGraph.title;
		if (!openGraphTitle) openGraphTitle = '';
		var openGraphDesc = listOpenGraph.description;
		if (!openGraphDesc) openGraphDesc = '';
		var openGraphImage = listOpenGraph.image;
		if (!openGraphImage) openGraphImage = '';

		var content = '\
			<div class="pageSettingBlockContent">\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Title\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueOpenGraphTitle" data-type="title">'+openGraphTitle+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Description\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueOpenGraphDescription" data-type="description">'+openGraphDesc+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Изображение\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<img src="'+openGraphImage+'" class="openGraphImage" alt="">\
						<div class="butPageSetting butEditOpenGraphImage">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return content;
	}

	this.setEventModalOpenGraph = function()
	{
		var butSave = $("#modalSettingOpenGraph .butOk");
		butSave.off("mousedown");
		butSave.on("mousedown", function() {
			if (!Data.page.data.opengraph) Data.page.data.opengraph = {};
	
			Data.page.data.opengraph.title = $(".valueOpenGraphTitle").val().trim();
			Data.page.data.opengraph.description = $(".valueOpenGraphDescription").val().trim();

			History.record();
			Modal.removeLast();
		});

		var butImageObj = $(".butEditOpenGraphImage");	
		butImageObj.off("mousedown");
		butImageObj.on("mousedown", function() {
			if (!Data.page.data.opengraph) Data.page.data.opengraph = {};
			
			var paramsV = {
				"src" : Data.page.data.opengraph.image,
				"operation" : "edit_opengraph",
				"fixed_history" : "yes"
			}
			EditElementImage.edit(paramsV);
			
			return false;
		});
	}

/****************************************************************************/

	/**
	* Изменение кода
	*
	* @see 	this.setEvent()
 	*/
	this.setEventCode = function()
	{
		var listPlaceTextV = {
			"before_head" : "Начало файла",
			"head" : "Head",
			"body_start" : "начало Body",
			"body_end" : "конец Body"
		}
		var butObj = $(".butPageSettingCodeInsert");
		var obj = this;
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var codeStateV = $(this).attr("data-place");
			var codeTypeV = $(this).attr("data-type");
			
			var placeTextV = listPlaceTextV[codeTypeV];
			var modalTitle = "Вставка кода в <b>" + placeTextV+"</b>";
			var oldCodeV = Data[codeStateV]["data"]["added_code"][codeTypeV];
			EditorCode.edit(modalTitle, oldCodeV, function(newCodeV) {
				Data[codeStateV]["data"]["added_code"][codeTypeV] = newCodeV;

				History.record();
				Modal.removeLast();
			});
		});
	}

	this.setEventManagerFile = function()
	{
		var butFileObj = $(".butManagerFile");
		butFileObj.off("mousedown");
		butFileObj.on("mousedown", function() {
			var filePropertyV = {
				"file_type":"video", 
				"category":"my", 
				"operation":"add",
				"no_chosen":true};
			EditElementImage.edit(filePropertyV);
			
			return false;
		});
	}

/*************************************************************************************/
	
	this.setEventSite = function()
	{
		this.setEventSiteLazyLoad();
	}

	this.setEventSiteLazyLoad = function()
	{
		var obj = this;
		var butObj = $(".butPageSettingToggleItem");
		butObj.off("mousedown");
		butObj.on("mousedown", function(){
			// ставим статус
			var lazyStatus = $(this).attr("data-value") == "yes";
			Site.setLazyLoadRunning(lazyStatus);
			// устанавливаем на панели 
			obj.setLazyLoad();
		});
	}


/*******************************************************************************/	

} // end class
/**
* Функции для работы со страницей
*
*
*/
var Page = new Page();
function Page() {
	/**
	* Поставить имя страницу в редаторе
	*
	* @see 	this.replace()
	* @see 	SelectPage.focusoutEditPageName()
	*/	
	this.setNameInEditor = function(name)
	{
		$(".butSelectPageName").text(name);
	}	
/********************************************************************************************/
	/**
	* Поставит первую
	*
	* @see 	Input.init();
	*/
	this.insertFirst = function() 
	{
		if (Data.site.data.last_page_id) {
			var pageId = Data.site.data.last_page_id;
		} else {
			// id первой страницы
			for (var pageId in Data.listPages) { break;}
		}

		
		// устанавливаем страницу c вариантами
		this.replace(pageId, true);
		
		//если в секции нет элементов
		for (var firstPageId in Data.listPages) { break;}
		if (firstPageId == pageId) {
			var countElmV = $(".section:not(.hlp-privacy-policy)").find(".element").length;
			if (!countElmV) {
				$(".butAddTemplateSection").mousedown().mouseup();
			}
		}
	}

	/**
	* Заменяем страницу
	*
	* @see 	this.insertFirst()
	* @see 	SelectPage.setEventChoosePage()
	*/	
	this.replace = function(pageId, noHistoryReset)
	{
		$(".sectionCssPage .sectionCssItem").html('');

		// ставим вкладку
		$(".topPanelNavPage:not([chosen])").mousedown();
		
		// ставим данные для новой страницы
		this.setFullPage(pageId);
		// заменяем страницу
		this.insterToEditor();
		// если у элементов нету id
		Element.addNewId($(".site"));

		// добавляем базовые стили
		ElementBasicType.setSiteStyle();
		// формируем tag style
		ElementCss.createListTagStyle();
		// базовыйй стиль
		ElementBasicType.addListElm();

		// изменяем название текущей страницы
		var pageName = Data.listPages[pageId]["name"];
		this.setNameInEditor(pageName);
		// ставим события
		Input.newCanvas();
		// создаем горизонтальную линейку
		Scale.create();

		/* отмечаем первую секцию *********/
		$(".element").removeClass("elementSelected");
		if ($(".longreads-section").length) {
			var firstSectionObj = $(".longreads-section").next();
			var firstElmSectionObj = firstSectionObj.find(".element:first");
			if (!firstElmSectionObj.length) firstElmSectionObj = firstSectionObj;
			firstElmSectionObj.mousedown().mouseup();
		} else {
			$(".content .section:first").mousedown().mouseup();
		}
		/********************************/


		// обнуляем историю
		if (!noHistoryReset) History.reset();

		// очищаем поле модальное окно
		ManagerModal.clearCanvas();
		// ставим на вверх scroll
		$(".content").scrollTop(0);

		// сохраняем если нужно
		if (Site.isSave) Site.save(true);

		// ставим шрифты
		if (!StyleFont.isSetEditor) StyleFont.setFontInEditor();

		// ставим секциям id
		this.setSectionNewId();

		// сохраняем последнию страницу
		Data.site.data.last_page_id = Data.page.page_id;

		// для редактора некотрые параметры
		Editor.setPropertyPageModal("page");
		
		// ставим видео оболочку, почему то она удаляется
		setTimeout(function() {
			var listVideo = $(".site .video").filter(function() {
				return $(this).find("> .selfVideoBlackout").length ? false : true;
			});
			listVideo.prepend('<div class="selfVideoBlackout"></div>');
		}, 1000);

		// обнуляем анимацию
		StyleMenuAnimate.clearAll();
		
		// если есть дубли номера
		ElementSection.replaceDublNum();
		// создаем мобильное меню
		ElementNavPanelMobile.createIsNoExists();
		// ставим модальные
		ManagerModal.setSelectListItem();
		
		/************/
		// переводим старое меню в новое
		ElementNav.reloadOld();
		ElementSlider.convertOldVersion();
		/***********/
	}

	/**
	* Устанавливает полностью страницу
	*
	* @see this.replace()
	*/
	this.setFullPage = function(pageId)
	{
		// текущая страница
		Data.page = Data.listPages[pageId];
		
		// данные страницы
		Data.page.data = Data.page["data"];
		if (!Data.isArray(Data.page.data)) Data.page.data = {};
		if (!Data.isArray(Data.page.data.css)) Data.page.data.css = {};
		if (!Data.isArray(Data.page.modal)) Data.page.data.modal = {};
		if (!Data.isArray(Data.page.data.seo)) Data.page.data.seo = {};
		
		// подключаемые файлы
		if (!Data.isArray(Data.page.data.include_file)) {
			Data.page.data.include_file = {};
			Data.page.data.include_file.css = [];
			Data.page.data.include_file.java_script = [];
		}

		// подключаемый код
		if (!Data.isArray(Data.page.data.added_code)) {
			Data.page.data.added_code = {};
			Data.page.data.added_code.head = '';
			Data.page.data.added_code.body_start = '';
			Data.page.data.added_code.body_end = '';
		}

		// для экспорта
		if (!Data.isArray(Data.page.data.export)) {
			Data.page.data.export = {};
		}

	}	

	/**
	* Ставим секциям id
	*
	* @see 	this.replace()
	*/
	this.setSectionNewId = function()
	{
		$(".content .section").removeAttr("id");

		var listSection = $(".content .section:not([data-num])");
		var countSection = listSection.length;
		for (var iSection = 0; iSection < countSection; iSection++) {
			var sectionObj = listSection.eq(iSection);
			// var newSectionId = Element.getNewElmId("section");
			// sectionObj.attr("id", elmNum);

			var elmNum = Element.getMaxNumberClass(listSection, "data-num");
			sectionObj.attr("data-num", elmNum);
		}
	}

	/**
	* Отдает index текущей страницы
	*
	* @see 	EditorController.setEventButFullShow()
	* @see 	Site.isSaveAvatar()
	*/
	this.getCurrentPageIndex = function()
	{
		var currentPageId = Data.page.page_id;
		var listPage = Data.listPages;
		var pageIndexV = 0;
		for (var pageId in listPage) {
			if (pageId == currentPageId) break;
			pageIndexV++;
		}
		
		return pageIndexV;
	}
/****************************************************************************************/
	/**
	* Вставить страницу в редактор
	*
	* @see Input.init()
	*/
	this.insterToEditor = function()
	{
		var htmlV = Data.page.html;
		htmlV = htmlV.replace(/%26nbsp;/gim, ' ');
		$(".page").html(htmlV);	
	}
/****************************************************************************************/
	/**
	* Фиксирует страницу в массиве данных
	*
	* @see 	SiteController.setEventChoosePage()
	* @see 	Site.fix()
	*/
	this.fix = function() {
		// если остались
		ElementCss.setCssByAttrStyle();

		if (Data.site.pages[Data.page.page_id]) {
			// html
			var pageHtmlV = $(".contentItemPage").find(".page").html();
			pageHtmlV = Site.clearHtml(pageHtmlV);
			// фиксируем html
			Data.page["html"] = pageHtmlV;
			// фиксируем базовые стили
			ElementBasicType.fixedSiteStyle();

			Data.site.pages[Data.page.page_id] = Data.page;
		}
	}

/********************************************************************************************/

	/**
	* Отдает pageId
	*
	* @see 	Element.getNewId()
	*/
	this.getId = function()
	{
		return Data.page.page_id;
	}

	/**
	* Страница основа или нет
	*
	* @see 	ManagerBasic.changeEditPageName()
	* @see 	ManagerPage.setSelectListItem()
	* @see 	TemplateSection.replaceClassTemplate()
	*/
	this.isTypeMain = function(pageName)
	{
		if (Site.isTypeLp()) return false;
		if (!pageName) pageName = this.getName();

		if (pageName == "header" || pageName == "footer") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Отдает имя страницы
	*
	* @see 	this.isTypeMain()
	*/
	this.getName = function()
	{
		return Data.page.name;
	}

/***********************************************************************************************/
/********************************************************************************************/
	/**
	* @see Input.init()
	*/
	this.setMain = function()
	{
		// добавляем основу
		var block = '<div class="siteWrapper"><div class="page"></div></div>';
		$(".content").html(block);
		// добавляем элементы
		ElementHeader.createElement({});
	}


/********************************************************************************************/

}//end class



















/**
* Структура страницы
*
*
*/
var PageStruct = new PageStruct();
function PageStruct() {
	/**
	* Устанавливает структуру страницы
	*
	* @see 	ElementMan.delete(), ElementMan.insert(), ElementMan.cut()
	* @see 	BasicElement.create()
	* @see 	ElementSettingGrid.editDesctopCount(), .setEventDeleteColumn()
	* @see 	Input.newCanvas()
	* @see 	EditController.setEventTab()
	* @see 	StyleMenuFixed.updateEditorClass(), .editClass()
	* @see 	ElementNavPanelMobile.setDisplay()
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.build = function(elmSelected)
	{
		var parentElm = Element.getParentWrap();
		// получить структуру элементов
		var struct = this.getStruct(parentElm);
		struct = "<ul>"+struct+"</ul>";
		// вставляем блок
		$(".menuStruct").html(struct);
		// ставим событие
		this.setEvent();

		// выделяем элемент, если он есть
		if (elmSelected) PageStruct.select(elmSelected);
	}
/********************************************************************************************/
	/**
	* Получить список страниц
	*
	* @see 	this.build()
	*/
	this.getStruct = function(parent, level)
	{
		var listChild = '';
		// непосредственные потомки
		for (var i = 0; i < 100; i++) {
			if (!parent.length) break;//если пустой элемент
			listChild = parent.find("> .element, > .page, > .hlp-slider-list-item > .hlp-slider-item");	//непосредственные потомки
			if (listChild.length) break;//если потомки есть перекращаем цикл
			else parent = parent.children();//иначем опускаем вниз по дереву
		}

		var count = listChild.length;
		if (!count) return false;

		if (!level) level = 1;
		else level++;

		var block = '';
		// формируем один элемент
		for (var i = 0; i < count; i++) {
			var elm = listChild.eq(i);
			var elmId = elm.attr("data-id");
			var classUnique = Element.getClassUnique(elm);
			var type = elm.attr("elm-type");
			if (elm.hasClass("page")) type = "page";
			if (!type) type = elm.closest(".element").attr("elm-type");

			if (!type) continue;
			else if (type == "hlp-slider-list-bullets") continue;
			else if (type == "hlp-slider-bullet") continue;
			
			var name = Element.getCurrentClass(elm); //classUnique;
			var sectionTrue = elm.attr("section-main") ? 'section-main="true"' : '';
			var structChildrens = this.getStruct(elm, level);
			// если это родитель колонокстрока
			var isParentColumn = elm.hasClass("parentColumn") ? 'is-parent-column="true"' : '';
			var isChild = "false";
			
			if (elm.hasClass("page")) {
				name = "page";
				classUnique = "page";
			}

			if (structChildrens) {
				structChildrens = '<ul class="sctructChildrens">'+structChildrens+'</ul>'; 
				isChild = "true";
			} else {
				structChildrens = '';
			}

			if (type == "section" || type == "nav-panel-mobile") var isSection = true;
			else var isSection = false;

			name = this.getSelectorForVisible(elm);
			if (elm.hasClass("input") && elm.attr("type") == "hidden") {
				name = "hidden - " + elm.attr("name");
			}

			var structItemStyle = '';
			// если без id, то не активный 
			if (!elmId) {
				structItemStyle = 'opacity:0.5;cursor:default;';
				elmId = false;
			}

			var attrElmId = elmId ? 'elm-id="'+elmId+'"' : "";

			block += '\
				<li class="structItemWrap" section="'+isSection+'" type="'+type+'" status="show">\
					<div class="structItem" '+isParentColumn+' type="'+type+'" '+attrElmId+' '+sectionTrue+' elm-class-unique="'+classUnique+'" level="'+level+'">\
						<div class="structItemArrow" is-child="'+isChild+'" is-image="true"></div>\
						<span class="structItemName" style="'+structItemStyle+'">'+name+'</span>\
						<div class="clear"></div>\
					</div>'
					+structChildrens+
				'</li>';
		}

		return block;
	}

	/**
	* Устанавливает имя input в структуре
	*
	* @see 	ElementSettingForm.editInputTypeSelf(), .editInputName()
	*/
	this.setStructItemNameInput = function(elm)
	{
		var elmIdV = elm.attr("data-id");
		var elmNameV = "input";
		if (elm.attr("type") == "hidden") {
			elmNameV = "hidden - " + elm.attr("name");
		}

		$(".structItem[elm-id='"+elmIdV+"'] > .structItemName").text(elmNameV);
	}

/****************************************************************************************/
	/**
	* Выбрать элемент
	*
	* @see 	ElementStyleController.noteElement()
	* @see 	ElementMan.delete()
	* @see 	ElementMan.insert()
	* @see 	EditorController.setTabMenuRight()
	*/
	this.select = function(elm)
	{
		var elmId = elm.attr("data-id");

		// убираем выделение и сворачиваем секции
		$(".structItem").removeAttr("chosen");
		$(".structItemWrap[section='true']").attr("status", "hide");

		// ставим выделение и показываем секцию
		var selectedItem = $(".structItem[elm-id='"+elmId+"']");
		selectedItem.attr("chosen", "true");
		
		$(".structItemWrap").attr("status", "hide");
		// selectedItem.closest(".structItemWrap[section='true']").attr("status", "show");

		selectedItem = selectedItem.closest(".structItemWrap");

		for (var iIndex = 0; iIndex < 200; iIndex++) {
			selectedItem = selectedItem.parent().closest(".structItemWrap");
			if (!selectedItem.length) break;

			selectedItem.attr("status", "show");
		}

		// ставим скролл 
		var elmMenuStruct = $(".menuStruct");
		if (selectedItem.length) {
			var scroll = selectedItem.offset().top - elmMenuStruct.offset().top - 100;
		} else {
			var scroll = 0;
		}
		
		if (!this.noSetScrollTop) elmMenuStruct.scrollTop(scroll);
	}

/****************************************************************************************/
/*************************************************************************************/
	/**
	* Ставим событие на выбор
	*
	* @see 	this.build()
	*/
	this.setEvent = function()
	{
		var obj = this;
		$(".structItem").off("mousedown");
		$(".structItem").on("mousedown", function(event) {
			var elmEvent = $(this);
			var elmId = elmEvent.attr("elm-id");
			if (!elmId) return false;
			
			// фиксируем положение скролла
			var elmMenuStruct = $(".menuStruct");
			var scrollValue = elmMenuStruct.scrollTop();
			
			// выделяем элемент
			var elm = Element.getParentWrap().find(".element[data-id='"+elmId+"']"); 
			var isSelectedV = elm.hasClass("elementSelected");
			if (!isSelectedV) {
				obj.noSetScrollTop = true;
				elm.eq(0).mousedown().mouseup();
				setTimeout(function() {
					obj.noSetScrollTop = false;
				}, 200);
			}
				
			
			// ставим скролл в меню
			elmMenuStruct.scrollTop(scrollValue);

			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(elm); 

			// добавляем элемент передвижения
			obj.addItemMove(elmEvent);
			// ставим событие на передвижение
			obj.setEventMove(elmEvent);

			if (!isSelectedV) elmEvent.mouseup();

			return false;
		});

		var butArrowObj = $(".structItemArrow");
		butArrowObj.off("mousedown");
		butArrowObj.on("mousedown", function() {
			var itemObjV = $(this).closest(".structItemWrap");
			
			var itemStatusV = itemObjV.attr("status") == "hide" ? "show" : "hide";
			itemObjV.attr("status", itemStatusV);

			if (itemStatusV == "hide") {
				itemObjV.find(".structItemWrap").attr("status", "hide");
			}

			return false;
		});
	}

	/**
	* Добавляем элемент передвижения
	*
	* @see 	this.setEvent()
	*/
	this.addItemMove = function(elmEvent)
	{
		var type = elmEvent.attr("type");
		var elmId = elmEvent.attr("elm-id");
		var text = elmEvent.find(">span").text();

		var block = '\
			<div class="structItem structItemMove" type="'+type+'" elm-id="'+elmId+'">\
				<span>'+text+'</span>\
				<div class="clear"></div>\
			</div>';
		$("body").append(block);
	}

/************************************************************************************************/
/********************************************************************************************/
	/** 
	* Передвижение
	*
	* @see 	this.setEvent()
	*/
	this.setEventMove = function(elmEvent)
	{
		// передвижение элемента
		this.setEventMoveElm(elmEvent);
		// остановить передвижение
		this.setEventResetMove();
		// отметить выбраный
		this.setEventMarkSelected(elmEvent);	
	}

	/**
	* Передвижение элемента
	*
	* @see 	this.setEventMove()
	*/
	this.setEventMoveElm = function(elmEvent)
	{
		var menuStructOffset = $(".menuStruct").offset();
		var minLeft = menuStructOffset.left;
		var minTop = menuStructOffset.top;

		$("body").off("mousemove");
		$("body").on("mousemove", function(event) {
			var top = event.pageY;
			var left = event.pageX+20;
			// положение блока перемещения
			if (left < minLeft) left = minLeft;
			if (top < minTop) top = minTop;
			$(".structItemMove").css({"display":"block", "top":top, "left":left});

			return false;
		});
	}
/**************************************************************************************/
	/**
	* Сброс передвижекния
	*
	* @see 	this.setEventMove()
	*/
	this.setEventResetMove = function() {
		var obj = this;
		$("body").off("mouseup");
		$("body").on("mouseup", function() {

			//убираем событие
			$("body").off("mousemove");
			$("body").off("mouseup");
			$(".structItem").off("mousemove").removeAttr("no-show");
			$("*").removeAttr("insert-after");

			// перемещаем элемент
			obj.moveElm();

			// удаляем передвигаемый элемент
			$(".structItemMove").remove();
			$(".structItemLineSelect").remove();
			//показываем все элементы
			$(".structItem").attr("show", "true"); 
			// разворачиваем секцию если она есть
			var sectionShow = $(".structItemWrap[show-section='true']");
			if (sectionShow.length) sectionShow.removeAttr("show-section")
												.attr("status", "show");

			return false;
		});
	}

	/**
	* Перемещаем элемент
	*
	* @see 	this.setEventResetMove() 	
	*/ 
	this.moveElm = function()
	{
		// индекс элемента после которого нужно вставить
		var idInsertAfter = $(".structItemLineSelect[show='true']")
													.closest(".structItem")
													.attr("elm-id");
		if (!idInsertAfter) return false;

		var elm = Element.obj;
		var elmWidth = elm.width();
		var parentElm = Element.getParentWrap();
		var type = Element.data.type;
		// элемент после которого вставить
		var elmInsertAfter = parentElm.find(".element[data-id='"+idInsertAfter+"']"); 

		// html элемента
		var elmHtml = ElementMan.getHtmlElmAll();
		// если вставка внутри элемента
		var isPrepend = elmInsertAfter.find(".element[data-id='"+elm.attr("data-id")+"']").length;

		parentElm = Element.getParent(elm);
		
		var isColV = elm.hasClass("column");
		// удаляем элемент
		elm.remove();

		// вставляем
		if (elmInsertAfter.find(">.section-content").length && type != "section") {
			if (elmInsertAfter.hasClass("section")) {
				elmInsertAfter = elmInsertAfter.find(".section-content");
			}
			elmInsertAfter.prepend(elmHtml);
		} else if (elmInsertAfter.hasClass("nav-panel-mobile") && type != "section") {
			elmInsertAfter.prepend(elmHtml);
		// вставка в родителя
		} else if (isPrepend && (!elmInsertAfter.hasClass("row") || isColV)) {
			elmInsertAfter.prepend(elmHtml);
		} else { // после
			elmInsertAfter.after(elmHtml);
		}

		// ставим событие
		Input.newCanvas();

		// выделяем вставленый элемент
		$(".elementSelected").removeClass("elementSelected");
		var newElm = $("*[status='new']");
		newElm.removeAttr("status");

		Element.obj = newElm;
		Resize.create();
		this.select(newElm);

		// если колонка
		if (Element.isColumn(newElm)) {
			ElementSettingGrid.setColumnNoIndent();
		}

		// записываем в историю
		History.record();
	}
/***************************************************************************************/
	/**
	* Показывает выбраный
	*
	* @see 	this.setEventMove()
	*/
	this.setEventMarkSelected = function(currentStructItem)
	{
		// элементы структуры
		var listStructItem = this.getListStructItem(currentStructItem);
		
		if (listStructItem.length) {
			listStructItem.removeAttr("no-show");// осветляем активные
			// добавляем линую выбора
			listStructItem.not("[chosen='true']").append('<div class="structItemLineSelect"></div>');
		}
		
		// при наведении линия выбора появляется, а не активные элементы затемняются
		// событие передвижения
		this.setEventMarkSelectedMove(listStructItem, currentStructItem);
	}

	/**
	* Показывает выбраный - событие передвижение
	*
	* @see 	this.setEventMarkSelected(0)
	*/
	this.setEventMarkSelectedMove = function(listStructItem, currentStructItem)
	{
		if (!listStructItem.length) return false;
		var obj = this;
		var listElm = Element.getParentWrap().find(".element");
		var listStructItemLine = listStructItem.find(".structItemLineSelect");
		var currentId = currentStructItem.attr("elm-id");

		$(".structItem").off("mousemove");
		$(".structItem").on("mousemove", function(event) {
			var elmEvent = $(this);

			// показываем линию подчеркивания
			listStructItemLine.removeAttr("show");
			elmEvent.find(".structItemLineSelect").attr("show", "true");

			// отмечаем что он текущий
			listStructItem.removeAttr("current");
			elmEvent.attr("current", "true");

			// отмечаем элемент рамкой
			var elmId = elmEvent.attr("elm-id"); 
			listElm.add(".section-content").removeAttr("insert-after");
			if (elmEvent.attr("no-show") != "true" && currentId != elmId) {
				// отметить элемент после которого вставка
				var elmAfter = listElm.filter("[data-id='"+elmId+"']");
				if (elmAfter.hasClass("section")) {
					elmAfter.find(">.section-content").attr("insert-after", "true");
				} else {
					elmAfter.attr("insert-after", "true");
				}
				
				// ставим scroll
				StyleCanvas.setScrollTopElm(elmAfter);
			}
		});
	}
/*********************************************************************************************/
	/**
	* Отдает список элементов структуры
	*
	* @see this.setEventMarkSelected()
	*/
	this.getListStructItem = function(elmEvent)
	{
		var elm = Element.obj;
		var type = Element.data.type;
		var isParentColumn = elmEvent.attr("is-parent-column");

		// var listStructItem = $(".structItem:not(.structItemMove)");
		// var listStructItem = $(".structItem").not(elmEvent);
		var listStructItem = $(".structItem").not(".structItemMove").not(elmEvent);
		listStructItem.attr("no-show", "true");//затемняем все элементы

		// убираем предыдущий элемент
		listStructItem = listStructItem.not(elmEvent.parent().prev().find(">.structItem"));
		// убираем которые нельзя перемещать
		if (!elm.closest(".nav-panel-mobile").length) {
			listStructItem = listStructItem.not("[type='nav-panel-mobile']");
		}
		
		listStructItem = listStructItem.not("[type='nav-item-mobile']");
		listStructItem = listStructItem.not("[type='page']");
		// listStructItem = listStructItem.not("[type='text-span']");
		listStructItem = listStructItem.filter("[elm-id]");

		if (type != "nav-item") listStructItem = listStructItem.not("[type='nav-item']");
		if (type != "hlp-li") listStructItem = listStructItem.not("[type='hlp-li']");
		if (type != "column") listStructItem = listStructItem.not("[type='column']");

		// из site в page и наоборот запретить
		listStructItem = listStructItem.not("[section-main='true']");

		// фильтруем элементы
		if (!this.isMoveElm(elm, elmEvent, type)) { //элементы каркаса передвигать нельзя
			listStructItem = [];
		} else if (type == "section") {//если секция
			// фиксируем развернутый элемент, при отпускание разворачиваем обратно
			$(".structItemWrap[status='show']").attr("show-section", "true");
			// сворачиваем секции
			listStructItem.filter("[type='section']").parent().attr("status", "hide");
			listStructItem = listStructItem.not("[type='nav-panel-mobile']");
		} else if (isParentColumn) {//если родитель колонок
			var notListElm = $(".structItem[is-parent-column='true']").next().find(".structItem");
			listStructItem = listStructItem.not(notListElm);
		} else if (type == "row") { 
			//нельзя в потомки row
			var listStructRow = $(".structItem[type='row']").next().find(".structItem");
			listStructItem = listStructItem.not(listStructRow);
		} else if (type == "column") { // если колонка
			var listFilterColumn = elmEvent.closest(".sctructChildrens")
											.find(">li>.structItem");
			listStructItem = listStructItem.filter(listFilterColumn);
		} else if (elm.hasClass("nav-item")) {
			listStructItem = listStructItem.filter("[type='nav-item']");
		// потомки мобильной панели
		} else if (elm.closest(".nav-panel-mobile").length) {
			listStructItem = listStructItem.not("[type='section']");
		} else if (elm.hasClass("hlp-li")) {
			listStructItem = listStructItem.filter("[type='hlp-li']");
		} else { //все остальное
			
		}

		// добавляем родителя 
		var parentRowObj = elmEvent.closest(".sctructChildrens").prev();
		if (listStructItem.length) listStructItem = listStructItem.add(parentRowObj);


		// убираем всех потомков
		var child = elmEvent.next().find(".structItem");
		if (listStructItem.length) {
			listStructItem = listStructItem.not(child);
			listStructItem = listStructItem.not("[elm-class-unique='page']");
		} 

		return listStructItem;
	}

	/**
	* Статус передвижения элемента
	*
	*
	*/
	this.isMoveElm = function(elm, elmEvent, type)
	{
		if (	!Element.isManipulation()
				|| elm.hasClass("modal")
				|| elmEvent.attr("type") == "page"
				|| elm.hasClass("text-span")
				|| elm.hasClass("nav-panel-mobile")
				|| elm.hasClass("nav-item-mobile")
				) {
			return false;
		} else {
			return true;
		}
	}

/*************************************************************************************************/
/************************************************************************************************/
	/**
	* Вложеность элементов
	*
	* @see 	ElementStyleController.noteElement()
	* @see 	StyleMenuFixed.updateEditorClass(), .editClass()
	*/
	this.buildNested = function(elm)
	{
		if (!elm) elm = Element.obj;
		// создаем блок
		this.createSectionNested(elm);
		// ставим события
		this.setEventNested()
	}

	/**
	* Создает блок
	*
	* @see 	this.buildNested()
	*/
	this.createSectionNested = function(elm)
	{
		var curId = elm.attr("data-id");

		var block = '';
		for (var i = 0; i < 50; i++) {
			var type = elm.attr("elm-type");
			// if (!type) type = "site";
			if (!type) continue;

			var title = ListElementObject[type]["title"];
			var name = title.name;
			var classUnique = Element.getCurrentClass(elm);

			// отдает класс для отображения 
			classUnique = this.getSelectorForVisible(elm);

			var img = title.img;
			var elmId = elm.attr("data-id");
			var chosen = curId == elmId ? true : false;
			// блок
			block = '\
				<div class="nestedSectionItem" chosen="'+chosen+'" elm-id="'+elmId+'">\
					<img src="/img/editor/elements/'+img+'" alt="" class="nestedSectionItemImg">\
					<div class="nestedSectionItemText">'+classUnique+'</div>\
					<div class="clear"></div>\
				</div>'+block;

			// если секция то прерываем
			if (type == "section") {
				block = '\
					<div class="nestedSectionItem" chosen="" elm-id="site">\
						<img src="/img/editor/elements/section.png" alt="" class="nestedSectionItemImg">\
						<div class="nestedSectionItemText">site</div>\
						<div class="clear"></div>\
					</div>'+block;

				break;
			}
			// вверх о иерархии
			elm = elm.parent().closest(".element");
		}

		block += '<div class="clear"></div>';

		// вставляем блок
		$(".nestedSection").html(block);
	}


	/**
	* События 
	*
	* @see 	this.buildNested()
	*/
	this.setEventNested = function()
	{
		// клик по родителю и его выбор
		$(".nestedSectionItem").off("mousedown");
		$(".nestedSectionItem").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("chosen") == "true") return false;
			
			var elmId = elmEvent.attr("elm-id");
			if (elmId == "site") elm = $(".contentItemPage .site");
			else var elm = Element.getParentWrap().find(".element[data-id='"+elmId+"']");
			
			if (!elm.length) {
				var elmSiteObjV = $(".contentItemPage .site");
				if (elmSiteObjV.attr("data-id") == elmId) {
					elm = elmSiteObjV;
				}
			}
			
			elm.mousedown().mouseup();

			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(elm);

			return false;
		});
	}

	/**
	* Отдает селектор для отображения
	*
	* @see 	this.getStruct()
	* @see 	this.createSectionNested()
	*/
	this.getSelectorForVisible = function(elm)
	{	
		var elmClass = Element.getClassAdded(elm);
		if (elmClass) return elmClass;

		elmClass = Element.getClassUnique(elm);
		elmClass = /[\w\-]+$/i.exec(elmClass, '');
		if(elmClass) return elmClass[0];
		else return elmClass;
	}

/**********************************************************************************************/
/*********************************************************************************************/
}//end class




/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
var EditorCode = new EditorCode();
function EditorCode() {
	/**
	* Создает модальное
	*
	* @see 	EditElementEmbed.edit()
	*/
	this.edit = function(modalTitle, code, saveFuncV)
	{
		var content = this.getModalConten();

		Modal.create({
			"id":"modalEditorCode",
			"title":modalTitle,
			"width":1000,
			"top":20,
			"content":content,
			"button":[
				["cancel", Resource.main_modal_but_cancel],
				["add", Resource.main_modal_but_save]
			]
		});

	
		this.addButTutorial();
		this.setProperty(code);
		this.setEvent(saveFuncV);
	}

	/**
	* Добавление кнопки инструкция
	*
	* @see 	this.edit()
	*/
	this.addButTutorial = function()
	{
		// var blockTutorialV = '\
		// <div class="modalCodeBlockTutorial">\
		// 	<div class="modalCodeBlockTutorialLabel">Вставленный код не работает</div>\
		// 	<div class="butModalCodeTutorialShow">Узнать почему</div>\
		// 	<div class="clear"></div>\
		// </div>';

		// $("#modalEditorCode .modalBlockFooter").prepend(blockTutorialV);
	}

	/**
	* Отдает содержимое контента модального
	*
	* @see 	this.createModal()
	*/
	this.getModalConten = function()
	{
		var content = '\
			<div class="label"></div>\
			<textarea class="valueEditorCode"></textarea>';
		
		return content;
	}


	/**
	* Устанавливает параметры
	*
	* @see 	this.edit()
	*/
	this.setProperty = function(code)
	{
		if (!code) return false;

		code = code.replace(/@@@@@lt@@@@@/gim, "<");
		code = code.replace(/@@@@@gt@@@@@/gim, ">");
		code = code.replace(/@@@@@plus@@@@@/gim, "+");

		code = code.replace(/@@@@@question@@@@@/gim, "?");
		code = code.replace(/@@@@@hlp_amp@@@@@/gim, "&");

		// форматирование
		code = code.replace(/@@@@@sign_rn@@@@@/gim, "\r\n");
		code = code.replace(/@@@@@sign_tab@@@@@/gim, "\t");

		//
		code = code.replace(/@@@@@brace_start@@@@@/gim, '%7B');
		code = code.replace(/@@@@@brace_end@@@@@/gim, '%7D');
		code = code.replace(/@@@@@double_quotes@@@@@/gim, '%22');
			
		code = code.trim();

		$('.valueEditorCode').val(code);
	}

/********************************************************************************/

	this.setEvent = function(saveFuncV)
	{
		this.setEventAdd(saveFuncV);
		this.setEventTab();
		this.setEventTutorial();
	}

	/**
	* Устанавливает событие
	*
	* @see 	this.edit()
	*/
	this.setEventAdd = function(saveFuncV)
	{
		var obj = this;
		var butAdd = $("#modalEditorCode .butAdd");

		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var fieldObj = $(".valueEditorCode");
			fieldObj.removeAttr("contenteditable");
			var code = fieldObj.val().trim();

			// очищаем кооментарии 
			code = obj.clearCommens(code);

			// замена
			code = code.replace(/&amp;/gim, "&");
			code = code.replace(/</gim, "@@@@@lt@@@@@");
			code = code.replace(/>/gim, "@@@@@gt@@@@@");
			code = code.replace(/\+/gim, "@@@@@plus@@@@@");
			code = code.replace(/\?/gim, "@@@@@question@@@@@");
			code = code.replace(/&/gim, "@@@@@hlp_amp@@@@@");

			// форматирование
			code = code.replace(/\n/gim, "@@@@@sign_rn@@@@@");
			code = code.replace(/\t/gim, "@@@@@sign_tab@@@@@");

			code = code.replace(/^undefined/gim, '');
			code = code.replace(/undefined$/gim, '');

			// ставим путь
			code = code.replace(/href="\/\//gim, 'href="http://');
			code = code.replace(/href='\/\//gim, "href='http://");
			code = code.replace(/src="\/\//gim, 'src="http://');
			code = code.replace(/src='\/\//gim, "src='http://");

			// относительный путь 
			code = code.replace(/href="\/+/gim, 'href="');
			code = code.replace(/href='\/+/gim, "href='");
			code = code.replace(/src="\/+/gim, 'src="');
			code = code.replace(/src='\/+/gim, "src='");

			//
			code = code.replace(/%7B/gim, '@@@@@brace_start@@@@@');
			code = code.replace(/%7D/gim, '@@@@@brace_end@@@@@');
			code = code.replace(/%22/gim, '@@@@@double_quotes@@@@@');


			saveFuncV(code);

			History.record();
		});
	}

	/**
	* Очищаем коментарии
	*
	* @see 	this.setEvent()
	*/
	this.clearCommens = function(code)
	{
		var countSign = code.length;
		var bodyCommentV = false;
		var newCode = '';
		for (var iSign = 0; iSign < countSign; iSign++) {
			if (code[iSign] == "<" && code[iSign+1] == "!"
					&& code[iSign+2] == "-"
					&& code[iSign+3] == "-") {
				bodyCommentV = true;
			} else if (code[iSign] == "-" && code[iSign+1] == "-"
					&& code[iSign+2] == ">") {
				bodyCommentV = false;
				iSign += 3;
			}

			if (!bodyCommentV) newCode += code[iSign];
		}

		return newCode;
	}

/**********************************************************************************/
	
	

	/**
	* Событие Tab в textarea
	*
	* @see 	this.edit()
	*/
	this.setEventTab = function()
	{
		$("#modalEditorCode textarea").keydown(function(e) {
			if(e.keyCode === 9) { 
				var start = this.selectionStart;
				var end = this.selectionEnd;
				var $this = $(this);
				$this.val($this.val().substring(0, start)
					+ "\t"
					+ $this.val().substring(end));
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		});
	} // end function tab


	this.setEventTutorial = function()
	{
		Modal.tutorial($(".butModalCodeTutorialShow"), 'Режимы просмотра', 'IcGn_tixPww');
	}

/**************************************************************************************/

} // end class
/**
* Политика конфиденциальности
* 
*
*/
var PrivacyPolicy = new PrivacyPolicy();
function PrivacyPolicy() {

	this.getClassPrivacyPolicy = function()
	{
		return "hlp-privacy-policy";
	}

	this.getClassPersonalData = function()
	{
		return "hlp-personal-data";
	}

/**************************************************************************************************/
	
	/**
	* Добавление на все страницы
	*
	*
	* @see 	Site.insert()
	*/
	this.addAllPage = function()
	{
		// если установлен, то больше не ставим
		if (Data.site.data.privacy_policy && Data.site.data.privacy_policy.status_set) {
			return false;
		} else {
			if (!Data.site.data.privacy_policy) Data.site.data.privacy_policy = {};
			Data.site.data.privacy_policy.status_set = true;
		}

		// проходим каждую страницу
		for (var pageId in Data.site.pages) {
			this.addPropertyPage(pageId);
		}
	}


	/**
	* Добавление для страницы
	*
	* @see 	this.addAllPage()
	* @see 	ManagerPage.addNewPageInList()
	*/
	this.addPropertyPage = function(pageId)
	{
		// сохраняем текущию
		var pageOrg = Data.page;

		var buffer = Site.getBuffer();

		var page = Data.site.pages[pageId];
		buffer.html(page["html"]);

		Data.page = page;

		this.addPersonalData(buffer);
		this.addPrivacyPolicy(buffer);

		Data.site.pages[pageId]["html"] = buffer.html();
		buffer.html('');

		// возращяем текущию
		Data.page = pageOrg;
	}

/****************************************************************************************************/
	
	/**
	* Политика конфеденциальности
	*
	*
	* @see 	this.addAllPage()
	* @see 	this.addPrivacyPolicyPage()
	*/
	this.addPrivacyPolicy = function(elmParent)
	{	
		// уже есть
		if (this.existsPrivacyPolicy(elmParent)) return false;
		else if (!Site.isTypeLp()) return false;

		var block = this.getPrivacyPolicyHtml();
		elmParent.find(".section:last").after(block);

		var obj = $("."+this.getClassPrivacyPolicy());
		ElementSection.addNum(obj);
		Element.addNewId(obj);
	}

	this.existsPrivacyPolicy = function(elmParent)
	{
		var classV = this.getClassPrivacyPolicy();
		return elmParent.find("."+classV).length;
	}

	this.getPrivacyPolicyHtml = function()
	{
		var classV = this.getClassPrivacyPolicy();
		var block = '\
			<section class="element section hlp-section '+classV+'" elm-type="section" class-unique="'+classV+'">\
				<div class="element-content hlp-section-content section-content" data-basic-type="hlp-section-content">\
					<div class="element text hlp-privacy-policy-link" data-property-no-edit-class="true" elm-type="text" class-unique="hlp-privacy-policy-link">\
						<span class="element-added hlp-element-content element-content">\
							Политика конфиденциальности\
						</span>\
					</div>\
				</div>\
			</section>';

		return block;
	}

/****************************************************************************************************/

	/**
	* Добавляет персональные данные
	*
	* @see 	this.addAllPage()
	* @see  ElementForm.actionAfter()
	* @see  TemplateSection.addTemplate()
	*/
	this.addPersonalData = function(elmParent)
	{
		if (!elmParent || !elmParent.length) return false;

		var listFormV = elmParent.hasClass("form") ? elmParent : elmParent.find(".form");
		var linkBlock = this.getPersonalDataHtml();
		var countForm = listFormV.length;
		var isAddV = false;
		for (var iForm = 0; iForm < countForm; iForm++) {
			var elmFormV = listFormV.eq(iForm);
			if (this.existPersonalData(elmFormV)) continue;

			elmFormV.find(".submit").before(linkBlock);
			Element.addNewId(elmFormV);

			isAddV = true;
		}

		if (isAddV) Input.newCanvas();
	}

	/**
	* Есть или нет
	*
	* @see 	this.addPersonalData()
	*/
	this.existPersonalData = function(elmParent)
	{
		var classV = this.getClassPersonalData();
		return elmParent.find("."+classV).length;
	}

	/**
	* Отдает html ссылки
	*
	* @see 	this.addPersonalData()
	*/
	this.getPersonalDataHtml = function()
	{
		// что бы небыло ошибки
		if (!Element.obj)
			Element.obj = $(".element");
		
		var classRow = Element.getNewClassUnique("row", "row");
		var classCheckbox = Element.getNewClassUnique("input", "input");
		var classText = Element.getNewClassUnique("text", "text");

		var block = '\
			<div class="element row hlp-row hlp-row-col-2 '+this.getClassPersonalData()+' '+classRow+'" class-unique="'+classRow+'" count-column="2" count-row="1" elm-type="row">\
				<div class="element hlp-col column hlp-col-w-1" elm-type="column">\
					<input class="element checkbox '+classCheckbox+'" class-unique="'+classCheckbox+'" elm-type="checkbox" type="checkbox" name="confirmation-personal-data">\
				</div>\
				<div class="element hlp-col column hlp-col-w-11" elm-type="column">\
					<div class="element text hlp-personal-data-link '+classText+'" elm-type="text" class-unique="'+classText+'">\
						<span class="element-added hlp-element-content element-content">\
							Согласие на обработку персональных данных\
						</span>\
					</div>\
				</div>\
			</div>';

		return block;
	}


/*********************************************************************************************************/

} // end class
/**
* Выбор страницы
*
*
*/
ManagerPage.prototype = ManagerBasic;
var ManagerPage = new ManagerPage();
ManagerPage.parent = ManagerBasic;
function ManagerPage() {
	this.width = 510;
	this.type = "page";
	this.noDeleteLast = true;
	// название модального окна
	this.emptyBlockLabel = Resource.hlp_manager_page_empty_block;
/**********************************************************************************************/
	/**
	* Ставит параметры
	*
	* @see 	this.create()-parent
	*/
	this.setProperty = function()
	{
		this.title = Resource.hlp_manager_title_page;
		this.buttonName = Resource.hlp_manager_page_but_ok;

		this.listItem = Data.site.pages;
		this.currentId = Data.page["page_id"];
	}

	/**
	* Отдает текущий id страницы
	*/
	this.getSelectedId = function()
	{
		return Data.page["page_id"];
	} 
/***********************************************************************************************/
	/**
	* Выбор страницу
	*
	* @see 	parent
	* @see 	this.addNewElm() 
	*
	*/	
	this.chosenItem = function(elmEvent, pageId)
	{
		Grid.fixedType();

		if (elmEvent) this.parent.chosenItem(elmEvent);
		if (!pageId) pageId = elmEvent.attr("page");
		
		// фиксируем модальное
		if ($(".contentModal").css("display") == "block") ManagerModal.fix();
		// очищаем страницу 
		Site.formatPagesData();
		// фиксируем страницу
		Page.fix();
		// заменить новую страницу
		Page.replace(pageId);

		// чистим буффер
		ElementMan.clearBuffer();

		//ставим модульную сетку
		Grid.create();
	}


/*********************************************************************************************/
	/**
	* Удаляет страницу
	*
	*
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.deleteElm = function(deletedPageId, elmEvent)
	{
		var currentPageId = Data.page['page_id'];
			
		// убираем с массива
		delete Data.listPages[deletedPageId];
		delete Data.site.pages[deletedPageId];

		// если страница была добавлена, то убираем ее из добавленых
		if (Data.listAddPages[deletedPageId]) {
			delete Data.listAddPages[deletedPageId];
		// если небыла то заносим в массив удаленых
		} else {
			Data.listDeletePages[deletedPageId] = true;
		}

		// если была удалена текущая страница
		if (deletedPageId == currentPageId) {
			var currentElm = this.getElement(elmEvent);
			// страницу которую выделим после удаления текущей
			var selectPage = currentElm.next();
			if (!selectPage.length) {selectPage = currentElm.prev()}
			selectPage.click();
		}
	}

	this.actionAfterDelete = function()
	{
		// тариф
		Rate.setCountPage();
	}
/*******************************************************************************************/
	/**
	*  Добавляем новую страницу
	* 
	*/
	this.addNewPageInList = function(pageId)
	{
		// фиксируем страницу
		Site.fix();

		var newPage = {};
		var page = Data.listPages[pageId];
		var newName = ''; 

		// копируем
		// проходим параметры страницы
		for (var pageKey in page) {
			var pageValue = page[pageKey];
			// модифицируем параметры
			if (pageKey == "page_id") { 
				pageValue = this.getNewPageId();
				var newPageId = pageValue;
			} else if (pageKey == "data") { 
				Page.fix(); //фиксируем, что бы сохранилось в массиве
				pageValue = copyArray(pageValue);
			} else if (pageKey == "url_name") {
				pageValue = "page_"+newPageId;
				newName = pageValue;
			} else if(pageKey == "name") {
				pageValue = "page_"+newPageId;
			}
			// добавляем параметр
			newPage[pageKey] = pageValue;
		}

		// добавляем в массив
		Data.listPages[newPageId] = newPage;
		// заносим в массив добавления
		Data.listAddPages[newPageId] = true;
	}

/*******************************************************************************************/
	/**
	* Изменить имя
	*
	* @see 	this.focusoutEditPageName()
	*/
	this.editName = function(newName, editPageId)
	{
		if (newName.match(/hlp_/)) {
			newName = newName.replace(/hlp/gim, "usr"); 
		}

		// заносим в массив
		Data.listPages[editPageId]["name"] = newName;
		Data.listPages[editPageId]["url_name"] = newName;

		//изменяем в редакторе, если текущая страница
		if (editPageId == Data.page.page_id) $(".butSelectPageName").text(newName);
	}
/*********************************************************************************************/
	/**
	* Добавляет новый элемент
	*
	*/
	this.addNewElm = function()
	{
		// новая страница
		var newPage = {};
		var newPageId = this.getNewPageId();
		newPage.page_id = newPageId;
		
		newPage.name = "page_"+newPageId; 
		newPage.url_name = "page_"+newPageId; 
		
		newPage.html = this.getNewHtml();
		newPage.data = {};
		newPage.data.css = {};
		
		// добавляем в массив
		Data.listPages[newPageId] = newPage;
		// заносим в массив добавления
		Data.listAddPages[newPageId] = true;

		// политику конфиденциальности
		PrivacyPolicy.addPropertyPage(newPageId);
	}

	/**
	* Отдает новое имя
	*
	* @see this.addNewElm()
	*/
	this.getNewName = function()
	{
		var newName = "new_page"; 
		if (!this.isExistName(newName)) return newName;

		for (var i = 1; i < 100; i++) {
			var nameItem = newName+"-"+i;
			if (!this.isExistName(nameItem)) {
				newName = nameItem;
				break;
			}
		}

		return newName;
	}
	

	/**
	* Отдает html для новой страницы
	*
	* @see this.addNewElm() 	
	*/
	this.getNewHtml = function()
	{
		var listSection = '';
		var countSection = 4;
		for (var iSection = 1; iSection <= countSection; iSection++) {
			listSection += '<section class="element hlp-section section section-'+iSection+'" elm-type="section" class-unique="section-'+iSection+'"><div class="element-content hlp-section-content section-content"></div></section>';
		}

		return listSection;
	}

	/**
	* Отдает id  новой страницы
	*
	* @see 	this.addNewPageInList()
	*/
	this.getNewPageId = function() {
		var newId = parseInt(Data.site.data.max_page_id);
		if (!newId) newId = 0;
		newId++;
		Data.site.data.max_page_id = newId;

		return newId;
	} 
/************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	*/
	this.setSelectListItem = function()
	{
		var select = $(".valuePage, .valuePageFormRedirect");
		var currentValue = select.find(".option[chosen='true']").attr("value");

		// формируем список 
		var listPage = Data.site.pages;
		

		var listOption = '<div class="option" value="none">'+Resource.main_value_none+'</div>';

		for (pageId in listPage) {
			var pageName = listPage[pageId].name;
			if (Page.isTypeMain(pageName)) continue;

			listOption += '<div class="option" value="'+pageId+'">'+pageName+'</div>';
		}

		// добавляем его
		select.find(".optionBlock").html(listOption);
		Select.set(select, currentValue);
	}
/*************************************************************************************************/
	/**
	* Выбор(изменение) домашней страницы 
	*/
	this.setEventChooseHome = function()
	{
		var butHome = $(".selectPageIconHome");
		butHome.off("click");
		butHome.on("click", function() {
			var elmEvent = $(this);
			// id
			var oldId = $(".selectPageIconHome[chosen=true]").closest(".selectPageItem").attr("page");
			var newId = elmEvent.closest(".selectPageItem").attr("page");
			
			// ставим и убираем id
			var listPages = Data.listPages;
			if (oldId) listPages[oldId]["url_name"] = "";
			listPages[newId]["url_name"] = "index";

			// отмечаем
			butHome.removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			// сохраняем
			Site.save(true);

			return false;
		});
	}


	/**
	* Ставим домашнию страницу при удалении
	*
	* @see 	ManagerBasic.setEventConfirmationDeletePage()
	*/
	this.setHomePageByDelete = function()
	{
		// если не удалена домашняя
		if ($(".selectPageIconHome[chosen='true']").length) return false;

		// ставим в массиве
		var firstPage = $(".selectPageItem:first");
		if (!firstPage.length) return false;

		var pageId = firstPage.attr("page");
		Data.listPages[pageId]["url_name"] = "index";
		

		// отмечаем кнопку
		firstPage.find(".selectPageIconHome").attr("chosen", "true");
	}

	/**
	*
	*
	*/
	this.actionAfterCreate = function()
	{
		Rate.setCountPage();
	}

/*******************************************************************************************/

} //end class











/**
* Выбор модального окна
*
*
*/
ManagerModal.prototype = ManagerBasic;
var ManagerModal = new ManagerModal();
ManagerModal.parent = ManagerBasic;
function ManagerModal() {
	this.width = 470;
	this.type = "modal";
	// название модального окна
	this.title = Resource.hlp_manager_title_modal;
	// название кнопки добавить
	this.buttonName = Resource.hlp_manager_modal_but_ok;
	this.emptyBlockLabel = Resource.hlp_manager_modal_empty_block;
/**********************************************************************************************/
	/**
	* Действия после создания
	*
	* @see 	this.create()
	*/
	this.actionAfterCreate = function() 
	{
		// return false;
		// // если нету выбранного
		// var chosneItem = $(".selectPageItem[selected='selected']");
		// // console.log($(".modalWrap .modal").length)
		// if (!chosneItem.length || !$(".contentModal .modal").length) {
		// 	$(".selectPageItem:first").click();	
		// }
	}
/********************************************************************************************/
	/**
	* Ставит параметры
	*
	* @see 	this.create()-parent
	*/
	this.setProperty = function()
	{
		// список элементов
		this.listItem = this.getListItem();
		// текущий id
		this.currentId = this.getCurrentId();
	}

	/**
	* Устанавливает список элементов
	*
	* @see 	this.setProperty()
	*/
	this.getListItem = function()
	{
		var listItem = {};
		var listModal = this.getListModal();
		
		var countModal = listModal.length;
		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			listItem[i] = {};
			listItem[i]["name"] = modal.attr("name");
			listItem[i]["id"] = modal.attr("id");
		}

		return listItem;
	}

	/**
	* Отдает текущий id страницы
	*/
	this.getSelectedId = function()
	{
		return $(".contentModal .modal").attr("elm-id");
		// var modalId = $(".contentModal .modal").attr("elm-id");
		// var modalId = $(".butSelectModalName").attr("elm-id");
		// if (Element.obj.attr("data-action") == "modal") {
		// 	var dataNum = Element.obj.attr("data-value");
		// 	return $(".modal[data-num='"+dataNum+"']").attr("id");
		// } else {
		// 	return false;
		// }
		// return 
		// return modalId;
	} 
/**********************************************************************************************/
	/**
	* Выбор модального окна
	*
	* @see 	parent
	* @see 	this.addNewElm()
	* @see 	TemplateSection.insertTemplatePage() 
	*/
	this.chosenItem = function(elmEvent, modalId) {
		if (elmEvent) this.parent.chosenItem(elmEvent);
		// переключаемся на модальное
		Screen.toggleModal();
		
		// фиксируем
		this.fix();
		//выбор страницы
		if (!modalId && elmEvent) modalId = elmEvent.attr("page");
		this.setInCanvas(modalId);

		setTimeout(function() {
			$(".contentModal .modal:first").mousedown().mouseup();
		}, 100);

	};

	/**
	* Фиксируем модальное  окно
	*
	* @see 	this.chosenItem()
	* @see 	this.deleteElm()
	* @see 	this.addNewPageInList()
	* @see 	EditorController.setEventTab()
	* @see 	Site.fix()
	*/
	this.fix = function()
	{
		if (!Screen.isModal()) return false;

		var modal = $(".contentModal .modal");
		var modalId = modal.attr("elm-id");
		var block = modal.parent().html();
		var modalObj = this.getModal(modalId);
		var modalName = modalObj.attr("name");
		modalObj.parent().html(block);

		// убираем атрибут и ставим id 
		var objSiteContent = Element.getSiteContentObj();
		objSiteContent.find(".listModal .modal[elm-id='"+modalId+"']")
							.removeAttr("elm-id")
							.attr("id", modalId)
							.attr("name", modalName);
	}
/***********************************************************************************************/
	/**
	* Удаляет элемент
	*
	*
	* @see 	this.setEventConfirmationDeletePage()
	*/
	this.deleteElm = function(modalId)
	{ 
		var currentModalId = this.getCurId();

		// фиксируем текущий modal
		if (Screen.isModal()) this.fix();
		
		var elmModal = this.getModal(modalId);

		// удаляем modal
		ElementMan.delete(elmModal);

		// убираем с поля
		// $(".contentModal .modal[elm-id='"+modalId+"']").remove();

		// убираем у элементов
		$(".element[data-action='modal']").filter("[data-value='"+modalId+"']").attr("data-value", "none");
		// у формы 
		$("input[redirect-type='modal']").filter("[value='"+modalId+"']").attr("value", "none");
		
		// если удалена текущая
		if (modalId == currentModalId && Screen.isModal()) {
			$(".selectPageItem:first").click();
		}

	}

	this.actionAfterDelete = function()
	{
		if (Element.obj.hasClass("site")) {
			Element.obj.find(".section:first").mousedown().mouseup();
		}
	}

	/**
	* Добавляет новый элемент
	*
	* @see 	parent
	* @see 	this.setBlockNoModal()
	*/
	this.addNewElm = function()
	{
		// переключаем на desktop
		Screen.setDesktop();
		// создаем элемент
		ElementModal.create();
	}

	/**
	*  Добавляем новую страницу 
	*/
	this.addNewPageInList = function(orgModalId) {
		if (Screen.isModal()) this.fix();

		var modal = this.getModal(orgModalId);
		// параметры
		var modalContent = modal.html();
		var modalClass = modal.attr("class");
		var classUnique = modal.attr("class-unique");
		var modalName = modal.attr("name")+"_copy";
		var modalId = ElementModal.getNewModalId();
		var modalNum = modalId;//Element.getMaxNumberClass($(".modal"), "data-num");

		// добавляем
		var block = '<div class="new-element '+modalClass+'" data-num="'+modalNum+'" id="'+modalId+'" elm-type="modal" name="'+modalName+'" class-unique="'+classUnique+'">'+modalContent+'</div>';
		block = '<div class="modalWrap">'+block+'</div>';
		// block = block;
		$(".contentWrap .listModalPage").append(block);

		var newModal = $(".new-element").removeClass("new-element");
		Element.addNewId(newModal);

		this.fix();
	}

/*******************************************************************************************/
	/**
	* Изменить имя
	*
	* @see 	this.focusoutEditPageName()
	*/
	this.editName = function(newName, modalId)
	{
		var modal = this.getModal(modalId);
		var oldName = modal.attr("name");
		modal.attr("name", newName);

		// ставим на кнопки
		var but = $(".butSelectModalName");
		if (but.text() == oldName) but.text(newName);
	}
/************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает список страниц
	*
	* @see 	this.setEventNoModal()
	* @see 	ElementModal.createAction()
	* @see 	this.addTemplateModal()
	*/
	this.setSelectListItem = function()
	{
		// формируем список 
		var listOption = '<div class="option" value="none">Нет</div>';
		var listModalPage = this.getModalPropertyPage(this.getListModalParent().html());
		listOption += this.listOptionFromProperty(listModalPage);
		// для многостраничника
		if (!Site.isTypeLp()) {
			if (Data.page.page_id != 1) {
				var modalHeader = this.getModalPropertyPage(Data.site.pages[1]["html"]);
				listOption += '<div class="optionLabel">Header</div>';
				listOption += this.listOptionFromProperty(modalHeader);
			}
			
			if (Data.page.page_id != 2) {
				var modalFooter = this.getModalPropertyPage(Data.site.pages[2]["html"]);
				listOption += '<div class="optionLabel">Footer</div>';
				listOption += this.listOptionFromProperty(modalFooter);
			}
		}

		// добавляем его
		var listSelect = $(".valueModal, .valueFormRedirectModal, .selectSettingTrigerModalScroll");
		listSelect.find(".optionBlock").html(listOption);
		//ставим текущие 
		var selectVal = listSelect.find(".option[chosen='true']").text();		
		//если был модальное было удалено
		if (!selectVal) {
			selectVal = "Нет";
			listSelect.find(".option[value='none']").attr("chosen", "true");
		} 
		// ставим значение
		listSelect.find("input[type='button']").val(selectVal);
	}

	this.getModalPropertyPage = function(pageHtml)
	{
		var bufferV = Site.getBuffer();
		bufferV.html(pageHtml);
		var listModalObj = bufferV.find(".modal");
		var listModalProperty = [];

		var countModal = listModalObj.length;
		for (var iModal = 0; iModal < countModal; iModal++) {
			var modalObj = listModalObj.eq(iModal);
			listModalProperty.push({
				"id":modalObj.attr("id"),
				"name" : modalObj.attr("name"),
				"data-num" : modalObj.attr("data-num")
			});
		}

		Site.clearBuffer();

		return listModalProperty;
	}

	this.listOptionFromProperty = function(listModal)
	{
		var listOption = "";
		var countModal = listModal.length;
		for (var i = 0; i < countModal; i++) {
			var modal = listModal[i];
			var modalId = modal["id"];
			var modalName = modal["name"];
			var modalNum = modal["data-num"];
			listOption += '<div class="option" value="'+modalNum+'">'+modalName+'</div>';
		}

		return listOption;
	}

	/**
	* Отдает список options
	*
	* @see 	Store.getModalContent()
	*/
	this.getListOptions = function()
	{
		var listModal = this.getListModal();
		var listOption = '<option value="none">Нет</option>';
		var countModal = listModal.length;

		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			var modalName = modal.attr("name");
			var modalNum = modal.attr("data-num");
			listOption += '<option value="'+modalNum+'">'+modalName+'</option>';
		}

		return listOption;
	}

/**********************************************************************************************/
	/**
	* Вставляет модальное окно в поле
	*
	* @see 	this.chosenItem()
	* @see 	this.setBlockNoModal()
	* @see 	EditorController.setEventTab()
	*/
	this.setInCanvas = function(modalId)
	{	
		if (!modalId) modalId = this.getCurrentId();
		
		//нету модального окна 
		if (!modalId) {
			this.setBlockNoModal();
			return false;
		}
		
		var parentModal = $(".contentModal");
		
		// формируем модальное окно
		var block = this.getModalBlock(modalId);
		
		// вставляем на страницу
		var modalWrapObj = parentModal.find(".modalWrap");
		modalWrapObj.html(block);
		modalWrapObj.height($("body").height()*0.87);
		// ставим id как атрибут
		var elmModal = parentModal.find(".modal");
		elmModal.removeAttr("id").attr("elm-id", modalId);

		// сбрасываем историю
		History.reset();
		
		// если он стоит 
		if (parentModal.css("display") == "block" && elmModal.length) {
			// ставим события
			Input.newCanvas();
			// отмечаем
			// elmModal.mousedown().mouseup();
		}

		// ставим имя
		this.setCurrentName(modalId);
	}

	/**
	* Отдает блок модального окна
	*
	* @see 	this.setInCanvas()
	*/
	this.getModalBlock = function(modalId)
	{
		var modal = this.getModal(modalId);
		// var modalContent = modal.html();
		// if (!modalContent) modalContent = '';
		// var modalClass = modal.attr("class");
		// var modalClassUnique = modal.attr("class-unique");
		// var block = '<div class="'+modalClass+'" id="'+modalId+'" elm-type="modal" class-unique="'+modalClassUnique+'">'+modalContent+'</div>';
		
		var block = modal.parent().html();

		return block;
	}

	/**
	* Устанавливает блок когда нет модального
	*
	* @see 	this.deleteElm()
	* @see 	this.setInCanvas()
	*/
	this.setBlockNoModal = function()
	{
		// добавляем модальное
		var blockNoModal = '<div class="butAddModal">'+Resource.hlp_manager_modal_but_ok+'</div>';
		$(".contentModal .modalWrap").html(blockNoModal);

		this.setEventNoModal();
	}

	/**
	* События на кнопку когда нет модыльных окон 
	*
	* @see 	this.setBlockNoModal();
	*/
	this.setEventNoModal = function()
	{
		// ставим события
		var obj = this;
		$(".butAddModal").off("mousedown");
		$(".butAddModal").on("mousedown", function() {
			// создаем модальное
			obj.addNewElm();
			// вставляем его на страницу
			var modalId = 'modal1';
			obj.setInCanvas(modalId);

			// ставим список
			obj.setSelectListItem();
		});
	}
/***********************************************************************************************/
	/**
	* Добавляет шаблон модального
	*
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.addTemplateModal = function(modalHtml)
	{
		modalHtml = '<div class="modalWrap">'+modalHtml+'</div>';
		var listModalParentObj = ManagerModal.getListModalParent();
		listModalParentObj.append(modalHtml);

		// новый id
		var listModal = ManagerModal.getListModal();
		var newModal = listModal.filter(":last");
		var newModalId = Element.getNewElmId("modal");
		newModal.attr("id", newModalId);

		// новый num 
		var modalNum = Element.getMaxNumberClass($(".modal"), "data-num");
		newModal.attr("data-num", modalNum);
		// console.log(modalNum)

		// имя
		newModal.attr("name", "modal " + modalNum);

		// убираем не нужное
		newModal.removeAttr("elm-id");

		// обновляем select 
		this.setSelectListItem();

		return newModal;
	}

	/**
	* Отдает родителя списка модальных
	*
	* @see 	this.addTemplateModal()
	* @see 	this.getListModal()
	*/
	this.getListModalParent = function()
	{
		var parentV = ElementModal.getListParent();

		return parentV;
	}

	/**
	* Отдает список модальных окон
	*
	* @see 	this.setSelectListItem()
	* @see 	this.getListItem()
	*/
	this.getListModal = function()
	{
		var listModalParentObj = this.getListModalParent();
		return listModalParentObj.find(".modal");
	}

	/**
	* Отдает текущий id
	*
	* @see 	this.setProperty()
	* @see 	this.setCurrentName()
	* @see 	this.setInCanvas()
	* @see 	this.setSelectListItem()
	*/
	this.getCurrentId = function()
	{
		var elm = Element.obj;
		if (!elm) return false;

		var actionType = elm.attr("action-type");
		var actionValue = elm.attr("action-value");
		if (actionValue == "none") actionValue = "";
		var modal = $(".contentModal .modal");
		var currentId = '';

		// id modal у элемента
		if (actionType == "modal" && actionValue) {
			currentId = actionValue;
		} else {	
			// если есть на полотне
			if (modal.length) {
				currentId = modal.attr("elm-id")
			// отдаем первый, если нету на полотне
			} else {
				var listModal = this.getListModal();
				currentId = listModal.filter(":first").attr("id");
			}
		}  

		return currentId;
	}

	/**
	* Отдает модальное окно
	*
	* 
	*/
	this.getModal = function(modalId)
	{
		var objSiteContent = Element.getSiteContentObj();
		return objSiteContent.find(".listModal #"+modalId);
	}
/************************************************************************************************/
	/**
	* Устанавливает название текущего модального
	*
	* @see 	this.setInCanvas()
	* @see 	ElementSettingClick.editModal()
	* @see 	ElementSettingClick.setModal()
	*/
	this.setCurrentName = function(modalId)
	{
		if (!modalId) modalId = this.getCurrentId();
		if (modalId) var modalName = this.getModal(modalId).attr("name");
		else var modalName = Resource.main_value_none;
		$(".butSelectModalName").html(modalName).attr("elm-id", modalId);
	}

/***********************************************************************************************/
	/**
	* Очищает полотно
	*
	*
	* @see 	Page.replace()
	*/
	this.clearCanvas = function() 
	{
		$(".contentModal .modalWrap").html("");
		ManagerModal.setCurrentName();// ставим имя
	}

/**************************************************************************************************/	
} //end class












/**
* История
*
*/ 
var History = new History();
function History() {
	/**
	* @var 	array 	список данных о элементах
	* @set 	this.record()
	* @see 	this.set()
	*/
	this.listData = [];

	/**
	* @var 	array 	список страниц
	* @set 	this.record()
	* @see 	this.set()
	*/
	this.listPage = [];

	/**
	* @var 	array 	текущий номер
	* @set	this.record(), this.back(), this.next()	
	* @see 	this.set()
	*/
	this.currKey = 'false';

	/**
	* @var 		int 			лимит записей в истории
	* @see 		this.record()
	*/
	this.limit = 30;

	/**
	* Статус фиксирования истории
	*
	* @set 	Key.incDecInput() 
	* @set 	SpecialInput.editValue()
	*/
	this.isFixed = true;

	this.noFixedAll = false;

	this.attr = {};
	this.attr.no_fixed = "data-history-no-fixed";
/***********************************************************************************/
	/**
	* Записует в историю
	* 
	* @see 	ElementStyleController.setEventMenuEdit()	изменение стиля
	* @see 	ElementManController.setEvent()				вставить элемент
	* @see 	ElementBasic.create()						добавление элемента
	* @see 	this.newPage() 								новая страница
	* @see 	PageStruct.moveElm()
	* @see 	Resize.ssetEventMouseUp()
	* @see 	TextEditor.hide()
	* @see 	Guides.guidesDown()
	* @see 	Input.init()
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	StyleMenuFixed.setEventDelete()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	EditElementImage.saveVideo()
	* @see 	ElementSlider.setEventAdd(), .setEventDelete() 
	* @see 	ElementMan.delete()
	* @see 	EditElementImage.save()
	* @see 	PageSetting.setEventCode(), .setEventSeo()
	*/
	this.record = function()
	{ 
		//ключ
		this.currKey = this.currKey == 'false' ? 0 : this.currKey + 1;
		var key = this.currKey;

		//устанавливаем значение
		//страница
		this.listPage[key] = this.getHtml();
		//данные
		/**
		* @todo  помещять стили css
		*/
		var listData = [
			copyArray(Data.site.data), 
			copyArray(Data.page.data)];
		this.listData[key] = JSON.stringify(listData);
		
		//очищяет первый элемент, если превышен лимит
		if (key > this.limit) {
			this.clearExcess();
		}
		
		//очищаем то что после ключа если после шага назад, произошла запись истории
		var pos = key+1;
		if (this.listPage[pos]) {
			this.clearAfter(pos);
		}

		//убираем кнопку вперед 
		$('.topMenuNext').attr('status', 'false');
		//если первая запись в истории, показываем кнопку назад
		if (key == 1) $('.topMenuBack').attr('status', 'true');

		/********/
		//фиксируем шаг для автосохранения, самое первое не фиксируем
		if (key > 0) Site.addStepAutoSave(); 
		// статус - не опубликован
		Site.setStatusPublishedNo();

		History.isFixedAll = false;
	}
	
	/**
	* Заменяем картинки в истории
	*
	* @see 	EditElementImage.replaceImageForPage()
	*/
	this.replaceImage = function(oldSrc, newSrc)
	{
		var patter = new RegExp(oldSrc, "gim");
		// страница
		var historyPage = JSON.stringify(History.listPage).replace(patter, newSrc);
		History.listPage = JSON.parse(historyPage);
		// данные
		var historyData = JSON.stringify(History.listData).replace(patter, newSrc);
		History.listData = JSON.parse(historyData);
	}
/*************************************************************************************/
	/**
	* Отдает html страницы
	*
	* @return 	html 	текущию страницу 
	*
	* @see 		this.record()
	*/
	this.getHtml = function()
	{
		// Resize.remove();
		var contentHtml = this.getParentContent().html();
		// Resize.create();

		return contentHtml;
	}
	
	/**
	* Отдает родителя содержимого
	*
	* @see 	this.getHtml()
	* @see 	this.set()
	*/
	this.getParentContent = function()
	{
		var elmContent = $('.content');
		// страница иил модальное
		if (elmContent.css("display") == "block") var parentContent = elmContent;
		else  var parentContent = $(".contentModal");

		return parentContent;
	}
/*************************************************************************************/
	/**
	* Если привышен лимит то убирает первый элемент
	*
	* @uses 	this.currKey 		получаем текущий ключ
	* @uses 	this.listPage 		список страниц
	* @uses 	this.listData 		список данных
	* @see 		this.record()
	*/
	this.clearExcess = function() {
		this.listPage.splice(0, 1);
		this.listData.splice(0, 1);
		//меньшаем ключ на один	
		this.currKey--;
	}
/************************************************************************************/
	/**
	* Очищяет массив после указаного ключа
	*
	* @see 	this.record()
	* @see 	Page.replace()
	*/
	this.clearAfter = function(key)
	{
		//сколько записей нужно убрать
		var count = this.listPage.length - key; 
		//убираем записи
		this.listPage.splice(key, count);
		this.listData.splice(key, count);
	}

/**********************************************************************************/
/*********************************************************************************/
	/**
	* Устанавливаем запись из истории
	* 
	* @uses 	this.currKey 			получаем текущий ключ
	* @uses 	this.listPage 			список страниц
	* @uses 	this.listData 			список данных
	* @uses 	SetEvent.newCanvas() 	установить события для полотна
	* @uses 	this.setPosTabHover() 	установить положение вкладки hover
	*
	* @see 		this.back(), this.next()
	*/
	this.set = function() {
		var parentContent = this.getParentContent();

		//ключ
		var key = this.currKey;
		//устанавливаем текущию запись
		//страница
		parentContent.html(this.listPage[key]);
		//ставим css стили
		var listData = JSON.parse(this.listData[key]);
		// основа страницы
		Data.site.data = listData[0];
		ElementCss.createListTagStyle("site");

		// страница
		Data.page.data = listData[1];
		ElementCss.createListTagStyle("page"); 

		//ставим события для полотна
		Input.newCanvas();
		// ставим тип экрана
		$(".butShowItem[screen='"+$(".content").attr("screen")+"']").mousedown();

		//эмитируем клик
		$('.elementSelected').removeClass('elementSelected')
			.mousedown()
			.mouseup();

		//установить положение вкладки hover
		/**
		* @todo  потом доделать, когда будит понятно как будит ставиться hover
		*/
		// this.setPosTabHover();
		
		// ставим скрол
		StyleCanvas.setScrollTopElm(Element.obj);
		// $(".content").scrollTop(scrollTop);
		// установка кнопки "Назад на страницу"
		EditorController.setEventTab();
	}
/***************************************************************************************/
	/**
	* Установить положение вкладки hover
	*
	* @see 	this.set()
	*/
	this.setPosTabHover = function()
	{
		//если это не первый клик
		var data = Data.getElement($('.elementSelected').attr('id'));
		if (data && $('.elementSelected').length) {
			//если у элемента есть hover
			if (data.is_hover) {
				//ставим вкладку в положение соответсвующего текущему состоянию
				var status = data.style.status;
				$('.rightHoverNavItem[type="'+status+'"]')
					.mousedown();//@event 	StyleMenu.toggleHover()
			}
		}
	}
/**************************************************************************************/
	/**
	* Обнулить
	*
	* @see 	Page.replace()
	* @see 	EditorController.setEventTab()
	* @see 	ManagerModal.setInCanvas()
	*/
	this.reset = function()
	{
		$(".topMenuBlockHistory .topMenuItem").attr("status", "false");
		this.listData = [];
		this.listPage = [];
		this.currKey = "false";
		this.record();
	}
/************************************************************************************/
/***********************************************************************************/
	/**
	* Назад по истории
	*
	* @uses 	this.set() 			устаналиваем запись из истории
	* @uses 	this.currKey 		получаем текущий ключ
	* @see 		PageController.setEventHistory()
	*/
	this.back = function() {
		//устанавливаем значение
		this.currKey--;
		//востанавливаем историю
		this.set();

		//устанавливаем кнопку вперед
		$('.topMenuNext').attr('status', 'true');
		//если первая запись убираем кнопку назад
		if (!this.currKey) $('.topMenuBack').attr('status', 'false');
	}

	/**
	* Вперед по истории
	*
	* @uses 	this.set() 			устаналиваем запись из истории
	* @uses 	this.currKey 		устанавливает значение
	* @see 		PageController.setEventHistory()
	*/
	this.next = function() {
		//устанавливаем значение
		this.currKey++;
		//востанавливаем историю
		this.set();

		//показать кнопку назад
		$('.topMenuBack').attr('status', 'true');
		//если последняя запись, убираем кнопку вперед
		if (this.currKey >= (this.listData.length-1)) $('.topMenuNext').attr('status', 'false');
	}
/****************************************************************************/


}










var TemplateSection = new TemplateSection();
function TemplateSection() {
	// режим разработчика
	// this.developerReplaceStatus = true;
	// не сохранять аватар
	// this.deleloperNoSaveAvatar = true;
	
	/**************************************/
	/**************************************/

	this.class = {};
	this.class.list_but_section = "sectionListButTemplate";
	this.class.but_section_add = "sectionButAddTemplate";

	this.value = {};

	this.attr = {};
	this.attr.std_folder_id = "data-std-folder-id";


	this.currentType = 'standart';
	this.currentNavItemIndex = 10;

	// последни добавленый щаблон
	this.folderIdLastAddTemlate = false;
	this.managerOperator = false;


	this.getClassButSectionAdd = function()
	{
		return this.class.but_section_add;
	}

	this.isCurTypeStandart = function(typeAccess)
	{
		if (!typeAccess) typeAccess = this.currentType;
		return !this.isAccessTypeUser(typeAccess);
	}

	this.getStdType = function()
	{
		return "standart";
	}

	this.setStdType = function()
	{
		this.currentType = this.getStdType();
	}

	this.getAttrStdFolderId = function()
	{
		return this.attr.std_folder_id;
	}

/************************************************************************************/

	/**
	* Установка события
	*
	* @see 	Resize.create()
	*/
	this.setEvent = function()
	{
		this.setEventShowManager();
		this.setEventCreateTemplate();
		Rate.setCountTemplate();
	}

	/**
	* Добавление шаблона
	*
	* 
	*/
	this.setEventShowManager = function()
	{	
		var obj = this;
		var butTemplate = $(".butAddTemplateSection");
		butTemplate.off("mousedown");
		butTemplate.on("mousedown", function() {
			obj.showManager();
		});
	}

	/**
	* Навигация по типам
	*
	* @see 	this.setEventShowManager()
	*/
	this.setEventNavType = function()
	{
		var obj = this;
		var butObj = $(".managerTemplateTypeNavItem");
		butObj.off("mousedown");	
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			var navType = elmEvent.attr("data-type");
				
			obj.currentType = navType;

			butObj.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");

			$(".templateNavList").css("display", "none")
								.filter("[data-type='"+navType+"']")
								.css("display", "block");

			var firstNavItemV = obj.getFirstNavItem();
			firstNavItemV.mousedown();
			
			$(".managerTemplateListItem").attr("data-type", navType);				
			
			return false;
		});
	}

/********************************************************************************/

	/**
	* Показываем 
	*
	* @see 	this.setEventManager()
	* @see 	this.setEventButSectionAddNew()
	*/
	this.showManager = function()
	{	
		var titleV = Resource.hlp_template_modal_title_add;

		var content = this.getModalContentManager();
		Modal.create({
			"id":"modalTemplate",
			"title":titleV,
			"width":1100,
			"top":10,
			"content":content
		});

		this.setNav('my');
		this.setNav('standart');
			
		/***********/
		$(".managerTemplateTypeNavItem")
				.removeAttr("data-chosen")
				.filter("[data-type='"+this.currentType+"']")
				.attr("data-chosen", "true");

		var currItemIndex = this.currentNavItemIndex;
		if (!currItemIndex) {
			for (var currItemIndex in Data.user.folder_template) {
				if (this.currentType == Data.user.folder_template[currItemIndex]["type_access"]) {
					break;
				}
			}
		}

		$(".templateNavList")
				.css("display", "none")
				.filter("[data-type='"+this.currentType+"']")
				.css("display", "block")
				.find(".managerTemplateNavItem[data-id='"+currItemIndex+"']")
				.mousedown().mouseup();

		// установка событий 
		this.setEventNavType();
	}

	/**
	* Отдает содержимое
	*
	* @see 	this.showManager()
	*/
	this.getModalContentManager = function()
	{
		var content = '\
			<div class="managerTemplateNav">\
				<div class="managerTemplateTypeNav">\
					<div class="managerTemplateTypeNavItem" data-type="standart" data-chosen="true">\
						'+Resource.hlp_template_modal_nav_standart+'\
					</div>\
					<div class="managerTemplateTypeNavItem" data-type="my" data-chosen="true">\
						'+Resource.hlp_template_modal_nav_my+'\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="templateNavList" data-type="standart">\
					<div class="listManagerTemplateFolder"></div>\
					<div class="clear"></div>\
				</div>\
				<div class="templateNavList" data-type="my">\
					<div class="listManagerTemplateFolder"></div>\
					<div class="clear"></div>\
					<div class="butAddFolderTemplate">'+Resource.hlp_template_modal_add_folder+'</div>\
				</div>\
			</div>\
			<div class="managerTemplateListItem" data-type="'+this.currentType+'"></div>\
			<div class="clear"></div>';

		return content;
	}

	/**
	* Устанавливает навигацию
	* 
	* @see 	this.showManager()
	* @see 	this.setEventButAddFolder()
	* @see 	this.setEventDeleteFolder()
	* @see 	this.setEventButTemplateMove()
	*/
	this.setNav = function(typeAccess)
	{
		if (!typeAccess) {
			typeAccess = this.getCurrentTypeAccess();
		}

		var folderId = this.getFolderObj().attr("data-id"); 

		var navBlock = '';
		if (this.isAccessTypeUser(typeAccess)) {
			var listFolder = Data.user.folder_template;
		} else {
			var listFolder = this.listFolderStandart;
		}
		
		for (var iFolder in listFolder) {
			var folderItem = listFolder[iFolder];

			navBlock += '\
				<div class="managerTemplateNavItem" data-id="'+folderItem['id']+'">\
					<span class="folderNameTemplate">'+folderItem['name']+'</span>\
					<div class="managerNavItemListBut">\
						<img src="/img/editor/edit.png" alt="" label="'+Resource.hlp_template_label_folder_edit+'" class="butFolderTemplate butFolderTemplateEdit" />\
						<img src="/img/editor/delete-2.png" alt="" label="'+Resource.hlp_template_label_folder_delete+'" class="butFolderTemplate butFolderTemplateDelete" />\
						<div class="clear"></div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			';
		}
		
		// если нет, папки то создаем
		if (!navBlock.trim()) {
			this.addNewFolder("First "+typeAccess, typeAccess, true);
			this.setNav(typeAccess);
			return false;
		}

		var parentContentObj = $(".templateNavList[data-type='"+typeAccess+"']");
		parentContentObj.find(".listManagerTemplateFolder").html(navBlock);
		this.getFolderObj(folderId).attr("data-chosen", "true");

		// ставим событие
		this.setEventFolder();
	}

	this.isAccessTypeUser = function(typeAccess)
	{
		if (!typeAccess) typeAccess = this.getCurrentTypeAccess();
		return typeAccess == "my";
	}

/*********************************************************************************/
/*********************************************************************************/
	
	/**
	* Отдает объект папки
	*
	* @see 	this.setNav()
	* @see 	this.setStatusButDeleteFolder()
	*/
	this.getFolderObj = function(folderId)
	{
		var listFolder = $(".managerTemplateNavItem");

		if (folderId) return listFolder.filter("[data-id='"+folderId+"']");
		else return listFolder.filter("[data-chosen='true']");
	}

	/**
	*  Устанавливает статус кнопки - удалить папку
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setStatusButDeleteFolder = function()
	{
		var typeAccess = this.getCurrentTypeAccess();

		var managerNavItemObjV = $(".managerNavItemListBut");
		if (this.isAccessTypeUser(typeAccess)) {
			managerNavItemObjV.removeAttr("style");
		} else {
			managerNavItemObjV.css("display", "none");
			return false;
		}

		var countNavItemFolder = $(".templateNavList[data-type='"+typeAccess+"'] .managerTemplateNavItem").length;
		
		var isNoTemplate = $(".managerTemplateListItem").text();
		var folderObj = this.getFolderObj();
		var butDeleteFolderObj = folderObj.find(".butFolderTemplateDelete");
		if (isNoTemplate || countNavItemFolder == 1) {
			var labelNoDelete = Resource.hlp_template_label_folder_no_delete;
			butDeleteFolderObj.attr("data-no-active", "true")
								.attr("label", labelNoDelete);
			Tip.setEvent();
		} else {
			butDeleteFolderObj.removeAttr("data-no-active")
							.attr("label", Resource.hlp_template_label_folder_delete);
		} 
	}


/********************************************************************************/

	/**
	* Ставит события для менеджера
	*
	* @see 	this.showManager()
	*/
	this.setEventFolder = function()
	{
		// навигация
		this.setEventManagerNav();
		// добавление папки
		this.setEventAddFolder();
		// удаление папки
		this.setEventDeleteFolder();
		// изменение папки
		this.setEventEditNameFolder();
	}

	/**
	* Установить событие - навигация
	*
	* @see 	this.setEventManager()
	*/
	this.setEventManagerNav = function()
	{
		var obj = this;
		var butNav = $(".managerTemplateNavItem");
		butNav.off("mousedown");
		butNav.on("mousedown", function() {
			var elmEvent = $(this);
			butNav.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");
			
			obj.setFolderTemplate(elmEvent);
			$(".managerTemplateListItem").scrollTop(0);

			return false;
		});
	}

	/**
	* Показывает модальное имя папки
	*
	* @see 	this.setEventAddFolder()
	* @see 	this.setEventEditNameFolder()
	*/
	this.showModalName = function(modalTitle, butName, nameFolder)
	{
		if (!nameFolder) nameFolder = '';

		var content = '\
				<div class="modalLabel">'+Resource.hlp_template_label_folder_name+'</div>\
				<input type="text" value="'+nameFolder+'" class="valueManagerTemplateName" />\
			';

			Modal.create({
				"id" : "modalManagerTemplateName",
				"title" : modalTitle,
				"width" : 450,
				"top" : 80,
				"content" : content,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", butName]
				]
			});
	}

/***********************************************************************************/
	
	/**
	* Добавление папки
	*
	* @see 	this.setEvent()
	*/
	this.setEventAddFolder = function()
	{
		var obj = this;
		var butObj = $(".butAddFolderTemplate");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var modalTitle = Resource.hlp_template_title_folder_add;
			obj.showModalName(modalTitle, Resource.main_modal_but_add);

			obj.setEventButAddFolder();
		});
	}

	/**
	* Кнопка добавить папку
	*
	* @see 	this.setEventAddFolder()
	*/
	this.setEventButAddFolder = function()
	{
		var obj = this;
		var butObj = $("#modalManagerTemplateName .butAdd");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var inputTempFolderObj = $(".valueManagerTemplateName");
			var newName = inputTempFolderObj.val().trim();

			// newName = newName.replace(/[^\w\s]+/gim, '');
			if (!newName) {
				inputTempFolderObj.val('');
				Notification.error("Поле должно быть заполнено");
				return false;
			}

			obj.addNewFolder(newName);
		});
	}

	/**
	* Добавляет папку
 	*
	* @see 	this.setEventButAddFolder()
	* @see 	this.setNav()
	*/
	this.addNewFolder = function(newName, typeAccess, onlyAdd)
	{
		var obj = this;

		var listFolder = Data.user.folder_template;

		var newId = 0;
		for (var folderItemIndex in listFolder) {
			var folderItemId = parseInt(listFolder[folderItemIndex]["id"]);
			if (folderItemId > newId) newId = folderItemId;
		}
		newId++;
		
		if (!typeAccess) typeAccess = obj.getCurrentTypeAccess();
		
		var newFolder = {"id" : newId, "name" : newName, "type_access":typeAccess};
		Data.user.folder_template[newId] = newFolder;

		if (!onlyAdd) {
			obj.setNav();
			Modal.removeLast();
		}

		User.save();
	}

	/**
	* Удалить папку
	*
	* @see 	this.setEventManager()
	*/
	this.setEventDeleteFolder = function()
	{
		var obj = this;
		var butObj = $(".butFolderTemplateDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("data-no-active") == "true") return false;

			var folderObj = elmEvent.closest(".managerTemplateNavItem");
			var besideObj = folderObj.next();
			if (!besideObj.length) besideObj = folderObj.prev();
			var folderIndex = folderObj.attr("data-id");

			Modal.confirmationDelete(Resource.main_confirmation_delete_label, function() {
				delete Data.user.folder_template[folderIndex];
				
				// выбираем ближайшую вкладку
				besideObj.mousedown();

				obj.setNav();
				User.save();
			});
		});
	}

	/**
	* Изменить имя папку
	*
	* @see 	this.setEventManager()
	*/
	this.setEventEditNameFolder = function()
	{
		var obj = this;
		var butObj = $(".butFolderTemplateEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var folderObj = $(this).closest(".managerTemplateNavItem");
			var folderIndex = folderObj.attr("data-id");
			var folderNameObj = folderObj.find(".folderNameTemplate");

			var modalTitle = Resource.hlp_template_title_folder_edit;
			var folderName = folderNameObj.text();
			obj.showModalName(modalTitle, Resource.main_modal_but_save, folderName);

			var butObj = $("#modalManagerTemplateName .butAdd");
			butObj.off("mousedown");
			butObj.on("mousedown", function() {
				var inputTempFolderObj = $(".valueManagerTemplateName");
				var newFolderName = inputTempFolderObj.val();
				
				// newFolderName = newFolderName.replace(/[^\w\s]+/gim, '');
				if (!newFolderName) {
					inputTempFolderObj.val('');
					Notification.error("Поле должно быть заполнено");
					return false;
				}

				Data.user.folder_template[folderIndex]["name"] = newFolderName;
				folderNameObj.text(newFolderName);
				Modal.removeLast();

				User.save();
			});


		});
	}

/************************************************************************************/
/**********************************************************************************/
	
	/**
	* Ставит папку шаблона
	*
	* @see 	this.showManager()
	* @see 	this.confirmationDeleteTemplate()
	*/
	this.setFolderTemplate = function(elmEvent)
	{
		var folderId = elmEvent.attr("data-id");
		var folderIndex = elmEvent.attr("data-id");
		this.currentNavItemIndex = folderIndex;
			
		var typeAccess = this.getCurrentTypeAccess();
		

		if (this.isAccessTypeUser(typeAccess)) {
			var listTemplate = Data.user.list_template;
			var profileId = $("#userId").text();
		} else {
			var listTemplate = this.listTemplateStandart;
			var profileId = '';
		}

		var imgRootPath = '/user/'+profileId+'/0_template/0_avatar';
		
		var listTemplateHtml = '';
		for (var iTemplate in listTemplate) {
			var templateItem = listTemplate[iTemplate];
			if (!templateItem) continue;

			if (templateItem.folder_id != folderId) continue;

			var templateId = templateItem["id"];
			var templateIsModal = templateItem["is_modal"];
			var attrModal = templateIsModal ? 'data-modal="true"' : '';
			var modalType = templateIsModal ? '<span class="teplateItemType">'+Resource.hlp_template_label_part_modal+'</span>' : '';

			var tempNameV = templateItem["name"];

			listTemplateHtml += '\
				<div class="teplateItemBlock" '+attrModal+' data-name="'+templateItem["name"]+'" data-id="'+templateId+'">\
					<img src="'+imgRootPath+'/avatar_'+templateId+'.png" alt="" class="templateItemImg" />\
					<div class="templateItemBlackout">\
						<div class="listButManagerTemplate">\
							<div class="butManagerTemplate butAddtemplate" label="'+Resource.hlp_template_label_but_add+'">\
								<img src="/img/editor/plus-2.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateDelete" label="'+Resource.hlp_template_label_but_delete+'">\
								<img src="/img/editor/delete.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateEdit" label="'+Resource.hlp_template_label_but_edit+'">\
								<img src="/img/editor/edit.png" alt="" class="" />\
							</div>\
							<div class="butManagerTemplate butManagerTemplateMove"  label="'+Resource.hlp_template_label_but_move+'">\
								<img src="/img/editor/move.png" alt="" class="" />\
							</div>\
							<div class="clear"></div>\
						</div>\
					</div>\
					<div class="teplateItemName">'+modalType+tempNameV+'</div>\
				</div>'; 
		}

		listTemplateHtml += '<div class="clear"></div>';
		
		$(".managerTemplateListItem").html(listTemplateHtml);

		// ставим события
		this.setEventTemplate();
		// ставим статус кнопки удалить папку
		this.setStatusButDeleteFolder();
	}

	/**
	* Отдает текущий тип доступа
	*
	* @see 	this.setFolderTemplate()
	* @see 	this.chosenFirstFolder()
	* @see 	this.setEventButAddFolder()
	* @see 	this.setEventAddTemplate()
	* @see 	this.saveNewTemplate()
	*/
	this.getCurrentTypeAccess = function()
	{
		return $(".managerTemplateTypeNavItem[data-chosen='true']").attr("data-type");
	}

	/**
	*
	*
	*
	*/
	this.getFirstNavItem = function()
	{
		var typeAccess = this.getCurrentTypeAccess();
		return $(".templateNavList[data-type='"+typeAccess+"'] .managerTemplateNavItem:first");
	}

/**********************************************************************************/

	/**
	* События для шаблонов
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setEventTemplate = function()
	{
		// добавление шаблона на страницу
		this.setEventAddTemplate();
		// изменение имени
		this.setEventTemplateEditName();
		// удаление
		this.setEventTemplateDelete();
		// перемещение
		this.setEventTemplateMove();
	}

	/**
	* Изменение имени
	*
	*
	* @see 	this.setEventTemplate()
	*/
	this.setEventTemplateEditName = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var templateObj = $(this).closest(".teplateItemBlock");
			var templateNameObj = templateObj.find(".teplateItemName");
			var templateIndex = templateObj.attr("data-id");

			var modalTitle = Resource.hlp_template_title_edit;
			var templateName = templateNameObj.text();
			obj.showModalName(modalTitle, "Сохранить", templateName);

			var butObj = $("#modalManagerTemplateName .butAdd");
			butObj.off("mousedown");
			butObj.on("mousedown", function() {
				var inputTempFolderObj = $(".valueManagerTemplateName");
				var newName = inputTempFolderObj.val();
			
				// newName = newName.replace(/[^\w\s]+/gim, '');
				if (!newName) {
					inputTempFolderObj.val('');
					Notification.error("Поле должно быть заполнено");
					return false;
				}

				Data.user.list_template[templateIndex]["name"] = newName;
				templateNameObj.text(newName);

				Modal.removeLast();
				User.save();
			});
		});
	}

	/**
	* Удаление шаблона
	*
	* @see 	this.setEventTemplate()	
	*/
	this.setEventTemplateDelete = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var labelDelete = Resource.main_confirmation_delete_label;

			var templateObj = $(this).closest(".teplateItemBlock");
			Modal.confirmationDelete(labelDelete, function() {
				obj.confirmationDeleteTemplate(templateObj);
			});
		});
	}

	/**
	* Удаление шаблона
	*
	* @see 
	*/ 
	this.confirmationDeleteTemplate = function(templateObj)
	{
		var obj = this;
		var templateIndex = templateObj.attr("data-id");
		var templateId = templateObj.attr("data-id");

		Modal.removeLast();
		Modal.createLoading(Resource.hlp_template_load_start_delete);
		
		// запрос на сервер
		ajaxPost('/editor/deleteTemplate', "template_id="+templateId, function(req) {
			var deleteStatus = req.responseText.trim();

			if (deleteStatus) {
				templateObj.remove();

				// Data.user.list_template.splice(templateIndex, 1);
				delete Data.user.list_template[templateId];
				User.save();

				// переустанавливаем
				var navItemObj = $(".managerTemplateNavItem[data-chosen='true']");
				obj.setFolderTemplate(navItemObj);

				// тариф
				Rate.setCountTemplate();

				Notification.ok(Resource.hlp_template_notification_end_delete);
				setTimeout(function() { Tip.hide();}, 1000);	
			} else {
				// выводим ошибку
				Notification.error();
			}
		});
	}

/***********************************************************************************/

	/**
	* Перемещение шаблона
	*
	* @see 	this.setEventTemplate()	
	*/
	this.setEventTemplateMove = function()
	{
		var obj = this;
		var butObj = $(".butManagerTemplateMove");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var templateObj = $(this).closest(".teplateItemBlock");
			var templateIndex = templateObj.attr("data-id");
			var oldFolderId = Data.user.list_template[templateIndex]["folder_id"];

			var selectFolder = obj.getSelectFolder(oldFolderId);
			var content = '\
				<div class="modalLabel">'+Resource.hlp_template_modal_move_label+'</div>\
				'+selectFolder;

			Modal.create({
				"id" : "modalManagerMoveTemplate",
				"title" : Resource.hlp_template_title_move,
				"content" : content,
				"width" : 450,
				"top" : 100,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", Resource.main_modal_but_move]
				]
			});

			// отмечаем папку
			if (obj.currentNavItemIndex) {
				$(".selectFolder").val(obj.currentNavItemIndex);
			}

			obj.setEventButTemplateMove(templateObj, templateIndex, oldFolderId);
		});
	}

	/**
	* Событие на кнопку - перемещение шаблона
	*
	* @see 	this.setEventTemplateMove()
	*/
	this.setEventButTemplateMove = function(templateObj, templateIndex, oldFolderId)
	{
		var obj = this;
		var butAdd = $("#modalManagerMoveTemplate .butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var newFolderId = $("#modalManagerMoveTemplate select").val();
			
			Modal.removeLast();
			if (newFolderId == oldFolderId) return false;

			Data.user.list_template[templateIndex]["folder_id"]	= newFolderId;		

			templateObj.remove();
			obj.setNav();
			User.save();
		});
	}


	/**
	* Отдает select папок
	*
	* @see 	this.setEventTemplateMove()
	* @see 	this.enterInfoNewTemplate()
	*/
	this.getSelectFolder = function(folderSelected)
	{
		var selectFolder = '<select class="selectFolder">';
		var listFolder = Data.user.folder_template;

		var firstFolderId = false;
		for (var iFolder in listFolder) {
			var folder = listFolder[iFolder];

			var folderId = folder['id'];
			if (!firstFolderId) {
				firstFolderId = folderId;
				folderSelected = folderId;
			}
			var selected = folderSelected == folderId ? 'selected="selected"' : '';

			selectFolder += '<option '+selected+' value="'+folderId+'">'+folder["name"]+'</option>';
		}

		selectFolder += "</select>";

		return selectFolder;
	}

/*************************************************************************************/
/**************************************************************************************/
/**********************************************************************************/

	/**
	* Добавление шаблона
	*
	* @see 	this.setFolderTemplate()
	*/
	this.setEventAddTemplate = function()
	{
		var obj = this;
		var butAdd = $(".butAddtemplate");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var elmEvent = $(this);
			obj.addTemplateAction(elmEvent);
		});
	}

	/**
	* Добавление шаблона
	*
	*
	*/
	this.addTemplateAction = function(elmEvent)
	{
		var templateObj = elmEvent.closest(".teplateItemBlock");
			
		var modalStatus = templateObj.attr("data-modal");
		if (!modalStatus && Screen.isModal()) {
			Screen.togglePage();
		}

		var templateId = templateObj.attr("data-id");
		var templateProperty = this.getTemplateProperty(templateId);
		if (templateProperty) {
			var templateName = templateProperty["name"];
			var templateFolder = templateProperty["folder"];
		} else {
			var templateName = false;
			var templateFolder = false;
		}
		var typeAccess = this.getCurrentTypeAccess();

		Modal.createLoading(Resource.hlp_template_load_start_add);

		var query_string = "site_id="+Data.site.site_id
						+"&template_id="+templateId
						+"&type_access="+typeAccess
						+"&template_name="+templateName
						+"&folder="+templateFolder;

		var obj = this;
		// запрос на сервер
		ajaxPost('/editor/addTemplate', query_string, function(req) {
			var res = req.responseText.trim();
			
			if (res) {
				res = JSON.parse(res);
				var templateFolder = res["folder_name"];

				// добавляем
				var template = JSON.parse(res["template"]);
				obj.addTemplate(templateId, template, templateFolder, templateName);
				//сбрасываем файлы
				EditElementImage.resetCategoryFiles();

				History.record();	
				setTimeout(function() { 
					Tip.hide();
					Notification.ok(Resource.hlp_template_notification_end_add);
				}, 1000);	
			} else {
				// выводим ошибку
				Notification.error();
				Modal.delete();
			}
		})
	}

	this.getTemplateProperty = function(templateId)
	{
		var listTemplates = this.getListTemplates();
		return listTemplates[templateId];
	}

	this.getListTemplates = function()
	{
		return Data.user.list_template;
	}

	/**
	* Добавляет шаблон
	*
	* @see 	this.setEventAddTemplate()
	*/
	this.addTemplate = function(templateId, template, templateFolder, templateName)
	{
		// замена пути картинок
		template = this.replaceImgTemplate(template, templateFolder, templateId);
		template = JSON.parse(template);
		// заменяем одинаковые классы
		template = this.replaceClassTemplate(template);
		// вставляем на страницу
		var secObjV = this.insertTemplatePage(template, templateFolder);

		/*для разработчика***************/
		if (this.developerReplaceStatus) {
			secObjV.attr("hlp-template-id", templateId);
			secObjV.attr("hlp-template-name", templateName);
		}

		// ставим тип секции
		if (this.isCurTypeStandart()) {
			var attrFolderIdV = this.getAttrStdFolderId()
			secObjV.attr(attrFolderIdV, this.getCurFolderId());
		}

		/***************/
		// номер
		ElementSection.addNum(secObjV);
		/****************/
	}

	/**
	* Заменяет путь картинок при добавление шаблона
	*
	* @see 	this.addTemplate()
	*/
	this.replaceImgTemplate = function(template, templateFolder, templateId)
	{
		var userId = $("#userId").text();
		var siteId = Data.site.site_id;
		template = JSON.stringify(template);

		var patterImg = new RegExp("\/user\/[0-9]+\/[a-z0-9_]+\/img(\/[a-z0-9\._\-]+)*\/", "gim");

		if (this.isAccessTypeUser(this.currentType)) {
			var imgPathNew = "/user/"+userId+"/"+siteId+"/img/"+templateFolder+"/";
			template = template.replace(patterImg, imgPathNew);
		} else {
			var imgPathNew = "/user/0_template/"+templateId+"/";
			template = template.replace(patterImg, imgPathNew);
		}

		return template;
	}

	/**
	* Замена классов у шаблона
	*
	* @see 	this.addTemplate()
	*/
	this.replaceClassTemplate = function(template)
	{
		if (Element.obj.hasClass("site")) {
			Element.obj.find(".section:first").mousedown().mouseup();
		}

		var buffer = $(".contentBoofer");
		var content = $(".contentItem")
		buffer.html(template["html"]);
		var listElm = buffer.find(".element");
		var css = JSON.stringify(template["css"]);

		var elm = Element.obj;

		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var classUnique = elmItem.attr("class-unique");
			var classAdded = elmItem.attr("class-added");
			// не изменять базовый класс
			if (Element.isNoEditClass(elmItem)) classUnique = false;
			// 
			var listClass = {"class-unique":classUnique, "class-added":classAdded}

			for (var classType in listClass) {
				var classItem = listClass[classType];
				if (!classItem) continue;

				var elmItemV = content.find("."+classItem);
				if (Page.isTypeMain() || elmItemV.length) {

					var listElmSite = $("."+classItem);
					// получаем новый класс
					var newClass = this.getNewClass(classItem);

					//заменяем 
					var patClass = new RegExp('"'+classItem+'"', "gim");
					css = css.replace(patClass, '"'+newClass+'"');
					var patClass = new RegExp('"'+classItem+' ', "gim");
					css = css.replace(patClass, '"'+newClass+' ');
					var patClass = new RegExp(' '+classItem+'"', "gim");
					css = css.replace(patClass, ' '+newClass+'"');

					buffer.find("."+classItem)
							.removeClass(classItem)
							.addClass(newClass)
							.attr(classType, newClass);
				}
			}
		}
		
		buffer.find("> .section").addClass("new-element"); 

		template["css"] = JSON.parse(css);
		template["html"] = buffer.html();
		buffer.html('');

		return template;
	}

	/**
	* Отдает новый класс
	*
	* @see 	this.replaceClassTemplate()
	*/
	this.getNewClass = function(classElm)
	{	
		// добавляем классу префикс, для многостраничника
		classElm = Element.addClassPrefix(classElm);
		
		// если такого класса нет на странице
		var countElmInSite = $(".site ."+classElm).length;
		if (!countElmInSite) return classElm;

		// очищаем от оконцовке
		var classMain = classElm.replace(/-?[0-9]+$/, ''); 
		var parentObjV = $("body");

		for (var maxNum = 0; maxNum < 500; maxNum++) {
			if (maxNum == 0) {
				var elmSelectorV = classMain;
			} else {
				var elmSelectorV = classMain + "-" + maxNum;
			}
			
			if (! parentObjV.find("."+elmSelectorV).length) break;
		}


		return elmSelectorV;
	}

	/**
	* Вставка шаблона на страницу
	*
	* @see 	this.addTemplate()
	*/
	this.insertTemplatePage = function(template, templateFolder)
	{
		var newElm = false;

		if (template.is_modal) {
			newElm = ManagerModal.addTemplateModal(template["html"]);
		} else {
			var elmSectionObj = Element.obj.closest(".section");
			if (!elmSectionObj.length) elmSectionObj = $(".site .section:first");
			
			elmSectionObj.after(template["html"]);
		}

		// новый элемент
		if (!newElm) newElm = $(".new-element");

		// обновляем
		var css = template["css"];
		for (var cssClass in css) {
			Data.page.data.css[cssClass] = css[cssClass];
		}
		// стили
		ElementCss.createListTagStyle();

		//события 
		Input.newCanvas();

		// удаляем атрибуты
		newElm.removeClass("new-element").removeClass("elementSelected").removeAttr("status");

		// добавляем новые data-id
		newElm.removeAttr("data-id").find("*").removeAttr("data-id");
		Element.addNewId(newElm);

		// если модальное
		if (template.is_modal) {
			// меняем modal id
			var newModalId = Element.getMaxNumberClass($(".modal"), "data-num");
			newModalId = Element.addClassPrefix(newModalId);
			newElm.attr("data-num", newModalId);
			/**************/
			ManagerModal.chosenItem(false, newElm.attr("id"));
		} else {
			// ставим сетку
			var gridType = $(".site .section:first .grid").attr("data-type");
			newElm.find(".grid").attr("data-type", gridType);

			// строим структуру
			PageStruct.build();

			// обновляем изображения
			EditElementImage.loadingCategoryServer(true, Data.site.site_id, "img");
		}

		setTimeout(function() {
			// выделяем элемент
			newElm.mousedown().mouseup();
			// ставим скролл на полотне
			StyleCanvas.setScrollTopElm(newElm);

			Modal.delete();
		}, 1000);

		return newElm;
	}

	/**
	* Отдает шаблон
	*
	* @see 	this.addTemplate()
	*/
	this.getTemplate = function(templateId, folderId)
	{
		if (!folderId) {
			folderId = $(".managerTemplateNavItem[data-chosen='true']")
						.attr("data-id");
		}
		return Data.user.list_template[folderId]["template"][templateId];
	}

	/**
	* Отдает текущий folder id
	* 
	* @see 	this.addTemplate()
	*/
	this.getCurFolderId = function()
	{
		return this.currentNavItemIndex;
	}

/***********************************************************************************/
/***********************************************************************************/
/*********************************************************************************/

	/**
	* Создание шаблона
	*
	* @see 	this.setEvent()
	* @see 	Rate.setCountTemplate()
	*/
	this.setEventCreateTemplate = function()
	{
		var obj = this;
		var butAddTemplateObj = $(".butAddTemplate");
		butAddTemplateObj.off("mousedown");
		butAddTemplateObj.on("mousedown", function() {
			// показываем модальное
			obj.modalEnterInfoNewTemplate();
			// ставим событие на добавление
			obj.setEventEnterInfoNewTemplate();

			return false;
		});
	}

	/**
	* Модальное - введение данных нового шаблона
	*
	* @see 	this.setEventCreateTemplate()
	*/
	this.modalEnterInfoNewTemplate = function()
	{
		var selectFolder = this.getSelectFolder();

		var content = '\
			<div class="modalLabel">'+Resource.hlp_template_label_template_name+'</div>\
			<input type="text" class="valueNewTemplateName" />\
			<div class="modalLabel lableSelectFolderNewTemplate">'+Resource.hlp_template_label_chosen_folder+'</div>\
			'+selectFolder;

		Modal.create({
			"id" : "modalInfoNewTemplate",
			"title" : Resource.hlp_template_title_add,
			"content" : content,
			"width" : 450,
			"top" : 50,
			"button" : [
				["cancel", Resource.main_modal_but_cancel],
				["add", Resource.main_modal_but_add]
			]
		});
		
		// отмечаем папку
		if (this.currentNavItemIndex && this.isAccessTypeUser(this.currentType)) {
			$(".selectFolder").val(this.currentNavItemIndex);
		}

		/*****************/
		// для разработки при замене
		if (this.developerReplaceStatus) {
			var inputTempIdV = '<input type="text" placeholder="Id шаблона" class="valueNewTemplateId" />';
			$("#modalInfoNewTemplate .valueNewTemplateName").after(inputTempIdV);
			
			var sectObjV = Element.obj;
			var sectNameV = sectObjV.attr("hlp-template-name");
			var sectIdV = sectObjV.attr("hlp-template-id");	
			// var folderId = 
			if (sectNameV) $(".valueNewTemplateName").val(sectNameV);
			if (sectIdV) $(".valueNewTemplateId").val(sectIdV);
		}
		/***************/
	}

	/**
	* Введены новые данные шаблона
	*
	* @see 	this.setEventCreateTemplate()
	*/
	this.setEventEnterInfoNewTemplate = function()
	{
		var obj = this;
		var butObj = $("#modalInfoNewTemplate .butAdd");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var folderId = $(".selectFolder").val();
			var inputNewNameObjV = $(".valueNewTemplateName");
			var templateName = inputNewNameObjV.val();

			if (templateName.match(/^[0-9]/gim)) templateName = "t"+templateName;

			// templateName = templateName.replace(/[^\w\s]+/gim, '');

			if (!templateName) {
				inputNewNameObjV.val('');
				Notification.error(Resource.hlp_template_notification_no_enter_name);
				return false;
			}

			Modal.createLoading(Resource.hlp_template_load_add_template);

			obj.addNewTemplate(templateName, folderId);
			obj.currentNavItemIndex = folderId;

			// тариф
			Rate.setCountTemplate();
		});
	}

/*******************************************************************************/

	/**
	* Добавление новой секции в шаблоны
	*
	* @see 	this.setEventEnterInfoNewTemplate()
	*/
	this.addNewTemplate = function(templateName, folderId)
	{
		var elm = Element.obj;
		var listElm = elm.find(".element, .element-content, .section-content, .bg-video, .hlp-section-bg-mask");
		listElm = listElm.add(elm);

		/********/
		if (this.developerReplaceStatus) {
			var devTempId = elm.attr("hlp-template-id");
			var devTempName = elm.attr("hlp-template-name");
			elm.removeAttr("hlp-template-id");
			elm.removeAttr("hlp-template-name");

			var newTemplateId = $(".valueNewTemplateId").val().trim();
		} else {
			var newTemplateId = this.getNewTemplateId();
		}
		if (!newTemplateId) newTemplateId = this.getNewTemplateId();
		/********/

		// получаем данные секции
		var sectionHtml = ElementMan.getHtmlElmAll(Element.obj);
		var sectionCss = this.getNewTemplateCss(listElm);
		var modalStatus = Screen.isModal();

		// заносим секцию в массив
 		var templateValue = {
			"id" : newTemplateId,
			"folder_id" : folderId,
			"name" : templateName,
			"is_modal" : modalStatus,
		};

		Data.user.list_template[newTemplateId] = templateValue;

		var template = { "html" : sectionHtml, "css" : sectionCss, "is_modal" : modalStatus};
		// сохраняем картинки на сервере
		var sectionImg = this.getNewTemplateImg(listElm);
		this.saveNewTemplate(newTemplateId, template, sectionImg);

		// что бы открывалась папка куда добавили, шаблон
		this.currentType = "my";
		this.currentNavItemIndex = folderId;

		if (this.developerReplaceStatus) {
			elm.attr("hlp-template-id", devTempId);
			elm.attr("hlp-template-name", devTempName);
		}
	}

	/**
	* Отдает css секции
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateCss = function(listElm)
	{
		var listCss = {};
		var listStyle = Data.page.data.css;
	
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);

			var elmClassUnique = Element.getClassUnique(elmItem);
			var elmCssUnique = listStyle[elmClassUnique];
			if (elmCssUnique) listCss[elmClassUnique] = copyArray(elmCssUnique);

			var elmClassAdded = Element.getClassAdded(elmItem);
			if (!elmClassAdded) continue; 
			var elmCssAdded = listStyle[elmClassAdded];
			if (elmCssAdded) listCss[elmClassAdded] = copyArray(elmCssAdded);
		}

		return listCss;
	}

	/**
	* Список изображений
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateImg = function(listElm)
	{
		var listImg = [];

		var iImgAll = 0;
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var imgItemSrc = '';
			
			if (elmItem.hasClass("image") || elmItem.hasClass("nav-button-mobile")) {
				imgItemSrc = elmItem.find("> img").attr("src");
				listImg[iImgAll] = imgItemSrc.replace(/\.\./gim, '');
				iImgAll++;
			}

			var elmBg = elmItem.css("background");
			var listBgImg = elmBg.match(/\/user\/[0-9]+\/[^\/]+\/img\/[\w\.\-\/]+/gim);
			if (listBgImg) {
				for (var iImg in listBgImg) {
					imgItemSrc = listBgImg[iImg];
					listImg[iImgAll] = imgItemSrc.replace(/\.\./gim, '');
					iImgAll++;
				}
			}
			
		}

		return listImg;
	}

	/**
	* Отдает id нового шаблона
	*
	* @see 	this.addNewTemplate()
	*/
	this.getNewTemplateId = function()
	{			
		var newId = Data.user.last_template_id + 1;
		Data.user.last_template_id = newId;

		return newId;
	}

	/**
	* Сохранение новой секции
	*
	* @see 	this.addNewTemplate()
	*/
	this.saveNewTemplate = function(newTemplateId, template, sectionImg)
	{
		template['type_access'] = this.getCurrentTypeAccess();

		var obj = this;
		var user = JSON.stringify(Data.user);//escape(JSON.stringify(Data.user));
		var query_string =	{
			"user":user,
			"new_id":newTemplateId,
			"template":JSON.stringify(template),
			"list_img":JSON.stringify(sectionImg),
			"site_id": Site.getId()
		}

		// запрос на сервер
		$.post('/editor/saveNewTemplate', query_string, function(req, status) {
			var res = req.trim();

			if (res) {
				/*********/
				if (obj.developerReplaceStatus && obj.deleloperNoSaveAvatar) {
					Modal.delete();
				} else {
					obj.saveTemplateAvatar(newTemplateId);
				}
				/*********/

				Notification.ok(Resource.hlp_template_notification_add_template);
			} else {
				Notification.error();
				Modal.delete();
			}
		})
	}

	/**
	* Сохраняем аватар
	*
	* @see 	this.saveNewTemplate()
	*/
	this.saveTemplateAvatar = function(newTemplateId)
	{
		// ставим scroll
		var elmTop = Element.obj.position().top;
		Screen.setScroll(elmTop);

		// прячем
		var listHide = $(".resizeBlock, .butAddTemplate, .addedBlock, .guides, .grid, ."+this.getClassListButSection());
		listHide.addClass("displayNone");

		html2canvas(document.querySelector(".content .site")).then(function(canvas) {
				var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, ''); 
			   	var params = {template_id:newTemplateId, data:data}; 

				$.post('/editor/saveTemplateAvatar', params, function(res) { 
					// показываем
					listHide.removeClass("displayNone");

					// убираем модальное
					Modal.delete();
			    }); 
		});
	}
/***************************************************************************/
	
	/**
	* Добавление списка кнопок для секции
	*
	* @see 	Resiz.addAddedBlock()
	*/
	this.addListButSection = function(elm)
	{
		var listButTemp = '\
				<div class="'+this.getClassListButSection()+'">\
					<div class="sectionListButTemplateContent">\
						<div class="butTemplateSection '+this.getClassButSectionAdd()+'">'+Resource.hlp_canvas_but_add_template+'</div>\
						<div class="clear"></div>\
					</div>\
				</div>\
			';
		elm.append(listButTemp);

		this.setEventButSection();
	}

	/**
	* Удаляет список кнопок
	*
	* @see 	Resize.remove()
	* @see 	Site.clearHtml()
	*/
	this.removeListButSection = function(parentObjV)
	{
		var classNameV = this.getClassListButSection();

		var butObjV = parentObjV ? parentObjV.find("."+classNameV) : $("."+classNameV);
		butObjV.remove();
	}
	
	/**
	* Отдает класс для секии
	*
	* @see 	this.addListButSection()
	* @see 	this.removeListButSection()
	*/
	this.getClassListButSection = function()
	{
		return this.class.list_but_section;
	}
	
	/**
	* События
 	*
	* @see 	this.addListButSection()
	*/
	this.setEventButSection = function()
	{
		this.setEventButSectionAddNew();
	}

	this.setEventButSectionAddNew = function()
	{
		var obj = this;
		var butObjV = $("."+this.getClassButSectionAdd());
		butObjV.off("mousedown");
		butObjV.on("mousedown", function() {
			obj.showManager();
		});
	}

/***************************************************************************/
/***************************************************************************/
} // end class

setTimeout(function(){
	// $(".butAddTemplateSection").mousedown();
}, 1000);


/***************************************************************************/
/***************************************************************************/
TemplateSection.listFolderStandart = [
	{"id" : "1", "name" : "Header"},
	{"id" : "10", "name" : "Первый экран"},

	{"id" : "20", "name" : "Список товаров"},
	{"id" : "30", "name" : "Один товар"},
	{"id" : "40", "name" : "Портфолио"},
	{"id" : "50", "name" : "Услуга"},

	{"id" : "60", "name" : "Список"},
	{"id" : "70", "name" : "Этапы работы"},
	{"id" : "80", "name" : "Сотрудники"},
	{"id" : "90", "name" : "Отзывы"},
	{"id" : "100", "name" : "Формы"},

	{"id" : "110", "name" : "Контакты"},
	{"id" : "120", "name" : "Footer"},

	{"id" : "130", "name" : "Текст"},
	{"id" : "140", "name" : "Изображения"},
	{"id" : "150", "name" : "Видео"},

/***********************************************************************************/

];

TemplateSection.listTemplateStandart = [	
	// header
	{"id" : "1_1", "folder_id" : "1", "name" : "header 1"},
	{"id" : "1_2", "folder_id" : "1", "name" : "header 2"},
	{"id" : "1_3", "folder_id" : "1", "name" : "header 3"},
	{"id" : "1_4", "folder_id" : "1", "name" : "header 4"},
	{"id" : "1_5", "folder_id" : "1", "name" : "header 5"},
	{"id" : "1_6", "folder_id" : "1", "name" : "header 6"},
	{"id" : "1_7", "folder_id" : "1", "name" : "header 7"},

	// hero
	{"id" : "10_1", "folder_id" : "10", "name" : "hero 1"},
	{"id" : "10_2", "folder_id" : "10", "name" : "hero 2"},
	{"id" : "10_3", "folder_id" : "10", "name" : "hero 3"},
	{"id" : "10_4", "folder_id" : "10", "name" : "hero 4"},
	{"id" : "10_5", "folder_id" : "10", "name" : "hero 5"},
	{"id" : "10_6", "folder_id" : "10", "name" : "hero 6"},
	{"id" : "10_7", "folder_id" : "10", "name" : "hero 7"},
	{"id" : "10_8", "folder_id" : "10", "name" : "hero 8"},
	{"id" : "10_9", "folder_id" : "10", "name" : "hero 9"},
	{"id" : "10_10", "folder_id" : "10", "name" : "hero 10"},
	{"id" : "10_11", "folder_id" : "10", "name" : "hero 11"},
	{"id" : "10_12", "folder_id" : "10", "name" : "hero 12"},
	{"id" : "10_13", "folder_id" : "10", "name" : "hero 13"},
	{"id" : "10_14", "folder_id" : "10", "name" : "hero 14"},
	{"id" : "10_15", "folder_id" : "10", "name" : "hero 15"},

	// products
	{"id" : "20_1", "folder_id" : "20", "name" : "products 1"},
	{"id" : "20_2", "folder_id" : "20", "name" : "products 2"},
	{"id" : "20_3", "folder_id" : "20", "name" : "products 3"},
	{"id" : "20_4", "folder_id" : "20", "name" : "products 4"},

	// product
	{"id" : "30_1", "folder_id" : "30", "name" : "product 1"},
	{"id" : "30_2", "folder_id" : "30", "name" : "product 2"},
	{"id" : "30_3", "folder_id" : "30", "name" : "product 3"},
	{"id" : "30_4", "folder_id" : "30", "name" : "product 4"},
	{"id" : "30_5", "folder_id" : "30", "name" : "product 5"},

	// portfolio
	{"id" : "40_1", "folder_id" : "40", "name" : "portfolio 1"},
	{"id" : "40_2", "folder_id" : "40", "name" : "portfolio 2"},
	{"id" : "40_3", "folder_id" : "40", "name" : "portfolio 3"},
	{"id" : "40_4", "folder_id" : "40", "name" : "portfolio 4"},
	{"id" : "40_5", "folder_id" : "40", "name" : "portfolio 5"},
	{"id" : "40_6", "folder_id" : "40", "name" : "portfolio 6"},
	{"id" : "40_7", "folder_id" : "40", "name" : "portfolio 7"},
	{"id" : "40_8", "folder_id" : "40", "name" : "portfolio 8"},
	{"id" : "40_9", "folder_id" : "40", "name" : "portfolio 9"},
	{"id" : "40_10", "folder_id" : "40", "name" : "portfolio 10"},
	{"id" : "40_11", "folder_id" : "40", "name" : "portfolio 11"},
	{"id" : "40_12", "folder_id" : "40", "name" : "portfolio 12"},

	// service
	{"id" : "50_1", "folder_id" : "50", "name" : "service 1"},
	{"id" : "50_2", "folder_id" : "50", "name" : "service 2"},
	{"id" : "50_3", "folder_id" : "50", "name" : "service 3"},

	// list
	{"id" : "60_1", "folder_id" : "60", "name" : "list 1"},
	{"id" : "60_2", "folder_id" : "60", "name" : "list 2"},
	{"id" : "60_3", "folder_id" : "60", "name" : "list 3"},
	{"id" : "60_4", "folder_id" : "60", "name" : "list 4"},

	// steps
	{"id" : "70_1", "folder_id" : "70", "name" : "steps 1"},
	{"id" : "70_2", "folder_id" : "70", "name" : "steps 2"},
	{"id" : "70_3", "folder_id" : "70", "name" : "steps 3"},

	// employees
	{"id" : "80_1", "folder_id" : "80", "name" : "employees 1"},
	{"id" : "80_2", "folder_id" : "80", "name" : "employees 2"},

	// reviews
	{"id" : "90_1", "folder_id" : "90", "name" : "reviews 1"},
	{"id" : "90_2", "folder_id" : "90", "name" : "reviews 2"},
	{"id" : "90_3", "folder_id" : "90", "name" : "reviews 3"},

	// form
	{"id" : "100_1", "folder_id" : "100", "name" : "form 1"},
	{"id" : "100_2", "folder_id" : "100", "name" : "form 2"},
	{"id" : "100_3", "folder_id" : "100", "name" : "form 3"},

	// contact
	{"id" : "110_1", "folder_id" : "110", "name" : "contact 1"},
	{"id" : "110_2", "folder_id" : "110", "name" : "contact 2"},
	{"id" : "110_3", "folder_id" : "110", "name" : "contact 3"},

	// footer
	{"id" : "120_1", "folder_id" : "120", "name" : "footer 1"},
	{"id" : "120_2", "folder_id" : "120", "name" : "footer 2"},
	{"id" : "120_3", "folder_id" : "120", "name" : "footer 3"},
	{"id" : "120_4", "folder_id" : "120", "name" : "footer 4"},

	// text
	{"id" : "130_1", "folder_id" : "130", "name" : "text 1"},
	{"id" : "130_2", "folder_id" : "130", "name" : "text 2"},

	// image
	{"id" : "140_1", "folder_id" : "140", "name" : "image 1"},
	{"id" : "140_2", "folder_id" : "140", "name" : "image 2"},
	{"id" : "140_3", "folder_id" : "140", "name" : "image 3"},
	{"id" : "140_4", "folder_id" : "140", "name" : "image 4"},
	{"id" : "140_5", "folder_id" : "140", "name" : "image 5"},

	// video
	{"id" : "150_1", "folder_id" : "150", "name" : "video 1"},
	{"id" : "150_2", "folder_id" : "150", "name" : "video 2"},
	{"id" : "150_3", "folder_id" : "150", "name" : "video 3"},
	{"id" : "150_4", "folder_id" : "150", "name" : "video 4"},


];

/**
* Создание элемента
*
* @parent  	ElementSelf  		
*
*/ 
ElementMan.prototype = ElementSelf;
var ElementMan = new ElementMan();
ElementMan.parent = ElementSelf;
function ElementMan()  
{
	/**
	* @var 	array		 	данные элементов(самого элемента и его потомков) кот скопировали
	* @set 	this.copyDataElm()
	*/
	this.elm_data = {};

	/**
	* @var 	string 			тип операции(copy|cut)	
	* @set 	this.copy(), this.cut()
	* @see 	this.insert()
	*/
	this.operationType = '';

	/**
	* @var 	int 				top скопираваного элемента	
	* @set 	this.copy()
	* @see 	this.setVarCopyInsert()
	*/
	this.copy_top = '';
	/**
	* @var 	int 				left скопираваного элемента	
	* @set 	this.copy()
	* @see 	this.setVarCopyInsert()
	*/
	this.copy_left = '';

	/**
	* Статус элемента в каркасе он или нет
	*
	*/
	this.isFrameElmV = false;

	/**
	* Колонка или нет
	*
	*/
	this.isColumn = false;

	this.elmOrigin;
/**********************************************************************************/
	/**
	* Копирование элемента
	*
	* @see 	ElementManController.setEvent() 			 	 	
	* @see 	Key.key67()	
	*/
	this.copy = function()
	{
		var elm = Element.obj;

		// фиксируем сам элемнт и родителя
		this.elmOrigin = elm;

		//устанавливаем тип операции
		this.operationType = 'copy';
		//помещяем элемент в буффер
		this.insertElmInBuffer('new');
		//скопировать даные копируемого элемента
		this.copyDataElm();
		//статус колонки
		this.isColumn = Element.data.type == "column" ? true : false;
		this.elmType = Element.data.type;
		
		// делаем активной кнопку вставить
		$(".topMenuInsert").attr("status", "true");

		/*************/
		this.isNewClass = false;
		/*************/
	};

	/**
	* Вырезать элемент
	*
	* @see 	ElementManController.setEvent() 
	* @see 	ElementManController.moveDownSection()
	* @see 	ElementManController.moveUpSection()			 	 	
	* @see 	PageStruct.moveElm()
	* @see 	Key.key88()	
	*/
	this.cut = function()
	{
		var elm = Element.obj;
		
		this.elmOrigin = elm;

		var type = Element.data.type;
		this.operationType = 'cut';

		//помещяем элемент в буффер
		this.insertElmInBuffer('old');
		// ширина
		this.width = this.getFullWidth(elm);
		//статус колонки
		this.isColumn = type == "column" ? true : false;
		this.elmType = Element.data.type;

		//удаляем элемент c полотна
		if (type != "column") this.deleteElement(elm, Element.data.type);
		else elm.html("");//просто очищаем
		
		// строим структуру
		PageStruct.build();
	};

/****************************************************************************************/
	/**
	* Поместить элемент в буфер
	*
	* @see 	this.copy(), this.cut()
	* @see 	ElementManController.moveUpSection()	
	*/
	this.insertElmInBuffer = function(elm_status)
	{
		var elm = Element.obj;
		//устанавливаем тип элемента
		this.type = Element.data.type;

		//получить html элемента
		// если это колонка, отдаем просто содержимое 
		if (this.type == "column") var block = elm.html();
		else var block = this.getHtmlElmAll();

		//вставляем в хранилище
		this.bufferHtml = block;
		// var buffer = $('.bufferElementInsert');
		// buffer.html(block).find(".elementSelected")
		// 						.removeClass("elementSelected")
		// 						.find(".resizeBlock, .addedBlock")
		// 						.remove();

		// this.bufferHtml = buffer.html(block);
		// buffer.html('');	

		return block;				
	}

	/*
	* Очищает buffer
	*
	* @see ManagerPage.chosenItem()
	*/
	this.clearBuffer = function()
	{
		// $('.bufferElementInsert').html('');
		this.bufferHtml = false;
	}

	/**
	* Отдает элемент с оболочкой
	*
	* @see 	this.getHtmlElmAll()
	* @see 	this.delete()
	* @see 	this.deleteElement()
	*/
	this.getElmWithWrap = function(elm)
	{
		if (!elm) elm = Element.obj;
		return elm;
	}

	/**
	* Получить элемент полностью
	*
	* @param 	string 		status-тип элемента(new|old)
	* 
	* @see 	this.insertElmInBuffer()
	* @see 	PageStruct.moveElm() 
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	ElementManController.setEventModeSimpleCopy()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	StyleCanvas.setNewFloatSide()
	* @see 	ElementSettingHeading.edit()
	*/
	this.getHtmlElmAll = function(elm, noNew, elm_tag)
	{
		elm = this.getElmWithWrap(elm);

		// параметры элемента
		if (!elm_tag) elm_tag = elm[0].tagName.toLowerCase(); //имя тега	
		
		//содержимое	
		Resize.remove();
		var elm_block = elm.html();
		Resize.create();

		// список атрибутов
		var listAttrString = '';
		var listAttr = elm[0].attributes;
		var countAttr = listAttr.length;
		for (var i = 0; i < countAttr; i++) {
			var attr = listAttr[i];
			listAttrString += attr.nodeName+'="'+attr.nodeValue+'" '
		}	
		
		var attrNew = noNew ? '' : 'status="new"';

		var block = '<'+elm_tag+' '+listAttrString+' '+attrNew+'>'
						+elm_block+
					'</'+elm_tag+'>';
		return block;
	};


	/**
	* Скопировать даные копируемого элемента
	*
	* @uses 	this.elm_data 	устанавливаем значение
	* @see 		this.copy();
	*/
	this.copyDataElm = function()
	{
		var data = {};
		
		var elm = Element.obj;
		data[0] = {"id":elm.attr("id")}; 


		//если есть потомки у скопиравонного элемента
		var listChild = elm.find(".element");
		var countChild = listChild.length;
		//проходим циклом потомков
		for (var i = 0; i < countChild; i++) {
			var child = listChild.eq(i);
			data[i+1] = {"id":child.attr("id")};
		}	

		//помещаем в переменую
		this.elm_data = data;
		// ширина
		this.width = this.getFullWidth(elm);
	}


/**********************************************************************************/
	
	/**
	* УСтанавливает буффер на страницу
	*
	* @see 	Element.getMaxNumberOnlyClass();
	*/
	this.setBufferInPage = function()
	{
		$(".bufferElementWork").html(this.bufferHtml);
	}

	/**
	* Очищает буффер с страницы
	*
	* @see 	Element.getMaxNumberOnlyClass();
	*/
	this.clearBufferInPage = function()
	{
		$(".bufferElementWork").html('');	
	}

	/**
	*
	*
	* @see 	PageSetting.setEventSeo()
	*/
	this.getBuffer = function()
	{
		return $(".bufferElementWork");
	}

/***********************************************************************************************/
	/**
	* Отдает ширину элемента
	*
	* @see 	this.cut()
	* @see 	this.copyDataElm()
	*/
	this.getFullWidth = function(elm)
	{
		var margin = parseInt(elm.css("margin-left"));
		var width = Element.getWidth() + margin;	

		// return width;
		return Element.getWidth();
	}

/*********************************************************************************************/
/********************************************************************************************/
	/**
	* Можно вставить элемент или нет
	*
	* @see 	Editor.setMenuButtonInactive()
	*/
	this.isInsertElm = function()
	{
		// элементы
		var elm = Element.obj;
		// типы
		var typeElm = Element.data.type;
		var typeElmInsert = this.elmType;

		// li
		if (typeElmInsert == "hlp-li" && !elm.closest(".hlp-ul, .hlp-ol").length) return false;
		// navitem
		if (typeElmInsert == "nav-item" && !elm.closest(".nav").length) return false;
		// если буффер не пустой и у них один родитель (frame|page)
		else if (this.bufferHtml) return true;
		else return false;
	}

	/**
	* Вставить элемент
	* @uses this.isNotFit()-parent(ElementSelf)
	* @see 	ElementManController.setEvent() 			 	 	
	* @see 	ElementManController.moveDownSection()
	* @see 	ElementManController.moveUpSection()
	* @see 	PageStruct.moveElm()
	* @see 	Key.key86()
	*/
	this.insert = function(typeInsert)
	{
		if (!this.isInsertElm()) return false;
 
		var elm = Element.obj;
		
		//блок элемента который надо вставить на страницу
		var elm_block = this.bufferHtml;
		if (!elm_block) return false;

		//вставляем элемент на страницу
		$(".element").removeAttr("status");
		
		typeInsert = this.getTypeInsert(typeInsert, elm);
		this.insertElement(elm_block, this.type, typeInsert);

		//новый элемент
		var newElm = Element.getParentWrap(elm).find('.element[status="new"]');
		if (!newElm.length) newElm = elm;
			
		//взависимости от того был элемент вырезан или скопиравон 
		if (this.operationType == 'cut') { 
			this.bufferHtml = false; // очищаем buffer
		} else {
			newElm.removeAttr("data-id").find("*").removeAttr("data-id");
			// ставим новый id
			Element.addNewId(newElm);

			// для секции для навигации
			if (newElm.hasClass("section")) {
				var elmNum = Element.getMaxNumberClass($(".section"), "data-num");
				newElm.attr("data-num", elmNum);
			}

			/*************/
			if (this.isNewClass) {
				Element.setNewClass(newElm);
			}
			/*************/
		}	

		//убираем атрибут отметку
		$("*").removeAttr('status');
		// стативм стили
		this.setStyle(newElm);
		// Эммитируем нажатие
		newElm.mousedown().mouseup();

		PageStruct.build(newElm);// строим структуру
		StyleCanvas.setScrollTopElm(newElm);// ставим scroll  на полотне
		
		// убираем пустые параграфы, не понятно почему они повляются
		$("p").filter(function() {
			return !$(this).attr("class") ? true : false; 
		}).remove();
	};


	/**
	* Отдает тип вставки
	*
	* @see 	this.insert()
	*/
	this.getTypeInsert = function(typeInsert, elm)
	{
		// если не вмещается, всавляем после элемента
		if (this.operationType == 'copy' 
				&& this.elmOrigin == elm) {
			typeInsert = "after";
		} else if (this.elmOrigin.attr("data-id") == elm.attr("data-id")) {
			typeInsert = "after";
		}

		return typeInsert;
	}

	this.setStyle = function(newElm)
	{
		// слишком большой margin-left
		if (newElm.hasClass("row")) return false;
		else if (newElm.hasClass("column")) return false;
		else if (newElm.hasClass("section")) return false;
		else if (newElm.css("position") == "absolute") return false;

		var elmWidth = Element.getWidth(newElm);
		var elmMarginLeft = parseInt(newElm.css("margin-left"));
		if (!elmMarginLeft) return false;
		var elmParentWidth = newElm.parent().width();

		var widthSpaceElm = elmWidth + elmMarginLeft;

		// слишком большой отступ
		if (widthSpaceElm > elmParentWidth) {
			newElm.css("margin-left", "0px");
			ElementCss.set(false, newElm);
		}
	}

/********************************************************************************************/
/**********************************************************************************************/
	/**
	* Удаление элемента
	*
	* @see 	Key.key8()
	* @see 	ManagerModal.deleteElm()
	*/
	this.delete = function(elm, noChosenAfterDeleteV)
	{
		if (!elm) elm = Element.obj;

		if (elm.closest(".modal").length && Screen.isModal()) ManagerModal.fix();

		// если это последняя секция на странице
		if (elm.hasClass("section") && elm.closest(".page").length) {
			var listSectionV = $(".content .page .section").not("[data-delete='true']");
			listSectionV = listSectionV.filter(function() {
				return $(this).css("display") != "none";
			});
			if (listSectionV.length == 1) {
				Notification.error(Resource.hlp_manipulation_notification_no_delete_last_section);
				return false;
			}
		}

		// elm на всю ширину, убираем класс
		if (elm.hasClass("hlp-elm-full-width")) {
			elm.closest(".hlp-section-static").removeClass("hlp-section-static");
		}

		// прячем элемент
		var type = Element.data.type;
		var parentElm = false;
		var elmDeleteObj = this.getElmWithWrap(elm);
		
		if (type != "column") {
			//родительский элемент
			var parentElm = this.getParSelectedElm(elm, type);
			elmDeleteObj.css("display", "none").attr("data-delete", "true");
			if (!noChosenAfterDeleteV) {
				parentElm.mousedown().mouseup();
			}
		} else {
			elm.find(">*").css("display", "none").attr("data-delete", "true");
		}

		// если есть в буффере
		this.clearBufferExiststDeleting(elm);

		// удаляем элемент

		var obj = this;
		setTimeout(function() {
			// если это колонка и она не пустая
			if (type == "column") {
				//убираем только потомков
				obj.deleteDataChildElm(elm); 
				elm.html("");
			} else {
				var bgImg = elm.css("background-image");
				obj.deleteDataElm(elm, type); //данные
				
				// для модального удаляем его оболочку 
				if (elm.hasClass("modal")) {
					var modalId = elm.attr("data-id");
					
					// на полотне
					$(".contentModal .modal[data-id='"+modalId+"']").remove();
					// удаляем в списке
					elmDeleteObj = $(".listModal .modal[data-id='"+modalId+"']").parent()
				}
				
				elmDeleteObj.remove();
			}

			// выделяем элемент
			if (parentElm) PageStruct.select(parentElm);
			// фиксируем историю
			History.record();
			// строим структуру
			PageStruct.build(parentElm);
		}, 300);	
	};
/******************************************************************************************/
	/**
	* Удалить элемент с полотна
	*
	* @see 	this.delete(), this.cut()
	*/
	this.deleteElement = function(elm, type, src)
	{
		//родительский элемент
		var parentElm = this.getParSelectedElm(elm, type);

		//удаляем элемент
		elm = this.getElmWithWrap(elm);
		elm.remove();

		/**
		* эмитируем клик на родителя, что бы он выбрался
		* @event 	ElementStyleController.setEventCanvas()
		*/
		parentElm.mousedown().mouseup();

		return parentElm;
	}

	/**
	* Отдает родителя выбраного элемента
	*
	* @uses 	Element.sel_type 	тип выбраного элемента
	* @see 		this.deleteElement()
	*/
	this.getParSelectedElm = function(elm, type)
	{
		//выбираем родителя удаляемого элемента
		//если это секция
		if (type == 'section') {
			//выделяем предыдущию секцию
			var elm_par = elm.next();
			//если ее нет то выбираем следующию секцию
			if (!elm_par.hasClass('section')) {
				elm_par = elm.prev();
			}
		} else {
			//родитель
			var elm_par = elm.parent().closest(".element");
		}

		return elm_par;
	};

	/**
	* Удаляет потомков
	*
	* @see 	this.delete()
	*/
	this.deleteDataChildElm = function(elm)
	{
		var listChildElm = elm.find(".element, .element-content");
		var countChild = listChildElm.length;

		for (var iChild = countChild - 1; iChild >= 0; iChild--) {
			var childElm = listChildElm.eq(iChild);
			// если есть в буффере
			this.clearBufferExiststDeleting(childElm);

			//удаляем из масиива css
			this.deleteElmClass(childElm);
			// кдаляем сам элемент
			childElm.remove();
		}
	}

	/**
	* Очищает буффер если там удаляемый элемент
	*
	* @see 	this.delete()
	* @see 	this.deleteDataChildElm()
	*/
	this.clearBufferExiststDeleting = function(elm)
	{
		if (this.bufferHtml) {
			var elmId = elm.attr("data-id");
			var patter = new RegExp('data-id="'+elmId+'"', "gim");
			var isExistsInBuffer = this.bufferHtml.match(patter);
			
			if (isExistsInBuffer) this.bufferHtml = '';
		}
	}

	/**
	* Очищает буффер
	*
	* @see 	EditorContoller.setEventTab()
	*/
	this.clearBuffer = function(elm)
	{
		this.bufferHtml = '';
	}

	/**
	* Удаляем данные элемента
	*
	* @see 	this.delete()
	*/
	this.deleteDataElm = function(listElm, type)
	{
		// если это колонка, удаляется и его братья
		// if (type == "column") listElm = listElm.parent().find(">.column");

		// удаляем элемнт (цикл нужен для колонок)
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var item = listElm.eq(iElm);
			//удаляем из масиива css
			this.deleteElmClass(item);

			// удаляем потомков
			this.deleteDataChildElm(item);
		}
	}

	/**
	* Удаляем классы элемента
	*
	* @see 	this.deleteDataElm()
	* @see 	this.deleteDataChildElm()
	*/
	this.deleteElmClass = function(elm)
	{
		ElementCss.delete(elm);
	}
/**********************************************************************************/
	

}//конец класса 



/**
* Модальное окно
*
*
*
*/
ElementModal.prototype = ElementBasic;
var ElementModal = new ElementModal();
ElementModal.parent = ElementBasic;

// var ElementModal = new ElementModal();
function ElementModal() {
	this.type = 'modal';
	this.class = 'modal';
	this.is_insert = true;
	this.resize_width = true;
	this.no_move = true;
	this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_modal, 'img':'modal.png', 'type':'none'};
	this.css = ["width", "min-height", "margin_v", "padding_v", "bg", "border", "boxShadow", "text"];
	this.width = 450;
	this.style = "margin-top: 50px; background-color: rgb(255,255,255);";

	this.modalNum = false;
/************************************************************************************************/
	
	this.createAction = function(modalClass)
	{
		if (!modalClass) modalClass = Element.getNewClassUnique("modal", "modal");

		// var modalNum = Element.getMaxNumberClass($(".modal"), "data-num");
		// // добавляем префикс
		// modalNum = Element.addClassPrefix(modalNum);
		
		// this.modalNum = modalNum;
		
		// модальное окно
		var content = this.getElementHtml(modalClass);
		
		// блок со списком модальных окон
		var parentModal = this.getListParent();

		// добавляем на страницу
		parentModal.append(content);

		var marginUnit = StyleUnit.getUnitMenu("margin-top");

		// фиксируем стили
		var newModal = $("."+modalClass);
		Element.addNewId(newModal);
		// StyleUnit.setUnitMenu("width", "%");
		StyleUnit.setUnitMenu("margin-top", "px");
		ElementCss.set("geometry", newModal);

		// возращаем значение назад
		StyleUnit.setUnitMenu("margin-top", marginUnit);

		// ставим стили кнопки закрыть
		this.addButClose(newModal);

		/**********************************/
		//id нового модального
		var objSiteContent = Element.getSiteContentObj();
		var newModalId = objSiteContent.find(".listModal .modal:last").attr("id");
		// выбор элемента
		ManagerModal.chosenItem(false, newModalId);
		
		Notification.ok(Resource.hlp_manager_modal_create_successfully);
		Modal.delete();

		// ставим список в селект
		ManagerModal.setSelectListItem();
	}

	this.getListParent = function()
	{
		var objSiteContent = Element.getSiteContentObj();
		var parentModal = objSiteContent.find(".listModal");

		if (!parentModal.length) { // если нету
			objSiteContent.append('<div class="listModal listModalPage"></div>');
		}
		
		return objSiteContent.find(".listModal");
	}

/**********************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this.create()
	*/	
	this.getElementHtml = function(modalClass)
	{

		var name = this.getNewModalId();
		var modalId = name;
		var modalNum = name;

		this.modalNum = modalNum;

		// var name = "modal_"+modalNum;
		// var modalId = Element.getNewElmId("modal"); // id="'+modalId+'"
		// var modalId = "modal"+modalNum;

		var block = '	<div class="element modal '+modalClass+' hlp-modal" id="'+modalId+'" data-num="'+modalNum+'" elm-type="modal" name="'+name+'" class-unique="'+modalClass+'" style="'+this.style+'">\
						</div>';
		block = '<div class="modalWrap">'+block+'</div>';

		return block;
	}


/***********************************************************************************************/
	/**
	* Отдает id
	*
	* @see 	this.getElementHtml()
	* @see 	ManagerModal.addNewPageInList()
	*/	
	this.getNewModalId = function()
	{
		var objSiteContent = Element.getSiteContentObj();
		var listModal = objSiteContent.find(".listModalPage .modal");
		var maxNumber = 0;
		var countModal = listModal.length;

		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			var modalId = modal.attr("id").replace(/modal-p[0-9]+-/gim, '');
			var number = modalId.replace(/[^0-9]+/gim, '');
			number = parseInt(number);
			if (number > maxNumber) maxNumber = number;
		}

		maxNumber++;
		var id = 'modal-p'+Data.page.page_id+'-'+maxNumber;

		return id;
	}

/**********************************************************************************************/
	/**
	* Добавление кнопки закрыть
	*
	* @see 	this.create()
	*/
	this.addButClose = function(modalObj)
	{
		Element.obj = modalObj;

		var closeBlock = this.getCloseBlock();
		modalObj.append(closeBlock);
		this.setStyleModalClose();
	}

	/**
	* Отдает блок закрыть модальное
	*
	* @see 	this.addButClose()
	*/
	this.getCloseBlock = function()
	{
		// var imageClass = Element.getNewClassUnique("image", "modal");
		var imageClass = "m"+this.modalNum+"-image-1";
		var imageBlock = '\
						<div class="element but-modal-close image" elm-type="image" data-action="modal-close" position-side="t-r">\
							<img src="/user/0/main/img/close.png" alt=""/>\
						</div>';

		return imageBlock;
	}

	/**
	* Устанавливает стили кнопки закрыть модальное
	* 
	* @see 	this.addButClose()
	*/
	this.setStyleModalClose = function()
	{
		var elmModal = $(".modal[data-num='"+this.modalNum+"']");
		var elmImage = elmModal.find(".image");

		Element.addNewId(elmImage);
		
		StyleUnit.setUnitMenu("width", "px");
		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("right", "px");

		var listStyle = { "width":"30px", "position":"absolute", "top":"10px","right":"10px","z-index":"1000"}
		ElementCss.set("geometry", elmImage, false, listStyle);
		
		// StyleUnit.setUnitMenu("width", "%");
	}
/*******************************************************************************************************/
}//end class


/**
* Создание формы
*
*/
ElementForm.prototype = ElementBasic;
var ElementForm = new ElementForm();
ElementForm.parent = ElementBasic;
function ElementForm()
{
	this.type = 'form';
	this.class = 'form';
	this.resize_width = true;
	this.is_insert = true;
	this.title = {'name':Resource.hlp_element_name_form, 'img':'form.png', 'type':'none'};
	this.css = ["width", "min-height", "align", "position", "padding", "border", "text", "bg", "boxShadow", "transform", "other"];
	this.setting = ["form"];
	this.width = 350;
	// this.notAddClass = true;
	this.style = 'width:'+this.width+'px;padding-left:20px;padding-right:20px;background-color:rgb(250,250,250);border-radius:4px; border:1px solid rgb(100,100,100);';
	/**
	* @var 	string 		класс стиля формы
	*/
	this.form_class = '';
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{
		var formClass = Element.getNewClassUnique("form");
		var inputClass = Element.getNewClassUnique("input");
		var submitClass = Element.getNewClassUnique("submit");
		var titleClass = Element.getNewClassUnique("text");

		var title = '\
			<p class="element text '+titleClass+'" class-unique="'+titleClass+'" elm-type="text" style="width:210px;margin-top:10px;margin-left:auto;margin-right:auto;text-align:center;">\
				<span class="element-content">'+Resource.hlp_element_name_form_label+'</span>\
			</p>';

		var inputStyle = ElementInput.style;
		var submitStyle = ElementSubmit.style;

		var block = '	<form class="new-element element form hlp-form" action="" method="post" style="'+this.style+'">\
							<input type="hidden" name="hlp-redirect" redirect-type="page" value="2" />\
							<input type="hidden" name="hlp-form-name" value="new form" />\
							<input class="element input" style="'+inputStyle+'" elm-type="input" type="text" data-mask="name" name="name" placeholder="'+Resource.hlp_element_name_form_input_name+'" />\
							<input class="element input" style="'+inputStyle+'" elm-type="input" type="text" data-mask="email" name="email" placeholder="'+Resource.hlp_element_name_form_input_email+'" input-type="email"/>\
							<input class="element input" style="'+inputStyle+'" elm-type="input" type="text" data-mask="phone" name="phone" placeholder="'+Resource.hlp_element_name_form_input_phone+'" input-type="phone"/>\
							<input onclick="return false;" class="element submit" style="'+ElementSubmit.style+'" elm-type="submit" type="submit" value="'+Resource.hlp_element_name_form_input_submit+'" />\
						</form>';

		return block;
	}

	this.actionAfter = function(params)
	{
		var elmObj = Element.getObj();
		// добавляем политику кон.
		PrivacyPolicy.addPersonalData(elmObj);
	}
	
}// end class

/**************************************************************************************************/
/**************************************************************************************************/
/**
* Создание поля формы
*
*/
ElementInput.prototype = ElementBasic;
var ElementInput = new ElementInput();
ElementInput.parent = ElementBasic;
function ElementInput()
{
	this.type = 'input';
	this.class = 'input';
	this.is_brother = true;
	this.no_move = true;
	this.no_resize = true;
	this.is_show_text = true;
	// this.parent_elm = ".elementForm";
	this.title = {'name':Resource.hlp_element_name_form_input, 'img':'input.png','type':'none'};
	this.css = ["width", "min-height", "margin", "padding", "align", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["input"];
	this.notAddClass = true;
	this.style = 'margin-top: 10px;font-size: 15px; border-radius: 3px; background-color: rgb(255,255,255);border: 1px solid rgb(200,200,200);padding-top: 6px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px;';
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{	
		var block = '<input class="new-element element input" elm-type="input" type="text" name="new_input" placeholder="'+Resource.hlp_element_name_form_input_new+'"/>';
		
		return block;
	}


}// end class
/**************************************************************************************************/
/**************************************************************************************************/
/**
* Создание поля формы
*
*/
ElementTextarea.prototype = ElementBasic;
var ElementTextarea = new ElementTextarea();
ElementTextarea.parent = ElementBasic;
function ElementTextarea()
{
	this.type = 'textarea';
	this.class = 'textarea';
	this.no_move = true;
	this.no_resize = true;
	this.is_show_text = true;
	// this.parent_elm = ".elementForm";
	this.title = {'name':'Textarea', 'img':'textarea.png','type':'none'};
	this.css = ["width", "margin_v", "min-height", "padding", "align", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["input"];
	this.notAddClass = true;
	this.style = 'margin-top: 10px;font-size: 15px; border-radius: 3px; background-color: rgb(255,255,255);border: 1px solid rgb(200,200,200);padding-top: 6px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px;';
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{	
		var block = '<textarea class="new-element element input" elm-type="textarea" name="new_textarea" placeholder="'+Resource.hlp_element_name_form_input_new+'"></textarea>';
		return block;
	}


}// end class
/**************************************************************************************************/
/**************************************************************************************************/
/**
* Создание submit
*
*/
ElementSubmit.prototype = ElementBasic;
var ElementSubmit = new ElementSubmit();
ElementSubmit.parent = ElementBasic;
function ElementSubmit()
{
	this.type = 'submit';
	this.class = 'submit';
	this.is_hover = true;
	this.no_move = true;
	this.no_resize = true;
	// this.resize_width = true;
	this.is_show_text = true;//в панели меню поле с текстом
	this.title = {'name':'Submit', 'img':'submit.png', 'type':'none'};
	this.css = ["width", "min-height", "margin", "padding", "align", "text", "bg", "border", "boxShadow", "textShadow", "transform", "other"];
	this.setting = ["submit"];
	this.noWidthPersent = true; //ширина не в процентах
	this.notAddClass = true;
	this.width = 120;
	this.style = 'width:'+this.width+'px; padding-top:8px; padding-bottom:7px;margin-top: 15px; margin-bottom: 15px; margin-left: auto; margin-right: auto; background-color: rgb(140,140,140); color: rgb(250,250,250);border-radius: 4px;';
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{
		var block = '<input onclick="return false;" class="new-element element submit" elm-type="submit" type="submit" value="'+Resource.hlp_element_name_form_input_submit+'" />';

		return block;
	}
}// end class

/**************************************************************************************************/
/**************************************************************************************************/
/**
* Создание поля формы
*
*/
ElementCheckbox.prototype = ElementBasic;
var ElementCheckbox = new ElementCheckbox();
ElementCheckbox.parent = ElementBasic;
function ElementCheckbox()
{
	this.type = 'checkbox';
	this.class = 'checkbox';
	this.is_brother = true;
	this.no_move = true;
	this.no_resize = true;
	this.title = {'name':"Checkbox", 'img':'input.png','type':'none'};
	this.css = ["width", "min-height", "margin", "align", "boxShadow", "other"];
	this.setting = ["checkbox"];
	this.notAddClass = true;
	this.style = 'width:15px;';
	this.width = 15;
	
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{	
		var block = '<input class="new-element element checkbox" elm-type="checkbox" type="checkbox" name="new_checkbox" style="'+this.style+'"/>';
		
		return block;
	}

}// end class

/**
* Создание поля формы
*
*/
ElementRadio.prototype = ElementCheckbox;
var ElementRadio = new ElementRadio();
ElementRadio.parent = ElementCheckbox;
function ElementRadio()
{
	this.type = 'radio';
	this.class = 'radio';
	this.title = {'name':"Radio", 'img':'input.png','type':'none'};
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{	
		var block = '<input class="new-element element radio" elm-type="radio" type="radio" name="new_radio" style="'+this.style+'"/>';
		
		return block;
	}

}// end class

/**************************************************************************************************/
/**************************************************************************************************/
/**
* Создание поля формы
*
*/
ElementSelect.prototype = ElementBasic;
var ElementSelect = new ElementSelect();
ElementSelect.parent = ElementBasic;
function ElementSelect()
{
	this.type = 'hlp-select';
	this.class = 'hlp-select';
	this.is_brother = true;
	this.no_move = true;
	this.no_resize = true;

	this.title = {'name':"Select", 'img':'input.png','type':'none'};
	this.css = ["width", "margin", "padding", "align", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["select"];
	this.notAddClass = true;
	this.style = 'margin-top: 10px;font-size: 15px; border-radius: 3px; background-color: rgb(255,255,255);border: 1px solid rgb(200,200,200);padding-top: 6px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px;';
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{	
		var block = '\
			<select class="new-element element hlp-select" elm-type="hlp-select" name="new_select" style="'+this.style+'">\
				<option value="1">One</option>\
				<option value="2">Two</option>\
			</select>\
			';
		
		return block;
	}

/**************************************************************************************************/

}// end class


/**************************************************************************************************/
/**************************************************************************************************/
ElementUploadFileWrap.prototype = ElementBlock;
var ElementUploadFileWrap = new ElementUploadFileWrap();
ElementUploadFileWrap.parent = ElementBlock;
function ElementUploadFileWrap()
{	
	this.type = "upload_file_wrap";
	this.notAddClass = true;
	this.setting = ["upload_file"];
	this.no_move = true;
	this.no_resize = true;
	this.width = false;
	this.title = {'name':"Файл", 'img':'input.png','type':'none'};

	this.getElementHtml = function()
	{
		var classUniqueBut = Element.getNewClassUnique("button");
		var classUniqueText = Element.getNewClassUnique("text");

		var block = '\
			<div class="new-element element hlp-upload-file-wrap block hlp-wrap" elm-type="upload_file_wrap" data-empty="true">\
				<div class="new-element element hlp-upload-file hlp-type-button hlp-but button" elm-type="upload_file" style="z-index:10;" data-action="none" elm-type="upload_file">\
					<div class="element-content hlp-element-content">\
						Загрузить\
					</div>\
				</div>\
				<div class="new-element element hlp-upload-file-name text" elm-type="upload_file_name" elm-type="upload_file_name">\
					<span class="element-added hlp-element-content element-content">\
						Нет файла\
					</span>\
				</div>\
			</div>\
		';

		return block;		
	}

/**************************************************************************************************/

} // end class

ElementUploadFile.prototype = ElementButton;
var ElementUploadFile = new ElementUploadFile();
ElementUploadFile.parent = ElementButton;
function ElementUploadFile() {
	this.type = "upload_file";
	this.notAddClass = true;
	this.setting = [];
	this.no_manipulation = true;
	this.no_move = true;
	this.no_resize = true;
	this.title = {'name':"Файл - кнопка", 'img':'button.png','type':'none'};

} // end class

ElementUploadFileName.prototype = ElementTextarea;
var ElementUploadFileName = new ElementUploadFileName();
ElementUploadFileName.parent = ElementText;
function ElementUploadFileName() {
	this.type = "upload_file_name";
	this.notAddClass = true;
	this.setting = [];
	this.no_manipulation = true;
	this.no_move = true;
	this.no_resize = true;
	this.title = {'name':"Файл - имя", 'img':'text.png','type':'none'};


} // end class

/*
* Родителя для блоков каракаса
*
*/
ElementFrame.prototype = ElementSection;
var ElementFrame = new ElementFrame();
ElementFrame.parent = ElementSection;
function ElementFrame() {
	this.is_added_block = false;
	this.no_manipulation = true;
	this.notAddClass = true;
	/**
	* Отдает id элемента
	*
	*/
	this.getIdNewElm = function(elm_class)
	{
		return this.id;
	}
};
//end class

/********************************************************************************************/
/*********************************************************************************************/
// Навигация
ElementNav.prototype = ElementBasic;
var ElementNav = new ElementNav(); 
ElementNav.parent = ElementBasic;
function ElementNav() {
	this.id = "nav";
	this.class = 'nav';
	this.type = "nav";
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_nav, 'img':'nav.png', 'type':'none'};
	this.css = ["width", "padding", "min-height", "text", "position", "align", "bg", "border", "boxShadow", "other"];
	this.noWidthPersent = true;
	this.width = 400;

	this.getElementHtml = function()
	{
		var block = '	<nav class="new-element element nav hlp-nav" style="width:'+this.width+'px;">\
							<a href="" onclick="return false" class="element hlp-nav-item nav-item" style="'+ElementNavItem.style+'" elm-type="nav-item" data-action="page">\
								<span class="element-content">'+Resource.hlp_element_name_nav_item_value+' 1</span>\
							</a>\
							<a href="" onclick="return false" class="element hlp-nav-item nav-item" elm-type="nav-item" data-action="page">\
								<span class="element-content">'+Resource.hlp_element_name_nav_item_value+' 2</span>\
							</a>\
							<a href="" onclick="return false" class="element hlp-nav-item nav-item" elm-type="nav-item" data-action="page">\
								<span class="element-content">'+Resource.hlp_element_name_nav_item_value+' 3</span>\
							</a>\
							<a href="" onclick="return false" class="element hlp-nav-item nav-item" elm-type="nav-item" data-action="page">\
								<span class="element-content">'+Resource.hlp_element_name_nav_item_value+' 4</span>\
							</a>\
						</nav>';


		return block;
	}

	/**
	* Вставка элемента
	*
	*/
	this.actionAfter = function()
	{
		var elm = Element.obj;
		// создаем мобильное меню
		ElementNavButtonMobile.create({"only_create":"true"});
		ElementNavButtonMobile.actionAfter();

		// устанавливаем стили
		var navMobileObj = $(".nav-button-mobile");
		var listStyle = {"display":""};
		ElementCss.set("geometry", navMobileObj, "desktop", {"display":"none"});
		ElementCss.set("geometry", navMobileObj, "tab-l", {"display":"block"});
		ElementCss.set("geometry", elm, "tab-l", {"display":"none"});

		// ставим z-index для секции
		var elmSectionObjV = Element.obj.closest(".section");
		elmSectionObjV.css("z-index", 100);
		ElementCss.set(false, elmSectionObjV);
	}

	/**
	* Перевод старых в новые
	*
	* @see 	Page.replace()
	*/
	this.reloadOld = function()
	{
		var listNavObj = $(".nav");
		var countNav = listNavObj.length;
		for (var iNav = 0; iNav < countNav; iNav++) {
			var navObjV = listNavObj.eq(iNav);
			var listNavItemLi = navObjV.find("> .list-nav-item > li");
			var countNavItemLi = listNavItemLi.length;
			if (!countNavItemLi) continue;
			
			var navContentV = '';
			for (var iLi = 0; iLi < countNavItemLi; iLi++) {
				navContentV += listNavItemLi.eq(iLi).html();
			}
			navObjV.html(navContentV);
		}	


		$(".hlp-nav-level-wrap").remove();

		Input.newCanvas();
	}

	
}//end class	
/************************************************************************************************/
ElementNavItem.prototype = ElementBasic;
var ElementNavItem = new ElementNavItem(); 
ElementNavItem.parent = ElementBasic;
function ElementNavItem() {
	this.type = 'nav-item';
	this.class = 'nav-item';
	this.no_move = true;
	this.no_resize = true;
	this.is_brother = true;
	this.is_show_text = true;
	this.is_hover = true;
	this.is_state_chosen = true;
	this.parent_elm = '.nav';
	this.notAddClass = true;
	this.title = {'name':Resource.hlp_element_name_nav_item, 'img':'nav-item.png', 'type':'none'};
	this.css = ["width", "margin", "padding", "min-height", "text", "bg", "border",  "transform", "boxShadow", "other"];
	//  "floatSide",
	this.setting = ["click", "seo"];
	this.style = 'padding-top:6px; padding-right:10px;padding-bottom:4px;padding-left:10px; margin-left: 15px; background-color:rgb(150,150,150);border-radius: 3px;';
	this.isMarginLeftPx = true;

/*********************************************************************************************/	
	this.getElementHtml = function()
	{
		var block = '\
				<a href="" onclick="return false" class="new-element element hlp-nav-item nav-item" elm-type="nav-item" data-action="page">\
					<div class="element-content">'+Resource.hlp_element_name_nav_item_value+'</div>\
				</a>\
			';

		return block;
	}

	/**
	* Вставка элемента
	*
	*/
	this.insertElement = function(block, type)
	{
		if (Element.obj.hasClass("nav-item")) {
			Element.obj.after(block);
		} else {
			Element.obj.closest(".nav").append(block);
		}
		
		var newElm = $(".new-element");
		Element.addNewId(newElm);
		this.setEvent();
	}
}//end class
/*********************************************************************************/
/*********************************************************************************/



ElementNavMobile.prototype = ElementBasic;
var ElementNavMobile = new ElementNavMobile(); 
ElementNavMobile.parent = ElementBasic;
function ElementNavMobile() {
	this.class = 'nav-mobile';
	this.type = "nav-mobile";
	this.no_manipulation = true;
	this.no_resize = true;
	this.no_move = true;
	this.no_added_class = true;
	this.title = {'name':Resource.hlp_element_name_nav_menu_mobile, 'img':'nav.png', 'type':'none'};
	this.css = ["margin_v", "padding", "text", "bg", "border", "boxShadow", "other"];
} // end class


ElementNavItemMobile.prototype = ElementBasic;
var ElementNavItemMobile = new ElementNavItemMobile(); 
ElementNavItemMobile.parent = ElementBasic;
function ElementNavItemMobile() {
	this.class = 'nav-item-mobile';
	this.type = "nav-item-mobile";
	this.no_manipulation = true;
	this.no_resize = true;
	this.no_move = true;
	this.is_hover = true;
	this.is_state_chosen = true;
	this.no_added_class = true;
	this.no_edit_class = true;
	this.title = {'name':Resource.hlp_element_name_nav_item, 'img':'nav-item.png', 'type':'none'};
	this.css = ["margin_v", "padding", "text", "bg", "border", "boxShadow", "other"];
} // end class

/***********************************************************************************************/
ElementNavButtonMobile.prototype = ElementImage;
var ElementNavButtonMobile = new ElementNavButtonMobile(); 
ElementNavButtonMobile.parent = ElementImage;
function ElementNavButtonMobile() {
	this.class = 'nav-button-mobile';
	this.type = "nav-button-mobile";
	this.title = {'name':Resource.hlp_element_name_nav, 'img':'nav.png', 'type':'image', 'but_text':'Изменить'};
	this.setting = ["seo"];
	this.width = 37;
	this.notAddClass = true;
	this.noWidthPersent = true;
	this.no_edit_class = true;

	this.getElementHtml = function()
	{
		var countNav = $(".content .nav").length;
		if (countNav < 2) $(".nav-button-mobile").remove();

		var block = '	<div class="new-element element hlp-nav-button-mobile nav-button-mobile" class-unique="hlp-nav-button-mobile" data-action="nav-mobile" style="width:'+this.width+'px;">\
							<img src="/user/0/main/img/menu.png" alt=""/>\
						</div>';
		return block;
	}

	this.addAddedBlock = function()
	{
		var addedBlock = '<div class="addedBlock butShowNavMobile">'+Resource.hlp_element_nav_but_show+'</div>';
		Element.obj.prepend(addedBlock);
	}

	this.actionAfter = function() {
		var elmMenu = $(".content .nav-panel-mobile");
		
		if (!elmMenu.length) {
			ElementNavPanelMobile.create();
			ElementNavPanelMobile.isNewPanel = true;
		}
	}

} // end class

/****************************************************************************************************/
/***********************************************************************************************/
/************************************************************************************************/
ElementNavPanelMobile.prototype = ElementBasic;
var ElementNavPanelMobile = new ElementNavPanelMobile();
ElementNavPanelMobile.parent = ElementBasic;
function ElementNavPanelMobile() {
	this.class = 'nav-panel-mobile';
	this.type = "nav-panel-mobile";
	this.no_resize = true;
	this.no_move = true;
	this.is_insert = true;
	this.no_added_class = true;
	// this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_nav_menu_panel, 'img':'section.png', 'type':'none'};
	this.css = ["width", "position-panel", "padding", "text", "bg", "border", "boxShadow"];

	this.isNewPanel = false;
	this.width = 270;
	this.noWidthPersent = true;
/***************************************************************************************************/
	/**
	* Видно или нет
	*
	* @see 	Screen.setDesktop()
	*/
	this.isShow = false;

	/**
	* Ставит события
	*
	* @see 	Resize.create()
	*/
	this.setEvent = function()
	{
		var obj = this;
		var butNavMobile = $(".butShowNavMobile");
		
		butNavMobile.off("mousedown");
		butNavMobile.on("mousedown", function() {

			var elmMenu = $(".content .hlp-nav-panel-mobile");
			elmMenu.removeAttr("style");

			if (!elmMenu.length) {
				elmMenu = obj.create();
				obj.isNewPanel = true;
			}

			if (elmMenu.css("display") == "none") {
				var displayMenu = "block";
				var butType = "hide";
				var textButton = Resource.hlp_element_nav_but_hide;
				obj.isShow = true;
			} else {
				var displayMenu = "none";
				var butType = "show";
				var textButton = Resource.hlp_element_nav_but_show;
				obj.isShow = false;
			}
			
			// ставим значение 
			obj.setDisplay(obj.isShow);
			Element.obj.find(".butShowNavMobile").attr("type", butType).text(textButton);
			
			// ставим размер
			obj.setSize();

			// поднимаем scroll
			Screen.setScroll(0);

			return false;
		});

		butNavMobile.off("dblclick");
		butNavMobile.on("dblclick", function() {return false;});
	}
/**********************************************************************************************/

	/**
	* Установить значение display при выборе элемента
	*
	* @see 	ElementStyleController.actionAfterSelected()
	*/
	this.setDisplaySelect = function()
	{
		this.isShow = Element.obj.closest(".nav-panel-mobile").length ? true : false;
		this.setDisplay(this.isShow);
	}

	/**
	* Ставит значение при изменении экрана 
	*
	* @see 	EditorController.setEventEditScreen() 
	*/
	this.setDisplayScreen = function()
	{
		var isButtonBlock = $(".nav-button-mobile").css("display") == "none" ? false : true; 

		// при переключение экрана кнопки меню (мобильной) нету
		var isShow = isButtonBlock && this.isShow ? true : false;
		this.setDisplay(isShow);
	}


	/**
	* Ставит display
	*
	* @see 	this.setEvent()
	* @see 	this.setDisplaySelect()
	* @see 	this.setDisplayScreen()
	*/
	this.setDisplay = function(isShow)
	{
		var elmPanel = $(".nav-panel-mobile");
		
		// ставим пункты меню
		if (isShow) {
			elmPanel.addClass("displayBlock");

			if (!Element.obj.hasClass("nav-item-mobile")
					&& !Element.obj.hasClass("hlp-nav-mobile-level")) {
				this.setNavItem();
			}
		} else {
			elmPanel.removeClass("displayBlock");
			if (elmPanel.css("display") == "block") {
				ElementCss.clearAllScreen("display", false, elmPanel, "desktop");
			}
		}
		
		this.setSize();// размер
		this.setScroll();// scroll
	}
/**************************************************************************************************/
	/**
	* Создаем если
	*
	* @see Page.replace()
	*/
	this.createIsNoExists = function()
	{
		if (!$(".hlp-nav-panel-mobile").length) {
			this.create();
		}
	}

	/**
	* Создает панель
	*
	* @see 	this.setEvent()
	*/
	this.create = function()
	{
		var block = '\
			<div class="element hlp-nav-panel-mobile nav-panel-mobile" elm-type="nav-panel-mobile" class-unique="hlp-nav-panel-mobile" style="width:240px;background-color: rgb(50,50,50);">\
				<nav class="element hlp-nav-mobile nav-mobile" elm-type="nav-mobile" class-unique="hlp-nav-mobile" style="margin-top:20px;"></nav>\
			</div>';

		$(".nav-panel-mobile").remove();				
		$(".site").prepend(block);

		var navMobileObj = $(".nav-panel-mobile");
		// добавляем id
		Element.addNewId(navMobileObj);
		
		// ставим стили
		StyleUnit.setUnitMenu("width", "px");
		ElementCss.set("geometry", navMobileObj, "desktop");
		ElementCss.set("geometry", $(".content .nav-mobile"), "desktop");

		return navMobileObj;
	}

	/**
	* Ставим пункты меню 
	*
	* @see 	this.setDisplay()
	*/
	this.setNavItem = function()
	{
		var elmNavMob = $(".content .nav-panel-mobile .nav-mobile");

		var listNavItem = $(".content .site .nav:eq(0) .nav-item");
		var countItem = listNavItem.length;
		var content = '';

		var parentObjV = $(".content .site .nav:eq(0)");
		content = this.getListNavItem(parentObjV);
		

		elmNavMob.html(content);
		Input.newCanvas();

		// если новая панель ставим стили
		if (this.isNewPanel) {
			var navItemObj = $(".content .nav-item-mobile");
			navItemObj.css("style", "color:rgb(230,230,230);padding-top:4px; padding-bottom:3px; padding-left: 13px;");
			ElementCss.set("geometry", navItemObj, "desktop");
		}

		this.isNewPanel = false;
	}	


	this.getListNavItem = function(parentObjV, menuLevel)
	{
		if (!menuLevel) menuLevel = 0;
		menuLevel++;

		var listNavItem = parentObjV.find("> .nav-item");

		var content = ''; 

		var countItem = listNavItem.length;
		if (listNavItem.css("float") == "right") {
			for (var i = countItem - 1; i >= 0; i--) {
				var navItem = listNavItem.eq(i);
				content += this.getNavItemHtml(navItem, i, menuLevel);
			}
		} else {
			for (var i = 0; i < countItem; i++) {
				var navItem = listNavItem.eq(i);
				content += this.getNavItemHtml(navItem, i, menuLevel);
			}
		}

		return content;
	}

	this.getNavItemHtml = function(navItem, iNavItem, menuLevel)
	{
		return '<div data-id="n-i-m-'+menuLevel+iNavItem+'" class="element hlp-nav-item-mobile nav-item-mobile" elm-type="nav-item-mobile">'+navItem.text()+'</div>';
	}


	/**
	* Ставит размер
	*
	* @see 	this.setEvent()
	* @see 	this.setDisplay()
	* @see 	Editor.setSize()
	*/
	this.setSize = function()
	{
		if (!this.isShow) return false; 

		var valueHeight = $(".contentWrap").height()+"px";
		var valueOffset = $(".content .site").offset();
		// var valueTop = valueOffset.top+"px";
		// var valueLeft = valueOffset.left+"px";
		var valueTop = $(".contentWrap").scrollTop() + "px";
		
		var listValue = { "height":valueHeight, "top":valueTop};
		var elmPanel = $(".conten .nav-panel-mobile");
		if (elmPanel.length) ElementCss.set();
	}

	/**
	* Ставит значение scroll
	*
	* @see 	this.setDisplay()
	*/
	this.setScroll = function()
	{
		var elmWrap = $(".contentWrap");
		var elmConten = $(".content");
		if (this.isShow == "block") {
			elmWrap.addClass("noScroll");
			elmConten.css("margin-right", "10px");
		} else { 
			elmWrap.removeClass("noScroll");
			elmConten.css("margin-right", "0px");
		}
	}
	
/*************************************************************************************************/	

} // end class

ElementMap.prototype = ElementBasic;
var ElementMap = new ElementMap();
ElementMap.parent = ElementBasic;
function ElementMap()
{
	this.type = 'map';
	this.class = 'map';
	this.is_edit = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_map, 'img':'map.png', 'type':'map', 'but_text':'Изменить'}
	this.css = ["width", "min-height", "position", "align", "border", "boxShadow", "transform", "other"];
	this.width = 500;
	this.mapSrc = false; //это карта
/*******************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 		this::create()
	*/	
	this.getElementHtml = function()
	{
		var attrId = '';

		var codeLine = this.getCode(this.mapSrc);
		var block = '<div '+attrId+'class="new-element element map hlp-map" style="min-height:300px;width:'+this.width+'px">\
						'+codeLine+'\
					</div>';
		
		return block;
	}

	/**
	* Отдает код
	*
	* @see 	this.getElementHtml()
	* @see 	EditElementMap.setEventSave()
	*/
	this.getCode = function(codeSrc)
	{
		if (this.isYandex(codeSrc)) {
			var codeLine = '<script type="text/javascript" charset="utf-8" src="'+codeSrc+'"></script>';
		} else {
			var codeLine = '<iframe src="'+codeSrc+'"></iframe>';
		}

		codeLine += '<div class="selfElementBlackout" data-src="'+codeSrc+'"></div>';

		return codeLine;
	}

	/**
	* Узнает яндекс или нет
	*
	* @see 	this.getCode()
	*/
	this.isYandex = function(mapCode)
	{
		return mapCode && mapCode.match(/yandex/gim);
	}

	/**
	* Перезагрузить код
	*
	* @see 	Site.clearForMap()
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	EditElementMap.setEventSave()
	* @see 	this.updateId()
	*/
	this.reloadCode = function(elmObj, mapSrc)
	{
		if (!mapSrc) mapSrc = elmObj.find(".selfElementBlackout").attr("data-src");
		
		var mapCode = this.getCode(mapSrc);
		elmObj.html(mapCode);

		Resize.create();
	}

/********************************************************************************************/

}// end class

/********************************************************************************************/
/********************************************************************************************/
/**
* Iframe
*
*/
ElementEmbed.prototype = ElementBasic;
var ElementEmbed = new ElementEmbed();
ElementEmbed.parent = ElementBasic;
function ElementEmbed()
{
	this.type = 'embed';
	this.class = 'embed';
	this.resize_width = true;
	this.is_edit = true;
	this.title = {'name':'Embed', 'img':'iframe.png', 'type':'embed'};
	this.css = ["width", "min-height", "position", "padding", "align", "text", "bg", "border", "boxShadow", "transform", "other"];
	this.width = 450;

	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{

		var block = '<div class="new-element element embed hlp-embed" style="width:'+this.width+'px;">\
							<div class="selfVideoBlackout selfEmbedBlackout">\
								<div class="selfEmbedBlackoutText">'+Resource.hlp_modal_iframe_text_nowork+'</div>\
							</div>\
							<div class="element-content" style="display:none;">\
								'+this.params.iframe+'\
							</div>\
						</div>';

		return block;
	}

}// end class

/********************************************************************************************/
/********************************************************************************************/
/**
* Slider
*
*/
ElementSlider.prototype = ElementBasic;
var ElementSlider = new ElementSlider();
ElementSlider.parent = ElementBasic;
function ElementSlider()
{
	this.type = 'slider';
	this.class = 'slider';
	this.is_insert = true;
	this.resize_width = true;
	this.title = {'name':Resource.hlp_element_name_slider, 'img':'slider.png', 'type':'slider'};
	this.css = ["width", "min-height", "position", "padding", "align", "text", "bg", "border", "boxShadow", "transform", "other"];
	this.widget = ["slider"];
	this.width = 450;


	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{

		var block = '<div class="new-element element slider hlp-slider hlp-slider-s1" data-hlp-slider-animate="slideInLeft" data-hlp-widget-type="slider" data-hlp-widget-name="s1" style="width:'+this.width+'px;padding-left:35px;padding-right:35px;">\
						<div class="hlp-slider-list-arrow">\
							<div class="element hlp-slider-arrow-prev hlp-slider-arrow" elm-type="hlp-slider-arrow-img" >\
								<img class="hlp-slider-arrow-img-prev hlp-slider-arrow-img" src="/site/frame/widget/slider/s1/images/arrow_prev.png" alt="">\
							</div>\
							<div class="element hlp-slider-arrow-next hlp-slider-arrow" elm-type="hlp-slider-arrow-img" position-side="t-r">\
								<img class="hlp-slider-arrow-img-next hlp-slider-arrow-img" src="/site/frame/widget/slider/s1/images/arrow_next.png" alt="">\
							</div>\
						</div>\
						<div class="hlp-slider-list-item">\
							<div class="hlp-slider-item" data-hlp-index="1" data-hlp-chosen="true"></div>\
						</div>\
						<div class="element hlp-slider-list-bullets" position-side="b-l" elm-type="hlp-slider-list-bullets">\
							<div class="element hlp-slider-bullet" elm-type="hlp-slider-bullet"></div>\
							<div class="element hlp-slider-bullet" elm-type="hlp-slider-bullet"></div>\
							<div class="element flex-active hlp-slider-bullet" style="background:rgba(0,0,0,0.9);" class-unique="hlp-slider-s1 .hlp-slider-bullet.flex-active" elm-type="hlp-slider-bullet"></div>\
						</div>\
					</div>';

		return block;
	}


	/**
	* Конвертация старой версии
	*
	* @see 	Page.replace()
	*/
	this.convertOldVersion = function()
	{
		$(".hlp-slider").each(function() {
			var sliderObj = $(this);
			var listArrowImg = sliderObj.find(".hlp-slider-arrow-img");

			// если не старый слайдер
			if (!listArrowImg.hasClass("element")) {
				return false;
			}

			
			// убираем класс
			listArrowImg.removeClass("element")
						.removeAttr("elm-type")
						.removeAttr("data-id");
			listArrowImg.off("mousedown");

			sliderObj.find(".hlp-slider-arrow").attr("elm-type", "hlp-slider-arrow-img");
			// arrow prev
			var butArrowPrev = sliderObj.find(".hlp-slider-arrow-prev");
			butArrowPrev.attr("class", "element hlp-slider-arrow-prev hlp-slider-arrow");
			Element.addNewId(butArrowPrev);
			// arrow next
			var butArrowNext = sliderObj.find(".hlp-slider-arrow-next");
			butArrowNext.attr("class", "element hlp-slider-arrow-next hlp-slider-arrow")
					.attr("position-side", "t-r");
			Element.addNewId(butArrowNext);

			// добавляем класс
			var elmListBullet = sliderObj.find(".hlp-slider-list-bullets");
			elmListBullet.attr("class", "element hlp-slider-list-bullets")
						.attr("elm-type", "hlp-slider-list-bullets")
						.attr("position-side", "b-l");
			Element.addNewId(elmListBullet);

			// ставим события
			Input.newCanvas();
		});
	}

}// end class

ElementSliderArrowImg.prototype = ElementBasic;
var ElementSliderArrowImg = new ElementSliderArrowImg();
ElementSliderArrowImg.parent = ElementBasic;
function ElementSliderArrowImg()
{
	this.type = 'hlp-slider-arrow-img';
	this.class = 'hlp-slider-arrow-img';
	this.no_move = true;
	this.no_resize = true;
	this.no_manipulation = true;
	this.notAddClass = true;
	this.modePosAbsolute = true;
	this.is_edit = true;
	this.edit_type = "image";
	this.noEditClassUnique = true;
	this.title = {'name':Resource.hlp_element_name_slider, 'img':'slider.png', 'type':'image'};
	this.css = ["width", "position", "padding", "bg", "border", "boxShadow", "transform"];

}// end class


ElementSliderListBullets.prototype = ElementBasic;
var ElementSliderListBullets = new ElementSliderListBullets();
ElementSliderListBullets.parent = ElementBasic;
function ElementSliderListBullets()
{
	this.type = 'hlp-slider-list-bullets';
	this.class = 'hlp-slider-list-bullets';
	this.no_move = true;
	this.no_resize = true;
	this.no_manipulation = true;
	this.sizeProportion = true;
	this.notAddClass = true;
	this.modePosAbsolute = true;
	this.no_edit_class = true;
	this.title = {'name':Resource.hlp_element_name_slider, 'img':'slider.png', 'type':'image'};
	this.css = ["position", "bg", "border", "boxShadow", "transform"];

}// end class


ElementSliderBullet.prototype = ElementBasic;
var ElementSliderBullet = new ElementSliderBullet();
ElementSliderBullet.parent = ElementBasic;
function ElementSliderBullet()
{
	this.type = 'hlp-slider-bullet';
	this.class = 'hlp-slider-bullet';
	this.no_move = true;
	this.no_resize = true;
	this.no_manipulation = true;
	this.sizeProportion = true;
	this.notAddClass = true;
	this.no_added_class = true;
	this.modePosAbsolute = true;
	this.no_edit_class = true;
	this.title = {'name':Resource.hlp_element_name_slider, 'img':'slider.png', 'type':'image'};
	this.css = ["width", "height", "bg", "border", "boxShadow", "transform"];

}// end class

/********************************************************************************************/
/********************************************************************************************/
/**
* Hover блок
*
*
*
*/
ElementTabs.prototype = ElementBasic;
var ElementTabs = new ElementTabs();
ElementTabs.parent = ElementBasic;
function ElementTabs()
{
	this.type = 'hlp-tabs';
	this.class = 'hlp-tabs';
	this.resize_width = true;
	this.is_insert = true;
	this.title = {'name':Resource.hlp_element_name_tab, 'img':'block.png', 'type':'none'};
	this.css = ["width", "padding", "position", "min-height", "align", "text", "bg", "border", "boxShadow", "transform", "other"];
	this.widget = ["tabs", "gallery_modal"];
	this.width = 450;

	/**
	* Получить html елемента
	*
	* @see 	this::create()
	*/	
	this.getElementHtml = function()
	{

		var block = '<div class="new-element element hlp-tabs" style="width:'+this.width+'px;">\
						<div class="hlp-tabs-item" data-hlp-index="1" data-hlp-chosen="true"></div>\
					</div>';			

		return block;
	}
}// end class







/**
* Базовые типы элемента
*
*
*
*/
var ElementBasicType = new ElementBasicType();
function ElementBasicType() {
	this.class = {};
	this.class.list_elm = "listElmBasicType";
	this.class.select = "selectStyleBasicElmType";

/***************************************************************************************/

	this.getClassListElm = function()
	{
		return this.class.list_elm;
	}

	this.getClassSelect = function()
	{
		return this.class.select;
	}

	/**
	* Отдает селектор по типу
	*
	* @see 	ElementCss.getSelector(), .addTag()
	*/
	this.getSelector = function(typeV)
	{
		var listV = this.getListType();
		var propertyV = listV[typeV];

		return propertyV ? propertyV["selector"] : false;
	}


	/**
	* Значение по умолчанию
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.setSiteSelectDefault = function()
	{
		Select.set($("."+this.getClassSelect()), "all")
	}

	/**
	* Елемент стандартный или нет
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.isElmBasicType = function(elm)
	{
		return elm.closest("."+this.getClassListElm()).length;
	}

	/**
	* Отдает список типов
	*
	* @see 	ElmenetCss.setElmTypeDefault()
	* @see 	this.addListElm()
	* @see 	this.replaceTypeHeading()
	*/
	this.getListType = function()
	{
		return this.listTypeV;
	}

	/**
	*
	*
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.getObjByType = function(typeV)
	{
		var elm = $("."+this.getClassListElm()).find("."+typeV);

		return elm;
	}

	/**
	* Добавляет элементы на страницу
	* 
	* @see 	Page.replace
	*/
	this.addListElm = function()
	{
		var listElmClassV = this.getClassListElm();

		$("."+listElmClassV).remove();

		listTypeV = this.getListType();
		var listElmHtmlV = '';
		for (var classV in listTypeV) {
			var propertyV = listTypeV[classV];

			// не создавать элемент
			if (propertyV["no_create"]) continue;

			var typeV = propertyV["type"];
			var selectorV = propertyV["selector"];
			if (classV == "hlp-type-heading1") tagV = "h1";
			else if (classV == "hlp-type-heading2") tagV = "h2";
			else if (classV == "hlp-type-heading3") tagV = "h3";
			else if (classV == "hlp-type-heading4") tagV = "h4";
			else tagV = "div";

			listElmHtmlV += '<'+tagV+' class="element '+classV+' '+typeV+'" '+Element.getAttrSelector()+'="'+selectorV+'" class-unique="'+classV+'" elm-type="basic-type"></'+tagV+'>';
		}

		var blockV = '\
			<div class="'+listElmClassV+'">\
				'+listElmHtmlV+'\
			</div>';

		$(".content .site").prepend(blockV);
	}

	/**
	* показываем или убираем в блоки меню 
	*
	* @see 	StyleMenuFixed.setBasicElmType(), this.editBasicElmType()
	*/
	this.setVisibleBlockMenu = function(elm, value)
	{
		var blockStyleV = $(".menuOneStyle:not(.menuGeometry)");
		var allBlockNotTextGeom = blockStyleV.not(".menuText");

		// прячим у некоторых стили 
		if (value == "hlp-col" || value == "hlp-row") {
			$(".menuPadding").css("display", "none");
			blockStyleV.css("display", "none");
		} else if (value == "hlp-section-content") {
			$(".menuMargin").css("display", "none");
			blockStyleV.css("display", "none");
		} else if(value != "hlp-but") {
			allBlockNotTextGeom.css("display", "none");
			$(".menuPadding").css("display", "none");
		}

		// не кнопка
		if(value == "hlp-but") {
			$(".menuProportion .menuGeometryPropertyExtended").css("display", "none");
		} else {
			$(".menuPaddingH, .menuProportion").css("display", "none");
		}

		if (value == "hlp-section-content") {
			$(".menuPaddingH").css("display", "block");
		}
	}

	/**
	* Отдает текущий тип
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.getCurrentType = function()
	{
		return Select.get($("."+this.getClassSelect()));
	}

/************************************************************************************/
	
	/**
	* Фиксируем стили для сайта 
	*
	*
	* @see 	Page.fix()
	*/
	this.fixedSiteStyle = function()
	{
		if (Site.isTypeLp()) return false;
		if (!Data.site.data.css) Data.site.data.css = {};

		for (var classV in this.listTypeV) {
			var styleV = Data.page.data.css[classV];
			if (styleV) {
				Data.site.data.css[classV] = styleV;
			}
		}
	}

	/**
	* Устанавливаем стили для сайта 
	*
	* @see 	Page.replace()
	*/
	this.setSiteStyle = function()
	{
		if (Site.isTypeLp()) return false;
		if (!Data.site.data.css) Data.site.data.css = {};

		for (var classV in this.listTypeV) {
			var styleV = Data.site.data.css[classV];
			if (styleV) {
				Data.page.data.css[classV] = styleV;
			} else {
				delete Data.page.data.css[classV];
			}
		}
	}


/************************************************************************************/
/************************************************************************************/

	this.listTypeV = {
			"hlp-type-heading2":{
				"type" : "heading",
				"label" : "Заголовок h2",
				"selector":"h2.heading"
			},
			"hlp-type-heading3":{
				"type" : "heading",
				"label" : "Заголовок h3",
				"selector":"h3.heading"
			}, 
			"hlp-type-heading4":{
				"type" : "heading",
				"label" : "Заголовок h4",
				"selector":"h4.heading"
			}, 

			// ----------------------------------------
			
			"hlp-but":{
				"type" : "button",
				"label" : "Кнопка",
				"selector":".hlp-but"
			},

/************************************************************************************/
			// стандартные стили
			"hlp-nav-panel-mobile" : {"no_create":true},
			"hlp-nav-mobile" : {"no_create":true},
			"hlp-nav-mobile > .hlp-nav-item-mobile" : {"no_create":true},
			"hlp-site" : {"no_create":true},
			"site" : {"no_create":true},
		
		}; // end list


/************************************************************************************/

} // end class

var ElementSettingHeading = new ElementSettingHeading();
function ElementSettingHeading() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var tag = elm[0].tagName.toLowerCase();
		$(".menuButHeading[value='"+tag+"']").attr("chosen", "true");
	}

/***********************************************************************************************/
	/**
	* Изменение
	*
	*/
	this.edit = function(elm, tag)
	{
		Element.replaceTag(elm, tag);
	}


/*************************************************************************************/
}//end class
var ElementSettingSEO = new ElementSettingSEO();
function ElementSettingSEO() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var title = elm.attr("title");
		$(".valueSEOTitle").val(title);
	}
/************************************************************************************************/
	this.editTitle = function(elm, value)
	{
		elm.attr("title", value).attr("alt", value);
	}
/*************************************************************************************/
}//end class

var ElementSettingClick = new ElementSettingClick();
function ElementSettingClick() {
	this.attr = {};
	this.attr.modal_formname = "data-hlp-formname";

	this.getAttrModalFormName = function()
	{
		return this.attr.modal_formname;
	}	

/*********************************************************************************/

	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		// показываем блок с параметрами
		var type = elm.attr("data-action");
		if (!type) type = "none"; 
		this.showBlockAction(type);

		var actionName = '';
		var actionValue = elm.attr("data-value");
		if (type == "page") this.setPage(elm, actionValue);
		else if (type == "section") this.setSection(elm, actionValue);	
		else if (type == "modal") this.setModal(elm, actionValue);
		else if (type == "link") this.setLink(elm, actionValue);	
		else if (type == "close_modal") this.setCloseModal(elm, actionValue);	
		else if (type == "slider") this.setSlider(elm, actionValue);
		else if (type == "tabs") this.setTabs(elm, actionValue);
		else if (type == "contact") this.setContact(elm, actionValue);
		else if (type == "download") this.setDownload(elm, actionValue);


		var elmSelectV = $(".valueTypeActionClick");

		Select.set(elmSelectV, type);

		// // for link, page
		// var butLinkV = elmSelectV.find(".option[value='link'], .option[value='page'], .option[value='download'], .option[value='contact']");
		// var butLinkVisible = elm.hasClass("button") || elm.hasClass("block") ? "block" : "none";
		// butLinkV.css("display", butLinkVisible);
	}
/************************************************************************************************/
	/**
	* Устанавливает страницу
 	*
 	* @see 	this.set()
	*/
	this.setPage = function(elm, value)
	{
		// ставит имя
		Select.set($(".valuePage"), value);
		// ставит target
		this.setTarget(elm);
	}
/******************************************************************************************/
	// ставим секцию
	this.setSection = function(elm, value)
	{
		this.setListSection();
		Select.set($(".valueSection"), value);
	}


	/**
	* Ставит список секций в меню
	* 
	* @see 	this.setSection()
	* @see 	this.editActionType()
	*/
	this.setListSection = function()
	{
		var listOption = '<div class="option" value="none">Нет</div>';
		var listSection = $('.content').find(".section");
		var countSection = listSection.length;
		
		for (var iSection = 0; iSection < countSection; iSection++) {
			var sectionObj = listSection.eq(iSection);
			var sectionName = Element.getCurrentClass(sectionObj);
			var sectionNum = sectionObj.attr("data-num");

			listOption += '<div class="option" value="'+sectionNum+'">'+sectionName+'</div>'
		}

		$(".valueSection .optionBlock").html(listOption);
	}
/************************************************************************************************/
	/**
	* Устанавливает модальное
 	*
 	* @see 	this.set()
	*/
	this.setModal = function(elm, value)
	{
		Select.set($(".valueModal"), value);
		// ставим имя
		ManagerModal.setCurrentName();
		// имя формы
		var formNameV = elm.attr(this.getAttrModalFormName());
		$(".valueSettingClickModalFormname").val(formNameV);
	}

	/**
	* Устанавливает закрыть модальное
 	*
 	* @see 	this.set()
	*/
	this.setCloseModal = function(elm, value)
	{
		// Select.set($(".valueCloseModal"), value);
	}
/************************************************************************************************/
	/**
	* Устанавливает ссылку
 	*
 	* @see 	this.set()
	*/
	this.setLink = function(elm)
	{
		// url
		$(".valueLink").val(elm.attr("href"));

		this.setTarget(elm);
	}

/********************************************************************************************/
	/**
	* Ставит target
	*
	* @see 	this.setLink()
	* @see 	this.setPage()
	*/
	this.setTarget = function(elm)
	{
		var valueTarget = elm.attr("target");
		if (valueTarget != "_blank") valueTarget = "_self";

		Select.set($(".valueLinkOpen"), valueTarget);
	}

/******************************************************************************************/
		
	this.setSlider = function(elm, value)
	{
		Select.set($("."+ElementWidgetSlider.class.select_chosen), value);
	}	

	this.setTabs = function(elm, value)
	{
		ElementWidgetTabs.setSelectBut(elm);
		Select.set($("."+ElementWidgetTabs.class.select_chosen), value);

		// 
		var attrEventV = this.getAttrTabsButEvent();
		var hlpEventV = elm.attr(attrEventV);
		if (!hlpEventV) hlpEventV = "hlp_click";
		Select.set($(".selectTabsEvent"), hlpEventV);

		// dynamic
		this.setTabsDynamicValue(elm);
	}

	this.editTabsEvent = function(elm, value)
	{
		var attrEventV = this.getAttrTabsButEvent();
		if (value == "hlp_click") elm.removeAttr(attrEventV);
		else elm.attr(attrEventV, value);
	}

	this.getAttrTabsButEvent = function()
	{
		return "data-hlp-tabs-but-event";
	}

	/** dynamic ******************************/
	this.setTabsDynamicValue = function(elm)
	{
		// ставим стисок id
		this.addDynamicSelectValue();
		
		// устанавливаем id
		var selectIdObj = $("."+this.getClassButtonDynamicId());
		var valueId = elm.attr(this.getAttrButtonDynamicId());
		if (!valueId) valueId = "none";
		Select.set(selectIdObj, valueId);

		// устанавливаем имя
		var valueValue = elm.attr(this.getAttrButtonDynamicValue());
		var classValueV = this.getClassButtonDynamicValue();
		$("."+classValueV).val(valueValue);
	}

	this.addDynamicSelectValue = function()
	{
		var listValue = ElementSettingForm.getListDynamicValue();
		var listAllValue = {"none":"Нет"};
		for (var iValue in listValue) listAllValue[iValue] = listValue[iValue];
		
		var selectIdObj = $("."+this.getClassButtonDynamicId());
		Select.setListOptions(selectIdObj, listAllValue);
	}

	this.editTabsButtonDynamicId = function(elm, value)
	{
		var attrId = this.getAttrButtonDynamicId();
		if (value == "none") elm.removeAttr(attrId);
		else elm.attr(attrId, value);
	}

	this.editTabsButtonDynamicValue = function(elm, value)
	{
		var attrValue = this.getAttrButtonDynamicValue();
		elm.attr(attrValue, value);
	}

	this.getClassButtonDynamicId = function()
	{
		return "selectTabsButtonDynamicId";
	}

	this.getClassButtonDynamicValue = function()
	{
		return "valueButtonDynamicValue";
	}

	this.getAttrButtonDynamicId = function()
	{
		return "data-hlp-dynamic-button-id";
	}

	this.getAttrButtonDynamicValue = function()
	{
		return "data-hlp-dynamic-button-value";
	}


/******************************************************************************************/
/****************************************************************************************/
	/**
	* Изменить тип действия
	*
	*
	*/
	this.editActionType = function(elm, typeAction, elmEvent)
	{
		// показываем текущий блок
		this.showBlockAction(typeAction);

		// ставим тип элементу
		var listBrother = elm;
		// if (listBrother.hasClass("nav-item")) listBrother = elm.closest(".nav").find(".nav-item");
		
		listBrother.attr("data-action", typeAction);
		listBrother.attr("data-value", '');
		listBrother.removeAttr("href").removeAttr("target");

		// ставим значение элементу
		var parentValue = $(".menuSettingClick .select[type='"+typeAction+"']");
		var valueAction = parentValue.find(".option:first").attr("value");
		
		elm.attr("data-value", valueAction);

		// ставим в select
		Select.set(parentValue, valueAction);

		// если секции
		if (typeAction == "section") this.setListSection();

		// сбрасываем значение
		$(".valueLink").val(' ');

		this.set(elm);
	}
/*****************************************************************************************************/
	/**
	* Изменение url
	*
	*/
	this.editLickUrl = function(elm, value) {
		elm.attr("href", value.trim());
	}

	// blank
	this.editLinkTarget = function(elm, value) {
		if (value == "_blank") elm.attr("target", value);
		else elm.removeAttr("target");
	}

/******************************************************************************************/
	// изменение страницы (page, section)
	this.editValue = function(elm, value)
	{
		elm.attr("data-value", value);
	}

	// изменение модального
	this.editModal = function(elm, value)
	{
		elm.attr("data-value", value);
		// ставим имя
		ManagerModal.setCurrentName();
	}

	// имя формы
	this.editModalFormname = function(elm, value)
	{
		if (value) value = value.trim();
		elm.attr(this.getAttrModalFormName(), value);
	}


/******************************************************************************************/
	/**
	* Контакты
	*/
	this.setContact = function(elm, actionValue)
	{
		var property = this.getPropertyContact(elm);

		if (property[2]) var value = property[2];
		else var value = property[1];
		if (!value) value = '';

		Select.set($(".selectClickCotactType"), property[0]);
		$(".valueClickContactValue").val(value);
	}

	this.getPropertyContact = function(elm)
	{
		var value = elm.attr("data-value");
		if (!value) return ['tel', ''];

		var property = value.split(":");
		if (!property[1]) property[1] = '';


		// для whatsapp
		if (property[0] == "whatsapp") {
			property = value.split("=");
			property[0] = "whatsapp";
		}

		return property;
	}

	// type
	this.editContactType = function(elm, value)
	{
		this.editContactProperty(elm, value, "type");	
	}

	// value
	this.editContactValue = function(elm, value)
	{
		this.editContactProperty(elm, value, "value");	
	}

	this.editContactProperty = function(elm, newValue, typeEdit) {
		if (typeEdit == "type") {
			var value = $(".valueClickContactValue").val();
			var type = newValue;
		} else {
			var value = newValue;
			var type = Select.get($(".selectClickCotactType"));
		}

		if (!value) value = '';
		if (!type) type = 'tel';
		value = value.replace(/[^0-9\+]+/gim, '');

		if (type == "whatsapp") {
			var contValue = "whatsapp://send?phone="+value;
		} else {
			var contValue = type + ":" + value;
		}

		elm.attr("data-value", contValue).attr("href", contValue);
	}

/*************************************************************************************************/
	
	this.setDownload = function(elm)
	{
		$(".valueClickDownloadFile").val(elm.attr("data-value"));
	}

	this.editDownloadFile = function(elm, value)
	{
		if (value) value = value.replace(/^\/?files/gim, '');
		elm.attr("data-value", value);
	}

/**************************************************************************************************/
/*************************************************************************************************/
	/**
	* Показывает блок
	*
	* @see 	this.editActionType()
	* @see 	this.set()
	*/
	this.showBlockAction = function(type)
	{
		$(".menuTypeClickBlock").css("display", "none")
								.filter("[type='"+type+"']")
								.css("display", "block");
	}



/*************************************************************************************/
}//end class
/**
* Фиксированые настройки
*
*
*/
var ElementSettingFixed = new ElementSettingFixed();
function ElementSettingFixed() {
	/**
	* Устанавливаем настройки 
	*
	*
	*/
	this.set = function(elm)
	{
		// отображение
		this.setVisible(elm);
	}
/*****************************************************************************************/
	/** 
	* Устанавливаем параметр отображение
	* 
	* @see 	this.set()
	*/
	this.setVisible = function(elm)
	{
		var sectionVisible = $(".menuFixedVisible");
		sectionVisible.css("display", "block"); //показываем если после row

		if (!Element.isSettingVisible(elm)) {
			sectionVisible.css("display", "none");
			return false;
		}
		
		var listVisible = ElementCss.getListValueVisible();
		$(".menuButVisible").removeAttr("chosen");
		
		// устанавливаем значение
		for (var screen in listVisible) {
			var visible = listVisible[screen];
			var butItem = $(".menuButVisible[value^='"+screen+"']");
			if (visible == "block" || visible == "inline-block") {
				butItem.attr("chosen", "true");
			}
		}
	}

	/**
	* Изменить отображение 
	*
	*
	*/
	this.editVisible = function(elm, screenAction, elmEvent)
	{
		// ставим стиль
		if (elmEvent.attr("chosen")) {
			var visibleNew = elm.hasClass("text-span") ? "inline-block" : "block";
		} else {
			var visibleNew = "none";
		}
		
		ElementCss.clearAllScreen(["display"], "geometry", elm, screenAction);
		elm.css("display", visibleNew);
		ElementCss.set("geometry", elm, screenAction);
		
		// ставим кнопки
		this.setVisible(elm);
	}

	/**
	* Устанавливает visible на определеный экран
	*
	* @see 	this.editVisible()
	*/
	this.setPropertyVisible = function(elmObj, screenItem, propertyValue)
	{
		var listStyle = {"display":propertyValue};
		ElementCss.set("geometry", elmObj, screenItem, listStyle);
	}

/**********************************************************************************************/

}//end class



var ElementSettingGrid = new ElementSettingGrid();

function ElementSettingGrid() {

	this.listType = {
		"desktop" : "dsk",
		"tab-l" : "tl",
		"tab-p" : "tp", 
		"mobile-l" : "ml", 
		"mobile-p" : "mp"
	};

	this.attr = {};
	this.attr.count_row = "count-row";

	this.maxCountRow = 6;

/**************************************************************************************/
	/**
	*
	*
	* @see 	ElementBasicType.getReplaceSectionRow()
	*/		
	this.getAttrCountRow = function()
	{
		return this.attr.count_row;
	}

/**************************************************************************************/

	/**
	* Установка значений
	*
	* @see 	this.editCountRow()
	* @see 	this.editDesctopCount()
	* @see 	this.resetColumnSize()
	*/
	this.set = function()
	{
		$(".menuSettingGrid").find(".menuSettingButValue, .menuButValue").removeAttr("chosen");
		var elmRow = Element.obj.closest(".row");

		//отступ 
		this.setMargin(elmRow);
		//количество рядов
		this.setCountRow(elmRow); 

		// данные
		var listColumn = elmRow.find("> .column");//список колонок 
		var allCount = listColumn.length;// количество колонок
		var countInRow = parseInt(elmRow.attr("count-column"));

		// для декстопа
		this.setForDesctop(listColumn, countInRow);
		// не для десктопа
		this.setForNoDesctop(elmRow, allCount, countInRow);
		
		// удаление колонки 
		this.setEventDeleteColumn();
	}
/**********************************************************************************************/
	/**
	* Ставит отступ
	*
	* @see 	this.set()
	*/
	this.setMargin = function(elmRow)
	{
		if (elmRow.hasClass("hlp-row-col-no-indent")) var margin = "no";
		else var margin = "yes";

		$(".menuGridMargin .menuButValue[value='"+margin+"']").attr("chosen", "true");
	}

	/**
	* Количество колонок
	*
	* @see 	this.set()
	*/
	this.setCountRow = function(elmRow)
	{
		var countColumn = elmRow.attr("count-row");
		$(".menuGridCountRow .menuButValue[value='"+countColumn+"']").attr("chosen", "true");
	}
/**********************************************************************************************/
	/**
	* Установка для декстопа
	*
	* @see 	this.set()
	*/
	this.setForDesctop = function(listColumn, countInRow)
	{
		// отмечаем текущий
		$(".menuCountColumns .menuSettingOptionColumn[value='"+countInRow+"']")
								.attr("chosen", "true");
		
		// размер
		this.setDesctopSize(listColumn, countInRow);
	}

	/**
	* Устанавливает размер для desctop
	*
	* @see 	this.setForDesctop()
	* @see 	this.editDesctopCount()
	*/ 
	this.setDesctopSize = function(listElmColumn, countInRow)
	{
		var menuSize = $(".menuColumnsSize");
		// если больше 1 строки или 5 колонок, убираем
		var countRow = listElmColumn.parent().attr("count-row");
		if (countInRow == "5") {
			menuSize.css("display", "none");
			return false 
		}

		menuSize.css("display", "block");

		var blockSeparators = $(".columnsSiziBlockSeparators");
		blockSeparators.html('');
		var blockSizingColumn = $(".listSizingColumn");
		blockSizingColumn.html('');
		var totalWeight = 0;

		var elmRowObj = Element.obj.closest(".row");
		var countColumn = elmRowObj.attr("count-column");

		for (var i = 0; i < countColumn; i++) {
			var elmColumn = listElmColumn.eq(i);
			if (!elmColumn.length) continue;

			var elmItemClassV = elmColumn.attr("class");
			elmItemClassV = elmItemClassV.replace(/col\-w\-[0-9]+-((dsk)|([tmlp]+))/gim, '');
			var weight = elmItemClassV.match(/col\-w\-[0-9]+/gim);

			// если стоит
			if (weight) {
				var weightColumn = weight[0].replace(/[^0-9]+/gi, '');
			} else { // ставим по умолчанию
				var weightColumn = 12 / countInRow;
			}
				
			// колонка в меню
			var sizingColumn = '<div class="itemSizingColumn" value="'+weightColumn+'"><span>'+weightColumn+'</span></div>';
			blockSizingColumn.append(sizingColumn);

			// разделитель
			totalWeight += parseInt(weightColumn);
			if (totalWeight < 12) {
				var sizingSeparator = '<div class="columnsSiziSeparator" value="'+totalWeight+'"><span></span></div>';
				blockSeparators.append(sizingSeparator);
			}
		}

		// ставим события
		this.setEventEditSizeColumn();
	}
/*****************************************************************************************/
	/**
	* Установить не для десктопа
	* 
	* @see 	this.set()
	* @see 	this.editDesctopCount()
	*/	
	this.setForNoDesctop = function(elmRow, allCount, countInRow)
	{
		// ставим для кнопки больше 3 (планшет, мобильный)
		$(".menuBetterThreeColumn").attr("value", countInRow);
		// прячим некоторый кнопки
		$(".menuOptionColumnHide").css("display", "none");
		// убираем выделение
		$(".menuGridTabH, .menuGridTabV, .menuGridMobileH, .menuGridMobileV").find(".menuSettingOptionColumn").removeAttr("chosen");

		// для планшета
		this.setTab(elmRow, allCount, countInRow);
		// для телефона
		this.setMobile(elmRow, allCount, countInRow);
	}

	/**
	* Установка для планшета
	*
	* @see this.setForNoDesctop()
	*/
	this.setTab = function(elmRow, allCount, countInRow)
	{
		var countL = this.getCountInRow(elmRow, "tl", countInRow);
		var countP = this.getCountInRow(elmRow, "tp", countInRow);

		var parentClassL = "menuGridTabH";
		var parentClassP = "menuGridTabV";

		// показываем кнопки колонок
		this.showButColumns(parentClassL, allCount, countInRow);
		this.setValue(parentClassL, countL);// устанавливаем значение

		// показываем кнопки колонок
		this.showButColumns(parentClassP, allCount, countInRow);
		this.setValue(parentClassP, countP);// устанавливаем значение
	}

	/**
	* Для мобильного
	*
	* @see this.setForNoDesctop()
	*/
	this.setMobile = function(elmRow, allCount, countInRow)
	{
		// только колонка первой вложености имеет ширину 100%
		var elmParenObj = elmRow.parent()
		var defaultCount =  elmParenObj.hasClass("section-content") || elmParenObj.hasClass("modal") ? 
															1 : countInRow;
		// var defaultCount = 1;
		var hCount = this.getCountInRow(elmRow, "ml", defaultCount);
		var vCount = this.getCountInRow(elmRow, "mp", defaultCount);

		// мобильный вертикальный
		var parentClassMV = "menuGridMobileV";
		this.showButColumns(parentClassMV, allCount, countInRow);//показываем доступные кнопки
		this.setValue(parentClassMV, vCount);//отмечаем кнопку
			
		// мобильный горизонтальный
		var parentClassMH = "menuGridMobileH";
		this.showButColumns(parentClassMH, allCount, countInRow);
		this.setValue(parentClassMH, hCount);

		// прячем кнопки больше 3 для мобильного, если надо
		this.hideButForMobile(elmRow);
	}


	/**
	* Прячем кнопки для мобильного
	* @see this.setMobile()
	*/
	this.hideButForMobile = function(parentElm, countInRow)
	{
		// если это колонки первой вложености то прячем кнопку больше 3
		var butBetterThree = $(".menuGridMobileV .menuBetterThreeColumn, .menuGridMobileH .menuBetterThreeColumn");
		var isParentSection = parentElm.parent().hasClass("section-content");
		if (isParentSection) var status = "none";
		else var status = "block";
		// butBetterThree.css("display", status);
		butBetterThree.css("display", "block");
	}


	/**
	* Отдает количество колонок в строке по классу родителя
	*
	* @see 	this.setMobile(), this.setTab()
	*/
	this.getCountInRow = function(parentElm, partClass, defaultCount)
	{
		var parentClass = parentElm.attr("class");

		var pattern = new RegExp("hlp-row-col-([0-9]+)-"+partClass, "gi");
		var count = pattern.exec(parentClass);
		if (count)	count = count[1]; 
		else count = defaultCount;

		return count;
	}

/*********************************************************************************/
	/**
	* Устанавливает значение не для декстопа
	*
	* @see 	this.setTab()
	* @see 	this.setMobile()
	*/
	this.setValue = function(parentSettingBut, countColumnInRow)
	{
		$("."+parentSettingBut+" .menuSettingOptionColumn")
										.filter("[value='"+countColumnInRow+"']")
										.attr("chosen", "true");
	}

	/**
	* Показываем кнопки колонок
	*
	* @see 	this.setTab()
	* @see 	this.setMobile()
	*/
	this.showButColumns = function(parentClass, allCount, countInRow)
	{	
		countInRow = parseInt(countInRow);
		var listButValue = [2,3,4];
		var countBut = listButValue.length;
		
		// показываем кнопкку если кнопка меньше значения
		for (var i = 0; i < countBut; i++) {
			var butValue = parseInt(listButValue[i]);
			if (butValue < countInRow) {
				this.showOneButColumn(parentClass, allCount, butValue);
			}
		}
	}

	/**
	* Показать одну кнопку 
	* @see this.showButColumns()
	*/
	this.showOneButColumn = function(parentClass, countColumn, count)
	{
		var isThree = false;
		if (countColumn != count) {
			isThree = countColumn % count ? false : true;// три колонки
		}

		// if (isThree) {
			$("."+parentClass+" .menuSettingOptionColumn[value='"+count+"']")
										.css("display", "block");
		// }
	}

/********************************************************************************/
		
	/**
	* Удаление колонки
	*
	* @see 	this.set()
	*/
	this.setEventDeleteColumn = function()
	{
		var blockDeleteObj = $(".menuColumnDelete"); 
		if (!Element.obj.hasClass("column")) {
		// if (true) {
			blockDeleteObj.css("display", "none");
			return false;
		} else {
			blockDeleteObj.css("display", "block");
		}

		var obj = this;
		var butObj = $(".butDeleteColumn");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elm = Element.obj;
			var parentObj = elm.closest(".row");

			var countColumnV = parentObj.find("> .column").length;
			if (countColumnV == 1) {
				Notification.error("Должна остаться минимум 1 колонка");
				return false;
			}

			elm.remove();
			History.record();
			
			parentObj.mousedown().mouseup();
			
			// убираем отступ у некоторых колонок
			obj.setColumnNoIndent();
			PageStruct.build();
		});
	}


/************************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит отступ
	*/
	this.editMargin = function(elm, value)
	{
		// var listRow = Element.get(elm.closest(".row"));
		var listRow = Element.getAllObject(elm.closest(".row"), true);
		
		// ставим, 2 по умолчанию
		if (value == "no") listRow.addClass("hlp-row-col-no-indent");
		else listRow.removeClass("hlp-row-col-no-indent");
	}

/**********************************************************************************************/
	/**
	* Количество рядов
	*
	*
	*/
	this.editCountRow = function(elm, newCount)
	{
		var elmRow = elm.closest(".row");
		var oldCount = elmRow.attr("count-row");
		var allCountColumn = elmRow.find(">.column").length;
		var countInRow = elmRow.attr("count-column");//allCountColumn / oldCount;
		// var countInRow = $(".menuCountColumnsValue .menuSettingOptionColumn[chosen='true']").val();
		// var diffrentColumn = (newCount - oldCount) * countInRow;
		var diffrentColumn = newCount * countInRow - allCountColumn;
		diffrentColumn = Math.ceil(diffrentColumn);

		// изменяем количество колонок
		this.editRowColumn(elmRow, diffrentColumn, newCount);
		elmRow.attr("count-row", newCount);

		// ставим колонки, что бы все сбросилось
		// this.editDesctopCount(elm, elmRow.attr("count-column"));
		// ставим значения
		this.set();
		// сброс значений
		this.resetColumnNoIndent();
		this.setClassAdded();

		// ставим id
		Element.addNewId(elmRow);

		Input.newCanvas();
		Resize.addBlock();

		// если убирается
		elmRow.find("> .column:first").mousedown().mouseup();
	}


	/**
	* Установить количество колонок
	*
	* @see 	this.editCountRow()
	*/
	this.editRowColumn = function(elmRow, countColumn, newCountCol)
	{
		var countInRow = elmRow.attr("count-column");
		var listColumn = elmRow.find("> .column");
		var currentColCount = listColumn.length;
		
		
		//больше
		if (countColumn > 0) {
			var finishColCount = newCountCol * countInRow;
			// добавляем
			for (var i = currentColCount; i < finishColCount; i++) {
				var curNumberRow = parseInt(i / countInRow);
				var indexCol = i - (curNumberRow * countInRow);
				// console.log(indexCol)

				// блок
				var column = listColumn.eq(indexCol);
				var columnClass = column.attr("class").replace(/elementSelected/gim, '');

				var columnClassUnique = '';
				if (column.attr("class-unique")) columnClassUnique = ' class-unique="'+column.attr("class-unique")+'"'; 


				var columnClassAdded = '';
				if (column.attr("class-added")) columnClassAdded = ' class-added="'+column.attr("class-added")+'"';

				columnClass = columnClass.replace(/undefined/gim, '');

				var rowBlock = '<div class="'+columnClass+'"'+columnClassUnique+columnClassAdded+' elm-type="column"></div>';

				// elmRow.append(rowBlock);
				elmRow.find("> .column:last").after(rowBlock);
			}
		} else { // меньше
			// удяляем
			var allCountColumn = listColumn.length;
			for (var i = allCountColumn + countColumn; i < allCountColumn; i++) {
				listColumn.eq(i).remove();
			}
		}
	}
/**********************************************************************************************/
	/**
	* Количество колонок у декстопа
	*
	* @see 	event
	* @see 	this.editCountRow()
	*/
	this.editDesctopCount = function(elm, newCount)
	{
		var elmParentObj = Element.obj.closest(".row"); 
		newCount = parseInt(newCount);
		var listRowObjV = Element.getAllObject(elm.closest(".row"), true);
		var countRow = listRowObjV.length;

		for (var iRow = 0; iRow < countRow; iRow++) {
			this.editDesctopCountAction(listRowObjV.eq(iRow), newCount);
		}

		// добавляем класс по умолчанию для tp
		// if (elmParentObj.parent().hasClass("section-content")) {
		// 	if (newCount == 2) {
		// 		elmParentObj.addClass("hlp-row-col-1-tp");
		// 	} else if (newCount == 3 || newCount == 4) {
		// 		elmParentObj.addClass("hlp-row-col-2-tp");
		// 	} else if (newCount == 6) {
		// 		elmParentObj.addClass("hlp-row-col-3-tp");
		// 		elmParentObj.addClass("hlp-row-col-2-ml");
		// 	}
		// }

		// строим структуру
		PageStruct.build();
		// 
		// Resize.create();

		this.setColumnNoIndent();
		this.set();
		elmParentObj.find("> .column:first").mousedown().mouseup();
	}

	this.editDesctopCountAction = function(elmRow, newCount)
	{
		// ставим количество колонок у элемента
		this.setCountColumnElement(elmRow, newCount);

		// ставим id
		Element.addNewId(elmRow);
		
		// сброс значений
		this.resetColumnNoIndent();
		this.setClassAdded();
	}

	/**
	* Ставим количество колонок у элемента
	*
	* @see this.editDesctopCount()
	*/
	this.setCountColumnElement = function(elmRow, newCount)
	{
		var listColumn = elmRow.find("> .column");
		var currentValue = elmRow.attr("count-column");
		var countInRow = elmRow.attr("count-column");
		var countRow = elmRow.attr("count-row");

		// нужно меньше
		if (currentValue > newCount) {
			var fromN = newCount * countRow;
			var toN = listColumn.length;
			//убираем
			for (var i = fromN; i < 200; i++) {
				var elmCol = listColumn.eq(i);
				if (!elmCol.length) break;
				if (!elmCol.find(".element").length) {
					elmCol.remove();
				} 
			}

			// если убран elementSelected
			if (!elmRow.find(".elementSelected").length) {
				// эмитируем клик по последнему элементу
				// Element.obj.closest(".row").find("> .column:first-child").mousedown();
			}

			// пересчитываем кол рядов
			var newCountRowV = elmRow.find("> .column").length / newCount;
			if (newCountRowV > parseInt(newCountRowV)) {
				newCountRowV = parseInt(newCountRowV) + 1;
			}
			if (newCountRowV > this.maxCountRow) newCountRowV = this.maxCountRow;
			elmRow.attr("count-row", newCountRowV);
			this.setCountRow(elmRow);
		// нужно больше
		} else {
			// var count = newCount - currentValue;
			// count *= countRow; 
			var count = newCount * countRow;
			count -= listColumn.length; 

			for (var i = 0; i < count; i++) {
				var uniqueClass = listColumn.attr("class-unique");
				var newBlockColumn = '\
					<div class="element column hlp-col" elm-type="column">\
					</div>';
				// elmRow.append(newBlockColumn); // вставляем
				elmRow.find("> .column:last").after(newBlockColumn);
			}
			// ставим события для новых элементов
			Input.newCanvas();
		}

		// очищаем все параметры
		this.clearAllProperty(elmRow);
		// ставим классы
		this.setClassCount(elmRow, newCount);
	}

	/**
	* Ставит класс - количество колонок
	*
	*
	* @see 	this.setCountColumnElement()
	*/
	this.setClassCount = function(elmRow, newCount)
	{
		// ставим количество колонок
		elmRow.attr("count-column", newCount);
		elmRow.addClass("hlp-row-col-"+newCount);
		// elmRow.addClass("tab-l-count-"+newCount);
		// elmRow.addClass("tab-p-count-"+newCount);
	}

	/**
	* Очищает вес колонки
	*
	* @see 	this.setCountColumnElement()
	*/
	this.clearAllProperty = function(elmRow)
	{
		if (!elmRow.hasClass("row")) {
			elmRow = Element.obj.closest("row");
		}

		// очищаем количество в колонки
		var rowClass = elmRow.attr("class");
		var clearingClass = rowClass.replace(/hlp-row-col-[0-9][a-z\-]*/gim, '')
									.replace(/[\s]+/gim, " ");

		elmRow.attr("class", clearingClass);

		// очищаем вес 
		var listColumn = elmRow.find(">.column");
		var classElm = listColumn.attr("class");
		classElm = classElm.replace(/elementSelected/gim);
		var clearingClass = classElm.replace(/\shlp-col-w-[0-9]+[a-z\-]*/gim, '');
		clearingClass = clearingClass.replace(/\shlp-col-w-[0-9]+-((dsk)|([tmlp]+))/gim, '');

		clearingClass = clearingClass.replace(/\s?undefined/gim, '');

		listColumn.attr("class", clearingClass);

		Element.obj.addClass("elementSelected");
	}
/****************************************************************************************/
	/**
	* Изменение размера колонок
	*
	* @see 	this.setDesctopSize()
	*/
	this.setEventEditSizeColumn = function()
	{
		var obj = this;
		var listSeparators = $(".columnsSiziSeparator");
		var blockSeparators = $(".columnsSiziBlockSeparators");

		listSeparators.off("mousedown");
		listSeparators.on("mousedown", function(e) {
			blockSeparators.attr("move", "true"); 
			var elmEvent = $(this);
			var indexElm = parseInt(elmEvent.index(".columnsSiziSeparator"));
			var oldX = e.pageX; // старый 
			var step = $(".columnsSiziBlockSeparators").width()/12;
			var left = parseInt(elmEvent.css("left"));
			var currentLeft = 0; 
			var newValue = 0; //новое значение - количество шагов
			var minStep = indexElm > 0 ? 
					parseInt(listSeparators.eq(indexElm - 1).attr("value")) + 1 : 1;
			var maxStep = listSeparators.eq(indexElm + 1).length ?
					listSeparators.eq(indexElm + 1).attr("value") - 1 : 11;
			//для обновления информации 
			var startLength = minStep - 1;
			var endEnd = maxStep + 1;
			var listSizingColumn = $(".itemSizingColumn");
			var oneSection = listSizingColumn.eq(indexElm);
			var twoSection = listSizingColumn.eq(indexElm + 1);
			var rowElm = Element.getAllObject(Element.obj.closest(".row"), true);
			// var rowElm = Element.obj.closest(".row");
			var oneElm = rowElm.find(">.column").eq(indexElm);
			var twoElm = rowElm.find(">.column").eq(indexElm + 1);
			var valueOne = 0;
			var valueTwo = 0;
			var classOneElm = '';
			var classTwoElm = '';
			var countColumnInRow = rowElm.attr("count-column");

			// передвижение
			$("body").on("mousemove", function(event){
				currentLeft = left + event.pageX - oldX;
				// новое значение
				newValue = Math.round(currentLeft / step);
				// выход за края
				if (newValue < minStep) newValue = minStep;
				if (newValue > maxStep) newValue = maxStep;
				
				// ставим значение
				elmEvent.attr("value", newValue);
				// обновляем информацию
				var valueSection = newValue - startLength;
				if  (valueOne != valueSection) {
					valueOne = valueSection;
					valueTwo = endEnd - newValue;
					// значение в меню
					oneSection.attr("value", valueOne)
								.find("span").text(valueOne);
					twoSection.attr("value", valueTwo)
								.find("span").text(valueTwo);
		
					// значение убираем класс weigh
					classOneElm = oneElm.attr("class").replace(/\shlp-col-w-[0-9]+/, '');
					classTwoElm = twoElm.attr("class").replace(/\shlp-col-w-[0-9]+/, '');
					// ставим класс
					classOneElm += " hlp-col-w-"+valueOne;
					classTwoElm += " hlp-col-w-"+valueTwo;
					
					for (var i = 0; i < rowElm.length; i++) {
						var listColumn = rowElm.eq(i).find(">.column");

						var newIndexElm = indexElm + 1;
						var newIndexElmNext = newIndexElm + 1;
						listColumn.filter(":nth-child("+countColumnInRow+"n+"+newIndexElm+")").attr("class", classOneElm);
						listColumn.filter(":nth-child("+countColumnInRow+"n+"+newIndexElmNext+")").attr("class", classTwoElm);
					}
				}

				return false;
			})
		});

		// сбрасываем событие передвижение
		$("body").off("mouseup");
		$("body").on("mouseup", function() {
			$("body").off("mousemove");
			blockSeparators.removeAttr("move");

			// ставим станддартное количество колонок
			obj.setDefaultSizeColumn();
		});
	}


	/**
	* Устанавливает стандартный размер колонок
	*
	* @see 	this.setEventEditSizeColumn()
 	*/
 	this.setDefaultSizeColumn = function()
 	{
 		var elmRowV = Element.obj.closest(".row");
 		var listAllCol = elmRowV.find("> .column");
 		var listDefaultValue = [ ["6"], ["4"], ["3"], ["2"] ];

 		for (var iPropDefault in listDefaultValue) {
 			var defaultSize = listDefaultValue[iPropDefault][0];
 			
 			var listCol = listAllCol.filter(".hlp-col-w-"+defaultSize);
 			var listColAllEditing = listAllCol.filter("[class*='hlp-col-w-']");
 			if (listCol.length == listColAllEditing.length) {
 				listAllCol.removeClass("hlp-col-w-"+defaultSize);
 			}
 		}
 	}

/*****************************************************************************************/

	/**
	* Изменение количество колонок для не
	* tab_h 		tab-l
	* tab_v 		tab-p
	* mobile_h		mobile-l
	* mobile_v 		mobile-p
	*/
	this.editNoDesctop = function(elm, value, elmEvent)
	{
		// var elmRow = Element.get(elm.closest(".row"));
		var elmRow = Element.getAllObject(elm.closest(".row"), true);
		var typeScreen = elmEvent.parent().attr("type"); //тип устройства

		
		var type = this.listType[typeScreen];

		var count = elmEvent.attr("value");

		// очищает
		this.clearClassRow(elmRow, type); 
		

		var isScreenMobileV = typeScreen == "mobile-l" || typeScreen == "mobile-p";
		var isParentSectionV = elmRow.parent().hasClass("section-content");

		// if (isScreenMobileV) { /*мобильный один экран*/
		// 	if (isParentSectionV) {
		// 		if (count == 1) return false;
		// 	}
		// } else 
		if (elmEvent.hasClass("menuBetterThreeColumn")) {/*для планшета*/
			this.setColumnNoIndent();
			return false;
		}

		// ставим класс строке
		var newClassMain = "hlp-row-col-"+count;
		var newClass = newClassMain + "-"+type;
		elmRow.addClass(newClass.trim());

		// убираем отступ у некоторых колонок
		this.setColumnNoIndent();
	}

	/**
	* Очищает класс строки
	*
	* @see 	this.editNoDesctop()
	*/
	this.clearClassRow = function(elmRow, partClass)
	{
		var currentClass = elmRow.attr("class"); //класс
		// var pattern = new RegExp(partClass+"-count-"+"[0-9]+", "gi");//шаблон(добавляем часть класса стандартного)
		var pattern = new RegExp("hlp-row-col-[0-9]+-"+partClass, "gi");
		var clearingClass = currentClass.replace(pattern, '');
		
		elmRow.attr("class", clearingClass.trim());
	}

/****************************************************************************************************/
/****************************************************************************************************/
	/**
	* Убираем margin у некоторых колонок
	*
	* @see 	this.editNoDesctop()
	* @see 	this.setEventDeleteColumn()
	* @see 	this.resetColumnSize()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	PageStruct.moveElm() 	
	*/
	this.setColumnNoIndent = function(elm)
	{
		if (!elm) elm = Element.obj;

		this.resetColumnNoIndent();
		this.setClassAdded();

		var listScreen = {"desktop":"", "tl":"", "tp":"", "ml":"", "mp":""};
		var elmRow = elm.closest(".row");
		var listColumn = elmRow.find("> .column");
		var countColumn = listColumn.length;

		var rowClass = elmRow.attr("class");
		var listColumnCount = {};
		for (var screenValue in listScreen) {
			var partPat = screenValue == "desktop" ? "" : "-" + screenValue;

			var patternRowCount = new RegExp("hlp-row-col-([0-9]+)"+partPat, "gim");
			var rowClassCountCol = patternRowCount.exec(rowClass);
			
			if (rowClassCountCol) {
				rowClassCountCol = rowClassCountCol[1];
			} else if (screenValue == "tl" || screenValue == "tp") {
				rowClassCountCol = listColumnCount["desktop"];
			} else {
				rowClassCountCol = 1;
			}
			listColumnCount[screenValue] = rowClassCountCol;


			var countNoIndent = countColumn % parseInt(rowClassCountCol);
			// console.log(screenValue+' -> '+countNoIndent)

			if (countNoIndent) {
				var classNoIndent = 'hlp-col-no-indent' + partPat;
				for (var iColumn = 0; iColumn < countNoIndent; iColumn++) {
					var columnIndex = countColumn - iColumn - 1;
					listColumn.eq(columnIndex).addClass(classNoIndent);
				}
			}

		}
	}

	/**
	* Сброс значений
	*
	* @see 	this.editCountRow()
	* @see 	this.editDesctopCount()
	*/
	this.resetColumnNoIndent = function()
	{
		var listColumn = Element.obj.closest(".row").find("> .column");

		listColumn.removeClass("hlp-col-no-indent")
					.removeClass("hlp-col-no-indent-tl")
					.removeClass("hlp-col-no-indent-tp")
					.removeClass("hlp-col-no-indent-ml")
					.removeClass("hlp-col-no-indent-mp");
		
	}

	/**
	* Проставляет дополнительные класыы
	*
	* @see 	
	*/
	this.setClassAdded = function()
	{	
		var elmRowObj = Element.obj.closest(".row");
		var listColumn = elmRowObj.find("> .column");
		var countColumn = listColumn.length;
		for (var iCol = 0; iCol < countColumn; iCol++) {
			var colObj = listColumn.eq(iCol);
			var classAddedV = colObj.attr("class-added");
			if (classAddedV && classAddedV != undefined) {
				colObj.addClass(classAddedV);
			}
		}
	}


	/**
	* Сбрасывает размер колонок
	*
	* @see 	ElementCss.afterClearStyleGeometry() 
	*/
	this.resetColumnSize = function(elm)
	{
		elm.find("> .column").attr("class", "element hlp-col column");
		this.setColumnNoIndent();
		this.set();
	}


}//end class
var ElementSettingForm = new ElementSettingForm();
function ElementSettingForm() {

	this.attr = {};

	this.class = {};

/**********************************************************************************/

	/**
	* Установка значений для поля
	*
	*/
	this.setMGInput = function(elm)
	{
		// имя
		this.setInputName(elm);
		// подсказка
		this.setInputPlaceholder(elm);
		// обязательность
		this.setInputRequired(elm);
		// у textarea типа нет
		this.setInputType(elm);
		// динамическое поле
		this.setDynamic(elm);
	}

	// имя
	this.setInputName = function(elm)
	{
		var inputType = elm.attr("input-type");
		// var displayValue = inputType ? "none" : "block";
		var displayValue = "block";
		$(".settingFormName").css("display", displayValue);

		var name = elm.attr("name");

		var inputNameObj = $(".valueInputName");
		inputNameObj.val(name);

		/***********************************************************/
		if (elm.attr("data-mask")) inputNameObj.attr("only-eng", "true");
		else inputNameObj.removeAttr("only-eng");
		SpecialInput.setEventOnlyEng();
	}

	// подсказка
	this.setInputPlaceholder = function(elm)
	{
		var placeholder = elm.attr("placeholder");
		$(".valueInputPlaceholder").val(placeholder);
	}

	// тип
	this.setInputType = function(elm)
	{
		// маска
		var itemType = $(".menuStyleInputMask");
		if (!elm.hasClass("input")) {
			itemType.css("display", "none");
			return false;
		}
		itemType.css("display", "block");

		// ставим маску
		var inputMask = elm.attr("data-mask");
		if (!inputMask) inputMask = "none";
		Select.set($(".menuStyleInputMask"), inputMask);
		
		/*тип*****/
		var inputTypeV = elm.attr("type");
		this.setVisibleInputType(inputTypeV);
		$(".valueInputType .menuButValueText[value='"+inputTypeV+"']").attr("chosen", "true");
		$(".valueInputValue").val(elm.val());
	}

	// Обязательность
	this.setInputRequired = function(elm)
	{
		var noRequired = elm.attr("data-empty");
		var status = noRequired == "true" ? "no" : "yes";
		$(".valueInputRequired .menuButValue[value='"+status+"']").attr("chosen", "true");
	}


/***********************************************************************************************/
	// Установка формы
	this.setMGForm = function(elm)
	{
		// показываем и убираем блоки
		$(".settingSubmitText").css("display", "none");
		$(".settingFormName").css("display", "block");

		// ставим имя формы
		var inputNameObj = elm.find("input[name='hlp-form-name']")
		if (!inputNameObj.length) {
			elm.find("input[name='form-name']").attr("name", "hlp-form-name");
			inputNameObj = elm.find("input[name='hlp-form-name']");
		}

		var name = inputNameObj.val();
		$(".valueFormName").val(name);

		// устанавливаем параметры формы
		this.setFormProperty(elm);
	}

	// для submit
	this.setMGSubmit = function(elm)
	{
		// показываем и убираем блоки
		$(".settingFormName").css("display", "none");
		$(".settingSubmitText").css("display", "block");

		$(".valueSubmitText").val(elm.val());

		// устанавливаем параметры формы
		this.setFormProperty(elm);
	}


	/**
	* Устанавливает параметры формы
	*
	* @see 	this.setSubmit()
	* @see 	this.setForm()
	*/
	this.setFormProperty = function(elm)
	{
		var elmForm = elm.closest(".form");

		// перенаправление
		this.setFormRedirect(elm, elmForm);

		// action
		var formAction = elmForm.attr("action");
		$(".valueFormAction").val(formAction);
		this.setVisibleFormRedirect(formAction);

		// метод
		var method = elmForm.attr("method");
		$(".valueFormMethod .menuButValue[value='"+method+"']").attr("chosen", "true");
	}

	/**
	* Перенаправление
	*
	* @see 	this.setFormProperty()
	*/
	this.setFormRedirect = function(elm, elmForm)
	{
		// данные
		var redirect = elmForm.find("input[name='hlp-redirect']");
		if (!redirect.length) {
			elmForm.find("input[name='redirect']").attr("name", "hlp-redirect");
			redirect = elmForm.find("input[name='hlp-redirect']");
		}

		var redirectType = redirect.attr("redirect-type");
		if (!redirectType) redirectType = "link";

		// показываем блок
		this.showBlockRedirect(redirectType);

		// ставим данные
		var redirectValue = redirect.val();
		if (redirectType == "page" || redirectType == "modal") {
			var selectRedirectObj = redirectType == "page" ? $(".valueFormRedirect") : $(".valueFormRedirectModal");
			Select.set(selectRedirectObj, redirectValue);
		} else {
			$(".valueFormRedirect").val(redirectValue);
		}

		Select.set($(".valueTypeFormRedirect"), redirectType);
	}


	/**
	* Показать блок перенаправления
	*
	* @see 	this.setFormRedirect()
	* @see 	this.editRedirectType()
	*/
	this.showBlockRedirect = function(redirectType)
	{
		// показываем блоки 
		$(".settingFormRedirectItem").css("display", "none")
									.filter("[type='"+redirectType+"']")
									.css("display", "block")
									.attr("");
	}

/**************************************************************************************************/

	/**
	* Отображение панели redirect
	*
	* @see 	this.setFormProperty()
	* @see 	this.editFormAction()
	*/
	this.setVisibleFormRedirect = function(formAction)
	{
		var redirectDisplay = formAction ? "none" : "block"; 
		$(".settingFormRedirect").css("display", redirectDisplay);
	}

	/**
	* Отображение панели - тип input
	*
	* @see 	this.setInputType()
	* @see 	this.editInputTypeSelf()
	*/
	this.setVisibleInputType = function(typeValueV)
	{
		$(".settingFormInputTypeBlock").css("display", "none");

		var blockClassVisible = typeValueV == "hlp-hidden" ? "settingFormInputTypeHidden" : "settingFormInputTypeText";
		$("."+blockClassVisible).css("display", "block");
	}

/***********************************************************************************/
	
	this.setMGCheckbox = function(elm)
	{
		$(".valueInputName").val(elm.attr("name"));
		$(".valueInputValue").val(elm.val());
		
		this.setInputRequired(elm);

		// 
		var checkedStatus = elm.attr("checked") ? "yes" : "no";	
		StyleMenu.chosenToggleBut($(".valueCheckboxChecked"), checkedStatus);
	}

	this.setMGSelect = function(elm)
	{
		var name = elm.attr("name");
		$(".valueInputName").val(name);
		
		$(".settingFormInputTypeBlock").css("display", "block");

		// установка списка
		this.setListOptionProperty(elm);	
	}

	this.setMGUploadFile = function(elm)
	{
		// обязательность
		this.setInputRequired(elm);
	}
	
/************************************************************************************/

	/*
	* Установка списка
	*
	* @see 	this.setMGSelect()
	*/
	this.setListOptionProperty = function(elm)
	{
		
		var listOptionProperty = this.getListOptionProperty(elm);
		MenuListItem.addList("form-option", listOptionProperty);
	}

	/**
	* Открытие 
	* 
	*
	* @see 	MenuListItem.setEventEditBg()
	*/
	this.setOptionProperty = function(elmEvent)
	{
		$(".valueSettingFormOptionValue").val(elmEvent.attr("option-value"));
		$(".valueSettingFormOptionName").val(elmEvent.attr("option-name"));
	}

	/**
	* Удаление
	*
	*
	* @see 	MenuListItem.setEventDeleteBg()
	*/
	this.deleteOption = function(itemIndexV)
	{
		Element.obj.find("option").eq(itemIndexV).remove();
	}

	/**
	* Добавление нового элемента 
	*
	* @see 	MenuListItem.addNewItem()
	*/
	this.addNewOption = function()
	{
		var elm = Element.obj;
		
		var optionNameV = 'new option'; 
		var optionValueV = 'new';

		var optionBlock = '<option value="'+optionValueV+'">'+optionNameV+'</option>';
		elm.append(optionBlock);
		
		var newPropertyV = {
			"name" : optionNameV,
			"property" : {
				"option-value": optionValueV,
				"option-name": optionNameV,
			}
		}	

		return newPropertyV;
	}


	/**
	* Изменение значения
	*
	*
	*/
	this.editSelectOption = function(elm, value, elmEvent)
	{
		var optionIndex = MenuListItem.getItemIndex(elmEvent);
		var optionObj = elm.find("option").eq(optionIndex);

		// ставим элементу ноывй список
		var optionValueV = $(".valueSettingFormOptionValue").val();
		var optionNameV = $(".valueSettingFormOptionName").val();
		optionObj.val(optionValueV);
		optionObj.text(optionNameV);

		// обновляем список
		var listOptionProperty = this.getListOptionProperty(elm);
		MenuListItem.uploadListValue(listOptionProperty, elmEvent);
	}

	/**
	* Отдает список элментов
	*
	* @see 	this.setListOptionProperty()
	* @see 	this.addNewOption()
	*/
	this.getListOptionProperty = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listOptionProperty = []; 

		var listOption = elm.find("option");
		var countOption = listOption.length;
		for (var iOption = 0; iOption < countOption; iOption++) {
			var optionObj = listOption.eq(iOption);

			var optionValueV = optionObj.val();
			var optionNameV = optionObj.text();

			listOptionProperty[iOption] = {
				"name" : optionNameV,
				"property" : {
					"option-value": optionValueV,
					"option-name": optionNameV,
				}
			}	
		}

		return listOptionProperty;
	}


/***********************************************************************************************/
/***********************************************************************************************/
	this.editInputTypeSelf = function(elm, value)
	{
		elm.attr("type", value);

		if (value == "hlp-hidden") {
			elm.removeAttr("data-mask")
				.removeAttr("input-type")
				.removeAttr("placeholder");
			$(".valueInputPlaceholder").val('');
			// Select.set($(".menuStyleInputMask .selectBlockButton"), "none");
		} else {
			elm.removeAttr("value");
		}

		// панель
		this.setVisibleInputType(value);
		// имя в структуре
		PageStruct.setStructItemNameInput(elm);
	}

	this.editInputValue = function(elm, value)
	{
		elm.val(value).attr("value", value);
	}	

	// имя 
	this.editInputName = function(elm, value, elmEvent)
	{
		var elmForm = elm.closest(".form");
		var listInput = elmForm.find(".input").not(elm);
		var isExistsName = listInput.filter("[name='"+value+"']").length;
		var isMaskV = elm.attr("data-mask");

		if (value && isMaskV) value = value.replace(/\s/gim, "_");

		// если не существует имя
		if (!isExistsName) {
			elm.attr("name", value);
			elmEvent.val(value);
		} else { // существует имя
			var oldValue = elm.attr("name");
			var inputName = $(".valueInputName");
			$(".valueInputName").val(oldValue);
			
			Notification.error(Resource.hlp_setting_input_notification_name_exists, "left");
		}

		if (elm.attr("type") == "hlp-hidden") {
			// имя в структуре
			PageStruct.setStructItemNameInput(elm);
		}
	}

	// подсказка 
	this.editInputPlaceholder = function(elm, value)
	{
		elm.attr("placeholder", value);
	}

	// тип
	this.listInputType = {
		"none":["new", Resource.hlp_setting_input_name_new],
		"name":["name", "Имя"],
		"email":["email", Resource.hlp_setting_input_name_email],
		"phone":["phone", Resource.hlp_setting_input_name_phone],
		"addr":["addr", "Адрес"]
	} 
	this.editInputType = function(elm, value)
	{
		var property = this.listInputType[value]; 

		// type
		if (value == "none") {
			elm.removeAttr("input-type").removeAttr("data-mask");
		} else {
			elm.attr("input-type", value).attr("data-mask", value);
		}

		// name
		var name = property[0];
		elm.attr("name", name);
		$(".valueInputName").val(name);


		// ставим или убираем блок с именем 
		this.setInputName(elm);

		// placeholder
		var placeholder = property[1];
		elm.attr("placeholder", placeholder);
		$(".valueInputPlaceholder").val(placeholder);
	}

	// маска
	this.editInputMask = function(elm, value)
	{
		if (value == "none") elm.removeAttr("data-mask");
		else elm.attr("data-mask", value);
	}

	// обязательность
	this.editInputRequired = function(elm, value)
	{
		if (value == "no") elm.attr("data-empty", "true");
		else  elm.removeAttr("data-empty");
	}

	this.editCheckboxChecked = function(elm, value)
	{
		if (value == "yes") elm.attr("checked", "checked");
		else elm.removeAttr("checked");

		// что бы изменился checked
		Element.reload(elm);
	}
/*********************************************************************************************/
	// кнопка
	this.editSubmitText = function(elm, value)
	{
		elm.val(value);
	}

	// имя формы
	this.editFormName = function(elm, value)
	{
		var elmForm = elm.closest(".form");
		elmForm.find("input[name='hlp-form-name']").val(value);
	}

/****параметры формы******************************************************************************************/
	// изменение типа перенаправления
	this.editRedirectType = function(elm, value)
	{
		// показываем блок
		this.showBlockRedirect(value);
		// ставим значение
		if (value == "page") {
			var redirectValue = "none";
			Select.set($(".valuePageFormRedirect"), redirectValue);
		} else {
			var redirectValue = "";
			$(".valueFormRedirect").val(redirectValue);
		}

		// ставим тип
		var redirect = elm.closest(".form").find("input[name='hlp-redirect']");
		redirect.attr("redirect-type", value);
		redirect.val(redirectValue);

		// ставим значения в меню
		this.setMGForm(elm);
	}

	// перенаправление link
	this.editFormRedirectLink = function(elm, value, elmEvent)
	{
		this.editFormRedirect(elm, value, elmEvent);
	}

	// перенаправление link
	this.editFormRedirectElm = function(elm, value, elmEvent)
	{
		Select.set($(".valuePageFormRedirect"), value);
		this.editFormRedirect(elm, value, elmEvent);
	}

	// перенаправление
	this.editFormRedirect = function(elm, hrefValue, elmEvent)
	{
		// if (value) value = value.replace(/\s/gim, "_");
		// elmEvent.val(value);

		var elmForm = elm.closest(".form");
		elmForm.find("input[name='hlp-redirect']").val(hrefValue);
	}

	/*********************/
	// action формы
	this.editFormAction = function(elm, value, elmEvent)
	{
		if (value) value = value.replace(/\s/gim, "_");
		else value = '';
		elmEvent.val(value);

		elm.closest(".form").attr("action", value);
		
		this.setVisibleFormRedirect(value);
	}

	// метод формы
	this.editFormMethod = function(elm, value)
	{
		elm.closest(".form").attr("method", value);
	}

/*************************************************************************************************/
	// динамическое поле
	this.setDynamic = function(elm)
	{
		var attrStatus = this.getAttrDynamicStatus();
		var statusV = elm.attr(attrStatus);
		if (!statusV) statusV = "no";

		// статус
		StyleMenu.chosenToggleBut($(".valueInputDynamicStatus"), statusV);
		// имя
		var attrName = this.getAttrDynamicName();
		var valueName = elm.attr(attrName);
		$(".valueInputDynamicName").val(valueName);
	}

	// изменение статуса
	this.editInputDynamicStatus = function(elm, value)
	{
		var attrStatus = this.getAttrDynamicStatus();
		if (value == "yes") elm.attr(attrStatus, value);
		else elm.removeAttr(attrStatus);

		// установка id
		var attrId = this.getAttrDynamicId();
		if (!elm.attr(attrId)) {
			elm.attr(attrId, "id"+Date.now());
		}
	}

	// изменить имя
	this.editInputDynamicName = function(elm, value)
	{
		var attrName = this.getAttrDynamicName();
		elm.attr(attrName, value);
	}

	/**
	* Атрибут - статус
	* 
	* @see 	this.
	*/
	this.getAttrDynamicStatus = function()
	{
		return "data-hlp-dynamic-input-status";	
	}

	/**
	* Атрибут - id
	* 
	* @see 	this.
	*/
	this.getAttrDynamicId = function()
	{
		return "data-hlp-dynamic-input-id";	
	}

	/**
	* Атрибут - имя
	* 
	* @see 	this.
	*/
	this.getAttrDynamicName = function()
	{
		return "data-hlp-dynamic-input-name";	
	}

	/**
	* Отдает список
	*
	* @see 	ElementsettingClick.setTabsDynamicValue()
	*/
	this.getListDynamicValue = function()
	{
		var attrName = this.getAttrDynamicName();
		var attrId = this.getAttrDynamicId();

		var listValue = {};
		var listInput = $(".input["+attrId+"]");
		var countInput = listInput.length;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputV = listInput.eq(iInput);
			var valueId = inputV.attr(attrId);
			var valueName = inputV.attr(attrName);

			listValue[valueId] = valueName;
		}

		return listValue;
	}

/*************************************************************************************************/
/**************************************************************************************************/

}//end class
var ElementSettingSection = new ElementSettingSection();
function ElementSettingSection() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var fixedValue = elm.attr("data-value") == "section-fixed" ? "yes" : "no";

		$(".blockValueSection .menuButValue[value='"+fixedValue+"']").attr("chosen", "true");
	}


	/**
	* Изменение
	*
	*/
	this.edit = function(elm, value)
	{	
		$(".section").removeAttr("data-value");
		if (value == "yes") elm.attr("data-value", "section-fixed");
	}
/*************************************************************************************/
}//end class
var ElementSettingGeneral = new ElementSettingGeneral();
function ElementSettingGeneral() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		this.setAttr(elm);
		this.setYaGoal(elm);
	}

/**********************************************************************************/
/**********************************************************************************/

	this.setAttr = function(elm)
	{
		$(".valueSettingGeneralElmId").val(elm.attr("data-hlp-elm-id"));
		// $(".valueSettingGeneralElmClass").val(elm.attr("data-hlp-elm-class"));

		// класс
		var elmClassV = this.getElmAttr(elm, "class");
		MenuListItem.addList("class", elmClassV);

		// атрибут
		var elmAttr = this.getElmAttr(elm, "attr");
		MenuListItem.addList("attr", elmAttr);
		// $(".valueSettingGeneralElmAttr").val(elmAttr);
	}

	this.setAttrItem = function(elmEvent)
	{
		var attrKeyV = elmEvent.attr("attr-key").trim();
		var attrValueV = elmEvent.attr("attr-value").trim();

		var menuItemKeyObj = $(".menuStyleItemGenAttrKey");
		if (attrKeyV == "new-attr") {
			$(".valueSettingGenAttrKey").val(attrKeyV);
			menuItemKeyObj.css("display", "block");
		} else {
			menuItemKeyObj.css("display", "none");
		}
		
		$(".valueSettingGenAttrValue").val(attrValueV);
	}

	this.setAttrClass = function(elmEvent)
	{
		$(".valueSettingGenAttrClass").val(elmEvent.attr("attr-class"));
	}


/************************************************************************************************/
/************************************************************************************************/

	this.editElmId = function(elm, value)
	{
		if (value) {
			value = value.trim().replace(/[^\w\-]+/gim, '');
			elm.attr("data-hlp-elm-id", value);
		} else {
			elm.removeAttr("data-hlp-elm-id");
		}
	}



/*************************************************************************************/
/*************************************************************************************/
	this.getElmAttr = function(elm, typeAttrV)
	{
		if (!elm) var elm = Element.obj;
		if (!typeAttrV) typeAttrV = "attr";
			
		var elmAttr = elm.attr("data-hlp-elm-"+typeAttrV);

		if (elmAttr && elmAttr != "true") {
			elmAttr = elmAttr.replace(/@@@@@quote_1@@@@@/gim, '\'');
			elmAttr = elmAttr.replace(/@@@@@quote_2@@@@@/gim, '\"');
			elmAttr = JSON.parse(elmAttr);
		} else {
			elmAttr = [];
		}

		return elmAttr;
	}

	this.editElmClass = function(elm, value)
	{
		if (value) {
			value = value.trim().replace(/[^\w\-\s\,]+/gim, ' ');
			elm.attr("data-hlp-elm-class", value);
		} else {
			elm.removeAttr("data-hlp-elm-class");
		}
		
	}

	this.editElmAttr = function(elm, value, elmEvent)
	{
		var typeV = MenuListItem.getType(elmEvent);
		var inputObjV = typeV == "class" ? $(".valueSettingGenAttrClass") : $(".valueSettingGenAttrKey");
		var inputValueV = inputObjV.val().trim();
		if (inputValueV.match(/^[0-9]+/gim)) {
			inputValueV = "a" + inputValueV;
			inputObjV.val(inputValueV);
		}
		inputValueV = inputValueV.replace(/[^\w\-]+/gim, '');
		inputObjV.val(inputValueV);

		var listAttrV = this.getElmAttr(elm, typeV);
		listAttrV = MenuListItem.uploadListValue(listAttrV, elmEvent);

		listAttrV = this.getJson(listAttrV);

		elm.attr("data-hlp-elm-"+typeV, listAttrV);
	}

	this.deleteAttr = function(itemIndexV, attrTypeV)
	{
		var elm = Element.obj;
		var listAttrV = this.getElmAttr(elm, attrTypeV);
		listAttrV.splice(itemIndexV, 1);

		if (listAttrV.length) {
			listAttrV = this.getJson(listAttrV);
			elm.attr("data-hlp-elm-"+attrTypeV, listAttrV);
		} else {
			elm.removeAttr("data-hlp-elm-"+attrTypeV);
		}
	}

	/**
	* Добавление нового атрибута
	*
	*/
	this.addNewAttr = function(attrTypeV)
	{
		if (attrTypeV == "class") {
			var newAttrNameV = 'new-cls'; 
			var newPropertyV = {
				"name" : newAttrNameV,
				"property" : {
					"attr-class": newAttrNameV,
				}
			}
		} else {
			var newAttrNameV = 'new-attr'; 
			var newPropertyV = {
				"name" : newAttrNameV,
				"property" : {
					"attr-key": newAttrNameV,
					"attr-value": 'new',
				}
			}
		}

		var elm = Element.obj;
		var listAttrV = this.getElmAttr(elm, attrTypeV);
		listAttrV[listAttrV.length] = newPropertyV;

		listAttrV = this.getJson(listAttrV);
		elm.attr("data-hlp-elm-"+attrTypeV, listAttrV);

		return newPropertyV;
	}


	this.getJson = function(textV)
	{
		textV = JSON.stringify(textV);
		textV = textV.replace(/\'/gim, '@@@@@quote_1@@@@@');
		textV = textV.replace(/\"/gim, '@@@@@quote_2@@@@@');

		return textV;
	}

/**********************************************************************************/
/**********************************************************************************/
	
	// ya цели
	this.setYaGoal = function(elm)
	{
		if (!elm.hasClass("form")
				&& !elm.hasClass("button")
				&& !elm.hasClass("image")) {
			$(".menuSettingYaGoal").css("display", "none");
			return false;
		}

		var counterId = Data.page.data.yandex_counter_id;
		$(".valueSettingGeneralYaCounterId").val(counterId);
		
		var eventIdV = elm.attr(this.getAttrYaEventId());
		$(".valueSettingGeneralYaEventId").val(eventIdV);
	}

	this.editYaCounterId = function(elm, value)
	{
		if (value) value = value.replace(/[^0-9]+/gim, '');
		Data.page.data.yandex_counter_id = value;
	}

	this.editYaEventId = function(elm, value)
	{
		if (value) value = value.trim();
		var attrV = this.getAttrYaEventId();

		if (value) elm.attr(attrV, value);
		else elm.removeAttr(attrV);
	}

	this.getAttrYaEventId = function()
	{
		return "data-hlp-ya-eventid";
	}


/**********************************************************************************************************/
/**********************************************************************************************************/
	
	this.attr = {};
	this.attr.code_status = "hlp-export-code-status";
	this.attr.code_position = "hlp-export-code-position";

	this.class = {};
	this.class.code_status = "valueSettingExportCodeStatus";
	this.class.code_position = "selectExportCodePosition";

	// get attr
	this.getAttrCodeStatus = function() { return this.attr.code_status;}
	this.getAttrCodePosition = function() { return this.attr.code_position;}

	// get class
	this.getClassCodeStatus = function() { return this.class.code_status;}
	this.getClassCodePosition = function() { return this.class.code_position;}

	this.setMGExport = function(elm)
	{
		this.setCode(elm);
	}

	// code
	this.setCode = function(elm)
	{
		this.setCodeStatus(elm);
		this.setCodePosition(elm);
	}

	this.setCodeStatus = function(elm)
	{
		var attrCodeStatusV = this.getAttrCodeStatus();
		var value = elm.attr(attrCodeStatusV) ? "yes" : "no";

		var classCodeStatusV = this.getClassCodeStatus();
		var inputObjV = $("."+classCodeStatusV); 
		StyleMenu.chosenToggleBut(inputObjV, value);
	}

	this.setCodePosition = function(elm)
	{
		var attrPosV = this.getAttrCodePosition();
		var value = elm.attr(attrPosV);
		if (!value) value = "replace";

		var classCodePostV = this.getClassCodePosition();
		var inputObjV = $("."+classCodePostV); 
		Select.set(inputObjV, value);
	}

	// вставка кода
	this.editExportCodeStatus = function(elm, value)
	{
		var attrCodeStatusV = this.getAttrCodeStatus();

		if (value == "yes") elm.attr(attrCodeStatusV, value);
		else elm.removeAttr(attrCodeStatusV);
	}

	this.editExportCodePosition = function(elm, value)
	{
		var attrPosV = this.getAttrCodePosition();
		elm.attr(attrPosV, value);
	}

/***************************************************************************************/
	
	this.setEvent = function()
	{
		this.setEventExport();	
	}

	this.setEventExport = function()
	{
		this.setEventCodeEdit();
	}

	this.setEventCodeEdit = function()
	{
		var butObj = $(".butExportCodeEdit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elm = Element.obj;
			// if (elm.hasClass("row")) elm = elm.find(".column:first");

			var elmCodeV = elm.find("> .hlp-element-code");

			var modalTitle = "Code";
			var oldCodeV = elmCodeV.length ? elmCodeV.html() : "";
			EditorCode.edit(modalTitle, oldCodeV, function(newCodeV) {
					
				elmCodeV.remove();
				var codeBlockV = '<span class="hlp-element-code">'+newCodeV+'</span>';
				
				if (elm.hasClass("row")) {
					elm.append(codeBlockV);
				} else {
					elm.prepend(codeBlockV);
				}

				History.record();
				Modal.delete();
			});
		});
	}

/***************************************************************************************/

}//end class

/**
* Тригер
*
*
*/
var ElementSettingTriger = new ElementSettingTriger();
function ElementSettingTriger() {
	this.attr = {};
	this.attr.event = "data-hlp-triger-event";
	this.attr.value  = "data-hlp-triger-value";
	this.attr.videotimer_time  = "data-hlp-triger-videotimer-time";

	this.class = {};
	this.class.type_event = "selectSettingTrigerEvent";
	this.class.videotimer_time = "valueTrigerVideotimerTime";
	this.class.videotimer_hide = "valueTrigerVideotimerHide";
	this.class.videotimer_hide_elm = "hlp-triger-videotimer-hide-replace";

	this.value = {};
	this.value.event_videotimer = 'videotimer';


	this.getAttrTrigerEvent = function()
	{
		return this.attr.event;
	}

	this.getAttrTrigerValue = function()
	{
		return this.attr.value;
	}

	this.getValueEventNone = function()
	{
		return "none";
	}

	this.getAttrVideotimerTime = function()
	{
		return this.attr.videotimer_time;
	}

	this.getClassTypeEvent = function()
	{
		return this.class.type_event;
	}

	this.getClassVideotimerTime = function()
	{
		return this.class.videotimer_time;
	}

	this.getClassElmHide = function()
	{
		return this.class.videotimer_hide_elm;
	}

	// 
	this.getVarEventVideotimer = function()
	{	
		return this.value.event_videotimer;
	}

	// 
	this.isEventVideotimer = function(typeV)
	{
		return typeV == this.getVarEventVideotimer();
	}


/*********************************************************************************/

	this.getValueTypeEvent = function(elm)
	{
		if (!elm) elm = Element.getObj();

		var attrTriger = this.getAttrTrigerEvent();
		var typeV = elm.attr(attrTriger);
		if (!typeV) typeV = this.getValueEventNone();

		return typeV;
	}

	this.setValueTypeEvent = function(elm, value)
	{
		var attrTriger = this.getAttrTrigerEvent();
		if (value == this.getValueEventNone()) elm.removeAttr(attrTriger);
		else elm.attr(attrTriger, value);
	}

/**************************************************************************************/
/**************************************************************************************/

	this.set = function(elm)
	{
		// показываем блок
		this.setBlockEvent(elm);
	}

	// тип собятия
	this.setTypeEvent = function(elm)
	{
		var value = elm.attr(this.getAttrTrigerValue());
		if (!value) value = 0;

		$("."+this.getClassVideotimerTime()).val(value);
	}

/**************************************************************************************/
/**************************************************************************************/
	
	// событие
	this.editEvent = function(elm, value)
	{
		// ставим новое значение
		this.setValueTypeEvent(elm, value);
		// убираем старые значения
		elm.removeAttr(this.getAttrTrigerValue())

		// показываем
		this.setBlockEvent(elm);
	}

	this.editVideotimerTime = function(elm, value)
	{
		if (value) value = value.trim();
		if (value) value = parseInt(value);
		else value = 0;

		elm.attr(this.getAttrTrigerValue(), value);
	}

/**************************************************************************************/
	/**
	* Показываем блок событий
	*
	* @see 	this.set()
	* @see 	this.editEvent()
	*/
	this.setBlockEvent = function(elm)
	{
		// показываем блок
		var typeV = this.getValueTypeEvent(elm);
		var listBlock = $(".menuStyleBlockTriger");
		listBlock.css("display", "none");
		listBlock.filter("[data-type='"+typeV+"']").css("display", "block");

		// отмечаем select
		Select.set($("."+this.getClassTypeEvent()), typeV);

		// ставим параметры
		// видео таймер
		if (this.isEventVideotimer(typeV)) {
			this.setTypeEvent(elm);
			this.setVideotimer(elm);
		}
	}

	this.setVideotimer = function(elm)
	{
		var classHideV = this.getClassElmHide();
		var value = elm.hasClass(classHideV) ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valueTrigerVideotimerHide"), value);
	}

	this.editVideotimerHide = function(elm, value)
	{
		var classHideV = this.getClassElmHide();
		if (value == "yes") elm.addClass(classHideV);
		else elm.removeClass(classHideV);
	}


	

} // end class

/**
* Модальное меню
*
*
*
*/
var MenuListItem = new MenuListItem();
function MenuListItem() {

	/**
	* Установка событий
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventAdd();
		this.setEventCloseModal()
	}

	/**
	* Добавление значения
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		$(".butAddBg").off("mousedown");
		$(".butAddBg").on("mousedown", function() {
			var typeV = obj.getType($(this));
			obj.addNewItem(typeV);
		});
	}

	/**
	* Добавление пункта
	*
	* @see 	this.setEventAdd()
	*/
	this.addNewItem = function(typeV)
	{
		var parentListObjV = this.getParentList(typeV);
		
		if (typeV == "attr" || typeV == "class") {
			var newPropertyV = ElementSettingGeneral.addNewAttr(typeV);
		} else if (typeV == "form-option") {
			var newPropertyV = ElementSettingForm.addNewOption();
		} else if (typeV == "transform") {
			var newPropertyV = StyleMenuTransform.addNewValue();
		} else {
			return false;
		}

		// добавляем на страницу
		this.addItem(parentListObjV, newPropertyV); 

		// показываем модальное
		var listItemObj = parentListObjV.find(".menuBgItem");
		newBgObj = listItemObj.last();
		newBgObj.mousedown().mouseup();

		// убираем блок none
		this.butNoneHide(typeV);

		History.record();
	}


	this.getObj = function(typeV)
	{
		if (typeV == "attr" || typeV == "class") {
			var objV = ElementSettingGeneral;
		} else if (typeV == "form-option") {
			var objV = ElementSettingForm;
		} else if (typeV == "transform") {
			var objV = StyleMenuTransform;
		} else {
			return false;
		}

		return objV;
	}

	this.edit = function(elm, elmEvent, typeV)
	{
		var objV = this.getObj(typeV);
		if (!objV) return false;

		var listOptionProperty = objV.getListProperty(elm);
		var propIndex = this.getItemIndex(elmEvent);
		// listOptionProperty = objV.editItemFromList(listOptionProperty, propIndex);
		if (!listOptionProperty[propIndex]) {
			listOptionProperty[propIndex] = {"name":"", "property":{}}
		}

		this.uploadListValue(listOptionProperty, elmEvent);
		this.addList(typeV, listOptionProperty);

		return listOptionProperty;
	}



	/**
	* Отдает тип списка 
	*
	* @see 	this.setEventAdd()
	*/
	this.getType = function(elmEvent)
	{
		return elmEvent.closest(".menuListBgBlock, .menuStyleModal").attr("data-type")
	}

	/**
	* Отдает родителя списка
	*
	* @see 	this.addList()
	* @see 	this.setEventAdd()
	*/
	this.getParentList = function(typeV)
	{
		return $(".menuListBgBlock[data-type='"+typeV+"'] .menuListBg");
	}

	/**
	* Отдает родитель
	*
	* @see 	this.setEventAdd()
	*/
	this.getParent = function(typeV)
	{
		return $(".menuListBgBlock[data-type='"+typeV+"']");
	}

	/**
	* Отдает список элементов
	*
	* @see 	StyleMenuBg.
	* @see 	.
	*/
	this.getListItem = function(typeV)
	{
		var parentListObj = this.getParentList(typeV);
		return parentListObj.find(".menuBgItem");
	}

	/**
	* Отдает список элементов
	*
	* @see 	this.addItem()
	*/
	this.getListItemByParent = function(parentListObj)
	{
		return parentListObj.find(".menuBgItem");
	}

	/**
	*
	*
	* @see 	ElementSettingForm.editSelectOption()
	*/
	this.getItemIndex = function(elmEvent)
	{
		return elmEvent.closest(".menuStyleModal, .menuBgItem").attr("data-hlp-index");
	}

	/**
	* Отдает имя пункта
	*
	* @see 	this.setEventDelete
	*/
	this.getItemName = function(elmEvent)
	{
		return elmEvent.closest(".menuBgItem").find(".bgItemName").text().trim();
	}

	/****************/	

	this.butNoneHide = function(typeV)
	{
		this.butNoneVisible(typeV, "none");
	}

	this.butNoneShow = function(typeV)
	{
		this.butNoneVisible(typeV, "block");
	}

	this.butNoneVisible = function(typeV, visibleValue)
	{
		var parentObjV = this.getParent(typeV);
		parentObjV.find(".menuBgItemNone").css("display", visibleValue);
	}

/**********************************************************************************/

	/**
	* Закрытие модального
	*
	* @see 	this.setEvent()
	*/
	this.setEventCloseModal = function()
	{
		var obj = this;
		var butClose = $(".menuStyleBlackout, .menuStyleModalExit");
		butClose.off("mousedown");
		butClose.on("mousedown", function() {
			obj.hideModal();
		});
	}

/*******************************************************************************/

	/**
	* Добавление списка элементов
	*
	* @see 	StyleMenuBg.addListBgBlock()
	*/
	this.addList = function(typeV, listValue)
	{
		var parentListObj = this.getParentList(typeV);
		parentListObj.html('');

		for (var iItem in listValue) {
			var itemValue = listValue[iItem];
			if (!itemValue) continue;

			this.addItem(parentListObj, itemValue, iItem);
		}

		var parentObj = this.getParent(typeV);
		var visibleNone = iItem ? "none" : "block"; 
		parentObj.find(".menuBgItemNone").css("display", visibleNone);
	}

	/**
	* Одает один блок
	*
	* @see 	this.addList()
	* @see 	StyleMenuBg.setEventAddImage() 
	*/
	this.addItem = function(parentObj, itemValue, iItem)
	{
		if (!iItem) {
			var listItemV = this.getListItemByParent(parentObj);
			iItem = listItemV.length
		}

		var block = this.getBlockItem(itemValue, iItem);
		parentObj.append(block);

		// ставим события
		this.setEventListBg();
	}

	/**
	* Отдает блок элемента bg
	*
	* @see 	this.addBgBlock()
	* @see 	this.setEventMoveBg()
	*/
	this.getBlockItem = function(itemValue, iItem) 
	{
		var listPropety = itemValue["property"];
		var propertyAttr = '';
		for (var keyProperty in listPropety) {
			propertyAttr += keyProperty+'="'+listPropety[keyProperty]+'" '
		}

		var block = '\
			<div class="menuBgItem" data-hlp-index="'+iItem+'" '+propertyAttr+'>\
				<div class="bgItemButTop"></div>\
				<div class="bgItemName">'+itemValue["name"]+'</div>\
				<div class="bgItemButDelete"></div>\
			</div>';

		return block;
	}

/************************************************************************************/
	
	/**
	* Показывает модальное
	*
	*
	* @see 	StyleMenuBg.showModal()
	*/
	this.showModal = function(modalType, elmEvent)
	{
		var modalObjV = $(".menuStyleModal[data-type='"+modalType+"']");
		modalObjV.css("display", "block").attr("data-hlp-index", elmEvent.attr("data-hlp-index"));

		//показываем ставим событие 
		$(".menuStyleBlackout").css("display", "block");
	}

	/**
	* Убирает модальное
	*
	* @see 	StyleMenuBg.setEventCloseModal()
	* @see 	StyleMenuBg.addListBgBlock()
	* @see 	Editor.resetFocus()
	* @see 	EditorController.setEventEditScreen()
	*/
	this.hideModal = function()
	{
		$(".menuStyleModal *").removeAttr("chosen", "true");
		$(".menuStyleBlackout, .menuStyleModal").css("display", "none");
	}

/************************************************************************************/
	
	/**
	* Ставит события
	*
	* @see 	this.addListBgBlock()
	* @see 	this.setEventAddImage()
	* @see 	this.setEventMoveBg()
	*/
	this.setEventListBg = function()
	{
		// изменение
		this.setEventEditBg();
		// поднять на вверх
		this.setEventMoveBg();
		// удаление
		this.setEventDeleteBg();
	}


	/**
	* Изменение
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventEditBg = function()
	{
		var obj = this;
		$(".menuBgItem").off("mousedown");
		$(".menuBgItem").on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = obj.getType(elmEvent);
			obj.showModal(typeV, elmEvent);
			var iItemV = obj.getItemIndex(elmEvent);

			if (typeV == "attr") {
				ElementSettingGeneral.setAttrItem(elmEvent);
			} else if (typeV == "class") {
				ElementSettingGeneral.setAttrClass(elmEvent);
			} else if (typeV == "form-option") {
				ElementSettingForm.setOptionProperty(elmEvent);
			} else if (typeV == "transform") {
				StyleMenuTransform.setOptionProperty(elmEvent);
			} else {
				return false;
			}
		});
	}

	/**
	* Изменение значения в массиве
	*
	* @see 	ElementSettingGeneral.editElmAttr()
	* @see 	ElementSettingForm.editSelectOption()
	*/
	this.uploadListValue = function(listAttrV, elmEvent)
	{
		var modalObjV = elmEvent.closest(".menuStyleModal");
		var indexValue = modalObjV.attr("data-hlp-index");
		var typeV = modalObjV.attr("data-type");
		var nameAttrV = modalObjV.attr("data-item-name");

		var listItemBlockObjV = $(".menuListBgBlock[data-type='"+typeV+"'] .menuListBg");
		var listItemV = listItemBlockObjV.find("> .menuBgItem");
		var curItemV = listItemV.filter("[data-hlp-index='"+indexValue+"']");

		var listInputObj = modalObjV.find("*[data-list-attr]");
		var countInput = listInputObj.length;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputObjV = listInputObj.eq(iInput);

			// если параметр скрыт
			var isPropertyNoneV = inputObjV.closest(".menuStyleItem").css("display") == "none";
			if (isPropertyNoneV) continue;

			var inputAttrV = inputObjV.attr("data-list-attr");
			var inputValueV = inputObjV.val();

			curItemV.attr(inputAttrV, inputValueV);
			listAttrV[indexValue]["property"][inputAttrV] = inputValueV;

			if (inputAttrV == nameAttrV) {
				listAttrV[indexValue]["name"] = inputValueV;
				curItemV.find(".bgItemName").text(inputValueV);
			}
		}

		return listAttrV;
	}

/*********************************************************************************/
	/**
	* Удалить
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventDeleteBg = function()
	{
		var obj = this;
		$(".bgItemButDelete").off("mousedown");
		$(".bgItemButDelete").on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = obj.getType(elmEvent);

			if (typeV == "class" || typeV == "attr") {
				var itemNameV = obj.getItemName(elmEvent);
				var deleteLabelV = "Подтвердите удаление <b>"+itemNameV+"</b>";
				Modal.confirmationDelete(deleteLabelV, function() {
					obj.deleteItem(elmEvent);
				});
			} else {
				obj.deleteItem(elmEvent);
			}

			return false;
		});
	}

	/**
	* Удаляет элемент
	* 
	* @see 	this.setEventDeleteBg()
	*/
	this.deleteItem = function(elmEvent)
	{
		var obj = this;
		var typeV = obj.getType(elmEvent);
		var itemIndexV = obj.getItemIndex(elmEvent);

		if (typeV == "attr" || typeV == "class") {
			ElementSettingGeneral.deleteAttr(itemIndexV, typeV);
		} else if (typeV == "form-option") {
			ElementSettingForm.deleteOption(itemIndexV);
		} else if (typeV == "transform") {
			StyleMenuTransform.deleteProp(itemIndexV);
		} else {
			return false;
		}

		elmEvent.closest(".menuBgItem").remove();

		// ставим новые индексы
		var listItemV = obj.getListItem(typeV);
		var countItemV = listItemV.length;
		for (var iItem = 0; iItem < countItemV; iItem++) {
			listItemV.eq(iItem).attr("data-hlp-index", iItem);
		}

		if (!listItemV.length) {
			obj.butNoneShow(typeV);
		}

		History.record();
	}


/**********************************************************************************/
	/**
	* Поднять
	*
	* @see 	this.setEventListBg()
	*/
	this.setEventMoveBg = function()
	{
		var obj = this;
		$(".bgItemButTop").off("mousedown");
		$(".bgItemButTop").on("mousedown", function() {
			var elmEvent = $(this);
			
			StyleMenuBg.moveBgItem(elmEvent);

			obj.setEventListBg();

			return false;
		});
	}
	

} // end class
/**
* Виджет слайдер
*
*
*/
var ElementWidgetBlockHover = new ElementWidgetBlockHover();
function ElementWidgetBlockHover() {
	this.class = "hlp-block-hover";
	this.attrAnimate = "data-widget-h1-animate";
	this.inputAnimateSelector = "selectWidgetHoverAnimate";

	this.set = function(elm)
	{
		this.setAnimate(elm);
	}

	this.setAnimate = function(elm)
	{
		var value = elm.closest("."+this.class).attr(this.attrAnimate);
		Select.set($("."+this.inputAnimateSelector), value);
	}

	this.editAnimate = function(elm, value)
	{
		elm = elm.closest("."+this.class); 
		elm.attr(this.attrAnimate, value);
	}

	this.editImg = function(elm, value, elmEvent)
	{
		elmEvent.removeAttr("chosen");

		var imgObj = Element.obj.closest("."+this.class).find("img");
		var srcV = imgObj.attr("src"); 

		var params = {
			"operation" : "edit_image",
			"src" : srcV,
			"obj" : imgObj
		}

		EditElementImage.edit(params);
	}

} // end class
/**
* Настройки элемента в правой меню
*
*
*/
var ElementWidget = new ElementWidget();
function ElementWidget() {
	/**
	* Установка параметров элемента в правой панели
	* 
	*/
	this.set = function() 
	{
		var elm = Element.obj;
		$(".menuWidget .menuWidgetElement").css("display", "none");

		// устанавливаем значение
		var listWidget = Element.data.widget;
		if (!listWidget) listWidget = [];
		for (var iWidget in listWidget) {
			var widgetName = listWidget[iWidget];

			var widgetV = this.list[widgetName];
			if (!widgetV) return false;

			// показываем блок
			var blockObjV = $('.'+widgetV["block"]);
			blockObjV.css("display", "block");
			blockObjV.find(".menuOneStyle").css("display", "block");
			
			// запускаем функцию установки значения
			var nameFunc = widgetV.function;
			if (!nameFunc) nameFunc = "set";
			widgetV.object[nameFunc](elm);
		}

		StyleMenu.setScroll(); 
	}

/*****************************************************************************************************/
	
	/**
	* Изменить
	*
	* @see 	ElementSettingController.edit() 
	*/
	this.edit = function(elmEvent)
	{
		var elm = Element.obj;
		// настройка
		var setting = elmEvent.attr("widget");
		if (!setting) setting = elmEvent.parent().attr("widget");

		var valueSetting = StyleMenu.getElmValue(elmEvent);

		// запускаем функцию
		this.launchByName(elm, setting, valueSetting, elmEvent);

		//если это scroll то ставим его на позицию нового значения
		if (elmEvent.attr("maxval")) {
			StyleMenu.setScroll(elmEvent); 
		}
	}

	/**
	* Запускаем функцию
	* 
	* @see this.edit()
	*/
	this.launchByName = function(elm, setting, valueSetting, elmEvent)
	{
		var pattern = new RegExp("^(slider|tabs|gallery_modal|gallery|block_hover)", "gi");
		// название объекта
		var nameObj = pattern.exec(setting)[0];
		// название функции
		var nameFunc = setting.replace(pattern, '');
		nameFunc = "edit"+nameFunc;
		
		var classObject = this.list[nameObj];
		
		// запускаем
		classObject["object"][nameFunc](elm, valueSetting, elmEvent);
	}

/***************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* Установка событий
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		ElementWidgetSlider.setEvent();
		ElementWidgetTabs.setEvent();
	}

/***************************************************************************************************/
}//end class



/**
* Виджет слайдер
*
*
*/

ElementWidgetTabs.prototype = ElementWidgetBasicList;
var ElementWidgetTabs = new ElementWidgetTabs();
function ElementWidgetTabs() {
	this.class = {};
	this.class.input_list = "valueTabsCurItem";
	this.class.but_add = "butWidgetTabsAdd";
	this.class.but_delete = "butWidgetTabsDelete";
	this.class.list_item = "hlp-tabs-item";

	this.class.select_chosen = "valueClickTabs";

	this.selector = {};
	this.selector.list = "> .hlp-tabs-item";


	this.set = function(elm)
	{
		this.setList(elm);
	}

	/**
	* Установка для кнопок
	*
	* @see 	ElementSettingClick.setTabs()
	*/ 
	this.setSelectBut = function(elm)
	{
		var parentObj = elm;
		for (var i = 0; i < 10; i++) {
			var tabsObj = parentObj.find(".hlp-tabs");
			
			if (tabsObj.length) break;
			if (parentObj.hasClass("hlp-section")) break;
			parentObj = parentObj.parent();
		}

		var listTabsItem = tabsObj.find("."+this.class.list_item);

		var listSelectV = '<div class="option" value="none">'+Resource.main_value_none+'</div>';
		var countItem = listTabsItem.length;
		for (var iItem = 0; iItem < countItem; iItem++) {
			var itemIndexV = listTabsItem.eq(iItem).attr("data-hlp-index"); 
			listSelectV += '<div class="option" value="'+itemIndexV+'">'+itemIndexV+'</div>';
		}

		$(".valueClickTabs .optionBlock").html(listSelectV);
	}

} // end class 

/**
* Виджет слайдер
*
*
*/

ElementWidgetSlider.prototype = ElementWidgetBasicList;
var ElementWidgetSlider = new ElementWidgetSlider();
function ElementWidgetSlider() {
	this.elmClassHide = "hlp-elm-hide";
	this.elmClassNav = "hlp-slider-arrow";
	this.elmClassList = "hlp-slider-list-bullets";
	this.elmAttrNavNone = "data-hlp-slider-arrows-hide";
	this.elmAttrListNone = "data-hlp-slider-bullets-hide";
	this.elmAttrAnimate = "data-hlp-slider-animate";

	this.elmAttrDuration = "data-hlp-slider-duration";
	this.elmAttrDelay = "data-hlp-slider-delay";

	this.listDefaultValue = {
		"other" : {"delay":4000, "duration":800},
		"s1" : {"delay":5000, "duration":600},
		"s2" : {"delay":4000, "duration":800}
	}

	this.class = {};
	this.class.input_list = "valueSliderCurSlide";
	this.class.but_add = "butWidgetSliderAdd";
	this.class.but_delete = "butWidgetSliderDelete";
	this.class.list_item = "hlp-slider-item";
	this.class.select_chosen = "valueClickSlider"; 
	this.selector = {};
	this.selector.list = "> .hlp-slider-list-item > .hlp-slider-item";
	this.selector.add = "> .hlp-slider-list-item";

	/**
	* Установка параметров элемента в правой панели
	* 
	* @see 	ElementSettingController.setEvent()
	*/
	this.set = function(elm) 
	{
		// устанавливаем сами слайды
		this.setList(elm);
		this.setAnimate(elm);
		this.setDuration(elm);
		this.setDelay(elm);
		this.setVisible(elm);
	}

	this.setAnimate = function(elm)
	{
		var value = elm.attr(this.elmAttrAnimate);
		
		/*для старого слайдера******************************/	
		if (value == "fade") {
			value = "fadeIn";
			elm.attr(this.elmAttrAnimate, value);
		} else if (value == "slide") {
			value = "slideInLeft";
			elm.attr(this.elmAttrAnimate, value);
		}
		/*******************************/

		Select.set($(".valueWidgetSliderAnimate"), value);
	}

	this.setDelay = function(elm)
	{
		var value = elm.attr(this.elmAttrDelay);
		if (!value) value = this.getDefaultValue(elm, "delay");
		$(".valueSliderDelay").val(value);
	}

	this.setDuration = function(elm)
	{
		var value = elm.attr(this.elmAttrDuration);
		if (!value) value = this.getDefaultValue(elm, "duration");
		$(".valueSliderDuration").val(value);
	}

	// отображение элементов
	this.setVisible = function(elm)
	{
		var elmSliderV = elm.closest(".hlp-slider");
		var visibleNav = elmSliderV.attr(this.elmAttrNavNone) == "true" ? "no" : "yes";
		StyleMenu.chosenToggleBut($(".valueWidgetSliderVisibleNav"), visibleNav);
		
		var visibleList = elmSliderV.attr(this.elmAttrListNone) == "true" ? "no" : "yes";
		StyleMenu.chosenToggleBut($(".valueWidgetSliderVisibleList"), visibleList);
	}

	/**
	* Отдает значение по умолчанию
	*
	* @see 	this.setDelay()
	* @see 	this.setDuration() 
	* @see 	this.editDelay()
	* @see 	this.editDuration()
	*/
	this.getDefaultValue = function(elm, key)
	{
		var slideNameV = this.getName(elm);
		var propertyV = this.listDefaultValue[slideNameV];
		if (!propertyV) propertyV = this.listDefaultValue["other"];

		return propertyV[key];
	}

	/**
	* Отдает имя слайдера
 	*
	* @see 	this.getDefaultValue()
	*/
	this.getName = function(elm)
	{
		if (!elm) elm = Element.obj;
		var slideNameV = elm.attr("data-hlp-widget-name");

		return slideNameV;
	}
/************************************************************************************/
	
	this.editAnimate = function(elm, value)
	{
		elm.attr(this.elmAttrAnimate, value);
	}
		
	this.editDelay = function(elm, value)
	{
		if (!value) value = this.getDefaultValue(elm, "delay");
		elm.attr(this.elmAttrDelay, value);
	}

	this.editDuration = function(elm, value)
	{
		if (!value) value = this.getDefaultValue(elm, "duration");
		elm.attr(this.elmAttrDuration, value);
	}

	/**
	* Отображение
	*
	*/
	this.editVisibleNav = function(elm, value)
	{
		this.editVisible(elm, value, this.elmAttrNavNone);
	}

	this.editVisibleList = function(elm, value)
	{
		this.editVisible(elm, value, this.elmAttrListNone);
	}

	this.editVisible = function(elm, value, attrV)
	{
		var elmSliderV = elm.closest(".hlp-slider");
		if (value == "yes") elmSliderV.removeAttr(attrV);
		else elmSliderV.attr(attrV, "true"); 
	}

/************************************************************************************/

} // end class
/**
* В галерея в модальном
*
*
*/
var ElementWidgetGalleryModal = new ElementWidgetGalleryModal();
function ElementWidgetGalleryModal() {

	this.set = function(elm)
	{
		var blockNone = $(".menuWidgetGalleryModal .menuStyleBlockNone");
		var elmParentObj = elm.parent().closest("*[data-hlp-widget-type='gallery_modal']");
		if (elmParentObj.length) {
			blockNone.css("display", "block");	
			return false;
		} else {
			blockNone.css("display", "none");
		}

		var valueWork = elm.attr("data-hlp-widget-type") ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valueGalleryModalWork"), valueWork);

		var valueType = elm.attr("data-hlp-widget-name");
		if (!valueType) valueType = "gm1";
		StyleMenu.chosenToggleBut($(".valueGalleryModalType"), valueType);
	}

/*************************************************************************************/
/*************************************************************************************/
	
	this.editWork = function(elm, value)
	{
		var elmChildObj = elm.find(".element[data-hlp-widget-type='gallery_modal']");
		elmChildObj.removeAttr("data-hlp-widget-type");
		elmChildObj.removeAttr("data-hlp-widget-name");

		if (value == "yes") {
			elm.attr("data-hlp-widget-type", "gallery_modal");
			elm.attr("data-hlp-widget-name", "gm1");
		} else {
			elm.removeAttr("data-hlp-widget-type");
			elm.removeAttr("data-hlp-widget-name");
		}
	}

	this.editType = function(elm, value)
	{
		elm.attr("data-hlp-widget-type", "gallery_modal");
		elm.attr("data-hlp-widget-name", value);
	}

/*************************************************************************************/

} // end class

/**
* Карта
*
*/
var EditElementMap = new EditElementMap();
function EditElementMap() {
	this.defaultZoom = 15;
	this.valueZoomMax = 21;
	this.valueZoomMin = 2;

	/**
	*
	*
	*
	*/
	this.edit = function(params)
	{
		if (!params) params = {};
		this.operator = params.operation;

		this.createModal();
		this.setEvent();
	}

/*********************************************************************************************/
	/**
	* Создает модальное окно
	*
	* @see 	this.edit()
	*/
	this.createModal = function()
	{
		var modalTitle = this.operator == "add" ? Resource.hlp_modal_map_title_add : Resource.hlp_modal_map_title_edit;

		var modalContent = this.getContent();
		Modal.create({
			'id':'modalMap',
			'title':modalTitle,
			'width':500,
			'top':50,
			'content':modalContent,
			'button':[
				['add', Resource.main_modal_but_instruction],
				['ok', Resource.main_modal_but_save],
				['cancel', Resource.main_modal_but_cancel],
			]
		});
	}


	/**
	* Отдает содержимое модального
	*
	* @see 	this.edit()
	*/
	this.getContent = function()
	{
		if (this.operator == "add") {
			var mapsCodeV = '';
			var mapsZoomV = this.defaultZoom;
		} else {
			var mapsSrcV = Element.obj.find(".selfElementBlackout").attr("data-src");
			var mapsCodeV = '<iframe src="'+mapsSrcV+'" width="640" height="480"></iframe>';
			var mapsZoomV = mapsSrcV.match(/&z=[0-9]+/gim);
			if (mapsZoomV) mapsZoomV = mapsZoomV[0].replace(/[^0-9]+/gim, '');
			else mapsZoomV = this.defaultZoom;
		}

		var modalContent = '\
			<div class="modalMapsListItem">\
				<div class="modalMapsItem">\
					<a class="modalMapsLink" target="_blank" href="https://www.google.com/maps/d/">'+Resource.hlp_modal_map_code_placeholder+'</a>\
					<div class="modalMapsItemValue">\
						<textarea class="modalMapsCode">'+mapsCodeV+'</textarea>\
					</div>\
					Zoom '+Resource.hlp_modal_map_label_zoom+'(от '+this.valueZoomMin+' до '+this.valueZoomMax+')\
					<input type="text" value="'+mapsZoomV+'" class="valueModalMapsZoom"/>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return modalContent;
	}

/*************************************************************************************************/
	/**
	* Устанавливает события
	*
	* @see 	this.edit()
	*/
	this.setEvent = function()
	{
		// сохранение
		this.setEventSave();
		// инструкция
		this.setEventInstruction();
	}

	/**
	* Сохранение
	*
	* @see 	this.setEventSave()
	*/
	this.setEventSave = function()
	{
		var obj = this;

		$("#modalMap .butOk").off("mousedown");
		$("#modalMap .butOk").on("mousedown", function() {
			var mapInputObj = $(".modalMapsCode");
			var codeValue = mapInputObj.val().trim();

			if (!codeValue.match("google")) {
				mapInputObj.val("");
				alert("Можно добавлять только карты Google")
				return false;
			}



			// изменяем значение
			codeValue = /src=("|')([^'"]+)("|')/gim.exec(codeValue);
			if (!codeValue || !codeValue[2]) {
				Notification.error(Resource.hlp_modal_map_notification_add_no_valid);
				return false;
			}

			// console.log(codeValue)
			// return false;

			// ставим размер
			codeValue = codeValue[2].replace(/width=[0-9]+%?/i, "width=100%");
			codeValue = codeValue.replace(/height=[0-9]+%?/i, "height=100%");

			// zoom
			var mapsZoomV = parseInt($(".valueModalMapsZoom").val());
			if (!mapsZoomV) mapsZoomV = obj.defaultZoom;
			else if (mapsZoomV < obj.valueZoomMin) mapsZoomV = obj.valueZoomMin;
			else if (mapsZoomV > obj.valueZoomMax) mapsZoomV = obj.valueZoomMax;
			codeValue = codeValue.replace(/&z=[0-9]+/gim, '');
			codeValue += "&z="+mapsZoomV;

			if (obj.operator == "add") {
				// создаем карту	
				ElementMap.mapSrc = codeValue;
				ElementMap.create();
			} else {
				var elm = Element.obj;
				elm.find(".selfElementBlackout").attr("data-src", codeValue);

				// перезагружаем для карты
				ElementMap.reloadCode(elm);		
				Modal.delete();
			}

			return false;
		});
	}

	/**
	* Инструкция
	*
	* @see 	this.setEvent()
	*/
	this.setEventInstruction = function()
	{
		$("#modalMap .butAdd").off("mousedown");
		$("#modalMap .butAdd").on("mousedown", function() {
			var content = '\
			<div class="modalInstruction">\
				<iframe id="modalVideoFrame" style="width:100%;" src="http://www.youtube.com/embed/h0A1p33ndhM?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
			</div>';

			Modal.create({
				'id':'modalMapInstruction',
				'title':Resource.hlp_modal_map_instruction_title,
				'width':500,
				'top':70,
				'content':content,
			});
		});
	}

/**********************************************************************************************/
}; //end class
/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
var EditElementImage = new EditElementImage();
function EditElementImage() {
	/**
	* @var 	array 	список картинок категории 
	* @set 	this.setImgCategory() при получении с сервера
	* @see 	this.replaceImgBlock()
	*/
	this.listImage = [];

	/**
	* @var 	string 	путь к картинке 
	* @set 	this.selected(), this.edit()
	* @see 	this.getElementHtml()
	*/
	this.src = '';
	/**
	* Тип выполняемой работы (add, edit_image, edit_bg)
	* @set 	this.add(), this.edit()
	* @see 	this.selected()
	*/
	this.type_operation = '';

	this.current_dir = '';
	this.old_dir = '';

	/**
	* Список заголовков
	*
	*/
	this.listTitle = {
		'img' : Resource.hlp_modal_image_label_type_image,
		'video' : Resource.hlp_modal_image_label_type_video
	};

	/**
	* Список ошибок для валидации
	*
	*
	*/
	this.listErrorValid = {
		"video" : {
			"type" : Resource.hlp_modal_image_error_video_type, 
			"size" : Resource.hlp_modal_image_error_video_size
		},
		"img" : {
			"type" : Resource.hlp_modal_image_error_image_type, 
			"size" : Resource.hlp_modal_image_error_image_size
		},
	};

	this.listCategory = {};
/************************************************************************/
	/**
	* Добавить элемент
	* 
	* @param 	string 		file_type
	* @param 	string 		src - путь картинки
	* @param 	string		operation - тип операции (add, edit_image, edit_bg)
	*
	* @see 	ElementAddController.setEvent()-add 
	* @see 	ElementEditController.setEvent()-edit_image
	* @see 	ElementStyleController.setEventBgImage()-edit_bg
	* @see 	StyleMenuBg.setEventBgVideo(), .setEventBgImage()
	* @see 	StyleMenuPageSetting.setEventFile()
	* @see 	ElementWidgetBlockHover.editImg()
	*/
	this.edit = function(params) {
		this.setProperty(params);

		//создаем модальное окно
		this.createModal();

		//эммитируем клик по вкладке чтбы поставились картинки
		this.setNewImgCategory();

		// делаем кнопку не активной, если добавление элемента
		if (this.isTypeOperationAdd()) this.setNoActButSave();
	}

/*********************************************************************************************/
	/**
	* Устанавливает параметры
	*
	* @see 	this.edit()
	*/
	this.setProperty = function(params)
	{
		// сбрасываем если разные типы
		if (params["file_type"] != this.fileType) {
			this.resetValueDir();
		}

		this.params = params;
		//установить тип манипуляции
		this.setTypeOperation(params['operation']);
		this.src = params['src'];
		if (!this.src) this.src = '';
		this.elm = params['obj'];
		
		// тип файла
		this.fileType = params.file_type;
		if (!this.fileType) this.fileType = 'img';

		// имя типа файла
		this.fileTypeName = this.listTitle[this.fileType];

		var siteId = params["site_id"];
		if (!siteId) siteId = Data.site.site_id;
		this.siteId = siteId;


		// ставим текущию группу
		this.setImgDir();
	}

	this.setImgDir = function()
	{
		if (this.isTypeOperationAdd() || !this.src) return false;

		var fileName = this.src.replace(/\/user\/[\w]+\/[\w]+\/img\//, '');

		fileName = fileName.replace(/\/?[^\/]+$/, '');

		this.setCurrentDir(fileName);
	}

	/**
	* Сброс значений директорий
	*
	* @see 	this.setProperty()
	* @see 	this.replaceImgBlock()
	*/
	this.resetValueDir = function()
	{
		this.setCurrentDir('');
		this.setOldDir('');
	}

/*******************************************************************************/

	this.isTypeOperationAdd = function()
	{
		var operationV = this.getTypeOperation();
		return operationV == "add";
	}

	this.getTypeOperation = function()
	{
		return this.type_operation;
	}

	this.setTypeOperation = function(operationV)
	{
		this.type_operation = operationV;
	}

	this.setCurrentDir = function(curDirV)
	{
		this.current_dir = curDirV;
	}

	this.getCurrentDir = function(){
		return this.current_dir;
	}

	this.setOldDir = function(oldDirV)
	{
		this.old_dir = oldDirV;
	}

	this.getOldDir = function()
	{
		return this.old_dir;
	}

/****************************************************************************************/
	/**
	* Делаем кнопку сохранить не активной
	*
	* @see 	this.edit()
	* @see 	this.setNoActButSave()
	*/
	this.setNoActButSave = function()
	{
		this.getButSave().addClass("no-active");
	}

	/**
	* Делает кнопку активной
	*
	* @see 	this.setEventNoteItemBlock()
	*/
	this.setActButSave = function()
	{
		this.getButSave().removeClass("no-active");
	}

	/**
	* Узнаем активная или нет
	*
	* @see  this.setEventModalSave()
	*/
	this.isNoActiveButSave = function()
	{
		return $("#modalImage .butOk[class~='no-active']").length;
	}

	/**
	* Отдает кнопку сохранить
	*
	* @see 	this.noActButSave()
	* @see 	this.setActButSave()
	* @see 	this.isNoActiveButSave()
	*/
	this.getButSave = function()
	{
		return $("#modalImage .butOk");
	}
/**********************************************************************************************/
/********************************************************************************************/
/****модальное окно******************************************************************************/
	/**
	* Создает модальное окно для выбора картинки
	*
	* @uses 	this.getModalContent() 		получить контент модального окна
	* @uses 	this.setImgCategory() 		устанаовить картинки категории
	* @uses 	this.setEventModal() 		установить события
	*/
	this.createModal = function()
	{
		//получить содержимое модального окна
		var content = this.getModalContent();

		var butAddTextV = Resource.main_modal_but_upload+' '+this.fileTypeName;
		if (this.params["no_chosen"]) {
			var listButtonV = [
					['add', butAddTextV],
					['cancel', Resource.main_modal_but_cancel]
				]
		} else {
			var listButtonV = [
					['add', butAddTextV],
					['ok', Resource.main_modal_but_chosen],
					['cancel', Resource.main_modal_but_cancel]
				]
		}

		if (this.params["no_chosen"]) {
			var modalTitleV = Resource.hlp_modal_image_title_manager_file;
		} else {
			var modalTitleV = Resource.main_modal_but_chosen+' '+this.fileTypeName;
		}

		//создаем модальное окно
		Modal.create({
			'width':'80%',
			'height':'',
			'top':'50',
			'id':'modalImage',
			'title':modalTitleV,
			'content':content,
			'content_class':'modalImageContent',
			'content_height':'max',
			'height_other':'50',
			'button':listButtonV
		});

		//устанавливаем события модального окна
		this.setEventModal();

		// добавляет блок информации максимальный размер загружаемый фаил
		this.addInfoMaxSize();
	}

	/**
	* Отдает содержиме модального окна
	*
	* @see 	this.createModal()
	*/
	this.getModalContent = function() {
		var topPanel = '';

		// if (this.fileType != "img") {
			topPanel = '<div class="modalImageTop">\
				<div class="modalImageFolderUrl"></div>\
				<div class="modalImageTopBut modalImageButCreateDir">'+Resource.hlp_modal_image_but_create_folder+'</div>\
				<div class="clear"></div>\
			</div>';
		// }

		var content = '\
			'+topPanel+'\
			<div class="butAddBlockForm" style="display:none;">\
				<form action="" method="post" enctype="multipart/form-data">\
					<input type="file" id="new_image" name="new_image" value=""/>\
					<input type="hidden" name="site" value="" />\
					<input type="hidden" name="file_type" value="'+this.fileType+'" />\
					<input type="submit" id="new_image_sub" value="Загрузить" />\
				</form>\
			</div>\
			<div class="modalImageSection">\
				<div class="modalImageContent"></div>\
				<div class="clear"></div>\
			</div>\
		';

		return content;
	}

	/**
	* Добавляет информацию - максимальный размер 
	*
	* @see 	this.createModal()
	*/
	this.addInfoMaxSize = function()
	{
		var blockInfo = '<div class="infoMaxSize">'+this.listErrorValid[this.fileType]["size"]+'</div>';
		$("#modalImage .butAdd").after(blockInfo);
	}
/************************************************************************************************/
/***********************************************************************************************/
	/**
	* Устанавливает события для модального окна
	* 
	* @see 		this.createModal()
	*/
	this.setEventModal = function()
	{
		//загрузить изображение
		this.setEventModalAdd();
		//сохранить изображение
		this.setEventModalSave();
		this.setEventCreateDir();
	}

/**********************************************************************************/
	
	/**
	* Открыть модальное
	*
	* @see 	this.setEventCreateDir()
	*/
	this.setEventCreateDir = function()
	{
		var butObj = $(".modalImageButCreateDir");
		var obj = this;
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalCreateDir();
			obj.setEventCreateDirSave();
		});
	}

	/**
	* Показываем модальное
	*
	* @see 	this.setEventCreateDir()
	*/
	this.showModalCreateDir = function()
	{
		var content = '\
			<div class="label">'+Resource.hlp_modal_image_modal_folder_label+'</div>\
			<input type="text" class="valueNewFolderImage" only-eng="true" />';

		Modal.create({
			"id" : "modalImageCreateDir",
			"title" : Resource.hlp_modal_image_modal_folder_title,
			"content" : content,
			"width" : 450,
			"top" : 40,
			"button" : [
				['cancel', Resource.main_modal_but_cancel],
				['add', Resource.main_modal_but_create]
			]
		});

		SpecialInput.setEventOnlyEng($(".valueNewFolderImage"));
	}

	/**
	* Создание папки - сохранение
	*
	* @see 	this.setEventCreateDir()
	*/
	this.setEventCreateDirSave = function()
	{
		var butSaveObj = $("#modalImageCreateDir .butAdd");
		var obj = this;
		butSaveObj.off("mousedown");
		butSaveObj.on("mousedown", function() {
			var newFolderName = $(".valueNewFolderImage").val();
			newFolderName = newFolderName.trim();
			if (!newFolderName) return false;
			
			newFolderName = newFolderName.replace('[\ \-]', '_');

			Modal.removeLast();
			Modal.createLoading("Создается папка");
			//запрос на сервер
			var queryString = obj.getQueryStringManipulationFile(newFolderName);
			ajaxPost('/editor/createFileFolderHol', queryString, function(res) {
				var newFolderProperty = res.responseText.trim();
				
				if (newFolderProperty) {
					newFolderProperty = JSON.parse(newFolderProperty);
					obj.listImage[newFolderProperty["name"]] = newFolderProperty;
					obj.setNewImgCategory(obj.category);
				}

				Modal.deleteLoadind();
			})
		});
	}

/*************************************************************************************************/
/*************************************************************************************************/
	/**
	* Добавить новое фото
	*
	* @see 	this.setEventModal()
	* @see 	this.reloadInputNewImg()
	*/
	this.setEventModalAdd = function() {
		var obj = this;
		
		$("#modalImage .butAdd").addClass('h-but-upload-file');
		var parentBut = $(".butAddBlockForm");
		var butHtml = '';
		var siteId = this.siteId;
		File.createButUpload(parentBut, butHtml, '/editor/saveFileHol', this.fileType, siteId, function(res) {
			var propertyNewImage = res;

			if (propertyNewImage) {
				propertyNewImage = JSON.parse(propertyNewImage);
				var newImageSrc = propertyNewImage["src"];
				newImageSrc = newImageSrc.replace(/\/\//gim, "/")
				propertyNewImage["src"] = newImageSrc;

				obj.listImage[propertyNewImage["name"]] = propertyNewImage;
				obj.setNewImgCategory();
			} else {
				Notification.error();
			}

			// убираем загрузку
			Modal.deleteLoadind();
		});
	}
/*********************************************************************************************/

	/**
	* Событие 	кнопки "Сохранить"
	*
	* @uses 	this.save() 		сохранить изображение
	* @see 		this.setEventModal()
	*/
	this.setEventModalSave = function()
	{
		var obj = this;
		$('#modalImage .butOk').off('mousedown');
		$('#modalImage .butOk').on('mousedown', function() {
			if (obj.isNoActiveButSave()) return false;

			obj.save();
		});
	}
/**************************************************************************************************/
/***************************************************************************************************/
/***работа с картинками************************************************************************/
	
	/**
	* Установить каринки категории на полотне 
	*
	* @see 		this.setEventModalNav()
	*/
	this.setNewImgCategory = function()
	{
		// категория уже загруженна
		var listImage = this.listCategory[this.getCategoryKey()];
		if (listImage) {
			this.loadingCategory(listImage);
			return false;
		}

		this.loadingCategoryServer();
	}
	
	/**
	* Загружает изображения с сервера
	*
	* @see 	this.setNewImgCategory()
	* @see 	EditElementImage.insertTemplatePage()
	*/
	this.loadingCategoryServer = function(noSet, siteId, fileType)
	{
		var obj = this;
		
		if (!noSet) Modal.createLoading(Resource.hlp_modal_image_load_add_file);
		//запрос на сервер
		if (!siteId) siteId = this.siteId;
		if (!fileType) fileType = this.fileType;

		var queryString = 'site='+siteId;
		queryString += "&file_type="+fileType;

		ajaxPost('/editor/getFileHol', queryString, function(res) {
			var response = res.responseText.trim();
			//результат в текстовом виде 
			var listImage = JSON.parse(response);
			
			if (noSet) {
				obj.listImage = listImage;

				if (fileType == "img")

				obj.listCategory[obj.getCategoryKey(fileType)] = listImage;
			} else {
				obj.loadingCategory(listImage);
				Modal.deleteLoadind();
			}
		})
	}

	this.getCategoryKey = function(fileType)
	{
		if (!fileType) fileType = this.fileType;
		return fileType;
	}

	/**
	* Загрузилась категория
	*
	* @see 	this.setNewImgCategory()
	*/
	this.loadingCategory = function(listImage)
	{
		this.listImage = listImage;
		this.listCategory[this.getCategoryKey()] = listImage;
		//устанавливаем новые картинки с типом сортировки по ширине
		this.replaceImgBlock();
	}

	/**
	* Сброс категории файлы
	*
	* @see 	TemplateSection.addTemplateAction()
	*/
	this.resetCategoryFiles = function()
	{
		this.listCategory["video"] = false;
	}
/************************************************************************************************/
	/**
	* Заменяет картинки на полотне
	*
	* @param 	array 	list-список картинок
	*
	* @see 	this.setEventSort() 		при изменгении метода сортировки
	* @see 	this.setNewImgCategory()
	* @see 	this.addNewImg()
	*/
	this.replaceImgBlock = function()
	{
		// если нет такой директории
		if (!this.listImage[this.getCurrentDir()]) this.resetValueDir();

		$("#modalImage").attr("data-curent-dir", this.getCurrentDir());
		this.setOldDir();

		//формируем
		var block = this.attachImgBlock(this.listImage);
		//вставляем
		this.insertImgBlock(block);
		//устанавливаем события
		this.setEventImage();
	}

	/**
	* Ставит старую директорию
	* 
	* @see 	this.replaceImgBlock()
	*/
	this.setOldDir = function()
	{
		var curDirV = this.getCurrentDir();
		var listFolderV = curDirV.split("/");
		var countFolderV = listFolderV.length;

		var blockUrlV = '';
		var addedAttrRoot = !curDirV ? 'data-type="current"' : '';
		blockUrlV += '<div class="modalImageUrl" '+addedAttrRoot+' data-folder="">'+Resource.hlp_modal_image_url_root+'</div>';

		var curDirV = '';
		var lastIndex = countFolderV - 1;
		var isFirstItem = true;
		for (var iFolder in listFolderV) {
			var folderItemV = listFolderV[iFolder];
			if (!folderItemV) continue;

			if (!isFirstItem) curDirV += '/';
			isFirstItem = false;
			curDirV += folderItemV;

			blockUrlV += '<span class="modalImageUrlSeparator">/</span>';
			var addedAttr = lastIndex == iFolder ? 'data-type="current"' : '';
			blockUrlV += '<div class="modalImageUrl" '+addedAttr+' data-folder="'+curDirV+'">'+folderItemV+'</div>';
		}

		blockUrlV += '<div class="clear"></div>';

		$(".modalImageFolderUrl").html(blockUrlV);

		this.setEventButBack();
	}

/***********************************************************************************************/
	
	/**
	* Сформировать блок картинок
	*
	* @param 	array   list_img-список изображений
	* @return 	html 	формированый блок изображений
	*
	* @see 	this.replaceImgBlock()
	*/
	this.attachImgBlock = function(listImage)
	{
		var navType = $('.modalNavItemAct').attr('type');

		var blockFile = '';
		var blockDir = '';

		//формируем одну картинку
		for (var fileName in listImage) {
			var item = listImage[fileName];

			// не той директории
			if (item['dir'] != this.getCurrentDir()) continue;

			//блок с кнопками манипуляции 
			var blockMan = '\
				<div class="modalImageBlockMan">\
					<img src="/img/editor/delete.png" class="modalButDeleteImage" title="" />\
				</div>';

			if (this.fileType == "img") {
				if (item['width']) var fileSize = +item['width']+'x'+item['height'];
				else var fileSize = '';
				 
				var src = item['src'];
			} else if (this.fileType == "video") {
				var src = '/img/editor/file-video.png';
				var fileSize = parseInt(item['size'])/1024/1024;
				fileSize = parseFloat(fileSize.toFixed(2)) + " MB";
			}

			if (item["type"] == "dir") {
				src = '/img/editor/file-folder.png';
				fileSize = '';
			}
					
			var fileName = item['name'];
			var fileName = fileName.match(/[^\/]+$/);
			if (fileName) fileName = fileName[0];

			var srcAttrV = item['src'];

			var blockItem = '\
				<div class="modalImgItem modalBlockItem" data-file-type="'+item['type']+'" img_name="'+item['name']+'" img_src="'+srcAttrV+'">\
					<img class="modalImgItemImage" src='+src+' />\
					<div class="modalImgItemName">'
						+fileName+
					'</div>\
					<div class="modalImgItemScreen">\
						'+fileSize+'\
					</div>'
						+blockMan+	
				'</div>';
			if (item['type'] == 'dir') blockDir += blockItem;
			else blockFile += blockItem;
		}

		var result = blockDir + blockFile;

		return result;
	}

	/**
	* Вставить картинки на полотно
	*
	* @param 	html 	block-блок картинок
	*
	* @see 		this.replaceImgBlock()
	*/
	this.insertImgBlock = function(block)
	{
		//вставляем на страницу 
		$('.modalImageContent').html(block);
	}

/**************************************************************************************************/
/***события картинок*****************************************************************************/
	/**
	* События картинок
	*
	* @see 		this.replaceImgBlock() 			отметить элемен
	*/
	this.setEventImage = function()
	{
		//отметить элемент
		this.setEventNoteItemBlock(); //
		//выбрать элемент
		this.setEventImageSelected();
		// кнопка назад
		this.setEventButBack();
		//отмечаем текущий элемент если он есть
		this.setImageNote();
		//удалить элемент
		this.setEventImageDelete();
		// подсказка
		this.setEventImageTip();

		//убираем значение search
		$('.modalImageSearchInput').val('');
	}


	/**
	* Отметить элемент
	*
	* @see 	this.setEventImage()
	*/
	this.setEventNoteItemBlock = function()
	{
		var obj = this;
		$('.modalBlockItem').off('mousedown');
		$('.modalBlockItem').on('mousedown', function() {
			var elmEvent = $(this);

			//убираем выделение у элемента
			$('.modalBlockItem').attr('note', 'false');
			//отмечаем элемент
			elmEvent.attr('note', 'true');

			// делаем кнопку активной
			obj.setActButSave();

			return false;
		})
	}

/**********************************************************************************************/
	/**
	* Выбрать элемент
	*
	* @uses 	this.save() 			сохранить изображение
	* @see 		this.setEventImage()
	*/
	this.setEventImageSelected = function()
	{
		var obj = this;
		$('.modalImgItem').off('dblclick');
		$('.modalImgItem').on('dblclick', function() {

			if ($(this).attr("data-file-type") == "dir") {
				obj.setCurrentDir($(this).attr("img_name"));

				obj.replaceImgBlock();

				return false;
			} else {
				obj.save();
			}
		})
	}

	/**
	* Кнопка назад по истории
	*
	* @see 	this.setEventImage()
	* @see 	this.setOldDir()
	*/
	this.setEventButBack = function()
	{
		var obj = this;
		var butObj = $(".modalImageUrl");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);

			obj.setCurrentDir(elmEvent.attr("data-folder"));
			obj.replaceImgBlock();
			return false;
		});
	}
/****************************************************************************************************/
	/**
	* Ставим выделение элементу
	*
	* @see 	this.setEventImage() 
	* @see 	this.addNewImg()
	*/
	this.setImageNote = function()
	{
		if (this.src) {
			//картинка котора стоит у выбраного элемента 
			var img_sel = $('.modalImgItem[img_src="'+this.src+'"] .modalImgItemImage');

			//отмечаем картинку
			img_sel.mousedown().mouseup();//@event-ModalBlock.setEventNoteItemBlock()
			//ставим скролл чтобы было видно выбраную картинку
			var par_elm = img_sel.parent();
			if (par_elm.length) {
				var top = par_elm.position().top - 90;
				$('.modalImageContent').scrollTop(top);
			}
		}
	} 
/********************************************************************************************/
	/**
	* Событие удаляем элемент
	*
	* @see 	this.setEventImage()
	*/
	this.setEventImageDelete = function() {
		var obj = this;

		$(".modalButDeleteImage").off("mousedown");
		$(".modalButDeleteImage").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("no-delete") != "true") {
				//выводи модальное 
				Modal.confirmationDelete(Resource.main_confirmation_delete_label, function() {
					// ставим событие на кнопку
					obj.eventConfirmationDelete(elmEvent);
				});
			}
		});
	}
	
	/**
	* Удаление
	*
	* @see this.setEventImageDelete();
	*/
	this.eventConfirmationDelete = function(elmEvent)
	{
		var obj = this;
		var itemImage = elmEvent.closest(".modalImgItem");
		var fileName = itemImage.attr("img_name");
		fileName = fileName.match(/[^\/]+$/);
		fileName = fileName[0];
		var src = itemImage.attr("img_src");

		// удаляем
		itemImage.css("display", "none");//прячем элемент

		Modal.createLoading(Resource.hlp_modal_image_load_delete_file);

		var queryString = obj.getQueryStringManipulationFile(fileName);
		// запрос на сервер
		ajaxPost('/editor/deleteFileHol', queryString, function(res) { 
			var result = res.responseText.trim();
			// console.log(result)

			if (result) {
				obj.removeImg(itemImage.attr("img_name"));
				//удаляем
				itemImage.remove();
			} else {	
				// показываем
				itemImage.css("display", "block");
				// выводим ошибку
				Notification.error();
			}
			Modal.removeLast();
		})
	}

	/**
	* Удаляет картинку
	*
	* @see 	this.eventConfirmationDelete()
	*/
	this.removeImg = function(fileName) 
	{
		var imgItem = this.listImage[fileName];
		if (!imgItem) return false;

		if (imgItem["type"] == "dir") {
			for (var fileNameItem in this.listImage) {
				if (this.listImage[fileNameItem]["dir"] == fileName) {
					var itemImg = this.listImage[fileNameItem];
					if (itemImg["type"] == "dir") {
						this.removeImg(itemImg["name"]);
					} else {
						this.removeImgItem(itemImg["src"]);
						delete this.listImage[fileNameItem];
					}
				}
			}
		};	

		this.removeImgItem(imgItem["src"]);
		delete this.listImage[fileName];
	}

	this.removeImgItem = function(src)
	{
		// удаляем картинки
		var listImg = $('.image img[src="'+src+'"]');
		var countImg = listImg.length;
		for (var i = 0; i < countImg; i++) {
			var img = listImg.eq(i);//.parent();
			// img.remove();
			// ElementCss.delete(img);
			img.attr("src", "none");
		}	
	}

/*********************************************************************************************/
	/**
	* Подсказка на картинке
	*
	*
	* @see 	this.setEventImage()
	*/
	this.setEventImageTip = function()
	{
		var listBut = $(".modalButDeleteImage[no-delete='true']");
		// ставим примечание
		Tip.setEvent(listBut, Resource.hlp_modal_image_tip_no_delete, "right");
	}

/**************************************************************************************************/
	/**
	* Показать кнопки изображения группы "my"
	*
	*
	*/
	this.setEventShowButImage = function() {	
		//показываем
		$('.modalImgItem').off('mouseover');
		$('.modalImgItem').on('mouseover', function() {
			$(this).find('.modalImgItemBut').css('display', 'block');
		});

		//убираем
		$('.modalImgItem').off('mouseout');
		$('.modalImgItem').on('mouseout', function() {
			$('.modalImgItemBut').css('display', 'none');	
		});
	}
/**********************************************************************************************************/
/***сохраняем картинку***************************************************************************/
	/**
	* Выбираем изображение
	*
	* @see 	this.setEventImageSelected()
	* @see 	this.setEventModalSave()
	* @see 	SiteController.setEventEditIcon()
	*/
	this.save = function()
	{
		if (this.params["no_chosen"]) return false;

		var name = $('.modalImgItem[note="true"]').attr('img_name'); 
		var src = $('.modalImgItem[note="true"]').attr('img_src');

		// для адаптивного залоговка
		if (this.getTypeOperation() == "edit_adaptive_title") {
			src = src.replace(/^https?:\/\/[^\/]+/gim, '');
			src = "http://" + location.hostname + src;

			PageDetailAdptiveTitle.saveModalEditValueImage(src);
			return false;
		}

		var elm = this.elm;
		if (!elm) elm = StyleMenu.getElementSelected("bg");
		var isNoCloseModal = this.saveImg(elm, name, src);

		//записываем при изменении самой картинки
		var status_record = this.getTypeOperation() == 'edit_image' ? true : false;
		
		//убираем модальное окно
		if (!isNoCloseModal) Modal.delete(status_record);
		Tip.hide();// убираем подсказку

		if (this.params["fixed_history"] == "yes") {
			History.record();
		}
	}

	/**
	* Сохранение изображения
	*
	* @see 	this.save()
	*/
	this.saveImg = function(elm, name, src)
	{
		src = src.replace(/img\/\//gim, 'img/');

		var operationV = this.getTypeOperation();
		//добавление элемента	
		if (this.isTypeOperationAdd()) {	
			//устанавливам значение, используется при создании
			ElementImage.src = src;
			//создаем картинку
			ElementImage.create();
			return true;
		// изменить иконку сайта
		} else if (operationV == 'edit_icon') {
			Data.site.data.icon = src;
			$(".menuSiteIcon").attr("src", src);

			Modal.removeLast();
			return true;
		// open graph
		} else if (operationV == 'edit_opengraph') {
			Data.page.data.opengraph.image = src;
			$(".openGraphImage").attr("src", src);

			Modal.removeLast();
			return true;

		// картинку видео фона 
		} else if (this.src != src) {
			if (operationV == 'edit_image' || operationV == "edit") {//изменение картинки
				if (elm.find("> img").length) elm = elm.find("> img");
				

				//заменяем src
				elm.attr('src', src);
			//изменение фона
			} else if (operationV == 'edit_bg') {// изменение bg
				StyleMenuBg.editImage(elm, src);
			}
		}
	}

/***********************************************************************************/
	/**
	* Параметры - манипуляция с файлом
	*
	* @see 	this.eventConfirmationDelete()
	* @see 	this.setEventCreateDirSave()
	*/
	this.getQueryStringManipulationFile = function(fileName)
	{
		var propV = 'name='+fileName;
		propV += '&folder='+this.getCurrentDir();
		propV += "&file_type="+this.fileType;
		propV += "&site_id="+this.siteId;

		return propV;
	}

/*************************************************************************************/
}// end class

/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementEmbed.prototype = EditElementBasic;
var EditElementEmbed = new EditElementEmbed();
EditElementEmbed.parent = EditElementBasic;

function EditElementEmbed() {
	/**
	*
	*
	*
	*/
	this.edit = function(params)
	{
		this.params = params;

		var modalTitle = this.params.operation == "add" ? Resource.hlp_modal_iframe_title_add 
																: Resource.hlp_modal_iframe_title_edit;
		var oldIframeCode = '';
		if (this.params.operation == "edit") {
			oldIframeCode = Element.obj.find("> .element-content").html();
		}

		var obj = this;
		EditorCode.edit(modalTitle, oldIframeCode, function(iframeCode) {
			if (obj.params.operation == "add") {
				ElementEmbed.create({"iframe":iframeCode});
			} else {
				Element.obj.find("> .element-content").html(iframeCode);
				Modal.delete();
			}
		});

	}

} // end class
/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementForm.prototype = EditElementBasic;
var EditElementForm = new EditElementForm();
EditElementForm.parent = EditElementBasic;

function EditElementForm() {
	/**
	* Изменение|создание
	*
	* @uses 	this.createModal() 	создаем модальное окно
	*/
	this.edit = function() 
	{
		/*****************/
		// сохраняем без модального окна
		this.save();
		return false;
		/*******************/


		// //создаем модальное окно
		// this.createModal();
	}
/*****************************************************************************************/
/*******************************************************************************************/
	/**
	* Создаем модальное окно
	*
	* @uses 	this.getModalContent() 	получить содержимое формы
	* @uses 	this.setEvent() 		установить события	
	* @see 		this.edit()
	*/
	this.createModal = function()
	{
		//содержимое формы
		var content = this.getModalContent();

		//создаем модальное окно
		Modal.create({
			'width':'1000',
			'height':'',
			'top':'20',
			'id':'modalForm',
			'title':'Выбрать форму',
			'is_resize':true,
			'nav':[
				['vertical', 'Вертикальная'],
				['horizontal', 'Горизонтальная']
			],
			'content':content,
			'content_class':'modalFormBlock',
			'content_height':'max',
			'button':[
				['ok', 'Сохранить'],
				['cancel', 'Отмена']
			]
		});

		//устанавливаем событие
		this.setEvent();
	}

	/**
	* Содержимое формы
	*
	* @see 		this.edit();
	*/
	this.getModalContent = function()
	{
		var content = '\
			<div class="modalBlockTop">\
				<div class="selectTypeBlock">\
					<div class="selectTypeLabel">Отображать форму как:</div>\
					<select class="selectTypeForm">\
						<option value="block">блок</option>\
						<option value="modal">модальное окно</option>\
					</select>\
				</div>\
			</div>\
			<div class="modalFormBlock" type="vertical">\
				<div class="modalFormItem modalBlockItem" form_class="formV1">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem" form_class="formV2">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem" form_class="formV3">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
			</div>\
			<div class="modalFormBlock" type="horizontal" style="display:none">\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
			</div>\
		';

		return content;
	}
/********************************************************************************************/
/******************************************************************************************/
	/**
	* Устанавливает событие
	*
	* @uses 	this.setEventNav() 		навигация	
	* @uses 	this.setEventSave() 	сохранить
	* @see 		this.createModal()
	*/
	this.setEvent = function()
	{
		//навигация
		this.setEventNav();
		//сохранить
		this.setEventSave();
	}
/*********************************************************************************************/
	/**
	* Событие сохранения формы
	*
	*
	*/
	this.setEventSave = function()
	{
		var obj = this;

		//двойной клик
		$('.modalBlockItem').off('dblclick');
		$('.modalBlockItem').on('dblclick', function() {
			obj.save();
		});

		//кнопка сохранить
		$('#modalForm .butOk').off('mousedown');
		$('#modalForm .butOk').on('mousedown', function() {
			obj.save();
		});
	}

	/**
	* Сохранение формы
	*
	* @uses		this.createForm() 		создает форму
	* @see 		this.setEventSave()
	*/
	this.save = function()
	{
		//создаем форму
		this.createForm();

		//убираем модальное окно
		// Modal.delete();
	}

	/**
	* Создаем форму
	*
	* @see 	save()
	*/
	this.createForm = function()
	{
		//выбраный элемент
		var sel_elm = $('.modalBlockItem[note="true"]');
		//тип отображения
		// var type_display = $('.selectTypeForm').val();

		//создаем саму форму
		ElementForm.create({'form_class':sel_elm.attr('form_class')});

		// ставим стили для заголовка
		var elmTitle = Element.obj.find(".text");
		ElementCss.set("geometry", elmTitle);
	}
/******************************************************************************************/
	/**
	* Устанавка событий навигации
	*
	* @see 		this.setEvent() 	
	*/
	this.setEventNav = function()
	{
		$('#modalForm .modalNavItem').off('mousedown');
		$('#modalForm .modalNavItem').on('mousedown', function() {
			//тип
			var type = $(this).attr('type');
			//убираем все блоки
			$('.modalFormBlock').css('display', 'none');
			//показываем выбраный блок
			$('.modalFormBlock[type="'+type+'"]').css('display', 'block');
		});
	}

/******************************************************************************************/
/*******************************************************************************************/
	/**
	* Показываем панель манипуляции для input
	*
	* @uses 	this.createPanelManInput() 		создаем панель
	* @uses 	this.setEventPanelManInput() 	события
	* @see 		ElementStyleController.actionAfterSelected()
	*/
	this.showPanelManInput = function()
	{
		//создаем панель управления
		this.createPanelManInput();
		//делаем не активными некоторые кнопки
		this.setStatusButPanelInput();
		//устанавливаем события
		this.setEventPanelManInput();
	}

/************************************************************************************************/
	/**
	* Создаем панель навигации
	* 
	* @uses 	this.setStatusButPanelInput()  	делаем не активными некотрые кнопки
	* @see 		this.showPanelManInput()
	*/
	this.createPanelManInput = function()
	{
		var elm = $('.elementSelected');

		//формируем блок
		var block = '<div class="panelManInput" is_delete="true">\
						<div class="panelManInputArrow"></div>\
						<img src="/img/arrow_down_w1.png" class="panelManInputItem" title="вниз" type="down" />\
						<img src="/img/arrow_up_w.png" class="panelManInputItem" title="вверх" type="up" />\
						<img src="/img/add_g.png" class="panelManInputItem" title="добавить поле" type="add" />\
						<img src="/img/cancel_r.png" class="panelManInputItem" title="удалить" type="delete" />\
						<div class="clear"></div>\
					</div>';
		//вставляем на страницу
		elm.parent().append(block);

		//устанавливаем параметры
		var left = elm.width() + parseInt(elm.css('padding-left')) + parseInt(elm.css('margin-right')) + parseInt(elm.css('padding-right'));
		$('.panelManInput').css({
			'display':'block',
			'top':3, 
			'left':left + 20
		});
	}

	/**
	* Делаем не активными некотрые кнопки
	*
	* @see 		this.showPanelManInput()
	* @see 		this.setEventPanelManInput()
	*/
	this.setStatusButPanelInput = function()
	{
		var elm = $('.elementSelected').parent();
		//делаем все кнопки активными
		$('.panelManInputItem').attr('status', 'true');

		//передвижение вниз
		if (elm.next().find('input').attr('type') != 'text') {
			$('.panelManInputItem[type="down"]').attr('status', 'false');
		}

		//передвижение вверх
		if (elm.prev().find('input').attr('type') != 'text') {
			$('.panelManInputItem[type="up"]').attr('status', 'false');
		}

		//удалить
		if (elm.closest('form').find('input[type="text"]').length < 2) {
			$('.panelManInputItem[type="delete"]').attr('status', 'false');
		}

	}
/***события для панели навигации**********************************************************************************************/
	/**
	*
	*
	*/
	this.list_func_man_input = {
		'down' : 	'manInputMove',
		'up' : 		'manInputMove',
		'delete' : 	'manInputDelete',
		'add' : 	'manInputAdd'
	}

	/**
	* Устанавливаем события для панели
	*
	* @uses 	this.list_func_man_input 		список функций
	* @uses 	obj.setStatusButPanelInput() 	сделать некоторые кнопки не активными
	* @see 		this.showPanelManInput()
	*/
	this.setEventPanelManInput = function()
	{
		var obj = this;
		$('.panelManInputItem').off('mousedown');
		$('.panelManInputItem').on('mousedown', function() {
			var type = $(this).attr('type');
			var elm = $('.elementSelected').parent();
			
			//вызываем функцию
			obj[obj.list_func_man_input[type]](elm, type);
			//обновляем состояние кнопок
			obj.setStatusButPanelInput();
			return false;
		})
	}

	/**
	* Перемещение 
	*
	* @see 	this.setEventPanelManInput()
	*/
	this.manInputMove = function(elm, type)
	{
		if ($('.panelManInputItem[type="'+type+'"]').attr('status') != 'false') {
			//получаем блок
			var block = '<div class="inputWrap">'+elm.html()+'</div>';
			//элемент брат
			var elm_brother = type == "up" ? elm.prev() : elm.next();
			
			//перемещаем если брат тоже input
			if (type == "up") elm_brother.before(block);
			else elm_brother.after(block);
			//убираем выделеный блок
			elm.remove();
			//устанавливаем события для вставленного элемента
			ElementStyleController.setEventCanvas();
			this.setEventPanelManInput();
		}
	}

	/**
	* Удаление
	*
	* @see 	this.setEventPanelManInput()
	*/
	this.manInputDelete = function(elm, type)
	{
		//удаляем
		if ($('.panelManInputItem[type="delete"]').attr('status') != 'false') {
			$('.topMenuItem[type="delete"]').mousedown();
		}
	}

	/**
	* Добавляем новое поле
	*
	* @uses 	this.createModalAddInput() 		создание модального окна
	* @uses 	this.setEventModalAddInput() 	устанавливаем события 	
	* @see 		this.setEventPanelManInput()
	*/
	this.manInputAdd = function() {
		//создаем модальное окно
		this.createModalAddInput();
		//устанавливаем события
		this.setEventModalAddInput();
	}
/************************************************************************************************/
	/**
	* Создать модальное окно для добавление нового input
	*
	* @uses 	this.getContentModalAddInput() 	получить содержимое модального окна
	* @see 		this.manInputAdd() 	
	*/
	this.createModalAddInput = function() 
	{
		var content = this.getContentModalAddInput();

		//создаем модальное окно
		Modal.create({
			'width':'400',
			'height':'',
			'top':'100',
			'id':'modalAddInput',
			'title':'Добавить поле формы',
			'content':content,
			'content_class':'modalFormBlock',
			'button':[
				['cancel', 'Отмена'],
				['add', 'Добавить']
			]
		});
	}

	/**
	* Формируем содержимое модального окна - добавление поля формы
	*
	*
	*/
	this.getContentModalAddInput = function()
	{
		var block = '\
			<div class="modalAddInputLabel">Выберите тип поля:</div>\
			<select class="choseType" >\
				<option value="new">Новое</option>\
				<option value="phone">Телефон</option>\
				<option value="email">Email</option>\
				<option value="name">Имя</option>\
				<option value="surname">Фамилия</option>\
				<option value="patronymic">Отчество</option>\
				<option value="fio">ФИО</option>\
				<option value="organization">Организация</option>\
			</select>\
		';

		return block;
	}

/****************************************************************************************************/
	/**
	* Установить событие для модального окна - добавить поле 
	*
	*
	* @see 		this.manInputAdd() 	
	*/
	this.setEventModalAddInput = function()
	{
		var obj = this;
		//сохранение
		$('.butAdd').off('mousedown');
		$('.butAdd').on('mousedown', function() {
			var option = $('#modalAddInput .choseType');
			//данные
			var value = option.val();
			var placeholder = option.find('option:selected').text();
			var type = value == 'new' ? 'new' : 'standart';

			//создаем поле
			ElementFormInput.create({'name':value, 'placeholder':placeholder, 'type_field':type});
			
			//закрываем модальное окно
			Modal.delete();		
		});

	}
/************************************************************************************************/
/***********************************************************************************************/

}//end class

//8G%dxBY89








/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementVideo.prototype = EditElementBasic;
var EditElementVideo = new EditElementVideo();
EditElementVideo.parent = EditElementBasic;

function EditElementVideo() {
	/**
	* @var 	string 	индификатор видео
	* @set 	this.setEvent()
	* @see  this.getUrl()
	*/
	this.param = {
		'video_id':'',
		'autoplay':false,
		'loop':false,
		'showinfo':false,
		'controls':false
	};
/**************************************************************************************/
	/**
	* Создает модальное окно  для добавления|едактирования видео
	*
	* @param 	array(operator) 	параметры 	
	*
	*/
	this.edit = function(param)
	{
		this.operation = param ? param.operation : "edit";

		//создаем модальное окно
		this.createModal();
		//устанавливаем события
		this.setEvent();
		
		//устанавливаем параметры видео
		if (this.operation == 'edit'){
			var videoHref = Element.obj.find(".self-video").attr("src");
			this.setParamVideo(videoHref);
		}
	}													
/*********************************************************************************************/
/******************************************************************************************/
	/**
	* Создает модальное окно
	*
	* @uses 	this.getContent() 	получить контент
	* @uses 	this.setEvent() 	устанавливает событие
	* @see 	this.edit()
	*/
	this.createModal = function()
	{
		//получить содержимое модального окна
		var content = this.getContent();
		var titleVideo = this.operation == "add" ? Resource.hlp_modal_video_title_add : Resource.hlp_modal_video_title_edit;
		

		//создаем модальное окно
		Modal.create({
			'id':'modalVideo',
			'width':'810',
			'height':'',
			'top':'50',
			'title':titleVideo,
			'content':content
		});
	}


	/**
	* Получить контент для блока
	*
	* @see 		this.createModal()
	*/
	this.getContent = function()
	{
		var tutorialIdV = '0MYSIKkiXPs';
		var content = '	<div class="modalVideoBlockLeft modalVideoBlock">\
							<iframe id="modalVideoFrame"  src="https://www.youtube.com/watch?v='+tutorialIdV+'" frameborder="0" allowfullscreen></iframe>\
						</div>\
						<div class="modalVideoBlockRight modalVideoBlock">\
							<div class="modalVideoListParam">\
								<div class="modalVideoBlockItem  modalVideoBlockItemUrl" >\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_url+'\
									</span>\
									<input type="text" class="modalVideoUrlInput" placeholder="'+Resource.hlp_modal_video_label_url_placeholder+'" key="video_id"/>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="autoplay" no_replace="true"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_autoplay+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="loop"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_loop+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="showinfo"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_panel_info+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem modalVideoItemMan">\
									<input type="checkbox" class="modalVideoCheckbox" key="controls" />\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_panel_manager+'\
									</span>\
								</div>\
							</div>\
							<div class="modalBlockButtton">\
								<div class="butBlock butOk butInstruction" style="float:left;">\
									<div class="textInBut">'+Resource.main_modal_but_instruction+'</div>\
								</div>\
								<div class="butBlock butCancel" style="">\
									<div class="textInBut">'+Resource.main_modal_but_cancel+'</div>\
								</div>\
								<div class="butBlock butAdd">\
									<div class="textInBut">'+Resource.main_modal_but_save+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
						<div class="clear"></div>';


		return content;
	}
/*************************************************************************************/
	/**
	* Устанавливает события
	*
	* @uses 	this.setEventCheckbox()  	checkbox
	* @uses 	this.setEventChangeUrl() 	изменение uri
	* @uses 	this.setEventSave() 		сохранение видео
	* @see 		this.edit()
	*/
	this.setEvent = function()
	{
		//checkbox
		this.setEventCheckbox();
		//изменение uri
		this.setEventChangeUrl();
		//сохраняем видео
		this.setEventSave();
		// интструкция
		this.setEventInstruction();
		// отмена
		this.setEventCancel();

	}

	/**
	* Событие для checkbox
	*
	* @uses 	this.insertUrlInVideo() 	замена url у видео
	* @see 		this.setEvent()
	*/
	this.setEventCheckbox = function() {
		var obj = this;
		//изменение chekbox
		$('#modalVideo input[type="checkbox"]').off('change');
		$('#modalVideo input[type="checkbox"]').on('change', function() {
			var elm_event = $(this);
			//ключ
			var key = elm_event.attr('key');
			//значение
			// var value = elm_event.attr('checked') ? false : true;
			var value = obj.param[key] ? false : true;
			//отмечаем или убираем checkbox
			elm_event.attr('checked', value);

			//заносим новое значение в переменую
			obj.param[key] = value;

			//если нет отметки не заменять
			if (!elm_event.attr('no_replace')) {
				//заменяем url
				obj.insertUrlInVideo();
			}
		});
	}

	/**
	* Событие изменения  url
	*
	* @uses 	this.insertUrlInVideo() 	замена url у видео
	* @see 	this.setEvent()
	*/
	this.setEventChangeUrl = function() {
		var obj = this;
		
		//изменение url
		$('#modalVideo input[key="video_id"]').off('change');
		$('#modalVideo input[key="video_id"]').on('change', function() {
			var valueVideo = $(this).val();

			/**переделать*******/
			$("#modalVideo .modalBlockCont").html(obj.getContent());
			$('#modalVideo input[key="video_id"]').val(valueVideo);
			obj.setEvent();
			/************/

			obj.setParamVideo(valueVideo);

			return true;
		});
	}

	/**
	* Сохранение видео
	*
	* @see 		this.setEvent()
	*/
	this.setEventSave = function()
	{
		var obj = this;
		$('#modalVideo .butAdd').off('click');
		$('#modalVideo .butAdd').on('click', function() {
			//получаем src элемента
			var src = obj.getSrc();

			//создание нового
			if (obj.operation == 'add') {	
				//устанавливаем переменую в класс
				ElementVideo.param = obj.param;
				ElementVideo.src = src;
				//создаем элемент
				ElementVideo.create();
			//изменение 
			} else {
				//заменяем src у элемента
				Element.obj.find('.self-video').attr('src', src);
				//удаляем модальное окно
				Modal.delete(true);
			}
		});
	}


	/**
	* События для кнопки инструкция
	*
	* @see 	this.setEvent()
	*/
	this.setEventInstruction = function()
	{
		var but = $("#modalVideo .butInstruction");
		but.off("mousedown");
		but.on("mousedown", function() {
			var content = '\
			<div class="modalInstruction">\
				<iframe id="modalVideoFrame" src="https://www.youtube.com/embed/2wWv09cF8Vs?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
			</div>';

			Modal.create({
				"id":"modalInstruction",
				"title":Resource.hlp_modal_video_instruction_title,
				"content":content,
				"width":500,
				"top":30
			});
		});
	}

	this.setEventCancel = function()
	{
		var but = $("#modalVideo .butCancel");
		but.off("mousedown");
		but.on("mousedown", function() {
			Modal.delete();			
		});
	}

/*****************************************************************************************/
/*****************************************************************************************/
	/**
	* Устанавливает video id в переменую 
	*
	* @see 	this.edit()
	* @see 	this.setEventChangeUrl()
	*/
	this.setParamVideo = function(videoHref)
	{
		this.isYoutube = videoHref.match(/youtube/gim);
		if (this.isYoutube) this.setParamYoutube(videoHref);
		else this.setParamVimeo(videoHref);

		// ставим в модальное окно
		this.insertUrlInVideo();
		
		// ставим checkbox
		$(".modalVideoBlock input").removeAttr("checked"); 
		for (var key in this.param) {
			if (this.param[key] && key != 'video_id') {
				var inputObj = $('#modalVideo .modalVideoCheckbox[key="'+key+'"]');

				inputObj.prop("checked", true);
			}
		}
	}

	/***
	* Устанавливает параметры для youtbe
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamYoutube = function(videoHref)
	{
		this.param = {};
		this.param.video_id = this.getVideoId(videoHref);
		this.param.showinfo = videoHref.match(/showinfo=0/) ? false : true;
		this.param.controls = videoHref.match(/controls=0/) ? false : true;
		this.param.loop = videoHref.match(/loop=1/) ? true : false;
		this.param.autoplay = videoHref.match(/autoplay-yes=1/) ? true : false;
	}

	/***
	* Устанавливает параметры для vimeo
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamVimeo = function(videoHref)
	{
		this.param = {};
		var videoId = /vimeo\.com(\/video)?\/([\w]+)/gim.exec(videoHref);
		this.param.video_id = videoId[2];
		this.param.showinfo = videoHref.match(/title=false/) ? false : true;
		this.param.loop = videoHref.match(/loop=true/) ? true : false;
		this.param.autoplay = videoHref.match(/autoplay-yes=true/) ? true : false;
	}

/*********************************************************************************************/

	/**
	* Отдает id видео
	* 
	* @see 	this.setParamVideo()
	*/
	this.getVideoId = function(videoHref)
	{
		//получаем из url индификатор видео
		var pat = /(\/watch\?v=([a-zA-Z_0-9\-]+))|(youtube\.com\/embed\/([a-zA-Z_0-9\-]+))/gim;
		var listProperty = pat.exec(videoHref);

		var videoId = listProperty[2];
		if (!videoId) videoId = listProperty[4];

		return videoId;
	}

	/**
	* вставляем url в видео
	*
	* @see 		this.setEventCheckbox()  	
	* @see 		this.setEventChangeUrl() 	
	*/
	this.insertUrlInVideo = function()
	{
		//получаем ссылку
		var src = this.getSrc();
		//заменяем у видео src
		$('#modalVideoFrame').attr('src', src);

		if (this.isYoutube) var urlMain = 'https://www.youtube.com/watch?v=';
		else var urlMain = 'https://vimeo.com/';
		var urlVideo = urlMain + this.param.video_id


		$(".modalVideoUrlInput").val(urlVideo);
		//устанавливаем событие как загрузиться видео так показываем его
		this.setEventLoadVideo();
		
		// показываем панель или убираем
		if (this.isYoutube) var checkOpacity = "1";
		else var checkOpacity = "0";
		$(".modalVideoItemMan").css("opacity", checkOpacity);
	}

	/**
	* Сформировать url видео
	*
	* @param 	array() 	param-парметры видео
	* @param 	boolean		is_autoplay - статус ставить авто запуск или нет
	*
	* @see 		this.insertUrlInVideo()
	* @see 		this.setEventSave()
	* @see 		PageController.setEventShowModeVideo() 		режим просмотр
	*/
	this.getSrc = function()
	{
		var video_id = this.param.video_id; //id видео
		
		//формируем параметры url
		if (this.isYoutube) {
			var url_param = this.param.showinfo ? '': '&showinfo=0';
			url_param += this.param.controls ? '': '&controls=0';
			url_param += this.param.loop ? '&loop=1&playlist='+video_id: '';
			url_param += this.param.autoplay ? "&autoplay-yes=1" : '';
			return 'https://www.youtube.com/embed/'+video_id+'?rel=0'+url_param;
		} else {
			var url_param = this.param.showinfo ? '': '&title=false&byline=false&portrait=false';
			url_param += this.param.loop ? '&loop=true': '';
			url_param += this.param.autoplay ? "&autoplay-yes=true" : '';

			if (url_param) url_param = url_param.replace(/^&/gim, "?");

			return 'https://player.vimeo.com/video/'+video_id+url_param;
		}
		
		
	}

/******************************************************************************************/
	/**
	* Как видео загружено показать его, это делается что бы 
	*
	* @see 	this.insertUrlInVideo()
	*/
	this.setEventLoadVideo = function()
	{
		//убираем видео, что бы небыло задержки после изменения url 
		$('#modalVideoFrame').css('opacity', '0');

		$('#modalVideoFrame').on('load', function() {
			//как загрузилось видео показываем его
			$('#modalVideoFrame').css('opacity', '1');
			//убираем  событие
			$('#modalVideoFrame').off('load');
		});
	} 
/******************************************************************************************/


}//end class



/**
* Текстовый редактор
*
* @parent 	EditElementBasic
*/
var TextEditor = new TextEditor();
function TextEditor() {
	/**
	* Статус был клик по редактору или нет
	* @set 	this.setEvent()
	* @see 	ElementStyleController.setEventCanvas()
	*/
	this.isClick = false;

	/**
	* Пустая строка
	*
	*
	*/
	this.emptyString = "^&^*%*%*078&%";

	/**
	* Длина текста
	*
	*/
	this.textLength = 0;

	this.isAddWrap = false;
/*************************************************************************************/
	/**
	* Изменить текст
	* 
	* @see 		ElementEditController.setEvent()
	*/
	this.edit = function() 
	{
		// создаем редактор
		this.show();
		// вставляем текст
		this.setTextInField();
		// прячем сам элемент
		this.hideElm();
		// ставим события
		this.setEvent();
	}

	/**
	* Узнает показан он или нет
	* @see 	ElementStyleController.actionBeforeSelected()
	* @see 	EditorController.setEventKey()
	* @see 	StyleMenu.launchByName()
	*/
	this.isShow = function()
	{
		return $(".textRedactor").css("display") == "block" ? true : false;
	}

	/**
	* Прячем элемент
	*
	* @see 	this.edit()
	*/
	this.hideElm = function()
	{
		var elm = Element.obj;
		elm.addClass("elementHide");
		elm.find(".resizeBlock").css("display", "none");
	}

	/**
	* Показываем элемент
	*
	* @see 	this.hide()
	*/
	this.showElm = function()
	{
		var elm = Element.obj;
		$(".element").removeClass("elementHide");
		elm.find(".resizeBlock").css("display", "block");
	}
/***********************************************************************************/
	/**
	* Создать редактор
	*
	*/
	this.show = function()
	{
		// свойства
		this.editor = $(".textRedactor");
		this.field = $(".textRedactorField");
		this.blockMenu = $(".textRedactorMenu");
		this.listButton = $(".textRedactorButton");

		// устанавливаем параметры
		this.editor.css("display", "block");
		this.setProportion();

		/***************/
		
		var obj = this;

		var wrapObjV = $(".contentWrap");
		wrapObjV.off("scroll");
		wrapObjV.on("scroll", function() {
			obj.setProportion();
		});
		/*************/
	}

	/**
	* Устанавливаем параметры
	* @see this.edit()
	*/
	this.setProportion = function()
	{
		var elm = Element.obj;
		var scrollTopContent = Editor.getCanvas().scrollTop();

		// ставим позицию для редактора
		var widthElm = elm.width() + 1;
		
		var topV = Element.obj.offset().top - $(".redactorPageTop").height() - Editor.getTopPanelHeight();
		var leftV = Element.obj.offset().left;

		this.editor.css({
			"top": topV,
			"left": leftV,
			"width": widthElm,
			"padding": elm.css("padding")
		});

		// для панели кнопок
		var menuTop = "-37px";
		var menuBottom = "auto";

		// ставим снизу панель с кнопками
		if (this.isPositionBottom(elm, scrollTopContent)) {
			var menuBottom = (this.blockMenu.height() + 9) * (-1); 
			var menuTop = "auto";
		}

		this.blockMenu.removeAttr("style").css({"top":menuTop, "bottom":menuBottom});

		// ставим сторону меню
		var parentWidth = $(".contentWrap .section").width();
		var menuSide = parentWidth - 435 - 10 < leftV ? "right" : "left";
		this.blockMenu.css(menuSide, "-1px");
	}

	/**
	* Отдает значения расположения
	*
	* @see 	this.setProportion()
	*/
	this.isPositionBottom = function(elm, scrollTopContent)
	{
		var contentOffsetTop = $(".content").offset().top;
		var elmOffsetTop = elm.offset().top;
		
		// top от верха .content
		var elmTop = elmOffsetTop - contentOffsetTop - scrollTopContent;

		// если меньше 50px
		if (elmTop < 50) return true;
		else return false;
	}
/***************************************************************************************/
	/**
	* Ставим текст в редактор
	* @see 	this.edit()
	*/
	this.setTextInField = function()
	{
		var elm = Element.obj;
		
		// ставим текст в поле
		var elmContent = elm.find(".element-content");
		if (!elmContent.length) elmContent = elm;
		var text = elmContent.html().trim();
		this.oldText = text;//фиксируем текст

		// вставляем текст
		this.field.html(text);
		// ставим стили
		this.field.css({
			"font-size":elm.css("font-size"),
			"font-family":elm.css("font-family"),
			"font-weight":elm.css("font-weight"),
			"font-style":elm.css("font-style"),
			"text-decoration":elm.css("text-decoration"),
			"line-height":elm.css("line-height"),
			"letter-spacing":elm.css("letter-spacing"),
			"color" : "rgb(0,0,0)",
			"background-color" : "rgb(240,240,240)",
			
			"text-align":elm.css("text-align"),
			"padding-top":elm.css("border-top-width"),
			"padding-left":elm.css("border-left-width")
		});

		// ставим курсор в конец поля 
		this.setCursorToEnd();
		// отмечаем кнопки с текущим стилем стили
		this.noteButtonStyle();
		// ставим количество сиволов
		this.textLength = this.field.html().length;
	}

	/**
	* Устанавливаем курсор
	*
	* @see 	this.setTextInField()
	* @see 	this.clearText()
	*/
	this.setCursorToEnd = function()
	{
		// добавляем тэг в конец что бы курсор встал в конец
		var text = this.addLastString(); 
		this.field.html(text);

		// поставить курсор
		var range = document.createRange();
		var sel = window.getSelection();
		var lastChild = this.field.find("*:last");
		range.setStart(lastChild[0], 1);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
/**************************************************************************************/
	/**
	*  Прячет
	* @see 	ElementStyleController.actionBeforeSelected()
	* @see 	Site.save()
	* @see 	StyleMenu.set()
	* @see 	StyleMenu.launchByName()
	*/
	this.hide = function()
	{
		if ($(".textRedactor").css("display") == "none") return false; 

		var elm = Element.obj;
		var elmContent = elm.find(".element-content");
		if (!elmContent.length) elmContent = elm;

		// показываем элемент
		this.showElm();
		
		// удаляем редактор
		$(".textRedactor").css("display", "none");
		// убираем событие установлено в this.setEventKeyPress
		$(".textRedactorField").off("keyup");

		// в this.show() - было событие поставленно
		$(".contentWrap").off("scroll");

		// если текст изменился фиксируем историю
		if (this.oldText != elmContent.html()) {
			History.record();
		}

		// ставим текст
		this.setTextInElm();

		// если нету текста у элемента то удаляем его
		var text = $(".textRedactorField").html().trim();
		text = this.clearLastString(text);
		// if (!text) ElementMan.delete(elm);//$(".topMenuDelete").mousedown();
		if (!text) elmContent.html("text element"); 

		// если была добавленна оболочка
		// if (this.isAddWrap) Input.newCanvas();
		if (elm.find(".text-span").length) Input.newCanvas();
		this.isAddWrap = false;
	}
/****************************************************************************************/
/**************************************************************************************/
	/**
	* Отметить кнопки
	*
	* @see 	this.setEventField()
	* @see 	this.setTextInField()
	*/
	this.noteButtonStyle = function()
	{
		//получить текст
		var str = this.getSelelectedText();
		//очищяем текст от тегов сестер
		str = this.clearSelectedText(str);
		//устанавливаем стиль в меню
		this.setMenuStyle(str);
	}

	/**
	* Отдать весь текст левее от курсора 
 	*
 	* @see 	this.noteButtonStyle()
	*/
	this.getSelelectedText = function()
	{
		//выделеный элемент
	  	var sel = window.getSelection();
	  	//начало позиции относительно родительского узла
	  	var endPost = sel.getRangeAt(0).startOffset;

	  	//родительский узел
	  	var endNode = sel.anchorNode;
	  	//корневой узел
	  	var root = document.getElementsByClassName('textRedactorField')[0];
	  
	  	//объект
	  	var rng = document.createRange();
	  	//начало
	  	rng.setStart(root, 0);
	  	//конец
	  	rng.setEnd(endNode, endPost);

	  	//создаем контеннер
	  	var div = document.createElement("div");
		//ложим в него содержимое
		div.appendChild(rng.cloneContents());
		
		//получаем результат
		return div.innerHTML;
	}

	/**
	* Очищаем текст от тегов не родительских
	*
	* @param 	string 		str-строка которую нужно очистить
	*
	* @see 		this.noteButtonStyle()
	*/
	this.clearSelectedText = function(str)
	{
		
		//убираем с конца закрывающий тег
		var pat_tag_tail = /<\/[^>]+>$/ig;
		while (str.match(pat_tag_tail)) {
			str = str.replace(pat_tag_tail, '');
		}

		//очищяем текст от тегов которые не родительскте
		var pat_tag = /<[^>]+>[^<]+<\/[^>]+>/igm;
		while (str.match(pat_tag)) {
			str = str.replace(pat_tag, '');
		}

		return str;
	}
/*****************************************************************************************/
	/**
	* список кнопок по тегам
	*
	* @see this.setMenuStyle()
	*/
	this.listButtonToTag = {
		"<b>":"bold",
		"<i>":"italic",
		"<u>":"underline",
		"<strike>":"strikeThrough"
	}

	/**
	* Устанавить стили в правом меню
	*
	* @param 	string 	str - строка в которой нужно найти стиль
	*
	* @see 		this.noteButtonStyle()
	*/
	this.setMenuStyle = function(str)
	{
		// отмечаем кнопки
		this.setMenuButton(str);
		// ставим размер
		// this.setMenuSize(str);
		// font
		// this.setMenuFamily(str);
		// цвет
		// this.setMenuColor(str);
	}

	/**
	* Отмечаем кнопки
	*
	* @see 	this.setMenuStyle()
	*/
	this.setMenuButton = function(str)
	{
		// сбрасываем кнопки
		this.listButton.removeAttr("chosen");
		// получаем тег 
		var listTag = str.match(/<[^>\/]+>/gi); 

		// отмечаем кнопки
		for (indexTag in listTag) {
			var tag = listTag[indexTag];
			// кнопка
			var button = this.listButton.filter("[value='"+this.listButtonToTag[tag]+"']");
			//отмечаем
			button.attr("chosen", "true");
		}
	}

	/**
	* Отмечаем размер
	*
	* @see 	this.setMenuStyle()
	*/
	this.setMenuSize = function(str)
	{
		var fontSize = str.match(/font-size:[^;"]+/gim);

		if (fontSize) {
			var countSize = fontSize.length;
			fontSize = fontSize[countSize - 1].replace(/[^0-9]+/gim, '');
		} else {
			fontSize = $(".valueTextSize").val();
		}

		$(".valueTextSizeEditor").val(fontSize);
	}

	/**
	* Отмечаем цвет
	*
	* @see 	this.setMenuStyle()
	*/
	this.setMenuColor = function(str)
	{
		var fontColor = str.match(/color:[^;"]+/gim);

		if (fontColor) {
			var countColor = fontColor.length;
			fontColor = fontColor[countColor - 1].replace(/(color: )|(;)+/gim, '');
			fontColor = Color.getHexRGB(fontColor);
		} else {
			fontColor = $(".valueTextColor").val();
		}

		$(".valueTextColorPart").css("background-color", "#"+fontColor).val(fontColor);
	}

	/**
	* Отмечаем family
	*
	* @see 	this.setMenuStyle()
	*/
	this.setMenuFamily = function(str)
	{
		var fontFamily = str.match(/font-family:[^;"]+/gim);

		if (fontFamily) {
			var countFamily = fontFamily.length;
			fontFamily = fontFamily[countFamily - 1].replace(/(font-family: )|(;)+/gim, '');
			fontFamily = fontFamily.replace(/'|"/gim, '');
		} else {
			fontFamily = $(".valueTextFamily").val();
		}

		Select.set($(".butFamilyTextEditor"), fontFamily);
	}
/*********************************************************************************************/
/*******************************************************************************************/
	/**
	* Ставим события
	*
	* @see ElementEditController.setEvent()
	*/
	this.setEvent = function()
	{
		// стили
		this.setEventStyle();
		// очищение
		this.setEventClear();
		// клик по полю
		this.setEventField();
		// нажатие клавиши
		this.setEventKeyPress();
	}
/***************************************************************************************************/
	/**
	* Клик по кнопке
	* @see 	this.setEvent()
	*/
	this.setEventStyle = function()
	{
		var obj = this;
		
		// нажатие кнопки
		$(".textRedactorButton, .butTextHistory").off("mousedown");
		$(".textRedactorButton, .butTextHistory").on("mousedown", function() {
			if ($(this).hasClass("textRedactorButtonWrap")) {

				document.execCommand("FontSize", false, 7);
				var wrapObj = $(".textRedactorField").find("font[size='7']").removeAttr("size");

				var classUnique = Element.getNewClassUnique("text-span");

				wrapObj.replaceWith(function(index, oldHTML) {
					return $("<span>").html(oldHTML)
						.attr("class", "element text-span "+classUnique)
						.attr("class-unique", classUnique)
						.attr("elm-type", "text-span");;
				});

				ElementTextSpan.create({"new_class":classUnique});

				obj.isAddWrap = true;

				return false;
			}


			var elmEvent = $(this);
			var property = elmEvent.attr("value");
			var value = true;
			obj.editStyle(elmEvent, property, value, true);
			return false;
		});

		// input 
		$(".textRedactor input").off("change");
		$(".textRedactor input").on("change", function() {
			var elmEvent = $(this);
			var property = elmEvent.attr("property");
			var value = elmEvent.val();
			obj.editStyle(elmEvent, property, value);

			return false;
		});


		// запрет на фокус для font-size
		var butSize = $(".textRedactor .valueTextSizeEditor");
		butSize.off("mousedown");
		butSize.on("mousedown", function() {
			return false;
		});
	}

	/**
	* Изменяет стиль
	*
	*
	* @see 	this.setEventStyle()
	*/
	this.editStyle = function(elmEvent, property, value, isBut)
	{
		// если это размер шрифта
		if (property == "FontSize") {
			var fontSize = value;
			value = 7;
		} else if (property == "ForeColor") {
			value = "#" + value;
		}

		document.execCommand(property, false, value);

		// если размер шрифта
		if (property == "FontSize") this.editSize();
		else if (property == "ForeColor") this.editColor(value);
		else if (property == "FontName") this.editFont(value);

		// отмечаем кнопку
		if (!isBut) return false;
		var isChosen = elmEvent.attr("chosen") == "true" ? "false" : "true";
		elmEvent.attr("chosen", isChosen);
	}


	/**
	* Изменить размер текста
	*
	* @see 	this.editStyle()
	* @see 	this.setEventKeyPress()
	*/
	this.editSize = function(fontSize)
	{
		if (!fontSize) fontSize = $(".valueTextSizeEditor").val();
		var elmFontSize = this.field.find("font[size='7']");
		if (elmFontSize.length) elmFontSize.removeAttr("size")
										.css("font-size", fontSize+"px");
		// ставим текст
		this.setTextInElm();
	}

	/**
	* Изменить цвет текста
	*
	* @see 	this.editStyle()
	*/
	this.editColor = function(fontColor)
	{
		var elmFontColor = this.field.find("font[color]");
		if (elmFontColor.length) elmFontColor.removeAttr("color")
											.css("color", fontColor);
	}

	/**
	* Изменить цвет фонт
	*
	* @see 	this.editStyle()
	*/
	this.editFont = function(font)
	{
		var elmFont = this.field.find("font[face]");
		if (elmFont.length) elmFont.removeAttr("face").css("font-family", font);
	}
/*************************************************************************************************/	
/*********************************************************************************************/
	/**
	* Нажатие клавиши
	*
	* @see 	this.setEvent()
	*/
	this.setEventKeyPress = function()
	{
		var obj = this;
		var fieldObj = $(".textRedactorField");

		fieldObj.off("keyup");
		fieldObj.on("keyup", function(e) {

			obj.setTextInElm(e);
			return false;
		});	

		/******************************************************/

		fieldObj.off("paste");
		fieldObj.on("paste", function(e) {
			// setTimeout(function() { obj.setTextInElm(false, true); }, 100);
			setTimeout(function() { 
				// для очищения
				obj.field.find("mytage").remove();
				var text = obj.field.text().trim();
				obj.field.text(text);

				obj.setTextInElm(false, true); 
			}, 100);
		});

		/******************************************************/
		fieldObj.off("keydown");
		fieldObj.on("keydown", function(e) {
			var key = e.keyCode;
			if (key == 9) return false; // нажатие таб, что бы не переключился фокус
		});
	}


/****************************************************************************************/
	/**
	* Устанавливает текст в элемент
	*
	* @see 	this.setEventKeyPress()
	* @see 	this.hide()
	* @see 	this.editSize()
	* @see 	this.setEventClear()
	*/
	this.setTextInElm = function(e, isClear)
	{
		// текст
		var text = this.field.html().trim();
		text = text.replace(/&lt;/gim, '<');
		text = text.replace(/&gt;/gim, '>');

		text = this.clearLastString(text);// убираем конец чтроки
		text = this.replaceBr(text); //заменяем перенос
		text = text.replace(/&nbsp;/gim, " ").trim();
		if (!isClear) text = this.replaceTag(text);// заменяем tag

		// 
		if (isClear) text = this.clearText(text);
		//если нету текста, что бы потомок не поднялся
		if (!text) text = this.emptyString;

		text = text.trim().replace(/^(<br\/*>)+/gim, '');
		text = text.replace(/(<br\/*>)+$/gim, '');

		// ставим текст в элемент что бы изменялся его размер
		var elm = Element.obj;

		var elmContent = elm.find(".element-content");
		if (!elmContent.length) elmContent = elm;
		elmContent.html(text);

		// если span
		if (Element.isTypeTextSpan()) this.setProportion();
	}

	/**
	* Очищает текст от тегов
	*
	* @see 	this.setEventKeyPress()
	* @see 	ElementCss.clearAllStyleScreen()
	*/
	this.clearText = function(text)
	{
		var field = $(".textRedactorField");
		// фиксируем перенос строки
		var strBr = 'IUBThdsgiusygofd875634b8v6347v5734758934747598345983794';
		text = text.replace(/<div[^>]*>/gim, strBr);
		text = text.replace(/<br[^>]*>/gim, strBr);
		text = text.replace(/<li[^>]*>/gim, strBr);

		// Пробел
		text = text.replace(/<span[^>]*>/gim, ' ');
		// убираем лишние
		// text = text.replace(/[«»&]+/gim, '');

		// получаем текст без 
		field.html(text);
		text = field.text();
		
		
		// ставим перенос строки
		var patternClear = new RegExp(strBr, 'gim');
		text = text.replace(patternClear, '<br>');

		text = text.trim().replace(/^<br[^>]*>/gim, '');
		text = text.replace(/<br[^>]*>$/gim, '');
		text = text.replace(/(<br[^>]*>){2,}/gim, '<br>');

		/*очистить первый таб*****/
		text = text.replace(/&nbsp;/gim, " ").trim();
		text = text.replace(/[\r\n\t]+/gim, '');
		text = text.replace(/^(<br>)+/gim, '');
		/******/

		field.html(text.trim());

		return text;
	}

	/**
	* Заменяет перенос строки
	*
	* @see 	this.setTextInElm()
	*/
	this.replaceBr = function(text)
	{
		// ставим br
		text = text.replace(/<div>/gim, '<br/>');
		text = text.replace(/<\/div>/gim, '');
		return text;
	}

	/**
	* Заменяет tag
	*
	* @see 	this.setTextInElm()
	*/
	this.replaceTag = function(text)
	{
		// заменяем tag
		// text = text.replace(/(?:<|\/)((font)|(color)|(style)|(h[0-9])|(div)|(p)|(wbr))(?=\s|>)/gim, "span");
		// console.log(text)
		var listTag = "((font)|(color)|(style)|(h[0-9])|(div)|(p)|(wbr)|(ol)|(ul)|(li))";
		var patStart = new RegExp("<"+listTag, "gim");
		var patEnd = new RegExp(listTag+">", "gim");
		text = text.replace(patStart, "<span");
		text = text.replace(patEnd, "span>");

		return text;
	}
/*************************************************************************************/
	/**
	* устанавливаем значение в меню
	*
	* @see 		this.setEvent()
	*/
	this.setEventField = function() {
		var obj = this;

		$('.textRedactorField').off('click');
		$('.textRedactorField').on('click', function() {
			// отмечаем кнопки
			obj.noteButtonStyle();
		});
	}

	/**
	* Очищение текста от тегов
	*
	*/
	this.setEventClear = function()
	{
		var obj = this; 

		$(".textRedactorButClear").off("mousedown");
		$(".textRedactorButClear").on("mousedown", function() {
			// очищаем текст
			var textNoMyTag = obj.clearLastString(obj.field.html());
			obj.field.html(textNoMyTag);
			var text = obj.field.text();//.replace(/<\/?(b|i|u|strike)>/gi, '');
			obj.field.html(text);

			// убираем выделение кнопок
			obj.listButton.removeAttr("chosen");
			// ставим текст в элемент
			obj.setTextInElm();

			// делаем клик чтобы стили стандартные стали
			obj.field.click();
		})
	}
/*****************************************************************************************/
	/**
	* Добавляем конец строки
	*
	* @see 	this.setCursorToEnd()
	*/
	this.addLastString = function()
	{
		return this.field.html().trim()+"<myTage style='display:none;'>243</myTage>"; 
	}

	/**
	* Очистить конец строки
	*
	* @see 	this.clearText()
	* @see 	this.hide()
	* @see 	this.setEventClear()
	*/
	this.clearLastString = function(text)
	{
		return text.replace(/<((mytage)|(myTage))[^>]+>[^<]+<\/((mytage)|(myTage))>/gim, '');
	}
/************************************************************************************************/
}//end class


/**
* 
*
*
*/
StyleMenuBoxShadow.prototype = StyleMenu;
var StyleMenuBoxShadow = new StyleMenuBoxShadow();
function StyleMenuBoxShadow() {
	

	this.set = function(elm)
	{
		var list = this.cutShadow(elm);
		//устанавливаем значения
		//тип
		$(".valueShadowType[value='"+list['type']+"']").attr('chosen', 'true');
		//цвет
		Color.setRgbaInMenu($('.valueShadowColor'), list['color']);
		// смещение
		$('.valueShadowOffsetX').val(list['offsetX']);
		$('.valueShadowOffsetY').val(list['offsetY']);

		//радиус
		$('.valueShadowRadius').val(list['radius']);
		//ширина
		$('.valueShadowWidth').val(list['width']);
	}

	/**
	* Разложить по стилям тень
	*
	* @see this.shadow();
	*/
	this.cutShadow = function(elm)
	{
		//тень
		var shadow = elm.css('box-shadow');
		var emptyValue = { 'type':'', 'offsetX':'0', 'offsetY':'0', 'radius':'0',  'width':'0', 'color':'rgba(0,0,0,1)'}; 
		//если нет тени
		if (shadow == 'none') {
			return emptyValue;
		//тень есть
		} else {
			//шаблое для поиска
			var pat = /^(rgba?\([^\)]+\))\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s?([a-z]*)/igm;
			//результат
			var list = pat.exec(shadow);
			if (!list) return emptyValue;

			return {'type':list[6], 
					'offsetX':list[2],
					'offsetY':list[3],
					'radius':list[4], 
					'width':list[5], 
					'color':list[1]};
		}
	};

/**************************************************************************************/
	/**
	* Установить тень
	*/
	this.edit = function(elm) 
	{
		//тип
		var type = $(".valueShadowType[value='inset']").attr("chosen") ? 'inset' : '';
		//цвет
		var color = Color.getRgbaFromMenu($(".valueShadowColor"));
		// смещение x
		var offsetX = $('.valueShadowOffsetX').val();
		// смещение y
		var offsetY = $('.valueShadowOffsetY').val();
		//радиус
		var radius = $('.valueShadowRadius').val();
		//ширина
		var width = $('.valueShadowWidth').val();

		if (!color) color = "#000000";

		//формируем shadow
		var shadow = type+' '+offsetX+'px '+offsetY+'px '+radius+'px '+width+'px '+color;
		elm.css({"box-shadow":shadow});
	};

/*********************************************************************************/

} //end class









/**
* 
*
*
*/
StyleMenuFilter.prototype = StyleMenu;
var StyleMenuFilter = new StyleMenuFilter();
function StyleMenuFilter() {

	this.listProperty = {
		"blur":{"unit":"px", "maxval":"50"},
		"brightness":{"minval":"1", "maxval":"10"},
		"contrast":{"minval":"1","maxval":"50"},
		"grayscale":{"maxval":"1"},
		"hue-rotate":{"unit":"deg", "maxval":"360"},
		"invert":{"maxval":"10"},
		"opacity":{"maxval":"10"},
		"saturate":{"maxval":"50"},
		"sepia":{"maxval":"1"},
	}

	this.getUnit = function(typeV)
	{
		var unitV = this.listProperty[typeV]["unit"];
		if (!unitV) unitV = "";

		return unitV;
	}

	this.valueExt = function(typeV)
	{
		var propV = this.listProperty[typeV];
		var minval = propV["minval"];
		if (!minval) minval = 0;
		var maxval = propV["maxval"];
		if (!maxval) maxval = 100;

		$(".valueStyleFilterValue")
				.attr("maxval", maxval)
				.attr("minval-positive", minval);
	}

/*********************************************************************************/

	this.set = function(elm)
	{
		var list = this.getProperty(elm.css("filter"));
		var typeV = list["filter-type"];
		var valueV = list["filter-value"];
		
		Select.set($(".selectStyleVilterType"), typeV);
		var inputObj = $('.valueStyleFilterValue');
		inputObj.val(valueV);
		this.valueExt(typeV);
		StyleMenu.setScroll(inputObj);
	}

	this.getProperty = function(filterV)
	{
		var pat = /^([\w\-]+)\(([^)]+)\)/gim;
		var list = pat.exec(filterV);
		if (!list) list = {"1":"blur", "2":"0px"};

		var typeV = list[1];
		var valueV = list[2];

		if (typeV == "invert" || typeV == "opacity") {
			valueV = valueV * 10;
		}

		var itemV = {
			'filter-type':typeV, 
			'filter-value':valueV,
		};

		return itemV;
	}

/*********************************************************************************/
	this.editType = function(elm, typeV, elmEvent)
	{
		var inputValueV = $(".valueStyleFilterValue");
		inputValueV.val("1");
		this.valueExt(typeV);
		StyleMenu.setScroll(inputValueV);
		
		this.edit(elm, typeV, elmEvent);
	}


	this.edit = function(elm, value, elmEvent)
	{
		var typeV = Select.get($(".selectStyleVilterType"));
		$(".valueStyleFilterType").val(typeV);

		var numV = $(".valueStyleFilterValue").val();
		if (typeV == "invert" || typeV == "opacity") {
			numV = numV / 10;
		}

		var unitV = this.getUnit(typeV);
		var filterValueV = typeV + "("+numV+unitV+")"; 
		elm.css("filter", filterValueV);
			
		this.set(elm);
	}

/********************************************************************************************/

} //end class

/**
* Фиксированые
*
*
*
*/
var StyleMenuFixed = new StyleMenuFixed();
function StyleMenuFixed() {
	/**
	* Ставит значение
	*
	* @see 	StyleMenu.set()
	*/	
	this.set = function(elm) {
		// заголовок
		this.setTitleRightMenu()
		// дополнительный класс
		this.setClassAdded(elm);
		// состояние
		this.setState(elm);
		// тип элемента
		this.setBasicElmType(elm);
	}
	
	/**
	* Установить название в правой панели
	*
	* @see 	 	ElementStyleController.noteElement()  	при выборе нового элемента
	* @see 		EditorController.setEventNavMenu() 		навигация правого блока
	*/
	this.setTitleRightMenu = function()
	{
		var elm = Element.obj;
		// имя элемента, если его нет берем его тип
		var name = Element.data.type;
		
		//список значений
		var list = Element.data.title;

		// уникальное для элемента
		var uniqName = elm.attr("data-property-title-name");
		if (uniqName) var elmTitleName = uniqName;
		else var elmTitleName = list['name'];

		var uniqImg = elm.attr("data-property-title-img");
		if (uniqImg) var elmTitleImg = uniqImg;
		else var elmTitleImg = list['img'];

		//ставим текст
		$('.rightMenuTypeElm').html(elmTitleName).attr("data-elm-type", Element.data.type);
		//ставим картинку
		$('.rightMenuTypeElm').css('background-image', 'url(/img/editor/elements/'+elmTitleImg+')');
		
		//ставим кнопку
		if (list['type'] != 'none' ) {
			//имя кнопки
			$('.rightMenuTopButtonText').text(list['but_text']);
			//тип кнопки
			$('.rightMenuTopButton').attr('type', list['type']);
			
			//показываем кнопку 
			$('.rightMenuTopButton').css('display', 'block');
		} else {
			$('.rightMenuTopButton').css('display', 'none');
		}

		// убираем кнопки state, если не вкладка стили
		var isTabStyle = $(".rightMenuNavItem[type='style'][chosen='true']").length;
		if (!isTabStyle) $(".blockTypeState").css("display", "none");
	}

	/**
	* Ставим дополнительный класс
	*
	* @see 	this.set()
	* @see 	this.updateEditorClass()
	*/
	this.setClassAdded = function(elm)
	{
		var classAdded = Element.getClassAdded(elm);

		// если есть класс
		if (classAdded) {
			var addedDisplay = "block";
			var addedStatus = "true";
			var butAddDisplay = "none";
			var butDeleteDisplay = "block";
		} else {
			var addedDisplay = "none";
			var addedStatus = "false";
			var butAddDisplay = Element.data.no_added_class ? "none" : "block";
			var butDeleteDisplay = "none";
		}

		if (Element.data.no_added_class) {
			var butDeleteDisplay = "none";
		}

		// unique
		var classUnique = Element.getClassUnique();
		classUnique = /[^\.]+$/gim.exec(classUnique);
		var butClassUnique = $(".menuClassUnique");
		butClassUnique.text(classUnique[0]);

		// для added
		$(".menuClassAdded").text(classAdded)
							.css("display", addedDisplay);

		// статус для размера блоков
		$(".menuFixedItemClass").attr("added", addedStatus);
		
		// для кнопок
		$(".menuClassButAdd").css("display", butAddDisplay);
		$(".menuClassButDelete").css("display", butDeleteDisplay);

		
		var elm = Element.obj;
		if (elm.attr("class-unique")
				&& elm.attr("data-property-no-edit-class") != "true"
				&& !Element.data.no_edit_class) {
			var butClassUniqueTitle = Resource.hlp_modal_class_edit;
			butClassUnique.removeAttr("no-edit");
		} else {
			var butClassUniqueTitle = Resource.hlp_modal_class_no_edit;
			butClassUnique.attr("no-edit", "true");
		}
		butClassUnique.attr("label", butClassUniqueTitle);
	}

	/**
	* Ставит состояние
	*
	*
	*/
	this.setState = function(elm)
	{
		var panelObj = $(".selectElmState");
		var tabTypeV = $(".rightMenuNavItem[chosen='true']").attr("type");

		if (tabTypeV != "style" && tabTypeV != "site") {
			panelObj.addClass("displayNone");
			panelObj.removeAttr("style");
			return false;
		} else {
			panelObj.removeClass("displayNone");
		}

		var listOption = $(".selectElmState .option"); 
		listOption.filter("[value='focus']").css("display", "none");

		if (Element.data.is_state_chosen) {
			listOption.filter("[value='chosen']").css("display", "block");
		}

		if (elm.hasClass("input") || elm.hasClass("textarea")) {
			listOption.filter("[value='focus']").css("display", "block");
		}	
	}

/***************************************************************************************/
	
	/**
	* Тип элемента
	*
	*
	*/
	this.setBasicElmType = function(elm)
	{
		if (elm.hasClass("site")) {
			ElementBasicType.setSiteSelectDefault()
		} else if (ElementBasicType.isElmBasicType(elm)) {
			var value = ElementBasicType.getCurrentType();
			ElementBasicType.setVisibleBlockMenu(elm, value);
		}
	}

	/**
	* Установка 
	*
	*
	*/
	this.editBasicElmType = function(elm, value)
	{
		if (value == "all") var newElm = $(".content .site");
		else var newElm = ElementBasicType.getObjByType(value);

		Element.setData(newElm);
		Select.set($(".selectElmState"), "static");

		StyleMenu.set();
		// показываем или убираем в блоки меню 
		ElementBasicType.setVisibleBlockMenu(elm, value);
	}

/*********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/	
	this.setEvent = function()
	{
		// добавление
		this.setEventAddClass();
		// удаление
		this.setEventDeleteClass();
		// изменение
		this.setEventEditClass();
	}

	this.setStyleEditClass = function()
	{
		StyleMenu.set();
		ElementSetting.set();
		ElementWidget.set();
	}

	/**
	* Добавление 
 	*
	* @see 	this.setEvent()
	*/
	this.setEventAddClass = function()
	{
		var elmBlock = $(".menuListClassBlock");
		var elmInput = $(".valuleMenuClassAdded");
		var obj = this;
		
		$(".menuClassButAdd").off("mousedown");
		$(".menuClassButAdd").on("mousedown", function() {
			
			// показываем input
			elmBlock.css("display", "none");
			elmInput.css("display", "block").val("").focus();
			
			// ставим событие
			elmInput.off("change focusout");
			elmInput.on("change focusout", function(event) {

				// добавляем класс
				var newClassAdded = elmInput.val().trim();
				newClassAdded = Element.clearClass(newClassAdded);
				var newClassAddedClearing = newClassAdded.replace(/[0-9\-]+$/gim, '');

				if (!newClassAdded || newClassAdded == 'NaN') {
					obj.closePanelClassAdded();
					elmInput.off("change focusout");
					return false;
				} else if (ElementBasic.isInterdictedClass(newClassAdded)) {
					newClassAdded = Element.getNewClassUnique(newClassAddedClearing);
				}

				var isExists = false;
				if (newClassAdded) {
					isExists = $("."+newClassAdded).not("[class-added='"+newClassAdded+"']").length;
				}

				// если такой класс есть такой класс уникальный
				if (isExists) {
					newClassAdded = Element.getNewClassUnique(newClassAddedClearing);
				}

				// атрибуты анимации
				var originElmV = $("."+newClassAdded);
				Element.addStdAddedClass(originElmV, Element.obj);

				// закрываем панель
				obj.closePanelClassAdded();

				// обновляем стили
				obj.setStyleEditClass();
				
				// ставим класс 
				Element.addClassAdded(newClassAdded);
				// ставим значение в редакторе
				obj.updateEditorClass();

				elmInput.off("change focusout");

				// ставим стили в панели
				obj.afterManipulationClass();

				History.record();

				return false;
			});

			return false;
		});
	}

	/**
	* Закрытие панели с дополнительным классом
	*
	* @see 	this.setEventAddClass()
	* @see 	Editor.resetFocus()
	*/
	this.closePanelClassAdded = function()
	{
		$(".menuListClassBlock").css("display", "block");
		$(".valuleMenuClassAdded").css("display", "none");
	}

	/**
	* Обновляет хначение в редакторе
	*
	* @see 	this.setEventAdd()
	*/
	this.updateEditorClass = function()
	{
		// ставим значение в меню
		this.setClassAdded();	
		// строим вложеность
		PageStruct.build();
		PageStruct.buildNested();
	}
/*********************************************************************************************/

	/**
	* Удаление 
 	*
	* @see 	this.setEvent()
	*/
	this.setEventDeleteClass = function()
	{
		var obj = this;
		$(".menuClassButDelete").off("mousedown");
		$(".menuClassButDelete").on("mousedown", function() {
			// удаляем класс
			Element.removeClassAdded();
			// ставим значение в редакторе
			obj.updateEditorClass();
			// ставим значение в меню
			// обновляем стили
			obj.setStyleEditClass();

			// фиксируем историю
			History.record();

			// ставим стили в панели
			obj.afterManipulationClass();
		});
	}

/*******************************************************************************************/
	
	/**
	* Изменение
	*
	*
	*/
	this.setEventEditClass = function()
	{
		var obj = this;
		var listClassObj = $(".menuFixedClass");
		$(".menuFixedClass").off("dblclick");
		$(".menuFixedClass").on("dblclick", function() {
			var classBlockObj = $(this);

			if (classBlockObj.attr("no-edit")) return false;

			var oldClass = classBlockObj.text();
			var content = obj.getContentEditClass(oldClass);
			
			Modal.create({"id":"modalEditClass", "content":content, "width":400, "top":100});
			SpecialInput.setEventOnlyEng($("#modalEditClass .valueNewClass"));
			
			obj.editClass(classBlockObj, oldClass);
			return false;
		});
	}

	/**
	* Отдает содержимое для модального - изменить класс
	*
	*
	* @see 	this.setEventEditClass()
	*/
	this.getContentEditClass = function(oldClass)
	{
		var content = '\
					<div class="labelEditClass">\
						'+Resource.hlp_modal_class_edit_label+'\
					</div>\
					<input type="text" class="valueNewClass" value="'+oldClass+'" only-eng="true"/>\
					<div class="editClassAllClassWrap">\
						<input type="checkbox" checked class="valueEditClassAllClass" />\
						<div class="editClassAllClassLabel">'+Resource.hlp_modal_class_edit_all_class+'</div>\
						<div class="clear"></div>\
					</div>\
					<div class="listButEditClass">\
						<div class="butBlock butCancel">'+Resource.main_modal_but_cancel+'</div>\
						<div class="butOk butEditClass">'+Resource.main_modal_but_edit+'</div>\
						<div class="clear"></div>\
					</div>';

		return content;
	}

	/**
	* Изменить класс
	*
	* @see 	this.setEventEditClass();
	*/
	this.editClass = function(classBlockObj, oldClass)
	{
		var obj = this;

		$(".butEditClass").off("mousedown");
		$(".butEditClass").on("mousedown", function() {
			var typeClass = classBlockObj.attr("type");
			var newClass = $("#modalEditClass .valueNewClass").val();
			if (!newClass) return false;
			var isAllElmEdit = $("#modalEditClass .valueEditClassAllClass").prop("checked");
			Modal.delete();

			var elm = Element.obj;
			newClass = Element.clearClass(newClass);
			newClassNoNumber = newClass.replace(/[0-9\-]+$/gim, '');

			// нельзя его добавлять
			if (!ElementBasic.isAddThisClass(newClass)) {
				newClass = Element.getNewClassUnique(newClassNoNumber);
			} 

			// unique, а класс есть как added
			var isExistsAddedClass = $(".element[class-added='"+newClass+"'").length;
			if (isExistsAddedClass && typeClass == "unique") {
				newClass = Element.getNewClassUnique(newClassNoNumber);
			}

			// added, а класс есть как unique
			var isExistsUniqueClass = $(".element[class-unique='"+newClass+"'").length;
			if (isExistsUniqueClass && typeClass != "unique") {
				newClass = Element.getNewClassAdded(elm, newClassNoNumber);
			}

			// если разные типы элементов, то нельзя
			var newObjV = $("."+newClass);
			if (newObjV.length && elm.attr("elm-type") != newObjV.attr("elm-type")) {
				// только для уникального
				if (typeClass == "unique") {
					newClass = Element.getNewClassUnique(newClassNoNumber);
				} else {
					// newClass = Element.getNewClassAdded(elm, newClassNoNumber);
				}
			}

			
			// добавляем классу префикс
			newClass = Element.addClassPrefix(newClass);

			if (oldClass != newClass) {
				var elmEditObj = false;
				// если не выбран что, не все, то изменяем только у текущего элемента 
				if (!isAllElmEdit) {
					elmEditObj = Element.obj;
				}

				// атрибуты анимации
				var originElmV = $("."+newClass);
				Element.addStdAddedClass(originElmV, elm);

				// изменяем в стиля класс
				ElementCss.editClass(typeClass, oldClass, newClass, elmEditObj);
				// ставим на кнопки новый класс
				classBlockObj.text(newClass);

				

				// удаляем класс
				elm.addClass(oldClass);
				ElementCss.deleteClass(oldClass, elm);
				elm.removeClass(oldClass);

				// обновляем стили
				obj.setStyleEditClass();
			}

			obj.afterManipulationClass();

			History.record();

			return false;
		});
	}

	/**
	* Отдает список стандартных классов
	*
	* @see 	this.editClass()
	*/
	this.getListStandartClass = function(newClass)
	{
		var elmType = Element.data.type;
		var listStandartClass = $("."+newClass)
								.not("[class-unique='"+newClass+"'][elm-type='"+elmType+"']")
								.not("[class-added='"+newClass+"'][elm-type='"+elmType+"']")

		return listStandartClass;
	}


	/**
	* Манипуляция после изменения
	*
	* @see 	this.setEventAddClass()
	* @see 	this.setEventDeleteClass()
	* @see 	this.editClass()
	*/
	this.afterManipulationClass = function()
	{
		// с отяжкой
		setTimeout(function() {
			// строим вложеность
			PageStruct.build();
			PageStruct.buildNested();
			// ставим стили
			StyleMenu.set();
		}, 500);
	}

/************************************************************************************************/
}//end class

/**
* Фон элемента
*
*
*/
StyleMenuBg.prototype = StyleMenu;
var StyleMenuBg = new StyleMenuBg();
function StyleMenuBg() {	
	/**
	* Установить 
	*
	* @see 	parent
	*/
	this.set = function(elm, isSetScroll)
	{
		// получаем тип
		var typeBg = this.getTypeBg(elm);

		// убираем блоки
		$(".menuBgType").css("display", "none");
		//показываем блок
		$(".menuBgType[type='"+typeBg+"']").css("display", "block");
		// выделяем текущий тип
		Select.set($(".selectBgType"), typeBg);

		// устанавливам значение
		if (typeBg == "gradient") this.setGradient(elm); // градиент
		else if (typeBg == "video") this.setVideo(elm);
		else this.setStandart(elm); // стандартный

		if (isSetScroll && typeBg == "image") {
			StyleMenu.setMenuColor($(".valueBgColor"));
			StyleMenu.setScroll();
		} 

		// видео фон можно только у секции и блока
		var optionVideoDisplay = elm.hasClass("section") ? "block" : "none";
		$(".bgTypeSelect .option[value='video']").css("display", optionVideoDisplay);
	}

	/**
	* Узнает градиент или нет
	*
	*/
	this.getTypeBg = function(elm)
	{
		var value = elm.css("background-image");
		var isGradient = value.match(/^linear-gradient/ig) ? true : false;
		
		if (isGradient) var typeBg = "gradient";
		else if (elm.find("> .bg-video").length) var typeBg = "video";
		else var typeBg = "image";

		if (typeBg == "video" && elm.hasClass("section") && !Screen.isDesktop()) var typeBg = "image";

		return typeBg;
	}
/**************************************************************************************/
	/**
	* Стандартный тип
	*
	* @uses 	this.bgColor() 			устанавливаем цвет
	* @uses 	this.bgImage()			картинка
	* @uses 	this.bgPosition() 		позиция
	* @uses 	this.bgRepeat() 		повторение
	* @see 		this.bg()
	*/
	this.setStandart = function(elm) {
		//устанавливаем цвет
		this.setColor(elm);
		// маска
		this.setImageMask(elm);
		// паралакс
		this.setParalax(elm);
		// 
		this.setBgImage(elm);
	}

/*********************************************************************************************/
	/**
	* Устанавливаем цвет
	*
	* @uses 	this.getColorFromRgba()-parent 		получить цвет из rgba
	* @see 		this.bgStandart()
	*/
	this.setColor = function(elm)
	{
		if (elm.hasClass("site")) {
			var curElmClassV = elm.attr("elm-type");
			var colorRgba = ElementCss.getStyle("background-color", "style", elm);
		} else {
			var colorRgba = elm.css("background-color");
		}

		if (!colorRgba) colorRgba = "rgba(0, 0, 0, 0)";

		var elmEvent = $('.valueBgColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);
	}

	this.setImageMask = function(elm)
	{
		var displayValue = elm.hasClass("section") ? "block" : "none";
		$(".menuStyleBgImgMask").css("display", displayValue);
		if (displayValue == "block") {
			var colorRgba = elm.find("> .hlp-section-bg-mask").css("background-color");
			Color.setRgbaInMenu($(".valueBgImgMask"), colorRgba);
		}
	}

	/**
	* Ставит паралакс
	*
	* @see 		this.bgStandart()
	*/
	this.setParalax = function(elm)
	{
		var paralaxBlock = $(".menuParalax")

		paralaxBlock.css("display", "block");
		var paralaxSpeed = elm.attr("data-paralax");

		var bgAttchV = elm.css("background-attachment");
		var paralaxValue = bgAttchV == "fixed" ? "yes" : "no";
		$(".valueBgParalaxStatus .menuButValue").removeAttr("chosen")
									.filter("[value='"+paralaxValue+"']")
									.attr("chosen", "true");
		
		var paralaxSpeedObj = $(".menuParalaxSpeed");
		if (paralaxSpeed) {
			paralaxSpeedObj.css("display", "block");
			paralaxSpeed = parseFloat(paralaxSpeed) * 100;
			$(".valueBgParalaxSpeed").val(paralaxSpeed);
		} else {
			paralaxSpeedObj.css("display", "none");
		}
	} 

/***********************************************************************************************/
/********************************************************************************************/
	/**
	* Ставит значения в меню
	*
	* @see 		this.showModal()
	*/
	this.setBgImage = function(elmBg)
	{
		if (!elmBg) elmBg = Element.getObj();

		var bgImage = elmBg.css("background-image");
		var bgPosition = elmBg.css("background-position");
		var bgRepeat = elmBg.css("background-repeat");
		var bgSize = elmBg.css("background-size");

		this.setImage(bgImage);
		this.setPosition(bgPosition);
		this.setRepeat(bgRepeat);
		this.setImageSize(bgSize);
	}


	/**
	* Устанавливаем картинку
	*
	* @see 	this.setBgImage()
	*/
	this.setImage = function(bgImage)
	{
		//ставим значение
		var imgName = this.getNameImgBySrc(bgImage);
		if (!imgName) imgName = "none";
		$('.valueBgImage').val(imgName);

		var src = bgImage.replace(/(^url\()|(\)$)|(["']+)/gim, '');
		if (src == "none") src = ""; 
		$(".menuBgImageSelf").attr("src", src);

		//если картинка есть ставим кнопку удалить
		var status = imgName ? true : false; 
		$('.butBgImageDelete').attr('status', status);
	}	

	/**
	* Делает активной
	*
	* @see 	this.bgImageSize()
	* @see 	this.valueBgImgSize()
	*/
	this.butSizeBgAct = function()
	{
		$(".butSetAutoSizeBg").removeAttr("status");
	}

	/**
	* Позиция bg-image - переводит проценты в строку
	*
	* @see	this.bgPosition() 	
	*/
	this.arrBgPosition = {	'0% 0%':'top left', 
							'50% 0%':'top center',
							'100% 0%':'top right',
							'0% 50%':'center left',
							'50% 50%':'center',
							'100% 50%':'center right',
							'0% 100%':'bottom left',
							'50% 100%':'bottom center',
							'100% 100%':'bottom right'}

	/**
	* Устанавливаем позицию фона
	*
	* @uses 	this.arrBgPosition()
	* @see 		this.setBgImage()
	* @see 		this.editPosition()
	* @see 	EditorConroller.setEventEditScreen()
	*/
	this.setPosition = function(bgPosition)
	{	
		// ставит значение визуально
		this.setPositionVisual(bgPosition); 
		// ставит значение в числах
		this.setPositionNumber(bgPosition);
	}

	/**
	* Ставит позицию визуадбно
	*
	* @see 	this.setPosition(), this.editPositionLeft(), this.editPositionTop()
	*/
	this.setPositionVisual = function(bgPosition)
	{
		$('.valueBgPosition').removeAttr('chosen');

		//получаем значение
		var bgPositionStr = this.arrBgPosition[bgPosition];
		if (!bgPositionStr) bgPositionStr = bgPosition;

		// bg_position = bg_position ? bg_position : 'top left';	
		var butPosition = $('.valueBgPosition[value="'+bgPositionStr+'"]').attr('chosen', 'true');
	}

	/**
	* Позиция - перевод строковое значение в числовое
	*
	*
	*/
	this.positionStrToNum = {
		"top" : "0%",
		"left" : "0%",
		"center" : "50%",
		"right" : "100%",
		"bottom" : "100%"
	};

	/**
	* Ставит значение в числах
	*
	* @see 	this.setPosition(), this.editPosition()
	*/
	this.setPositionNumber = function(bgPosition)
	{
		// ставим в значение в числах
		var listValue = bgPosition.split(" ");
		var posLeftN = listValue[0];	
		var posTopN = listValue[1];
		
		// если это строковое значение
		if (bgPosition == "center") var posLeft = "50%";
		else if (this.positionStrToNum[posLeftN]) var posTop = this.positionStrToNum[posLeftN];
		else var posLeft = posLeftN;

		if (bgPosition == "center") var posTop = "50%";
		else if (this.positionStrToNum[posTopN]) var posLeft = this.positionStrToNum[posTopN];
		else var posTop = posTopN;

		StyleUnit.setMenuProperty(Element.obj, "background-position-left", "", posLeft);
		StyleUnit.setMenuProperty(Element.obj, "background-position-top", "", posTop);
	}

	/**
	* Устанавливаем повторение фона
	*
	* @see 		this.setBgImage()
	*/
	this.setRepeat = function(bgRepeat)
	{
		// ставим значение
		$(".menuBgRepeat .menuButValue[value='"+bgRepeat+"']")
												.attr("chosen", "true");
	}

	/**
	* Размер фона
	* @see 	this.setBgImage()
	* @see 	EditorConroller.setEventEditScreen()
	*/
	this.setImageSize = function(bgSize) 
	{
		if (bgSize == "cover") bgSize = "full";

		// делаем кнопку активной
		this.butSizeBgAct();
		$(".scrollBgSize .scrollButton").css("left", 0); //ставим в ноль значение

		// ставим значения		
		StyleUnit.setMenuProperty(Element.obj, "background-size", "", bgSize);
	}

/**********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит видео фон
	*
	* @see 	this.set()
	*/
	this.setVideo = function(elm)
	{
		var elmVideoObj = elm.find("> .bg-video video");
		// картинка
		this.setVideoImg(elm, elmVideoObj);
		// видео
		this.setVideoMp4(elm, elmVideoObj);
		// затемнение
		this.setVideoOpacity(elm, elmVideoObj);
		// повтор
		this.setVideoLoop(elm, elmVideoObj);
		// паралакс
		this.setVideoParalax(elm);
		// src
		this.setVideoSrc(elm);
	}

	/**
	* Устанавливает картинку видео
	*
	* @see 	this.setVideo()
	*/
	this.setVideoImg = function(elm, elmVideoObj)
	{
		var videoImgName = elmVideoObj.attr("poster");
		if (videoImgName) videoImgName = videoImgName.replace(/\/user\/[\w]+\/[\w]+\/img\//, '');
		$(".valueBgVideoImage").val(videoImgName).parent().attr('title', videoImgName);
	}

	/**
	* Устанавливает само видео
	*
	* @see 	this.setVideo()
	*/
	this.setVideoMp4 = function(elm, elmVideoObj)
	{
		var videoName = elmVideoObj.find("source:first").attr("src");
		if (videoName) videoName = videoName.replace(/\/user\/[\w]+\/[\w]+\/file\//, '');
		$(".valueBgVideoMp4").val(videoName).parent().attr('title', videoName);
	}

	/**
	* Затемнение
	*
	* @see 	this.setVideo()
	*/
	this.setVideoOpacity = function(elm, elmVideoObj)
	{
		// var videoOpacityObj = elmVideoObj.parent().find(" > .bg-video-opacity");
		var videoOpacityObj = elm.find(".bg-video-opacity");
		var colorRgba = videoOpacityObj.css("background-color");
		var elmEvent = $('.valueVideoColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);		
	}

	/**
	* Повтор
	*
	* @see 	this.setVideo()
	*/
	this.setVideoLoop = function(elm, elmVideoObj)
	{
		var loopValue = elmVideoObj.attr("loop");
		var loopStatus = loopValue ? "yes" : "no"; 
		$(".menuBgVideoLoop .menuButValue").removeAttr("chosen")
									.filter("[value='"+loopStatus+"']")
									.attr("chosen", "true");
	}

	this.setVideoParalax = function(elm)
	{
		var paralaxBlockObj = $(".menuStyleItemBgVideoParalax");
		if (!elm.hasClass("section")) {
			paralaxBlockObj.css("display", "none");
			return false;
		} else {
			paralaxBlockObj.css("display", "block");
		}

		elm = elm.find("> .hlp-bg-video");
		var paralaxStatus = elm.hasClass("hlp-bg-video-paralax") ? "yes" : "no"; 
		$(".valueBgVideoParalaxStatus .menuButValueText[value='"+paralaxStatus+"']")
									.attr("chosen", "true");
	}

	this.editVideoParalaxStatus = function(elm, value)
	{
		elm = elm.find("> .hlp-bg-video");
		var elmSectionObj = elm.closest(".section");
		if (value == "yes") {
			elm.addClass("hlp-bg-video-paralax");
			elmSectionObj.addClass("hlp-section-bg-paralax");
		} else {
			elm.removeClass("hlp-bg-video-paralax");
			elmSectionObj.removeClass("hlp-section-bg-paralax");
		}
	}

	this.setVideoSrc = function(elm)
	{
		var videoSrc = elm.find("iframe").attr("src");
		if (videoSrc && videoSrc.match(/vimeo/gim)) {
			videoSrc = /\/video\/[^\?]+/gim.exec(videoSrc);
			videoSrc = videoSrc[0].replace(/^\/video\//gim, '');
			videoSrc = 'https://vimeo.com/' + videoSrc;
		} else if (videoSrc) {
			videoSrc = /\/embed\/[^\?]+/gim.exec(videoSrc);
			videoSrc = videoSrc[0].replace(/^\/embed\//gim, '');
			videoSrc = 'https://www.youtube.com/watch?v=' + videoSrc;
		}

		$(".valueBgVideoSrc").val(videoSrc);
	}

	this.editVideoSrc = function(elm, videoSrc)
	{
		var isVimeo = videoSrc.match(/vimeo/gim);
		if (isVimeo) {
			Notification.error("С Vimeo нельзя добавить видео");
			return false;
			// var videoIdV = /vimeo\.com\/[^\?]*/gim.exec(videoSrc);
			// videoIdV = videoIdV[0].replace(/^vimeo.com\//gim, '');
			// videoSrc = 'https://player.vimeo.com/video/'+videoIdV+'?title=false&byline=false&portrait=false&loop=true';
		} else {
			var videoIdV = /\/watch\?v=[^&]*/gim.exec(videoSrc);
			if (videoIdV) videoIdV = videoIdV[0].replace(/^\/watch\?v=/gim, '');
			videoSrc = 'http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&controls=0&loop=1&mute=0&playlist='+videoIdV;
		}

		var elmBgV = elm.find("> .hlp-bg-video")
		var contentV = elmBgV.find("> .hlp-bg-video-content");
		contentV.find("> iframe").attr("src", videoSrc);

		var typeV = isVimeo ? "vimeo" : "youtube";
		elmBgV.attr("data-service", typeV);

		if (!isVimeo) {
			var imgObj = contentV.find("> .hlp-bg-video-image");
			if (!imgObj.length) {
				contentV.find(".hlp-bg-video-opacity").after('<img src="" alt="" class="hlp-bg-video-image" />');
				imgObj = contentV.find("> .hlp-bg-video-image");
			}
			var videoImgSrcV = 'url(\/\/img.youtube.com/vi/'+videoIdV+'/maxresdefault.jpg)';
			imgObj.css("background-image", videoImgSrcV);
		}

		return true;
	}

/**********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит градиент
	*
	* @see 	this.set()
	*/
	this.setGradient = function(elm)
	{
		// части градиента
		var listPart = this.getListPartGradient(elm);
		
		// ставим значения
		$(".valueBgGradientType[value='"+listPart[1]+"']").attr("chosen", "true");
		$(".valueBgGradientBasic, .valueBgGradient1").val(listPart[2]);
		$(".valueBgGradient2").val(listPart[3]);

		// ставим opacity
		var opacity1 = /rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,?\s*([0-9\.]+)/gim.exec(listPart[2].trim());
		opacity1 = !opacity1 ? 100 : parseInt(opacity1[1] * 100);
		$(".valueGradiend1Opacity, .valueGradiendBOpacity").val(opacity1);

		var opacity2 = /rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,?\s*([0-9\.]+)/gim.exec(listPart[3].trim());
		opacity2 = !opacity2 ? 100 : parseInt(opacity2[1] * 100);
		$(".valueGradiend2Opacity").val(opacity2);

		// ставим цвет кнопкам
		this.setButtonColorGradient(); 
	} 									
	
	/**
	* Отдает элементы градиента
	* @see 	this.setGradient()
	*/
	this.getListPartGradient = function(elm)
	{
		var gradient = elm.css("background-image");
		// setRgbaInMenu
		// var pattern = /linear-gradient\(([^,]*),?\s?(rgba?\([^\)]+\)),\s(rgba?\([^\)]+\))\)/gi;
		var pattern = /linear-gradient\(([^,]*),?\s?(rgba?\([^\)]+\)),\s(rgba?\([^\)]+\))\)/gi;
		var listPart = pattern.exec(gradient);
		// console.log(listPart)
		if (!listPart[1]) listPart[1] = "to bottom";
		

		return listPart;
	}

	/**
	* Ставит цвет кнопкам градиента
	* @see 	this.setGradient(), this.editGradient()
	*/
	this.setButtonColorGradient = function()
	{
		var listInput = $('.valueBgGradientBasic, .valueBgGradient1, .valueBgGradient2');
		this.setMenuColor(listInput);
	}

/**************************************************************************************************/
/********************************************************************************************/
/***изменение***********************************************************************************/
	/**
	* Изменить тип
	* @use 	this.setMenuColor() - parent
	*/	
	this.editType = function(elm, value)
	{
		// убираем все блоки
		$(".menuBgType").css("display", "none");
		// показываем блок
		$(".menuBgType[type='"+value+"']").css("display", "block");
		// убираем img
		var listClear = ["background", "background-image", "background-position", "background-repeat", "background-size"];
		ElementCss.clear(listClear, "style");
		// убираем фон  видео
		var bgVideo = elm.find("> .bg-video");
		if (bgVideo.length) bgVideo.remove();
		// убираем паралакс
		elm.removeAttr("data-paralax");
		// убираем маску
		elm.find("> .hlp-section-bg-mask").remove();

		// градиент
		if (value == "gradient") this.setTypeGradient(elm);
		else if (value == "video") this.setTypeVideo(elm);
		else this.setTypeImage(elm, bgVideo);

		// устанавливаем значение bg
		this.set(elm);
	}

	/**
	* Изменяет тип градиент
	*
	* @see 	this.editType()
	*/
	this.setTypeGradient = function(elm)
	{
		// ставим цвет фона как основной цвет градиента
		var colorB =  $(".valueBgColor").val();
		$(".valueBgGradientBasic, .valueBgGradient1").val(colorB);
		// меняем направления градиента
		$(".valueBgGradientType").removeAttr("chosen")
									.filter("[value='to top']")
									.attr("chosen", "true");
		// меняем цвет
		this.editGradientBasic(elm, colorB);
	}	

	/**
	* Изменяет тип видео
	*
	* @see 	this.editType()
	*/
	this.setTypeVideo = function(elm)
	{
		var videoIdV = 'uNCr7NdOJgw';
		var bgVideoHtml = '\
		<div class="bg-video hlp-bg-video">\
			<div class="hlp-bg-video-content">\
				<div class="bg-video-opacity hlp-bg-video-opacity"></div>\
				<div class="hlp-bg-video-image" style="background-image:url(\/\/img.youtube.com/vi/'+videoIdV+'/maxresdefault.jpg);"></div>\
				<iframe src="http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&controls=0&loop=1&playlist='+videoIdV+'" frameborder="0"></iframe>\
			</div>\
		</div>';

		// 
		elm.append(bgVideoHtml);

		// ставим цвет если перейдет
		$(".valueBgGradientBasic").val($('.valueBgColor').val());
		this.setVideo(elm);

		// this.setParalax(elm);
		// ставим значение scroll 
		StyleMenu.setScroll($(".valueVideoOpacity"));
	}	

	/**
	* Изменяет тип картику
	*
	* @see 	this.editType()
	*/
	this.setTypeImage = function(elm)
	{
		this.setDefaultBgImage(elm);

		// устанавливаем фон
		this.setStandart(elm);

		// ставим основной цвет градиента, как цвет фона
		var gradientColor1 = $(".valueBgGradientBasic").val();
		elm.css("background-color", '#'+gradientColor1);
		var inputColorObj = $(".valueBgColor");
		inputColorObj.val(gradientColor1);
		StyleMenu.setMenuColor(inputColorObj);
	}

	/**
	* Установка bg image по умолчанию
	*
	* @see 	this.setTypeImage()
	*/
	this.setDefaultBgImage = function(elm)
	{
		// потому что устанавливается у basic type 
		if (elm.hasClass("button")) {
			elm.css({"background-image":"none"});
			ElementCss.set(false, elm, "desktop");
		}
	}


/************************************************************************************/
	/*градиент*/
	/*
	* Базовый градиент
	*
	* @see 		StyleMenu.edit() 
	* @see 		this.editType()
	*/
	this.editGradientBasic = function(elm)
	{		
		var colorB = $(".valueBgGradientBasic").css("background-color");

		//получаем второй цвет на основе базового
		var color2 = this.getGradient2OnBasic(colorB);
		//ставим второй цвет
		$('.valueBgGradient2').val(color2);

		//устанавливаем градиент элементу
		this.editGradient(elm);
	};
	/**
	* Отдает второй цвет градиента на основе базового
	*
	* @param 	string 		colorB-базовый элемент
	* 
	* @see 		this.valueBgGradientBasic()
	* @todo 	переделать полностью
	*/
	this.getGradient2OnBasic = function(color) 
	{
		//переводим цвет в формат rgb
		var old_color = Color.getRGBHex(color);

		//разбиваем на цвета (r g b)
		list = old_color.split(',');
		list[0] = parseInt(list[0]);
		list[1] = parseInt(list[1]);
		list[2] = parseInt(list[2]);
		//узнаем какой цвет основной
		if (list[0] > list[1]) {
			if (list[0] > list[2]) {
				t = 'r';
				list[0] = this.clearNumber(list[0]*0.5);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.1);
			} else {
				t = 'b';
				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.5);
			}
		} else {
			if (list[1] > list[2]) {
				t = 'g';
				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.5);
				list[2] = this.clearNumber(list[2]*0.1);
			} else {
 				t = 'b';
 				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.5);
			}
		}

		//формируем цвет rgb
		new_color = 'rgb('+list[0]+' ,'+list[1]+' ,'+list[2]+')';
		
		//переводим в формат hex и отдаем результат
		return Color.getHexRGB(new_color);
	}
/***************************************/
	/**
	* Установить градиент
	*
	* @uses 	this.setMenuColor()-parent
	* @see 		this.valueBgGradientBasic() 
	*/
	this.editGradient = function(elm)
	{
		var parentElmEvent = $(".menuGradient");

		//тип градиента 
		var type = $('.valueBgGradientType[chosen="true"]').val();
		var gradientStatus =  $(".gradientColorToggle").attr("type");
		//цвет 1
		var color1Selector = gradientStatus == "basic"
											? "valueBgGradientBasic" : "valueBgGradient1";
		
		var inputObj1 = parentElmEvent.find("."+color1Selector);
		var color1 = Color.getRgbaFromMenu(inputObj1, true);
		//цвет 2
		var inputObj2 = parentElmEvent.find(".valueBgGradient2");
		var color2 = Color.getRgbaFromMenu(inputObj2, true);
		// //формируем gradient
		var gradient = 'linear-gradient('+type+', '+color1+', '+color2+')';
		
		//устанавливаем градиент
		this.setStyleBg(elm, gradient);

		//ставим значения
		$(".valueBgGradientBasic, .valueBgGradient1").val(color1);
		// ставим opacity
		var inputOpacityB = $(".valueGradiendBOpacity");
		var inputOpacity1 = $(".valueGradiend1Opacity");
		if (gradientStatus == "basic") inputOpacity1.val(inputOpacityB.val());
		else inputOpacityB.val(inputOpacity1.val());

		//изменяем цвет кнопок
		this.setButtonColorGradient();
	}

	/**
	* Ставит значение bg
	*
	* @see 	this.editGradient() 
	*/
	this.setStyleBg = function(elm, fullBg)
	{
		var listProperty = {
			"background":fullBg,
			"background-color":elm.css("background-color")
		}
		
		// удаляем чтобы цвет всегда был после baground
		ElementCss.clear("background-color", "style");
		// ставим значение
		ElementCss.set("style", elm, "desktop", listProperty);
	}

/*******************************************************************************************/
	/**
	* Затемнение bg video
	*/
	this.editVideoOpacity = function(elm, opacityValue)
	{
		// opacityValue = opacityValue / 100;
		// var bgColorValue = "rgba(0,0,0,"+opacityValue+")";

		var bgColorValue = Color.getRgbaFromMenu($(".valueVideoColor"));
		var elmBg = elm.find(".bg-video .hlp-bg-video-opacity");
		elmBg.css("background-color", bgColorValue);
		ElementCss.set("style", elmBg);
	}

	/**
	* повтор
	*/
	this.editVideoLoop = function(elm, videoLoop)
	{
		var elmVideoObj = elm.find("> .bg-video video");
		if (videoLoop == "yes") elmVideoObj.attr("loop", "loop");
		else elmVideoObj.removeAttr("loop");
	} 
/************************************************************************************************/	
/*********************************************************************************************/
	/*изменить цвет*/
	/**
	* цвет
	*
	* @uses 	this.setColorRgba() 		установить элементу цвет rgba	
	* @see 		this.valueBgGradientBasic()
	*/ 
	this.editColor = function(elm, value) 
	{
		// если opacity 0
		var elmOpacity = $(".valueBgOpacity");
		var valueOpacity = parseInt(elmOpacity.val());
		if (valueOpacity == 0) {
			elmOpacity.val(100);
			StyleMenu.setScroll(elmOpacity); 
		}
		
		// ставим значение
		this.setColorRgba(elm);
	};

	/**
	* Прозрачночть фона
	*
	*/
	this.editOpacity = function(elm, value) 
	{
		this.setColorRgba(elm);
	};
	
	/**
	* Устанавливает цвет элементу в формате rgba
	*
	*
	* @uses 	Color.getRGBHex()-parent 	преобразовать цвет в rgb
	* @see 		this.valueBgColor()
	* @see 		this.valueBgOpacity() 
	* @see 		this.valueBgGradientBasic()
	*/
	this.setColorRgba = function(elm)
	{
		var colorRgba = Color.getRgbaFromMenu($(".valueBgColor"));
		
		ElementCss.set("style", elm, false, {"background-color":colorRgba});
	}

	/**
	* Изменяем статус паралакса
	*
	*/
	this.editParalaxStatus = function(elm, value)
	{
		var paralaxSpeedObj = $(".menuParalaxSpeed");
	
		if (value == "yes") {
			elm.css("background-attachment", "fixed");

			paralaxSpeedObj.css("display", "block");
			$(".valueBgParalaxSpeed").val(100);
			StyleMenu.setScroll();
		} else {
			elm.css("background-attachment", "scroll");
		}
	}

		
	/**
	* У изображение маска
	*
	*/	
	this.editImageMask = function(elm, value)
	{
		var elmBgMaskObj = elm.find("> .hlp-section-bg-mask");
		var valueRgba = Color.getRgbaFromMenu($(".valueBgImgMask"));
		
		if (valueRgba == 'transparent' && Screen.isDesktop()) {
			elmBgMaskObj.remove();
			return false;
		} 

		if (!elmBgMaskObj.length) {
			elm.append('<div class="hlp-section-bg-mask"></div>');
			elmBgMaskObj = elm.find("> .hlp-section-bg-mask");
		}

		elmBgMaskObj.css("background-color", valueRgba);
		ElementCss.set("style", elmBgMaskObj);
	}

/***bg img****************************************************************************************/
	/**
	* Отдает src элемента
	* 
	* @see 	this.editImage()	
	*/
	this.getCurentEditingBgSrc = function()
	{
		var src = $(".menuBgImageSelf").attr("src");
		src = src.replace(/(url\()|(\))+/gim, '')
					.replace(/https?:\/\/[^\/]+/gim, '')
					.replace(/["']+/gim, '');

		return src;
	}
	
	/**
	* Изменить картинку
	*
	* @see 	EditElementImage.save()
	*/
	this.editImage = function(elm, value)
	{
		if (value && value != "none") {
			var host = window.location.host;
			var src = "url("+value+")";
		} else {
			var src = "none";
		}

		var name  = src.match(/[^\/]+$/);
		if (name) name = name[0].replace(/\)/, "");
		
		// ставим имя
		$(".valueBgImage").val(name);
		// ставим стили
		elm.css("background-image", src);
		// для секции ставим cover
		if (elm.hasClass("section") && !ElementCss.getStyle("background-size")) {
			elm.css({"background-size":"cover", "background-position":"center top"});
		}

		ElementCss.set();
		this.setBgImage(elm);
	}

/***************************************************************************************/
	/**
	* Позиция
	*/
	this.editPosition = function(elm, value)
	{
		if (value == "center") {
			var top = 50;
			var left = 50;
		} else {
			var listVal = value.split(" ");
			for (var side in listVal) {
				var sideVal = listVal[side];
				if (sideVal == "top" || sideVal == "left") sideVal = 0;
				else if (sideVal == "center") sideVal = 50;
				else if (sideVal == "bottom" || sideVal == "right") sideVal = 100;
				
				if (side == 1) var left = sideVal;
				else var top = sideVal; 
			}	
		}
		
		$(".valueBgPositionTop").val(top);
		$(".valueBgPositionLeft").val(left);
		StyleUnit.setUnitMenu("background-position-top", "%");
		StyleUnit.setUnitMenu("background-position-left", "%");

		// ставим значение
		elm.css("background-position", left+"% "+top+"%");
		this.editPositionNumber(elm, value);
	}

	/**
	* Позиция вверх
	*
	*/
	this.editPositionSide = function(elm, value) 
	{
		// ставим значение
		var top = $(".valueBgPositionTop").val();
		var left = $(".valueBgPositionLeft").val();
		// var value = left+"% "+top+"%";
		var unitTop = StyleUnit.getUnitMenu("background-position-top");
		var unitLeft = StyleUnit.getUnitMenu("background-position-left");
		value = left+unitLeft+" "+top+unitTop;
		// ставим значение
		elm.css("background-position", value);
		// console.log(value)
		this.editPositionNumber(elm, value);
	}

	/**
	* Изменяем позицию в числах
	*
	*/
	this.editPositionNumber = function(elm, value)
	{
		elm.css("background-position", value);
		// устанавливаем в визуальном виде
		this.setPositionVisual(value);
	}

/**************************************************************************************************/

	/**
	* Размер
	*
	* @see 	this.setFullBg()
	*/
	this.editSize = function(elm, value)
	{
		if (value == "full") value = "cover";
		else if (value != "auto") value += StyleUnit.getUnitMenu("background-size");
		elm.css("background-size", value);
	}

	/**
	* Повторение
	*/
	this.editRepeat = function(elm, value)
	{
		// если на всю ширину, то ставим размер auto, а то он не будет работать
		if (elm.css("background-size") == "cover") {
			elm.css("background-repeat", "auto");
			$(".valueBgImgSize").val("auto");
		}

		elm.css("background-repeat", value);
	}

	/**
	* Получить имя картинки по src
	* @see 	this.()
	*/
	this.getNameImgBySrc = function(src)
	{
		var name = '';
		if (src && src != "none") {
			name = /([^\/]+)\)$/ig.exec(src);
			if (name)  name = name[1];

			if (name) name = name.replace(/["']/gim, '');
		}

		if (!name) name = "none";

		return name;
	}

/******************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/	
	this.setEvent = function()
	{
		//кнопка изменение bg-image
		this.setEventBgImage(); 
		//кнопка изменение цвета bg
		this.setEventBgColor();
		// кнопка размер bg 
		this.setEventBgSize();

		// видео фон
		this.setEventBgVideo();
		// servideo
		this.setEventVideoSrc();
	}

	/**
	* События для bg-image
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgImage = function()
	{
		var obj = this;
		/**
		* изменение
		* @uses 	elementImage.edit_bg() 	вызываем модальное окно для изменения
		*/
		$('.butBgImageChange').off('mousedown');
		$('.butBgImageChange').on('mousedown', function() {
			var params = {
				'operation':'edit_bg', 
				'src': obj.getCurentEditingBgSrc()
			};

			EditElementImage.edit(params);
		});

		//удаление
		$('.butBgImageDelete').off('mousedown');
		$('.butBgImageDelete').on('mousedown', function() {
			//делаем не активной кнопку
			$('.butBgImageDelete').attr('status', 'false');

			var elm = Element.getObj();
			elm.css("background-image", "none");
			obj.setBgImage(elm);
			ElementCss.set();
			History.record();
		});
	}

	/**
	* Изменение цвета bg
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgColor = function()
	{
		$(".colorpickerField").off("mouseup");
		$(".colorpickerField").on("mouseup", function() {
			StyleMenu.setVariablesColorPicker($(this));
		});
	}

	/**
	* Изменение размера
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgSize = function()
	{
		$(".butSetAutoSizeBg").off("mousedown");
		$(".butSetAutoSizeBg").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("status") != "false") {
				StyleMenu.butSizeBgNoAct(); //делаем кнопку не активной
				$(".valueBgImgSize").val("auto").change();
			}
		});
	}

/*********************************************************************************************/
	/**
	* Видео фон
	*
	* @see 	this.setEvent()
	*/	
	this.setEventBgVideo = function()
	{
		var obj  = this;
		$(".menuBgVideo .rightMenuBut").off("mousedown");
		$(".menuBgVideo .rightMenuBut").on("mousedown", function() {
			var elmVideoObj = Element.obj.find("> .bg-video > video");

			// фото
			if ($(this).hasClass("butEditBgVideoImg")) {
				var elmSrc = elmVideoObj.attr("poster");
				var fileType = "img";
				var operation = 'edit_bg_video_img';
			// видео 
			} else {
				var elmSrc = elmVideoObj.find("> source:first").attr("src");
				var fileType = "video";
				var operation = 'edit_bg_video';
			}

			var params = {
				'operation': operation, 
				'src': elmSrc,
				'file_type':fileType
			};

			EditElementImage.edit(params);
		});
	}

	/**
	*
	*
	*
	*/
	this.setEventVideoSrc = function()
	{
		var obj = this;
		var butObj = $(".butEditBgVideoSrc");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var content = '\
				'+Resource.hlp_rightmenu_modal_bgvideo_label+'\
				<textarea class="valueBgVideoSrc" style="min-height:70px;max-width:100%;"></textarea>';

			Modal.create({
				"id" : "modalBgVideoSrc",
				"title" : Resource.hlp_rightmenu_modal_bgvideo_title,
				"top" : 50,
				"width" : 500,
				"content" : content,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", Resource.main_modal_but_save]
				]
			});

			obj.setVideoSrc(Element.obj);

			var butSaveObj = $("#modalBgVideoSrc .butAdd");
			butSaveObj.off("mousedown");
			butSaveObj.on("mousedown", function() {
				var valueBgInputV = $(".valueBgVideoSrc");
				var videoSrc = valueBgInputV.val();
				var resV = obj.editVideoSrc(Element.obj, videoSrc);

				if (resV) Modal.delete();
				else valueBgInputV.val("");
			});
		});
	}

/*************************************************************************************************/	
} //end class


/**
* Border элемента
*
*
*/
StyleMenuGeometry.prototype = StyleMenu;
var StyleMenuGeometry = new StyleMenuGeometry();
function StyleMenuGeometry() {
	this.classFullHeight = "hlp-full-height";

	/**
	* Установить
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.set = function()
	{
		var elm = Element.obj;

		this.setMGProportion(elm);
		this.menuPositionType(elm);

		if (elm.css("position") == "absolute") {
			this.setPosition(elm);
		} else {
			this.setMGMargin(elm);
		}

		this.setMGPadding(elm);
		this.setMGAlign(elm);// выравнивание
	}	

/**************************************************************************************/
	/**
	* Установить width и height
	*
	*
	*/
	this.setMGProportion = function(elm)
	{
		$(".menuWidth, .menuHeight, .menuMinHeight").css("display", "none");

		// это нужно при переключении экрана (в так оно не нужно)
		var listCss = Element.data.css;
		for (var index in listCss) {
			var style = listCss[index];
			if (style == "height") {
				this.setMGHeight(elm);
			} else if (style == "min-height") {
				this.setMGMinHeight(elm);
			} else if (style == "width") {
				this.setMGWidth(elm);
			}
		}
	}

	/**
	* Устанавливает width
	*
	*/
	this.setMGWidth = function(elm)
	{
		var widthBlock = $(".menuWidth");
		var widthUnitParser = widthBlock.find(".inputUnitItem").not("[value='px']");
		var widthElm = false;

		widthBlock.css("display", "block");
		widthUnitParser.css("display", "block");

		var unitPersentObj = $(".menuWidthUnitPersent");
		unitPersentObj.css("display", "block");

		// если секция
		if (Element.isSection(elm)) {
			if (!Screen.isDesktop()) {
				$(".menuWidth .inputBlock").attr("data-no-activite", "true");
				return false; 
			} else if (elm.hasClass("hlp-full-width")) {
				widthBlock.css("display", "none");
				return false;
			}

			elm = elm.not(".hlp-full-width").find(" > .section-content");	
			widthElm = ElementCss.getStyle("width", "geometry", elm, "desktop", false, "hlp-section-content");
			
			if (!widthElm) {
				if (!widthElm) {
					widthElm = Screen.getWidthDefault()+"px";
				}
			}
			StyleUnit.setUnitMenu("width", widthElm);

			if (widthElm != "auto") widthElm = parseInt(widthElm);
			$(".valueWidth").val(widthElm);
			
		
			return false;
		} else if (Element.isElmChildForm(elm)) {
			widthElm = ElementCss.getStyleAllScreen("width", "geometry", false, elm);
			if (!widthElm) widthElm = "100%";
		} else {
			widthElm = ElementCss.getStyleAllScreen("width", "geometry", false, elm);
			if (!widthElm && Element.getState() != "static") {
				widthElm = ElementCss.getStyle("width", "geometry", elm, false, "static");
				if (!widthElm) widthElm = ElementCss.getStyle("width", "geometry", elm, "desktop", "static");
			}
		}


		StyleUnit.setMenuProperty(elm, "width", false, widthElm);
	}

	this.setMGHeight = function(elm)
	{
		StyleUnit.setMenuProperty(elm, "height", "geometry", elm.css("height"));
		// this.hideBlockNoActivite("height");
	}

	this.hideBlockNoActivite = function(property)
	{
		var blockInput = $(".inputBlock[data-style='"+property+"']");
		blockInput.removeAttr("data-no-activite");
		blockInput.find(".menuPropertyNoActivite").remove();
	}

/*****************************************************************************/
	
	/**
	* Минимальная высота
	*
	*/
	this.setMGMinHeight = function(elm)
	{
		if (elm.hasClass("section")) elm = elm.find(".hlp-section-content");
		
		// показываем блок
		$(".menuMinHeight").css("display", "block");
		
		//ставим значение 
		elm = Element.getForEditStyle(elm, "min-height");

		var value = elm.css("min-height");
		StyleUnit.setMenuProperty(elm, "min-height", "geometry");
		
		// дополнительно - костыль
		this.setPropertyExtended(elm);
	}

	/**
	* Устанавливает height
	*
	*/
	this.setPropertyExtended = function(elm)
	{
		$(".menuGeometryPropertyExtended .menuOneParam, .menuHeight").css("display", "block");
		StyleUnit.setMenuProperty(elm, "height", "geometry");
		StyleUnit.setMenuProperty(elm, "max-height", "geometry");
		StyleUnit.setMenuProperty(elm, "min-width", "geometry");
		StyleUnit.setMenuProperty(elm, "max-width", "geometry");
	}

/**************************************************************************************/
	/**
	* Установка типа позиции
	* 
	*
	*/
	this.setMGMenuPositionType = function(elm)
	{
		var typePosition = elm.css("position");
		if (typePosition == "relative") typePosition = "static";

		if (typePosition == "static") { //статик
			// показываем блок margin
			var blockClass = "menuMargin";
			// ставим margin
			if (!elm.hasClass("section")) this.setMGMargin(elm);

			// выравнивание для блока, если не в row
			// if (!elm.parent().hasClass("row"))
				$(".menuPositionAlign").css("display", "block");
		} else { //absolute и fixed
			// var blockClass = elm.hasClass("section") ? false : 
			var blockClass = "menuPosition";
			// устанавливаем значение position
			this.setPosition(elm);

			if ( this.isPositionFixed(elm)) typePosition = "fixed";
		}

		// показываемм блок
		if (blockClass) $("."+blockClass).css("display", "block");
		// отмечаем выриант
		$(".selectGeometryPosition .option[value='"+typePosition+"']")
														.attr("chosen", "true");

		// показываем или убираем блок выбора 
		var displayValue  = Element.data.no_chosen_position ? "none" : "block";
		$(".menuPositionType").css("display", displayValue);

		if (elm.hasClass("section")) {
			$(".menuPositionAlign").css("display", "none");
		}
	}
/************************************************************************************/
	/*
	* Позиция
	*
	* @see 	this.editPositionSide()
	*/
	this.setPosition = function(elm)
	{
		// получаем список сторон
		var listSide = StylePosition.getAdsoluteSide(elm);
		var sideV = listSide[0];
		var sideH = listSide[1];


		var inputV = $(".menuPosition .menuOneParam[side='"+sideV+"']");
		var inputH = $(".menuPosition .menuOneParam[side='"+sideH+"']");

		// показываем
		$(".menuPosition .menuOneParam").css("display", "none");
		inputV.css("display", "block");
		inputH.css("display", "block");

		// ставим значение в меню
		StyleUnit.setMenuProperty(elm, sideV);
		StyleUnit.setMenuProperty(elm, sideH);

		// отмечаем сторон у в меню
		$(".menuPositionSide").removeAttr("chosen")
							.filter("[value='"+listSide[2]+"']")
							.attr("chosen", "true");

		//на всю высоту
		var fullHeightStatus = this.isElmFullHeight(elm) ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valuePosAbsoluteFullHeight"), fullHeightStatus);
	}

	this.setMGPositionPanel = function(elm)
	{
		var positionSide = elm.hasClass("hlp-position-right") ? "right" : "left";
		$(".butGeometryPositionPanel[value='"+positionSide+"']").attr("chosen", "true");
	}

	this.setVisibleOptionPosFixed = function(elm)
	{
		var optionFixed = $(".selectGeometryPosition .option[value='fixed']");
		if (elm.hasClass("block") 
				|| elm.hasClass("text") 
				|| elm.hasClass("heading")
				|| elm.hasClass("button")
				|| elm.hasClass("image")) {
			optionFixed.css("display", "block");
		} else {
			optionFixed.css("display", "none");
		}
	}
/***************************************************************************************/
	/*отступы*/
	/**
	* Внутрений отступ 
	*/
	this.setMGPadding = function(elm)
	{
		// вертикальный
		this.setMGPaddingV(elm);
		// горизонтальный 
		this.setMGPaddingH(elm);
	}

	this.setMGPaddingV = function(elm)
	{
		elm = Element.getForEditStyle(elm, "padding-top");

		$(".menuPaddingV").css("display", "block");

		var top = ElementCss.getStyleAllScreen("padding-top", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-top", false, top);

		var bottom = ElementCss.getStyleAllScreen("padding-bottom", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-bottom", false, bottom);

	}

	this.setMGPaddingH = function(elm)
	{
		elm = Element.getForEditStyle(elm, "padding-left");

		$(".menuPaddingH").css("display", "block");

		var left = ElementCss.getStyleAllScreen("padding-left", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-left", false, left);

		var right = ElementCss.getStyleAllScreen("padding-right", false, false, elm);
		StyleUnit.setMenuProperty(elm, "padding-right", false, right);
	}
/*****************************************************************************************/
	/**
	* внешний отступ
	*/
	this.setMGMargin = function(elm)
	{
		// повертикали
		this.setMGMarginV(elm);
		// по горизонтали
		this.setMGMarginH(elm);
	}

	this.setMGMarginV = function(elm)
	{	
		// потому что стили ставяться для всех секций
		if (elm.hasClass("site")) elm = elm.find(".section");

		// сверху
		StyleUnit.setMenuProperty(elm, "margin-top", false, false, elm);
		// снизу
		StyleUnit.setMenuProperty(elm, "margin-bottom", false, false, elm);
		
		// показываем блок
		$(".menuMarginV").css("display", "block");
	}	

	this.setMGMarginH = function(elm)
	{
		$(".menuMarginH").css("display", "block");
		// слева
		StyleUnit.setMenuProperty(elm, "margin-left", false, false, elm);
		// справа
		StyleUnit.setMenuProperty(elm, "margin-right", false, false, elm);

		// ставим максимальное значение
		var width = Element.getWidth();
		var listInput = $(".valueMarginLeft, .valueMarginRight");

		var marginLeft = parseInt($(".valueMarginLeft").val());
		var marginRight = parseInt($(".valueMarginRight").val());

		if (marginLeft && marginLeft == marginRight) {
			if (Element.existClassAdded(elm) || Element.getState() != "static") {
				if (!Element.data.modePosAbsolute) {
					this.setUnitAuto(listInput);
				}
			}
		}
	}

	this.setUnitAuto = function(listInput)
	{
		listInput.val("auto").parent()
								.find(".inputUnitCurrent")
								.attr("type", "auto")
								.text("-");
	}
/**********************************************************************************************/
	// обтекание
	this.setMGFloatSide = function(elm)
	{
		if (elm.hasClass("row") || elm.hasClass("column")) {
			elm = elm.closest(".row");
			var floatSide = elm.hasClass("hlp-children-float-right") ? "right" : "left";
		} else {
			if (elm.hasClass("nav-item")) elm = elm.parent();
			var floatSide = elm.css("float");
		}
		$(".butGeometryFloatSide[value='"+floatSide+"']").attr("chosen", "true");
	} 


/*********************************************************************************************/
	/*
	* выравнивание
	*
	* @see 	StyleMenu.fixedHistoryMove()
	* @see 	this.editMarginLeft(), this.editMarginRight()
	*/
	this.setMGAlign = function(elm)
	{
		// если absolute
		if (Element.isAbsolute(elm)) {
			$(".menuPositionAlign").css("display", "none");
			return false;
		}

		// показываем или убираем блок оптикание
		$(".butGeometryFloat, .butGeometryFloatSide").removeAttr("chosen");

		// ставим значение
		this.setAlignProperty(elm);
		// float
		this.setMGFloat(elm);
	}

	/**
	* Устанавливаем параметры выравнивания
	*
	* @see 	this.setMGAlign()
	*/
	this.setAlignProperty = function(elm)
	{
		// убираем кнопки
		$(".butGeometryAlign").removeAttr("chosen");

		// данные
		var marginLeft = ElementCss.getStyleAllScreen("margin-left", false, false, elm);
		var marginRight = ElementCss.getStyleAllScreen("margin-right", false, false, elm);
		
		// сторона
		var align = '';
		if (Element.isFloat()) {
			$(".butGeometryResetAlign").attr("chosen", "true");
			return false; 
		} else if (!marginLeft || parseFloat(marginLeft) == 0) {
			align = "left";
		} else if (marginLeft == marginRight) {
			align = "center";
		} else if (marginLeft == "auto") {
			align = "right";
		}

		// отмечаем
		$(".butGeometryAlign[value='"+align+"']").attr("chosen", "true");
	}

/*********************************************************************************************/
/***изменение*************************************************************************************/
	/*ширина*/
	this.editWidth = function(elm, value)
	{
		var maxWidthV = 2000;
		var minWidthV = 400;
		
		//если это секция
		if (Element.isSection(elm)) {
			var sectionClassV = Element.existClassAdded(elm) ? "" : "hlp-section-content";

			var widthUnitV = StyleUnit.getUnitMenu("width");
			if (value != "auto") value += widthUnitV;
			
			ElementCss.set("geometry", elm, false, {"width":value}, false, sectionClassV);
				
			// выход за пределы
			if (widthUnitV == "px") {
				var secWidthPxV = parseInt(value);
				if (secWidthPxV > maxWidthV) {
					ElementCss.set("geometry", elm, false, {"width":maxWidthV+"px"}, false, sectionClassV);
				} else if(secWidthPxV < minWidthV) {
					ElementCss.set("geometry", elm, false, {"width":minWidthV+"px"}, false, sectionClassV);
				}
			}

			// обновляем значение модульной сетки
			Grid.setPropety();
			
			// направляющие и линейку
			Guides.setPositionVertical();
			Scale.setPosition();
		} else {
			//изменяем ширину
			this.editProperty("width", parseFloat(value), elm);
		}
	}

	// высота
	this.editHeight = function(elm, value) 
	{
		this.editProperty("height", value, elm);
	}

	// минимальная высота
	this.editMinHeight = function(elm, value)
	{
		elm = Element.getForEditStyle(elm, "min-height");

		if (value != "auto") value = parseFloat(value);

		// изменяем минимальную ширину 
		this.editProperty("min-height", value, elm);
	}

	this.editProportionExtend = function(elm, value, elmEvent)
	{
		if (value != "auto") value = parseFloat(value);
		var propertyCssV = elmEvent.attr("data-css-type");

		if (propertyCssV == "max-height" && value == "none") {
			value = "auto";
		}

		if (elm.hasClass("section")) {
			if (propertyCssV == "width" && !Element.existClassAdded(elm)) {
				var listStyleV = {};
				var unitV = StyleUnit.getUnitMenu(propertyCssV);
				listStyleV[propertyCssV] = value+unitV;

				elm = elm.find(" > .section-content");
				ElementCss.set("geometry", elm, false, listStyleV, false, "hlp-section-content");

				return false;	
			} else {
				elm = elm.find(" > .section-content");
			}

			/*это потом убрать******/
			if (propertyCssV == "min-width" && !Element.existClassAdded(elm)) {
				ElementCss.clear("min-width", "geometry", elm, false, false, "hlp-section-content");
			}
		}

		this.editProperty(propertyCssV, value, elm);
	}

	

	/**
	* Обновляем информацию в меню о пропорциях
	*
	* @see 	Resize.setEventMouseUp();
	*/
	this.updataInfoProportion = function()
	{
		var elm = Element.obj;
		$('.valueWidth').val(elm.width());
		$('.valueHeight').val(elm.height());
	}


/*********************************************************************************************/
	/*позиция*/
	this.editPositionType = function(elm, value)
	{
		this.clearClassPositionFixed(elm);
		// для position absolute
		if (value == "fixed") this.setPropertyPositionFixed(elm);

		if (elm.hasClass("section")) {
			if (value == "static") {
				value = "relative";
				ElementCss.clear("z-index");
				
				if (Screen.isDesktop() && !Element.existClassAdded(elm)) {
					ElementCss.clear("position");
				} else {
					elm.css("position", "relative");
				}
			} else if (parseInt(elm.css("z-index")) < 1000) {
				elm.css("z-index", "1000");
				$(".valueZindex").val(1000);
				elm.css("position", value);
			}
			
			StyleMenu.set();

			return false;
		}

		ElementCss.clear("z-index");

		if (value == "static") {
			if (Screen.isDesktop()) {
				//убираем
				ElementCss.clear("position");
				ElementCss.clearAllScreen("top", "geometry", elm);
				ElementCss.clearAllScreen("left", "geometry", elm);
				ElementCss.clearAllScreen("bottom", "geometry", elm);
				ElementCss.clearAllScreen("right", "geometry", elm);
				
				var listElmObjV = Element.getAllObject(elm);
				listElmObjV.removeAttr("position-side");
			} else {
				var elmPostAbsV = elm.attr("position-side");
				if (elmPostAbsV.match(/^t-/gim)) elm.css("top", "0px");
				else elm.css("bottom", "0px");
				if (elmPostAbsV.match(/-l$/gim)) elm.css("left", "0px");
				else elm.css("right", "0px");

				elm.css({"position":"relative"});
			}
				

			// убираем блоки в меню
			$(".menuPosition").css("display", "none");
		} else { //absolute

			if (Screen.isDesktop()) { 
				//убираем
				ElementCss.clearAllScreen("margin-top", "geometry", elm);
				ElementCss.clearAllScreen("margin-left", "geometry", elm);
				ElementCss.clearAllScreen("margin-right", "geometry", elm);
				ElementCss.clearAllScreen("margin-bottom", "geometry", elm);
				//ставим значение 
			} else {
				elm.css({"margin-top":"0px", "margin-left":"0px", "margin-right":"0px", "margin-bottom":"0px"});
			}

			elm.css({"position":"absolute", "top":"0px", "left":"0px", "z-index":"100"});
				
			StylePosition.setAdsoluteSide();
		}

		// ставим стили
		StyleMenu.set();
	}


	// позиция мобильной панели
	this.editPositionPanel = function(elm, value)
	{
		if (value == "right") elm.addClass("hlp-position-right");
		else elm.removeClass("hlp-position-right");
	}
/**********************************************************************************************/
	this.editPositionTop = function(elm, value)
	{
		this.editProperty("top", value);
	}

	this.editPositionBottom = function(elm, value)
	{
		this.editProperty("bottom", value);
	}

	this.editPositionLeft = function(elm, value)
	{
		this.editProperty("left", value);
	}

	this.editPositionRight = function(elm, value)
	{
		this.editProperty("right", value);
	}

	/**
	* Изменения стороны позиционирования
	*
	* @see 	parent
	* @see 	StylePosition.reset()
	* @see 	ElementCss.afterClearStyleGeometry()
	*/
	this.editPositionSide = function(elm, value)
	{
		Screen.setDesktop();

		// ставит значение
		StylePosition.setAdsoluteSide(value, elm);
		
		//получаем стороны 
		var listSide = StylePosition.getAdsoluteSide(elm);
		// console.log(listSide)
		var setSideV = listSide[0];
		var setSideH = listSide[1];
		var clearSideV = setSideV == "top" ? "bottom" : "top";
		var clearSideH = setSideH == "left" ? "right" : "left";

		// очищаем
		ElementCss.clear(clearSideV, "", elm);
		ElementCss.clear(clearSideH, "", elm);
			
		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("bottom", "px");
		StyleUnit.setUnitMenu("left", "px");
		StyleUnit.setUnitMenu("right", "px");

		// ставим стили
		var listSet = {};
		listSet[setSideV] = "0px";
		listSet[setSideH] = "0px";
		ElementCss.setStyle(listSet);
		
		// ставим в меню
		this.setPosition(elm);
	}

	/**
	* На всю высоту
	*/
	this.editAbsoluteFullHeight = function(elm, value)
	{
		if (value == "yes") {
			// this.addClassFullHeight(elm);
			
			ElementCss.clearAllScreen(["top", "bottom"], "geometry", elm, "desktop");
			ElementCss.setStyle({"top":"0px", "bottom":"0px"}, elm, "desktop");
		} else {
			// this.removeClassFullHeight(elm);
			
			var listSide = StylePosition.getAdsoluteSide(elm);
			var sideV = listSide[0];
			var clearSide = sideV == "top" ? "bottom" : "top";
			ElementCss.clearAllScreen([clearSide], "geometry", elm, "desktop");
		}
	}

	this.getClassFullHeight = function()
	{
		return this.classFullHeight;
	}

	this.isElmFullHeight = function(elm)
	{
		var topV = ElementCss.getStyleAllScreen("top", false, false, elm);
		var bottomV = ElementCss.getStyleAllScreen("bottom", false, false, elm); 

		return topV && bottomV ? true : false;
	}

	/**
	*
	*
	* @see 	thsi.editAbsoluteFullHeight()
	*/
	this.addClassFullHeight = function(elm)
	{
		elm = Element.getAllObject(elm);

		var fullClassV = this.getClassFullHeight();
		elm.addClass(fullClassV);

		var listSide = StylePosition.getAdsoluteSide(elm);
		var posVerV = listSide[0];
		elm.css(posVerV, "0px");

		this.setPosition(elm);
	}


	/**
	*
	*
	* @see 	this.editPositionType()
	* @see 	thsi.editAbsoluteFullHeight()
	*/
	this.removeClassFullHeight = function(elm)
	{
		elm = Element.getAllObject(elm);
		
		var classFullHeight = this.getClassFullHeight();
		elm.removeClass(classFullHeight);

		ElementCss.clearAllScreen(["top", "bottom"], "geometry", elm, "desktop");
	}


	/*fixed*****/
	this.isPositionFixed = function(elm)
	{
		return ElementCss.getStyle("position_fixed", false, elm);
	}

	this.setPropertyPositionFixed = function(elm)
	{
		ElementCss.setStyle({"position_fixed":"1"}, elm);

		var elmSecV = elm.closest(".section");
		StyleMenuOther.editZindexExtremum(elmSecV, "max");
		ElementCss.set("geometry", elmSecV);
	}

	this.clearClassPositionFixed = function(elm)
	{
		ElementCss.clear("position_fixed", false, elm);
	}

	/*side****/
	this.getAttrPositionSide = function()
	{
		return "position-side";
	}

	this.clearClassPositionSide = function(elm)
	{
		if (!elm) elm = Element.getObj();

		elm.removeAttr(this.getAttrPositionSide());
	}

	this.clearAttrPositionFixed = function(elm)
	{
		this.clearClassPositionSide();
	}

/**********************************************************************************************/
	// margin
	this.editMarginTop = function(elm, value)
	{
		this.editProperty("margin-top", value);
	}

	this.editMarginBottom = function(elm, value)
	{
		this.editProperty("margin-bottom", value);
	}

	this.editMarginLeft = function(elm, value)
	{
		this.editMarginH(elm, value, "left");
	}

	this.editMarginRight = function(elm, value)
	{
		this.editMarginH(elm, value, "right");
	}

	this.editMarginH = function(elm, value, side)
	{
		// ставим значение
		this.editProperty("margin-"+side, value);
		// устанавливаем заново кнопки выравнивание
		this.setMGAlign(elm);
	}
/***************************************************************************************/
	// padding
	this.editPaddingTop = function(elm, value)
	{
		this.editPaddingVer(elm, value, "top");
	}

	this.editPaddingBottom = function(elm, value)
	{
		this.editPaddingVer(elm, value, "bottom");
	}

	this.editPaddingVer = function(elm, value, side)
	{
		elm = Element.getForEditStyle(elm, "padding-top");
		
		if ( (Element.data.is_insert || Element.obj.hasClass("site")) 
				&& (!parseFloat(value) 
					|| ( parseFloat(value) == 1 && this.isPaddingVOnePx(elm) ) ) ) {
			if (Screen.getCurrent() == "desktop" 
					&& !elm.hasClass("section-content")
					&& !Element.existClassAdded(elm)) {
				var property = "padding-"+side;
				ElementCss.clear(property, "geometry", elm);	
			
				if (StyleUnit.getUnitMenu(property) == "px"
						&& this.isPaddingVOnePx(elm)) {
					if (side == "top") $(".valuePaddingTop").val(1);
					else $(".valuePaddingBottom").val(1);
				}

				return false;
			} else {
				value = this.isPaddingVOnePx(elm) ? "1px" : "0px";
			}
		}

		this.editPadding(elm, side, value);
	}

	this.isPaddingVOnePx = function(elm)
	{
		var elmType = elm.attr("elm-type");
		if (!elmType) elmType = Element.obj.attr("elm-type");

		if (
				elmType == "block" 
				|| elmType == "form"
				// ----------------------
				|| elmType == "modal" 
				|| elmType == "section" 
				|| elmType == "section-content"
				|| elmType == "slider"
				|| elmType == "hlp-tabs"
				) {
			return true;
		} else {
			return false;
		}
	}

	this.editPaddingLeft = function(elm, value)
	{
		this.editPadding(elm, "left", value);
	}

	this.editPaddingRight = function(elm, value)
	{
		this.editPadding(elm, "right", value);
	}

	this.editPadding = function(elm, side, value)
	{
		var property = "padding-"+side;
		
		elm = Element.getForEditStyle(elm, property);
		// если секция
		value = parseFloat(value);

		this.editProperty(property, value, elm);
	}
/**********************************************************************************************/
	/**
	* Изменяет значение
	*
	* @see 	this.edit*
	*/
	this.editProperty = function(property, value, elm, noSetUnit)
	{
		if (!elm) elm = Element.obj;

		// если в процентах
		var unit = StyleUnit.getUnitMenu(property);
		
		if ((unit != "auto") && value != "auto" && !noSetUnit) {
			value = parseFloat(value)+unit;
		}

		//ставим значение 
		var listProperty = {};
		listProperty[property] = value;
		ElementCss.noSetStyle = true;

		// ставит не текущему элементу
		if (noSetUnit 
				|| elm.hasClass("nav-item")
				|| (elm.css("float") !=  "none") && elm.parent().hasClass("block")) {
			ElementCss.noSetInput = true;
			ElementCss.setStyle(listProperty, elm);
		// ставит текущему элементу
		} else {
			elm.css(listProperty);
			ElementCss.noSetStyle = false;
			ElementCss.set("geometry", elm);
		}
	}


/********************************************************************************************************/
	
	/**
	* Сторона обтикания у колонки
	*
	*
	*/
	this.editFloatSide = function(elm, value, elmEvent, noAllElm)
	{
		var classFloat = "hlp-children-float-right";
		if (!elm.hasClass("row")) elm = elm.parent().closest(".element");

		if (value == "left") elm.removeClass(classFloat); 
		else elm.addClass(classFloat);
	}

	// выравнивание
	this.editPositionAlign = function(elm, value)
	{
		var style = {};

		if (value == "center") { //по центру
			style["margin-left"] = "auto";
			style["margin-right"] = "auto";

			StyleUnit.setUnitMenu("margin-left", "auto");
			StyleUnit.setUnitMenu("margin-right", "auto");
		} else if (value == "left") {
			style["margin-left"] = "0px";
			ElementCss.clear("margin-right", "geometry");

			StyleUnit.setUnitMenu("margin-left", "px");
			StyleUnit.setUnitMenu("margin-right", "px");
		} else if (value == "right") { // по краям
			style["margin-left"] = "auto";
			style["margin-right"] = "0px";

			StyleUnit.setUnitMenu("margin-right", "px");
			StyleUnit.setUnitMenu("margin-left", "auto");
		}
		
		// убираем параметр с кнопки reset
		$(".butGeometryResetAlign").removeAttr("chosen");
		
		// ставим параметры
		elm.css(style);
	}
/********************************************************************************************************/
	this.setMGFloat = function(elm)
	{
		var floatSide = elm.css("float"); 
		var elmParentV = elm.parent();
		var blockVisibleV = elmParentV.hasClass("block") || floatSide != "none" ? "block" : "none";
		if (elmParentV.hasClass("hlp-block")) blockVisibleV = "none";
		$(".menuFloat").css("display", blockVisibleV);

		StyleMenu.chosenToggleBut($(".valueGeometryFloat"), floatSide);
	}

	//float
	this.editFloat = function(elm, value)
	{
		elm.css({"float":value, "margin-left":"0px", "margin-right":"0px"});
	} 

/*********************************************************************************************************/	
/********************************************************************************************************/
	
	/**
	*
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventExtendsProportion();
	}

	/**
	* Расширенные пропорции
	*
	* @see 	this.setEvent()
	*/
	this.setEventExtendsProportion = function()
	{
		var butObj = $(".menuGeometryPropertyExtendedBut");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			$(this).closest(".menuGeometryPropertyExtended").attr("data-type", $(this).attr("data-type"));
			return false;
		});
	}


} //end class

/**
* Фиксированые
*
*
*
*/
var StyleMenuSite = new StyleMenuSite();
function StyleMenuSite() {


} // end class

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









/**
* 
*
*
*/
StyleMenuTextShadow.prototype = StyleMenu;
var StyleMenuTextShadow = new StyleMenuTextShadow();
function StyleMenuTextShadow() {
	/**
	* Установить 
	*
	*/
	this.set = function(elm)
	{
		//список свойств тени
		var list = this.cutShadow(elm);

		//устанавливаем значения
		//цвет
		Color.setRgbaInMenu($('.valueTextShadowColor'), list['color']);
		// смещение
		$('.valueTextShadowOffsetX').val(list['offsetX']);
		$('.valueTextShadowOffsetY').val(list['offsetY']);
		//радиус
		$('.valueTextShadowRadius').val(list['radius']);
	}

	/**
	* Разложить по стилям тень
	*
	* @see this.shadow();
	*/
	this.cutShadow = function(elm)
	{
		//тень
		var shadow = elm.css('text-shadow');
		var emptyValue = {'offsetX':'0', 'offsetY':'0', 'radius':'0', 'color':'rgba(0,0,0,1)'}; 
		//если нет тени
		if (shadow == 'none') {
			return emptyValue;
		//тень есть
		} else {			
			//шаблое для поиска
			var pat = /^(rgba?\([^\)]+\))\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px/igm;
			//результат
			var list = pat.exec(shadow);
			if (!list) return emptyValue;

			return {'color':list[1],
					'offsetX':list[2],
					'offsetY':list[3],
					'radius':list[4]};
		}
	};

/**********************************************************************************/
	
	/**
	* Установить тень
	* @see 	this.valueShadow*()
	*/
	this.edit = function(elm) 
	{
		//цвет
		var color = Color.getRgbaFromMenu($(".valueTextShadowColor"));
		// смещение x
		var offsetX = $('.valueTextShadowOffsetX').val();
		// смещение y
		var offsetY = $('.valueTextShadowOffsetY').val();
		//радиус
		var radius = $('.valueTextShadowRadius').val();

		if (!color) color = "rgba(0,0,0,1)";
		
		//формируем shadow
		var shadow = offsetX+'px '+offsetY+'px '+radius+'px  '+color;
		//устанавливаем тень
		elm.css('text-shadow', shadow);
	};

} //end class
/**
* Трансформация
*
*
*/
StyleMenuTransform.prototype = StyleMenu;
var StyleMenuTransform = new StyleMenuTransform();
function StyleMenuTransform() {
	this.scaleIndex = 100;
	this.transitionDefault = 300;

	/**
	* Установить 
	*/
	this.set = function(elm)
	{
		this.setRotate(elm);
		this.setOpacity(elm);
		this.setBlur(elm);
		this.setTransition(elm);
	} 

	/** 
	* Прозрачность
	*
	* @see 	this.set()
	*/
	this.setOpacity = function(elm)
	{
		var opacityValue = elm.css("opacity");
		// if (!opacityValue) opacityValue = 1;
		opacityValue = parseFloat(opacityValue).toFixed(2);
		opacityValue = parseFloat(opacityValue)*100;

		// ставим значение
		$(".valueTransformOpacity").val(opacityValue);
	}

	this.setBlur = function(elm)
	{
		var blurValue = elm.css("filter");
		if (blurValue == "none") blurValue = elm.css("-webkit-filter");
		if (blurValue == "none") blurValue = elm.css("-moz-filter");
		if (blurValue == "none") blurValue = elm.css("-o-filter");

		if (blurValue && blurValue.match(/blur/gim)) {
			blurValue = blurValue.replace(/[^0-9\.]+/, '');
		} else {
			blurValue = 0;
		}

		$(".valueTransformBlur").val(blurValue);
	}

/************************************************************************************/

	this.setTransition = function(elm)
	{
		// var value = elm.css("transition");
		var value = ElementCss.getStyleAllScreen("transition", "style", false, elm);
		if (value) value = value.match(/^all [0-9\.]+s/gim);

		if (value) {
			value = value[0];
			value = value.replace(/[^0-9\.]+/gim, '');
			value = parseFloat(value) * 1000;
		}
		if (!value) value = this.getTransitionDefault(elm);

		$(".valueTransformTransition").val(value);
	}

	this.editTransition = function(elm, value)
	{
		value = parseInt(value);
		value = value / 1000;
		value = parseFloat(value.toFixed(2));

		elm.css("transition", "all "+value+"s ease");
		ElementCss.set("style", elm, false, false);
	}


	this.getTransitionDefault = function(elm)
	{
		if (elm.hasClass("button") 
				|| elm.hasClass("nav-item")
				|| elm.hasClass("submit")) {
			return this.transitionDefault;
		} else {
			return 0;
		}
	}

/************************************************************************************/

	/**
	* Узнает транcформирован элемент или нет
	*
	* @see 	Guides.show()
	* @see 	this.setTransformResizeBlock()	
	*/
	this.getRotateWithParent = function(elm)
	{
		var rotateValue = 0;
		var status = false;

		for (var i = 0; i < 100; i++) { //для страховки, потому что работа с классом
			if (elm.hasClass("section")) break;
			// есть трансформация
			status = elm.css("transform") != "none";			
			if (status) {
				rotateValue = this.getRotateValue(elm);
				break;
			}
			// вверх по дереву
			elm = elm.parent().closest(".element");
		}


		return rotateValue;
	}

	/**
	* Отдает значение rotate
	*
	* @see 	this.set()
	* @see 	this.getRotateWithParent() 
	*/
	this.getRotateValue = function(elm)
	{
		var matrixValue = elm.css("transform");
		if (!matrixValue || matrixValue == "none") return 0;

		var listValue =  matrixValue.replace(/[a-z\(\)]+/gi, '').split(',');
		var rotateValue = Math.round(Math.asin(listValue[1]) * (180/Math.PI));

		if (listValue[3] < 0) {
			if (rotateValue) {
				rotateValue = parseInt(180 + rotateValue);
				if (rotateValue != 0) rotateValue *= (-1);
			} else {
				rotateValue = 180;
			}		
		}
		

		return rotateValue;
	}

	/**
	* Ставит в нормальное положение блок resize
	*
	* @see 	this.editRotate()
	* @see 	Resize.create()
	*/
	this.setTransformResizeBlock = function()
	{
		var value = this.getRotateWithParent(Element.obj);
		var roatateForGuides = "rotate(" + value * (-1) + "deg)"; 
		$(".resizeBlock").css("transform", roatateForGuides);
	}
/***************************************************************************************/
/*****************************************************************************************/
	// изменение
	/**
	* Поворот
	*/
	this.editRotate = function(elm, value)
	{
		value = parseInt(value);
	
		if (value) var rotate = "rotate("+value+"deg)";
		else var rotate = "none";

		elm.css("transform", rotate);
		// для направляющих и блока resize, что бы стояли ровно
		this.setTransformResizeBlock();
	}

	/**
	* Прозрачность
	*/
	this.editOpacity = function(elm, value)
	{
		value = parseInt(value) / 100;
		elm.css("opacity", value);
	}

	this.editBlur = function(elm, value)
	{
		value = parseFloat(value) + "px";
		value = "blur("+value+")";
		elm.css("-webkit-filter", value);
		elm.css("-moz-filter", value);
		elm.css("-o-filter", value);
		elm.css("-ms-filter", value);
		elm.css("filter", value);
	}

/**************************************************************************************/
/**************************************************************************************/
	
	/** 
	* Установить rotate
	*
	* @see 	this.set()
	*/
	this.setRotate = function(elm)
	{
		var listPropV = this.getListTransformProperty(elm, true);
		MenuListItem.addList("transform", listPropV);
	}

	/**
	* Изменение значения
	*
	*
	*/
	this.edit = function(elm, value, elmEvent)
	{
		var listOptionProperty = this.getListTransformProperty(elm);
		var propIndex = MenuListItem.getItemIndex(elmEvent);

		listOptionProperty = this.editItemFromList(listOptionProperty, propIndex);

		MenuListItem.uploadListValue(listOptionProperty, elmEvent);
		MenuListItem.addList("transform", listOptionProperty);

		this.setValueElm(elm, listOptionProperty);
	}

	/**
	* Добавление нового значения
	*
	* @see 	MenuListItem.addNewItem()
	*/
	this.addNewValue = function()
	{
		$(".menuTransformListBlock").attr("data-type", "translate");

		var newPropertyV = {
			"name" : "translate",
			"property" : {
				"trs-type" : "translate",
				"trs-hor": "0",
				"trs-ver" : "0",
			}
		}

		var elm = Element.obj;
		var trsAttr = this.getTrsAttr(elm);

		var transformValueV = elm.attr(trsAttr);
		if (transformValueV && transformValueV != "none") transformValueV += " ";
		else transformValueV = "";
		var value = this.getValueItem("translate", 0, 0);
		transformValueV += value;
		elm.css("transform", transformValueV);
		elm.attr(trsAttr, transformValueV);


		return newPropertyV;
	}

	/**
	* Установка параметра в можальное
	* 
	* @see 	MenuListItem.setEventEditBg()
	*/
	this.setOptionProperty = function(elmEvent)
	{
		$(".valueTransformHor, .valueTransformVer").val(0);
		$(".menuTransformBlock[data-type='scale']").find(".valueTransformHor, .valueTransformVer").val(this.scaleIndex);

		var trsType = elmEvent.attr("trs-type");
		$(".menuTransformListBlock").attr("data-type", trsType);
		$(".menuTransformTab").removeAttr("data-chosen")
							.filter("[data-type='"+trsType+"']")
							.attr("data-chosen", "true");

		var modalObjV = $(".menuTransformBlock[data-type='"+trsType+"']");

		var trsHor = elmEvent.attr("trs-hor");
		trsHor = trsHor ? parseFloat(trsHor) : 0;
		if (trsType == "scale" && trsHor) trsHor = parseInt(trsHor * this.scaleIndex);
		modalObjV.find(".valueTransformHor").val(trsHor);

		var trsVer = elmEvent.attr("trs-ver");
		trsVer = trsVer ? parseFloat(trsVer) : 0;
		if (trsType == "scale" && trsVer) trsVer = parseInt(trsVer * this.scaleIndex);
		modalObjV.find(".valueTransformVer").val(trsVer);
	}	

	/**
	* Удаление параметра
	* 
	* @see 	MenuListItem.deleteItem()
	*/
	this.deleteProp = function(itemIndexV)
	{
		var elm = Element.obj;
		var listOptionProperty = this.getListTransformProperty(elm);
		listOptionProperty.splice(itemIndexV, 1);

		this.setValueElm(elm, listOptionProperty);
	}

	/**
	* Сброс стиля
	*
	* @see 	ElementCss.actionAfterClearing()
	*/
	this.resetStyle = function(elm)
	{
		var trsAttr = this.getTrsAttr(elm);
		elm.removeAttr(trsAttr);
	}

	/**
	* Отдает атрибут трансформации
	*
	* @see 	this.resetStyle()
	* @see 	this.setValueElm()
	* @see 	this.getListTransformProperty()
	* @see 	this.addNewValue()
	*/
	this.getTrsAttr = function(elm)
	{
		if (!elm) elm = Element.obj;

		var trsAttr = "data-transform";
		var state = Element.getState(elm);
		if (state && state != "static") {
			trsAttr += "-"+state;
			// if (!elm.attr(trsAttr)) trsAttr = "data-transform";
		}

		return trsAttr;
	}

/*********************************************************************************/
			
	/**
	* Формирует одно значение
	*
	* @see 	this.addNewAttr()
	*/	
	this.getValueItem = function(typeV, horV, verV)
	{
		var value = '';
		if (typeV == "translate") {
			value = 'translate('+horV+'px,'+verV+'px)';
		} else if (typeV == "scale") {
			horV = parseInt(horV) / this.scaleIndex;
			verV = parseInt(verV) / this.scaleIndex;

			value = 'scale('+horV+','+verV+')';
		} else if (typeV == "rotate") {
			value = 'rotate('+horV+'deg)';
		} else if (typeV == "skew") {
			value = 'skew('+horV+'deg,'+verV+'deg)';
		}

		return value;
	}
	
	/**
	* Установка значения элементу
	*
	* @see 	this.deleteOption()
	* @see 	this.edit()
	*/
	this.setValueElm = function(elm, listOptionProperty)
	{
		value = this.getValueFromProp(listOptionProperty);
		value = value.trim();
		elm.css("transform", value);

		if (value) {
			var trsAttr = this.getTrsAttr(elm);
			elm.attr(trsAttr, value);
			ElementCss.set("style", elm);
		} else {
			ElementCss.clear("transform", "style", elm);
			var listElmV = Element.getAllObject(elm);
			listElmV.removeAttr("data-transform");
		}
	}

		/**
	* Отдает значение из списка параметров
	*
	* @see 	this.setValueElm()
	*/
	this.getValueFromProp = function(listPropertyV)
	{
		var countProp = listPropertyV.length;

		var value = '';
		var countItem = listPropertyV.length;
		for (var iItem = 0; iItem < countItem; iItem++) {
			var propV = listPropertyV[iItem];

			propV = propV["property"];
			var valueItem = propV["trs-hor"];
			if (propV["trs-ver"]) valueItem += ","+propV["trs-ver"];
			value += propV["trs-type"]+"("+valueItem+") ";
		}

		value = value.trim();

		return value;
	}

	/**
	* Отдает список параметров из значения
	*
	* @see 	this.setRotate()
	* @see 	this.edit()
	* @see 	this.deleteProp()
	*/
	this.getListTransformProperty = function(elm, isSetStyleV)
	{
		if (!elm) elm = Element.obj;

		var transformValueV = ElementCss.getStyleAllScreen("transform", false, false, elm);

		if (!transformValueV) return [];
		var listTransformP = transformValueV.split(") ");

		var listOptionProperty = []; 
		var trsCount = listTransformP.length;
		for (var iTrs = 0; iTrs < trsCount; iTrs++) {
			var trsValueV = listTransformP[iTrs];
			var trsTypeV = trsValueV.match(/^[^\(]+/gim);
			trsTypeV = trsTypeV[0];

			trsValueV = trsValueV.replace(/\)$/gim, '');
			trsValueV = trsValueV.replace(/^[^\(]+\(/gim, '');
			var listValueTrs = trsValueV.replace(/\s/gim, '').split(",");
			
			listOptionProperty[iTrs] = {
				"name" : trsTypeV,
				"property" : {"trs-type":trsTypeV}
			};

			var valueHorV = listValueTrs[0];
			var valueVerV = listValueTrs[1];

			listOptionProperty[iTrs]["property"]["trs-hor"] = valueHorV;
			if (valueVerV) listOptionProperty[iTrs]["property"]["trs-ver"] = valueVerV;
		}

		return listOptionProperty;
	}


	/**
	* Ставим элементу ноывй список
	*
	* @see 	this.edit()
	*/
	this.editItemFromList = function(listOptionProperty, propIndex)
	{
		if (!listOptionProperty) listOptionProperty = [];
		if (!listOptionProperty[propIndex]) {
			listOptionProperty[propIndex] = {"property":{}, "name":""};
		}

		var trsType = $(".menuTransformTab[data-chosen]").attr("data-type"); 
		listOptionProperty[propIndex]["property"]["trs-type"] = trsType;
		listOptionProperty[propIndex]["name"] = trsType;

		var modalObjV = $(".menuTransformBlock[data-type='"+trsType+"']");
		var inputHorObjV = modalObjV.find(".valueTransformHor");
			
		var unitV = "";
		if (trsType == "rotate" || trsType == "skew") unitV = "deg";
		else if (trsType == "translate") unitV = "px";

		var horV = parseInt(inputHorObjV.val());
		if (trsType == "scale" && horV) horV = horV / this.scaleIndex;
		listOptionProperty[propIndex]["property"]["trs-hor"] = horV+unitV;

		var inputVerObjV = modalObjV.find(".valueTransformVer");
		if (inputVerObjV.length) {
			var verV = parseInt(inputVerObjV.val());
			if (trsType == "scale" && verV) verV = verV / this.scaleIndex;
			listOptionProperty[propIndex]["property"]["trs-ver"] = verV+unitV;
		}

		if (trsType == "rotate") {
			listOptionProperty[propIndex]["property"]["trs-ver"] = false;
		}

		return listOptionProperty;
	}


/**************************************************************************************/
/**************************************************************************************/

	/**
	* Установка событий
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		var listTabsObj = $(".menuTransformTab"); 
		listTabsObj.off("mousedown");
		listTabsObj.on("mousedown", function() {
			var elmEvent = $(this);
			var typeV = elmEvent.attr("data-type");

			listTabsObj.removeAttr("data-chosen");
			elmEvent.attr("data-chosen", "true");

			$(".menuTransformListBlock").attr("data-type", typeV);

			return false;
		});
	}

/**************************************************************************************/
} //end class


/**
* Список
*
*
*/
StyleMenuList.prototype = StyleMenu;
var StyleMenuList = new StyleMenuList();
function StyleMenuList() {

	this.set = function(elm)
	{
		var styleUl = elm.css("list-style-type");
		styleUl = styleUl == "none" ? "no" : "yes";

		$(".menuBlockListStyle .menuButValue[value='"+styleUl+"']").attr("chosen", "true");
	}

	this.editStyle = function(elm, value)
	{	
		elm = elm.closest("ol, ul").find("> li").eq(0);

		if (value == "no") {
			elm.css("list-style-type", "none");
			ElementCss.set(false, elm);
		} else {
			ElementCss.clear("list-style-type", false, elm);
		}
	}

}
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









/**
* 
*
*
*/
StyleMenuText.prototype = StyleMenu;
var StyleMenuText = new StyleMenuText();
function StyleMenuText() {
	/**
	* Установить 
	*
	* @see
	* @see 	StyleFont.addLinkFont()
	*/
	this.set = function(elm)
	{
		if (!elm) elm = Element.obj;

		var sectionText = $(".menuSelfText");

		// если elementText
		if (Element.data.is_show_text) {
			// оказываем и стави текст
			sectionText.css("display", "block");
			this.setText(elm);
		} else {
			sectionText.css("display", "none");
		}

		// шрифт
		var curFontV = elm.css("font-family").replace(/[']+/g, '').replace(/"/gim,'');
		this.setFamily(elm, curFontV);
		// размер
		this.setSize(elm);
		// цвет
		this.setColor(elm);
		// выравнивание
		this.setAlign(elm);
		// стиль
		this.setStyle(elm);
		// тольшина
		this.setWeight(elm, curFontV);
		// межстрочный интервал
		this.setLineHeight(elm);
		// ширина
		this.setWidth(elm);
		// сам текст
		this.setSelfText(elm);
		// фон
		this.setBg(elm);
		// регистр
		this.setTransform(elm);
		// placeholder
		this.setPlaceholder(elm);
		// перенос строки
		this.setWordWrap(elm);

	}



/****************************************************************************************/
	// Устанавливаем значение
	this.setText = function(elm)
	{
		$(".valueText").val(elm.find(".element-content").text());
	}

	//шрифт
	this.setFamily = function(elm, curFontV)
	{
		$(".butFamily .option[value='"+curFontV+"']").attr("chosen", "true");
	}

	/*
	* размер
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setSize = function(elm)
	{
		var size = parseInt(elm.css("font-size"));
		$(".valueTextSize").val(size);
	}

	// цвет
	this.setColor = function(elm)
	{
		var color = Color.getHexRGB(elm.css("color"));
		$(".valueTextColor").val(color);
	}

	this.setPlaceholder = function(elm)
	{
		var placeholderBlockV = $(".menuStylePlaceholderColor");

		if (elm.hasClass("input") || elm.hasClass("textarea")) {
			var placeholderVisibleV = "block";
			var colorV = ElementCss.getStyle("placeholder", "geometry", elm, "desktop", "static");
			if (!colorV) colorV = "rgba(200,200,200,1)";
			$(".valuePlaceholderColor").val(colorV);
		} else {
			var placeholderVisibleV = "none";
		}

		placeholderBlockV.css("display", placeholderVisibleV);
	}

	/*
	* выравнивание
	*
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setAlign = function(elm)
	{
		var value = elm.css("text-align");
		if (value == "start") value = "left"; 

		$(".menuButTextAlign[value='"+value+"']").attr("chosen", "true");

		var valueVisibleValueV = elm.hasClass("text-span") ? "none" : "block";
		$(".menuStyleItemTextAlign").css("display", valueVisibleValueV);
	}

	//стиль
	this.setStyle = function(elm)
	{
		var listBut = $(".menuButTextStyle");
		
		// курсив
		var cursiv = elm.css("font-style");
		listBut.filter("[value='"+cursiv+"']").attr("chosen", "true");

		// подчеркивание или перечеркивание
		var line = elm.css("text-decoration");
		listBut.filter("[value='"+line+"']").attr("chosen", "true");
	} 

	this.setWeight = function(elm, curFontV)
	{
		// ставим значение
		var value = elm.css("font-weight");
		if (value == "bold") value = "700";
		else if (value == "normal") value = "400";

		Select.set($(".selectFontWeight"), value);
		/****************/

		// прячем некоторые значения
		var listOptionV = $(".selectFontWeight .option");
		listOptionV.css("display", "none");
		// по умолчанию
		listOptionV.filter("[value='400']").css("display", "block");
		listOptionV.filter("[value='700']").css("display", "block");

		// если он не google 
		var fontPropertyV = Data.site.font[curFontV];
		if (!fontPropertyV || !fontPropertyV["link"]) return false;
		// если нет этого параметра
		var fontWeightV = fontPropertyV["weight"];
		if (!fontWeightV) return false;

		// показываем толщину
		for (var weightValueV in fontWeightV) {
			listOptionV.filter("[value='"+weightValueV+"']").css("display", "block");
		}
	}

	// межстрочный интервал
	this.setLineHeight = function(elm)
	{
		var lineHeight = elm.css("line-height");

		if (lineHeight == "normal") {
			lineHeight = parseInt(elm.css("font-size")) * 1.5;
		}

		lineHeight = parseInt(lineHeight);
		$(".valueTextLineHeight").val(lineHeight);
	}

	/**
	* Установка ширины
	*
	* @see 	this.set()
	*/
	this.setWidth = function(elm)
	{
		var textWidth = elm.css("letter-spacing");
		textWidth = parseInt(textWidth);
		$(".valueTextWidth").val(textWidth);
	}

	/**
	* Устанавливаем сам текст
	*
	* @see 	this.set()
	*/
	this.setSelfText = function(elm)
	{
		if (elm.hasClass("submit")) {
			var text = elm.val();
		} else if (elm.hasClass("input") || elm.hasClass("textarea")) {
			var text = elm.attr("placeholder");
		} else {
			var text = elm.find("> .element-content").html();
			if (text) text = text.replace(/<br\/?>/gim, "\n");
		}

		if (text) text = text.trim();
		$(".valueText").val(text);
	}

	/**
	* Установить фон
	*
	* @see 	this.set()
	*/
	this.setBg = function(elm)
	{
		var type = Element.data.type;
		// только у текста и заголовка
		if (type != "text" && type != "heading") {
			$(".menuStyleTextBg").css("display", "none");
			return false;
		} else {
			$(".menuStyleTextBg").css("display", "block");
		}

		var colorRgba = elm.find(">span").css("background-color");
		var elmEvent = $('.valueTextBgColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);
	}

	this.setTransform = function(elm)
	{
		var valueV = elm.css("text-transform");
		Select.set($(".selectTextTransform"), valueV);
	}

	// перенос строки
	this.setWordWrap = function(elm)
	{
		var valueV = elm.css("word-wrap");
		Select.set($(".selectTextWordWrap"), valueV);
	}

	this.editWordWrap = function(elm, value)
	{
		elm.css("word-wrap", value);
	}

/***************************************************************************************/
/******************************************************************************************/
	// изменение

	//шрифт
	this.editFamily = function(elm, value)
	{
		elm.css("font-family", value);

		this.setWeight(elm, value);
	}

	// размер
	this.editSize = function(elm, value)
	{		
		if (value < 5) value = 5; 
		elm.css("font-size", value+'px');

		this.setLineHeight(elm);
	}

	// цвет
	this.editColor = function(elm, value)
	{
		if (!value.match(/^rgb/gim)) value = "#" + value;
		elm.css("color", value);
		ElementCss.set("geometry", elm);
	}

	// выравнивание
	this.editAlign = function(elm, value)
	{
		elm.css("text-align", value)
	}

	this.editWeight = function(elm, value)
	{
		elm.css("font-weight", value);
	}

	// стиль
	this.editStyle = function(elm, value, elmEvent)
	{
		var cssStyle = '';
		switch (value) {
			case "bold": cssStyle = "font-weight"; break;
			case "italic": cssStyle = "font-style"; break;
			default: cssStyle = "text-decoration";
		}	

		var isChosen = elmEvent.attr("chosen");

		// отключение стиля
		if (!isChosen) value = cssStyle == "text-decoration" ? "none" : "normal";

		// для всех остальных
		// if (isChosen == "true") {
			elm.css(cssStyle, value);

			// скидуем вторую кнопку
			if (elmEvent.attr("is-decoration") == "true") {
				var styleReset = value == "underline" ? "line-through": "underline";
				$(".menuButTextStyle[value='"+styleReset+"']").removeAttr("chosen");
			}
		// } else {
		// 	ElementCss.clear(cssStyle, "style", elm);	
		// }
	}

	// межстрочный интервал
	this.editLineHeight = function(elm, value) 
	{
		var elmFontSize = parseInt(elm.css("font-size"));
		value = parseFloat(value);
		if (!value) value = 1;
		value = value / elmFontSize;
		value = parseFloat(value.toFixed(2));

		elm.css("line-height", value);

	}

	// изменение 
	this.editWidth = function(elm, value)
	{
		value = parseInt(value);
		value += "px";
		elm.css("letter-spacing", value);
	}

	// сам текст
	this.editSelf = function(elm, value)
	{
		if (!value) value = "";
		
		if (elm.hasClass("submit")) {
			var text = elm.val(value);
		} else if (elm.hasClass("input") || elm.hasClass("textarea")) {
			elm.attr("placeholder", value);
		} else {
			if (value) value = value.replace(/\n/gim, "<br/>");
			elm.find("> .element-content").html(value);
		}
	}

	/**
	* Цвет фона
	*
	*/
	this.editBg = function(elm, value) {
		elm = elm.find("> span");
		elm = Element.getAllObject(elm);
		elm.attr("is-color", "true");

		var colorRgba = Color.getRgbaFromMenu($(".valueTextBgColor"));

		elm.css("background-color", colorRgba);
		ElementCss.set("geometry", elm);
	}

	this.editTransform = function(elm, value)
	{
		elm.css("text-transform", value);
	}

	/**
	* Цвет подсказки
	*
	*
	*/
	this.editPlaceholderColor = function(elm, value)
	{
		var colorV = Color.getRgbaFromMenu($(".valuePlaceholderColor"));
		ElementCss.setStyle({"placeholder":colorV}, elm, "desktop", "static");
	}

/**********************************************************************************************/
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/
	this.setEvent = function()
	{
		this.setEventAddFont()
	}

	/**
	* Добавить новый шрифт
	*
	*
	* @see 	this.setEventMenu()
	*/
	this.setEventAddFont = function()
	{
		$(".butAddFont").off("mousedown");
		$(".butAddFont").on("mousedown", function() {
			StyleFont.show();
		});
	}
/**********************************************************************************************/
/**********************************************************************************************/
} //end class









StyleMenuAnimate.prototype = StyleMenu;
var StyleMenuAnimate = new StyleMenuAnimate();
function StyleMenuAnimate() {
	this.durationDefault = 1500;
	this.delayDefault = 300;

	this.set = function(elm)
	{
		var loadValueV = elm.attr("data-hlp-animated-load");
		if (!loadValueV) loadValueV = "none";
		Select.set($(".selectAnimatedLoad"), loadValueV);
		
		var scrollValueV = elm.attr("data-hlp-animated-scroll");
		if (!scrollValueV) scrollValueV = "none";
		Select.set($(".selectAnimatedScroll"), scrollValueV);

		var hoverValueV = elm.attr("data-hlp-animated-hover");
		if (!hoverValueV) hoverValueV = "none";
		Select.set($(".selectAnimatedHover"), hoverValueV);

		// тип события
		this.setEventType(elm);

		/**/
		// dalay
		this.setProperty(elm, "delay", false, $(".valueSettingAnimateDelay"));
		this.setProperty(elm, "delay", "hover", $(".valueSettingAnimateDelayHover"));

		// duration
		this.setProperty(elm, "duration", false, $(".valueSettingAnimateDuration"));
		this.setProperty(elm, "duration", "hover", $(".valueSettingAnimateDurationHover"));
	}

	this.setProperty = function(elm, type, stateV, inputObjV)
	{
		var propertyValueV = ElementCss.getStyle("animation-"+type, "style", elm, "desktop", stateV);
		var classAddedStatusV = Element.existClassAdded(elm);
		if (!propertyValueV && classAddedStatusV) {
			var classUniqV = Element.getClassUnique(elm);
			propertyValueV = ElementCss.getStyle("animation-"+type, "style", elm, "desktop", stateV, classUniqV);
		}

		if (propertyValueV) {
			propertyValueV = parseFloat(propertyValueV);
			propertyValueV = parseInt(propertyValueV * 1000);
		} else {
			if (type == "duration") {
				// propertyValueV = parseFloat(elm.css("animation-duration"));
				// propertyValueV *= 1000;
				propertyValueV = this.durationDefault;
			} else {
				propertyValueV = this.delayDefault;
			}
		}

		inputObjV.val(propertyValueV);
	}

	this.setEventType = function(elm)
	{
		var eventTypeV = elm.attr("data-animated-event");
		if (!eventTypeV) eventTypeV = "scroll";

		var scrollBlockVisible = eventTypeV == "scroll" ? "block" : "none";
		var loadBlockVisible = eventTypeV == "load" ? "block" : "none";
		$(".menuRowAnimateScroll").css("display", scrollBlockVisible);
		$(".menuRowAnimateLoad").css("display", loadBlockVisible);

		Select.set($(".selectAnimatedEventType"), eventTypeV);
	}

/*********************************************************************************/

	this.editEventType = function(elm, value)
	{
		var classUniqV = Element.getClassUnique(elm);
		var listElmV = $("."+classUniqV);

		listElmV.attr("data-animated-event", value);
		listElmV.removeAttr("data-hlp-animated-scroll");
		listElmV.removeAttr("data-hlp-animated-load");

		// var listElmScrollV = this.getAllObjV(elm, "scroll");
		// listElmScrollV.removeAttr("data-hlp-animated-scroll");
		// var listElmLoadV = this.getAllObjV(elm, "load");
		// listElmLoadV.removeAttr("data-hlp-animated-load");
		
		this.set(elm);
	}

	this.editLoad = function(elm, value)
	{
		this.editAnimate(elm, "load", value);
	}

	this.editScroll = function(elm, value)
	{
		this.editAnimate(elm, "scroll", value);
	}

	this.editHover = function(elm, value)
	{
		this.editAnimate(elm, "hover", value);
	}

	this.editAnimate = function(elm, typeV, value)
	{
		var listElmObjV = this.getAllObjV(elm, typeV);

		if (value == "none") {
			listElmObjV.removeAttr("data-hlp-animated-"+typeV);
		} else {
			listElmObjV.attr("data-hlp-animated-"+typeV, value);
		}
	}

	this.getAllObjV = function(elm, typeV)
	{
		var animPropV = "data-hlp-animated-"+typeV;
		var animPropValueV = elm.attr(animPropV);
		var listElmV = Element.getAllObject(elm);

		if (animPropValueV) {
			listElmV = listElmV.filter("["+animPropV+"='"+animPropValueV+"']");
		} else {
			listElmV = listElmV.not("["+animPropV+"]");
		}

		return listElmV;
	}

	/**
	* Перенес в Element.addStdAddedClass()
	*
	* Когда изменяется класс
	*
	* @see 	StyleMenuFixed.editClass() 
	* @see 	StyleMenuFixed.setEventAddClass()
	* @see 	ElementBasic.createAction() StyleMenuAnimate.editClass
	*/
	// this.editClass = function(originElmV, newElmV)
	// {
	// 	if (!originElmV.length) return false;

	// 	var eventTypeV = originElmV.attr("data-animated-event");
	// 	newElmV.attr("data-animated-event", eventTypeV);

	// 	var anmTypeLoad = originElmV.attr("data-hlp-animated-load");
	// 	var anmTypeScroll = originElmV.attr("data-hlp-animated-scroll");
	// 	var anmTypeHover = originElmV.attr("data-hlp-animated-hover");

	// 	if (anmTypeLoad) newElmV.attr("data-hlp-animated-load", anmTypeLoad);
	// 	if (anmTypeScroll) newElmV.attr("data-hlp-animated-scroll", anmTypeLoad);
	// 	if (anmTypeHover) newElmV.attr("data-hlp-animated-hover", anmTypeLoad);
	// }

/********************************************************************************/

	this.editDelay = function(elm, value, elmEvent)
	{
		this.editProperty(elm, value, elmEvent, "delay");
	}

	this.editDuration = function(elm, value, elmEvent)
	{
		this.editProperty(elm, value, elmEvent, "duration");
	}

	this.editProperty = function(elm, value, elmEvent, type)
	{
		if (value) value = parseInt(value);
		elmEvent.val(value);

		var stateV = elmEvent.attr("data-state");

		value = value / 1000;
		value = parseFloat(value.toFixed(2));
		elm.css("animation-"+type, value+"s");
		ElementCss.set("style", elm, "desktop", false, stateV);
	}

	/**
	* Сброс стилей
	*
	* @see 	ElementCss.actionAfterClearing()
	*/
	this.resetStyle = function(elm)
	{
		if (!elm) elm = Element.obj;

		var elmClassUniqV = Element.getClassUnique(elm);
		var elmNoClassAddedV = $("."+elmClassUniqV).not("[class-added]");

		var listTypeEventV = ["load", "scroll", "hover"];
		for (var iEvent in listTypeEventV) {
			var eventTypeV = listTypeEventV[iEvent];
			var listAllObjV = this.getAllObjV(elm, eventTypeV);

			var eventPropV = "data-hlp-animated-"+eventTypeV;
			var eventPropValueV = elmNoClassAddedV.attr(eventPropV);
			
			listAllObjV.removeAttr(eventPropV);

			// если есть доп класс
			if (Element.existClassAdded(elm) && eventPropValueV) {
				listAllObjV.attr(eventPropV, eventPropValueV);
			}
		}
	}

	/**
	* Очищает все от анимаций
	*
	* @see 	Editor.modeEdit()
	* @see 	Page.replace()
	* @see 	Site.clearHtml()
	*/
	this.clearAll = function()
	{
		var listElm = $(".animated");
		var countElmV = listElm.length;
		for (var iElm = 0; iElm < countElmV; iElm++) {
			var elmObjV = listElm.eq(iElm);

			var anmTypeLoad = elmObjV.attr("data-hlp-animated-load");
			var anmTypeScroll = elmObjV.attr("data-hlp-animated-scroll");
			var anmTypeHover = elmObjV.attr("data-hlp-animated-hover");

			elmObjV.removeClass("animated")
					.removeClass(anmTypeLoad)
					.removeClass(anmTypeScroll)
					.removeClass(anmTypeHover)
					.removeAttr("data-hlp-offset-top");
		}

	}

} // end class

/**
* Работа с единицей
*
*
*
*/
var StyleUnit = new StyleUnit();
function StyleUnit() {
	/**
	* Список полей по стилям
	*
	* @see 	this.getPropertyUnit()
	* @see 	this.getUnitField()
	* @see 	this.translate()
	*/
	this.listClass = {
		"width":"valueWidth",
		"min-width":"valueMinWidth",
		"max-width":"valueMaxWidth",
		"height":"valueHeight",
		"min-height":"valueMinHeight",
		"max-height":"valueMaxHeight",
		"top":"valuePositionTop",
		"left":"valuePositionLeft",
		"bottom":"valuePositionBottom",
		"right":"valuePositionRight",
		"margin-top":"valueMarginTop",
		"margin-bottom":"valueMarginBottom",
		"margin-left":"valueMarginLeft",
		"margin-right":"valueMarginRight",
		"padding-top":"valuePaddingTop",
		"padding-bottom":"valuePaddingBottom",
		"padding-left":"valuePaddingLeft",
		"padding-right":"valuePaddingRight",
		"background-size":"valueBgImgSize",
		"background-position-left":"valueBgPositionLeft",
		"background-position-top":"valueBgPositionTop"
	}

	/**
	* Список стилей
	*
	* @see 	this.translate()
	* @see 	this.getPropertyByClass()
	* @see 	SpecialInput.editValue()
	*/
	this.listProperty = {
		"valueWidth":"width",
		"valueMinWidth":"min-width",
		"valueMaxWidth":"max-width",

		"valueHeight":"height",
		"valueMinHeight":"min-height",
		"valueMaxHeight":"max-height",


		"valuePositionTop":"top",
		"valuePositionLeft":"left",
		"valuePositionBottom":"bottom",
		"valuePositionRight":"right",
		"valueMarginTop":"margin-top",
		"valueMarginBottom":"margin-bottom",
		"valueMarginLeft":"margin-left",
		"valueMarginRight":"margin-right",
		"valuePaddingTop":"padding-top",
		"valuePaddingBottom":"padding-bottom",
		"valuePaddingLeft":"padding-left",
		"valuePaddingRight":"padding-right",
		"valueBgImgSize":"background-size",
		"valueBgPositionLeft":"background-position-left",
		"valueBgPositionTop":"background-position-top"
	}


	/**
	* Текущий input с которым работаем
	*
	* @set 	this.translate()
	* @see 	this.getParentValue()
	*/
	this.currentInput = false;
/*******************************************************************************************/
	/**
	* Отдает параметр по классу
	*
	*
	* @see 	this.setValueMenu() 
	* @see 	this.getUnitMenu() 
	* @see 	this.getUnitField()
	*/
	this.getClassByProperty = function(property) 
	{
		return this.listClass[property];
	}

	/**
	* Отдает параметр по классу
	*
	* @see 	Key.incDecInput()
	*/
	this.getPropertyByClass = function(elmClass)
	{
		return this.listProperty[elmClass];
	}
/*********************************************************************************************/
	/**
	* Отдает значение свойства
 	*
	* @see 	StyleMenuGeometry.set*()
	*/
	this.setMenuProperty = function(elm, property, propertyType, value)
	{
		/*******/
		if (!value && property == "max-height") {
			value = elm.css(property);
			// if (value == "none") value = "100vh";
			if (value == "none") value = "auto";
		} else if (!value && property == "max-width") {
			value = elm.css(property);
		}
		/*******/

		if (!propertyType) propertyType = "geometry";
		if (!value) {
			value = ElementCss.getStyleAllScreen(property, propertyType, false, elm);
		}

		if (!value && Element.existClassAdded()) {
			var uniqueClass = Element.getClassUnique(elm);
			value = ElementCss.getStyleAllScreen(property, propertyType, uniqueClass, elm);
		}

		// если нету значение в css массиве
		if (!value) {
			var defaultUnit = this.getDefaultUnit(property);
			if (defaultUnit == "auto") {
				value = "auto";
			} else {
				value = elm.css(property);
				if (defaultUnit != "px") {
					value = this.pxToPercent(value, property, elm);
					if (!parseFloat(value)) value = "0"+defaultUnit;
				}
			}
				
		}

		// ставим единицу в меню
		this.setUnitMenu(property, value);
		// значение в меню
		if (value != "auto" && value != "full") value = parseInt(value);
		this.setValueMenu(property, value);
	}

	/**
	* Отдает значение по умолчанию
	*
	* @see 	this.setMenuProperty()
	* @see 	StyleMenuGeometry.setMGWidth()
	*/
	this.getDefaultUnit = function(property)
	{
		if (property == "height") {
			return "auto";
		} else if (property == "max-width") {
			return "%";
		} else {
			return "px";	
		}
		return "px";
		
		// if (!property) return "px";
		// else if (Element.data.type == "section" && property == "width" && Screen.isDesktop()) return "px"; 
		// else if (property.match(/(padding)|(top)|(bottom)|(height)|(border)/)) return "px";
		// else return "%";
	}

	/**
	* Устанавливает все по умолчанию
	*
	* @see 	ElementBasic.setUnitMenu()
	*/
	this.setAllDefault = function()
	{
		StyleUnit.setUnitMenu("height", "px");
		StyleUnit.setUnitMenu("width", "px");

		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("bottom", "px");
		// StyleUnit.setUnitMenu("left", "%");
		// StyleUnit.setUnitMenu("right", "%");
		StyleUnit.setUnitMenu("left", "px");
		StyleUnit.setUnitMenu("right", "px");

		StyleUnit.setUnitMenu("padding-top", "px");
		StyleUnit.setUnitMenu("padding-bottom", "px");
		StyleUnit.setUnitMenu("padding-left", "px");
		StyleUnit.setUnitMenu("padding-right", "px");

		StyleUnit.setUnitMenu("margin-top", "px");
		StyleUnit.setUnitMenu("margin-bottom", "px");
		// StyleUnit.setUnitMenu("margin-left", "%");
		// StyleUnit.setUnitMenu("margin-right", "%");
		StyleUnit.setUnitMenu("margin-left", "px");
		StyleUnit.setUnitMenu("margin-right", "px");
	}
/*******************************************************************************************/
	
	/**
	* Перевод пикселий в  проценты
	*
	* @see 	this.translateBg()
	* @see 	this.setMenuProperty()
	* @see 	ElementCss.updateStyle()
	* @see 	Key.incDecInput()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	SpecialInput.editValue()
	*/
	this.pxToPercent = function(valuePx, style, elm)
	{
		// var currentUnit = "%";
		var currentUnit = StyleUnit.getUnitMenu(style);
		if (!elm) elm = Element.obj;
		if (!parseFloat(valuePx)) return "0"+currentUnit;

		valuePx = valuePx.toString();

		// если процент то возращаем
		if (valuePx.indexOf(currentUnit) > 0) return valuePx; 

		// значение от которого делать расчет
		// var parentValue = this.getParentValue(elm, style);
		if (currentUnit == "vh") var parentValue = $("body").height();
		else if (currentUnit == "vw") var parentValue = $("body").width();
		else var parentValue = this.getParentValue(elm, style);

		// получаем значение
		var value = parseFloat(valuePx);
		value = (value / parentValue)*100;

		// преобразовываем
		if (elm.css("float") == "none" 
				|| (style != "width" && style != "margin-left" && style != "margin-right")) {
			value = value.toFixed(5);
		}

		value = parseFloat(value);
		if (style == "width" && value > 99 && value < 100) value = 100;

		/*нужно протестировать, может нужно и убрать*************/		
		value = parseInt(value);
		/**********/

		return value+currentUnit;
	} 

	/**
	* Конвертирует проценты в px
	*
	* @see 	this.translateBg()
	* @see 	this.getParentValue()
	* @see 	StyleMenutGomettry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	*/
	this.percentToPx = function(valuePersent, style, elm)
	{
		if (!elm) elm = Element.obj;
		
		valuePersent = valuePersent.toString();
		// если процент то возращаем
		if (valuePersent.indexOf("px") > 0) return valuePersent; 
		// значение от которого делать расчет
		var parentValue = this.getParentValue(elm, style);
		var valuePx = parentValue * (valuePersent / 100);
		// console.log(parentValue+"->"+valuePersent);
		// valuePx -= 0.1;

		return valuePx;
	}


	/**
	* Отдает значение родителя
	*
	* @see 	this.pxToPercent()
	* @see 	this.percentToPx()
	*/
	this.getParentValue = function(elm, property)
	{
		var value = 0;
		
		if (elm.hasClass("modal")) var elmParent = $(".contentModal .modalWrap");//var elmParent = $(".contentWrap .content");
		else var elmParent = elm.parent();

		if (property == "height" || property == "min-hieght") {
			value = elmParent.height();
		} else if (property.match(/background-position/)) {
			if (this.currentInput.hasClass("valueBgPositionLeft")) {
				value = elm.width();
			} else {
				var unitBgSite = this.getUnitMenu("background-size");
				value = $(".valueBgImgSize").val();
				if (value == "auto") value = 100;
				else if (unitBgSite == "%") value = this.percentToPx(value, "background-size");
				value = parseFloat(value)/2;

				value = elm.height();
			}
		} else if (property.match(/padding/) || property.match(/background/)) {
			value = elm.width();
		} else if (property == "top") {
			value = Element.getHeight(elm.parent());
		} else {
			value = Element.getParentWidth(elm);
		}

		return value;
	}
/**********************************************************************************************/
	/**
	* Установить значение в меню
	*
	* @see 	this.setMenuProperty()
	* @see 	ElementCss.updateStyle()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	ElementCss.updateStyle()
	*/
	this.setValueMenu = function(style, value)
	{
		var inputClass = this.getClassByProperty(style);
		if (value != "auto" && value != "full") value = parseInt(value);
		// console.log(style +"->"+ value)

		$("."+inputClass).val(value); 
	}
/**********************************************************************************************/
	/**
	* Отдает единицу из меню
	*
	* @see 	this.getParentValue()
	* @see 	ElementCss.updateStyle()
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft(), .editPaddingVer
	* @see 	Editor.editSize()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleMunuGeometry.editWidth()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	SpecialInput.editValue()
	* @see 	ElementBasic.setCssNewElm()
	*/
	this.getUnitMenu = function(property)
	{
		// var unit = "px";
		var unit = this.getDefaultUnit(property);

		var filedClass = this.getClassByProperty(property);
		if (filedClass) { 
			var field = this.getUnitField(property);//поле
			unit = field.attr("type");//получаем единицу
		} 

		if (unit == "auto") {
			// unit = "%";
			unit = this.getDefaultUnit(property);
			this.setUnitMenu(property, unit);
			/**********************/
			// this.setUnitMenu(property, unit);
			/********************/
		}

		return unit;
	}

	/**
	* Ставит единицу в меню
	*
	* @see 	this.getPropertyValue()
	* @see 	this.getUnitMenu()
	* @see 	StyleMenuGeometry.editPositionAlign()
	* @see 	ElementBasic.create() .setCssNewElm()
	* @see 	Key.incDecInput()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleMenuGeometry.setMGWidth(), .setValueWithOffset()
	* @see 	ElementModal.actionAfter()
	* @see 	ElementMan.setStyle();
	* @see 	StyleCanvas.moveElement()
	* @see 	ElementSlider.addButToggle()
	*/
	this.setUnitMenu = function(property, value)
	{
		if (!$.isNumeric(value)) {
			var unit = value.replace(/[0-9\.\-]+/gim, '');
		} else {
			var unit = this.getDefaultUnit(property);
		}
		
		var field = this.getUnitField(property);

		field.attr("type", unit);
		if (unit.match(/(auto)|(full)/gim)) unit = "-";

		field.text(unit);
	}

	/**
	* Отдает поле единицы
 	*
 	* @see 	this.getUnitMenu()
	* @see 	this.setUnitMenu()
	* @see 	this.translate()
	*/
	this.getUnitField = function(property, field)
	{
		if (!field) {
			var fieldClass = this.getClassByProperty(property);
			field = $("."+fieldClass);
		}
		
		field = field.closest(".inputBlock").find(".inputUnitCurrent");

		return field;
	}
/********************************************************************************************/
	/**
	* Переводим значение
	*
	* @see 	SpecialInput.setEventSelectUnit()
	*/
	this.translate = function(inputElm, newUnit)
	{
		var currentField = this.getUnitField(false, inputElm);
		if (currentField.attr("type") == newUnit) return false;

		this.currentInput = inputElm;
		var elm = Element.obj;
		var inputClass = inputElm.attr("class");
		var property = this.getPropertyByClass(inputClass); 

		if (elm.hasClass("section") && property.match(/(width)|(height)/gim)) {
			elm = elm.find("> .section-content");
		}

		//ставим на кнопки единицу 
		var elmButCurrent = inputElm.closest(".inputBlock").find(".inputUnitCurrent");
		var oldUnit = elmButCurrent.attr("type");
		var newUnitText = newUnit.match(/(auto)|(full)/gim) ? "-" : newUnit;
		elmButCurrent.attr("type", newUnit).text(newUnitText);

		// для bg особенность 
		if (property.match(/background/)) {
			this.translateBg(inputElm, property, newUnit, oldUnit);
			return false;
		}

		// получаем значение
		var value = elm.css(property);
		if (newUnit == "auto") {
			value = "auto";
		} else {
			value = parseFloat(value);
		}

		if (property == "min-width") {
			if (oldUnit == "%") value = elm.width();
			else if (oldUnit == "vw") value = $("body").width();
			else if (oldUnit == "vh") value = $("body").height();
		}

		var listStyle = {};
		listStyle[property] = value;

		if (Element.isSectionContentStyle(elm, property)) {
			ElementCss.set("geometry", elm, false, listStyle, false, "hlp-section-content");
		} else {
			ElementCss.setStyle(listStyle, elm);
		}

		this.currentInput = false;
		History.record();
	}

	/**
	* Перевод для bg
	*
	* @see 	this.translate()
	*/
	this.translateBg = function(inputElm, property, newUnit, oldUnit)
	{
		if (newUnit == "full") {
			value = "full";
		} else if ( (newUnit == "px" || newUnit == "%") && oldUnit != "px" && oldUnit != "%" ) {
			var value = newUnit == "px" ? 100 : 50; 
		} else {
			var value = inputElm.val();
			if (newUnit == "%") value = this.pxToPercent(value, property);
			else if (newUnit == "px") value = this.percentToPx(value, property);
			else value = "auto";

			if (value != "auto") {
				value = parseFloat(value);
				value = value.toFixed(2);
			}
		}
		
		// convertPxToPercent
		inputElm.val(value).change();
	}
/**************************************************************************************************/	

} //end class


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





/**
* Добавление фона
*
*
*
*/
var StyleFont = new StyleFont();
function StyleFont() {
	/**
	* Статус установки шрифтов в редактор
	*
	* @set 	this.setFontInEditor()
	* @see 	Page.replacce()
	*/
	this.isSetEditor = false;

/*******************************************************************************************/	
	/**
	* Показывает модальное окно
	*
	* @see 	ElementStyleController.setEventAddFont()
	*/
	this.show = function()
	{
		// создаем модальное
		var content = this.getContent();
		content += this.getBlockEmpty();

		Modal.create({
			"id":"modalAddFont",
			"title":Resource.hlp_modal_font_title,
			"content":content,
			"width":600,
			"top":30,
			"button":[
				['ok', Resource.hlp_modal_font_but_ttf],
				['add', Resource.hlp_modal_font_but_google]
			]
		});

		// обновляем список шрифтов
		this.uploadListFont(true);

		//ставим события
		this.setEvent(); 
	}

	/**
	* Отдает содержимое 
	*
	* @see 	this.show()
	*/
	this.getContent = function()
	{
		// if (!countFont) return '<div class="emptyModalBlock">У вас нету добавленых шрифтов</div>';

		var content = '\
			<table class="tableFont">\
				<tr class="tableFontHeading">\
					<th class="tableFontNumber">№</th>\
					<th class="tableFontName">'+Resource.hlp_modal_font_table_name+'</th>\
					<th class="tableFontSource">'+Resource.hlp_modal_font_table_source+'</th>\
					<th class="tableFontMan"></th>\
				</tr>\
			</table>';
		content += "";

		return content;
	}
/*********************************************************************************************/
	/**
	* Отдает пустой блок
	*
	* @see 	this.show()
	*/
	this.getBlockEmpty = function()
	{
		var block = '<div class="emptyModalBlock">'+Resource.hlp_modal_font_label_empty+'</div>';
		return block;
	}

	/**
	* Ставит значение display пустому блоку
	*
	* @see 	this.uploadListFont()
	*/
	this.setDisplayEmptyBlock = function()
	{
		if ($(".tableOneFont").length) {
			var displayBlock = "none";
			var displayTable = "block";
		} else {
			var displayBlock = "block";
			var displayTable = "none";
		}

		$(".emptyModalBlock").css("display", displayBlock);
		$(".tableFont").css("display", displayTable);
	}

/********************************************************************************************/
	/**
	* Обновляет список шрифтов
	*
	* @see 	this.show()
	* @see 	this.setEventAddLink()
	* @see 	this.deleteFont();
	*/
	this.uploadListFont = function(noEditor)
	{
		// удаляем шрифты
		$(".tableOneFont").remove();

		// вставляем обновленный список
		var block = this.getBlockListFont();
		$("#modalAddFont table").append(block);//в модальное окно

		//ставим события
		this.setEvent();

		// ставим значение
		this.setDisplayEmptyBlock();
	}

	/**
	* Отдает блок списка шрифтов
	*
	* @see 	this.uploadListFont()
	*/
	this.getBlockListFont = function()
	{
		var listFont = Data.site.font;
		var i = 1;
		var blockGoogle = '';
		var blockLocal = '';
		for (var family in listFont) {
			var font = listFont[family];
			var row = this.getBlockFont(font, i);
			if (font["local"]) blockLocal += row;
			else blockGoogle += row; 

			i++;
		}

		var block = blockGoogle + blockLocal;
		return block;
	}

	/**
	* Отдает блок одного шрифта
	*
	* @see 	this.getBlockListFont()
	*/
	this.getBlockFont = function(font, number)
	{
		if (font["local"]) {
			var fontSource = Resource.hlp_modal_font_type_local;
			var butEditObjV = '';
		} else {
			var fontSource = "Google Fonts";
			var butEditObjV = '<div class="butManFont butEditFont">'+Resource.main_modal_but_edit+'</div>';
		}

		var row = '\
				<tr class="tableOneFont" data-place="'+font["local"]+'" font="'+font.family+'">\
					<td class="tableFontNumber">'+number+'</td>\
					<td class="tableFontName" style="font-family:'+font.family+';">'+font.family+'</td>\
					<td class="tableFontSource">'+fontSource+'</td>\
					<td class="tableFontMan">\
						<div class="butManFont butDeleteFont">'+Resource.hlp_modal_font_but_delete+'</div>\
						'+butEditObjV+'\
					</td>\
				</tr>';

		return row;
	}
/*************************************************************************************************/
/***************************************************************************************************/
	/**
	* Ставим события
	*
	* @see 	this.show()
	*/
	this.setEvent = function()
	{
		// добавление
		this.setEventAdd();
		// удаление
		this.setEventDelete();
		// изменение
		this.setEventEdit();
		
		// инструкция
		this.setEventUpload();
	}
/**********************************************************************************************/
	/**
	* Добавление шрифта
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var butAdd = $("#modalAddFont .butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			// показываем модальное окно
			obj.showModalAdd();
		});

		// butAdd.mousedown();
	}

	/**
	* Показывает модальное окно для добавление шрифта
	*
	*
	* @see 	this.setEventAdd()
	*/
	this.showModalAdd = function(value, typeOperationV, fontNameV)
	{
		// создаем модальное
		var id = "modalAddLinkFont";
		var placeholder = "<link href='https://fonts.googleapis.com/css?family=Noto+Sans&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		if (!value) value = '';
		var content = '\
			<div class="modalLabel modalAddFontLabel">'+Resource.hlp_modal_font_google_label+' <a href="https://www.google.com/fonts" target="_blank">Google Fonts</a></div>\
			<textarea class="valueAddedFontLink">'+value+'</textarea>';
			
		if (typeOperationV == "edit") {
			var titleV = Resource.hlp_modal_font_modal_title_edit+" "+fontNameV;
			var butTextAddV = Resource.main_modal_but_edit;
		} else {
			var titleV = Resource.hlp_modal_font_modal_title_add;
			var butTextAddV = Resource.main_modal_but_add;
		}

		Modal.create({
			"id":id,
			"title":titleV,
			"content":content,
			"width":650,
			"top":50,
			"button":[['add', butTextAddV]]
		});

		// ставим события
		var modal = $("#"+id);
		this.setEventAddLink(modal);
	}

	/**
	* Событие добавление ссылки шрифта
	*
	* @see 	this.showModalAdd()
	*/
	this.setEventAddLink = function(modal)
	{
		var obj = this;
		var butAdd = modal.find(".butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var input = modal.find(".valueAddedFontLink");
			var isAdd = obj.addLinkFont(input);

			// выводим результат 
			if (isAdd) {
				Modal.removeLast();
				Notification.ok(Resource.hlp_modal_font_notification_add);
				
				obj.fixedChange();

				// обновляем значение текста
				StyleMenuText.set();
			} else { 
				Notification.error(Resource.hlp_modal_font_notification_no_add);
			}
		});
	}

	/**
	* Добавление ссылки фона
	*
	* @see 	this.setEventAddLink()
	* @see 	Data.addListStdFont()
	* @see 	Site.
	*/
	this.addLinkFont = function(elmInput, linkFont)
	{
		if (elmInput && !linkFont) linkFont = elmInput.val();
		
		var hrefFont = linkFont.match(/href=['"]([^"']+)['"]/gim)[0];
		if (!hrefFont) return false;
		
		hrefFont = hrefFont.replace(/'|"/gim, '');
		var propertyString = hrefFont.split("?")[1];
		if (!propertyString) return false;
		
		var listProperty = this.getPropertyLink(propertyString);
		Data.site.font[listProperty.family] = listProperty;

		return true;
	}

	/**
	* Отдает параметры из строки
	*
	*
	* @see 	this.addLinkFont() 
	*/
	this.getPropertyLink = function(propertyString)
	{
		var listProperty = propertyString.split("&");
		var countProperty = listProperty.length;
		var property = {};
		var noSubset = true;
		for (var i = 0; i < countProperty; i++) {
			var propertyItem = listProperty[i].split("=");
			var key = propertyItem[0];
			var value = propertyItem[1];
			// если шрифт
			if (key == "family") {
				var propertyFamily = value.split(":");
				var family = propertyFamily[0].replace(/\+/gim, " ");
				property["family"] = family;

				// ставим тощину
				if (propertyFamily[1]) {
					var weightV = propertyFamily[1];
					var listWeightResV = weightV.split(",");
					var listWeightV = {};
					for (var iWeightV in listWeightResV) {
						var weightItemV = parseInt(listWeightResV[iWeightV]);
						listWeightV[weightItemV] = "yes";
					}
					property["weight"] = listWeightV;
				}
			} else if (key == "subset") { //языки
				property["latin"] = value.match(/latin/) ? true : false;
				property["cyrillic"] = value.match(/cyrillic/) ? true : false;
				noSubset = false;
			}

			if (noSubset) property["latin"] = true;
		} 

		var link = "<link href='https://fonts.googleapis.com/css?"+propertyString+"' rel='stylesheet' type='text/css'>";
		property["link"] = link;

		return property;
	}
/**********************************************************************************************/
	/**
	* Событие удалить шрифт
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		var butDelete = $(".butDeleteFont");
		butDelete.off("mousedown");
		butDelete.on("mousedown", function() {
			var elmEvent = $(this);
			var fontName = elmEvent.closest("tr").attr("font");
			var label = Resource.hlp_modal_font_confirmation_delete + " " + fontName;
			Modal.confirmationDelete(label, function() {
				// если шрифт локально
				if (Data.site.font[fontName]["local"]) {
					obj.deleteFontLocal(fontName);
				} else {
					obj.deleteFont(fontName);
				}
			});
		});
	}

	/**
	* Удаление шрифта локально
	*
	* @see 	this.setEventDelete()
	*/ 
	this.deleteFontLocal = function(fontName)
	{
		var obj = this;
		Modal.removeLast();
		Modal.createLoading(Resource.hlp_modal_font_load_delete);
		ajaxPost('/editor/deleteFont', "font_name="+fontName+"&site_id="+Data.site.site_id, function(req) {
			var res = req.responseText.trim();
			// console.log(res)
			if (res) {
				obj.deleteFont(fontName);
			} else {
				Notification.error();
			}

			Modal.removeLast();		
		})
	}

	/**
	* Удаление шрифта
	* 
	* @see 	this.setEventDelete()
	*/
	this.deleteFont = function(fontName)
	{
		// удаляем шрифт
		delete Data.site.font[fontName];
		// фиксируем изменение
		this.fixedChange();
	}
/**************************************************************************************/
	
	/**
	* Изменить
	*
	* @see 	this.setEvent()
	*/
	this.setEventEdit = function()
	{
		var obj = this;
		var butObj = $(".butEditFont");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var fontFamilyV = $(this).closest(".tableOneFont").attr("font");
			var fontLinkV  = Data.site.font[fontFamilyV]["link"];

			obj.showModalAdd(fontLinkV, "edit", fontFamilyV);
		});
	}


/************************************************************************************/
/*********************************************************************************************/

	/**
	* Событие - инструкция
 	*
	* @see 	this.setEvent() 
	*/
	this.setEventUpload = function()
	{
		var obj = this;
		var modalObj = $("#modalAddFont");
		modalObj.find(".butOk").addClass("h-but-upload-file");
		var parentBut = modalObj.find(".modalBlockButtton");

		File.createButUpload(parentBut, '', "/editor/uploadFonts", "font", Data.site.site_id, function(res) {
			// убираем загрузку
			Modal.deleteLoadind();

			var fontName = res.replace(/\.ttf$/gim, '');

			if (!fontName) {
				Notification.error();
				return false;
			}
			
			obj.addFontLocal(fontName);

			// обновляем список
			obj.fixedChange();

			Notification.ok(Resource.hlp_modal_font_notification_add);
		});	
	}

	/**
	* Добавляет local шрифт 
	*
	* @see 	this.setEventUpload()
	* @see 	Site.setForNewSiteFont()
	*/
	this.addFontLocal = function(fontName)
	{
		Data.site.font[fontName] = {
			"family" : fontName,
			"latin" : true,
			"link" : false,
			"local" : true
		}
	}

/***************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает шрифты в редактор 
	*
	* @see 	this.
	* @see 	this.setEventAddLink()
	* @see 	this.deleteFont()
	* @see 	this.setEventUpload()
	* @see 	Page.replacce()
	*/
	this.setFontInEditor = function() 
	{
		var listFont = Data.site.font;
		// ставимт шрифты заголовок
		this.setFontInHead(listFont);
		// ставит шрифты в меню
		this.setFontInMenu(listFont);

		// отмечаем статус
		this.isSetEditor = true;
	}

	/**
	* Ставит шрифты в заголовке
	*
	* @see 	this.setFontInEditor()
	* @see 	
	*/
	this.setFontInHead = function(listFont)
	{
		var listGoogle = '';
		var listLocal = '<style>';
		for (var family in listFont) {
			var font = listFont[family];
			if (!font.local) {
				listGoogle += font["link"];
				// var fontSrc = font["link"];
				// fontSrc = /href=("|')([^"']+)("|')/gim.exec(fontSrc);
				// fontSrc = fontSrc[2];
				// fontSrc = fontSrc.replace(/\s/gim, '+');
				// listLocal += "@import url("+fontSrc+");\r\n";
			} else {
				var fontFamily = font["family"];
				var userId = Data.userId;
				var fontPath = "/user/" + userId +"/"+Data.site.site_id+"/fonts/"+fontFamily+"/" + fontFamily + ".ttf"; 
				listLocal += "\r\n@font-face { font-family: "+fontFamily+"; src: url("+fontPath+") format('opentype');}\r\n"; 
			}
		}
		listLocal += '</style>';	
		
		// google fonts 
		$(".headListAddedFontGoogle").html(listGoogle);
		// локально шрифт 
		$(".headListAddedFontLocal").html(listLocal);
	}


	/**
	* Ставит шрифты в меню
	*
	* @see 	this.setFontInEditor()
	* @see 	this.uploadListFont()
	*/
	this.setFontInMenu = function(listFont)
	{
		var list = '';
		for (var family in listFont) {
			list += '<div class="option" value="'+family+'" style="font-family:'+family+'">'+family+'</div>';
		}
		$(".menuListAddedFont").html(list);
	}

	/**
	* Зафиксировать изменение
	*
	* @see 	this.deleteFont()
	* @see 	this.setEventUpload()
	*/
	this.fixedChange = function()
	{
		// обновляем список
		this.uploadListFont();
		// обновляем в редакторе
		this.setFontInEditor();
		// сохраняю
		// User.save();
		Site.saveFont();
	}
/************************************************************************************************/
} // end class


/**
* Работа с цветом
*
*
*/
var Color = new Color();
function Color() {
	/**
	* Переводит rgb в html цвет
	*
	* @see 	TextEditor.setMenuColor() 	
	* @see 	ColorPicker.change()
	*/
	this.getHexRGB = function(color)
	{
		if (!color) return '';

		color = color.replace(/\s/g,"");
	  	//var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
	  	var aRGB = color.match(/^rgba?\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)(,[0-9\.]+)?\)$/i);

		if(aRGB) {
			color = "";
			for (var i = 1;  i <= 3; i++) {
				color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,"0$1");
			}
		} else {
			color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, "$1$1$2$2$3$3");
		}  
		return color;
	}

	/**
	* Переводит html в rgb цвет
	*
	* @param 	string 		color_html - цвет в формате Html
	* @return 	string 	 	цвет в формате rgb
	*
	* @see 		MneuStyleEdit.setColorRgba()
	*/
	this.getRGBHex = function(color_hex)
	{ 
		color_hex = color_hex.trim();
		if (!color_hex || color_hex == "transparent") return "0,0,0";

		//поверяем на валидность, должен быть hex
		var valid = color_hex.match(/,/);

		if (!valid) {
			//разбиваем по 2 символа
			var list = color_hex.match(/[a-fA-F0-9]{2}/ig);
			if (list.length == 3) {
				var len = list.length;
				var res = "";
				for (var i = 0; i < len; i++) {
					if (i != 0) res += ", ";
					//переводим в десятичное число
					res += this.convertHexByDecimal(list[i]);
				}  
				return res;
			} else {
				return color_hex;
			}
		} else {
			//очищяем от лишнего
			color_hex = color_hex.replace(/[a-z\(\)]+/ig, "");
			return color_hex;
		}
	}

	/**
	* Преобразывает шестнадцатиричное в десятичное
	*
	* @uses 	this.pow() 		возведение в степень
	* @see 		this.getRgbColor()
 	*/
	this.convertHexByDecimal = function(num)
	{
		//таблица перевода шестнадцеричного числа в десятичный
		var list = {"0":"0", "1":"1", "2":"2", "3":"3", "4":"4", 
					"5":"5", "6":"6", "7":"7", "8":"8", "9":"9", 
					"A":"10", "B":"11", "C":"12", "D":"13", "E":"14", "F":"15", 
					"a":"10", "b":"11", "c":"12", "d":"13", "e":"14", "f":"15"
					}

		var len = num.length; 
		var g = len - 1;
		var res = 0;
		for (var i = 0; i < len; i++, g--) {
			var item = list[num[i]];
			res += g ? item * this.pow(16, g) : parseInt(item);
		}

		return res;
	}

	/**
	* Возвести в степень
	* 
	* @see 	this.convertHexByDecimal()
	*/
	this.pow = function(num, n, res) {
		//если первый вход
		res = res ? res : num;
		//если степень больше 1
		if (n > 1) {
			return this.pow(num, n - 1, res * num)
		} else {
			return res;
		}
	} 
/***************************************************************************************/
	/**
	* Получить цвет в формате rgb
	*
	* @return 	array 		{"1":"color", "2":"opacity"}
	*
	* @see 	 	MenuStyleSet.valueBgColor()
	* @see 	 	this.setMenuColor()
	*/
	this.getColorFromRgba = function(color) {
		//тип цвета
		if (!color) return false;

		var color_type = color.match(/(rgba(?=\())|rgb(?=\()/ig);
		//убираем пробелы
		color = color.replace(/\s/mig, "");

		if (color_type) {
			var patRgb = /^rgb\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3})\)$/ig;
			//формат rgb 
			if (color_type == "rgb") {
				var pat = patRgb;
			//формат rgba
			} else if (color_type == "rgba") {
				//ищем совпадение в формате rgba
				var pat = /^rgba\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}),([0-9\.]+)\)$/ig;
			} else {
				var pat = patRgb;
			}

			//ищем совпадение
			var res = pat.exec(color);
			if (!res) res = ['rgba(0, 0, 0, 0)', '0, 0, 0', '0'];

			//если это не rgba
			res[2] = res[2] ? res[2] : 1;
			//отдаем результат
			return {"1":res[1], "2":res[2]};
		} else {
			return false;
		}
	}



/********************************************************************************************/
	/**
	* Отдает rgba из меню
	*
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBg.setColorRgba()
	* @see 	StyleMenuBg.editVideoOpacity()
	* @see 	StyleMenuText.editBg()
	* @see 	StyleMenuBorder.editBorderSide()
	*/
	this.getRgbaFromMenu = function(elmEvent, noTransparent)
	{
		var parentObj = elmEvent.closest(".menuStyleItemValue");

		// получаем opacity
		var inputOpacityObj = parentObj.find('.valueMenuColorOpacity');
		var bgOpacity = inputOpacityObj.val();
		if (bgOpacity != 0) {
			bgOpacity = bgOpacity / 100;
		} else {
			bgOpacity = 0;
		}

		if (!bgOpacity && !inputOpacityObj.length) bgOpacity = 1;

		//цвет из меню
		var colorHex = parentObj.find('.colorpickerField').val();
		var colorRgb = Color.getRGBHex(colorHex);//получить в формате rgb

		// если 0 то удаляем
		if (parseFloat(bgOpacity) == 0 && !noTransparent) {
			var colorRgba = "transparent";
		} else {
			bgOpacity += 0.005;
			bgOpacity = parseFloat(bgOpacity.toFixed(2));
			
			var colorRgba = 'rgba('+colorRgb+', '+bgOpacity+')';
		}

		return colorRgba;
	}

	this.getHexFromMenu = function(inputColorV)
	{
		var color = Color.getRgbaFromMenu(inputColorV);
		color = Color.getHexRGB(color);
		if (!color) color = "#000000";
		else color = "#"+color;

		return color;
	}
/********************************************************************************************/
	/**
	* Ставит в меню gb
	*
	* @see 	StyleMenuBg.setColor()
	* @see 	StyleMenuBg.setVideoOpacity()
	* @see 	StyleMenuText.setBg()
	* @see 	StyleMenuBorder.setColor()
	*/
	this.setRgbaInMenu = function(elmEvent, colorRgba)
	{
		if (colorRgba) var listProperty = this.getPropertyColor(colorRgba);
		else var listProperty = ["000000", 0];

		var parentObj = elmEvent.closest(".menuStyleItemValue");
		parentObj.find('.colorpickerField').val(listProperty[0]);
		parentObj.find('.valueMenuColorOpacity').val(listProperty[1]);
	}

	/**
	* Отдает параметры цвета
	*
	* @see 	this.setRgbaInMenu()
	*/
	this.getPropertyColor = function(colorRgba)
	{	
		//цвет в формате 1-rgb и 2-opacity(bg) 
		var list = Color.getColorFromRgba(colorRgba);
		var colorValue = list[1];
		var opacityValue = list[2];

		if (colorValue) {
			colorValue = 'rgb('+colorValue+')';
			// если в 0 opacity и элемент по умолчанию прозрачный
			if (opacityValue == 0 && this.isElmDefaultTransparent()) {
				// opacityValue = 1;
			}
		} else {
			colorValue = colorRgba;
			opacityValue = 1;
		}

		//устанавливаем цвет в input
		var colorHex = Color.getHexRGB(colorValue);

		opacityValue = parseInt(opacityValue*100);

		return [colorHex, opacityValue];
	}

	/**
	* Элемент прозрачный по умолчанию
	*
	* @see this.getPropertyColor()
	*/
	this.isElmDefaultTransparent = function()
	{
		var elmType = Element.data.type;
		var listType = ["row", "column", "text", "heading", "image"];
		for (var indexType in listType) {
			if (elmType == listType[indexType]) return true;
		}

		return false;
	}	
/********************************************************************************************/
}//end class



 /**
* Работа с css элемента
*
*
*/
var ElementCss = new ElementCss();
function ElementCss() {
	/**
	* Список стилей для страницы 
	*
	* @set 	this.setStyle()
	* @see 	StyleMenu.set()
	*/
	this.listStyle = {};

	/**
	* Тип экрана
	*
	*/
	this.screen = "desktop";

	/**
	* Состояние элемента
	*/
	this.state = false;

	/**
	* Не фиксировать
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	Key.incDecInput()
	* @see 	SpecialInput.setEvent()
	*/
	this.noFixed = false;
	this.noStyle = false;

	/**
	* Значение не ставить в меню
	*
	* @see 	this.updateStyle()
	* @set  StyleMenuGeometry.setValueWithOffset()
	* @set  StyleCanvas.setEventMoveMouseUp()
	*/
	this.noSetInput = false;
/******************************************************************************************/
	/**
	* Создать список тегов стилей при запуске сайта или страницы 
	*
	* @see 	Site.set() 
	* @see 	Page.setFullPage()
	* @see 	History.set()
	* @see 	this.editClass();
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.createListTagStyle = function()
	{
		// список стилей
		var listStyle = Data.page.data.css;

		// очищаем секцию
		this.clearSectionCss();

		// добавляем тэг
		for (var id in listStyle) {
			// параметры одного элемента
			var styleElm = listStyle[id];
			this.addListTagElm(id, styleElm);
		}

		// для старых версий section-content	
		this.setStyleOldSite();
	}

	this.setStyleOldSite = function()
	{
		/**дополнительные классы********************/
		$(".element.button").addClass("hlp-but");
		$(".element.image").addClass("hlp-img");
		// для формы
		$(".element.form").addClass("hlp-form");
		$(".element.textarea").addClass("input").removeClass("textarea");
	}

/****************************************************************************************/
	/**
	* Секция css для быстрого изменения
	*
	*/
	$("body").ready(function() {
		ElementCss.sectionCssFast = $(".sectionCssFast");
	});
	

	/**
	* Быстрая установка
	*
	* @see 	StyleCanvas.moveElement()
	* @see 	Resize.edit()
	*/
	this.fastSet = function(elmClass, screen)
	{
		// данные
		var elm = Element.obj;
		var listStyle = elm.attr("style");
		if (screen.indexOf("mobile") >= 0) screen = "mobile";
		
		// селектор
		var selector = "."+elmClass;
		if (screen != "desktop") selector = '.contentItem[screen^="'+screen+'"] '+selector;
		  
		// блок
		var block = "<style>"+selector+" {"+listStyle+"}</style>";
		// устанавливаем
		this.sectionCssFast.html(block);

		// console.log(9999999)
	}

/*************************************************************************************/
	/**
	* Устанавливает стиль из атрибута
	*
	* @see 	StyleMenu.edit()
	* @see 	StyleCanvas.fixedHistoryMove()
	* @see 	ElementBasic.setCssNewElm()
	* @see 	StyleCanvas.setEventMoveMouseUp(), StyleCanvas.moveElement()
	* @see 	Rezize.setEventMouseUp()
	* @see 	ElementMan.insert()
	* @see 	ElementSettingFixed.setVisible()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.resetAlign()
	* @see 	StylePosition.set() 
	* @see 	Resize.edit()
	* @see 	Key.moveElmKeyUp()
	* @see 	ElementModal.create()
	* @see 	StyleMenuGeometry.editMinHeight()
	* @see 	ElementCss.editBg()
	* @see 	StyleMenuBg.setStyleBg()
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBg.editSize()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	StyleMenuBg.setPropertyBg()
	* @see 	StyleMenuGeometry.editFloat(), editWidth()
	* @see 	ElementModal.actionAfter()
	*
	* 	нужно оптимизировать
	* @see 	StyleMenu.valueBgColorPicker()
	*/
	this.set = function(cssType, elm, screen, listStyle, state, elmClass)
	{
		// очищаем блок быстрой установки
		if (!elm) elm = Element.obj;
		if (!elm) return false;
		this.elm = elm;

		// получаем список стилей из атрибута
		if (!listStyle) {
			listStyle = this.getListStyleFromAttr();
			if (!listStyle) return false;
		}

		// стиль контента
		if (Element.isEditContentStyle(elm) && Element.existsListStyleContent(listStyle)) {
			if (listStyle["height"] || listStyle["min-height"] || listStyle["max-height"]) {
				elm = Element.getForEditStyle(elm);
			}
		}
		
		// устанавливаем данные
		this.setData(cssType, screen, state, elmClass);
		// обновляем массив 
		this.updateStyle(listStyle, cssType);
		// добавляем tag style 
		this.addTag();
		
		//убираем атрибут у элемента
		var listObj = Element.getAllObject(elm);
		listObj.removeAttr("style");
		
		elm.removeAttr("style");

		/******************************************************/
		if (this.elm.hasClass("section") && (listStyle["width"] || listStyle["min-width"])) {
			Resize.setSize();
		}
	}

/**********************************************************************************/

	/**
	* Отдает стиль
	*
	* @see 	StyleMenuBorder.setSide()
	* @see 	StyleMenuGeometry.setAlign(), .setMGWidth()
	* @see 	this.getStyleGeometry()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.setInMenu()
	* @see 	Resize.setEventMouseMove()
	* @see 	StyleCanvas.setEventMouseMove(), .setEventMouseMove()
	* @see 	ElementMan.addAddedClassInserting()
	*
	* @todo  	Переделать на список стилей(массив)
	*/
	this.getStyle = function(style, cssType, elm, screen, state, elmClass)
	{
		if (!elm) elm = Element.obj;
		this.elm = elm;
		this.setData(cssType, screen, state, elmClass); // установить данные
		value =  this.listStyle[style]; // отдаем стиль

		//если нету значение и улемента есть дополнительный класс
		if (!value && Element.existClassAdded(elm)) {
			this.elm = Element.getAllObject(elm, true);
			this.setData(cssType, screen, state); // установить данные
			value =  this.listStyle[style]; // отдаем стиль
		} 

		return value;
	}

	/**
	* Отдает стиль, проходит по всем экранам
	*
	* @see 	StyleUnit.getPropertyValue() 	
	*/
	this.getStyleAllScreen = function(style, cssType, elmClass, elm)
	{
		if (!elm) elm = Element.obj;
		var propertyValue = false;

		var state = Element.getState();
		if (!state) state = "static";

		/**********/
		var classAdV = Element.getClassAdded();
		if (classAdV) propertyValue = this.getStyleAllScreenOnly(style, cssType, classAdV, elm, state);
		if (propertyValue) return propertyValue;
			
		if (classAdV && state != "static") {
			propertyValue = this.getStyleAllScreenOnly(style, cssType, classAdV, elm, "static");
			if (propertyValue) return propertyValue;
		}
		/***********/

		/************/
		var classUniqueV = Element.getClassUnique(elm);
		propertyValue = this.getStyleAllScreenOnly(style, cssType, classUniqueV, elm, state);
		if (propertyValue) return propertyValue;
			
		if (state != "static") {
			propertyValue = this.getStyleAllScreenOnly(style, cssType, classUniqueV, elm, "static");
			if (propertyValue) return propertyValue;
		}	
		/**********/

		return false;
	}

	this.getStyleAllScreenOnly = function(style, cssType, elmClass, elm, state)
	{
		var currentScreen = Editor.screen;
		var listScreen = Screen.getListScreenTo(currentScreen);
		if (!elm) elm = Element.obj;

		var propertyValue = '';

		var countScreen = listScreen.length - 1;
		for (var i = countScreen; i >= 0; i--) {
			var screenItem = listScreen[i];
			propertyValue = this.getStyle(style, "geometry", elm, screenItem, state, elmClass);
			if (propertyValue) break;
		}

		return propertyValue;
	}

	/**
	* Устанавливает стиль
	*
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.reset()
	* @see 	StyleMenuGeometry.editPositionSide()
	*/
	this.setStyle = function(listStyle, elm, screen, state, cssType)
	{
		if (!elm) elm = Element.obj;

		if (!screen) screen = this.getScreen();
		if (!cssType) cssType = "geometry";
		
		this.set(cssType, elm, screen, listStyle, state)
	}

	/**
	* Очищает стиль
	*
	* @see 	this.clearAllScreen()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	StyleMenuGeometry.seditPositionType() 
	* @see 	StyleMenuGeometry.editPositionAlign(), StyleMenuGeometry.setElmAlignProperty()
	* @see 	ElementStyleController.setEventBgImage()
	* @see 	StyleMenuText.editStyle()
	* @see 	StyleMenuBg.editPosition(), .editRepeat(), .editSize()
	* @see 	EditElementImage.removeImg()
	* @see 	StyleMenuText.editBg()
	* @see 	StyleMenuBg.setColorRgba()
	* @see 	StyleMenuBg.editType()
	* @see 	StyleMenuBg.editFullBg()
	* @see 	StyleMenuBg.editType()
	* @see 	StyleMenuBg.setStyleBg()
	* @see 	ElementSettingFixed.editVisible()
	* @see 	StyleMenuBorder.edit()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	StyleMenuGeometry.editPositionSide()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StylePosition.reset()
	* @see 	StyleMenuGeometry.editProperty()
	* @see 	editRotate.editRotate()
	*
	* @todo  	Переделать на список стилей(массив)
	*/
	this.clear = function(listClear, cssType, elm, screen, state, elmClass)
	{
		if (!elm) elm = Element.obj;
		this.elm = elm;

		this.setData(cssType, screen, state, elmClass); // установить данные
		
		if (listClear instanceof Object) {
			var count = listClear.length;
			for (var i = 0; i < count; i++) {
				delete this.listStyle[listClear[i]];
			}
		} else {
			delete this.listStyle[listClear]; // удаляем элемент
		}
		
	
		this.addTag();// добавляем tag style 
	}

	/**
	* Очищает все дочерние экраны
	*
	* @see 	StyleMenuGeometry.seditPositionType() 
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	ElementSettingFixed.editVisible()
	*/
	this.clearAllScreen = function(listClear, cssType, elm, currentScreen, state, elmClass)
	{
		if (!currentScreen) currentScreen = this.getScreen();

		var listScreen = Screen.getListScreen(currentScreen);


		var countScreen = listScreen.length;
		for (var i = 0; i < countScreen; i++) {
			var screen = listScreen[i];
			// убираем стили у экрана
			this.clear(listClear, cssType, elm, screen, state, elmClass);
		}
	}
/******************************************************************************************/
	/**
	* Список стилей по категориям
	*
	* @see 	this.clearAllStyleOneScreen()
	*/
	this.listStyleCategory = {
		"geometry":["position", "position_fixed", "float", "width", "min-width", "max-width", "height", "min-height", "max-height", "top", "left", "right", "bottom", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left"],
		"text":["placeholder", "word-wrap", "font-family", "font-size", "color", "text-align", "text-decoration", "font-weight", "font-style", "line-height", "letter-spacing", "text-transform"],
		"bg":["background", "background-color", "background-image", "background-position", "background-repeat", "background-size", "background-attachment"],
		"border":["border", "border-width", "border-style", "border-color", "border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius", "border-style", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style"],
		"animate":["animation-delay", "animation-duration"],
		"box-shadow":["box-shadow"], "text-shadow":["text-shadow"],
		"filter":["filter"],
		"transform":["transform", "opacity", "transition"],
		"other":["z-index", "overflow"],
	};

	/**
	* Очищает все стили экрана
	*
	* @see 	ElementStyleController.setEventResetStyle()
	*/
	this.clearAllStyleScreen = function(styleType, elm, elmClass)
	{
		if (!elm) elm = Element.obj;
		if (!Element.existClassAdded()) {
			elm = Element.getAllObject(elm, false, true);
		}

		var listStyleCategory = this.listStyleCategory[styleType];
		var currentScreen = this.getScreen();
		var stateElm = Element.getState();

		var listScreen = stateElm ? ["desktop"] : Screen.getListScreen(currentScreen);
		var countScreen = listScreen.length;
		var styleTypeClearing = stateElm ? "style" : "geometry";
		if (!elmClass) elmClass = Element.getCurrentClass(elm);

		var countStyle = listStyleCategory.length;
		for (var i = 0; i < countStyle; i++) {
			var style = listStyleCategory[i];
			
			if (currentScreen == "desktop" && !stateElm) {
				if (Element.isSectionContentStyle(elm, style)) {
					continue;
				} else if (elm.hasClass("image") && style == "width"
								&& !Element.existClassAdded(elm) ) {
					continue;
				}
			}

			// если на разных экранах стиль
			for (var iScreen = 0; iScreen < countScreen; iScreen++) {
				var curScreenV = listScreen[iScreen];
				if (curScreenV == "desktop") {
					if (styleType == "position") {
						continue;
					} else if (elm.hasClass(StyleMenuGeometry.isElmFullHeight(elm))
									&& (styleType == "top" || styleType == "bottom")) {
						continue;
					}
				}

				this.clear(style, styleTypeClearing, elm, curScreenV, stateElm, elmClass);
			}
		}
		
		this.actionAfterClearing(styleType, elm, stateElm, currentScreen, listScreen);

		// обновляем тег
		this.setData(styleTypeClearing, false, stateElm);
		this.addTag();

		//фиксируем историю
		History.record();
	}


	/**
	* Действия после удаления
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.actionAfterClearing = function(styleType, elm, stateElm, currentScreen, listScreen)
	{
		// для geometry 
		if (styleType == "geometry" && stateElm && stateElm != "static") {
			
			if (elm.hasClass("section")){
				ElementCss.clear("width", false, elm.find("> .section-content"), false, false, "hlp-section-content");
			}

		} else if (styleType == "geometry" && !stateElm) {
			// действия после удаления geometry
			this.afterClearStyleGeometry(elm, currentScreen, listScreen);
		// очищение текста
		} else if (styleType == "text" && Element.data.is_text) {
			var elmContentObj = elm.find("> .element-content");	
			this.clear("background-color", "style", elmContentObj);

			if (!stateElm) {
				var attrIsColV = Element.getAttrTextContentBg();
				elm.removeAttr(attrIsColV);
				elmContentObj.removeAttr(attrIsColV);
			}
		} else if (styleType == "animate") {
			StyleMenuAnimate.resetStyle(elm);
		} else if (styleType == "transform") {
			StyleMenuTransform.resetStyle(elm);
		}
	
		// сброс для bg
		if (styleType == "bg") {
			// паралакс
			elm.removeAttr("data-paralax");
			elm.removeClass("hlp-section-bg-paralax");

			// видео фон
			if (Screen.isDesktop() && Element.isStateStatic(elm)) {
				var bgVideoObj = elm.find(">.bg-video");
				if (bgVideoObj.length) bgVideoObj.remove();
			}
			
			// маска фона у секции 
			var elmMaskObj = elm.find("> .hlp-section-bg-mask");
			if (elmMaskObj.length) {
				ElementCss.clearAllStyleScreen("bg", elmMaskObj);
				if (Screen.isDesktop()) elmMaskObj.remove();
			}

			// для секции
			if (elm.hasClass("section")) {
				this.clearAllStyleScreen("bg", elm.find("> .section-content"));
			} else if (elm.hasClass("site")) {
				this.clearAllStyleScreen("bg", elm.find(".section-content:first"), "hlp-section-content");
				this.clearAllStyleScreen("bg", elm.find(".section:first"), "hlp-section");
			}
		}	
	}

	/**
	* действия после удаления geometry
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.afterClearStyleGeometry = function(elm, currentScreen, listScreen)
	{
		// ставим ширину по умолчанию
		var elmType = elm.attr("elm-type");
		var elmObj = ListElementObject[elmType];
		if (elmObj && currentScreen == "desktop" 
				&& !Element.existClassAdded(elm)) {
			var widthStd = ListElementObject[elmType].width; 
			
			if (widthStd && elm.css("float") == "none")  {
				// если ширина больше родительской
				var parentWidthV = elm.parent().width();
				if (widthStd > parentWidthV) widthStd = parentWidthV;
				// ставим значение
				this.set("geometry", elm, "desktop", {"width":widthStd+"px"});
			}
		}

		// если секция убираем min-height
		if (Element.isEditContentStyle(elm)) {
			var elmSection = Element.getForEditStyle(elm);
			var countScreen = listScreen.length;
			for (var i = 0; i < countScreen; i++) {
				// минимальную ширину
				var listClearSection = ["max-width", "min-width", "height", "min-height", "max-height", "min-height", "padding-top", "padding-bottom", "padding-left", "padding-right"];
				this.clear(listClearSection, "geometry", elmSection, listScreen[i]);
			}
			// ес
			if (currentScreen == "desktop" && !elm.hasClass("section")) {
				this.clear("width", "geometry", elmSection, "desktop", false, "hlp-section-content");
			}
		}

		// при position: absolute - сторона позиционирования 
		if (elm.css("position") == "absolute" && Screen.isDesktop()) {
			StyleMenuGeometry.editPositionSide(elm, elm.attr("position-side"));
		}

		// если desktop
		if (currentScreen == "desktop") {
			ElementCss.clear("position", "geometry", false, "tab-l");

			// у row очищаем
			if (elm.hasClass("row")) {
				ElementSettingGrid.resetColumnSize(elm);
			}
		}

		if (elm.hasClass("site")) {
			this.clearAllStyleScreen("geometry", elm.find(".section:first"), "hlp-section");
		} else if (elm.hasClass("section")) {
			elm.removeClass("hlp-full-width");
		}

		if (elm.hasClass("section")) {
			ElementCss.clear("z-index", false, elm);
		}

		// убираем для pos absolute
		if (Screen.isDesktop()) {
			StyleMenuGeometry.clearAttrPositionFixed(elm);
		}
	}
/*********************************************************************************************/
	/**
	* Отдает список стилей из атрибута
	*
	* @see this.set()
	*/
	this.getListStyleFromAttr = function()
	{
		if (!this.elm) this.elm = Element.obj;

		// разбиваем на обычный список стили
		var stringStyle = this.elm.attr("style");
		if (!stringStyle) return false;

		var list = stringStyle.split(";");
		// разбиваем на ключ значение
		var listStyle = {};
		for (var indexList in list) {
			var style = list[indexList];
			var item = style.split(/\:(?!\/)/gim);
			
			//если не пустой
			if (item[1]) listStyle[item[0].trim()] = item[1].trim();
		}

		return listStyle;
	}

	/**
	* Обновляем список
	*
	* @see  this.set()
	*/
	this.updateStyle = function(listStyle) 
	{
		var cssType = '';

		// обновляем стили
		for (var style in listStyle) {
			var value = listStyle[style];

			if (this.isGeometry(style)) {
				if (value != "auto" 
						&& (!value || !value.toString().match(/((%)|(vh)|(vw))$/gim))) {
					// единица проценты
					var unit = StyleUnit.getUnitMenu(style);//берем из меню
					
					// если нужно переводим в проценты
					if (unit == "px") value = parseFloat(value)+"px"; 
					else value = StyleUnit.pxToPercent(value, style, this.elm);
				} else {
					StyleUnit.setUnitMenu(style, value);
				}

				// ставим значение в  меню
				if (!ElementCss.noSetInput) StyleUnit.setValueMenu(style, value);
				ElementCss.noSetInput = false;
			} 

			if (style == "background-image") value = value.replace(/["']/gim, '');

			if (!this.listStyle) this.listStyle = {};
			this.listStyle[style] = value;
		}

		var cssMarginTop = this.listStyle["margin-top"];
		if (cssMarginTop) this.listStyle["margin-top"] = cssMarginTop;

		/* если 100% **********/
		this.updateStyleWidth100(listStyle);
	}

	this.updateStyleWidth100 = function(listStyle)
	{
		// if (Editor.isModeSimple()) return false;

		if ( (listStyle["width"] || this.listStyle["width"] == "100%")
				&& (listStyle["margin-left"] == "auto" || listStyle["margin-right"] == "auto") ) {
			if (StyleUnit.getUnitMenu("width") == "%" && parseInt(this.listStyle["width"]) >= 99) {
				if (//Screen.isDesktop() &&
						this.listStyle['position'] != "absolute"
						// && !this.elm.attr("class-added")
						) {
					
					if (this.listStyle["margin-left"] == "auto") {
						this.listStyle["margin-left"] = "0px";
						listStyle["margin-left"] = "0px";
						StyleUnit.setUnitMenu("margin-left", "px");
					}
					if (this.listStyle["margin-right"] == "auto") {
						this.listStyle["margin-right"] = "0px";
						listStyle["margin-right"] = "0px";
						StyleUnit.setUnitMenu("margin-right", "px");
					}

					$(".valueMarginLeft, .valueMarginRight").val(0);
					StyleMenuGeometry.setMGAlign(this.elm);
				}
			}
		}
	}
/********************************************************************************************/
	/**
	* Узнает стиль геометрии или нет
	*
	* @see 	this.updateStyle()
	* @see 	this.isStyleDiffrentScreen()
	*/
	this.isGeometry = function(style) {
		if (style == "width"
			|| style == "min-width"
			|| style == "max-width"
			|| style == "height"
			|| style == "min-height"
			|| style == "max-height"
			|| style == "top"
			|| style == "bottom" 
			|| style == "left"
			|| style == "right"
			|| style == "margin-top"
			|| style == "margin-right"
			|| style == "margin-bottom"
			|| style == "margin-left"
			|| style == "padding-top"
			|| style == "padding-right"
			|| style == "padding-bottom"
			|| style == "padding-left"

			) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Ставится на разных экранах
	*
	* @see 	this.clearAllStyleScreen()
	*/
	this.isStyleDiffrentScreen = function(style)
	{
		if ( this.isGeometry(style)
				/*******************************/
				|| style == "text-align"
				|| style == "text-size"
				|| style == "background-size"
				|| style == "background-position"
				|| style == "border-top-style"
				|| style == "border-bottom-style"
				|| style == "border-left-style"
				|| style == "border-right-style"
			/*****************************************/
				) {
			return true;
		} else {
			return false;
		}
	}
/******************************************************************************************/
	/**
	* Устанавливает данные
	*
	* @param	string 		className-тип css класса
	* @see 		this.set()
	* @see 		this.clear()
	* @see 		this.clearAllStyleOneScreen()
	* @see 		this.getStyle()
	* @see 		StyleMenu.set()
	*/
	this.setData = function(cssType, screen, state, elmClass)
	{
		if (!elmClass) elmClass = Element.getCurrentClass(this.elm);
		this.class = elmClass;

		if (!screen) screen = this.getScreen();
		if (!state) state = Element.getState(this.elm);
		if (state == "static") state = "";

		var list = this.getListStyle(this.class); //список типов стилей
		this.state = false;
		this.screen = screen;
		this.state = state;
		
		
		/*************/
		if (!state) state = "static";
			
		if (!list || !Data.isArray(list)) {
			var defArr1V = {};
			// почему то превращаеться массив в список, что бы стили не пропали
			if (list && !Data.isArray(list) && list["desktop"]) {
				defArr1V = {"desktop":list["desktop"]};
			}

			Data.page.data.css[elmClass] = defArr1V;
			list = this.getListStyle(this.class);
		}

		if (!list[screen] || !Data.isArray(list[screen])) {
			Data.page.data.css[elmClass][screen] = {};
			list = this.getListStyle(this.class);
		}

		if (!list[screen][state] || !Data.isArray(list[screen][state])) {
			Data.page.data.css[elmClass][screen][state] = {};
			list = this.getListStyle(this.class);
		}
		/******************/

		this.listStyle = list[screen][state];
	}

	/**
	* Отдает список всех элементов
	*
	* @see 	this.getListStyle()
	* @see 	this.delete()
	* @see 	this.editClass()
	*/
	this.getAllListStyle = function(elmClass)
	{
		return Data.page.data.css;
	}

	/**
	* Отдает список стилей
	*
	* @see 	this.setStyle()
	* @see 	this.delete() 
	* @see 	this.addListTagElm()
	* @see  this.getListValueVisible()
	*/
	this.getListStyle = function(elmClass)
	{
		var listCss =  this.getAllListStyle(elmClass);
		
		// если такого стиля нет
		if (!listCss[elmClass]) listCss[elmClass] = this.getNew();

		return listCss[elmClass];
	}

	/**
	* Добавляем новый стиль, при добавлении нового элемента
	*
	* @see this.getListStyle()
	*/
	this.getNew = function()
	{
		return {
			"desktop":{
				"static":{}
			}
		};

	}

	/**
	* Отдает тип экрана
	*
	* @see 	this.setData()
	* @see 	this.fastSet()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	StyleMenuGeometry.getClassAlignScreen()
	* @see 	this.setStyle()
	*/
	this.getScreen = function()
	{
		// return $(".butShowItem[chosen='true']").attr("device");
		return $(".butShowItem[chosen='true']").attr("screen");
	}
/******************************************************************************************/
/***************************************************************************************/
	/**
	* Добавляет список тегов для элемента
	*
	* @see 	this.createListTagStyle()
	*/
	this.addListTagElm = function(elmClass, styleElm)
	{
		this.class = elmClass;
		for (var screenV in styleElm) {
			this.screen = screenV;
			var screeenItemValue = styleElm[screenV];
			if (!screeenItemValue) continue;
			
			var isScreenStyle = false; 

			for (var stateV in screeenItemValue) {
				var listStyleV = screeenItemValue[stateV];
				if (!listStyleV) {
					continue;
				} else {
					var isNoEmplty = false;
					for (var isNoEmplty in listStyleV) break;
					if (!isNoEmplty) {
						/*очищаем пустые********/		
						if (Data.page.data.css[elmClass] && Data.page.data.css[elmClass][screenV]) delete Data.page.data.css[elmClass][screenV][stateV];
						/**********/
						continue;
					}
				}

				if (stateV == "static") stateV = false;
				this.state = stateV;
				this.listStyle = listStyleV;
				this.addTag();

				isScreenStyle = true;
			}

			/*очищаем пустые********/
			if (!isScreenStyle) {
				if (Data.page.data.css[elmClass] && Data.page.data.css[elmClass][screenV]) delete Data.page.data.css[elmClass][screenV];
			}
			/**********/
		}

		return false;
	}

	/**
	* Добавляем значение в css тэг
	*
	* @see 	this.set()
	* @see 	this.addListTagElm()
	* @see 	this.clear()
	* @see 	this.clearAllStyleOneScreen()
	*/
	this.addTag = function()
	{
		//содержимое style 
		var tagContent = this.getStyleTag();

		var placeholderColorV = this.listStyle["placeholder"];
		if (placeholderColorV) {
			var placeholderBlockV = " ."+this.class+"::-webkit-input-placeholder {color:"+placeholderColorV+";}"; 
			tagContent += placeholderBlockV;
		}
		
		// заменяет тэг
		var tagStyleV = this.getSectionCss();
		var tagId = this.getTagId();
		var elmTag = tagStyleV.find("#"+tagId);

		if (!tagContent) { //если нету стиля удаляем тег
			$(elmTag).remove();
		} else if (elmTag.length) { //тег уже есть
			elmTag.html(tagContent);
		} else { //тега нет
			var tag = '<style id="'+tagId+'">'+tagContent+'</style>';

			// для базового класса
			if (ElementBasicType.getSelector(this.class)) {
				tagStyleV.prepend(tag);
			} else {
				tagStyleV.append(tag);
			}
		}
	}

	/**
	* Отдает тэг
	*
	* @see 	this.updateTag()
	*/
	this.getStyleTag = function()
	{		
		var listStyle = this.listStyle;
		if (!listStyle) return false;

		// формируем tag
		var styleBlock = " {";
		for (var style in listStyle) {
			styleBlock += style+":"+listStyle[style]+";";
		}	
		styleBlock += "}";

		var selector = this.getSelector();//селектор
		var tag = selector+styleBlock;

		//если не десктоп 
		if (this.screen != "desktop") { //экран не десктоп
			// селектор для экранов
			var selectorScreen = this.getSelectorScreen(selector);

			// media 
			var mediaQuery = Screen.mediaQuery[this.screen];
			tag = selectorScreen+styleBlock;
			tag += " @media "+mediaQuery+" { "+selector+styleBlock+"}"; 
		}

		return tag;
	}


	/**
	* Отдает id тега
	*
	* @see 	this.addTag()
	*/
	this.getTagId = function()
	{
		var id = "style_"+this.class;

		if (this.screen != "desktop") id += "_"+this.screen;
		if (this.state) id += "_"+this.state;

		id = id.replace(/[\s\.>]/gim, "_");

		return id;
	}

	/**
	* Отдает селектор
	*
	* @see 	this.getStyleTag()
	*/
	this.getSelector = function()
	{
		if (this.elm && !this.elm.attr("class-unique")
				&& this.elm.closest("[class-unique]").attr("class-added")) {
			var elmParentClassAdded = true;
		} else {
			var elmParentClassAdded = false;
		}

		// это для базового класса
		var defaultSelectorV = ElementBasicType.getSelector(this.class);
		if (defaultSelectorV) {
			var selector = defaultSelectorV;
		// если это дополнительный класс	
		} else if (Element.isClassAdded(this.class) || elmParentClassAdded) {
			var selector = ".site:not([super12]):not([super13])[class] ."+ this.class;
		} else if (this.class == "site") {
			var selector = "." + this.class;
		} else if (this.class == "hlp-section") {
			var selector = ".hlp-section";
		} else {
			var selector = ".site ." + this.class;
		}

		//если это hover
		if (this.state) selector += "[state='"+this.state+"']";

		return selector;
	}

	/**
	* Отдает селектор под экранами
	*
	* @see 	this.getStyleTag()
	*/
	this.getSelectorScreen = function(selector)
	{
		var selectorScreen = "";

		switch (this.screen) {
			case "desktop" : break;
			case "tab-l" : selectorScreen += '.contentItem[screen="tab-l"] '+selector+", ";
			case "tab-p" : selectorScreen += '.contentItem[screen="tab-p"] '+selector+", ";
			case "mobile-l" : selectorScreen += '.contentItem[screen="mobile-l"] '+selector+", ";
			case "mobile-p" : selectorScreen += '.contentItem[screen="mobile-p"] '+selector;
			default: break;
		}

		selectorScreen = selectorScreen.replace(/,\s$/, '');

		return selectorScreen;
	}
/*****************************************************************************************/
	/**
	* Отдает секцию css
	*
	* @see 	this.addTag()
	* @see 	this.clearSectionCss()
	* @see 	this.delete()
	*/
	this.getSectionCss = function()
	{
		var parentSection = $(".sectionCssPage");
		return parentSection.find(".sectionCssItem[screen='"+this.screen+"']");
	}

	/**
	* Очищает секцию css
	*
	* @see 	this.createListTagStyle();
	*/
	this.clearSectionCss = function()
	{
		this.getSectionCss().html("");
	}

/*************************************************************************************************/
/**********************************************************************************************/
	/**
	* Изменяет класс
	*
	* @see 	StyleMenuFixed.editClass()
	*/	
	this.editClass = function(typeClass, oldClass, newClass, elm)
	{
		var listStyle = this.getAllListStyle(oldClass);

		for (var styleItemName in listStyle) {
			var pattern = new RegExp("^"+oldClass+"( |$)");
			var isCoincides = styleItemName.match(pattern);
			if (isCoincides) {
				var patterRep = new RegExp("^"+oldClass);
				var newSelector = styleItemName.replace(patterRep, newClass);

				// добавляем новый и удаляем старый
				if (!$("."+newClass).length) {
					listStyle[newSelector] = copyArray(listStyle[styleItemName]);
				}

				if ($("."+oldClass).length == 1) {
					delete listStyle[styleItemName];
				}
			}
		}

		// у элемента изменяем класс
		if (!elm) elm = $(".element[class-"+typeClass+"='"+oldClass+"']");
		elm.removeClass(oldClass).addClass(newClass).attr("class-"+typeClass, newClass);

		//обновляем стили 
		this.createListTagStyle();
	}

	/**
	* Копирование стилей одного элемента другому
	*
	* @see 	ElementMan.setNewClassAddedInseringElm()
	*/
	this.copyStyle = function(oldElm, newElm, oldClass, newClass)
	{
		this.elm = oldElm;
		var listAllStyle = this.getListStyle(oldClass);
		var newListStyle = JSON.parse(JSON.stringify(listAllStyle));

		if (!Data.page.data.css[newClass]) {
			Data.page.data.css[newClass] = newListStyle;
		} else {
			for (var styleGroup in newListStyle) {
				for (styleItem in newListStyle[styleGroup]) {
					Data.page.data.css[newClass][styleGroup][styleItem] = newListStyle[styleGroup][styleItem];
				}
			}
		}

		newListStyle = Data.page.data.css[newClass];
		this.addListTagElm(newClass, newListStyle);
	}
	
/********************************************************************************************/
/**********************************************************************************************/
	/*манипуляция*/
	/**
	* Удаление
	*
	* @see 	ElementMan.deleteElmClass()
	* @see 	EditElementImage.removeImg();
	*/
	this.delete = function(elm)
	{
		//основной класс 
		var elmClass = Element.getClassUnique(elm);
		this.deleteClass(elmClass, elm);

		// дополнительный класс img-modal-2
		var classAdded = Element.getClassAdded(elm);
		if (classAdded) this.deleteClass(classAdded, elm);
	}
	
	/**
	* Удаляет определенный класс
	*
	* @see 	this.delete()
	* @see 	Element.removeClassAdded()
	* @see 	StyleMenuFixed.editClass()
	*/ 
	this.deleteClass = function(elmClass, elm)
	{
		var isDelete = true;
		var countElm = $("."+elmClass).length;
		
		// если больше одного, то не удаляем стили
		if (countElm > 1) return false;

		// удаляем по классу
		this.deleteByClass(elmClass, elm);
	}

	/**
	* Удаляем по классу
	*
	* @see 	this.delete()
	* @see 	Element.getNewClassUnique()
	*/
	this.deleteByClass = function(classUnique, elm)
	{
		// удаляем из стилей 
		var listScreen = Screen.getListScreen("desktop");
		var countScreen = listScreen.length;

		var classUniqueStr = classUnique.replace(/\s\>\s\./gim, "____");
		classUniqueStr = classUniqueStr.replace(/\s+\./gim, "__");

		// экраны
		for (var iAdded = 0; iAdded < 2; iAdded++) {				
			for (var i = 0; i < countScreen; i++) {
				var screenItem = listScreen[i];
				var screenStr = screenItem == "desktop" ? "" : "_"+screenItem;

				$("style[id='style_"+classUniqueStr+screenStr+"']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_hover']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_parent_hover']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_focus']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_chosen']").remove();
				$("style[id='style_"+classUniqueStr+screenStr+"_fixed']").remove();

				// animated
				$("style[id='style_"+classUniqueStr+screenStr+"_load']").remove();
			}
		}

		// удаляем из списка
		delete Data.page.data.css[classUnique];

		// удаляем класс ребенка
		this.deleteByClassChild(classUnique, elm);
	}

	/**
	* Удалет класс ребенка
	*
	* @see 	this.deleteByClass()
	*/
	this.deleteByClassChild = function(classUnique, elm)
	{
		var listChildClass = [
			" > .hlp-element-content",
			" > .hlp-section-content",
			" > .hlp-section-bg-mask",
			" .hlp-slider-item",
			" > .hlp-tabs-item",
			" > .hlp-block-hover-active",
			" > .text-span"];

		for (var iChildClass in listChildClass) {
			var childClass = listChildClass[iChildClass];
			var classUniqueContent = classUnique + childClass;
			
			if ($("."+classUniqueContent).length) {
				this.deleteByClass(classUniqueContent, elm);
				break;
			}
		}
	}
/****************************************************************************************/
	/**
	* Отдает список visible элемента
	*
	* @see 	ElementSettingFixed.set(), ElementSettingFixed.editVisible()
	*/
	this.getListValueVisible = function()
	{
		var listVisible = {};
		// var listScreen = ["desktop", "tab-p", "mobile-l"];
		var listScreen = Screen.getListScreen("desktop");
		var elmClass = Element.getCurrentClass();
		var listStyle = this.getListStyle(elmClass);
		var lastValue = "block";
		var state = Element.getState(Element.obj);
		if (!state) state = "static";

		for (var iScreen in listScreen) {
			var screenItem = listScreen[iScreen];
			var listStyleScreenV = listStyle[screenItem];
			var screenProperty = listStyleScreenV ? listStyleScreenV[state] : false;
			var valueItem = screenProperty ? screenProperty["display"] : false;
			
			if (valueItem) lastValue = valueItem;
			else valueItem = lastValue;

			listVisible[screenItem] = valueItem;
		}
		
		return listVisible;
	}

/**************************************************************************************/
	/**
	* Устанавливает стиль по атрибуту
	*
	* @see 	ElementStyleController.setEventCanvas()
	* @see 	Page.fix()
	*/
	this.setCssByAttrStyle = function(listElm)
	{
		if (!listElm) listElm = $(".element[style]");
		else listElm.filter("[style]");

		var countElm = listElm.length;

		for (var iElm = 0; iElm < countElm; iElm++) {
			var elm = listElm.eq(iElm);
			var groupCssType = false;
			var elmAttrStyleValue = elm.attr("style");
			if (elmAttrStyleValue.match(/(width)|(margin)/gim)) {
				groupCssType = "geometry";
			} else if (elmAttrStyleValue.match(/(color)|(background)|(border)|(box\-shadow)/gim)) {
				groupCssType = "style";
			}
			if (groupCssType) {
				ElementCss.set(groupCssType, elm);
			}
		}
	}
	

}//end class


/**
* Модульная сетка
*
*
*/
var Grid = new Grid();
function Grid() {
	this.isOff = false;
	this.gridType = false;

	/**
	* Устанавливает события
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		var listGridObj = $(".content .grid");

		this.fixedType();	
		// создаем модальную
		if (!listGridObj.find("> *").length) this.create();
		this.setPropety();

		// устанавливаем тип
		var gridCurrentType = listGridObj.attr("data-type");
		$(".butShowGrid").attr("data-type", gridCurrentType);
		this.isOff = gridCurrentType == "none" ? true : false;
		
		var obj = this;
		$(".butShowGrid").off("mousedown");
		$(".butShowGrid").on("mousedown", function() {
			var listGridObj = $(".grid");
			var gridType = listGridObj.attr("data-type");
			if (gridType == "none") {
				var gridNewType = "half";
				obj.isOff = false;
			} else if (gridType == "half") {
				var gridNewType = "";
				obj.isOff = false;
			} else {
				var gridNewType = "none";
				obj.isOff = true;
			}

			listGridObj.attr("data-type", gridNewType);
			$(this).attr("data-type", gridNewType);

			return false;
		});
	}

	/**
	* Фиксирует тип сетки
	*
	* @see 	this.setEvent()
	* @see 	ManagerPage.chosenItem()
	*/
	this.fixedType = function()
	{
		var gridType = $(".grid").attr("data-type");
		if (!$(".grid").length) gridType = "none";

		this.gridType = gridType;
	}
/*********************************************************************************************/
	/**
	* Создает сетку
	*
	* @see 	ElementSection.actionAfter()
	* @see 	ManagerPage.chosenItem()
	*/
	this.create = function(noNewPage)
	{
		var listGridObj = $(".grid");

		if (noNewPage) gridType = listGridObj.attr("data-type");
		else var gridType = this.gridType;

		var gridHtml = this.getHtml(gridType);

		listGridObj.remove();
		$('.section .section-content').prepend(gridHtml);

		this.setPropety();

		this.gridType = false;
	}

	/**
	* Отдает html сетки
	*
	* @see 	this.create()
	*/
	this.getHtml = function(gridType)
	{
		var gridBlock = '\
			<div class="grid gridBgWrap" data-type="'+gridType+'">\
				<div class="gridBg"></div>\
			</div>\
			<div class="grid listGridLineWrap" data-type="'+gridType+'">\
				<div class="listGridLine">\
					<div class="gridLine gridLine0"></div>\
					<div class="gridLine gridLine1"></div>\
					<div class="gridLine gridLine1-2"></div>\
					<div class="gridLine gridLine2"></div>\
					<div class="gridLine gridLine2-2"></div>\
					<div class="gridLine gridLine3"></div>\
					<div class="gridLine gridLine3-2"></div>\
					<div class="gridLine gridLine4"></div>\
					<div class="gridLine gridLine4-2"></div>\
					<div class="gridLine gridLine5"></div>\
					<div class="gridLine gridLine5-2"></div>\
					<div class="gridLine gridLine6"></div>\
					<div class="gridLine gridLine6-2"></div>\
					<div class="gridLine gridLine7"></div>\
					<div class="gridLine gridLine7-2"></div>\
					<div class="gridLine gridLine8"></div>\
					<div class="gridLine gridLine8-2"></div>\
					<div class="gridLine gridLine9"></div>\
					<div class="gridLine gridLine9-2"></div>\
					<div class="gridLine gridLine10"></div>\
					<div class="gridLine gridLine10-2"></div>\
					<div class="gridLine gridLine11"></div>\
					<div class="gridLine gridLine11-2"></div>\
					<div class="gridLine gridLine12"></div>\
				</div>\
			</div>\
			';

		return gridBlock;
	}

/********************************************************************************************/
	/**
	* Устанавливаетт параметры для сетки
	*
	* @see 	this.create()
	* @see 	StyleMenuGeometry.editWidth()
	* @see 	EditorController.setEventVisibleRuler()
	*/
	this.setPropety = function()
	{
		var onePersent = $(".section .section-content").width() / 100; 
		var widthColumn = onePersent * 6.5;
		var widthGroove = onePersent * 2;
		var fullWidthColumn = widthColumn + widthGroove;

		this.params = {"full-width":fullWidthColumn,"position":{},};
		
		for (var iColumn = 0; iColumn < 12; iColumn++) {
			var line1 = iColumn * fullWidthColumn;
			var line2 = line1 + widthColumn;
			var line3 = line2 + widthGroove;
			
			this.params["position"][iColumn] = {};
			this.params["position"][iColumn][1] = line1;
			this.params["position"][iColumn][2] = line2;
			this.params["position"][iColumn][3] = line3;
		}

		Resize.setSize();

		this.listLineObj = $(".listGridLine .gridLine");
	}

/********************************************************************************************/

} // end class

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


/**
* Родительский класс для работы с элементом страницы
*
*/
var Element = new Element();
function Element()  
{	
	/**
	* Данные текущего элемента
	*
	*/
	this.data;

	/**
	* Список стилей основы
	* @see this.setStyle()
	*/
	this.listStyleMain;
	
	/**
	* Стили страницы
	*
	*/
	this.listStylePage;

	/**
	* Стили выбранного элемента
	*
	*/
	this.style;

	/**
	* Предыдущий выбраный элемент
	*
	* @set 	EditorController.setEventTab()
	* @set  EditorController.setEventNavMenu()
	* @see 	
	*/
	this.prevElm = false;
/***********************************************************************************************/
	/**
	* Установка список стилей для страницы
	*
	* @see 	Page.replace()
	*/
	this.setListStylePage = function(listStyle)
	{
		// устанавливаем в css блок


		// устанавливаем в  массиве
	}
/**********************************************************************************************/
	/**
	* Отдает элементы
	*
	* @see 	ElementSettingGrid.editMargin(), ElementSettingGrid.editNoDesctop()
	* @see 	ElementSettingGrid.setEventEditSizeColumn()
	*/
	this.get = function(elm)
	{
		var currentClass = this.getCurrentClass(elm);
		return $("."+currentClass);
	}

	/**
	* Отдает список элементов
	*
	* @see 	removeImg.EditElementImage()
	*/
	this.getList = function()
	{
		return $(".contentWrap .element");
	}
/*********************************************************************************************/
	/**
	* Получить id нового элемента
	*
	* @see 	ElementMap.getElementHtml()
	* @see 	ElementSection.getElementHtml()
	* @see 	ElementMan.insert()
	* @see 	Page.setSectionNewId()
	* @see 	ElementModal.getElementHtml()
	*@see 	ManagerModal.addTemplateModal()
	*/
	this.getNewElmId = function(elmClass)
	{		
		var elm = Element.obj;
		var listElm = $("."+elmClass);
		var maxNum = this.getMaxNumberClass(listElm, "id"); //максимальное число
		var newId = elmClass+maxNum;
		return newId;
	};

	/**
	* Получить id нового элемента
	*
	* @see 	ElementBasic.createElement(), .setEventEnterClass()
	* @see 	StyleMenuFixed.editClass()
	* @see 	ElementSettingGrid.setCountColumnElement();
	* @see 	ElementColumn.getElementHtml() (element_layout.js)
	* @see 	ElementForm.getElementHtml()
	* @see 	ElementModal.getElementHtml()
	* @see 	ElementMan.insert()
	*/
	this.getNewClassUnique = function(elmClass, elmType)
	{	
		// elmClass = "hlp-" + elmClass;
		
		var elm = Element.obj;
		if (!elmType) elmType = this.getTypeByParent(elm);
		
		var listElm = this.getListElmClass(elm, elmClass);//выборка этого класса
		// var maxNum = this.getMaxNumberClass(listElm, "class-unique"); //максимальное число
		var maxNum = this.getMaxNumberOnlyClass(elmClass, false, elmType, elm);	

		// получаем класс
		var newClass = this.attachNewClass(elmClass, maxNum, elmType, elm);

		// удаляем стили если есть
		var elmStyle = $("style[id^='style_"+newClass+"']");
		if (elmStyle.length) ElementCss.deleteByClass(newClass);

		// добавляем классу префикс
		newClass = this.addClassPrefix(newClass);

		return newClass;
	};

	/**
	* Отдает тип по родитю
	* 
	* @see 	this.getNewClassUnique()
	*/
	this.getTypeByParent = function(elm)
	{
		if (!elm || !elm.length) return "";
		var elmClass = elm.attr("elm-type");

		var typeElm = "";
		if (elm.closest(".modal").length && elmClass != "modal") { //модальное
			var typeElm = "modal";
		}

		return typeElm;
	} 

	/**
	* Отдает элементы определенного класса(типа)
	*
	* @see 	this.getNewClassUnique()	
	*/
	this.getListElmClass = function(elm, elmClass)
	{
		var parentObj = $("body");
		var elmType = this.getTypeByParent(elm);
		var listElm = '';

		if (elmClass == "modal") {
			listElm = $('.modal');
		} else if (elm.closest(".modal").length) {
			listElm = $('.modal .'+elmClass);
		} else if (elmType == "frame") {
			listElm = $(".site > .section").find("."+elmClass);

		} else {
			listElm = parentObj.find('.'+elmClass);
			var exeption = $('.'+elmClass).parent().closest(".modal");//потомки modal
			listElm = listElm.not(exeption);
		}

		return listElm;
	}

	/**
	* Отдает максимамльное число класса
	*
	* @see 	this.getNewClassUnique()
	* @see 	ElementSection.getElementHtml()
	* @see 	ElementModal.create()
	* @see 	ManagerModal.addNewPageInList(), .addTemplateModal()
	*/
	this.getMaxNumberClass = function(listElm, attrElm)
	{
		var maxNum = 0; //максимальное число
		var countElm = listElm.length;
		
		for (var i = 0; i < countElm; i++) {
			var item = listElm.eq(i);
			var currentClass = item.attr(attrElm);
			if (currentClass) {
				currentClass = currentClass.replace(/^m[0-9]+/g, '');
				var curNum = parseInt(currentClass.match(/[0-9]+$/gim));
				if (curNum > maxNum) maxNum = curNum;
			}
		}

		maxNum++;

		return maxNum;
	}

	/**
	* Отдаем max значение только для классов
	*
	* @see 	this.getNewClassUnique()
	* @see 	this.getNewClassAdded()
	*/
	this.getMaxNumberOnlyClass = function(classElm, isAddedClass, elmType, elm)
	{	
		ElementMan.setBufferInPage();

		if (isAddedClass) var classMain = classElm; 
		else var classMain = classElm.replace(/-?[0-9]+$/, '');  

		// добавляем классу префикс
		classMain = this.addClassPrefix(classMain);
		
		for (var maxNum = 1; maxNum < 500; maxNum++) {
			var classPart = classMain + "-" + maxNum;
			if (isAddedClass) {
				var classItem = classPart;
			} else {
				var classItem = this.attachNewClass(classMain, maxNum, elmType, elm);
			}
			
			var elmItem = $("." + classItem);
			if (!elmItem.length) break;
		}

		ElementMan.clearBufferInPage();

		return maxNum;
	}

	/**
	* Сформировывает новый класс
	*
	* @see 	this.getNewClassUnique()
	*/
	this.attachNewClass = function(elmClass, maxNum, elmType, elm)
	{
		// если элемент каркаса то добавляем к классу 
		var partClass = '';

		// if (elmClass == "modal") {
		// 	partClass = '';
		// } else if (elm.closest(".modal").length || elmType == "modal") {
		// 	var modalId = elm.closest(".modal").attr("elm-id");
			
		// 	if (!modalId) modalId = "modal-1";
		// 	var modalNum = modalId.replace(/[^0-9]+/, '');
		// 	partClass = "m"+modalNum+"-";
		// } else if (elmType == "frame") {
		// 	partClass = "m-";
		// } 
		
		// новый класс
		var newClass = partClass+elmClass+"-"+maxNum;

		return newClass;
	}

	/**
	* Очищает класс
	*
	* @see 	ElementBasic.setEventEnterClass()
	* @see 	StyleMenuFixed.editClass(), .setEventAddClass()
	*/ 
	this.clearClass = function(classElm)
	{
		classElm = classElm.replace(/\s/gim, '-');
		classElm = classElm.replace(/[^\w\-]+/gim, '');

		// только числа
		if (classElm.match(/^[0-9]+/gim, '')) {
			classElm = "c" + classElm;
		}

		return classElm;
	}
/***************************************************************************************/
	/**
	* Отдает новый id
	*
	* @see 	ElementBasic.create()
	* @see 	ElementMan.insert()
	* @see 	Page.replace()
	* @see 	ElementModal.create(), .addNewPageInList
	* @see 	ElementNavPanelMobile.create()
	* @see 	ElementSettingGrid.editCountRow(), .editDesctopCount()
	* @see 	TemplateSection.insertTemplatePage()
	* @see 	ElementModal.setStyleModalClose()
	* @see 	ElementWidgetBasicList.addItem()
	* @see 	PrivacyPolicy.addPersonalData()
	*/
	this.addNewId = function(elm, replaceIdV)
	{
		if (elm.hasClass("column")) elm = elm.closest(".row");

		// сам элемент
		var newId = this.getNewId(elm);
		if (!elm.attr("data-id") || replaceIdV) elm.attr("data-id", newId);
		
		// потомки элемента
		var listChild = elm.find(".element");
		var countChild = listChild.length; 
		for (var iChild = 0; iChild < countChild; iChild++) {
			var elmChild = listChild.eq(iChild);
			if (elmChild.attr("data-id") && !replaceIdV) continue;

			var newId = this.getNewId(elmChild);
			elmChild.attr("data-id", newId);
		}
	}	

	/**
	* Отдает новый id
	*
	* @see 	this.addNewId()
	*/
	this.getNewId = function(elm)
	{
		var lastId = parseInt(Data.page.data.last_id);
		if (!lastId) lastId = 0;
		lastId++;
		Data.page.data.last_id = lastId;
		var newId = "i-p"+Page.getId()+"-"+lastId;

		if ($("*[data-id='"+newId+"']").length) newId = this.getNewId(elm);

		return newId;
	}


	/**
	* Отдает id  элемента
	*
	* @see 	ElementSettingClick.setListSection() 
	*/
	this.getDataId = function(elm)
	{
		if (!elm) elm = this.obj;
		return elm.attr("data-id");
	}
/*********************************************************************************************/
	/**
	* Отдает все объект
	*
	* @see 	StyleCanvas.setEventMoveElement()
	* @see 	ElementCss.set()
	* @see 	Resize.setEvent()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleMenu.valueBgColorPicker()
	* @see 	ElementStyleController.setEventElmState()
	* @see 	ElementCss.getStyle()
	* @see 	StyleMenuGeometry.editFloatSide(), .editFillVacuum()
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.getAllObject = function(elm, noAdded, isUniqueCls)
	{
		// если уникальный класс
		if (isUniqueCls) {
			var listElm = $("."+this.getClassUnique(elm));
		} else {
			var listElm = $("."+this.getCurrentClass(elm));
		}

		// если не надо added и текущий не added
		if (noAdded && !this.existClassAdded(elm)) {
			listElm = listElm.filter(function() {
				return $(this).attr("class-added") ? false : true;
			});
		}

		if (!listElm.length) listElm = elm;

		return listElm;
	}


	/**
	* Отдает уникальный класс элемента
	*
	* @see 	this.getAllObject()
	* @see 	this.setData()
	* @see 	PageStruct.getStruct()
	* @see 	ElementMan.getHtmlElmAll()
	* @see 	ElementSettingFixed.setClassAdded()
	* @see 	ElementCss.delete()
	* @see 	ElementSettingClick.setListSection()
	* @see 	StyleUnit.setMenuProperty()
	* @see 	TemplateSection.getNewTemplateCss()
	* @see 	PageStruct.getSelectorForVisible()
	*/
	this.getClassUnique = function(elm)
	{
		if (!elm) elm = this.obj;
		else if (!elm.length) elm = this.obj;

		// уникальный класс есть
		var elmClass = elm.attr("class-unique");
		if (elmClass) return elmClass;

		if (!elmClass) {
			var elmChildFormV = this.isElmChildForm(elm);
			if (elmChildFormV) {
				var parentElmV = elm.closest(".form");
			} else {
				var parentElmV = elm.parent().closest("[class-unique], [class-added]");
			}
			
			if (parentElmV.attr("class-added")) {
				var parentClass = parentElmV.attr("class-added"); 
			} else {
				var parentClass = parentElmV.attr("class-unique");
			}

			var isParentClassV = elm.parent().attr("class-unique");
			if (isParentClassV && !elmChildFormV && !elm.hasClass("nav-item")) {
				var directChild = ' >';
			} else {
				var directChild = '';
			}

			var elmClassListPart = elm.attr("class").match(/[^\s]+/gim);
			elmClassPart = elmClassListPart[1];
			if (!elmClassPart) elmClassPart = elm.attr("elm-type");
			if (!elmClassPart) elmClassPart = elmClassListPart[0];

			elmClass = parentClass+directChild+" ."+elmClassPart;
		} 

		return elmClass;
	}

	/**
	* Элемент формы
	*
	* @see 	this.getClassUnique()
	* @see 	StyleUnit.getDefaultUnit()
	*/
	this.isElmChildForm = function(elm)
	{
		if (!elm) elm = Element.obj;

		if (elm.hasClass("submit")
				|| elm.hasClass("input")
				|| elm.hasClass("textarea")
				|| elm.hasClass("hlp-select")
				|| elm.hasClass("select")
				|| elm.hasClass("checkbox")
				|| elm.hasClass("radio")
				|| elm.hasClass("label")

				|| elm.hasClass("hlp-upload-file-wrap")
				|| elm.hasClass("hlp-upload-file-name")
				|| elm.hasClass("hlp-upload-file")
				
			) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узначет есть такой класс или нет
	*
	* @see 	
	*/
	this.existsClassUnique = function(classElm)
	{
		return $(".element[class-unique='"+classElm+"']").length ? true : false;
	}

	/**
	* Отдает текущий класс
	*
	* @see 	ElementCss.getListValueVisible() 
	* @see 	ElementCss.setData()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	ElementSettingGrid.editMargin() 	
	* @see 	StyleMenuGeometry.getParentElmAlign()	
	* @see 	StyleCanvas.getNextElm()
	* @see 	ElementCss.delete()
	* @see 	this.get()
	* @see 	this.getAllObject()
	* @see 	PageStruct.createSectionNested()
	* @see 	PageStruct.getStruct()
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.getCurrentClass = function(elm)
	{
		if (!elm) elm = this.obj;
		var currentClass = this.getClassAdded(elm);
		if (!currentClass) currentClass = this.getClassUnique(elm);
		
		return currentClass;
	}

	/**
	* Отдает родителя
	*
	* @see 	Guides.getMaxOffsetLeft()
	* @see 	Guides.addItem()
	* @see 	Guides.guidesDown()
	* @see 	PageStruct.*()
	* @see 	this.getListElmClass()
	* @see 	ElementMan.insert()
	* @see 	ElementCss.deleteClass()
	*/
	this.getParentWrap = function(elm, isDelete)
	{
		if (!elm) elm = Element.obj;

		if (elm && elm.closest(".modal").length && isDelete) return $(".listModal");
		else if (Screen.isModal()) return $(".contentModal");
		else return $(".content .site");
	}


	/**
	* Отдает родителя
	*
	* @see 	ElementMan.insert(), .copy(), .cut()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	PageStruct.moveElm()
	*/
	this.getParent = function(elm)
	{
		if (!elm) elm = this.obj;
		if (!elm) return $(".site");

		var parentObj = elm.parent().closest(".element");
		if (parentObj.hasClass("section")) {
			parentObj = parentObj.find("> .section-content");
		}

		return parentObj;
	} 
/***********************************************************************************************/
	/**
	* Отдает дополнительный класс
	*
	* @see 	ElementSettingFixed.setClassAdded()
	* @see 	this.getCurrentClass()
	* @see 	ElementCss.delete()
	* @see 	ElementCss.manipAllBgOther()
	* @see 	TemplateSection.getNewTemplateCss()
	* @see 	PageStruct.getSelectorForVisible()
	*/
	this.getClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		var classAdded = elm.attr("class-added");
		return classAdded;
	}

	/**
	* Ставит новый дополнительный класс
	*
	* @see 	this.setNewClassAdded()
	* @see 	elements_z_longreads
	* @see 	ElementFixed.editClass()
	*/
	this.getNewClassAdded = function(elm, elmClass)
	{
		if (!elmClass) {
			elmClass = elm.attr("class-unique");
			if (!elmClass) elmClass = elm.attr("elm-type");
		}
		
		var listElm = this.getListElmClass(elm, elmClass);//выборка этого класса
		var maxNum = this.getMaxNumberOnlyClass(elmClass, true);

		var newClass = elmClass+'-'+maxNum;
		
		return newClass;
	}

	/**
	* Ставит новый дополнительный класс
	*
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.setNewClassAdded = function(elm)
	{
		var oldAddedClass = Element.getClassAdded(elm);
		var newAddedClass = this.getNewClassAdded(elm);

		elm.removeClass(oldAddedClass)
				.addClass(newAddedClass)
				.attr("class-added", newAddedClass);
	}

	/**
	* Добавляет класс
	*
	* @see 	StyleMenuFixed.setEventAdd()
	*/
	this.addClassAdded = function(value, elm)
	{
		if (!elm) elm = this.obj;

		value = value.trim().replace(/\s/gim, '-');
		elm.addClass(value).attr("class-added", value);
	}
	
	/**
	* Удаляет класс
	*
	* @see 	StyleMenuFixed.setEventDelete()
	*/
	this.removeClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		var elmClass = elm.attr("class-added");

		// удаляем с массива
		ElementCss.deleteClass(elmClass, elm);
		// убираем класс 
		elm.removeClass(elmClass).removeAttr("class-added");
	}

	/**
	* Узнает это элемент имеет класс или нет 
	*
	* @see 	this.isGeneral()
	* @see 	Element.clearAllStyleScreen()
	* @see 	ElementCss.getStyle()
	* @see 	StyleMenuBg.editBgStyle()
	* @see 	this.getAllObject()
	* @see 	StyleMenuGeometry.setMGMarginH()
	* @see 	ElementMan.addAddedClassInserting()
	* @see 	StyleUnit.setMenuProperty()
	* @see 	ElementCss.actionAfterClearing()
	* @see 	ElementSettingFixed.setVisible()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	*/
	this.existClassAdded = function(elm)
	{
		if (!elm) elm = this.obj;
		return elm.attr("class-added") ? true : false;
	}
	
	/**
	* Элемент в обычном состоянии
	*
	* @see 	ElementBorder.editBorderSide()
	*/		
	this.isGeneral = function(elm)
	{
		if (!elm) elm = Element.obj;
		if (Screen.isDesktop() 
					&& this.isStateStatic(elm)
					&& !this.existClassAdded(elm)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узнает это дополнительный класс или нет 
	*
	* @see 	Element.getSelector()
	* @see 	ElementMenuFixed.setEventEditClass()
	*/
	this.isClassAdded = function(value)
	{
		return $(".element[class-added='"+value+"']").length;
	}

	/**
	* Узнает одинаковый или нет
	*
	* @see 	ElementMan.addAddedClassInserting()
	*/
	this.isEqual = function(objOne, objTwo)
	{
		return objOne.attr("data-id") == objTwo.attr("data-id");
	}


	/**
	* Копирует классы
	*
	*
	* TemplateSection.replaceClassTemplate()
	*/
	this.setNewClass = function(newElm)
	{
		var listElm = newElm;
		listElm = listElm.add(newElm.find(".element"));

		console.log(listElm.length)

		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elmItem = listElm.eq(iElm);
			var elmType = elmItem.attr("elm-type");

			if (!Element.isNoEditClass(elmItem)) {
				var classUnique = elmItem.attr("class-unique");
				var newClassUnique = this.getNewClassUnique(elmType);
				ElementCss.editClass("class-unique", classUnique, newClassUnique, elmItem);
				elmItem.attr("class-unique", newClassUnique);
			}

			var classAdded = elmItem.attr("class-added");
			if (classAdded) {
				var newClassAdded = this.getNewClassUnique(classAdded);
				ElementCss.editClass("class-added", classAdded, newClassAdded, elmItem);
				elmItem.attr("class-added", newClassAdded);
			}
		}

	}

/**********************************************************************************************/
	/**
	* Устанавливает определенный тип
	* @uses ListElementObject - ElementBasic
	* @see 	ElementStyleController.noteElement()
	* @see 	ElementMan.setParCutElm() 
	* @see 	ElementSelf.isNotFit()
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.setData = function(elm)
	{
		if (!elm) elm = this.obj;

		// ставим данные
		var key = elm.attr("elm-type");
		this.data = ListElementObject[key];
		
		//ставим объект
		this.oldObj = this.obj;
		if (!this.oldObj) this.oldObj = $(".site");

		this.obj = elm;//один 

		// ставим класс
		this.classUnique = this.getClassUnique();
	}

	/**
	* Отдает список объектов
	*
	* @see 	this.setData()
	*/
	this.getListObj = function(elm)
	{
		var classUnique = elm.attr("class-unique");
		var listObj = $("."+classUnique);

		return listObj;
	}

/*****************************************************************************************/
	/**
	* Отдает свойство элемента
	*
	* @uses ListElementObject - ElementBasic
	* @see 	ElementStyleController.actionBeforeSelected()
	*/
	this.getValueProperty = function(elm, property)
	{
		var key = this.getTypeById(elm.attr("id"));
		return ListElementObject[key][property];
	}
/****************************************************************************************/
	/**
	* Устанавливает стиль элемента
	*
	*
	*/
	this.setStyle = function(id)
	{
		// this.style = this.listStyle[id];
	}
/************************************************************************************************/
	
	/**
	* Float или нет
	*
	* @see 	StyleCanvas.getMaxLeft(), StyleCanvas.getNextElm()
	* @see 	StyleMenuGeometry.setAlign()
	* @see 	Resize.setMaxWidth()
	* @see 	Key.moveElm()
	*/
	this.isFloat = function(elm, statusFillVacuum)
	{
		if (!elm) elm = this.obj;

		if (elm.css("position") == "absolute") return false;

		var valueFloat = elm.css("float");
		var isFloatV =  valueFloat == "left" || valueFloat == "right" ? true : false;
		
		return isFloatV;
	}

/*************************************************************************************************/
	/**
	* Отдает padding по горизонтали
	*
	* @see 	StyleCanvas.getMaxLeft()
	* @see 	Resize.setEventMouseUp()
	* @see 	Resize.setEvent(), .addBlockModeSimple(), .setMaxWidth()
	* @see 	StyleMenuGeometry.setMarginH(), .setMarginV(), .setMGWidth()
	* @see 	StyleMenuGeometry.setWidth()
	* @see 	StyleMenuGeometry.setPosition()
	* @see 	ElementMan.getFullWidth()
	* @see 	ElemenSelf.getEmptyWidth()
	* @see 	this.getMaxLeft()
	* @see 	StyleCanvas.getParamsForMove()
	*/
	this.getWidth = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = this.getPaddingH(elm);
		var width = elm.width() + padding;

		return parseFloat(width);
	}

	/**
	* Отдает высоту
	*
	* @see 	StyleMenuGeometry.setMarginV(), StyleMenuGeometry.setHeight()
	* @see 	StyleMenuGeometry.setPosition()
	* @see 	Resize.addBlockModeSimple()
	*/
	this.getHeight = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = this.getPaddingV(elm);
		var height = elm.height() + padding;
		
		return parseFloat(height);
	}

	/**
	* Отдает padding по горизонтали
	*
	* @see 	this.getWidth()
	* @see 	Resize.setEvent()
	* @see 	Resize.setMaxWidth()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	*/
	this.getPaddingH = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = parseFloat(elm.css("padding-left"))+parseFloat(elm.css("padding-right"));
		var border = parseFloat(elm.css("border-left-width")) + parseFloat(elm.css("border-right-width"));
		return padding + border;
	}

	/**
	* Отдает padding по аертикали
	*
	* @see 	this.getHeight()
	*/
	this.getPaddingV = function(elm)
	{
		if (!elm) elm = this.obj;
		var padding = parseFloat(elm.css("padding-top"))+parseFloat(elm.css("padding-bottom"));
		var border = parseFloat(elm.css("border-top-width")) + parseFloat(elm.css("border-bottom-width"));
		return padding+border;
	}
/***********************************************************************************************/
	/**
	* Узнает позиция по середине или нет
	*
	* @see 	Resize.setEvent()
	*/
	this.isPositionCenter = function(elm) 
	{
		if (!elm) elm = Element.obj;

		var marginLeft = $(".valueMarginLeft").val();
		var marginRight = $(".valueMarginRight").val();

		if (marginLeft == "auto" 
				&& marginRight == "auto" 
				&& elm.css("position") != "absolute") return true;
		else if (elm.hasClass("modal")) return true;
		else return false;
	}

	/**
	* Узнает есть следующий элемент
	*
	* @see 	StyleCanvas.setEventMoveMouseUp()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	Resize.setEvent()
	* @see 	this.getMaxLeft()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StylePosition.addRightNextLeft()
	* @see 	Resize.setPropetyModeSimple()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	ElementSelf.insertElement()
	*/
	this.getNextElm = function(elm, allElm)
	{
		return this.getNearElm(elm, "next", allElm);
	}


	/**
	* Отдает предыдущий элемент
	*
	* @see 	StylePosition.addRightPrevLeft()
	* @see 	Resize.setPropetyModeSimple()
	* @see 	ElementManController.setEventModeSimpleMove()
	*/
	this.getPrevElm = function(elm, allElm)
	{
		return this.getNearElm(elm, "prev", allElm);
	}

	/**
	* Отдает ближайший элемент
	*
	* @see 	this.getNextElm()
	* @see 	this.getPrevElm()
	*/
	this.getNearElm = function(elm, type, allElm)
	{
		if (!elm) elm = Element.obj;

		if (!StylePosition.isStatic() 
				|| (!this.isFloat(elm, true) && !allElm) ) return false;


		var nearElm = elm;
		var floatSide = elm.css("float");

		for (var i = 0; i < 50; i++) {
			if (type == "prev") nearElm = nearElm.prev();
			else nearElm = nearElm.next();

			// элемент что бы был виден
			if (!nearElm.length) return false; 
			else if (nearElm.hasClass("page")) return false; 

			// если есть элемент то отдаем его сразу
			if (nearElm.css("display") != "none" 
				&& nearElm.hasClass("element")
				&& (floatSide == nearElm.css("float") || allElm)
				&& nearElm.css("position") != "absolute"
				) return nearElm; 
		}

	}
/*************************************************************************************************/
	/**
	* Отдает максимальное значение в лево
	*
	* @see 	StylePosition.setProperty()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleMenuGeometry.editMarginLeft()
	* @see 	StyleMenuGeometry.setValueWithOffset()
	*/
	this.getMaxLeft = function(property, elm)
	{ 	
		if (!elm) elm = Element.obj;
		var width = Element.getWidth();
		var parentWidth = this.getParentWidth(elm);
		var maxLeft = parentWidth - width;

		return maxLeft; 
	}

	/**
	* Отдает ширину родителя
	*
	* @see 	this.getMaxLeft()
	* @see 	StyleCanvas.getParamsForMove()
	* @see 	StyleCanvas.setMaxWidth()
	* @see 	StyleUnit.getParentValue()
	*/
	this.getParentWidth = function(elm)
	{
		var parentElm = elm.parent();
		if (elm.css("position") == "absolute") {
			if (parentElm.hasClass("section-content")) parentElm = parentElm.parent();
			
			return Element.getWidth(parentElm);
		} else {
			return parentElm.width();
		}
	}

/**************************************************************************************************/
/**********************************************************************************************/
	/**
	* Узнает это id элемента каркаса или нет
	*
	* @see 	this.getNewClassUnique()
	* @see 	this.getNewId()
	* @see 	ElementSelf.insertElementSection()
	* @see 	ElementCss.getAllListStyle()
	* @see 	ElementMan.setIsFrameElm(), ElementMan.isInsertElm()
	* @see 	PageStruct.getListStructItem()
	* @see 	ElementCss.createListTagStyle(), .copyStyle()
	* @see 	this.getMaxNumberOnlyClass()
	* @see 	ElementBasic.isInterdictedClass()
	*/
	this.isElmFrame = function(elm)
	{
		return false;
	}

	/**
	*
	*
	* @see 	ElementModal.createAction(), .getNewModalId()
	* @see 	ManagerModal.getListModalParent(), .getModal(), .fix()
	* @see 	ElementBasic.isInterdictedClass()
	*/
	this.getSiteContentObj = function(elm)
	{
		return $(".contentItemPage > .element");
	}

	/**
	* Секция или нет
	*
	*
	* @see 	StyleMenuGeometry.setMGWidth(), editWidth()
	* @see 	StyleCanvas.getOffsetTop()
	*/
	this.isSection = function(elm)
	{

		if (elm.hasClass("section")) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Позиция absolute
	*
	* @see 	StyleMenuGeometry.setValueWithOffset()
	* @see 	StyleMenuGeometry.setAlign(0)
	*/
	this.isAbsolute = function(elm)
	{
		if (!elm) elm = this;
		return elm.css("position") == "absolute" ? true : false;
	}
/***************************************************************************************/
	/**
	* Отдает состояние элемента
	*
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBorder.editBorderSide()
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	ElementCss.setData()
	* @see 	StyleMenu.valueBgColorPicker()
	* @see 	StyleMenuGeometry.setMGWidth()
	*/
	this.getState = function(elm)
	{
		if (!elm) elm = this.obj;
		
		var state = elm.attr("state");
		return !state || state == "static"  ? false : elm.attr("state");
	}

	/**
	* Ставит в состояние static
	*
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	EditorController.setEventEditScreen()
	*/
	this.setStateStatic = function()
	{
		this.setState("static");
	}

	/**
	* Устанавливает состояние элемента
	*
	* @see 	this.setStateStatic()
	* @see 	ElementStyleController.setEventElmState()
	*/
	this.setState = function(stateType)
	{
		Select.set($(".selectElmState"), stateType);
		
		var elm = Element.obj;

		var listElm = elm;
		if (elm.hasClass("section")) {
			var childSection = elm.find(".element, .section-content");
			listElm = listElm.add(childSection);
		}

		if (stateType != "static") listElm.attr("state", stateType);
		else listElm.removeAttr("state");
	}

	/**
	* Удалить состояние
	*
	*
	* @see 	ElementStyleController.noteElement();
	*/
	this.removeState = function()
	{
		var elm = Element.obj;
		if (!elm.closest("[state='fixed']").length) {
			$(".element, .section-content").removeAttr("state");
		}

		// $(".element").removeAttr("state");
		var elmStateV = elm.attr("state");
		if (!elmStateV) elmStateV = "static";
		Select.set($(".selectElmState"), elmStateV);
	}

	/**
	* Показать кнопку статуса
	*
	* @see 	this.setStateElm()
	*/
	this.showButState = function(state)
	{
		$(".blockTypeState").find(".menuButValue").filter("[value='"+state+"']").css("display", "block");	
	}

	/**
	* Отдает состояние элемента
	*
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	StyleMenuBg.editSize()
	* @see 	StyleMenuBg.editImageStyle()
	*/
	this.isState = function(elm)
	{
		if (!elm) elm = this.obj;
		var state = elm.attr("state");
		return !state || state == "static"  ? true : false;
	}

	/**
	* Состояние статик
	*
	* @see 	this.isGeneral()
	* @see 	StyleMenuBorder.edit()
	*/
	this.isStateStatic = function(elm)
	{
		return this.isState(elm);
	}
		
/*********************************************************************************/
	
	/**
	* Мани
	*
	* @see 	ElementManController.setEventStandart()
	* @see 	ModeSimple.setPropetyModeSimple()
	* @see 	PageStruct.isMoveElm()
	*/
	this.isManipulation = function(elm, typeOperation)
	{
		if (!elm) elm = Element.obj;
		
		if (Element.data.no_manipulation 
				|| elm.attr("data-property-no-manipulation") == "true" ) {
			if (typeOperation != "insert") return false;
			else return true;
		} else {
			return true;
		}
	}

/*******************************************************************************************/

	/**
	* Для секции - стили для контента
	*
	* @see 	this.StyleUnit.js
	*/
	this.isSectionContentStyle = function(elm, style)
	{
		if (elm.hasClass("section-content")) elm = elm.parent();

		if (elm.hasClass("section")	
				&& !Element.existClassAdded(this.elm)
				&& (style == "width" || style == "min-width" || style == "max-width")) {
			return true;
		} else {
			return false;
		}
	}

/*******************************************************************************************/
/*******************************************************************************************/
	/**
	* Отдает элемент для изменения стиля
	*
	* @see StyleMenuGeometry.*
	*/
	this.getForEditStyle = function(elm, propertyV)
	{
		if (this.existsStyleContent(propertyV) || !propertyV) {
			if (elm.hasClass("section")) {
				elm = elm.find(" > .section-content");
			} else if (elm.hasClass("hlp-slider") 
							&& propertyV != "padding-left"
							&& propertyV != "padding-right") {
				elm = elm.find(".hlp-slider-item");
			} else if (elm.hasClass("hlp-tabs")) {
				elm = elm.find(".hlp-tabs-item");
			}
		} 

		return elm;
	}

	/**
	* Есть стиль у контента или нет
	*
	* @see 	ElementCss.set()
	*/
	this.isEditContentStyle = function(elm)
	{
		if (elm.hasClass("section") 
				|| elm.hasClass("hlp-slider")
				|| elm.hasClass("hlp-tabs")) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Узнает есть такой стили или нет у контента
	*
	* @see 	this.getForEditStyle()
	* @see 	this.existsListStyleContent()
	*/
	this.existsStyleContent = function(propertyV)
	{
		if (propertyV == "height"
				|| propertyV == "min-height"
				|| propertyV == "max-height"
				|| propertyV == "padding-top"
				|| propertyV == "padding-right"
				|| propertyV == "padding-bottom"
				|| propertyV == "padding-left") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Е
	*
	* @see 	ElementCss.set()
	*/
	this.existsListStyleContent = function(listStyleV)
	{
		for (var styleV in listStyleV) {
			if (this.existsStyleContent(styleV)) return true;
		}
	}

	/**
	*
	*
	* @see 	ElementSettingFixed.setVisible()
	*/
	this.isSettingVisible = function(elm)
	{
		if (elm.hasClass("site") 
				|| elm.hasClass("row")
				|| elm.hasClass("hlp-slider-bullet")
				|| elm.hasClass("hlp-slider-arrow")
				|| elm.hasClass("hlp-slider-arrow-img")) {
			return false;
		} else {
			return true;
		}
	}

	/**
	* Отдает объект
	*
	*
	*/
	this.getObj = function()
	{
		return this.obj;
	}

	/**
	* Устанавливает объект
	*
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.setObj = function(elm)
	{
		this.obj = elm;
	}

	/**
	* Устанавливает объект
	*
	* @see 	ElementBasicType.addListElm()
	* @see 	ElementCss.getSelector()
	*/
	this.getAttrSelector = function()
	{
		return "data-hlp-selector";
	}

/*******************************************************************************************/

	this.getAttrTextContentBg = function()
	{
		return "is-color";
	}

	/**
	* Когда изменяется класс
	*
	* @see 	StyleMenuFixed.editClass() 
	* @see 	StyleMenuFixed.setEventAddClass()
	* @see 	ElementBasic.createAction()
	*/
	this.addStdAddedClass = function(originElmV, newElmV)
	{
		if (!originElmV.length) return false;

		// animated
		var eventTypeV = originElmV.attr("data-animated-event");
		if (eventTypeV) newElmV.attr("data-animated-event", eventTypeV);

		var anmTypeLoad = originElmV.attr("data-hlp-animated-load");
		var anmTypeScroll = originElmV.attr("data-hlp-animated-scroll");
		var anmTypeHover = originElmV.attr("data-hlp-animated-hover");
		

		if (anmTypeLoad) newElmV.attr("data-hlp-animated-load", anmTypeLoad);
		if (anmTypeScroll) newElmV.attr("data-hlp-animated-scroll", anmTypeScroll);
		if (anmTypeHover) newElmV.attr("data-hlp-animated-hover", anmTypeHover);
		
		//bg text
		var attrIsColorV = this.getAttrTextContentBg();
		var isColorConV = originElmV.find("> .element-content["+attrIsColorV+"='true']").length;
		if (isColorConV) newElmV.find("> .element-content").attr(attrIsColorV, "true");
		
		// position
		var attrPosSide = StyleMenuGeometry.getAttrPositionSide();
		var posAbsoluteSide = originElmV.attr(attrPosSide);
		if (posAbsoluteSide) newElmV.attr(attrPosSide, posAbsoluteSide);
	}

/*******************************************************************************************/
	
	/**
	* Заменяет тег у элемента
	*
	* @see 	ElementSettingHeading.edit()
	* @see 	ElementSettingClick.editActionType()
	*/
	this.replaceTag = function(elm, tag)
	{
		// заменяем
		var block = ElementMan.getHtmlElmAll(elm, false, tag);
		elm.replaceWith(block);
		
		//ставим события и эмитируем клик по элементу
		var newObjV = $("*[status='new']").removeAttr("status");
		this.setObj(newObjV);

		Input.newCanvas();
		Resize.create();
			
		return newObjV;
	}


/*******************************************************************************************/
	
	/**
	* Элемент колонка
	*
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	PageStruct.moveElm()
	*/
	this.isColumn = function(elm)
	{
		return elm.hasClass("column");
	}

	/**
	* Элемент span
	*
	* @see 	TextEditor.setTextInElm()
	*/
	this.isTypeTextSpan = function(elm)
	{	
		if (!elm) elm = this.getObj();
		return elm.hasClass("text-span");
	}

	this.isNoEditClass = function(elm)
	{
		return elm.attr("data-property-no-edit-class");
	}

/*******************************************************************************************/
	
	/**
	* Перезагрузка элемента
	*
	* @see 	ElementSettingForm.editCheckboxChecked()
	*/	
	this.reload = function(elm)
	{
		var blockHtml = ElementMan.getHtmlElmAll(elm, true);

		elm.after(blockHtml);
		Input.newCanvas();
		
		var newElm = elm.next();
		elm.remove();
		newElm.removeClass("elementSelected").mousedown().mouseup();
	}


/**********************************************************************************************/
/***для многостраничника*******************************************************************************************/
	/**
	* Добавляет префикс классу
	*
	* @see 	this.getNewClassUnique()
	* @see 	StyleMenuFixed.editClass()
	* @see 	ElementModal.createAction()
	* @see 	TemplateSection.replaceClassTemplate()
	*/
	this.addClassPrefix = function(newClass)
	{
		if (Page.isTypeMain()) {
			var pageName = Page.getName();
			var patName = new RegExp("^"+pageName+"-", "i");
			newClass = newClass.toString().replace(patName, '');
			newClass = pageName+"-"+newClass;
		}

		return newClass;
	}
	
/*******************************************************************************************/
/*******************************************************************************************/

}//конец класса



/**
* Направляющие
*
*
*/ 
var Guides = new Guides(); 
function Guides() {

	/**
	* Ставим собятия
	*
	* @see 	Input.newCanvas()
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		// добавление
		this.setEventAdd();
		// для направляющих
		this.setEventItem();
		// события для панели параметров
		this.setEventPanelProperty();

		// ставим позицию вертикальным направляющим
		this.setPositionVertical();
	}
/**********************************************************************************************/
	/**
	* Добавление направлющей
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var scale = $(".scale");
		scale.off("mousedown");	
		scale.on("mousedown", function() {
			var elmEvent = $(this);
			
			// выход за границы
			scale.on("mouseout", function(event) {
				// убираем события
				scale.off("mouseout");
				$("body").off("mouseup");

				//действие 
				obj.scaleOut(event, elmEvent);
			});

			$("body").on("mouseup", function() {
				scale.off("mouseout");
				$("body").off("mouseup");
			});

			return false;
		});
	}


	/**
	* Выход за пределы scale
	*
	* @see 	this.setEventAdd()
	*/
	this.scaleOut = function(event, scaleEvent)
	{
		var isVercital = scaleEvent.hasClass("scaleVertical");
		// вертикальная линейка
		if (isVercital) {
			// движение на лево
			var mouseX = event.pageX;
			var scaleLeft = scaleEvent.offset().left;
			if (mouseX < scaleLeft) return false;
		} else {
			// движение на вверх
			var mouseY = event.pageY;
			var scaleTop = scaleEvent.offset().top;
			if (mouseY < scaleTop) return false;
		}

		// создаем направляющию
		this.create(isVercital);
	}

/************************************************************************************************/
	/**
	* Создание направляющей
	*
	* @see 	this.setEvent()
	*/
	this.create = function(isVercital)
	{
		// создаем
		if (isVercital) this.createVertical();
		else this.createHorizontal();
		// получаем новую направляющию
		var newGuides = $(".newGuides").removeClass("newGuides");

		// ставим событие для напрявляющей
		this.setEventItem();
		// передвижение
		this.guidesDown(newGuides);
	}

	/**
	* Создание горизонтальной направляющей
	*
	* @see 	this.scaleOut()
	*/
	this.createHorizontal = function()
	{
		var guides = '<div class="newGuides guides guidesHorizontal" type="horizontal"><div class="guidesContent"></div></div>';
		this.addItem(guides);
	}

	/**
	* Создание вертикальной направляющей
	*
	* @see 	this.scaleOut()
	*/
	this.createVertical = function()
	{
		var guides = '<div class="newGuides guides guidesVertical" type="vertical"><div class="guidesContent"></div></div>';
		this.addItem(guides);
	}


	/**
	* Добавляет направляющию
	*
	* @see 	this.createHorizontal()
	* @see 	this.createVertical()
	*/
	this.addItem = function(guides)
	{
		var elmContent = Element.getParentWrap();
		elmContent.prepend(guides);
	}
/***********************************************************************************************/
/***********************************************************************************************/
	/**
	* Событие на передвижение
	*
	* @see 	this.setEvent()
	* @see 	this.create()
	*/
	this.setEventItem = function()
	{
		var obj = this;
		$(".guides").off("mousedown");
		$(".guides").on("mousedown", function(eventDown) {
			obj.guidesDown($(this), eventDown);
			return false;
		});	

		// показать параметры
		this.setEventShowProperty();
	}

	/**
	* Нажатие на направляющию
	*
	* @see 	this.setEventItem()
	* @see 	this.setEventMove()
	*/
	this.guidesDown = function(elmEvent, eventDown)
	{
		var elmParent = Screen.isModal() ? elmEvent.closest(".modalWrap") : elmEvent.closest(".site");

		var parentTop = elmParent.offset().top;
		var parentLeft = elmParent.offset().left;
		// var parentLeft = $(".section").offset().left;
		// parentLeft = 100;
		var type = elmEvent.attr("type");
		var elmInform = $(".guidesInfo");
		var pointZeroH = this.getOffsetHorizontal();
		var pointZeroV = this.getOffsetVertical();

		// небольшое смещение
		var offset = 0;
		if (eventDown) {
			if (type == "horizontal") offset = elmEvent.offset().top - eventDown.pageY;
			else offset = 0;//elmEvent.offset().left - eventDown.pageX;
		}
		
		var obj = this;
		$("body").off("mousemove");
		$("body").on("mousemove", function(eventMove) {
			var pageY = eventMove.pageY;
			var pageX = eventMove.pageX;

			// ставим направляющию
			if (type == "horizontal") {
				// получаем top
				var value =  pageY - parentTop + offset;
				elmEvent.css({"top":value});//ставим значение
				// для корректного отображения
				value += pointZeroH;

				
			} else {
				// получаем left
				var value = pageX - parentLeft;
				elmEvent.css({"left":value});//ставим значение
				// 
				value -= pointZeroV;
			}

			// прилипание
			var newValue = Math.round(value/50) * 50;
			if (newValue + 5 > value && newValue - 5 < value) {
				value = newValue;

				if (type == "horizontal") elmEvent.css({"top":value - pointZeroH});
				else elmEvent.css({"left":value + pointZeroV});
			}

			value = parseInt(value);
			pageY -= parentTop;
			// ставим блок информации
			elmInform.css({"display":"block", "top":eventMove.pageY - 45, "left":pageX + 15});
			elmInform.text(value+"px");
			elmEvent.attr("pos-value", value);
		});
	
		$("body").off("mouseup");
		$("body").on("mouseup", function() {
			$("body").off("mouseup");
			$("body").off("mousemove");
			// прячем информационый блок
			elmInform.css("display", "none");
			// фиксируем в историю
			History.record();


			// если ушла в минус
			if (type == "horizontal") {
				var curGuidesHorTop = elmEvent.offset().top - 10;
				var scaleHorTop = $(".scaleHorizontal").offset().top;
				if (scaleHorTop > curGuidesHorTop) elmEvent.remove();
			} else {
				var posValueV = elmEvent.offset().left - 10;
				if (posValueV < 0) elmEvent.remove();
			}
		});

		// убираем панель
		this.closeProperty();
	}
/********************************************************************************************/
	/**
	* Ставит позицию вертикальных направляющим
	*
	* @see 	this.setEvent()
	* @see 	Editor.setScale()
	* @see 	StyleMenuGeometry.editWidth()
	*/
	this.setPositionVertical = function()
	{
		var maxWidth = this.getMaxOffsetLeft();
		var listGuides = $(".guidesVertical");
		var offset = this.getOffsetVertical();

		// показываем все направляющие
		listGuides.removeClass("guidesHide");
		// проходим циклом все направляющие
		var count = listGuides.length;
		for (var i = 0; i < count; i++) {
			var item = listGuides.eq(i);
			// прячем которые не вмещаются на палатне
			var posValue = parseInt(item.attr("pos-value"));
			// if (maxWidth < posValue) item.addClass("guidesHide");

			// изменяем позицию 
			var left = posValue+offset;
			item.css("left", left+"px");
		}
	}

	/**
	* Отдает максимальное смещение в лево
	*
	* @see 	this.setPositionVertical()
	*/
	this.getMaxOffsetLeft = function()
	{
		var elmWrap = Element.getParentWrap();
		if (elmWrap.hasClass("modalWrap")) elmWrap = elmWrap.find(".modal"); 
		else elmWrap = elmWrap.find(".section"); 

		var maxWidth = elmWrap.width()-30;
		return maxWidth;
	}
/*********************************************************************************************/
/*********************************************************************************************/
	/**
	* Показать параметры
	*
	* @see 	this.setEventItem()
	*/
	this.setEventPanelProperty = function()
	{
		// закрытие параметров
		this.setEventCloseProperty();
		// изменение позиции
		this.setEventValuePosition();
		// изменить цвет
		this.setEventChangeColor();
		// удаление направляющей
		this.setEventDelete();
	}
/************************************************************************************************/
	/**
	* Показать панель с параметрыми
	*
	* @see 	this.setEventItem()
	*/
	this.setEventShowProperty = function()
	{
		var obj = this;
		$(".guides").off("dblclick");
		$(".guides").on("dblclick", function(event) {
			var elmEvent = $(this);
			// показываем элемент
			obj.showSectionProperty(elmEvent, event);

			// ставим позицию
			obj.setValuePosition(elmEvent);

			return false;
		});
	}

	/**
	* Показываем элемент
	*
	* @see 	this.setEventShowProperty()
	*/
	this.showSectionProperty = function(elmEvent, event)
	{
		var elmContent = $(".contentSection");
		var elmProperty = $(".guidesPropertySection");
		var parentWidth = elmContent.width();
		var propertyWidth = elmProperty.width();
		var padding = 40;

		// ставим атрибут отметку
		$(".guides").removeAttr("chosen");
		elmEvent.attr("chosen", "true");

		var top = event.pageY - elmContent.offset().top + 10;
		// var top = event.pageY - elmContent;

		var left = event.pageX + 10;
		var right = propertyWidth + left + padding;
		
		// если выход за правый край
		if (right > parentWidth) left = left - propertyWidth - padding;
		
		// ставим параметры элементу
		elmProperty.css({"display":"block", "top":top,"left":left});
		this.guides = $(".guides[chosen='true']");
		this.type = this.guides.attr("type");
	}
/***********************************************************************************************/
	/**
	* Позиция
	*
	* @see 	this.setEventPanelProperty()
	*/
	this.setEventValuePosition = function()
	{
		var obj = this;
		$(".valueGuidesPosition").off("change");
		$(".valueGuidesPosition").on("change", function() {
			var newValue = parseInt($(this).val());
			// если вертикальная
			if (obj.type == "vertical") newValue += obj.getOffsetVertical();
			else newValue -= obj.getOffsetHorizontal();

			// ставим значение
			var side = obj.type == "horizontal" ? "top" : "left";
			obj.guides.css(side, newValue+"px");
		});

		// движение стрелкой
		var inputPosition = $(".valueGuidesPosition");
		inputPosition.off("keydown");
		inputPosition.on("keydown", function(event) {
			var code = event.keyCode;
			if (code == 38 || code == 40) {
				var value = parseInt(inputPosition.val());
				if (code == 38) value++;
				else value--;
				// ставим значение и эмитируем изменение
				inputPosition.val(value).change();
				return false;
			}
		});
	}	

	/**
	* Ставит значение
	*
	* @see 	this.setEventShowProperty()
	* 
	* @todo  дублируются значения в this.guidesDown() - переделать
	*/
	this.setValuePosition = function(elmEvent)
	{
		if (elmEvent.attr("type") == "horizontal") {
			var valuePosition = parseInt(elmEvent.css("top"));
			valuePosition += this.getOffsetHorizontal();
		} else {
			var valuePosition = parseInt(elmEvent.css("left"));
			valuePosition -= this.getOffsetVertical()
		}

		valuePosition = parseInt(valuePosition + 0.5);

		$(".valueGuidesPosition").val(valuePosition);
	}
/*********************************************************************************************/
	/**
	* Удалить
	*
	* @see 	this.setEventPanelProperty()
	*/	 
	this.setEventDelete = function()
	{
		var obj = this;
		// удаление
		$(".butGuidesDelete").off("click");
		$(".butGuidesDelete").on("click", function(eventDown) {
			$(".guides[chosen='true']").remove();
			//закрываем параметры 
			obj.closeProperty();
		});
	}
/***********************************************************************************************/
	/**
	* Изменить цвет
	*
	* @see 	this.setEventPanelProperty()
	*/
	this.setEventChangeColor = function()
	{
		// изменить цвет
		$(".guidesColorItem").off("click");
		$(".guidesColorItem").on("click", function(eventDown) {
			var color = $(this).css("background-color");
			$(".guides[chosen='true']").find(".guidesContent")
									.css("background-color", color);
		});
	}
/**********************************************************************************************/
	/**
	* Закрытие параметров 
	*
	* @see this.setEventPanelProperty()
	*/
	this.setEventCloseProperty = function()
	{
		var obj = this;
		$(".wrapper").off("mouseup");
		$(".wrapper").on("mouseup", function() {
			// прячем блок с параметрами
			obj.closeProperty();
		});

		$(".guidesPropertySection").off("mouseup");
		$(".guidesPropertySection").on("mouseup", function() {
			return false;
		});
	}

	/**
	*
	* Закрываем блок с параметрами
	*
	* @see 	this.guidesDown()
	* @see 	this.setEventDelete()
	*/
	this.closeProperty = function()
	{
		$(".guidesPropertySection").css("display", "none");
	}
/***********************************************************************************************/
	/**
	* Смещение сверху
	*
	* @see 	this.setValuePosition()
	* @see 	this.setEventValuePosition()
	* @see 	this.guidesDown()
	* @see 	this.setPositionVertical()
	*/
	this.getOffsetVertical = function()
	{
		var offset = 0;
		// var currentScreen = Screen.getCurrent();
		if (!Element.obj) return offset;
		
		if (!Screen.isModal()) {
			var offset =  $(".content .section .section-content").offset().left - 3 - $(".content .site").offset().left;
		} else {
			var elmModal = $(".contentModal .modal");
			if (elmModal.length) offset = elmModal.offset().left - $(".contentModal .modalWrap").offset().left;
		}

		// if (offset > 0) offset -= 3;

		return offset;
	}

	/**
	* Смещение сверху
	*
	* @see 	this.setValuePosition()
	* @see 	this.guidesDown()
	*/
	this.getOffsetHorizontal = function()
	{
		return 3;
	}

/*************************************************************************************************/
}//end class

/**
* Экран
*
*
*
*/
var Screen = new Screen();
function Screen() {
	/**
	* Тип экрана и разрешение
	* @see ElementCss.getStyleTag()

	*/
	// this.listMaxWidth = {"tab-p":850, "mobile-l":670, "mobile-p":380}; 

	/**
	* 
	* @see 	ElementCss.getListValueVisible()
	*/
	this.list = ["desktop", "tab-l", "tab-p", "mobile-l", "mobile-p"];
	this.listInitial = {
		"desktop" : "", 
		"tab-l" : "tl", 
		"tab-p" : "tp", 
		"mobile-l" : "ml", 
		"mobile-p" : "mp"
	};
/***************************************************************************************/
	/**
	* Медия запросы
	*
	*
	* @see ElementCss.getStyleTag()
	*/
	this.mediaQuery = {
		"tab-l": 	"screen and (max-width: 1024px), screen and (max-device-width: 1024px)",
 		"tab-p": 	"screen and (max-width: 799px), screen and (max-device-width: 799px), \n\t\t screen and (min-device-width: 800px) and (max-device-width: 1249px) and (orientation: portrait)",
		"mobile-l": "screen and (max-width: 599px), screen and (max-device-width: 599px), \n\t\t screen and (min-device-width: 600px) and (max-device-width: 760px) and (orientation: landscape)", 
		"mobile-p": "screen and (max-width: 429px), screen and (max-device-width: 429px)"
	};

/***************************************************************************************/
	/**
	* Отдает список экранов
	*
	* @see 	ElementCss.getListStyleFromAttr()
	* @see 	ElementCss.clearAllStyleScreen()
	* @see 	ElementCss.deleteByClass()
	* @see 	ElementCss.clearAllScreen()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StyleMenuGeometry.clearFillVacuum()
	* 
	* @todo переделать
	*/
	this.getListScreen = function(screen)
	{
		switch (screen) {
			case "desktop": var listScreen = ["desktop", "tab-l", "tab-p", "mobile-l", "mobile-p"]; break;
			case "tab-l" : var listScreen = ["tab-l", "tab-p", "mobile-l", "mobile-p"]; break;
			case "tab-p" : var listScreen = ["tab-p", "mobile-l", "mobile-p"]; break;
			case "mobile-l" : var listScreen = ["mobile-l", "mobile-p"]; break;
			case "mobile-p" : var listScreen = ["mobile-p"]; break;
			default: break;
		}
		
		return listScreen;
	}

	/**
	* Отдает список до указанного
	* 
	*  @see ElementCss.getStyleGeometry()
	*/
	this.getListScreenTo = function(screen)
	{
		switch (screen) {
			case "desktop": var listScreen = ["desktop"]; break;
			case "tab-l" : var listScreen = ["desktop", "tab-l"]; break;
			case "tab-p" : var listScreen = ["desktop", "tab-l", "tab-p"]; break;
			case "mobile-l" : var listScreen = ["desktop", "tab-l", "tab-p", "mobile-l"]; break;
			case "mobile-p" : var listScreen = ["desktop", "tab-l", "tab-p", "mobile-l", "mobile-p"]; break;
			default: break;
		}
		
		return listScreen;
	}
/************************************************************************************************/
	/**
	* Отдает текущий экран
	*
	* @see 	this.getInitial()
	* @see 	StyleMenuGeometry.editFloat()
	* @see 	Guides.getOffsetVertical()
	* @see 	StyleMenuGeometry.setMGFillVacuum(), .editPaddingVer()
	* @see 	this.isDesktop() 
	*/
	this.getCurrent = function()
	{
		return $(".butShowItem[chosen='true']").attr("screen");
	}

	/**
	* Устанавливает desktop
	*
	* @see 	Editor.setSize()
	* @see 	ElementSelf.insertElement()
	* @see 	StyleMenuGeometry.editPositionType()
	* @see 	StyleMenuGeometry.editPositionSide()
	* @see 	StyleMenuGeometry.editFloatSide()
	* @see 	StyleMenuBg.manipAllBgOther()
	* @see 	ManagerModal.addNewElm()
	* @see 	Site.saveAvatar()
	*/
	this.setDesktop = function()
	{
		if (!this.isDesktop() && !ElementNavPanelMobile.isShow) {
			$(".butShowDesctop").mousedown();
		}
	}

	this.setTabP = function()
	{
		$(".butShowTabV").mousedown();
	}

	this.setMobileL = function()
	{
		$(".butShowMobileH").mousedown();
	}

	/**
	* Если экран desktop
	*
	* @see 	this.setDesktop()
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleUnit.getDefaultUnit()
	* @see 	StyleMenuGeometry.editFloat(), .setValueWithOffset()
	* @see 	Element.isGeneral()
	* @see 	StyleMenuBg.set()
	* @see 	StyleCanvas.setEventMoveMouseUp()
	*/
	this.isDesktop = function()
	{
		var screen = $(".butShowItem[chosen='true']").attr("screen");
		if (screen == "desktop") return true;
		else return false;
	}

	/**
	* Если экран desktop
	*
	* @see 	StyleMenuBg.set()
	*/
	this.isTabL = function()
	{
		return this.getCurrent() == "tab-l";
	}

	/**
	* Отдает инициал
	*
	* @see 	StyleMenuGeometry.editFillVacuum(), .getClassAlignScreen()
	* @see 	StyleMenuGeometry.editFloat()
	*/
	this.getInitial = function(curScreen)
	{
		if (!curScreen) curScreen = this.getCurrent();
		return this.listInitial[curScreen];
	}

	/**
	* Отдает инициал
	*
	* @see 	StyleMenuGeometry.removeClassFloat
	*/
	this.getListInitial = function()
	{
		return this.listInitial[curScreen];
	}

/********************************************************************************************/
	/**
	* Узнает экран это modal
	*
	* @see 	Guides.getOffsetVertical()
	* @see 	Element.getParent()
	* @see 	Resize.setEventMouseUp()
	* @see 	ElementStyleController.setEventCanvas()
	* @see 	EditorController.setEventNavMenu()
	* @see 	ElementBasic.create()
	* @see 	Editor.setMenuButtonInactive()
	* @see 	Editor.modeShow()
	* @see 	Site.isSaveAvatar(), .fix()
	* @see 	ManagerModal.fix()
	* @see 	Site.save()
	* @see 	TemplateSection.addNewTemplate(), .setEventAddTemplate()
	* @see 	ManagerModal.deleteElm()
	*/
	this.isModal = function() 
	{
		return $(".content").css("display") == "block" ? false : true;
	}

	/**
	* Переключается на модальное
	*
	* @see 	ManagerModal.chosenItem()
	*/
	this.toggleModal = function()
	{
		if (!this.isModal()) $(".topPanelNavModal").mousedown();
	}

	/**
	* Переключается на страницу
	*
	* @see 	TemplateSection.setEventAddTemplate()
	*/
	this.togglePage = function()
	{
		if (this.isModal()) $(".topPanelNavPage").mousedown();
	}

	/**
	* Устанавливает scroll
	*
	* @see 	ElementNavPanelMobile.setEvent()
	* @see 	TemplateSection.saveTemplateAvatar()
	* @see 	Site.saveAvatar()
	* @see 	EditorController.setEventTab()
	*/
	this.setScroll = function(scrollValue)
	{
		if (!scrollValue) scrollValue = 0;
		Editor.getCanvas().scrollTop(scrollValue);
	}

	/**
	* Устанавливает scroll
	*
	* @see 	EditorController.setEventTab()
	*/
	this.getScrollTop = function()
	{
		var contentObjV = Editor.getCanvas();
		return contentObjV.scrollTop();
	}

	/**
	*
	*
	* @see 	StyleMenuGeometry.setMGWidth()
	*/
	this.getWidthDefault = function()
	{
		return 1024;
	}

	/**
	* устанавливаем экран после просмотра
	*
	*
	* @see 	Editor.modeEdit()
	*/
	this.setEditorAfterShowing = function()
	{
		
	}

/****************************************************************************************************/
}// end class

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
/**
* Линейка
*
*
*/ 
var Scale = new Scale(); 
function Scale() {
	/**
	* Создает линейку
	*
	* @see 	Page.replace()
	*/	
	this.create = function()
	{
		// создаем линейку
		this.createHorizontal();
		this.createVertical();

		// ставим позицию
		Scale.setPosition();
	}
/*******************************************************************************************/
	/**
	* Создает вертикальную линейку
	*
	* @see this.create()
	*/
	this.createHorizontal = function()
	{
		$(".scaleHorizontalWrap").remove();
		
		var scale = this.getBlocksNegative(20);
		scale += this.getBlocksPositive(80);
		var blockHorizontal = '\
			<div class="scaleWrap scaleHorizontalWrap">\
				<div class="scale scaleHorizontal">'+scale+'</div>\
			</div>';
		// $(".contentWrap").prepend(blockHorizontal);
		// $(".topPanel").append(blockHorizontal);
		$(".contentSection").prepend(blockHorizontal);
	}

	/**
	* Создает вертикальную линейку
	*
	* @see this.create()
	*/
	this.createVertical = function()
	{
		$(".scaleVerticalWrap").remove();
		
		var scale = this.getBlocksPositive(1000);
		var blockVertical = '\
			<div class="scaleWrap scaleVerticalWrap">\
				<div class="scale scaleVertical">'+scale+'</div>\
			</div>';
		
		$(".content").prepend(blockVertical);
		// $(".site").prepend(blockVertical);
		// $(".contentWrap").prepend(blockVertical);
		$(".contentModal").prepend(blockVertical);
	}

/***********************************************************************************************/
	/**
	* Создание блока
	*
	* @see this.createVertical(), this.createHorizontal()
	*/
	this.getBlocksPositive = function(number_block)
	{
		var scale = "";
		for (var i = 0; i < number_block; i++) {
			var  label = 100 * i / 2;
			scale += this.getOneBlock(label);
		}
		return scale;
	}

	/**
	* Создание блока
	*
	* @see this.createHorizontal()
	*/
	this.getBlocksNegative = function(number_block)
	{
		var scale = "";
		for (var i = number_block; i > 0; i--) {
			var  label = (100 * i / 2)*(-1);
			scale += this.getOneBlock(label);
		}
		return scale;
	}

	/**
	* Отдает один элемент
	*
	* @see 	this.getBlocksPositive()
	* @see 	this.getBlocksNegative()
	*/
	this.getOneBlock = function(label)
	{
		var scale = '\
			<div class="scaleBlock">\
				<div class="scaleLabel">'+label+'</div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
			</div>';

		return scale;
	}
/***********************************************************************************************/
	/**
	* Ставит позицию линейки
	*
	*
	* @see 	this.create()
	* @see 	Editor.setSize()
	* @see 	ElementSelf.insertElement()
	* @see 	StyleMenuGeometry.editWidth()
	*/
	this.setPosition = function()
	{
		if ($(".content").css("display") == "block") {
			var sectionContent = $(".content .section .section-content");
		} else {
			var sectionContent = $(".contentModal .modal");
		}
		
		// вертикальная линейка
		if (sectionContent.length) {
			var left = sectionContent.offset().left-$(".scaleVerticalWrap").width();
		} else {
			var left = 0;	
		}
		
		var marginLeft = left - 1000;
		$(".scaleHorizontal").css({"margin-left":marginLeft});
	}

/************************************************************************************************/

	/**
	* Видно или нет
	*
	* @see 	Editor.setScale()
	*/
	this.isShow = function()
	{
		return $(".scaleWrap").css("display") != "none";
	}

}//end class











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
			// нету Pro
			if (!Rate.isExistsModePro() && modeType == "pro") {
				Rate.showModalLimitation("editor_pro");
				return false;
			}

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





/**	
* Список элементов
* @see 	ElementAddController.setEvent()
* @see 	Element.setData(), Element.getValueProperty()
* @see 	PageStruct.getStruct()
*/
ListElementObject = {
	'site':ElementSite,
	'modal':ElementModal,
	
	'nav':ElementNav,
	'nav-item':ElementNavItem,
	'nav-panel-mobile':ElementNavPanelMobile,
	'nav-mobile':ElementNavMobile,
	'nav-item-mobile':ElementNavItemMobile,
	'nav-button-mobile':ElementNavButtonMobile,
	
	'section':ElementSection,
	'row':ElementRow,
	'column':ElementColumn,

	'block':ElementBlock,
	'heading':ElementHeading,
	'text':ElementText,
	'text-span':ElementTextSpan,
	'button':ElementButton,
	'image':ElementImage,
	'video':ElementVideo,

	'hlp-ol':ElementListOl,
	'hlp-ul':ElementListUl,
	'hlp-li':ElementListLi,
	
	'map':ElementMap,
	'embed':ElementEmbed,
	
	'form':ElementForm,
	'input':ElementInput,
	'textarea':ElementTextarea,
	'submit':ElementSubmit,
	'hlp-select':ElementSelect,
	'checkbox':ElementCheckbox,
	'radio':ElementRadio,
	'upload_file_wrap':ElementUploadFileWrap,
	'upload_file':ElementUploadFile,
	'upload_file_name':ElementUploadFileName,

	// slider
	'slider':ElementSlider,
	'hlp-slider-arrow-img':ElementSliderArrowImg,
	'hlp-slider-bullet':ElementSliderBullet,
	'hlp-slider-list-bullets':ElementSliderListBullets,
	
	// tabs
	'hlp-tabs':ElementTabs,

	// базовый тип
	'basic-type':ElementBasicTypeSelf,

} // end class

/***********************************************************************************************/

StyleMenu.list = {
	"fixed":{
		"object":StyleMenuFixed,
		"block":""
	},
	"geometry":{
		"object":StyleMenuGeometry,
	},
	"proportion":{
		"object":StyleMenuGeometry, 
		"function":"setMGProportion", 
		"block":"menuProportion"
	},
	"width":{
		"object":StyleMenuGeometry, 
		"function":"setMGWidth", 
		"block":"menuProportion"
	},
	"height":{
		"object":StyleMenuGeometry, 
		"function":"setMGHeight", 
		"block":"menuProportion"
	},
	"min-height":{
		"object":StyleMenuGeometry, 
		"function":"setMGMinHeight", 
		"block":"menuProportion"
	},
	"position":{
		"object":StyleMenuGeometry, 
		"function":"setMGMenuPositionType", 
		"block":"menuPositionType"
	},
	"position-panel":{
		"object":StyleMenuGeometry, 
		"function":"setMGPositionPanel", 
		"block":"menuPositionPanel"
	},
	"margin":{
		"object":StyleMenuGeometry, 
		"function":"setMGMargin", 
		"block":"menuMargin"
	},
	"margin_v":{
		"object":StyleMenuGeometry, 
		"function":"setMGMarginV", 
		"block":"menuMargin"
	},
	"margin_v_site":{
		"object":StyleMenuGeometry, 
		"function":"setMGMarginV", 
		"block":"menuMarginVSite"
	},
	"margin_h":{
		"object":StyleMenuGeometry, 
		"function":"setMGMarginH", 
		"block":"menuMargin"
	},
	"padding":{
		"object":StyleMenuGeometry, 
		"function":"setMGPadding", 
		"block":"menuPadding"
	},
	"padding_v":{
		"object":StyleMenuGeometry, 
		"function":"setMGPaddingV", 
		"block":"menuPadding"
	},
	"padding_h":{
		"object":StyleMenuGeometry, 
		"function":"setMGPaddingH", 
		"block":"menuPadding"
	},
	"align":{
		"object":StyleMenuGeometry, 
		"function":"setMGAlign",
		"block":"menuPositionAlign"
	},
	"floatSide":{
		"object":StyleMenuGeometry, 
		"function":"setMGFloatSide", 
		"block":"menuFloatSide"
	},

	"bg":{
		"object":StyleMenuBg, 
		"function":"set", 
		"block":"menuBg", 
		"color":"valueBgColor, .valueVideoColor" 
	},
	"border":{
		"object":StyleMenuBorder, 
		"function":"set", 
		"block":"menuBorder",  
		"color":"valueBorderColor"
	},
	"animate":{
		"object":StyleMenuAnimate,
		"block":"menuStyleAnimate",
		"function":"set"
	},
	"boxShadow":{
		"object":StyleMenuBoxShadow, 
		"function":"set", 
		"block":"menuBoxShadow", 
		"color":"valueShadowColor"
	},
	"textShadow":{
		"object":StyleMenuTextShadow, 
		"function":"set", 
		"block":"menuTextShadow", 
		"color":"valueTextShadowColor"
	},
	"transform":{
		"object":StyleMenuTransform,
		"function":"set", 
		"block":"menuTransform"
	},
	"filter":{
		"object":StyleMenuFilter, 
		"function":"set", 
		"block":"menuFilter"
	},
	"text":{
		"object":StyleMenuText, 
		"function":"set", 
		"block":"menuText", 
		"color":"valueTextColor, .valueTextBgColor"
	},
	"other":{
		"object":StyleMenuOther, 
		"function":"set", 
		"block":"menuOther"
	},
	"list":{
		"object":StyleMenuList, 
		"function":"set", 
		"block":"menuStyleList"
	},

/**********************/
	
	"floatSide":{
		"object":StyleMenuGeometry, 
		"function":"setMGFloatSide", 
		"block":"menuFloatSide"
	},

};

/***************************************************************************************************/
ElementSetting.list =  {
	"fixed":{
		"object":ElementSettingFixed,
		"block":""
	},
	"general":{
		"object":ElementSettingGeneral,
		"block":""
	},
	"grid":{
		"object":ElementSettingGrid,
		"block":"menuSettingGrid"
	},
	"click":{
		"object":ElementSettingClick,
		"block":"menuSettingClick"
	},
	"seo":{
		"object":ElementSettingSEO,
		"block":"menuSettingSEO"
	},
	"heading":{
		"object":ElementSettingHeading,
		"block":"menuSettingHeading"
	},
	"form":{
		"object":ElementSettingForm,
		"block":"menuSettingForm",
		"function":"setMGForm"
	},
	"input":{
		"object":ElementSettingForm,
		"block":"menuSettingFormInput",
		"function":"setMGInput"
	},
	"submit":{
		"object":ElementSettingForm,
		"block":"menuSettingForm",
		"function":"setMGSubmit"
	},
	"checkbox":{
		"object":ElementSettingForm,
		"block":"menuSettingFormCheckbox",
		"function":"setMGCheckbox"
	},
	"select":{
		"object":ElementSettingForm,
		"block":"menuSettingFormSelect",
		"function":"setMGSelect"
	},
	"upload_file":{
		"object":ElementSettingForm,
		"block":"menuSettingFormFile",
		"function":"setMGUploadFile"
	},
	"section":{
		"object":ElementSettingSection,
		"block":"menuSettingSection",
		"function":"set"
	},
	"triger":{
		"object":ElementSettingTriger,
		"block":"menuSettingTriger",
		"function":"set"
	},
	"export":{
		"object":ElementSettingGeneral,
		"block":"menuSettingExport",
		"function":"setMGExport"
	},
};

/***************************************************************************************************/
ElementWidget.list =  {
	"slider":{
		"object":ElementWidgetSlider,
		"block":"menuWidgetSlider",
		"function":"set"
	},

	"gallery_modal":{
		"object":ElementWidgetGalleryModal,
		"block":"menuWidgetGalleryModal",
		"function":"set"
	},

	"tabs":{
		"object":ElementWidgetTabs,
		"block":"menuWidgetTabs",
		"function":"set"
	},
};

/**********************************************************************************************/
ListEditElement = {
	'image':EditElementImage,
	'nav-button-mobile':EditElementImage,
	'hlp-slider-arrow-img':EditElementImage,
	'heading':TextEditor,
	'text':TextEditor,
	'text-span':TextEditor,
	'hlp-li':TextEditor,
	'video':EditElementVideo,
	'map':EditElementMap,
	'embed':EditElementEmbed,
	'form':EditElementForm,
}



/**
* Входная точка
*
*/
/********************************************************************************/
var Input = new Input();
function Input() {
	/**
	* Запуск системы
	*
	*
	*/	
	this.init = function(params)
	{
		//ставим переменые
		Data.set(params);
		// для тарифа
		Rate.init();

		//вставляем страницу в редактор
		Site.insert();
		Page.insertFirst();
		
		// ставим события
		this.setEvent();

		// делаем не активными некоторые действия
		this.setNoActivityAction();
		// ставим размер экрана
		Editor.setSize();

		// фиксируе историю
		History.record();

		// // режим редактора
		// var modeV = Data.site.data.mode_simple ? "lite" : "pro";
		// Editor.setModeWork(modeV);

		// режим редактора
		var modeType = !Rate.isExistsModePro() ? Rate.getModeLite() : false;
		Editor.setModeWork(modeType);
	}	
/*************************************************************************************/
	/**
	* Устанавливает события для всего редактора
	*
	*
	*/
	this.setEvent = function()
	{
		//переделать
		setEventGeneral();
	/***************************************************************************/
	/****************************************************************************/
		//изменение стиля
		ElementStyleController.setEvent();
		//изменение настроек
		ElementSettingController.setEvent();
		//добавление элемента
		ElementAddController.setEvent();
		//манипуляция с элементом
		ElementManController.setEvent();
		// для сайта
		SiteController.setEvent();
		//страница
		PageController.setEvent();
		//редактор
		EditorController.setEvent();
	}
/***********************************************************************************/
	/**
	* Делаем не активными некоторые действия
	*
	*/
	this.setNoActivityAction = function()
	{
		//делаем что бы не чего не выделялось
		var list = $('.topPanel, .scaleWrap, .leftMenu, .scroll, .rightMenuSectionTitle, .handBorderBlock');
		list.attr('onmousedown', 'return false');
	}
/*************************************************************************************/
	/**
	* Новый элемент
	*
	* @see 	SelfElement.setEvent() 			создание и вставление на страницу элемента
	* @see 	History.set()  					устанавливаем запись из истории
	* @see 	Page.replace() 				замена страницы
	* @see 	ElementSettingGrid.editDesctopCount()
	* @see 	PageStruct.moveElm()
	* @see 	ElementSettingHeading.edit()
	* @see 	ManagerModal.setInCanvas()
	* @see 	ElementManController.moveUpSection()
	* @see 	StyleMenuGeometry.editFullWidth()
	* @see 	ElementSlider.setEventAdd()
	* @see 	ElementGallery.setEventAddItem()
	* @see 	ElementManController.setEventModeSimpleCopy()
	*/
	this.newCanvas = function() 
	{		
		//событие полотна
		ElementStyleController.setEventCanvas();
		//изменение элемента
		ElementEditController.setEvent();
		//выделить элементы рамкой(если стоят галочки)
		// StyleCanvas.allocateAll();
		// строим структуру
		PageStruct.build();

		setTimeout(function() {
			Guides.setEvent();
		}, 100);
	}
/****************************************************************************************/

}

