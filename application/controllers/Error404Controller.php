<?php  
/**
* Редактирование стриницы
*
*
*
*
*/
class Error404Controller extends MainController implements IController {
	/**
	* Выдает ошибку 404
	*
	*/
	function indexAction()
	{	
		header('HTTP/1.1 404 Not Found');
		echo $this->objView->render('/error404.php');
	}

}



?>