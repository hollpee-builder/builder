$(document).ready(function() { loading_editor();});

function loading_editor()
{
	var res = $("#jsPropertyJson").html().trim();

	res = res.replace(/@@@@@hp@@@@@/gim, "http", res);
	var params = JSON.parse(res);

	// если редактировать нельзя
	if (params.no_edit) {
		showModalNoEditSite(params);
		return false;
	}

	// ставим данные
	var jsonData = '<div id="jsonData">'+params.jsonSite+'</div>';
	jsonData += '<div id="jsonUserData">'+params.jsonUser+'</div>';
	$(".sectionForWork").append(jsonData);
	
	// кнопки выход и просмотр
	$(".butExit").attr("href", '/');
	$(".butFullShow").attr("href", params.showHref); // кнопка просмотр
	$(".butSitePublished").attr("href", params.sitePublished); // upload
	
	// выполняем js 
	Input.init(params);

	// убираем загрузку
	setTimeout(function() {
		$(".loadingSiteSection").css("display", "none");
	}, 100);
}//end class


function showModalNoEditSite(params)
{
	if (params.count_site_rate == 0) {
		var msgNoEdit = "Извините, у вас закончился тариф, для продолжения работы вам необходимо его оплатить";
		var content = '\
			<div class="modalRateLimitedTitle">Ограничение тарифа</div>\
			<div class="noAddSiteDesc">'+msgNoEdit+'</div>\
			<a href="/payment" target="_blank" class="butRateLimited">Список тарифов</a>\
			';
	} else {
		var countDelete = params.count_site_user - params.count_site_rate;
		if (countDelete == 1) var strSite = 'сайт'; 
		else if (countDelete > 1 && countDelete < 5 ) var strSite = 'сайта';
		else var strSite = 'сайтов';

		var content = '\
			<div class="modalNoEditTitle">Редактирование сайта ограничино</div>\
			<div class="noModalCountBlock">\
				<div class="noModalCountItem">Текущие количество сайтов:'+params.count_site_user+'</div>\
				<div class="noModalCountItem">Количество доступных сайтов:'+params.count_site_rate+'</div>\
			</div>\
			Ваше текущие количество сайтов превышает количество сайтов доступное по вашему тарифу.\
			Для снятия ограничения, вам необходимо удалить '+countDelete+' '+strSite;
	}

	Modal.create({
		"id":"modalNoEdit",
		"width":"440",
		// "height":"210",
		"not_event":true,
		"top":"70",
		"content":content
	});

	$(".loadingSiteSection").css("display", "none");
}

