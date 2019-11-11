$(document).ready(function() {
	Project.init();
	ListSites.init();
	HlpPage.init();
	// подсказки
	setEventTip();
	/**************/
})
/************************************************************************************************/	
/*********************************************************************************************/
var Project = new Project();
function Project()  {
	this.init = function()
	{
		this.setEvent();
	}

	this.setEvent = function() 
	{
		// изменить
		this.setEventEdit();
		// добавить 
		this.setEventCreate();
		// выбор
		this.setEventChosen();
	}

	this.setEventChosen = function()
	{
		var selectObj = $(".listProject");
		selectObj.off("change");
		selectObj.on("change", function() {
			var projectId = $(this).val();
			if (projectId) {
				var prop = '?project='+projectId;
			} else {
				var prop = '';
			}		

			location.href = "/sites2"+prop;
		});
	}

	/**
	* Очищаем имя
	*
	* @see 	this.setEventButEditProject()
	* @see 	this.setEventSubmitCreate()
	*/
	this.clearName = function(nameElm)
	{
		nameElm = nameElm.replace(/[^a-zа-я0-9_\-\s]+/gim, '');
		return nameElm;
	}
/********************************************************************************************/
/**********************************************************************************************/
	/**
	* Создать проект
	*
	*
	*/
	this.setEventCreate = function()
	{ 
		var obj = this;
		$(".butCreateProject").off('mousedown');
		$(".butCreateProject").on('mousedown', function() {
			// показываем модальное окно
			obj.showModalCreate();
			// ставим событие на кнопку
			obj.setEventSubmitCreate();
		});
	}

/**********************************************************************************************/
	/**
	* Создать модальное - создать проект
	*
	*
	*/
	this.showModalCreate = function()
	{
		var block = '	<div class="createProjectBlock">\
							<form action="/sites2/createProject" method="post">\
								<input type="text" name="name" id="nameCreatedProject" placeholder="'+Resource.page_site_project_input_name+'" />\
								<input type="submit" onclick="return false" id="subCreateProject"/>\
							</form>\
						</div>';
		Modal.create({
			"id":"modalBlockCreateProject",
			"title":Resource.page_site_project_title_add,
			"width":400,
			"top":100,
			"content":block,
			"button": [
				["cancel",Resource.main_modal_but_cancel],
				["add",Resource.page_site_project_but_add]
			]
		});
	}
/************************************************************************************************/
	/**
	* Ставим событие на кнопку submit - создание проекта
	*
	*
	*/
	this.setEventSubmitCreate = function()
	{
		var obj = this;
		$("#modalBlockCreateProject .butAdd").off('mousedown');
		$("#modalBlockCreateProject .butAdd").on('mousedown', function() {
			var elmForm = $("#modalBlockCreateProject form");
			//проверяем 
			if (Form.verify(elmForm)) {
				var inputObj = $("#nameCreatedProject");
				var newProjectName = obj.clearName(inputObj.val());
				inputObj.val(newProjectName);

				// отправляем форму
				$("#subCreateProject").removeAttr("onclick").click();
			}
		});
	}
/*******************************************************************************************/
/********************************************************************************************/
	/**
	* Изменить проект
	*
	*
	*/
	this.setEventEdit = function()
	{
		if (!this.getCurrentId()) {
			$(".butEditProject").attr("noactivity", "true");
			return false;
		}

		var obj = this;
		$(".butEditProject:not([noactivity='true'])").off('mousedown');
		$(".butEditProject:not([noactivity='true'])").on('mousedown', function() {
			var curProjectObj = obj.getCurrentObj();
			var projectName = curProjectObj.attr("data-name");
				
			// показываем модальное окно
			obj.showModalEdit(projectName);
			obj.projectName = projectName;
		});
	}

	/**
	* Показать модальное окно для изменение проекта
	*
	*
	*/
	this.showModalEdit = function(projectName) 
	{
		var block = '<form action="" method="post">\
						<input type="text" name="name" id="fieldEditProjectName" value="'+projectName+'"  placeholder="'+Resource.page_site_project_input_name+'"/>\
						<input type="submit" style="display:none;" onclick="return false" />\
					</form>';
		Modal.create({
			"id":"modalBlockEditProject",
			"title":Resource.page_site_project_title_edit,
			"width":400,
			"top":100,
			"content":block,
			"button": [
				["cancel",Resource.main_modal_but_cancel],
				["delete",Resource.main_modal_but_delete],
				["add",Resource.page_site_project_but_edit]
			]
		});

		// события кнопки
		this.setEventModalEditProject();
	}


	/**
	* События для модального окна изменить проект
	*
	*/
	this.setEventModalEditProject = function()
	{
		// для изменения
		this.setEventButEditProject();
		
		//для удаления 
		// количество элементов в группе
		var countSitesInProject = $(".siteBlock").length;
		var isOneProject = $(".projectItem:not(.projectItemAll)").length == 1;
		// если есть сайты удалить нельзя
		if (countSitesInProject || isOneProject) {
			this.setNoActivityButDelete();
		} else {
			// удалить можно
			this.setEventButDeleteProject();
		}

	}
/***********************************************************************************************/
	/**
	* Событие на кнопку - изменить имя проекта
	*
	* @see 	this.setEventModalEditProject()
	*/
	this.setEventButEditProject = function()
	{
		var obj = this;
		$("#modalBlockEditProject .butAdd").off("mousedown");
		$("#modalBlockEditProject .butAdd").on("mousedown", function() {
			var newProjectName = $("#fieldEditProjectName").val();
			newProjectName = obj.clearName(newProjectName);

			// имя изменено
			if (obj.projectName != newProjectName) {
				var elmForm = $("#modalBlockEditProject form");
				// делаем проверку
				if (Form.verify(elmForm)) {
					// изменяем имя
					obj.editName(newProjectName);
					Modal.delete();
				}
			} else {
				Modal.delete();
			}
		});
	}

	/**
	* Изменяет имя проекта
	*
	* @see 	this.setEventButEditProject()
	*/
	this.editName = function(newProjectName) {					
		var obj = this;
		var projectId = this.getCurrentId();

		// меняем имя
		this.setName(newProjectName);

		// запрос
		var queryString = "project_id="+projectId+"&name="+newProjectName;
		ajaxPost("/sites2/editProject", queryString, function(res) {
			var res = res.responseText.trim();
			if (res) {
				Notification.ok(Resource.page_site_project_notification_edit);
			} else {
				// возращаем старое имя
				obj.setName(obj.projectName);
				Notification.error(Resource.main_notification_error);
			}
		});
	}

/******************************************************************************************/
	/**
	* Событие на кнопку - удалить
	*
	* @see 	this.setEventModalEditProject()
	*/
	this.setEventButDeleteProject = function()
	{
		var obj = this;
		$("#modalBlockEditProject .butDelete").off("mousedown");
		$("#modalBlockEditProject .butDelete").on("mousedown", function() {
			var projectId = obj.getCurrentId();

			// перенаправляем
			var params = "project_id="+projectId;
			location.href = "/sites2/deleteProject?"+params;
		});

	}

	/**
	* Делаем кнопку удалить не активной
	*
	* @see 	this.setEventModalEditProject()
	* @todo  	блок информации добавить
	*/
	this.setNoActivityButDelete = function() {
		$("#modalBlockEditProject .butDelete")
			.attr("no_active", "true")
			.attr("title", Resource.page_site_project_notification_no_delete);
	}


/************************************************************************************************/
	/**
	* Установить имя
	* 
	* @see 	this.editName()
	*/
	this.setName = function(projectName)
	{ 
		var obj = this.getCurrentObj();
		obj.attr("data-name", projectName);

		var count = obj.attr("data-count");
		projectName += " ("+count+")";
		obj.text(projectName);
	}

	this.getCurrentObj = function()
	{
		return $(".listProject option[selected='selected']");
	}

	/**
	* Отдает текущию группу
	*
	* @see 	this.editName(), this.setEventButDeleteProject()	
	*/
	this.getCurrentId = function() {
		return $(".listProject").val();
	}

	/**
	* Декремент для количество страниц в навигации у элемента
	*
	*
	*/
	this.editCountSites = function(projectId, editOnCount, noTotalCountSites)
	{
		// вкладка элемента 
		var selectedElm = $(".projectItem[project='"+projectId+"'");
		var listElm = [selectedElm];
		// вкладка сайта в вкладка "все"
		if (!noTotalCountSites) {
			listElm[1] = $(".projectItemAll");
		}

		// делаем декремент
		for (var indexElm in listElm) {
			var elmCount = listElm[indexElm].find(".projectItemCount");
			var count = parseInt(elmCount.text()) + editOnCount; 
			elmCount.text(count);
		}
	}

	/**
	* Узнает это вкладка все или нет
	*
	*
	*/
	this.isTotalSites = function() {
		return !this.getCurrentId();
	}
/*********************************************************************************************/
}//end class Project
/***********************************************************************************************/
/***Список сайтов******************************************************************************************/
var ListSites = new ListSites();
function ListSites()
{	
	this.init = function()
	{
		this.setEvent();
	}


	/**
	* Ставим события
	*
	* @see 	this.init()
	*/
	this.setEvent = function() 
	{
		//изменить имя
		this.setEventEditName();
		// удалить
		this.setEventDelete();
		// копировать
		this.setEventCopy();
		// переместить
		this.setEventMove();
		// публикация
		this.setEventPublished();
		// скачать
		this.setEventDownload();
		// Загрузка шаблона
		this.setEventUploadLPF();
		// добавить сайт
		this.setEventAddSite();
	}
/***********************************************************************************************/
	/**
	* Изменяет имя
	*
	*
	*/
	this.setEventEditName = function()
	{
		var obj = this;
		var listFilderObj = $('.siteName, .siteComment');
		//редактирование названия страницы и файла
		listFilderObj.off('focus');
		listFilderObj.on('focus', function() {
			var oldText = $(this).text().trim();
			
			//изменить название страницы и файла
			listFilderObj.off('focusout');
			listFilderObj.on('focusout', function() {
				if (!obj.editNameThroughPaste) {
					obj.editName($(this), oldText);
				}

				obj.editNameThroughPaste = false;
			});

			//изменить название страницы и файла
			listFilderObj.off('paste');
			listFilderObj.on('paste', function() {
				var elmEvent = $(this);
				setTimeout(function() {
					obj.editName(elmEvent, oldText);
					obj.editNameThroughPaste = true;
					Tip.hide();
				}, 100);
			})
		});
	}

	/**
	* Изменение имени
	* @see 	this.setEventEditName()
	*/
	this.editName = function(elmEvent, oldText)
	{
		var siteId = this.getId(elmEvent);
		var type = elmEvent.hasClass("siteName") ? 'style_name' : 'comment';
		
		if (type == 'style_name') {
			var newText = elmEvent.text().trim();
			
			newText = this.clearName(newText);
			elmEvent.text(newText);
		} else {
			var newText = elmEvent.val();
			newText = this.clearName(newText);
			elmEvent.val(newText);
		}

		// проверяем на заполеность
		if (!newText && type == "style_name") {
			elmEvent.text(oldText);
			return false;
		}

		var maxCountChar = type == "comment" ? 1000 : 256;
		newText = newText.substr(0, maxCountChar);

		// делаем запрос если они не равны
		if (newText != oldText) {
			var queryString = 'site_id='+siteId+'&name='+newText+'&type='+type;
			ajaxPost('/sites2/editNameSite', queryString, function(res) {
				var res = res.responseText.trim();
				console.log(res)
				
				if (res) {
					Notification.ok(Resource.page_site_notification_edit);
				} else {
					elmEvent.text(oldText);
					Notification.error(Resource.main_notification_error);
				}
			});
		}
	}

/*******************************************************************************************/	
	/**
	* Удаление
	*
	*
	*/
	this.setEventDelete = function()
	{
		var obj = this;
		$('.butSiteDelete').off('mousedown');
		$('.butSiteDelete').on('mousedown', function() {
			var elmEvent = $(this);
			var siteId = obj.getId(elmEvent);
			var elmSite = elmEvent.closest('.siteBlock');

			var siteName = elmSite.find(".siteName").text().trim();
			//показываем окно подтвержения удаления
			var label = Resource.page_site_confirmation_delete_site+' "<b>'+siteName+'</b>"';
			Modal.confirmationDelete(label);
			obj.setEventButConfirmationDelete(elmSite, siteId);
		});
	}

	/**
	* Конопка подтверждеие удаления
	*
	*
	*/
	this.setEventButConfirmationDelete = function(elmSite, siteId) 
	{
		//подтверждение
		$('#confirmationDelete .butDelete').off('mousedown');
		$('#confirmationDelete .butDelete').on('mousedown', function() {
			$('#confirmationDelete .butDelete').off('mousedown');
			Modal.delete();

			// прячем сайт
			elmSite.css("display", "none");

			//уменьшаем декрементм
			var projectId = elmSite.attr("project");
			Project.editCountSites(projectId, (-1));
			Modal.createLoading(Resource.page_site_delete_loading_site);//ставим загрузку

			//запрос 
			ajaxPost('/sites2/deleteSite', 'site_id='+siteId, function(res) {
				var res = res.responseText.trim();
				
				if (res) {
					// Notification.ok("Страница удалена!");
					//удаляем страницу
					// elmSite.remove();
					// 
					location.reload();
				} else {
					Modal.delete();

					Notification.error();
					// показваем обратно если ошибка
					elmSite.css("display", "block");
					// ставим обратно число
					//уменьшаем декрементм
					Project.editCountSites(projectId, 1);
				}	
			});
		});
	}
/***************************************************************************************/
	/**
	* Видимость сайта
	*
	* @see 	this.setEvent()
	*/
	this.setEventPublished = function()
	{
		var obj = this;

		$(".butVisible").off("mousedown");
		$(".butVisible").on("mousedown", function() {
			var elmEvent = $(this);
			var blockPublished = elmEvent.parent();
			var publishedValue = elmEvent.attr("data-type");
			var siteId = obj.getId(elmEvent);

			// отмечаем кнопку 
			blockPublished.attr("data-type", publishedValue);

			// отправляем на сервер
			var queryString = 'site_id='+siteId+'&published='+publishedValue;
			ajaxPost('/sites2/editPublished', queryString, function(res) {
				var res = res.responseText.trim();
				
				if (!res) {
					Notification.error(Resource.main_notification_error);
					var publishedError = publishedValue == "no" ? "yes" : "no"; 
					blockPublished.attr("data-type", publishedError);
				}	
			});

			return false;
		});
	}
/***************************************************************************************/
	/**
	* Скачать 
	*
	*
	*/
	this.setEventDownload = function()
	{
		var obj = this;
		$(".butSiteDownload").off("mousedown");
		$(".butSiteDownload").on("mousedown", function() {
			$('.pageMenu').css('display', 'none');
			var siteId = obj.getId($(this));
			var modalWidthV = 830;
			var siteName = $(this).closest(".siteBlock").find(".siteName").text().trim();
			var modalTitle = Resource.page_site_download_title;
			modalTitle += " <b>"+siteName+"</b>";
			
			// создаем модальное окно
			var block = obj.getBlockDownloadSite();
			Modal.create({
				"id" : "modalDownloadSite",
				"width":modalWidthV,
				"top":80,
				"content":block,
				"title":modalTitle,
			});

			// устанавливаем событие
			obj.setEventDownloadFormat(siteId);

			Tip.setEvent();
		})
	}

	this.getBlockDownloadSite = function()
	{
		var blockCmsHol = '\
		<div class="typeFormatItem typeFormatCMSHollpee">\
			<div class="typeFormatItemLabel">\
				CMS Hollpee\
			</div>\
			<div class="typeFormatItemDescription">\
				Перед скачиванием посмотрите <a style="display:block;border-radius:3px;width:80px;text-align:center;font-size:15px;margin-top:5px;padding:5px 10px 3px 10px;color:rgb(240,240,240);background-color:rgb(50,50,50);" href="https://www.youtube.com/watch?v=q9P2q1t6hCw" target="_blank">видео</a>\
			</div>\
			<div class="butDownloadHtmlLabel">Выберите тип CMS</div>\
			<div class="listButDownCMSHlp">\
				<div id="butDownloadHtml" data-cms="start" class="butBlock butOk butDownloadCmsHollpee butDownloadCmsHollpeeStart">\
					<div class="textInBut" >Старт</div>\
				</div>\
				<div id="butDownloadHtml" data-cms="bizness" class="butBlock butOk butDownloadCmsHollpee butDownloadCmsHollpeeBizness">\
					<div class="textInBut" >Бизнес</div>\
				</div>\
				<div id="butDownloadHtml" data-cms="marketer" class="butBlock butOk butDownloadCmsHollpee butDownloadCmsHollpeeMarketer">\
					<div class="textInBut" >Маркетолог</div>\
				</div>\
				<div class="clear"></div>\
			</div>\
		</div>';

		var block = '\
		<div class="typeFormatBlock">\
			<div class="typeFormatItem typeFormatHTML">\
				<div class="typeFormatItemLabel">\
					HTML/PHP\
				</div>\
				<div class="typeFormatItemDescription">\
					'+Resource.page_site_download_html_desc+'\
				</div>\
				<div id="butDownloadHtml" data-type="html" class="butBlock butOk butDownloadOnlyHtml">\
					<div class="textInBut">HTML</div>\
				</div>\
				<div id="butDownloadHtml" data-type="php" class="butBlock butOk butDownloadOnlyHtml">\
					<div class="textInBut">PHP</div>\
				</div>\
			</div>\
			'+blockCmsHol+'\
			<div class="typeFormatItem typeFormatLPF">\
				<div class="typeFormatItemLabel">\
					'+Resource.page_site_download_hol_label+'\
				</div>\
				<div class="typeFormatItemDescription">\
					'+Resource.page_site_download_hol_desc+'\
				</div>\
				<a id="butDownloadLPF" href="/download/lpf" target="_blank" class="butBlock butOk butDownloadLPF">\
					<div class="textInBut">'+Resource.page_site_download_but+'</div>\
				</a>\
			</div>\
		</div>';

		return block;
	}

	/**
	* Событие на кнопку скачать определенного формата
	*
	* @see  this.setEventDownload()
	*/
	this.setEventDownloadFormat = function(siteId)
	{
		var obj = this;
		// 
		var butHtml = $(".butDownloadCms, .butDownloadCmsHollpee, .butDownloadOnlyHtml");
		butHtml.off("mousedown");
		butHtml.on("mousedown", function() {
			var elmEvent = $(this);
			Modal.createLoading(Resource.page_site_download_notification_create_arch);

			if (elmEvent.hasClass("butDownloadOnlyHtml")) var cmsName = "only_html";
			else if (elmEvent.hasClass("butDownloadCms")) var cmsName = elmEvent.attr("data-cms");
			else var cmsName = "hollpee";

			// тип cms
			var cmsHlpType = cmsName == "hollpee" ? elmEvent.attr("data-cms") : false;
			var fileType = elmEvent.attr("data-type") == "html" ? elmEvent.attr("data-type") : "php";

			// получить страницу для форматирования
			ajaxPost("/download/shapeHtml", "site_id=" + siteId, function(res) {
				var pageDataString = res.responseText.trim();
				obj.formatingPage(pageDataString, cmsName, fileType, cmsHlpType);
			});
		})

		/**************************************************************/
		var butLpf = $(".butDownloadLPF");
		butLpf.off("mousedown");
		butLpf.on("mousedown", function() {
			var elm_event = $(this);
			var href = elm_event.attr("href");
			if (!href.match(/\?/g)) href += "?site_id="+siteId;
			elm_event.attr("href", href);
		})

		butLpf.off("click");
		butLpf.on("click", function() {
			Modal.delete();
		})
	}	


	/**
	* Форматирует страницу
	*
	* @see 	this.setEventDownloadFormat()
	*/
	this.formatingPage = function(siteDataString, cmsName, fileType, cmsHlpType)
	{
		// форматируем страницу
		var site = Formating.execute(siteDataString, "download", cmsName, fileType);	
		var siteId = site.site_id;

		site = JSON.stringify(site);

		/*выяснить*****/
		setTimeout(function() {
			$("ymaps").remove();
		}, 3000);
		/*******/

		// return false;

		// отправляем на сервер, для формирования архива
		var queryString = {
			"site" : site, 
			"cms_name" : cmsName,
			"file_type" : fileType,
			"cms_hollpee_type":cmsHlpType
		};
		$.post("/download/createHtml", queryString, function(res) {
			var file_name = res.trim();
			
			// console.log(file_name);
			// return false;

			if (file_name)  {
				// перенаправляем для скачивания
				var href = "/download/html?name=" + file_name;
				location.href = href;
			} else {
				Notification.error(Resource.main_notification_error);
			}
			
			Modal.delete();
		});
	}
	$(document).ready(function() {
		// $(".butSiteDownload:last").mousedown();
		// setTimeout(function(){$(".butDownloadCmsHollpee").mousedown();}, 200);
		// setTimeout(function(){$(".butDownloadWp").mousedown();}, 200);
	});
/***********************************************************************************************/
/*********************************************************************************************/
	/**
	* Создает сайт
	*
	* @see 	this.setEvent()
	*/	
	this.setEventAddSite = function()
	{
		var obj = this;
		$(".butAddSite").off("click");
		$(".butAddSite").on("click", function() {
		});
	}

	/**
	* Создает модальное - добавление сайта
	*
	* @see 	this.setEvenAddSite()
	*/
	this.createModalAddSite = function()
	{
		var content = '\
			<div class="modalAddSiteBlock">\
				<div class="modalAddSiteLabel">Выберите тип сайта</div>\
				<div class="">\
					<div class="butAddType butAddTypeSite">Сайт</div>\
					<div class="butAddType butAddTypeLp" data-chosen="true">LP</div>\
					<div class="clear"></div>\
				</div>\
			</div>\
			<div class="modalAddSiteBlock">\
				<div class="modalAddSiteLabel">Введите имя сайта</div>\
				<input type="text" class="valueAddSiteName"/>\
			</div>\
		';

		Modal.create({
			// "title" : "Добавление нового сайта",
			"id" : "modalAddSite",
			"width" : 400,
			"top" : 50,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["add", "Добавить сайт"]
			]
		});
	}

	/**
	* Событие для модального - создание сайта
	*
	* @see 	this.setEvenAddSite()
	*/
	this.setEventModalAddSite = function()
	{
		var butType = $(".butAddType");
		butType.off("mousedown");
		butType.on("mousedown", function() {
			butType.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");
		});

		var butAdd = $("#modalAddSite .butAdd");
		butAdd.off("mousedown");
		butAdd.on("mousedown", function() {
			var siteName = $(".valueAddSiteName").val();
			if (!siteName) return false;
			siteName = siteName.replace(/[\s\-]+/gim, '_');

			var butTypeCur = $(".butAddType[data-chosen='true']");
			var siteType = butTypeCur.hasClass("butAddTypeLp") ? "lp" : "mlp";

			var urlAdd = '/choseStyle/addStyleSite?style_id=1';
			urlAdd += '&style_type='+siteType;
			urlAdd += '&style_name='+siteName;
			
			location.href = urlAdd;
		});
	}
