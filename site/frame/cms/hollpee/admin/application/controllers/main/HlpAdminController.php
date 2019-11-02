<?php  
class HlpAdminController extends HlpMainController {
	/**
	* id пользователя
	*/
	protected $user_id;

	function __construct()
	{ 
		parent::__construct();
		
		$this->checkAuthorized();
	}

	/**
	* Проверяет авторизован пользователь или нет
	*
	*/
	private function checkAuthorized()
	{	
		$adminId = HlpAdmin::getId();

		if ($adminId) {
			$this->adminId = $adminId;
			HlpAdmin::setCookie($_COOKIE[HlpAdmin::getNameCook()]);//переустанавливаем
		} else {
			// перенаправляем
			header('Location: ' . HlpUrl::attach('/login'));
			exit;	
		}
	}

}//end class

?>






