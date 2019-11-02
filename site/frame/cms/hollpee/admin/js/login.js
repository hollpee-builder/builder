$(document).ready(function() {
	/**
	* Нажатие submit
	*
	*
	*/
	$(".send").off("click");
	$(".send").on("click", function() {
		// проверяем валидацию
		var elmForm = $(this).closest("form");
		var varifyStatus = Form.verify(elmForm);
		if (!varifyStatus) return false;
	})

	/**
	* Показываем ошибки если есть
	* 
	*/
	Form.showErrorsByGET($(".formLoginRegister"), requestGET());


});


function requestGET()
{
	var requestString = location.search.replace(/^\?/, '');
	var listParams = requestString.split('#');
	var GET = {};

	for (var index in listParams) {
		var param = listParams[index].split('=');
		GET[param[0]] = param[1];
	}

	return GET;
}

