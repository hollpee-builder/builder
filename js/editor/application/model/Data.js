/**
* Данные системы
*
* Просмотр в редакторе 
* Отдельный просмотр
* 
* На отдачу (у нас)
*
*
*/
var Data = new Data();
function Data() {
	/**
	* @see 	ElementMan.setParCutElm()
	* @see 	StyleMenuEdit.gradient()
	*/
	this.siteElement;
	this.optionElement;
	// this.listSiteUrl;

	this.isAddAbtest = false;

	/**
	* @see 	Site.insert()
	*
	*/
	this.site;

	/**
	* @see 	SelectPage.focusoutEditPageName()
	* @see 	SelectPage.setEventDeletePage()
	* @see  SelectPage.addNewPageInList()
	* @see 	Site.getPageData()
	* @see 	Page.replace()
	* @see 	Page.getNewPageId()
	* @see 	SelectPage.editListPagesId()
	*/
	this.listPages;
/**************************************************************************************/
	/**
	* Узнает массив или нет
	*
	* @see 	Page.setFullPage(), Site.set()
	* @see 	User.setData()
	*/
	this.isArray = function(array)
	{
		if (!(array instanceof Object) || array.length >= 0) return false;
		else return true;
	}
/******************************************************************************************/
	/**
	* Устанавливает данные
	*
	* @see Input.init() 	
	*/
	this.set = function(params)
	{
		// данные пользователя
		this.setDataUser();

		this.siteName = $("#siteName").text().trim();
		// this.listSiteUrl = params['listSiteUrl'];
	}

	/**
	* Ставит данные пользователя
	*
	* @see this.set()
	*/
	this.setDataUser = function()
	{
		var list = $("#jsonUserData").html();
		$("#jsonUserData").remove();
		
		// if (list && list != "undefined") this.user = JSON.parse(list));
		if (list && list != "undefined") this.user = JSON.parse(unescape(list));
		
		if (!this.isArray(this.user)) {
			this.user = {};
			this.user.count_save_site = 0;

			this.user.list_template = {};
			this.user.last_template_id = 0;
			this.user.folder_template = {
				"1" : {"id" : "1", "name" : "first"}
			};
		}
				
		// список просмотренных инструкций
		if (!this.user.showing_tutorial) {
			this.user.showing_tutorial = {};
		}


		this.userId = $("#userId").text();
	}

	/**
	* Для longreads
	*
	* @see 	Site.set()
	*/
	this.setPropertyLongreads = function()
	{
		// if (Site.isTypeLongreads()) {
		// 	this.user.autoclass = true;
		// 	this.user.mode_simple = true;
		// 	$(".wrapper").addClass("modeLongreads");
		// }
	}

/*************************************************************************************/
	/**
	* Добавляет список стандартных фонов
	*
	* @see 	this.setDataUser()
	*/
	this.addListStdFont = function()
	{
		var fontOne = "<link href='https://fonts.googleapis.com/css?family=Jura&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontTwo = "<link href='https://fonts.googleapis.com/css?family=PT+Sans+Narrow&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontThree = "<link href='https://fonts.googleapis.com/css?family=Comfortaa&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		var fontFour = "<link href='https://fonts.googleapis.com/css?family=Cousine&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
	}


/****************************************************************************************/
}//end class


































