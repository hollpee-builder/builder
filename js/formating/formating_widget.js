var Widget = new Widget();
function Widget() {
	this.attr = {};
	this.attr.type = "data-hlp-widget-type";
	this.attr.name = "data-hlp-widget-name";

	/**
	* Фиксируем виджет
	*
	* @see 	Html.formating()
	*/
	this.set = function(buffer)
	{
		// фиксируем элементы
		this.fixedElm(buffer);
		// для слайдера
		this.setSlider(buffer);
		// для gallery modal
		this.setGalleryModal(buffer);
	}

	this.fixedElm = function(buffer)
	{
		var listWidget = {};
		var listSlider = buffer.find(".hlp-slider");
		if (listSlider.length) listWidget["slider"] = {"type" : "slider"};
		
		var pageIndex = Formating.pageIndex;
		if (!Formating.site.pages[pageIndex]) Formating.site.pages[pageIndex] = {};
		Formating.site.pages[pageIndex]["widget"] = listWidget;
	}

	this.setSlider = function(buffer)
	{
		buffer.find(".hlp-slider-list-bullets").html('');
	}

	this.setGalleryModal = function(buffer)
	{
		var listGalleryModalObj = buffer.find("*[data-hlp-widget-type='gallery_modal']");
		
		listGalleryModalObj.attr("data-hlp-widget-gm", "true");
	}

/**********************************************************************************/

} // end class


