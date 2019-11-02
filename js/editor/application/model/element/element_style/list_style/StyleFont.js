/**
* Добавление фона
*
*
*
*/
var StyleFont = new StyleFont();
function StyleFont() {
	/**
	* Статус установки шрифтов в редактор
	*
	* @set 	this.setFontInEditor()
	* @see 	Page.replacce()
	*/
	this.isSetEditor = false;

/*******************************************************************************************/	
	/**
	* Показывает модальное окно
	*
	* @see 	ElementStyleController.setEventAddFont()
	*/
	this.show = function()
	{
		// создаем модальное
		var content = this.getContent();
		content += this.getBlockEmpty();

		Modal.create({
			"id":"modalAddFont",
			"title":Resource.hlp_modal_font_title,
			"content":content,
			"width":600,
			"top":30,
			"button":[
				['ok', Resource.hlp_modal_font_but_ttf],
				['add', Resource.hlp_modal_font_but_google]
			]
		});

		// обновляем список шрифтов
		this.uploadListFont(true);

		//ставим события
		this.setEvent(); 
	}

	/**
	* Отдает содержимое 
	*
	* @see 	this.show()
	*/
	this.getContent = function()
	{
		// if (!countFont) return '<div class="emptyModalBlock">У вас нету добавленых шрифтов</div>';

		var content = '\
			<table class="tableFont">\
				<tr class="tableFontHeading">\
					<th class="tableFontNumber">№</th>\
					<th class="tableFontName">'+Resource.hlp_modal_font_table_name+'</th>\
					<th class="tableFontSource">'+Resource.hlp_modal_font_table_source+'</th>\
					<th class="tableFontMan"></th>\
				</tr>\
			</table>';
		content += "";

		return content;
	}
/*********************************************************************************************/
	/**
	* Отдает пустой блок
	*
	* @see 	this.show()
	*/
	this.getBlockEmpty = function()
	{
		var block = '<div class="emptyModalBlock">'+Resource.hlp_modal_font_label_empty+'</div>';
		return block;
	}

	/**
	* Ставит значение display пустому блоку
	*
	* @see 	this.uploadListFont()
	*/
	this.setDisplayEmptyBlock = function()
	{
		if ($(".tableOneFont").length) {
			var displayBlock = "none";
			var displayTable = "block";
		} else {
			var displayBlock = "block";
			var displayTable = "none";
		}

		$(".emptyModalBlock").css("display", displayBlock);
		$(".tableFont").css("display", displayTable);
	}

/********************************************************************************************/
	/**
	* Обновляет список шрифтов
	*
	* @see 	this.show()
	* @see 	this.setEventAddLink()
	* @see 	this.deleteFont();
	*/
	this.uploadListFont = function(noEditor)
	{
		// удаляем шрифты
		$(".tableOneFont").remove();

		// вставляем обновленный список
		var block = this.getBlockListFont();
		$("#modalAddFont table").append(block);//в модальное окно

		//ставим события
		this.setEvent();

		// ставим значение
		this.setDisplayEmptyBlock();
	}

	/**
	* Отдает блок списка шрифтов
	*
	* @see 	this.uploadListFont()
	*/
	this.getBlockListFont = function()
	{
		var listFont = Data.site.font;
		var i = 1;
		var blockGoogle = '';
		var blockLocal = '';
		for (var family in listFont) {
			var font = listFont[family];
			var row = this.getBlockFont(font, i);
			if (font["local"]) blockLocal += row;
			else blockGoogle += row; 

			i++;
		}

		var block = blockGoogle + blockLocal;
		return block;
	}

	/**
	* Отдает блок одного шрифта
	*
	* @see 	this.getBlockListFont()
	*/
	this.getBlockFont = function(font, number)
	{
		if (font["local"]) {
			var fontSource = Resource.hlp_modal_font_type_local;
			var butEditObjV = '';
		} else {
			var fontSource = "Google Fonts";
			var butEditObjV = '<div class="butManFont butEditFont">'+Resource.main_modal_but_edit+'</div>';
		}

		var row = '\
				<tr class="tableOneFont" data-place="'+font["local"]+'" font="'+font.family+'">\
					<td class="tableFontNumber">'+number+'</td>\
					<td class="tableFontName" style="font-family:'+font.family+';">'+font.family+'</td>\
					<td class="tableFontSource">'+fontSource+'</td>\
					<td class="tableFontMan">\
						<div class="butManFont butDeleteFont">'+Resource.hlp_modal_font_but_delete+'</div>\
						'+butEditObjV+'\
					</td>\
				</tr>';

		return row;
	}
/*************************************************************************************************/
/***************************************************************************************************/
	/**
	* Ставим события
	*
	* @see 	this.show()
	*/
	this.setEvent = function()
	{
		// добавление
		this.setEventAdd();
		// удаление
		this.setEventDelete();
		// изменение
		this.setEventEdit();
		
		// инструкция
		this.setEventUpload();
	}
/**********************************************************************************************/
	/**
	* Добавление шрифта
	*
	* @see 	this.setEvent()
	*/
	this.setEventAdd = function()
	{
		var obj = this;
		var butAdd = $("#modalAddFont .butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			// показываем модальное окно
			obj.showModalAdd();
		});

		// butAdd.mousedown();
	}

	/**
	* Показывает модальное окно для добавление шрифта
	*
	*
	* @see 	this.setEventAdd()
	*/
	this.showModalAdd = function(value, typeOperationV, fontNameV)
	{
		// создаем модальное
		var id = "modalAddLinkFont";
		var placeholder = "<link href='https://fonts.googleapis.com/css?family=Noto+Sans&subset=latin,cyrillic' rel='stylesheet' type='text/css'>";
		if (!value) value = '';
		var content = '\
			<div class="modalLabel modalAddFontLabel">'+Resource.hlp_modal_font_google_label+' <a href="https://www.google.com/fonts" target="_blank">Google Fonts</a></div>\
			<textarea class="valueAddedFontLink">'+value+'</textarea>';
			
		if (typeOperationV == "edit") {
			var titleV = Resource.hlp_modal_font_modal_title_edit+" "+fontNameV;
			var butTextAddV = Resource.main_modal_but_edit;
		} else {
			var titleV = Resource.hlp_modal_font_modal_title_add;
			var butTextAddV = Resource.main_modal_but_add;
		}

		Modal.create({
			"id":id,
			"title":titleV,
			"content":content,
			"width":650,
			"top":50,
			"button":[['add', butTextAddV]]
		});

		// ставим события
		var modal = $("#"+id);
		this.setEventAddLink(modal);
	}

	/**
	* Событие добавление ссылки шрифта
	*
	* @see 	this.showModalAdd()
	*/
	this.setEventAddLink = function(modal)
	{
		var obj = this;
		var butAdd = modal.find(".butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var input = modal.find(".valueAddedFontLink");
			var isAdd = obj.addLinkFont(input);

			// выводим результат 
			if (isAdd) {
				Modal.removeLast();
				Notification.ok(Resource.hlp_modal_font_notification_add);
				
				obj.fixedChange();

				// обновляем значение текста
				StyleMenuText.set();
			} else { 
				Notification.error(Resource.hlp_modal_font_notification_no_add);
			}
		});
	}

	/**
	* Добавление ссылки фона
	*
	* @see 	this.setEventAddLink()
	* @see 	Data.addListStdFont()
	* @see 	Site.
	*/
	this.addLinkFont = function(elmInput, linkFont)
	{
		if (elmInput && !linkFont) linkFont = elmInput.val();
		
		var hrefFont = linkFont.match(/href=['"]([^"']+)['"]/gim)[0];
		if (!hrefFont) return false;
		
		hrefFont = hrefFont.replace(/'|"/gim, '');
		var propertyString = hrefFont.split("?")[1];
		if (!propertyString) return false;
		
		var listProperty = this.getPropertyLink(propertyString);
		Data.site.font[listProperty.family] = listProperty;

		return true;
	}

	/**
	* Отдает параметры из строки
	*
	*
	* @see 	this.addLinkFont() 
	*/
	this.getPropertyLink = function(propertyString)
	{
		var listProperty = propertyString.split("&");
		var countProperty = listProperty.length;
		var property = {};
		var noSubset = true;
		for (var i = 0; i < countProperty; i++) {
			var propertyItem = listProperty[i].split("=");
			var key = propertyItem[0];
			var value = propertyItem[1];
			// если шрифт
			if (key == "family") {
				var propertyFamily = value.split(":");
				var family = propertyFamily[0].replace(/\+/gim, " ");
				property["family"] = family;

				// ставим тощину
				if (propertyFamily[1]) {
					var weightV = propertyFamily[1];
					var listWeightResV = weightV.split(",");
					var listWeightV = {};
					for (var iWeightV in listWeightResV) {
						var weightItemV = parseInt(listWeightResV[iWeightV]);
						listWeightV[weightItemV] = "yes";
					}
					property["weight"] = listWeightV;
				}
			} else if (key == "subset") { //языки
				property["latin"] = value.match(/latin/) ? true : false;
				property["cyrillic"] = value.match(/cyrillic/) ? true : false;
				noSubset = false;
			}

			if (noSubset) property["latin"] = true;
		} 

		var link = "<link href='https://fonts.googleapis.com/css?"+propertyString+"' rel='stylesheet' type='text/css'>";
		property["link"] = link;

		return property;
	}
/**********************************************************************************************/
	/**
	* Событие удалить шрифт
	*
	* @see 	this.setEvent()
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		var butDelete = $(".butDeleteFont");
		butDelete.off("mousedown");
		butDelete.on("mousedown", function() {
			var elmEvent = $(this);
			var fontName = elmEvent.closest("tr").attr("font");
			var label = Resource.hlp_modal_font_confirmation_delete + " " + fontName;
			Modal.confirmationDelete(label, function() {
				// если шрифт локально
				if (Data.site.font[fontName]["local"]) {
					obj.deleteFontLocal(fontName);
				} else {
					obj.deleteFont(fontName);
				}
			});
		});
	}

	/**
	* Удаление шрифта локально
	*
	* @see 	this.setEventDelete()
	*/ 
	this.deleteFontLocal = function(fontName)
	{
		var obj = this;
		Modal.removeLast();
		Modal.createLoading(Resource.hlp_modal_font_load_delete);
		ajaxPost('/editor/deleteFont', "font_name="+fontName+"&site_id="+Data.site.site_id, function(req) {
			var res = req.responseText.trim();
			// console.log(res)
			if (res) {
				obj.deleteFont(fontName);
			} else {
				Notification.error();
			}

			Modal.removeLast();		
		})
	}

	/**
	* Удаление шрифта
	* 
	* @see 	this.setEventDelete()
	*/
	this.deleteFont = function(fontName)
	{
		// удаляем шрифт
		delete Data.site.font[fontName];
		// фиксируем изменение
		this.fixedChange();
	}
/**************************************************************************************/
	
	/**
	* Изменить
	*
	* @see 	this.setEvent()
	*/
	this.setEventEdit = function()
	{
		var obj = this;
		var butObj = $(".butEditFont");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var fontFamilyV = $(this).closest(".tableOneFont").attr("font");
			var fontLinkV  = Data.site.font[fontFamilyV]["link"];

			obj.showModalAdd(fontLinkV, "edit", fontFamilyV);
		});
	}


