/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
var EditElementImage = new EditElementImage();
function EditElementImage() {
	/**
	* @var 	array 	список картинок категории 
	* @set 	this.setImgCategory() при получении с сервера
	* @see 	this.replaceImgBlock()
	*/
	this.listImage = [];

	/**
	* @var 	string 	путь к картинке 
	* @set 	this.selected(), this.edit()
	* @see 	this.getElementHtml()
	*/
	this.src = '';
	/**
	* Тип выполняемой работы (add, edit_image, edit_bg)
	* @set 	this.add(), this.edit()
	* @see 	this.selected()
	*/
	this.type_operation = '';

	this.current_dir = '';
	this.old_dir = '';

	/**
	* Список заголовков
	*
	*/
	this.listTitle = {
		'img' : Resource.hlp_modal_image_label_type_image,
		'video' : Resource.hlp_modal_image_label_type_video
	};

	/**
	* Список ошибок для валидации
	*
	*
	*/
	this.listErrorValid = {
		"video" : {
			"type" : Resource.hlp_modal_image_error_video_type, 
			"size" : Resource.hlp_modal_image_error_video_size
		},
		"img" : {
			"type" : Resource.hlp_modal_image_error_image_type, 
			"size" : Resource.hlp_modal_image_error_image_size
		},
	};

	this.listCategory = {};
/************************************************************************/
	/**
	* Добавить элемент
	* 
	* @param 	string 		file_type
	* @param 	string 		src - путь картинки
	* @param 	string		operation - тип операции (add, edit_image, edit_bg)
	*
	* @see 	ElementAddController.setEvent()-add 
	* @see 	ElementEditController.setEvent()-edit_image
	* @see 	ElementStyleController.setEventBgImage()-edit_bg
	* @see 	StyleMenuBg.setEventBgVideo(), .setEventBgImage()
	* @see 	StyleMenuPageSetting.setEventFile()
	* @see 	ElementWidgetBlockHover.editImg()
	*/
	this.edit = function(params) {
		this.setProperty(params);

		//создаем модальное окно
		this.createModal();

		//эммитируем клик по вкладке чтбы поставились картинки
		this.setNewImgCategory();

		// делаем кнопку не активной, если добавление элемента
		if (this.isTypeOperationAdd()) this.setNoActButSave();
	}

/*********************************************************************************************/
	/**
	* Устанавливает параметры
	*
	* @see 	this.edit()
	*/
	this.setProperty = function(params)
	{
		// сбрасываем если разные типы
		if (params["file_type"] != this.fileType) {
			this.resetValueDir();
		}

		this.params = params;
		//установить тип манипуляции
		this.setTypeOperation(params['operation']);
		this.src = params['src'];
		if (!this.src) this.src = '';
		this.elm = params['obj'];
		
		// тип файла
		this.fileType = params.file_type;
		if (!this.fileType) this.fileType = 'img';

		// имя типа файла
		this.fileTypeName = this.listTitle[this.fileType];

		var siteId = params["site_id"];
		if (!siteId) siteId = Data.site.site_id;
		this.siteId = siteId;


		// ставим текущию группу
		this.setImgDir();
	}

	this.setImgDir = function()
	{
		if (this.isTypeOperationAdd() || !this.src) return false;

		var fileName = this.src.replace(/\/user\/[\w]+\/[\w]+\/img\//, '');

		fileName = fileName.replace(/\/?[^\/]+$/, '');

		this.setCurrentDir(fileName);
	}

	/**
	* Сброс значений директорий
	*
	* @see 	this.setProperty()
	* @see 	this.replaceImgBlock()
	*/
	this.resetValueDir = function()
	{
		this.setCurrentDir('');
		this.setOldDir('');
	}

/*******************************************************************************/

	this.isTypeOperationAdd = function()
	{
		var operationV = this.getTypeOperation();
		return operationV == "add";
	}

	this.getTypeOperation = function()
	{
		return this.type_operation;
	}

	this.setTypeOperation = function(operationV)
	{
		this.type_operation = operationV;
	}

	this.setCurrentDir = function(curDirV)
	{
		this.current_dir = curDirV;
	}

	this.getCurrentDir = function(){
		return this.current_dir;
	}

	this.setOldDir = function(oldDirV)
	{
		this.old_dir = oldDirV;
	}

	this.getOldDir = function()
	{
		return this.old_dir;
	}

/****************************************************************************************/
	/**
	* Делаем кнопку сохранить не активной
	*
	* @see 	this.edit()
	* @see 	this.setNoActButSave()
	*/
	this.setNoActButSave = function()
	{
		this.getButSave().addClass("no-active");
	}

	/**
	* Делает кнопку активной
	*
	* @see 	this.setEventNoteItemBlock()
	*/
	this.setActButSave = function()
	{
		this.getButSave().removeClass("no-active");
	}

	/**
	* Узнаем активная или нет
	*
	* @see  this.setEventModalSave()
	*/
	this.isNoActiveButSave = function()
	{
		return $("#modalImage .butOk[class~='no-active']").length;
	}

	/**
	* Отдает кнопку сохранить
	*
	* @see 	this.noActButSave()
	* @see 	this.setActButSave()
	* @see 	this.isNoActiveButSave()
	*/
	this.getButSave = function()
	{
		return $("#modalImage .butOk");
	}
/**********************************************************************************************/
/********************************************************************************************/
/****модальное окно******************************************************************************/
	/**
	* Создает модальное окно для выбора картинки
	*
	* @uses 	this.getModalContent() 		получить контент модального окна
	* @uses 	this.setImgCategory() 		устанаовить картинки категории
	* @uses 	this.setEventModal() 		установить события
	*/
	this.createModal = function()
	{
		//получить содержимое модального окна
		var content = this.getModalContent();

		var butAddTextV = Resource.main_modal_but_upload+' '+this.fileTypeName;
		if (this.params["no_chosen"]) {
			var listButtonV = [
					['add', butAddTextV],
					['cancel', Resource.main_modal_but_cancel]
				]
		} else {
			var listButtonV = [
					['add', butAddTextV],
					['ok', Resource.main_modal_but_chosen],
					['cancel', Resource.main_modal_but_cancel]
				]
		}

		if (this.params["no_chosen"]) {
			var modalTitleV = Resource.hlp_modal_image_title_manager_file;
		} else {
			var modalTitleV = Resource.main_modal_but_chosen+' '+this.fileTypeName;
		}

		//создаем модальное окно
		Modal.create({
			'width':'80%',
			'height':'',
			'top':'50',
			'id':'modalImage',
			'title':modalTitleV,
			'content':content,
			'content_class':'modalImageContent',
			'content_height':'max',
			'height_other':'50',
			'button':listButtonV
		});

		//устанавливаем события модального окна
		this.setEventModal();

		// добавляет блок информации максимальный размер загружаемый фаил
		this.addInfoMaxSize();
	}

	/**
	* Отдает содержиме модального окна
	*
	* @see 	this.createModal()
	*/
	this.getModalContent = function() {
		var topPanel = '';

		// if (this.fileType != "img") {
			topPanel = '<div class="modalImageTop">\
				<div class="modalImageFolderUrl"></div>\
				<div class="modalImageTopBut modalImageButCreateDir">'+Resource.hlp_modal_image_but_create_folder+'</div>\
				<div class="clear"></div>\
			</div>';
		// }

		var content = '\
			'+topPanel+'\
			<div class="butAddBlockForm" style="display:none;">\
				<form action="" method="post" enctype="multipart/form-data">\
					<input type="file" id="new_image" name="new_image" value=""/>\
					<input type="hidden" name="site" value="" />\
					<input type="hidden" name="file_type" value="'+this.fileType+'" />\
					<input type="submit" id="new_image_sub" value="Загрузить" />\
				</form>\
			</div>\
			<div class="modalImageSection">\
				<div class="modalImageContent"></div>\
				<div class="clear"></div>\
			</div>\
		';

		return content;
	}

	/**
	* Добавляет информацию - максимальный размер 
	*
	* @see 	this.createModal()
	*/
	this.addInfoMaxSize = function()
	{
		var blockInfo = '<div class="infoMaxSize">'+this.listErrorValid[this.fileType]["size"]+'</div>';
		$("#modalImage .butAdd").after(blockInfo);
	}
/************************************************************************************************/
/***********************************************************************************************/
	/**
	* Устанавливает события для модального окна
	* 
	* @see 		this.createModal()
	*/
	this.setEventModal = function()
	{
		//загрузить изображение
		this.setEventModalAdd();
		//сохранить изображение
		this.setEventModalSave();
		this.setEventCreateDir();
	}

/**********************************************************************************/
	
	/**
	* Открыть модальное
	*
	* @see 	this.setEventCreateDir()
	*/
	this.setEventCreateDir = function()
	{
		var butObj = $(".modalImageButCreateDir");
		var obj = this;
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalCreateDir();
			obj.setEventCreateDirSave();
		});
	}

	/**
	* Показываем модальное
	*
	* @see 	this.setEventCreateDir()
	*/
	this.showModalCreateDir = function()
	{
		var content = '\
			<div class="label">'+Resource.hlp_modal_image_modal_folder_label+'</div>\
			<input type="text" class="valueNewFolderImage" only-eng="true" />';

		Modal.create({
			"id" : "modalImageCreateDir",
			"title" : Resource.hlp_modal_image_modal_folder_title,
			"content" : content,
			"width" : 450,
			"top" : 40,
			"button" : [
				['cancel', Resource.main_modal_but_cancel],
				['add', Resource.main_modal_but_create]
			]
		});

		SpecialInput.setEventOnlyEng($(".valueNewFolderImage"));
	}

	/**
	* Создание папки - сохранение
	*
	* @see 	this.setEventCreateDir()
	*/
	this.setEventCreateDirSave = function()
	{
		var butSaveObj = $("#modalImageCreateDir .butAdd");
		var obj = this;
		butSaveObj.off("mousedown");
		butSaveObj.on("mousedown", function() {
			var newFolderName = $(".valueNewFolderImage").val();
			newFolderName = newFolderName.trim();
			if (!newFolderName) return false;
			
			newFolderName = newFolderName.replace('[\ \-]', '_');

			Modal.removeLast();
			Modal.createLoading("Создается папка");
			//запрос на сервер
			var queryString = obj.getQueryStringManipulationFile(newFolderName);
			ajaxPost('/editor/createFileFolderHol', queryString, function(res) {
				var newFolderProperty = res.responseText.trim();
				
				if (newFolderProperty) {
					newFolderProperty = JSON.parse(newFolderProperty);
					obj.listImage[newFolderProperty["name"]] = newFolderProperty;
					obj.setNewImgCategory(obj.category);
				}

				Modal.deleteLoadind();
			})
		});
	}

