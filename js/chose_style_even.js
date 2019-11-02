$(document).ready(function() {
	Styles.init();
});




/**
* Стили
*
*/
var Styles = new Styles();
function Styles()
{
	this.class = {};
	this.class.block_style = "selectStyleBlock";
	this.class.block_nav = "navStyle";
	this.class.nav_item = "navStyleItem";

	this.getClassBlockStyle = function()
	{
		return this.class.block_style;
	}

	this.getClassBlockNav = function()
	{
		return this.class.block_nav;
	}

	this.getClassNavItem = function()
	{
		return this.class.nav_item;
	}

/***********************************************************************************/

	this.listStyle  = {'lp' : {}, 'site' : {}};
	this.listStyle['site']['10_1'] = {'name' : 'Пустой', 'group' : '10'};
	this.listStyle['lp']['10_1'] = {'name' : 'Пустой', 'group' : '10'};
	// this.listStyle['lp']['20_1'] = {'name' : 'Пустой', 'group' : '20'};
	// this.listStyle['lp']['20_2'] = {'name' : 'Пустой', 'group' : '20'};
	// this.listStyle['lp']['20_3'] = {'name' : 'Пустой', 'group' : '20'};
	// this.listStyle['lp']['20_4'] = {'name' : 'Пустой', 'group' : '20'};
	// this.listStyle['lp']['20_5'] = {'name' : 'Пустой', 'group' : '20'};
	// this.listStyle['lp']['20_6'] = {'name' : 'Пустой', 'group' : '20'};
	// // 
	// this.listStyle['lp']['30_1'] = {'name' : 'Пустой', 'group' : '30'};
	// this.listStyle['lp']['30_2'] = {'name' : 'Пустой', 'group' : '30'};
	// // this.listStyle['lp']['30_3'] = {'name' : 'Пустой', 'group' : '30'};
	// this.listStyle['lp']['30_4'] = {'name' : 'Пустой', 'group' : '30'};
	// this.listStyle['lp']['30_5'] = {'name' : 'Пустой', 'group' : '30'};
	// this.listStyle['lp']['30_6'] = {'name' : 'Пустой', 'group' : '30'};

	// //service
	// this.listStyle['lp']['40_1'] = {'name' : 'Пустой', 'group' : '40'};
	// this.listStyle['lp']['40_2'] = {'name' : 'Пустой', 'group' : '40'};
	// this.listStyle['lp']['40_3'] = {'name' : 'Пустой', 'group' : '40'};
	// this.listStyle['lp']['40_4'] = {'name' : 'Пустой', 'group' : '40'};
	// this.listStyle['lp']['40_5'] = {'name' : 'Пустой', 'group' : '40'};
	// this.listStyle['lp']['40_6'] = {'name' : 'Пустой', 'group' : '40'}; 

	this.listGroup = {'lp' : {}, 'mlp' : {}};
	// this.listGroup['mlp']['10'] = Resource.page_chosenstyle_group_basic;
	// this.listGroup['lp']['10'] = Resource.page_chosenstyle_group_basic;
	// this.listGroup['lp']['20'] = Resource.page_chosenstyle_group_magazine;
	// this.listGroup['lp']['30'] = Resource.page_chosenstyle_group_infobiznes;
	// this.listGroup['lp']['40'] = Resource.page_chosenstyle_group_service;

/********************************************************************************************/

	this.init = function() 
	{
		this.setProperty();
		
	}

	this.setProperty = function() 
	{
		this.addNav("lp");
		this.addStyleBlock("lp", 10);
	}

	this.addNav = function(type)
	{
		var listNav = this.listGroup[type];

		var block = '';
		for (var navId in listNav) {
			var navName = listNav[navId];
			block += '<div class="'+this.getClassNavItem()+'" data-type="'+type+'" data-group="'+navId+'">\
							'+navName+'\
						</div>'
		}

		$("."+this.getClassBlockNav()).html(block);
		this.setEventNav();
	}

	this.setEventNav = function()
	{	
		var obj = this;
		var butObj = $(".navStyleItem");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			obj.addStyleBlock(elmEvent.attr("data-type"), elmEvent.attr("data-group"));
		});
	}

	this.markNav = function(groupId)
	{
		var listNav = $("."+this.getClassNavItem());
		listNav.removeAttr("data-chosen");
		listNav.filter("[data-group='"+groupId+"']").attr("data-chosen", "true");
	}

