/**
* Работа с цветом
*
*
*/
var Color = new Color();
function Color() {
	/**
	* Переводит rgb в html цвет
	*
	* @see 	TextEditor.setMenuColor() 	
	* @see 	ColorPicker.change()
	*/
	this.getHexRGB = function(color)
	{
		if (!color) return '';

		color = color.replace(/\s/g,"");
	  	//var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
	  	var aRGB = color.match(/^rgba?\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)(,[0-9\.]+)?\)$/i);

		if(aRGB) {
			color = "";
			for (var i = 1;  i <= 3; i++) {
				color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,"0$1");
			}
		} else {
			color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, "$1$1$2$2$3$3");
		}  
		return color;
	}

	/**
	* Переводит html в rgb цвет
	*
	* @param 	string 		color_html - цвет в формате Html
	* @return 	string 	 	цвет в формате rgb
	*
	* @see 		MneuStyleEdit.setColorRgba()
	*/
	this.getRGBHex = function(color_hex)
	{ 
		color_hex = color_hex.trim();
		if (!color_hex || color_hex == "transparent") return "0,0,0";

		//поверяем на валидность, должен быть hex
		var valid = color_hex.match(/,/);

		if (!valid) {
			//разбиваем по 2 символа
			var list = color_hex.match(/[a-fA-F0-9]{2}/ig);
			if (list.length == 3) {
				var len = list.length;
				var res = "";
				for (var i = 0; i < len; i++) {
					if (i != 0) res += ", ";
					//переводим в десятичное число
					res += this.convertHexByDecimal(list[i]);
				}  
				return res;
			} else {
				return color_hex;
			}
		} else {
			//очищяем от лишнего
			color_hex = color_hex.replace(/[a-z\(\)]+/ig, "");
			return color_hex;
		}
	}

	/**
	* Преобразывает шестнадцатиричное в десятичное
	*
	* @uses 	this.pow() 		возведение в степень
	* @see 		this.getRgbColor()
 	*/
	this.convertHexByDecimal = function(num)
	{
		//таблица перевода шестнадцеричного числа в десятичный
		var list = {"0":"0", "1":"1", "2":"2", "3":"3", "4":"4", 
					"5":"5", "6":"6", "7":"7", "8":"8", "9":"9", 
					"A":"10", "B":"11", "C":"12", "D":"13", "E":"14", "F":"15", 
					"a":"10", "b":"11", "c":"12", "d":"13", "e":"14", "f":"15"
					}

		var len = num.length; 
		var g = len - 1;
		var res = 0;
		for (var i = 0; i < len; i++, g--) {
			var item = list[num[i]];
			res += g ? item * this.pow(16, g) : parseInt(item);
		}

		return res;
	}

	/**
	* Возвести в степень
	* 
	* @see 	this.convertHexByDecimal()
	*/
	this.pow = function(num, n, res) {
		//если первый вход
		res = res ? res : num;
		//если степень больше 1
		if (n > 1) {
			return this.pow(num, n - 1, res * num)
		} else {
			return res;
		}
	} 
/***************************************************************************************/
	/**
	* Получить цвет в формате rgb
	*
	* @return 	array 		{"1":"color", "2":"opacity"}
	*
	* @see 	 	MenuStyleSet.valueBgColor()
	* @see 	 	this.setMenuColor()
	*/
	this.getColorFromRgba = function(color) {
		//тип цвета
		if (!color) return false;

		var color_type = color.match(/(rgba(?=\())|rgb(?=\()/ig);
		//убираем пробелы
		color = color.replace(/\s/mig, "");

		if (color_type) {
			var patRgb = /^rgb\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3})\)$/ig;
			//формат rgb 
			if (color_type == "rgb") {
				var pat = patRgb;
			//формат rgba
			} else if (color_type == "rgba") {
				//ищем совпадение в формате rgba
				var pat = /^rgba\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}),([0-9\.]+)\)$/ig;
			} else {
				var pat = patRgb;
			}

			//ищем совпадение
			var res = pat.exec(color);
			if (!res) res = ['rgba(0, 0, 0, 0)', '0, 0, 0', '0'];

			//если это не rgba
			res[2] = res[2] ? res[2] : 1;
			//отдаем результат
			return {"1":res[1], "2":res[2]};
		} else {
			return false;
		}
	}



