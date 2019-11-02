/**
* Page source code
*
*
*/
var PageSetting = new PageSetting();
function PageSetting() {

	/**
	* Настройки страницу
	*
	* @see 	EditorController.setEventPageSetting()
	*/
	this.showModal = function()
	{
		var content = this.getModalContent();

		Modal.create({
			"id" : "modalPageSetting",
			"title" : Resource.hlp_modal_pagesetting_title,
			"width" : 850,
			"top" : 10,
			"content" : content,
			"button" : [
				["cancel", Resource.main_modal_but_cancel]
			]
		});

		this.set();
		this.setEvent();
	}

	/**
	* Отдает содержимое модального
	*
	* @see 	this.showModal()
	*/
	this.getModalContent = function()
	{
		var content = '\
			<div class="pageSettingBlock">\
				<div class="pageSettingBlockLeft">\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Страница</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									SEO\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSetting butPageSettingSeo">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Open Graph\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSetting butPageOpenGraph">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">'+Resource.hlp_modal_pagesetting_label_site+'</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Менеджер файлов\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butManagerFile">Открыть</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Lazy Load\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="pageSettingToggle valuePageSettingLazyLoad">\
										<div class="butPageSettingToggleItem" data-value="no">'+Resource.main_value_none+'</div>\
										<div class="butPageSettingToggleItem" data-value="yes">'+Resource.main_value_yes+'</div>\
										<div class="clear"></div>\
									</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="pageSettingBlockRight">\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Вставка кода для всего сайта</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									начало файла\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="before_head" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Head\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="head" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_start+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_start" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_end+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_end" data-place="site">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
					<div class="pageSettingBlockCode">\
						<div class="pageSettingBlockLabel">Вставка кода для текущей страницы</div>\
						<div class="pageSettingBlockContent">\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									начало файла\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="before_head" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									Head\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="head" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_start+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_start" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
							<div class="pageSettingBlockItem">\
								<div class="pageSettingBlockItemKey">\
									'+Resource.hlp_modal_pagesetting_label_end+' Body\
								</div>\
								<div class="pageSettingBlockItemValue">\
									<div class="butPageSettingCodeInsert" data-type="body_end" data-place="page">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
								</div>\
								<div class="clear"></div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="clear"></div>\
			</div>\
		';

		return content;
	}

/*********************************************************************************/
	
	/**
	* Установить 
	*
	*/
	this.set = function(elm)
	{
		// seo
		this.setSite();
	}

	this.setSite = function()
	{
		this.setLazyLoad();
	}

	this.setLazyLoad = function()
	{
		// lazyload
		var lazyStatus = Site.isLazyLoadRunning() ? "yes" : "no";
		$(".butPageSettingToggleItem").removeAttr("data-chosen")
									.filter("[data-value='"+lazyStatus+"']")
									.attr("data-chosen", "true");
	}

/**********************************************************************************/
/**************************************************************************************/

	this.setEvent = function()
	{
		this.setEventPage();

		this.setEventCode();
		this.setEventSite();
		this.setEventManagerFile();
	}


	this.setEventPage = function()
	{
		this.setEventSeo();
		this.setEventOpenGraph();
	}

	this.setEventSeo = function()
	{
		var obj = this;
		var butObj = $(".butPageSettingSeo");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalSeo();
		});
	}

	this.showModalSeo = function()
	{
		this.createModalSeo();
		this.setEventModalSeo();
	}

	this.createModalSeo = function()
	{
		var content = this.getModalContentSeo();

		Modal.create({
			"id" : "modalSettingSeo",
			"title" : "Настройка SEO",
			"width" : 500,
			"top" : 40,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Сохранить"]
			]
		});
	}

	this.getModalContentSeo = function()
	{
		var listSeo = Data.page.data.seo;
		var seoTitle = listSeo.title;
		if (!seoTitle) seoTitle = '';
		var seoDesc = listSeo.description;
		if (!seoDesc) seoDesc = '';
		var seoKey = listSeo.key;
		if (!seoKey) seoKey = '';
		var iconSrc = Data.site.data.icon;

		var content = '\
			<div class="pageSettingBlockContent">\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Title\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoTitle" data-type="title">'+seoTitle+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Description\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoDescription" data-type="description">'+seoDesc+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Keywords\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueSeoKey" data-type="key">'+seoKey+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Favicon\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<img src="'+iconSrc+'" class="menuSiteIcon" alt="">\
						<div class="butEditSiteIcon">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return content;
	}

	this.setEventModalSeo = function()
	{
		var butSave = $("#modalSettingSeo .butOk");
		butSave.off("mousedown");
		butSave.on("mousedown", function() {
			var seoTitle = $(".valueSeoTitle").val().trim();
			var seoDesc = $(".valueSeoDescription").val().trim();
			var seoKey = $(".valueSeoKey").val().trim();

			Data.page.data.seo.title = seoTitle;
			Data.page.data.seo.description = seoDesc;
			Data.page.data.seo.key = seoKey;

			History.record();

			Modal.removeLast();
		});

		var butIconObj = $(".butEditSiteIcon");	
		butIconObj.off("mousedown");
		butIconObj.on("mousedown", function() {
			var paramsV = {
				"src" : Data.site.data.icon,
				"operation" : "edit_icon",
				"fixed_history" : "yes"
			}
			EditElementImage.edit(paramsV);
			
			return false;
		});
	}