/***********************************************************************************/


	this.addStyleBlock = function(type, groupId)
	{
		var listStyle = this.listStyle[type];
		var listBlock = '';
		for (var styleId in listStyle) {
			var styleProperty = listStyle[styleId];
			var styleName = styleProperty['name'];
			var styleGroup = styleProperty['group'];
			if (groupId != styleGroup) continue;

			listBlock += this.getStyleBlock(type, styleId);
		}
		listBlock += '<div class="clear"></div>';

		$("."+this.getClassBlockStyle()).html(listBlock);
		this.setEventStyle();

		this.markNav(groupId);
	}

	this.getStyleBlock = function(type, id)
	{
		var block = '<div class="itemStyleBlock">\
							<div class="selectStyleItem" >\
				<div class="imgStylePage">\
					<img src="/site/style/'+type+'/'+id+'/avatar.png" alt="">\
				</div>\
				<div class="styleBlockButton">\
					<div class="styleItemBut styleItemOk" style-type="'+type+'" style-id="'+id+'">\
						'+Resource.page_chosenstyle_site_hover_add+'\
					</div>\
					<a href="/show/?id='+id+'&site_type='+type+'" target="_blank" class="styleItemBut styleItemShow">\
						'+Resource.page_chosenstyle_site_hover_show+'\
					</a>\
				</div>\
			</div>\
		</div>';

		return block;
	}

/********************************************************************************************/
	
	this.setEventStyle = function()
	{
		this.setEventStylesType();
		this.setEventChosenStyles();
	}


	/**
	* Вкладки типа
	*
	*
	*/
	this.setEventStylesType = function()
	{
		var obj = this;
		var butObj = $(".typeSiteItem");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elmEvent = $(this);
			var siteType = elmEvent.attr("type");
			butObj.removeAttr("chosen");
			elmEvent.attr("chosen", "true");

			obj.addNav(siteType);
			obj.addStyleBlock(siteType, 10);

			return false;
		});
	}
