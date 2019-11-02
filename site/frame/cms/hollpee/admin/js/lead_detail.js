$(document).ready(function() {
	PageLeadDetail.init();
});

var PageLeadDetail = new PageLeadDetail();
function PageLeadDetail() {
	this.leadId = '';
	this.listStatusName = {};
	this.lead = {};

	this.init = function()
	{
		this.setProperty();
		this.setEvent();
	}

	this.setProperty = function()
	{
		var leadJson = $("#leadJson").text().trim();
		var lead = JSON.parse(leadJson);
		this.lead = lead;
		this.leadId = lead['id'];

		var listStatusNameJson = $("#listStatusNameJson").text().trim();
		var listStatusName = JSON.parse(listStatusNameJson);
		this.listStatusName = listStatusName;
	}

	/**
	* Event
	*
	* @see 	this.init()
	*/
	this.setEvent = function()
	{
		this.setEventEditLeadData();
		this.setEventUploadStatus();
	}

	/**
	* Событие - изменение данных лида
	*
	* @see 	this.setEvent()
	*/
	this.setEventEditLeadData = function()
	{
		var obj = this;
		var inputObj = $(".valueLeadData");
		inputObj.off("change");
		inputObj.on("change", function() {
			var elmEvent = $(this);
			var newValue = elmEvent.val();
			var dataType = elmEvent.attr("data-type");

			var property = {
				"lead_id":obj.leadId,
				"type":dataType,
				"value":newValue
			};
			$.post("../lead/editLeadData", property, function(res) {
				res = res.trim();
					
				if (res) {
					Notification.ok("Изменение сохранено");
				} else {
					Notification.error();
				}
			});
		});
	}

	/**
	* Обновление статуса 
	*
	* @see 	this.setEvent()
	*/
	this.setEventUploadStatus = function()
	{
		var obj = this;
		var inputObj = $(".butAddNewStatus");
		inputObj.off("click");
		inputObj.on("click", function() {
			var newStatus = $(".valueNewStatus").val();
			var statusComment = $(".valueNewStatusComment").val();

			var property = {
				"lead_id":obj.leadId,
				"status":newStatus,
				"comment":statusComment
			};
			$.post("../lead/uploadStatus", property, function(res) {
				res = res.trim();
					
				if (res) {
					Notification.ok("Статус обновлен");
					obj.addNewStatusBlock(newStatus, statusComment);
					$(".valueNewStatusComment").val('');
				} else {
					Notification.error();
				}
			});

			return false;
		});
	}

	/**
	* Добавление нового статуса на страницу
	*
	* @see 	this.setEventUploadStatus()
	*/
	this.addNewStatusBlock = function(newStatus, statusComment)
	{
		var now = new Date();
		var utc = now.toJSON().slice(0,10);
		var hour = now.getHours();
   	 	var minute = now.getMinutes();
    	var second = now.getSeconds(); 
		var dateFull = utc +" "+ hour+":"+minute+":"+second;

		var block = '\
			<tr class="tr">\
				<td class="td tdDate">'+dateFull+'</td>\
				<td class="td tdStatus">'+this.listStatusName[newStatus]+'</td>\
				<td class="td tdComment">'+statusComment+'</td>\
			</tr>\
		';

		$(".tableListStatus tr:first").after(block);
	}

} // end class