/*************************************************************************************************/
/*************************************************************************************************/
	/**
	* Добавить новое фото
	*
	* @see 	this.setEventModal()
	* @see 	this.reloadInputNewImg()
	*/
	this.setEventModalAdd = function() {
		var obj = this;
		
		$("#modalImage .butAdd").addClass('h-but-upload-file');
		var parentBut = $(".butAddBlockForm");
		var butHtml = '';
		var siteId = this.siteId;
		File.createButUpload(parentBut, butHtml, '/editor/saveFileHol', this.fileType, siteId, function(res) {
			var propertyNewImage = res;

			if (propertyNewImage) {
				propertyNewImage = JSON.parse(propertyNewImage);
				var newImageSrc = propertyNewImage["src"];
				newImageSrc = newImageSrc.replace(/\/\//gim, "/")
				propertyNewImage["src"] = newImageSrc;

				obj.listImage[propertyNewImage["name"]] = propertyNewImage;
				obj.setNewImgCategory();
			} else {
				Notification.error();
			}

			// убираем загрузку
			Modal.deleteLoadind();
		});
	}
/*********************************************************************************************/

	/**
	* Событие 	кнопки "Сохранить"
	*
	* @uses 	this.save() 		сохранить изображение
	* @see 		this.setEventModal()
	*/
	this.setEventModalSave = function()
	{
		var obj = this;
		$('#modalImage .butOk').off('mousedown');
		$('#modalImage .butOk').on('mousedown', function() {
			if (obj.isNoActiveButSave()) return false;

			obj.save();
		});
	}
/**************************************************************************************************/
/***************************************************************************************************/
/***работа с картинками************************************************************************/
	
	/**
	* Установить каринки категории на полотне 
	*
	* @see 		this.setEventModalNav()
	*/
	this.setNewImgCategory = function()
	{
		// категория уже загруженна
		var listImage = this.listCategory[this.getCategoryKey()];
		if (listImage) {
			this.loadingCategory(listImage);
			return false;
		}

		this.loadingCategoryServer();
	}
	
	/**
	* Загружает изображения с сервера
	*
	* @see 	this.setNewImgCategory()
	* @see 	EditElementImage.insertTemplatePage()
	*/
	this.loadingCategoryServer = function(noSet, siteId, fileType)
	{
		var obj = this;
		
		if (!noSet) Modal.createLoading(Resource.hlp_modal_image_load_add_file);
		//запрос на сервер
		if (!siteId) siteId = this.siteId;
		if (!fileType) fileType = this.fileType;

		var queryString = 'site='+siteId;
		queryString += "&file_type="+fileType;

		ajaxPost('/editor/getFileHol', queryString, function(res) {
			var response = res.responseText.trim();
			//результат в текстовом виде 
			var listImage = JSON.parse(response);
			
			if (noSet) {
				obj.listImage = listImage;

				if (fileType == "img")

				obj.listCategory[obj.getCategoryKey(fileType)] = listImage;
			} else {
				obj.loadingCategory(listImage);
				Modal.deleteLoadind();
			}
		})
	}

	this.getCategoryKey = function(fileType)
	{
		if (!fileType) fileType = this.fileType;
		return fileType;
	}

	/**
	* Загрузилась категория
	*
	* @see 	this.setNewImgCategory()
	*/
	this.loadingCategory = function(listImage)
	{
		this.listImage = listImage;
		this.listCategory[this.getCategoryKey()] = listImage;
		//устанавливаем новые картинки с типом сортировки по ширине
		this.replaceImgBlock();
	}

	/**
	* Сброс категории файлы
	*
	* @see 	TemplateSection.addTemplateAction()
	*/
	this.resetCategoryFiles = function()
	{
		this.listCategory["video"] = false;
	}
/************************************************************************************************/
	/**
	* Заменяет картинки на полотне
	*
	* @param 	array 	list-список картинок
	*
	* @see 	this.setEventSort() 		при изменгении метода сортировки
	* @see 	this.setNewImgCategory()
	* @see 	this.addNewImg()
	*/
	this.replaceImgBlock = function()
	{
		// если нет такой директории
		if (!this.listImage[this.getCurrentDir()]) this.resetValueDir();

		$("#modalImage").attr("data-curent-dir", this.getCurrentDir());
		this.setOldDir();

		//формируем
		var block = this.attachImgBlock(this.listImage);
		//вставляем
		this.insertImgBlock(block);
		//устанавливаем события
		this.setEventImage();
	}

	/**
	* Ставит старую директорию
	* 
	* @see 	this.replaceImgBlock()
	*/
	this.setOldDir = function()
	{
		var curDirV = this.getCurrentDir();
		var listFolderV = curDirV.split("/");
		var countFolderV = listFolderV.length;

		var blockUrlV = '';
		var addedAttrRoot = !curDirV ? 'data-type="current"' : '';
		blockUrlV += '<div class="modalImageUrl" '+addedAttrRoot+' data-folder="">'+Resource.hlp_modal_image_url_root+'</div>';

		var curDirV = '';
		var lastIndex = countFolderV - 1;
		var isFirstItem = true;
		for (var iFolder in listFolderV) {
			var folderItemV = listFolderV[iFolder];
			if (!folderItemV) continue;

			if (!isFirstItem) curDirV += '/';
			isFirstItem = false;
			curDirV += folderItemV;

			blockUrlV += '<span class="modalImageUrlSeparator">/</span>';
			var addedAttr = lastIndex == iFolder ? 'data-type="current"' : '';
			blockUrlV += '<div class="modalImageUrl" '+addedAttr+' data-folder="'+curDirV+'">'+folderItemV+'</div>';
		}

		blockUrlV += '<div class="clear"></div>';

		$(".modalImageFolderUrl").html(blockUrlV);

		this.setEventButBack();
	}

/***********************************************************************************************/
	
	/**
	* Сформировать блок картинок
	*
	* @param 	array   list_img-список изображений
	* @return 	html 	формированый блок изображений
	*
	* @see 	this.replaceImgBlock()
	*/
	this.attachImgBlock = function(listImage)
	{
		var navType = $('.modalNavItemAct').attr('type');

		var blockFile = '';
		var blockDir = '';

		//формируем одну картинку
		for (var fileName in listImage) {
			var item = listImage[fileName];

			// не той директории
			if (item['dir'] != this.getCurrentDir()) continue;

			//блок с кнопками манипуляции 
			var blockMan = '\
				<div class="modalImageBlockMan">\
					<img src="/img/editor/delete.png" class="modalButDeleteImage" title="" />\
				</div>';

			if (this.fileType == "img") {
				if (item['width']) var fileSize = +item['width']+'x'+item['height'];
				else var fileSize = '';
				 
				var src = item['src'];
			} else if (this.fileType == "video") {
				var src = '/img/editor/file-video.png';
				var fileSize = parseInt(item['size'])/1024/1024;
				fileSize = parseFloat(fileSize.toFixed(2)) + " MB";
			}

			if (item["type"] == "dir") {
				src = '/img/editor/file-folder.png';
				fileSize = '';
			}
					
			var fileName = item['name'];
			var fileName = fileName.match(/[^\/]+$/);
			if (fileName) fileName = fileName[0];

			var srcAttrV = item['src'];

			var blockItem = '\
				<div class="modalImgItem modalBlockItem" data-file-type="'+item['type']+'" img_name="'+item['name']+'" img_src="'+srcAttrV+'">\
					<img class="modalImgItemImage" src='+src+' />\
					<div class="modalImgItemName">'
						+fileName+
					'</div>\
					<div class="modalImgItemScreen">\
						'+fileSize+'\
					</div>'
						+blockMan+	
				'</div>';
			if (item['type'] == 'dir') blockDir += blockItem;
			else blockFile += blockItem;
		}

		var result = blockDir + blockFile;

		return result;
	}

	/**
	* Вставить картинки на полотно
	*
	* @param 	html 	block-блок картинок
	*
	* @see 		this.replaceImgBlock()
	*/
	this.insertImgBlock = function(block)
	{
		//вставляем на страницу 
		$('.modalImageContent').html(block);
	}

/**************************************************************************************************/
/***события картинок*****************************************************************************/
	/**
	* События картинок
	*
	* @see 		this.replaceImgBlock() 			отметить элемен
	*/
	this.setEventImage = function()
	{
		//отметить элемент
		this.setEventNoteItemBlock(); //
		//выбрать элемент
		this.setEventImageSelected();
		// кнопка назад
		this.setEventButBack();
		//отмечаем текущий элемент если он есть
		this.setImageNote();
		//удалить элемент
		this.setEventImageDelete();
		// подсказка
		this.setEventImageTip();

		//убираем значение search
		$('.modalImageSearchInput').val('');
	}


	/**
	* Отметить элемент
	*
	* @see 	this.setEventImage()
	*/
	this.setEventNoteItemBlock = function()
	{
		var obj = this;
		$('.modalBlockItem').off('mousedown');
		$('.modalBlockItem').on('mousedown', function() {
			var elmEvent = $(this);

			//убираем выделение у элемента
			$('.modalBlockItem').attr('note', 'false');
			//отмечаем элемент
			elmEvent.attr('note', 'true');

			// делаем кнопку активной
			obj.setActButSave();

			return false;
		})
	}

/**********************************************************************************************/
	/**
	* Выбрать элемент
	*
	* @uses 	this.save() 			сохранить изображение
	* @see 		this.setEventImage()
	*/
	this.setEventImageSelected = function()
	{
		var obj = this;
		$('.modalImgItem').off('dblclick');
		$('.modalImgItem').on('dblclick', function() {

			if ($(this).attr("data-file-type") == "dir") {
				obj.setCurrentDir($(this).attr("img_name"));

				obj.replaceImgBlock();

				return false;
			} else {
				obj.save();
			}
		})
	}

	/**
	* Кнопка назад по истории
	*
	* @see 	this.setEventImage()
	* @see 	this.setOldDir()
	*/
	this.setEventButBack = function()
	{
		var obj = this;
		var butObj = $(".modalImageUrl");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);

			obj.setCurrentDir(elmEvent.attr("data-folder"));
			obj.replaceImgBlock();
			return false;
		});
	}
