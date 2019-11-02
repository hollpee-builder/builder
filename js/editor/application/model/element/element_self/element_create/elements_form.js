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

