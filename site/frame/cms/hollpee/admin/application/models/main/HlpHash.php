<?php  
class HlpHash {
	/**
	* Отдает новый hash
	*
	*/
	public static function getNew($part)
	{
		$part .= mt_rand(1, 9999999);
		$str = sha1(sha1('(&(*(*$%'.time().$part.'#%&*'));
			
		return $str;
	}

	/**
	* Hash  пароля
	* 
	* 
	*/
	public static function getPassword($password) {
		return md5(md5('&*^&%gdhjs8'.$password.'^B&^NIY76%&'));
	}


} // end class

?>

