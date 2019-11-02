/**
* Окно оповещения
*
*
*/
var Notification = new Notification();
function Notification() {
	/**
	* Все нормально
	*
	*/
	this.ok = function(msg, position, speedV)
	{
		if (!speedV) speedV = 2000;
		this._show(msg, "notificationOk", 2000, position); 
	}

	/**
	* ошибка
	*
	*/
	this.error = function(msg, position, speedV)
	{
		if (!speedV) speedV = 3000;
		if (!msg) msg = Resource.main_notification_error;
		this._show(msg, "notificationError", speedV, position); 
	}


	this._show = function(msg, notif_class, speed, position) 
	{	
		if (!position) position = "center";

		// сам блок
		var block = '<div position="'+position+'" class="notification '+notif_class+'">\
						<div id="notificationText">'+msg+'</div>\
					</div>';

		// вставляем на страницу
		$("body").prepend(block);
		var elmNotification = $(".notification");
		elmNotification.animate({"opacity":1}, 300);

		setTimeout(function(){
			elmNotification.remove();
		}, speed);
	}

}//end class

/***********************************************************************************************/
/***подсказки при наведении на элемент*********************************************************************************/
var Tip = new Tip();
function Tip() {
	/**
	* Ставить событие
	*
	* @see 	EditElementImage.setEventDeleteFolder();
	*/	
	this.setEvent = function(elm, label, position)
	{	
		if (!elm) elm = $("*[label]");

		elm.off('mouseover');
		elm.on('mouseover', function() { Tip.show($(this));});

		elm.off('mouseout'); 
		elm.on('mouseout', function() { Tip.hide($(this));});
	}

	/**
	* Убирает событие
	*
	* @see 	EditElementImage.setEventDeleteFolder();
	*/	
	this.removeEvent = function(elm)
	{
		elm.off('mouseover');
		elm.off('mouseout');
		elm.removeAttr("label").removeAttr("pos");
	}
/******************************************************************************************/
	/**
	* Показать подсказку
	*
	* @param 	obj 	elm_event - элемент на котором сработало события 		
	*
	* @see 	EditorController.setEventTip()
	*/
	this.show = function(elm_event)
	{
		if (this.showNow) {
			var delay = 10;
			this.showNow = false;
		} else {
			var delay = 800;
		}

		var obj = this;
		this.showEvent = setTimeout(function() {
			var label = elm_event.attr('label');
			label = label.replace(/\n/gim, "<br/>");

			//формируем блок
			var block = '<div class="tipBlock" >\
							<div class="tipArrow"></div>\
							<div class="tipText">'
								+label+
						'	</div>\
						</div>';
			//добавлем на страницу
			$('body').append(block);
			//установить position блоку
			obj.setPosition(elm_event);
		}, delay);

		// сбрасываем
		elm_event.off("mouseout");
		elm_event.off("mouseup");
		elm_event.on("mouseout mouseup", function() {
			elm_event.off("mouseout");
			clearTimeout(obj.showEvent);
			obj.hide();

			obj.showNow = false;
			// obj.showNow = true;
			setTimeout(function() { obj.showNow = false;}, 250);
		});
	}

	this.replaceText = function(label)
	{
		// this.noShow = true;
		$(".tipText").html(label);
	} 

	/**
	* Убрать подсказку
	*
	* @see 	EditorController.setEventTip()
	*/
	this.hide = function()
	{
		$('.tipBlock').remove();
		clearTimeout(this.showEvent);
	}
/********************************************************************************/
	/**
	* @var 	array 	список функций для получения значений position
	* @see 	setPositionTip()
	*/
	this.list_func_pos = {
		'top': 		'getValueTop',
		'bottom': 	'getValueBottom',
		'right': 	'getValueRight',
		'left': 	'getValueLeft'
	}

	/**
	* Установить позицию 
	*
	* @param 	obj 	elm_event-элемент на котором сработало событие
	*
	* @see 	showTip()
	*/
	this.setPosition = function(elm_event)
	{
		var elm_block = $('.tipBlock');
		var elm_arrow = $('.tipArrow');
		//положение
		var pos = elm_event.attr('pos'); 
		if (!pos) pos = "bottom";

		//устанавливаем положение стрелки
		elm_arrow.attr('type', pos);

		var param = {};
		var paddingH = parseInt(elm_event.css("padding-left"))+parseInt(elm_event.css("padding-right"));
		var paddingV = parseInt(elm_event.css("padding-top"))+parseInt(elm_event.css("padding-bottom"));
		//данные элемента на котором сработало событие
		param['top_evt'] = elm_event.offset().top;
		param['left_evt'] = elm_event.offset().left;
		param['width_evt'] = elm_event.width()+paddingH;
		param['height_evt'] = elm_event.height()+paddingV;
		//данные блока tip
		param['width_block'] = elm_block.width();
		param['height_block'] = elm_block.height();

		//получаем значения 
		var list_value = this[this.list_func_pos[pos]](param);
		//устанавливаем значение блоку
		elm_block.css({'top':list_value['top'], 'left':list_value['left']});
		//устанавливаем значение стрелки
		elm_arrow.css(list_value['arrow']);//стили
		
		// показываем с анимацией
		elm_block.animate({"opacity":"1"}, 200);
	}
/********************************************************************************/
	/**
	* Отдать top и left для положения top
	*
	* @see 	this.setPosition()
	*/
	this.getValueTop = function(param) {
		var result = this.getPropertyVertical(param);
		//для блока
		result['top'] = param['top_evt'] - param['height_block']-12;

		return result;
	}

	/**
	* Отдать top и left для положения bottom
	*
	* @see 	this.setPosition()
	*/
	this.getValueBottom = function(param) {
		var result = this.getPropertyVertical(param);
		//для блока
		result['top'] = param['top_evt'] + param['height_evt']+12;

		return result;
	}

	/**
	* Отдает параметры для вертикали
	*
	* @see 	this.getValueTop()
	* @see 	this.getValueBottom()
	*/
	this.getPropertyVertical = function (param)
	{
		var result = {};

		result['left'] = param['left_evt'] -(param['width_block']-param['width_evt'])/2;
		
		//для стрелки
		var arrow_left = (param['width_block']/2)-9;
		result['arrow'] = {'left': arrow_left}; 

		return result;
	}
/**********************************************/

	/**
	* Отдать top и left для положения right
	*
	* @see 	this.setPosition()
	*/
	this.getValueRight = function(param) {
		var result = this.getPropertyHorizontal(param);
		//для блока
		result['left'] = param['left_evt'] + param['width_evt'] + 17;

		return result;
	}

	/**
	* Отдать top и left для положения left
	*
	* @see 	this.setPosition()
	*/
	this.getValueLeft = function(param) {
		var result = this.getPropertyHorizontal(param);
		//для блока
		result['left'] = param['left_evt'] - param['width_block'] - 13;

		return result;
	}

	/**
	* Отдает параметры для горизонтали
	*
	* @see 	this.getValueLeft()
	* @see 	this.getValueRight()
	*/
	this.getPropertyHorizontal = function (param)
	{
		var result = {};

		result['top'] = param['top_evt'] - (param['height_block'] - param['height_evt'])/2;
		
		//для стрелки
		var arrow_left = (param['height_block']/2)-(parseInt($('.tipArrow').css('border-left-width'))/2);
		result['arrow'] = {'top': arrow_left-4};
		
		return result;
	}

}