/****************************************************************************************************/
	/**
	* Ставим выделение элементу
	*
	* @see 	this.setEventImage() 
	* @see 	this.addNewImg()
	*/
	this.setImageNote = function()
	{
		if (this.src) {
			//картинка котора стоит у выбраного элемента 
			var img_sel = $('.modalImgItem[img_src="'+this.src+'"] .modalImgItemImage');

			//отмечаем картинку
			img_sel.mousedown().mouseup();//@event-ModalBlock.setEventNoteItemBlock()
			//ставим скролл чтобы было видно выбраную картинку
			var par_elm = img_sel.parent();
			if (par_elm.length) {
				var top = par_elm.position().top - 90;
				$('.modalImageContent').scrollTop(top);
			}
		}
	} 
/********************************************************************************************/
	/**
	* Событие удаляем элемент
	*
	* @see 	this.setEventImage()
	*/
	this.setEventImageDelete = function() {
		var obj = this;

		$(".modalButDeleteImage").off("mousedown");
		$(".modalButDeleteImage").on("mousedown", function() {
			var elmEvent = $(this);
			if (elmEvent.attr("no-delete") != "true") {
				//выводи модальное 
				Modal.confirmationDelete(Resource.main_confirmation_delete_label, function() {
					// ставим событие на кнопку
					obj.eventConfirmationDelete(elmEvent);
				});
			}
		});
	}
	
	/**
	* Удаление
	*
	* @see this.setEventImageDelete();
	*/
	this.eventConfirmationDelete = function(elmEvent)
	{
		var obj = this;
		var itemImage = elmEvent.closest(".modalImgItem");
		var fileName = itemImage.attr("img_name");
		fileName = fileName.match(/[^\/]+$/);
		fileName = fileName[0];
		var src = itemImage.attr("img_src");

		// удаляем
		itemImage.css("display", "none");//прячем элемент

		Modal.createLoading(Resource.hlp_modal_image_load_delete_file);

		var queryString = obj.getQueryStringManipulationFile(fileName);
		// запрос на сервер
		ajaxPost('/editor/deleteFileHol', queryString, function(res) { 
			var result = res.responseText.trim();
			// console.log(result)

			if (result) {
				obj.removeImg(itemImage.attr("img_name"));
				//удаляем
				itemImage.remove();
			} else {	
				// показываем
				itemImage.css("display", "block");
				// выводим ошибку
				Notification.error();
			}
			Modal.removeLast();
		})
	}

	/**
	* Удаляет картинку
	*
	* @see 	this.eventConfirmationDelete()
	*/
	this.removeImg = function(fileName) 
	{
		var imgItem = this.listImage[fileName];
		if (!imgItem) return false;

		if (imgItem["type"] == "dir") {
			for (var fileNameItem in this.listImage) {
				if (this.listImage[fileNameItem]["dir"] == fileName) {
					var itemImg = this.listImage[fileNameItem];
					if (itemImg["type"] == "dir") {
						this.removeImg(itemImg["name"]);
					} else {
						this.removeImgItem(itemImg["src"]);
						delete this.listImage[fileNameItem];
					}
				}
			}
		};	

		this.removeImgItem(imgItem["src"]);
		delete this.listImage[fileName];
	}

	this.removeImgItem = function(src)
	{
		// удаляем картинки
		var listImg = $('.image img[src="'+src+'"]');
		var countImg = listImg.length;
		for (var i = 0; i < countImg; i++) {
			var img = listImg.eq(i);//.parent();
			// img.remove();
			// ElementCss.delete(img);
			img.attr("src", "none");
		}	
	}

