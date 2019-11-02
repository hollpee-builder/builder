<?php  
/**
* Работа с url
*
*
*
*
*
*/
class Url {
	/**
	* Сформировать корневую директорию
	*
	* @param 	string 	$path - путь от корня  
	* @return 	string 	возращает сформированный url
	*/
	public static function attachRoot($path)
	{
		return '/main'.$path;
	}

	public static function get($url)
	{
		$url .= preg_match('/\?[^\?]*$/', $url) ? '&' : '?';
		$url .= 'index=' . UPDATE_INDEX;
		
		return $url;
	}


}














