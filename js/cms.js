$(document).ready(function() {
	PageCms.init();
});

var PageCms = new PageCms();
function PageCms() {

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	}

/************************************************************************************/

	this.setProperty = function()
	{
		// this.createBut("white");
		// this.createBut("black");
	}

	this.createBut = function(type)
	{
		var obj = this;
		var parentBut = $(".brandingLogoButWrap");//[data-type='"+type+"']
		var butHtml = '<div class="brandingLogoBut brandingButEdit h-but-upload-file">'+Resource.but_edit+'</div>';
		File.createButUpload(parentBut, butHtml, '/cms/logoUpload', "img", type, function(res) {
			res = res.trim();
			if (res) obj.replaceLogo(res);
			Modal.delete();
		});
	}

	this.replaceLogo = function(listLogoJson)
	{	
		var listLogo = JSON.parse(listLogoJson);
		var listObj = $(".brandingLogoImg");

		var curTime = new Date().getTime();

		for (var type in listLogo) {
			var logoSrc = listLogo[type];
			logoSrc += "?id=" + curTime;
			var imgObj = listObj.filter("[data-type='"+type+"']");
			imgObj.attr("src", logoSrc);
		}

		// console.log("Replate image type: "+type);
	}

/************************************************************************************/

	this.setEvent = function()
	{
		this.setEventLogoUpload();
		this.setEventLogoDelete();
	}

	this.setEventLogoUpload = function()
	{
		var obj = this;
		var butObj = $(".brandingButEdit")
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var butEvent = $(this);
			var type = butEvent.parent().attr("data-type");
			butObj.remove();
			obj.createBut(type);
			obj.setEventLogoUpload();
		});
	}

	this.setEventLogoDelete = function()
	{
		var obj = this;
		var butObj = $(".brandingButDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var type = $(this).attr("data-type");
			Modal.confirmationDelete(false, function() {
				Modal.delete();
				Modal.createLoading("Удаляю логотип");

				$.post("/cms/logoDelete", {"type" : type}, function(res) {
					var res = res.trim();
					
					if (res)  {
						obj.replaceLogo(res);
					} else {
						Notification.error(Resource.main_notification_error);
					}
					
					Modal.delete();
				});
			})
		});
	}

/************************************************************************************/

} // end class
