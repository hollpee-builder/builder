/*! WOW - v1.1.3 - 2016-05-06
* Copyright (c) 2016 Matthieu Aussaguel;*/
(function(){var a,b,c,d,e,f=function(a,b){return function(){return a.apply(b,arguments)}},g=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b=function(){function a(){}return a.prototype.extend=function(a,b){var c,d;for(c in b)d=b[c],null==a[c]&&(a[c]=d);return a},a.prototype.isMobile=function(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)},a.prototype.createEvent=function(a,b,c,d){var e;return null==b&&(b=!1),null==c&&(c=!1),null==d&&(d=null),null!=document.createEvent?(e=document.createEvent("CustomEvent"),e.initCustomEvent(a,b,c,d)):null!=document.createEventObject?(e=document.createEventObject(),e.eventType=a):e.eventName=a,e},a.prototype.emitEvent=function(a,b){return null!=a.dispatchEvent?a.dispatchEvent(b):b in(null!=a)?a[b]():"on"+b in(null!=a)?a["on"+b]():void 0},a.prototype.addEvent=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c},a.prototype.removeEvent=function(a,b,c){return null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]},a.prototype.innerHeight=function(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight},a}(),c=this.WeakMap||this.MozWeakMap||(c=function(){function a(){this.keys=[],this.values=[]}return a.prototype.get=function(a){var b,c,d,e,f;for(f=this.keys,b=d=0,e=f.length;e>d;b=++d)if(c=f[b],c===a)return this.values[b]},a.prototype.set=function(a,b){var c,d,e,f,g;for(g=this.keys,c=e=0,f=g.length;f>e;c=++e)if(d=g[c],d===a)return void(this.values[c]=b);return this.keys.push(a),this.values.push(b)},a}()),a=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(a=function(){function a(){"undefined"!=typeof console&&null!==console&&console.warn("MutationObserver is not supported by your browser."),"undefined"!=typeof console&&null!==console&&console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")}return a.notSupported=!0,a.prototype.observe=function(){},a}()),d=this.getComputedStyle||function(a,b){return this.getPropertyValue=function(b){var c;return"float"===b&&(b="styleFloat"),e.test(b)&&b.replace(e,function(a,b){return b.toUpperCase()}),(null!=(c=a.currentStyle)?c[b]:void 0)||null},this},e=/(\-([a-z]){1})/g,this.WOW=function(){function e(a){null==a&&(a={}),this.scrollCallback=f(this.scrollCallback,this),this.scrollHandler=f(this.scrollHandler,this),this.resetAnimation=f(this.resetAnimation,this),this.start=f(this.start,this),this.scrolled=!0,this.config=this.util().extend(a,this.defaults),null!=a.scrollContainer&&(this.config.scrollContainer=document.querySelector(a.scrollContainer)),this.animationNameCache=new c,this.wowEvent=this.util().createEvent(this.config.boxClass)}return e.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null,scrollContainer:null},e.prototype.init=function(){var a;return this.element=window.document.documentElement,"interactive"===(a=document.readyState)||"complete"===a?this.start():this.util().addEvent(document,"DOMContentLoaded",this.start),this.finished=[]},e.prototype.start=function(){var b,c,d,e;if(this.stopped=!1,this.boxes=function(){var a,c,d,e;for(d=this.element.querySelectorAll("."+this.config.boxClass),e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.all=function(){var a,c,d,e;for(d=this.boxes,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.boxes.length)if(this.disabled())this.resetStyle();else for(e=this.boxes,c=0,d=e.length;d>c;c++)b=e[c],this.applyStyle(b,!0);return this.disabled()||(this.util().addEvent(this.config.scrollContainer||window,"scroll",this.scrollHandler),this.util().addEvent(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live?new a(function(a){return function(b){var c,d,e,f,g;for(g=[],c=0,d=b.length;d>c;c++)f=b[c],g.push(function(){var a,b,c,d;for(c=f.addedNodes||[],d=[],a=0,b=c.length;b>a;a++)e=c[a],d.push(this.doSync(e));return d}.call(a));return g}}(this)).observe(document.body,{childList:!0,subtree:!0}):void 0},e.prototype.stop=function(){return this.stopped=!0,this.util().removeEvent(this.config.scrollContainer||window,"scroll",this.scrollHandler),this.util().removeEvent(window,"resize",this.scrollHandler),null!=this.interval?clearInterval(this.interval):void 0},e.prototype.sync=function(b){return a.notSupported?this.doSync(this.element):void 0},e.prototype.doSync=function(a){var b,c,d,e,f;if(null==a&&(a=this.element),1===a.nodeType){for(a=a.parentNode||a,e=a.querySelectorAll("."+this.config.boxClass),f=[],c=0,d=e.length;d>c;c++)b=e[c],g.call(this.all,b)<0?(this.boxes.push(b),this.all.push(b),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(b,!0),f.push(this.scrolled=!0)):f.push(void 0);return f}},e.prototype.show=function(a){return this.applyStyle(a),a.className=a.className+" "+this.config.animateClass,null!=this.config.callback&&this.config.callback(a),this.util().emitEvent(a,this.wowEvent),this.util().addEvent(a,"animationend",this.resetAnimation),this.util().addEvent(a,"oanimationend",this.resetAnimation),this.util().addEvent(a,"webkitAnimationEnd",this.resetAnimation),this.util().addEvent(a,"MSAnimationEnd",this.resetAnimation),a},e.prototype.applyStyle=function(a,b){var c,d,e;return d=a.getAttribute("data-wow-duration"),c=a.getAttribute("data-wow-delay"),e=a.getAttribute("data-wow-iteration"),this.animate(function(f){return function(){return f.customStyle(a,b,d,c,e)}}(this))},e.prototype.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),e.prototype.resetStyle=function(){var a,b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.style.visibility="visible");return e},e.prototype.resetAnimation=function(a){var b;return a.type.toLowerCase().indexOf("animationend")>=0?(b=a.target||a.srcElement,b.className=b.className.replace(this.config.animateClass,"").trim()):void 0},e.prototype.customStyle=function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a},e.prototype.vendors=["moz","webkit"],e.prototype.vendorSet=function(a,b){var c,d,e,f;d=[];for(c in b)e=b[c],a[""+c]=e,d.push(function(){var b,d,g,h;for(g=this.vendors,h=[],b=0,d=g.length;d>b;b++)f=g[b],h.push(a[""+f+c.charAt(0).toUpperCase()+c.substr(1)]=e);return h}.call(this));return d},e.prototype.vendorCSS=function(a,b){var c,e,f,g,h,i;for(h=d(a),g=h.getPropertyCSSValue(b),f=this.vendors,c=0,e=f.length;e>c;c++)i=f[c],g=g||h.getPropertyCSSValue("-"+i+"-"+b);return g},e.prototype.animationName=function(a){var b;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=d(a).getPropertyValue("animation-name")}return"none"===b?"":b},e.prototype.cacheAnimationName=function(a){return this.animationNameCache.set(a,this.animationName(a))},e.prototype.cachedAnimationName=function(a){return this.animationNameCache.get(a)},e.prototype.scrollHandler=function(){return this.scrolled=!0},e.prototype.scrollCallback=function(){var a;return!this.scrolled||(this.scrolled=!1,this.boxes=function(){var b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],a&&(this.isVisible(a)?this.show(a):e.push(a));return e}.call(this),this.boxes.length||this.config.live)?void 0:this.stop()},e.prototype.offsetTop=function(a){for(var b;void 0===a.offsetTop;)a=a.parentNode;for(b=a.offsetTop;a=a.offsetParent;)b+=a.offsetTop;return b},e.prototype.isVisible=function(a){var b,c,d,e,f;return c=a.getAttribute("data-wow-offset")||this.config.offset,f=this.config.scrollContainer&&this.config.scrollContainer.scrollTop||window.pageYOffset,e=f+Math.min(this.element.clientHeight,this.util().innerHeight())-c,d=this.offsetTop(a),b=d+a.clientHeight,e>=d&&b>=f},e.prototype.util=function(){return null!=this._util?this._util:this._util=new b},e.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},e}()}).call(this);

/****************************************************************************************/
/****************************************************************************************/
/****************************************************************************************/

$(document).ready(function() {
	setEventHollpee();

	if (!HlpDevice.isMobile()) {
		WOW = new WOW({
		    boxClass: 'wow',
		    animateClass: 'animated',
		    offset: 0
		});
		WOW.init();
	}
});

function setEventHollpee()
{ 
	// перед инициализацией слайдера
	HlpElementGalleryModal.init();
	
	// std
	HlpAnimate.init();
	HlpElementModal.setEvent();
	HlpElementForm.init();
	HlpElementNav.setEvent();
	HlpElementSection.setEvent();
	// widget
	HlpElementSlider.init();
	HlpElementTabs.init();
	HlpElementVideo.init();
	
	this.setEventHollpeeScroll();
	this.setHollpeeProperty();
};

function setHollpeeProperty()
{
	// flexbox
	if (typeof(CSS) != "undefined" && typeof(CSS.supports) != "undefined") {
		if (CSS.supports("display", "flex")) {
			$(".hlp-site").removeClass("hlp-no-flexbox");
		}
	}

	// убираем телефон
	if (!HlpDevice.isMobile()) {
		$("a[href^='tel:']").removeAttr("href");
	}
}

function setEventHollpeeScroll()
{
	var isMobile = HlpDevice.isMobile();
	$(document).off("scroll");
	$(document).on("scroll", function() {
		var scrollTop = $(this).scrollTop();

		if (!HlpDevice.isMobile()) {
			HlpElementSection.eventScroll(scrollTop);
			HlpElementNav.eventScroll(scrollTop);
		}
	});
}

/************************************************************************************************/
var HlpDevice = new HlpDevice();
function HlpDevice() {
	this.isMobile = function()
	{
		var userAgent = navigator.userAgent;
		if (userAgent.match(/Android/i)
				|| userAgent.match(/webOS/i)
				|| userAgent.match(/iPhone/i)
				|| userAgent.match(/iPad/i)
				|| userAgent.match(/iPod/i)
				|| userAgent.match(/BlackBerry/i)
				|| userAgent.match(/Windows Phone/i)) {
	    	return true;
		} else if ($("body").width() < 900) {
			return true;
		} else {
			return false;
		}
	};
}// end class

/************************************************************************************************/
/***********************************************************************************************/
// модальное окно
var HlpElementModal = new HlpElementModal();
function HlpElementModal() { 	

	this.attr = {};
	this.attr.but_form_name = "data-hlp-formname";

/********************************************************************************/

	/**
	* Ставит события
	*
	*
	*/
	this.setEvent = function()
	{
		var obj = this;
		var butModal = $("*[data-hlp-action='modal']");
		butModal.off("click"); 
		butModal.on("click", function() {
			var elmEvent = $(this);
			var modalNum = elmEvent.attr("data-hlp-value");
			var modalObj = obj.show(modalNum);

			// ставим значения для формы
			HlpElementForm.setPropertyDynamicInput(modalObj, elmEvent);
			// ставим имя формы
			obj.setFormName(elmEvent);

			return false;
		});
	};	

	this.setFormName = function(elm)
	{
		if (!elm) return false;

		var formName = elm.attr(this.getAttrButFormName());
		if (formName) formName = formName.trim();
		if (!formName) return false;
		
		var inputNameObj = this.getInputFormNameObj();
		if (!inputNameObj) return false;
		inputNameObj.val(formName);

	};

	this.getAttrButFormName = function()
	{
		return this.attr.but_form_name;
	};

	this.getInputFormNameObj = function()
	{
		var modalObj = this.getObj();
		var formObj = modalObj.find("form");
		if (!formObj.length) return false;
		var inputNameObj = formObj.find("input[name='hlp-form-name']");
		return inputNameObj.length ? inputNameObj : false;
	};

	this.getObj = function()
	{
		return $(".hlp-modal-section .hlp-modal");
	};

/***************************************************************************************/
	/**
	*
	*
	*/
	this.show = function(modalNum)
	{
		var modal = $(".listModalPage, .hlp-list-modal").find(".hlp-modal[data-hlp-num='"+modalNum+"']");
		if (!modal.length) return false;

		/**************************************/
		var modalObj = modal.parent();
		// прячем скролл
		this.hideScroll();
		//устанавливаем параметры для блока
		this.setEventClose();

		var listSectionVisible = $(".hlp-modal-section[data-hlp-visible]");
		var idShowing = listSectionVisible.length + 1;
		modalObj.attr("data-hlp-visible", idShowing);
		/**************************************/

		// само модальное
		// var modalClass = modal.attr("class");
		// var modalContent = modal.html();
		// var modalSection = '<div class="'+modalClass+'">'+modalContent+'</div>';

		// создаем модальное окно
		// var modalObj = HlpElementModal.create({"content":modalSection});
		
		// ставим события
		// setEventHollpee();
		// что бы загрузились изображения
		HlpLazyload.setSrc($(".hlp-modal-section"));

		return modalObj;
	};

/****************************************************************************************/
	/**
	* Создание блок модального окна
	*
	* @see 		ElementModal.create() 				при создании модального окна	
	*/
	this.create = function(params) 
	{
		this.params = params;
		//вставляем модальное окно на страницу
		// this.createBlock();
		// прячем скролл
		this.hideScroll();
		//устанавливаем параметры для блока
		this.setEventClose();

		return $(".hlp-modal-section:last");
	};

	
/***********************************************************************************************/
	/**
	* Вставляем модальный блок на страницу
	*
	* @see 		this.create()
	*/	
	this.createBlock = function()
	{
		//получаем блок
		var block = this.getBlock();
		//вставляем на страницу
		$(".hlp-site").eq(0).append(block);

		//текущие модальное окно
		var modalObj = $('.hlp-modal-section > .hlp-modal');
		this.curr_modal = modalObj;
	};

	/**
	* Отдать блок
	*
	* @see 		this.createBlock();
	*/
	this.getBlock = function()
	{
		//формируем блок
		var block = '	<div class="hlp-modal-section" id="'+this.params['id']+'">'
							+this.params['content']+
							'<div class="hlp-modal-blackout"></div>\
						</div>';

		block  = block.replace(/autoplay\-yes/gim, "autoplay");				
		return block;
	};
/********************************************************************************************/
	/**
	* Устанавливаем события 
	*
	* @see 		this.create()
	*/
	this.setEventClose = function()
	{
		var obj = this;
		var listObj = $(".hlp-modal-blackout, *[data-hlp-action='modal-close']");

		this.noClose = false;
		// удаление модального
		listObj.off("click");
		listObj.on("click", function() {
			obj.delete();
			return false;
		});

		var secObj = $(".hlp-modal-section");
		secObj.off("scroll");
		secObj.on("scroll", function() {
			$(".hlp-modal-blackout").css("top", $(this).scrollTop()+"px");
		});
	};
/**********************************************************************************************/
	/**
	* Удалить блок модального окна
	*
	* @see 	Modal.delete()
	*/
	this.delete = function()
	{

		// удаляем модальное
		// $('.hlp-modal-section:last').remove();
		var listVisible = $(".hlp-modal-section[data-hlp-visible]");
		var lastSectionId = 1;
		for (var iVisible = 0; iVisible < listVisible.length; iVisible++) {
			var visibleId = listVisible.eq(iVisible).attr("data-hlp-visible");
			if (visibleId > lastSectionId) lastSectionId = visibleId;
		}

		var currentModal = $(".hlp-modal-section[data-hlp-visible='"+lastSectionId+"']");
		currentModal.removeAttr("data-hlp-visible");

		/***********/
		currentModal.find(".hlp-video-content > iframe").each(function(){
			$(this).html("").attr("src", $(this).attr("src"));
		});

		if (!$('.hlp-modal-section[data-hlp-visible]').length) {
			// показываем модальное
			this.showScroll();
		}
	};


/***********************************************************************************************/
	/**
	* прячем прокутку
	*
	* @see 		this.create()
	*/
	this.hideScroll = function()
	{
		// ширина до
		var width = $("body").width();
		//прячем прокрутка
		$('body').css({'overflow':'hidden'});
		$(document).css({'overflow':'hidden'});
		var scrollWidth = $("body").width()-width; 

		//делаем отступ с права на ширину скролла
		$('body').css('padding-right', scrollWidth);		
	};

	/**
	* показываем прокутку
	*
	* @see 		this.delete()
	*/
	this.showScroll = function()
	{
		//показываем прокрутку
		$('body').removeAttr("style");
		$(document).removeAttr("style");
	};			
}//end class

/******************************************************************************************/
/******************************************************************************************/

// form
var HlpElementForm = new HlpElementForm();
function HlpElementForm() {
	/**
	* Список функций для проверок
	*
	*/
	this.listVarify = ["isFull", "isAllowedCharacters", "validation"];

	/**
	* Патерны для валидации
	*
	*/
	this.listPatterValid = {
		"name":"^[a-zа-я0-9_\-\`\"\'\!\?\.\,\ ]+$",	
		"email":"^[a-z0-9\-_\.]{1,50}@[a-z0-9\-_]{1,50}\.[a-z0-9\-_]{1,20}$",
		"phone":"[0-9]{3}-[0-9]{2}-[0-9]{2}$",
		"password":"^.{6,}$"
	};

	/**
	* Список ошибок
	*
	*/
	this.listError = {
		"isFull": {
			"text":"Поле не заполнено",
			"password":"Поле не заполнено",
			"file":"Файл не загружен"
		},
		"isAllowedCharacters": {
			"text":"Использованы запрещеные символы: -- ; /"
		},
		"validation": {
			"name" : "Поле содержит запрещенные символы",
			"email":"Email должен иметь форму user123@gmail.com",
			"phone":"Телефон введен не полностью",
			"password":"Пароль должен состоять минимум из 6 символов"
		},
		"exists": {
			"email":"Email уже существует, введите другой"
		},
		"isChecked": {
			"checkbox":"Поле не отмечено"
		},
	};
/***********************************************************************************************/
	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	};


	this.setProperty = function()
	{
		var listForm = $(".hlp-form");
		this.setPropertyCms(listForm);
		this.setPropertyInputFile(listForm);
	};

	this.setPropertyCms = function(listForm)
	{
		var pageId = typeof(HLP_PAGE_ID) != "undefined" ? HLP_PAGE_ID : false;
		if (pageId) {
			listForm.find('input[name="hlp-page-id"]').remove();
			var inputPageId = '<input type="hidden" name="hlp-page-id" value="'+pageId+'" />';
			listForm.prepend(inputPageId);
		}
		var variantId = typeof(HLP_VARIANT_ID) != "undefined" ? HLP_VARIANT_ID : false;
		if (variantId) {
			listForm.find('input[name="hlp-variant-id"]').remove();
			var inputVariantId = '<input type="hidden" name="hlp-variant-id" value="'+variantId+'" />';
			listForm.prepend(inputVariantId);
		}

		listForm.find('input[name="hlp-ttl"]').remove();
		var ttl = this.getQueryGet("hlp-ttl");
		if (ttl) {
			var inputUtm = '<input type="hidden" name="hlp-ttl" value="'+ttl+'" />';
			listForm.prepend(inputUtm);
		}
		
		// action - spam
		var listFormNoAction = $(".hlp-form").filter(function() {
			return !$(this).attr("action");
		});
		setTimeout(function() {
			listFormNoAction.attr("action", "admin/form");
		}, 1000);

		// utm
		this.setPropertyCmsUtm(listForm);
	}

	this.setPropertyCmsUtm = function(listForm)
	{
		var listUtmProperty = ["ch", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
		for (var utmIndex in listUtmProperty) {
			var utmProperty = listUtmProperty[utmIndex];
			
			listForm.find('input[name="'+utmProperty+'"]').remove();
			var utmValue = this.getQueryGet(utmProperty);
			if (utmValue) {
				var inputUtmMedium = '<input type="hidden" name="'+utmProperty+'" value="'+utmValue+'" />';
				listForm.append(inputUtmMedium);
			}
		}
	}

	this.getQueryGet = function(name)
	{
		if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
			var value = name[1];
			return value ? encodeURIComponent(value) : '';
		}
	};

	this.setPropertyInputFile = function(listForm)
	{
		listForm.each(function() {
			var formObj = $(this);
			var butUploadFile = formObj.find(".hlp-upload-file");
			var indexFile = 1;

			if (butUploadFile.length) {
				butUploadFile.each(function() {
					var attrEmpty = $(this).parent().attr("data-hlp-empty") ? 'data-hlp-empty="true"' : '';
					fileName = "hlp-file-"+indexFile;
					var inputFile = '<input type="file" name="'+fileName+'" '+attrEmpty+' style="display:none;">';
					$(this).after(inputFile);

					indexFile++;
				});

				var inputFileObj = formObj.find("input[type='file']");
				inputFileObj.css("display", "none");

				formObj.attr("enctype", "multipart/form-data");
			}
		});

		$(".hlp-upload-file").on("click", function() {
			$(this).closest(".hlp-upload-file-wrap").find("input[type='file']").click();
		});

		/****************************/
		var fileInput = $(".hlp-form input[type='file']");
		fileInput.off("change");
		fileInput.on("change", function() {
			var fileName = $(this)[0].files[0].name;
			$(this).closest(".hlp-upload-file-wrap").find(".hlp-upload-file-name").text(fileName);
		});
	}

/***********************************************************************************************/
	/**
	* Динамический input
	*
	* @see 	HlpElementModal.setEvent()
	* @see 	this.setEventSend()
	*/
	this.setPropertyDynamicInput = function(modalObj, elmAction)
	{
		// находим общего родителя
		var parentObj = this.getJointParentDynamicElm(elmAction);
		if (!parentObj) return false;

		// устанавливаем значение в поля
		this.setValueDynamicElm(parentObj, modalObj);
	}

	/**
	* Отдает общего родителя
	*
	* @see 	this.setPropertyModalDynamicInput()
	*/
	this.getJointParentDynamicElm = function(elm)
	{
		var attrDynamicInputId = this.getAttrDynamicInputId();
		var attrDynamicButtonId = this.getAttrDynamicButtonId();

		var parentObj = false;
		var curParentObj = elm;
		for (var iElm = 0; iElm < 100; iElm++) {
			curParentObj = curParentObj.parent();
			var childButton = curParentObj.find("["+attrDynamicButtonId+"]");
			if (childButton.length) {
				parentObj = curParentObj;
				break;
			}

			// до предела
			if (curParentObj.hasClass("hlp-section") 
					|| curParentObj.hasClass("hlp-modal")) break;		
		}

		return parentObj;
	}

	/**
	* Устанавливает значения
	*
	* @see 	this.setPropertyModalDynamicInput()
	*/
	this.setValueDynamicElm = function(parentObj, modalObj)
	{
		var attrDynamicInputId = this.getAttrDynamicInputId();
		var attrDynamicButtonId = this.getAttrDynamicButtonId();
		var attrDynamicButtonValue = this.getAttrDynamicButtonValue();

		// список динамических полей
		var listDynamicInput = modalObj.find("["+attrDynamicInputId+"]");
		// списко кнопок
		var listButton = parentObj.find("["+attrDynamicButtonId+"]");
		
		// установка значений
		var countInput = listDynamicInput.length
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputObj = listDynamicInput.eq(iInput);
			// получаем id
			var id = inputObj.attr(attrDynamicInputId);
			// button с этим id input	
			var listButtonInput = listButton.filter("["+attrDynamicButtonId+"='"+id+"']");
			if (!listButtonInput.length) continue;
			// получаем значение
			var buttonSelected = listButtonInput.filter("[data-hlp-chosen='true']");
			/********************************************/
			// когда только один элемент в родителе
			if (!buttonSelected.length && listButtonInput.length == 1) {
				buttonSelected = listButtonInput;
			}
			/********************************************/

			var valueSeleted = buttonSelected.attr(attrDynamicButtonValue);

			
			inputObj.val(valueSeleted);
		}
	}

	this.getAttrDynamicInputId = function()
	{
		return "data-hlp-dynamic-input-id";
	}

	this.getAttrDynamicButtonId = function()
	{
		return "data-hlp-dynamic-button-id";	
	}

	this.getAttrDynamicButtonValue = function()
	{
		return "data-hlp-dynamic-button-value";
	}

/***********************************************************************************************/
/***********************************************************************************************/
	/**
	* Ставим события
	*
	* 
	*/
	this.setEvent = function()
	{
		// проверка введенных данных
		this.setEventSend();
		// поле телефон
		this.setEventPhone();
		// $(".hlp-form input[data-hlp-mask='phone']").mask("+7(999) 999-99-99"); 
	};

	/**
	* Проверка
	*
	* @see 	this.setEvent()
	*/
	this.setEventSend = function()
	{
		var obj = this;
		var submit = $(".hlp-form").find("input[type='submit']");
		submit.off("click");
		submit.on("click", function() {
			var elmEvent = $(this);
			// динамическое поле
			obj.setPropertyDynamicInput(elmEvent.closest("form"), elmEvent);

			// проверяем на валидность
			var formObj = elmEvent.closest(".hlp-form");
			var isVerify = HlpElementForm.verify(formObj);
			if (!isVerify) return false;

			var inputRedidirect = formObj.find(">input[name='hlp-redirect']");
			var isRedirectModal = inputRedidirect.attr("data-hlp-redirect-type") == "modal";

			
			if (typeof HLP_ZLS12 !== 'undefined') {
				formObj.prepend('<input type="hidden" name="zls12" value="'+HLP_ZLS12+'" />');
			}

			// перенаправление
			if (isRedirectModal) {
				var modalId = inputRedidirect.val();
				var modalObj = HlpElementModal.show(modalId);

				// для формы, когда перенаправление на модальное 
				var iframeFormId = "hlp_iframe_form_empty";	
				$("#"+iframeFormId).remove();	
				$("body").append('<iframe name="'+iframeFormId+'" src="" id="'+iframeFormId+'" style="display:none"></iframe>');
				formObj.attr("target", iframeFormId);

				// очищаем когда пришел ответ
				var frameObj = $("#"+iframeFormId);
				frameObj.off("load");
				frameObj.on("load", function() {
					formObj.find("input[type='text']").val('');
					frameObj.off("load");
				});
			}
		});
	};


/******************************************************************************************/

	/**
	* Поле телефон
	*
	* @see 	this.setEvent()
	*/
	this.setEventPhone = function()
	{
		// на мобильном не поддерживает
		if (HlpDevice.isMobile()) {
			return false;
		}

		this.phoneMask = "+7 (___) ___-__-__";

		var listInputPhone = $("form input[data-hlp-mask='phone']");

		this.setEventPhoneKey(listInputPhone);
		this.setEventPhoneFocus(listInputPhone);
	};

	/**
	* Устанавливает событие на нажатие кнопки
	*
	* @see 	this.setEventPhone()
	*/
	this.setEventPhoneKey = function(listInputPhone)
	{
		var obj = this;
		listInputPhone.off("keydown");
		listInputPhone.on("keydown", function(event) {
			var inputPhone = $(this);
			var keyCode = event.keyCode;
			// вводить нельзя символы
			if (obj.isProhibitedPhoneCharacter(keyCode)) return false;

			var phoneValue = $(this).val();
			// устанавливаем маску
			var lastPosition = obj.setPhoneMask(inputPhone, phoneValue, keyCode);

			// если последний символ
			if (!lastPosition && keyCode != 116) return false;
			// устанавливаем символ
		 	obj.setCaretToPos($(this)[0], lastPosition);
		 	// если символ удаление
		 	if (obj.isKeyCodeDelete(keyCode)) return false;
		});
	};


	/**
	* Фокус
	*
	* @see 	this.setEventPhone()
	*/
	this.setEventPhoneFocus = function(listInputPhone)
	{
		var obj = this;
		listInputPhone.off("focus");
		listInputPhone.on("focus", function() {
			var elmEvent = $(this);
			var phoneValue = elmEvent.val();
			if (phoneValue) return true;
			elmEvent.val(obj.phoneMask);
		});

		listInputPhone.off("focusout");
		listInputPhone.on("focusout", function() {
			var inputObj = $(this);
			var phoneOnlyNum = obj.getPhoneOnlyNum(inputObj.val());
			if(!phoneOnlyNum) inputObj.val('');
		});
	};

	/**
	* Устанавливает маски
	*
	* @see 	this.setEventPhone()
	*/
	this.setPhoneMask = function(inputPhone, phoneValue, keyCode)
	{
		phoneValue = this.getPhoneOnlyNum(phoneValue);
		
		var countMaskNum = this.phoneMask.length;
		var newValue = '';
		var lastPosition = 0;

		// при удаление убираем символ
		if (this.isKeyCodeDelete(keyCode)) phoneValue = phoneValue.slice(0, -1);

		for (var iWMask = 0, iWPhone = 0; iWMask < countMaskNum; iWMask++) {
			var curW = this.phoneMask[iWMask];
			
			if (curW == "_") {
				var curNum = phoneValue[iWPhone];
				if (curNum) curW = curNum;
				
				if (!curNum && !lastPosition) {
					lastPosition = iWMask;
					if (!this.isKeyCodeDelete(keyCode)) curW = '';
				}

				iWPhone++;
			}
			newValue += curW;
		}
		inputPhone.val(newValue);

		return lastPosition;
	};

	/**
	* Отдает только цифры номера
	*
	* @see 	this.setPhoneMask()
	* @see 	this.setEventPhoneFocus()
	*/
	this.getPhoneOnlyNum = function(phoneValue)
	{
		phoneValue = phoneValue.replace(/^\+[0-9]+\s*\(/i, '');
		phoneValue = phoneValue.replace(/[^0-9]+/g, '');

		return phoneValue;
	};

	/**
	* Устанавливает позицию курсора
	*
	* @see 	this.setEventPhone()
	*/
	this.setCaretToPos = function(input, pos) {
		if (input.setSelectionRange) {
	    	input.focus();
			input.setSelectionRange(pos, pos);
		} else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveStart('character', pos);
			range.moveEnd('character', pos);
			range.select();
	 	}
	};

	/**
	* Запрещеный символ для телефона
	*
	* @see 	this.setEventPhone()
	*/
	this.isProhibitedPhoneCharacter = function(keyCode)
	{
		if ((keyCode >= 65 && keyCode <= 90)
				|| keyCode == 106 || keyCode == 109
				|| keyCode == 107 || keyCode == 111
				|| keyCode == 186 || keyCode == 187
				|| keyCode == 188 || keyCode == 189
				|| keyCode == 190 || keyCode == 191
				|| keyCode == 219 || keyCode == 220 
				|| keyCode == 221 || keyCode == 222) {
				return true;
		} else {
			return false;
		}
	};

	/**
	* Код удаления
	*
	* @see 	this.setEventPhone()
	*/
	this.isKeyCodeDelete = function(keyCode)
	{
		return keyCode == 8;
	};
/********************************************************************************************/	
	this.verify = function(elmForm) 
	{
		this.clearError();

		var listInput = elmForm.find("input[type='text'], input[type='password'], input[type='checkbox'], input[type='radio'], input[type='file'], input[type='email'], textarea");
		listInput.removeAttr("style");
		var listStatus = {};
		this.varifyStatus = true;

		// проходим все input
		var inputCount = listInput.length;
		for (var i = 0; i < inputCount; i++) {
			var input = listInput.eq(i);
			var inputType = input.attr("type");

			if (inputType == "checkbox") this.verifyInputCheckbox(input);  
			else this.verifyInputText(input);	
		}

		return this.varifyStatus;
	};


	this.verifyInputText = function(input)
	{
		var value = input.val();
		//проверяем элемент 
		for (var indexFunc in this.listVarify) {
			var varifyFunc =  this.listVarify[indexFunc];
			var statusVarify = this[varifyFunc](input, value);
			// ошибка
			if (!statusVarify) {	
				this.showError(input, varifyFunc);
				this.varifyStatus = false;
				break;
			}
		}
	};


	this.verifyInputCheckbox = function(input)
	{
		var isChecked = input.prop("checked");
		if (!isChecked && input.attr("data-hlp-empty") != "true") {
			this.varifyStatus = false;
			this.showError(input, "isChecked");
		}
	};
/*********************************************************************************************/
	/**
	* Проверка на заполненость
	*
	* @see 	this.varify()
	*/
	this.isFull = function(input, value)
	{
		if (value || input.attr("data-hlp-empty") == "true") {
			return true;
		}  else {
			return false;
		}
	};
/*******************************************************************************************/
	/**
	* Проверка на запрещеные символы
	*
	*
	*/
	this.isAllowedCharacters = function(input, value)
	{
		var res = value.match(/[;\/]+|[-]{2}/gim);
		if (!res) return true;
		else return false;
	};

/********************************************************************************************/
	/**
	* Проверка на валидацию
	*
	* @see 	this.varify()
	*/	
	this.validation = function(input, value) 
	{
		if (input.attr("data-hlp-empty") == "true") return true;

		var inputMask = input.attr("data-hlp-mask");
		if (!inputMask) inputMask = input.attr("data-hlp-mask");
		this.inputName = inputMask;

		if (this.listPatterValid[inputMask]) {
			return this.verifyInput(value, inputMask, this.listPatterValid);
		} else {
			return true; 
		}
	};
/***********************************************************************************************/
	this.verifyInput = function(value, inputMask, listPattern)
	{
		// на мобильном не поддерживает
		if (HlpDevice.isMobile() && inputMask == "phone") return true;

		var patternString = listPattern[inputMask];
		var pattern = new RegExp(patternString, "gim");
		var res = value.match(pattern);

		if (res) {
			return true;
		} else {
			return false;
		}
	};


/***ошибки*********************************************************************************************/
	/**
	* Убираем все ошибки
	*
	*/
	this.clearError = function() {
		$(".hlp-error-label").remove();
	};

	/**
	* Выводим ошибку
	*
	*
	*/
	this.showError = function(input, errorType) {
		
		if (errorType == "isFull") {
			if (input.attr("type") == "file") {
				var name = "file"
			} else {
				var name = "text";
			}
		} else if ( errorType == "isChecked"
				|| errorType == "isAllowedCharacters") {
			var name = input.attr("type");
		} else {
			var name = this.inputName;
		}
		
		var errorString = this.listError[errorType][name];
		this.setError(input, errorString);
	};


	/**
	* Ставит заголовок ошибок
	*
	*/
	this.setError = function(input, errorString)
	{
		var errorBlock = this.getErrorBlock(errorString);
		
		// вставляем значение
		if (input.attr("type") == "file") {
			input.closest(".hlp-upload-file-wrap").after(errorBlock);
		} else {
			input.after(errorBlock);
		}
		this.setStyleError(input);
	};

	/**
	* Отдает html блок ошибки
	*
	*
	*/
	this.getErrorBlock = function(errorString)
	{
		return '<div class="hlp-error-label">'+errorString+'</div>';
	};

	/**	
	* Установить стиль ошибкам
	*
	* 
	*/
	this.setStyleError = function(input) {
		input.addClass("hlp-error-input");
	};
/*************************************************************************************************/
	/**
	*  список ошибок
	*
	*/
	this.listErrorByGET = {
		"error_email_password":"showErrorsEmailPassword",
		"error_email_exist":"showErrorEmailExists"	
	};

	/**
	* Показываем ошибки по запросу GET
	*
	*
	*/
	this.showErrorsByGET = function(emlForm, GET)
	{
		// для фиксации стилей
		this.clearError();

		for (var errorName in GET) {
			var nameFunction = this.listErrorByGET[errorName];
			if (this[nameFunction]) {
				this[nameFunction](emlForm);
			}
		}
	};

	/**
	* Неправильный email или пароль 
	*
	*
	*/
	this.showErrorsEmailPassword = function(elmForm) {
		// вставляем ошибку
		var errorString = "Не правильный email или пароль";
		var block = this.getErrorBlock(errorString);
		elmForm.prepend(block);

		// ставим стили
		var listInput = elmForm.find("input[name='email'], input[name='password']");
		this.setStyleError(listInput);
	};

	/**
	* Email существует
	*
	*
	*/
	this.showErrorEmailExists = function(elmForm){
		var input = elmForm.find("input[name='email']");
		this.showError(input, "exists");
	};
/***********************************************************************************************/
}//end class


/********************************************************************************************/
/*********************************************************************************************/

var HlpElementNav = new HlpElementNav();
function HlpElementNav() {
	this.setEvent = function()
	{	
		this.setProperty();

		// устанавливает текукщию
		this.setCurrentItem();
		// события для мобильной панели
		this.setEventMobile();
		// навигация по секциям
		this.setEventSection();
	};

	this.setProperty = function()
	{
		this.listNavItem = $(".hlp-section .hlp-nav:eq(0) .hlp-nav-item");
		this.setPropertyScroll();
	}

	/**
	* Устанавливает текущию вкладку
	*
	* @see 	this.setEvent()
	*/
	this.setCurrentItem = function()
	{
		var pathName = location.pathname.match(/[^\/]+(\.[\w]+)?$/);
		if (!pathName || pathName == "index.php") pathName = "index.php";
		else pathName = pathName[0];
		
		var attrChosen = "data-hlp-chosen";

		$(".hlp-nav-item").removeAttr(attrChosen);
		$(".hlp-nav-item[href='"+pathName+"']").attr(attrChosen, "true");
		
		// просмотр в редакторе
		if (document.location.href) {
			var pageId = document.location.href.match(/page_id=[0-9]+/gim);
			if (pageId) pageId = pageId[0].replace(/[^0-9]+/gim, '');
			if (pageId) {
				$(".hlp-nav-item[data-hlp-action-page]").removeAttr(attrChosen);
				$(".hlp-nav-item[data-hlp-action-page='"+pageId+"']").attr(attrChosen, "true");
			}
		}
	};

/********************************************************************************************/
	/**
	* Мобильное меню
	*
	* @see 	this.setEvent()
	*/
	this.setEventMobile = function()
	{
		var obj = this;

		var butObj = $(".hlp-nav-button-mobile, *[data-hlp-action='nav-mobile']");

		butObj.off("click");
		butObj.on("click", function() {
			var bodyHeight = $(window).height();
			$(".hlp-nav-panel-mobile").css({"display":"block", "height":bodyHeight+"px"});

			obj.showBlackout();
			obj.setListMenuItem();
			obj.setEventSection();
			obj.setEventMobileItemChosen();

			setEventHollpee();

			return false;
		});
	};

	this.setListMenuItem = function()
	{
		$(".hlp-nav-item-mobile").remove();

		var listNavItem = $(".hlp-section .hlp-nav:eq(0) .hlp-nav-item");
		var countItem = listNavItem.length;
		var listItemStr = '';

		var parentObjV = $(".hlp-nav:eq(0)");
		listItemStr = this.getListNavItem(parentObjV);

		$(".hlp-nav-mobile").html(listItemStr);
	};
	
	this.getListNavItem = function(parentObjV, menuLevel)
	{
		var listNavItem = parentObjV.find("> .hlp-nav-item");

		var listItemBlock = '';
		var isFloatRight = listNavItem.css("float") == "right";
		var countItem = listNavItem.length;
		for (var i = 0; i < countItem; i++) {
			var navItem = listNavItem.eq(i);
			var navItemHtml = this.getNavItemBlock(navItem);

			if (isFloatRight) listItemBlock = navItemHtml + listItemBlock
			else listItemBlock += navItemHtml;
		}

		return listItemBlock;
	};
	
	this.getNavItemBlock = function(navItem)
	{
		var tagName = navItem.prop("tagName");
		var hrefValue = navItem.attr("href");
		var dataAction = navItem.attr("data-hlp-action");
		var dataValue = navItem.attr("data-hlp-value");

		var listAttr = 'href="'+hrefValue+'" ';
		if (dataAction) listAttr += 'data-hlp-action="'+dataAction+'" ';
		if (dataValue) listAttr += 'data-hlp-value="'+dataValue+'"';

		var blockItem = '<a class="hlp-nav-item-mobile" '+listAttr+'>'
						+navItem.text()
						+'</a>';

		return blockItem;
	};


	this.showBlackout = function()
	{
		$(".hlp-nav-panel-mobile").before('<div class="hlp-blackout-panel"></div>');
		this.setEventBlackout();
		HlpElementModal.hideScroll();
	};

	this.setEventBlackout = function()
	{
		var obj = this;
		var elmClose = $(".hlp-blackout-panel, *[data-hlp-action='menu-close']");
		elmClose.off("click");
		elmClose.on("click", function() {
			obj.closePanel();
			return false;
		});
	};

	/**
	* Закрывает мобильную панель
	*
	*
	*/
	this.closePanel = function()
	{
		$(".hlp-blackout-panel").remove();
		$(".hlp-nav-panel-mobile").css("display", "none");
		HlpElementModal.showScroll();
	};

	/**
	* Отмечет элемент меню
	*
	* @see 	HlpElementSection
	*/
	this.markItem = function(elm)
	{
		elm.closest(".hlp-nav").find(".hlp-nav-item").removeAttr("data-hlp-chosen");
		elm.attr("data-hlp-chosen", "true");
	};

/*********************************************************************************/

	/**
	* Навигация по секциям
	*
	* @see 	this.setEvent()
	* @see 	this.setEventMobile()
	*/
	this.setEventSection = function()
	{
		var obj = this;
		var listButActionSection = $("*[data-hlp-action='section']");
		
		// отмечаем первый пункт
		// 
		var listNav = listButActionSection.closest(".hlp-nav");
		var firstNavItem = listNav.not(".hlp-children-float-right").find("> ul > li:first .hlp-nav-item");
		var lastNavItem = listNav.filter(".hlp-children-float-right").find("> ul > li:last .hlp-nav-item"); 
		HlpElementNav.markItem(firstNavItem);
		HlpElementNav.markItem(lastNavItem);

		// ставим событие 
		listButActionSection.off("click");
		listButActionSection.on("click", function() {
			var elmEvent = $(this);
			var sectionId = elmEvent.attr("data-hlp-value");
			var sectionObj = $(".hlp-section[data-hlp-num='"+sectionId+"']");
			var sectionFixedObj = $(".hlp-section[data-hlp-value='section-fixed']");

			elmEvent.closest(".hlp-nav").find(".hlp-nav-item").removeAttr("data-hlp-chosen");
			elmEvent.attr("data-hlp-chosen", "true");

			// значение расположения секции
			if (sectionFixedObj.length && !HlpDevice.isMobile()) {
				var sectionFixedHeigh = sectionFixedObj.height();
			} else {
				var sectionFixedHeigh = 0;
			}

			var offsetTop = 50 + sectionFixedHeigh;
			var sectionTop = sectionObj.offset().top - offsetTop;
			// устанавливаем  scroll
			obj.setScrollTop(sectionTop);

			// отмечаем меню
			HlpElementNav.markItem($(this));
			// закрываем мобильное меню если есть
			HlpElementNav.closePanel();
			
			return false;
		});
	};

	this.setScrollTop = function(sectionTop)
	{
		var elmBody = $(document);
		var elmDoc = $(document);
		var isWrapDoc = elmBody.height() < elmDoc.height();
		var elmWrap = isWrapDoc ? elmDoc : elmBody;

		var maxTop = $(".hlp-site").height();

		var obj = this;
		var top = elmWrap.scrollTop();
		var isBottom = sectionTop > top; 

		this.objScrollTopInterval = setInterval(function() {
			if (isBottom) top += 40;
			else top -= 40;
			elmWrap.scrollTop(top);

			if ( (isBottom && top > sectionTop)
					|| (!isBottom && top < sectionTop)
					|| top < 0
					|| top > maxTop ) {
				clearInterval(obj.objScrollTopInterval);
			}
		}, 10);

	};

	/**
	* Мобилное меню - выбор пункта
	*
	* @see 	this.setEventMobile()
	*/
	this.setEventMobileItemChosen = function()
	{
		var listNavItemLevel = $(".hlp-nav-item-mobile");
		listNavItemLevel.off("click");
		listNavItemLevel.on("click", function() {
			var elmEvent = $(this);

			var elmBrotherObj = elmEvent.closest("ul").find("li");
			var attrOpen = "data-hlp-nav-open-level-mobile";
			elmBrotherObj.removeAttr(attrOpen);
			$(this).parent().attr(attrOpen, "true");
			$(this).closest(".hlp-nav-li-level1").attr(attrOpen, "true");
			
			elmBrotherObj.find(" .hlp-nav-item-mobile").removeAttr("data-hlp-chosen");
			elmEvent.attr("data-hlp-chosen", true);

			// если еть подменю
			if (elmEvent.parent().find("> .hlp-nav-mobile-level").length) {
				return false;
			} 
		});
	};
	
/*********************************************************************************/
	
	this.eventScroll = function(scrollTop)
	{	
		var listNavItem = this.listNavItem;
		if (listNavItem && !listNavItem.length) return false;
		var obj = this;

		this.countStep++;
		if (this.countStep % 5) return false;
		
		for (var iSection in obj.listSectionProperty) {
			var sectionProp = obj.listSectionProperty[iSection];
			var sectionTop = sectionProp["top"];
			var sectionBottom = sectionProp["bottom"];
			var secObj = sectionProp["obj"];

			secObj.removeAttr("data-hlp-chosen");

			if (scrollTop > sectionTop && scrollTop < sectionBottom) {
				this.listNavItem.removeAttr("data-hlp-chosen");
				secObj.attr("data-hlp-chosen", "true");

				break;
			}
		}
	}

	/**
	*
	*
	* @see 	this.setEventScroll()
	*/
	this.setPropertyScroll = function()
	{
		var listNavItem = $("*[data-hlp-action='section']");

		var listSection = $(".hlp-section[data-hlp-num]");
		var countSection = listSection.length;
		if (!countSection) return false;

		var sectionFixedObj = HlpElementSection.getFixedObj();;
		var secFixedHeight = sectionFixedObj.length ? sectionFixedObj.height() : 0;
		var listSectionProperty = {};
		
		for (var iSection = 0; iSection < countSection; iSection++) {
			var sectionObj = listSection.eq(iSection);
			var sectionNum = sectionObj.attr("data-hlp-num");
			var navItemObj = listNavItem.filter("[data-hlp-value='"+sectionNum+"']");
			var sectionTop = sectionObj.offset().top - 70 - (secFixedHeight * 2);
			var sectionBottom = sectionTop + sectionObj.height();
			
			listSectionProperty[iSection] = {
				"obj" : navItemObj,
				"top" : sectionTop,
				"bottom": sectionBottom
			}
		}

		this.listSectionProperty = listSectionProperty;

		this.listNavItem = listNavItem;
		this.countStep = 0;
	};

}//end class

/*******************************************************************************************/
/*******************************************************************************************/
// section
var HlpElementSection = new HlpElementSection();
function HlpElementSection() {
	this.scrollTop = 0;
	this.initStatus = false;

	this.isInit = function()
	{
		return this.initStatus;
	}

	this.setInitStatusYes = function()
	{
		this.initStatus = true;
	}

	/**
	* События для секции
	*
	*/
	this.setEvent = function()
	{
		if (this.isInit()) return false;
		this.setInitStatusYes();

		this.setEventFixed();

		// для мобильного
		if (HlpDevice.isMobile() 
				&& this.sectionFixedObj
				&& this.sectionFixedObj.length) {
			var noAnimate = true;
			this.setFixedYes(this.sectionFixedObj, noAnimate);
		}
	};

	this.setEventFixed = function()
	{
		this.scrollTop = 0;
		var sectionFixedObj = this.getFixedObj();

		if (!sectionFixedObj.length) return false;

		var navBottom = sectionFixedObj.offset().top + sectionFixedObj.height();
		var isMobile = HlpDevice.isMobile();
		var obj = this;

		this.sectionFixedObj = sectionFixedObj;
		this.navBottom = navBottom;
		this.isMobile = isMobile;
	};

	this.eventScroll = function(scrollTop)
	{
		if (!this.sectionFixedObj || !this.sectionFixedObj.length) return false;

		this.setFixed(this.sectionFixedObj, this.navBottom, this.isMobile);
	}

	this.setStatusFixed = function(sectionFixedObj, status)
	{
		
	};

	this.setFixed = function(sectionFixedObj, navBottom, isMobile)
	{
		var scrollTop = $(document).scrollTop();
		var isMoveBottom = this.scrollTop < scrollTop ? true : false;
		var sectionHeight = sectionFixedObj.height();

		if (isMoveBottom && isMobile) {
			this.setFixedNo(sectionFixedObj);
		} else if (navBottom <= scrollTop - 10) {
			if (!this.isFixed(sectionFixedObj)) {
				this.setFixedYes(sectionFixedObj);
			}
		} else if (navBottom >= scrollTop + sectionHeight) {
			if (this.isFixed(sectionFixedObj)) {
				this.setFixedNo(sectionFixedObj);
			}
		} else if (scrollTop < 1) {
			this.setFixedNo(sectionFixedObj);
		}

		this.scrollTop = scrollTop;
	};

	this.setFixedNo = function(sectionFixedObj)
	{
		sectionFixedObj.removeClass("hlp-section-fixed")
						.removeAttr("style");
		$(".hlp-site").removeAttr("style");
	};

	this.setFixedYes = function(sectionFixedObj, noAnimate)
	{
		var sectionHeight = sectionFixedObj.height();
		if (sectionFixedObj.css("position") == "static"
					|| sectionFixedObj.css("position") == "relative") {
			$(".hlp-site").css("padding-top", sectionHeight+"px");
		}

		var offsetHeight = "-" + sectionHeight + "px";
		sectionFixedObj.addClass("hlp-section-fixed");
		if (noAnimate) {
			sectionFixedObj.css("top", '0px');
		} else {
			sectionFixedObj.css("top", offsetHeight).animate({"top" : 0}, 500);
		}
	};

	this.isFixed = function(sectionFixedObj)
	{
		return sectionFixedObj.hasClass("hlp-section-fixed");
	};

/**********************************************************************************/
	
	/**
	* Отдает фиксированую секцию
	* 
	* @see 	this.setEventFixed()
	* @see 	HlpElementNav.setEventScroll()
	*/
	this.getFixedObj = function()
	{
		return $(".hlp-section[data-hlp-value='section-fixed']");
	};


}// end class


/*******************************************************************************************/
/*******************************************************************************************/

// анимация
var HlpAnimate = new HlpAnimate();
function HlpAnimate() {
	this.isInit = false;

	this.init = function()
	{
		if (this.isInit) return false;
		this.isInit = true;

		this.setProperty();
		this.setLoad();
	};

	this.setProperty = function()
	{
		// load
		this.listElmLoad = $("*[data-hlp-animated-load]");
		this.listElmLoad.addClass("animated");

		// scroll
		$("*[data-hlp-animated-scroll]").filter(function() {
			$(this).addClass($(this).attr("data-hlp-animated-scroll"))
					.addClass("wow");
		});
	};

	this.setLoad = function()
	{
		var countElmLoad = this.listElmLoad.length;
		for (var iLoad = 0; iLoad < countElmLoad; iLoad++) {
			var elmLoad = this.listElmLoad.eq(iLoad);
			var classAnmLoad = elmLoad.attr("data-hlp-animated-load");
			elmLoad.removeClass("hlp-hide").addClass(classAnmLoad);
		}
		
	};

	this.setSlide = function(parentObj, parentActiveObj)
	{
		if (!parentObj) return false;

		var listElm = parentObj.find("*[data-hlp-animated-load]");
		var countElmLoad = listElm.length;
		for (var iLoad = 0; iLoad < countElmLoad; iLoad++) {
			var elmLoad = listElm.eq(iLoad);
			elmLoad.removeClass(elmLoad.attr("data-hlp-animated-load"))
					.addClass("hlp-hide");
		}

		listElm = parentActiveObj.find("*[data-hlp-animated-load]");
		var countElmLoad = listElm.length;
		for (var iLoad = 0; iLoad < countElmLoad; iLoad++) {
			var elmLoad = listElm.eq(iLoad);
			elmLoad.removeClass("hlp-hide").addClass(elmLoad.attr("data-hlp-animated-load"));
		}
	};

} // end class


/*******************************************************************************************/
/*******************************************************************************************/
// slider
var HlpElementSlider = new HlpElementSlider();
function HlpElementSlider() {

	this.selector = {};
	this.selector.action_but_nav = "*[data-hlp-action='slider']";
	this.selector.slider = ".hlp-slider";
	this.defaultDelay = 5000;
	this.listAutoplay = {};

	this.getSelectorActionButNav = function()
	{
		return this.selector.action_but_nav;
	};

	this.getSelectorSlider = function()
	{
		return this.selector.slider;
	};

	this.getSelectorButNav = function(type)
	{
		return ".flex-" + type;
	};

/*******************************************************************************/

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	};

	this.setProperty = function()
	{
		var listSlider = $(".hlp-slider");
		for (var iSlider = 0; iSlider < listSlider.length; iSlider++) {
			var sliderObj = listSlider.eq(iSlider);
			sliderObj.attr("data-hlp-index", iSlider);

			// отмечаем первый
			sliderObj.find(".hlp-slider-list-item .hlp-slider-item")
						.removeAttr("data-hlp-chosen")
						.eq(0)
						.attr("data-hlp-chosen", "true");

			// добавляем bullet
			var countSliderItems = sliderObj.find(".hlp-slider-list-item .hlp-slider-item").length;
			var listBullet = '';
			for (var iItem = 1; iItem <= countSliderItems; iItem++) {
				var classBulletActive = iItem == 1 ? " flex-active" : "";
				listBullet += '<div class="hlp-slider-bullet'+classBulletActive+'" data-hlp-index="'+iItem+'"></div>';
			}
			sliderObj.find(".hlp-slider-list-bullets").html(listBullet);
			
			// ставим autoplay
			this.setAutoplay(sliderObj);
		}
	}

	this.setEvent = function()
	{
		var obj = this;
		$(".hlp-slider-arrow").off("click");
		$(".hlp-slider-arrow").on("click", function() {
			var elmEvent = $(this);
			var elmSlider = elmEvent.closest(".hlp-slider");
			var isNext = elmEvent.hasClass("hlp-slider-arrow-next");
			
			obj.toggleSlide(elmSlider, isNext);
			return false;
		});

		$("*[data-hlp-action='slider']").off("click");
		$("*[data-hlp-action='slider']").on("click", function() {
			var elmEvent = $(this);
			var isNext = elmEvent.attr("data-hlp-value") == "next";

			var elmParent = elmEvent;
			for (var iIndex = 0; iIndex < 10; iIndex++) {
				elmParent = elmParent.parent().closest(hlpGetSelectorListWrap());
				if (!elmParent.length) return false;
				var elmSlider = elmParent.find(".hlp-slider");
				if (elmSlider.length) break;
			}
			
			obj.toggleSlide(elmSlider, isNext);
			return false;
		});

		$(".hlp-slider-bullet").off("click");
		$(".hlp-slider-bullet").on("click", function() {
			var elmEvent = $(this);
			var sliderIndex = elmEvent.attr("data-hlp-index");
			var newElm = elmEvent.closest(".hlp-slider").find(".hlp-slider-item[data-hlp-index='"+sliderIndex+"']");
			obj.showItem(newElm);
			return false;
		});
	}

	this.toggleSlide = function(elmSlider, isNext)
	{
		var listSliderItem = elmSlider.find(".hlp-slider-item");
		var curElm = listSliderItem.filter("[data-hlp-chosen='true']");
		if (isNext) {
			var newElm = curElm.next();
			if (!newElm.length) newElm = listSliderItem.eq(0);
		} else {
			var newElm = curElm.prev();
			if (!newElm.length) newElm = listSliderItem.last();
		}
		this.showItem(newElm);
	}

	/**
	* Ставит autoplay
	*
	* @see 
	* @see 	this.showItem()
	*/
	this.setAutoplay = function(sliderObj)
	{
		var delay = sliderObj.attr("data-hlp-slider-delay");
		if (!delay) delay = this.getDefaultDelay();

		var obj = this;
		var intervalObj = setInterval(function() {
			sliderObj.find(".hlp-slider-arrow-next").click();
		}, delay);

		var sliderIndex = sliderObj.attr("data-hlp-index");
		// удаляем старый
		if (this.listAutoplay[sliderIndex]){
			clearInterval(this.listAutoplay[sliderIndex]);
		}
		// ставим новый
		this.listAutoplay[sliderIndex] = intervalObj;
	}

	this.getDefaultDelay = function()
	{
		return this.defaultDelay;
	}

	this.showItem = function(newElm)
	{
		var sliderObj = newElm.closest(".hlp-slider");
		var listSliderItem = sliderObj.find(".hlp-slider-item");

		if (listSliderItem.length == 1) return false;

		var animateClass = sliderObj.attr("data-hlp-slider-animate");
		if (!animateClass || animateClass == "fade") animateClass = "fadeIn";
		else if (animateClass == "slide") animateClass = "slideInLeft";
	
		var animateDurationValue = sliderObj.attr("data-hlp-slider-duration");
		if (!animateDurationValue) animateDurationValue = "600";
		var animateDuration = (animateDurationValue/1000)+"s";

		// показываем слайд
		var oldElm = listSliderItem.filter("[data-hlp-chosen='true']");

		/*что бы прыгал скрол*******/
		sliderObj.css("min-height", newElm.height());
		/********/

		// animated bounceInDown
		listSliderItem.removeAttr("style").removeAttr("data-hlp-chosen")
						.attr("class", "hlp-slider-item")
						.css("animation-duration", animateDuration);
		oldElm.css({"display":"block"});
		oldElm.css({"position":"absolute", "top":"0", "left":"0", "z-index":"0"})
		oldElm.animate({"opacity":"0"}, 300);
		newElm.addClass("animated").addClass(animateClass);
		newElm.attr("data-hlp-chosen", "true");


		HlpAnimate.setSlide(listSliderItem.not(oldElm), newElm);

		// отмечаем bullet
		var sliderIndex = newElm.attr("data-hlp-index");
		sliderObj.find(".hlp-slider-bullet")
					.removeClass("flex-active")
					.filter("[data-hlp-index='"+sliderIndex+"']")
					.addClass("flex-active");
		// ставим autoplay
		this.setAutoplay(sliderObj);
	}

/*******************************************************************************/

} // end class
	
