var Formating = new Formating();
function Formating() {

	this.execute = function(siteString, typeOperation, cmsName, fileType)
	{
		// создаем buffer для работы
		$("body").prepend('<div class="contentBoofer" style="display:none;"></div>');
		
		/***********************************/
		this.typeOperation = typeOperation;
		this.fileType = fileType;
		this.cmsName = cmsName;

		// декодируем
		this.site = JSON.parse(siteString);
		this.site.added_font = {};
		var siteType = this.site["type"];

		// буффер
		var bufferObj = this.getBufferObj();
		this.bufferObj = bufferObj;

		/***********************/
		// для основы
		if (this.isSiteTypeSite() && this.site.data.css) {
			this.clearAfterFormating(bufferObj);
			var listBasicClass = Css.getListClassBasicType();
			for (var styleBasicItem in listBasicClass) {
				var styleBasicValue = this.site.data.css[styleBasicItem];
				if (styleBasicValue) {
					this.site["pages"][1]["data"]["css"][styleBasicItem] = styleBasicValue;
				} else {
					delete this.site["pages"][1]["data"]["css"][styleBasicItem];
				}
			}
		}
		/***********************/

		// форматируем страницы
		for (pageIndex in this.site["pages"]) {
			this.pageIndex = pageIndex;

			this.pageName = this.site["pages"][pageIndex]["url_name"];
			var pageHtml = this.site["pages"][pageIndex]["html"];

			/*для wp***********/
			if (Formating.isCmsNameWp()) {
				pageHtml = '<div class="page-'+this.pageName+'">'+pageHtml+'</div>';
			}
			/************/

			bufferObj.html(pageHtml);
			var page = this.site["pages"][pageIndex];
			this.page = page;
			Html.page = page;


			this.clearAfterFormating(bufferObj);
			this.customizer = [];
			this.site["pages"][pageIndex]["css"] = Css.formating(this.site["pages"][pageIndex], "page", bufferObj);
			this.site["pages"][pageIndex]["html"] = Html.formating(bufferObj);
			this.site["pages"][pageIndex]["customizer"] = this.customizer;

			if (this.typeOperation == "published") {
				this.site["pages"][pageIndex]["data"] = '';
			}
		}

		// формируем основу
		if (this.isSiteTypeSite()){
			this.formatingMain();
		} else if (this.isCmsNameWp()) {
			this.site.main = {"css" : Css.getListFontLocalInc()};
		}

		//удаляем буффер 
		bufferObj.remove();

		return this.site;
	}

	this.getBufferObj = function()
	{
		return $(".contentBoofer");
	}

	this.clearAfterFormating = function(buffer)
	{
		this.clearNav(buffer);
		this.deleteRemovingElm(buffer);

		Css.buffer = buffer;
		Html.buffer = buffer;


		buffer.find(".listElmBasicType").remove();
	}

	this.clearNav = function(buffer)
	{
		// если нету навигации
		if (!buffer.find(".nav").length) {
			buffer.find(".nav-panel-mobile, .nav-button-mobile").remove();
		}
	}

	this.deleteRemovingElm = function(buffer)
	{
		// удаляем
		buffer.find('*[style="display:block;"], *[style="display:block"]')
				.remove();
	}

	this.isOperatorShow = function()
	{
		return this.getOperatorType() == "show";
	}

	this.getOperatorType = function()
	{
		return this.typeOperation;
	}

	this.isFileTypeHtml = function()
	{
		return this.fileType == "html";
	}

	this.getCmsName = function()
	{
		return this.cmsName;
	}

	this.isCmsNameOnlyHtml = function()
	{
		return this.getCmsName() == "only_html";
	}

	this.isCmsNameHollpee = function()
	{
		return this.getCmsName() == "hollpee";
	}

	this.isCmsNameWp = function()
	{
		return this.getCmsName() == "wp";
	}

/*************************************************************************************/
/*************************************************************************************/
		
	/**
	* Тип сайта сайт или нет
	* 
	* @see 	this.formating()
	* @see 	CSS.formatingPage()
	*/	
	this.isSiteTypeSite = function()
	{
		return this.site.type == "site";
	}

	this.isPageMain = function(pageName)
	{
		if (!this.isSiteTypeSite()) return false;

		if (pageName == "header" || pageName == "footer") {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Форматирование для основы
	*
	*
	*/	
	this.formatingMain = function()
	{
		var header = this.site.pages[1]["html"];
		var footer = this.site.pages[2]["html"];
		var css = Css.getListFontLocalInc();
		css += "\r\n" + this.site.pages[1]["css"];
		css += "\r\n" + this.site.pages[2]["css"];
		delete this.site.pages[1];
		delete this.site.pages[2];

		this.site.main = {
			"header" : header,
			"footer" : footer,
			"css" : css
		};
	}



/*************************************************************************************/
	/**
	* Отдает значение customizer
	*
	* @see 	FormatingHtml.getAttrMain()
	* @see 	FormatingHtml.setTabForTextContent()
	* @see 	FormatingHtml.getAttrSpecific()
	* @see 	FormatingHtml.addCustomizerForm()
	* @see 	FormatingHtml.getElmContent()
	*/
	this.getCustomizerItem = function(elm, attrValue, type)
	{
		attrValue = this.replaceCustomizerValueChar(attrValue);
		if (this.isOperatorShow() || this.isCmsNameOnlyHtml()) return attrValue;
		
		// имя
		var customizerName = this.getCustomizerName(elm, type);
		if (!customizerName) return attrValue;
		// получаем значение
		var custRes = this.getCustomizerValue(elm, customizerName, attrValue, type);

		return custRes;
	}


	this.getCustomizerName = function(elm, type)
	{
		var customizerName = elm.attr("data-id");
		if (!customizerName) var customizerName = elm.closest("*[data-id]").attr("data-id"); 
		if (!customizerName) return false;

		if (type) customizerName += "-" + type;	

		return customizerName;
	}

	this.getCustomizerValue = function(elm, customizerName, attrValue, type)
	{
		attrValue = attrValue.replace(/</gim, 'hlp-this-tag-span-start');
		attrValue = attrValue.replace(/>/gim, 'hlp-this-tag-span-end');

		attrValue = attrValue.replace(/'/gim, '&#8217;');
		attrValue = attrValue.replace(/%27/gim, "\\'");

		var resValue = attrValue;
		if (this.isCmsNameWp()) {
			if (type == "img") {
				resValue = '<?php echo get_template_directory_uri() ?>/' + attrValue;
			}
		} else {
			var resValue = "\<\?php echo HlpData::getResource('"+customizerName+"', '"+attrValue+"'); \?\>";
		}

		
		return resValue;
	}

	this.replaceCustomizerValueChar = function(attrValue)
	{
		if (attrValue) {
			attrValue = attrValue.replace(/%23/gim, "#");
			attrValue = attrValue.replace(/%3F/gim, "?");
			attrValue = attrValue.replace(/%3D/gim, "=");
			attrValue = attrValue.replace(/%26/gim, "&");
			attrValue = attrValue.replace(/%253A/gim, ":");
			attrValue = attrValue.replace(/http/gim, '@@@@@hp@@@@@');
		} else {
			attrValue = "";
		}

		return attrValue;
	}

	this.setCustomizerElm = function(listElm)
	{
		var countElm = listElm.length;
		for (var iElm = 0; iElm < countElm; iElm++) {
			var elm = listElm.eq(iElm);

			if (Html.isElmCodeReplace(elm)) continue;
			
			if (elm.hasClass("hlp-img")) {
				// потому что img тоже может быть ссылкой
				var elmImg = elm.find("> img");
				if (!elmImg.length) elmImg = elm;
				var custSrc = this.getCustomizerItem(elmImg, elmImg.attr("src"), "img");
				elmImg.attr("src", custSrc);
			} else if (elm.hasClass("hlp-self-video")) {
				var custSrc = this.getCustomizerItem(elm, elm.attr("src"), "video");
				elm.attr("src", custSrc);
			} else {
				var elmChilds = elm.find("*");
				// если ссылка
				if (elmChilds.length == 1 && elm.find(">a:not([class])").length) {
					elm = elm.find("> a");
				}
				// для span
				Html.clearEditorAttr(elmChilds);

				var content = elm.html();
				// если есть содержимое
				if (content) {
					// убираем переносы строк 
					content = content.replace(/[\r\n\t]+/gim, '');
					content = this.getCustomizerItem(elm, content);
					elm.html(content);
				}
			}
			
			// для ссылки 
			if (elm.filter("[href]").length) {
				var custHref = this.getCustomizerItem(elm, elm.attr("href"), "link");
				elm.attr("href", custHref);
			}
		}
	}

/***************************************************************************************************/

} // end class
