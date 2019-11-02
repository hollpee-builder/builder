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

