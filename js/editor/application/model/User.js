/**
* Работа с данными пользователя, растпространяется на все сайты
*
*/
var User = new User();
function User() {
	/**
	* Сохранение данных
	*
	* @see 	TemplateSection.setEventButAddFolder()
	* @see 	TemplateSection.setEventEditNameFolder()
	* @see 	TemplateSection.setEventDeleteFolder()
	* @see 	Editor.setModeWork()
	* @see 	StyleFont.fixedChange()
	* @see 	StyleFont.setEventAddLink()
	* @see 	EditorController.setEventDetailShowType()
	*/	
	this.save = function()
	{
		var user = JSON.stringify(Data.user);	
		$.post('/editor/saveUserData', {"user":user}, function(res, status) {
			res = res.trim();
		});	
	}


}//end class