/**************************************************************************************************/
	/**
	* События для стилей
	*
	* @see 	this.setStyleCategory()
	*/
	this.setEventChosenStyles = function()
	{
		var obj = this;
		$('.styleItemOk, .butAddSite').off('mousedown');
		$('.styleItemOk, .butAddSite').on('mousedown', function() {
			var elmEvent = $(this);
			var styleId = elmEvent.attr("style-id");
			var styleType = elmEvent.attr("style-type");

			//вывести модальное окно
			obj.createModalNameStyle(styleId, styleType);		
			//событие сохранить стиль
			obj.setEventSaveStyle(elmEvent);
			
			return false;
		})
	}

	/**
	* Создает модальное окно для ввода название стиля
	* 
	* @see 	this.setEventStyles() 
	*/
	this.createModalNameStyle = function(styleId, styleType)
	{
		//блок
									 // <div class="butChosenTypeAccessTutorial" data-type="type">Подробние</div>\
		var block = '<div class="choseStyleNameSetion">\
						<form action="" id="formStyle" method="post">\
							<input type="text" name="style_name" id="nameStyleUser" class="name nameStyle" placeholder="'+Resource.page_chosenstyle_modal_input_name+'"/>\
							<div class="choseStyleBlockTypeAccess" style="display:none;">\
								<div class="choseStyleBlockTypeAccessLalbel">тип сайта</div>\
								<div class="choseStyleListButAccess">\
									<div class="butChosenTypeAccess" data-type="free" data-chosen="true">Публичный</div>\
									<div class="butChosenTypeAccess" data-type="private">Личный</div>\
									<div class="butChosenTypeAccessTutorial" data-type="access">Подробние</div>\
									<div class="clear"></div>\
								</div>\
							</div>\
							<input type="hidden" name="style_id" value="'+styleId+'"/>\
							<input type="hidden" name="style_type" value="'+styleType+'"/>\
							<input type="hidden" class="valIdGroup" name="group_id" value=""/>\
						</form>\
					</div>';

		//создаем модальное
		Modal.create({	'id':'modalEnterName', // класс оболочки
						'content':block, //содержимое
						'title': Resource.page_chosenstyle_modal_title,
						'button':[ //кнопки на странице
									['cancel', Resource.main_modal_but_cancel],
									['add', Resource.main_modal_but_add]
								 ],
						'width':'450', //ширина
						'height':'', 
						'top':'50'});	//отступ сверху
		$("#nameStyleUser").focus();
	}

	/**
	* Ставим событие на сохранение стиля
	*
	* @param 	object 	elm - элемент на котором сработало событие 
	*
	* @see 		setEventSelectStyle
	* @todo  	проверку на валидность
	*/
	
	this.setEventSaveStyle = function(elm)
	{	
		this.setEventSaveStyleTypeAccess(elm);
		this.setEventSaveStyleTypeAccessTutorial(elm);
		this.setEventSaveStyleAdd(elm);
		this.setEventSaveTypeSite();
	}

	this.setEventSaveStyleTypeAccess = function()
	{
		var butObj = $(".butChosenTypeAccess");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			butObj.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");
		});
		
	}

	this.setEventSaveTypeSite = function()
	{
		var butObj = $(".butAddType");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			butObj.removeAttr("data-chosen");
			$(this).attr("data-chosen", "true");
		});
	}

	this.setEventSaveStyleTypeAccessTutorial = function()
	{
		var butObj = $(".butChosenTypeAccessTutorial");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			if ($(this).attr("data-type") == "access") {
				var embed = 'JNDQ-y3_yOs';
			} else {
				var embed = '';
			}
			
			var content = '\
				<div class="modalVideoFrameWrap">\
					<div class="modalVideoFrameContent">\
						<iframe style="width:100%;height:280px;display:block;" id="modalVideoFrame" src="http://www.youtube.com/embed/'+embed+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>\
					</div>\
				</div>';

			Modal.create({
				'id':'modalTypeAccessTutorial',
				'content':content,
				'title': "Подробние о типах сайтах",
				'button':[
							['cancel', 'Закрыть'],
						],
				'width':'550',
				'height':'', 
				'top':'50'});
		});
	}

	this.setEventSaveStyleAdd = function(elm)
	{
		$('#modalEnterName .butAdd').off('mousedown');
		$('#modalEnterName .butAdd').on('mousedown', function() {
			//введеное имя пользователя
			var styleName = $('.nameStyle').val();

			//@todo - проверку на валидность
			// styleName = clearName.replace(/[^\w\s]+/gim, '');
			if (!styleName) {
				Notification.error("Необходимо ввести имя сайта");
				$('.nameStyle').val('');
				return false;

			}
			Modal.createLoading("Создаю новый сайт");

			//id стиля
			var formObj = $("#formStyle");
			var styleId = formObj.find('input[name="style_id"]').val();
			var styleType = formObj.find('input[name="style_type"]').val();
			var typeAccess = formObj.find(".butChosenTypeAccess[data-chosen='true']").attr("data-type");
			
			//сохраняем стиль
			location.href = '/choseStyle/addStyleSite?style_id='+styleId+'&style_type='+styleType+'&style_name='+styleName+'&type_access='+typeAccess;
		})
	}

/*********************************************************************************************/
}//end Styles


