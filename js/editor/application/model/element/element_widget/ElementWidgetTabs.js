/**
* Виджет слайдер
*
*
*/

ElementWidgetTabs.prototype = ElementWidgetBasicList;
var ElementWidgetTabs = new ElementWidgetTabs();
function ElementWidgetTabs() {
	this.class = {};
	this.class.input_list = "valueTabsCurItem";
	this.class.but_add = "butWidgetTabsAdd";
	this.class.but_delete = "butWidgetTabsDelete";
	this.class.list_item = "hlp-tabs-item";

	this.class.select_chosen = "valueClickTabs";

	this.selector = {};
	this.selector.list = "> .hlp-tabs-item";


	this.set = function(elm)
	{
		this.setList(elm);
	}

	/**
	* Установка для кнопок
	*
	* @see 	ElementSettingClick.setTabs()
	*/ 
	this.setSelectBut = function(elm)
	{
		var parentObj = elm;
		for (var i = 0; i < 10; i++) {
			var tabsObj = parentObj.find(".hlp-tabs");
			
			if (tabsObj.length) break;
			if (parentObj.hasClass("hlp-section")) break;
			parentObj = parentObj.parent();
		}

		var listTabsItem = tabsObj.find("."+this.class.list_item);

		var listSelectV = '<div class="option" value="none">'+Resource.main_value_none+'</div>';
		var countItem = listTabsItem.length;
		for (var iItem = 0; iItem < countItem; iItem++) {
			var itemIndexV = listTabsItem.eq(iItem).attr("data-hlp-index"); 
			listSelectV += '<div class="option" value="'+itemIndexV+'">'+itemIndexV+'</div>';
		}

		$(".valueClickTabs .optionBlock").html(listSelectV);
	}

} // end class 