// таб
var HlpElementTabs = new HlpElementTabs();
function HlpElementTabs() {
	this.isSetProperty = false;
	this.listTabsBut = false;
	this.class = {};
	this.class.tabs = "hlp-tabs";
	this.class.tabs_item = "hlp-tabs-item";
	this.class.parent = "hlp-section";

	this.attr = {};
	this.attr.value = "data-hlp-value";
	this.attr.index = "data-hlp-index";
	this.attr.tabs_chosen = "data-hlp-chosen";
	this.attr.tabs_but_event = "data-hlp-tabs-but-event";

	this.value = {};
	this.value.but_event_click = "hlp_click";
	this.value.but_event_mouseover = "hlp_mouseover";

	this.selector = {};
	this.selector.but_action = "*[data-hlp-action='tabs']";

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	};

	this.setProperty = function()
	{
		var elmParent = $("body");
		if (this.isSetProperty) elmParent = elmParent.find(".hlp-modal:last");

		this.listTabsBut = elmParent.find(this.selector.but_action);

		this.setPropertyTabs(elmParent);
		this.setPropertyButAct();
		
		this.isSetProperty = true;
	};

	this.setPropertyTabs = function(elmParent)
	{
		// показывает первый таб
		var listTabs = elmParent.find("."+this.class.tabs);
		var countTabs = listTabs.length;
		for (var iTabs = 0; iTabs < countTabs; iTabs++) {
			var tabsObj = listTabs.eq(iTabs);
			var tabsListItem = tabsObj.find("."+this.class.tabs_item);
			tabsListItem.removeAttr(this.attr.tabs_chosen)
						.first()
						.attr(this.attr.tabs_chosen, "true");
		}
	};

	this.setPropertyButAct = function()
	{
		var listBut = this.listTabsBut;
		var countBut =listBut.length;
		for (var iBut = 0; iBut < countBut; iBut++) {
			var butObj = listBut.eq(iBut);
			var parentObj = this.getParentBut(butObj);

			var litButBrother = parentObj.find(this.selector.but_action);
			litButBrother.removeAttr(this.attr.tabs_chosen)
						.first()
						.attr(this.attr.tabs_chosen, "true");;
		}
	};

