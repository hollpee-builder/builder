/**
* Политика конфиденциальности
* 
*
*/
var PrivacyPolicy = new PrivacyPolicy();
function PrivacyPolicy() {

	this.getClassPrivacyPolicy = function()
	{
		return "hlp-privacy-policy";
	}

	this.getClassPersonalData = function()
	{
		return "hlp-personal-data";
	}

/**************************************************************************************************/
	
	/**
	* Добавление на все страницы
	*
	*
	* @see 	Site.insert()
	*/
	this.addAllPage = function()
	{
		// если установлен, то больше не ставим
		if (Data.site.data.privacy_policy && Data.site.data.privacy_policy.status_set) {
			return false;
		} else {
			if (!Data.site.data.privacy_policy) Data.site.data.privacy_policy = {};
			Data.site.data.privacy_policy.status_set = true;
		}

		// проходим каждую страницу
		for (var pageId in Data.site.pages) {
			this.addPropertyPage(pageId);
		}
	}


	/**
	* Добавление для страницы
	*
	* @see 	this.addAllPage()
	* @see 	ManagerPage.addNewPageInList()
	*/
	this.addPropertyPage = function(pageId)
	{
		// сохраняем текущию
		var pageOrg = Data.page;

		var buffer = Site.getBuffer();

		var page = Data.site.pages[pageId];
		buffer.html(page["html"]);

		Data.page = page;

		this.addPersonalData(buffer);
		this.addPrivacyPolicy(buffer);

		Data.site.pages[pageId]["html"] = buffer.html();
		buffer.html('');

		// возращяем текущию
		Data.page = pageOrg;
	}

/****************************************************************************************************/
	
	/**
	* Политика конфеденциальности
	*
	*
	* @see 	this.addAllPage()
	* @see 	this.addPrivacyPolicyPage()
	*/
	this.addPrivacyPolicy = function(elmParent)
	{	
		// уже есть
		if (this.existsPrivacyPolicy(elmParent)) return false;
		else if (!Site.isTypeLp()) return false;

		var block = this.getPrivacyPolicyHtml();
		elmParent.find(".section:last").after(block);

		var obj = $("."+this.getClassPrivacyPolicy());
		ElementSection.addNum(obj);
		Element.addNewId(obj);
	}

	this.existsPrivacyPolicy = function(elmParent)
	{
		var classV = this.getClassPrivacyPolicy();
		return elmParent.find("."+classV).length;
	}

	this.getPrivacyPolicyHtml = function()
	{
		var classV = this.getClassPrivacyPolicy();
		var block = '\
			<section class="element section hlp-section '+classV+'" elm-type="section" class-unique="'+classV+'">\
				<div class="element-content hlp-section-content section-content" data-basic-type="hlp-section-content">\
					<div class="element text hlp-privacy-policy-link" data-property-no-edit-class="true" elm-type="text" class-unique="hlp-privacy-policy-link">\
						<span class="element-added hlp-element-content element-content">\
							Политика конфиденциальности\
						</span>\
					</div>\
				</div>\
			</section>';

		return block;
	}

/****************************************************************************************************/

	/**
	* Добавляет персональные данные
	*
	* @see 	this.addAllPage()
	* @see  ElementForm.actionAfter()
	* @see  TemplateSection.addTemplate()
	*/
	this.addPersonalData = function(elmParent)
	{
		if (!elmParent || !elmParent.length) return false;

		var listFormV = elmParent.hasClass("form") ? elmParent : elmParent.find(".form");
		var linkBlock = this.getPersonalDataHtml();
		var countForm = listFormV.length;
		var isAddV = false;
		for (var iForm = 0; iForm < countForm; iForm++) {
			var elmFormV = listFormV.eq(iForm);
			if (this.existPersonalData(elmFormV)) continue;

			elmFormV.find(".submit").before(linkBlock);
			Element.addNewId(elmFormV);

			isAddV = true;
		}

		if (isAddV) Input.newCanvas();
	}

	/**
	* Есть или нет
	*
	* @see 	this.addPersonalData()
	*/
	this.existPersonalData = function(elmParent)
	{
		var classV = this.getClassPersonalData();
		return elmParent.find("."+classV).length;
	}

	/**
	* Отдает html ссылки
	*
	* @see 	this.addPersonalData()
	*/
	this.getPersonalDataHtml = function()
	{
		// что бы небыло ошибки
		if (!Element.obj)
			Element.obj = $(".element");
		
		var classRow = Element.getNewClassUnique("row", "row");
		var classCheckbox = Element.getNewClassUnique("input", "input");
		var classText = Element.getNewClassUnique("text", "text");

		var block = '\
			<div class="element row hlp-row hlp-row-col-2 '+this.getClassPersonalData()+' '+classRow+'" class-unique="'+classRow+'" count-column="2" count-row="1" elm-type="row">\
				<div class="element hlp-col column hlp-col-w-1" elm-type="column">\
					<input class="element checkbox '+classCheckbox+'" class-unique="'+classCheckbox+'" elm-type="checkbox" type="checkbox" name="confirmation-personal-data">\
				</div>\
				<div class="element hlp-col column hlp-col-w-11" elm-type="column">\
					<div class="element text hlp-personal-data-link '+classText+'" elm-type="text" class-unique="'+classText+'">\
						<span class="element-added hlp-element-content element-content">\
							Согласие на обработку персональных данных\
						</span>\
					</div>\
				</div>\
			</div>';

		return block;
	}


/*********************************************************************************************************/

} // end class