/*******************************************************************************/

	/**
	* Копировать сайт
	*
	* @see 	this.setEvent()
	*/
	this.setEventCopy = function() 
	{		
		var obj = this;
		$(".butSiteCopy").off("mousedown");
		$(".butSiteCopy").on("mousedown", function() {

			var elmEvent = $(this);
			var siteId = elmEvent.closest(".siteBlock").attr("site");
			
			var elmSite = elmEvent.closest(".siteBlock");
			Modal.createLoading(Resource.page_site_copy_loading);//ставим загрузку

			// запрос
			ajaxPost('/sites2/copySite', 'site_id='+siteId, function(res) {
				var newSiteId = res.responseText.trim();

				// console.log(newSiteId)
				
				if (newSiteId) {				
					location.reload();
				} else {
					Modal.delete();
					Notification.error(Resource.main_notification_error);
				}
			});
		});
	}

/**********************************************************************************************/
	/**
	* Переместить
	*
	*
	*/
	this.setEventMove = function() {
		var obj = this;
		$(".butSiteMove").off("mousedown");
		$(".butSiteMove").on("mousedown", function() {
			var elmEvent = $(this);
			var siteId = elmEvent.closest(".siteBlock").attr("site");
			var projectId = obj.getProjectId(elmEvent);
			var elmSite = obj.getElmSite(elmEvent);
			// создаем модальное окно
			obj.createModalMove(siteId, projectId);
			// ставим событие
			obj.setEventButMove(elmSite, siteId, projectId);
		});
	}


	/**
	* Созлает модальное окно выбора проекта
	*
	*
	*/
	this.createModalMove = function(siteId, projectId)
	{
		// блок списка проектов
		var listProjectBlock = this.getListProjectBlock(projectId);
		// формируем блок
		var content = '\
			<div id="modalMoveLabel">'+Resource.page_site_move_label+'</div>'
			+listProjectBlock;


		Modal.create({
			"id":"modalMoveSite",
			"width":440,
			"top":100,
			"title":Resource.page_site_move_title,
			"content":content, 
			"button":[
				["cancel",Resource.main_modal_but_cancel],
				["add",Resource.page_site_move_but_ok]
			]
		});
	}

	/**
	* Отдает блок со списком проектов
	*
	*/
	this.getListProjectBlock = function(currentProjectId)
	{
		// список проектов
		var listProject = $(".listProject option[data-name]");

		// формируем блок
		var block = '<select name="project" id="selectProject">';
		var count = listProject.length;
		for (var i=0; i<count; i++) {
			var project = listProject.eq(i);
			var projectId = project.val();
			var projectName = project.attr("data-name");
			var selected = projectId == currentProjectId ? 'selected="selected"' : '';

			block += '<option value="'+projectId+'" '+selected+'>'+projectName+'</option>'
		}
		block += "</select>";
		return block;
	}


	/**
	* Событие - перемещение сайта
	*
	*
	*/
	this.setEventButMove = function(elmSite, siteId, oldProjectId)
	{	
		$("#modalMoveSite .butAdd").off("mousedown");
		$("#modalMoveSite .butAdd").on("mousedown", function() {
			var selectedProjectId = $("#modalMoveSite select").val();
			Modal.delete();
			// если один и тотже проект
			if (oldProjectId == selectedProjectId) return false;

			// прячем элемент если не все сайты вывведены
			if (!Project.isTotalSites()) elmSite.css("display", "none");

			// изменяем колчество
			Project.editCountSites(oldProjectId, (-1), true);
			Project.editCountSites(selectedProjectId, 1, true);

			//запрос
			var queryString = "site_id="+siteId+"&project_id="+selectedProjectId; 	
			ajaxPost("/sites2/moveSite", queryString, function(res) {
				var res = res.responseText.trim();

				if (res) {
					Notification.ok(Resource.page_site_move_notifacation_ok);
					//удаляем сайт, если не вкладка - все
					if (!Project.isTotalSites()) {
						elmSite.remove();
					} else {
						// ставим новый project_id
						elmSite.attr("project", selectedProjectId)
					}
				} else {
					Notification.error(Resource.main_notification_error);
					// показваем обратно если ошибка
					elmSite.css("display", "block");
					// ставим значение обратно
					Project.editCountSites(oldProjectId, 1, true);
					Project.editCountSites(selectedProjectId, (-1), true);
				}	
			});
		});
	}

