<?php  
/**
* Работа с ссылкой
*
*
*/
class HlpUrl {
	/**
	* Формирует ссылку
	*
	*/
	public static function attach($link)
	{
		if (preg_match('/\.((css)|(js)|(png)|(jpeg)|(svg))$/', $link)) {
			$link .= '?hlp-index='.time();
		}

		$url = '/' . HLP_ADMIN_FOLDER . $link;
		$url = preg_replace('|[/]{2,}|', '/', $url);

		return $url;
	}

} // end class

?>