/********************************************************************************************/
	/**
	* Отдает rgba из меню
	*
	* @see 	StyleMenuBorder.edit()
	* @see 	StyleMenuBg.setColorRgba()
	* @see 	StyleMenuBg.editVideoOpacity()
	* @see 	StyleMenuText.editBg()
	* @see 	StyleMenuBorder.editBorderSide()
	*/
	this.getRgbaFromMenu = function(elmEvent, noTransparent)
	{
		var parentObj = elmEvent.closest(".menuStyleItemValue");

		// получаем opacity
		var inputOpacityObj = parentObj.find('.valueMenuColorOpacity');
		var bgOpacity = inputOpacityObj.val();
		if (bgOpacity != 0) {
			bgOpacity = bgOpacity / 100;
		} else {
			bgOpacity = 0;
		}

		if (!bgOpacity && !inputOpacityObj.length) bgOpacity = 1;

		//цвет из меню
		var colorHex = parentObj.find('.colorpickerField').val();
		var colorRgb = Color.getRGBHex(colorHex);//получить в формате rgb

		// если 0 то удаляем
		if (parseFloat(bgOpacity) == 0 && !noTransparent) {
			var colorRgba = "transparent";
		} else {
			bgOpacity += 0.005;
			bgOpacity = parseFloat(bgOpacity.toFixed(2));
			
			var colorRgba = 'rgba('+colorRgb+', '+bgOpacity+')';
		}

		return colorRgba;
	}

	this.getHexFromMenu = function(inputColorV)
	{
		var color = Color.getRgbaFromMenu(inputColorV);
		color = Color.getHexRGB(color);
		if (!color) color = "#000000";
		else color = "#"+color;

		return color;
	}
/********************************************************************************************/
	/**
	* Ставит в меню gb
	*
	* @see 	StyleMenuBg.setColor()
	* @see 	StyleMenuBg.setVideoOpacity()
	* @see 	StyleMenuText.setBg()
	* @see 	StyleMenuBorder.setColor()
	*/
	this.setRgbaInMenu = function(elmEvent, colorRgba)
	{
		if (colorRgba) var listProperty = this.getPropertyColor(colorRgba);
		else var listProperty = ["000000", 0];

		var parentObj = elmEvent.closest(".menuStyleItemValue");
		parentObj.find('.colorpickerField').val(listProperty[0]);
		parentObj.find('.valueMenuColorOpacity').val(listProperty[1]);
	}

	/**
	* Отдает параметры цвета
	*
	* @see 	this.setRgbaInMenu()
	*/
	this.getPropertyColor = function(colorRgba)
	{	
		//цвет в формате 1-rgb и 2-opacity(bg) 
		var list = Color.getColorFromRgba(colorRgba);
		var colorValue = list[1];
		var opacityValue = list[2];

		if (colorValue) {
			colorValue = 'rgb('+colorValue+')';
			// если в 0 opacity и элемент по умолчанию прозрачный
			if (opacityValue == 0 && this.isElmDefaultTransparent()) {
				// opacityValue = 1;
			}
		} else {
			colorValue = colorRgba;
			opacityValue = 1;
		}

		//устанавливаем цвет в input
		var colorHex = Color.getHexRGB(colorValue);

		opacityValue = parseInt(opacityValue*100);

		return [colorHex, opacityValue];
	}

	/**
	* Элемент прозрачный по умолчанию
	*
	* @see this.getPropertyColor()
	*/
	this.isElmDefaultTransparent = function()
	{
		var elmType = Element.data.type;
		var listType = ["row", "column", "text", "heading", "image"];
		for (var indexType in listType) {
			if (elmType == listType[indexType]) return true;
		}

		return false;
	}	
/********************************************************************************************/
}//end class



