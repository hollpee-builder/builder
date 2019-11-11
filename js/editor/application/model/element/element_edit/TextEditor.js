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

