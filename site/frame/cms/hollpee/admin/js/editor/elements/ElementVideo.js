/**
* Элемент видео
*
*
*/
var ElementVideo = new ElementVideo();
function ElementVideo() {
	/**
	* @var 	string 	индификатор видео
	* @set 	this.setEvent()
	* @see  this.getUrl()
	*/
	this.param = {
		'video_id':'',
		'autoplay':false,
		'loop':false,
		'showinfo':true,
		'controls':true
	};

	this.operation = "edit";

/**************************************************************************************/
	/**
	* Установка параметров при инициализации
	*
	* @see 	Element.setProperty()
	*/
	this.setPropertyInit = function()
	{
		// ставим затемнение
		$(".h-blackout-element").remove();
		var blockBlackout = '\
			<div class="h-blackout-element">\
				<img src="/'+ADMIN_FOLDER+'/img/editor/video-icon.png" alt="" class="h-blackout-element-icon" />\
			</div>\
			';

		// убираем авто проигрование
		ElementVideo.setAutoplay(false);
		
		$(".h-canvas .hlp-video-content").append(blockBlackout)
									.find("> iframe")
									.removeAttr("src");
	}

	/**
	* Ставит автопроигрование
	*
	* @see 	this.setPropertyInit()
	* @see 	Site.clearText()
	*/
	this.setAutoplay = function(isSet, parentObj)
	{
		if (parentObj) var listVideo = parentObj.find(".hlp-self-video");
		else var listVideo = $(".hlp-self-video");
		var countVideo = listVideo.length;

		for (var iVideo = 0; iVideo < countVideo; iVideo++) {
			var videoObj = listVideo.eq(iVideo);
			
			if (isSet) {
				var videoSrc = videoObj.attr("src-editor");
				videoObj.attr("src", videoSrc).removeAttr("src-editor");
			} else {
				var videoSrc = videoObj.attr("src");
				videoObj.attr("src-editor", videoSrc).removeAttr("src");
			}
			// var videoSrc = videoObj.attr("src");
			// if (!videoSrc) continue;
			// if (isSet) videoSrc = videoSrc.replace(/autoplay-yes/gim, 'autoplay');
			// else videoSrc = videoSrc.replace(/autoplay/gim, 'autoplay-yes');
			// videoObj.attr("src", videoSrc);
		}
	}

/**************************************************************************************/

	/**
	* Создает модальное окно  для добавления|едактирования видео
	*
	* @param 	array(operator) 	параметры 	
	*
	*/
	this.edit = function()
	{
		//создаем модальное окно
		this.createModal();
		
		//устанавливаем события
		this.setEvent();
		
		//устанавливаем параметры видео
		var videoSrc = Element.obj.find(".hlp-self-video").attr("src-editor");
		this.setParamVideo(videoSrc);
	}													

	/**
	* Создает модальное окно
	*
	* @see 	this.edit()
	*/
	this.createModal = function()
	{
		var content = '\
			<textarea class="h-value-video-src"></textarea>\
			';		

		Modal.create({
			"id" : "modalElementVideo",
			"title" : "Изменение видео",
			"width" : 500,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel" , "Отмена"],
				["ok" , "Сохранить"]
			]
		});

		// добавляем блок для очищения
		Element.addClearCustomizer($("#modalElementVideo"));
	}

	/**
	* Устанавливает события
	*
	* @see 		this.edit()
	*/
	this.setEvent = function()
	{
		var obj = this;
		$('#modalElementVideo .hollpee-but-ok').off('click');
		$('#modalElementVideo .hollpee-but-ok').on('click', function() {
			var videoSrc = $(".h-value-video-src").val();
			obj.param.video_id = obj.getVideoId(videoSrc);
			obj.isYoutube = videoSrc.match(/youtube/gim);

			//получаем src видео
			videoSrc = obj.getSrc();

			//заменяем src у элемента
			var elm = Element.obj;

			elm.find(".hlp-self-video").attr("src-editor", videoSrc);
			Element.editCustomizer(elm, videoSrc, "video");

			Modal.delete();

			Site.setStatusSave(false);
		});
	}

/*****************************************************************************************/

	/**
	* Устанавливает video id в переменую 
	*
	* @see 	this.edit()
	* @see 	this.setEventChangeUrl()
	*/
	this.setParamVideo = function(videoSrc)
	{
		if (!videoSrc) return false;

		this.isYoutube = videoSrc.match(/youtube/gim);
		if (this.isYoutube) this.setParamYoutube(videoSrc);
		else this.setParamVimeo(videoSrc);

		// ставим в модальное окно
		this.insertUrlInVideo();
	}

	/***
	* Устанавливает параметры для youtbe
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamYoutube = function(videoSrc)
	{
		this.param.video_id = this.getVideoId(videoSrc);
		this.param.showinfo = videoSrc.match(/showinfo=0/) ? false : true;
		this.param.controls = videoSrc.match(/controls=0/) ? false : true;
		this.param.loop = videoSrc.match(/loop=1/) ? true : false;
		this.param.autoplay = videoSrc.match(/autoplay=1/) ? true : false;
	}

	/***
	* Устанавливает параметры для vimeo
	*
	* @see 	this.setParamVideo()
	*/
	this.setParamVimeo = function(videoSrc)
	{
		this.param.video_id = this.getVideoId(videoSrc);
		this.param.showinfo = videoSrc.match(/title=false/) ? false : true;
		this.param.loop = videoSrc.match(/loop=true/) ? true : false;
		this.param.autoplay = videoSrc.match(/autoplay=true/) ? true : false;
	}

/*********************************************************************************************/

	/**
	* Отдает id видео
	* 
	* @see 	this.setParamVideo()
	* @see 	this.setEvent()
	*/
	this.getVideoId = function(videoSrc)
	{
		//получаем из url индификатор видео
		var pat = /(\/watch\?v=([a-zA-Z_0-9\-]+))|(youtube\.com\/embed\/([a-zA-Z_0-9\-]+))/gim;
		var listProperty = pat.exec(videoSrc);

		if (listProperty) {
			var videoId = listProperty[2];
			if (!videoId) videoId = listProperty[4];
		} else {
			var videoId = /vimeo\.com(\/video)?\/([\w]+)/gim.exec(videoSrc);
			videoId = videoId[2];
		}

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

		if (this.isYoutube) var urlMain = 'https://www.youtube.com/watch?v=';
		else var urlMain = 'https://vimeo.com/';
		var urlVideo = urlMain + this.param.video_id


		$(".h-value-video-src").val(urlVideo);
	}

	/**
	* Сформировать url видео
	*
	* @see 		this.insertUrlInVideo()
	* @see 		this.setEventSave()
	*/
	this.getSrc = function()
	{
		var videoId = this.param.video_id;

		//формируем параметры url
		if (this.isYoutube) {
			var urlParam = this.param.showinfo ? '': '&showinfo=0';
			urlParam += this.param.controls ? '': '&controls=0';
			urlParam += this.param.loop ? '&loop=1&playlist='+videoId: '';
			urlParam += this.param.autoplay ? "&autoplay=1" : '';

			return 'https://www.youtube.com/embed/'+videoId+'?rel=0'+urlParam;
		} else {
			var urlParam = this.param.showinfo ? '': '&title=false&byline=false&portrait=false';
			urlParam += this.param.loop ? '&loop=true': '';
			urlParam += this.param.autoplay ? "&autoplay=true" : '';

			if (urlParam) urlParam = urlParam.replace(/^&/gim, "?");

			return 'https://player.vimeo.com/video/'+videoId+urlParam;
		}
	}



} //end class

