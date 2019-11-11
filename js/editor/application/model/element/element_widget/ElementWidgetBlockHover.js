/**
* Виджет слайдер
*
*
*/
var ElementWidgetBlockHover = new ElementWidgetBlockHover();
function ElementWidgetBlockHover() {
	this.class = "hlp-block-hover";
	this.attrAnimate = "data-widget-h1-animate";
	this.inputAnimateSelector = "selectWidgetHoverAnimate";

	this.set = function(elm)
	{
		this.setAnimate(elm);
	}

	this.setAnimate = function(elm)
	{
		var value = elm.closest("."+this.class).attr(this.attrAnimate);
		Select.set($("."+this.inputAnimateSelector), value);
	}

	this.editAnimate = function(elm, value)
	{
		elm = elm.closest("."+this.class); 
		elm.attr(this.attrAnimate, value);
	}

	this.editImg = function(elm, value, elmEvent)
	{
		elmEvent.removeAttr("chosen");

		var imgObj = Element.obj.closest("."+this.class).find("img");
		var srcV = imgObj.attr("src"); 

		var params = {
			"operation" : "edit_image",
			"src" : srcV,
			"obj" : imgObj
		}

		EditElementImage.edit(params);
	}

} // end class
