$(document).ready(function() {
	Integration.init();

	Tip.setEvent();
});

var Integration = new Integration();
function Integration() {
	this.curIntegrationType = '';
	this.curIntegration = {};
	this.listIntegrationApi = {};
	this.listIntegrationApiValue = {};
	this.listPages = {};
	this.listValueTemporary = {};

	this.getCurIntegrationType = function()
	{
		return this.curIntegrationType;
	}

	this.getListValueApi = function()
	{
		return this.listIntegrationApiValue;
	}

	this.getListPages = function()
	{
		return this.listPages;
	}

	this.getFirstPageId = function()
	{
		for (var pageId in this.getListPages()) break;
		return pageId;
	}

	this.getClassListPages = function()
	{
		return "value-cur-pages";
	}

	this.getListValueTemporary = function()
	{
		return this.listValueTemporary;
	}

	this.resetListValueTemporary = function()
	{
		this.listValueTemporary = {};
	}

	this.setListValueTemporary = function(list)
	{
		list = JSON.parse(JSON.stringify(list));
		this.listValueTemporary = list;
	}


/**********************************************************************************/

	this.init = function()
	{
		this.initApi();
	}

	this.initApi = function()
	{
		this.setProperty();
		this.setEventEditApi();
	}

	/**
	* Устанавливаем параметры
	*
	* @see 	this.init()
	*/
	this.setProperty = function()
	{
		var jsonListApi = $(".json-list-integration-api").html().trim();
		this.listIntegrationApi = JSON.parse(jsonListApi);

		var jsonListApiValue = $(".json-list-integration-api-value").html().trim();
		jsonListApiValue = jsonListApiValue.replace(/\[\]/gim, '{}');
		this.listIntegrationApiValue = JSON.parse(jsonListApiValue);

		var jsonListPages = $(".json-list-pages").html().trim();
		this.listPages = JSON.parse(jsonListPages);

		this.setStatusRunning();
	}

	/**
	* Статус работы
	*
	* @see 	this.setProperty()
	* @see 	this.saveInstegrationApi()
	*/
	this.setStatusRunning = function()
	{
		var listValue = this.getListValueApi();
		var listStatus = {};
		for (var pageId in listValue) {
			var listValuePage = listValue[pageId];
			for (var integrationType in listValuePage) {
				var integration = listValuePage[integrationType];
				var runningStatus = integration["running"];

				if (listStatus[integrationType] != 'yes') {
					listStatus[integrationType] = runningStatus;
				}
			}
		}

		for (var integrationType in listStatus) {
			var runningStatus = listStatus[integrationType];
			$(".integration-item-plagin[data-type='"+integrationType+"']").attr("data-running", runningStatus);
		}
	}

/**********************************************************************************/	
	
	/**
	* ДОбавление нового сервиса
	*
	* @see 	this.initApi()
	*/
	this.addNewService = function()
	{
		var butBlock = '\
			<div class="integration-item integration-item-add-plagin h-but-upload-file">\
				<span class="integration-item-text">Добавить интеграцию</span>\
			</div>';
		var butParentObj = $(".integration-list-but");
		var url = "/" + ADMIN_FOLDER + "/integration/uploadNewApi";

		File.createButUpload(butParentObj, butBlock, url, "integration", function(data){
			if (data.trim()) {
				location.reload();
			} else {
				Notification.error();
			}
		});
	}

	/**
	* Ставит события
	*
	* @see 	this.addBlockAllIntegrationApi()
	*/
	this.setEventEditApi = function()
	{
		var obj = this;
		var butObj = $(".integration-item-plagin").not("[data-no-activite='yes']");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			var integrationType = elmEvent.attr("data-type");
			var firsPageId = "all_pages";
			obj.curIntegrationType = integrationType;
			
			obj.setListValueTemporary(obj.listIntegrationApiValue);
			obj.createModalIntegrationApi(integrationType, firsPageId);
		});
	}

	this.setEventApi = function()
	{
		this.setEventSaveInstegrationApi();
		this.setEventInstructionApi();
		this.setEventDeleteApi();
		this.setEventRunningApi();
		this.setEventListPages();
		this.setEventAdded();
	}
	
