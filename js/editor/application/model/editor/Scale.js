/**
* Линейка
*
*
*/ 
var Scale = new Scale(); 
function Scale() {
	/**
	* Создает линейку
	*
	* @see 	Page.replace()
	*/	
	this.create = function()
	{
		// создаем линейку
		this.createHorizontal();
		this.createVertical();

		// ставим позицию
		Scale.setPosition();
	}
/*******************************************************************************************/
	/**
	* Создает вертикальную линейку
	*
	* @see this.create()
	*/
	this.createHorizontal = function()
	{
		$(".scaleHorizontalWrap").remove();
		
		var scale = this.getBlocksNegative(20);
		scale += this.getBlocksPositive(80);
		var blockHorizontal = '\
			<div class="scaleWrap scaleHorizontalWrap">\
				<div class="scale scaleHorizontal">'+scale+'</div>\
			</div>';
		// $(".contentWrap").prepend(blockHorizontal);
		// $(".topPanel").append(blockHorizontal);
		$(".contentSection").prepend(blockHorizontal);
	}

	/**
	* Создает вертикальную линейку
	*
	* @see this.create()
	*/
	this.createVertical = function()
	{
		$(".scaleVerticalWrap").remove();
		
		var scale = this.getBlocksPositive(1000);
		var blockVertical = '\
			<div class="scaleWrap scaleVerticalWrap">\
				<div class="scale scaleVertical">'+scale+'</div>\
			</div>';
		
		$(".content").prepend(blockVertical);
		// $(".site").prepend(blockVertical);
		// $(".contentWrap").prepend(blockVertical);
		$(".contentModal").prepend(blockVertical);
	}

/***********************************************************************************************/
	/**
	* Создание блока
	*
	* @see this.createVertical(), this.createHorizontal()
	*/
	this.getBlocksPositive = function(number_block)
	{
		var scale = "";
		for (var i = 0; i < number_block; i++) {
			var  label = 100 * i / 2;
			scale += this.getOneBlock(label);
		}
		return scale;
	}

	/**
	* Создание блока
	*
	* @see this.createHorizontal()
	*/
	this.getBlocksNegative = function(number_block)
	{
		var scale = "";
		for (var i = number_block; i > 0; i--) {
			var  label = (100 * i / 2)*(-1);
			scale += this.getOneBlock(label);
		}
		return scale;
	}

	/**
	* Отдает один элемент
	*
	* @see 	this.getBlocksPositive()
	* @see 	this.getBlocksNegative()
	*/
	this.getOneBlock = function(label)
	{
		var scale = '\
			<div class="scaleBlock">\
				<div class="scaleLabel">'+label+'</div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
				<div class="scaleItem"></div>\
			</div>';

		return scale;
	}
/***********************************************************************************************/
	/**
	* Ставит позицию линейки
	*
	*
	* @see 	this.create()
	* @see 	Editor.setSize()
	* @see 	ElementSelf.insertElement()
	* @see 	StyleMenuGeometry.editWidth()
	*/
	this.setPosition = function()
	{
		if ($(".content").css("display") == "block") {
			var sectionContent = $(".content .section .section-content");
		} else {
			var sectionContent = $(".contentModal .modal");
		}
		
		// вертикальная линейка
		if (sectionContent.length) {
			var left = sectionContent.offset().left-$(".scaleVerticalWrap").width();
		} else {
			var left = 0;	
		}
		
		var marginLeft = left - 1000;
		$(".scaleHorizontal").css({"margin-left":marginLeft});
	}

/************************************************************************************************/

	/**
	* Видно или нет
	*
	* @see 	Editor.setScale()
	*/
	this.isShow = function()
	{
		return $(".scaleWrap").css("display") != "none";
	}

}//end class











