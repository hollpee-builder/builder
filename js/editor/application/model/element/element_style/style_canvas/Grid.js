/**
* Модульная сетка
*
*
*/
var Grid = new Grid();
function Grid() {
	this.isOff = false;
	this.gridType = false;

	/**
	* Устанавливает события
	*
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		var listGridObj = $(".content .grid");

		this.fixedType();	
		// создаем модальную
		if (!listGridObj.find("> *").length) this.create();
		this.setPropety();

		// устанавливаем тип
		var gridCurrentType = listGridObj.attr("data-type");
		$(".butShowGrid").attr("data-type", gridCurrentType);
		this.isOff = gridCurrentType == "none" ? true : false;
		
		var obj = this;
		$(".butShowGrid").off("mousedown");
		$(".butShowGrid").on("mousedown", function() {
			var listGridObj = $(".grid");
			var gridType = listGridObj.attr("data-type");
			if (gridType == "none") {
				var gridNewType = "half";
				obj.isOff = false;
			} else if (gridType == "half") {
				var gridNewType = "";
				obj.isOff = false;
			} else {
				var gridNewType = "none";
				obj.isOff = true;
			}

			listGridObj.attr("data-type", gridNewType);
			$(this).attr("data-type", gridNewType);

			return false;
		});
	}

	/**
	* Фиксирует тип сетки
	*
	* @see 	this.setEvent()
	* @see 	ManagerPage.chosenItem()
	*/
	this.fixedType = function()
	{
		var gridType = $(".grid").attr("data-type");
		if (!$(".grid").length) gridType = "none";

		this.gridType = gridType;
	}
/*********************************************************************************************/
	/**
	* Создает сетку
	*
	* @see 	ElementSection.actionAfter()
	* @see 	ManagerPage.chosenItem()
	*/
	this.create = function(noNewPage)
	{
		var listGridObj = $(".grid");

		if (noNewPage) gridType = listGridObj.attr("data-type");
		else var gridType = this.gridType;

		var gridHtml = this.getHtml(gridType);

		listGridObj.remove();
		$('.section .section-content').prepend(gridHtml);

		this.setPropety();

		this.gridType = false;
	}

	/**
	* Отдает html сетки
	*
	* @see 	this.create()
	*/
	this.getHtml = function(gridType)
	{
		var gridBlock = '\
			<div class="grid gridBgWrap" data-type="'+gridType+'">\
				<div class="gridBg"></div>\
			</div>\
			<div class="grid listGridLineWrap" data-type="'+gridType+'">\
				<div class="listGridLine">\
					<div class="gridLine gridLine0"></div>\
					<div class="gridLine gridLine1"></div>\
					<div class="gridLine gridLine1-2"></div>\
					<div class="gridLine gridLine2"></div>\
					<div class="gridLine gridLine2-2"></div>\
					<div class="gridLine gridLine3"></div>\
					<div class="gridLine gridLine3-2"></div>\
					<div class="gridLine gridLine4"></div>\
					<div class="gridLine gridLine4-2"></div>\
					<div class="gridLine gridLine5"></div>\
					<div class="gridLine gridLine5-2"></div>\
					<div class="gridLine gridLine6"></div>\
					<div class="gridLine gridLine6-2"></div>\
					<div class="gridLine gridLine7"></div>\
					<div class="gridLine gridLine7-2"></div>\
					<div class="gridLine gridLine8"></div>\
					<div class="gridLine gridLine8-2"></div>\
					<div class="gridLine gridLine9"></div>\
					<div class="gridLine gridLine9-2"></div>\
					<div class="gridLine gridLine10"></div>\
					<div class="gridLine gridLine10-2"></div>\
					<div class="gridLine gridLine11"></div>\
					<div class="gridLine gridLine11-2"></div>\
					<div class="gridLine gridLine12"></div>\
				</div>\
			</div>\
			';

		return gridBlock;
	}

/********************************************************************************************/
	/**
	* Устанавливаетт параметры для сетки
	*
	* @see 	this.create()
	* @see 	StyleMenuGeometry.editWidth()
	* @see 	EditorController.setEventVisibleRuler()
	*/
	this.setPropety = function()
	{
		var onePersent = $(".section .section-content").width() / 100; 
		var widthColumn = onePersent * 6.5;
		var widthGroove = onePersent * 2;
		var fullWidthColumn = widthColumn + widthGroove;

		this.params = {"full-width":fullWidthColumn,"position":{},};
		
		for (var iColumn = 0; iColumn < 12; iColumn++) {
			var line1 = iColumn * fullWidthColumn;
			var line2 = line1 + widthColumn;
			var line3 = line2 + widthGroove;
			
			this.params["position"][iColumn] = {};
			this.params["position"][iColumn][1] = line1;
			this.params["position"][iColumn][2] = line2;
			this.params["position"][iColumn][3] = line3;
		}

		Resize.setSize();

		this.listLineObj = $(".listGridLine .gridLine");
	}

/********************************************************************************************/

} // end class

