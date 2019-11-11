/**
* 
*
*
*/
StyleMenuFilter.prototype = StyleMenu;
var StyleMenuFilter = new StyleMenuFilter();
function StyleMenuFilter() {

	this.listProperty = {
		"blur":{"unit":"px", "maxval":"50"},
		"brightness":{"minval":"1", "maxval":"10"},
		"contrast":{"minval":"1","maxval":"50"},
		"grayscale":{"maxval":"1"},
		"hue-rotate":{"unit":"deg", "maxval":"360"},
		"invert":{"maxval":"10"},
		"opacity":{"maxval":"10"},
		"saturate":{"maxval":"50"},
		"sepia":{"maxval":"1"},
	}

	this.getUnit = function(typeV)
	{
		var unitV = this.listProperty[typeV]["unit"];
		if (!unitV) unitV = "";

		return unitV;
	}

	this.valueExt = function(typeV)
	{
		var propV = this.listProperty[typeV];
		var minval = propV["minval"];
		if (!minval) minval = 0;
		var maxval = propV["maxval"];
		if (!maxval) maxval = 100;

		$(".valueStyleFilterValue")
				.attr("maxval", maxval)
				.attr("minval-positive", minval);
	}

/*********************************************************************************/

	this.set = function(elm)
	{
		var list = this.getProperty(elm.css("filter"));
		var typeV = list["filter-type"];
		var valueV = list["filter-value"];
		
		Select.set($(".selectStyleVilterType"), typeV);
		var inputObj = $('.valueStyleFilterValue');
		inputObj.val(valueV);
		this.valueExt(typeV);
		StyleMenu.setScroll(inputObj);
	}

	this.getProperty = function(filterV)
	{
		var pat = /^([\w\-]+)\(([^)]+)\)/gim;
		var list = pat.exec(filterV);
		if (!list) list = {"1":"blur", "2":"0px"};

		var typeV = list[1];
		var valueV = list[2];

		if (typeV == "invert" || typeV == "opacity") {
			valueV = valueV * 10;
		}

		var itemV = {
			'filter-type':typeV, 
			'filter-value':valueV,
		};

		return itemV;
	}

/*********************************************************************************/
	this.editType = function(elm, typeV, elmEvent)
	{
		var inputValueV = $(".valueStyleFilterValue");
		inputValueV.val("1");
		this.valueExt(typeV);
		StyleMenu.setScroll(inputValueV);
		
		this.edit(elm, typeV, elmEvent);
	}


	this.edit = function(elm, value, elmEvent)
	{
		var typeV = Select.get($(".selectStyleVilterType"));
		$(".valueStyleFilterType").val(typeV);

		var numV = $(".valueStyleFilterValue").val();
		if (typeV == "invert" || typeV == "opacity") {
			numV = numV / 10;
		}

		var unitV = this.getUnit(typeV);
		var filterValueV = typeV + "("+numV+unitV+")"; 
		elm.css("filter", filterValueV);
			
		this.set(elm);
	}

/********************************************************************************************/

} //end class