/*********************************************************************************************/
	/**
	* Подсказка на картинке
	*
	*
	* @see 	this.setEventImage()
	*/
	this.setEventImageTip = function()
	{
		var listBut = $(".modalButDeleteImage[no-delete='true']");
		// ставим примечание
		Tip.setEvent(listBut, Resource.hlp_modal_image_tip_no_delete, "right");
	}

/**************************************************************************************************/
	/**
	* Показать кнопки изображения группы "my"
	*
	*
	*/
	this.setEventShowButImage = function() {	
		//показываем
		$('.modalImgItem').off('mouseover');
		$('.modalImgItem').on('mouseover', function() {
			$(this).find('.modalImgItemBut').css('display', 'block');
		});

		//убираем
		$('.modalImgItem').off('mouseout');
		$('.modalImgItem').on('mouseout', function() {
			$('.modalImgItemBut').css('display', 'none');	
		});
	}
/**********************************************************************************************************/
/***сохраняем картинку***************************************************************************/
	/**
	* Выбираем изображение
	*
	* @see 	this.setEventImageSelected()
	* @see 	this.setEventModalSave()
	* @see 	SiteController.setEventEditIcon()
	*/
	this.save = function()
	{
		if (this.params["no_chosen"]) return false;

		var name = $('.modalImgItem[note="true"]').attr('img_name'); 
		var src = $('.modalImgItem[note="true"]').attr('img_src');

		// для адаптивного залоговка
		if (this.getTypeOperation() == "edit_adaptive_title") {
			src = src.replace(/^https?:\/\/[^\/]+/gim, '');
			src = "http://" + location.hostname + src;

			PageDetailAdptiveTitle.saveModalEditValueImage(src);
			return false;
		}

		var elm = this.elm;
		if (!elm) elm = StyleMenu.getElementSelected("bg");
		var isNoCloseModal = this.saveImg(elm, name, src);

		//записываем при изменении самой картинки
		var status_record = this.getTypeOperation() == 'edit_image' ? true : false;
		
		//убираем модальное окно
		if (!isNoCloseModal) Modal.delete(status_record);
		Tip.hide();// убираем подсказку

		if (this.params["fixed_history"] == "yes") {
			History.record();
		}
	}

	/**
	* Сохранение изображения
	*
	* @see 	this.save()
	*/
	this.saveImg = function(elm, name, src)
	{
		src = src.replace(/img\/\//gim, 'img/');

		var operationV = this.getTypeOperation();
		//добавление элемента	
		if (this.isTypeOperationAdd()) {	
			//устанавливам значение, используется при создании
			ElementImage.src = src;
			//создаем картинку
			ElementImage.create();
			return true;
		// изменить иконку сайта
		} else if (operationV == 'edit_icon') {
			Data.site.data.icon = src;
			$(".menuSiteIcon").attr("src", src);

			Modal.removeLast();
			return true;
		// open graph
		} else if (operationV == 'edit_opengraph') {
			Data.page.data.opengraph.image = src;
			$(".openGraphImage").attr("src", src);

			Modal.removeLast();
			return true;

		// картинку видео фона 
		} else if (this.src != src) {
			if (operationV == 'edit_image' || operationV == "edit") {//изменение картинки
				if (elm.find("> img").length) elm = elm.find("> img");
				

				//заменяем src
				elm.attr('src', src);
			//изменение фона
			} else if (operationV == 'edit_bg') {// изменение bg
				StyleMenuBg.editImage(elm, src);
			}
		}
	}

/***********************************************************************************/
	/**
	* Параметры - манипуляция с файлом
	*
	* @see 	this.eventConfirmationDelete()
	* @see 	this.setEventCreateDirSave()
	*/
	this.getQueryStringManipulationFile = function(fileName)
	{
		var propV = 'name='+fileName;
		propV += '&folder='+this.getCurrentDir();
		propV += "&file_type="+this.fileType;
		propV += "&site_id="+this.siteId;

		return propV;
	}

/*************************************************************************************/
}// end class