/************************************************************************************/
/*********************************************************************************************/

	/**
	* Событие - инструкция
 	*
	* @see 	this.setEvent() 
	*/
	this.setEventUpload = function()
	{
		var obj = this;
		var modalObj = $("#modalAddFont");
		modalObj.find(".butOk").addClass("h-but-upload-file");
		var parentBut = modalObj.find(".modalBlockButtton");

		File.createButUpload(parentBut, '', "/editor/uploadFonts", "font", Data.site.site_id, function(res) {
			// убираем загрузку
			Modal.deleteLoadind();

			var fontName = res.replace(/\.ttf$/gim, '');

			if (!fontName) {
				Notification.error();
				return false;
			}
			
			obj.addFontLocal(fontName);

			// обновляем список
			obj.fixedChange();

			Notification.ok(Resource.hlp_modal_font_notification_add);
		});	
	}

	/**
	* Добавляет local шрифт 
	*
	* @see 	this.setEventUpload()
	* @see 	Site.setForNewSiteFont()
	*/
	this.addFontLocal = function(fontName)
	{
		Data.site.font[fontName] = {
			"family" : fontName,
			"latin" : true,
			"link" : false,
			"local" : true
		}
	}

/***************************************************************************************************/
/**********************************************************************************************/
	/**
	* Устанавливает шрифты в редактор 
	*
	* @see 	this.
	* @see 	this.setEventAddLink()
	* @see 	this.deleteFont()
	* @see 	this.setEventUpload()
	* @see 	Page.replacce()
	*/
	this.setFontInEditor = function() 
	{
		var listFont = Data.site.font;
		// ставимт шрифты заголовок
		this.setFontInHead(listFont);
		// ставит шрифты в меню
		this.setFontInMenu(listFont);

		// отмечаем статус
		this.isSetEditor = true;
	}

	/**
	* Ставит шрифты в заголовке
	*
	* @see 	this.setFontInEditor()
	* @see 	
	*/
	this.setFontInHead = function(listFont)
	{
		var listGoogle = '';
		var listLocal = '<style>';
		for (var family in listFont) {
			var font = listFont[family];
			if (!font.local) {
				listGoogle += font["link"];
				// var fontSrc = font["link"];
				// fontSrc = /href=("|')([^"']+)("|')/gim.exec(fontSrc);
				// fontSrc = fontSrc[2];
				// fontSrc = fontSrc.replace(/\s/gim, '+');
				// listLocal += "@import url("+fontSrc+");\r\n";
			} else {
				var fontFamily = font["family"];
				var userId = Data.userId;
				var fontPath = "/user/" + userId +"/"+Data.site.site_id+"/fonts/"+fontFamily+"/" + fontFamily + ".ttf"; 
				listLocal += "\r\n@font-face { font-family: "+fontFamily+"; src: url("+fontPath+") format('opentype');}\r\n"; 
			}
		}
		listLocal += '</style>';	
		
		// google fonts 
		$(".headListAddedFontGoogle").html(listGoogle);
		// локально шрифт 
		$(".headListAddedFontLocal").html(listLocal);
	}


	/**
	* Ставит шрифты в меню
	*
	* @see 	this.setFontInEditor()
	* @see 	this.uploadListFont()
	*/
	this.setFontInMenu = function(listFont)
	{
		var list = '';
		for (var family in listFont) {
			list += '<div class="option" value="'+family+'" style="font-family:'+family+'">'+family+'</div>';
		}
		$(".menuListAddedFont").html(list);
	}

	/**
	* Зафиксировать изменение
	*
	* @see 	this.deleteFont()
	* @see 	this.setEventUpload()
	*/
	this.fixedChange = function()
	{
		// обновляем список
		this.uploadListFont();
		// обновляем в редакторе
		this.setFontInEditor();
		// сохраняю
		// User.save();
		Site.saveFont();
	}
/************************************************************************************************/
} // end class