/*************************************************************************************/

	this.setEvent = function()
	{
		this.setEventClick();
		this.setEventMouseover();
	};

	this.setEventClick = function()
	{
		var obj = this; 
		var listButClick = this.listTabsBut.filter(function(){
			var eventType = $(this).attr(obj.attr.tabs_but_event);
			return !eventType || eventType == obj.value.but_event_click;
		});

		listButClick.off("click");
		listButClick.on("click", function() {
			obj.show($(this));

			return false;
		});
	};

	this.setEventMouseover = function()
	{
		var obj = this; 
		var listButMouseover = this.listTabsBut.filter(function(){
			var eventType = $(this).attr(obj.attr.tabs_but_event);
			return eventType == obj.value.but_event_mouseover;
		});

		listButMouseover.off("mouseover");
		listButMouseover.on("mouseover", function() {
			obj.show($(this));

			return false;
		});
	};

	this.show = function(elmEvent)
	{
		this.showTabsItem(elmEvent);
		this.chosenButAction(elmEvent);
	};

	this.showTabsItem = function(elmEvent)
	{
		var parentObj = elmEvent;
		for (var i = 0; i < 10; i++) {
			var listChildTabs = parentObj.find("."+this.class.tabs);
			var listChildButAct = parentObj.find(this.selector.but_action);
			
			if (listChildTabs.length && listChildButAct.length) break;

			if (parentObj.hasClass(this.class.parent)) break;
			parentObj = parentObj.parent();
		}

		var tabs = parentObj.find("."+this.class.tabs);
		var listTabs = tabs.find("."+this.class.tabs_item);

		// показываем вкладку
		var value = elmEvent.attr(this.attr.value);
		listTabs.removeAttr(this.attr.tabs_chosen);
		var tabChosen = listTabs.filter("["+this.attr.index+"='"+value+"']");
		tabChosen.attr(this.attr.tabs_chosen, "true");

		/*********************/
		// для слайдера, временное решение
		if (tabChosen.find(".hlp-slider").length) {
			$(window).resize();
		}
		/*********************/

	};

	this.chosenButAction = function(elmEvent)
	{
		var parentObj = this.getParentBut(elmEvent);

		var listButAction = parentObj.find(this.selector.but_action);
		listButAction.removeAttr(this.attr.tabs_chosen);


		/*************************/
		var tabs = elmEvent.parent().closest(".hlp-tabs__parent");
		if (tabs.length) {
			var tabId = elmEvent.attr("data-hlp-value");
			elmEvent = tabs.find("*[data-hlp-action='tabs'][data-hlp-value='"+tabId+"']");
		}
		/*************************/
		
		elmEvent.attr(this.attr.tabs_chosen, "true");
		// 
	};

	this.getParentBut = function(parentObj)
	{
		for (var i = 0; i < 10; i++) {
			var listChild = parentObj.find(this.selector.but_action);
			if (listChild.length > 1) break;
			
			if (parentObj.hasClass(this.class.parent)) break;
			parentObj = parentObj.parent().closest(hlpGetSelectorListWrap());
		}

		return parentObj;
	};

} // end class


