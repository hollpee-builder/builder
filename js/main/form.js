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
















