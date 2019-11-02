/**
* Работа с сайтом
*
*
*/
var Site = new Site();
function Site() {
	this.siteId = 0;

	/**
	* Сохранение
	*
	* @see 	this.setEventSave()
	* @see 	Element.clearCustomizer()
	*/
	this.save = function(isReload)
	{
		var obj = this;
		var pageId = this.getPageId();
		var siteId = this.getSiteId();

		var custPage = Element.listCustomizerPage;
		if (custPage) custPage = JSON.stringify(custPage);

		var custMain = Element.listCustomizerMain;
		if (custMain) custMain = JSON.stringify(custMain);

		var queryString = {
			"page_id" : pageId,
			"site_id" : siteId,
			"customizer_page" : custPage,
			"customizer_main" : custMain,
		};
		$.post("/" + ADMIN_FOLDER + "/editor/save", queryString, function(data, status) {
			data = data.trim();
			console.log(data);

			if (data) {
				Notification.ok("Сайт сохранен");
				if (isReload) {
					location.reload();
				} else {
					// ставим статус что сохранен
					obj.setStatusSave("true");
				}
			} else {
				Notification.error("Сайт не сохранен");
			}
		});
	}

	this.getPageId = function()
	{
		return $(".h-page-id").text().trim();
	}

	this.getSiteId = function()
	{
		return $(".h-site-id").text().trim();
	}

	/**
	* Ставит статус сохранения
	*
	* @see 	this.save()
	* @see 	ElementLink.setEventSave()
	* @see 	ElementForm.setEventModalForm() 
	* @see 	ElementForm.setEventModalSubmit()
	* @see 	ElementForm.setEventModalInput()
	*/
	this.setStatusSave = function(status)
	{
		$(".h-save-status").attr("data-hlp-status", status);
	}

	/**
	* Сохраненый или нет
	*
	* @see 	Editor.setEventExit()
	*/
	this.isSave = function(status)
	{
		return $(".h-save-status").attr("data-hlp-status") == "true" ? true : false;
	}

/***********************************************************************************************/

} // end class

