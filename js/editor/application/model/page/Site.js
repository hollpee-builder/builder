/**
* Работа с ссайтом
*
*
*/
var Site = new Site();
function Site() {	
	/**
	* Количество шагов от сохранения
	*
	*/
	this.stepsFromSave = 0;

	/**
	* Количество шагов до сохранения
	*
	*/
	this.maxStepsToSave = 5;

	/**
	* Статус сохранения
	*
	* @set 	this.setForNewSite()
	* @see 	Page.replace()
	*/
	this.isSave = false;

/***************************************************************************************/	
	/**
	* Вставляет основу на страницу
	*
	* @see 	Input.init();
	*/
	this.insert = function() 
	{
		// ставим значения
		this.set(); 

		// ставим html
		var siteHtmlV = '<div class="element site page" class-unique="site" elm-type="site" data-id="i-1"></div>';
		$(".content").html(siteHtmlV);
		$(".content .page").html("");

		/*****************************************/
		/**
		* Не знаю почему добавляються после каждого li пустой ли
		* внизу их удаляю
		*/
		$(".content li:empty").remove();
		/*****************************************/

		// политика конфеденциальности
		PrivacyPolicy.addAllPage();
		
	}

	/**
	* Отдает буффер
	*
	* @see 	this.insert()
	* @see 	this.convectorSiteToLp()
	* @see 	this.clearHtml()
	*/
	this.getBuffer = function()
	{
		return $(".contentBoofer");
	}

	this.clearBuffer = function()
	{
		Site.getBuffer().html("");
	}

	/**
	* Установка
	*
	*  @
	*/
	this.set = function()
	{
		// сайт
		var elmJsonData = $("#jsonData");
		var jsonDataCode = elmJsonData.html();

		jsonDataCode = jsonDataCode.replace(/@@@@@plus@@@@@/gim, '+');

		/**********/
		jsonDataCode = jsonDataCode.replace(/"static":\[\]/gim, '"static":{}');
		jsonDataCode = jsonDataCode.replace(/"hover":\[\]/gim, '"hover":{}');
		jsonDataCode = jsonDataCode.replace(/"chosen":\[\]/gim, '"chosen":{}');
		jsonDataCode = jsonDataCode.replace(/"focus":\[\]/gim, '"focus":{}');
		jsonDataCode = jsonDataCode.replace(/"selected":\[\]/gim, '"selected":{}');
		jsonDataCode = jsonDataCode.replace(/"fixed":\[\]/gim, '"fixed":{}');
		/***********/

		Data.site = JSON.parse(jsonDataCode);

		// убираем со строницы чтобы небыло конфликтов
		elmJsonData.remove();

		/**
		* @see Element.getAllListStyle()
		* @todo переделать 
		*/
		if (!Data.isArray(Data.site.data)) {
			Data.site.data = {};
			Data.site.data.icon = "";
			Data.site.data.visibleRuler = false;
			Data.site.font = {};

			Data.site.data.autoclass = true;
			// Data.site.data.mode_simple = true;
			Data.site.data.basic_type_style = true;
		}
		if (!Data.isArray(Data.site.data.css)) Data.site.data.css = {};
		if (!Data.isArray(Data.site.data.seo)) Data.site.data.seo = {};
		if (!Data.site.data.max_page_id) Data.site.data.max_page_id = 1;
		if (!Data.isArray(Data.site.font)) Data.site.font = {};

		// для экспорта кода
		if (!Data.isArray(Data.site.data.export)) Data.site.data.export = {};


		// подключаемые файлы
		if (!Data.isArray(Data.site.data.include_file)) {
			Data.site.data.include_file = {};
			Data.site.data.include_file.css = [];
			Data.site.data.include_file.java_script = [];
		}

		// подключаемый код
		if (!Data.isArray(Data.site.data.added_code)) {
			Data.site.data.added_code = {};
			Data.site.data.added_code.head = '';
			Data.site.data.added_code.body_start = '';
			Data.site.data.added_code.body_end = '';
		}

		// abtest
		if (!Data.isArray(Data.abtest)) {
			Data.abtest = {'1':{'running':'yes'}};
		}

		// список страниц
		Data.listPages = Data.site["pages"];

		// манипуляция со страницами
		Data.listDeletePages = {}; 
		Data.listAddPages = {}; 

		// убираем некоторые настройки для многостраничника
		if (Data.site.type != "lp") {
			$(".menuPageSettingPage, .menuSEOPage").css("display", "none");
		}

		// кнопка сохранения
		this.setButSave();
	}

	/**
	* Тип если longread
	* 
	* @see 	Data.setPropertyLongreads()
	* @see 	Key.key9()
	*/ 
	this.isTypeLongreads = function()
	{
		return Data.site.type == "longreads";
	}

/**********************************************************************************************/
/*******************************************************************************************/

	/**
	* Сохранение
	*
	* @see 	SiteController.setEventSaveSite()
	* @see 	Key.key83()
	*/	
	this.save = function(noModal, func, noAnimate)
	{
		// включаем анимацию сохранение
		if (!noAnimate) this.startAnimateSave();
		// убираем редактор
		TextEditor.hide();

		// статус сохранения аватар
		var saveAvatarStatus = this.isSaveAvatar();
		if (saveAvatarStatus) {
			this.saveAvatar(noModal, func);
			return false;
		}


		/*****************************/
		/***********************/
		$('[data-hlp-widget-type="gallery_modal"]').filter(function() {
			if ($(this).hasClass("hlp-img")) {
				$(this).attr("data-hlp-width", $(this).width());
				$(this).attr("data-hlp-height", $(this).height());
			} else {
				$(this).find('.hlp-img').filter(function() {
					$(this).attr("data-hlp-width", $(this).width());
					$(this).attr("data-hlp-height", $(this).height());
				});
			}
		});
		/***********************/

		/*****************************/

		// что бы сохранились изменения
		Editor.resetFocus();

		$(".element[style='display: none;']").remove();
		// данные
		// var user = JSON.stringify(Data.user);
		var site = this.getSite();
		site = JSON.stringify(site);
		site = site.replace(/\+/gim, '@@@@@plus@@@@@');
		site = site.replace(/%26quot;/gim, "'");
		// var abtestV = Data.isAddAbtest ? JSON.stringify(Data.abtest) : '';


		var query_string = {
			"site_id" : Data.site.site_id,
			"site" : site,
			// "abtest" : abtestV,
			"site_type" : Data.site.type
		}

		var obj = this;
		// запрос на сервер
		$.post('/editor/save', query_string, function(res, status) {
			res = res.trim();	
			// console.log(res)
			
			if (res) {
				//статус сохрание - сохранен 
				$(".topMenuSave").attr("is-save", "true");
				// обнуляем счетчик для авто сохранения 
				obj.stepsFromSave = 0;
				Data.isAddAbtest = false;

				if (!noModal) Notification.ok(Resource.hlp_save_notification_successfully);

				// запускаем функцию 
				if (func) func();
			} else {
				// выводим ошибку
				Notification.error();
			}

			// останавливаем анимацию
			if (!noAnimate) obj.stopAnimateSave(); 
		})
	}

	/**
	*
	*
	*/
	this.saveFont = function()
	{
		var obj = this;
		var query_string = {
			"site_id" : Data.site.site_id,
			"font" : JSON.stringify(Data.site.font)
		}
		// запрос на сервер
		$.post('/editor/saveFont', query_string, function(req, status) {
			
		});
	}


	this.getButSave = function()
	{
		return this.butSaveObj;
	}

	this.setButSave = function()
	{
		this.butSaveObj = $(".topMenuSave");
	}

	/**
	* Статус сохранения
	*
	* @see 	EditorController.setEventButFullShow()
	*/
	this.isSaveStatus = function()
	{
		var butObj = this.getButSave();
		return butObj.attr("is-save") == "false" ? false : true;
	}

	/**
	* Установка статуса сохранения нет
	*
	* @see 	StyleMenu.edit()
	*/
	this.setSaveNo = function()
	{
		var butObj = this.getButSave();
		butObj.attr("is-save", "false")
	}

	this.setSaveYes = function()
	{
		var butObj = this.getButSave();
		butObj.attr("is-save", "true")
	}

	/**
	* устанавливем анимацию - сохранение
	*
	* @see 	this.save()
	* @see 	this.published()
	*/
	this.startAnimateSave = function(butObj, labelText)
	{
		if (!butObj) butObj = $(".topMenuSave");
		if (!labelText) labelText = Resource.hlp_save_load;

		this.stopAnimateSave();
		if (this.animateSaveObj) clearInterval(this.animateSaveObj);
		this.animateSaveObj = setInterval(function() {
			butObj.animate({"opacity":"0"}, 250)
							.animate({"opacity":"1"}, 250);
		}, 800);

		butObj.attr("label", labelText);
	}

	/**
	* останавливаем анимацию - сохранение 
	*
	* @see 	this.save()
	* @see 	this.published()
	*/
	this.stopAnimateSave = function(butObj, labelText)
	{	
		clearInterval(this.animateSaveObj);

		if (!butObj) butObj = $(".topMenuSave");
		if (!labelText) labelText = Resource.hlp_save_label;
		
		butObj.attr("label", labelText);
	}

	/**
	* Тип сайта lp
	*
	* @see 	ManagerPage.
	* @see 	this.save() Site.isTypeLp()
	* @see 	PrivacyPolicy.addPrivacyPolicy()
	* @see 	ElementBasicType.setStyle(), .fixedStyle()
	*/
	this.isTypeLp = function()
	{
		return Data.site.type == "lp";
	}

/********************************************************************************/	
	/**
	* Публикация сайта
	*
	* @see 	SiteController.setEventPublished()
	*/
	this.published = function(elmEvent)
	{
		var labelText = elmEvent.attr("label");

		this.startAnimateSave(elmEvent, Resource.hlp_published_load);	
		var obj = this;

		obj.save(true, function() {
			var hrefFrame = elmEvent.attr("href");
			var frameHtml = '<iframe src="'+hrefFrame+'" style="display:none;" id="iframeUpdateSitePublished" frameborder="0"></iframe>';
			
			$("#iframeUpdateSitePublished").remove();
			$("body").append(frameHtml);
			var frameUpdateObj = $("#iframeUpdateSitePublished");
			frameUpdateObj.ready(function() {
				setTimeout(function() {
					Notification.ok(Resource.hlp_published_notification);

					obj.stopAnimateSave(elmEvent, labelText);
					obj.setStatusPublishedYes();
				}, 1000);
			});
		}, true);
	}

	/**
	* Статус не опубликован
	*
	* @see 	History.record();
	*/
	this.setStatusPublishedNo = function()
	{
		$(".butSitePublished").removeAttr("data-published");
	}

	/**
	* Статус опубликован
	*
	* @see 	this.published()
	*/
	this.setStatusPublishedYes = function()
	{
		$(".butSitePublished").attr("data-published", "true");
	}
/*********************************************************************************/

	/**
	* Статус сохранения аватара
	*
	* @see 	this.save()
	*/
	this.isSaveAvatar = function()
	{
		if (!Data.site.count_save_site) Data.site.count_save_site = 0;
		Data.site.count_save_site++;

		if (!(Data.site.count_save_site % 10)) {
			if (Screen.isModal() 
					|| $(".modalBlock").length
					// || Page.getCurrentPageIndex()
					) {
				var avatarStatus = false;
				Data.site.count_save_site = 5;
			} else {
				var avatarStatus = true;
				Data.site.count_save_site = 0;
			}
		} else {
			var avatarStatus = false;
		}

		return avatarStatus;
	}

		/**
	* Сохранение аватар
	*
	* @see 	this.save()
	*/
	this.saveAvatar = function(noModal, func)
	{
		Screen.setScroll(0);
		Screen.setDesktop();

		var listHide = $(".resizeBlock, .butAddTemplate, .addedBlock, .guides, .grid");
		listHide.addClass("displayNone");

		html2canvas(document.querySelector(".content .site"), {'height':2000}).then(function(canvas) {
				var siteId = Data.site.site_id;
				var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, ''); 
			   	var params = {site_id:siteId, data:data}; 
			   	
			   	Notification.ok(Resource.hlp_save_screen_notification);

				$.post('/editor/saveSiteAvatar', params, function(res) { 
					listHide.removeClass("displayNone");

					// сохраняем сайт
					Site.save(noModal, func);
			    });  
		});
	}

