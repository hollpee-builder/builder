/**
* 
*
*
*/
StyleMenuBoxShadow.prototype = StyleMenu;
var StyleMenuBoxShadow = new StyleMenuBoxShadow();
function StyleMenuBoxShadow() {
	

	this.set = function(elm)
	{
		var list = this.cutShadow(elm);
		//устанавливаем значения
		//тип
		$(".valueShadowType[value='"+list['type']+"']").attr('chosen', 'true');
		//цвет
		Color.setRgbaInMenu($('.valueShadowColor'), list['color']);
		// смещение
		$('.valueShadowOffsetX').val(list['offsetX']);
		$('.valueShadowOffsetY').val(list['offsetY']);

		//радиус
		$('.valueShadowRadius').val(list['radius']);
		//ширина
		$('.valueShadowWidth').val(list['width']);
	}

	/**
	* Разложить по стилям тень
	*
	* @see this.shadow();
	*/
	this.cutShadow = function(elm)
	{
		//тень
		var shadow = elm.css('box-shadow');
		var emptyValue = { 'type':'', 'offsetX':'0', 'offsetY':'0', 'radius':'0',  'width':'0', 'color':'rgba(0,0,0,1)'}; 
		//если нет тени
		if (shadow == 'none') {
			return emptyValue;
		//тень есть
		} else {
			//шаблое для поиска
			var pat = /^(rgba?\([^\)]+\))\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s?([a-z]*)/igm;
			//результат
			var list = pat.exec(shadow);
			if (!list) return emptyValue;

			return {'type':list[6], 
					'offsetX':list[2],
					'offsetY':list[3],
					'radius':list[4], 
					'width':list[5], 
					'color':list[1]};
		}
	};

/**************************************************************************************/
	/**
	* Установить тень
	*/
	this.edit = function(elm) 
	{
		//тип
		var type = $(".valueShadowType[value='inset']").attr("chosen") ? 'inset' : '';
		//цвет
		var color = Color.getRgbaFromMenu($(".valueShadowColor"));
		// смещение x
		var offsetX = $('.valueShadowOffsetX').val();
		// смещение y
		var offsetY = $('.valueShadowOffsetY').val();
		//радиус
		var radius = $('.valueShadowRadius').val();
		//ширина
		var width = $('.valueShadowWidth').val();

		if (!color) color = "#000000";

		//формируем shadow
		var shadow = type+' '+offsetX+'px '+offsetY+'px '+radius+'px '+width+'px '+color;
		elm.css({"box-shadow":shadow});
	};

/*********************************************************************************/

} //end class









