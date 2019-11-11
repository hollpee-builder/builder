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






