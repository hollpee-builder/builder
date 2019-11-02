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

