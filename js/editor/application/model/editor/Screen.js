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

