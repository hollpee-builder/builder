/**
* Карта
*
*/
var EditElementMap = new EditElementMap();
function EditElementMap() {
	this.defaultZoom = 15;
	this.valueZoomMax = 21;
	this.valueZoomMin = 2;

	/**
	*
	*
	*
	*/
	this.edit = function(params)
	{
		if (!params) params = {};
		this.operator = params.operation;

		this.createModal();
		this.setEvent();
	}

/*********************************************************************************************/
	/**
	* Создает модальное окно
	*
	* @see 	this.edit()
	*/
	this.createModal = function()
	{
		var modalTitle = this.operator == "add" ? Resource.hlp_modal_map_title_add : Resource.hlp_modal_map_title_edit;

		var modalContent = this.getContent();
		Modal.create({
			'id':'modalMap',
			'title':modalTitle,
			'width':500,
			'top':50,
			'content':modalContent,
			'button':[
				['add', Resource.main_modal_but_instruction],
				['ok', Resource.main_modal_but_save],
				['cancel', Resource.main_modal_but_cancel],
			]
		});
	}


	/**
	* Отдает содержимое модального
	*
	* @see 	this.edit()
	*/
	this.getContent = function()
	{
		if (this.operator == "add") {
			var mapsCodeV = '';
			var mapsZoomV = this.defaultZoom;
		} else {
			var mapsSrcV = Element.obj.find(".selfElementBlackout").attr("data-src");
			var mapsCodeV = '<iframe src="'+mapsSrcV+'" width="640" height="480"></iframe>';
			var mapsZoomV = mapsSrcV.match(/&z=[0-9]+/gim);
			if (mapsZoomV) mapsZoomV = mapsZoomV[0].replace(/[^0-9]+/gim, '');
			else mapsZoomV = this.defaultZoom;
		}

		var modalContent = '\
			<div class="modalMapsListItem">\
				<div class="modalMapsItem">\
					<a class="modalMapsLink" target="_blank" href="https://www.google.com/maps/d/">'+Resource.hlp_modal_map_code_placeholder+'</a>\
					<div class="modalMapsItemValue">\
						<textarea class="modalMapsCode">'+mapsCodeV+'</textarea>\
					</div>\
					Zoom '+Resource.hlp_modal_map_label_zoom+'(от '+this.valueZoomMin+' до '+this.valueZoomMax+')\
					<input type="text" value="'+mapsZoomV+'" class="valueModalMapsZoom"/>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return modalContent;
	}

/*************************************************************************************************/
	/**
	* Устанавливает события
	*
	* @see 	this.edit()
	*/
	this.setEvent = function()
	{
		// сохранение
		this.setEventSave();
		// инструкция
		this.setEventInstruction();
	}

	/**
	* Сохранение
	*
	* @see 	this.setEventSave()
	*/
	this.setEventSave = function()
	{
		var obj = this;

		$("#modalMap .butOk").off("mousedown");
		$("#modalMap .butOk").on("mousedown", function() {
			var mapInputObj = $(".modalMapsCode");
			var codeValue = mapInputObj.val().trim();

			if (!codeValue.match("google")) {
				mapInputObj.val("");
				alert("Можно добавлять только карты Google")
				return false;
			}



			// изменяем значение
			codeValue = /src=("|')([^'"]+)("|')/gim.exec(codeValue);
			if (!codeValue || !codeValue[2]) {
				Notification.error(Resource.hlp_modal_map_notification_add_no_valid);
				return false;
			}

			// console.log(codeValue)
			// return false;

			// ставим размер
			codeValue = codeValue[2].replace(/width=[0-9]+%?/i, "width=100%");
			codeValue = codeValue.replace(/height=[0-9]+%?/i, "height=100%");

			// zoom
			var mapsZoomV = parseInt($(".valueModalMapsZoom").val());
			if (!mapsZoomV) mapsZoomV = obj.defaultZoom;
			else if (mapsZoomV < obj.valueZoomMin) mapsZoomV = obj.valueZoomMin;
			else if (mapsZoomV > obj.valueZoomMax) mapsZoomV = obj.valueZoomMax;
			codeValue = codeValue.replace(/&z=[0-9]+/gim, '');
			codeValue += "&z="+mapsZoomV;

			if (obj.operator == "add") {
				// создаем карту	
				ElementMap.mapSrc = codeValue;
				ElementMap.create();
			} else {
				var elm = Element.obj;
				elm.find(".selfElementBlackout").attr("data-src", codeValue);

				// перезагружаем для карты
				ElementMap.reloadCode(elm);		
				Modal.delete();
			}

			return false;
		});
	}

	/**
	* Инструкция
	*
	* @see 	this.setEvent()
	*/
	this.setEventInstruction = function()
	{
		$("#modalMap .butAdd").off("mousedown");
		$("#modalMap .butAdd").on("mousedown", function() {
			var content = '\
			<div class="modalInstruction">\
				<iframe id="modalVideoFrame" style="width:100%;" src="http://www.youtube.com/embed/h0A1p33ndhM?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
			</div>';

			Modal.create({
				'id':'modalMapInstruction',
				'title':Resource.hlp_modal_map_instruction_title,
				'width':500,
				'top':70,
				'content':content,
			});
		});
	}

/**********************************************************************************************/
}; //end class
