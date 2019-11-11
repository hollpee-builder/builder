<?php  
abstract class MainController {
	public $objFront;
	public $objView;
	
	function __construct()
	{
		$this->objFront = $this->objFront ? $this->objFront : FrontController::getInstance();
		$this->objView = $this->objView ? $this->objView : new View();
		$this->params = $this->objFront->getParams();
	}

	/**
	* Установить куку user
	*
	* @param 	string 	$value - значение куки
	* @return 	void
	*
	*/
	protected function setCookieUser($value)
	{
		$time = time()+3600*24*50;
		setcookie('user', $value, $time, '/', DOMAIN);
	}

	/**
	* Удалить куку user
	*
	* @return 	void
	*
	*/
	protected function deleteCookieUser($value='')
	{
		setcookie('user', $value, time()-3600, '/', DOMAIN);
	}
	
	protected function getArr($arr)
	{
		echo '<pre>';
		print_r($arr);
		echo '<pre>';
		exit;
	}

	protected function error404()
	{
		header('Location: /error404');
		exit;
	}

/***************************************************************************************/

}//end class

?>