function hlpGetSelectorListWrap()
{
	return ".hlp-block, .hlp-row, .hlp-col, .hlp-section, .hlp-wrap, .hlp-modal";
}

/********************************************************************************/
/********************************************************************************/

var HlpElementGalleryModal = new HlpElementGalleryModal();
function HlpElementGalleryModal() {
	this.listImages = {};
	
	this.attr = {};
	this.attr.widget_id = "data-hlp-gm-widget";
	this.attr.img_id = "data-hlp-gm-img";

	this.selector = {};
	this.selector.widget = '[data-hlp-widget-gm="true"]';
	this.class = {};
	this.class.image = 'hlp-img';
	this.class.modal = 'hlp-modal-gallery';
	this.class.main_img = this.class.modal + '-main-image';
	this.class.modal_blackout = this.class.modal + '-blackout';

	this.getSelectorWidget = function()
	{
		return this.selector.widget;
	};

	// list class
	this.getClassImg = function()
	{
		return this.class.image;
	};

	this.getClassModal = function()
	{
		return this.class.modal;
	};

	this.getClassMainImg = function()
	{
		return this.class.main_img;
	};

	this.getClassModalBlackout = function()
	{
		return this.class.modal_blackout;
	};

	// list attr
	this.getAttrWidgetId = function()
	{
		return this.attr.widget_id;
	};

	this.getAttrImgId = function()
	{
		return this.attr.img_id;
	};

/********************************************************************************/

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	};

	this.setProperty = function()
	{
		this.setPropertyListImages();
	};

	this.setPropertyListImages = function()
	{
		var widgetGmAttr = this.getSelectorWidget();
		var listWidgetObj = $('*'+widgetGmAttr);

		var listImages = [];
		var classImg = this.getClassImg();
		var attrWidget = this.getAttrWidgetId();
		var attrImg = this.getAttrImgId();

		var countWidget = listWidgetObj.length;
		for (var iWidget = 0; iWidget < countWidget; iWidget++) {
			var widgetObj = listWidgetObj.eq(iWidget);

			listImages[iWidget] = [];
			widgetObj.attr(attrWidget, iWidget);

			if (widgetObj.prop("tagName") == "IMG") {
				var iImg = 0;
				var elmObj = this.getImgObj(widgetObj);
				elmObj.attr(attrWidget, iWidget);
				elmObj.attr(attrImg, iImg);

				listImages[iWidget][iImg] = {
					"obj":elmObj,
					"src":this.getImgSrc(widgetObj),
					"alt":widgetObj.attr("alt")
				};
				continue;
			}

			var listImg = widgetObj.find(".hlp-img");
			var countImg = listImg.length;
			for (var iImg = 0; iImg < countImg; iImg++) {
				var imgObj = listImg.eq(iImg);
				var elmObj = this.getImgObj(imgObj);
				elmObj.attr(attrWidget, iWidget);
				elmObj.attr(attrImg, iImg);

				listImages[iWidget][iImg] = {
					"obj":elmObj,
					"src":this.getImgSrc(imgObj),
					"alt":imgObj.attr("alt")
				};
			}
		}

		this.setListImages(listImages);
	};

	this.getImgSrc = function(imgObj)
	{
		var src = imgObj.attr("data-original");
		if (!src) src = imgObj.attr("src");
		return src;
	};

	this.setListImages = function(listImages)
	{
		this.listImages = listImages;
	};

	this.getListImages = function()
	{
		return this.listImages;
	};

	this.getImgObj = function(imgObj)
	{
		var imgParent = imgObj.parent();
		if (this.isElmBlock(imgParent) && this.isOneChildPosAbs(imgParent)) {
			imgObj = imgParent;
		}

		return imgObj;
	};

	this.isElmBlock = function(elm)
	{
		if (elm.hasClass("hlp-block") 
				|| elm.hasClass("hlp-wrap")
				|| elm.hasClass("hlp-col")) {
			return true;
		} else {
			return false;
		}
	};

	this.isOneChildPosAbs = function(elmParent)
	{
		// должно быть 2 потомка
		var listChild = elmParent.find("> *");
		if (listChild.length != 2) return false;

		var obj = this;	
		var listChildAbs = listChild.filter(function() {
			var elm = $(this);
			return elm.css("position") == "absolute" && obj.isElmBlock(elm);
		});

		// один потомок блок и position:absolute
		return listChildAbs.length == 1;
	};

