<?php  
abstract class HlpMainController {
	public $objFront;
	public $objView;
	
	function __construct()
	{
		// создаем базы данных если их нету
		$isCreateDb = HlpDbInit::getInstance()->create();

		// проверка на существование админа
		$this->checkExistAdmin($isCreateDb);

		// создаем стандарные объекты
		$this->objFront = $this->objFront ? $this->objFront : HlpFrontController::getInstance();
		$this->objView = $this->objView ? $this->objView : new HlpView();
		$this->params = $this->objFront->getParams();
	}

	/**
	* Проверка на существование админа
	*
	* @see 	$this->__construct()
	*/
	private function checkExistAdmin($isCreateDb)
	{
		$urlRegister = HlpUrl::attach('/login/register');
		$urlRegisterCheck = HlpUrl::attach('/login/registerCheck');
		$url = $_SERVER['REQUEST_URI'];

		$isExistAdmin = HlpDbAdmin::getInstance()->isExistsProfile();

		if ((!$isExistAdmin || $isCreateDb) 
				&& $url != $urlRegister && $url != $urlRegisterCheck) {
			// перенаправляем на страницу создание
			header('Location: ' . $urlRegister);
			exit;
		// если уже есть админ и это страница регистрации
		} else if ($isExistAdmin && ($url == $urlRegister || $url == $urlRegisterCheck)) {
			header('Location: ' . HlpUrl::attach('/'));
			exit;
		}
	}

	protected function error404()
	{
		header('Location: ' . HlpUrl::attach('/error404'));
		exit;
	}

}//end class

?>
