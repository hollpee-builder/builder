/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementForm.prototype = EditElementBasic;
var EditElementForm = new EditElementForm();
EditElementForm.parent = EditElementBasic;

function EditElementForm() {
	/**
	* Изменение|создание
	*
	* @uses 	this.createModal() 	создаем модальное окно
	*/
	this.edit = function() 
	{
		/*****************/
		// сохраняем без модального окна
		this.save();
		return false;
		/*******************/


		// //создаем модальное окно
		// this.createModal();
	}
/*****************************************************************************************/
/*******************************************************************************************/
	/**
	* Создаем модальное окно
	*
	* @uses 	this.getModalContent() 	получить содержимое формы
	* @uses 	this.setEvent() 		установить события	
	* @see 		this.edit()
	*/
	this.createModal = function()
	{
		//содержимое формы
		var content = this.getModalContent();

		//создаем модальное окно
		Modal.create({
			'width':'1000',
			'height':'',
			'top':'20',
			'id':'modalForm',
			'title':'Выбрать форму',
			'is_resize':true,
			'nav':[
				['vertical', 'Вертикальная'],
				['horizontal', 'Горизонтальная']
			],
			'content':content,
			'content_class':'modalFormBlock',
			'content_height':'max',
			'button':[
				['ok', 'Сохранить'],
				['cancel', 'Отмена']
			]
		});

		//устанавливаем событие
		this.setEvent();
	}

	/**
	* Содержимое формы
	*
	* @see 		this.edit();
	*/
	this.getModalContent = function()
	{
		var content = '\
			<div class="modalBlockTop">\
				<div class="selectTypeBlock">\
					<div class="selectTypeLabel">Отображать форму как:</div>\
					<select class="selectTypeForm">\
						<option value="block">блок</option>\
						<option value="modal">модальное окно</option>\
					</select>\
				</div>\
			</div>\
			<div class="modalFormBlock" type="vertical">\
				<div class="modalFormItem modalBlockItem" form_class="formV1">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem" form_class="formV2">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem" form_class="formV3">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_1.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_2.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_3.png" alt="" class="modalFormItemImg" />\
				</div>\
			</div>\
			<div class="modalFormBlock" type="horizontal" style="display:none">\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_4.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_5.png" alt="" class="modalFormItemImg" />\
				</div>\
				<div class="modalFormItem modalBlockItem">\
					<img src="/img/form/v_6.png" alt="" class="modalFormItemImg" />\
				</div>\
			</div>\
		';

		return content;
	}
/********************************************************************************************/
/******************************************************************************************/
	/**
	* Устанавливает событие
	*
	* @uses 	this.setEventNav() 		навигация	
	* @uses 	this.setEventSave() 	сохранить
	* @see 		this.createModal()
	*/
	this.setEvent = function()
	{
		//навигация
		this.setEventNav();
		//сохранить
		this.setEventSave();
	}
/*********************************************************************************************/
	/**
	* Событие сохранения формы
	*
	*
	*/
	this.setEventSave = function()
	{
		var obj = this;

		//двойной клик
		$('.modalBlockItem').off('dblclick');
		$('.modalBlockItem').on('dblclick', function() {
			obj.save();
		});

		//кнопка сохранить
		$('#modalForm .butOk').off('mousedown');
		$('#modalForm .butOk').on('mousedown', function() {
			obj.save();
		});
	}

	/**
	* Сохранение формы
	*
	* @uses		this.createForm() 		создает форму
	* @see 		this.setEventSave()
	*/
	this.save = function()
	{
		//создаем форму
		this.createForm();

		//убираем модальное окно
		// Modal.delete();
	}

	/**
	* Создаем форму
	*
	* @see 	save()
	*/
	this.createForm = function()
	{
		//выбраный элемент
		var sel_elm = $('.modalBlockItem[note="true"]');
		//тип отображения
		// var type_display = $('.selectTypeForm').val();

		//создаем саму форму
		ElementForm.create({'form_class':sel_elm.attr('form_class')});

		// ставим стили для заголовка
		var elmTitle = Element.obj.find(".text");
		ElementCss.set("geometry", elmTitle);
	}
/******************************************************************************************/
	/**
	* Устанавка событий навигации
	*
	* @see 		this.setEvent() 	
	*/
	this.setEventNav = function()
	{
		$('#modalForm .modalNavItem').off('mousedown');
		$('#modalForm .modalNavItem').on('mousedown', function() {
			//тип
			var type = $(this).attr('type');
			//убираем все блоки
			$('.modalFormBlock').css('display', 'none');
			//показываем выбраный блок
			$('.modalFormBlock[type="'+type+'"]').css('display', 'block');
		});
	}

/******************************************************************************************/
/*******************************************************************************************/
	/**
	* Показываем панель манипуляции для input
	*
	* @uses 	this.createPanelManInput() 		создаем панель
	* @uses 	this.setEventPanelManInput() 	события
	* @see 		ElementStyleController.actionAfterSelected()
	*/
	this.showPanelManInput = function()
	{
		//создаем панель управления
		this.createPanelManInput();
		//делаем не активными некоторые кнопки
		this.setStatusButPanelInput();
		//устанавливаем события
		this.setEventPanelManInput();
	}

/************************************************************************************************/
	/**
	* Создаем панель навигации
	* 
	* @uses 	this.setStatusButPanelInput()  	делаем не активными некотрые кнопки
	* @see 		this.showPanelManInput()
	*/
	this.createPanelManInput = function()
	{
		var elm = $('.elementSelected');

		//формируем блок
		var block = '<div class="panelManInput" is_delete="true">\
						<div class="panelManInputArrow"></div>\
						<img src="/img/arrow_down_w1.png" class="panelManInputItem" title="вниз" type="down" />\
						<img src="/img/arrow_up_w.png" class="panelManInputItem" title="вверх" type="up" />\
						<img src="/img/add_g.png" class="panelManInputItem" title="добавить поле" type="add" />\
						<img src="/img/cancel_r.png" class="panelManInputItem" title="удалить" type="delete" />\
						<div class="clear"></div>\
					</div>';
		//вставляем на страницу
		elm.parent().append(block);

		//устанавливаем параметры
		var left = elm.width() + parseInt(elm.css('padding-left')) + parseInt(elm.css('margin-right')) + parseInt(elm.css('padding-right'));
		$('.panelManInput').css({
			'display':'block',
			'top':3, 
			'left':left + 20
		});
	}

	/**
	* Делаем не активными некотрые кнопки
	*
	* @see 		this.showPanelManInput()
	* @see 		this.setEventPanelManInput()
	*/
	this.setStatusButPanelInput = function()
	{
		var elm = $('.elementSelected').parent();
		//делаем все кнопки активными
		$('.panelManInputItem').attr('status', 'true');

		//передвижение вниз
		if (elm.next().find('input').attr('type') != 'text') {
			$('.panelManInputItem[type="down"]').attr('status', 'false');
		}

		//передвижение вверх
		if (elm.prev().find('input').attr('type') != 'text') {
			$('.panelManInputItem[type="up"]').attr('status', 'false');
		}

		//удалить
		if (elm.closest('form').find('input[type="text"]').length < 2) {
			$('.panelManInputItem[type="delete"]').attr('status', 'false');
		}

	}
/***события для панели навигации**********************************************************************************************/
	/**
	*
	*
	*/
	this.list_func_man_input = {
		'down' : 	'manInputMove',
		'up' : 		'manInputMove',
		'delete' : 	'manInputDelete',
		'add' : 	'manInputAdd'
	}

	/**
	* Устанавливаем события для панели
	*
	* @uses 	this.list_func_man_input 		список функций
	* @uses 	obj.setStatusButPanelInput() 	сделать некоторые кнопки не активными
	* @see 		this.showPanelManInput()
	*/
	this.setEventPanelManInput = function()
	{
		var obj = this;
		$('.panelManInputItem').off('mousedown');
		$('.panelManInputItem').on('mousedown', function() {
			var type = $(this).attr('type');
			var elm = $('.elementSelected').parent();
			
			//вызываем функцию
			obj[obj.list_func_man_input[type]](elm, type);
			//обновляем состояние кнопок
			obj.setStatusButPanelInput();
			return false;
		})
	}

	/**
	* Перемещение 
	*
	* @see 	this.setEventPanelManInput()
	*/
	this.manInputMove = function(elm, type)
	{
		if ($('.panelManInputItem[type="'+type+'"]').attr('status') != 'false') {
			//получаем блок
			var block = '<div class="inputWrap">'+elm.html()+'</div>';
			//элемент брат
			var elm_brother = type == "up" ? elm.prev() : elm.next();
			
			//перемещаем если брат тоже input
			if (type == "up") elm_brother.before(block);
			else elm_brother.after(block);
			//убираем выделеный блок
			elm.remove();
			//устанавливаем события для вставленного элемента
			ElementStyleController.setEventCanvas();
			this.setEventPanelManInput();
		}
	}

	/**
	* Удаление
	*
	* @see 	this.setEventPanelManInput()
	*/
	this.manInputDelete = function(elm, type)
	{
		//удаляем
		if ($('.panelManInputItem[type="delete"]').attr('status') != 'false') {
			$('.topMenuItem[type="delete"]').mousedown();
		}
	}

	/**
	* Добавляем новое поле
	*
	* @uses 	this.createModalAddInput() 		создание модального окна
	* @uses 	this.setEventModalAddInput() 	устанавливаем события 	
	* @see 		this.setEventPanelManInput()
	*/
	this.manInputAdd = function() {
		//создаем модальное окно
		this.createModalAddInput();
		//устанавливаем события
		this.setEventModalAddInput();
	}
/************************************************************************************************/
	/**
	* Создать модальное окно для добавление нового input
	*
	* @uses 	this.getContentModalAddInput() 	получить содержимое модального окна
	* @see 		this.manInputAdd() 	
	*/
	this.createModalAddInput = function() 
	{
		var content = this.getContentModalAddInput();

		//создаем модальное окно
		Modal.create({
			'width':'400',
			'height':'',
			'top':'100',
			'id':'modalAddInput',
			'title':'Добавить поле формы',
			'content':content,
			'content_class':'modalFormBlock',
			'button':[
				['cancel', 'Отмена'],
				['add', 'Добавить']
			]
		});
	}

	/**
	* Формируем содержимое модального окна - добавление поля формы
	*
	*
	*/
	this.getContentModalAddInput = function()
	{
		var block = '\
			<div class="modalAddInputLabel">Выберите тип поля:</div>\
			<select class="choseType" >\
				<option value="new">Новое</option>\
				<option value="phone">Телефон</option>\
				<option value="email">Email</option>\
				<option value="name">Имя</option>\
				<option value="surname">Фамилия</option>\
				<option value="patronymic">Отчество</option>\
				<option value="fio">ФИО</option>\
				<option value="organization">Организация</option>\
			</select>\
		';

		return block;
	}

/****************************************************************************************************/
	/**
	* Установить событие для модального окна - добавить поле 
	*
	*
	* @see 		this.manInputAdd() 	
	*/
	this.setEventModalAddInput = function()
	{
		var obj = this;
		//сохранение
		$('.butAdd').off('mousedown');
		$('.butAdd').on('mousedown', function() {
			var option = $('#modalAddInput .choseType');
			//данные
			var value = option.val();
			var placeholder = option.find('option:selected').text();
			var type = value == 'new' ? 'new' : 'standart';

			//создаем поле
			ElementFormInput.create({'name':value, 'placeholder':placeholder, 'type_field':type});
			
			//закрываем модальное окно
			Modal.delete();		
		});

	}
/************************************************************************************************/
/***********************************************************************************************/

}//end class

//8G%dxBY89