/*************************************************************************************/
	
	/**
	* Включение плагина
	*
	* @see 	this.setEventEditApi()
	*/
	this.setEventRunningApi = function()
	{
		var obj = this;
		var butObj = $(".modal-integration-but-running");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var runningType = $(this).attr("data-running");
			butObj.parent().attr("data-status", runningType);

			obj.saveInstegrationApiProperty();
		});
	}

	/**
	* Стандартное модальное
	*
	* @see 	this.createModalIntegration()
	*/
	this.createModalIntegrationApi = function(integrationType, pageId)
	{
		var integration = this.listIntegrationApi[integrationType];
		var content = this.getModalContentApi(integration, integrationType, pageId);

		Modal.create({
			"id" : "modalIntegration",
			"title" : "Интеграция с " + integration["label"],
			"width" : 500,
			"top" : 40,
			"content" : content,
			"button" : [
				["ok", "Сохранить"],
				["cancel", "Отмена"],
			]
		});

		$("."+this.getClassListPages()).val(pageId);

		this.setEventApi();

		this.addAddedBlock(integrationType);
	}


	this.getModalContentApi = function(integration, integrationType, pageId)
	{
		var list = integration["list_property"];
		this.setDefaultValue(pageId, integrationType);

		// временный список, для сохранения перед переключениями
		var listAllValue = this.getListValueTemporary();
		var integrationValue = listAllValue[pageId][integrationType];
		var listValue = integrationValue["list_property"];
		var content = this.getListPagesBlock();

		content += '\
				<div class="modal-integration-block modal-integration-block-running" data-status="'+integrationValue['running']+'">\
					<div class="modal-integration-but-running" data-running="no">Выключенная</div>\
					<div class="modal-integration-but-running" data-running="yes">Включенная</div>\
					<div class="clear"></div>\
				</div>';

		for (var iKey in list) {
			var property = list[iKey];
			var noRequired = property['optional'];

			var statusRequired = noRequired ? '<span class="integration-input-no-required">(не обязательный)</span>' : '';
			var statusRequiredAttr = noRequired ? 'data-no-required="true"' : '';

			var value = listValue[iKey];
			if (!value) value = '';

			content += '\
				<div class="modal-integration-block">\
					<div class="modal-integration-label">'+property['label']+statusRequired+'</div>\
					<input type="text" value="'+value+'" data-index="'+iKey+'" data-type="'+integrationType+'" '+statusRequiredAttr+' class="modal-integration-input value-integration-'+property[0]+'" />\
				</div>\
			';
		}

		return content;
	}

	this.setDefaultValue = function(pageId, integrationType)
	{
		if (!this.listValueTemporary[pageId]) this.listValueTemporary[pageId] = {};
		if (!this.listValueTemporary[pageId][integrationType]) {
			this.listValueTemporary[pageId][integrationType] = {};
			this.listValueTemporary[pageId][integrationType]["list_property"] = {};
			this.listValueTemporary[pageId][integrationType]['running'] = "no";
		}
	}

	this.getListPagesBlock = function()
	{
		var listPagesOption = '';
		listPagesOption += '<option value="all_pages">Все страницы</option>';

		var listPages = this.getListPages();
		for (var pageId in listPages) {
			var page = listPages[pageId];
			var pageName = page["file"];
			listPagesOption += '<option value="'+pageId+'">'+pageName+'</option>';
		}

		var block = '<select class="'+this.getClassListPages()+'">'+listPagesOption+'</select>';
		
		return block;
	}
	

