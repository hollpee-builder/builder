/**
* Добавление новых элементов
*
*
*
*/
var ElementAddController = new ElementAddController();
function ElementAddController() {
	/**
	* @var 	array 	список параметров для функций добавления
	* @see 	this.setEvent()
	*/
	this.list_param_add = {
		'image': {'operation':'add', 'src':'', 'file_type':'img'}
	}

	/**
	* События
	*
	* @uses 	ListAddElement 			список элементов для добавления 		
	* @uses 	ListEditElement 		список элементов для редактирования		
	* @uses		this.list_param_add 	список параметров для функции 
	*/
	this.setEvent = function()
	{
		// добавления элементов
		this.setEventElement();
	}
/*****************************************************************************************/
	/**
	*
	* @see 	this.setEvent()
	*/
	this.setEventElement = function()
	{
		var obj = this;
		$('.elementsItem').off('mousedown');
		$('.elementsItem').on('mousedown', function() {
			var elmEvent = $(this);

			if (elmEvent.attr("no-add")) return false;

			//если активна
			var type = elmEvent.attr('type');
			var operation = elmEvent.attr('operation');

			//создаем сразу
			if (operation == 'modal') {
				var params = obj.list_param_add[type];
				if (!params) params = {'operation':'add'};

				//сначала вызываем модальное окно
				ListEditElement[type].edit(params);
			} else {
				var params = {};
				if (type == "column") params["count_column"] = elmEvent.attr("data-count");
				
				//создаем объект
				ListElementObject[type].create(params);
			}
			// сброс фокуса
			Editor.resetFocus();
			return false;
		});
	}
	


/**************************************************************************************/
}//end class














