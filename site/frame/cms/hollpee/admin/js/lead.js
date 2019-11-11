$(document).ready(function() {
	PageLead.setEvent();
});

var PageLead = new PageLead();
function PageLead() {
	this.oldNote = '';


	this.attr = {};
	this.attr.lead_id = "data-id";

	this.class = {};
	this.class.lead_item = "lead-item";

/***************************************************************************/	

	/**
	* Ставит событие
	*
	*
	*/
	this.setEvent = function()
	{
		// данные лида
		this.setEventShowData();
		// примечание
		this.setEventNote();
		// link
		this.setEventLink();
		// экспорт
		this.setEventExport();
		// filter
		this.setEventFilter();
		// delete
		this.setEventDelete();
		// reset new
		this.setEventResetStatusNew();
		// filter page
		this.setEventFilterPage();
		// поиск
		this.setEventSearch();
	}

/*********************************************************************************************/
	
	/**
	* Данные лида
	*
	* @see 	this.setEvent()
	*/
	this.setEventShowData = function()
	{
		var obj = this;
		$(".lead-but").off("mousedown");
		$(".lead-but").on("mousedown", function() {
			var elmEvent = $(this);
			var content = obj.getModalContent(elmEvent); 

			if (elmEvent.hasClass("lead-data-but")) {
				var title = "Данные лида";
				// отмечаем лид как прочитаный
				obj.markLeadRead(elmEvent);
			} else {
				var title = "Информация об устройстве";
			}

			Modal.create({
				"id" : "modalLeadData",
				"title" : title,
				"width" : 450,
				"top" : 80,
				"content" : content
			});
		});
	}

	/**
	* Отдает содержимое модального окна - данные лида
	*
	* @see 	this.setEventAnalytics()
	*/
	this.getModalContent = function(elmEvent)
	{
		var data = elmEvent.prev().text();
		data = JSON.parse(data);

		var content = '';
		for (var kData in data) {
			var value = data[kData];
			content += '\
				<div class="lead-data-item">\
					<div class="lead-data-key">' + kData + ':</div>\
					<div class="lead-data-value">' + value + '</div>\
					<div class="clear"></div>\
				</div>';
		}

		return content;
	}

	/**
	* Отмечаем лид что он прочитан
	*
	* @see 	this.
	*/
	this.markLeadRead = function(elmEvent)
	{
		var leadObj = elmEvent.closest("tr");
		var leadStatusObj = leadObj.find(".lead-status");
		var status = leadStatusObj.attr("data-status");
		if (status != "new") return false;

		var leadId = leadObj.attr("data-id");
		
		var queryString = {"id":leadId};
		$.post("/" + ADMIN_FOLDER + "/lead/markLeadRead", queryString, function(data, status) {
			data = data.trim();
			if (!data) return false;

			leadStatusObj.attr("data-status", "read").text("Прочитан");

			var countLeadObj = $(".new-count-lead");
			var countNewLead = parseInt(countLeadObj.text());
			if (countNewLead == 1) countLeadObj.remove();
			else countLeadObj.text(countNewLead - 1);
		});
	}

/************************************************************************************************/

	/**
	* Примечание
	*
	* @see 	
	*/
	this.setEventNote = function()
	{
		var noteObj = $(".lead-note-canvas");
		var obj = this;

		noteObj.off("focus");
		noteObj.on("focus", function() {
			obj.oldNote = $(this).text().trim();
		});

		noteObj.off("focusout");
		noteObj.on("focusout", function() {
			var elmEvent = $(this);
			var newNote = elmEvent.text().trim();
			if (obj.oldNote == newNote) return false;

			var leadId = elmEvent.closest("tr").attr("data-id");
			var queryString = {"id":leadId, "note":newNote};
			$.post("/" + ADMIN_FOLDER + "/lead/editNote", queryString, function(data, status) {
				data = data.trim();
				
				if (data) Notification.ok("Примечание изменено!");
				else Notification.error();
			});
		});
	}


	this.setEventLink = function()
	{
		var obj = this;
		var listObj = $(".lead-item > td");
		listObj.off("mousedown");
		listObj.on("mousedown", function() {
			var leadItemObj = $(this).closest(".lead-item");
			var leadId = obj.getLeadId(leadItemObj);
			var leadHref = 'lead/detail?id='+leadId;
			
			var leadStatus = leadItemObj.find(".lead-status").attr("data-status");
			if (leadStatus == "new") leadHref += '&read=no';
			
			location.href = leadHref;
		});
	}

/************************************************************************************************/

	/**
	* Экспорт
	*
	* @see 	this.setEvent()
	*/
	this.setEventExport = function()
	{
		var obj = this;
		var butObj = $(".but-lead-export");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalExport();
		});
	}

	/**
	* Мольное - экспорт лидов
	*
	* @see 	this.setEventExport()
	*/
	this.showModalExport = function()
	{
		var content = this.getModalContentExport();
		
		Modal.create({
			"id" : "modalExport",
			"title" : "Экспорт лидов",
			"width" : "550",
			"top" : "50",
			"content" : content,
			"button" : [
				["cancel", "Закрыть"]
			]
		});
	}

	/**
	* Мольное - экспорт лидов
	*
	* @see 	this.showModalExport()
	*/
	this.getModalContentExport = function()
	{
		var content = '\
			<div class="export-block">\
				<div class="export-block-label">XML</div>\
				<div class="export-block-desc">\
				</div>\
				<a href="lead/export?type=xml" class="export-block-but">Скачать</a>\
			</div>\
			<div class="export-block">\
				<div class="export-block-label">XLSX</div>\
				<div class="export-block-desc">\
				</div>\
				<a href="lead/export?type=xlsx" class="export-block-but">Скачать</a>\
			</div>\
			<div class="export-block" style="display:none;">\
				<div class="export-block-label">CSV</div>\
				<div class="export-block-desc">\
				</div>\
				<a href="lead/export?type=csv" class="export-block-but">Скачать</a>\
			</div>\
			<div class="export-block" style="display:none;">\
				<div class="export-block-label">vCard</div>\
				<div class="export-block-desc">\
				</div>\
				<a href="lead/export?type=vcf" class="export-block-but">Скачать</a>\
			</div>\
		';

		return content;
	}
	


	/**
	* Фильтер
	*
	* @see 	this.setEvent()
	*/
	this.setEventFilter = function()
	{

	}

	/**
	* Удаление
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		var butObj = $(".but-lead-delete-wrap");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var leadId = obj.getLeadId($(this));	

			var label = "Подтвердите удаление лида";
			Modal.confirmationDelete(label, function() {
				obj.deleteLead(leadId);
			});
			return false;
		});
	}

	this.deleteLead = function(leadId)
	{
		var leadObj = this.getLeadObj(leadId);
		leadObj.css("display", "none");

		var property = {"lead_id": leadId};
		$.post("lead/delete", property, function(res) {
			res = res.trim();
			// console.log(res)
				
			if (res) {
				leadObj.remove();
				Notification.ok("Лид удален");
			} else {
				leadObj.css("display", "block");
				Notification.error();
			}
		});
	}

/************************************************************************************************/
	
	/**
	* Сбросить статус new
	*
	* @see 	this.setEvent()
	*/
	this.setEventResetStatusNew = function()
	{
		var obj = this;
		var butObj = $(".but-reset-new");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.resetStatusNew();				
			return false;
		});
	}

	this.resetStatusNew = function()
	{
		var obj = this;
		var label = 'Подтвердите сброс статуса "Новый"';
		Modal.confirmationDelete(label, function() {
			$.post("lead/resetStatusNew", {}, function(res) {
				res = res.trim();
					
				if (res) {
					$(".lead-status[data-status='new']")
							.attr("data-status", "read")
							.text("Прочитан")
							.closest(".lead-item")
							.attr("data-status", "read");

					$(".new-count-lead").remove();

					Notification.ok("Статус сброшен");
				} else {
					Notification.error();
				}
			});
		}, "Сбросить");
	}

