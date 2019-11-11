$(document).ready(function() {
	PageDetailMain.init();
});

var PageDetailMain = new PageDetailMain();
function PageDetailMain() {
	this.siteId = '';
	this.domainV = '';
	this.domainIsDefault = '';
	this.url = '';
	this.fullUrl = '';
	this.listDomain = {};
	this.abtest = {};

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
		this.setPropertyVisible();
	}

/************************************************************************************/

	/**
	* Установка параметров
	*
	* @see 	this.init()
	*/
	this.setProperty = function()
	{
		this.siteId = $("#siteId").text().trim();
		this.fullUrl = $("#fullUrl").text().trim();
		
		var siteInfoJson = $("#siteInfoJson").html().trim();
		this.siteInfo = JSON.parse(siteInfoJson);

		var abtestJson = $("#abtestJson").html().trim();
		this.abtest = JSON.parse(abtestJson);

		var listPagesJson = $("#listPagesJson").html().trim();
		this.listPages = JSON.parse(listPagesJson);

		//abtest
		PageDetailAbtest.siteId = this.siteId;
		PageDetailAbtest.abtest = this.abtest;
		PageDetailAbtest.listPages = this.listPages;

		// adaptive title
		PageDetailAdptiveTitle.siteId = this.siteId;
		PageDetailAdptiveTitle.fullUrl = this.fullUrl;

		PageDetailSts.siteId = this.siteId;
		PageDetailSts.listPages = this.listPages;
		// PageDetailSts.abtest = this.abtest;
	}

	this.setPropertyVisible = function()
	{
		var isAddedSite = this.siteInfo["site_id"] == "additional";
		if (!isAddedSite) return false;

		$(".butChosenSection")
			.filter("[data-type='ab_test'], [data-sts='ttl'], [data-type='adaptive_title']")
			.css("display", "none");
	}


	this.setPropertyDomain = function()
	{
		// список доменов
		var listDomain = JSON.parse($("#listDomain").text().trim());
		this.listDomain = {};
		var countDomain = listDomain.length;
		for (var iDomain = 0; iDomain < countDomain; iDomain++) {
			var domainItem = listDomain[iDomain];
			var domainId = domainItem["id"];
			this.listDomain[domainId] = domainItem;
		}
	}
	/**
	* Установка url
	*
	* @see 	this.setProperty()
	*/
	this.setUrlPage = function()
	{
		var hrefUrl = this.getUrlPage();
		this.fullUrl = hrefUrl;
		
		$(".pageUrl").text(hrefUrl).attr("href", hrefUrl);
	}

	this.getUrlPage = function()
	{
		var domain = this.domainV;
		if (this.domainIsDefault == 'yes') {
			domain += '.' + DOMAIN_HOSTING;
		}
		var hrefUrl = 'http://'+domain+'/'+this.url;

		return hrefUrl;
	}

/************************************************************************************/
	
	this.setEvent = function()
	{
		this.setEventNavSection();
	}

	/**
	* Навигация по секция
	* 
	* @see 	this.setEvent()
	*/
	this.setEventNavSection = function()
	{
		var butObj = $(".butChosenSection");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			butObj.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");
			var type = $(this).attr("data-type");
			var typeSts = $(this).attr("data-sts");
			$(".listSection").attr("data-type", type);
			$(".listSection").attr("data-sts", typeSts);
			
			var elmTitle = $(".sectionPage[data-type='"+type+"'] .sectionPageTitle");
			if (typeSts) elmTitle = elmTitle.filter("[data-sts='"+typeSts+"']");	
			$(".sectionPageTitleHeading").text(elmTitle.text());	

			return false;
		});
	}

/*****************************************************************************/	

} // end class
