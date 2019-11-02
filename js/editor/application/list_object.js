
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



