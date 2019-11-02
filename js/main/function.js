var domain = 'hollpee.com';
var domain_root = 'root.'+domain; 
var domain_editor = 'editor.'+domain; 
/***************************************************************************/

/**************************************************************************************************/
/**
* Отдает параметры запроса GET в виде массива
*
*
*/
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
/*********************************************************************************************/
/**
* Копирует
*
* @see 	SelectPage.editListPagesId()
* @see 	SelectPage.addNewPageInList()
* @see 	History.record()
*/
function copyArray(array)
{
	var newArray = {}; 
	for (var index in array) {
		var item = array[index];
		if (item instanceof Object) {
			// newArray[index] = this.copyArray(item);
			newArray[index] = copyArray(item);
		} else {
			newArray[index] = item;
		}
	}
	return newArray;
}

/**********************************************************************************************/
/************************************************************************************************/
/**
* Подсказка
*
*
*/
var Promt = new Promt();
function Promt()
{
	/**
	* Показывает
	*
	*
	*/
	this.show = function(elmEvent, label)
	{

	}

	/**
	* Устанавливаем события 
	*
	*
	*/
	this.setVariable = function()
	{

	}
/********************************************************************************************/
	/**
	* Прячет
	*
	*
	*/
	this.hide = function() 
	{

	}
/**************************************************************************************************/
}//end class

/**************************************************************************************************/
/***********************************************************************************************/






