/***********************************************************************************************/
	/**
	* Отдает данные сайта
	*
	* @see 		this.save()
	*/
	this.getSite = function()
	{
		// фиксируем изменения в массиве
		this.fix();

		// формируем страницы
		this.formatPagesData();
		// йиксируем цвета color picker
		this.fixedColorPicker();
		
		Data.site.pages[Data.page.page_id] = Data.page;

		return Data.site;
	}

	/**
	* Очищает сайт
	*
	* @see 	this.getData()
	*/
	this.formatSiteData = function()
	{
		Data.site["html"] = this.clearHtml(Data.site["html"]);
	}

	
	/**
	* Очищает страницу
	*
	* 
	* @see 	this.getData()
	* @see 	ManagerPage.chosenItem()
	*/
	this.formatPagesData = function()
	{
		if (Data.site.pages[Data.page.page_id]) {
			Data.site.pages[Data.page.page_id]["html"] = this.clearHtml(Data.page["html"]);
		}
	}

	/**
	* Фиксируем цвета
	*
	* @see 	this.getSite();
	*/
	this.fixedColorPicker = function()
	{
		// фиксируем цвета
		var listColorElmV = $(".cp-color-picker .cp-memory div");
		var countElmV = listColorElmV.length;
		for (var iColor = 0; iColor < countElmV; iColor++) {
			var colorV = listColorElmV.eq(iColor).css("background-color");
			if (!Data.site.data.colorPicker) Data.site.data.colorPicker = {};
			Data.site.data.colorPicker[iColor] = colorV;
		}
	}
