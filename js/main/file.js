/**
* Работа с файлом
*
*
*/
var File = new File();
function File() {
	/**
	* Добавить нельзя
	*
	*/
	this.noAdd = false;

	/**
	* Один Mb
	*
	*/
	this.oneMb = 1048576;
		
	/**
	* Максимальное количество Mb
	*
	*/	
	this.maxSizeFileLpf = 50;
	this.maxSizeFileVideo = 2;
	this.maxSizeFileImage = 2;
	this.maxSizeFileFont = 1;

	/**
	* Создает кнопку для загрузки файла
	*
	*
	*/
	this.createButUpload = function(parentObj, but, url, fileType, siteId, funcAfterUpload)
	{
		this.siteId = siteId;
		this.url = url;
		this.fileType = fileType;
		this.funcAfterUpload = funcAfterUpload;

		// добавляем кнопку
		this.addButUpload(parentObj, but);
		// добавляем событе
		this.setEventButUpload(url);
	}

	/**
	* Добавляет кнопку
	*
	* @see 	this.createButUpload()
	*/
	this.addButUpload = function(parentObj, but)
	{
		if (but) $(".h-but-upload-file, .h-upload-file").remove();

		parentObj.find("#formUploadFileId").remove();

		var formUploadFile = '\
			<form action="" id="formUploadFileId" method="post" enctype="multipart/form-data" class="h-upload-file" style="display:none;" >\
				<input type="file" id="hNewFile" name="new_image" value=""/>\
				<input type="submit" id="hNewFileSub" value="Загрузить" />\
			</form>\
		';

		formUploadFile += but;

		var listChild = parentObj.find("*");
		var lastChild = listChild.filter(":last-child");
		if (lastChild.length) {
			if (listChild.length > 1 && lastChild.hasClass("clear")) lastChild = lastChild.prev();
			lastChild.after(formUploadFile);
		} else {
			parentObj.append(formUploadFile);			
		}
	}

	/**
	* Событие загрузки файла
	*
	* @see 	this.createButUpload()
	*/
	this.setEventButUpload = function(url) 
	{
		var obj = this;
		/**
		* Эмитация клика
		*/
		var butUpload = $(".h-but-upload-file");
		butUpload.off("mouseup"); 
		butUpload.on("mouseup", function() {
			if (obj.noAdd) {
				obj.noAdd = false;
				return false;
			}
			
			//эмитируем клик, для открытие окна для выбора файла
			$("#hNewFile").click();
			return false;
		});

		//файл выбран
		$("#hNewFile").off("change"); 
		$("#hNewFile").on("change", function() {
			var file = $(this)[0].files[0];
			if (!file) return false;

			// проверяем на валидность файла
    		var isValid = obj.isValidFile(file);
	    	if (!isValid) return false;

			Modal.createLoading(Resource.main_file_label_load);

			// Инициируем функцию FileReader
			var fileReader = new FileReader();
            fileReader.onload = (function(event) {
            	obj.handlerUploadImage(file, event);
            });
         	// Производим чтение файла по URI
         	fileReader.readAsDataURL(file);

         	var loadingLabelObj = $(".modalLoadingLabel");
	        fileReader.onprogress = function(data) {
	            if (data.lengthComputable) {   
	                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
	                // var loadingLabel = progress > 98 ? "Сохраняю..." 
	                // 							: "Загруженно " + progress + "%";
					// loadingLabelObj.text(loadingLabel);
	            }
	        }
		});
	}

	/**
	* Загрузка файла
	* 
	* @see 	this.setEventButUpload()
	*/
	this.handlerUploadImage = function(file, event) 
	{
		// перезагружаем поле загрузки файла
    	this.reloadInputNewImg();

	    var siteId = this.siteId;
	    if ($(".modalNavItemAct").attr("type") == "main") {
			siteId = "main";
	    }
 		
 		// текущая директория   переделать
 		var curDir = '';
 		var curDirElmObj = $("#modalImage");
 		if (curDirElmObj.length) {
 			curDir = curDirElmObj.attr("data-curent-dir");
 		}
 		
 		var fileName = file.name;
 		// fileName = fileName.replace(/-/gim, "");

 		fileName = fileName.replace(/\s+/gim, '');
    	fileName = fileName.replace(/\([^\)]+\)/gim, '');
    	
    	var obj = this;    
    	var content = event.target.result;
    	var queryString = {
    		"type" : this.fileType,
    		"site_id" : siteId,
    		"dir":curDir, 
    		"name" : fileName, 
    		"content" : content
    	};

    	if (fileName.match(/\.commerce\.hollpee$/gim)) {
    		this.enterActivateKey(queryString);
    	} else {
    		this.saveFile(queryString);
    	}
    }

    /**
    * Перезагружаем поле - новый фаил
    *
    * @see 	this.setEventButUpload()
    */
    this.reloadInputNewImg = function()
    {
    	$("#hNewFile").remove();
		var inputNewImg = '<input type="file" id="hNewFile" name="new_image" value=""/>';
		$(".h-upload-file").prepend(inputNewImg);
		this.setEventButUpload();
    }

    this.saveFile = function(queryString)
    {
    	var obj = this;
    	$.post(this.url, queryString, function(data) {
    		obj.funcAfterUpload(data.trim());
    	});
    }
    
