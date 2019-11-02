/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementVideo.prototype = EditElementBasic;
var EditElementVideo = new EditElementVideo();
EditElementVideo.parent = EditElementBasic;

function EditElementVideo() {
	/**
	* @var 	string 	индификатор видео
	* @set 	this.setEvent()
	* @see  this.getUrl()
	*/
	this.param = {
		'video_id':'',
		'autoplay':false,
		'loop':false,
		'showinfo':false,
		'controls':false
	};
/**************************************************************************************/
	/**
	* Создает модальное окно  для добавления|едактирования видео
	*
	* @param 	array(operator) 	параметры 	
	*
	*/
	this.edit = function(param)
	{
		this.operation = param ? param.operation : "edit";

		//создаем модальное окно
		this.createModal();
		//устанавливаем события
		this.setEvent();
		
		//устанавливаем параметры видео
		if (this.operation == 'edit'){
			var videoHref = Element.obj.find(".self-video").attr("src");
			this.setParamVideo(videoHref);
		}
	}													
/*********************************************************************************************/
/******************************************************************************************/
	/**
	* Создает модальное окно
	*
	* @uses 	this.getContent() 	получить контент
	* @uses 	this.setEvent() 	устанавливает событие
	* @see 	this.edit()
	*/
	this.createModal = function()
	{
		//получить содержимое модального окна
		var content = this.getContent();
		var titleVideo = this.operation == "add" ? Resource.hlp_modal_video_title_add : Resource.hlp_modal_video_title_edit;
		

		//создаем модальное окно
		Modal.create({
			'id':'modalVideo',
			'width':'810',
			'height':'',
			'top':'50',
			'title':titleVideo,
			'content':content
		});
	}


	/**
	* Получить контент для блока
	*
	* @see 		this.createModal()
	*/
	this.getContent = function()
	{
		var tutorialIdV = '0MYSIKkiXPs';
		var content = '	<div class="modalVideoBlockLeft modalVideoBlock">\
							<iframe id="modalVideoFrame"  src="https://www.youtube.com/watch?v='+tutorialIdV+'" frameborder="0" allowfullscreen></iframe>\
						</div>\
						<div class="modalVideoBlockRight modalVideoBlock">\
							<div class="modalVideoListParam">\
								<div class="modalVideoBlockItem  modalVideoBlockItemUrl" >\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_url+'\
									</span>\
									<input type="text" class="modalVideoUrlInput" placeholder="'+Resource.hlp_modal_video_label_url_placeholder+'" key="video_id"/>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="autoplay" no_replace="true"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_autoplay+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="loop"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_loop+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem">\
									<input type="checkbox" class="modalVideoCheckbox" key="showinfo"/>\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_panel_info+'\
									</span>\
								</div>\
								<div class="modalVideoBlockItem modalVideoItemMan">\
									<input type="checkbox" class="modalVideoCheckbox" key="controls" />\
									<span class="modalVideoUrlLabel modalVideoLabel">\
										'+Resource.hlp_modal_video_label_panel_manager+'\
									</span>\
								</div>\
							</div>\
							<div class="modalBlockButtton">\
								<div class="butBlock butOk butInstruction" style="float:left;">\
									<div class="textInBut">'+Resource.main_modal_but_instruction+'</div>\
								</div>\
								<div class="butBlock butCancel" style="">\
									<div class="textInBut">'+Resource.main_modal_but_cancel+'</div>\
								</div>\
								<div class="butBlock butAdd">\
									<div class="textInBut">'+Resource.main_modal_but_save+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
						<div class="clear"></div>';


		return content;
	}
/*************************************************************************************/
	/**
	* Устанавливает события
	*
	* @uses 	this.setEventCheckbox()  	checkbox
	* @uses 	this.setEventChangeUrl() 	изменение uri
	* @uses 	this.setEventSave() 		сохранение видео
	* @see 		this.edit()
	*/
	this.setEvent = function()
	{
		//checkbox
		this.setEventCheckbox();
		//изменение uri
		this.setEventChangeUrl();
		//сохраняем видео
		this.setEventSave();
		// интструкция
		this.setEventInstruction();
		// отмена
		this.setEventCancel();

	}

	/**
	* Событие для checkbox
	*
	* @uses 	this.insertUrlInVideo() 	замена url у видео
	* @see 		this.setEvent()
	*/
	this.setEventCheckbox = function() {
		var obj = this;
		//изменение chekbox
		$('#modalVideo input[type="checkbox"]').off('change');
		$('#modalVideo input[type="checkbox"]').on('change', function() {
			var elm_event = $(this);
			//ключ
			var key = elm_event.attr('key');
			//значение
			// var value = elm_event.attr('checked') ? false : true;
			var value = obj.param[key] ? false : true;
			//отмечаем или убираем checkbox
			elm_event.attr('checked', value);

			//заносим новое значение в переменую
			obj.param[key] = value;

			//если нет отметки не заменять
			if (!elm_event.attr('no_replace')) {
				//заменяем url
				obj.insertUrlInVideo();
			}
		});
	}

	/**
	* Событие изменения  url
	*
	* @uses 	this.insertUrlInVideo() 	замена url у видео
	* @see 	this.setEvent()
	*/
	this.setEventChangeUrl = function() {
		var obj = this;
		
		//изменение url
		$('#modalVideo input[key="video_id"]').off('change');
		$('#modalVideo input[key="video_id"]').on('change', function() {
			var valueVideo = $(this).val();

			/**переделать*******/
			$("#modalVideo .modalBlockCont").html(obj.getContent());
			$('#modalVideo input[key="video_id"]').val(valueVideo);
			obj.setEvent();
			/************/

			obj.setParamVideo(valueVideo);

			return true;
		});
	}

	/**
	* Сохранение видео
	*
	* @see 		this.setEvent()
	*/
	this.setEventSave = function()
	{
		var obj = this;
		$('#modalVideo .butAdd').off('click');
		$('#modalVideo .butAdd').on('click', function() {
			//получаем src элемента
			var src = obj.getSrc();

			//создание нового
			if (obj.operation == 'add') {	
				//устанавливаем переменую в класс
				ElementVideo.param = obj.param;
				ElementVideo.src = src;
				//создаем элемент
				ElementVideo.create();
			//изменение 
			} else {
				//заменяем src у элемента
				Element.obj.find('.self-video').attr('src', src);
				//удаляем модальное окно
				Modal.delete(true);
			}
		});
	}


	/**
	* События для кнопки инструкция
	*
	* @see 	this.setEvent()
	*/
	this.setEventInstruction = function()
	{
		var but = $("#modalVideo .butInstruction");
		but.off("mousedown");
		but.on("mousedown", function() {
			var content = '\
			<div class="modalInstruction">\
				<iframe id="modalVideoFrame" src="https://www.youtube.com/embed/2wWv09cF8Vs?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
			</div>';

			Modal.create({
				"id":"modalInstruction",
				"title":Resource.hlp_modal_video_instruction_title,
				"content":content,
				"width":500,
				"top":30
			});
		});
	}

	this.setEventCancel = function()
	{
		var but = $("#modalVideo .butCancel");
		but.off("mousedown");
		but.on("mousedown", function() {
			Modal.delete();			
		});
	}

/*****************************************************************************************/
/*****************************************************************************************/
	/**
	* Устанавливает video id в переменую 
	*
	* @see 	this.edit()
	* @see 	this.setEventChangeUrl()
	*/
	this.setParamVideo = function(videoHref)
	{
		this.isYoutube = videoHref.match(/youtube/gim);
		if (this.isYoutube) this.setParamYoutube(videoHref);
		else this.setParamVimeo(videoHref);

		// ставим в модальное окно
		this.insertUrlInVideo();
		
		// ставим checkbox
		$(".modalVideoBlock input").removeAttr("checked"); 
		for (var key in this.param) {
			if (this.param[key] && key != 'video_id') {
				var inputObj = $('#modalVideo .modalVideoCheckbox[key="'+key+'"]');

				inputObj.prop("checked", true);
			}
		}
	}

	/***
	* Устанавливает параметры для youtbe
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamYoutube = function(videoHref)
	{
		this.param = {};
		this.param.video_id = this.getVideoId(videoHref);
		this.param.showinfo = videoHref.match(/showinfo=0/) ? false : true;
		this.param.controls = videoHref.match(/controls=0/) ? false : true;
		this.param.loop = videoHref.match(/loop=1/) ? true : false;
		this.param.autoplay = videoHref.match(/autoplay-yes=1/) ? true : false;
	}

	/***
	* Устанавливает параметры для vimeo
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamVimeo = function(videoHref)
	{
		this.param = {};
		var videoId = /vimeo\.com(\/video)?\/([\w]+)/gim.exec(videoHref);
		this.param.video_id = videoId[2];
		this.param.showinfo = videoHref.match(/title=false/) ? false : true;
		this.param.loop = videoHref.match(/loop=true/) ? true : false;
		this.param.autoplay = videoHref.match(/autoplay-yes=true/) ? true : false;
	}

/*********************************************************************************************/

	/**
	* Отдает id видео
	* 
	* @see 	this.setParamVideo()
	*/
	this.getVideoId = function(videoHref)
	{
		//получаем из url индификатор видео
		var pat = /(\/watch\?v=([a-zA-Z_0-9\-]+))|(youtube\.com\/embed\/([a-zA-Z_0-9\-]+))/gim;
		var listProperty = pat.exec(videoHref);

		var videoId = listProperty[2];
		if (!videoId) videoId = listProperty[4];

		return videoId;
	}

	/**
	* вставляем url в видео
	*
	* @see 		this.setEventCheckbox()  	
	* @see 		this.setEventChangeUrl() 	
	*/
	this.insertUrlInVideo = function()
	{
		//получаем ссылку
		var src = this.getSrc();
		//заменяем у видео src
		$('#modalVideoFrame').attr('src', src);

		if (this.isYoutube) var urlMain = 'https://www.youtube.com/watch?v=';
		else var urlMain = 'https://vimeo.com/';
		var urlVideo = urlMain + this.param.video_id


		$(".modalVideoUrlInput").val(urlVideo);
		//устанавливаем событие как загрузиться видео так показываем его
		this.setEventLoadVideo();
		
		// показываем панель или убираем
		if (this.isYoutube) var checkOpacity = "1";
		else var checkOpacity = "0";
		$(".modalVideoItemMan").css("opacity", checkOpacity);
	}

	/**
	* Сформировать url видео
	*
	* @param 	array() 	param-парметры видео
	* @param 	boolean		is_autoplay - статус ставить авто запуск или нет
	*
	* @see 		this.insertUrlInVideo()
	* @see 		this.setEventSave()
	* @see 		PageController.setEventShowModeVideo() 		режим просмотр
	*/
	this.getSrc = function()
	{
		var video_id = this.param.video_id; //id видео
		
		//формируем параметры url
		if (this.isYoutube) {
			var url_param = this.param.showinfo ? '': '&showinfo=0';
			url_param += this.param.controls ? '': '&controls=0';
			url_param += this.param.loop ? '&loop=1&playlist='+video_id: '';
			url_param += this.param.autoplay ? "&autoplay-yes=1" : '';
			return 'https://www.youtube.com/embed/'+video_id+'?rel=0'+url_param;
		} else {
			var url_param = this.param.showinfo ? '': '&title=false&byline=false&portrait=false';
			url_param += this.param.loop ? '&loop=true': '';
			url_param += this.param.autoplay ? "&autoplay-yes=true" : '';

			if (url_param) url_param = url_param.replace(/^&/gim, "?");

			return 'https://player.vimeo.com/video/'+video_id+url_param;
		}
		
		
	}

/******************************************************************************************/
	/**
	* Как видео загружено показать его, это делается что бы 
	*
	* @see 	this.insertUrlInVideo()
	*/
	this.setEventLoadVideo = function()
	{
		//убираем видео, что бы небыло задержки после изменения url 
		$('#modalVideoFrame').css('opacity', '0');

		$('#modalVideoFrame').on('load', function() {
			//как загрузилось видео показываем его
			$('#modalVideoFrame').css('opacity', '1');
			//убираем  событие
			$('#modalVideoFrame').off('load');
		});
	} 
/******************************************************************************************/


}//end class



