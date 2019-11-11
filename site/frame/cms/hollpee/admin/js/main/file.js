/**
* Работа с файлом
*
*
*/
var File = new File();
function File() {
	this.butIndex = 0;
	this.listProperty = {};

	/**
	* Создает кнопку для загрузки файла
	*
	*
	*/
	this.createButUpload = function(parentObj, but, url, fileType, funcAfterUpload, fileFolder)
	{
		this.listProperty[this.butIndex] = {
			"url" : url,
			"fileType" : fileType,
			"fileFolder" : fileFolder,
			"funcAfterUpload" : function (data) {funcAfterUpload(data)}
		};

		// добавляем кнопку
		var butUpload = this.addButUpload(parentObj, but);
		butUpload.attr("data-index", this.butIndex);
		this.butIndex++;

		// добавляем событе
		this.setEventButUpload(url, butUpload);
	}

	/**
	* Добавляет кнопку
	*
	* @see 	this.createButUpload()
	*/
	this.addButUpload = function(parentObj, but)
	{
		parentObj.find(".h-but-upload-file, .h-upload-file").remove();

		var formUploadFile = '\
			<form action="" method="post" enctype="multipart/form-data" class="h-upload-file" style="display:none;" >\
				<input type="file" id="hNewFile" name="new_image" value=""/>\
				<input type="submit" id="hNewFileSub" value="Загрузить" />\
			</form>\
		';

		formUploadFile += but;

		var lastChild = parentObj.find("> *:last-child");
		if (lastChild.length) {
			lastChild.before(formUploadFile);
		} else {
			parentObj.append(formUploadFile);			
		}

		return parentObj.find(".h-but-upload-file, .h-upload-file");
	}

	/**
	* Событие загрузки файла
	*
	* @see 	this.createButUpload()
	*/
	this.setEventButUpload = function(url, butUpload) 
	{
		var obj = this;
		/**
		* Эмитация клика
		*/
		// var butUpload = $(".h-but-upload-file");
		butUpload.off("mouseup"); 
		butUpload.on("mouseup", function() {
			var butIndex = $(this).attr("data-index").trim();
			var property = obj.listProperty[butIndex];

			obj.url = property.url;
			obj.fileType = property.fileType;
			obj.fileFolder = property.fileFolder;
			obj.funcAfterUpload = property.funcAfterUpload;

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
	    	if (obj.fileType == "images") {
	    		var isValid = obj.isValidFile(file);
	    		if (!isValid) return false;
	    	}

			Modal.createLoading("Загружается фаил");

			// Инициируем функцию FileReader
			var fileReader = new FileReader();
            fileReader.onload = (function(evn) {
            	obj.handlerUploadImage(evn, file);
            });
         	// Производим чтение файла по URI
         	fileReader.readAsDataURL(file);

         	var loadingLabelObj = $(".modal-loading-label");
	        fileReader.onprogress = function(data) {
	            if (data.lengthComputable) {                                            
	                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
	                var loadingLabel = progress > 97 ? "Сохраняю..." 
	                							: "Загруженно " + progress + "%";
					loadingLabelObj.text(loadingLabel);
	            }
	        }
		});
	}

	/**
	* Загрузка файла
	* 
	* @see 	this.setEventButUpload()
	*/
	this.handlerUploadImage = function(evn, file) 
	{
		// перезагружаем поле загрузки файла
    	this.reloadInputNewImg();
 
    	var obj = this;    
    	var content = evn.target.result;
    	var queryString = {
    		"type" : this.fileType, 
    		"folder" : this.fileFolder,
    		"name" : file.name, 
    		"content" : content};

    	$.post(this.url, queryString, function(data) {
    		console.log(data.trim())
    		obj.funcAfterUpload(data.trim());
    	});
    }

    /**
    * Прогрес загрузки
    *
    * @see 	this.handlerUploadImage()
    */
    this.progressBar = function()
    {
    	var xhr = $.ajaxSettings.xhr();

		// Устанавливаем обработчик подгрузки
		xhr.addEventListener('progress', function(evt) {
		  if (evt.lengthComputable) {
		    var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
		    console.log(percentComplete)
		    var label = "Фаил загружен на " + percentComplete + "%";
		    $("#modalLoading .modal-loading-label").text(label);
		  }
		}, false);
		
		return xhr;
    }

    /**
    * Перезагружаем поле - новый фаил
    *
    * @see 	this.setEventButUpload()
    */
    this.reloadInputNewImg = function()
    {
    	// $("#hNewFile").remove();
		// var inputNewImg = '<input type="file" id="hNewFile" name="new_image" value=""/>';
		// $(".h-upload-file").prepend(inputNewImg);
		// this.setEventButUpload();
    }

	/**
	* Проверка на валидность
	*
	* @see 	this.setEventButUpload()
	*/
	this.isValidFile = function(file)
	{
		if (!file.type.match(/^image/gim)) {
			Notification.error("Загружаемый фаил не изображение");
			return false;
		} else {
			return true;
		}
	}
	
} // end class
