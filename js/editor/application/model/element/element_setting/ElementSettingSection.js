var ElementSettingSection = new ElementSettingSection();
function ElementSettingSection() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var fixedValue = elm.attr("data-value") == "section-fixed" ? "yes" : "no";

		$(".blockValueSection .menuButValue[value='"+fixedValue+"']").attr("chosen", "true");
	}


	/**
	* Изменение
	*
	*/
	this.edit = function(elm, value)
	{	
		$(".section").removeAttr("data-value");
		if (value == "yes") elm.attr("data-value", "section-fixed");
	}
/*************************************************************************************/
}//end class
