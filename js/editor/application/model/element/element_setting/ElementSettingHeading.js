var ElementSettingHeading = new ElementSettingHeading();
function ElementSettingHeading() {
	/**
	* Установка значений
	*
	*/
	this.set = function(elm)
	{
		var tag = elm[0].tagName.toLowerCase();
		$(".menuButHeading[value='"+tag+"']").attr("chosen", "true");
	}

/***********************************************************************************************/
	/**
	* Изменение
	*
	*/
	this.edit = function(elm, tag)
	{
		Element.replaceTag(elm, tag);
	}


/*************************************************************************************/
}//end class
