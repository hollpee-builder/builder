$(document).ready(function() {		
	Screen.setEvent();
	Tip.setEvent();
});

var Screen = new Screen();
function Screen() {
	/**
	* Ставим события
	*
	*
	*/
	this.setEvent = function()
	{
		this.setEventScreen();
		this.setEventMode();
		this.setEventResize();
		this.setEventHidePanel();
	}

	this.setEventResize = function()
	{
		$(window).off("resize");
		$(window).on("resize", function() {
			$(".screen[data-screen='desktop']").mousedown();
		});
	}

	this.setEventScreen = function()
	{
		var obj = this;

		$(".screen").off("mousedown");
		$(".screen").on("mousedown", function() {
			var screenType = $(this).attr("data-screen");
			var oldScreenType = $(".screen[chosen='true']").attr("data-screen");
			var siteObj = $(".wrap-site");

			// отмечаем кнопку
			$(".screen").removeAttr("chosen");
			$(".screen[data-screen='"+screenType+"']").attr("chosen", "true");
			// удаляем стиль
			siteObj.removeAttr("style");

			// для стандартного размера экрана
			siteObj.attr("data-screen", screenType).removeAttr("data-size");

			// изменилось устройство
			if (!(screenType.match(/^tab/) && oldScreenType.match(/^tab/))
					&& !(screenType.match(/^mobile/) && oldScreenType.match(/^mobile/))) {
				
				// ставим тип устройства в select
				var device = screenType.replace(/\-[\w]$/, '');
				$(".select-screen-mode").attr("data-device", device);

				// ставим в select стандартное значение
				$(".current-mode").text(Resource.page_show_chosen_model);
				$(".screen-mode").removeAttr("chosen");

				//ставим info
				obj.setModeInfo();
			} else {
				var currentModeObj = $(".screen-mode[chosen='true']");
				obj.setSize(currentModeObj);
			}

			return false;
		});
	}

	/**
	* Изменение модели
	*
	* @see 	this.setEvent()
	*/
	this.setEventMode = function()
	{
		var obj = this;

		$(".screen-mode").off("mousedown");
		$(".screen-mode").on("mousedown", function() {
			var elmEvent = $(this);
			
			obj.setSize(elmEvent);
			$(".current-mode").text(elmEvent.text());

			$(".screen-mode").removeAttr("chosen")
			elmEvent.attr("chosen", "true");

			// ставим информацию о модели
			obj.setModeInfo(elmEvent);

			return false;
		});
	}
/****************************************************************************************/
	this.setEventHidePanel = function()
	{
		var obj = this;
		$(".but-close").off("mousedown");
		$(".but-close").on("mousedown", function() {
			obj.hidePanel();
			return false;
		});

		// $(document).off("keydown");
		// $(document).on("keydown", function(ev) {
		// 	var keyCode = ev.keyCode;
		// 	console.log(keyCode)
		// 	if (keyCode == 27) {
		// 		if ($(".top-panel").css("display") == "block") obj.hidePanel();
		// 		else obj.showPanel();
		// 	}
		// });
	}

	this.hidePanel = function()
	{
		$(".top-panel").css("display", "none");
		$(".wrap-site").removeAttr("style")
						.removeAttr("data-screen")
						.css("padding-top", "0")
						.attr("no-panel", "true");
	}

	this.showPanel = function()
	{
		$(".top-panel").css("display", "block");
		$(".wrap-site").css("padding-top", "50px");
	}

/**************************************************************************************/

	/**
	* Устанавливаем размер
	*
	* @see 	this.setEventMode()
	*/
	this.setSize = function(modeObj)
	{
		var currentScreen =  $(".wrap-site").attr("data-screen");
		var isLandscape = currentScreen.match(/\-l$/);
		var modePropertion = this.getModeProportion(modeObj);

		var modeSize = parseFloat(modeObj.attr("data-size"));
		if (!modeSize) modeSize = parseFloat(modeObj.attr("data-i-diagonal"));

		if (isLandscape) modeSize = modeSize * modePropertion;
		
		if (currentScreen.match(/^mobile/)) modeSize *= 70; 
		else modeSize *= 80;

		if (modeSize > 1024) modeSize = 1024;

		$(".wrap-site").width(modeSize);
	}

	/**
	* Отдает значение пропорции
	*
	* @see 	this.setSize()
	*/
	this.getModeProportion = function(modeObj)
	{
		var modePropertion = modeObj.attr("data-proportion");
		if (!modePropertion) {
			modePropertion= modeObj.closest(".list-mode-value").attr("data-proportion");
		}

		return parseFloat(modePropertion);
	}


	/**
	* Ставит информацию о модели 
	*
	* @see 	this.setEventMode()
	* @see 	this.setEventScreen()
	*/
	this.setModeInfo = function(modeObj)
	{
		if (modeObj) {
			$(".mode-info").removeClass("display-none");
		} else {
			$(".mode-info").addClass("display-none");
			return false;
		}

		var modeScreen = modeObj.attr("data-i-screen");
		var modeDiagonal = modeObj.attr("data-i-diagonal");
		var modeSize = modeObj.attr("data-i-size");
		var modeOs = modeObj.parent().attr("data-i-os");

		$(".mode-info-value[data-type='screen']").text(modeScreen);
		$(".mode-info-value[data-type='diagonal']").text(modeDiagonal);
		$(".mode-info-value[data-type='size']").text(modeSize);
		$(".mode-info-value[data-type='os']").text(modeOs);
	}
/***************************************************************************************/	

}// end class





