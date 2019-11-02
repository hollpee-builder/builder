$(document).ready(function() {
	PageAccount.setEvent();
});

/******************************************************************************************/
var PageAccount = new PageAccount();
function PageAccount() {
	/**
	* Ставит события
	*
	*
	*/
	this.setEvent = function()
	{
		// изменение пароля
		this.setEventEditPsw();
		this.setEventEditProperty();
	}

/******************************************************************************************/

	/**
	* Изменение пароля
	*
	* @see 	this.setEvent()
	*/
	this.setEventEditPsw = function()
	{
		var obj = this;
		$(".account-edit-psw").off("mousedown");
		$(".account-edit-psw").on("mousedown", function() {
			var elmEvent = $(this);
			// создаем модальное
			obj.createModalEditPsw(elmEvent);
			// событие - изменение пароля
			obj.eventSaveEditPsw();

			return false;
		});
	}

	/**
	* Создание модального - изменить 
	*
	* @see 	this.setEventEditPsw()
	*/
	this.createModalEditPsw = function()
	{
		var content = this.getContentModalEditPsw();

		Modal.create({
			"title":"Изменить пароль",
			"id":"modalEditPsw",
			"content":content,
			"width":500,
			"top":100,
			"button":[
				["cancel","Отмена"],
				["ok","Изменить пароль"]
			]
		});
	}

	/**
	* Отдает контент модального окна - изменить пароль
	*
	* @see 	this.createModalEditPsw()
	*/
	this.getContentModalEditPsw = function()
	{
		var content = '\
			<div class="row-psw">\
				<div class="row-psw-label">Старый пароль</div>\
				<input type="password" name="old-password" input-type="password" class="psw-value value-ol-psw" />\
			</div>\
			<div class="row-psw">\
				<div class="row-psw-label">Новый пароль</div>\
				<input type="password" name="new-password" input-type="password" class="psw-value newPsw" />\
			</div>\
			<div class="row-psw">\
				<div class="row-psw-label">Подтвердить пароль</div>\
				<input type="password" name="confirm-password" input-type="password" class="psw-value confirm-psw" />\
			</div>';

		return content;
	}


	/**
	* Сохранение изменения пароля
	*
	* @see 	this.setEventEditPsw()
	*/
	this.eventSaveEditPsw = function()
	{
		var obj = this;
		$("#modalEditPsw .hollpee-but-ok").off("mousedown");
		$("#modalEditPsw .hollpee-but-ok").on("mousedown", function() {
			var parInput = $("#modalEditPsw");

			// делаем проверку
			var resVerify = Form.verify(parInput);
			if (!resVerify) return false;
			
			// проверка на совпадение
			var newPsw = $("input[name='new-password']").val();
			var inputConfirm = $("input[name='confirm-password']");
			var confirmPsw = inputConfirm.val();

			// если не совпадают
			if (newPsw != confirmPsw) {
				Form.setError(inputConfirm, "Пароли не совпадают");
				return false;
			}

			var oldPsw = $("input[name='old-password']").val();

			// изменяем пароль
			obj.editPsw(oldPsw, newPsw);

			return false;
		});
	}

	/**
	* Изменить пароль
	*
	* @see 	this.eventSaveEditPsw()
	*/
	this.editPsw = function(oldPsw, newPsw)
	{		
		var queryString = {"old_psw":oldPsw, "new_psw":newPsw};

		$.post("/" + ADMIN_FOLDER + "/account/editPsw", queryString, function(data, status) {
			data = data.trim();
			
			if (data) {
				Notification.ok("Пароль изменен!");
				Modal.delete();
			} else {
				Notification.error();
			}
		});
	}
/*********************************************************************************************/
	/**
	* Изменение email
	*
	* 
	*/
	this.setEventEditProperty = function()
	{
		var obj = this;
		var butObj = $(".but-edit-property");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);

			var propertyLabel = elmEvent.attr("data-label");
			var propertyName = elmEvent.attr("data-name");
			var propertyValue = obj.getProperty(propertyName);

			obj.createModalEditProperty(propertyLabel, propertyValue);
			obj.setEventModalEditProperty(propertyName);
		});
	}

	this.createModalEditProperty = function(propertyLabel, propertyValue)
	{
		var content = '<input type="text" class="valueNewProperty" value="" />';

		Modal.create({
			"title":'Изменить параметр <b>'+propertyLabel+'</b>',
			"id":"modalEditProperty",
			"content":content,
			"width":500,
			"top":100,
			"button":[
				["cancel","Отмена"],
				["ok","Изменить"]
			]
		});

		$(".valueNewProperty").val(propertyValue);
	}

	this.setEventModalEditProperty = function(propertyName)
	{
		var obj = this;
		var butObj = $("#modalEditProperty .hollpee-but-ok");
		butObj.off("mousedown");
		butObj.on("mousedown", function(){
			var newValue = $(".valueNewProperty").val().trim();
			if (!newValue) {
				Notification.error("Введите параметр");
				return false;
			}
			obj.EditProperty(propertyName, newValue);
		});
	}

	this.EditProperty = function(propertyName, newValue)
	{		
		var obj = this;
		var queryString = {"value":newValue, "property":propertyName};
		$.post("/" + ADMIN_FOLDER + "/account/editProperty", queryString, function(data, status) {
			data = data.trim();
			
			if (data) {
				obj.setProperty(propertyName, newValue);
				Notification.ok("Параметр изменен!");
				Modal.delete();
			} else {
				Notification.error();
			}
		});
	}

	this.getPropertyObj = function(propertyName)
	{
		return $(".account-value-property[data-name='"+propertyName+"']");
	}

	this.getProperty = function(propertyName)
	{
		var obj = this.getPropertyObj(propertyName);
		return obj.text().trim();
	}

	this.setProperty = function(propertyName, newValue)
	{
		var obj = this.getPropertyObj(propertyName);
		obj.text(newValue);
	}

/******************************************************************************************/

} // end class
