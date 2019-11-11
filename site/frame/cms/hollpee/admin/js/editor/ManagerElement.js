/**
* Управление элементами
*
*
*/
var ManagerElement = new ManagerElement();
function ManagerElement() {
	/**
	* Создание панели управление элементом
	* 
	* @see 	Element.setEventSelected()
	*/
	this.create = function()
	{
		this.delete();

		if (!Element.isEdit()) return false;
		
		var blockManager = this.getBlock();
		$(".hlp-site").prepend(blockManager);
		this.setPosition(Element.getObj());
	}

	/**
	* Отдает блок - управление элементами
	*
	*
	* @see 	this.addBlock()
	*/
	this.getBlock = function()
	{
		blockManager = '\
			<div class="h-block-manager">\
				<div class="h-list-manager-but">\
					<img style="margin-right:0px;" src="' + ADMIN_FOLDER + '/img/editor/edit.png" class="h-but-manager h-but-manager-edit" alt="" />\
					<div class="clear"></div>\
				</div>\
			</div>\
			';
		return blockManager;
	}

	/**
	* Удаляем
	*
	* @see 	this.create()
	* @see 	Element.setPropertySlider()
	*/
	this.delete = function()
	{
		$(".h-block-manager").remove();
	}

	/**
	* Ставит позицию
	*
	* @see 	this.addBlock()
	*/
	this.setPosition = function(elm)
	{
		var managerObj = $(".h-block-manager");
		var offset = elm.offset();
		if (!offset) offset = {};

		var offsetTop = offset.top - $(".h-canvas").offset().top;
		var offsetLeft = offset.left + (elm.width() - managerObj.width()) + 5;
		offsetLeft += parseInt(elm.css("padding-left")) + parseInt(elm.css("padding-right"));

		// если не видно
		if (offsetTop < 90) {
			var elmHeight = elm.height() + parseInt(elm.css("padding-top")) + parseInt(elm.css("padding-top"));
			offsetTop += elmHeight + 42;
		} else {
			offsetTop -= 3;
		}
		if (offsetLeft < 0) offsetLeft = 0;

		managerObj.css({"top" : offsetTop, "left" : offsetLeft});
	}
/*********************************************************************************/

}// end class