/********************************************************************************************/
	/**
	* Очищает html
	*
	* @see 	this.clearSiteData()
	* @see 	this.clearPagesData()
	* @see 	Page.fix()
	*/
	this.clearHtml = function(html)
	{
		Resize.remove();
		StyleMenuAnimate.clearAll();

		//буффер 
		var buffer = this.getBuffer();
		//вставляем в буффер html
		buffer.html(html);
		
		//убираем // линейка, размер, направляющие
		buffer.find(".scaleWrap, .sectionListButTemplate, .resizeBlock, .addedBlock, .grid > *").remove();
		
		var listElmV = buffer.find(".element, .section-content, .slider-item, li, ul");
		listElmV.removeClass("elementSelected")
									.removeClass("displayBlock")
									.removeAttr("border") //рамка вокруг элемента
									.removeAttr("is-parent-selected")//родитель выделеного элемента
									.removeAttr("state")
									.removeAttr("status")
									.removeAttr("style")
									.removeAttr("data:image")
									.removeAttr("data-hlp-nav-open-level");
		//для карты
		this.clearForMap(buffer);
		buffer.find(".iframe > iframe").html('');


		// убираем пустые параграфы
		buffer.find("p").filter(function() {
			return !$(this).attr("class") ? true : false; 
		}).remove();
		
		//заносим результат с буффера в массив
		var newHtml =  buffer.html()
							.replace(/&/gim, '%26')//заменяем амперсант
							.replace(/^[\s\t]+/g, '')//убираем пробел в начале
							.replace(/[\t\r]+/g, '')
							.replace(/[\n]+/g, '');

		newHtml = newHtml.replace(/&/gim, "&amp;")

		//очищаем буффер
		buffer.html('');

		Resize.create();
		return newHtml;
	}


	/**
	* Очищние для карты
	*
	*
	* @see 	this.clearHtml()
	*/
	this.clearForMap = function(buffer)
	{
		buffer.find(".map > iframe").html("");
	}