/**********************************************************************************************/

	/**
	* Установить событие
	*
	* @see 	setEvent();
	*/
	this.setEventUploadLPF = function()
	{
		var obj = this;
		
		var parentBut = $(".listAddButSites");
		var butHtml = '<div class="butTop butUploadStyle h-but-upload-file">Загрузить .hollpee</div>';
		File.createButUpload(parentBut, butHtml, '/download/uploadLPF', "template", false, function(res) {
			res = res.trim();

			if (!res) {
				Modal.delete();
				Notification.error();
				return false;
			}

			var res = JSON.parse(res);

			if (res["status"] == "success") {
				location.reload();
			} else {
				Modal.delete();

				if (res["strerror"] == "no_access") {
					obj.showModalNoAccessTemplate();
					return false;
				}

				if (res["strerror"] == "no_exists_hash") {
					var errorLabel = "Проект поврежден";
				} else if (res["strerror"] == "private_template") {
					var errorLabel = "Загрузка разрещена, только владельцу этого шаблона";
				} else {
					var errorLabel = '';
				}

				Modal.delete();

				Notification.error(errorLabel);
			}
		});

	}

	/**
	* Модальное - закрыт доступ к загружаемогу сайту
	*
	* @see 	this.setEventUploadLPF()
	*/
	this.showModalNoAccessTemplate = function()
	{
		alert("Ключ активации не верный");
	}

