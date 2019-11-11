<?php  
class HlpAdmin {
	/**
	* Отдает id админа
	*
	* @see 	AdminController::checkAuthorized()
	*/
	public static function getId()
	{
		$adminHash = $_COOKIE[self::getNameCook()];
		if (!$adminHash) return false;

		$params = array('hash' => $adminHash);
		return HlpDbAdmin::getInstance()->getId($params);
	}

	public static function getNameCook()
	{
		return 'admin_'.HLP_CMS_INDEX;
	}

	/**
	* Установить куку user
	*
	* @see 	AdminController::checkAuthorized()
	* @see 	LoginController::registerCheckAction()
	*/
	public static function setCookie($value)
	{
		$time = time()+3600*24*50;
		setcookie(self::getNameCook(), $value, $time, '/');
	}

	/**
	* Удалить куку user
	*
	* @return 	void
	*
	*/
	public static function deleteCookie()
	{
		setcookie(self::getNameCook(), '', time()-3600, '/');
	}

} // end class

?>
