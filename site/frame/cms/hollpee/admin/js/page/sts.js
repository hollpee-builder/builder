$(document).ready(function() {
	PageDetailSts.init();
});

var PageDetailSts = new PageDetailSts();
function PageDetailSts() {
	this.listVisit = {};
	this.listLead = {};
	this.listCountVisit = {};
	this.listCountLead = {};
	this.curVariantId = 'all';

	this.class = {};
	this.class.but_date_detail = "butStsDateDetail";

	this.listMonth = {
		"0" : "Января",
		"1" : "Февраля",
		"2" : "Марта",
		"3" : "Апреля",
		"4" : "Мая",
		"5" : "Июня",
		"6" : "Июля",
		"7" : "Августа",
		"8" : "Сентября",
		"9" : "Октября",
		"10" : "Ноября",
		"11" : "Декабря"
	};

/*************************************************************************************/	

	this.init = function()
	{
		this.setProperty();
		this.setTabVariant();

		this.setSts();
		this.setEvent();
	}

	this.setProperty = function(listVisit, listLead)
	{
		var listVisitJson = $("#listVisitJson").html().trim();
		if (listVisitJson) this.listVisit = JSON.parse(listVisitJson);
		else this.listVisit = {};

		var listLeadJson = $("#listLeadJson").html().trim();
		if (listLeadJson) this.listLead = JSON.parse(listLeadJson);
		else this.listLead = {};

		this.abtest = PageDetailAbtest.abtest;

		this.setCount();
	}


	this.getListLead = function()
	{
		return this.listLead;
	}

	this.getListVisit = function()
	{
		return this.listVisit;
	}

	this.getSiteId = function()
	{
		return this.siteId;
	}

	this.setListCountVisit = function(listCountVisit)
	{
		this.listCountVisit = listCountVisit;
	}

	this.getListCountVisit = function()
	{
		return this.listCountVisit;
	}

	this.setListCountLead = function(listCountLead)
	{
		this.listCountLead = listCountLead;
	}

	this.getListCountLead = function()
	{
		return this.listCountLead;
	}

	this.setCurVariantId = function(variantId)
	{
		this.curVariantId = variantId;
	}

	this.getCurVariantId = function()
	{
		return this.curVariantId;
	}

	this.getButDateDetailHtml = function()
	{
		var butClass = this.getButDateDetailClass();
		var block = '';  
		block += '<span data-type="utm" class="'+butClass+'">по источникам</span>';

		return block;
	}

	this.getButDateDetailClass = function()
	{
		return this.class.but_date_detail;
	}

	this.getButDateDetailObj = function()
	{
		var butClass = this.getButDateDetailClass();
		return $("."+butClass);
	}

	/**
	* Отдает дату ввиде строки
	*
	* @see 	this.getListCount()
	*/
	this.getDateStr = function(itemDate)
	{
		var dateObj = new Date(itemDate*1000);
		var date = dateObj.getDate() +" "+ this.listMonth[dateObj.getMonth()];
		
		return date;
	}

	this.getDateStrFromRow = function(elm)
	{
		var row = this.getElmRow(elm);
		var dateStr = row.find(".sts-date-name").text();
		return dateStr;
	}

	this.getElmRow = function(elm)
	{
		return elm.closest(".tableRow");
	}

/*******************************************************************************/

	this.setCount = function()
	{
		listCountVisit = this.getListCount("visit");
		this.setListCountVisit(listCountVisit);

		listCountLead = this.getListCount("lead");
		this.setListCountLead(listCountLead);
	}

	this.getListCount = function(type)
	{
		if (type == "visit") var listItem = this.getListVisit();
		else if (type == "lead") var listItem = this.getListLead();
		else return {};

		var allCount = listItem.length;

		var dateKey = type == "visit" ? "date_visit" : "date_add";
		var listValueAll = false;
		var isExistst = false;
		var listSts = {};

		for (var iItem in listItem) {
			var item = listItem[iItem];
			var variantId = item["variant_id"];
			isExistst = true;

			// по умолчанию
			if (!listSts[variantId]) listSts[variantId] = this.getDefaultSts();
			if (!listValueAll) listValueAll = this.getDefaultSts();

			// дата
			var date = this.getDateStr(item[dateKey]);
			if (!listSts[variantId][date]) listSts[variantId][date] = 0;
			listSts[variantId][date] = listSts[variantId][date] + 1;
			
			if (!listValueAll[date]) listValueAll[date] = 0;
			listValueAll[date] = listValueAll[date] + 1;
		}

		if (!listValueAll) listValueAll = this.getDefaultSts();
		listSts["all"] = listValueAll;

		return listSts;
	}

	this.getDefaultSts = function()
	{
		var listValue = {};
		return listValue;
	}

	this.setTabVariant = function()
	{
		var content = '<div class="stsTabVariant" data-variant="" data-chosen="true">Все</div>';

		var countPage = 0;
		for (var variantId in this.listCountVisit) {
			if (!this.listPages[variantId]) continue;
			var variantName = this.listPages[variantId]["file"];

			content += '<div class="stsTabVariant" data-variant="'+variantId+'">'+variantName+'</div>';			
			countPage++;
		}

		content += '<div class="clear"></div>';
		var listObj = $(".stsListTabVariant");

		if (countPage > 1) {
			listObj.html(content);
			listObj.css("display", "block");
		} else {
			listObj.css("display", "none");
		}
	}

/***************************************************************************************/
	
	/**
	* Установка значений статистики
	*
	* @see 	this.init()
	*/
	this.setSts = function(variantId)
	{
		// по датам
		this.setStsItem(variantId);
		this.setStsAdded();
	}

	this.setStsItem = function(variantId)
	{
		var siteId = this.getSiteId();
		if (!this.listCountVisit[siteId]) return false;

		if (!variantId) variantId = 'all';
		this.setCurVariantId(variantId);

		var content = '';
		var list = {};
		for (var pageId in this.abtest["list"]) {
			var listOne = this.listCountVisit[pageId];
			for (var keyOne in listOne) {
				list[keyOne] = true;
			}
		}

		var listCountVisit = this.getListCountVisit();
		var listCountLead = this.getListCountLead();
		var butDateDetailHtml = this.getButDateDetailHtml();

		for (var key in list) {
			var countVisit = 0;
			var countLead = 0;

			var pageVisit = listCountVisit[variantId][key];
			var pageLead = listCountLead[variantId][key];
			if (pageVisit) countVisit += pageVisit;
			if (pageLead) countLead += pageLead;

			var conversion = this.mathConversion(countVisit, countLead);
			var name = '<div class="sts-date-name">'+key+'</div>' + butDateDetailHtml; 

			content += this.getStsRow(key, name, countVisit, countLead, conversion);
		}

		this.addStsCanvas(content);
	}

	this.setStsAdded = function()
	{
		// ограничение на 30 дней
		var listItem = $(".tableStat[data-type='date'] .tableContent .tableRow");
		var countItem = listItem.length;
		for (var iItem = 30; iItem < countItem; iItem++) {
			listItem.eq(iItem).remove();
		}		
	}

	this.mathConversion = function(countVisit, countLead)
	{
		if (countVisit && countLead) {
			var conversion = (countLead / countVisit) * 100;
			conversion = conversion.toFixed(2);
		} else {
			var conversion = 0;
		}

		return conversion;
	}

	this.getStsRow = function(leadId, name, countVisit, countLead, conversion)
	{
		var row = '\
			<div class="tableRow" data-id="'+leadId+'">\
				<div class="tableCell" data-type="name">\
					<span>'+name+'</span>\
				</div>\
				<div class="tableCell" data-type="user">\
					<span>'+countVisit+'</span>\
				</div>\
				<div class="tableCell" data-type="lead">\
					<span>'+countLead+'</span>\
				</div>\
				<div class="tableCell" data-type="conversion">\
					<span>'+conversion+'%</span>\
				</div>\
				<div class="clear"></div>\
			</div>\
		';

		return row;
	}

	this.addStsCanvas = function(content)
	{
		var block = '\
			<div class="table tableStat">\
				<div class="tableRow tableRowH">\
					<div class="tableCell" data-type="name">\
						<span></span>\
					</div>\
					<div class="tableCell" data-type="user">\
						<span>Посетители</span>\
					</div>\
					<div class="tableCell" data-type="lead">\
						<span>Лиды</span>\
					</div>\
					<div class="tableCell" data-type="conversion">\
						<span>Конверсия</span>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="abtestContent tableContent">\
					'+content+'\
				</div>\
			</div>\
		';

		$(".pageSts").html(block);
	}

/***************************************************************************************/
/***************************************************************************************/
	
	/**
	*
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		this.setEventGroup();
		this.setEventVariant();
		this.setEventDateDetail();
		this.setEventResetSts();
	}

	this.setEventGroup = function()
	{
		var listGroupItem = $(".pageStsGroupItem");
		listGroupItem.off("mousedown");
		listGroupItem.on("mousedown", function() {
			listGroupItem.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");	

			$(".pageStsList").attr("data-type", $(this).attr("data-type"));

			return false;
		});
	}

	this.setEventVariant = function()
	{
		var obj = this;
		var listButVariant = $(".stsTabVariant");
		listButVariant.off("mousedown");
		listButVariant.on("mousedown", function() {
			listButVariant.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");	

			obj.setSts($(this).attr("data-variant"));

			return false;
		});
	}

/***************************************************************************************/
		
	/**
	* По дате подробние
	*
	* @see 	this.setEvent()
	*/	
	this.setEventDateDetail = function()
	{
		var obj = this;
		var butObj = this.getButDateDetailObj();
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			obj.showModalDateDetail(elmEvent);	
			return false;
		});
	}

	/**
	* Модальное дата детально
	*
	* @see 	this.setEventDateDetail()
	*/
	this.showModalDateDetail = function(elmEvent)
	{
		var detailType = elmEvent.attr("data-type");

		var dateStr = this.getDateStrFromRow(elmEvent);
		var content = this.getModalDateDetailContent(dateStr, detailType);
		var title = 'Подробней по дате <b>"'+dateStr+'"</b>';

		Modal.create({
			"id" : "modalStsDateDetail",
			"title" : title,
			"width":"700",
			"top":"50",
			"content":content,
			"button":[
				["cancel", "Закрыть"]
			]
		});
	}

	/**
	* Содержимое модального
	*
	*  @see this.showModalDateDetail()
	*/
	this.getModalDateDetailContent = function(dateStr, detailType)
	{
		var listRow = this.getDateDetailContentListRow(dateStr, detailType);

		var typeStr = "Источник";

		var content = '\
			<div class="table tableRowDateDetail" data-type="">\
				<div class="tableRow tableRowH">\
					<div class="tableCell" data-type="date_detail_src">\
						<span>'+typeStr+'</span>\
					</div>\
					<div class="tableCell" data-type="date_detail_visit">\
						<span>Посетители</span>\
					</div>\
					<div class="tableCell" data-type="date_detail_lead">\
						<span>Лиды</span>\
					</div>\
					<div class="tableCell" data-type="date_detail_conversion">\
						<span>Конверсия</span>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="abtestContent tableContent">\
					'+listRow+'\
				</div>\
			</div>\
		';

		return content;
	}

	/**
	* Список рядов
	*
	* @see 	this.getModalDateDetailContent()
	*/
	this.getDateDetailContentListRow = function(dateStr, detailType)
	{
		var listVisit = this.getListVisit();
		var listLead = this.getListLead();

		var listVisitSrc = this.getDateDetailListItemSrc(listVisit, dateStr, detailType);
		var listLeadSrc = this.getDateDetailListItemSrc(listLead, dateStr, detailType);

		var list = '';
		for (var itemId in listVisitSrc) {
			if (itemId == "no") var itemStr = "Нет источника";
			else var itemStr = itemId;
			
			var visit = listVisitSrc[itemId];
			if (!visit) visit = 0;
			var lead = listLeadSrc[itemId];
			if (!lead) lead = 0;

			if (visit && lead) {
				var conversion = lead / visit * 100;
				conversion = parseFloat(conversion.toFixed(2));
			} else {
				var conversion = "0";
			}
			conversion += '%';

			list += '\
				<div class="tableRow">\
						<div class="tableCell" data-type="date_detail_src">\
							<span>'+itemStr+'</span>\
						</div>\
						<div class="tableCell" data-type="date_detail_visit">\
							<span>'+visit+'</span>\
						</div>\
						<div class="tableCell" data-type="date_detail_lead">\
							<span>'+lead+'</span>\
						</div>\
						<div class="tableCell" data-type="date_detail_conversion">\
							<span>'+conversion+'</span>\
						</div>\
					<div class="clear"></div>\
				</div>\
			';	
		}

		return list;
	}

	this.getDateDetailListItemSrc = function(listItem, dateStr, detailType)
	{
		var listItemSrc = {};
		for (iItem in listItem) {
			var item = listItem[iItem];
			var dateItem = item['date_add'];
			if (!dateItem) dateItem = item['date_visit'];
			var dateStrItem = this.getDateStr(dateItem);
			if (dateStr != dateStrItem) continue;

			var itemId = item["utm_source"];
			if (!itemId) itemId = "no";

			if (!listItemSrc[itemId]) listItemSrc[itemId] = 0;
			listItemSrc[itemId] += 1;
		}

		return listItemSrc;
	}

/***************************************************************************************/
	
	this.getSrcId = function(elmEvent)
	{
		return elmEvent.closest(".tableRow").attr("data-id");
	}

/***************************************************************************************/
	
	/**
	* Сброс статистики
	*
	*
	*/
	this.setEventResetSts = function()
	{
		var obj = this;
		var butObj = $(".butResetSts");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.resetSts();

		});
	}

	this.resetSts = function()
	{
		var obj = this;
		var label = "Подтвердите сброс статистики";
		Modal.confirmationDelete(label, function() {
			var pageId = obj.getSiteId();
			var params = {"page_id":pageId};

			Modal.createLoading("Сбрасываю статистику");

			$.post("page/resetSts", params, function(res) {
				res = res.trim();

				console.log(res)
					
				if (res) {
					location.reload();
					// Notification.ok("Статистика сброшена");
				} else {
					Notification.error();
					Modal.delete();
				}
			});
		}, "Сбросить");
	}
	
/***************************************************************************************/

} // end class