/*******************************************************************************/
	this.delete = function()
	{
		var obj = this;
		$("."+this.getClassModal()).animate({"opacity":"0"}, 300, function() {
			$(this).remove();
			obj.showScroll();
		});
	};

	this.create = function()
	{
		this.createBlock();
		this.setPropertyModal();
		this.setEventModal();
	};

	this.createBlock = function()
	{
		this.delete();

		var urlRoot = location.hostname.match(/app\.hollpee/) ? '/' : '';

		var wpPropObj = $(".hlp-wp-list-property");
		// для wp
		if (wpPropObj.length) {
			var imgNext = $(".hlp-std-img-mgallery-next").attr("src");
			var imgPrev = $(".hlp-std-img-mgallery-prev").attr("src");
			var imgClose = $(".hlp-std-img-mgallery-close").attr("src");
		// для всех остальных
		} else {
			var imgNext = urlRoot+'images/hlp_main/m_gallery/arrow_next.png';
			var imgPrev = urlRoot+'images/hlp_main/m_gallery/arrow_prev.png';
			var imgClose = urlRoot+'images/hlp_main/m_gallery/close.png';
		}

		var block = '\
		<div class="'+this.getClassModal()+'" data-count="">\
			<div class="'+this.getClassModalBlackout()+'"></div>\
			<div class="hlp-modal-gallery-content">\
				<div class="hlp-modal-gallery-image-wrap">\
					<div class="hlp-modal-gallery-list-main-images">\
						<img src="" alt="" class="'+this.getClassMainImg()+'" />\
					</div>\
					<div class="hlp-modal-gallery-image-nav">\
						<div class="hlp-modal-gallery-image-nav-but" data-type="prev"><img data-type="prev" src="'+imgPrev+'" alt="" class="hlp-modal-gallery-nav-but-img" /></div>\
						<div class="hlp-modal-gallery-image-nav-but" data-type="next"><img data-type="next" src="'+imgNext+'" alt="" class="hlp-modal-gallery-nav-but-img" /></div>\
					</div>\
				</div>\
				<div class="hlp-modal-gallery-nav"></div>\
				<div class="hlp-modal-gallery-list-images"></div>\
				<div class="hlp-modal-gallery-info">\
					<div class="hlp-modal-gallery-title"></div>\
					<div class="hlp-modal-gallery-num"></div>\
					<div class="hlp-clear"></div>\
				</div>\
			</div>\
			<img src="'+imgClose+'" alt="" class="hlp-modal-gallery-but-close" />\
		</div>';

		$(".hlp-site").append(block);
		$("."+this.getClassModal()).animate({"opacity":"1"}, 400);
	};

	this.setPropertyModal = function()
	{
		// 
		this.hideScroll();
	};

	this.hideScroll = function()
	{
		var bodyObj = $("body");
		var width = bodyObj.width();
		bodyObj.css("overflow", "hidden");
		
		var paddingRight = bodyObj.width() - width;
		bodyObj.css("padding-right", paddingRight+"px");
	};

	this.showScroll = function()
	{
		$("body").css({"overflow":"auto", "padding-right":"0px"});
	};

