/**
* 
*
*
*/
StyleMenuTextShadow.prototype = StyleMenu;
var StyleMenuTextShadow = new StyleMenuTextShadow();
function StyleMenuTextShadow() {
	/**
	* Установить 
	*
	*/
	this.set = function(elm)
	{
		//список свойств тени
		var list = this.cutShadow(elm);

		//устанавливаем значения
		//цвет
		Color.setRgbaInMenu($('.valueTextShadowColor'), list['color']);
		// смещение
		$('.valueTextShadowOffsetX').val(list['offsetX']);
		$('.valueTextShadowOffsetY').val(list['offsetY']);
		//радиус
		$('.valueTextShadowRadius').val(list['radius']);
	}

	/**
	* Разложить по стилям тень
	*
	* @see this.shadow();
	*/
	this.cutShadow = function(elm)
	{
		//тень
		var shadow = elm.css('text-shadow');
		var emptyValue = {'offsetX':'0', 'offsetY':'0', 'radius':'0', 'color':'rgba(0,0,0,1)'}; 
		//если нет тени
		if (shadow == 'none') {
			return emptyValue;
		//тень есть
		} else {			
			//шаблое для поиска
			var pat = /^(rgba?\([^\)]+\))\s([\-0-9\.]+)px\s([\-0-9\.]+)px\s([\-0-9\.]+)px/igm;
			//результат
			var list = pat.exec(shadow);
			if (!list) return emptyValue;

			return {'color':list[1],
					'offsetX':list[2],
					'offsetY':list[3],
					'radius':list[4]};
		}
	};

/**********************************************************************************/
	
	/**
	* Установить тень
	* @see 	this.valueShadow*()
	*/
	this.edit = function(elm) 
	{
		//цвет
		var color = Color.getRgbaFromMenu($(".valueTextShadowColor"));
		// смещение x
		var offsetX = $('.valueTextShadowOffsetX').val();
		// смещение y
		var offsetY = $('.valueTextShadowOffsetY').val();
		//радиус
		var radius = $('.valueTextShadowRadius').val();

		if (!color) color = "rgba(0,0,0,1)";
		
		//формируем shadow
		var shadow = offsetX+'px '+offsetY+'px '+radius+'px  '+color;
		//устанавливаем тень
		elm.css('text-shadow', shadow);
	};

} //end class
