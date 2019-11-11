var ElementSettingSEO = new ElementSettingSEO();
function ElementSettingSEO() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var title = elm.attr("title");
		$(".valueSEOTitle").val(title);
	}
/************************************************************************************************/
	this.editTitle = function(elm, value)
	{
		elm.attr("title", value).attr("alt", value);
	}
/*************************************************************************************/
}//end class

