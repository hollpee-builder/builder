var ElementSite = new ElementSite();
function ElementSite() {
	this.type = "site";
	this.class = "site";
	this.no_move = true;
	this.no_resize = true;
	this.no_manipulation = true;
	this.no_edit_class = true;
	this.title = {'name':Resource.hlp_element_name_site, 'img':'page.png', 'type':'none'};
	this.css = ["text"];
} 
/*****************************************************************************************/
/****************************************************************************************/
/**
* Создание секции
*/
ElementSection.prototype = ElementBasic;
var ElementSection = new ElementSection();
ElementSection.parent = ElementBasic;
function ElementSection() {
	this.type = "section";
	this.class = 'section';
	this.is_insert = true;
	this.no_move = true;
	this.no_resize = true;
	this.is_added_block = true;
	this.noParentModal = true; //не может быть родитель модальное окно
	// this.no_resize = true;
	this.title = {'name':Resource.hlp_element_name_section, 'img':'section.png', 'type':'none'};
	this.css = ["position", "width", "min-height", "padding", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["section"];
	this.widget = ["gallery_modal"];
	
	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var listSection = $(".section");
		var elmNum = Element.getMaxNumberClass(listSection, "data-num");

		//секция
		var block = '	<section class="new-element element section hlp-section" data-num="'+elmNum+'">\
							<div class="element-content hlp-section-content section-content">\
							</div>\
						</section>';
		return block;
	}

	this.actionAfter = function(params)
	{
		Grid.create(true);
	}

	/**
	*
	*
	*
	* @see 	PrivacyPolicy.addPrivacyPolicy()
	*/
	this.addNum = function(elmSecV)
	{
		var listSection = $("."+elmSecV.attr("elm-type"));
		var elmNum = Element.getMaxNumberClass(listSection, "data-num");
		elmSecV.attr("data-num", elmNum);
	}

	this.replaceDublNum = function()
	{
		var listSection = $(".section");
		var countV = listSection.length;

		var listNumV = {};
		for (var iSecV = 0; iSecV < countV; iSecV++) {
			var secObjV = listSection.eq(iSecV);
			var numV = secObjV.attr("data-num");

			// если дубль
			if (listNumV[numV]) {
				this.addNum(secObjV);
				numV = secObjV.attr("data-num");
			}
			
			listNumV[numV] = true;
		}
	}	

}// end class
/*********************************************************************************************/
/****************************************************************************************************/
/**
* Ряд
*/
ElementRow.prototype = ElementBasic;
var ElementRow = new ElementRow();
ElementRow.parent = ElementBasic;

function ElementRow()
{
	this.type = "row";
	this.class = 'row';
	// this.no_move = true;
	// this.no_resize = true;
	// this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_row, 'img':'row.png', 'type':'none'};
	this.css = ["width", "padding", "margin", "align", "text", "bg", "border", "boxShadow", "other"];
	this.setting = ["grid"];
	this.widget = ["gallery_modal"];

	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var block = '	<div class="new-element element row hlp-row">\
						</div>';
		return block;
	}

}// end class
/*********************************************************************************************/
/****************************************************************************************************/
/**
* Колонки
*/
ElementColumn.prototype = ElementBasic;
var ElementColumn = new ElementColumn();
ElementColumn.parent = ElementBasic;

function ElementColumn()
{
	this.type = "column";
	this.class = 'column';
	this.no_move = true;
	this.no_resize = true;
	this.is_insert = true;
	// this.notAddClass = true;
	// this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_column, 'img':'columns.png', 'type':'none'};
	this.css = ["margin_v", "padding", "min-height", "floatSide", "text", "bg", "border", "boxShadow", "transform", "other"];
	this.setting = ["grid"];
	this.widget = ["gallery_modal"];
/****************************************************************************************/
	/**
	* Список 
	* @see 	this.getElementHtml()
	* @see 	ElementSettingGrid.editDesctopCount()
	*/
	this.listCount = {
		"2":[6,6],
		"3":[4,4,4],
		"4":[3,3,3,3],
		"5":[3,2,2,2,3],
		"6":[2,2,2,2,2,2],
	} 

	/**
	* @uses 	this.setVarDataElm()-parent 		
	*/	
	this.getElementHtml = function()
	{
		var elm = Element.obj;
		var type = Element.data.type;
		//выбраное количество колонок
		var countColumn = this.params.count_column;
		if (!countColumn) countColumn = 4;//определенно заранее

		//ставим вкладку настройки
		$(".rightMenuNavItem[type='setting']").mousedown();

		//создаем колонки 
		var listWeight = this.listCount[countColumn];
		var columnClassUnique = Element.getNewClassUnique("column");
		var block = ''; 
		for (var indexWeight in listWeight) {
			var weight = listWeight[indexWeight];

			block += '\
				<div class="new-element element hlp-col column">\
				</div>';
		}

		// если родитель не строка или строка не пустая  
		var rowClassUnique = Element.getNewClassUnique("row");
		block = '<div style="width:100%;" class="element row hlp-row '+rowClassUnique+' hlp-row-col-'+countColumn+'" class-unique="'+rowClassUnique+'" count-column="'+countColumn+'" count-row="1" elm-type="row">'+block+'</div>';

		return block;
	}


	this.actionAfter = function(params)
	{
		var elmColV = Element.getObj();
		var elmRowV = elmColV.parent();
		ElementCss.set(false, elmRowV);
	}

/*****************************************************************************************/
}// end class
/**************************************************************************************************/
/****************************************************************************************************/













