/**
* Базовые типы элемента
*
*
*
*/
var ElementBasicType = new ElementBasicType();
function ElementBasicType() {
	this.class = {};
	this.class.list_elm = "listElmBasicType";
	this.class.select = "selectStyleBasicElmType";

/***************************************************************************************/

	this.getClassListElm = function()
	{
		return this.class.list_elm;
	}

	this.getClassSelect = function()
	{
		return this.class.select;
	}

	/**
	* Отдает селектор по типу
	*
	* @see 	ElementCss.getSelector(), .addTag()
	*/
	this.getSelector = function(typeV)
	{
		var listV = this.getListType();
		var propertyV = listV[typeV];

		return propertyV ? propertyV["selector"] : false;
	}


	/**
	* Значение по умолчанию
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.setSiteSelectDefault = function()
	{
		Select.set($("."+this.getClassSelect()), "all")
	}

	/**
	* Елемент стандартный или нет
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.isElmBasicType = function(elm)
	{
		return elm.closest("."+this.getClassListElm()).length;
	}

	/**
	* Отдает список типов
	*
	* @see 	ElmenetCss.setElmTypeDefault()
	* @see 	this.addListElm()
	* @see 	this.replaceTypeHeading()
	*/
	this.getListType = function()
	{
		return this.listTypeV;
	}

	/**
	*
	*
	* @see 	StyleMenuFixed.editBasicElmType()
	*/
	this.getObjByType = function(typeV)
	{
		var elm = $("."+this.getClassListElm()).find("."+typeV);

		return elm;
	}

	/**
	* Добавляет элементы на страницу
	* 
	* @see 	Page.replace
	*/
	this.addListElm = function()
	{
		var listElmClassV = this.getClassListElm();

		$("."+listElmClassV).remove();

		listTypeV = this.getListType();
		var listElmHtmlV = '';
		for (var classV in listTypeV) {
			var propertyV = listTypeV[classV];

			// не создавать элемент
			if (propertyV["no_create"]) continue;

			var typeV = propertyV["type"];
			var selectorV = propertyV["selector"];
			if (classV == "hlp-type-heading1") tagV = "h1";
			else if (classV == "hlp-type-heading2") tagV = "h2";
			else if (classV == "hlp-type-heading3") tagV = "h3";
			else if (classV == "hlp-type-heading4") tagV = "h4";
			else tagV = "div";

			listElmHtmlV += '<'+tagV+' class="element '+classV+' '+typeV+'" '+Element.getAttrSelector()+'="'+selectorV+'" class-unique="'+classV+'" elm-type="basic-type"></'+tagV+'>';
		}

		var blockV = '\
			<div class="'+listElmClassV+'">\
				'+listElmHtmlV+'\
			</div>';

		$(".content .site").prepend(blockV);
	}

	/**
	* показываем или убираем в блоки меню 
	*
	* @see 	StyleMenuFixed.setBasicElmType(), this.editBasicElmType()
	*/
	this.setVisibleBlockMenu = function(elm, value)
	{
		var blockStyleV = $(".menuOneStyle:not(.menuGeometry)");
		var allBlockNotTextGeom = blockStyleV.not(".menuText");

		// прячим у некоторых стили 
		if (value == "hlp-col" || value == "hlp-row") {
			$(".menuPadding").css("display", "none");
			blockStyleV.css("display", "none");
		} else if (value == "hlp-section-content") {
			$(".menuMargin").css("display", "none");
			blockStyleV.css("display", "none");
		} else if(value != "hlp-but") {
			allBlockNotTextGeom.css("display", "none");
			$(".menuPadding").css("display", "none");
		}

		// не кнопка
		if(value == "hlp-but") {
			$(".menuProportion .menuGeometryPropertyExtended").css("display", "none");
		} else {
			$(".menuPaddingH, .menuProportion").css("display", "none");
		}

		if (value == "hlp-section-content") {
			$(".menuPaddingH").css("display", "block");
		}
	}

	/**
	* Отдает текущий тип
	*
	* @see 	StyleMenuFixed.setBasicElmType()
	*/
	this.getCurrentType = function()
	{
		return Select.get($("."+this.getClassSelect()));
	}

/************************************************************************************/
	
	/**
	* Фиксируем стили для сайта 
	*
	*
	* @see 	Page.fix()
	*/
	this.fixedSiteStyle = function()
	{
		if (Site.isTypeLp()) return false;
		if (!Data.site.data.css) Data.site.data.css = {};

		for (var classV in this.listTypeV) {
			var styleV = Data.page.data.css[classV];
			if (styleV) {
				Data.site.data.css[classV] = styleV;
			}
		}
	}

	/**
	* Устанавливаем стили для сайта 
	*
	* @see 	Page.replace()
	*/
	this.setSiteStyle = function()
	{
		if (Site.isTypeLp()) return false;
		if (!Data.site.data.css) Data.site.data.css = {};

		for (var classV in this.listTypeV) {
			var styleV = Data.site.data.css[classV];
			if (styleV) {
				Data.page.data.css[classV] = styleV;
			} else {
				delete Data.page.data.css[classV];
			}
		}
	}


/************************************************************************************/
/************************************************************************************/

	this.listTypeV = {
			"hlp-type-heading2":{
				"type" : "heading",
				"label" : "Заголовок h2",
				"selector":"h2.heading"
			},
			"hlp-type-heading3":{
				"type" : "heading",
				"label" : "Заголовок h3",
				"selector":"h3.heading"
			}, 
			"hlp-type-heading4":{
				"type" : "heading",
				"label" : "Заголовок h4",
				"selector":"h4.heading"
			}, 

			// ----------------------------------------
			
			"hlp-but":{
				"type" : "button",
				"label" : "Кнопка",
				"selector":".hlp-but"
			},

/************************************************************************************/
			// стандартные стили
			"hlp-nav-panel-mobile" : {"no_create":true},
			"hlp-nav-mobile" : {"no_create":true},
			"hlp-nav-mobile > .hlp-nav-item-mobile" : {"no_create":true},
			"hlp-site" : {"no_create":true},
			"site" : {"no_create":true},
		
		}; // end list


/************************************************************************************/

} // end class
