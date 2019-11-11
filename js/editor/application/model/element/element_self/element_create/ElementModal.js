/**
* Модальное окно
*
*
*
*/
ElementModal.prototype = ElementBasic;
var ElementModal = new ElementModal();
ElementModal.parent = ElementBasic;

// var ElementModal = new ElementModal();
function ElementModal() {
	this.type = 'modal';
	this.class = 'modal';
	this.is_insert = true;
	this.resize_width = true;
	this.no_move = true;
	this.no_manipulation = true;
	this.title = {'name':Resource.hlp_element_name_modal, 'img':'modal.png', 'type':'none'};
	this.css = ["width", "min-height", "margin_v", "padding_v", "bg", "border", "boxShadow", "text"];
	this.width = 450;
	this.style = "margin-top: 50px; background-color: rgb(255,255,255);";

	this.modalNum = false;
/************************************************************************************************/
	
	this.createAction = function(modalClass)
	{
		if (!modalClass) modalClass = Element.getNewClassUnique("modal", "modal");

		// var modalNum = Element.getMaxNumberClass($(".modal"), "data-num");
		// // добавляем префикс
		// modalNum = Element.addClassPrefix(modalNum);
		
		// this.modalNum = modalNum;
		
		// модальное окно
		var content = this.getElementHtml(modalClass);
		
		// блок со списком модальных окон
		var parentModal = this.getListParent();

		// добавляем на страницу
		parentModal.append(content);

		var marginUnit = StyleUnit.getUnitMenu("margin-top");

		// фиксируем стили
		var newModal = $("."+modalClass);
		Element.addNewId(newModal);
		// StyleUnit.setUnitMenu("width", "%");
		StyleUnit.setUnitMenu("margin-top", "px");
		ElementCss.set("geometry", newModal);

		// возращаем значение назад
		StyleUnit.setUnitMenu("margin-top", marginUnit);

		// ставим стили кнопки закрыть
		this.addButClose(newModal);

		/**********************************/
		//id нового модального
		var objSiteContent = Element.getSiteContentObj();
		var newModalId = objSiteContent.find(".listModal .modal:last").attr("id");
		// выбор элемента
		ManagerModal.chosenItem(false, newModalId);
		
		Notification.ok(Resource.hlp_manager_modal_create_successfully);
		Modal.delete();

		// ставим список в селект
		ManagerModal.setSelectListItem();
	}

	this.getListParent = function()
	{
		var objSiteContent = Element.getSiteContentObj();
		var parentModal = objSiteContent.find(".listModal");

		if (!parentModal.length) { // если нету
			objSiteContent.append('<div class="listModal listModalPage"></div>');
		}
		
		return objSiteContent.find(".listModal");
	}

/**********************************************************************************************/
	/**
	* Получить html елемента
	*
	* @see 	this.create()
	*/	
	this.getElementHtml = function(modalClass)
	{

		var name = this.getNewModalId();
		var modalId = name;
		var modalNum = name;

		this.modalNum = modalNum;

		// var name = "modal_"+modalNum;
		// var modalId = Element.getNewElmId("modal"); // id="'+modalId+'"
		// var modalId = "modal"+modalNum;

		var block = '	<div class="element modal '+modalClass+' hlp-modal" id="'+modalId+'" data-num="'+modalNum+'" elm-type="modal" name="'+name+'" class-unique="'+modalClass+'" style="'+this.style+'">\
						</div>';
		block = '<div class="modalWrap">'+block+'</div>';

		return block;
	}


/***********************************************************************************************/
	/**
	* Отдает id
	*
	* @see 	this.getElementHtml()
	* @see 	ManagerModal.addNewPageInList()
	*/	
	this.getNewModalId = function()
	{
		var objSiteContent = Element.getSiteContentObj();
		var listModal = objSiteContent.find(".listModalPage .modal");
		var maxNumber = 0;
		var countModal = listModal.length;

		for (var i = 0; i < countModal; i++) {
			var modal = listModal.eq(i);
			var modalId = modal.attr("id").replace(/modal-p[0-9]+-/gim, '');
			var number = modalId.replace(/[^0-9]+/gim, '');
			number = parseInt(number);
			if (number > maxNumber) maxNumber = number;
		}

		maxNumber++;
		var id = 'modal-p'+Data.page.page_id+'-'+maxNumber;

		return id;
	}

/**********************************************************************************************/
	/**
	* Добавление кнопки закрыть
	*
	* @see 	this.create()
	*/
	this.addButClose = function(modalObj)
	{
		Element.obj = modalObj;

		var closeBlock = this.getCloseBlock();
		modalObj.append(closeBlock);
		this.setStyleModalClose();
	}

	/**
	* Отдает блок закрыть модальное
	*
	* @see 	this.addButClose()
	*/
	this.getCloseBlock = function()
	{
		// var imageClass = Element.getNewClassUnique("image", "modal");
		var imageClass = "m"+this.modalNum+"-image-1";
		var imageBlock = '\
						<div class="element but-modal-close image" elm-type="image" data-action="modal-close" position-side="t-r">\
							<img src="/user/0/main/img/close.png" alt=""/>\
						</div>';

		return imageBlock;
	}

	/**
	* Устанавливает стили кнопки закрыть модальное
	* 
	* @see 	this.addButClose()
	*/
	this.setStyleModalClose = function()
	{
		var elmModal = $(".modal[data-num='"+this.modalNum+"']");
		var elmImage = elmModal.find(".image");

		Element.addNewId(elmImage);
		
		StyleUnit.setUnitMenu("width", "px");
		StyleUnit.setUnitMenu("top", "px");
		StyleUnit.setUnitMenu("right", "px");

		var listStyle = { "width":"30px", "position":"absolute", "top":"10px","right":"10px","z-index":"1000"}
		ElementCss.set("geometry", elmImage, false, listStyle);
		
		// StyleUnit.setUnitMenu("width", "%");
	}
/*******************************************************************************************************/
}//end class