/************************************************************************************************/
	/**
	* Фиксируем данные в массиве
	*
	* @see 	this.getData()
	* @see 	EditorController.setEventTab()
	* @see 	ManagerBasic.*()
	* @see 	ManagerPage.addNewPageInList()
	* @see 	ElementCss.createListTagStyle()
	* @see 	TemplateSection.insertTemplatePage()
	*/
	this.fix = function()
	{
		// фиксируем модальные
		if (Screen.isModal()) ManagerModal.fix();
		// фиксируем страницу
		Page.fix();
	}

	/**
	* Добавление шага до авто сохранения
	*
	* @see History.record()
	*/
	this.addStepAutoSave = function()
	{
		//статус сохрание - не сохранен 
		$(".topMenuSave").attr("is-save", "false");
	}

/*********************************************************************************************/
/******************************************************************************************/
	
	/**
	* Отдает статус
	*
	* @see 	PageSetting.setSite()
	*/
	this.isLazyLoadRunning = function()
	{
		return Data.site.data.lazyload_running;
	}

	/**
	* Устанавливает статус
	*
	* @see 	PageSetting.setEventSiteLazyLoad()
	*/
	this.setLazyLoadRunning = function(valueV)
	{
		Data.site.data.lazyload_running = valueV;
	}

/*********************************************************************************************/
	
	/**
	* Отдает id
	*
	* @see 	TemplateSection.saveNewTemplate()
	*/	
	this.getId = function()
	{
		return Data.site.site_id;
	}

	this.isCommerce = function()
	{
		return Data.site.type_access == "private";
	}



/*********************************************************************************************/
/*********************************************************************************************/

} //end class

