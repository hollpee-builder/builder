<?php  

class Key {
	private static $idFrom = 1;
	private static $idTo = 10;

	private static function getIdFrom()
	{
		return self::$idFrom;
	}

	private static function getIdTo()
	{
		return self::$idTo;
	}

	private static function getKeyPath($id)
	{
		return $_SERVER['DOCUMENT_ROOT'] . '/site/key/'.$id.'.hlpkey';
	}

/**************************************************************************************/
	
	public static function getNewId()
	{
		$idFrom = self::getIdFrom();
		$idTo = self::getIdTo();
		return mt_rand($idFrom, $idTo);
	}


	public static function getNew()
	{

	}

	public static function get($id)
	{
		$keyPath = self::getKeyPath($id);
		if (!file_exists($keyPath)) return false;

		$key = file_get_contents($keyPath);

		return trim($key);
	}



} // end class

?>