/************************************************************************************************/
	
	/**
	* Фильтровать лиды для страницы
	*
	* @see 	this.setEvent()
	*/
	this.setEventFilterPage = function()
	{
		var selectObj = $(".filter-page");
		selectObj.off("change");
		selectObj.on("change", function() {
			var newPage = $(this).val();
			var newHref = 'lead';
			if (newPage) newHref += '?page_id=' + newPage;

			location.href = newHref;
		});
	}

/************************************************************************************************/


	this.getLeadId = function(elm)
	{
		var leadItemClass = this.getClassLead();
		var attrLeadId = this.getAttrLeadId();
		return elm.closest("."+leadItemClass).attr(attrLeadId);
	}

	this.getLeadObj = function(leadId)
	{
		var leadItemClass = this.getClassLead();
		var attrLeadId = this.getAttrLeadId();
		var listLeadItem = $("."+leadItemClass);

		var leadObj = listLeadItem.filter("["+attrLeadId+"='"+leadId+"']");

		return leadObj;
	}

	this.getAttrLeadId = function()
	{
		return this.attr.lead_id;
	}

	this.getClassLead = function()
	{
		return this.class.lead_item;
	}


/************************************************************************************************/
	
	this.setEventSearch = function()
	{
		var butObj = $(".filter-but-search");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var type = $(".search-type").val();
			var value = $(".search-value").val();

			if (type == "phone") value = value.replace(/[^0-9]+/gim, '');

			var href = "lead?search-type="+type+"&search-value="+value;
			butObj.attr("href", href);
		});
	}

/************************************************************************************************/

} // end class
