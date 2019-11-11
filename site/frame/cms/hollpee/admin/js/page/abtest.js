$(document).ready(function() {
	PageDetailAbtest.init();
});

var PageDetailAbtest = new PageDetailAbtest();
function PageDetailAbtest() {
	this.abtest = {};
	this.siteId = false;


	this.init = function()
	{
		this.setTableInPage();
		this.setEvent();
	}


	this.setTableInPage = function()
	{
		var block = '';

		var countVisitAll = 0;
		var countLeadAll = 0;

		var abtestListPage = this.abtest['list'];
		for (var abtestPageId in abtestListPage) {
			var abtestPage = abtestListPage[abtestPageId];

			if (abtestPage['running'] == 'yes') {
				var abtestItemChosenNo = '';
				var abtestItemChosenYes = 'data-chosen="true"';
			} else {
				var abtestItemChosenNo = 'data-chosen="true"';
				var abtestItemChosenYes = '';
			}

			if (!this.listPages[abtestPageId]) continue;
			var hrefUrlPage = this.listPages[abtestPageId]['file'];
			if (hrefUrlPage == "index.php") hrefUrlPage = '';

			/**/
			var abtestCountVisit = abtestPage['visit'] ? parseInt(abtestPage['visit']) : 0;
			var abtestCountLead = abtestPage['lead'] ? parseInt(abtestPage['lead']) : 0;

			if (abtestCountVisit && abtestCountLead) {
				var abtestConversion = (abtestCountLead / abtestCountVisit) * 100;
				abtestConversion = abtestConversion.toFixed(2);
			} else {
				var abtestConversion = 0;
			}

			countVisitAll += abtestCountVisit;
			countLeadAll += abtestCountLead;
			/**/


			if (abtestPageId == this.siteId) {
				var butDeleteHtml = '';
				var butRunningHtml = '';
			} else {
				var butDeleteHtml = '<div class="butAbtestDelete">Удалить</div>';
				var butRunningHtml = '\
					<div class="listButAbtestRunning">\
						<div class="butAbtestRunning" data-type="off" data-value="no" '+abtestItemChosenNo+'>Откл</div>\
						<div class="butAbtestRunning" data-type="on" data-value="yes" '+abtestItemChosenYes+'>Вкл</div>\
					</div>\
				';
			}

			block += '\
				<div class="tableRow abtestItem" data-id="'+abtestPageId+'">\
					<div class="abtestItemCell tableCell" data-type="variant">\
						<a href="../'+hrefUrlPage+'" class="abtestVariantLink" target="_blank">'+this.listPages[abtestPageId]['file']+'</a>\
						'+butRunningHtml+'\
						<div class="clear"></div>\
					</div>\
					<div class="abtestItemCell tableCell" data-type="user">\
						<span>'+abtestCountVisit+'</span>\
					</div>\
					<div class="abtestItemCell tableCell" data-type="lead">\
						<span>'+abtestCountLead+'</span>\
					</div>\
					<div class="abtestItemCell tableCell" data-type="conversion">\
						<span>'+abtestConversion+'%</span>\
					</div>\
					<div class="abtestItemCell tableCell" data-type="">\
						'+butDeleteHtml+'\
					</div>\
					<div class="clear"></div>\
				</div>\
			';
		}

		$(".abtestContentListVariant").html(block);
		
		if (countVisitAll && countLeadAll) {
			var countConversionAll = countLeadAll / countVisitAll * 100;
			countConversionAll = countConversionAll.toFixed(2);
		} else {
			var countConversionAll = 0;
		}
		$(".abtestCountUserAll span").html(countVisitAll);
		$(".abtestCountLeadAll span").html(countLeadAll);
		$(".abtestCountConversionAll span").html(countConversionAll+"%");
	}

/********************************************************************************/

	/**
	* Установака события
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		this.setEventRunning();
		this.setEventVariantAdd();
		this.setEventVariantDelete();
		this.setEventResetStat();
	}


	/**
	* Работа или не работа
	*
	* @see 	this.setEvent()
	*/
	this.setEventRunning = function()
	{
		var obj = this;
		var butObj = $(".butAbtestRunning");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var parentObj = $(this).closest(".abtestItem");
			var newValue = $(this).attr("data-value");

			parentObj.find(".butAbtestRunning").removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");

			var pageId = parentObj.attr("data-id");
			obj.abtest["list"][pageId]['running'] = newValue;

			obj.save();

			return false;
		});
	}

/********************************************************************************/

	/**
	* Добавление варианта
	*
	* 
	* @see 	this.setEvent()
	*/
	this.setEventVariantAdd = function()
	{
		var obj = this;
		var butObj = $(".butAbtestVariantAdd");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModaVariantAdd();
		});
	}

	this.showModaVariantAdd = function()
	{
		var content = this.getModalContentVariantAdd();

		Modal.create({
			"id" : "modalAbtestAddVariant",
			"title" : "Добавление варианта",
			"width" : 450,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Добавить"]
			]
		});

		this.setEventModalVariantAdd();
	}

	this.getModalContentVariantAdd = function()
	{
		var listPageHtml = '';
		for (var pageId in this.listPages) {
			if (pageId == this.siteId) continue;
			if (this.abtest['list'][pageId]) continue;

			var fileName = this.listPages[pageId]["file"];
			listPageHtml += '<option value="'+pageId+'">'+fileName+'</option>';
		}

		var content = '\
			Выберите страницу\
			<select name="" id="" class="valueAbtestVariantNew">'+listPageHtml+'</select>\
		';

		return content;
	}

	this.setEventModalVariantAdd = function()
	{
		var obj = this;
		var butObj = $("#modalAbtestAddVariant .hollpee-but-ok");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var newPageId = $(".valueAbtestVariantNew").val();
			
			obj.abtest['list'][newPageId] = {
				"running":"yes",
				"visit" : "0",
				"lead" : "0"
			}

			Modal.delete();

			obj.init();
			PageDetailSts.init();

			obj.save();
		});
	}

/********************************************************************************/

	this.setEventVariantDelete = function()
	{
		var obj = this;
		var butObj = $(".butAbtestDelete");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);

			Modal.confirmationDelete("Подтвердите удаление варианта", function() {
				var parentObj = elmEvent.closest(".abtestItem");
				var pageId = parentObj.attr("data-id");

				parentObj.remove();
				delete obj.abtest["list"][pageId];

				obj.init();
				PageDetailSts.init();

				obj.save();
			});
		});
	}

/********************************************************************************/

	this.setEventResetStat = function()
	{
		var obj = this;
		var butObj = $(".butAbtestResetStat");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			Modal.confirmationDelete("Подтвердите сброс статистики A/B теста", function() {
				
				for (var pageId in obj.abtest['list']) {
					obj.abtest['list'][pageId]['visit'] = '0';
					obj.abtest['list'][pageId]['lead'] = '0';
				}

				var listCell = $(".abtestContent .abtestItemCell");
				listCell.filter("[data-type='user'], [data-type='lead']").find("span").html('0');
				listCell.filter("[data-type='conversion']").find("span").html('0%');

				obj.save();
			}, "Сбросить");
		});
	}

/********************************************************************************/
	

	/**
	* Сохранение
	*
	* @see 	this.setEvent..()
	*/
	this.save = function()
	{
		var params = {
			"site_id":this.siteId,
			"abtest":JSON.stringify(this.abtest)
		};
		
		$.post("page/saveAbtest", params, function(res) {
			res = res.trim();
				
			if (res) {
				Notification.ok("Изменение сохранено");
			} else {
				Notification.error();
			}
		});
	}

} // end class