/*******************************************************************************/

	/**
	* Сохранение
	*
	* @see 	this.setEventSaveIntegrationKey()
	*/
	this.setEventSaveInstegrationApi = function(params)
	{
		var obj = this;
		var butObj = $("#modalIntegration .hollpee-but-ok");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var listInputObj = $(".modal-integration-input");
			var runningValue = $(".modal-integration-block-running").attr("data-status");

			// если включен
			if (runningValue == "yes") {
				var isValid = obj.verifyInput(listInputObj);
				if (!isValid) return false;
			}
			
			obj.saveInstegrationApiProperty();
			obj.saveInstegrationApi(obj.curIntegrationType);
			obj.setStatusRunning();

			Modal.delete();

			return false;
		});

		var inputObj = $("#modalIntegration .modal-integration-input");
		inputObj.off("change");
		inputObj.on("change", function() {
			obj.saveInstegrationApiProperty();
		});
	}

	this.saveInstegrationApiProperty = function()
	{
		var listInputObj = $(".modal-integration-input");
		var pageId = $("."+this.getClassListPages()).val();

		var params = {};
		var countInput = listInputObj.length;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputObj = listInputObj.eq(iInput);
			var inputIndex = inputObj.attr("data-index");
			var inputValue = inputObj.val().trim();
			inputValue = inputValue.replace(/^[;,:\-\.\s]+/, '');
			inputValue = inputValue.replace(/[;,:\-\.\s]+$/, ''); 

			this.listValueTemporary[pageId][this.curIntegrationType]['list_property'][inputIndex] = inputValue;
		}

		var runningValue = $(".modal-integration-block-running").attr("data-status");
		this.listValueTemporary[pageId][this.curIntegrationType]['running'] = runningValue;
	}

	/**
	* Проверяет поля
	*
	* @see 	this.setEventSaveInstegration()
	* @see 	this.
	*/
	this.verifyInput = function(listInputObj)
	{
		$(".error-label").remove();
		listInputObj = listInputObj.not('[data-no-required="true"]');

		var countInput = listInputObj.length;
		var isValid = true;
		for (var iInput = 0; iInput < countInput; iInput++) {
			var inputObj = listInputObj.eq(iInput);
			var inputValue = inputObj.val();
			if (!inputValue) {
				inputObj.after('<div class="error-label">Поле не заполнено</div>');
				isValid = false;
			}
		}
		
		return isValid;
	}

	this.saveInstegrationApi = function(integrationType)
	{
		this.listIntegrationApiValue = JSON.parse(JSON.stringify(this.getListValueTemporary()));
		var property = JSON.stringify(this.listIntegrationApiValue);
		var params = {"name" : integrationType, "property" : property};
		var obj = this;
		var url = "/" + ADMIN_FOLDER + "/integration/saveApi";
		$.post(url, params, function(data, status) {
			data = data.trim();
			console.log(data)

			if (data) {
				Notification.ok("Интеграция сохранена");
			} else {
				Notification.error();
			}
		});
	}

