/**
* Виджет юазовый для списка
*
*
*/

var ElementWidgetBasicList = new ElementWidgetBasicList();
function ElementWidgetBasicList() {
	this.attr = {};
	this.attr.item_index = "data-hlp-index";

	this.class = {};
	this.class.input_list = "";
	this.class.but_add = "";
	this.class.but_delete = "";
	this.class.list_item = "";

	this.selector = {};
	this.selector.list = "";
	this.selector.add = false;


	this.setList = function(elm)
	{
		var slideBlockV = '';
		var listSlideV = elm.find(this.selector.list);
		var countSlide = listSlideV.length;

		for (var iSlide = 0; iSlide < countSlide; iSlide++) {
			var elmItemV = listSlideV.eq(iSlide);
			var dataIndexV = elmItemV.attr(this.attr.item_index);
			slideBlockV += '<div class="menuButValue menuButValueText" value="'+dataIndexV+'"><span>'+dataIndexV+'</span></div>';
		}

		var selectObjV = $("."+this.class.input_list);
		selectObjV.html(slideBlockV);

		var curSlideObj = listSlideV.filter("[data-hlp-chosen='true']");
		var curSlideIndex = curSlideObj.attr(this.attr.item_index);

		StyleMenu.chosenToggleBut(selectObjV, curSlideIndex);
		ElementSettingController.setEventEdit("menuWidget");
	}

	/**
	* Выбор текущего
	*
	* @see 	menu
	* @see 	this.editCurSlide()
	*/ 
	this.editCurSlide = function(elm, value)
	{
		var listItemV = this.getListItem(elm);
		listItemV.removeAttr("data-hlp-chosen");
		listItemV.filter("["+this.attr.item_index+"='"+value+"']")
					.attr("data-hlp-chosen", "true");

		// отмечаем в select
		StyleMenu.chosenToggleBut($("."+this.class.input_list), value);
	}

/************************************************************************************/
/************************************************************************************/

	/**
	* Отдает слайдер который сейчас виден
	*
	* @see 	ElementSelf.insertElement()
	* @see 	this.deleteSlide()
	* @see 	ElementMan.insertElmInBuffer()
	*/
	this.getCurItem = function(elm)
	{
		var listSliderItemV = this.getListItem(elm);
		var curSliderObjV = listSliderItemV.filter("[data-hlp-chosen='true']");
		if (!curSliderObjV.length) curSliderObjV = listSliderItemV.first(); 
		
		return curSliderObjV;
	}

	/**
	* Отдает список слайдов
	*
	* @see 	this.getCurSliderItem()
	* @see 	this.deleteSlide()
	* @see 	this.getCurItem()
	* @see 	this.addSlide()
	*/
	this.getListItem = function(elm)
	{
		if (!elm) elm = Element.obj;
		return elm.find(this.selector.list);
	}


/************************************************************************************/
/************************************************************************************/
	
	/**
	* События
	*
	* @see 	ElementWidget.setEvent()
	*/
	this.setEvent = function()
	{
		// добавление слайда
		this.setEventAdd();
		// удаление слайда
		this.setEventDelete();
	}

	/**
	* Добавление слада
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var butObj = $("."+this.class.but_add);
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.addItem();
		});
	}

	/**
	* Добавление слайда
	*
	* @see 	this.setEventAdd()
	*/
	this.addItem = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listItemBeforeAddV = this.getListItem(elm);
		var countItemV = listItemBeforeAddV.last().attr(this.attr.item_index);
		if (!countItemV) countItemV = 0;
		var itemIndexV = parseInt(countItemV)  + 1;

		// добавляем
		var oldElmV = this.getCurItem(elm);
		var elmContentV = oldElmV.html();

		var newSlideBlockV = '<div '+this.attr.item_index+'="'+itemIndexV+'" class="'+this.class.list_item+'">'+elmContentV+'</div>';
		var elmContent = elm;
		if (this.selector.add) elmContent = elmContent.find(this.selector.add);
		elmContent.append(newSlideBlockV);

		// ставим слайды в меню
		this.setList(elm);
		
		// выбираем текущий
		var listItemV = this.getListItem(elm);
		var lastIndexV = listItemV.last().attr(this.attr.item_index);
		this.editCurSlide(elm, lastIndexV);

		// 
		Element.addNewId(this.getCurItem(elm), true);
		Input.newCanvas();
	}
		
	/**
	* Удаление слада
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		var butObj = $("."+this.class.but_delete);
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите удаление текущего элемента", function() {
				obj.delete();
			})
		});
	}

	/**
	* Удаление слайда
	*
	* @see 	this.setEventDelete()
	*/
	this.delete = function(elm)
	{
		if (!elm) elm = Element.obj;

		var listItemV = this.getListItem(elm);
		if (listItemV.length == 1) {
			Notification.error("Должен быть минимум 1 элемент");
			return false;
		}

		var curSlideObjV = this.getCurItem(elm);
		curSlideObjV.remove();

		var listSliderItemV = this.getListItem(elm);
		listSliderItemV.first().attr("data-hlp-chosen", "true");


		var countItems = listSliderItemV.length;
		for (var iItem = 0; iItem < countItems; iItem++) {
			listSliderItemV.eq(iItem).attr(this.attr.item_index, (iItem+1));
		}

		// ставим слайды в меню
		this.setList(elm);
	}


/************************************************************************************/

} // end class	
