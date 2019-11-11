/**
* Фон элемента
*
*
*/
StyleMenuBg.prototype = StyleMenu;
var StyleMenuBg = new StyleMenuBg();
function StyleMenuBg() {	
	/**
	* Установить 
	*
	* @see 	parent
	*/
	this.set = function(elm, isSetScroll)
	{
		// получаем тип
		var typeBg = this.getTypeBg(elm);

		// убираем блоки
		$(".menuBgType").css("display", "none");
		//показываем блок
		$(".menuBgType[type='"+typeBg+"']").css("display", "block");
		// выделяем текущий тип
		Select.set($(".selectBgType"), typeBg);

		// устанавливам значение
		if (typeBg == "gradient") this.setGradient(elm); // градиент
		else if (typeBg == "video") this.setVideo(elm);
		else this.setStandart(elm); // стандартный

		if (isSetScroll && typeBg == "image") {
			StyleMenu.setMenuColor($(".valueBgColor"));
			StyleMenu.setScroll();
		} 

		// видео фон можно только у секции и блока
		var optionVideoDisplay = elm.hasClass("section") ? "block" : "none";
		$(".bgTypeSelect .option[value='video']").css("display", optionVideoDisplay);
	}

	/**
	* Узнает градиент или нет
	*
	*/
	this.getTypeBg = function(elm)
	{
		var value = elm.css("background-image");
		var isGradient = value.match(/^linear-gradient/ig) ? true : false;
		
		if (isGradient) var typeBg = "gradient";
		else if (elm.find("> .bg-video").length) var typeBg = "video";
		else var typeBg = "image";

		if (typeBg == "video" && elm.hasClass("section") && !Screen.isDesktop()) var typeBg = "image";

		return typeBg;
	}
/**************************************************************************************/
	/**
	* Стандартный тип
	*
	* @uses 	this.bgColor() 			устанавливаем цвет
	* @uses 	this.bgImage()			картинка
	* @uses 	this.bgPosition() 		позиция
	* @uses 	this.bgRepeat() 		повторение
	* @see 		this.bg()
	*/
	this.setStandart = function(elm) {
		//устанавливаем цвет
		this.setColor(elm);
		// маска
		this.setImageMask(elm);
		// паралакс
		this.setParalax(elm);
		// 
		this.setBgImage(elm);
	}

/*********************************************************************************************/
	/**
	* Устанавливаем цвет
	*
	* @uses 	this.getColorFromRgba()-parent 		получить цвет из rgba
	* @see 		this.bgStandart()
	*/
	this.setColor = function(elm)
	{
		if (elm.hasClass("site")) {
			var curElmClassV = elm.attr("elm-type");
			var colorRgba = ElementCss.getStyle("background-color", "style", elm);
		} else {
			var colorRgba = elm.css("background-color");
		}

		if (!colorRgba) colorRgba = "rgba(0, 0, 0, 0)";

		var elmEvent = $('.valueBgColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);
	}

	this.setImageMask = function(elm)
	{
		var displayValue = elm.hasClass("section") ? "block" : "none";
		$(".menuStyleBgImgMask").css("display", displayValue);
		if (displayValue == "block") {
			var colorRgba = elm.find("> .hlp-section-bg-mask").css("background-color");
			Color.setRgbaInMenu($(".valueBgImgMask"), colorRgba);
		}
	}

	/**
	* Ставит паралакс
	*
	* @see 		this.bgStandart()
	*/
	this.setParalax = function(elm)
	{
		var paralaxBlock = $(".menuParalax")

		paralaxBlock.css("display", "block");
		var paralaxSpeed = elm.attr("data-paralax");

		var bgAttchV = elm.css("background-attachment");
		var paralaxValue = bgAttchV == "fixed" ? "yes" : "no";
		$(".valueBgParalaxStatus .menuButValue").removeAttr("chosen")
									.filter("[value='"+paralaxValue+"']")
									.attr("chosen", "true");
		
		var paralaxSpeedObj = $(".menuParalaxSpeed");
		if (paralaxSpeed) {
			paralaxSpeedObj.css("display", "block");
			paralaxSpeed = parseFloat(paralaxSpeed) * 100;
			$(".valueBgParalaxSpeed").val(paralaxSpeed);
		} else {
			paralaxSpeedObj.css("display", "none");
		}
	} 

/***********************************************************************************************/
/********************************************************************************************/
	/**
	* Ставит значения в меню
	*
	* @see 		this.showModal()
	*/
	this.setBgImage = function(elmBg)
	{
		if (!elmBg) elmBg = Element.getObj();

		var bgImage = elmBg.css("background-image");
		var bgPosition = elmBg.css("background-position");
		var bgRepeat = elmBg.css("background-repeat");
		var bgSize = elmBg.css("background-size");

		this.setImage(bgImage);
		this.setPosition(bgPosition);
		this.setRepeat(bgRepeat);
		this.setImageSize(bgSize);
	}


	/**
	* Устанавливаем картинку
	*
	* @see 	this.setBgImage()
	*/
	this.setImage = function(bgImage)
	{
		//ставим значение
		var imgName = this.getNameImgBySrc(bgImage);
		if (!imgName) imgName = "none";
		$('.valueBgImage').val(imgName);

		var src = bgImage.replace(/(^url\()|(\)$)|(["']+)/gim, '');
		if (src == "none") src = ""; 
		$(".menuBgImageSelf").attr("src", src);

		//если картинка есть ставим кнопку удалить
		var status = imgName ? true : false; 
		$('.butBgImageDelete').attr('status', status);
	}	

	/**
	* Делает активной
	*
	* @see 	this.bgImageSize()
	* @see 	this.valueBgImgSize()
	*/
	this.butSizeBgAct = function()
	{
		$(".butSetAutoSizeBg").removeAttr("status");
	}

	/**
	* Позиция bg-image - переводит проценты в строку
	*
	* @see	this.bgPosition() 	
	*/
	this.arrBgPosition = {	'0% 0%':'top left', 
							'50% 0%':'top center',
							'100% 0%':'top right',
							'0% 50%':'center left',
							'50% 50%':'center',
							'100% 50%':'center right',
							'0% 100%':'bottom left',
							'50% 100%':'bottom center',
							'100% 100%':'bottom right'}

	/**
	* Устанавливаем позицию фона
	*
	* @uses 	this.arrBgPosition()
	* @see 		this.setBgImage()
	* @see 		this.editPosition()
	* @see 	EditorConroller.setEventEditScreen()
	*/
	this.setPosition = function(bgPosition)
	{	
		// ставит значение визуально
		this.setPositionVisual(bgPosition); 
		// ставит значение в числах
		this.setPositionNumber(bgPosition);
	}

	/**
	* Ставит позицию визуадбно
	*
	* @see 	this.setPosition(), this.editPositionLeft(), this.editPositionTop()
	*/
	this.setPositionVisual = function(bgPosition)
	{
		$('.valueBgPosition').removeAttr('chosen');

		//получаем значение
		var bgPositionStr = this.arrBgPosition[bgPosition];
		if (!bgPositionStr) bgPositionStr = bgPosition;

		// bg_position = bg_position ? bg_position : 'top left';	
		var butPosition = $('.valueBgPosition[value="'+bgPositionStr+'"]').attr('chosen', 'true');
	}

	/**
	* Позиция - перевод строковое значение в числовое
	*
	*
	*/
	this.positionStrToNum = {
		"top" : "0%",
		"left" : "0%",
		"center" : "50%",
		"right" : "100%",
		"bottom" : "100%"
	};

	/**
	* Ставит значение в числах
	*
	* @see 	this.setPosition(), this.editPosition()
	*/
	this.setPositionNumber = function(bgPosition)
	{
		// ставим в значение в числах
		var listValue = bgPosition.split(" ");
		var posLeftN = listValue[0];	
		var posTopN = listValue[1];
		
		// если это строковое значение
		if (bgPosition == "center") var posLeft = "50%";
		else if (this.positionStrToNum[posLeftN]) var posTop = this.positionStrToNum[posLeftN];
		else var posLeft = posLeftN;

		if (bgPosition == "center") var posTop = "50%";
		else if (this.positionStrToNum[posTopN]) var posLeft = this.positionStrToNum[posTopN];
		else var posTop = posTopN;

		StyleUnit.setMenuProperty(Element.obj, "background-position-left", "", posLeft);
		StyleUnit.setMenuProperty(Element.obj, "background-position-top", "", posTop);
	}

	/**
	* Устанавливаем повторение фона
	*
	* @see 		this.setBgImage()
	*/
	this.setRepeat = function(bgRepeat)
	{
		// ставим значение
		$(".menuBgRepeat .menuButValue[value='"+bgRepeat+"']")
												.attr("chosen", "true");
	}

	/**
	* Размер фона
	* @see 	this.setBgImage()
	* @see 	EditorConroller.setEventEditScreen()
	*/
	this.setImageSize = function(bgSize) 
	{
		if (bgSize == "cover") bgSize = "full";

		// делаем кнопку активной
		this.butSizeBgAct();
		$(".scrollBgSize .scrollButton").css("left", 0); //ставим в ноль значение

		// ставим значения		
		StyleUnit.setMenuProperty(Element.obj, "background-size", "", bgSize);
	}

/**********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит видео фон
	*
	* @see 	this.set()
	*/
	this.setVideo = function(elm)
	{
		var elmVideoObj = elm.find("> .bg-video video");
		// картинка
		this.setVideoImg(elm, elmVideoObj);
		// видео
		this.setVideoMp4(elm, elmVideoObj);
		// затемнение
		this.setVideoOpacity(elm, elmVideoObj);
		// повтор
		this.setVideoLoop(elm, elmVideoObj);
		// паралакс
		this.setVideoParalax(elm);
		// src
		this.setVideoSrc(elm);
	}

	/**
	* Устанавливает картинку видео
	*
	* @see 	this.setVideo()
	*/
	this.setVideoImg = function(elm, elmVideoObj)
	{
		var videoImgName = elmVideoObj.attr("poster");
		if (videoImgName) videoImgName = videoImgName.replace(/\/user\/[\w]+\/[\w]+\/img\//, '');
		$(".valueBgVideoImage").val(videoImgName).parent().attr('title', videoImgName);
	}

	/**
	* Устанавливает само видео
	*
	* @see 	this.setVideo()
	*/
	this.setVideoMp4 = function(elm, elmVideoObj)
	{
		var videoName = elmVideoObj.find("source:first").attr("src");
		if (videoName) videoName = videoName.replace(/\/user\/[\w]+\/[\w]+\/file\//, '');
		$(".valueBgVideoMp4").val(videoName).parent().attr('title', videoName);
	}

	/**
	* Затемнение
	*
	* @see 	this.setVideo()
	*/
	this.setVideoOpacity = function(elm, elmVideoObj)
	{
		// var videoOpacityObj = elmVideoObj.parent().find(" > .bg-video-opacity");
		var videoOpacityObj = elm.find(".bg-video-opacity");
		var colorRgba = videoOpacityObj.css("background-color");
		var elmEvent = $('.valueVideoColor');
		Color.setRgbaInMenu(elmEvent, colorRgba);		
	}

	/**
	* Повтор
	*
	* @see 	this.setVideo()
	*/
	this.setVideoLoop = function(elm, elmVideoObj)
	{
		var loopValue = elmVideoObj.attr("loop");
		var loopStatus = loopValue ? "yes" : "no"; 
		$(".menuBgVideoLoop .menuButValue").removeAttr("chosen")
									.filter("[value='"+loopStatus+"']")
									.attr("chosen", "true");
	}

	this.setVideoParalax = function(elm)
	{
		var paralaxBlockObj = $(".menuStyleItemBgVideoParalax");
		if (!elm.hasClass("section")) {
			paralaxBlockObj.css("display", "none");
			return false;
		} else {
			paralaxBlockObj.css("display", "block");
		}

		elm = elm.find("> .hlp-bg-video");
		var paralaxStatus = elm.hasClass("hlp-bg-video-paralax") ? "yes" : "no"; 
		$(".valueBgVideoParalaxStatus .menuButValueText[value='"+paralaxStatus+"']")
									.attr("chosen", "true");
	}

	this.editVideoParalaxStatus = function(elm, value)
	{
		elm = elm.find("> .hlp-bg-video");
		var elmSectionObj = elm.closest(".section");
		if (value == "yes") {
			elm.addClass("hlp-bg-video-paralax");
			elmSectionObj.addClass("hlp-section-bg-paralax");
		} else {
			elm.removeClass("hlp-bg-video-paralax");
			elmSectionObj.removeClass("hlp-section-bg-paralax");
		}
	}

	this.setVideoSrc = function(elm)
	{
		var videoSrc = elm.find("iframe").attr("src");
		if (videoSrc && videoSrc.match(/vimeo/gim)) {
			videoSrc = /\/video\/[^\?]+/gim.exec(videoSrc);
			videoSrc = videoSrc[0].replace(/^\/video\//gim, '');
			videoSrc = 'https://vimeo.com/' + videoSrc;
		} else if (videoSrc) {
			videoSrc = /\/embed\/[^\?]+/gim.exec(videoSrc);
			videoSrc = videoSrc[0].replace(/^\/embed\//gim, '');
			videoSrc = 'https://www.youtube.com/watch?v=' + videoSrc;
		}

		$(".valueBgVideoSrc").val(videoSrc);
	}

	this.editVideoSrc = function(elm, videoSrc)
	{
		var isVimeo = videoSrc.match(/vimeo/gim);
		if (isVimeo) {
			Notification.error("С Vimeo нельзя добавить видео");
			return false;
			// var videoIdV = /vimeo\.com\/[^\?]*/gim.exec(videoSrc);
			// videoIdV = videoIdV[0].replace(/^vimeo.com\//gim, '');
			// videoSrc = 'https://player.vimeo.com/video/'+videoIdV+'?title=false&byline=false&portrait=false&loop=true';
		} else {
			var videoIdV = /\/watch\?v=[^&]*/gim.exec(videoSrc);
			if (videoIdV) videoIdV = videoIdV[0].replace(/^\/watch\?v=/gim, '');
			videoSrc = 'http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&controls=0&loop=1&mute=0&playlist='+videoIdV;
		}

		var elmBgV = elm.find("> .hlp-bg-video")
		var contentV = elmBgV.find("> .hlp-bg-video-content");
		contentV.find("> iframe").attr("src", videoSrc);

		var typeV = isVimeo ? "vimeo" : "youtube";
		elmBgV.attr("data-service", typeV);

		if (!isVimeo) {
			var imgObj = contentV.find("> .hlp-bg-video-image");
			if (!imgObj.length) {
				contentV.find(".hlp-bg-video-opacity").after('<img src="" alt="" class="hlp-bg-video-image" />');
				imgObj = contentV.find("> .hlp-bg-video-image");
			}
			var videoImgSrcV = 'url(\/\/img.youtube.com/vi/'+videoIdV+'/maxresdefault.jpg)';
			imgObj.css("background-image", videoImgSrcV);
		}

		return true;
	}

/**********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит градиент
	*
	* @see 	this.set()
	*/
	this.setGradient = function(elm)
	{
		// части градиента
		var listPart = this.getListPartGradient(elm);
		
		// ставим значения
		$(".valueBgGradientType[value='"+listPart[1]+"']").attr("chosen", "true");
		$(".valueBgGradientBasic, .valueBgGradient1").val(listPart[2]);
		$(".valueBgGradient2").val(listPart[3]);

		// ставим opacity
		var opacity1 = /rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,?\s*([0-9\.]+)/gim.exec(listPart[2].trim());
		opacity1 = !opacity1 ? 100 : parseInt(opacity1[1] * 100);
		$(".valueGradiend1Opacity, .valueGradiendBOpacity").val(opacity1);

		var opacity2 = /rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,?\s*([0-9\.]+)/gim.exec(listPart[3].trim());
		opacity2 = !opacity2 ? 100 : parseInt(opacity2[1] * 100);
		$(".valueGradiend2Opacity").val(opacity2);

		// ставим цвет кнопкам
		this.setButtonColorGradient(); 
	} 									
	
	/**
	* Отдает элементы градиента
	* @see 	this.setGradient()
	*/
	this.getListPartGradient = function(elm)
	{
		var gradient = elm.css("background-image");
		// setRgbaInMenu
		// var pattern = /linear-gradient\(([^,]*),?\s?(rgba?\([^\)]+\)),\s(rgba?\([^\)]+\))\)/gi;
		var pattern = /linear-gradient\(([^,]*),?\s?(rgba?\([^\)]+\)),\s(rgba?\([^\)]+\))\)/gi;
		var listPart = pattern.exec(gradient);
		// console.log(listPart)
		if (!listPart[1]) listPart[1] = "to bottom";
		

		return listPart;
	}

	/**
	* Ставит цвет кнопкам градиента
	* @see 	this.setGradient(), this.editGradient()
	*/
	this.setButtonColorGradient = function()
	{
		var listInput = $('.valueBgGradientBasic, .valueBgGradient1, .valueBgGradient2');
		this.setMenuColor(listInput);
	}

/**************************************************************************************************/
/********************************************************************************************/
/***изменение***********************************************************************************/
	/**
	* Изменить тип
	* @use 	this.setMenuColor() - parent
	*/	
	this.editType = function(elm, value)
	{
		// убираем все блоки
		$(".menuBgType").css("display", "none");
		// показываем блок
		$(".menuBgType[type='"+value+"']").css("display", "block");
		// убираем img
		var listClear = ["background", "background-image", "background-position", "background-repeat", "background-size"];
		ElementCss.clear(listClear, "style");
		// убираем фон  видео
		var bgVideo = elm.find("> .bg-video");
		if (bgVideo.length) bgVideo.remove();
		// убираем паралакс
		elm.removeAttr("data-paralax");
		// убираем маску
		elm.find("> .hlp-section-bg-mask").remove();

		// градиент
		if (value == "gradient") this.setTypeGradient(elm);
		else if (value == "video") this.setTypeVideo(elm);
		else this.setTypeImage(elm, bgVideo);

		// устанавливаем значение bg
		this.set(elm);
	}

	/**
	* Изменяет тип градиент
	*
	* @see 	this.editType()
	*/
	this.setTypeGradient = function(elm)
	{
		// ставим цвет фона как основной цвет градиента
		var colorB =  $(".valueBgColor").val();
		$(".valueBgGradientBasic, .valueBgGradient1").val(colorB);
		// меняем направления градиента
		$(".valueBgGradientType").removeAttr("chosen")
									.filter("[value='to top']")
									.attr("chosen", "true");
		// меняем цвет
		this.editGradientBasic(elm, colorB);
	}	

	/**
	* Изменяет тип видео
	*
	* @see 	this.editType()
	*/
	this.setTypeVideo = function(elm)
	{
		var videoIdV = 'uNCr7NdOJgw';
		var bgVideoHtml = '\
		<div class="bg-video hlp-bg-video">\
			<div class="hlp-bg-video-content">\
				<div class="bg-video-opacity hlp-bg-video-opacity"></div>\
				<div class="hlp-bg-video-image" style="background-image:url(\/\/img.youtube.com/vi/'+videoIdV+'/maxresdefault.jpg);"></div>\
				<iframe src="http://www.youtube.com/embed/'+videoIdV+'?rel=0&showinfo=0&controls=0&loop=1&playlist='+videoIdV+'" frameborder="0"></iframe>\
			</div>\
		</div>';

		// 
		elm.append(bgVideoHtml);

		// ставим цвет если перейдет
		$(".valueBgGradientBasic").val($('.valueBgColor').val());
		this.setVideo(elm);

		// this.setParalax(elm);
		// ставим значение scroll 
		StyleMenu.setScroll($(".valueVideoOpacity"));
	}	

	/**
	* Изменяет тип картику
	*
	* @see 	this.editType()
	*/
	this.setTypeImage = function(elm)
	{
		this.setDefaultBgImage(elm);

		// устанавливаем фон
		this.setStandart(elm);

		// ставим основной цвет градиента, как цвет фона
		var gradientColor1 = $(".valueBgGradientBasic").val();
		elm.css("background-color", '#'+gradientColor1);
		var inputColorObj = $(".valueBgColor");
		inputColorObj.val(gradientColor1);
		StyleMenu.setMenuColor(inputColorObj);
	}

	/**
	* Установка bg image по умолчанию
	*
	* @see 	this.setTypeImage()
	*/
	this.setDefaultBgImage = function(elm)
	{
		// потому что устанавливается у basic type 
		if (elm.hasClass("button")) {
			elm.css({"background-image":"none"});
			ElementCss.set(false, elm, "desktop");
		}
	}


/************************************************************************************/
	/*градиент*/
	/*
	* Базовый градиент
	*
	* @see 		StyleMenu.edit() 
	* @see 		this.editType()
	*/
	this.editGradientBasic = function(elm)
	{		
		var colorB = $(".valueBgGradientBasic").css("background-color");

		//получаем второй цвет на основе базового
		var color2 = this.getGradient2OnBasic(colorB);
		//ставим второй цвет
		$('.valueBgGradient2').val(color2);

		//устанавливаем градиент элементу
		this.editGradient(elm);
	};
	/**
	* Отдает второй цвет градиента на основе базового
	*
	* @param 	string 		colorB-базовый элемент
	* 
	* @see 		this.valueBgGradientBasic()
	* @todo 	переделать полностью
	*/
	this.getGradient2OnBasic = function(color) 
	{
		//переводим цвет в формат rgb
		var old_color = Color.getRGBHex(color);

		//разбиваем на цвета (r g b)
		list = old_color.split(',');
		list[0] = parseInt(list[0]);
		list[1] = parseInt(list[1]);
		list[2] = parseInt(list[2]);
		//узнаем какой цвет основной
		if (list[0] > list[1]) {
			if (list[0] > list[2]) {
				t = 'r';
				list[0] = this.clearNumber(list[0]*0.5);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.1);
			} else {
				t = 'b';
				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.5);
			}
		} else {
			if (list[1] > list[2]) {
				t = 'g';
				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.5);
				list[2] = this.clearNumber(list[2]*0.1);
			} else {
 				t = 'b';
 				list[0] = this.clearNumber(list[0]*0.1);
				list[1] = this.clearNumber(list[1]*0.1);
				list[2] = this.clearNumber(list[2]*0.5);
			}
		}

		//формируем цвет rgb
		new_color = 'rgb('+list[0]+' ,'+list[1]+' ,'+list[2]+')';
		
		//переводим в формат hex и отдаем результат
		return Color.getHexRGB(new_color);
	}
/***************************************/
	/**
	* Установить градиент
	*
	* @uses 	this.setMenuColor()-parent
	* @see 		this.valueBgGradientBasic() 
	*/
	this.editGradient = function(elm)
	{
		var parentElmEvent = $(".menuGradient");

		//тип градиента 
		var type = $('.valueBgGradientType[chosen="true"]').val();
		var gradientStatus =  $(".gradientColorToggle").attr("type");
		//цвет 1
		var color1Selector = gradientStatus == "basic"
											? "valueBgGradientBasic" : "valueBgGradient1";
		
		var inputObj1 = parentElmEvent.find("."+color1Selector);
		var color1 = Color.getRgbaFromMenu(inputObj1, true);
		//цвет 2
		var inputObj2 = parentElmEvent.find(".valueBgGradient2");
		var color2 = Color.getRgbaFromMenu(inputObj2, true);
		// //формируем gradient
		var gradient = 'linear-gradient('+type+', '+color1+', '+color2+')';
		
		//устанавливаем градиент
		this.setStyleBg(elm, gradient);

		//ставим значения
		$(".valueBgGradientBasic, .valueBgGradient1").val(color1);
		// ставим opacity
		var inputOpacityB = $(".valueGradiendBOpacity");
		var inputOpacity1 = $(".valueGradiend1Opacity");
		if (gradientStatus == "basic") inputOpacity1.val(inputOpacityB.val());
		else inputOpacityB.val(inputOpacity1.val());

		//изменяем цвет кнопок
		this.setButtonColorGradient();
	}

	/**
	* Ставит значение bg
	*
	* @see 	this.editGradient() 
	*/
	this.setStyleBg = function(elm, fullBg)
	{
		var listProperty = {
			"background":fullBg,
			"background-color":elm.css("background-color")
		}
		
		// удаляем чтобы цвет всегда был после baground
		ElementCss.clear("background-color", "style");
		// ставим значение
		ElementCss.set("style", elm, "desktop", listProperty);
	}

/*******************************************************************************************/
	/**
	* Затемнение bg video
	*/
	this.editVideoOpacity = function(elm, opacityValue)
	{
		// opacityValue = opacityValue / 100;
		// var bgColorValue = "rgba(0,0,0,"+opacityValue+")";

		var bgColorValue = Color.getRgbaFromMenu($(".valueVideoColor"));
		var elmBg = elm.find(".bg-video .hlp-bg-video-opacity");
		elmBg.css("background-color", bgColorValue);
		ElementCss.set("style", elmBg);
	}

	/**
	* повтор
	*/
	this.editVideoLoop = function(elm, videoLoop)
	{
		var elmVideoObj = elm.find("> .bg-video video");
		if (videoLoop == "yes") elmVideoObj.attr("loop", "loop");
		else elmVideoObj.removeAttr("loop");
	} 
/************************************************************************************************/	
/*********************************************************************************************/
	/*изменить цвет*/
	/**
	* цвет
	*
	* @uses 	this.setColorRgba() 		установить элементу цвет rgba	
	* @see 		this.valueBgGradientBasic()
	*/ 
	this.editColor = function(elm, value) 
	{
		// если opacity 0
		var elmOpacity = $(".valueBgOpacity");
		var valueOpacity = parseInt(elmOpacity.val());
		if (valueOpacity == 0) {
			elmOpacity.val(100);
			StyleMenu.setScroll(elmOpacity); 
		}
		
		// ставим значение
		this.setColorRgba(elm);
	};

	/**
	* Прозрачночть фона
	*
	*/
	this.editOpacity = function(elm, value) 
	{
		this.setColorRgba(elm);
	};
	
	/**
	* Устанавливает цвет элементу в формате rgba
	*
	*
	* @uses 	Color.getRGBHex()-parent 	преобразовать цвет в rgb
	* @see 		this.valueBgColor()
	* @see 		this.valueBgOpacity() 
	* @see 		this.valueBgGradientBasic()
	*/
	this.setColorRgba = function(elm)
	{
		var colorRgba = Color.getRgbaFromMenu($(".valueBgColor"));
		
		ElementCss.set("style", elm, false, {"background-color":colorRgba});
	}

	/**
	* Изменяем статус паралакса
	*
	*/
	this.editParalaxStatus = function(elm, value)
	{
		var paralaxSpeedObj = $(".menuParalaxSpeed");
	
		if (value == "yes") {
			elm.css("background-attachment", "fixed");

			paralaxSpeedObj.css("display", "block");
			$(".valueBgParalaxSpeed").val(100);
			StyleMenu.setScroll();
		} else {
			elm.css("background-attachment", "scroll");
		}
	}

		
	/**
	* У изображение маска
	*
	*/	
	this.editImageMask = function(elm, value)
	{
		var elmBgMaskObj = elm.find("> .hlp-section-bg-mask");
		var valueRgba = Color.getRgbaFromMenu($(".valueBgImgMask"));
		
		if (valueRgba == 'transparent' && Screen.isDesktop()) {
			elmBgMaskObj.remove();
			return false;
		} 

		if (!elmBgMaskObj.length) {
			elm.append('<div class="hlp-section-bg-mask"></div>');
			elmBgMaskObj = elm.find("> .hlp-section-bg-mask");
		}

		elmBgMaskObj.css("background-color", valueRgba);
		ElementCss.set("style", elmBgMaskObj);
	}

/***bg img****************************************************************************************/
	/**
	* Отдает src элемента
	* 
	* @see 	this.editImage()	
	*/
	this.getCurentEditingBgSrc = function()
	{
		var src = $(".menuBgImageSelf").attr("src");
		src = src.replace(/(url\()|(\))+/gim, '')
					.replace(/https?:\/\/[^\/]+/gim, '')
					.replace(/["']+/gim, '');

		return src;
	}
	
	/**
	* Изменить картинку
	*
	* @see 	EditElementImage.save()
	*/
	this.editImage = function(elm, value)
	{
		if (value && value != "none") {
			var host = window.location.host;
			var src = "url("+value+")";
		} else {
			var src = "none";
		}

		var name  = src.match(/[^\/]+$/);
		if (name) name = name[0].replace(/\)/, "");
		
		// ставим имя
		$(".valueBgImage").val(name);
		// ставим стили
		elm.css("background-image", src);
		// для секции ставим cover
		if (elm.hasClass("section") && !ElementCss.getStyle("background-size")) {
			elm.css({"background-size":"cover", "background-position":"center top"});
		}

		ElementCss.set();
		this.setBgImage(elm);
	}

/***************************************************************************************/
	/**
	* Позиция
	*/
	this.editPosition = function(elm, value)
	{
		if (value == "center") {
			var top = 50;
			var left = 50;
		} else {
			var listVal = value.split(" ");
			for (var side in listVal) {
				var sideVal = listVal[side];
				if (sideVal == "top" || sideVal == "left") sideVal = 0;
				else if (sideVal == "center") sideVal = 50;
				else if (sideVal == "bottom" || sideVal == "right") sideVal = 100;
				
				if (side == 1) var left = sideVal;
				else var top = sideVal; 
			}	
		}
		
		$(".valueBgPositionTop").val(top);
		$(".valueBgPositionLeft").val(left);
		StyleUnit.setUnitMenu("background-position-top", "%");
		StyleUnit.setUnitMenu("background-position-left", "%");

		// ставим значение
		elm.css("background-position", left+"% "+top+"%");
		this.editPositionNumber(elm, value);
	}

	/**
	* Позиция вверх
	*
	*/
	this.editPositionSide = function(elm, value) 
	{
		// ставим значение
		var top = $(".valueBgPositionTop").val();
		var left = $(".valueBgPositionLeft").val();
		// var value = left+"% "+top+"%";
		var unitTop = StyleUnit.getUnitMenu("background-position-top");
		var unitLeft = StyleUnit.getUnitMenu("background-position-left");
		value = left+unitLeft+" "+top+unitTop;
		// ставим значение
		elm.css("background-position", value);
		// console.log(value)
		this.editPositionNumber(elm, value);
	}

	/**
	* Изменяем позицию в числах
	*
	*/
	this.editPositionNumber = function(elm, value)
	{
		elm.css("background-position", value);
		// устанавливаем в визуальном виде
		this.setPositionVisual(value);
	}

/**************************************************************************************************/

	/**
	* Размер
	*
	* @see 	this.setFullBg()
	*/
	this.editSize = function(elm, value)
	{
		if (value == "full") value = "cover";
		else if (value != "auto") value += StyleUnit.getUnitMenu("background-size");
		elm.css("background-size", value);
	}

	/**
	* Повторение
	*/
	this.editRepeat = function(elm, value)
	{
		// если на всю ширину, то ставим размер auto, а то он не будет работать
		if (elm.css("background-size") == "cover") {
			elm.css("background-repeat", "auto");
			$(".valueBgImgSize").val("auto");
		}

		elm.css("background-repeat", value);
	}

	/**
	* Получить имя картинки по src
	* @see 	this.()
	*/
	this.getNameImgBySrc = function(src)
	{
		var name = '';
		if (src && src != "none") {
			name = /([^\/]+)\)$/ig.exec(src);
			if (name)  name = name[1];

			if (name) name = name.replace(/["']/gim, '');
		}

		if (!name) name = "none";

		return name;
	}

/******************************************************************************************************/
/***************************************************************************************************/
	
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/	
	this.setEvent = function()
	{
		//кнопка изменение bg-image
		this.setEventBgImage(); 
		//кнопка изменение цвета bg
		this.setEventBgColor();
		// кнопка размер bg 
		this.setEventBgSize();

		// видео фон
		this.setEventBgVideo();
		// servideo
		this.setEventVideoSrc();
	}

	/**
	* События для bg-image
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgImage = function()
	{
		var obj = this;
		/**
		* изменение
		* @uses 	elementImage.edit_bg() 	вызываем модальное окно для изменения
		*/
		$('.butBgImageChange').off('mousedown');
		$('.butBgImageChange').on('mousedown', function() {
			var params = {
				'operation':'edit_bg', 
				'src': obj.getCurentEditingBgSrc()
			};

			EditElementImage.edit(params);
		});

		//удаление
		$('.butBgImageDelete').off('mousedown');
		$('.butBgImageDelete').on('mousedown', function() {
			//делаем не активной кнопку
			$('.butBgImageDelete').attr('status', 'false');

			var elm = Element.getObj();
			elm.css("background-image", "none");
			obj.setBgImage(elm);
			ElementCss.set();
			History.record();
		});
	}

	/**
	* Изменение цвета bg
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgColor = function()
	{
		$(".colorpickerField").off("mouseup");
		$(".colorpickerField").on("mouseup", function() {
			StyleMenu.setVariablesColorPicker($(this));
		});
	}

	/**
	* Изменение размера
	*
	* @see 		this.setEventMenu()
	*/
	this.setEventBgSize = function()
	{
		$(".butSetAutoSizeBg").off("mousedown");
		$(".butSetAutoSizeBg").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("status") != "false") {
				StyleMenu.butSizeBgNoAct(); //делаем кнопку не активной
				$(".valueBgImgSize").val("auto").change();
			}
		});
	}

/*********************************************************************************************/
	/**
	* Видео фон
	*
	* @see 	this.setEvent()
	*/	
	this.setEventBgVideo = function()
	{
		var obj  = this;
		$(".menuBgVideo .rightMenuBut").off("mousedown");
		$(".menuBgVideo .rightMenuBut").on("mousedown", function() {
			var elmVideoObj = Element.obj.find("> .bg-video > video");

			// фото
			if ($(this).hasClass("butEditBgVideoImg")) {
				var elmSrc = elmVideoObj.attr("poster");
				var fileType = "img";
				var operation = 'edit_bg_video_img';
			// видео 
			} else {
				var elmSrc = elmVideoObj.find("> source:first").attr("src");
				var fileType = "video";
				var operation = 'edit_bg_video';
			}

			var params = {
				'operation': operation, 
				'src': elmSrc,
				'file_type':fileType
			};

			EditElementImage.edit(params);
		});
	}

	/**
	*
	*
	*
	*/
	this.setEventVideoSrc = function()
	{
		var obj = this;
		var butObj = $(".butEditBgVideoSrc");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var content = '\
				'+Resource.hlp_rightmenu_modal_bgvideo_label+'\
				<textarea class="valueBgVideoSrc" style="min-height:70px;max-width:100%;"></textarea>';

			Modal.create({
				"id" : "modalBgVideoSrc",
				"title" : Resource.hlp_rightmenu_modal_bgvideo_title,
				"top" : 50,
				"width" : 500,
				"content" : content,
				"button" : [
					["cancel", Resource.main_modal_but_cancel],
					["add", Resource.main_modal_but_save]
				]
			});

			obj.setVideoSrc(Element.obj);

			var butSaveObj = $("#modalBgVideoSrc .butAdd");
			butSaveObj.off("mousedown");
			butSaveObj.on("mousedown", function() {
				var valueBgInputV = $(".valueBgVideoSrc");
				var videoSrc = valueBgInputV.val();
				var resV = obj.editVideoSrc(Element.obj, videoSrc);

				if (resV) Modal.delete();
				else valueBgInputV.val("");
			});
		});
	}

/*************************************************************************************************/	
} //end class