/**********************************************************************************************/
/**********************************************************************************************/
	/**
	* Отдает id сайта
	*
	*/
	this.getId = function(elm)
	{
		return this.getElmSite(elm).attr('site');
	}

	this.getNameById = function(siteId)
	{
		return $(".siteBlock[site='"+siteId+"']").find(".siteName").text().trim();
	}

	/**
	* Отдает id сайта
	*
	*/
	this.getElmSite = function(elm)
	{
		return elm.closest('.siteBlock');
	}

	/**
	* Отдает id проекта
	*
	*/
	this.getProjectId = function(elm) {
		return this.getElmSite(elm).attr('project');
	}


	/**
	* Убирает меню
	*
	*
	*/
	this.hideMenu = function() 
	{
		$('.pageMenu').css('display', 'none');
	}

	/**
	* Удалить меню
	*
	*
	*/
	this.removeMenu = function()
	{
		$(".siteMenu").remove();
	}

	/**
	* Очищаем имя
	*
	*/
	this.clearName = function(nameElm)
	{
		nameElm = nameElm.replace(/ё/gim, 'е');
		nameElm = nameElm.replace(/[^a-zа-я0-9_\-\s\.\,]+/gim, '');
		return nameElm;
	}

/**********************************************************************************************/
}//end List Sites 
 
/**********************************************************************************************/
/**********************************************************************************************/

var HlpPage = new HlpPage();
function HlpPage() {

	this.init = function()
	{
		this.setEvent();
	}

	this.setEvent = function()
	{
		this.setEventTutorial();
	}

	/**
	* Инструкция
	*
	* @see 	this.setEvent()
	*/	
	this.setEventTutorial = function()
	{
		var obj = this;
		var butObj = $(".blockTutorialItem[data-embed]");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			var embed = elmEvent.attr("data-embed");
			var label = elmEvent.attr("data-label");
			obj.showModalTutorial(embed, label);
		});
	}

	this.showModalTutorial = function(embed, label)
	{
		var content = '<iframe class="modalTutorialVideo" src="https://www.youtube.com/embed/'+embed+'" frameborder="0" allowfullscreen></iframe>';

		Modal.create({
			"id":"modalTutorial",
			"title":'Инструкция "'+label+'"',
			"top":50,
			"width":600,
			"content":content,
		});
	}

/******************************************************************************/
	
} // end class 