/**********************************************************************************/
/**********************************************************************************/

	this.setEvent = function()
	{
		this.setEventShow();
	};

	this.setEventShow = function()
	{
		var obj = this;
		var listImagesObj = $("*["+this.getAttrImgId()+"]");
		listImagesObj.off("mousedown");
		listImagesObj.on("mousedown", function() {
			var imgObj = $(this);
			
			// создаем модальное
			obj.create();

			// устанавливаем параметры
			var widgetId = imgObj.attr(obj.getAttrWidgetId());
			var imgId = imgObj.attr(obj.getAttrImgId());
			obj.setModalProperty(widgetId, imgId);

			return false;
		});
	};


/********************************************************************************/
	
	this.setEventModal = function()
	{
		this.setEventClose();
		this.setEventNav();
	};

	this.setEventClose = function()
	{
		var obj = this;
		var but = $(".hlp-modal-gallery-but-close, ."+this.getClassModalBlackout());
		but.off("mousedown");
		but.on("mousedown", function() {
			obj.delete();
		});
	};

	this.setEventNav = function()
	{
		var obj = this;
		var butObj = $(".hlp-modal-gallery-image-nav-but, .hlp-modal-gallery-nav-but-img");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var type = $(this).attr("data-type");

			var widgetId = parseInt(obj.ids["widget"]);
			var imgId = parseInt(obj.ids["img"]);
			if (type == "prev") {
				var newImgId = imgId - 1;
				if (!obj.listImages[widgetId][newImgId]) {
					newImgId = obj.listImages[widgetId].length - 1;
				}
			} else {
				var newImgId = imgId + 1;
				if (!obj.listImages[widgetId][newImgId]) newImgId = 0;
			}
			
			obj.setModalProperty(widgetId, newImgId);

			return false;
		});
	};


	this.setModalProperty = function(widgetId, imgId)
	{
		var listImages = this.getListImages();
		var grop = listImages[widgetId]; 
		var imgProperty = grop[imgId]; 
		var imgSrc = imgProperty["src"];
		var imgObj = imgProperty["obj"];
		
		this.setMainImgSrc(imgSrc);
		var countImg = grop.length;
		this.setInfo(countImg, imgId, imgProperty["alt"]);
		this.setSize(imgObj);

		$("."+this.getClassModal()).attr("data-count", countImg);

		this.ids = {"widget":widgetId, "img":imgId};
	};

	this.setMainImgSrc = function(src)
	{
		// параметры
		var parentImg = $(".hlp-modal-gallery-list-main-images");
		var classImg = this.getClassMainImg();

		// добавляем
		var newImgBlock = '<img src="'+src+'" alt="" class="'+classImg+'" />';
		parentImg.html(newImgBlock);
		$("."+classImg).animate({"opacity":"1"}, 300);
	};

	this.setInfo = function(countImg, imgId, alt)
	{
		var numImg = parseInt(imgId) + 1;
		var label = '<span class="hlp-modal-gallery-info-count">'+numImg + "/" + countImg+'</span>';
		if (alt) label += '<span class="hlp-modal-gallery-info-alt">'+alt+"</span>";

		$(".hlp-modal-gallery-num").html(label);
	};

	this.setSize = function(imgEventObj)
	{
		var modalObj = $(".hlp-modal-gallery-content");
		modalObj.css("width", "100%");

		var imgObj = $("."+this.getClassMainImg());
		var propW =  imgObj.width() / imgObj.height();
		var propH =  imgObj.height() / imgObj.width();

		var bodyObj = $("body");
		var imgWidth = bodyObj.width() * 0.80;
		var imgHeight = imgWidth * propH;
		var maxHeight = bodyObj.height() * 0.85;

		if (!imgHeight) {
			imgSizeProp = imgEventObj.attr("data-hlp-height") / imgEventObj.attr("data-hlp-width");
			imgHeight = imgWidth * imgSizeProp;
			propW = imgEventObj.attr("data-hlp-width") / imgEventObj.attr("data-hlp-height");
		}

		if (imgHeight > maxHeight) imgWidth = maxHeight * propW;

		modalObj.width(imgWidth);
	};

