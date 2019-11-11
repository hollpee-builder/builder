/**
* Направляющие
*
*
*/ 
var Guides = new Guides(); 
function Guides() {

	/**
	* Ставим собятия
	*
	* @see 	Input.newCanvas()
	* @see 	EditorController.setEvent()
	*/
	this.setEvent = function()
	{
		// добавление
		this.setEventAdd();
		// для направляющих
		this.setEventItem();
		// события для панели параметров
		this.setEventPanelProperty();

		// ставим позицию вертикальным направляющим
		this.setPositionVertical();
	}
/**********************************************************************************************/
	/**
	* Добавление направлющей
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var scale = $(".scale");
		scale.off("mousedown");	
		scale.on("mousedown", function() {
			var elmEvent = $(this);
			
			// выход за границы
			scale.on("mouseout", function(event) {
				// убираем события
				scale.off("mouseout");
				$("body").off("mouseup");

				//действие 
				obj.scaleOut(event, elmEvent);
			});

			$("body").on("mouseup", function() {
				scale.off("mouseout");
				$("body").off("mouseup");
			});

			return false;
		});
	}


	/**
	* Выход за пределы scale
	*
	* @see 	this.setEventAdd()
	*/
	this.scaleOut = function(event, scaleEvent)
	{
		var isVercital = scaleEvent.hasClass("scaleVertical");
		// вертикальная линейка
		if (isVercital) {
			// движение на лево
			var mouseX = event.pageX;
			var scaleLeft = scaleEvent.offset().left;
			if (mouseX < scaleLeft) return false;
		} else {
			// движение на вверх
			var mouseY = event.pageY;
			var scaleTop = scaleEvent.offset().top;
			if (mouseY < scaleTop) return false;
		}

		// создаем направляющию
		this.create(isVercital);
	}

/************************************************************************************************/
	/**
	* Создание направляющей
	*
	* @see 	this.setEvent()
	*/
	this.create = function(isVercital)
	{
		// создаем
		if (isVercital) this.createVertical();
		else this.createHorizontal();
		// получаем новую направляющию
		var newGuides = $(".newGuides").removeClass("newGuides");

		// ставим событие для напрявляющей
		this.setEventItem();
		// передвижение
		this.guidesDown(newGuides);
	}

	/**
	* Создание горизонтальной направляющей
	*
	* @see 	this.scaleOut()
	*/
	this.createHorizontal = function()
	{
		var guides = '<div class="newGuides guides guidesHorizontal" type="horizontal"><div class="guidesContent"></div></div>';
		this.addItem(guides);
	}

	/**
	* Создание вертикальной направляющей
	*
	* @see 	this.scaleOut()
	*/
	this.createVertical = function()
	{
		var guides = '<div class="newGuides guides guidesVertical" type="vertical"><div class="guidesContent"></div></div>';
		this.addItem(guides);
	}


	/**
	* Добавляет направляющию
	*
	* @see 	this.createHorizontal()
	* @see 	this.createVertical()
	*/
	this.addItem = function(guides)
	{
		var elmContent = Element.getParentWrap();
		elmContent.prepend(guides);
	}
/***********************************************************************************************/
/***********************************************************************************************/
	/**
	* Событие на передвижение
	*
	* @see 	this.setEvent()
	* @see 	this.create()
	*/
	this.setEventItem = function()
	{
		var obj = this;
		$(".guides").off("mousedown");
		$(".guides").on("mousedown", function(eventDown) {
			obj.guidesDown($(this), eventDown);
			return false;
		});	

		// показать параметры
		this.setEventShowProperty();
	}

	/**
	* Нажатие на направляющию
	*
	* @see 	this.setEventItem()
	* @see 	this.setEventMove()
	*/
	this.guidesDown = function(elmEvent, eventDown)
	{
		var elmParent = Screen.isModal() ? elmEvent.closest(".modalWrap") : elmEvent.closest(".site");

		var parentTop = elmParent.offset().top;
		var parentLeft = elmParent.offset().left;
		// var parentLeft = $(".section").offset().left;
		// parentLeft = 100;
		var type = elmEvent.attr("type");
		var elmInform = $(".guidesInfo");
		var pointZeroH = this.getOffsetHorizontal();
		var pointZeroV = this.getOffsetVertical();

		// небольшое смещение
		var offset = 0;
		if (eventDown) {
			if (type == "horizontal") offset = elmEvent.offset().top - eventDown.pageY;
			else offset = 0;//elmEvent.offset().left - eventDown.pageX;
		}
		
		var obj = this;
		$("body").off("mousemove");
		$("body").on("mousemove", function(eventMove) {
			var pageY = eventMove.pageY;
			var pageX = eventMove.pageX;

			// ставим направляющию
			if (type == "horizontal") {
				// получаем top
				var value =  pageY - parentTop + offset;
				elmEvent.css({"top":value});//ставим значение
				// для корректного отображения
				value += pointZeroH;

				
			} else {
				// получаем left
				var value = pageX - parentLeft;
				elmEvent.css({"left":value});//ставим значение
				// 
				value -= pointZeroV;
			}

			// прилипание
			var newValue = Math.round(value/50) * 50;
			if (newValue + 5 > value && newValue - 5 < value) {
				value = newValue;

				if (type == "horizontal") elmEvent.css({"top":value - pointZeroH});
				else elmEvent.css({"left":value + pointZeroV});
			}

			value = parseInt(value);
			pageY -= parentTop;
			// ставим блок информации
			elmInform.css({"display":"block", "top":eventMove.pageY - 45, "left":pageX + 15});
			elmInform.text(value+"px");
			elmEvent.attr("pos-value", value);
		});
	
		$("body").off("mouseup");
		$("body").on("mouseup", function() {
			$("body").off("mouseup");
			$("body").off("mousemove");
			// прячем информационый блок
			elmInform.css("display", "none");
			// фиксируем в историю
			History.record();


			// если ушла в минус
			if (type == "horizontal") {
				var curGuidesHorTop = elmEvent.offset().top - 10;
				var scaleHorTop = $(".scaleHorizontal").offset().top;
				if (scaleHorTop > curGuidesHorTop) elmEvent.remove();
			} else {
				var posValueV = elmEvent.offset().left - 10;
				if (posValueV < 0) elmEvent.remove();
			}
		});

		// убираем панель
		this.closeProperty();
	}
/********************************************************************************************/
	/**
	* Ставит позицию вертикальных направляющим
	*
	* @see 	this.setEvent()
	* @see 	Editor.setScale()
	* @see 	StyleMenuGeometry.editWidth()
	*/
	this.setPositionVertical = function()
	{
		var maxWidth = this.getMaxOffsetLeft();
		var listGuides = $(".guidesVertical");
		var offset = this.getOffsetVertical();

		// показываем все направляющие
		listGuides.removeClass("guidesHide");
		// проходим циклом все направляющие
		var count = listGuides.length;
		for (var i = 0; i < count; i++) {
			var item = listGuides.eq(i);
			// прячем которые не вмещаются на палатне
			var posValue = parseInt(item.attr("pos-value"));
			// if (maxWidth < posValue) item.addClass("guidesHide");

			// изменяем позицию 
			var left = posValue+offset;
			item.css("left", left+"px");
		}
	}

	/**
	* Отдает максимальное смещение в лево
	*
	* @see 	this.setPositionVertical()
	*/
	this.getMaxOffsetLeft = function()
	{
		var elmWrap = Element.getParentWrap();
		if (elmWrap.hasClass("modalWrap")) elmWrap = elmWrap.find(".modal"); 
		else elmWrap = elmWrap.find(".section"); 

		var maxWidth = elmWrap.width()-30;
		return maxWidth;
	}
/*********************************************************************************************/
/*********************************************************************************************/
	/**
	* Показать параметры
	*
	* @see 	this.setEventItem()
	*/
	this.setEventPanelProperty = function()
	{
		// закрытие параметров
		this.setEventCloseProperty();
		// изменение позиции
		this.setEventValuePosition();
		// изменить цвет
		this.setEventChangeColor();
		// удаление направляющей
		this.setEventDelete();
	}
/************************************************************************************************/
	/**
	* Показать панель с параметрыми
	*
	* @see 	this.setEventItem()
	*/
	this.setEventShowProperty = function()
	{
		var obj = this;
		$(".guides").off("dblclick");
		$(".guides").on("dblclick", function(event) {
			var elmEvent = $(this);
			// показываем элемент
			obj.showSectionProperty(elmEvent, event);

			// ставим позицию
			obj.setValuePosition(elmEvent);

			return false;
		});
	}

	/**
	* Показываем элемент
	*
	* @see 	this.setEventShowProperty()
	*/
	this.showSectionProperty = function(elmEvent, event)
	{
		var elmContent = $(".contentSection");
		var elmProperty = $(".guidesPropertySection");
		var parentWidth = elmContent.width();
		var propertyWidth = elmProperty.width();
		var padding = 40;

		// ставим атрибут отметку
		$(".guides").removeAttr("chosen");
		elmEvent.attr("chosen", "true");

		var top = event.pageY - elmContent.offset().top + 10;
		// var top = event.pageY - elmContent;

		var left = event.pageX + 10;
		var right = propertyWidth + left + padding;
		
		// если выход за правый край
		if (right > parentWidth) left = left - propertyWidth - padding;
		
		// ставим параметры элементу
		elmProperty.css({"display":"block", "top":top,"left":left});
		this.guides = $(".guides[chosen='true']");
		this.type = this.guides.attr("type");
	}
/***********************************************************************************************/
	/**
	* Позиция
	*
	* @see 	this.setEventPanelProperty()
	*/
	this.setEventValuePosition = function()
	{
		var obj = this;
		$(".valueGuidesPosition").off("change");
		$(".valueGuidesPosition").on("change", function() {
			var newValue = parseInt($(this).val());
			// если вертикальная
			if (obj.type == "vertical") newValue += obj.getOffsetVertical();
			else newValue -= obj.getOffsetHorizontal();

			// ставим значение
			var side = obj.type == "horizontal" ? "top" : "left";
			obj.guides.css(side, newValue+"px");
		});

		// движение стрелкой
		var inputPosition = $(".valueGuidesPosition");
		inputPosition.off("keydown");
		inputPosition.on("keydown", function(event) {
			var code = event.keyCode;
			if (code == 38 || code == 40) {
				var value = parseInt(inputPosition.val());
				if (code == 38) value++;
				else value--;
				// ставим значение и эмитируем изменение
				inputPosition.val(value).change();
				return false;
			}
		});
	}	

	/**
	* Ставит значение
	*
	* @see 	this.setEventShowProperty()
	* 
	* @todo  дублируются значения в this.guidesDown() - переделать
	*/
	this.setValuePosition = function(elmEvent)
	{
		if (elmEvent.attr("type") == "horizontal") {
			var valuePosition = parseInt(elmEvent.css("top"));
			valuePosition += this.getOffsetHorizontal();
		} else {
			var valuePosition = parseInt(elmEvent.css("left"));
			valuePosition -= this.getOffsetVertical()
		}

		valuePosition = parseInt(valuePosition + 0.5);

		$(".valueGuidesPosition").val(valuePosition);
	}
/*********************************************************************************************/
	/**
	* Удалить
	*
	* @see 	this.setEventPanelProperty()
	*/	 
	this.setEventDelete = function()
	{
		var obj = this;
		// удаление
		$(".butGuidesDelete").off("click");
		$(".butGuidesDelete").on("click", function(eventDown) {
			$(".guides[chosen='true']").remove();
			//закрываем параметры 
			obj.closeProperty();
		});
	}
/***********************************************************************************************/
	/**
	* Изменить цвет
	*
	* @see 	this.setEventPanelProperty()
	*/
	this.setEventChangeColor = function()
	{
		// изменить цвет
		$(".guidesColorItem").off("click");
		$(".guidesColorItem").on("click", function(eventDown) {
			var color = $(this).css("background-color");
			$(".guides[chosen='true']").find(".guidesContent")
									.css("background-color", color);
		});
	}
/**********************************************************************************************/
	/**
	* Закрытие параметров 
	*
	* @see this.setEventPanelProperty()
	*/
	this.setEventCloseProperty = function()
	{
		var obj = this;
		$(".wrapper").off("mouseup");
		$(".wrapper").on("mouseup", function() {
			// прячем блок с параметрами
			obj.closeProperty();
		});

		$(".guidesPropertySection").off("mouseup");
		$(".guidesPropertySection").on("mouseup", function() {
			return false;
		});
	}

	/**
	*
	* Закрываем блок с параметрами
	*
	* @see 	this.guidesDown()
	* @see 	this.setEventDelete()
	*/
	this.closeProperty = function()
	{
		$(".guidesPropertySection").css("display", "none");
	}
/***********************************************************************************************/
	/**
	* Смещение сверху
	*
	* @see 	this.setValuePosition()
	* @see 	this.setEventValuePosition()
	* @see 	this.guidesDown()
	* @see 	this.setPositionVertical()
	*/
	this.getOffsetVertical = function()
	{
		var offset = 0;
		// var currentScreen = Screen.getCurrent();
		if (!Element.obj) return offset;
		
		if (!Screen.isModal()) {
			var offset =  $(".content .section .section-content").offset().left - 3 - $(".content .site").offset().left;
		} else {
			var elmModal = $(".contentModal .modal");
			if (elmModal.length) offset = elmModal.offset().left - $(".contentModal .modalWrap").offset().left;
		}

		// if (offset > 0) offset -= 3;

		return offset;
	}

	/**
	* Смещение сверху
	*
	* @see 	this.setValuePosition()
	* @see 	this.guidesDown()
	*/
	this.getOffsetHorizontal = function()
	{
		return 3;
	}

/*************************************************************************************************/
}//end class

