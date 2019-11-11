$(document).ready(function() {
	HlpShowIframe.site();
});

var HlpShowIframe = new HlpShowIframe();
function HlpShowIframe() {
	/**
	* Показывает сайт
	*
	*/
	this.site = function() 
	{
		var site = $("#dataJson").html().trim();
		var siteStatus = $("#siteStatus").html().trim();

		if (siteStatus == "formating") {
			Modal.createLoading("Идет форматирование");

			var site = Formating.execute(site, "show");
			// console.log(site.pages[1]["css"])
			// return false;
			
			var codeJson = JSON.stringify(site);
			var siteId = $("#siteId").text().trim();
			var queryString = {"site_id" : siteId, "code" : codeJson};

			$.post("/show/publishedSite", queryString, function(res) {
				location.reload();
			});

			return false;
		}

		/****************************************************/
		/****************************************************/
		/****************************************************/

		this.site = JSON.parse(site);
		
		// показываем сайт
		var siteHtmlV = this.clearCode(this.site.html);
		$(".content").html(siteHtmlV);
		$(".content .hlp-site").addClass("hlp-no-flexbox");

		// вставляем css
		$(".styleSiteSection").html('<style>'+this.clearCode(this.site.css)+'</style>');

		// показывает страницу
		var pageIndex = this.getFirstPageId();
		HlpShowIframe.page(pageIndex);
	}

	/**
	* 
	*
	* @see 	this.page()
	*/
	this.getFirstPageId = function()
	{
		for (var pageId in this.site.pages) break;	
		return pageId;
	}
/************************************************************************************************/
	/**
	* Показывает страницу
	*
	* @see 	this.site()
	* @see 	this.setEventLink()
	*/
	this.page = function(pageNumber)
	{
		var page = this.site.pages[pageNumber];

		var pageCss = this.clearCode(page.css.trim());
		$(".stylePageSection").html('<style>'+pageCss+'</style>');
		
		// html
		var pageHtml = this.clearCode(page.html.trim());
		var pageObj = $(".hlp-page");
		if (!pageObj.length) pageObj = $(".hlp-site");
		pageObj.html(pageHtml);

		// поднимаем scroll
		$("body").scrollTop(0);

		//ставим события 
		setEventHollpee();
		// 
		this.setEvent();

		// отмечаем вкладку меню
		var pathName = "/" + page.url_name + ".php";
		$(".nav-item[href]").removeAttr("data-chosen")
						.filter("[href='"+pathName+"']")
						.attr("data-chosen", "true");

		// прячем правую панель
		HlpElementNav.closePanel();
	}

	this.clearCode = function(code)
	{
		code = unescape(code.trim());
		code = code.replace(/src-map/gim, "src");
		code = code.replace(/@@@@@plus@@@@@/gim, "+");
		code = code.replace(/&#43;/gim, "+");
		
		return code;
	}

/***************************************************************************************/
/****************************************************************************************/
	/**
	* Ставим события
	*
	* @see 	this.page()
	*/
	this.setEvent = function()
	{
		this.setEventLink();//ссылки

		var obj = this;
		$(".nav-button-mobile").off("mousedown");
		$(".nav-button-mobile").on("mousedown", function() { 
			setTimeout(function() {obj.setEventLink();},300);
		});

		$("form").off("submit");
		$("form").on("submit", function() {		
			var inputRedirectObj = $(this).find("input[name='redirect']"); 	
			var redirectValue = inputRedirectObj.val();
			var redirectType = inputRedirectObj.attr("data-redirect");

			if (redirectType == "modal") {
				HlpElementModal.show(redirectValue);
				$(this).find("input[type='text'], textarea").val('');
				return false;
			} else if (redirectType == "page") {
				var pageName = redirectValue.replace(/(^\/)|(\.php)/gim, '');
				var pages = obj.site.pages;
				for (var iPage in pages) {
					var pageData = pages[iPage];
					if (pageData.url_name == pageName) {
						obj.page(iPage);
						return false;
					}
				}
			}

			alert("Переход по внешней ссылки");

			return false;
		});


		var listButModal = $("*[data-action='modal']");
		listButModal.off("mousedown");
		listButModal.on("mousedown", function() {
			setTimeout(function(){HlpShowIframe.setEvent();}, 2000);
		});
	}

/*************************************************************************************/
	
	/**
	* Событие для ссылок
	*
	* @see 	this.page()
	*/
	this.setEventLink = function()
	{
		var obj = this;
		$("a").off("click");
		$("a").on("click", function() {
			var href = $(this).attr("href").replace(/^\//, '').replace(/\.php$/, '');
			var numberPage = obj.getNumber(href);
				
			if (numberPage) obj.page(numberPage);
			else alert("Переход по внешней ссылке"); 
			
			return false;
		});
	}

	/**
	*
	*
	* @see 	this.setEventLink()
	*/
	this.getNumber = function(name) 
	{
		var index = 0;
		for (var iPage in this.site.pages) {
			var page = this.site.pages[iPage];
			if (name == page.url_name) return index.toString();
			index++;
		}
		return false;
	}	

}//end class

