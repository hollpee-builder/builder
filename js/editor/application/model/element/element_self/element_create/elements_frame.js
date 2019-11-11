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



