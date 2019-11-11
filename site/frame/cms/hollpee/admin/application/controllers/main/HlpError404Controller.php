<?php  
/**
* Редактирование стриницы
*
*
*
*
*/
class HlpError404Controller extends HlpMainController implements HlpIController {
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