/********************************************************************************/

} // end class

/********************************************************************************/
/*********************************************************************************/
var HlpElementVideo = new HlpElementVideo();
function HlpElementVideo()
{
	this.initStatus = false;
	this.isInit = function()
	{
		return this.initStatus;
	};

	this.setInitStatus = function()
	{
		this.initStatus = true;
	};

	this.init = function()
	{
		if (this.isInit()) return false;
		this.setInitStatus();

		var listPlayer = {};
		listPlayer = this.getList(listPlayer, "bg");
		listPlayer = this.getList(listPlayer, "elm");
		this.createVideo(listPlayer);
	};

	this.isTypeBg = function(videoType)
	{
		return videoType == "bg";
	}

	this.getList = function(listPlayer, videoType)
	{
		var elmParent = $(".hlp-section"); 

		var classVideoParent = videoType == "bg" ? "hlp-bg-video-content" : "hlp-video-content";
		var listWrap = elmParent.find("."+classVideoParent);
		
		if (this.isTypeBg(videoType) && HlpDevice.isMobile()) {
			listWrap.find("> iframe").remove();
			return listPlayer;
		}

		var countWrap = listWrap.length;
		for (var iWrap = 0; iWrap < countWrap; iWrap++) {
			var wrapObj = listWrap.eq(iWrap);
			var iframeObj = wrapObj.find("> iframe");
			var src = iframeObj.attr("src");
			if (!src) continue;
			else if (!src.match(/youtube/gim)) continue;
			
			embed = src.replace(/\?[^\?]+$/gim, '').match(/[^\/]+$/gim);
			if (!embed) continue;
			embed = embed[0];
				
			iframeObj.remove();
			var id = "hlpVideoId"+videoType+"_"+iWrap;
			wrapObj.append('<div id="'+id+'"></div>');
			
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			if (this.isTypeBg(videoType)) {
				var playerParams = {rel:0,showinfo:0,controls:0,loop:1,playlist:embed,autoplay:1};
			} else {
				var playerParams = {rel:0};
				if (src.match(/showinfo=0/gim)) playerParams["showinfo"] = 0;
				if (src.match(/controls=0/gim)) playerParams["controls"] = 0;
				if (src.match(/loop=1/gim)) {
					playerParams["loop"] = 1;
					playerParams["playlist"] = embed;
				}
				if (src.match(/autoplay=1/gim)) playerParams["autoplay"] = 1;
			}

			listPlayer[id] = {
				"params":playerParams, 
				"embed":embed,
				"type":videoType
			};
		} // end for

		return listPlayer;
	}

	this.createVideo = function(listPlayer)
	{
		window.onYouTubeIframeAPIReady = function() {
			for (var playerId in listPlayer) {
				var video = listPlayer[playerId];
				var playerParams = video["params"];
				var embed = video["embed"];
				var eventsParams = {'onReady': onPlayerReady,'onStateChange': onPlayerStateChange};

				new YT.Player(playerId, {height: '100',width: '100',videoId: embed, playerVars:playerParams, events: eventsParams});
			}
		};

		var listElmTrigerObj = {};
		var isTrigerVideo = false;
		for (var playerIdV in listPlayer) {
			// var trigerElmParentClass = "hlp-section";
			var trigerElmParentClass = "hlp-site";
			var listElmTrigerItem = $("#"+playerIdV).closest("."+trigerElmParentClass).find("*[data-hlp-triger-event='videotimer']");
			listElmTrigerObj[playerIdV] = listElmTrigerItem;
			if (listElmTrigerItem.length) isTrigerVideo = true;
		}

		var obj = this;
		var listWrap = $(".hlp-bg-video-content");
		window.onPlayerReady = function (event) {
			var elm = $(event.target.a);
			var videoId = elm.attr("id");
			var elmProp = listPlayer[videoId];
			if (elmProp["type"] == "bg") {
				event.target.playVideo();
				event.target.mute();
			} else if (isTrigerVideo) {
				setInterval(function() {
					var curTime = event.target.getCurrentTime();
					curTime = parseInt(curTime + 0.6);
					// показываем элементы
					var listElm = listElmTrigerObj[videoId];
					if (listElm) {
						listElm.filter(function() {
							var elmItem = $(this);
							obj.trigerAction(elmItem, curTime);
						});
					}
				}, 1000);
			}
		};
		window.onPlayerStateChange = function (event) {
			var elm = $(event.target.a);
			var elmProp = listPlayer[elm.attr("id")];
			if (elmProp["type"] == "bg") {
				if (event.data == YT.PlayerState.PLAYING) {
					listWrap.find("iframe").css("opacity", "1");
				}
			} else {

			}
		};
	}

	this.trigerAction = function(elmItem, curTime)
	{
		if (this.isTrigerAction(elmItem, curTime)) {
			elmItem.removeClass("hlp-triger-videotimer-hide");
			elmItem.animate({"opacity":"1"}, 300);
			elmItem.attr("data-hlp-triger-video-done", "yes");
		}
	}

	this.isTrigerAction = function(elmItem, curTime)
	{
		var elmTrigerTime = elmItem.attr("data-hlp-triger-value");
		if (elmItem.attr("data-hlp-triger-video-done") != "yes" && elmTrigerTime <= curTime) {
			return true;
		} else {
			return false;
		}
	}

} // end class ElementVideo


/**********************************************************************************/
var HlpLazyload = new HlpLazyload();
function HlpLazyload () {

	/**
	*
	*
	* @see 	HlpElementModal.create()
	*/
	this.setSrc = function (parentObj)
	{
		parentObj.find("img").filter(function() {
			var elmImg = $(this);
			var imgSrc = elmImg.attr("data-original");
			if (elmImg) elmImg.attr("src", imgSrc);
		});
	}

} // end class