/*****************************************************************************/

    this.enterActivateKey = function(queryString)
    {
    	Modal.delete();
    	this.showModalActivateKey();
    	this.setEventModalActivateKey(queryString);
    }

    this.showModalActivateKey = function()
    {
    	var content = '\
			<div class="modalLabel">'+Resource.main_modal_activate_key+'</div>\
			<input type="text" class="valueActivationKey" />\
    	';

    	Modal.create({
    		"id":"modalActivationKey",
    		"top":50,
    		"width":500,
    		"content":content,
    		"button":[
    			["cancel",Resource.main_modal_but_cancel],
				["add",Resource.main_modal_but_activate]
    		]
    	});
    }

    this.setEventModalActivateKey = function(queryString)
    {
    	var obj = this;
    	var butObj = $("#modalActivationKey .butAdd");
    	butObj.off("mousedown");
    	butObj.on("mousedown", function() {
    		var activationKeyV = $("#modalActivationKey .valueActivationKey").val();
    		if (!activationKeyV) return false;

    		Modal.createLoading(Resource.main_file_label_load);
    		queryString["activation_key"] = activationKeyV;
    		obj.saveFile(queryString);
    	});
    }

/*********************************************************************************/

	/**
	* Проверка на валидность
	*
	* @see 	this.setEventButUpload()
	*/
	this.isValidFile = function(file)
	{
		if (this.fileType == "img") return this.isValidFileImage(file);
		else if (this.fileType == "video") return this.isValidFileVideo(file);
		else if (this.fileType == "font") return this.isValidFileFont(file);
		else if (this.fileType == "template") return this.isValidFileTemplate(file);
	}
		
	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileImage = function(file)
	{
		var maxSizeImage = this.oneMb * this.maxSizeFileImage;

		if (!file.type.match(/^image/gim)) {
			Notification.error(Resource.main_file_upload_no_image);
			return false;
		} else if (file.size >= maxSizeImage) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileImage+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация видео
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileVideo = function(file)
	{
		var maxSizeVideo = this.oneMb * this.maxSizeFileVideo;

		// if (!file.name.match(/\.css$/gim) 
		// 		&& !file.name.match(/\.js$/gim)
		// 		&& !file.name.match(/\.zip$/gim)
		// 		&& !file.name.match(/\.rar$/gim) ) {
		// 	Notification.error("Загружать можно только формат .css, .js, .zip, .rar");
		// 	return false;
		// } else 
		if (file.size >= maxSizeVideo) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileVideo+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileFont = function(file)
	{
		var maxSizeFont = this.oneMb * this.maxSizeFileFont;

		if (!file.name.match(/\.ttf$/gim)) {
			Notification.error(Resource.main_file_upload_only+" .ttf");
			return false;
		} else if (file.size >= maxSizeFont) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileFont+" Mb");
			return false;
		} else {
			return true;
		}
	}

	/**
	* Валидация image
	*
	* @see 	this.isValidFile()
	*/ 
	this.isValidFileTemplate = function(file)
	{
		var maxSizeLpf = this.oneMb * this.maxSizeFileLpf;
			
		// проверка типа
		if (!file.name.match(/\.hollpee$/)) {
			Notification.error(Resource.main_file_upload_only_hollpee);
			return false;
		} else if (file.size >= maxSizeLpf) {
			Notification.error(Resource.main_file_label_max_size+" "+this.maxSizeFileLpf+" Mb");
			return false;
		} else {
			return true;
		}
	}

} // end class
