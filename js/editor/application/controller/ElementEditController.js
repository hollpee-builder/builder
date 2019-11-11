/**
* Изменение элемента
*
*
*
*/
var ElementEditController = new ElementEditController();
function ElementEditController() {
	/**
	* События - изменить
	*
	* @see 	Resize.create();
	*/
	this.setEvent = function()
	{
		//кнопка вправом меню
		this.setEventButMenu();
		//двойной клик по элементу
		this.setEventDblclick();
	}
/************************************************************************************/
/***изменение элемента********************************************************************************/
	/**
	* Устанавливает событие на кнопку в правом меню
	*
	* @uses 	this.edit()
	* @see 		this.setEvent()
	*/
	this.setEventButMenu = function()
	{
		var obj = this;
		//кнопка изменить в правом меню
		var butObj = $('.rightMenuTopButton, .butEditSimpleBlock');
		butObj.off('mousedown');
		butObj.on('mousedown', function() {
			//изменить
			obj.edit();
		});
	}


	/**
	* При двойном клике
	*
	* @uses 	this.edit()
	* @see 		this.setEvent()
	*/
	this.setEventDblclick = function()
	{
		var obj = this;
		$('.element').off('dblclick');
		$('.element').on('dblclick', function() {
			//если его можно изменить
			if (Element.data.is_edit 
					&& Element.obj.attr("data-property-no-edit") != "true") {
			
				//изменить
				obj.edit();
			}
			return false;
		});
	}
/**********************************************************************************/
	/**
	* Список параметров для функции изменения
	*
	* @see 	this.edit()
	*/
	this.listParamsForEdit = {
		'image': {'operation':'edit_image', 'src':'', 'file_type':'img'},
		'video': {'operation':'edit'},
	}
	
	/**
	* Изменить элемент
	*
	* @uses 	ListEditElement 		список объектов 	
	* @uses 	this.listParamsForEdit 	список параметров
	* @see 		this.setEventButMenu(), this.setEventDblclick()
	*/
	this.edit = function()
	{
		var type = Element.data.edit_type;
		if (!type) type = Element.data.type;
		
		// параметры
		var params = this.getParamsForEdit(type);

		//запускаем функцию
		ListEditElement[type].edit(params);
	}
/***************************************************************************************/
	/**
	* Отдает параметры
	* @see 	this.edit()
	*/
	this.getParamsForEdit = function(type)
	{
		var params = this.listParamsForEdit[type];
		if (!params) params = {};
		
		var childImgObjV = Element.obj.find(" > img");
		if (Element.obj.hasClass("image") || Element.data.edit_type == "image") {
			var elm = Element.obj.find("img");
			if (!elm.length) elm = Element.obj;
			params["src"] = elm.attr("src");
		} else if (childImgObjV.length) {
			params["src"] = childImgObjV.attr("src");
		}


		if (!params["operation"]) {
			if (Element.data.edit_type == "image") {
				params["operation"] = "edit_image";
				params["file_type"] = "img";
			} else {
				params["operation"] = "edit";
			}
		}

		return params;
	}


/*************************************************************************************/
}//end class












