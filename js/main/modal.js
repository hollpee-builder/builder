/**
* Модальное окно
*
*/
var Modal = new Modal();
function Modal() {
	/**
	* Создание модального окна
	*
	* @param 	array 	params - параметрамы 
	*
	* @uses 	Blackout.create() 		создаем затемнение
	*
	* array = 	'width':'80',
	*			'height':'',
	*			'height_other':'50',
	*			'top':'50',
	*			'id':'modalImage',
	*			'title':'Изменить изображение',
	*			'is_resize':true,
	* 			'no_close':false,
				'no_hide_scroll':false
	*			'nav':[
	*				['my', 'Мои'],
	*				['icon', 'Иконки'],
	*				['bg', 'Фон'],
	*				['button', 'Кнопки'],
	*				['arrow', 'Стрелки'],
	*				['photo', 'Фотографии']
	*			],
	*			'content':content,
	*			'content_class':'modalImageContent',
	* 			'content_height':'max',
	*			'button':[
	*				['delete', 'Удалить изображение'],
	*				['ok', 'Сохранить'],
	*				['cancel', 'Отмена']
	*			]
	* @uses 	Blackout.create()		создаем затемнение
	* @uses 	ModalBlock.create() 	Блок модального
	*
	*/
	this.create = function(params)
	{
		//создаем затемнение
		Blackout.create(params);
		//создаем блок  
		ModalBlock.create(params);	
	};
/*********************************************************************************************/
	/**
	* Удаление модального окна
	*
	* @see 	Blackout.seEvent()
	* @see 	this.deleteLoadind()
	* @see 	ModalBlock.setEventDelete()
	*/
	this.delete = function(is_record)
	{
		//удаляем затемнение
		Blackout.delete();
		//удаляем блок  
		ModalBlock.delete();	

		//записываем в историю
		if (is_record) {
			History.record();
		}
	};
/***************************************************************************************/
	/**
	* Создание загрузки
	*
	* @param 	string 		label-заголовок оперпции
	*
	* @uses 	this.create() - создание  модального окна
	*/
	this.createLoading = function(label)
	{
		if (!label) label = '';
		var content = '<img src="/img/loading.gif" alt="" class="modalLoadingImage" />\
		 				<div class="modalLoadingLabel">'
		 					+label+"..."+
		 				'</div>';
		 
		 this.create({
		 	'id':'modalLoading',
		 	'width': '285',
		 	'height': '',
		 	'top': '180',
		 	'content': content,
		 	'not_event':true
		 });
	};

	/**
	* Удаление загрузки
	* 
	* @param 	boolean 	is_delay-делать задержку
	*
	* @uses 	this.delete()	удаляет модальное окно полностью
	*/
	this.deleteLoadind = function(is_delay) {
		var obj = this;
		//делаем удаление с задержкой, если быстро произошло действие чтобы не дергало
		if (is_delay) {
			setTimeout(function(){
				obj.removeLast();
			}, 1500);
		} else {
			this.removeLast();
		}
	}
/***************************************************************************************/
	/**
	* Удаление загрузки
	*
	*
	*/
	this.removeLoading = function()
	{

	};
/************************************************************************************************/
	/**
	* Подтверждение удаления
	*
	*
	*/
	this.confirmationDelete = function(label, func)
	{
		if (!label) label = Resource.main_confirmation_delete_label;
		
		var content = '<div class="confirmationDeleteLabel">'+label+'</div>';

		this.create({
			"title":Resource.main_confirmation_delete_label,
			"id":"confirmationDelete",
			"width":400,
			"top":50,
			"content":content,
			"button":[
				["cancel", Resource.main_modal_but_cancel],
				["delete", Resource.main_modal_but_delete]]
		});

		var obj = this;
		// нажатие любой кнопки
		$("#confirmationDelete .butDelete").off("click"); 
		$("#confirmationDelete .butDelete").on("click", function() {
			if (func) func();
			
			obj.removeLast("confirmationDelete");
		});
	}
/*************************************************************************************************/
	/**
	* Убрать последний блок
	*
	* @see 	this.confirmationDelete()
	*/
	this.removeLast = function()
	{
		// удаляем сам блок
		$(".modalBlock:last").remove();
		$(".blackout:last").remove();
		
		// показываем предыдущий
		if ($(".modalBlock").length) {
			$(".modalBlock:last").css("display", "block");
		}
	}


/**********************************************************************************/
	
	this.tutorial = function(butObjV, titleV, embedV)
	{
		butObjV.off("mousedown");
		butObjV.on("mousedown", function() {
			
			var content = '\
				<div class="modalVideoFrameWrap">\
					<div class="modalVideoFrameContent">\
						<iframe style="width:100%;height:280px;display:block;" id="modalVideoFrame" src="http://www.youtube.com/embed/'+embedV+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
					</div>\
				</div>';

			Modal.create({
				'id':'modalTutorial',
				'content':content,
				'title': titleV,
				'button':[
							['cancel', 'Закрыть'],
						],
				'width':'550',
				'height':'', 
				'top':'50'});
		});
	}
	
/***********************************************************************************/
}//end class
/**********************************************************************************/
/***********************************************************************************/
/*затемнения******************************************************************************/
var Blackout = new Blackout();
function Blackout() {
	/**
	* Создание затемнения
	*
	* @param 	boolean 			not_event - не ставить событие 
	*
	* @uses 	this.hideScroll() 	убирает прокрутку
	* @uses 	this.show() 		показывает затемнение
	* @uses 	this.setEvent() 	установить событие для затемнения	 		
	* @see 		Modal.create() 		при создании модального окна	
	*/
	this.create = function(params) {
		this.params = params;

		//вставляем блок затемнения
		$('body').append('<div class="blackout"></div>');
		
		if (!params['no_hide_scroll']) {
			//прячем прокрутку
			this.hideScroll();
		}
		
		//показать затемнение
		// if($('.blackout').length == 1) 
			this.show();

		//событие затемнения на удаление
		if (!params["not_event"]) {
			//ставим
			this.setEvent();
		} else {
			//убираем
			this.deleteEvent();
		}
	};
/****************************************************************************************/
	/**
	* показать затемнение
	*
	* @uses 	this::speed - скорость анимации
	* @see 		this::createBlackout()	
	*/
	this.show = function()
	{
		$('.blackout').animate({'opacity':'1'}, 0);
	};
	/**
	* убрать затемнение
	*
	* @uses 	this::showScroll() 	показать прокрутку	
	* @see 		this::deleteModal()
	*/
	this.delete = function()
	{
		//убираем затемнение
		$('.blackout').remove();
		//показываем прокрутку
		this.showScroll();
		// убираем события на кнопки
		$(document).off("keydown");
	};
/*******************************************************************************/
	/**
	* Поставить событие - закрытие модального окна при клике 
	* вне области модального окна
	*
	* @uses 	Modal.delete() 		удаление блока
	* @see 		this.create()
	*/
	this.setEvent = function()
	{
		//клик вне области модального окна
		$('.blackout').off('click');
		$('.blackout').on('click', function() {
			if ($(".modalBlock").length > 1) Modal.removeLast("modalAddFolder");
			else Modal.delete();

			return false;
		});
	};	

	/**
	* Убираем событие
	*
	*/
	this.deleteEvent = function()
	{
		$('.blackout').off('mousedown');
	};

/**********************************************************************************/
	/**
	* прячем прокутку
	*
	* @see 		this.create()
	* @todo 	сделать padding-right у body
	*/
	this.hideScroll = function()
	{
		// ширина до
		var width = $("body").width();
		//прячем прокрутка
		$('body').css({'overflow':'hidden'});
		var scroll_width = $("body").width()-width; 
		
		//делаем отступ с права на ширину скролла
		if (scroll_width) $('body').css('padding-right', scroll_width);		
	};
	/**
	* показываем прокутку
	*
	* @see 		this.delete()
	*/
	this.showScroll = function()
	{
		//показываем прокрутку
		$('body').css({'overflow':'auto'});
		//убираем отступ
		$('body').css('padding-right', '0');
	};



}//end class
/**********************************************************************************/
/***********************************************************************************/
/*создание блока******************************************************************************/
var ModalBlock = new ModalBlock();
function ModalBlock() { 
	/**
	* @var 		array  параметры всех модальных окан 	
	* @set 		this.setVariables()
	*/
	this.data = {};

	/**
	* @var 		array  параметры текущего модального окна
	* @set 		this.setVariables()
	*/
	this.curr_data = {};

	/**
	* @var 		array  переменые 	
	* @set 		this.createBlock()
	* @see 		this.setOptionsBlock()
	*/
	this.curr_modal = {};

	/**
	* @var 	array 	ширина scroll
	* 
	*/
	this.scroll_width = 0;
/*************************************************************************************/	
	/**
	* Создание блок модального окна
	*
	* @param 	array					params - параметры блока 
	*
	* @uses 	this.setVariables()			устанавить переменые
	* @uses 	this.createBlock()			создаем модальный блок
	* @uses 	this.setOptionsNewBlock()	устанавливаем параметры новому блоку
	* @uses 	this.seEvent() 				устанавливаем события
	* @see 		Modal.create() 				при создании модального окна	
	*/
	this.create = function(params) 
	{
		//прячем все блоки
		// $('.modalBlock').css('display', 'none');

		//устанавить переменые
		this.setVariables(params);	
		//вставляем модальное окно на страницу
		this.createBlock();
		//устанавливаем параметры блока для созданного блока
		this.setOptionsNewBlock();
		//устанавливаем параметры для блока
		this.setEvent();

		// ставим фокус
		this.setFocus();
		// нажатие enter
		this.setKeyEnter();
	};

	/**
	* Ставит focus
	*
	* @see 	this.create()
	*/
	this.setFocus = function()
	{
		setTimeout(function() {
			var firstInput = $(".modalBlock:last").find("input[type='text'], textarea");
			firstInput.eq(0).focus()

		// 	var range = document.createRange();
		// 	var sel = window.getSelection();
		// 	range.setStart(firstInput[0], 1);
		// 	range.collapse(true);
		// 	sel.removeAllRanges();
		// 	sel.addRange(range);
		}, 50)
	}

	/**
	* Ставим нажатие enter
 	*
	* @see 	this.create()
	*/
	this.setKeyEnter = function()
	{
		$(document).off("keydown");
		$(document).on("keydown", function(e) {
			var keyCode = e.keyCode;
			if (keyCode != 13) return true;
			
			if ($("textarea:focus").length) return true;
			if ($("*[contenteditable='true']:focus").length) return true;

			// кнопка действия
			var lastModal = $(".modalBlock:last");
			var butAction = lastModal.find(".butAdd");
			if (!butAction.length) butAction = lastModal.find(".butOk");
			if (!butAction.length) butAction = lastModal.find(".butDelete");
				
			// эмитируем нажатие 
			butAction.mousedown().click();
			// удаляем
			// Modal.removeLast();
			return false;
		});
	}
/***************************************************************************************/
/***************************************************************************************/
	/**
	* Устанавливаем параметры
	*
	* @param 	array				params - параметры блока 
	*
	* @see 	this.create()
	*/
	this.setVariables = function(params)
	{
		//ширина и высота экрана
		this.screen_width = $('body').width();
		this.screen_height = $('body').height();
				
		//ширина экрана без скролла 
		this.screen_width_noscroll = this.screen_width + this.scroll_width;

		//ширина и высота блока 
		params['height'] = params['height'] ? params['height']+'px' : 'auto';

		// координат по x - ставим в центер экрана
		var elmWidth = params['width'];
		var widthUnit = elmWidth.toString().match(/%/) ? "%" : "px";
		var parentWidth = widthUnit == "%" ? 100 : this.screen_width;
		var elmLeft = (parentWidth - parseInt(elmWidth)) / 2;
		if (elmLeft < 0) elmLeft = 0;
		params['left'] = elmLeft + widthUnit;

		//класс контента
		params['content_class'] = params['content_class'] ? params['content_class'] : 'modalBlockCont';
	
		//класс блока
		modal_id = params['id'];
		//заносим в массив данные
		this.data[modal_id] = params;
		this.curr_data = params;
	}
/*************************************************************************************/
/************************************************************************************/
	/**
	* Вставляем модальный блок на страницу
	*
	* @uses 	this.getBlock() 	получить блок для встаки
	* @see 		this.create()
	*/	
	this.createBlock = function()
	{
		//получаем блок
		var block = this.getBlock();
		//вставляем на страницу
		$('body').append(block);
		//текущие модальное окно
		this.curr_modal = $('#'+this.curr_data['id']);
	}
/***********************************************************************************/
	/**
	* Отдать блок
	*
	* @uses 	this.getBlockHead() 	получить header 
	* @uses 	this.getBlockNav() 		получить навигацию (если есть)
	* @uses 	this.getBlockButton() 	получить блок кнопак (если есть)
	* @see 		this.createBlock();
	*/
	this.getBlock = function()
	{
		//заголок
		var block_head = this.getBlockHead();
		//навигация
		var block_nav = this.getBlockNav();
		//кнопки
		var block_button = this.getBlockButton();

		//формируем блок
		var block = '	<div class="modalBlock" id="'+this.curr_data['id']+'">'
							+block_head
							+block_nav+
							'<div class="modalBlockCont">'
								+this.curr_data['content']+
							'</div>'
								+block_button+
							'<div class="clear"></div>\
						</div>';
		return block;
	};
/***************************************************************************************/
	/**
	* Отдает часть блока - заголовок
	*
	* @uses 	this.params['title'] 	название блока
	* @see 		this.getBlock()
	*/
	this.getBlockHead= function()
	{
		//this.params['title']
		if (this.curr_data['title']) {
			//блок изменения размера
			var block_resize = this.curr_data['is_resize'] ? '<div class="modalHeadResize modalHeadButtomItem" status="min" is-image="true"></div>' : '';
			var block_close = !this.curr_data['no_close'] ? '<div class="modalHeadClose modalHeadButtomItem" is-image="true"></div>' : '';

			return '<div class="modalBlockHead">\
						<div class="modalBlockTitle">'
							+this.curr_data['title']+ 
						'</div>\
						<div class="modalBlockHeadButtom">'
							+block_close
							+block_resize+
						'	<div class="clear"></div>\
						</div>\
					</div>'
					;
			} else {
				return '';
			}
	};
/**************************************************************************************/
	/**
	* Отдает блок навигации
	*
	* @see 		this.getBlock()
	*/
	this.getBlockNav =  function()
	{
		//список пунктов навигации
		var list_nav = this.curr_data['nav']; 
		//если есть навигация
		if (list_nav) {
			var block = '';
			//gjпроходим по пунктам навигацию
			for (var k in list_nav) {
				//пункт
				var item = 	list_nav[k];
				//класс активности
				var class_act = k == 0 ? 'modalNavItemAct': '';  

				//формируем вкладку
				block += '<div class="modalNavItem '+class_act+'" type="'+item[0]+'">'+item[1]+'</div>';
			}

			return 	'<div class="modalNav">'
						+block+
						'<div class="clear"></div>\
					</div>';
		} else {
			return '';
		}	
	};
/****************************************************************************************/
	/**
	* @var 	array 	классы кнопок
	* @see 	this::getOneButton()
	*/
	this.buttton_class = {
		'add':'butAdd', 
		'ok':'butOk', 
		'cancel':'butCancel',
		'delete':'butDelete',	
		'edit':'butEdit',	
		'buy':'butBuy'
	};

	/**
	* Отдает часть блока - кнопки
	*
	* @return 	html 	блок с кнопками
	*
	* @uses 	this.params['button'] 		кнопки
	* @use 		this.getOneButton() 		отдает кнопку определенного типа
	* @see 		this.getBlock()
	*/
	this.getBlockButton = function()
	{
		//кнопки
		var buts = this.curr_data['button'];
		if (buts) {
			//формируем блок
			var block = '<div class="modalBlockButtton">';
			//разбиваем набор на кнопки
			for (var item in buts) {
				//получить одну кнопку
				block += this.getOneButton(buts[item])
			}
			block += '		<div class="clear"></div>\
						</div>';

			return '<div class="modalBlockFooter">'+block+'<div class="clear"></div></div>';
		} else {
			return '';
		}
	};

	/**
	* отдает кнопку
	*
	* @param 	array 	item - одна кнопка
	* @return 	html 	одну кнопку
	*
	* @uses 	this::buttton_class 	классы кнопок
	* @see 	this::getBlockButton()
	*/
	this.getOneButton = function(item)
	{
		var but = '	<div class="butBlock '+this.buttton_class[item[0]]+'">\
						<div class="textInBut">'+item[1]+'</div>\
					</div>';
		return but;
	};

/************************************************************************************/
/***установка параметров********************************************************************************/
	/**
	* Устанавливает параметры для окна
	*
	* @uses 	this.setOptionsBlock() 	 		для блока
	* @uses 	this.setOptionsBlockContent() 	для контента
	* @see 		this.create()
	*/
	this.setOptionsNewBlock = function()
	{
		//для блока
		this.setOptionsBlock();
		//для конента
		this.setOptionsBlockContent();
	};
	/**
	* Устанавливает параметры 
	*
	* @uses 	this.curr_data 				данные текущего блока
	* @see 		this.setOptionsNewBlock()
	*/
	this.setOptionsBlock =  function() 
	{
		//задаем блоку параметры
		this.curr_modal
			.css({
				'width':this.curr_data['width'], 
				'height':this.curr_data['height'],
				'top':this.curr_data['top']+'px',  
				'left':this.curr_data['left']
			});
	};
	
	/**
	* Устанавливает параметры для контента блока
	*
	* @uses 	this.getHeightContent() 	получить высоту контейнера
	* @see 		this.setOptionsNewBlock()
	* @see 		this.setEventResize
	*/
	this.setOptionsBlockContent =  function() 
	{
		//высота контенера
		var height = this.getHeightContent();
		//контент
		$('.'+this.curr_data['content_class']).height(height);
	};

	/**
	* Получить высоту контеннера
	*
	* @param 	int 	indent-отступ снизу
	*
	* @see 	this.setOptionsBlockContent() 		при создание блока
	* @see 	this.setEventResize() 			 	при изменении размера блока
	*/
	this.getHeightContent = function(indent)
	{
		//отступ с низу,
		var indent_bottom = indent ? indent : 80;

		if (this.curr_data['content_height'] == 'max') {
			//текущий блок
			var par = this.curr_modal;
			//дополнительная высота
			var height_other = this.curr_data['height_other'] ? this.curr_data['height_other'] : 0;
			//расчитываем высоту блока с контентом
			return this.screen_height - par.find('.modalBlockHead').height() - par.find('.modalNav').height() - par.find('.modalBlockFooter').height() - parseInt(this.curr_modal.css('top')) - height_other - indent_bottom; 
		} else {
			return this.curr_data['content_height'];
		}
	};
/*************************************************************************************/
/************************************************************************************/
	/**
	* Устанавливаем события 
	*
	* @uses 	this.setEventResize() 			изменить размер
	* @uses 	this.setEventDelete() 		 	удаление блока
	* @uses 	this.setEventNoteItemBlock()	выбор элемента из списка
	* @uses 	this.setEventNav() 				навигация
	* @see 		this.create()
	*/
	this.setEvent = function()
	{
		//изменение размера блока
		this.setEventResize();
		//удаление блока 
		this.setEventDelete();
		//выбор элемента
		this.setEventNoteItemBlock();
		//навигация
		this.setEventNav();
	}
/************************************************************************************/
	this.setEventResize = function()
	{
		var obj = this;
		//расширение блока
		$('.modalHeadResize').off('mousedown');
		$('.modalHeadResize').on('mousedown', function() {
			var elm = $(this);
			var status = elm.attr('status');

			if (status == 'min') {
				//изменяем параметры модального окна
				obj.curr_modal.css({
					'width':'95%',
					'top':'25px','left':'2.5%'
				});
							
				//изменяем блока с контентом
				$('.'+obj.curr_data['content_class']).height(obj.getHeightContent(50));

				//добавляем класс отмечающий что max 
				elm.addClass('modalHeadResizeMax');
			} else {
				//устанавливаем стили
				obj.curr_modal.css({
					'top':obj.curr_data['top']+'px', //позиция 
					'left':obj.curr_data['left']+'px',
					'width':obj.curr_data['width']
				});
				//убираем класс отмечающий что max 
				elm.removeClass('modalHeadResizeMax');
				//устанавливаем параметры контента так как параметры изменились
				obj.setOptionsBlockContent();
			}
						
			//отимечаем текущий размер
			var new_status = status == 'min' ? 'max' : 'min';
			elm.attr('status', new_status);
		});
	}
/**********************************************************************************/
	/**
	* Удаление модального окна
	*
	* @uses 	Modal.delete() 		удаление модального окна полностью
	* @see 		this.setEvent()
	*/
	this.setEventDelete = function()
	{
		
		// $('.modalHeadClose').off('mousedown');
		// $('.modalHeadClose').on('mousedown', function() {
		// 	Modal.delete();
		// });

		//кнопка cancel
		$('.modalBlock .butCancel, .modalHeadClose').off('mousedown');
		$('.modalBlock .butCancel, .modalHeadClose').on('mousedown', function() {
			if ($(".modalBlock").length > 1) Modal.removeLast("modalAddFolder");
			else Modal.delete();
		});
	}
/*******************************************************************************************/
	/**
	* Отметить элемент
	*
	* @see 	this.setEvent()
	*/
	this.setEventNoteItemBlock = function()
	{
		$('.modalBlockItem').off('mousedown');
		$('.modalBlockItem').on('mousedown', function() {
			//убираем выделение у элемента
			$('.modalBlockItem').attr('note', 'false');
			//отмечаем элемент
			$(this).attr('note', 'true');
		})
	}
/***************************************************************************************************/
	/**
	* Навигация
	*
	* @see 	this.setEvent()
	*/
	this.setEventNav = function() 
	{
		$('.modalNavItem').off('mouseup');
		$('.modalNavItem').on('mouseup', function() {
			//убираем класс у всех
			$('.modalNavItem').removeClass('modalNavItemAct');
			//добавляем класс
			$(this).addClass('modalNavItemAct');
		})
	}
/****************************************************************************************/
/*******************************************************************************************/
	/**
	* Показать модальное окно - анимация
	*
	* @see 		this.create()
	*/
	/*this.show = function()
	{
		this.curr_modal
			.css({'top':'-'+this.block_height})
			.animate({'top':this.pos_y},0);	
	};*/
	
	/**
	* Удалить блок модального окна
	*
	* @see 	Modal.delete()
	*/
	this.delete = function()
	{
		$('.modalBlock').remove();
	};
				
}//end class
/*************************************************************************************/
/***************************************************************************************/
/*загрузка**************************************************************************************/


