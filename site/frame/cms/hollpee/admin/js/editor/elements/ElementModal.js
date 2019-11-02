/**
* Модальные окна
*
*
*/
var ElementModalE = new ElementModalE();
function ElementModalE() {
	/**
	* Показываем менеджера модальных окон
	*
	* @see 	Editor.setEventModal()
	*/
	this.showManager = function()
	{
		// создаем модвльное
		this.createModalManager();
		// ставим события
		this.setEventManager();
	}

	/**
	* Создаем модальное - менеджер модальных
	*
	* @see 	this.showManager()
	*/
	this.createModalManager = function()
	{
		var content = this.getModalContentManager();

		Modal.create({
			"id" : "modalManagerModal",
			"title" : "Менеджер модальных окон",
			"width" : 500,
			"top" : 40,
			"content" : content
		});
	}

	/**
	* Отдает содержимое модального окна - менеджер
	*
	* @see 	this.createModalManager()
	* @see 	this.uploadManager()
	*/
	this.getModalContentManager = function()
	{
		var content = '';

		var listModal = this.getListModal();
		var countModal = listModal.length;

		for (var iModal = 0; iModal < countModal; iModal++) {
			var modalObj = listModal.eq(iModal);
			var modalNum = modalObj.attr("data-hlp-num");
			content += '\
				<div class="h-man-modal-item" data-hlp-num="'+modalNum+'">\
					<div class="h-man-modal-name">modal - '+modalNum+'</div>\
					<div class="h-man-modal-list-but">\
						<img src="/' + ADMIN_FOLDER + '/img/editor/edit-b.png" alt="" class="h-man-modal-but h-man-modal-but-edit" />\
						<div class="clear"></div>\
					</div>\
					<div class="clear"></div>\
				</div>\
				';
		}

		return content;
	}

	/**
	* Обновляет менеджер модальных
	*
	* @see 	this.setEventCopy()
	* @see 	this.confirmationDelete()
	*/
	this.uploadManager = function()
	{
		var modalContent = this.getModalContentManager();
		$("#modalManagerModal .h-modal-block-cont").html(modalContent);
		this.setEventManager();

		History.record();
	}

/*********************************************************************************************/
	
	/**
	* События для менеджера
	*
	* @see 	this.showManager()
	* @see 	this.uploadManager()
	*/
	this.setEventManager = function()
	{
		this.setEventEdit();
	}

	/**
	* Изменение модального
	*
	* @see 	this.setEventManager()
	*/
	this.setEventEdit = function()
	{
		var obj = this;
		var butObj = $(".h-man-modal-but-edit");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var modalNum = obj.getModalNum($(this));
			var content = $(".hlp-list-modal .hlp-modal[data-hlp-num='"+modalNum+"']").parent().html();
			Modal.create({
				"width" : 800,
				"top" : 40,
				"content" : content
			});

			// HlpElementModal.delete();
			// // показываем модальное
			// HlpElementModal.show(modalNum);

			// ставим события
			Element.setEvent();
		});
	}

/*******************************************************************************************/
	/**
	* Устанавливает список модальных в select
	*
	* @see 	Element.setModalProperty()
	*/
	this.setSelectListModal = function(selectObj)
	{
		var listModal = this.getListModal();
		var countModal = listModal.length;
		var listOption = '';

		for (var iModal = 0; iModal < countModal; iModal++) {
			var modalNum = listModal.eq(iModal).attr("data-hlp-num");
			listOption += '<option value="'+modalNum+'">modal -'+modalNum+'</option>';
		}

		selectObj.html(listOption);
	}

	/**
	* Отдает список модальных
	*
	* @see 	this.getModalContentManager()
	* @see 	this.getModalObj()
	* @see 	this.getNewModalNum()
	* @see 	this.setSelectListModal()
	*/
	this.getListModal = function()
	{
		return $(".h-canvas .hlp-list-modal .hlp-modal");
	}

	/**
	* Отдает объект модального
	*
	* @see 	this.getModalHtml()
	*/
	this.getModalObj = function(modalNum)
	{
		var listModal = this.getListModal();
		return listModal.filter("[data-hlp-num='"+modalNum+"']");
	}

	/**
	* Отдает номер модального
	*
	* @see 	this.setEventEdit()
	* @see 	this.setEventCopy()
	* @see 	this.setEventDelete()
	*/
	this.getModalNum = function(elmEvent)
	{
		return elmEvent.closest(".h-man-modal-item").attr("data-hlp-num");
	}

	/**
	* Отмечает текущие модальное в селекс
	*
	* @see 	ElementLink.setModalProperty()
	*/
	this.setCurrentInSelect = function(selectObj, elmObj)
	{
		var modalNum = elmObj.attr("data-hlp-value");
		
		selectObj.find("option[value='"+modalNum+"']")
					.attr("selected", "selected");
	}

	/**
	* Отдает новый новер модального
	*
	* @see 	this.getModal
	*/
	this.getNewModalNum = function()
	{
		var listModal = this.getListModal();
		var countModal = listModal.length;
		var maxNum = 0;
		for (var iModal = 0; iModal < countModal; iModal++) {
			var modalObj = listModal.eq(iModal);
			var modalNum = modalObj.attr("data-hlp-num");
			if (modalNum > maxNum) maxNum = modalNum;
		}
		maxNum++;

		return maxNum;
	}

	/**
	* Отдает html modal для копирования
	*
	* @see 	this.setEventCopy()
	*/
	this.getHtmlForCopy = function(modalNum)
	{
		var modalObj = this.getModalObj(modalNum);

		var modalContent = modalObj.html();
		var modalClass = modalObj.attr("class");
		var newModalNum = this.getNewModalNum();
		
		var modalHtml = "\r\n\t\t\t";
		modalHtml += '<div class="'+modalClass+'" data-hlp-new="true" data-hlp-num="'+newModalNum+'">'+modalContent+'</div>';
		modalHtml += "\r\n\t\t";

		return modalHtml;
	}

} // end class
