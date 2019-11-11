/**
* В галерея в модальном
*
*
*/
var ElementWidgetGalleryModal = new ElementWidgetGalleryModal();
function ElementWidgetGalleryModal() {

	this.set = function(elm)
	{
		var blockNone = $(".menuWidgetGalleryModal .menuStyleBlockNone");
		var elmParentObj = elm.parent().closest("*[data-hlp-widget-type='gallery_modal']");
		if (elmParentObj.length) {
			blockNone.css("display", "block");	
			return false;
		} else {
			blockNone.css("display", "none");
		}

		var valueWork = elm.attr("data-hlp-widget-type") ? "yes" : "no";
		StyleMenu.chosenToggleBut($(".valueGalleryModalWork"), valueWork);

		var valueType = elm.attr("data-hlp-widget-name");
		if (!valueType) valueType = "gm1";
		StyleMenu.chosenToggleBut($(".valueGalleryModalType"), valueType);
	}

/*************************************************************************************/
/*************************************************************************************/
	
	this.editWork = function(elm, value)
	{
		var elmChildObj = elm.find(".element[data-hlp-widget-type='gallery_modal']");
		elmChildObj.removeAttr("data-hlp-widget-type");
		elmChildObj.removeAttr("data-hlp-widget-name");

		if (value == "yes") {
			elm.attr("data-hlp-widget-type", "gallery_modal");
			elm.attr("data-hlp-widget-name", "gm1");
		} else {
			elm.removeAttr("data-hlp-widget-type");
			elm.removeAttr("data-hlp-widget-name");
		}
	}

	this.editType = function(elm, value)
	{
		elm.attr("data-hlp-widget-type", "gallery_modal");
		elm.attr("data-hlp-widget-name", value);
	}

/*************************************************************************************/

} // end class
