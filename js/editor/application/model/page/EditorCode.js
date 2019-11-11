
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