/**************************************************************************************/

	this.setEventOpenGraph = function()
	{
		var obj = this;
		var butObj = $(".butPageOpenGraph");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			obj.showModalOpenGraph();
		});
	}

	this.showModalOpenGraph = function()
	{
		this.createModalOpenGraph();
		this.setEventModalOpenGraph();
	}

	this.createModalOpenGraph = function()
	{
		var content = this.getModalContentOpenGraph();

		Modal.create({
			"id" : "modalSettingOpenGraph",
			"title" : "Настройка Open Graph",
			"width" : 500,
			"top" : 40,
			"content" : content,
			"button" : [
				["cancel", "Отмена"],
				["ok", "Сохранить"]
			]
		});
	}

	this.getModalContentOpenGraph = function()
	{
		var listOpenGraph = Data.page.data.opengraph;
		if (!listOpenGraph) listOpenGraph = {};

		var openGraphTitle = listOpenGraph.title;
		if (!openGraphTitle) openGraphTitle = '';
		var openGraphDesc = listOpenGraph.description;
		if (!openGraphDesc) openGraphDesc = '';
		var openGraphImage = listOpenGraph.image;
		if (!openGraphImage) openGraphImage = '';

		var content = '\
			<div class="pageSettingBlockContent">\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Title\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueOpenGraphTitle" data-type="title">'+openGraphTitle+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Description\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<textarea class="valueSeo valueOpenGraphDescription" data-type="description">'+openGraphDesc+'</textarea>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<div class="pageSettingBlockItem">\
					<div class="pageSettingBlockItemKey">\
						Изображение\
					</div>\
					<div class="pageSettingBlockItemValue">\
						<img src="'+openGraphImage+'" class="openGraphImage" alt="">\
						<div class="butPageSetting butEditOpenGraphImage">'+Resource.hlp_modal_pagesetting_but_edit+'</div>\
					</div>\
					<div class="clear"></div>\
				</div>\
			</div>\
		';

		return content;
	}

	this.setEventModalOpenGraph = function()
	{
		var butSave = $("#modalSettingOpenGraph .butOk");
		butSave.off("mousedown");
		butSave.on("mousedown", function() {
			if (!Data.page.data.opengraph) Data.page.data.opengraph = {};
	
			Data.page.data.opengraph.title = $(".valueOpenGraphTitle").val().trim();
			Data.page.data.opengraph.description = $(".valueOpenGraphDescription").val().trim();

			History.record();
			Modal.removeLast();
		});

		var butImageObj = $(".butEditOpenGraphImage");	
		butImageObj.off("mousedown");
		butImageObj.on("mousedown", function() {
			if (!Data.page.data.opengraph) Data.page.data.opengraph = {};
			
			var paramsV = {
				"src" : Data.page.data.opengraph.image,
				"operation" : "edit_opengraph",
				"fixed_history" : "yes"
			}
			EditElementImage.edit(paramsV);
			
			return false;
		});
	}

/****************************************************************************/

	/**
	* Изменение кода
	*
	* @see 	this.setEvent()
 	*/
	this.setEventCode = function()
	{
		var listPlaceTextV = {
			"before_head" : "Начало файла",
			"head" : "Head",
			"body_start" : "начало Body",
			"body_end" : "конец Body"
		}
		var butObj = $(".butPageSettingCodeInsert");
		var obj = this;
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var codeStateV = $(this).attr("data-place");
			var codeTypeV = $(this).attr("data-type");
			
			var placeTextV = listPlaceTextV[codeTypeV];
			var modalTitle = "Вставка кода в <b>" + placeTextV+"</b>";
			var oldCodeV = Data[codeStateV]["data"]["added_code"][codeTypeV];
			EditorCode.edit(modalTitle, oldCodeV, function(newCodeV) {
				Data[codeStateV]["data"]["added_code"][codeTypeV] = newCodeV;

				History.record();
				Modal.removeLast();
			});
		});
	}

	this.setEventManagerFile = function()
	{
		var butFileObj = $(".butManagerFile");
		butFileObj.off("mousedown");
		butFileObj.on("mousedown", function() {
			var filePropertyV = {
				"file_type":"video", 
				"category":"my", 
				"operation":"add",
				"no_chosen":true};
			EditElementImage.edit(filePropertyV);
			
			return false;
		});
	}

/*************************************************************************************/
	
	this.setEventSite = function()
	{
		this.setEventSiteLazyLoad();
	}

	this.setEventSiteLazyLoad = function()
	{
		var obj = this;
		var butObj = $(".butPageSettingToggleItem");
		butObj.off("mousedown");
		butObj.on("mousedown", function(){
			// ставим статус
			var lazyStatus = $(this).attr("data-value") == "yes";
			Site.setLazyLoadRunning(lazyStatus);
			// устанавливаем на панели 
			obj.setLazyLoad();
		});
	}


/*******************************************************************************/	

} // end class
