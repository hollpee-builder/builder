/**
* Список
*
*
*/
StyleMenuList.prototype = StyleMenu;
var StyleMenuList = new StyleMenuList();
function StyleMenuList() {

	this.set = function(elm)
	{
		var styleUl = elm.css("list-style-type");
		styleUl = styleUl == "none" ? "no" : "yes";

		$(".menuBlockListStyle .menuButValue[value='"+styleUl+"']").attr("chosen", "true");
	}

	this.editStyle = function(elm, value)
	{	
		elm = elm.closest("ol, ul").find("> li").eq(0);

		if (value == "no") {
			elm.css("list-style-type", "none");
			ElementCss.set(false, elm);
		} else {
			ElementCss.clear("list-style-type", false, elm);
		}
	}

}