/*********************************************************************************/	

	/**
	* Инструкция
	*
	* @see 	this.setEventEditApi()
	*/
	this.setEventInstructionApi = function()
	{
		var obj = this;
		var butObj = $(".h-modal-block .hollpee-but-instruction");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalInstructionApi();
		});
	}

	/**
	* Показывает модальное инструкция
	*
	* @see 	this.setEventInstruction()
	*/
	this.showModalInstructionApi = function()
	{
		var integration = this.listIntegrationApi[this.curIntegrationType];
		var videoId = integration["tutorial"];
		var name = integration["label"];
		var content = '<iframe id="modalVideoFrame" src="http://www.youtube.com/embed/'+videoId+'?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>';

		Modal.create({
			"id" : "modalIntegrationTutorial",
			"title" : "Инструкция - интеграция с " + name,
			"width" : 600,
			"top" : 40,
			"content" : content,
		});
	}

	/**
	* Удаление страницы
	*
	* @see 	this.setEvent()
	*/
	this.setEventDeleteApi = function()
	{
		var obj = this;
		var butDelete = $(".hollpee-but-delete");
		butDelete.off("mousedown");
		butDelete.on("mousedown", function() {
			if (butDelete.attr("data-no-active")) return false;

			var name = obj.listIntegrationApi[obj.curIntegrationType]["name"];
			Modal.confirmationDelete("Подтвердите удаление " + name);
			obj.confirmationDeleteApi($(this));
		});
	}

	/**
	* Подтвержения удаления
	*
	* @see 	this.setEventDelete()
	*/
	this.confirmationDeleteApi = function(butEvent)
	{
		var obj = this;
		$("#confirmationDelete .hollpee-but-delete").off("mousedown");
		$("#confirmationDelete .hollpee-but-delete").on("mousedown", function() {

			var url = "/" + ADMIN_FOLDER + "/integration/deleteApi";
			var params = {"service" : obj.curIntegrationType};

			$.post(url, params, function(data, status) {
				data = data.trim();
				
				if (data) {
					Notification.ok("Интеграция удалена");
					delete obj.listIntegrationApi[obj.curIntegrationType];
					butEvent.remove();
					$(".integration-item[data-type='"+obj.curIntegrationType+"']").remove();
				} else {
					Notification.error();	
				}

				Modal.delete();
			});
		});
	}

/***********************************************************************************/
	/**
	* Изменение страницы
	*
	* @see 	this.setEventPai
	*/
	this.setEventListPages = function()
	{
		var obj = this;
		var selObj = $("."+this.getClassListPages());
		selObj.off("change");
		selObj.on("change", function() {
			var pageId = $(this).val();

			Modal.delete();
			obj.createModalIntegrationApi(obj.getCurIntegrationType(), pageId);
		});
	}

/********************************************************************************/
	
	/**
	* Дополнительные события
	*
	* @see 	this.setEventApi()
	*/
	this.setEventAdded = function()
	{
		var type = this.getCurIntegrationType();
		if (type == 'bitrix24') {
			this.setEventAddedBitrix24();
		}
	}

	this.setEventAddedBitrix24 = function()
	{
		var inputObj = $("#modalIntegration input[data-index='subdomain']");
		inputObj.off("paste");
		inputObj.on("paste", function(e) {
			var inputEvent = $(this);
			setTimeout(function() { 
				var subdomain = inputEvent.val();
				subdomain = subdomain.replace(/^https?:\/\//gim, '');
				subdomain = subdomain.match(/^[^\.]+/gim);
				if (subdomain) inputEvent.val(subdomain[0]);
			}, 100);
		});
	}

/**************************************************************************************/
/**************************************************************************************/
	/** 
	* Добавление дополнительного блока
	*
	* @see 	this.createModalIntegrationApi()
	*/
	this.addAddedBlock = function(integrationType)
	{
		if (integrationType == "robokassa") {
			var block = this.getAddBlockRobokassa();
		} else if (integrationType == "rbkmoney") {
			var block = this.getAddBlockRbkmoney();
		} else {
			var block = '';
		}

		$("#modalIntegration .h-modal-block-cont").append(block);
	}


	this.getAddBlockRobokassa = function()
	{	
		var title = 'Result Url';
		var name = 'Robokassa';
		return this.getAddBlockPayment(title, name);
	}

	this.getAddBlockRbkmoney = function()
	{
		var title = 'Оповещение о платеже';
		var name = 'RbkMoney';
		return this.getAddBlockPayment(title, name);
	}

	this.getAddBlockPayment = function(title, name)
	{
		var host = location.host;
		var folder = $(".site-folder").html().trim();
		var url = 'http://'+host+'/'+folder+'/admin/payment/callback'+name;
		var block = '\
			<div class="modal-integration-block-info">\
				<div class="modal-integration-label">'+title+':</div>\
				<div class="modal-integration-result-url">'+url+'</div>\
			</div>\
		';

		return block;
	}

/**************************************************************************************/

} // end class

